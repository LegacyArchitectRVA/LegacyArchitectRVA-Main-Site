(function(){
  var HS_PORTAL_ID = "244990054";
  var HS_FORM_ID = "ddf7849b-620d-4e85-ab3d-9c82512c6302";
  var HS_REGION = "na2";
  var hsScriptLoaded = false;
  var hsFormRendered = false;

  var style = document.createElement('style');
  style.textContent = ""
    + "#handoff-gate-overlay{position:fixed;inset:0;z-index:2147483200;background:rgba(9,7,5,.82);"
    + "-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);display:flex;align-items:center;"
    + "justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity .28s ease}"
    + "#handoff-gate-overlay.on{opacity:1;pointer-events:auto}"
    + "#handoff-gate-panel{background:#15110b;border:1px solid rgba(212,182,97,.3);border-radius:8px;"
    + "max-width:440px;width:100%;max-height:min(90vh,760px);overflow-y:auto;padding:32px 28px 26px;"
    + "position:relative;transform:translateY(14px) scale(.97);transition:transform .28s ease;"
    + "box-shadow:0 26px 64px rgba(0,0,0,.66)}"
    + "#handoff-gate-overlay.on #handoff-gate-panel{transform:none}"
    + "#handoff-gate-close{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;"
    + "background:rgba(212,182,97,.1);border:1px solid rgba(212,182,97,.35);color:#e8c869;cursor:pointer;"
    + "display:flex;align-items:center;justify-content:center;font-size:18px;line-height:1;transition:background .2s}"
    + "#handoff-gate-close:hover{background:rgba(212,182,97,.22)}"
    + "#handoff-gate-eyebrow{font-family:'Inter',sans-serif;font-size:11px;letter-spacing:.24em;"
    + "text-transform:uppercase;color:#d4b661;margin-bottom:10px}"
    + "#handoff-gate-panel h3{font-family:'Crimson Pro',Georgia,serif;font-weight:700;font-size:1.65rem;"
    + "color:#f2ede2;margin:0 0 12px;line-height:1.15}"
    + "#handoff-gate-panel p.hg-sub{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.05rem;"
    + "color:#a8a08f;line-height:1.55;margin:0 0 22px}"
    + "#handoff-hs-form-wrap iframe.hs-form-iframe{border-radius:5px;overflow:hidden}"
    + "#handoff-gate-note{font-family:'Inter',sans-serif;font-size:11px;color:#8d8676;line-height:1.6;"
    + "margin-top:16px}"
    + "#handoff-hs-form-loading{font-family:'Inter',sans-serif;font-size:13px;color:#a8a08f}"
    + "#handoff-fallback{display:none;font-family:'Inter',sans-serif;font-size:13px;color:#a8a08f;"
    + "line-height:1.6;margin-top:6px}"
    + "#handoff-fallback.show{display:block}"
    + "#handoff-fallback a{color:#e8c869;text-decoration:underline}"
    + "@media(max-width:480px){#handoff-gate-panel{padding:26px 20px 22px}}";
  document.head.appendChild(style);
  /* HubSpot renders the form inside a cross-origin iframe, so CSS from this page
     can't reach the actual input fields or the submit button. To match the gold
     brand look, set the colors directly in the form's own Style tab in HubSpot,
     not here. */

  var overlay = document.createElement('div');
  overlay.id = 'handoff-gate-overlay';
  overlay.innerHTML =
    '<div id="handoff-gate-panel" role="dialog" aria-modal="true" aria-labelledby="handoff-gate-title">'
    + '<button id="handoff-gate-close" aria-label="Close">&times;</button>'
    + '<div id="handoff-gate-eyebrow">Free &middot; One Page</div>'
    + '<h3 id="handoff-gate-title">Get The Handoff</h3>'
    + '<p class="hg-sub">Who to call first, what keeps running, where the keys live. Enter your email and it\'s yours.</p>'
    + '<div id="handoff-hs-form-wrap"><div id="handoff-hs-form-loading">Loading form&hellip;</div></div>'
    + '<div id="handoff-fallback">Form not loading? Some browsers and ad blockers hold it back. '
    + '<a href="/assets/The-Handoff.pdf" target="_blank" rel="noopener">Get the file directly instead</a>.</div>'
    + '<div id="handoff-gate-note">No passwords go on it, and nothing you send here gets sold or shared.</div>'
    + '</div>';
  document.body.appendChild(overlay);

  function closeGate(){
    overlay.classList.remove('on');
    document.body.style.overflow = '';
  }

  var fallbackTimer = null;

  function showFallback(){
    var fb = document.getElementById('handoff-fallback');
    if (fb) fb.classList.add('show');
  }

  function renderForm(){
    if (hsFormRendered) return;
    hsFormRendered = true;
    hbspt.forms.create({
      portalId: HS_PORTAL_ID,
      formId: HS_FORM_ID,
      region: HS_REGION,
      target: '#handoff-hs-form-wrap',
      onFormReady: function(){
        clearTimeout(fallbackTimer);
        var loading = document.getElementById('handoff-hs-form-loading');
        if (loading) loading.remove();
      },
      onFormSubmitted: function(){
        if (typeof gtag === 'function') {
          gtag('event', 'handoff_download', {link_text: 'The Handoff form submit', page_path: location.pathname});
        }
      }
    });
  }

  function loadHsScriptThenRender(){
    fallbackTimer = setTimeout(showFallback, 5000);
    if (hsScriptLoaded) { renderForm(); return; }
    hsScriptLoaded = true;
    var s = document.createElement('script');
    s.src = '//js-na2.hsforms.net/forms/embed/v2.js';
    s.charset = 'utf-8';
    s.onload = renderForm;
    s.onerror = showFallback;
    document.body.appendChild(s);
  }

  window.openHandoffGate = function(e){
    if (e && e.preventDefault) e.preventDefault();
    overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
    loadHsScriptThenRender();
  };

  overlay.addEventListener('click', function(e){
    if (e.target === overlay) closeGate();
  });
  document.getElementById('handoff-gate-close').addEventListener('click', closeGate);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && overlay.classList.contains('on')) closeGate();
  });

  if (location.hash === '#handoff') {
    window.openHandoffGate();
  }
})();
