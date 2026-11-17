// Плавающая кнопка «Написать в WhatsApp» с мягкой пульсацией и подсказкой.
// Номер — ниже. Пустой номер = кнопки нет. На страницах приглашений (/inv/) не подключается.
(() => {
  const PHONE = '996755666999'; // 0755 666 999
  if (!PHONE || document.getElementById('wa-fab')) return;

  const ky = document.documentElement.lang === 'ky' || new URLSearchParams(location.search).get('lang') === 'ky';
  const path = location.pathname;
  const T = ky
    ? { label: 'WhatsApp аркылуу жазуу', tip: 'Суроо барбы? WhatsApp аркылуу жазыңыз', close: 'Жабуу',
        msg: path.includes('/pro') ? 'Саламатсызбы! Безлимит төлөмү боюнча суроо:' : path.includes('/vendors') ? 'Саламатсызбы! Мен аткаруучумун, каталогго кошулгум келет:' : 'Саламатсызбы! Той Менеджер боюнча суроо:' }
    : { label: 'Написать в WhatsApp', tip: 'Есть вопрос? Напишите нам в WhatsApp', close: 'Закрыть',
        msg: path.includes('/pro') ? 'Здравствуйте! Вопрос по оплате Безлимита:' : path.includes('/vendors') ? 'Здравствуйте! Я исполнитель, хочу в каталог:' : 'Здравствуйте! Вопрос по Той Менеджер:' };
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(T.msg + ' ')}`;

  const css = `
  #wa-fab{position:fixed;right:max(16px,env(safe-area-inset-right));bottom:calc(16px + env(safe-area-inset-bottom));z-index:90;display:flex;align-items:center;gap:12px;font-family:Inter,system-ui,sans-serif}
  #wa-fab .wa-btn{position:relative;width:60px;height:60px;border-radius:50%;background:#1B9E55;color:#fff;display:grid;place-items:center;
    box-shadow:0 10px 24px rgba(16,110,58,.35),0 2px 6px rgba(16,110,58,.25);transition:transform .2s ease,box-shadow .2s ease;text-decoration:none}
  #wa-fab .wa-btn:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 14px 30px rgba(16,110,58,.42),0 3px 8px rgba(16,110,58,.25)}
  #wa-fab .wa-btn:focus-visible{outline:3px solid #5B3FD6;outline-offset:3px}
  #wa-fab .wa-btn svg{width:30px;height:30px;position:relative;z-index:1}
  #wa-fab .wa-btn::before,#wa-fab .wa-btn::after{content:"";position:absolute;inset:0;border-radius:50%;background:rgba(37,211,102,.45);z-index:0;animation:wa-pulse 2.6s cubic-bezier(.2,.6,.3,1) infinite}
  #wa-fab .wa-btn::after{animation-delay:1.3s}
  @keyframes wa-pulse{0%{transform:scale(1);opacity:.6}80%,100%{transform:scale(1.75);opacity:0}}
  #wa-fab .wa-tip{position:relative;max-width:230px;background:#fff;color:#1E1934;border-radius:16px;padding:12px 34px 12px 14px;font-size:14px;line-height:1.35;font-weight:500;
    box-shadow:0 10px 30px rgba(40,30,90,.16),0 1px 3px rgba(40,30,90,.08);cursor:pointer;opacity:0;transform:translateX(8px) scale(.96);transform-origin:right center;
    transition:opacity .35s ease,transform .35s ease;pointer-events:none}
  #wa-fab .wa-tip.on{opacity:1;transform:none;pointer-events:auto}
  #wa-fab .wa-tip::after{content:"";position:absolute;right:-6px;top:50%;width:12px;height:12px;background:#fff;transform:translateY(-50%) rotate(45deg);border-radius:2px}
  #wa-fab .wa-x{position:absolute;top:4px;right:4px;width:28px;height:28px;border:0;border-radius:50%;background:transparent;color:#5E5873;font-size:18px;line-height:1;cursor:pointer}
  #wa-fab .wa-x:hover{background:#F1EDFF;color:#1E1934}
  @media (prefers-reduced-motion:reduce){#wa-fab .wa-btn::before,#wa-fab .wa-btn::after{animation:none;opacity:0}#wa-fab .wa-tip{transition:none}}
  @media (max-width:600px){#wa-fab .wa-btn{width:56px;height:56px}#wa-fab .wa-tip{max-width:200px;font-size:13px}}
  @media print{#wa-fab{display:none}}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // Значок — простое облачко сообщения (не логотип WhatsApp)
  const icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    + '<path d="M20.5 11.6a8.4 8.4 0 0 1-12.3 7.5L3.5 20.5l1.4-4.6A8.4 8.4 0 1 1 20.5 11.6z"/><path d="M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01" stroke-width="2.6"/></svg>';
  const box = document.createElement('div'); box.id = 'wa-fab';
  box.innerHTML = `<div class="wa-tip" role="status"><span>${T.tip}</span><button type="button" class="wa-x" aria-label="${T.close}">×</button></div>`
    + `<a class="wa-btn" href="${href}" target="_blank" rel="noopener" aria-label="${T.label}" data-ev="whatsapp_click" data-ev-label="fab">${icon}</a>`;
  document.body.appendChild(box);

  const tip = box.querySelector('.wa-tip');
  const KEY = 'tm_wa_tip';
  let seen = false; try { seen = sessionStorage.getItem(KEY) === '1'; } catch { /* нет хранилища */ }
  const hide = () => { tip.classList.remove('on'); try { sessionStorage.setItem(KEY, '1'); } catch { /* ничего */ } };
  // Подсказка один раз за визит: через 7 секунд, сама прячется через 12
  if (!seen) setTimeout(() => { tip.classList.add('on'); setTimeout(hide, 12000); }, 7000);
  tip.querySelector('.wa-x').addEventListener('click', (e) => { e.stopPropagation(); hide(); });
  tip.addEventListener('click', () => { if (window.tmTrack) window.tmTrack('whatsapp_click', { label: 'tip', page: path }); hide(); window.open(href, '_blank', 'noopener'); });
  box.querySelector('.wa-btn').addEventListener('click', hide);
})();
