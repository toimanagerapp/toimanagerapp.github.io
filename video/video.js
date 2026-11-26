/* Видео-приглашение «Той Менеджер»: ролик 9:16 сменой блоков (обложка → фото → текст → дата → место → финал).
   Собирается прямо в браузере клиента: сцены рисуются на canvas, MediaRecorder записывает их вместе с музыкой.
   window.TMVideo.make(data, canvas, onProgress) → Promise<{ blob, ext, mime }>
   data: { theme, lang, kindTitle, a, b, text, dateBig, dateLine, venue, address, finalLine, sign, photos[], music, paid, wm, brand }
   Время сборки = длительность ролика (≈ 20–26 с). */
(function () {
  'use strict';
  const W = 720, H = 1280, FPS = 30, FADE = 0.7;
  const SW = {"ak-altyn":["#FFFFFF","#F1E6D2","#D9BE8C","#B48A3E"],"tunku":["#173E35","#0F2A25","#E9D7AE","#C49A4A"],"tun":["#16213F","#0D1530","#EFE6D2","#C49A4A"],"ak":["#FFFFFF","#F1E6D2","#A87F38","#7A1E2C"],"anar":["#5A1424","#3A0D18","#F5E8D8","#C9A04F"],"jashyl":["#0F3A31","#0D2B25","#F1E8D6","#C49A4A"],"bermet":["#FFFAF8","#F5E6E1","#DDA2A9","#B07A5E"],"asman":["#FBFDFF","#E3ECF4","#5D8AB8","#2F5D8A"],"kiyiz":["#FCF7EE","#EDE1CE","#C94A35","#A3271F"],"boz":["#F7F6F3","#E4E2DE","#94989C","#45494D"],"ala-too":["#FFFCF8","#EEE3D8","#D7A86E","#6E3B5A"],"boz-uy":["#FFFCF8","#EEE3D8","#D7A86E","#6E3B5A"],"jibek":["#FFFDF8","#F4ECDD","#E3C77E","#8A6A2C"],"barhat":["#561727","#4A1220","#F6E2A8","#F4DFA6"],"bilerik":["#14443A","#113A31","#F2DA9C","#F2DA9C"],"shokulo":["#561727","#4A1220","#F6E2A8","#F4DFA6"],"jurkan":["#FFFAF3","#F0E0CE","#D86A45","#A3352A"],"shyrdak":["#FCF7EE","#EDE1CE","#D2563F","#A3271F"],"ak-kalpak":["#FBFDFF","#E3ECF4","#6F97C2","#2F5D8A"],"kok-asman":["#FBFDFF","#E3ECF4","#6F97C2","#2F5D8A"],"beshik":["#FFFAF8","#F5E6E1","#CF9098","#9A5560"],"ala-jip":["#FFFCF6","#EDE3D4","#C9A57A","#6B4A2E"],"altyn-kuz":["#FFFBF4","#F2E4CF","#D9A55A","#8A5A1E"],"tunku-asman":["#142048","#101A3E","#F4DFA6","#F4DFA6"],"tuman":["#F7F6F3","#E4E2DE","#7E8286","#45494D"],"kyzyl-kiyiz":["#561727","#4A1220","#F6E2A8","#F4DFA6"],"altyn-jibek":["#FFFDF8","#F4ECDD","#E3C77E","#8A6A2C"],"nuska":["#14443A","#113A31","#F2DA9C","#F2DA9C"],"tunduk":["#FCF7EE","#EDE1CE","#D2563F","#A3271F"],"tasma":["#FCF7EE","#EDE1CE","#D2563F","#A3271F"],"kemer":["#FCF7EE","#EDE1CE","#D2563F","#A3271F"],"sep":["#FFFCF6","#ECE3D4","#7FA8AE","#1F5560"],"tor":["#FCF7EE","#EDE1CE","#D2563F","#A3271F"],"dastorkon":["#FFFBF4","#F2E4CF","#D9A55A","#8A5A1E"],"tan":["#FFFCF8","#EEE3D8","#D7A86E","#6E3B5A"],"kuzgu-jailoo":["#FFFBF4","#F2E4CF","#D9A55A","#8A5A1E"],"jaz":["#FCFDFA","#E6EBE0","#8FB3A8","#2E5E57"],"kysh":["#FCFCFE","#E6E8EF","#C9707C","#8A1E2C"]};

  // ---------- шрифты (с кыргызскими буквами Ң Ө Ү) ----------
  const EXT = 'U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F';
  const CYR = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';
  const LAT = 'U+0000-00FF, U+0131, U+0152-0153, U+2000-206F';
  let fontsReady = null;
  function loadFonts() {
    if (fontsReady) return fontsReady;
    const F = '/inv/fonts/';
    const faces = [new FontFace('TMV Script', `url(${F}great-vibes-kg.woff2)`, { weight: '400' })];
    for (const [w, st, sfx] of [['500', 'normal', '500-normal'], ['600', 'normal', '600-normal'], ['500', 'italic', '500-italic']]) {
      faces.push(new FontFace('TMV Serif', `url(${F}cormorant-garamond-cyrillic-ext-${sfx}.woff2)`, { weight: w, style: st, unicodeRange: EXT }));
      faces.push(new FontFace('TMV Serif', `url(${F}cormorant-garamond-cyrillic-${sfx}.woff2)`, { weight: w, style: st, unicodeRange: CYR }));
      faces.push(new FontFace('TMV Serif', `url(${F}cormorant-garamond-latin-${sfx}.woff2)`, { weight: w, style: st, unicodeRange: LAT }));
    }
    fontsReady = Promise.all(faces.map((f) => f.load().then((ff) => document.fonts.add(ff)).catch(() => {})));
    return fontsReady;
  }
  const img = (src) => new Promise((res) => {
    if (!src) return res(null);
    const i = new Image(); i.crossOrigin = 'anonymous'; i.decoding = 'async';
    i.onload = () => (i.decode ? i.decode().catch(() => {}).then(() => res(i)) : res(i)); i.onerror = () => res(null); i.src = src;
  });

  // ---------- помощники рисования ----------
  const cl = (x) => Math.max(0, Math.min(1, x));
  const eo = (x) => 1 - Math.pow(1 - cl(x), 3);
  const hex = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  const shade = (h, k) => { const n = parseInt(h.slice(1), 16); const f = (v) => Math.round(v * k).toString(16).padStart(2, '0'); return `#${f(n >> 16)}${f((n >> 8) & 255)}${f(n & 255)}`; };
  const lum = (h) => { const n = parseInt(h.slice(1), 16); return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; };
  function cover(ctx, im, x, y, w, h, zoom = 1, fx = 0.5, fy = 0.5) {
    const k = Math.max(w / im.width, h / im.height) * zoom, iw = im.width * k, ih = im.height * k;
    ctx.drawImage(im, x + (w - iw) * fx, y + (h - ih) * fy, iw, ih);
  }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function wrap(ctx, text, maxW) {
    const out = [];
    for (const para of String(text || '').split(/\n+/)) {
      let line = '';
      for (const w of para.split(/\s+/).filter(Boolean)) {
        const t = line ? `${line} ${w}` : w;
        if (ctx.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
      }
      if (line) out.push(line);
    }
    return out;
  }
  // текст с плавным появлением снизу; size уменьшается, пока строка не влезет
  function txt(ctx, s, x, y, { font, size, color, a = 1, dy = 0, maxW = 600, spacing = 0, align = 'center' }) {
    if (!s || a <= 0) return;
    let sz = size;
    ctx.font = font.replace('$', sz);
    if (spacing && 'letterSpacing' in ctx) ctx.letterSpacing = `${spacing}px`;
    while (ctx.measureText(s).width > maxW && sz > 12) { sz -= 2; ctx.font = font.replace('$', sz); }
    ctx.globalAlpha *= a; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y + dy);
    ctx.globalAlpha /= a;
    if (spacing && 'letterSpacing' in ctx) ctx.letterSpacing = '0px';
  }
  const rise = (lt, start, d = 0.9) => ({ a: eo((lt - start) / d), dy: (1 - eo((lt - start) / d)) * 26 });

  // ---------- палитра оформления ----------
  function palette(theme) {
    const s = SW[theme] || SW['ak-altyn'];
    const dark = lum(s[0]) < 0.35;
    // светлое оформление со светлым «чернилом» (например, золото Ак алтын) — темним, чтобы текст читался
    const ink = dark ? s[2] : lum(s[3]) > 0.42 ? shade(s[3], 0.55) : s[3];
    return { dark, paper: s[0], paper2: s[1], ink, accent: dark ? s[3] : s[2], soft: dark ? hex(s[2], 0.75) : hex(ink, 0.72) };
  }

  // ---------- план ролика ----------
  function plan(D) {
    const S = [{ k: 'cover', d: 4.6 }];
    D.photos.forEach((p, i) => S.push({ k: 'photo', d: i === 0 ? 4.2 : 3.0, i }));
    if (D.text) S.push({ k: 'text', d: Math.min(6.5, 3.8 + D.text.length / 90) });
    if (D.dateBig) S.push({ k: 'date', d: 3.8 });
    if (D.venue || D.address) S.push({ k: 'venue', d: 3.8 });
    S.push({ k: 'final', d: 4.4 });
    let t = 0;
    for (const s of S) { s.t0 = t; t += s.d - FADE; }
    return { S, total: t + FADE };
  }

  // фон оформления: картинка-сцена с медленным приближением или градиент с рамкой
  function drawBg(ctx, A, P, T) {
    if (A.bg) cover(ctx, A.bg, 0, 0, W, H, 1.02 + 0.06 * (T / A.total), 0.5, 0.45);
    else {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, P.dark ? P.paper : P.paper2); g.addColorStop(1, P.dark ? P.paper2 : shade(P.paper2, 0.9));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = hex(P.accent, 0.7); ctx.lineWidth = 2; ctx.strokeRect(34, 34, W - 68, H - 68);
      ctx.lineWidth = 1; ctx.strokeRect(46, 46, W - 92, H - 92);
    }
  }
  // карточка под текст поверх фона — текст читается на любом оформлении
  function card(ctx, P, a, y = 250, h = 780) {
    ctx.save(); ctx.globalAlpha *= a;
    rr(ctx, 70, y, W - 140, h, 34);
    ctx.fillStyle = hex(P.paper, P.dark ? 0.8 : 0.84); ctx.fill();
    ctx.strokeStyle = hex(P.accent, 0.55); ctx.lineWidth = 1.5;
    rr(ctx, 84, y + 14, W - 168, h - 28, 26); ctx.stroke();
    ctx.restore();
  }
  function orn(ctx, P, y, a, w = 120) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha *= a; ctx.strokeStyle = P.accent; ctx.fillStyle = P.accent; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(W / 2 - w, y); ctx.lineTo(W / 2 - 14, y); ctx.moveTo(W / 2 + 14, y); ctx.lineTo(W / 2 + w, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W / 2, y - 8); ctx.lineTo(W / 2 + 8, y); ctx.lineTo(W / 2, y + 8); ctx.lineTo(W / 2 - 8, y); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawScene(ctx, s, lt, A, D, P) {
    const SCRIPT = '400 $px "TMV Script", serif', CAPS = '600 $px "TMV Serif", serif', SERIF = '500 $px "TMV Serif", serif', ITAL = 'italic 500 $px "TMV Serif", serif';
    const cx = W / 2;
    if (s.k === 'cover') {
      card(ctx, P, eo(lt / 0.8));
      let r = rise(lt, 0.3); txt(ctx, D.kindTitle.toUpperCase(), cx, 380, { font: CAPS, size: 26, color: P.soft, spacing: 5, ...r });
      orn(ctx, P, 440, eo((lt - 0.5) / 0.8));
      const two = D.b && D.b.trim();
      const sc = 1.06 - 0.06 * eo((lt - 0.7) / 1.6);
      ctx.save(); ctx.translate(cx, 640); ctx.scale(sc, sc); ctx.translate(-cx, -640);
      r = rise(lt, 0.7, 1.2);
      if (two) {
        txt(ctx, D.a, cx, 560, { font: SCRIPT, size: 112, color: P.ink, maxW: 540, ...r });
        txt(ctx, '&', cx, 660, { font: SCRIPT, size: 72, color: P.accent, ...rise(lt, 1.0, 1.0) });
        txt(ctx, D.b, cx, 760, { font: SCRIPT, size: 112, color: P.ink, maxW: 540, ...rise(lt, 1.2, 1.2) });
      } else txt(ctx, D.a, cx, 650, { font: SCRIPT, size: 120, color: P.ink, maxW: 540, ...r });
      ctx.restore();
      orn(ctx, P, 870, eo((lt - 1.6) / 0.8));
      txt(ctx, D.dateBig, cx, 935, { font: CAPS, size: 38, color: P.ink, spacing: 4, ...rise(lt, 1.8) });
    } else if (s.k === 'photo') {
      const im = A.photos[s.i];
      if (im) {
        ctx.save(); ctx.globalAlpha *= eo(lt / 0.6);
        cover(ctx, im, 0, 0, W, H, 1.0 + 0.1 * (lt / s.d), 0.5, 0.4);
        const g = ctx.createLinearGradient(0, H * 0.55, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.62)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        if (s.i === 0) {
          const two = D.b && D.b.trim();
          txt(ctx, two ? `${D.a} & ${D.b}` : D.a, cx, H - 190, { font: SCRIPT, size: 92, color: '#FFFFFF', maxW: 620, ...rise(lt, 0.6, 1.1) });
          txt(ctx, D.dateBig, cx, H - 100, { font: CAPS, size: 30, color: 'rgba(255,255,255,.9)', spacing: 4, ...rise(lt, 1.0) });
        }
        ctx.restore();
      }
    } else if (s.k === 'text') {
      card(ctx, P, eo(lt / 0.7), 200, 880);
      ctx.font = ITAL.replace('$', 40);
      let size = 40, lines = wrap(ctx, D.text, 480);
      while (lines.length > 11 && size > 26) { size -= 2; ctx.font = ITAL.replace('$', size); lines = wrap(ctx, D.text, 480); }
      const lh = size * 1.32, y0 = 640 - ((lines.length - 1) * lh) / 2;
      orn(ctx, P, y0 - 90, eo((lt - 0.2) / 0.8));
      lines.forEach((ln, i) => txt(ctx, ln, cx, y0 + i * lh, { font: ITAL, size, color: P.ink, maxW: 520, ...rise(lt, 0.35 + i * 0.16, 0.8) }));
      orn(ctx, P, y0 + (lines.length - 1) * lh + 90, eo((lt - 0.6 - lines.length * 0.16) / 0.8));
    } else if (s.k === 'date') {
      card(ctx, P, eo(lt / 0.7), 330, 620);
      txt(ctx, D.dateLabel.toUpperCase(), cx, 440, { font: CAPS, size: 26, color: P.soft, spacing: 5, ...rise(lt, 0.25) });
      orn(ctx, P, 492, eo((lt - 0.4) / 0.8));
      const sc = 1.12 - 0.12 * eo((lt - 0.5) / 1.2);
      ctx.save(); ctx.translate(cx, 630); ctx.scale(sc, sc); ctx.translate(-cx, -630);
      txt(ctx, D.dateBig, cx, 630, { font: CAPS, size: 84, color: P.ink, maxW: 540, ...rise(lt, 0.5, 1.0) });
      ctx.restore();
      txt(ctx, D.dateLine, cx, 760, { font: ITAL, size: 40, color: P.ink, maxW: 520, ...rise(lt, 1.0) });
      orn(ctx, P, 840, eo((lt - 1.3) / 0.8));
    } else if (s.k === 'venue') {
      card(ctx, P, eo(lt / 0.7), 330, 620);
      txt(ctx, D.venueLabel.toUpperCase(), cx, 440, { font: CAPS, size: 26, color: P.soft, spacing: 5, ...rise(lt, 0.25) });
      // значок места
      const pa = eo((lt - 0.4) / 0.8);
      if (pa > 0) {
        ctx.save(); ctx.globalAlpha *= pa; ctx.fillStyle = P.accent; ctx.translate(cx, 530 + (1 - pa) * 20);
        ctx.beginPath(); ctx.arc(0, -10, 26, Math.PI, 0); ctx.lineTo(0, 40); ctx.closePath(); ctx.fill();
        ctx.fillStyle = P.paper; ctx.beginPath(); ctx.arc(0, -10, 10, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
      ctx.font = SERIF.replace('$', 56);
      const vl = wrap(ctx, D.venue || '', 500).slice(0, 3);
      vl.forEach((ln, i) => txt(ctx, ln, cx, 650 + i * 66 - ((vl.length - 1) * 33), { font: SERIF, size: 56, color: P.ink, maxW: 520, ...rise(lt, 0.6 + i * 0.15) }));
      ctx.font = ITAL.replace('$', 34);
      const al = wrap(ctx, D.address || '', 500).slice(0, 2);
      al.forEach((ln, i) => txt(ctx, ln, cx, 790 + i * 44, { font: ITAL, size: 34, color: P.soft, maxW: 520, ...rise(lt, 1.0 + i * 0.15) }));
    } else if (s.k === 'final') {
      card(ctx, P, eo(lt / 0.7), 300, 680);
      txt(ctx, D.finalLine, cx, 560, { font: SCRIPT, size: 96, color: P.ink, maxW: 540, ...rise(lt, 0.3, 1.2) });
      orn(ctx, P, 660, eo((lt - 0.9) / 0.8));
      if (D.sign) txt(ctx, D.sign, cx, 740, { font: ITAL, size: 38, color: P.ink, maxW: 520, ...rise(lt, 1.1) });
      const two = D.b && D.b.trim();
      txt(ctx, two ? `${D.a} & ${D.b}` : D.a, cx, D.sign ? 810 : 750, { font: SCRIPT, size: 54, color: P.accent, maxW: 520, ...rise(lt, 1.3) });
      txt(ctx, D.brand, cx, 930, { font: CAPS, size: 22, color: P.soft, spacing: 3, ...rise(lt, 1.6) });
    }
  }

  // знак «Образец» для неоплаченного приглашения
  function drawWm(ctx, text) {
    ctx.save();
    ctx.translate(W / 2, H / 2); ctx.rotate(-Math.PI / 6);
    ctx.font = '600 64px "TMV Serif", serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(122,30,44,.16)'; ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = 2;
    for (let y = -900; y <= 900; y += 300) { ctx.fillText(text, 0, y); ctx.strokeText(text, 0, y); }
    ctx.restore();
    ctx.save(); ctx.fillStyle = 'rgba(122,30,44,.88)'; ctx.fillRect(0, 0, W, 54);
    ctx.font = '600 24px "TMV Serif", serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '4px';
    ctx.fillText(text, W / 2, 28); ctx.restore();
  }

  function frame(ctx, T, A, D, P, plan_) {
    ctx.save(); ctx.globalAlpha = 1;
    drawBg(ctx, A, P, T);
    for (const s of plan_.S) {
      const lt = T - s.t0;
      if (lt < 0 || lt > s.d) continue;
      const inA = s === plan_.S[0] ? 1 : eo(lt / FADE), outA = s === plan_.S[plan_.S.length - 1] ? 1 : 1 - eo((lt - (s.d - FADE)) / FADE);
      ctx.save(); ctx.globalAlpha = Math.min(inA, outA);
      drawScene(ctx, s, lt, A, D, P);
      ctx.restore();
    }
    if (!D.paid) drawWm(ctx, D.wm);
    // мягкое затемнение в самом начале и в конце
    const f = Math.max(1 - eo(T / 0.6), eo((T - (plan_.total - 0.8)) / 0.8));
    if (f > 0) { ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, W, H); }
    ctx.restore();
  }

  function pickMime() {
    if (typeof MediaRecorder === 'undefined') return null;
    for (const m of ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']) {
      if (MediaRecorder.isTypeSupported(m)) return m;
    }
    return null;
  }
  function supported() {
    const c = document.createElement('canvas');
    return Boolean(c.captureStream && pickMime() && window.FontFace);
  }

  // ---------- сборка ----------
  // ac — AudioContext, созданный прямо в обработчике нажатия (iPhone разрешает звук только так)
  async function make(D, canvas, onProgress, ac) {
    const mime = pickMime();
    if (!mime || !canvas.captureStream) throw new Error('unsupported');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    const P = palette(D.theme);
    onProgress && onProgress({ stage: 'load', p: 0 });
    const [, bg, photos, music] = await Promise.all([
      loadFonts(),
      img(`/inv/scenes/${D.theme}.webp`),
      Promise.all((D.photos || []).slice(0, 4).map(img)),
      D.music && ac ? fetch(D.music).then((r) => (r.ok ? r.arrayBuffer() : null)).then((b) => (b ? ac.decodeAudioData(b) : null)).catch(() => null) : null,
    ]);
    D = { ...D, photos: (D.photos || []).slice(0, 4).filter((_, i) => photos[i]) };
    const A = { bg, photos: photos.filter(Boolean) };
    const pl = plan(D); A.total = pl.total;
    frame(ctx, 0, A, D, P, pl);

    const stream = canvas.captureStream(FPS);
    let src = null;
    if (music && ac) {
      const dest = ac.createMediaStreamDestination(), gain = ac.createGain();
      src = ac.createBufferSource(); src.buffer = music; src.connect(gain); gain.connect(dest);
      const t0 = ac.currentTime + 0.05;
      gain.gain.setValueAtTime(0, t0); gain.gain.linearRampToValueAtTime(1, t0 + 1.2);
      gain.gain.setValueAtTime(1, t0 + pl.total - 2); gain.gain.linearRampToValueAtTime(0, t0 + pl.total);
      dest.stream.getAudioTracks().forEach((t) => stream.addTrack(t));
    }
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6000000, audioBitsPerSecond: 128000 });
    const chunks = [];
    rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    const done = new Promise((res) => { rec.onstop = res; });
    rec.start(1000);
    if (src) src.start(ac.currentTime + 0.05);
    const start = performance.now();
    await new Promise((res) => {
      const tick = () => {
        const T = (performance.now() - start) / 1000;
        frame(ctx, Math.min(T, pl.total), A, D, P, pl);
        onProgress && onProgress({ stage: 'rec', p: Math.min(1, T / pl.total), t: T, total: pl.total });
        if (T >= pl.total + 0.25) res(); else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    rec.stop(); await done;
    try { src && src.stop(); } catch { /* уже остановлен */ }
    stream.getTracks().forEach((t) => t.stop());
    const type = mime.split(';')[0];
    return { blob: new Blob(chunks, { type }), mime: type, ext: type === 'video/mp4' ? 'mp4' : 'webm', total: pl.total };
  }

  // кадр без записи — для проверки внешнего вида (tools / тесты)
  async function still(D, canvas, T) {
    canvas.width = W; canvas.height = H;
    const P = palette(D.theme);
    const [, bg, photos] = await Promise.all([loadFonts(), img(`/inv/scenes/${D.theme}.webp`), Promise.all((D.photos || []).slice(0, 4).map(img))]);
    D = { ...D, photos: (D.photos || []).slice(0, 4).filter((_, i) => photos[i]) };
    const A = { bg, photos: photos.filter(Boolean) };
    const pl = plan(D); A.total = pl.total;
    frame(canvas.getContext('2d'), T, A, D, P, pl);
    return pl;
  }

  window.TMVideo = { make, still, supported, plan };
})();
