// Приглашение-открытка «Той Менеджер». Сейчас — демо (?t=ak-altyn | tunku, ?lang=ky | ru).
// Позже те же шаблоны будут получать данные тоя и гостя по личной ссылке (как страница /i/).
(() => {
  const $ = (id) => document.getElementById(id);
  const q = new URLSearchParams(location.search);
  const THEMES = { 'ak-altyn': { title: 'Ак алтын', music: 'music/ak-altyn.mp3', swatches: ['#FFFFFF', '#F1E6D2', '#D9BE8C', '#B48A3E'] },
                   'tunku': { title: 'Түнкү', music: 'music/tunku.mp3', swatches: ['#173E35', '#0F2A25', '#E9D7AE', '#C49A4A'] } };
  const theme = THEMES[q.get('t')] ? q.get('t') : 'ak-altyn';
  let lang = q.get('lang') === 'ru' ? 'ru' : (() => { try { return localStorage.getItem('invLang') || 'ky'; } catch { return 'ky'; } })();

  // ---------- Данные (демо) ----------
  const D = {
    a: 'Азамат', b: 'Айпери', initials: 'А · А',
    starts: '2026-12-08T11:00:00Z',            // 17:00 по Бишкеку
    venue: '«Алтын Той» той залы', address: { ky: 'Бишкек ш., Чүй проспектиси, 100', ru: 'г. Бишкек, проспект Чуй, 100' },
    guest: { ky: 'Таалай байке', ru: 'Таалай байке' }, party: 3,
    family: { ky: 'жана Асановдордун үй-бүлөсү', ru: 'и семья Асановых' },
    program: [['16:30', { ky: 'Конокторду тосуп алуу', ru: 'Встреча гостей' }], ['17:00', { ky: 'Тойдун башталышы', ru: 'Начало тоя' }],
              ['19:30', { ky: 'Жаштардын биринчи бийи', ru: 'Первый танец молодых' }], ['22:00', { ky: 'Той торту', ru: 'Свадебный торт' }]],
    wishes: [{ n: 'Гүлнара эже', t: { ky: 'Бактылуу болгула! Ак жолтой, түбөлүк бирге болгула.', ru: 'Будьте счастливы! Пусть дорога будет светлой, а вы — всегда вместе.' } },
             { n: 'Бакыт', t: { ky: 'Ынтымактуу, ырыскылуу үй-бүлө болгула!', ru: 'Крепкой, дружной и богатой вам семьи!' } }],
  };
  const T = {
    ky: {
      envTitle: 'Чакыруу', envKind: 'Үйлөнүү тою', envTo: 'Урматтуу', envHint: 'Ачуу үчүн мөөрдү басыңыз', sealLabel: 'Чакырууну ачуу',
      kindTitle: 'Үйлөнүү тоюна чакыруу',
      greet: (g) => `Ассалому алейкум, ${g}!`,
      text: (a, b) => `Сизди уулубуз ${a} менен келинибиз ${kyGen(b)} үйлөнүү тоюна арналган салтанаттуу дасторконубузга кадырлуу конок болууга чакырабыз.`,
      dayTitle: 'Той күнү', until: 'Тойго чейин', units: ['күн', 'саат', 'мүнөт', 'секунд'], at: 'саат',
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      days: ['Жекшемби', 'Дүйшөмбү', 'Шейшемби', 'Шаршемби', 'Бейшемби', 'Жума', 'Ишемби'],
      placeTitle: 'Өтүүчү жер', map: '2ГИСте ачуу', calendar: 'Календарга', programTitle: 'Той программасы',
      dressTitle: 'Дресс-код', dress: 'Ак, саргыч жана алтын түстөгү кийимдер менен келсеңиздер, кубанычтуу болобуз.',
      rsvpTitle: 'Жооп бериңиз', rsvpHint: (d) => `Келериңизди ${d} чейин ырастап коюңуз.`, yes: 'Барам', no: 'Бара албайм',
      howMany: 'Канча киши болосуздар?', send: 'Жооп жөнөтүү', change: 'Жоопту өзгөртүү',
      thanksYes: 'Рахмат! Сизди күтөбүз', thanksNo: 'Рахмат, түшүндүк', yesText: (n) => `Жообуңуз жөнөтүлдү: ${n} киши.`, noText: 'Жообуңуз жөнөтүлдү.',
      wishesTitle: 'Тилектер', wishesHint: 'Жаштарга жылуу сөзүңүздү калтырыңыз', wishName: 'Атыңыз', wishText: 'Тилегиңиз', wishSend: 'Тилек калтыруу',
      respect: 'Урматтоо менен,', made: 'Чакыруу жасалган:', music: 'Музыка', deadline: (d) => `${d.getUTCDate()}-${T.ky.monthsGen[d.getUTCMonth()]}`,
      monthsGen: ['январга', 'февралга', 'мартка', 'апрелге', 'майга', 'июнга', 'июлга', 'августка', 'сентябрга', 'октябрга', 'ноябрга', 'декабрга'],
    },
    ru: {
      envTitle: 'Приглашение', envKind: 'на свадьбу', envTo: 'Дорогой', envHint: 'Нажмите на печать, чтобы открыть', sealLabel: 'Открыть приглашение',
      kindTitle: 'Приглашение на свадьбу',
      greet: (g) => `Ассалому алейкум, ${g}!`,
      text: (a, b) => `Приглашаем вас стать дорогим гостем на праздничном дасторконе в честь свадьбы нашего сына ${a} и нашей невестки ${b}.`,
      dayTitle: 'День тоя', until: 'До тоя осталось', units: ['дней', 'часов', 'минут', 'секунд'], at: 'в',
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      placeTitle: 'Место', map: 'Открыть в 2ГИС', calendar: 'В календарь', programTitle: 'Программа',
      dressTitle: 'Дресс-код', dress: 'Будем рады, если вы выберете наряды в белых, бежевых и золотых тонах.',
      rsvpTitle: 'Ваш ответ', rsvpHint: (d) => `Пожалуйста, подтвердите присутствие до ${d}.`, yes: 'Приду', no: 'Не смогу',
      howMany: 'Сколько вас будет?', send: 'Отправить ответ', change: 'Изменить ответ',
      thanksYes: 'Спасибо! Ждём вас', thanksNo: 'Спасибо, что ответили', yesText: (n) => `Ответ отправлен: ${n} чел.`, noText: 'Ответ отправлен.',
      wishesTitle: 'Пожелания', wishesHint: 'Оставьте молодым тёплые слова', wishName: 'Ваше имя', wishText: 'Ваше пожелание', wishSend: 'Оставить пожелание',
      respect: 'С уважением,', made: 'Приглашение сделано в', music: 'Музыка',
      deadline: (d) => `${d.getUTCDate()} ${['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][d.getUTCMonth()]}`,
    },
  };
  // Родительный падеж в кыргызском: Айпери → Айперинин, Азамат → Азаматтын, Нурбек → Нурбектин
  function kyGen(name) {
    const w = name.toLowerCase(), last = w.slice(-1);
    const v = [...w].reverse().find((c) => 'аыеэиоуөүёюя'.includes(c)) || 'а';
    const vow = 'аыё'.includes(v) || v === 'я' ? 'ы' : 'еэи'.includes(v) ? 'и' : 'оую'.includes(v) ? 'у' : 'ү';
    const cons = 'аыеэиоуөүёюя'.includes(last) ? 'н' : 'кпстфхчшщц'.includes(last) ? 'т' : 'д';
    return name + cons + vow + 'н';
  }
  const bk = (iso) => new Date(Date.parse(iso) + 6 * 3600e3);   // время по Бишкеку в полях UTC
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  document.body.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'tunku' ? '#17433A' : '#F3EADB';

  // ---------- Восковая печать ----------
  function sealSvg() {
    const R = 60, pts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const r = R - 3.2 * (1 + Math.sin(a * 11)) / 2 - 1.6 * Math.sin(a * 23 + 1) * Math.sin(a * 3);
      pts.push(`${(70 + r * Math.cos(a)).toFixed(1)},${(70 + r * Math.sin(a)).toFixed(1)}`);
    }
    const outline = `M${pts.join('L')}Z`;
    const body = `
      <path d="${outline}" fill="url(#wax)"/>
      <path d="${outline}" fill="url(#waxHi)"/>
      <circle cx="70" cy="70" r="42" fill="none" stroke="var(--wax2)" stroke-opacity=".55" stroke-width="3"/>
      <circle cx="70" cy="70" r="38.5" fill="url(#waxIn)"/>
      <circle cx="70" cy="70" r="36" fill="none" stroke="var(--wax-ink)" stroke-opacity=".35" stroke-width=".8" stroke-dasharray="1.5 2.6"/>
      <text x="70" y="79" text-anchor="middle" font-family="Cormorant, serif" font-weight="600" font-size="26" letter-spacing="1" fill="#000" fill-opacity=".28" transform="translate(0 1.2)">${esc(D.initials)}</text>
      <text x="70" y="79" text-anchor="middle" font-family="Cormorant, serif" font-weight="600" font-size="26" letter-spacing="1" fill="var(--wax-ink)" fill-opacity=".9">${esc(D.initials)}</text>`;
    const crack = 'M70,0 L66,28 L75,46 L64,70 L77,92 L67,114 L71,140';
    return `
      <svg viewBox="0 0 140 140" class="whole" aria-hidden="true">
        <defs>
          <radialGradient id="wax" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="var(--wax1)"/><stop offset=".75" stop-color="var(--wax2)"/><stop offset="1" stop-color="var(--wax2)"/></radialGradient>
          <radialGradient id="waxHi" cx="32%" cy="26%" r="40%"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
          <radialGradient id="waxIn" cx="60%" cy="65%" r="70%"><stop offset="0" stop-color="var(--wax1)"/><stop offset="1" stop-color="var(--wax2)"/></radialGradient>
          <clipPath id="cl"><path d="${crack} L0,140 L0,0 Z"/></clipPath>
          <clipPath id="cr"><path d="${crack} L140,140 L140,0 Z"/></clipPath>
        </defs>${body}
      </svg>
      <svg viewBox="0 0 140 140" class="half l" aria-hidden="true"><g clip-path="url(#cl)">${body}</g></svg>
      <svg viewBox="0 0 140 140" class="half r" aria-hidden="true"><g clip-path="url(#cr)">${body}</g></svg>`;
  }
  $('seal').innerHTML = sealSvg();

  // ---------- Тексты ----------
  function render() {
    const L = T[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach((el) => { const v = L[el.dataset.t]; if (typeof v === 'string') el.textContent = v; });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $('seal').setAttribute('aria-label', L.sealLabel);
    $('envKind').textContent = L.envKind; $('envWho').textContent = D.guest[lang];
    $('kindTitle').textContent = L.kindTitle;
    $('nameA').textContent = D.a; $('nameB').textContent = D.b;
    const d = bk(D.starts);
    $('heroDate').textContent = `${pad(d.getUTCDate())} · ${pad(d.getUTCMonth() + 1)} · ${d.getUTCFullYear()}`;
    $('greet').textContent = L.greet(D.guest[lang]);
    $('invText').textContent = L.text(D.a, D.b);
    $('month').textContent = L.months[d.getUTCMonth()];
    const day = d.getUTCDate(), dim = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
    const cell = (n, cls) => (n >= 1 && n <= dim ? `<span class="${cls}">${n}</span>` : `<span class="${cls}"></span>`);
    $('week').innerHTML = cell(day - 2, '') + cell(day - 1, 'n1') +
      `<span class="day gold"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86 C20 64 8 48 8 32 C8 19 18 10 30 10 C39 10 46 15 50 23 C54 15 61 10 70 10 C82 10 92 19 92 32 C92 48 80 64 50 86 Z" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>${day}</span>` +
      cell(day + 1, 'n1') + cell(day + 2, '');
    $('weekday').textContent = L.days[d.getUTCDay()];
    $('time').textContent = `${L.at} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
    $('venue').textContent = D.venue; $('address').textContent = D.address[lang];
    $('map').href = `https://2gis.kg/search/${encodeURIComponent(D.venue + ', ' + D.address.ru)}`;
    $('program').innerHTML = D.program.map(([t, x]) => `<li><b>${t}</b><span>${esc(x[lang])}</span></li>`).join('');
    $('dress').textContent = L.dress;
    $('swatches').innerHTML = THEMES[theme].swatches.map((c) => `<i style="background:${c}"></i>`).join('');
    const dl = new Date(Date.parse(D.starts) - 7 * 864e5 + 6 * 3600e3);
    $('rsvpHint').textContent = L.rsvpHint(L.deadline(dl));
    $('wishName').placeholder = L.wishName; $('wishText').placeholder = L.wishText;
    renderWishes(); renderRsvp(); tick();
    $('closingNames').textContent = `${D.a} & ${D.b}`; $('family').textContent = D.family[lang];
    $('music').setAttribute('aria-label', L.music);
  }

  // ---------- Обратный отсчёт ----------
  function tick() {
    const L = T[lang]; let s = Math.max(0, Math.floor((Date.parse(D.starts) - Date.now()) / 1000));
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    $('countdown').innerHTML = v.map((n, i) => `<div><b class="gold">${pad(n)}</b><small>${L.units[i]}</small></div>`).join('');
  }
  setInterval(tick, 1000);

  // ---------- Ответ гостя (в демо никуда не отправляется) ----------
  let answer = null, count = D.party, sent = false;
  function renderRsvp() {
    const L = T[lang];
    document.querySelectorAll('[data-answer]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.answer === answer)));
    $('countBox').hidden = answer !== 'yes'; $('count').textContent = count; $('send').disabled = !answer;
    $('rsvpForm').hidden = sent; $('thanks').hidden = !sent;
    if (sent) { $('thanksTitle').textContent = answer === 'yes' ? L.thanksYes : L.thanksNo; $('thanksText').textContent = answer === 'yes' ? L.yesText(count) : L.noText; }
  }
  document.querySelectorAll('[data-answer]').forEach((b) => b.onclick = () => { answer = b.dataset.answer; renderRsvp(); });
  $('minus').onclick = () => { count = Math.max(1, count - 1); renderRsvp(); };
  $('plus').onclick = () => { count = Math.min(20, count + 1); renderRsvp(); };
  $('send').onclick = () => { sent = true; renderRsvp(); };
  $('change').onclick = () => { sent = false; renderRsvp(); };

  // ---------- Пожелания (в демо — только на этой странице) ----------
  const mine = [];
  function renderWishes() {
    $('wishes').innerHTML = [...mine, ...D.wishes.map((w) => ({ n: w.n, t: w.t[lang] }))]
      .map((w) => `<div class="wish"><p>«${esc(w.t)}»</p><b>— ${esc(w.n)}</b></div>`).join('');
  }
  $('wishForm').onsubmit = (e) => {
    e.preventDefault();
    const n = $('wishName').value.trim(), t = $('wishText').value.trim();
    if (!n) { $('wishName').focus(); return; } if (!t) { $('wishText').focus(); return; }
    mine.unshift({ n, t }); $('wishText').value = ''; renderWishes();
  };

  // ---------- Календарь ----------
  $('ics').onclick = () => {
    const s = new Date(D.starts), e = new Date(+s + 5 * 3600e3), f = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Toi Manager//RU', 'BEGIN:VEVENT', `UID:${f(s)}-toi@toimanager.app`, `DTSTAMP:${f(new Date())}`,
      `DTSTART:${f(s)}`, `DTEND:${f(e)}`, `SUMMARY:${T[lang].kindTitle}: ${D.a} & ${D.b}`, `LOCATION:${D.venue}, ${D.address[lang]}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'toi.ics';
    document.body.appendChild(a); a.click(); a.remove();
  };

  // ---------- Язык ----------
  document.querySelectorAll('[data-lang]').forEach((b) => b.onclick = () => {
    lang = b.dataset.lang; try { localStorage.setItem('invLang', lang); } catch {}
    render();
  });

  // ---------- Музыка ----------
  const audio = $('audio'); audio.src = THEMES[theme].music; audio.volume = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fadeTo(v, ms) {
    const from = audio.volume, t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); try { audio.volume = from + (v - from) * k; } catch {} if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function play() { audio.play().then(() => { $('music').classList.remove('off'); fadeTo(0.55, 2500); }).catch(() => $('music').classList.add('off')); }
  $('music').onclick = () => {
    if (audio.paused) play(); else { audio.pause(); $('music').classList.add('off'); }
  };

  // ---------- Открыть конверт ----------
  let opened = false;
  function open() {
    if (opened) return; opened = true;
    play();   // звук можно включить только после нажатия — печать как раз им и является
    $('seal').classList.add('broken');
    requestAnimationFrame(() => requestAnimationFrame(() => $('seal').classList.add('fly')));
    $('envelope').classList.add('open');
    $('page').removeAttribute('aria-hidden');
    setTimeout(() => {
      document.body.classList.remove('locked'); $('music').hidden = false;
      document.querySelectorAll('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 140));
    }, reduce ? 0 : 1400);
    setTimeout(() => $('envelope').classList.add('gone'), reduce ? 50 : 2500);
  }
  $('seal').onclick = open;

  // Появление блоков при прокрутке
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && opened) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { threshold: 0.15 });
  document.querySelectorAll('main .reveal').forEach((el) => io.observe(el));

  // Золотая пыль
  const dust = $('dust');
  if (!reduce) for (let i = 0; i < 22; i++) {
    const s = document.createElement('i');
    s.style.left = `${Math.random() * 100}%`; s.style.top = `${60 + Math.random() * 50}%`;
    s.style.animationDelay = `${-Math.random() * 14}s`; s.style.animationDuration = `${11 + Math.random() * 8}s`;
    s.style.transform = `scale(${0.6 + Math.random()})`; dust.appendChild(s);
  }

  // Переключатель шаблонов — только в демо
  const bar = $('demoBar'); bar.hidden = false;
  bar.innerHTML = Object.entries(THEMES).map(([k, v]) => `<a href="?t=${k}&lang=${lang}" aria-current="${k === theme}">${v.title}</a>`).join('');

  render();
})();
