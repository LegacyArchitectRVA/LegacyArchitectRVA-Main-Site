/* Legacy Architect RVA Elara conversation telemetry.
 * Captures only Elara user/assistant text and anonymous session metadata.
 * No IPs, email addresses, credentials, or browser fingerprints are stored.
 */
(() => {
  'use strict';

  const SUPABASE_URL = 'https://xeqmivqvtumsifwkxpcm.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_p5bAJcHiUDOGMRdTMY_9pA_WbwZJhXf';
  const API = `${SUPABASE_URL}/rest/v1`;
  const VISITOR_KEY = 'la_readiness_visitor_v1';
  const CONVERSATION_KEY = 'la_elara_conversation_v1';
  const MAX_CONTENT = 12000;

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
  let sequence = 0;

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
  async function ensureConversation() {
    if (conversationReady) return true;
    const ok = await post('elara_conversations', {
      id: conversationId,
      visitor_id: visitorId,
      page_path: location.pathname,
      metadata: { title: clean(document.title).slice(0, 200) }
    });
    conversationReady = ok;
    return ok;
  }

  async function logMessage(role, content, metadata = {}) {
    content = clean(content);
    if (!content) return;
    if (!(await ensureConversation())) return;
    sequence += 1;
    await post('elara_messages', {
      conversation_id: conversationId,
      visitor_id: visitorId,
      role,
      content,
      sequence_no: sequence,
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
    const response = await originalFetch(input, init);

    if (userMessage) {
      logMessage('user', userMessage, { path: location.pathname }).catch(() => {});
    }

    try {
      const clone = response.clone();
      const data = await clone.json();
      const assistantMessage = extractAssistant(data);
      if (assistantMessage) {
        logMessage('assistant', assistantMessage, {
          http_status: response.status,
          latency_ms: Math.round(performance.now() - started)
        }).catch(() => {});
      }
    } catch (_) {
      if (!response.ok) logMessage('assistant', `Elara request failed (${response.status})`, { error: true }).catch(() => {});
    }
    return response;
  };
})();
