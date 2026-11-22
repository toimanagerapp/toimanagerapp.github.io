// Конструктор приглашений на сайте: toimanager.app/create
// Без входа можно собрать приглашение целиком (черновик хранится в браузере), вход через Google — чтобы сохранить и отправить.
// Данные — те же, что в приложении: той, событие, оформление открытки (invite_cards), гости и их личные ссылки.
// Предпросмотр — настоящая открытка /inv/ в рамке (режим ?preview=1): данные передаются через postMessage.
(() => {
  'use strict';
  const SB = 'https://ybygcijdpswvqrkxyimi.supabase.co';
  const KEY = 'sb_publishable_AMNeSGIK-aTmllo1Q13bNw_aTCbRkPn'; // публичный ключ: доступ только к своим тоям (правила базы)
  const PUBLIC = 'https://toimanager.app';                       // ссылки для гостей — всегда на основной домен
  const PAY = {
    qr: '../pro/qr.png',
    link: 'https://pay.payqr.kg/qr/#00020101021132840012c2b.mbank.kg010202101610301200052444961132%D0%98%D0%9F%20%D0%9E%D1%80%D0%BE%D0%B7%D0%B0%D0%BB%D0%B8%D0%B5%D0%B2%20%D0%9C%D0%B0%D1%80%D0%B0%D1%82%20%D0%9A%D0%BE%D0%B6%D0%BE%D0%B3%D0%B5%D0%BB%D0%B4%D0%B8%D0%B5%D0%B2%D0%B8%D1%871302123422mbiz%3A48222517%3A124412495204999953034175925IP%20Orozaliev%20Marat%20Kozhog63047ebe',
  };
  const FREE_PEOPLE = 35;
  const sb = supabase.createClient(SB, KEY, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true } });
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* приватный режим */ } },
    del(k) { try { localStorage.removeItem(k); } catch { /* */ } },
  };
  const track = (ev, p) => { try { window.tmTrack && window.tmTrack(ev, p); } catch { /* */ } };
  const pad = (n) => String(n).padStart(2, '0');
  const isDesktop = () => matchMedia('(min-width: 980px)').matches;

  // ---------- Значки ----------
  const I = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-8 8"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2.5"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
    open: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    more: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>',
    back: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9.5"/><path d="m7.5 12.5 3 3 6-6.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    ring: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="14" r="5.5"/><circle cx="15" cy="14" r="5.5"/><path d="m10 4 2 3 2-3"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-2.5-5.1"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4Z"/></svg>',
  };
  const G_LOGO = '<svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';

  // ---------- Тексты (кыргызский — черновик, нужна вычитка носителем языка) ----------
  const T = {
    ru: {
      saved: 'Сохранено', saving: 'Сохраняем…', saveErr: 'Не сохранилось — проверьте интернет',
      login: 'Войти', logout: 'Выйти', myInv: 'Мои приглашения', newInv: 'Новое приглашение', app: 'Приложение «Той Менеджер»',
      eyebrow: 'Онлайн-приглашение на той',
      h1: 'Приглашение, которое хочется открыть',
      lead: 'Конверт с восковой печатью, музыка, ваши фото, карта 2ГИС и ответы гостей. Каждому гостю — личная ссылка с его именем, и вы видите, кто уже открыл.',
      ticks: ['Готово за 5 минут', 'Без установки приложения', 'Кыргызча и по-русски'],
      pick: 'Какой у вас той?', seeDemo: 'Посмотреть пример', demoNote: 'Так увидит гость — нажмите на печать',
      ctaCreate: 'Создать приглашение', ctaFree: 'бесплатно, без установки', heroLead: 'Конверт с печатью раскрывается, играет музыка — и гость отвечает «Приду» в одно касание. Каждому — личная ссылка с его именем.',
      heroKind: 'Приглашение на свадьбу', heroNames: 'Азамат & Айпери', heroDate: '20 · 12 · 2026', pv: 'Просмотр', save: 'Сохранить',
      faqT: 'Вопросы', faq: [['Гостям нужно что-то устанавливать?', 'Нет. Приглашение открывается по ссылке из WhatsApp на любом телефоне.'], ['Можно исправить после отправки?', 'Да, в любой момент. Гости увидят новое по той же ссылке — заново отправлять не нужно.'], ['Как оплатить?', 'По QR в MBank или любом банке Кыргызстана. Знак «Образец» снимаем в течение дня — как только проверим платёж.'], ['Сколько гостей можно пригласить?', 'Сколько угодно: в «Онлайн-приглашении» за 490 сом ограничений нет. В бесплатной пробной версии — до 35 человек.']],
      how: [['Соберите', 'Имена, дата, место, фото и оформление. Всё видно сразу в предпросмотре.'], ['Отправьте', 'Одной общей ссылкой или каждому гостю — своей, в WhatsApp.'], ['Следите', 'Кто открыл, кто придёт и сколько человек — в одном списке.']],
      pricesT: 'Сколько стоит', try: 'Попробовать', free: 'бесплатно', som: 'сом',
      priceTry: ['Всё приглашение целиком', 'Ответы гостей', 'Со знаком «Образец», до 35 человек'],
      priceInv: ['Без знака «Образец»', 'Личные ссылки и «кто открыл»', 'Гости без ограничений'],
      pricePro: ['Всё из онлайн-приглашения', 'Полная версия приложения для тоя', '«У входа», конверты, бюджет, подарки'],
      planInv: 'Онлайн-приглашение', planPro: 'Приложение', best: 'Всё вместе', soon: 'Скоро в Google Play', oneToi: 'за один той',
      kinds: { wedding: ['Свадьба', 'Үйлөнүү той'], kyz_uzatuu: ['Кыз узатуу', 'проводы невесты'], sunnot: ['Сүннөт той', ''], beshik: ['Бешик той', ''], tushoo: ['Тушоо кесүү', 'первые шаги'], jubilee: ['Юбилей', 'маараке'], memorial: ['Аш', 'поминки'], other: ['Другое', 'любой праздник'] },
      steps: ['Кто празднует', 'Когда и где', 'Фото', 'Оформление', 'Детали'],
      stepOf: (i, n) => `Шаг ${i} из ${n}`,
      next: 'Далее', back: 'Назад', preview: 'Как увидят гости', finish: 'Готово — сохранить', skip: 'Пропустить',
      kindL: 'Вид тоя', whoH: 'Чей это праздник?', whoL: 'Имена появятся на конверте, на печати и в тексте приглашения.',
      groom: 'Жених', bride: 'Невеста', girl: 'Имя невесты', child: 'Имя ребёнка', hero: 'Чей юбилей', memo: 'В память о ком', otherName: 'Чей праздник', otherTitle: 'Название праздника',
      ph: { groom: 'Азамат', bride: 'Айпери', girl: 'Айпери', child: 'Нурсултан', hero: 'Бакыт Асанович', memo: 'Асан Бакытович', otherTitle: 'Например, «Новоселье»', sign: 'Например, «Семья Асановых»', venue: 'Ресторан «Ала-Тоо»', addr: 'Бишкек, ул. Токтогула, 100', map: 'https://2gis.kg/…' },
      fromWhom: 'Кто приглашает', fromG: 'Родители жениха', fromB: 'Родители невесты', fromC: 'Сами молодые',
      sign: 'Подпись внизу', optional: 'необязательно',
      whenH: 'Когда и где?', whenL: 'Гости увидят дату, обратный отсчёт и кнопку «Открыть в 2ГИС».',
      date: 'Дата', time: 'Время', venue: 'Место', addr: 'Адрес', mapUrl: 'Ссылка 2ГИС',
      mapHint: 'Откройте место в 2ГИС → «Поделиться» → «Копировать ссылку». Без ссылки 2ГИС найдёт место по названию и адресу.',
      dateNeed: 'Укажите дату тоя', namesNeed: 'Напишите имя',
      photoH: 'Фото', photoL: 'Главное фото будет на первом экране приглашения, остальные — в галерее. Можно пропустить.',
      heroPh: 'Главное фото', heroAdd: 'Добавить главное фото', heroHint: 'Лучше вертикальное, где хорошо видны лица', change: 'Заменить', remove: 'Убрать',
      gallery: 'Галерея', galleryHint: (n) => `До 10 фото · добавлено ${n}`, uploading: 'Загружаем…', photoErr: 'Не удалось загрузить фото. Попробуйте другое.',
      designH: 'Оформление', designL: 'Выберите цвета, конверт и музыку. Всё сразу видно в предпросмотре.',
      theme: 'Цвета', envelope: 'Конверт', envClassic: 'С восковой печатью', envClassicS: 'Гость ломает печать', envNavy: 'Видео-конверт «Түн»', envNavyS: 'Конверт раскрывается сам',
      music: 'Музыка', musicS: 'Мелодия «Бакыт кушу» играет, когда гость открывает конверт', lang: 'Язык приглашения', langS: 'Гость может переключить язык сам',
      text: 'Текст приглашения', textAuto: 'Готовый текст (с вашими именами):', textOwn: 'Написать свой текст', textUseAuto: 'Вернуть готовый текст', textOwnPh: 'Ваш текст приглашения',
      detH: 'Детали', detL: 'Включите то, что нужно. Всё можно поменять и после отправки — гости увидят изменения по той же ссылке.',
      countdown: 'Обратный отсчёт', countdownS: 'Сколько дней и часов осталось до тоя',
      program: 'Программа', programS: 'Например: 17:00 — встреча гостей', addRow: 'Добавить строку', progTime: '17:00', progText: 'Встреча гостей',
      dress: 'Дресс-код', dressS: 'Пожелания к одежде и цвета', dressPh: 'Например: будем рады нарядам в белых и золотых тонах',
      rsvp: 'Ответ гостей', rsvpS: '«Приду / Не смогу» прямо в приглашении', askCount: 'Спрашивать, сколько человек придёт', deadline: 'Ответить до',
      wishes: 'Пожелания гостей', wishesS: 'Гости оставляют тёплые слова', wPublic: 'Видят все', wPrivate: 'Только вы', wOff: 'Выключить',
      saveH: 'Сохраните приглашение', saveL: 'Войдите через Google — приглашение сохранится, и вы получите ссылку для гостей. Оно же появится в приложении «Той Менеджер».',
      google: 'Войти через Google', loginAlt: 'Не получается? Войти другим способом', loginErr: 'Не удалось войти. Попробуйте ещё раз.', creating: 'Сохраняем приглашение…',
      createErr: 'Не удалось сохранить. Проверьте интернет и попробуйте ещё раз.',
      tabCard: 'Приглашение', tabGuests: 'Гости', tabSend: 'Отправить', allInv: 'Все приглашения',
      trialT: 'Пробная версия', trialP: 'На приглашении знак «Образец». Уберите его — и можно отправлять гостям.',
      removeWm: 'Убрать знак', paidT: 'Оплачено', paidP: (d) => `Приглашение без знака до ${d}.`, proP: (d) => `Полная версия приложения до ${d}.`,
      checkT: 'Знак уже снят', checkP: 'Мы проверим платёж в течение дня. Можно отправлять приглашение гостям.',
      forgotT: 'Уже оплатили?', forgotP: 'Если вы перевели деньги, нажмите «Я оплатил» — без этого мы не узнаем, чей это платёж, и знак останется.', paidShort: 'Я оплатил', waitT: 'Ждём проверки платежа', waitP: 'Как только проверим (обычно в течение дня), знак исчезнет.',
      upgrade: 'Полная версия приложения',
      general: 'Общая ссылка', generalS: 'Для групп, статуса WhatsApp и соцсетей. Гость пишет имя и отвечает — ответ появится у вас.',
      personal: 'Личные ссылки', personalS: 'Каждому гостю — приглашение с его именем: «Урматтуу Асан байке». Вы видите, кто открыл и что ответил.',
      toGuests: 'Перейти к гостям', copy: 'Копировать', copied: 'Ссылка скопирована', share: 'В WhatsApp', open: 'Открыть', views: (n) => `Открыли по общей ссылке: ${n}`,
      inApp: 'В приложении «Той Менеджер» — то же приглашение, плюс конверты, бюджет и рассадка.',
      gAdd: 'Добавить гостей', gAddOne: 'Один гость', gAddMany: 'Списком',
      gName: 'Имя', gNamePh: 'Асан Бекович', gAddr: 'Как обратиться', gAddrPh: 'Асан байке', gAddrS: 'Так гость увидит своё имя на конверте', gPhone: 'Телефон WhatsApp', gPhonePh: '0555 123 456', gParty: 'Сколько человек',
      gManyPh: 'Асан байке, 0555 123 456, 3\nГүлнара эже, 0700 111 222, 2\nБакыт', gManyS: 'Каждый гость — с новой строки. Через запятую можно добавить телефон и сколько человек.',
      gSave: 'Добавить', gSaveN: (n) => `Добавить ${n}`, gEdit: 'Изменить гостя', gDel: 'Удалить гостя', gDelQ: 'Удалить гостя из списка?',
      gEmptyT: 'Пока нет гостей', gEmptyS: 'Добавьте гостей — каждый получит приглашение со своим именем.',
      kGuests: 'гостей', kPeople: 'человек', kOpened: 'открыли', kComing: 'придут',
      fAll: 'Все', fNot: 'Не отправлено', fSent: 'Отправлено', fOpened: 'Открыли', fYes: 'Придут', fNo: 'Не придут',
      sNot: 'Не отправлено', sSent: 'Отправлено', sOpened: 'Открыл', sYes: (n) => `Придёт · ${n}`, sNo: 'Не придёт',
      send: 'Отправить', resend: 'Ещё раз', copyLink: 'Копировать ссылку', viewAs: 'Посмотреть приглашение', people: (n) => `${n} чел.`,
      limitT: (p, l) => `${p} из ${l} бесплатно`, limitFull: 'Бесплатные места закончились — оплатите приглашение, и гостей можно добавлять без ограничений.',
      limitPart: (n) => `Добавлено ${n}. Остальным не хватило бесплатных мест — оплатите приглашение, и ограничений не будет.`, added: (n) => `Добавлено: ${n}`,
      msgHi: (n) => `Здравствуйте, ${n}!`, msgInv: (k) => `Приглашаем вас ${k}`, msgLink: 'Приглашение и ответ — по ссылке:', msgBye: 'Будем рады видеть вас!',
      msgGeneral: 'Приглашаем вас на наш праздник!',
      payH: 'Убрать знак «Образец»', payL: 'Оплата один раз за этот той. Всё, что вы уже сделали, сохранится.',
      payInvT: 'Онлайн-приглашение', payProT: 'Приложение', payUp: 'доплата',
      payInvL: ['Приглашение без знака «Образец»', 'Личные ссылки и «кто открыл»', 'Гости без ограничений', 'Только для этого тоя · на год, не меньше 3 месяцев после тоя'],
      payProL: ['Всё из онлайн-приглашения', 'Полная версия приложения для тоя', '«У входа», конверты, бюджет, подарки'],
      payNext: 'Перейти к оплате', payAmount: 'К оплате', payNum: (n) => `Номер тоя для комментария: ${n}`,
      payStep1: 'Нажмите «Оплатить» — откроется приложение банка (MBank или любой банк Кыргызстана). С компьютера — отсканируйте QR телефоном.',
      payStep2: (p) => `Сумма ${p} сом уже указана — проверьте её и нажмите «Перевести».`, payStep3: 'Вернитесь сюда и нажмите «Я оплатил».',
      payBtn: 'Оплатить в приложении банка', payer: 'Имя отправителя — как в банке', payerS: 'Например, «Айбек Т.» — так мы найдём ваш платёж.',
      paid: 'Я оплатил', sending: 'Отправляем…', payErr: 'Не отправилось. Проверьте интернет и попробуйте ещё раз.',
      payOkT: 'Спасибо! Знак снят', payOkP: 'Мы проверим платёж в течение дня. Приглашение уже можно отправлять гостям.',
      payWaitT: 'Заявка принята', payWaitP: 'Проверим платёж в течение дня — после этого знак «Образец» исчезнет. Если оставили номер, напишем вам в WhatsApp.', phoneL: 'WhatsApp для ответа (необязательно)', phoneS: 'Напишем, когда откроем приглашение.',
      payHelp: 'Вопросы по оплате — WhatsApp 0755 666 999', done: 'Хорошо',
      notFound: 'Приглашение не найдено или у вас нет доступа.', loadErr: 'Не удалось загрузить. Проверьте интернет и обновите страницу.',
      envShow: 'Показать конверт', envHide: 'Без конверта', close: 'Закрыть', openNew: 'Открыть отдельно',
      sample: 'Асан байке', titleSep: ' — ',
      kindTitle: { wedding: 'свадьба', kyz_uzatuu: 'кыз узатуу', sunnot: 'сүннөт той', beshik: 'бешик той', tushoo: 'тушоо кесүү', jubilee: 'юбилей', memorial: 'аш', other: 'праздник' },
      kindTo: { wedding: 'на свадьбу', kyz_uzatuu: 'на кыз узатуу', sunnot: 'на сүннөт той', beshik: 'на бешик той', tushoo: 'на тушоо кесүү', jubilee: 'на юбилей', memorial: 'на аш', other: 'на праздник' },
      and: 'и', months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
      days: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
      when: (d, mo, wd, t) => `${d} ${mo}, ${wd}, в ${t}`, noDate: 'Дата не указана',
      opened: (s) => `открыл ${s}`, ago: { now: 'только что', m: (n) => `${n} мин назад`, h: (n) => `${n} ч назад`, d: (n) => `${n} дн назад` },
      privacy: 'Политика конфиденциальности', help: 'Помощь в WhatsApp',
      draftFound: 'У вас есть несохранённый черновик', draftGo: 'Продолжить', draftNew: 'Начать заново',
    },
    ky: {
      saved: 'Сакталды', saving: 'Сакталууда…', saveErr: 'Сакталган жок — интернетти текшериңиз',
      login: 'Кирүү', logout: 'Чыгуу', myInv: 'Менин чакырууларым', newInv: 'Жаңы чакыруу', app: '«Той Менеджер» тиркемеси',
      eyebrow: 'Тойго онлайн чакыруу',
      h1: 'Ачкысы келген чакыруу',
      lead: 'Мөөр басылган конверт, музыка, сүрөттөрүңүз, 2ГИС картасы жана коноктордун жообу. Ар бир конокко — өз аты жазылган шилтеме, ким ачканын көрүп турасыз.',
      ticks: ['5 мүнөттө даяр', 'Тиркеме орнотпой эле', 'Кыргызча жана орусча'],
      pick: 'Кандай той?', seeDemo: 'Мисалды көрүү', demoNote: 'Конок ушинтип көрөт — мөөрдү басыңыз',
      ctaCreate: 'Чакыруу жасоо', ctaFree: 'акысыз, орнотпостон', heroLead: 'Мөөрлүү конверт ачылат, музыка ойнойт — конок бир басуу менен «Барам» деп жооп берет. Ар бирине — өз аты жазылган шилтеме.',
      heroKind: 'Үйлөнүү тоюна чакыруу', heroNames: 'Азамат & Айпери', heroDate: '20 · 12 · 2026', pv: 'Көрүү', save: 'Сактоо',
      faqT: 'Суроолор', faq: [['Конокторго бир нерсе орнотуу керекпи?', 'Жок. Чакыруу WhatsAppтагы шилтеме аркылуу каалаган телефондо ачылат.'], ['Жөнөткөндөн кийин оңдосо болобу?', 'Ооба, каалаган убакта. Коноктор жаңысын ошол эле шилтемеден көрүшөт — кайра жөнөтүүнүн кереги жок.'], ['Кантип төлөйм?', 'QR аркылуу MBank же Кыргызстандын каалаган банкында. Төлөмдү текшергенден кийин «Үлгү» белгисин бир күндүн ичинде алып салабыз.'], ['Канча конок чакырса болот?', 'Каалаганча: 490 сомдук «Онлайн чакырууда» чек жок. Акысыз сынамык версияда — 35 кишиге чейин.']],
      how: [['Түзүңүз', 'Аттар, күнү, жери, сүрөттөр жана жасалгасы. Баары дароо алдын ала көрүнөт.'], ['Жөнөтүңүз', 'Бир жалпы шилтеме менен же ар бир конокко өзүнчө — WhatsAppта.'], ['Көзөмөлдөңүз', 'Ким ачты, ким келет жана канча киши — бир тизмеде.']],
      pricesT: 'Баасы', try: 'Сынап көрүү', free: 'акысыз', som: 'сом',
      priceTry: ['Чакыруу толугу менен', 'Коноктордун жообу', '«Үлгү» белгиси менен, 35 кишиге чейин'],
      priceInv: ['«Үлгү» белгисиз', 'Жеке шилтемелер жана «ким ачты»', 'Коноктор чексиз'],
      pricePro: ['Онлайн чакыруунун баары', 'Тиркеменин толук версиясы', '«Кире бериш», конверттер, бюджет, белектер'],
      planInv: 'Онлайн чакыруу', planPro: 'Тиркеме', best: 'Баары бирге', soon: 'Жакында Google Playде', oneToi: 'бир той үчүн',
      kinds: { wedding: ['Үйлөнүү той', 'свадьба'], kyz_uzatuu: ['Кыз узатуу', ''], sunnot: ['Сүннөт той', ''], beshik: ['Бешик той', ''], tushoo: ['Тушоо кесүү', ''], jubilee: ['Маараке', 'юбилей'], memorial: ['Эскерүү ашы', ''], other: ['Башка', 'каалаган майрам'] },
      steps: ['Кимдин тою', 'Качан жана кайда', 'Сүрөттөр', 'Жасалгасы', 'Кошумча'],
      stepOf: (i, n) => `${n} кадамдын ${i}-кадамы`,
      next: 'Андан ары', back: 'Артка', preview: 'Конок кандай көрөт', finish: 'Даяр — сактоо', skip: 'Өткөрүп жиберүү',
      kindL: 'Тойдун түрү', whoH: 'Кимдин тою?', whoL: 'Аттар конвертте, мөөрдө жана чакыруунун текстинде көрүнөт.',
      groom: 'Күйөө бала', bride: 'Колукту', girl: 'Кыздын аты', child: 'Баланын аты', hero: 'Кимдин мааракеси', memo: 'Кимдин элесине', otherName: 'Кимдин тою', otherTitle: 'Тойдун аталышы',
      ph: { groom: 'Азамат', bride: 'Айпери', girl: 'Айпери', child: 'Нурсултан', hero: 'Бакыт Асанович', memo: 'Асан Бакытович', otherTitle: 'Мисалы, «Үй той»', sign: 'Мисалы, «Асановдордун үй-бүлөсү»', venue: '«Ала-Тоо» ресторан', addr: 'Бишкек, Токтогул көч., 100', map: 'https://2gis.kg/…' },
      fromWhom: 'Ким чакырат', fromG: 'Күйөө баланын ата-энеси', fromB: 'Колуктунун ата-энеси', fromC: 'Жаштардын өздөрү',
      sign: 'Төмөнкү кол тамга', optional: 'милдеттүү эмес',
      whenH: 'Качан жана кайда?', whenL: 'Коноктор күнүн, тойго чейин канча калганын жана «2ГИСте ачуу» баскычын көрүшөт.',
      date: 'Күнү', time: 'Убактысы', venue: 'Жери', addr: 'Дареги', mapUrl: '2ГИС шилтемеси',
      mapHint: '2ГИСте жерди ачып → «Бөлүшүү» → «Шилтемени көчүрүү». Шилтеме жок болсо, 2ГИС аталышы жана дареги боюнча табат.',
      dateNeed: 'Тойдун күнүн жазыңыз', namesNeed: 'Атын жазыңыз',
      photoH: 'Сүрөттөр', photoL: 'Негизги сүрөт чакыруунун биринчи экранында, калгандары — галереяда. Өткөрүп жиберсе да болот.',
      heroPh: 'Негизги сүрөт', heroAdd: 'Негизги сүрөт кошуу', heroHint: 'Тик сүрөт жакшы, жүздөр даана көрүнсүн', change: 'Алмаштыруу', remove: 'Алып салуу',
      gallery: 'Галерея', galleryHint: (n) => `10 сүрөткө чейин · кошулду ${n}`, uploading: 'Жүктөлүүдө…', photoErr: 'Сүрөт жүктөлгөн жок. Башкасын сынап көрүңүз.',
      designH: 'Жасалгасы', designL: 'Түсүн, конвертти жана музыканы тандаңыз. Баары дароо көрүнөт.',
      theme: 'Түстөр', envelope: 'Конверт', envClassic: 'Мөөр басылган', envClassicS: 'Конок мөөрдү сындырат', envNavy: '«Түн» видео-конверти', envNavyS: 'Конверт өзү ачылат',
      music: 'Музыка', musicS: 'Конок конвертти ачканда «Бакыт кушу» обону ойнойт', lang: 'Чакыруунун тили', langS: 'Конок тилди өзү алмаштыра алат',
      text: 'Чакыруунун тексти', textAuto: 'Даяр текст (аттарыңыз менен):', textOwn: 'Өз текстимди жазам', textUseAuto: 'Даяр текстке кайтуу', textOwnPh: 'Чакыруунун тексти',
      detH: 'Кошумча', detL: 'Керектүүсүн күйгүзүңүз. Жөнөткөндөн кийин да өзгөртсө болот — коноктор ошол эле шилтемеден көрүшөт.',
      countdown: 'Тойго чейин канча калды', countdownS: 'Күн, саат, мүнөт',
      program: 'Той программасы', programS: 'Мисалы: 17:00 — конокторду тосуу', addRow: 'Сап кошуу', progTime: '17:00', progText: 'Конокторду тосуу',
      dress: 'Дресс-код', dressS: 'Кийим жана түстөр боюнча каалоо', dressPh: 'Мисалы: ак жана алтын түстөгү кийимдер менен келсеңиздер, кубанабыз',
      rsvp: 'Коноктордун жообу', rsvpS: '«Барам / Бара албайм» — чакыруунун ичинде эле', askCount: 'Канча киши келерин суроо', deadline: 'Жооп берүү мөөнөтү',
      wishes: 'Тилектер', wishesS: 'Коноктор жылуу сөздөрүн калтырышат', wPublic: 'Баары көрөт', wPrivate: 'Сиз гана', wOff: 'Өчүрүү',
      saveH: 'Чакырууну сактаңыз', saveL: 'Google аркылуу кириңиз — чакыруу сакталат жана коноктор үчүн шилтеме аласыз. Ал «Той Менеджер» тиркемесинде да пайда болот.',
      google: 'Google аркылуу кирүү', loginAlt: 'Болбой жатабы? Башка жол менен кирүү', loginErr: 'Кирүү болгон жок. Кайра аракет кылыңыз.', creating: 'Чакыруу сакталууда…',
      createErr: 'Сакталган жок. Интернетти текшерип, кайра аракет кылыңыз.',
      tabCard: 'Чакыруу', tabGuests: 'Коноктор', tabSend: 'Жөнөтүү', allInv: 'Бардык чакыруулар',
      trialT: 'Сынамык версия', trialP: 'Чакырууда «Үлгү» белгиси бар. Аны алып салыңыз — анан конокторго жөнөтсө болот.',
      removeWm: 'Белгини алып салуу', paidT: 'Төлөндү', paidP: (d) => `Чакыруу белгисиз — ${d} чейин.`, proP: (d) => `Тиркеменин толук версиясы ${d} чейин.`,
      checkT: 'Белги алынды', checkP: 'Төлөмдү бир күндүн ичинде текшеребиз. Чакырууну конокторго жөнөтө берсеңиз болот.',
      forgotT: 'Төлөп койдуңузбу?', forgotP: 'Акча которгон болсоңуз, «Төлөдүм» баскычын басыңыз — антпесе кимдин төлөмү экенин билбейбиз жана белги калат.', paidShort: 'Төлөдүм', waitT: 'Төлөм текшерилүүдө', waitP: 'Текшергенден кийин (адатта бир күндүн ичинде) белги жоголот.',
      upgrade: 'Тиркеменин толук версиясы',
      general: 'Жалпы шилтеме', generalS: 'Топторго, WhatsApp статусуна жана соцтармактарга. Конок атын жазып жооп берет — жообу сизге келет.',
      personal: 'Жеке шилтемелер', personalS: 'Ар бир конокко — өз аты жазылган чакыруу: «Урматтуу Асан байке». Ким ачканын жана эмне деп жооп бергенин көрөсүз.',
      toGuests: 'Конокторго өтүү', copy: 'Көчүрүү', copied: 'Шилтеме көчүрүлдү', share: 'WhatsAppка', open: 'Ачуу', views: (n) => `Жалпы шилтеме боюнча ачышты: ${n}`,
      inApp: '«Той Менеджер» тиркемесинде — ушул эле чакыруу, кошумча конверттер, бюджет жана отургузуу.',
      gAdd: 'Конок кошуу', gAddOne: 'Бир конок', gAddMany: 'Тизме менен',
      gName: 'Аты', gNamePh: 'Асан Бекович', gAddr: 'Кантип кайрылуу', gAddrPh: 'Асан байке', gAddrS: 'Конок конвертте өз атын ушинтип көрөт', gPhone: 'WhatsApp номери', gPhonePh: '0555 123 456', gParty: 'Канча киши',
      gManyPh: 'Асан байке, 0555 123 456, 3\nГүлнара эже, 0700 111 222, 2\nБакыт', gManyS: 'Ар бир конок — жаңы саптан. Үтүр менен телефонду жана канча киши экенин кошсо болот.',
      gSave: 'Кошуу', gSaveN: (n) => `${n} конок кошуу`, gEdit: 'Конокту өзгөртүү', gDel: 'Конокту өчүрүү', gDelQ: 'Конокту тизмеден өчүрөсүзбү?',
      gEmptyT: 'Азырынча конок жок', gEmptyS: 'Конокторду кошуңуз — ар бири өз аты жазылган чакыруу алат.',
      kGuests: 'конок', kPeople: 'киши', kOpened: 'ачышты', kComing: 'келет',
      fAll: 'Баары', fNot: 'Жөнөтүлгөн жок', fSent: 'Жөнөтүлдү', fOpened: 'Ачышты', fYes: 'Келишет', fNo: 'Келе албайт',
      sNot: 'Жөнөтүлгөн жок', sSent: 'Жөнөтүлдү', sOpened: 'Ачты', sYes: (n) => `Келет · ${n}`, sNo: 'Келе албайт',
      send: 'Жөнөтүү', resend: 'Дагы', copyLink: 'Шилтемени көчүрүү', viewAs: 'Чакырууну көрүү', people: (n) => `${n} киши`,
      limitT: (p, l) => `${l} акысыздан ${p}`, limitFull: 'Акысыз орундар бүттү — чакырууну төлөсөңүз, конокторду чексиз кошо бересиз.',
      limitPart: (n) => `${n} конок кошулду. Калгандарына акысыз орун жетпеди — чакырууну төлөсөңүз, чек болбойт.`, added: (n) => `Кошулду: ${n}`,
      msgHi: (n) => `Урматтуу ${n}!`, msgInv: (k) => `Сизди ${k} чакырабыз`, msgLink: 'Чакыруу жана жооп берүү — шилтемеде:', msgBye: 'Сизди күтөбүз!',
      msgGeneral: 'Сизди тоюбузга чакырабыз!',
      payH: '«Үлгү» белгисин алып салуу', payL: 'Ушул той үчүн бир жолу төлөнөт. Жасаганыңыздын баары сакталат.',
      payInvT: 'Онлайн чакыруу', payProT: 'Тиркеме', payUp: 'кошумча төлөм',
      payInvL: ['«Үлгү» белгисиз чакыруу', 'Жеке шилтемелер жана «ким ачты»', 'Коноктор чексиз', 'Ушул той үчүн гана · бир жылга, тойдон кийин 3 айдан кем эмес'],
      payProL: ['Онлайн чакыруунун баары', 'Тиркеменин толук версиясы', '«Кире бериш», конверттер, бюджет, белектер'],
      payNext: 'Төлөөгө өтүү', payAmount: 'Төлөө', payNum: (n) => `Комментарий үчүн тойдун номери: ${n}`,
      payStep1: '«Төлөө» баскычын басыңыз — банк тиркемеси ачылат (MBank же Кыргызстандагы башка банк). Компьютерден болсо — QRди телефон менен сканерлеңиз.',
      payStep2: (p) => `${p} сом сумма жазылып турат — текшерип, которууну ырастаңыз.`, payStep3: 'Бул жакка кайтып, «Төлөдүм» баскычын басыңыз.',
      payBtn: 'Банк тиркемесинде төлөө', payer: 'Жөнөтүүчүнүн аты — банктагыдай', payerS: 'Мисалы, «Айбек Т.» — ушундай төлөмүңүздү табабыз.',
      paid: 'Төлөдүм', sending: 'Жөнөтүлүүдө…', payErr: 'Жөнөтүлгөн жок. Интернетти текшерип, кайра аракет кылыңыз.',
      payOkT: 'Рахмат! Белги алынды', payOkP: 'Төлөмдү бир күндүн ичинде текшеребиз. Чакырууну конокторго азыр эле жөнөтө берсеңиз болот.',
      payWaitT: 'Өтүнмө кабыл алынды', payWaitP: 'Төлөмдү бир күндүн ичинде текшеребиз — андан кийин «Үлгү» белгиси жоголот. Номер калтырсаңыз, WhatsApp аркылуу жазабыз.', phoneL: 'Жооп үчүн WhatsApp (милдеттүү эмес)', phoneS: 'Чакыруу ачылганда жазабыз.',
      payHelp: 'Төлөм боюнча суроолор — WhatsApp 0755 666 999', done: 'Жакшы',
      notFound: 'Чакыруу табылган жок же сизде уруксат жок.', loadErr: 'Жүктөлгөн жок. Интернетти текшерип, баракты жаңылаңыз.',
      envShow: 'Конвертти көрсөтүү', envHide: 'Конвертсиз', close: 'Жабуу', openNew: 'Өзүнчө ачуу',
      sample: 'Асан байке', titleSep: ' — ',
      kindTitle: { wedding: 'үйлөнүү той', kyz_uzatuu: 'кыз узатуу', sunnot: 'сүннөт той', beshik: 'бешик той', tushoo: 'тушоо кесүү', jubilee: 'маараке', memorial: 'эскерүү ашы', other: 'той' },
      kindTo: { wedding: 'үйлөнүү тоюна', kyz_uzatuu: 'кыз узатуу тоюна', sunnot: 'сүннөт тойго', beshik: 'бешик тойго', tushoo: 'тушоо кесүү тоюна', jubilee: 'мааракеге', memorial: 'эскерүү ашына', other: 'тойго' },
      and: 'менен', months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
      days: ['жекшемби', 'дүйшөмбү', 'шейшемби', 'шаршемби', 'бейшемби', 'жума', 'ишемби'],
      when: (d, mo, wd, t) => `${d}-${mo}, ${wd}, саат ${t}`, noDate: 'Күнү көрсөтүлгөн эмес',
      opened: (s) => `ачты ${s}`, ago: { now: 'азыр эле', m: (n) => `${n} мүн мурун`, h: (n) => `${n} саат мурун`, d: (n) => `${n} күн мурун` },
      privacy: 'Купуялык саясаты', help: 'WhatsAppта жардам',
      draftFound: 'Сакталбаган долбооруңуз бар', draftGo: 'Улантуу', draftNew: 'Башынан баштоо',
    },
  };

  // Приложение ещё не в Google Play: продаём только онлайн-приглашение, «Приложение 990» показываем как «скоро». Снять флаг после публикации.
  const APP_SOON = true;
  const KIND_IDS = ['wedding', 'kyz_uzatuu', 'sunnot', 'beshik', 'tushoo', 'jubilee', 'memorial', 'other'];
  // Стороны и категории гостей — как у тоя из приложения
  const SIDES = {
    wedding: [['Сторона отца', 'Ата тарап'], ['Сторона матери', 'Эне тарап'], ['Друзья жениха', 'Күйөө баланын достору']],
    kyz_uzatuu: [['Сторона отца', 'Ата тарап'], ['Сторона матери', 'Эне тарап'], ['Подруги невесты', 'Колуктунун курбулары']],
    sunnot: [['Сторона отца', 'Ата тарап'], ['Сторона матери', 'Эне тарап']], beshik: [['Сторона отца', 'Ата тарап'], ['Сторона матери', 'Эне тарап']],
    tushoo: [['Сторона отца', 'Ата тарап'], ['Сторона матери', 'Эне тарап']], jubilee: [['Родня', 'Туугандар'], ['Друзья', 'Достор']], memorial: [], other: [],
  };
  const CATEGORIES = ['Туугандар', 'Кудалар', 'Тайкелер', 'Достор', 'Кошуналар', 'Классташтар', 'Кесиптештер'];
  // Оформления открытки — те же, что в /inv/inv.js
  const THEMES = [
    { id: 'ak-altyn', name: 'Ак алтын', bg: 'linear-gradient(150deg,#FBF6EC,#EFE2C9)', ink: '#A9823E' },
    { id: 'ak', name: 'Ак', bg: 'linear-gradient(150deg,#FFFFFF,#F4EBDD)', ink: '#7A1E2C' },
    { id: 'tun', name: 'Түн', bg: 'linear-gradient(150deg,#1C2A52,#0D1530)', ink: '#E6CF9A' },
    { id: 'tunku', name: 'Түнкү', bg: 'linear-gradient(150deg,#1D4A40,#0F2A25)', ink: '#E9D7AE' },
    { id: 'anar', name: 'Анар', bg: 'linear-gradient(150deg,#6B1A2C,#3A0D18)', ink: '#EFD9A8' },
    { id: 'jashyl', name: 'Жашыл', bg: 'linear-gradient(150deg,#164A3F,#0D2B25)', ink: '#E7D3A2' },
    { id: 'kiyiz', name: 'Кийиз', bg: 'linear-gradient(150deg,#FBF4E8,#EADCC4)', ink: '#A3271F' },
    { id: 'bermet', name: 'Бермет', bg: 'linear-gradient(150deg,#FFF8F5,#F1DCD6)', ink: '#9A5560' },
    { id: 'asman', name: 'Асман', bg: 'linear-gradient(150deg,#FBFDFF,#DCE6F1)', ink: '#2C5580' },
    { id: 'boz', name: 'Боз', bg: 'linear-gradient(150deg,#F7F6F3,#DFDDD8)', ink: '#3C4044' },
  ];
  const DRESS = ['#FFFFFF', '#F1E6D2', '#D9BE8C', '#B48A3E', '#7A1E2C', '#16213F', '#0F3A31', '#C9A7D8', '#F4B8C8', '#1E1E1E'];

  // ---------- Состояние ----------
  const qs = new URLSearchParams(location.search);
  let lang = qs.get('lang') === 'ky' || qs.get('lang') === 'ru' ? qs.get('lang') : (store.get('lang') || ((navigator.language || '').startsWith('ky') ? 'ky' : 'ru'));
  const S = {
    user: null, tois: null,           // мои тои (web_my_tois)
    draft: null, step: 0,             // черновик открытки (новый или загруженный из базы)
    toi: null,                        // загруженный той: { id, num, eventId, slug, plan, title }
    guests: null, gFilter: 'all',
    save: { state: 'idle', t: null }, // автосохранение
    view: null,
  };
  const L = () => T[lang];

  // ---------- Черновик ----------
  function newDraft(kind) {
    const memorial = kind === 'memorial';
    return {
      kind, name_a: '', name_b: '', from_whom: 'groom_parents', title: '', signature: '',
      date: '', time: memorial ? '12:00' : '17:00', venue_name: '', venue_address: '', map_url: '',
      hero_photo: null, gallery: [], theme: memorial ? 'boz' : 'tun', envelope: memorial ? 'classic' : 'navy', music: memorial ? 'none' : 'theme', lang: lang === 'ru' ? 'ru' : 'ky',
      own_text: false, text_ky: '', text_ru: '',
      show_countdown: !memorial, show_program: false, program: [], show_dress: false, dress_text: '', dress_colors: [],
      rsvp_enabled: true, rsvp_ask_count: true, rsvp_deadline: '', wishes_mode: memorial ? 'off' : 'public',
    };
  }
  const DRAFT_KEY = 'tm_create_draft';
  const saveLocal = () => { if (!S.toi && S.draft) store.set(DRAFT_KEY, JSON.stringify({ d: S.draft, step: S.step, at: Date.now() })); };
  const loadLocal = () => { try { const x = JSON.parse(store.get(DRAFT_KEY) || 'null'); return x && x.d && KIND_IDS.includes(x.d.kind) ? x : null; } catch { return null; } };

  // Фото черновика до входа — в IndexedDB браузера (переживают переход на страницу входа Google)
  const idb = (() => {
    let dbp = null;
    const open = () => dbp || (dbp = new Promise((res, rej) => {
      const r = indexedDB.open('tm-create', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('photos');
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    }));
    const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('photos', mode); const st = t.objectStore('photos'); const out = fn(st); t.oncomplete = () => res(out.result ?? out); t.onerror = () => rej(t.error); }); };
    return {
      put: (k, blob) => tx('readwrite', (s) => s.put(blob, k)).catch(() => null),
      get: (k) => tx('readonly', (s) => s.get(k)).catch(() => null),
      del: (k) => tx('readwrite', (s) => s.delete(k)).catch(() => null),
    };
  })();
  const blobUrls = new Map();   // 'local:xxx' → blob: URL
  async function localUrl(key) {
    if (blobUrls.has(key)) return blobUrls.get(key);
    const b = await idb.get(key.slice(6));
    if (!b) return null;
    const u = URL.createObjectURL(b); blobUrls.set(key, u); return u;
  }
  const photoSrc = (p) => (!p ? '' : p.startsWith('local:') ? (blobUrls.get(p) || '') : `${SB}/storage/v1/object/public/invite-photos/${p}`);

  // Уменьшаем фото перед загрузкой: до 1600 px по длинной стороне, JPEG
  async function shrink(file) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = URL.createObjectURL(file); });
    const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    return new Promise((res) => c.toBlob((b) => res(b), 'image/jpeg', 0.86));
  }
  const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(9)), (b) => 'abcdefghijklmnopqrstuvwxyz0123456789'[b % 36]).join('');
  async function uploadPhoto(toiId, blob) {
    const path = `${toiId}/${rid()}.jpg`;
    const { error } = await sb.storage.from('invite-photos').upload(path, blob, { contentType: 'image/jpeg', upsert: false });
    if (error) throw error;
    return path;
  }

  // ---------- Дата и время (по Бишкеку) ----------
  const startsIso = (d) => (d.date ? `${d.date}T${/^\d{2}:\d{2}$/.test(d.time) ? d.time : '17:00'}:00+06:00` : null);
  function splitIso(iso) {
    if (!iso) return { date: '', time: '17:00' };
    const x = new Date(Date.parse(iso) + 6 * 3600e3);
    return { date: `${x.getUTCFullYear()}-${pad(x.getUTCMonth() + 1)}-${pad(x.getUTCDate())}`, time: `${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}` };
  }
  function fmtWhen(iso, lg = lang) {
    if (!iso) return '';
    const x = new Date(Date.parse(iso) + 6 * 3600e3), t = T[lg];
    return t.when(x.getUTCDate(), t.months[x.getUTCMonth()], t.days[x.getUTCDay()], `${pad(x.getUTCHours())}:${pad(x.getUTCMinutes())}`);
  }
  const fmtDay = (iso) => { const x = new Date(Date.parse(iso) + 6 * 3600e3); return lang === 'ky' ? `${x.getUTCDate()}-${L().months[x.getUTCMonth()]} ${x.getUTCFullYear()}` : `${x.getUTCDate()} ${L().months[x.getUTCMonth()]} ${x.getUTCFullYear()}`; };
  function ago(iso) {
    const s = Math.max(0, (Date.now() - Date.parse(iso)) / 1000), a = L().ago;
    if (s < 90) return a.now; if (s < 3600) return a.m(Math.round(s / 60)); if (s < 86400) return a.h(Math.round(s / 3600)); return a.d(Math.round(s / 86400));
  }

  // ---------- Названия ----------
  function namesOf(d, lg = lang) {
    const a = (d.name_a || '').trim(), b = (d.name_b || '').trim();
    return [a, b].filter(Boolean).join(lg === 'ky' ? ' менен ' : ' и ');
  }
  function titleFor(d, lg = lang) {
    if (d.kind === 'other' && d.title.trim()) return d.title.trim();
    const n = namesOf(d, lg), k = T[lg].kindTitle[d.kind];
    return n ? `${n}${T[lg].titleSep}${k}` : k.charAt(0).toUpperCase() + k.slice(1);
  }
  const initialsOf = (d) => [d.name_a, d.name_b].map((n) => (n || '').trim()[0]?.toUpperCase()).filter(Boolean).join(' · ');

  // Поля открытки для базы (invite_cards)
  function cardRow(d) {
    return {
      theme: d.theme, music: d.music, lang: d.lang, envelope: d.envelope,
      title: d.kind === 'other' ? (d.title.trim() || null) : null,
      name_a: d.name_a.trim() || null, name_b: d.kind === 'wedding' ? (d.name_b.trim() || null) : null, initials: null,
      from_whom: d.from_whom, signature: d.signature.trim() || null, map_url: /^https:\/\//i.test(d.map_url.trim()) ? d.map_url.trim() : null,
      text_ky: d.own_text ? (d.text_ky.trim() || null) : null, text_ru: d.own_text ? (d.text_ru.trim() || null) : null,
      show_countdown: d.show_countdown, show_program: d.show_program,
      program: d.program.filter((p) => (p.time || '').trim() || (p.text || '').trim()).slice(0, 12).map((p) => ({ time: (p.time || '').trim().slice(0, 10), text: (p.text || '').trim().slice(0, 80) })),
      show_dress: d.show_dress, dress_text: d.dress_text.trim() || null, dress_colors: d.dress_colors.slice(0, 6),
      rsvp_enabled: d.rsvp_enabled, rsvp_ask_count: d.rsvp_ask_count, rsvp_deadline: d.rsvp_deadline || null, wishes_mode: d.wishes_mode,
      hero_photo: d.hero_photo && !d.hero_photo.startsWith('local:') ? d.hero_photo : null,
      gallery: d.gallery.filter((p) => !p.startsWith('local:')),
    };
  }
  function draftFromDb(toi, ev, card) {
    const c = card || {}, w = splitIso(ev?.starts_at);
    const d = newDraft(toi.kind);
    Object.assign(d, {
      name_a: c.name_a || '', name_b: c.name_b || '', from_whom: c.from_whom || 'groom_parents', title: c.title || (toi.kind === 'other' ? toi.title : ''),
      signature: c.signature || '', date: w.date, time: w.time, venue_name: ev?.venue_name || '', venue_address: ev?.venue_address || '', map_url: c.map_url || '',
      hero_photo: c.hero_photo || null, gallery: Array.isArray(c.gallery) ? c.gallery : [], theme: c.theme || d.theme, envelope: c.envelope || 'classic',
      music: c.music || d.music, lang: c.lang || 'ky', own_text: Boolean(c.text_ky || c.text_ru), text_ky: c.text_ky || '', text_ru: c.text_ru || '',
      show_countdown: c.show_countdown ?? d.show_countdown, show_program: Boolean(c.show_program), program: Array.isArray(c.program) ? c.program : [],
      show_dress: Boolean(c.show_dress), dress_text: c.dress_text || '', dress_colors: Array.isArray(c.dress_colors) ? c.dress_colors : [],
      rsvp_enabled: c.rsvp_enabled ?? true, rsvp_ask_count: c.rsvp_ask_count ?? true, rsvp_deadline: c.rsvp_deadline || '', wishes_mode: c.wishes_mode || d.wishes_mode,
    });
    // приглашение из приложения без имён: берём название тоя
    if (!d.name_a && toi.kind !== 'other') d.name_a = '';
    return d;
  }

  // Готовый текст приглашения — тот же, что в открытке (inv.js), для показа в конструкторе
  const VOW = 'аыеэиоуөүёюя';
  function kySuffix(name, gen) {
    const w = name.trim().toLowerCase(), last = w.slice(-1);
    const v = [...w].reverse().find((c) => VOW.includes(c)) || 'а';
    const vow = 'аыёя'.includes(v) ? 'ы' : 'еэи'.includes(v) ? 'и' : 'оую'.includes(v) ? 'у' : 'ү';
    const cons = VOW.includes(last) ? 'н' : 'кпстфхчшщц'.includes(last) ? 'т' : 'д';
    return name.trim() + cons + vow + (gen ? 'н' : '');
  }
  const kyGen = (n) => kySuffix(n, true), kyAcc = (n) => kySuffix(n, false);
  function autoText(d, lg) {
    const ky = lg === 'ky', a = d.name_a.trim() || (ky ? 'Азамат' : 'Азамат'), b = d.name_b.trim();
    switch (d.kind) {
      case 'wedding': {
        const bb = b || 'Айпери';
        if (d.from_whom === 'bride_parents') return ky ? `Сизди кызыбыз ${bb} менен күйөө балабыз ${kyGen(a)} үйлөнүү тоюна арналган салтанаттуу дасторконубузга кадырлуу конок болууга чакырабыз.` : `Наша дочь ${bb} и наш зять ${a} создают семью. Приглашаем вас стать дорогим гостем на праздничном дасторконе в честь их свадьбы.`;
        if (d.from_whom === 'couple') return ky ? 'Сизди биздин үйлөнүү тоюбузга арналган салтанаттуу кечеге кадырлуу конок болууга чакырабыз.' : 'Приглашаем вас разделить с нами радость — на праздничный вечер в честь нашей свадьбы.';
        return ky ? `Сизди уулубуз ${a} менен келинибиз ${kyGen(bb)} үйлөнүү тоюна арналган салтанаттуу дасторконубузга кадырлуу конок болууга чакырабыз.` : `Наш сын ${a} и наша невестка ${bb} создают семью. Приглашаем вас стать дорогим гостем на праздничном дасторконе в честь их свадьбы.`;
      }
      case 'kyz_uzatuu': return ky ? `Сизди кызыбыз ${kyAcc(a)} узатуу тоюна арналган салтанаттуу дасторконубузга кадырлуу конок болууга чакырабыз.` : `Мы провожаем нашу дочь ${a} в новую семью. Приглашаем вас на кыз узатуу — праздничный дасторкон в её честь.`;
      case 'sunnot': return ky ? `Сизди уулубуз ${kyGen(a)} сүннөт тоюна кадырлуу конок болууга чакырабыз.` : `Приглашаем вас на сүннөт той. Виновник торжества — наш сын ${a}.`;
      case 'beshik': return ky ? `Сизди ${kyGen(a)} бешик тоюна кадырлуу конок болууга чакырабыз.` : `Приглашаем вас на бешик той — праздник в честь нашего малыша ${a}.`;
      case 'tushoo': return ky ? `Сизди ${kyGen(a)} тушоо кесүү тоюна кадырлуу конок болууга чакырабыз.` : `${a} делает первые шаги! Приглашаем вас на тушоо кесүү.`;
      case 'jubilee': return ky ? `Сизди ${kyGen(a)} мааракесине арналган салтанаттуу кечеге кадырлуу конок болууга чакырабыз.` : `Приглашаем вас на праздничный вечер: ${a} отмечает юбилей.`;
      case 'memorial': return ky ? `Сизди ${kyGen(a)} элесине арналган ашка чакырабыз.` : `Приглашаем вас на аш — почтить память: ${a}.`;
      default: return ky ? 'Сизди салтанаттуу кечебизге кадырлуу конок болууга чакырабыз.' : 'Приглашаем вас на наш праздник.';
    }
  }

  // ---------- Предпросмотр ----------
  const pv = $('pv'), frame = $('pvFrame');
  let pvReady = false, pvEnv = false, pvTimer = null, pvLoaded = false;
  function pvData() {
    const d = S.draft, ky = d.lang === 'ky';
    const card = cardRow(d);
    card.name_a = d.name_a.trim() || null; card.name_b = d.kind === 'wedding' ? (d.name_b.trim() || null) : null;
    card.initials = null;
    card.hero_photo = d.hero_photo ? (d.hero_photo.startsWith('local:') ? photoSrc(d.hero_photo) || null : d.hero_photo) : null;
    card.gallery = d.gallery.map((p) => (p.startsWith('local:') ? photoSrc(p) : p)).filter(Boolean);
    const paid = S.toi ? Boolean(S.toi.plan?.card_paid) : false;
    return {
      mode: 'personal', paid,
      toi: { title: titleFor(d, ky ? 'ky' : 'ru'), kind: d.kind },
      event: { starts_at: startsIso(d), venue_name: d.venue_name.trim(), venue_address: d.venue_address.trim() },
      card, guest: { name: L().sample, party_size: 2, lang: null, rsvp: 'pending', rsvp_count: null },
      wishes: [],
    };
  }
  function pvSend(open) {
    if (!pvReady || !S.draft) return;
    frame.contentWindow.postMessage({ type: 'tm-card', r: pvData(), lang: S.draft.lang, open }, location.origin);
  }
  const pvUpdate = () => { clearTimeout(pvTimer); pvTimer = setTimeout(() => pvSend(!pvEnv), 120); };
  function pvLoad(env) {
    pvEnv = env; pvReady = false;
    frame.src = `../inv/?preview=1${env ? '&env=1' : ''}&r=${Date.now()}`;
    pvLoaded = true;
    $('pvEnv').textContent = $('pvEnv2').textContent = env ? L().envHide : L().envShow;
  }
  window.addEventListener('message', (e) => {
    if (e.origin !== location.origin || e.source !== frame.contentWindow || e.data?.type !== 'tm-ready') return;
    pvReady = true; pvSend(!pvEnv);
  });
  function pvShow(on) {
    pv.hidden = !on;
    if (on && !pvLoaded) pvLoad(false);
    placePv();
  }
  function placePv() {
    const slot = document.querySelector('.pv-slot');
    if (!slot || pv.hidden || !isDesktop()) { pv.style.left = ''; return; }
    pv.style.left = `${slot.getBoundingClientRect().left}px`;
  }
  addEventListener('resize', placePv);
  // Кнопка «Назад» на телефоне закрывает открытое окно (предпросмотр, оплата…), а не уходит со страницы
  let layerPushed = false;
  const layerOpen = () => { if (!layerPushed) { history.pushState({ tmLayer: 1 }, ''); layerPushed = true; } };
  const layerDone = () => {
    if (!layerPushed) return;
    layerPushed = false;
    setTimeout(() => { if (history.state && history.state.tmLayer) history.back(); }, 0);
  };
  addEventListener('popstate', () => {
    if (!layerPushed) return;
    layerPushed = false;
    if (sheetClose) sheetClose(); else pv.classList.remove('open');
  });
  $('pvClose').onclick = () => { pv.classList.remove('open'); layerDone(); };
  $('pvEnv').onclick = $('pvEnv2').onclick = () => pvLoad(!pvEnv);
  const openPreview = () => { pv.classList.add('open'); layerOpen(); if (pvReady) pvSend(!pvEnv); };

  // ---------- Сохранение ----------
  function setSave(state) {
    S.save.state = state;
    const el = $('saveState');
    el.hidden = !S.toi || state === 'idle';
    el.className = `save-state${state === 'busy' ? ' busy' : state === 'err' ? ' err' : ''}`;
    el.querySelector('span').textContent = state === 'busy' ? L().saving : state === 'err' ? L().saveErr : L().saved;
  }
  let saveTimer = null, saving = null, again = false;
  function changed(opts = {}) {
    if (S.toi) { setSave('busy'); clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, opts.now ? 0 : 900); }
    else saveLocal();
    pvUpdate();
  }
  async function saveNow() {
    if (!S.toi || !S.draft) return;
    if (saving) { again = true; return; }
    const d = S.draft, t = S.toi;
    saving = (async () => {
      const r1 = await sb.from('invite_cards').update(cardRow(d)).eq('toi_id', t.id);
      if (r1.error) throw r1.error;
      if (t.eventId) {
        const r2 = await sb.from('toi_events').update({ starts_at: startsIso(d), venue_name: d.venue_name.trim() || null, venue_address: d.venue_address.trim() || null }).eq('id', t.eventId);
        if (r2.error) throw r2.error;
      }
      if (t.kind !== d.kind) { const r3 = await sb.from('tois').update({ kind: d.kind }).eq('id', t.id); if (r3.error) throw r3.error; t.kind = d.kind; }
    })();
    try { await saving; setSave('ok'); } catch { setSave('err'); }
    saving = null;
    if (again) { again = false; saveNow(); }
  }
  addEventListener('beforeunload', (e) => { if (S.save.state === 'busy') { saveNow(); e.preventDefault(); } });

  // ---------- Окна и сообщения ----------
  function toast(msg, bad) {
    const el = document.createElement('div'); el.className = `toast${bad ? ' bad' : ''}`; el.setAttribute('role', 'status'); el.textContent = msg;
    $('toastRoot').replaceChildren(el); setTimeout(() => el.remove(), 2800);
  }
  let sheetClose = null;
  function sheet(html, onBind) {
    const root = $('sheetRoot');
    root.innerHTML = `<div class="sheet-bg" role="dialog" aria-modal="true"><div class="sheet"><button class="x" type="button" data-close aria-label="${esc(L().close)}">×</button>${html}</div></div>`;
    const bg = root.firstElementChild;
    const close = () => { root.innerHTML = ''; document.body.style.overflow = ''; sheetClose = null; layerDone(); };
    layerOpen();
    sheetClose = close;
    bg.addEventListener('click', (e) => { if (e.target === bg || e.target.closest('[data-close]')) close(); });
    document.body.style.overflow = 'hidden';
    onBind && onBind(bg.querySelector('.sheet'), close);
    setTimeout(() => bg.querySelector('input:not([type=hidden]), textarea, button.primary')?.focus(), 60);
    return close;
  }
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (sheetClose) sheetClose(); else { pv.classList.remove('open'); layerDone(); } } });
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch { const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    toast(L().copied);
  }
  function normalizePhone(raw) {
    if (!raw) return null;
    let d = String(raw).replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.length === 10 && d.startsWith('0')) d = '996' + d.slice(1);
    if (d.length === 9) d = '996' + d;
    return d.length >= 10 ? d : null;
  }
  const waUrl = (phone, text) => { const p = normalizePhone(phone); return `https://wa.me/${p || ''}?text=${encodeURIComponent(text)}`; };

  // ---------- Вход ----------
  async function signIn() {
    store.set('tm_auth_return', location.pathname + location.hash);
    const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/create/` } });
    if (error) toast(L().loginErr, true);
  }
  // Вход официальной кнопкой Google: в окне выбора аккаунта видно «Той Менеджер» / toimanager.app, а не адрес базы.
  // Если кнопка Google не загрузилась (блокировщик, встроенный браузер) — остаётся прежний вход с переходом.
  const GIS_ID = '81399528422-4qkukvj81iu9f8f7nv54kboaadfblaij.apps.googleusercontent.com';
  let gisP = null;
  function loadGis() {
    if (!gisP) {
      gisP = new Promise((res, rej) => {
        if (window.google?.accounts?.id) { res(); return; }
        const sc = document.createElement('script'); sc.src = 'https://accounts.google.com/gsi/client'; sc.async = true;
        sc.onload = () => (window.google?.accounts?.id ? res() : rej(new Error('gis'))); sc.onerror = () => rej(new Error('gis'));
        document.head.appendChild(sc); setTimeout(() => rej(new Error('gis timeout')), 6000);
      });
      gisP.catch(() => { gisP = null; });
    }
    return gisP;
  }
  const hex = (buf) => Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  async function gisButton(slot, reasonSave, close) {
    try {
      if (!window.crypto?.subtle) return false;
      await loadGis();
      const raw = hex(crypto.getRandomValues(new Uint8Array(16)));
      const hashed = hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)));
      google.accounts.id.initialize({
        client_id: GIS_ID, nonce: hashed, ux_mode: 'popup', itp_support: true,
        callback: async (r) => {
          const { data, error } = await sb.auth.signInWithIdToken({ provider: 'google', token: r.credential, nonce: raw });
          if (error || !data?.user) { toast(L().loginErr, true); return; }
          S.user = data.user; S.tois = null; close(); renderAcct();
          track('login', { method: 'google_gis' });
          if (reasonSave || store.get('tm_pending_save')) { store.del('tm_pending_save'); createFromDraft(); } else route();
        },
      });
      slot.replaceChildren();
      google.accounts.id.renderButton(slot, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill',
        logo_alignment: 'center', locale: lang === 'ky' ? 'ky' : 'ru', width: Math.min(320, slot.clientWidth || 300) });
      return true;
    } catch (e) { return false; }
  }
  function loginSheet(reasonSave) {
    sheet(`<h2>${esc(reasonSave ? L().saveH : L().login)}</h2><p class="lead3">${esc(L().saveL)}</p>
      <div id="gisSlot" style="display:flex;justify-content:center;min-height:44px"><button class="google" type="button" id="gBtn">${G_LOGO}<span>${esc(L().google)}</span></button></div>
      <button type="button" class="link" id="gAlt" hidden style="display:block;margin:12px auto 0;font-size:14px">${esc(L().loginAlt)}</button>`, (el, close) => {
      const legacy = () => { if (reasonSave) store.set('tm_pending_save', '1'); signIn(); };
      el.querySelector('#gBtn').onclick = legacy;
      el.querySelector('#gAlt').onclick = legacy;
      gisButton(el.querySelector('#gisSlot'), reasonSave, close).then((ok) => { if (ok) el.querySelector('#gAlt').hidden = false; });
    });
  }
  function renderAcct() {
    const a = $('acct');
    if (!S.user) { a.innerHTML = `<button type="button" class="btn ghost sm" id="loginBtn">${esc(L().login)}</button>`; $('loginBtn').onclick = () => loginSheet(false); return; }
    const m = S.user.user_metadata || {}, name = m.full_name || m.name || S.user.email || '';
    const av = m.avatar_url ? `<img src="${esc(m.avatar_url)}" alt="" referrerpolicy="no-referrer">` : `<b class="av">${esc((name[0] || '?').toUpperCase())}</b>`;
    a.innerHTML = `<button type="button" id="acctBtn" aria-haspopup="menu" aria-expanded="false">${av}<span>${esc(name.split(' ')[0])}</span></button>
      <div class="menu" id="acctMenu" role="menu" hidden><div class="who">${esc(S.user.email || '')}</div>
      <a href="#/" role="menuitem">${esc(L().myInv)}</a><a href="#/new" role="menuitem">${esc(L().newInv)}</a>
      <a href="../" role="menuitem">${esc(L().app)}</a><button type="button" id="logoutBtn" role="menuitem">${esc(L().logout)}</button></div>`;
    const menu = $('acctMenu');
    $('acctBtn').onclick = (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; $('acctBtn').setAttribute('aria-expanded', String(!menu.hidden)); };
    menu.addEventListener('click', () => { menu.hidden = true; });
    $('logoutBtn').onclick = async () => { await sb.auth.signOut(); S.user = null; S.tois = null; location.hash = '#/'; renderAcct(); route(); };
  }

  // ---------- Шаблоны частей ----------
  // Поле с подписью: для одиночного ввода — <label>, для групп кнопок — <div> (иначе нажатие на подпись «нажимает» первую кнопку)
  const field = (label, inner, hint, opt) => {
    const tag = /^\s*<(input|textarea)/.test(inner) ? 'label' : 'div';
    return `<${tag} class="field"><span>${esc(label)}${opt ? ` <em>· ${esc(L().optional)}</em>` : ''}</span>${inner}${hint ? `<small>${esc(hint)}</small>` : ''}</${tag}>`;
  };
  const inp = (f, ph, attrs = '') => `<input class="input" data-f="${f}" value="${esc(S.draft[f])}" placeholder="${esc(ph || '')}" ${attrs}>`;
  const sw = (f, title, sub) => `<label class="switch"><span class="t"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span><input type="checkbox" data-f="${f}" data-redraw ${S.draft[f] ? 'checked' : ''}><span class="k"></span></label>`;
  const seg = (f, opts) => `<div class="seg" role="group">${opts.map(([v, t]) => `<button type="button" data-set="${f}" data-v="${esc(v)}" aria-pressed="${S.draft[f] === v}">${esc(t)}</button>`).join('')}</div>`;
  const KIND_ICON = {};
  function kindTiles(sel) {
    return `<div class="kinds">${KIND_IDS.map((k) => { const [n, s] = L().kinds[k]; return `<button type="button" class="kind" data-kind="${k}" aria-pressed="${sel === k}">${KIND_ICON[k] || ''}<b>${esc(n)}</b>${s ? `<small>${esc(s)}</small>` : ''}</button>`; }).join('')}</div>`;
  }

  // ---------- Шаги ----------
  const STEPS = ['who', 'when', 'photos', 'design', 'details'];
  function stepWho() {
    const d = S.draft, t = L(), k = d.kind;
    let names = '';
    if (k === 'wedding') {
      names = `<div class="grid2 keep">${field(t.groom, inp('name_a', t.ph.groom, 'autocomplete="off" maxlength="40"'))}${field(t.bride, inp('name_b', t.ph.bride, 'autocomplete="off" maxlength="40"'))}</div>
        ${field(t.fromWhom, seg('from_whom', [['groom_parents', t.fromG], ['bride_parents', t.fromB], ['couple', t.fromC]]))}`;
    } else if (k === 'other') {
      names = field(t.otherTitle, inp('title', t.ph.otherTitle, 'maxlength="80"')) + field(t.otherName, inp('name_a', t.ph.hero, 'maxlength="40"'), null, true);
    } else {
      const lab = { kyz_uzatuu: [t.girl, t.ph.girl], sunnot: [t.child, t.ph.child], beshik: [t.child, t.ph.child], tushoo: [t.child, t.ph.child], jubilee: [t.hero, t.ph.hero], memorial: [t.memo, t.ph.memo] }[k];
      names = field(lab[0], inp('name_a', lab[1], 'maxlength="40" autocomplete="off"'));
    }
    return `<h1>${esc(t.whoH)}</h1><p class="lead2">${esc(t.whoL)}</p>
      <div class="kind-row" role="group" aria-label="${esc(t.kindL)}">${KIND_IDS.map((x) => `<button type="button" data-kind="${x}" aria-pressed="${x === k}">${esc(L().kinds[x][0])}</button>`).join('')}</div>
      <div class="group stack">${names}${field(t.sign, inp('signature', t.ph.sign, 'maxlength="120"'), null, true)}</div>`;
  }
  function stepWhen() {
    const t = L();
    return `<h1>${esc(t.whenH)}</h1><p class="lead2">${esc(t.whenL)}</p>
      <div class="group stack">
        <div class="grid2">${field(t.date, inp('date', '', 'type="date" min="2024-01-01" max="2100-12-31"'))}${field(t.time, inp('time', '', 'type="time" step="300"'))}</div>
        ${field(t.venue, inp('venue_name', t.ph.venue, 'maxlength="120" autocomplete="off"'))}
        ${field(t.addr, inp('venue_address', t.ph.addr, 'maxlength="200" autocomplete="off"'), null, true)}
        ${field(t.mapUrl, inp('map_url', t.ph.map, 'type="url" inputmode="url" maxlength="500"'), t.mapHint, true)}
      </div>`;
  }
  function stepPhotos() {
    const d = S.draft, t = L();
    const hero = d.hero_photo ? photoSrc(d.hero_photo) : '';
    const gal = d.gallery.map((p, i) => `<div class="ph"><img src="${esc(photoSrc(p))}" alt="" loading="lazy"><button type="button" data-gdel="${i}" aria-label="${esc(t.remove)}">×</button></div>`).join('');
    return `<h1>${esc(t.photoH)}</h1><p class="lead2">${esc(t.photoL)}</p>
      <div class="group stack">
        <div class="field"><span>${esc(t.heroPh)}</span>
          <div class="hero-drop${hero ? ' has' : ''}" id="heroDrop" role="button" tabindex="0" aria-label="${esc(t.heroAdd)}">
            ${hero ? `<img src="${esc(hero)}" alt=""><div class="photo-tools"><button type="button" data-hero="change">${esc(t.change)}</button><button type="button" data-hero="remove">${esc(t.remove)}</button></div>`
              : `${I.photo}<b>${esc(t.heroAdd)}</b><small>${esc(t.heroHint)}</small>`}
            <div class="uploading" id="heroUp" hidden>${esc(t.uploading)}</div>
          </div>
        </div>
        <div class="field"><span>${esc(t.gallery)} <em>· ${esc(t.galleryHint(d.gallery.length))}</em></span>
          <div class="gal" id="gal">${gal}${d.gallery.length < 10 ? `<button type="button" class="add" id="galAdd" aria-label="${esc(t.gallery)}">+</button>` : ''}</div>
          <div class="uploading" id="galUp" hidden style="position:static;background:none;padding-top:8px">${esc(t.uploading)}</div>
        </div>
      </div>
      <input type="file" id="heroFile" accept="image/*" hidden><input type="file" id="galFile" accept="image/*" multiple hidden>`;
  }
  function stepDesign() {
    const d = S.draft, t = L();
    const themes = THEMES.map((x) => `<button type="button" class="theme" data-set="theme" data-v="${x.id}" aria-pressed="${d.theme === x.id}"><div class="sw" style="background:${x.bg}"><span style="color:${x.ink}">${esc((initialsOf(d) || 'А · А').replace(/ /g, ''))}</span></div><b>${esc(x.name)}</b></button>`).join('');
    const envs = [['classic', t.envClassic, t.envClassicS, '../inv/env/classic.jpg'], ['navy', t.envNavy, t.envNavyS, '../inv/env/navy.jpg']]
      .map(([id, n, s, img]) => `<button type="button" class="env" data-set="envelope" data-v="${id}" aria-pressed="${d.envelope === id}"><img src="${img}" alt="" loading="lazy"><b>${esc(n)}</b><small>${esc(s)}</small></button>`).join('');
    const own = d.own_text, lk = d.lang;
    const textBlock = own
      ? `${field(t.text + (lk === 'ky' ? ' · кыргызча' : ' · по-русски'), `<textarea class="input" data-f="${lk === 'ky' ? 'text_ky' : 'text_ru'}" maxlength="1000" placeholder="${esc(t.textOwnPh)}">${esc(lk === 'ky' ? d.text_ky : d.text_ru)}</textarea>`)}
         <button type="button" class="link" data-act="autotext">${esc(t.textUseAuto)}</button>`
      : `<div class="field"><span>${esc(t.text)}</span><small style="margin:0 0 8px">${esc(t.textAuto)}</small><div class="auto-text" id="autoText">${esc(autoText(d, lk))}</div></div>
         <button type="button" class="link" data-act="owntext">${esc(t.textOwn)}</button>`;
    return `<h1>${esc(t.designH)}</h1><p class="lead2">${esc(t.designL)}</p>
      <div class="group"><h3>${esc(t.theme)}</h3><div class="themes">${themes}</div></div>
      <div class="group"><h3>${esc(t.envelope)}</h3><div class="envs">${envs}</div></div>
      <div class="group stack">
        ${field(t.lang, seg('lang', [['ky', 'Кыргызча'], ['ru', 'Русский']]), t.langS)}
        <div class="divider"></div>
        <label class="switch"><span class="t"><b>${esc(t.music)}</b><small>${esc(t.musicS)}</small></span><input type="checkbox" data-music ${d.music !== 'none' ? 'checked' : ''}><span class="k"></span></label>
      </div>
      <div class="group stack">${textBlock}</div>`;
  }
  function stepDetails() {
    const d = S.draft, t = L();
    const prog = d.program.map((p, i) => `<div class="prog-row"><input class="input" data-prog="${i}" data-k="time" value="${esc(p.time)}" placeholder="${esc(t.progTime)}" maxlength="10" inputmode="numeric"><input class="input" data-prog="${i}" data-k="text" value="${esc(p.text)}" placeholder="${esc(t.progText)}" maxlength="80"><button type="button" class="icon-btn" data-pdel="${i}" aria-label="${esc(t.remove)}">${I.trash}</button></div>`).join('');
    const colors = DRESS.map((c) => `<button type="button" data-color="${c}" style="background:${c}" aria-pressed="${d.dress_colors.includes(c)}" aria-label="${c}"></button>`).join('');
    return `<h1>${esc(t.detH)}</h1><p class="lead2">${esc(t.detL)}</p>
      <div class="group">
        ${sw('rsvp_enabled', t.rsvp, t.rsvpS)}
        ${d.rsvp_enabled ? `<div class="sub stack">${sw('rsvp_ask_count', t.askCount)}${field(t.deadline, inp('rsvp_deadline', '', 'type="date"'), null, true)}</div>` : ''}
        <div class="divider"></div>
        ${sw('show_countdown', t.countdown, t.countdownS)}
        <div class="divider"></div>
        ${sw('show_program', t.program, t.programS)}
        ${d.show_program ? `<div class="sub">${prog}<button type="button" class="btn ghost sm" data-act="addrow" style="margin-top:10px">${I.plus}${esc(t.addRow)}</button></div>` : ''}
        <div class="divider"></div>
        ${sw('show_dress', t.dress, t.dressS)}
        ${d.show_dress ? `<div class="sub stack">${field(t.dress, `<textarea class="input" data-f="dress_text" maxlength="300" placeholder="${esc(t.dressPh)}" style="min-height:90px">${esc(d.dress_text)}</textarea>`, null, true)}<div class="colors">${colors}</div></div>` : ''}
        <div class="divider"></div>
        <div class="switch" style="cursor:default"><span class="t"><b>${esc(t.wishes)}</b><small>${esc(t.wishesS)}</small></span></div>
        ${seg('wishes_mode', [['public', t.wPublic], ['private', t.wPrivate], ['off', t.wOff]])}
      </div>`;
  }
  const STEP_FN = { who: stepWho, when: stepWhen, photos: stepPhotos, design: stepDesign, details: stepDetails };

  function validStep(i) {
    const d = S.draft;
    if (STEPS[i] === 'who') return d.kind === 'other' ? Boolean(d.title.trim() || d.name_a.trim()) : Boolean(d.name_a.trim()) && (d.kind !== 'wedding' || Boolean(d.name_b.trim()));
    if (STEPS[i] === 'when') return Boolean(d.date);
    return true;
  }

  // ---------- Экран: редактор открытки (новый черновик или сохранённый той) ----------
  function renderEditor() {
    const t = L(), i = S.step, n = STEPS.length, isNew = !S.toi;
    const chips = STEPS.map((s, k) => `<button type="button" data-step="${k}" ${k === i ? 'aria-current="step"' : ''} class="${k !== i && validStep(k) && (S.toi || k < i) ? 'done' : ''}"><i>${k + 1}</i>${esc(t.steps[k])}</button>`).join('');
    const last = i === n - 1;
    const nextBtn = isNew
      ? (last ? `<button type="button" class="btn primary" data-act="finish">${esc(t.save)}</button>` : `<button type="button" class="btn primary" data-act="next">${esc(t.next)}</button>`)
      : (last ? `<a class="btn primary" href="#/t/${S.toi.id}/send">${esc(t.tabSend)} →</a>` : `<button type="button" class="btn primary" data-act="next">${esc(t.next)}</button>`);
    const body = `
      ${isNew ? `<div class="steps-top"><div class="meta"><span>${esc(t.stepOf(i + 1, n))} · <b>${esc(t.steps[i])}</b></span>${i > 0 ? `<button type="button" class="link" data-act="back">${esc(t.back)}</button>` : ''}</div>
        <div class="progress"><i style="width:${((i + 1) / n) * 100}%"></i></div></div>` : ''}
      <nav class="chips" aria-label="${esc(t.steps.join(', '))}">${chips}</nav>
      <section class="wstep" id="step">${STEP_FN[STEPS[i]]()}</section>
      <p class="err" id="stepErr" role="alert" hidden></p>
      <div class="bar"><div class="in">
        ${i > 0 ? `<button type="button" class="btn ghost back-btn" data-act="back" aria-label="${esc(t.back)}">${I.back.replace(/width="18" height="18"/, 'width="22" height="22"')}<span>${esc(t.back)}</span></button>` : ''}
        <button type="button" class="btn ghost pv-open-btn" data-act="preview" aria-label="${esc(t.preview)}">${I.eye}<span>${esc(t.pv)}</span></button>
        <span class="spacer"></span>${nextBtn}
      </div></div>`;
    return `<div class="editor-wrap"><div class="panel">${isNew ? '' : toiHead('card')}${body}</div><div class="pv-slot"></div></div>`;
  }

  function bindEditor(root) {
    const d = S.draft;
    root.querySelectorAll('[data-f]').forEach((el) => {
      const f = el.dataset.f;
      const ev = el.type === 'checkbox' || el.type === 'date' || el.type === 'time' ? 'change' : 'input';
      el.addEventListener(ev, () => {
        d[f] = el.type === 'checkbox' ? el.checked : el.value;
        if (['name_a', 'name_b'].includes(f) && $('autoText')) $('autoText').textContent = autoText(d, d.lang);
        changed();
        if (el.dataset.redraw !== undefined) redrawStep();
      });
      if (el.type === 'date' || el.type === 'time') el.addEventListener('input', () => { d[f] = el.value; changed(); });
    });
    root.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => {
      d[b.dataset.set] = b.dataset.v;
      if (b.dataset.set === 'envelope') { pvLoad(b.dataset.v !== 'classic'); }
      changed(); redrawStep();
    }));
    root.querySelectorAll('[data-kind]').forEach((b) => b.addEventListener('click', () => {
      const k = b.dataset.kind; if (k === d.kind) return;
      d.kind = k;
      if (k === 'memorial') { d.theme = 'boz'; d.envelope = 'classic'; d.music = 'none'; d.wishes_mode = 'off'; d.show_countdown = false; d.time = d.time || '12:00'; pvLoad(false); }
      changed(); redrawStep();
    }));
    const music = root.querySelector('[data-music]');
    if (music) music.addEventListener('change', () => { d.music = music.checked ? 'theme' : 'none'; changed(); });
    root.querySelectorAll('[data-prog]').forEach((el) => el.addEventListener('input', () => { d.program[+el.dataset.prog][el.dataset.k] = el.value; changed(); }));
    root.querySelectorAll('[data-pdel]').forEach((b) => b.addEventListener('click', () => { d.program.splice(+b.dataset.pdel, 1); changed(); redrawStep(); }));
    root.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => {
      const c = b.dataset.color, j = d.dress_colors.indexOf(c);
      if (j >= 0) d.dress_colors.splice(j, 1); else if (d.dress_colors.length < 6) d.dress_colors.push(c);
      b.setAttribute('aria-pressed', String(j < 0)); changed();
    }));
    root.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => goStep(+b.dataset.step)));
    root.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => act(b.dataset.act)));
    // фото
    const heroFile = $('heroFile'), galFile = $('galFile');
    if (heroFile) {
      const pick = () => heroFile.click();
      $('heroDrop').addEventListener('click', (e) => { if (!e.target.closest('[data-hero]')) pick(); });
      $('heroDrop').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      root.querySelectorAll('[data-hero]').forEach((b) => b.addEventListener('click', (e) => {
        e.stopPropagation();
        if (b.dataset.hero === 'change') pick(); else { d.hero_photo = null; changed({ now: true }); redrawStep(); }
      }));
      heroFile.addEventListener('change', async () => { const f = heroFile.files[0]; heroFile.value = ''; if (f) await addPhotos([f], 'hero'); });
      $('galAdd')?.addEventListener('click', () => galFile.click());
      galFile.addEventListener('change', async () => { const fs = [...galFile.files]; galFile.value = ''; if (fs.length) await addPhotos(fs, 'gallery'); });
      root.querySelectorAll('[data-gdel]').forEach((b) => b.addEventListener('click', () => { d.gallery.splice(+b.dataset.gdel, 1); changed({ now: true }); redrawStep(); }));
    }
  }
  async function addPhotos(files, where) {
    const d = S.draft, up = where === 'hero' ? $('heroUp') : $('galUp');
    if (up) up.hidden = false;
    try {
      for (const f of files.slice(0, where === 'hero' ? 1 : 10 - d.gallery.length)) {
        const blob = await shrink(f);
        let path;
        if (S.toi) path = await uploadPhoto(S.toi.id, blob);
        else { const k = rid(); await idb.put(k, blob); path = `local:${k}`; blobUrls.set(path, URL.createObjectURL(blob)); }
        if (where === 'hero') d.hero_photo = path; else d.gallery.push(path);
      }
      changed({ now: true });
    } catch { toast(L().photoErr, true); }
    redrawStep();
  }
  function redrawStep() {
    const y = scrollY;
    renderApp();
    scrollTo(0, y);
  }
  function goStep(k) {
    S.step = Math.max(0, Math.min(STEPS.length - 1, k));
    saveLocal(); renderApp(); scrollTo(0, 0);
  }
  function act(a) {
    const d = S.draft, t = L();
    if (a === 'next') {
      if (!validStep(S.step) && !S.toi) {
        const err = $('stepErr'); err.textContent = STEPS[S.step] === 'when' ? t.dateNeed : t.namesNeed; err.hidden = false;
        document.querySelector('#step .input:not([value]), #step [data-f="name_a"], #step [data-f="date"]')?.focus();
        return;
      }
      goStep(S.step + 1);
    }
    if (a === 'back') goStep(S.step - 1);
    if (a === 'preview') openPreview();
    if (a === 'owntext') { d.own_text = true; const k = d.lang === 'ky' ? 'text_ky' : 'text_ru'; if (!d[k]) d[k] = autoText(d, d.lang); changed(); redrawStep(); }
    if (a === 'autotext') { d.own_text = false; d.text_ky = ''; d.text_ru = ''; changed(); redrawStep(); }
    if (a === 'addrow') { if (d.program.length < 12) d.program.push({ time: '', text: '' }); changed(); redrawStep(); setTimeout(() => document.querySelector(`[data-prog="${d.program.length - 1}"]`)?.focus(), 30); }
    if (a === 'finish') finish();
  }

  // Сохранить новый черновик: вход → создать той → фото → открытка
  async function finish() {
    const t = L();
    for (let k = 0; k < 2; k++) if (!validStep(k)) { goStep(k); setTimeout(() => { const e = $('stepErr'); e.textContent = k === 1 ? t.dateNeed : t.namesNeed; e.hidden = false; }, 30); return; }
    if (!S.user) { loginSheet(true); return; }
    await createFromDraft();
  }
  async function createFromDraft() {
    const t = L(), d = S.draft;
    $('app').innerHTML = `<div class="center-box"><div><div class="skeleton" style="width:64px;height:64px;border-radius:50%;margin:0 auto 16px"></div><b>${esc(t.creating)}</b></div></div>`;
    try {
      const sides = (SIDES[d.kind] || []).map((x) => (lang === 'ky' ? x[1] : x[0]));
      const { data: toiId, error } = await sb.rpc('create_toi', {
        p_title: titleFor(d).slice(0, 200), p_kind: d.kind, p_starts_at: startsIso(d), p_venue_name: d.venue_name.trim() || null,
        p_event_title: null, p_sides: sides, p_categories: CATEGORIES,
      });
      if (error) throw error;
      if (d.venue_address.trim()) await sb.from('toi_events').update({ venue_address: d.venue_address.trim() }).eq('toi_id', toiId);
      const ens = await sb.rpc('ensure_invite_card', { p_toi: toiId });
      if (ens.error) throw ens.error;
      // фото из браузера — в хранилище
      const move = async (p) => { if (!p || !p.startsWith('local:')) return p; const b = await idb.get(p.slice(6)); if (!b) return null; const np = await uploadPhoto(toiId, b); idb.del(p.slice(6)); return np; };
      d.hero_photo = await move(d.hero_photo).catch(() => null);
      d.gallery = (await Promise.all(d.gallery.map((p) => move(p).catch(() => null)))).filter(Boolean);
      const up = await sb.from('invite_cards').update(cardRow(d)).eq('toi_id', toiId);
      if (up.error) throw up.error;
      store.del(DRAFT_KEY); store.del('tm_pending_save');
      track('invite_created', { kind: d.kind });
      S.tois = null;
      location.hash = `#/t/${toiId}/send`;
    } catch (e) {
      console.error(e);
      toast(t.createErr, true);
      S.view = null; renderApp();
    }
  }

  // ---------- Экран: главная ----------
  function renderHome() {
    const t = L();
    const mine = S.user && S.tois && S.tois.length ? `<section style="padding-top:28px"><h2 class="pick-title">${esc(t.myInv)}</h2><div class="mine">${S.tois.map(toiCard).join('')}<a class="new-card" href="#/new"><span>+</span>${esc(t.newInv)}</a></div></section>` : '';
    const local = loadLocal();
    const draftBox = local && !mine ? `<div class="status check" style="margin-top:20px"><div class="ic">${I.clock}</div><div style="flex:1"><b>${esc(t.draftFound)}</b><p>${esc(titleFor(local.d))}</p>
      <div class="btns"><a class="btn primary sm" href="#/new">${esc(t.draftGo)}</a><button type="button" class="btn ghost sm" data-act="drop">${esc(t.draftNew)}</button></div></div></div>` : '';
    const demoUrl = `../inv/?env=navy&amp;theme=tun&amp;lang=${lang}&amp;utm_source=create&amp;utm_medium=hero`;
    const landing = `<section class="hx">
        <div class="hx-in">
          <div class="hx-head"><span class="eyebrow">${esc(t.eyebrow)}</span><h1>${t.h1}</h1></div>
          <a class="hx-phone" href="${demoUrl}" target="_blank" rel="noopener" aria-label="${esc(t.seeDemo)}">
            <video muted playsinline preload="auto" poster="../inv/env/navy-poster.webp" src="../inv/env/navy.mp4" aria-hidden="true"></video>
            <span class="hx-card" aria-hidden="true"><span class="t"><small>${esc(t.heroKind)}</small><b>${esc(t.heroNames)}</b></span><span class="d">${esc(t.heroDate)}</span></span>
          </a>
          <div class="hx-body">
            <p class="lead">${esc(t.heroLead)}</p>
            <div class="hx-cta"><a class="btn gold" href="#pick" data-act="to-pick">${esc(t.ctaCreate)}</a>
              <a class="btn ghost-light" href="${demoUrl}" target="_blank" rel="noopener">${I.eye}${esc(t.seeDemo)}</a></div>
            <div class="ticks">${t.ticks.map((x) => `<span>${esc(x)}</span>`).join('')}</div>
          </div>
        </div>
      </section>
      ${draftBox}
      <section class="pick" id="pick"><h2 class="sec-title">${esc(t.pick)}</h2>${kindTiles(null)}</section>
      <section class="how">${t.how.map(([h, p], k) => `<div><i>${k + 1}</i><b>${esc(h)}</b><p>${esc(p)}</p></div>`).join('')}</section>
      <section class="compare"><h2 class="sec-title">${esc(t.pricesT)}</h2><div class="prices">
        <div class="price-card"><b>${esc(t.try)}</b><div class="p">0 <small>${esc(t.som)}</small></div><ul>${t.priceTry.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="price-card"><b>${esc(t.planInv)}</b><div class="p">490 <small>${esc(t.som)} · ${esc(t.oneToi)}</small></div><ul>${t.priceInv.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        <div class="price-card ${APP_SOON ? 'soon' : 'best'}"><b>${esc(t.planPro)}</b> <span class="tag">${esc(APP_SOON ? t.soon : t.best)}</span><div class="p">990 <small>${esc(t.som)} · ${esc(t.oneToi)}</small></div><ul>${t.pricePro.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      </div></section>
      <section class="faq"><h2 class="sec-title">${esc(t.faqT)}</h2>${t.faq.map(([q, x]) => `<details><summary>${esc(q)}</summary><p>${esc(x)}</p></details>`).join('')}</section>
      <div class="lbar" id="lbar"><a class="btn gold block" href="#pick" data-act="to-pick"><span>${esc(t.ctaCreate)}</span><small>${esc(t.ctaFree)}</small></a></div>`;
    return `${mine}${mine ? '' : landing}${foot()}`;
  }
  const foot = () => `<footer class="foot"><span>© Той Менеджер</span><a href="../privacy/">${esc(L().privacy)}</a><a href="https://wa.me/996755666999" target="_blank" rel="noopener">${esc(L().help)}</a></footer>`;
  function toiCard(x) {
    const t = L();
    const when = x.starts_at ? fmtDay(x.starts_at) : t.noDate;
    const st = x.card_paid ? `<span class="pill2 ok">${esc(t.paidT)}</span>` : `<span class="pill2 warn">${esc(t.trialT)}</span>`;
    return `<a class="toi-card" href="#/t/${x.id}"><b>${esc(x.title)}</b><span class="sub2">${esc(when)}</span>
      <span class="stats">${st}<span class="pill2">${x.guests} ${esc(t.kGuests)}</span>${x.opened ? `<span class="pill2 acc">${x.opened} ${esc(t.kOpened)}</span>` : ''}${x.coming ? `<span class="pill2 ok">${x.coming} ${esc(t.kComing)}</span>` : ''}</span></a>`;
  }
  let kindFromLink = KIND_IDS.includes(qs.get('kind')) ? qs.get('kind') : null; // с посадочных страниц: /create/?kind=wedding
  function bindHome(root) {
    if (kindFromLink && !loadLocal() && !(S.user && S.tois && S.tois.length)) {
      const k = kindFromLink; kindFromLink = null;
      S.draft = newDraft(k); S.step = 0; S.toi = null; saveLocal();
      track('create_start', { kind: k, from: 'landing' });
      location.hash = '#/new'; return;
    }
    kindFromLink = null;
    root.querySelectorAll('[data-kind]').forEach((b) => b.addEventListener('click', () => {
      S.draft = newDraft(b.dataset.kind); S.step = 0; S.toi = null; saveLocal();
      track('create_start', { kind: b.dataset.kind });
      location.hash = '#/new';
    }));
    root.querySelector('[data-act="drop"]')?.addEventListener('click', () => { store.del(DRAFT_KEY); renderApp(); });
    root.querySelectorAll('[data-act="to-pick"]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault(); track('create_cta', { from: a.closest('.lbar') ? 'bar' : 'hero' });
      $('pick')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
    // Живой конверт: раскрывается, на карточке проявляются имена, пауза — и снова
    const v = root.querySelector('.hx-phone video'), card = root.querySelector('.hx-card');
    if (v) {
      const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const play = () => { card.classList.remove('on'); v.currentTime = 0; v.play().catch(() => card.classList.add('on')); };
      v.addEventListener('ended', () => { card.classList.add('on'); setTimeout(() => { if (document.body.contains(v)) play(); }, 3200); });
      if (still) { v.currentTime = 3.9; card.classList.add('on'); } else setTimeout(play, 500);
    }
    // Нижняя кнопка «Создать» на телефоне: видна, пока не дошли до выбора тоя
    const bar = root.querySelector('#lbar'), pick = root.querySelector('#pick'), hx = root.querySelector('.hx-cta');
    if (bar && pick && 'IntersectionObserver' in window) {
      const seen = { pick: false, hero: true };
      const upd = () => bar.classList.toggle('on', !seen.pick && !seen.hero);
      new IntersectionObserver((es) => { es.forEach((x) => { seen[x.target === pick ? 'pick' : 'hero'] = x.isIntersecting; }); upd(); }).observe(pick);
      if (hx) new IntersectionObserver((es) => { seen.hero = es[0].isIntersecting; upd(); }).observe(hx);
    }
  }

  // ---------- Той: шапка и вкладки ----------
  function toiHead(tab) {
    const t = L(), x = S.toi, n = S.guests ? S.guests.length : null;
    return `<div class="toi-head"><a class="back" href="#/">${I.back}${esc(t.allInv)}</a>${x.plan?.card_paid ? `<span class="pill2 ok">${esc(t.paidT)}</span>` : `<span class="pill2 warn">${esc(t.trialT)}</span>`}
      <h1>${esc(x.title)}</h1></div>
      <nav class="tabs"><a href="#/t/${x.id}" ${tab === 'card' ? 'aria-current="page"' : ''}>${esc(t.tabCard)}</a>
        <a href="#/t/${x.id}/guests" ${tab === 'guests' ? 'aria-current="page"' : ''}>${esc(t.tabGuests)}${n ? ` <span class="n">${n}</span>` : ''}</a>
        <a href="#/t/${x.id}/send" ${tab === 'send' ? 'aria-current="page"' : ''}>${esc(t.tabSend)}</a></nav>`;
  }
  async function loadToi(id) {
    if (S.toi && S.toi.id === id) return true;
    const [a, b, c, p] = await Promise.all([
      sb.from('tois').select('id, title, kind, is_demo').eq('id', id).is('deleted_at', null).maybeSingle(),
      sb.from('toi_events').select('id, starts_at, venue_name, venue_address').eq('toi_id', id).is('deleted_at', null).order('sort').order('created_at').limit(1).maybeSingle(),
      sb.rpc('ensure_invite_card', { p_toi: id }),
      sb.rpc('toi_plan', { p_toi: id }),
    ]);
    if (a.error || !a.data || c.error) return false;
    S.toi = { id, title: a.data.title, kind: a.data.kind, eventId: b.data?.id || null, slug: c.data?.public_slug, views: c.data?.views || 0, plan: p.data || null, demo: a.data.is_demo };
    S.draft = draftFromDb(a.data, b.data, c.data);
    S.guests = null;
    return true;
  }
  async function refreshPlan() {
    if (!S.toi) return;
    const { data } = await sb.rpc('toi_plan', { p_toi: S.toi.id });
    if (data) S.toi.plan = data;
  }

  // ---------- Вкладка «Отправить» ----------
  const generalLink = () => `${PUBLIC}/i/?c=${S.toi.slug}`;
  const personalLink = (token) => `${PUBLIC}/i/?t=${token}`;
  function statusCard() {
    const t = L(), p = S.toi.plan || {};
    if (p.prov_plan && !p.invite_until && !p.pro_until) return `<div class="status check"><div class="ic">${I.clock}</div><div><b>${esc(t.checkT)}</b><p>${esc(t.checkP)}</p></div></div>`;
    if (p.card_paid) {
      const until = p.pro_until && Date.parse(p.pro_until) > Date.now() ? t.proP(fmtDay(p.pro_until)) : p.invite_until ? t.paidP(fmtDay(p.invite_until)) : '';
      const up = !p.is_pro && !APP_SOON ? `<div class="btns"><button type="button" class="btn ghost sm" data-act="pay-pro">${I.users}${esc(t.upgrade)} · ${p.pro_price || 500} ${esc(t.som)}</button></div>` : '';
      return `<div class="status paid"><div class="ic">${I.check}</div><div><b>${esc(t.paidT)}</b><p>${esc(until)}</p>${up}</div></div>`;
    }
    if (p.pending_claim) return `<div class="status check"><div class="ic">${I.clock}</div><div><b>${esc(t.waitT)}</b><p>${esc(t.waitP)}</p></div></div>`;
    return trialCard();
  }
  // Клиент открывал оплату, но не нажал «Я оплатил» — напоминаем
  const payStartKey = () => `tm_paystart_${S.toi?.plan?.num || ''}`;
  function trialCard() {
    const t = L(), p = S.toi.plan || {};
    const started = Number(store.get(payStartKey()) || 0);
    if (started && Date.now() - started < 30 * 864e5) {
      return `<div class="status check"><div class="ic">${I.clock}</div><div><b>${esc(t.forgotT)}</b><p>${esc(t.forgotP)}</p><div class="btns"><button type="button" class="btn primary sm" data-act="paid">${esc(t.paidShort)}</button><button type="button" class="btn ghost sm" data-act="pay">${esc(t.removeWm)} · ${p.invite_price || 490} ${esc(t.som)}</button></div></div></div>`;
    }
    return `<div class="status trial"><div class="ic">${I.star}</div><div><b>${esc(t.trialT)}</b><p>${esc(t.trialP)}</p><div class="btns"><button type="button" class="btn primary sm" data-act="pay">${esc(t.removeWm)} · ${p.invite_price || 490} ${esc(t.som)}</button></div></div></div>`;
  }
  function renderSend() {
    const t = L(), link = generalLink(), d = S.draft;
    const gtext = [T[d.lang].msgGeneral, titleFor(d, d.lang), startsIso(d) ? fmtWhen(startsIso(d), d.lang) : '', d.venue_name.trim(), '', link].filter((x, k, a) => x || (k > 0 && a[k - 1])).join('\n');
    return `<div class="editor-wrap"><div class="panel">${toiHead('send')}
      <div class="stack" style="gap:14px;margin-top:16px">
        ${statusCard()}
        <div class="group"><h3>${esc(t.general)}</h3><p class="muted" style="font-size:14px;margin-bottom:12px">${esc(t.generalS)}</p>
          <div class="linkbox"><code>${esc(link.replace('https://', ''))}</code><button type="button" class="btn soft sm" data-copy="${esc(link)}">${I.copy}${esc(t.copy)}</button></div>
          <div class="share-row"><a class="btn wa sm" href="${esc(waUrl(null, gtext))}" target="_blank" rel="noopener">${I.wa}${esc(t.share)}</a>
            <a class="btn ghost sm" href="${esc(link)}&amp;own=1" target="_blank" rel="noopener">${I.open}${esc(t.open)}</a></div>
          ${S.toi.views ? `<p class="muted" style="font-size:13px;margin-top:10px">${esc(t.views(S.toi.views))}</p>` : ''}
        </div>
        <div class="group"><h3>${esc(t.personal)}</h3><p class="muted" style="font-size:14px;margin-bottom:12px">${esc(t.personalS)}</p>
          <a class="btn primary block" href="#/t/${S.toi.id}/guests">${I.users}${esc(t.toGuests)}</a></div>
        <p class="muted" style="font-size:14px">${esc(t.inApp)} <a href="../">toimanager.app</a></p>
      </div>
      <div class="bar"><div class="in"><button type="button" class="btn ghost pv-open-btn block" data-act="preview">${I.eye}${esc(t.preview)}</button></div></div>
    </div><div class="pv-slot"></div></div>`;
  }
  function bindSend(root) {
    root.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => copy(b.dataset.copy)));
    root.querySelectorAll('[data-act="preview"]').forEach((b) => b.addEventListener('click', openPreview));
    root.querySelectorAll('[data-act="pay"]').forEach((b) => b.addEventListener('click', () => paySheet('invite')));
    root.querySelectorAll('[data-act="paid"]').forEach((b) => b.addEventListener('click', () => paySheet('invite', 'pay')));
    root.querySelector('[data-act="pay-pro"]')?.addEventListener('click', () => paySheet('pro'));
  }

  // ---------- Оплата ----------
  function paySheet(initial, startStage) {
    const t = L(), p = S.toi.plan || {};
    let plan = APP_SOON ? 'invite' : (p.invite_until || p.card_paid ? 'pro' : initial || 'invite');
    const invPaid = Boolean(p.invite_until);
    const proPrice = p.pro_price || (invPaid ? 500 : 990), invPrice = p.invite_price || 490;
    const price = () => (plan === 'invite' ? invPrice : proPrice);
    const num = p.num ? String(p.num).replace(/(\d{3})(\d{3})/, '$1 $2') : '';
    const m = S.user?.user_metadata || {};
    let stage = startStage || 'choose', payer = store.get('tm_payer') || m.full_name || m.name || '';
    const planBtn = (id, title, priceTxt, list, badge) => `<button type="button" class="plan" data-plan="${id}" aria-pressed="${plan === id}">${badge ? `<span class="tag badge">${esc(badge)}</span>` : ''}
      <div class="top2"><b>${esc(title)}</b><span>${priceTxt} <small>${esc(t.som)}</small></span></div><ul>${list.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></button>`;
    const draw = (el) => {
      if (stage === 'choose') {
        el.innerHTML = `<button class="x" type="button" data-close aria-label="${esc(t.close)}">×</button><h2>${esc(t.payH)}</h2><p class="lead3">${esc(t.payL)}</p>
          ${invPaid ? '' : planBtn('invite', t.payInvT, invPrice, t.payInvL)}
          ${APP_SOON ? '' : planBtn('pro', t.payProT, invPaid ? `${proPrice}` : proPrice, t.payProL, invPaid ? t.payUp : t.best)}
          <button type="button" class="btn primary block" data-go style="margin-top:16px">${esc(t.payNext)} · ${price()} ${esc(t.som)}</button>
          <p class="muted" style="font-size:13px;text-align:center;margin-top:12px">${esc(t.payHelp)}</p>`;
        el.querySelectorAll('[data-plan]').forEach((b) => b.addEventListener('click', () => { plan = b.dataset.plan; draw(el); }));
        el.querySelector('[data-go]').onclick = () => { stage = 'pay'; store.set(payStartKey(), String(Date.now())); track('pay_start', { plan, value: price() }); draw(el); };
      } else if (stage === 'pay') {
        el.innerHTML = `<button class="x" type="button" data-close aria-label="${esc(t.close)}">×</button><h2>${esc(plan === 'invite' ? t.payInvT : t.payProT)}</h2>
          <div class="pay-amount"><span>${esc(t.payAmount)}</span><b>${price()} ${esc(t.som)}</b><span>${esc(t.payNum(num))}</span></div>
          <a class="btn primary block" data-paylink href="${esc(PAY.link)}" target="_blank" rel="noopener" style="margin-top:14px">${esc(t.payBtn)}</a>
          <img class="qr" data-payqr src="${PAY.qr}" alt="QR MBank" width="220" height="225">
          <ol class="paysteps"><li>${esc(t.payStep1)}</li><li>${esc(t.payStep2(price()))}</li><li>${esc(t.payStep3)}</li></ol>
          <div class="stack" style="margin-top:16px">${field(t.payer, `<input class="input" id="payer" maxlength="100" autocomplete="name" value="${esc(payer)}">`, t.payerS)}${field(t.phoneL, `<input class="input" id="payPhone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="0700 123 456" value="${esc(store.get('tm_phone') || '')}">`, t.phoneS)}</div>
          <p class="err" id="payErr" hidden></p>
          <button type="button" class="btn primary block" id="paidBtn" style="margin-top:14px">${esc(t.paid)}</button>
          <button type="button" class="link" data-back style="display:block;margin:12px auto 0">${esc(t.back)}</button>`;
        if (window.PayQR) PayQR(PAY.link, price()).then((r) => {
          const a = el.querySelector('[data-paylink]'), q = el.querySelector('[data-payqr]');
          if (a) a.href = r.link; if (q && r.qr) q.src = r.qr;
        });
        const inpEl = el.querySelector('#payer'), btn = el.querySelector('#paidBtn');
        const sync = () => { payer = inpEl.value; btn.disabled = !payer.trim(); };
        inpEl.addEventListener('input', sync); sync();
        el.querySelector('[data-back]').onclick = () => { stage = 'choose'; draw(el); };
        btn.onclick = async () => {
          btn.disabled = true; btn.textContent = t.sending; el.querySelector('#payErr').hidden = true;
          const { data, error } = await sb.rpc('public_pay_claim', { p_num: p.num, p_payer_name: payer.trim(), p_phone: (el.querySelector('#payPhone')?.value || '').trim() || null, p_plan: plan });
          if (error) { el.querySelector('#payErr').textContent = t.payErr; el.querySelector('#payErr').hidden = false; btn.disabled = false; btn.textContent = t.paid; return; }
          store.set(payStartKey(), ''); store.set('tm_payer', payer.trim()); store.set('tm_phone', (el.querySelector('#payPhone')?.value || '').trim());
          track('pay_claim', { plan, value: price(), currency: 'KGS' });
          stage = data?.provisional ? 'ok' : 'wait';
          await refreshPlan(); pvUpdate();
          draw(el);
        };
      } else {
        const ok = stage === 'ok';
        el.innerHTML = `<div class="ok-big">${I.check}<h2>${esc(ok ? t.payOkT : t.payWaitT)}</h2><p class="lead3">${esc(ok ? t.payOkP : t.payWaitP)}</p>
          <button type="button" class="btn primary block" data-close>${esc(t.done)}</button></div>`;
      }
      el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => { closeSheet(); renderApp(); }));
    };
    let closeSheet = sheet('', (el) => draw(el));
  }

  // ---------- Вкладка «Гости» ----------
  async function loadGuests() {
    const id = S.toi.id;
    const [g, i] = await Promise.all([
      sb.from('guests').select('id, full_name, address_as, phone, party_size, invite_lang, created_at').eq('toi_id', id).is('deleted_at', null).eq('is_walk_in', false).order('created_at'),
      sb.from('invitations').select('id, guest_id, public_token, invite_status, invited_at, rsvp, rsvp_count, opened_at, last_opened_at, open_count, created_at').eq('toi_id', id).is('deleted_at', null).order('created_at'),
    ]);
    if (g.error || i.error) throw g.error || i.error;
    const byGuest = new Map();
    for (const x of i.data) if (!byGuest.has(x.guest_id)) byGuest.set(x.guest_id, x);
    S.guests = g.data.map((x) => ({ ...x, inv: byGuest.get(x.id) || null }));
  }
  const gStatus = (g) => {
    const v = g.inv;
    if (!v) return 'not';
    if (v.rsvp === 'yes') return 'yes'; if (v.rsvp === 'no') return 'no';
    if (v.opened_at) return 'opened';
    return v.invite_status === 'not_sent' ? 'not' : 'sent';
  };
  function renderGuests() {
    const t = L(), list = S.guests || [], p = S.toi.plan || {};
    const people = list.reduce((s, g) => s + (g.party_size || 1), 0);
    const opened = list.filter((g) => g.inv?.opened_at).length;
    const coming = list.reduce((s, g) => s + (g.inv?.rsvp === 'yes' ? (g.inv.rsvp_count || 1) : 0), 0);
    const limit = p.limit || FREE_PEOPLE, pro = Boolean(p.is_pro || p.guests_unlimited || p.card_paid);
    const counts = { all: list.length, opened };
    list.forEach((g) => { const s = gStatus(g); if (s !== 'opened') counts[s] = (counts[s] || 0) + 1; });
    const flt = (k) => (k === 'all' ? list : k === 'opened' ? list.filter((g) => g.inv?.opened_at) : list.filter((g) => gStatus(g) === k));
    const shown = flt(S.gFilter);
    const filters = [['all', t.fAll], ['not', t.fNot], ['sent', t.fSent], ['opened', t.fOpened], ['yes', t.fYes], ['no', t.fNo]]
      .filter(([k]) => k === 'all' || counts[k]).map(([k, n]) => `<button type="button" data-flt="${k}" aria-pressed="${S.gFilter === k}">${esc(n)} · ${k === 'all' ? counts.all : counts[k] || 0}</button>`).join('');
    const rows = shown.map((g) => {
      const s = gStatus(g), v = g.inv;
      const eye = I.eye.replace('<svg', '<svg width="14" height="14"');
      const seenAt = v?.opened_at ? ago(v.last_opened_at || v.opened_at) : '';
      const chip = s === 'yes' ? `<span class="pill2 ok">${esc(t.sYes(v.rsvp_count || 1))}</span>` : s === 'no' ? `<span class="pill2">${esc(t.sNo)}</span>`
        : s === 'opened' ? `<span class="pill2 acc">${eye}${esc(t.sOpened)} · ${esc(seenAt)}</span>` : s === 'sent' ? `<span class="pill2">${esc(t.sSent)}</span>` : `<span class="pill2 warn">${esc(t.sNot)}</span>`;
      const seen = v?.opened_at && s !== 'opened' ? `<span class="pill2 acc">${eye}${esc(t.opened(seenAt))}</span>` : '';
      const addr = g.address_as?.trim();
      const sub = [addr && addr !== g.full_name ? g.full_name : '', t.people(g.party_size || 1)].filter(Boolean).join(' · ');
      return `<div class="g" data-g="${g.id}"><div class="nm">${esc(addr || g.full_name)}</div><div class="sub3">${esc(sub)}</div>
        <div class="st">${chip}${seen}</div>
        <div class="acts">${v ? `<a class="btn wa sm" href="${esc(waUrl(g.phone, guestMsg(g)))}" target="_blank" rel="noopener" data-send="${g.id}" aria-label="${esc(s === 'not' ? t.send : t.resend)}">${I.wa}<span>${esc(s === 'not' ? t.send : t.resend)}</span></a>` : ''}<button type="button" class="more" data-more="${g.id}" aria-label="…">${I.more}</button></div></div>`;
    }).join('');
    const meter = pro ? '' : `<div class="kpi" style="grid-column:1 / -1"><span>${esc(t.limitT(people, limit))}</span><div class="meter${people >= limit ? ' full' : ''}"><i style="width:${Math.min(100, (people / limit) * 100)}%"></i></div>
      ${people >= limit ? `<p style="font-size:14px;margin-top:8px">${esc(t.limitFull)} <button type="button" class="link" data-act="pay">${esc(t.removeWm)} · ${p.invite_price || 490} ${esc(t.som)}</button></p>` : ''}</div>`;
    return `<div class="editor-wrap"><div class="panel">${toiHead('guests')}<div class="stack" style="gap:14px;margin-top:16px">
      ${p.card_paid || p.pending_claim ? '' : trialCard()}
      <div class="kpis"><div class="kpi"><b>${list.length}</b><span>${esc(t.kGuests)}</span></div><div class="kpi"><b>${people}</b><span>${esc(t.kPeople)}</span></div>
        <div class="kpi"><b>${opened}</b><span>${esc(t.kOpened)}</span></div><div class="kpi"><b>${coming}</b><span>${esc(t.kComing)}</span></div>${meter}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn primary" data-act="add">${I.plus}${esc(t.gAdd)}</button></div>
      ${list.length ? `<div class="gfilter">${filters}</div><div class="glist">${rows || `<div class="empty">—</div>`}</div>`
        : `<div class="glist"><div class="empty"><b>${esc(t.gEmptyT)}</b>${esc(t.gEmptyS)}</div></div>`}
    </div></div><div class="pv-slot"></div></div>`;
  }
  function guestMsg(g) {
    const d = S.draft, lg = g.invite_lang || d.lang || 'ky', t = T[lg];
    const name = (g.address_as || '').trim() || g.full_name.trim().split(/\s+/)[0];
    const when = startsIso(d) ? fmtWhen(startsIso(d), lg) : '';
    const names = namesOf(d, lg);
    const lines = [t.msgHi(name), '', `${t.msgInv(t.kindTo[d.kind])}${names ? `: ${names}` : ''}.`];
    const det = [when, d.venue_name.trim()].filter(Boolean);
    if (det.length) lines.push('', ...det);
    lines.push('', t.msgLink, personalLink(g.inv.public_token), '', t.msgBye);
    return lines.join('\n');
  }
  function bindGuests(root) {
    root.querySelectorAll('[data-flt]').forEach((b) => b.addEventListener('click', () => { S.gFilter = b.dataset.flt; renderApp(); }));
    root.querySelector('[data-act="add"]')?.addEventListener('click', () => addSheet());
    root.querySelectorAll('[data-act="pay"]').forEach((b) => b.addEventListener('click', () => paySheet('invite')));
    root.querySelectorAll('[data-act="paid"]').forEach((b) => b.addEventListener('click', () => paySheet('invite', 'pay')));
    root.querySelector('[data-act="pay-pro"]')?.addEventListener('click', () => paySheet('pro'));
    root.querySelectorAll('[data-send]').forEach((a) => a.addEventListener('click', async () => {
      const g = S.guests.find((x) => x.id === a.dataset.send); if (!g?.inv) return;
      if (g.inv.invite_status === 'not_sent') {
        g.inv.invite_status = 'sent';
        await sb.from('invitations').update({ invite_status: 'sent', invite_channel: 'whatsapp', invited_at: new Date().toISOString(), invited_by: S.user.id }).eq('id', g.inv.id);
        track('invite_sent');
        setTimeout(renderApp, 400);
      }
    }));
    root.querySelectorAll('[data-more]').forEach((b) => b.addEventListener('click', () => guestMenu(S.guests.find((x) => x.id === b.dataset.more))));
  }
  function guestMenu(g) {
    const t = L(), link = g.inv ? personalLink(g.inv.public_token) : '';
    sheet(`<h2>${esc((g.address_as || '').trim() || g.full_name)}</h2><p class="lead3">${esc(t.people(g.party_size || 1))}${g.phone ? ` · ${esc(g.phone)}` : ''}</p>
      <div class="stack" style="gap:8px">
        ${g.inv ? `<button type="button" class="btn ghost block" data-m="copy">${I.copy}${esc(t.copyLink)}</button>
        <a class="btn ghost block" href="${esc(link)}&amp;own=1" target="_blank" rel="noopener">${I.open}${esc(t.viewAs)}</a>` : ''}
        <button type="button" class="btn ghost block" data-m="edit">${esc(t.gEdit)}</button>
        <button type="button" class="btn ghost block" data-m="del" style="color:var(--danger)">${I.trash}${esc(t.gDel)}</button>
      </div>`, (el, close) => {
      el.querySelector('[data-m="copy"]')?.addEventListener('click', () => { copy(link); close(); });
      el.querySelector('[data-m="edit"]').onclick = () => { close(); addSheet(g); };
      el.querySelector('[data-m="del"]').onclick = async () => {
        if (!confirm(t.gDelQ)) return;
        const { error } = await sb.from('guests').update({ deleted_at: new Date().toISOString() }).eq('id', g.id);
        close();
        if (error) { toast(L().saveErr, true); return; }
        S.guests = S.guests.filter((x) => x.id !== g.id); renderApp();
      };
    });
  }
  // Разбор списка: «Асан байке, 0555 123 456, 3»
  function parseList(text) {
    return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).slice(0, 300).map((line) => {
      const parts = line.split(/[,;\t]/).map((s) => s.trim()).filter(Boolean);
      let name = parts.shift() || '', phone = null, party = 1;
      for (const p of parts) {
        const digits = p.replace(/\D/g, '');
        if (/^\d{1,2}$/.test(p) && +p >= 1 && +p <= 50) party = +p;
        else if (digits.length >= 9) phone = p;
        else name += `, ${p}`;
      }
      // «Асан байке 0555123456» без запятой
      const m = name.match(/^(.*?)[\s]+(\+?[\d\s()-]{9,})$/);
      if (!phone && m) { name = m[1].trim(); phone = m[2].trim(); }
      return { name: name.slice(0, 200), phone, party };
    }).filter((x) => x.name);
  }
  function addSheet(edit) {
    const t = L();
    let mode = edit ? 'one' : 'one';
    const draw = (el) => {
      const one = mode === 'one';
      el.innerHTML = `<button class="x" type="button" data-close aria-label="${esc(t.close)}">×</button><h2>${esc(edit ? t.gEdit : t.gAdd)}</h2>
        ${edit ? '' : `<div class="seg" style="margin:6px 0 18px"><button type="button" data-mode="one" aria-pressed="${one}">${esc(t.gAddOne)}</button><button type="button" data-mode="many" aria-pressed="${!one}">${esc(t.gAddMany)}</button></div>`}
        ${one ? `<div class="stack">
          ${field(t.gName, `<input class="input" id="gName" maxlength="200" placeholder="${esc(t.gNamePh)}" value="${esc(edit?.full_name || '')}">`)}
          ${field(t.gAddr, `<input class="input" id="gAddr" maxlength="80" placeholder="${esc(t.gAddrPh)}" value="${esc(edit?.address_as || '')}">`, t.gAddrS, true)}
          <div class="grid2">${field(t.gPhone, `<input class="input" id="gPhone" type="tel" inputmode="tel" maxlength="30" placeholder="${esc(t.gPhonePh)}" value="${esc(edit?.phone || '')}">`, null)}
            ${field(t.gParty, `<input class="input" id="gParty" type="number" inputmode="numeric" min="1" max="50" value="${edit?.party_size || 1}">`)}</div>
        </div>` : `<div class="stack">${field(t.gAddMany, `<textarea class="input" id="gMany" placeholder="${esc(t.gManyPh)}" style="min-height:180px"></textarea>`, t.gManyS)}</div>`}
        <p class="err" id="gErr" hidden></p>
        <button type="button" class="btn primary block" id="gGo" style="margin-top:16px">${esc(one ? t.gSave : t.gSave)}</button>`;
      el.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => { mode = b.dataset.mode; draw(el); }));
      el.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => close()));
      const go = el.querySelector('#gGo'), err = el.querySelector('#gErr');
      if (!one) {
        const ta = el.querySelector('#gMany');
        const upd = () => { const n = parseList(ta.value).length; go.textContent = n ? t.gSaveN(n) : t.gSave; go.disabled = !n; };
        ta.addEventListener('input', upd); upd();
      }
      go.onclick = async () => {
        err.hidden = true; go.disabled = true;
        try {
          if (one) {
            const name = el.querySelector('#gName').value.trim();
            if (!name) { err.textContent = t.namesNeed; err.hidden = false; go.disabled = false; el.querySelector('#gName').focus(); return; }
            const row = { full_name: name, address_as: el.querySelector('#gAddr').value.trim() || null, phone: el.querySelector('#gPhone').value.trim() || null,
              party_size: Math.min(50, Math.max(1, parseInt(el.querySelector('#gParty').value, 10) || 1)) };
            const r = edit ? await sb.from('guests').update(row).eq('id', edit.id) : await sb.from('guests').insert({ ...row, toi_id: S.toi.id });
            if (r.error) throw r.error;
            close(); toast(edit ? t.saved : t.added(1));
          } else {
            const items = parseList(el.querySelector('#gMany').value);
            const rows = items.map((x) => ({ toi_id: S.toi.id, full_name: x.name, phone: x.phone, party_size: x.party, address_as: x.name.length <= 80 ? x.name : null }));
            let added = 0;
            const r = await sb.from('guests').insert(rows);
            if (!r.error) added = rows.length;
            else if (/guest_limit/.test(r.error.message || '')) {
              for (const row of rows) { const x = await sb.from('guests').insert(row); if (x.error) break; added++; }
            } else throw r.error;
            close();
            toast(added < rows.length ? t.limitPart(added) : t.added(added), added < rows.length);
          }
          await refreshPlan(); await loadGuests(); renderApp();
        } catch (e) {
          err.textContent = /guest_limit/.test(e?.message || '') ? t.limitFull : t.saveErr; err.hidden = false; go.disabled = false;
        }
      };
    };
    const close = sheet('', (el) => draw(el));
  }

  // ---------- Маршруты ----------
  async function route() {
    const h = location.hash.replace(/^#/, '') || '/';
    const m = h.match(/^\/t\/([0-9a-f-]{36})(?:\/(guests|send))?$/i);
    if (m) {
      if (!S.user) { S.view = 'login'; renderApp(); return; }
      const ok = await loadToi(m[1]).catch(() => false);
      if (!ok) { S.view = 'notfound'; renderApp(); return; }
      S.view = m[2] || 'card';
      if (S.view === 'guests' && !S.guests) { renderApp(); try { await loadGuests(); } catch { toast(L().loadErr, true); } }
      else if (!S.guests) loadGuests().then(() => { if (S.view !== 'guests') renderApp(); }).catch(() => null);
      if (S.view === 'card' && S.step >= STEPS.length) S.step = 0;
      renderApp(); return;
    }
    if (h.startsWith('/new')) {
      S.toi = null; S.guests = null;
      if (!S.draft) { const l = loadLocal(); if (l) { S.draft = l.d; S.step = l.step || 0; } }
      if (!S.draft) { S.view = 'pick'; renderApp(); return; }
      // фото черновика из браузера
      const keys = [S.draft.hero_photo, ...S.draft.gallery].filter((p) => p && p.startsWith('local:'));
      await Promise.all(keys.map((k) => localUrl(k)));
      S.draft.gallery = S.draft.gallery.filter((p) => !p.startsWith('local:') || blobUrls.has(p));
      if (S.draft.hero_photo?.startsWith('local:') && !blobUrls.has(S.draft.hero_photo)) S.draft.hero_photo = null;
      S.view = 'new'; renderApp();
      if (store.get('tm_pending_save') && S.user) { store.del('tm_pending_save'); createFromDraft(); }
      return;
    }
    S.toi = null; S.guests = null; S.draft = null;
    S.view = 'home';
    if (S.user && !S.tois) { renderApp(); const { data } = await sb.rpc('web_my_tois'); S.tois = (data || []).filter((x) => !x.is_demo); }
    renderApp();
  }
  addEventListener('hashchange', () => { if (sheetClose) sheetClose(); pv.classList.remove('open'); layerPushed = false; route(); });

  function renderApp() {
    const app = $('app'), t = L();
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $('pvTitle').textContent = t.preview; $('pvClose').textContent = t.close; $('pvOpen').textContent = t.openNew;
    $('pvEnv').textContent = $('pvEnv2').textContent = pvEnv ? t.envHide : t.envShow;
    let html = '', withPv = false;
    switch (S.view) {
      case 'home': html = renderHome(); break;
      case 'pick': html = `<section style="padding:28px 0 8px"><a class="back" href="#/" style="display:inline-flex;align-items:center;gap:4px;color:var(--muted);text-decoration:none;font-size:14px">${I.back}${esc(t.allInv)}</a><h1 style="font-size:clamp(26px,5vw,34px);margin:14px 0 18px">${esc(t.pick)}</h1>${kindTiles(null)}</section>${foot()}`; break;
      case 'new': case 'card': html = renderEditor(); withPv = true; break;
      case 'send': html = renderSend(); withPv = true; break;
      case 'guests': html = S.guests ? renderGuests() : `<div class="editor-wrap"><div class="panel">${toiHead('guests')}<div class="skeleton" style="height:240px;margin-top:20px"></div></div><div class="pv-slot"></div></div>`; withPv = true; break;
      case 'login': html = `<div class="center-box"><div><h1 style="margin-bottom:10px">${esc(t.login)}</h1><p>${esc(t.saveL)}</p><button class="google" type="button" id="gBtn2" style="margin-top:20px;max-width:340px;margin-inline:auto">${G_LOGO}<span>${esc(t.google)}</span></button></div></div>`; break;
      case 'notfound': html = `<div class="center-box"><div><h1>${esc(t.notFound)}</h1><p><a href="#/">${esc(t.allInv)}</a></p></div></div>`; break;
      default: html = `<div class="center-box"><div class="skeleton" style="width:220px;height:22px"></div></div>`;
    }
    app.innerHTML = html;
    if (S.view === 'home' || S.view === 'pick') bindHome(app);
    if (S.view === 'new' || S.view === 'card') bindEditor(app);
    if (S.view === 'send') bindSend(app);
    if (S.view === 'guests' && S.guests) bindGuests(app);
    $('gBtn2')?.addEventListener('click', () => signIn());
    app.querySelectorAll('.pv-open-btn').forEach((b) => { if (!b.dataset.act) b.addEventListener('click', openPreview); });
    pvShow(withPv);
    if (withPv && S.toi) $('pvOpen').href = `${generalLink()}&own=1`; else $('pvOpen').removeAttribute('href');
    $('pvOpen').hidden = !S.toi;
    setSave(S.toi ? S.save.state : 'idle');
    pvUpdate();
    placePv();
  }

  // Меню аккаунта закрывается нажатием мимо
  document.addEventListener('click', () => { const m = $('acctMenu'); if (m && !m.hidden) { m.hidden = true; $('acctBtn')?.setAttribute('aria-expanded', 'false'); } });

  // Язык
  document.querySelectorAll('[data-lang]').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('lang', lang);
    const u = new URL(location.href); u.searchParams.set('lang', lang); history.replaceState(null, '', u);
    renderAcct(); renderApp();
  }));

  // Обновление статусов гостей, пока открыта вкладка «Гости»
  setInterval(async () => {
    if (S.view !== 'guests' || document.visibilityState !== 'visible' || sheetClose) return;
    try { await loadGuests(); renderApp(); } catch { /* в следующий раз */ }
  }, 30000);

  // ---------- Запуск ----------
  (async () => {
    // вернулись со входа Google на главную страницу сайта, а не сюда — главная перекинула нас сюда с ?code=
    const { data } = await sb.auth.getSession();
    S.user = data.session?.user || null;
    // после входа Google возвращаемся на тот экран, с которого уходили (адрес без #, поэтому запоминали его заранее)
    const back = store.get('tm_auth_return');
    if (S.user && back && back.startsWith('/create/')) {
      store.del('tm_auth_return');
      const hh = back.includes('#') ? back.slice(back.indexOf('#')) : '';
      history.replaceState(null, '', location.pathname + (location.hash && location.hash !== '#' ? location.hash : hh));
    } else if (/[?&](code|error)=/.test(location.search)) history.replaceState(null, '', location.pathname + location.hash);
    renderAcct();
    sb.auth.onAuthStateChange((ev, session) => {
      const was = S.user?.id; S.user = session?.user || null;
      if ((S.user?.id || null) !== (was || null)) { S.tois = null; renderAcct(); }
    });
    route();
  })();
})();
