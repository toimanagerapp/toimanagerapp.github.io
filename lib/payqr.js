// QR MBank с готовой суммой: в код из MBank добавляется сумма (тег 54, в тыйынах) и новая контрольная сумма
// (тег 63 = последние 4 знака SHA-256). Комментарий банк из QR не берёт — проверено 22.11.2026.
(function () {
  function tlv(t, v) { return t + String(v.length).padStart(2, '0') + v; }
  async function link(base, som) {
    if (!som || !window.crypto?.subtle) return base;
    try {
      const i = base.indexOf('#'); const p = decodeURIComponent(base.slice(i + 1));
      const parts = []; let k = 0;
      while (k < p.length) { const t = p.substr(k, 2), l = Number(p.substr(k + 2, 2)); parts.push([t, p.substr(k + 4, l)]); k += 4 + l; }
      const out = parts.filter(([t]) => t !== '63' && t !== '54');
      out.push(['54', String(Math.round(Number(som) * 100))]);
      out.sort((a, b) => Number(a[0]) - Number(b[0]));
      const body = out.map(([t, v]) => tlv(t, v)).join('');
      const h = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body))))
        .map((b) => b.toString(16).padStart(2, '0')).join('');
      return base.slice(0, i + 1) + encodeURIComponent(body + '6304' + h.slice(-4));
    } catch (e) { return base; }
  }
  function png(text) {
    if (typeof qrcode !== 'function') return null;
    const q = qrcode(0, 'M'); q.addData(text); q.make();
    const n = q.getModuleCount(), cell = 8, pad = 4 * cell, size = n * cell + pad * 2;
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, size, size); g.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (q.isDark(r, col)) g.fillRect(pad + col * cell, pad + r * cell, cell, cell);
    return c.toDataURL('image/png');
  }
  // { link, qr } — qr = null, если генератор не загрузился (тогда остаётся обычная картинка)
  window.PayQR = async function (base, som) { const l = await link(base, som); return { link: l, qr: l !== base ? png(l) : null }; };
})();
