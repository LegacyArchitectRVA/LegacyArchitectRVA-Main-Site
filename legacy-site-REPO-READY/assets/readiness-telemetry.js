/* Legacy Architect RVA Readiness Check telemetry.
 * Anonymous by design: no IPs, no raw email, no free-text answers.
 * Public clients have INSERT-only access through Supabase RLS.
 */
(() => {
  'use strict';

  const SUPABASE_URL = 'https://xeqmivqvtumsifwkxpcm.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_p5bAJcHiUDOGMRdTMY_9pA_WbwZJhXf';
  const API = `${SUPABASE_URL}/rest/v1`;
  const SESSION_KEY = 'la_readiness_session_v1';
  const VISITOR_KEY = 'la_readiness_visitor_v1';
  const MAX_BATCH = 12;

  const uuid = () => {
    try { return crypto.randomUUID(); } catch (_) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };
  const safeGet = (storage, key) => { try { return storage.getItem(key); } catch (_) { return null; } };
  const safeSet = (storage, key, value) => { try { storage.setItem(key, value); } catch (_) {} };

  let visitorId = safeGet(localStorage, VISITOR_KEY);
  if (!visitorId) { visitorId = uuid(); safeSet(localStorage, VISITOR_KEY, visitorId); }
  let sessionId = safeGet(sessionStorage, SESSION_KEY);
  let createdSession = false;
  if (!sessionId) { sessionId = uuid(); safeSet(sessionStorage, SESSION_KEY, sessionId); createdSession = true; }

  const queue = [];
  let flushing = false;
  let currentSection = null;
  let sectionStarted = Date.now();
  let lastActivity = Date.now();
  let completed = false;
  let resultViewed = false;
  let emailFocused = false;
  let answerCount = 0;

  const clamp = (value, max) => String(value ?? '').trim().slice(0, max);
  const normalize = value => clamp(value, 200).replace(/\s+/g, ' ');

  function sectionFor(el) {
    if (!el) return 'unknown';
    const owner = el.closest('[data-section],[data-step],[data-page],fieldset,section,article,[role="group"]');
    if (!owner) return 'unknown';
    const raw = owner.getAttribute('data-section') || owner.getAttribute('data-step') || owner.getAttribute('data-page') || owner.id;
    if (raw) return normalize(raw).toLowerCase();
    const heading = owner.querySelector('h2,h3,h4,legend');
    return heading ? normalize(heading.textContent).toLowerCase() : 'section';
  }

  const headers = () => ({ apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' });

  async function post(path, body, keepalive = false) {
    try {
      const response = await fetch(`${API}/${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body), keepalive });
      if (!response.ok) throw new Error(`telemetry-http-${response.status}`);
      return true;
    } catch (error) {
      if (path === 'readiness_events') console.warn('[readiness telemetry]', error.message);
      return false;
    }
  }

  async function flush(force = false) {
    if (flushing || !queue.length || (!force && queue.length < MAX_BATCH)) return;
    flushing = true;
    const batch = queue.splice(0, MAX_BATCH);
    const ok = await post('readiness_events', batch, true);
    if (!ok) queue.unshift(...batch);
    flushing = false;
  }

  function event(name, extra = {}) {
    lastActivity = Date.now();
    queue.push({
      id: uuid(), session_id: sessionId, visitor_id: visitorId, event_name: name,
      section_key: extra.section_key ? normalize(extra.section_key) : currentSection,
      duration_ms: Number.isFinite(extra.duration_ms) ? Math.round(extra.duration_ms) : null,
      value_code: extra.value_code ? normalize(extra.value_code) : null,
      metadata: extra.metadata && typeof extra.metadata === 'object' ? extra.metadata : {}
    });
    if (queue.length >= MAX_BATCH) flush(true);
  }

  function sessionPayload() {
    const url = new URL(location.href);
    const source = url.searchParams.get('utm_source') || url.searchParams.get('utm_medium') ||
      (document.referrer ? (() => { try { return new URL(document.referrer).hostname; } catch (_) { return 'referral'; } })() : 'direct');
    let referrerHost = null;
    try { referrerHost = document.referrer ? new URL(document.referrer).hostname : null; } catch (_) {}
    return {
      id: sessionId, visitor_id: visitorId, landing_path: clamp(location.pathname, 500),
      source: clamp(source, 200), referrer_host: clamp(referrerHost, 255) || null,
      user_agent_family: clamp((navigator.userAgent || '').replace(/\([^)]*\)/g, '').split(' ')[0], 120),
      viewport: `${Math.round(innerWidth)}x${Math.round(innerHeight)}`,
      metadata: {
        utm_source: clamp(url.searchParams.get('utm_source'), 100) || null,
        utm_medium: clamp(url.searchParams.get('utm_medium'), 100) || null,
        utm_campaign: clamp(url.searchParams.get('utm_campaign'), 150) || null
      }
    };
  }

  async function start() {
    if (createdSession) {
      await post('readiness_sessions', sessionPayload());
      event('session_start', { metadata: { new_session: true } });
    } else {
      event('return_visit', { metadata: { session_reused: true } });
    }
    flush(true);
  }

  function switchSection(next, source = 'observer') {
    next = next || 'unknown';
    if (next === currentSection) return;
    const now = Date.now();
    if (currentSection) event('section_leave', { section_key: currentSection, duration_ms: now - sectionStarted, metadata: { source } });
    currentSection = next; sectionStarted = now;
    event('section_view', { section_key: currentSection, metadata: { source } });
  }

  function isMoreInfo(el) {
    const text = normalize(el?.textContent || el?.getAttribute?.('aria-label') || '').toLowerCase();
    return /more info|learn more|why|help|details|explain|what does|how does|tell me/.test(text);
  }

  function controlCode(el) {
    const name = normalize(el.name || el.id || el.getAttribute('aria-label') || el.tagName).toLowerCase();
    if (el.type === 'radio' || el.type === 'checkbox') {
      const group = Array.from(document.querySelectorAll('input')).filter(x => x.name === el.name);
      return `${name}#${Math.max(0, group.indexOf(el)) + 1}`;
    }
    if (el.tagName === 'SELECT') return `${name}#${Math.max(0, el.selectedIndex) + 1}`;
    return name;
  }

  function markEmail() {
    if (!emailFocused) { emailFocused = true; event('email_focus'); }
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('button,a,[role="button"]');
    if (!el) return;
    if (isMoreInfo(el)) event('info_request', { metadata: { control: normalize(el.textContent || el.getAttribute('aria-label')) } });
    else event('cta_click', { value_code: `control:${normalize(el.textContent || el.getAttribute('aria-label')).toLowerCase()}` });
  }, true);

  document.addEventListener('change', e => {
    const el = e.target;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) return;
    if (el.type === 'email') return;
    if (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') {
      answerCount += 1;
      event('answer', { section_key: sectionFor(el), value_code: controlCode(el), metadata: { control: el.tagName.toLowerCase() } });
    }
  }, true);

  document.addEventListener('focusin', e => {
    if (e.target.matches?.('input[type="email"],input[name*="email" i]')) markEmail();
  }, true);
  document.addEventListener('input', e => {
    if (e.target.matches?.('input[type="email"],input[name*="email" i]')) markEmail();
  }, true);
  document.addEventListener('submit', e => {
    const email = e.target.querySelector?.('input[type="email"],input[name*="email" i]');
    if (email && String(email.value || '').trim()) event('email_provided', { metadata: { method: 'form_submit' } });
  }, true);

  window.addEventListener('popstate', () => event('back_navigation'));
  window.addEventListener('hashchange', () => event('forward_navigation'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(x => x.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) switchSection(sectionFor(visible.target));
    }, { threshold: [0.35, 0.6, 0.85] });
    document.querySelectorAll('section,fieldset,[data-section],[data-step]').forEach(el => observer.observe(el));
  }

  function inspectCompletion() {
    const text = document.body.innerText.toLowerCase();
    const result = /your results|your score|readiness score|preparedness score|results are ready/.test(text);
    if (result && !resultViewed) { resultViewed = true; event('result_view'); }
    if (!completed && result && answerCount > 0) { completed = true; event('completion', { metadata: { answer_count: answerCount } }); }
  }
  const mutationObserver = new MutationObserver(inspectCompletion);
  mutationObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

  setInterval(() => {
    if (Date.now() - lastActivity > 45000 && !completed) event('heartbeat', { metadata: { inactive_ms: Date.now() - lastActivity } });
    inspectCompletion(); flush(false);
  }, 3000);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (currentSection) event('section_leave', { section_key: currentSection, duration_ms: Date.now() - sectionStarted, metadata: { source: 'visibility' } });
      flush(true);
    }
  });
  window.addEventListener('pagehide', () => flush(true));
  window.addEventListener('error', e => event('error', { metadata: { message: normalize(e.message || 'client-error'), source: normalize(e.filename || '') } }));
  window.addEventListener('unhandledrejection', () => event('error', { metadata: { message: 'unhandled-promise-rejection' } }));

  start();
})();
