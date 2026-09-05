/* Legacy Architect RVA Elara conversation telemetry and live site context.
 * Captures only Elara user/assistant text and anonymous session metadata.
 * No IPs, email addresses, credentials, or browser fingerprints are stored.
 * The Elara request is augmented with the site's current llms.txt source of truth
 * so the assistant is not dependent on an old hard-coded business prompt.
 */
(() => {
  'use strict';

  const SUPABASE_URL = 'https://xeqmivqvtumsifwkxpcm.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_p5bAJcHiUDOGMRdTMY_9pA_WbwZJhXf';
  const API = `${SUPABASE_URL}/rest/v1`;
  const VISITOR_KEY = 'la_readiness_visitor_v1';
  const CONVERSATION_KEY = 'la_elara_conversation_v1';
  const SEQUENCE_KEY = 'la_elara_sequence_v1';
  const MAX_CONTENT = 12000;
  const MAX_SITE_CONTEXT = 14000;
  const FALLBACK_SITE_CONTEXT = `CURRENT LEGACY ARCHITECT RVA WEBSITE FACTS — AUTHORITATIVE
Brand: Legacy Architect RVA. Founder: Craig Rothchild. Richmond, Virginia. Phone: (804) 866-1320. Email: info@legacyarchitectrva.com. Tagline: Order in Your Absence.
Core service: Life Manual. It is the practical operational layer alongside legal estate documents. A will or trust addresses legal ownership/distribution; the Life Manual explains how life actually operates so a successor can step in and run it. This is facilitation and continuity planning, not legal, financial, tax, investment, or medical advice.
Current offerings: Just-In-Case Plan $29, a 26-page fillable PDF workbook delivered automatically by email after checkout; it is DIY, not a finished Life Manual, and answers stay on the customer's device. Blueprint Session $249, one live working session that maps where the client stands and produces a practical 72-hour plan; the $249 credits toward a full Life Manual if the client proceeds; it is NOT a Life Manual. Personal Life Manual $1,500, covering 7 of 8 chapters: Introduction, Digital Life, Emergency & Successor Access, Financial & Assets, Household Operations, Vital Records, Legacy & Wishes. Business Life Manual $2,500, everything in Personal plus Business Continuity, covering all 8 chapters.
The 7 Pillars of Continuity, current website order: Digital Life; Emergency & Successor Access; Financial & Assets; Household Operations; Vital Records; Legacy & Wishes; Business Continuity. Do NOT substitute the older pillar list.
Privacy: clients control their information; Legacy Architect RVA does not retain passwords, credentials, or private client files after the applicable delivery/purge process. Never ask users for passwords, authentication codes, or other secrets.
Free resources: Readiness Check is free, approximately two minutes, no email required. The Handoff is a free one-page tool covering who to call first, what keeps running, and where the keys live.
Scheduling: https://cal.com/legacyarchitectrva/discovery-call. Do not use the obsolete private-conversation calendar URL.
JIC landing page: https://jicplan.legacyarchitectrva.com/. Current Stripe payment link: https://buy.stripe.com/aFafZhavZcCIe7qbI96Zy01.`;

  let siteContext = FALLBACK_SITE_CONTEXT;
  fetch('/llms.txt', { cache: 'no-store', credentials: 'same-origin' })
    .then(response => response.ok ? response.text() : '')
    .then(text => { if (text && text.trim()) siteContext = text.trim().slice(0, MAX_SITE_CONTEXT); })
    .catch(() => {});

  const uuid = () => {
    try { return crypto.randomUUID(); } catch (_) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  };
  const get = (storage, key) => { try { return storage.getItem(key); } catch (_) { return null; } };
  const set = (storage, key, value) => { try { storage.setItem(key, value); } catch (_) {} };
  const visitorId = get(localStorage, VISITOR_KEY) || uuid();
  set(localStorage, VISITOR_KEY, visitorId);
  let conversationId = get(sessionStorage, CONVERSATION_KEY);
  if (!conversationId) { conversationId = uuid(); set(sessionStorage, CONVERSATION_KEY, conversationId); }

  const headers = () => ({ apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' });
  const clean = value => String(value ?? '').trim().slice(0, MAX_CONTENT);

  async function post(path, body) {
    try {
      const r = await fetch(`${API}/${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body), keepalive: true });
      if (!r.ok) throw new Error(`elara-telemetry-http-${r.status}`);
      return true;
    } catch (e) {
      console.warn('[elara telemetry]', e.message);
      return false;
    }
  }

  let conversationReady = false;
  let conversationPromise = null;
  async function ensureConversation() {
    if (conversationReady) return true;
    if (!conversationPromise) {
      conversationPromise = post('elara_conversations', {
        id: conversationId,
        visitor_id: visitorId,
        page_path: location.pathname,
        metadata: { title: clean(document.title).slice(0, 200) }
      }).then(ok => { conversationReady = ok; return ok; });
    }
    return conversationPromise;
  }

  function nextSequence() {
    const next = Math.max(0, Number(get(sessionStorage, SEQUENCE_KEY) || '0')) + 1;
    set(sessionStorage, SEQUENCE_KEY, String(next));
    return next;
  }

  async function logMessage(role, content, metadata = {}) {
    content = clean(content);
    if (!content) return;
    const sequenceNo = nextSequence();
    if (!(await ensureConversation())) return;
    await post('elara_messages', {
      conversation_id: conversationId,
      visitor_id: visitorId,
      role,
      content,
      sequence_no: sequenceNo,
      metadata
    });
  }

  function extractUser(body) {
    if (!body || typeof body !== 'object') return '';
    if (typeof body.message === 'string') return body.message;
    if (typeof body.query === 'string') return body.query;
    if (typeof body.prompt === 'string') return body.prompt;
    if (Array.isArray(body.messages)) {
      const user = [...body.messages].reverse().find(m => m && m.role === 'user');
      return typeof user?.content === 'string' ? user.content : '';
    }
    return '';
  }

  function extractAssistant(body) {
    if (!body || typeof body !== 'object') return '';
    if (typeof body.response === 'string') return body.response;
    if (typeof body.answer === 'string') return body.answer;
    if (typeof body.content === 'string') return body.content;
    if (typeof body.message === 'string') return body.message;
    if (body.message && typeof body.message.content === 'string') return body.message.content;
    if (Array.isArray(body.choices)) {
      const choice = body.choices[0];
      if (typeof choice?.message?.content === 'string') return choice.message.content;
      if (typeof choice?.text === 'string') return choice.text;
    }
    return '';
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    let url = '';
    try { url = typeof input === 'string' ? input : input?.url || ''; } catch (_) {}
    const isElara = url.includes('elara-ai.craig-a51.workers.dev');
    if (!isElara) return originalFetch(input, init);

    let requestBody = null;
    try {
      const raw = init?.body ?? (input instanceof Request ? await input.clone().text() : null);
      if (typeof raw === 'string') requestBody = JSON.parse(raw);
    } catch (_) {}

    const userMessage = extractUser(requestBody);
    const started = performance.now();

    let forwardInput = input;
    let forwardInit = init;
    if (requestBody && typeof requestBody === 'object' && typeof requestBody.question === 'string') {
      const augmented = {
        ...requestBody,
        question: `${requestBody.question}\n\nCURRENT WEBSITE SOURCE OF TRUTH — use this to correct any older or conflicting information:\n${siteContext}`
      };
      const body = JSON.stringify(augmented);
      if (typeof input === 'string' || input instanceof URL) {
        forwardInit = { ...(init || {}), body };
      } else if (input instanceof Request) {
        forwardInput = new Request(input, { body });
        forwardInit = undefined;
      }
    }

    const response = await originalFetch(forwardInput, forwardInit);

    if (userMessage) logMessage('user', userMessage, { path: location.pathname }).catch(() => {});

    try {
      const clone = response.clone();
      const data = await clone.json();
      const assistantMessage = extractAssistant(data);
      if (assistantMessage) logMessage('assistant', assistantMessage, {
        http_status: response.status,
        latency_ms: Math.round(performance.now() - started)
      }).catch(() => {});
    } catch (_) {
      if (!response.ok) logMessage('assistant', `Elara request failed (${response.status})`, { error: true }).catch(() => {});
    }
    return response;
  };
})();
