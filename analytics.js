// Аналитика и рекламные пиксели сайта toimanager.app.
// Пока номера (ID) пустые — ничего не загружается и никуда не отправляется.
// Чтобы включить: вписать ID ниже и опубликовать сайт. После включения обновить политику конфиденциальности (раздел «Сайт»).
(() => {
  const ID = {
    ga4: '',      // Google Analytics 4, вид «G-XXXXXXXXXX»
    ym: '',       // Яндекс Метрика, номер счётчика, например «98765432»
    meta: '',     // Пиксель Meta (Instagram и Facebook), число из 15–16 цифр
    tiktok: '',   // Пиксель TikTok, вида «C1ABCDEF2GHIJK»
  };
  const add = (src) => { const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); };

  // Метки рекламы (utm_*) — запоминаем первые, чтобы видеть, откуда пришёл человек
  try {
    const q = new URLSearchParams(location.search);
    const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].filter((k) => q.get(k)).map((k) => [k, q.get(k)]);
    if (utm.length && !localStorage.getItem('tm_utm')) localStorage.setItem('tm_utm', JSON.stringify(Object.fromEntries(utm)));
  } catch { /* хранилище недоступно — не страшно */ }

  if (ID.ga4) {
    add(`https://www.googletagmanager.com/gtag/js?id=${ID.ga4}`);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', ID.ga4);
  }
  if (ID.ym) {
    window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); }; window.ym.l = Date.now();
    add('https://mc.yandex.ru/metrika/tag.js');
    window.ym(Number(ID.ym), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
  }
  if (ID.meta) {
    const f = window.fbq = function () { f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
    if (!window._fbq) window._fbq = f; f.push = f; f.loaded = true; f.version = '2.0'; f.queue = [];
    add('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', ID.meta); window.fbq('track', 'PageView');
  }
  if (ID.tiktok) {
    const t = window.ttq = window.ttq || [];
    ['page', 'track', 'identify'].forEach((m) => { t[m] = (...a) => t.push([m, ...a]); });
    add(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${ID.tiktok}&lib=ttq`);
    t.page();
  }

  // Единая отправка события во все включённые системы
  // Стандартные события пикселей: download_click → Lead, tester_click → Lead, pay_claim → Purchase, vendor_claim → Lead
  const STD = { download_click: 'Lead', tester_click: 'Lead', vendor_claim: 'Lead', pay_claim: 'Purchase' };
  window.tmTrack = (name, params = {}) => {
    try {
      if (ID.ga4 && window.gtag) window.gtag('event', name, params);
      if (ID.ym && window.ym) window.ym(Number(ID.ym), 'reachGoal', name, params);
      if (ID.meta && window.fbq) { if (STD[name]) window.fbq('track', STD[name], params); else window.fbq('trackCustom', name, params); }
      if (ID.tiktok && window.ttq) window.ttq.track(STD[name] === 'Purchase' ? 'CompletePayment' : STD[name] ? 'SubmitForm' : 'ClickButton', { content_name: name });
    } catch { /* аналитика не должна ломать сайт */ }
  };

  // Клики по элементам с атрибутом data-ev="имя_события"
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-ev]');
    if (el) window.tmTrack(el.dataset.ev, { label: (el.dataset.evLabel || el.textContent || '').trim().slice(0, 60), page: location.pathname });
  }, { capture: true });
})();
