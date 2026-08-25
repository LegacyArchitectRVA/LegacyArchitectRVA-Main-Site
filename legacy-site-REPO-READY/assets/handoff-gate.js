(function(){
  var HS_PORTAL_ID = "244990054";
  var HS_FORM_ID = "ddf7849b-620d-4e85-ab3d-9c82512c6302";
  var SUBMIT_URL = "https://api.hsforms.com/submissions/v3/integration/submit/" + HS_PORTAL_ID + "/" + HS_FORM_ID;
  var FALLBACK_PDF_URL = "https://downloads.legacyarchitectrva.com/The-Handoff-2.pdf";

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
    + "#handoff-form label{font-family:'Inter',sans-serif;font-size:11.5px;letter-spacing:.1em;"
    + "text-transform:uppercase;color:#a8a08f;margin-bottom:6px;display:block}"
    + "#handoff-form .hg-field{margin-bottom:16px}"
    + "#handoff-consent{display:flex;align-items:flex-start;gap:10px;margin:2px 0 18px}"
    + "#handoff-consent input{margin-top:3px;flex-shrink:0;width:16px;height:16px;accent-color:#d4b661}"
    + "#handoff-consent label{font-family:'Inter',sans-serif;font-size:12px;color:#a8a08f;line-height:1.5;"
    + "text-transform:none;letter-spacing:normal;margin:0}"
    + "#handoff-form input[type=text],#handoff-form input[type=email]{width:100%;font-family:'Inter',sans-serif;"
    + "font-size:15.5px;background:#1c1710;border:1px solid rgba(212,182,97,.22);border-radius:3px;"
    + "color:#f2ede2;padding:12px;min-height:46px;box-sizing:border-box}"
    + "#handoff-form input:focus{outline:none;border-color:rgba(212,182,97,.6)}"
    + "#handoff-form input::placeholder{color:#5c564a}"
    + "#handoff-submit-btn{width:100%;display:inline-flex;align-items:center;justify-content:center;"
    + "font-family:'Cardo',Georgia,serif;font-weight:700;letter-spacing:.04em;font-size:15px;"
    + "text-transform:uppercase;min-height:48px;padding:10px 26px;border:none;border-radius:3px;"
    + "cursor:pointer;color:#191307;"
    + "background:linear-gradient(103deg,#6f5620 0%,#ac8a32 14%,#d0a945 30%,#fff3c6 46%,#fffbe6 50%,"
    + "#e8c869 56%,#c9a340 72%,#96762a 88%,#6b521d 100%);transition:filter .25s,transform .2s;margin-top:2px}"
    + "#handoff-submit-btn:hover{filter:brightness(1.08);transform:translateY(-1px)}"
    + "#handoff-submit-btn:disabled{opacity:.6;cursor:default;transform:none}"
    + "#handoff-open-btn{width:100%;display:inline-flex;align-items:center;justify-content:center;"
    + "font-family:'Cardo',Georgia,serif;font-weight:700;letter-spacing:.04em;font-size:15px;"
    + "text-transform:uppercase;min-height:48px;padding:10px 26px;border:none;border-radius:3px;"
    + "cursor:pointer;color:#191307;text-decoration:none;"
    + "background:linear-gradient(103deg,#6f5620 0%,#ac8a32 14%,#d0a945 30%,#fff3c6 46%,#fffbe6 50%,"
    + "#e8c869 56%,#c9a340 72%,#96762a 88%,#6b521d 100%)}"
    + "#handoff-success{display:none}"
    + "#handoff-success.show{display:block}"
    + "#handoff-success p{font-family:'Cormorant Garamond',Georgia,serif;font-size:1.05rem;color:#a8a08f;"
    + "line-height:1.55;margin:0 0 18px}"
    + "#handoff-error{display:none;font-family:'Inter',sans-serif;font-size:12.5px;color:#c98f3f;"
    + "line-height:1.6;margin:-4px 0 14px}"
    + "#handoff-error.show{display:block}"
    + "#handoff-gate-note{font-family:'Inter',sans-serif;font-size:11px;color:#8d8676;line-height:1.6;"
    + "margin-top:16px}"
    + "#handoff-hp-wrap{position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden}"
    + "@media(max-width:480px){#handoff-gate-panel{padding:26px 20px 22px}}";
  document.head.appendChild(style);

  var overlay = document.createElement('div');
  overlay.id = 'handoff-gate-overlay';
  overlay.innerHTML =
    '<div id="handoff-gate-panel" role="dialog" aria-modal="true" aria-labelledby="handoff-gate-title">'
    + '<button id="handoff-gate-close" aria-label="Close">&times;</button>'
    + '<div id="handoff-gate-eyebrow">Free &middot; One Page</div>'
    + '<h3 id="handoff-gate-title">Get The Handoff</h3>'
    + '<p class="hg-sub">Who to call first, what keeps running, where the keys live. Enter your email and it\'s yours.</p>'
    + '<div id="handoff-hp-wrap" aria-hidden="true">'
    +   '<label for="handoff-hp">Leave this field blank</label>'
    +   '<input type="text" id="handoff-hp" name="website" tabindex="-1" autocomplete="off"></div>'
    + '<form id="handoff-form" novalidate>'
    +   '<div class="hg-field"><label for="handoff-email">Email</label>'
    +   '<input type="email" id="handoff-email" name="email" required placeholder="you@email.com"></div>'
    +   '<div class="hg-field"><label for="handoff-firstname">First name</label>'
    +   '<input type="text" id="handoff-firstname" name="firstname" placeholder="First name"></div>'
    +   '<div class="hg-field"><label for="handoff-lastname">Last name</label>'
    +   '<input type="text" id="handoff-lastname" name="lastname" placeholder="Last name"></div>'
    +   '<div id="handoff-consent"><input type="checkbox" id="handoff-consent-check" required>'
    +   '<label for="handoff-consent-check">It\'s okay to email me this and store my info so Legacy Architect RVA can follow up.</label></div>'
    +   '<div id="handoff-error"></div>'
    +   '<button type="submit" id="handoff-submit-btn">Send It Over</button>'
    + '</form>'
    + '<div id="handoff-success"><p id="handoff-success-msg">You\'re set. Tap below to open it.</p>'
    +   '<a id="handoff-open-btn" href="' + FALLBACK_PDF_URL + '" target="_blank" rel="noopener">Open The Handoff</a></div>'
    + '<div id="handoff-gate-note">No passwords go on it, and nothing you send here gets sold or shared.</div>'
    + '</div>';
  document.body.appendChild(overlay);

  var form = overlay.querySelector('#handoff-form');
  var emailInput = overlay.querySelector('#handoff-email');
  var firstnameInput = overlay.querySelector('#handoff-firstname');
  var lastnameInput = overlay.querySelector('#handoff-lastname');
  var consentCheck = overlay.querySelector('#handoff-consent-check');
  var hpInput = overlay.querySelector('#handoff-hp');
  var submitBtn = overlay.querySelector('#handoff-submit-btn');
  var errorBox = overlay.querySelector('#handoff-error');
  var successBox = overlay.querySelector('#handoff-success');
  var openBtn = overlay.querySelector('#handoff-open-btn');

  function closeGate(){
    overlay.classList.remove('on');
    document.body.style.overflow = '';
  }

  function getCookie(name){
    var m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }

  function showError(msg){
    errorBox.textContent = msg;
    errorBox.classList.add('show');
  }

  function isValidEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    errorBox.classList.remove('show');

    if (hpInput.value.trim()) {
      // Honeypot tripped, almost certainly a bot. Fake success, give it nothing useful.
      form.style.display = 'none';
      successBox.classList.add('show');
      return;
    }

    var email = emailInput.value.trim();
    if (!isValidEmail(email)) {
      showError('That email doesn\u2019t look complete. Double check it and try again.');
      emailInput.focus();
      return;
    }
    if (!consentCheck.checked) {
      showError('Check the box above so we know it\u2019s okay to send this over.');
      return;
    }

    var fields = [{name: 'email', value: email}];
    if (firstnameInput.value.trim()) {
      fields.push({name: 'firstname', value: firstnameInput.value.trim()});
    }
    if (lastnameInput.value.trim()) {
      fields.push({name: 'lastname', value: lastnameInput.value.trim()});
    }

    var payload = {
      fields: fields,
      context: {
        pageUri: location.href,
        pageName: document.title
      },
      legalConsentOptions: {
        consent: {
          consentToProcess: true,
          text: 'I agree to allow Legacy Architect RVA to store and process my personal data, and to email me The Handoff.'
        }
      }
    };
    var hutk = getCookie('hubspotutk');
    if (hutk) payload.context.hutk = hutk;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending\u2026';

    fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload)
    }).then(function(res){
      if (!res.ok) throw new Error('bad status ' + res.status);
      return res.json().catch(function(){ return {}; });
    }).then(function(data){
      if (typeof gtag === 'function') {
        gtag('event', 'handoff_download', {link_text: 'The Handoff form submit', page_path: location.pathname});
      }
      if (data && data.redirectUri) {
        openBtn.href = data.redirectUri;
      }
      form.style.display = 'none';
      successBox.classList.add('show');
    }).catch(function(){
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send It Over';
      showError('That didn\u2019t go through. Try again, or use the direct link below.');
      var directLink = document.createElement('div');
      directLink.style.marginTop = '4px';
      directLink.innerHTML = '<a href="' + FALLBACK_PDF_URL + '" target="_blank" rel="noopener" '
        + 'style="color:#e8c869;text-decoration:underline;font-family:Inter,sans-serif;font-size:12.5px">'
        + 'Or just get the file directly</a>';
      errorBox.appendChild(directLink);
    });
  });

  window.openHandoffGate = function(e){
    if (e && e.preventDefault) e.preventDefault();
    overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
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
