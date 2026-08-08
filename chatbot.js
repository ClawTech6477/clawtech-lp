/* ============================================================
   藍 AIアシスタント チャットボットウィジェット v1.0
   LP改修時は CHATBOT_KNOWLEDGE だけ更新すれば OK
   ============================================================ */
(function () {
  'use strict';

  /* ─── LP改修時はここを更新 ─────────────────────────── */
  var K = {
    contact_link:   '/#contact',
    diagnosis_link: '/shindan.html',
    demo_link:      '/karute-app/demo/index.html',
    services: {
      homepage: {
        name: 'ホームページ制作',
        price: '¥49,800〜',
        turnaround: '最短7日',
        keywords: /hp|ホームページ|web|サイト|コーポレート|landing|lp/i
      },
      app: {
        name: 'アプリ開発',
        price: '¥198,000〜（買い切り）',
        maintenance: '¥10,000/月〜',
        keywords: /アプリ|app|ios|android|スマホ|システム|管理/i
      },
      automation: {
        name: 'AI・業務自動化',
        keywords: /自動|dx|業務|効率|ai|rpa|chatgpt|ワークフロー/i
      },
      seo: {
        name: 'SEO / MEO対策',
        price: '¥30,000/月〜',
        keywords: /seo|meo|検索|上位|集客|google|ランキング/i
      }
    },
    affiliates: {
      accounting: {
        keywords: /会計|経理|freee|弥生|青色申告|確定申告/i,
        msg: '弥生会計・freeeなどのクラウド会計ツールとの連携もご提案できます。お気軽にご相談ください。'
      },
      booking: {
        keywords: /予約|salon|美容|エステ|サロン|クリニック/i,
        msg: '予約管理システムの導入・カスタマイズもお任せください。サロン・クリニック向けの実績があります。'
      },
      cms: {
        keywords: /wix|wordpress|cms|ブログ|記事|更新/i,
        msg: 'WordPress・CMS構築も対応しています。自分で更新できるサイトをお作りします。'
      },
      sales: {
        keywords: /営業|crm|メール|顧客管理|リスト/i,
        msg: '営業自動化・CRM連携のご相談は無料DX診断から承っています。'
      }
    },
    faqs: [
      { q: /期間|納期|いつ|どのくら/i,   a: '最短7日〜お受けしています。規模により2〜6週間が目安です。詳しくは無料相談でお聞かせください。' },
      { q: /保守|アフター|修正|更新/i,    a: '納品後の保守・修正対応も月額¥10,000〜で承っています。長期的にサポートいたします。' },
      { q: /実績|事例|どんな|過去/i,      a: 'LP・業務システム・スマホアプリなど多数の実績があります。詳細はお問い合わせいただければ事例をご紹介します。' },
      { q: /支払|決済|分割|請求/i,        a: '銀行振込・クレジットカード対応。分割払いもご相談ください。' },
      { q: /相談|無料|聞きた|話した/i,    a: '無料相談は24時間受け付けています。お気軽にどうぞ！' }
    ]
  };
  /* ──────────────────────────────────────────────────── */

  var fab, widget, body, backbar, input, sendBtn;
  var isOpen = false;

  function now() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  function scrollBottom() {
    setTimeout(function () { body.scrollTop = body.scrollHeight; }, 60);
  }

  function appendMsg(role, text) {
    var wrap = el('div', 'cb-msg ' + role);
    var bubble = document.createElement('div');
    bubble.className = 'cb-bubble';
    if (role === 'bot') {
      bubble.innerHTML = text; // hardcoded trusted strings only
    } else {
      bubble.textContent = text; // user input — never innerHTML
    }
    var time = document.createElement('div');
    time.className = 'cb-time';
    time.textContent = now();
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    body.appendChild(wrap);
    scrollBottom();
    return wrap;
  }

  function appendChips(items, onClick) {
    var row = el('div', 'cb-chips');
    items.forEach(function (item) {
      var c = el('button', 'cb-chip', item.label);
      c.addEventListener('click', function () { onClick(item); });
      row.appendChild(c);
    });
    body.appendChild(row);
    scrollBottom();
    return row;
  }

  function appendCTAs(items) {
    var row = el('div', 'cb-ctas');
    items.forEach(function (item) {
      var b = el('button', 'cb-cta' + (item.big ? ' big' : '') + (item.ghost ? ' ghost' : ''), item.label);
      b.addEventListener('click', function () {
        if (item.href) window.open(item.href, item.blank ? '_blank' : '_self');
        if (item.fn) item.fn();
      });
      row.appendChild(b);
    });
    body.appendChild(row);
    scrollBottom();
    return row;
  }

  function appendRestartLink() {
    var btn = el('button', 'cb-restart', '↩ 最初に戻る');
    btn.addEventListener('click', welcome);
    body.appendChild(btn);
    scrollBottom();
  }

  function showBackbar(show) {
    backbar.style.display = show ? '' : 'none';
  }

  function typing(ms, cb) {
    var t = el('div', 'cb-msg bot');
    var dots = el('div', 'cb-typing');
    dots.innerHTML = '<i></i><i></i><i></i>';
    t.appendChild(dots);
    body.appendChild(t);
    scrollBottom();
    setTimeout(function () {
      body.removeChild(t);
      cb();
    }, ms);
  }

  /* ─── ウェルカム ─── */
  function welcome() {
    body.innerHTML = '';
    showBackbar(false);
    typing(600, function () {
      appendMsg('bot', 'こんにちは！\n<strong>藍</strong>です 😊<br>ClawTechのAIアシスタントです。\n\nご用件をお選びいただくか、\nお気軽に話しかけてください！');
      appendChips([
        { label: '💻 HP・サイト制作',   flow: 'homepage' },
        { label: '📱 アプリ開発',        flow: 'app' },
        { label: '🤖 AI・業務自動化',   flow: 'automation' },
        { label: '🔍 SEO / MEO対策',    flow: 'seo' },
        { label: '💰 料金を知りたい',    flow: 'pricing' },
        { label: '📋 無料DX診断',        flow: 'diagnosis' }
      ], function (item) {
        handleChip(item);
      });
    });
  }

  /* ─── チップ選択 ─── */
  function handleChip(item) {
    appendMsg('user', item.label);
    showBackbar(true);
    switch (item.flow) {
      case 'homepage':   flowService('homepage'); break;
      case 'app':        flowService('app');      break;
      case 'automation': flowAutomation();        break;
      case 'seo':        flowService('seo');      break;
      case 'pricing':    flowPricing();           break;
      case 'diagnosis':  flowDiagnosis();         break;
      default:           flowDefault();           break;
    }
  }

  /* ─── サービスフロー（汎用） ─── */
  function flowService(key) {
    var s = K.services[key];
    typing(700, function () {
      var priceInfo = s.price ? '\n💴 費用: ' + s.price : '';
      var turnInfo  = s.turnaround ? '\n⏱ 納期: ' + s.turnaround : '';
      var maintInfo = s.maintenance ? '\n🛠 保守: ' + s.maintenance : '';
      appendMsg('bot', '<strong>' + s.name + '</strong>' + priceInfo + turnInfo + maintInfo + '\n\n詳しくご相談しますか？');
      appendCTAs([
        { label: '📞 無料相談する', big: true, href: K.contact_link },
        { label: '📋 DX診断（30秒）', ghost: true, href: K.diagnosis_link, blank: true }
      ]);
      appendRestartLink();
    });
  }

  /* ─── 自動化フロー ─── */
  function flowAutomation() {
    typing(700, function () {
      appendMsg('bot', 'AI・業務自動化のご検討ですね！\nどんなお悩みが近いですか？');
      appendChips([
        { label: '⏰ 繰り返し作業を自動化したい', sub: 'auto_repeat' },
        { label: '📊 データ集計・レポートを自動化',  sub: 'auto_data' },
        { label: '💬 チャットbot・AI導入',            sub: 'auto_chat' },
        { label: '🔗 ツール間の連携',                 sub: 'auto_integrate' }
      ], function (item) {
        appendMsg('user', item.label);
        typing(600, function () {
          appendMsg('bot', 'ご状況わかりました！\n具体的な課題を無料相談でお聞きすると、最適な自動化プランをご提案できます。');
          appendCTAs([
            { label: '📞 無料相談する（24h返信）', big: true, href: K.contact_link },
            { label: '📋 DX診断で課題を整理', ghost: true, href: K.diagnosis_link, blank: true }
          ]);
          appendRestartLink();
        });
      });
    });
  }

  /* ─── 料金フロー ─── */
  function flowPricing() {
    typing(700, function () {
      appendMsg('bot',
        '💴 <strong>料金の目安</strong>\n\n' +
        '• HP制作: ¥49,800〜\n' +
        '• アプリ開発: ¥198,000〜（買い切り）\n' +
        '• AI・自動化: お見積もり\n' +
        '• SEO/MEO: ¥30,000/月〜\n\n' +
        '規模や機能によって変わります。\n無料相談でお気軽にお聞きください！'
      );
      appendCTAs([
        { label: '📞 無料相談する', big: true, href: K.contact_link },
        { label: '📋 DX診断（30秒）', ghost: true, href: K.diagnosis_link, blank: true }
      ]);
      appendRestartLink();
    });
  }

  /* ─── DX診断フロー ─── */
  function flowDiagnosis() {
    typing(500, function () {
      appendMsg('bot', '無料DX診断は30秒で完了します！\n現状の課題からベストな施策をご提案します。');
      appendCTAs([
        { label: '📋 DX診断を受ける（無料）', big: true, href: K.diagnosis_link, blank: true }
      ]);
      appendRestartLink();
    });
  }

  /* ─── デフォルトフロー（問い合わせへ） ─── */
  function flowDefault() {
    typing(500, function () {
      appendMsg('bot', 'ありがとうございます！\n詳しくは無料相談でお聞かせください。\n24時間以内にご返信します。');
      appendCTAs([
        { label: '📞 無料相談する', big: true, href: K.contact_link },
        { label: '📋 DX診断（30秒）', ghost: true, href: K.diagnosis_link, blank: true }
      ]);
      appendRestartLink();
    });
  }

  /* ─── 自由文入力のインテント判定 ─── */
  function handleFreeText(text) {
    appendMsg('user', text);
    showBackbar(true);

    var t = text;

    /* 1. FAQ先行マッチ */
    for (var i = 0; i < K.faqs.length; i++) {
      if (K.faqs[i].q.test(t)) {
        var ans = K.faqs[i].a;
        typing(600, function (a) { return function () {
          appendMsg('bot', a);
          appendCTAs([
            { label: '📞 無料相談する', href: K.contact_link },
            { label: '📋 DX診断', ghost: true, href: K.diagnosis_link, blank: true }
          ]);
          appendRestartLink();
        }; }(ans));
        return;
      }
    }

    /* 2. サービスキーワード */
    if (K.services.homepage.keywords.test(t)) { flowService('homepage'); return; }
    if (K.services.app.keywords.test(t))      { flowService('app');      return; }
    if (K.services.automation.keywords.test(t)) { flowAutomation();       return; }
    if (K.services.seo.keywords.test(t))      { flowService('seo');      return; }

    /* 3. アフィリエイト系キーワード */
    var affKeys = Object.keys(K.affiliates);
    for (var j = 0; j < affKeys.length; j++) {
      var aff = K.affiliates[affKeys[j]];
      if (aff.keywords.test(t)) {
        var msg = aff.msg;
        typing(600, function (m) { return function () {
          appendMsg('bot', m);
          appendCTAs([{ label: '📞 詳しく相談する', big: true, href: K.contact_link }]);
          appendRestartLink();
        }; }(msg));
        return;
      }
    }

    /* 4. 料金キーワード */
    if (/料金|値段|いくら|費用|price|cost/i.test(t)) { flowPricing(); return; }

    /* 5. デフォルト */
    flowDefault();
  }

  /* ─── 送信処理 ─── */
  function sendUserText() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = '';
    handleFreeText(text);
  }

  /* ─── 開閉 ─── */
  function openChat() {
    fab.classList.add('cb-hidden');
    widget.classList.add('cb-open');
    isOpen = true;
    input.focus();
  }

  function closeChat() {
    widget.classList.remove('cb-open');
    fab.classList.remove('cb-hidden');
    isOpen = false;
  }

  /* ─── 初期化 ─── */
  function init() {
    fab     = document.getElementById('cbFab');
    widget  = document.getElementById('cbWidget');
    body    = document.getElementById('cbBody');
    backbar = document.getElementById('cbBackbar');
    input   = document.getElementById('cbInput');
    sendBtn = document.getElementById('cbSend');

    if (!fab) return;

    fab.addEventListener('click', openChat);
    document.getElementById('cbMin').addEventListener('click', closeChat);
    document.getElementById('cbBackbarBtn').addEventListener('click', welcome);

    sendBtn.addEventListener('click', sendUserText);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserText();
      }
    });
    input.addEventListener('input', function () {
      this.style.height = '';
      this.style.height = Math.min(this.scrollHeight, 96) + 'px';
    });

    /* FABを表示してウェルカムメッセージを準備 */
    fab.classList.remove('cb-hidden');
    welcome();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
