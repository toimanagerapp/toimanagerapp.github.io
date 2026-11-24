// Приглашение-открытка «Той Менеджер»: конверт с восковой печатью → страница с прокруткой.
// Личная ссылка: /i/?t=<токен приглашения> (перенаправляет сюда), общая: ?c=<код открытки>.
// Без токена — демо (?theme=ak-altyn | tunku). Данные берутся из базы через public_card.
// ?preview=1 — живой предпросмотр в конструкторе на сайте: данные приходят из родительской страницы (postMessage).
// ?own=1 — открыл сам организатор: отметку «гость открыл» не ставим.
(() => {
  const SB = 'https://ybygcijdpswvqrkxyimi.supabase.co';
  const KEY = 'sb_publishable_AMNeSGIK-aTmllo1Q13bNw_aTCbRkPn'; // публичный ключ: даёт доступ только к одному приглашению по токену
  const $ = (id) => document.getElementById(id);
  const q = new URLSearchParams(location.search);
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const token = [q.get('t'), q.get('c')].find((x) => x && UUID.test(x)) || null;
  const THEMES = {
    'ak-altyn': { title: 'Ак алтын', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFFFF', '#F1E6D2', '#D9BE8C', '#B48A3E'], color: '#F3EADB' },
    'tunku': { title: 'Түнкү', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#173E35', '#0F2A25', '#E9D7AE', '#C49A4A'], color: '#17433A' },
    'tun': { title: 'Түн', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#16213F', '#0D1530', '#EFE6D2', '#C49A4A'], color: '#0D1530' },
    'ak': { title: 'Ак', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFFFF', '#F1E6D2', '#A87F38', '#7A1E2C'], color: '#F8F3E9' },
    'anar': { title: 'Анар', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#5A1424', '#3A0D18', '#F5E8D8', '#C9A04F'], color: '#3A0D18' },
    'jashyl': { title: 'Жашыл', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#0F3A31', '#0D2B25', '#F1E8D6', '#C49A4A'], color: '#0D2B25' },
    'bermet': { title: 'Бермет', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFAF8', '#F5E6E1', '#DDA2A9', '#B07A5E'], color: '#FBF3F0' },
    'asman': { title: 'Асман', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FBFDFF', '#E3ECF4', '#5D8AB8', '#2F5D8A'], color: '#F2F6FA' },
    'kiyiz': { title: 'Кийиз', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FCF7EE', '#EDE1CE', '#C94A35', '#A3271F'], color: '#F6EEE1' },
    'boz': { title: 'Боз', music: '/inv/music/bakyt-kushu.mp3', swatches: ['#F7F6F3', '#E4E2DE', '#94989C', '#45494D'], color: '#EEEDEA' },
    // SCENES:BEGIN (tools/scenes/scenes.py)
    'ala-too': { title: 'Ала-Тоо', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFCF8', '#EEE3D8', '#D7A86E', '#6E3B5A'], color: '#F7F1EA' },
    'boz-uy': { title: 'Боз үй', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFCF8', '#EEE3D8', '#D7A86E', '#6E3B5A'], color: '#F7F1EA' },
    'jibek': { title: 'Жибек', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFDF8', '#F4ECDD', '#E3C77E', '#8A6A2C'], color: '#FBF7EF' },
    'barhat': { title: 'Бархат', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#561727', '#4A1220', '#F6E2A8', '#F4DFA6'], color: '#3A0D18' },
    'bilerik': { title: 'Билерик', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#14443A', '#113A31', '#F2DA9C', '#F2DA9C'], color: '#0D2B25' },
    'shokulo': { title: 'Шөкүлө', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#561727', '#4A1220', '#F6E2A8', '#F4DFA6'], color: '#3A0D18' },
    'jurkan': { title: 'Жууркан', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFAF3', '#F0E0CE', '#D86A45', '#A3352A'], color: '#F8EEE3' },
    'shyrdak': { title: 'Шырдак', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FCF7EE', '#EDE1CE', '#D2563F', '#A3271F'], color: '#F6EEE1' },
    'ak-kalpak': { title: 'Ак калпак', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FBFDFF', '#E3ECF4', '#6F97C2', '#2F5D8A'], color: '#F2F6FA' },
    'kok-asman': { title: 'Көк асман', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FBFDFF', '#E3ECF4', '#6F97C2', '#2F5D8A'], color: '#F2F6FA' },
    'beshik': { title: 'Бешик', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFAF8', '#F5E6E1', '#CF9098', '#9A5560'], color: '#FBF3F0' },
    'ala-jip': { title: 'Ала жип', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFCF6', '#EDE3D4', '#C9A57A', '#6B4A2E'], color: '#F7F1E8' },
    'altyn-kuz': { title: 'Алтын күз', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#FFFBF4', '#F2E4CF', '#D9A55A', '#8A5A1E'], color: '#FAF2E6' },
    'tunku-asman': { title: 'Түнкү асман', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#142048', '#101A3E', '#F4DFA6', '#F4DFA6'], color: '#0B1230' },
    'tuman': { title: 'Туман', scene: true, music: '/inv/music/bakyt-kushu.mp3', swatches: ['#F7F6F3', '#E4E2DE', '#7E8286', '#45494D'], color: '#EEEDEA' },
    // SCENES:END
  };
  // Видео-конверты (4 с, 720×1280): кадр-заставка .jpg и ролик .mp4 в /inv/env/. light — светлый конверт, тёмный текст
  // Готовые видео-конверты (остальные добавляются по мере готовности роликов; неизвестный — обычный конверт)
  const ENVS = { navy: { card: true, webp: true } };   // ivory: { light: true }, garnet: {}, emerald: {}

  // Пример на компьютере: показываем приглашение «в телефоне» по центру (iframe с той же страницей),
  // фон — размытый кадр конверта/фото пары. ?full=1 — открыть на весь экран. Личные ссылки гостей не трогаем.
  if (!token && q.get('preview') !== '1' && q.get('full') !== '1' && window.top === window
      && matchMedia('(min-width: 860px) and (min-aspect-ratio: 1/1)').matches) {
    const ru = q.get('lang') === 'ru';
    const th = THEMES[q.get('theme')] ? q.get('theme') : 'ak-altyn';
    const env = ENVS[q.get('env')] ? q.get('env') : null;
    const kind = q.get('kind');
    const bg = env ? (ENVS[env].webp ? `/inv/env/${env}-poster.webp` : `/inv/env/${env}.jpg`) : (!kind || kind === 'kyz_uzatuu' || kind === 'wedding') ? '/inv/demo/0.webp' : '';
    const inner = new URL(location.href); inner.searchParams.set('inframe', '1');
    const full = new URL(location.href); full.searchParams.set('full', '1');
    const create = `/create/${ru ? '' : '?lang=ky'}`;
    document.body.className = 'dframe-page';
    document.body.removeAttribute('data-theme');
    document.body.style.setProperty('--dframe-color', THEMES[th].color);
    if (bg) document.body.style.setProperty('--dframe-bg', `url(${bg})`);
    document.body.innerHTML = `<div class="dframe-bg" aria-hidden="true"></div>
      <div class="dframe"><iframe id="dframe" src="${inner}" title="${ru ? 'Пример приглашения' : 'Чакыруунун үлгүсү'}" allow="autoplay; fullscreen"></iframe></div>
      <div class="dframe-side">
        <p>${ru ? 'Так гость увидит приглашение на&nbsp;телефоне' : 'Конок чакырууну телефондон ушинтип көрөт'}</p>
        <a class="dframe-cta" href="${create}">${ru ? 'Создать своё приглашение' : 'Өз чакырууңузду түзүү'}</a>
        <a class="dframe-full" href="${full}">${ru ? 'Открыть на весь экран' : 'Толук экранда ачуу'}</a>
      </div>`;
    // колесо мыши и клавиши над размытым фоном листают само приглашение — как обычную страницу
    const fr = document.getElementById('dframe');
    const win = () => { try { return fr.contentWindow; } catch { return null; } };
    addEventListener('wheel', (e) => { const w = win(); if (w) { w.scrollBy({ top: e.deltaY, left: 0 }); } }, { passive: true });
    addEventListener('keydown', (e) => {
      const w = win(); if (!w) return;
      const step = { ArrowDown: 60, ArrowUp: -60, PageDown: innerHeight * .9, PageUp: -innerHeight * .9, ' ': innerHeight * .9 }[e.key];
      if (step) { e.preventDefault(); w.scrollBy({ top: step, behavior: 'smooth' }); }
    });
    fr.addEventListener('load', () => { try { fr.contentWindow.focus(); } catch {} });
    return;
  }
  const INFRAME = window.top !== window;
  if (INFRAME) document.documentElement.classList.add('inframe');
  // путь в хранилище или (в предпросмотре) готовый адрес картинки — blob:, data:, https:
  const photo = (path) => (/^(blob:|data:|https:|\/inv\/demo\/)/.test(path) ? path : `${SB}/storage/v1/object/public/invite-photos/${path}`);
  const PREVIEW = q.get('preview') === '1';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const pad = (n) => String(n).padStart(2, '0');
  const bk = (iso) => new Date(Date.parse(iso) + 6 * 3600e3);   // время по Бишкеку в полях UTC
  async function rpc(name, body) {
    const r = await fetch(`${SB}/rest/v1/rpc/${name}`, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) { const e = new Error(await r.text()); e.status = r.status; throw e; }
    const t = await r.text(); return t ? JSON.parse(t) : null;
  }

  // ---------- Кыргызские падежи: Айпери → Айперинин / Айперини, Азамат → Азаматтын / Азаматты ----------
  const VOW = 'аыеэиоуөүёюя';
  function kySuffix(name, gen) {
    const w = name.trim().toLowerCase(), last = w.slice(-1);
    const v = [...w].reverse().find((c) => VOW.includes(c)) || 'а';
    const vow = 'аыёя'.includes(v) ? 'ы' : 'еэи'.includes(v) ? 'и' : 'оую'.includes(v) ? 'у' : 'ү';
    const cons = VOW.includes(last) ? 'н' : 'кпстфхчшщц'.includes(last) ? 'т' : 'д';
    return name.trim() + cons + vow + (gen ? 'н' : '');
  }
  const kyGen = (n) => kySuffix(n, true), kyAcc = (n) => kySuffix(n, false);

  // ---------- Тексты ----------
  const KIND = {
    wedding: { ky: ['Үйлөнүү тою', 'Үйлөнүү тоюна чакыруу'], ru: ['на свадьбу', 'Приглашение на свадьбу'], heart: true },
    kyz_uzatuu: { ky: ['Кыз узатуу', 'Кыз узатуу тоюна чакыруу'], ru: ['на кыз узатуу', 'Приглашение на кыз узатуу'], heart: true },
    sunnot: { ky: ['Сүннөт той', 'Сүннөт тойго чакыруу'], ru: ['на сүннөт той', 'Приглашение на сүннөт той'] },
    beshik: { ky: ['Бешик той', 'Бешик тойго чакыруу'], ru: ['на бешик той', 'Приглашение на бешик той'] },
    tushoo: { ky: ['Тушоо кесүү', 'Тушоо кесүү тоюна чакыруу'], ru: ['на тушоо кесүү', 'Приглашение на тушоо кесүү'] },
    jubilee: { ky: ['Маараке', 'Мааракеге чакыруу'], ru: ['на юбилей', 'Приглашение на юбилей'] },
    memorial: { ky: ['Эскерүү ашы', 'Эскерүү ашына чакыруу'], ru: ['на аш', 'Приглашение на аш'] },
    other: { ky: ['Той', 'Тойго чакыруу'], ru: ['на праздник', 'Приглашение'] },
  };
  function inviteText(kind, from, a, b, lang) {
    const ky = lang === 'ky';
    switch (kind) {
      case 'wedding':
        if (!b) break;
        if (from === 'bride_parents') return ky
          ? `Сизди кызыбыз ${b} менен күйөө балабыз ${kyGen(a)} үйлөнүү тоюна арналган салтанаттуу дасторконубузга кадырлуу конок болууга чакырабыз.`
          : `Наша дочь ${b} и наш зять ${a} создают семью. Приглашаем вас стать дорогим гостем на праздничном дасторконе в честь их свадьбы.`;
        if (from === 'couple') return ky
          ? 'Сизди биздин үйлөнүү тоюбузга арналган салтанаттуу кечеге кадырлуу конок болууга чакырабыз.'
          : 'Приглашаем вас разделить с нами радость — на праздничный вечер в честь нашей свадьбы.';
        return ky
          ? `Сизди уулубуз ${a} менен келинибиз ${kyGen(b)} үйлөнүү тоюна арналган салтанаттуу дасторконубузга кадырлуу конок болууга чакырабыз.`
          : `Наш сын ${a} и наша невестка ${b} создают семью. Приглашаем вас стать дорогим гостем на праздничном дасторконе в честь их свадьбы.`;
      case 'kyz_uzatuu': return ky
        ? `Сизди кызыбыз ${kyAcc(a)} узатуу тоюна арналган салтанаттуу дасторконубузга кадырлуу конок болууга чакырабыз.`
        : `Мы провожаем нашу дочь ${a} в новую семью. Приглашаем вас на кыз узатуу — праздничный дасторкон в её честь.`;
      case 'sunnot': return ky
        ? `Сизди уулубуз ${kyGen(a)} сүннөт тоюна кадырлуу конок болууга чакырабыз.`
        : `Приглашаем вас на сүннөт той. Виновник торжества — наш сын ${a}.`;
      case 'beshik': return ky
        ? `Сизди ${kyGen(a)} бешик тоюна кадырлуу конок болууга чакырабыз.`
        : `Приглашаем вас на бешик той — праздник в честь нашего малыша ${a}.`;
      case 'tushoo': return ky
        ? `Сизди ${kyGen(a)} тушоо кесүү тоюна кадырлуу конок болууга чакырабыз.`
        : `${a} делает первые шаги! Приглашаем вас на тушоо кесүү.`;
      case 'jubilee': return ky
        ? `Сизди ${kyGen(a)} мааракесине арналган салтанаттуу кечеге кадырлуу конок болууга чакырабыз.`
        : `Приглашаем вас на праздничный вечер: ${a} отмечает юбилей.`;
      case 'memorial': return ky
        ? `Сизди ${kyGen(a)} элесине арналган ашка чакырабыз.`
        : `Приглашаем вас на аш — почтить память: ${a}.`;
    }
    return ky ? 'Сизди салтанаттуу кечебизге кадырлуу конок болууга чакырабыз.' : 'Приглашаем вас на наш праздник.';
  }
  const T = {
    ky: {
      envTitle: 'Чакыруу', envTo: 'Урматтуу', guestsAll: 'коноктор', envHint: 'Ачуу үчүн мөөрдү басыңыз', loading: 'Жүктөлүүдө…', sealLabel: 'Чакырууну ачуу',
      greet: (g) => `Урматтуу ${g}!`, greetAll: 'Урматтуу коноктор!', party: (n) => `Сизди ${n} киши менен күтөбүз.`,
      dayTitle: 'Той күнү', dayMemorial: 'Аш күнү', until: 'Тойго чейин', units: ['күн', 'саат', 'мүнөт', 'секунд'], at: 'саат',
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthsGen: ['январга', 'февралга', 'мартка', 'апрелге', 'майга', 'июнга', 'июлга', 'августка', 'сентябрга', 'октябрга', 'ноябрга', 'декабрга'],
      days: ['Жекшемби', 'Дүйшөмбү', 'Шейшемби', 'Шаршемби', 'Бейшемби', 'Жума', 'Ишемби'],
      placeTitle: 'Өтүүчү жер', map: '2ГИСте ачуу', calendar: 'Календарга', programTitle: 'Той программасы',
      dressTitle: 'Дресс-код', dress: 'Ак, саргыч жана алтын түстөгү кийимдер менен келсеңиздер, кубанычтуу болобуз.',
      rsvpTitle: 'Жооп бериңиз', rsvpHint: 'Келериңизди ырастап коюңуз.', rsvpBy: (d) => `Келериңизди ${d.getUTCDate()}-${T.ky.monthsGen[d.getUTCMonth()]} чейин ырастап коюңуз.`,
      yes: 'Барам', no: 'Бара албайм', howMany: 'Канча киши болосуздар?', send: 'Жооп жөнөтүү', sending: 'Жөнөтүлүүдө…', change: 'Жоопту өзгөртүү',
      yourName: 'Атыңыз жана фамилияңыз', nameNeeded: 'Атыңызды жазыңыз',
      thanksYes: 'Рахмат! Сизди күтөбүз', thanksNo: 'Рахмат, түшүндүк', yesText: (n) => `Жообуңуз жөнөтүлдү: ${n} киши.`, noText: 'Жообуңуз жөнөтүлдү.',
      past: 'Той өтүп кетти. Келгениңизге рахмат!', sendError: 'Жөнөтүлгөн жок. Интернетти текшерип, кайра аракет кылыңыз.',
      wishesTitle: 'Тилектер', wishesHint: 'Жылуу сөзүңүздү калтырыңыз', wishName: 'Атыңыз', wishText: 'Тилегиңиз', wishSend: 'Тилек калтыруу',
      wishPrivate: 'Тилегиңизди үй-ээлери гана көрөт.', wishThanks: 'Рахмат! Тилегиңиз жөнөтүлдү.',
      respect: 'Урматтоо менен,', made: 'Чакыруу жасалган:', music: 'Музыка', galleryTitle: 'Сүрөттөр', tapOpen: 'Ачуу үчүн басыңыз',
      madeQ: 'Сиз да той камдап жатасызбы?', madeS: 'Ушундай чакырууну 5 мүнөттө жасаңыз — тиркеме орнотпостон. Акысыз сынап көрүңүз.', madeGo: 'Чакыруу жасоо',
      thanksCta: 'Сиз да той камдап жатасызбы? Бул чакыруу Той Менеджерде жасалган →',
      oopsTitle: 'Чакыруу табылган жок', oopsText: 'Шилтеме толук көчүрүлбөй калгандыр же уюштуруучулар чакырууну өчүрүшкөн. Шилтемени кайра жөнөтүүсүн сураныңыз.',
      oopsNet: 'Интернет жок окшойт. Байланышты текшерип, баракты жаңылаңыз.',
      wmRibbon: 'Үлгү', wmBar: 'Сынамык версия · Той Менеджер',
    },
    ru: {
      envTitle: 'Приглашение', envTo: 'Дорогой гость', guestsAll: 'гости', envHint: 'Нажмите на печать, чтобы открыть', loading: 'Загружаем…', sealLabel: 'Открыть приглашение',
      greet: (g) => `Здравствуйте, ${g}!`, greetAll: 'Дорогие гости!', party: (n) => `Ждём вас: ${n} чел.`,
      dayTitle: 'День тоя', dayMemorial: 'Дата', until: 'До тоя осталось', units: ['дней', 'часов', 'минут', 'секунд'], at: 'в',
      months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthsGen: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
      days: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      placeTitle: 'Место', map: 'Открыть в 2ГИС', calendar: 'В календарь', programTitle: 'Программа',
      dressTitle: 'Дресс-код', dress: 'Будем рады, если вы выберете наряды в белых, бежевых и золотых тонах.',
      rsvpTitle: 'Ваш ответ', rsvpHint: 'Пожалуйста, подтвердите, что придёте.', rsvpBy: (d) => `Пожалуйста, подтвердите присутствие до ${d.getUTCDate()} ${T.ru.monthsGen[d.getUTCMonth()]}.`,
      yes: 'Приду', no: 'Не смогу', howMany: 'Сколько вас будет?', send: 'Отправить ответ', sending: 'Отправляем…', change: 'Изменить ответ',
      yourName: 'Ваше имя и фамилия', nameNeeded: 'Напишите, пожалуйста, ваше имя',
      thanksYes: 'Спасибо! Ждём вас', thanksNo: 'Спасибо, что ответили', yesText: (n) => `Ответ отправлен: ${n} чел.`, noText: 'Ответ отправлен.',
      past: 'Той уже прошёл. Спасибо, что были с нами!', sendError: 'Не отправилось. Проверьте интернет и попробуйте ещё раз.',
      wishesTitle: 'Пожелания', wishesHint: 'Оставьте тёплые слова', wishName: 'Ваше имя', wishText: 'Ваше пожелание', wishSend: 'Оставить пожелание',
      wishPrivate: 'Ваше пожелание увидят только хозяева тоя.', wishThanks: 'Спасибо! Пожелание отправлено.',
      respect: 'С уважением,', made: 'Приглашение сделано в', music: 'Музыка', galleryTitle: 'Фото', tapOpen: 'Нажмите, чтобы открыть',
      madeQ: 'Тоже готовите той?', madeS: 'Такое же приглашение за 5 минут — без установки приложения. Попробуйте бесплатно.', madeGo: 'Сделать приглашение',
      thanksCta: 'Тоже готовите той? Это приглашение сделано в Той Менеджер →',
      oopsTitle: 'Приглашение не найдено', oopsText: 'Возможно, ссылка скопирована не полностью или организаторы удалили приглашение. Попросите прислать ссылку ещё раз.',
      oopsNet: 'Похоже, нет интернета. Проверьте связь и обновите страницу.',
      wmRibbon: 'Образец', wmBar: 'Пробная версия · Той Менеджер',
    },
  };

  // ---------- Демо-данные ----------
  const DRU = q.get('lang') === 'ru';   // пример на русском: программа, адрес и пожелания тоже по-русски
  // Пример под вид тоя (?kind=…): свои имена, без свадебного фото
  function demoFor(kind) {
    // [имя, вид тоя в базе]; день рождения — вид «other»
    const K = { beshik: ['Арсен', 'beshik'], tushoo: ['Айсулуу', 'tushoo'], sunnot: ['Нурсултан', 'sunnot'], birthday: ['Айлин', 'other'],
      kyz_uzatuu: ['Айпери', 'kyz_uzatuu'], jubilee: ['Бакыт Асанович', 'jubilee'], memorial: ['Бакыт Асанович', 'memorial'] };
    if (!kind || !K[kind]) return DEMO;
    const [name, real] = K[kind];
    const d = JSON.parse(JSON.stringify(DEMO));
    d.toi = { title: name, kind: real };
    d.card.name_a = name; d.card.name_b = null; d.card.from_whom = 'parents';
    if (real !== 'kyz_uzatuu') { d.card.hero_photo = null; d.card.gallery = []; }
    if (real === 'memorial') {
      Object.assign(d.card, { music: 'none', show_countdown: false, wishes_mode: 'off', show_dress: false, show_program: false,
        signature: DRU ? 'Семья Асановых' : 'Асановдордун үй-бүлөсү', theme: q.get('theme') || 'boz' });
      d.wishes = [];
    }
    return d;
  }
  const DEMO = {
    mode: 'personal', demo: true,
    toi: { title: 'Той Азамата и Айпери', kind: 'wedding' },
    event: { starts_at: '2026-12-08T11:00:00Z', venue_name: DRU ? 'Той-холл «Алтын Той»' : '«Алтын Той» той залы', venue_address: DRU ? 'Бишкек, проспект Чуй, 100' : 'Бишкек, Чүй проспектиси, 100' },
    guest: { name: 'Таалай байке', party_size: 3, lang: null, rsvp: 'pending', rsvp_count: null },
    card: { theme: q.get('theme') || q.get('t') || 'ak-altyn', music: 'theme', lang: 'ky', name_a: 'Азамат', name_b: 'Айпери', signature: DRU ? 'и семья Асановых' : 'жана Асановдордун үй-бүлөсү',
      from_whom: 'groom_parents', show_countdown: true, show_program: true, rsvp_enabled: true, rsvp_ask_count: true, wishes_mode: 'public', show_dress: true,
      program: DRU ? [{ time: '16:30', text: 'Встреча гостей' }, { time: '17:00', text: 'Начало тоя' }, { time: '19:30', text: 'Первый танец молодых' }, { time: '22:00', text: 'Свадебный торт' }]
        : [{ time: '16:30', text: 'Конокторду тосуп алуу' }, { time: '17:00', text: 'Тойдун башталышы' }, { time: '19:30', text: 'Жаштардын биринчи бийи' }, { time: '22:00', text: 'Той торту' }],
      rsvp_deadline: '2026-12-01', envelope: q.get('env') || 'classic',
      // фото пары — только в примере (в предпросмотре конструктора — фото самого организатора)
      hero_photo: q.get('preview') === '1' ? null : '/inv/demo/0.webp',
      gallery: q.get('preview') === '1' ? [] : [1, 2, 3, 4, 5, 6, 7].map((i) => `/inv/demo/${i}.webp`) },
    wishes: DRU ? [{ author: 'Гульнара эже', body: 'Будьте счастливы! Пусть ваш путь будет светлым, а семья — крепкой.' }, { author: 'Бакыт', body: 'Мира, достатка и согласия вашей семье!' }]
      : [{ author: 'Гүлнара эже', body: 'Бактылуу болгула! Ак жолтой, түбөлүк бирге болгула.' }, { author: 'Бакыт', body: 'Ынтымактуу, ырыскылуу үй-бүлө болгула!' }],
  };

  // ---------- Состояние ----------
  let R = null;            // ответ public_card (или демо)
  let C = null;            // оформление с подставленными значениями по умолчанию
  let lang = 'ky', theme = 'ak-altyn';
  let answer = null, count = 1, sent = false, sending = false;
  const mineWishes = [];

  function withDefaults(r) {
    const kind = KIND[r.toi.kind] ? r.toi.kind : 'other';
    const memorial = kind === 'memorial';
    const c = Object.assign({
      theme: memorial ? 'boz' : 'ak-altyn', music: memorial ? 'none' : 'theme', lang: 'ky', title: null, name_a: null, name_b: null, initials: null,
      from_whom: 'groom_parents', text_ky: null, text_ru: null, signature: null, map_url: null, show_countdown: !memorial,
      show_program: false, program: [], show_dress: false, dress_text: null, dress_colors: [], rsvp_enabled: true, rsvp_ask_count: true,
      rsvp_deadline: null, wishes_mode: memorial ? 'off' : 'public', envelope: 'classic', hero_photo: null, gallery: [],
    }, r.card || {});
    if (!Array.isArray(c.gallery)) c.gallery = [];
    c.kind = kind;
    if (!THEMES[c.theme]) c.theme = 'ak-altyn';
    c.a = (c.name_a || '').trim() || (c.name_b ? '' : r.toi.title);
    c.b = (c.name_b || '').trim();
    if (!c.a && c.b) { c.a = c.b; c.b = ''; }
    c.initials = (c.initials || '').trim() || [c.a, c.b].filter(Boolean).map((n) => n.trim()[0]?.toUpperCase()).join(' · ');
    return c;
  }

  // ---------- Восковая печать ----------
  function sealSvg(initials) {
    const R0 = 60, pts = [];
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const r = R0 - 3.2 * (1 + Math.sin(a * 11)) / 2 - 1.6 * Math.sin(a * 23 + 1) * Math.sin(a * 3);
      pts.push(`${(70 + r * Math.cos(a)).toFixed(1)},${(70 + r * Math.sin(a)).toFixed(1)}`);
    }
    const outline = `M${pts.join('L')}Z`;
    const size = initials.length > 7 ? 18 : initials.length > 5 ? 22 : 26;
    const text = (fill, op, dy) => `<text x="70" y="${70 + size * 0.34}" text-anchor="middle" font-family="Cormorant, serif" font-weight="600" font-size="${size}" letter-spacing="1" fill="${fill}" fill-opacity="${op}"${dy ? ` transform="translate(0 ${dy})"` : ''}>${esc(initials)}</text>`;
    const body = `
      <path d="${outline}" fill="url(#wax)"/><path d="${outline}" fill="url(#waxHi)"/>
      <circle cx="70" cy="70" r="42" fill="none" stroke="var(--wax2)" stroke-opacity=".55" stroke-width="3"/>
      <circle cx="70" cy="70" r="38.5" fill="url(#waxIn)"/>
      <circle cx="70" cy="70" r="36" fill="none" stroke="var(--wax-ink)" stroke-opacity=".35" stroke-width=".8" stroke-dasharray="1.5 2.6"/>
      ${text('#000', '.28', 1.2)}${text('var(--wax-ink)', '.9')}`;
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

  // ---------- Отрисовка ----------
  function render() {
    const L = T[lang], k = KIND[C.kind];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach((el) => { const v = L[el.dataset.t]; if (typeof v === 'string') el.textContent = v; });
    document.querySelectorAll('a[href*="/create/"]').forEach((a) => { const u = new URL(a.href); if (lang === 'ky') u.searchParams.set('lang', 'ky'); else u.searchParams.delete('lang'); a.href = u.toString(); });
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    const guest = R.mode === 'personal' ? R.guest : null;
    // конверт
    $('seal').setAttribute('aria-label', L.sealLabel);
    $('envKind').textContent = k[lang][0];
    document.querySelector('.env-to .caps').textContent = L.envTo;
    $('envWho').textContent = guest ? guest.name : L.guestsAll;
    $('venvToLabel').textContent = L.envTo; $('venvWho').textContent = guest ? guest.name : L.guestsAll; $('venvHint').textContent = L.tapOpen;
    $('venv').setAttribute('aria-label', L.sealLabel);
    // фото пары и галерея
    const hp = $('heroPhoto');
    hp.hidden = !C.hero_photo; document.querySelector('.hero').classList.toggle('has-photo', !!C.hero_photo);
    if (C.hero_photo && !hp.dataset.src) { hp.dataset.src = C.hero_photo; hp.querySelector('img').src = photo(C.hero_photo); }
    $('gallerySec').hidden = !C.gallery.length;
    if (C.gallery.length && !$('gallery').childElementCount) {
      $('gallery').innerHTML = C.gallery.map((p, i) => `<button type="button" data-i="${i}" aria-label="${i + 1}"><img src="${photo(esc(p))}" alt="" loading="lazy" decoding="async"></button>`).join('');
    }
    // главный экран
    $('kindTitle').textContent = (C.title || '').trim() || k[lang][1];
    $('nameA').textContent = C.a;
    document.querySelector('.hero .amp').hidden = !C.b; $('nameB').hidden = !C.b; $('nameB').textContent = C.b;
    const starts = R.event?.starts_at, d = starts ? bk(starts) : null;
    $('heroDate').textContent = d ? `${pad(d.getUTCDate())} · ${pad(d.getUTCMonth() + 1)} · ${d.getUTCFullYear()}` : '';
    if (THEMES[theme]?.scene) {
      $('scKind').textContent = $('kindTitle').textContent;
      $('scNames').innerHTML = [C.a, C.b].filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join('<span class="amp2">&amp;</span>');
      $('scDate').textContent = $('heroDate').textContent;
      $('scTo').textContent = L.envTo; $('scWho').textContent = guest ? guest.name : L.guestsAll; $('scHint').textContent = L.tapOpen;
    }
    // приветствие и текст
    $('greet').textContent = guest ? L.greet(guest.name) : L.greetAll;
    const custom = (lang === 'ky' ? C.text_ky : C.text_ru) || '';
    $('invText').textContent = custom.trim() || inviteText(C.kind, C.from_whom, C.a, C.b, lang);
    const party = guest?.party_size || 1;
    $('partyLine').hidden = !(guest && party > 1); $('partyLine').textContent = L.party(party);
    // дата
    $('dateSec').hidden = !d;
    if (d) {
      $('dayTitle').textContent = C.kind === 'memorial' ? L.dayMemorial : L.dayTitle;
      $('month').textContent = L.months[d.getUTCMonth()];
      const day = d.getUTCDate(), dim = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
      const cell = (n, cls) => (n >= 1 && n <= dim ? `<span class="${cls}">${n}</span>` : `<span class="${cls}"></span>`);
      $('week').innerHTML = cell(day - 2, '') + cell(day - 1, 'n1') +
        `<span class="day gold${k.heart ? '' : ' plain'}"><svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 86 C20 64 8 48 8 32 C8 19 18 10 30 10 C39 10 46 15 50 23 C54 15 61 10 70 10 C82 10 92 19 92 32 C92 48 80 64 50 86 Z" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>${day}</span>` +
        cell(day + 1, 'n1') + cell(day + 2, '');
      $('weekday').textContent = L.days[d.getUTCDay()];
      $('time').textContent = `${L.at} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
    }
    const past = starts && Date.parse(starts) < Date.now() - 12 * 3600e3;
    $('countSec').hidden = !d || !C.show_countdown || past;
    // место
    const venue = R.event?.venue_name || '', addr = R.event?.venue_address || '';
    $('placeSec').hidden = !venue && !addr;
    $('venue').textContent = venue || addr; $('address').textContent = venue ? addr : '';
    $('map').href = C.map_url || `https://2gis.kg/search/${encodeURIComponent([venue, addr].filter(Boolean).join(', '))}`;
    $('ics').hidden = !starts;
    // программа и дресс-код
    const prog = (C.show_program ? C.program : []).filter((p) => p && (p.time || p.text));
    $('programSec').hidden = !prog.length;
    $('program').innerHTML = prog.map((p) => `<li><b>${esc(p.time)}</b><span>${esc(p.text)}</span></li>`).join('');
    $('dressSec').hidden = !C.show_dress;
    $('dress').textContent = (C.dress_text || '').trim() || L.dress;
    $('swatches').innerHTML = (C.dress_colors?.length ? C.dress_colors : THEMES[theme].swatches)
      .filter((c) => /^#[0-9a-f]{6}$/i.test(c)).map((c) => `<i style="background:${c}"></i>`).join('');
    // ответ
    $('rsvp').hidden = !C.rsvp_enabled;
    if (C.rsvp_deadline) { const dl = new Date(C.rsvp_deadline + 'T00:00:00Z'); $('rsvpHint').textContent = L.rsvpBy(dl); } else $('rsvpHint').textContent = L.rsvpHint;
    $('rsvpName').placeholder = L.yourName; $('rsvpName').setAttribute('aria-label', L.yourName);
    $('pastNote').textContent = L.past;
    renderRsvp();
    // пожелания
    $('wishSec').hidden = C.wishes_mode === 'off' || !!R.legacy;
    $('wishName').placeholder = L.wishName; $('wishText').placeholder = L.wishText;
    $('wishName').setAttribute('aria-label', L.wishName); $('wishText').setAttribute('aria-label', L.wishText);
    renderWishes();
    // подпись
    $('closingNames').textContent = [C.a, C.b].filter(Boolean).join(' & ');
    $('family').textContent = C.signature || '';
    $('music').setAttribute('aria-label', L.music);
    // знак «пробная версия», пока тариф не оплачен
    const wm = R.paid === false;
    document.body.classList.toggle('wm', wm);
    $('wmRibbon').hidden = $('wmBar').hidden = !wm;
    $('wmRibbon').textContent = L.wmRibbon; $('wmBarText').textContent = L.wmBar; $('wmStamp').dataset.t = L.wmRibbon;
    tick();
  }

  function tick() {
    const starts = R?.event?.starts_at; if (!starts || $('countSec').hidden) return;
    const L = T[lang]; const s = Math.max(0, Math.floor((Date.parse(starts) - Date.now()) / 1000));
    const v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    $('countdown').innerHTML = v.map((n, i) => `<div><b class="gold">${pad(n)}</b><small>${L.units[i]}</small></div>`).join('');
  }
  setInterval(tick, 1000);

  // ---------- Ответ гостя ----------
  function renderRsvp() {
    const L = T[lang];
    const starts = R.event?.starts_at, past = starts && Date.parse(starts) < Date.now() - 12 * 3600e3;
    $('pastNote').hidden = !past;
    $('rsvpName').hidden = R.mode !== 'general';
    document.querySelectorAll('[data-answer]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.answer === answer)));
    $('countBox').hidden = answer !== 'yes' || !C.rsvp_ask_count; $('count').textContent = count;
    $('send').disabled = !answer || sending; $('send').textContent = sending ? L.sending : L.send;
    $('rsvpForm').hidden = sent || past; $('thanks').hidden = !sent;
    $('change').hidden = past || R.mode === 'general';
    if (sent) { $('thanksTitle').textContent = answer === 'yes' ? L.thanksYes : L.thanksNo; $('thanksText').textContent = answer === 'yes' ? L.yesText(count) : L.noText; }
  }
  document.querySelectorAll('[data-answer]').forEach((b) => b.onclick = () => { answer = b.dataset.answer; $('rsvpErr').hidden = true; renderRsvp(); });
  $('minus').onclick = () => { count = Math.max(1, count - 1); renderRsvp(); };
  $('plus').onclick = () => { count = Math.min(50, count + 1); renderRsvp(); };
  $('change').onclick = () => { sent = false; renderRsvp(); };
  $('send').onclick = async () => {
    const L = T[lang]; $('rsvpErr').hidden = true;
    const name = $('rsvpName').value.trim();
    if (R.mode === 'general' && !name) { $('rsvpErr').textContent = L.nameNeeded; $('rsvpErr').hidden = false; $('rsvpName').focus(); return; }
    if (R.demo) { sent = true; renderRsvp(); return; }
    sending = true; renderRsvp();
    try {
      const n = answer === 'yes' ? count : 0;
      if (R.mode === 'personal') await rpc('public_rsvp', { p_token: token, p_answer: answer, p_count: n });
      else await rpc('public_open_rsvp', { p_slug: token, p_name: name, p_answer: answer, p_people: n });
      sent = true;
    } catch { $('rsvpErr').textContent = L.sendError; $('rsvpErr').hidden = false; }
    sending = false; renderRsvp();
  };

  // ---------- Пожелания ----------
  function renderWishes() {
    const list = C.wishes_mode === 'public' ? [...mineWishes, ...(R.wishes || [])] : [];
    $('wishes').innerHTML = list.map((w) => `<div class="wish"><p>«${esc(w.body)}»</p><b>— ${esc(w.author)}</b></div>`).join('');
  }
  $('wishForm').onsubmit = async (e) => {
    e.preventDefault();
    const L = T[lang], author = $('wishName').value.trim(), body = $('wishText').value.trim();
    if (!author) { $('wishName').focus(); return; } if (!body) { $('wishText').focus(); return; }
    const btn = $('wishForm').querySelector('button'); btn.disabled = true;
    try {
      if (!R.demo) await rpc('public_wish', { p_token: token, p_author: author, p_body: body });
      $('wishText').value = '';
      if (C.wishes_mode === 'public') mineWishes.unshift({ author, body });
      $('wishNote').textContent = C.wishes_mode === 'public' ? '' : `${L.wishThanks} ${L.wishPrivate}`;
      $('wishNote').hidden = C.wishes_mode === 'public';
      renderWishes();
    } catch { $('wishNote').textContent = L.sendError; $('wishNote').hidden = false; }
    btn.disabled = false;
  };

  // ---------- Календарь ----------
  $('ics').onclick = () => {
    const starts = R.event?.starts_at; if (!starts) return;
    const s = new Date(starts), e = new Date(+s + 5 * 3600e3), f = (x) => x.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const title = `${(C.title || '').trim() || KIND[C.kind][lang][1]}: ${[C.a, C.b].filter(Boolean).join(' & ')}`;
    const where = [R.event.venue_name, R.event.venue_address].filter(Boolean).join(', ');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Toi Manager//RU', 'BEGIN:VEVENT', `UID:${f(s)}-${(token || 'demo').slice(0, 8)}@toimanager.app`,
      `DTSTAMP:${f(new Date())}`, `DTSTART:${f(s)}`, `DTEND:${f(e)}`, `SUMMARY:${title}`, `LOCATION:${where}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'toi.ics';
    document.body.appendChild(a); a.click(); a.remove();
  };

  // ---------- Язык ----------
  document.querySelectorAll('[data-lang]').forEach((b) => b.onclick = () => {
    lang = b.dataset.lang; try { localStorage.setItem('invLang', lang); } catch {}
    render();
  });

  // ---------- Музыка ----------
  const audio = $('audio');
  function fadeTo(v, ms) {
    const from = audio.volume, t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); try { audio.volume = from + (v - from) * k; } catch {} if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  function play() {
    if (!audio.getAttribute('src')) return;
    audio.play().then(() => { $('music').classList.remove('off'); fadeTo(0.55, 2500); }).catch(() => $('music').classList.add('off'));
  }
  $('music').onclick = () => { if (audio.paused) play(); else { audio.pause(); $('music').classList.add('off'); } };

  // ---------- Открыть конверт ----------
  let opened = false;
  function open() {
    if (opened || !R) return; opened = true;
    play();   // звук можно включить только после нажатия — печать как раз им и является
    $('seal').classList.add('broken');
    requestAnimationFrame(() => requestAnimationFrame(() => $('seal').classList.add('fly')));
    $('envelope').classList.add('open');
    $('page').removeAttribute('aria-hidden');
    setTimeout(showPage, reduce ? 0 : 1400);
    setTimeout(() => $('envelope').classList.add('gone'), reduce ? 50 : 2500);
  }
  function showPage() {
    document.body.classList.remove('locked'); $('music').hidden = !audio.getAttribute('src');
    $('heroPhoto').classList.add('in');
    const step = document.body.classList.contains('venv-card') ? 260 : 140;
    document.querySelectorAll('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('in'), i * step));
  }
  $('seal').onclick = open;

  // ---------- Обложка-сцена ----------
  const scover = $('scover');
  function openScene() {
    if (opened || !R) return; opened = true;
    play();
    $('page').removeAttribute('aria-hidden');
    window.scrollTo(0, 0);
    scover.classList.add('open');
    setTimeout(showPage, reduce ? 0 : 250);
    setTimeout(() => { scover.hidden = true; }, reduce ? 50 : 1500);
  }
  scover.addEventListener('click', openScene);
  scover.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openScene(); } });
  function setupScene() {
    const on = !!THEMES[theme]?.scene;
    document.body.classList.toggle('scene', on);
    const hp = $('heroPhoto');
    if (!on) {
      scover.hidden = true;
      if (hp.classList.contains('below') && !document.body.classList.contains('venv-card')) { hp.classList.remove('below'); $('wmStamp').after(hp); }
      return false;
    }
    document.body.style.setProperty('--scene', `url(/inv/scenes/${theme}.webp)`); if (!hp.classList.contains('below')) { hp.classList.add('below'); document.querySelector('.hero').after(hp); }
    if (!opened) { scover.hidden = false; $('envelope').classList.add('gone'); venv.hidden = true; }
    return true;
  }

  // ---------- Видео-конверт ----------
  const venv = $('venv'), vid = $('venvVideo');
  let revealed = false;
  function videoReveal() {
    if (revealed) return; revealed = true;
    window.scrollTo(0, 0);
    venv.classList.add('done');
    // текст проявляется на карточке, пока ролик растворяется
    setTimeout(showPage, document.body.classList.contains('venv-card') ? 350 : 0);
    setTimeout(() => { venv.hidden = true; vid.pause(); }, 1400);
  }
  function openVideo() {
    if (opened || !R) return; opened = true;
    play();
    $('page').removeAttribute('aria-hidden');
    venv.classList.add('playing');
    if (reduce) { videoReveal(); return; }
    vid.play().catch(videoReveal);
    // Медленный интернет: если ролик не пошёл за 1,5 с — сразу открываем приглашение, без ожидания
    setTimeout(() => { if (!revealed && vid.currentTime < 0.05) videoReveal(); }, 1500);
    setTimeout(videoReveal, 6000);   // на случай, если ролик застрял посередине
  }
  vid.addEventListener('timeupdate', () => { if (opened && vid.duration && vid.currentTime >= vid.duration - 0.55) videoReveal(); });
  vid.addEventListener('ended', videoReveal);
  venv.addEventListener('click', openVideo);
  venv.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideo(); } });
  function setupVideoEnvelope(id) {
    const e = ENVS[id]; if (!e) return false;
    venv.classList.toggle('light', !!e.light);
    const poster = e.webp ? `/inv/env/${id}-poster.webp` : `/inv/env/${id}.jpg`;
    vid.poster = poster; vid.src = `/inv/env/${id}.mp4`;
    venv.style.setProperty('--venv-bg', `url(${poster})`);
    // ролик не загрузился до касания — показываем обычный конверт
    vid.addEventListener('error', () => { if (!opened) { venv.hidden = true; $('envelope').classList.remove('gone'); } }, { once: true });
    venv.hidden = false; $('envelope').classList.add('gone');
    // Первый экран — та же карточка, что в конце ролика
    // (только на телефоне/вертикальном экране; на компьютере — обычный порядок: фото, затем имена)
    if (e.card && matchMedia('(max-aspect-ratio: 3/4)').matches) {
      document.body.classList.add('venv-card');
      document.querySelector('.hero').style.setProperty('--card-img', `url(/inv/env/${id}-card.jpg)`);
      const hp = $('heroPhoto'); hp.classList.add('below'); document.querySelector('.hero').after(hp);
    }
    return true;
  }

  // ---------- Галерея: просмотр на весь экран, листание свайпом ----------
  const lb = $('lightbox'); let lbI = 0;
  const lbShow = (i) => { const g = C.gallery; lbI = (i + g.length) % g.length; $('lbImg').src = photo(g[lbI]); $('lbCount').textContent = `${lbI + 1} / ${g.length}`;
    $('lbPrev').hidden = $('lbNext').hidden = g.length < 2; };
  const lbClose = () => { lb.hidden = true; document.body.style.overflow = ''; };
  $('gallery').addEventListener('click', (e) => { const b = e.target.closest('button[data-i]'); if (!b) return; lbShow(+b.dataset.i); lb.hidden = false; document.body.style.overflow = 'hidden'; $('lbClose').focus(); });
  $('lbClose').onclick = lbClose; $('lbPrev').onclick = () => lbShow(lbI - 1); $('lbNext').onclick = () => lbShow(lbI + 1);
  lb.addEventListener('click', (e) => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', (e) => { if (lb.hidden) return; if (e.key === 'Escape') lbClose(); if (e.key === 'ArrowLeft') lbShow(lbI - 1); if (e.key === 'ArrowRight') lbShow(lbI + 1); });
  let tx = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; tx = null; if (Math.abs(dx) > 50) lbShow(lbI + (dx < 0 ? 1 : -1)); });
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && opened) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
  document.querySelectorAll('main .reveal').forEach((el) => io.observe(el));

  // Золотая пыль
  if (!reduce) for (let i = 0; i < 22; i++) {
    const s = document.createElement('i');
    s.style.left = `${Math.random() * 100}%`; s.style.top = `${60 + Math.random() * 50}%`;
    s.style.animationDelay = `${-Math.random() * 14}s`; s.style.animationDuration = `${11 + Math.random() * 8}s`;
    s.style.transform = `scale(${0.6 + Math.random()})`; $('dust').appendChild(s);
  }

  // ---------- Запуск ----------
  const hint = document.querySelector('.env-hint');
  function applyTheme() {
    document.body.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = THEMES[theme].color;
  }
  function start(r) {
    R = r; C = withDefaults(r); theme = C.theme; applyTheme();
    let saved = null; try { saved = localStorage.getItem('invLang'); } catch {}
    lang = q.get('lang') === 'ru' || q.get('lang') === 'ky' ? q.get('lang') : saved || r.guest?.lang || C.lang || 'ky';
    if (r.guest && (r.guest.rsvp === 'yes' || r.guest.rsvp === 'no')) { answer = r.guest.rsvp; sent = true; }
    count = r.guest?.rsvp === 'yes' && r.guest.rsvp_count ? r.guest.rsvp_count : r.guest?.party_size || 1;
    // Одна мелодия для всех оформлений; для аша (поминки) — спокойная
    if (C.music === 'none') audio.removeAttribute('src'); else audio.src = C.kind === 'memorial' ? '/inv/music/tunku.mp3' : THEMES[theme].music;
    audio.volume = 0;
    $('seal').innerHTML = sealSvg(C.initials || '·'); $('seal').disabled = false;
    document.title = `${KIND[C.kind][lang][1]} — ${[C.a, C.b].filter(Boolean).join(' & ')}`;
    if (r.demo && !r.preview) {
      const bar = $('demoBar'); bar.hidden = false;
      bar.innerHTML = Object.entries(THEMES).map(([k, v]) => `<a href="?theme=${k}${q.get('env') ? `&env=${encodeURIComponent(q.get('env'))}` : ''}${q.get('kind') ? `&kind=${encodeURIComponent(q.get('kind'))}` : ''}${q.get('lang') ? `&lang=${encodeURIComponent(q.get('lang'))}` : ''}" aria-current="${k === theme}"${INFRAME ? ' target="_top"' : ''}>${v.title}</a>`).join('');
    }
    render();
    hint.textContent = T[lang].envHint;
    if (!setupScene() && C.envelope && C.envelope !== 'classic') setupVideoEnvelope(C.envelope);
  }
  function fail(net) {
    const L = T[lang];
    $('envelope').classList.add('gone'); document.body.classList.remove('locked');
    $('oopsTitle').textContent = L.oopsTitle; $('oopsText').textContent = net ? L.oopsNet : L.oopsText; $('oops').hidden = false;
  }

  // пока грузится — конверт с неактивной печатью
  try { lang = localStorage.getItem('invLang') || 'ky'; } catch {}
  if (q.get('lang') === 'ru' || q.get('lang') === 'ky') lang = q.get('lang');
  applyTheme();
  $('seal').innerHTML = sealSvg('·'); $('seal').disabled = true;
  document.querySelector('.env-title .script').textContent = T[lang].envTitle;
  hint.textContent = token ? T[lang].loading : '';

  const raw = q.get('t') || q.get('c');
  if (!token && raw && !THEMES[raw]) { fail(false); return; }   // ?t=ak-altyn — старая демо-ссылка; другое — неверная ссылка
  if (PREVIEW) { startPreview(); return; }
  if (!token) { start(demoFor(q.get('kind'))); return; }
  // Пока в базе нет public_card (SQL 0.10 ещё не применён) — берём старую public_invitation, чтобы ссылки гостей не ломались
  const legacy = () => rpc('public_invitation', { p_token: token }).then((o) => (o ? {
    mode: 'personal', toi: { title: o.toi_title, kind: o.toi_kind }, card: null, wishes: [],
    event: { title: o.event_title, starts_at: o.starts_at, venue_name: o.venue_name, venue_address: o.venue_address },
    guest: { name: o.guest_name, party_size: o.party_size, lang: null, rsvp: o.rsvp, rsvp_count: o.rsvp_count },
  } : null));
  rpc('public_card', { p_token: token })
    .catch((e) => (e.status === 404 ? legacy().then((r) => { if (r) r.legacy = true; return r; }) : Promise.reject(e)))
    .then((r) => {
      if (!r) { fail(false); return; }
      start(r);
      // отметка «гость открыл приглашение» (не для организатора и не для старых ссылок)
      if (!r.legacy && q.get('own') !== '1') rpc('public_card_seen', { p_token: token }).catch(() => {});
    })
    .catch((e) => fail(!e.status || e.status >= 500));

  // ---------- Предпросмотр в конструкторе ----------
  // Родительская страница присылает { type: 'tm-card', r, lang, open }. Первое сообщение запускает открытку,
  // следующие — перерисовывают её без перезагрузки (фото, тексты, оформление меняются сразу).
  function startPreview() {
    hint.textContent = '';
    let started = false;
    window.addEventListener('message', (e) => {
      if (e.origin !== location.origin || !e.data || e.data.type !== 'tm-card') return;
      const r = Object.assign({ demo: true, preview: true, wishes: [] }, e.data.r);
      const want = e.data.lang === 'ky' || e.data.lang === 'ru' ? e.data.lang : null;   // язык из конструктора (не запоминаем)
      if (!started) {
        started = true;
        start(r);
        if (want && want !== lang) { lang = want; render(); hint.textContent = T[lang].envHint; }
        if (e.data.open) openInstant();
        return;
      }
      if (want) lang = want;
      const prevTheme = theme;
      R = r; C = withDefaults(r); theme = C.theme;
      if (theme !== prevTheme) { applyTheme(); setupScene(); }
      // фото перерисовываем заново
      const hp = $('heroPhoto'); delete hp.dataset.src; hp.querySelector('img').removeAttribute('src');
      $('gallery').innerHTML = '';
      $('seal').innerHTML = sealSvg(C.initials || '·');
      if (C.music === 'none') { audio.pause(); audio.removeAttribute('src'); $('music').hidden = true; }
      else if (!audio.getAttribute('src')) { audio.src = C.kind === 'memorial' ? '/inv/music/tunku.mp3' : THEMES[theme].music; $('music').hidden = !opened; }
      render();
      if (opened) document.querySelectorAll('main .reveal').forEach((el) => el.classList.add('in'));
    });
    // сообщаем родителю, что готовы принимать данные
    try { parent.postMessage({ type: 'tm-ready' }, location.origin); } catch {}
  }
  // Сразу показать страницу (без конверта) — для предпросмотра
  function openInstant() {
    opened = true; revealed = true;
    $('envelope').classList.add('gone'); venv.hidden = true; scover.hidden = true;
    $('page').removeAttribute('aria-hidden');
    document.body.classList.remove('locked');
    $('music').hidden = !audio.getAttribute('src');
    $('heroPhoto').classList.add('in');
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
  }
})();
