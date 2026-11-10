/* ================================================================
   ABM visual - Adelaide Oval event space tours
   Loaded by the short snippet in each MPskin tour (Extend HTML).
   Edit THIS file and abm-rooms.json in github.com/ABMvisual/AOSMA;
   the snippets in MPskin never need to change.
   ================================================================ */
(function () {
  if (window.__abmLoaded) return;
  window.__abmLoaded = true;
  var BASE = window.ABM_BASE || 'https://abmvisual.github.io/AOSMA/';
  var V = Math.floor(Date.now() / 300000);   // refreshes the room settings every 5 minutes

  function slug(t) { return String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  // Which room is this? 1) the room named in the snippet, 2) the MPskin tour id
  // listed in abm-rooms.json, 3) a room name that appears in the page title.
  function whichRoom(cfg) {
    if (window.ABM_ROOM && cfg.rooms[window.ABM_ROOM]) return window.ABM_ROOM;
    var m = location.pathname.match(/tour\/([a-z0-9]+)/i);
    if (m && cfg.tours && cfg.tours[m[1]]) return cfg.tours[m[1]];
    var title = slug(document.title), best = '', id;
    for (id in cfg.rooms) {
      var n = slug(cfg.rooms[id].name);
      if (n && title.indexOf(n) !== -1 && n.length > best.length) best = id;
    }
    return best;
  }

  function start(cfg) {
    var id = whichRoom(cfg), room = cfg.rooms[id];
    if (!room) { if (window.console) console.warn('ABM visual: no room settings found for this tour (' + (window.ABM_ROOM || location.pathname) + ')'); return; }
    var d = cfg.defaults || {};
    window.ABM_SPACE = {
      name: room.name, video: room.video || '', captions: room.captions || '', factSheet: room.factSheet || '',
      shareUrl: room.shareUrl || d.shareUrl || '', creditLogo: d.creditLogo || '',
      enquiry: Object.assign({}, d.enquiry || {}, room.enquiry || {}),
      popupDelaySeconds: room.popupDelaySeconds || d.popupDelaySeconds || 45,
      banner: Object.assign({}, d.banner || {}, room.banner || {})
    };
    window.ABM_CAPACITY = {}; window.ABM_CAPACITY[room.name] = room.capacity || {};
    var st = document.createElement('style'); st.id = 'abm-style'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
    main();
  }

  var CSS = "\n  .abm-ui, .abm-ui * { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }\n  .abm-btn {\n    border: 0; cursor: pointer; border-radius: 22px; padding: 10px 16px; text-decoration: none;\n    font-size: 14px; font-weight: bold; color: #fff; background: rgba(0,0,0,0.72);\n    box-shadow: 0 4px 14px rgba(0,0,0,0.45); display: inline-flex; align-items: center; gap: 7px;\n  }\n  .abm-btn:hover, .abm-btn:focus-visible { background: rgba(0,0,0,0.9); outline: 2px solid #019bde; outline-offset: 1px; }\n  .abm-btn.abm-primary { background: #019bde; }\n  .abm-btn.abm-primary:hover, .abm-btn.abm-primary:focus-visible { background: #0088c4; }\n  .abm-btn.abm-light { background: #eef3f6; color: #1a1a1a; box-shadow: none; }\n  .abm-btn.abm-light:hover, .abm-btn.abm-light:focus-visible { background: #dde7ee; }\n  .abm-btn svg { width: 16px; height: 16px; flex: none; }\n\n  /* ---------- 4. Quick links bar: top centre, under the banner, on every screen ---------- */\n  #abm-quicklinks {\n    position: fixed; left: 50%; top: 60px; transform: translateX(-50%);\n    z-index: 9999990; display: flex; gap: 8px;\n  }\n\n  /* ---------- Cards that tuck to the right edge ---------- */\n  .abm-card {\n    position: fixed; right: 20px; z-index: 9999992; color: #fff;\n    background: rgba(0,0,0,0.75); border-radius: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.5);\n    padding: 12px 14px 12px 40px;\n    transition: transform .45s ease, opacity .5s ease;\n    opacity: 0; pointer-events: none;\n  }\n  .abm-card.abm-show { opacity: 1; pointer-events: auto; }\n  .abm-card.abm-tucked { transform: translateX(calc(100% - 30px + 20px)); }\n  .abm-tab {\n    position: absolute; left: 0; top: 0; bottom: 0; width: 30px; border: 0; cursor: pointer;\n    background: rgba(1,155,222,0.9); color: #fff; border-radius: 12px 0 0 12px;\n    display: flex; align-items: center; justify-content: center; padding: 0;\n  }\n  .abm-tab svg { width: 16px; height: 16px; transition: transform .45s ease; }\n  .abm-card.abm-tucked .abm-tab svg { transform: rotate(180deg); }\n  .abm-card-title { font-size: 15px; font-weight: bold; margin: 0 0 8px; }\n\n  /* ---------- 3. Quick facts banner ----------\n     Full width across the top, from the top of the screen down to the\n     bottom of MPskin's logo and menu. Sits above the tour but behind\n     MPskin's own buttons, and ignores clicks so nothing is blocked. */\n  #abm-facts {\n    position: fixed; top: 0; left: 0; right: 0; height: 44px;\n    display: flex; align-items: center; justify-content: center; gap: 14px;\n    padding: 0 12px; background: #019bde; color: #fff;\n    pointer-events: none; white-space: nowrap; overflow: hidden;\n  }\n  #abm-facts .abm-facts-name { font-weight: 900; letter-spacing: .04em; text-transform: uppercase; overflow: hidden; text-overflow: ellipsis; }\n  #abm-facts .abm-facts-list { display: flex; gap: .8em; opacity: .95; }\n\n  /* ---------- 2. Room info card (where the miniplayer was) ---------- */\n  #abm-info { top: 110px; width: 300px; }\n  #abm-info .abm-info-actions { display: flex; flex-direction: column; gap: 8px; }\n  #abm-info .abm-btn { justify-content: center; width: 100%; box-shadow: none; }\n  #abm-info .abm-btn:not(.abm-primary) { background: rgba(255,255,255,0.14); }\n  #abm-info .abm-phone { font-size: 13px; opacity: .85; margin: 8px 0 0; text-align: center; }\n  #abm-info .abm-phone a { color: #fff; }\n\n  /* ---------- 1. Miniplayer ---------- */\n  #abm-mini {\n    position: fixed; bottom: 80px; right: 20px; width: clamp(220px, 26vw, 380px);\n    padding: clamp(32px, 3.2vw, 44px) 8px 8px; z-index: 9999995; display: none;\n    background: rgba(0,0,0,0.65); border-radius: 12px;\n    box-shadow: 0 15px 35px rgba(0,0,0,0.8); transition: opacity .5s ease, transform .5s ease;\n  }\n  #abm-mini.abm-fade { opacity: 0; }\n  #abm-mini-head {\n    position: absolute; top: 7px; left: 0; width: 100%; text-align: center; color: #fff;\n    font-size: clamp(16px, 1.8vw, 24px); font-weight: 900; letter-spacing: 2px; line-height: 1.2; text-transform: uppercase; pointer-events: none;\n  }\n  #abm-mini-box { position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 6px; overflow: hidden; background: #000; }\n  #abm-mini-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; background: #000; }\n  #abm-mini-video::cue { font-family: Arial, Helvetica, sans-serif; font-size: 15px; background: rgba(0,0,0,0.75); color: #fff; }\n  #abm-mini.abm-expanded #abm-mini-video::cue { font-size: 26px; }\n  #abm-mini-overlay {\n    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;\n    cursor: pointer; z-index: 2; background: transparent; border: 0; padding: 0;\n  }\n  #abm-mini-overlay span {\n    background: #019bde; color: #fff; padding: 7px 16px; border-radius: 20px; white-space: nowrap;\n    font-size: 13px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.5);\n  }\n  #abm-mini-close {\n    position: absolute; top: 3px; right: 10px; z-index: 3; background: none; border: 0;\n    color: #fff; font-size: 30px; font-weight: bold; cursor: pointer; line-height: 1;\n    text-shadow: 0 0 10px rgba(0,0,0,0.8);\n  }\n  #abm-mini.abm-expanded {\n    inset: 0; width: 100vw; height: 100vh; padding: 0; border-radius: 0; background: #000; box-shadow: none;\n  }\n  #abm-mini.abm-expanded #abm-mini-head { display: none; }\n  #abm-mini.abm-expanded #abm-mini-box { height: 100%; aspect-ratio: auto; border-radius: 0; }\n  #abm-mini.abm-expanded #abm-mini-close { top: 15px; right: 20px; font-size: 40px; }\n\n  /* ---------- 5. Enquiry form ---------- */\n  #abm-enq-backdrop {\n    position: fixed; inset: 0; z-index: 9999998; background: rgba(0,0,0,0.55);\n    display: none; align-items: center; justify-content: center; padding: 16px;\n  }\n  #abm-enq-backdrop.abm-open { display: flex; }\n  #abm-enq {\n    width: 100%; max-width: 440px; max-height: 92vh; overflow-y: auto;\n    background: #fff; color: #1a1a1a; border-radius: 14px; padding: 22px 22px 18px;\n    box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: relative;\n  }\n  #abm-enq h2 { font-size: 20px; margin: 0 26px 4px 0; line-height: 1.25; }\n  #abm-enq .abm-sub { font-size: 14px; color: #555; margin: 0 0 12px; }\n  #abm-enq-close { position: absolute; top: 10px; right: 12px; background: none; border: 0; font-size: 28px; cursor: pointer; color: #555; line-height: 1; }\n  #abm-enq .abm-top-actions { display: flex; gap: 8px; margin-bottom: 14px; }\n  #abm-enq .abm-top-actions .abm-btn { flex: 1; justify-content: center; }\n  #abm-enq .abm-or { text-align: center; font-size: 12px; color: #777; text-transform: uppercase; letter-spacing: .08em; margin: 0 0 12px; }\n  #abm-enq label { display: block; font-size: 13px; font-weight: bold; margin: 0 0 4px; }\n  #abm-enq input, #abm-enq select, #abm-enq textarea {\n    width: 100%; font-size: 15px; padding: 9px 10px; border: 1px solid #c9c9c9; border-radius: 8px;\n    margin: 0 0 10px; background: #fff; color: #1a1a1a;\n  }\n  #abm-enq textarea { min-height: 70px; resize: vertical; }\n  #abm-enq .abm-row { display: flex; gap: 10px; }\n  #abm-enq .abm-row > div { flex: 1; min-width: 0; }\n  #abm-enq .abm-submit { width: 100%; justify-content: center; margin-top: 4px; }\n  #abm-enq .abm-call { font-size: 14px; text-align: center; margin: 12px 0 0; }\n  #abm-enq .abm-call a { color: #0077aa; font-weight: bold; }\n  #abm-enq .abm-note { font-size: 11px; color: #777; margin: 8px 0 0; }\n  #abm-enq .abm-msg { font-size: 15px; margin: 12px 0 4px; }\n  #abm-enq .abm-credit { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 14px 0 0; padding-top: 12px; border-top: 1px solid #eee; color: #777; font-size: 11px; text-decoration: none; }\n  #abm-enq .abm-credit img { height: 20px; width: auto; display: block; }\n\n  /* ---------- share panel ---------- */\n  #abm-share {\n    position: fixed; z-index: 99999999; display: none; flex-direction: column; min-width: 190px; max-height: calc(100vh - 16px); overflow-y: auto;\n    background: #fff; color: #1a1a1a; border-radius: 12px; padding: 6px; box-shadow: 0 12px 34px rgba(0,0,0,0.45);\n  }\n  #abm-share.abm-open { display: flex; }\n  .abm-share-item {\n    display: flex; align-items: center; gap: 10px; padding: 9px 10px; border: 0; background: none;\n    border-radius: 8px; color: #1a1a1a; text-decoration: none; font-size: 14px; cursor: pointer; text-align: left; width: 100%;\n  }\n  .abm-share-item:hover, .abm-share-item:focus-visible { background: #eef3f6; outline: none; }\n  .abm-share-item svg { width: 18px; height: 18px; flex: none; }\n  .abm-share-copy { font-weight: bold; border-bottom: 1px solid #e5e5e5; border-radius: 8px 8px 0 0; margin-bottom: 2px; }\n\n  /* ---------- guided tour: everything slides off ---------- */\n  .abm-ui.abm-slide { transition: transform .5s ease, opacity .5s ease; }\n  body.abm-away #abm-quicklinks { transform: translate(-50%, -400%) !important; opacity: 0; pointer-events: none; }\n  body.abm-away #abm-facts { transform: translateY(-110%) !important; }\n  body.abm-away #abm-mini, body.abm-away #abm-info { transform: translateX(120%) !important; opacity: 0; pointer-events: none; }\n  #abm-debug {\n    position: fixed; left: 8px; top: 60px; width: min(420px, 92vw); max-height: 45vh; overflow: auto; z-index: 99999999;\n    background: rgba(0,0,0,.85); color: #9f9; font: 11px/1.35 monospace; padding: 8px; border-radius: 8px; white-space: pre-wrap; word-break: break-all;\n  }\n\n  /* ---------- toast ---------- */\n  #abm-toast {\n    position: fixed; left: 50%; bottom: 76px; transform: translateX(-50%); z-index: 9999999;\n    background: #1a1a1a; color: #fff; padding: 10px 16px; border-radius: 20px; font-size: 14px;\n    opacity: 0; transition: opacity .25s; pointer-events: none;\n  }\n  #abm-toast.abm-show { opacity: 1; }\n\n  @media (max-width: 600px) {\n    /* phones: Matterport's own buttons run along the whole bottom edge, so lift everything above them */\n    #abm-mini { bottom: 146px; right: 10px; }\n    #abm-mini-head { letter-spacing: 1px; }\n    #abm-info { width: 230px; right: 10px; }\n    .abm-card.abm-tucked { transform: translateX(calc(100% - 30px + 10px)); }\n    #abm-quicklinks { gap: 6px; }\n    #abm-toast { bottom: 140px; }\n    .abm-btn { padding: 9px 12px; font-size: 13px; }\n  }\n";

  function main() {
  var S = window.ABM_SPACE || {};
  var CAP_TABLE = window.ABM_CAPACITY || {};
  var SPACE_ID = (S.name || 'space').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  var POPUP_KEY = 'abm_enquiry_seen_' + SPACE_ID;
  var SHOW_MS = 6000;   // how long a card stays out before tucking to the edge

  /* ---------- helpers ---------- */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var a in (attrs || {})) {
      if (a === 'text') n.textContent = attrs[a];
      else if (a === 'html') n.innerHTML = attrs[a];
      else n.setAttribute(a, attrs[a]);
    }
    (kids || []).forEach(function (k) { if (k) n.appendChild(k); });
    return n;
  }
  var ICON = {
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>',
    enquire: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v12H5.5L4 17.5z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>'
  };

  /* ---------- 6. GA4 tracking ---------- */
  function track(name, params) {
    params = params || {};
    params.space_name = S.name || '';
    params.space_id = SPACE_ID;
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      else { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: name }, params)); }
    } catch (e) {}
  }
  window.abmTrack = track;
  track('abm_space_view');

  /* ---------- toast ---------- */
  var toast = el('div', { id: 'abm-toast', 'class': 'abm-ui', role: 'status', 'aria-live': 'polite' });
  var toastTimer;
  function say(msg) {
    toast.textContent = msg; toast.classList.add('abm-show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('abm-show'); }, 2200);
  }

  /* ---------- share panel (used by the bar, the form and the info card) ----------
     Our own panel, not the device's share menu: copy link first, then email,
     then the channels Adelaide Oval uses that accept shared links
     (LinkedIn, Facebook, Instagram, X). Instagram has no link sharing,
     so its button copies the link and opens Instagram DMs to paste it.  */
  var SVG = function (d) { return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + d + '"/></svg>'; };
  var SHARE_ICONS = {
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    linkedin: SVG('M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.86V21H9z'),
    facebook: SVG('M14 8h3V4h-3c-2.76 0-4.5 1.79-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8z'),
    whatsapp: SVG('M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.8-1.1-4.6-4-4.8-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.1.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 .9c.3.1.4.2.5.3.1.2.1.7-.1 1.3z'),
    teams: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="6" width="13" height="13" rx="2"/><path d="M5.5 10h6M8.5 10v6"/><circle cx="18.5" cy="5.5" r="2.5"/><path d="M15 11h5.5a1.5 1.5 0 0 1 1.5 1.5V16a3 3 0 0 1-5 2.2"/></svg>',
    sms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/></svg>',
    x: SVG('M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L1.9 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z')
  };
  var sharePanel = el('div', { id: 'abm-share', 'class': 'abm-ui', role: 'dialog', 'aria-label': 'Share this room' });
  var PHONE = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  function shareLinks() {
    var url = S.shareUrl || location.href;
    var title = (S.name ? S.name + ' at ' : '') + 'Adelaide Oval';
    var u = encodeURIComponent(url), t = encodeURIComponent(title);
    return [
      ['copy', 'Copy link', null],
      ['email', 'Email', 'mailto:?subject=' + t + '&body=' + encodeURIComponent('Take a look at ' + title + ':\n\n' + url)],
      ['linkedin', 'LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + u],
      ['teams', 'Microsoft Teams', 'https://teams.microsoft.com/share?href=' + u + '&msgText=' + t],
    ].concat(PHONE ? [['sms', 'Text message', 'sms:?&body=' + encodeURIComponent(title + ': ' + url)]] : []).concat([
      ['whatsapp', 'WhatsApp', 'https://wa.me/?text=' + encodeURIComponent(title + ': ' + url)],
      ['facebook', 'Facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u],
      ['instagram', 'Instagram', 'https://www.instagram.com/direct/inbox/'],
      ['x', 'X (Twitter)', 'https://twitter.com/intent/tweet?url=' + u + '&text=' + t],
    ]);
  }
  function closeShare() { sharePanel.classList.remove('abm-open'); }
  function share(source, anchor) {
    if (sharePanel.classList.contains('abm-open') && sharePanel.dataset.source === source) { closeShare(); return; }
    var url = S.shareUrl || location.href;
    sharePanel.innerHTML = '';
    sharePanel.dataset.source = source;
    shareLinks().forEach(function (s) {
      var item;
      if (s[0] === 'copy') {
        item = el('button', { type: 'button', 'class': 'abm-share-item abm-share-copy', html: SHARE_ICONS.copy + '<span>Copy link</span>' });
        item.addEventListener('click', function () {
          var ok = function () { say('Link copied'); track('share', { method: 'copy_link', content_type: 'event_space', source: source }); closeShare(); };
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, function () { window.prompt('Copy this link:', url); });
          else window.prompt('Copy this link:', url);
        });
      } else {
        item = el('a', { 'class': 'abm-share-item', href: s[2], target: (s[0] === 'email' || s[0] === 'sms') ? '_self' : '_blank', rel: 'noopener', html: SHARE_ICONS[s[0]] + '<span>' + s[1] + '</span>' });
        item.addEventListener('click', function () {
          if (s[0] === 'instagram' && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () { say('Link copied, paste it into Instagram'); }, function () {});
          }
          track('share', { method: s[0], content_type: 'event_space', source: source }); closeShare();
        });
      }
      sharePanel.appendChild(item);
    });
    sharePanel.classList.add('abm-open');
    var r = anchor.getBoundingClientRect(), pw = sharePanel.offsetWidth, ph = sharePanel.offsetHeight;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - pw / 2), window.innerWidth - pw - 8);
    var top = r.top - ph - 10; if (top < 8) top = r.bottom + 10; top = Math.max(8, Math.min(top, window.innerHeight - ph - 8));
    sharePanel.style.left = left + 'px'; sharePanel.style.top = top + 'px';
    track('abm_share_open', { source: source });
  }
  document.addEventListener('click', function (e) {
    if (!sharePanel.classList.contains('abm-open')) return;
    if (sharePanel.contains(e.target) || (e.target.closest && e.target.closest('.abm-share-btn'))) return;
    closeShare();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeShare(); });
  function shareButton(cls, source, label) {
    var b = el('button', { type: 'button', 'class': 'abm-btn abm-share-btn ' + (cls || ''), 'aria-haspopup': 'dialog', html: ICON.share + (label || 'Share') });
    b.addEventListener('click', function (e) { e.stopPropagation(); share(source, b); });
    return b;
  }
  function downloadButton(cls, source, label) {
    var a = el('a', { 'class': 'abm-btn ' + (cls || ''), href: S.factSheet, target: '_blank', rel: 'noopener', html: ICON.download + (label || 'Download our fact sheet') });
    a.addEventListener('click', function () { track('abm_factsheet_download', { source: source }); });
    return a;
  }

  /* ---------- tucking cards ---------- */
  function makeCard(id, label, children) {
    var card = el('div', { id: id, 'class': 'abm-ui abm-card', role: 'region', 'aria-label': label });
    var tab = el('button', { type: 'button', 'class': 'abm-tab', 'aria-label': 'Hide or show ' + label, 'aria-expanded': 'true', html: ICON.chevron });
    card.appendChild(tab);
    children.forEach(function (c) { card.appendChild(c); });
    var timer;
    card.tuck = function (yes) {
      card.classList.toggle('abm-tucked', yes);
      tab.setAttribute('aria-expanded', yes ? 'false' : 'true');
    };
    card.flash = function () {          // show it, then tuck it to the edge
      card.classList.add('abm-show'); card.tuck(false);
      clearTimeout(timer); timer = setTimeout(function () { card.tuck(true); }, SHOW_MS);
    };
    tab.addEventListener('click', function () {
      clearTimeout(timer);
      var open = card.classList.contains('abm-tucked');
      card.tuck(!open);
      if (open) track('abm_card_open', { card: id });
    });
    return card;
  }

  /* ---------- 3. Quick facts banner ---------- */
  var cap = CAP_TABLE[S.name] || {};
  var facts = [['banquet', 'banquet'], ['cabaret', 'cabaret'], ['cocktail', 'cocktail'], ['theatre', 'theatre']]
    .filter(function (c) { return typeof cap[c[0]] === 'number'; })
    .map(function (c) { return el('span', { html: '<b>' + cap[c[0]].toLocaleString('en-AU') + '</b> ' + c[1] }); });
  var factsBar = el('div', { id: 'abm-facts', 'class': 'abm-ui abm-slide', 'aria-hidden': 'true' }, [
    el('span', { 'class': 'abm-facts-name', text: S.name || '' }),
    facts.length ? el('span', { 'class': 'abm-facts-list' }, facts) : null
  ]);

  // Measures MPskin's logo (left) and menu (right) along the top edge.
  function measureTopUi() {
    var w = window.innerWidth, out = { bottom: 0, logoRight: 0, menuLeft: w };
    var nodes = document.body.getElementsByTagName('*');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n === factsBar || factsBar.contains(n) || (n.closest && n.closest('.abm-ui'))) continue;
      if (n.tagName === 'IFRAME' || n.tagName === 'SCRIPT' || n.tagName === 'STYLE') continue;
      var r = n.getBoundingClientRect();
      if (r.width < 8 || r.height < 8 || r.top > 6 || r.bottom > 140 || r.width > w * 0.6) continue;
      var left = r.left < w * 0.4, right = r.right > w * 0.6;
      if (!left && !right) continue;
      var cs = window.getComputedStyle(n);
      if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
      if (r.bottom > out.bottom) out.bottom = r.bottom;
      if (left && r.right < w * 0.6 && r.right > out.logoRight) out.logoRight = r.right;
      if (right && r.left > w * 0.4 && r.left < out.menuLeft) out.menuLeft = r.left;
    }
    return out;
  }
  // Layer: directly above the tour iframe, below everything MPskin puts on top.
  function placeLayer() {
    var frames = document.getElementsByTagName('iframe'), tour = null, area = 0;
    for (var i = 0; i < frames.length; i++) {
      var r = frames[i].getBoundingClientRect(), a = r.width * r.height;
      if (a > area) { area = a; tour = frames[i]; }
    }
    if (tour && tour.parentNode && factsBar.previousSibling !== tour) {
      tour.parentNode.insertBefore(factsBar, tour.nextSibling);
      var z = window.getComputedStyle(tour).zIndex;
      factsBar.style.zIndex = (z && z !== 'auto') ? z : '0';
    } else if (!factsBar.parentNode) {
      factsBar.style.zIndex = '1';
      document.body.insertBefore(factsBar, document.body.firstChild);
    }
  }
  function sizeBanner() {
    var bn = S.banner || {}, g = measureTopUi(), w = window.innerWidth;
    var h = Math.round(g.bottom) || bn.fallbackHeight || 44;
    var fs = Math.max(11, Math.min(18, Math.round(h * 0.36)));
    factsBar.style.height = h + 'px';
    factsBar.style.fontSize = fs + 'px';
    var name = factsBar.querySelector('.abm-facts-name');
    if (bn.style === 'full') {
      factsBar.style.top = '0'; factsBar.style.left = '0'; factsBar.style.right = '0'; factsBar.style.borderRadius = '0';
      factsBar.style.padding = '0 ' + Math.max(Math.round(g.logoRight), Math.round(w - g.menuLeft)) + 'px';
    } else {
      // centre: fill the gap between the logo and the menu, with a little breathing room
      var gapL = Math.round(g.logoRight) + 10, gapR = Math.round(w - g.menuLeft) + 10;
      factsBar.style.top = '0';
      factsBar.style.borderRadius = '0 0 10px 10px';
      factsBar.style.padding = '0 12px';
      if (w - gapL - gapR < 150) {
        // no room between the logo and menu (small phones): sit just below them instead
        gapL = 0; gapR = 0;
        factsBar.style.top = h + 'px';
        factsBar.style.height = Math.max(30, Math.round(h * 0.75)) + 'px';
        factsBar.style.borderRadius = '0';
      }
      factsBar.style.left = gapL + 'px'; factsBar.style.right = gapR + 'px';
    }
    // every screen: Share / Enquire and the info card sit at the top, under the banner,
    // so they never cover the guided tour's captions at the bottom
    var under = Math.round(factsBar.getBoundingClientRect().bottom || h) + 8;
    bar.style.top = under + 'px'; bar.style.bottom = 'auto';
    infoCard.style.top = (under + 50) + 'px'; infoCard.style.bottom = 'auto';
    // if it doesn't fit: shrink the text a little, and if the name is still cut off, drop the name
    var tooWide = function () { return factsBar.scrollWidth > factsBar.clientWidth || (name && name.style.display !== 'none' && name.scrollWidth > name.clientWidth); };
    if (name) name.style.display = '';
    factsBar.style.justifyContent = 'center';
    while (tooWide() && fs > 13) { fs--; factsBar.style.fontSize = fs + 'px'; }
    if (tooWide() && name && facts.length) name.style.display = 'none';
    while (tooWide() && fs > 10) { fs--; factsBar.style.fontSize = fs + 'px'; }
  }
  var sizeTimer;
  function refreshBanner() { clearTimeout(sizeTimer); sizeTimer = setTimeout(function () { placeLayer(); sizeBanner(); }, 150); }
  window.addEventListener('resize', refreshBanner);
  window.addEventListener('orientationchange', refreshBanner);

  /* ---------- 5. Enquiry form ---------- */
  var backdrop = el('div', { id: 'abm-enq-backdrop', 'class': 'abm-ui' });
  var box = el('div', { id: 'abm-enq', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'abm-enq-title' });
  var closeEnq = el('button', { id: 'abm-enq-close', type: 'button', 'aria-label': 'Close', html: '&times;' });
  var formWrap = el('div');
  box.appendChild(closeEnq);
  box.appendChild(el('h2', { id: 'abm-enq-title', text: 'Planning an event in ' + (S.name || 'this space') + '?' }));
  box.appendChild(el('p', { 'class': 'abm-sub', text: S.factSheet
    ? 'Download our fact sheet, share this room with your team, or make an enquiry here.'
    : 'Share this room with your team, or make an enquiry here.' }));
  var topActions = el('div', { 'class': 'abm-top-actions' }, [
    S.factSheet ? downloadButton('abm-primary', 'form', 'Fact sheet') : null,
    shareButton(S.factSheet ? 'abm-light' : 'abm-primary', 'form', 'Share this room')
  ]);
  box.appendChild(topActions);
  box.appendChild(el('p', { 'class': 'abm-or', text: 'or make an enquiry' }));

  function field(id, label, type, required, extra) {
    var input;
    if (type === 'textarea') input = el('textarea', { id: id, name: id });
    else if (type === 'select') {
      input = el('select', { id: id, name: id });
      extra.forEach(function (o) { input.appendChild(el('option', { value: o, text: o || 'Select...' })); });
    } else input = el('input', { id: id, name: id, type: type });
    if (required) input.required = true;
    if (type === 'email') input.autocomplete = 'email';
    if (id === 'abm-f-name') input.autocomplete = 'name';
    if (id === 'abm-f-phone') input.autocomplete = 'tel';
    if (type === 'number') input.min = '1';
    return el('div', null, [el('label', { 'for': id, text: label + (required ? ' *' : '') }), input]);
  }
  var enq = S.enquiry || {};
  var LEAD_SOURCE = 'This lead came from the Adelaide Oval 3D virtual tours (' + (S.name || 'event space') + '), created by ABM visual, Adelaide’s own spatial data and 3D digital twins provider. abmvisual.com';
  var form = el('form', { novalidate: 'novalidate' }, [
    field('abm-f-name', 'Name', 'text', true),
    field('abm-f-email', 'Email', 'email', true),
    field('abm-f-phone', 'Phone', 'tel', false),
    el('div', { 'class': 'abm-row' }, [field('abm-f-date', 'Event date', 'date', false), field('abm-f-guests', 'Guests', 'number', false)]),
    field('abm-f-type', 'Event type', 'select', false, ['', 'Corporate function', 'Conference or meeting', 'Gala dinner', 'Cocktail party', 'Wedding', 'Birthday or celebration', 'Other']),
    field('abm-f-msg', 'Anything else we should know?', 'textarea', false),
    el('button', { type: 'submit', 'class': 'abm-btn abm-primary abm-submit', text: 'Send enquiry' }),
    enq.phone ? el('p', { 'class': 'abm-call' }, [document.createTextNode('Or call our functions team on '), el('a', { href: 'tel:' + enq.phone.replace(/[^0-9+]/g, ''), text: enq.phone })]) : null,
    el('p', { 'class': 'abm-note', text: 'Your details go to the Adelaide Oval events team and are only used to respond to this enquiry.' }),
    el('a', { 'class': 'abm-credit', href: 'https://www.abmvisual.com/', target: '_blank', rel: 'noopener' }, [
      el('span', { text: '3D virtual tours by' }),
      S.creditLogo ? el('img', { src: S.creditLogo, alt: 'ABM visual, spatial data and 3D digital twins' }) : el('b', { text: 'ABM visual' })
    ])
  ]);
  formWrap.appendChild(form);
  box.appendChild(formWrap);
  backdrop.appendChild(box);

  var lastFocus = null;
  function openEnquiry(source) {
    lastFocus = document.activeElement;
    backdrop.classList.add('abm-open');
    store(POPUP_KEY, '1');
    track('abm_enquiry_open', { source: source });
    setTimeout(function () { var f = box.querySelector('input'); if (f) f.focus(); }, 50);
  }
  function closeEnquiry() {
    backdrop.classList.remove('abm-open');
    track('abm_enquiry_close');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  closeEnq.addEventListener('click', closeEnquiry);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeEnquiry(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && backdrop.classList.contains('abm-open')) closeEnquiry(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return (form.querySelector('#' + id).value || '').trim(); };
    var data = {
      space: S.name || '', name: v('abm-f-name'), email: v('abm-f-email'), phone: v('abm-f-phone'),
      date: v('abm-f-date'), guests: v('abm-f-guests'), type: v('abm-f-type'), message: v('abm-f-msg'),
      page: location.href,
      source: LEAD_SOURCE
    };
    if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      say('Please add your name and a valid email');
      (data.name ? form.querySelector('#abm-f-email') : form.querySelector('#abm-f-name')).focus();
      return;
    }
    var done = function (viaEmail) {
      track('generate_lead', { method: viaEmail ? 'email' : 'form', event_type: data.type || 'not set', guests: data.guests || 'not set' });
      formWrap.innerHTML = '';
      formWrap.appendChild(el('p', { 'class': 'abm-msg', text: viaEmail
        ? 'Your email app has opened with your enquiry ready to send. Press send there and our events team will be in touch.'
        : 'Thanks ' + data.name + ', your enquiry has been sent. Our events team will be in touch soon.' }));
    };
    if (enq.endpoint) {
      fetch(enq.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(false); })
        .catch(function () { say('Sorry, that did not send. Please try again.'); track('abm_enquiry_error'); });
    } else {
      var body = ['Space: ' + data.space, 'Name: ' + data.name, 'Email: ' + data.email, 'Phone: ' + data.phone,
        'Event date: ' + data.date, 'Guests: ' + data.guests, 'Event type: ' + data.type, '', data.message,
        '', '----------', LEAD_SOURCE, 'Tour: ' + data.page,
        'For any issues or enquiries about the tours, please contact michael@abmvisual.com'].join('\n');
      window.location.href = 'mailto:' + (enq.email || '') + '?subject=' + encodeURIComponent('Event enquiry: ' + data.space) + '&body=' + encodeURIComponent(body);
      done(true);
    }
  });

  /* ---------- 4. Quick links bar ---------- */
  var enqBtn = el('button', { type: 'button', 'class': 'abm-btn abm-primary', html: ICON.enquire + 'Enquire' });
  enqBtn.addEventListener('click', function () { openEnquiry('button'); });
  var bar = el('div', { id: 'abm-quicklinks', 'class': 'abm-ui abm-slide', role: 'toolbar', 'aria-label': 'Quick links' },
    [shareButton('', 'quicklinks'), enqBtn]);

  /* ---------- 2. Room info card ---------- */
  var infoEnq = el('button', { type: 'button', 'class': 'abm-btn abm-primary', html: ICON.enquire + 'Make an enquiry' });
  infoEnq.addEventListener('click', function () { openEnquiry('info_card'); });
  var infoCard = makeCard('abm-info', 'room information', [
    el('p', { 'class': 'abm-card-title', text: 'Plan your event in ' + (S.name || 'this space') }),
    el('div', { 'class': 'abm-info-actions' }, [
      S.factSheet ? downloadButton('abm-primary', 'info_card') : null,
      S.factSheet ? null : infoEnq,
      shareButton('', 'info_card', 'Share this room')
    ]),
    enq.phone ? el('p', { 'class': 'abm-phone' }, [document.createTextNode('Call '), el('a', { href: 'tel:' + enq.phone.replace(/[^0-9+]/g, ''), text: enq.phone })]) : null
  ]);
  var infoShown = false;
  function showInfo() {
    if (infoShown) return; infoShown = true;
    infoCard.flash();
    track('abm_info_card_shown');
  }

  /* ---------- 1. Miniplayer ---------- */
  var mini = null, video = null, videoPlaying = false;
  if (S.video) {
    mini = el('div', { id: 'abm-mini', 'class': 'abm-ui abm-slide' });
    video = el('video', { id: 'abm-mini-video', src: S.video, playsinline: '', preload: 'auto' });
    video.muted = true; video.autoplay = true;
    if (S.captions) {                   // subtitles, shown by default (the miniplayer starts muted)
      video.crossOrigin = 'anonymous';
      var capTrack = el('track', { kind: 'captions', srclang: 'en', label: 'English', src: S.captions, 'default': '' });
      video.appendChild(capTrack);
      video.addEventListener('loadedmetadata', function () { if (video.textTracks[0]) video.textTracks[0].mode = 'showing'; });
    }
    var overlay = el('button', { id: 'abm-mini-overlay', type: 'button', 'aria-label': 'Watch the video with sound', html: '<span>Tap to View</span>' });
    var closeMini = el('button', { id: 'abm-mini-close', type: 'button', 'aria-label': 'Close video', html: '&times;' });
    mini.appendChild(el('div', { id: 'abm-mini-head', text: 'Instructions' }));
    mini.appendChild(closeMini);
    mini.appendChild(el('div', { id: 'abm-mini-box' }, [video, overlay]));

    var hideMini = function (reason) {
      if (mini.dataset.gone) return;
      mini.dataset.gone = '1';
      try { video.pause(); } catch (e) {}
      videoPlaying = false;
      track('abm_video_close', { reason: reason, seconds_watched: Math.round(video.currentTime || 0) });
      mini.classList.remove('abm-expanded');
      mini.classList.add('abm-fade');                       // fade the player out...
      setTimeout(function () { mini.style.display = 'none'; showInfo(); }, 500);   // ...and the room info card in
    };
    video.addEventListener('playing', function () { videoPlaying = true; });
    video.addEventListener('pause', function () { videoPlaying = false; });
    video.addEventListener('ended', function () { videoPlaying = false; track('abm_video_complete'); hideMini('ended'); });
    overlay.addEventListener('click', function () {
      overlay.style.display = 'none';
      mini.classList.add('abm-expanded');
      video.muted = false; video.controls = true;
      try { video.currentTime = 0; } catch (e) {}             // restart from the beginning
      var p = video.play(); if (p && p.catch) p.catch(function () {});
      track('abm_video_expand');
    });
    closeMini.addEventListener('click', function () { hideMini('closed'); });
    mini.style.display = 'block';
    track('abm_video_shown');
  }

  /* ---------- Timed enquiry popup ----------
     Counts time in the room only while: the page is visible, the
     enquiry form is closed, and the intro video is not playing.  */
  var needed = (S.popupDelaySeconds || 45) * 1000, counted = 0, last = Date.now();
  function tick() {
    var now = Date.now(), dt = now - last; last = now;
    if (store(POPUP_KEY)) return;
    var paused = document.hidden || videoPlaying || backdrop.classList.contains('abm-open');
    if (!paused) counted += Math.min(dt, 2000);
    if (counted >= needed) { openEnquiry('timer'); return; }
    setTimeout(tick, 500);
  }


  /* ---------- Guided tour: slide everything off while it plays ----------
     The tour plays inside Matterport's frame, which this code can't see into.
     It listens for the start / stop messages the tour sends to the page.
     Add ?abmdebug=1 to the tour address to see those messages on screen.  */
  var away = false;
  function tourMode(on, why) {
    if (on === away) return;
    away = on;
    document.body.classList.toggle('abm-away', on);
    if (on && videoPlaying && video) { try { video.pause(); } catch (e) {} }
    track(on ? 'abm_guided_tour_start' : 'abm_guided_tour_stop', { trigger: why || 'auto' });
  }
  window.abmTourMode = tourMode;            // abmTourMode(true) hides, abmTourMode(false) brings back

  var DEBUG = /abmdebug=1/.test(location.search + location.hash) || store('abm_debug') === '1';
  var dbg = null;
  function logMsg(txt) {
    if (!DEBUG) return;
    if (!dbg) { dbg = el('div', { id: 'abm-debug' }); document.body.appendChild(dbg); }
    dbg.textContent = (new Date().toLocaleTimeString('en-AU') + '  ' + txt + '\n' + dbg.textContent).slice(0, 6000);
  }
  var TOUR_ON = /(tour|reel|highlight)[^a-z]{0,20}(start|play|step|begin|active)|(start|play)[^a-z]{0,20}(tour|reel|highlight)/i;
  var TOUR_OFF = /(tour|reel|highlight)[^a-z]{0,20}(stop|end|ended|pause|complete|inactive|interrupt)|(stop|end|pause)[^a-z]{0,20}(tour|reel|highlight)/i;
  var AUTO_DETECT = false;   // OFF until the real start / stop signals are confirmed with ?abmdebug=1
  window.addEventListener('message', function (e) {
    var txt;
    try { txt = typeof e.data === 'string' ? e.data : JSON.stringify(e.data); } catch (err) { txt = String(e.data); }
    if (!txt) return;
    logMsg((e.origin || '?') + '  ' + txt.slice(0, 300));
    if (!AUTO_DETECT) return;
    if (TOUR_OFF.test(txt)) tourMode(false, 'message');
    else if (TOUR_ON.test(txt)) tourMode(true, 'message');
  });
  if (DEBUG) setTimeout(function () { logMsg('debug on: start and stop the guided tour, then screenshot this panel'); }, 500);

  /* ---------- mount ---------- */
  function mount() {
    if (document.getElementById('abm-quicklinks')) return;
    if (!document.body) return setTimeout(mount, 200);
    document.body.classList.remove('abm-away');
    placeLayer(); sizeBanner();
    [800, 2000, 5000].forEach(function (t) { setTimeout(refreshBanner, t); });   // MPskin draws its logo and menu after load
    document.body.appendChild(infoCard);
    document.body.appendChild(bar);
    if (mini) document.body.appendChild(mini);
    document.body.appendChild(backdrop);
    document.body.appendChild(toast);
    document.body.appendChild(sharePanel);
    if (mini) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
    else showInfo();
    last = Date.now();
    setTimeout(tick, 500);
  }
  mount();
}

  fetch(BASE + 'abm-rooms.json?v=' + V, { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(start)
    .catch(function (e) { if (window.console) console.warn('ABM visual: could not load room settings', e); });
})();
