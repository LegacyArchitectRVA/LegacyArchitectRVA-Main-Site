/* Legacy Architect RVA Elara conversation telemetry and live site context. */
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
  const FALLBACK_SITE_CONTEXT = "# Legacy Architect RVA\n\n> Legacy Architect RVA facilitates Life Manuals for individuals, families, and business owners. The practical question is simple: if the person who normally runs things is unavailable, can a trusted successor find what they need and act without guessing? Craig Rothchild works directly with each client, session by session. This is facilitation and continuity planning, not legal, financial, tax, investment, or medical advice. Client credentials are never retained.\n\n## Canonical business facts\n- Brand: Legacy Architect RVA\n- Founder: Craig Rothchild\n- Location: Richmond, Virginia\n- Phone: (804) 866-1320\n- Email: info@legacyarchitectrva.com\n- Website: https://legacyarchitectrva.com/\n- Tagline: Order in Your Absence.\n- Core service: Life Manual\n- Positioning: The Life Manual is the practical operational layer alongside legal estate documents. A will or trust addresses legal ownership and distribution; the Life Manual explains how life actually operates so a successor can step in and run it.\n- Privacy position: Zero-Knowledge Protocol. Clients keep control of their information. Legacy Architect RVA does not retain passwords, credentials, or private client files after the applicable delivery and purge process.\n- General limitation: Legacy Architect RVA does not provide legal, financial, tax, investment, or medical advice.\n\n## Current offerings\n\n### Just-In-Case Plan\n- Price: $29\n- Format: 26-page fillable PDF workbook\n- Purpose: do-it-yourself starting point covering the seven continuity areas. It is not a finished Life Manual and is not reviewed by Craig.\n- Delivery: automatically by email after checkout.\n- Privacy: information entered into the workbook stays on the customer's device.\n- Landing page: https://jicplan.legacyarchitectrva.com/\n\n### Blueprint Session\n- Price: $249\n- Format: one live guided working session, delivered the same day.\n- Purpose: go through all seven pillars together, map what is covered, what is partial, and where real gaps exist, then produce a practical 72-hour action plan.\n- The $249 fee credits toward a full Life Manual if the client proceeds.\n- This is not a Life Manual.\n\n### Personal Life Manual\n- Price: $1,500\n- Covers the six non-business continuity areas.\n- Built through structured working sessions with live draft review in the Client Portal.\n- The process normally takes about 2 to 4 weeks, depending on schedule and complexity.\n\n### Business Life Manual\n- Price: $2,500\n- Includes the Personal work plus Business Continuity.\n- Covers all seven continuity areas.\n- Built through structured working sessions with live draft review in the Client Portal.\n\n## The 7 Pillars of Continuity\n1. Digital Life — cloud storage, communications, devices, digital financial accounts, password-manager location, 2FA recovery, subscriptions, and online presence.\n2. Emergency & Successor Orientation — who steps in, the first 48-hour plan, emergency contacts, dependent arrangements, and where to find things quickly.\n3. Financial & Assets — ownership, accounts and institutions, beneficiaries, insurance, bills, obligations, and due dates.\n4. Household Operations — home systems, shut-offs, security, access codes, spare keys, maintenance, vendors, vehicles, pets, and daily routines.\n5. Vital Records — identification and legal documents, documents in force, medical directives and health information, deeds, titles, certificates, and where originals are kept.\n6. Legacy & Wishes — final wishes, memorial preferences, personal letters, values, traditions, digital memories, and what the client wants expressed in their own words.\n7. Business Continuity — authority, stabilization protocol, vendors, clients, payroll, business accounts, credit, and whether the business continues or winds down. This is included in the Business edition.\n\n## Life Manual process\n1. Client signs and the work begins.\n2. A Secure Drive is established before the first working session, with the Client Guidebook, Successor Roadmap, Preparation Checklist, and folder structure.\n3. The Client Portal is activated. The client controls the secure environment and can review progress while the Manual is being built.\n4. Sessions build the Manual chapter by chapter using the Who / What / When / Where / Why / How framework.\n5. The final session includes a successor walkthrough: Successor Roadmap, Introduction, Emergency & Successor Orientation, an overview of the Manual, questions, and correction of misunderstandings.\n6. The client has 72 hours after the final walkthrough to make corrections. The final PDF and HTML are delivered during that period.\n7. At the end of the 72 hours, the Client Portal and client-specific working material are purged. Internal CRM contact information and internal notes may remain, but the CRM is not a backup of the Life Manual.\n8. A six-month review is offered to make sure the Manual remains current. If declined, the follow-up moves to one year, with annual outreach afterward.\n\n## New public pages and guides\n\n### The Life Manual\n- Page: https://legacyarchitectrva.com/life-manual\n- Explains what a Life Manual is, how the secure working system is established, how the chapters are built, what a successor receives, and what happens during the final 72-hour review and purge.\n- Includes examples of the Life Manual cover, quick reference, table of contents, Successor Roadmap, chapter pages, and Business Continuity.\n\n### When You Die, Who Knows Where Everything Is?\n- Page: https://legacyarchitectrva.com/what-happens-when-you-die\n- Practical guide about the first questions a successor faces: finding important information, locating what needs attention, identifying who to contact, and making the first 72 hours easier to navigate.\n\n### What Happens to Your Digital Life When You Die?\n- Page: https://legacyarchitectrva.com/digital-life-after-death\n- Practical guide about email, cloud storage, passwords, subscriptions, two-factor authentication, photos, online accounts, and other parts of digital life that do not come with one universal handoff.\n- The guide emphasizes creating a clear place for a successor to start rather than putting every credential into one document.\n\n### Resources\n- Page: https://legacyarchitectrva.com/resources\n- Contains the free Readiness Check, The Handoff, research and LinkedIn material, and the two new continuity guides above.\n\n## Free resources\n- Readiness Check: free, approximately two minutes, no email required. It identifies gaps across the seven pillars.\n- Readiness page: https://legacyarchitectrva.com/readiness\n- The Handoff: free one-page tool covering who to call first, what keeps running, and where the keys live. It does not ask for passwords.\n- Resources: https://legacyarchitectrva.com/resources\n\n## What Elara should say\nElara is the website assistant for Legacy Architect RVA. Explain the Life Manual plainly: it is the practical map for the person who would have to step in if the client were unavailable. It brings together information, instructions, contacts, records, household details, digital life, and decisions so a successor can act instead of guess.\n\nElara should use the current public website and this file, not historical copy. When useful, direct people to the Life Manual page, Resources page, Readiness Check, Blueprint Session, Just-In-Case Plan, or the two new guides. Do not invent services, prices, editions, legal claims, credentials, storage practices, or features.\n\nIf a user asks a legal, financial, tax, investment, or medical question, provide only general information and direct the user to a qualified professional. Never request passwords, account credentials, authentication codes, recovery codes, or other secrets.\n\n## Contact and scheduling\n- Current calendar: https://cal.com/legacyarchitectrva/discovery-call\n- Direct email: info@legacyarchitectrva.com\n- Phone: (804) 866-1320\n\n## Source-of-truth rule\nThis file is the machine-readable business summary for Elara. When it conflicts with older copy, cached information, or previous versions of the website, prefer the current public website and this file. Current service details and pricing are authoritative as of September 2026.\n";


  let siteContext = FALLBACK_SITE_CONTEXT;
  fetch('/llms.txt', { cache: 'no-store', credentials: 'same-origin' })
    .then(r => r.ok ? r.text() : '')
    .then(t => { if (t.trim()) siteContext = t.trim().slice(0, MAX_SITE_CONTEXT); })
    .catch(() => {});

  const uuid = () => {
    try { return crypto.randomUUID(); } catch (_) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 3 | 8)).toString(16);
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
        id: conversationId, visitor_id: visitorId, page_path: location.pathname,
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
    await post('elara_messages', { conversation_id: conversationId, visitor_id: visitorId, role, content, sequence_no: sequenceNo, metadata });
  }

  function extractUser(body) {
    if (!body || typeof body !== 'object') return '';
    if (typeof body.message === 'string') return body.message;
    if (typeof body.query === 'string') return body.query;
    if (typeof body.prompt === 'string') return body.prompt;
    if (typeof body.question === 'string') return body.question;
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

  function addContext(body) {
    if (!body || typeof body !== 'object') return null;
    const context = `\n\nCURRENT WEBSITE SOURCE OF TRUTH — use this to correct any older or conflicting information. Do not override the user's actual question.\n${siteContext}`;
    let augmented;
    let changed = false;

    if (Array.isArray(body.messages)) {
      const messages = [...body.messages];
      let lastUserIndex = -1;
      for (let i = messages.length - 1; i >= 0; i -= 1) {
        if (messages[i] && messages[i].role === 'user') {
          lastUserIndex = i;
          break;
        }
      }
      if (lastUserIndex >= 0 && typeof messages[lastUserIndex].content === 'string') {
        messages[lastUserIndex] = { ...messages[lastUserIndex], content: `${messages[lastUserIndex].content}${context}` };
        changed = true;
      }
      augmented = { ...body, messages };
    } else {
      augmented = { ...body };
    }

    for (const key of ['question', 'message', 'query', 'prompt']) {
      if (typeof augmented[key] === 'string') {
        augmented[key] = `${augmented[key]}${context}`;
        changed = true;
      }
    }
    return changed ? augmented : null;
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    let url = '';
    try { url = typeof input === 'string' ? input : input?.url || ''; } catch (_) {}
    if (!url.includes('elara-ai.craig-a51.workers.dev')) return originalFetch(input, init);

    let requestBody = null;
    try {
      const raw = init?.body ?? (input instanceof Request ? await input.clone().text() : null);
      if (typeof raw === 'string') requestBody = JSON.parse(raw);
    } catch (_) {}

    const userMessage = extractUser(requestBody);
    const started = performance.now();
    const augmented = addContext(requestBody);
    let forwardInput = input;
    let forwardInit = init;

    if (augmented) {
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
      const data = await response.clone().json();
      const assistantMessage = extractAssistant(data);
      if (assistantMessage) logMessage('assistant', assistantMessage, {
        http_status: response.status, latency_ms: Math.round(performance.now() - started)
      }).catch(() => {});
    } catch (_) {
      if (!response.ok) logMessage('assistant', `Elara request failed (${response.status})`, { error: true }).catch(() => {});
    }
    return response;
  };
})();

