/* ct-motion.js — ClawTech 共通モーション v1 (2026-10-29)
 * GSAP 3.15.0 (cdnjs, Standard No-Charge License) を必要になった時だけ読む。読めなくても画面は完成形で出る。
 * 原則:
 *  - 動きは「処理の進み方」か「注目させたい1点」にだけ付ける。飾りで動かさない
 *  - 解析演出は実際の処理段階に対応させる(処理していないのに「計算中」と見せない)。合計1.6秒以内
 *  - prefers-reduced-motion では全て即時表示
 * 使い方:
 *  <script src="https://clawtechjp.com/ui/ct-motion.js" defer></script>
 *  data-ct-reveal                 → 画面に入ったらフェードアップ(兄弟は自動で時間差)
 *  CT.countUp(el, 1234, {unit})   → 数字のカウントアップ
 *  await CT.steps(listEl, [fn,..])→ 各段階の実処理を順に実行し、完了した行にチェックを付ける
 */
(function () {
  var GSAP_URL = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.15.0/gsap.min.js";
  var GSAP_SRI = "sha384-XmJ9SoHtVOHoQUcKvFAzVXwdkKo1Ie3bhmSoIAkcdsHGaIrVJIkmozyq0FJeb/Ly";  /* 版を上げたら再計算 */
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gsapReady = null;
  document.documentElement.classList.remove("ct-no-js");
  if (reduced) document.documentElement.classList.add("ct-reduced");

  function loadGsap() {
    if (window.gsap) return Promise.resolve(window.gsap);
    if (gsapReady) return gsapReady;
    gsapReady = new Promise(function (res) {
      var s = document.createElement("script");
      s.src = GSAP_URL; s.async = true; s.crossOrigin = "anonymous"; s.integrity = GSAP_SRI;
      s.onload = function () { res(window.gsap || null); };
      s.onerror = function () { res(null); };
      document.head.appendChild(s);
    });
    return gsapReady;
  }

  function fmt(n, digits) {
    return Number(n).toLocaleString("ja-JP", { maximumFractionDigits: digits || 0, minimumFractionDigits: digits || 0 });
  }

  function countUp(el, to, opt) {
    opt = opt || {};
    var digits = opt.digits || 0, dur = opt.duration || 1.1;
    var set = function (v) { el.textContent = fmt(v, digits); };
    if (reduced) { set(to); return Promise.resolve(); }
    return loadGsap().then(function (g) {
      if (!g) { set(to); return; }
      var o = { v: opt.from || 0 };
      return new Promise(function (res) {
        g.to(o, { v: to, duration: dur, ease: "power3.out", onUpdate: function () { set(o.v); }, onComplete: function () { set(to); res(); } });
      });
    });
  }

  /* 段階表示: 各行 <li> に対応する処理関数を順に実行。最低表示時間 minEach で読める速さを確保(合計上限 1.6s) */
  function steps(listEl, fns, opt) {
    opt = opt || {};
    var items = Array.prototype.slice.call(listEl.querySelectorAll("li"));
    var minEach = reduced ? 0 : Math.min(opt.minEach || 320, 1600 / Math.max(fns.length, 1));
    var results = [];
    var chain = Promise.resolve();
    fns.forEach(function (fn, i) {
      chain = chain.then(function () {
        var li = items[i];
        if (li) li.classList.add("is-active");
        var t0 = performance.now();
        return Promise.resolve(fn(results)).then(function (r) {
          results.push(r);
          var wait = Math.max(0, minEach - (performance.now() - t0));
          return new Promise(function (res) { setTimeout(res, wait); });
        }).then(function () { if (li) { li.classList.remove("is-active"); li.classList.add("is-done"); } });
      });
    });
    return chain.then(function () { return results; });
  }

  function reveal(root) {
    var els = (root || document).querySelectorAll("[data-ct-reveal]");
    if (!els.length) return;
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.style.opacity = 1; e.style.transform = "none"; });
      return;
    }
    loadGsap().then(function (g) {
      var io = new IntersectionObserver(function (entries) {
        var batch = entries.filter(function (en) { return en.isIntersecting; }).map(function (en) { io.unobserve(en.target); return en.target; });
        if (!batch.length) return;
        if (g) g.to(batch, { opacity: 1, y: 0, duration: .7, ease: "power3.out", stagger: .07 });
        else batch.forEach(function (e) { e.style.opacity = 1; e.style.transform = "none"; });
      }, { rootMargin: "0px 0px -8% 0px" });
      els.forEach(function (e) { io.observe(e); });
    });
  }

  window.CT = { loadGsap: loadGsap, countUp: countUp, steps: steps, reveal: reveal, reduced: reduced, fmt: fmt };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { reveal(); });
  else reveal();
})();
