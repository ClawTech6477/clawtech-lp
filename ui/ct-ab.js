/* ct-ab.js — 文言のA/B(2026-11-08)。
   中身は https://clawtechjp.com/ui/ab.json(Mac の improve_loop → ab/adapters/shindan.py が書き換えてpush)。
   計測: 表示=cta_view / クリック=cta_click、link_id="ab<実験番号>_<案>"(GA4既定ディメンション linkId に入る)。
   勝ち案が決まると本体HTMLの既定文言も書き換わるので、このファイルが読めなくても完成形で表示される。
   使い方:
     静的な要素  <a data-ct-ab="lp_hero">既定の文言</a>  → 自動で差し替え+表示/クリック計測
     動的な要素  CTAB.text("nenshu_cta","既定") で文言、描画時に CTAB.view("nenshu_cta")、押下で CTAB.click("nenshu_cta") */
(function () {
  "use strict";
  var SRC = "https://clawtechjp.com/ui/ab.json";
  var cfg = null, seen = {};
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
    return null;
  }
  function send(ev, lid) {
    if (typeof gtag === "function") gtag("event", ev, { link_id: lid, transport_type: "beacon" });
  }
  function pick(slot) {
    var s = cfg && cfg[slot];
    if (!s) return null;
    if (!s.exp || !s.variants || !s.variants.length) return s.winner ? { content: s.winner, lid: null } : null;
    var key = "ctab_" + slot + "_" + s.exp, label = store(key), v = null;
    for (var i = 0; i < s.variants.length; i++) if (s.variants[i].label === label) v = s.variants[i];
    if (!v) { v = s.variants[Math.floor(Math.random() * s.variants.length)]; store(key, v.label); }
    return { content: v.content, lid: "ab" + s.exp + "_" + v.label };
  }
  function esc(t) {
    return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }
  var api = {
    text: function (slot, def) { var p = pick(slot); return p ? p.content : def; },
    html: function (slot, def) { return esc(api.text(slot, def)); },
    view: function (slot) { var p = pick(slot); if (p && p.lid && !seen[slot]) { seen[slot] = p.lid; send("cta_view", p.lid); } },
    click: function (slot) { if (seen[slot]) send("cta_click", seen[slot]); },  /* 表示を数えた文言のクリックだけ数える */
    esc: esc
  };
  api.ready = fetch(SRC, { cache: "no-cache" })
    .then(function (r) { return r.ok ? r.json() : {}; })
    .catch(function () { return {}; })
    .then(function (j) {
      cfg = j || {};
      var els = document.querySelectorAll("[data-ct-ab]");
      for (var i = 0; i < els.length; i++) (function (el) {
        var slot = el.getAttribute("data-ct-ab"), p = pick(slot);
        if (!p) return;
        el.textContent = p.content;
        api.view(slot);
        el.addEventListener("click", function () { api.click(slot); });
      })(els[i]);
    });
  window.CTAB = api;
})();