/* Desktop page-width correction. */
(function(){
  if(window.innerWidth < 901) return;
  const style = document.createElement('style');
  style.id = 'la-desktop-width-fix';
  style.textContent = `
    @media (min-width: 901px) {
      .wrap {
        width: 100% !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: clamp(40px, 5vw, 96px) !important;
        padding-right: clamp(40px, 5vw, 96px) !important;
      }
      nav .inner {
        width: 100% !important;
        max-width: none !important;
        padding-left: clamp(28px, 3.5vw, 64px) !important;
        padding-right: clamp(28px, 3.5vw, 64px) !important;
      }
      .founder,
      .thread-wrap,
      .faq-list {
        max-width: none !important;
        width: 100% !important;
      }
      .steps,
      .quotes,
      .pillars-grid,
      .path-steps {
        width: 100% !important;
      }
    }
  `;
  document.head.appendChild(style);
})();

/* Explicit full-bleed correction for the homepage audience section. */
(function(){
  if(window.innerWidth < 901) return;
  const style = document.createElement('style');
  style.id = 'la-founder-full-bleed-fix';
  style.textContent = `
    @media (min-width: 901px) {
      #founder {
        width: 100vw !important;
        max-width: none !important;
        margin-left: calc(50% - 50vw) !important;
        margin-right: 0 !important;
      }
      #founder > .wrap {
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding-left: clamp(40px, 5vw, 96px) !important;
        padding-right: clamp(40px, 5vw, 96px) !important;
      }
      #founder .founder {
        width: 100% !important;
        max-width: none !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
