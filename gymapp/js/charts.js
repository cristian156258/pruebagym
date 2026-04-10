// ── Charts: Canvas-based, zero dependencies ───────────────────────────────────
const Charts = (() => {

  const LINE_COLOR  = '#00e090';
  const BAR_COLOR   = '#3ba0ff';
  const GRID_COLOR  = '#1a2330';
  const LABEL_COLOR = '#3d5568';
  const BG_COLOR    = '#0d1117';

  const dpr = () => window.devicePixelRatio || 1;

  const setup = (canvas, h = 180) => {
    const r = dpr();
    const w = canvas.parentElement.clientWidth || 300;
    canvas.width  = w * r;
    canvas.height = h * r;
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(r, r);
    return { ctx, w, h };
  };

  const drawLine = (canvas, data, yKey = 'value', yLabel = v => v, color = LINE_COLOR) => {
    if (!canvas || !data.length) return;
    const { ctx, w, h } = setup(canvas);

    const PAD = { top: 10, right: 10, bottom: 28, left: 42 };
    const iw = w - PAD.left - PAD.right;
    const ih = h - PAD.top - PAD.bottom;

    const vals   = data.map(d => d[yKey]);
    const minV   = Math.min(...vals);
    const maxV   = Math.max(...vals);
    const range  = maxV - minV || 1;
    const xStep  = data.length > 1 ? iw / (data.length - 1) : iw;

    const px = i => PAD.left + i * xStep;
    const py = v => PAD.top + ih - ((v - minV) / range) * ih;

    ctx.clearRect(0, 0, w, h);

    // Grid lines
    const ticks = 4;
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0; i <= ticks; i++) {
      const y = PAD.top + (ih / ticks) * i;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + iw, y); ctx.stroke();
      const val = maxV - (range / ticks) * i;
      ctx.fillStyle = LABEL_COLOR; ctx.font = '10px monospace'; ctx.textAlign = 'right';
      ctx.fillText(yLabel(val), PAD.left - 4, y + 4);
    }

    // X labels (show max 6)
    ctx.fillStyle = LABEL_COLOR; ctx.font = '10px -apple-system,sans-serif'; ctx.textAlign = 'center';
    const step = Math.ceil(data.length / 6);
    data.forEach((d, i) => {
      if (i % step === 0 || i === data.length - 1) {
        ctx.fillText(d.label || '', px(i), h - 6);
      }
    });

    if (data.length < 2) return;

    // Gradient fill
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + ih);
    grad.addColorStop(0, color + '44');
    grad.addColorStop(1, color + '00');
    ctx.beginPath();
    ctx.moveTo(px(0), py(vals[0]));
    data.forEach((d, i) => { if (i > 0) ctx.lineTo(px(i), py(vals[i])); });
    ctx.lineTo(px(data.length - 1), PAD.top + ih);
    ctx.lineTo(px(0), PAD.top + ih);
    ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
    data.forEach((d, i) => { i === 0 ? ctx.moveTo(px(i), py(vals[i])) : ctx.lineTo(px(i), py(vals[i])); });
    ctx.stroke();

    // Dots
    data.forEach((d, i) => {
      ctx.beginPath();
      ctx.arc(px(i), py(vals[i]), 4, 0, Math.PI * 2);
      ctx.fillStyle = BG_COLOR; ctx.fill();
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    });
  };

  const drawBars = (canvas, data, color = BAR_COLOR) => {
    if (!canvas || !data.length) return;
    const { ctx, w, h } = setup(canvas, 110);

    const PAD = { top: 8, right: 8, bottom: 24, left: 28 };
    const iw = w - PAD.left - PAD.right;
    const ih = h - PAD.top - PAD.bottom;

    const vals  = data.map(d => d.value);
    const maxV  = Math.max(...vals) || 1;
    const bw    = Math.max(4, (iw / data.length) * 0.6);
    const gap   = iw / data.length;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = GRID_COLOR; ctx.lineWidth = 1;
    for (let i = 0; i <= 3; i++) {
      const y = PAD.top + (ih / 3) * i;
      ctx.beginPath(); ctx.moveTo(PAD.left, y); ctx.lineTo(PAD.left + iw, y); ctx.stroke();
    }

    // Bars
    data.forEach((d, i) => {
      const x  = PAD.left + gap * i + gap / 2 - bw / 2;
      const bh = (d.value / maxV) * ih;
      const y  = PAD.top + ih - bh;

      // Rounded top
      const r2 = Math.min(4, bh / 2);
      ctx.beginPath();
      ctx.moveTo(x + r2, y);
      ctx.lineTo(x + bw - r2, y);
      ctx.quadraticCurveTo(x + bw, y, x + bw, y + r2);
      ctx.lineTo(x + bw, PAD.top + ih);
      ctx.lineTo(x, PAD.top + ih);
      ctx.lineTo(x, y + r2);
      ctx.quadraticCurveTo(x, y, x + r2, y);
      ctx.closePath();
      ctx.fillStyle = color + 'cc'; ctx.fill();

      // Label
      ctx.fillStyle = LABEL_COLOR; ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(d.label || '', PAD.left + gap * i + gap / 2, h - 4);
    });
  };

  return { drawLine, drawBars };
})();
