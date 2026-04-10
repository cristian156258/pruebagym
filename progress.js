// ── Rest Timer ────────────────────────────────────────────────────────────────
const Timer = (() => {
  let active = false;
  let endTime = null;
  let iv = null;
  let duration = 90;
  let audioCtx = null;

  const beep = () => {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx;
      [0, 0.28, 0.56].forEach(t => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.frequency.value = t === 0.56 ? 880 : 660;
        g.gain.setValueAtTime(0.22, ctx.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.22);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.25);
      });
    } catch (e) {}
  };

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const tick = () => {
    if (!endTime) return;
    const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    render(left);
    if (left === 0) { stop(); beep(); }
  };

  const render = (left) => {
    const bar = document.getElementById('timer-bar');
    if (!bar) return;
    if (!active) { bar.innerHTML = ''; return; }
    const pct = Math.max(0, left / duration);
    const C = 2 * Math.PI * 16;
    const color = left <= 10 ? 'var(--red)' : left <= 30 ? 'var(--amber)' : 'var(--green)';
    bar.innerHTML = `
      <div class="timer-pill">
        <svg width="40" height="40" viewBox="0 0 40 40" style="transform:rotate(-90deg);flex-shrink:0">
          <circle cx="20" cy="20" r="16" fill="none" stroke="var(--bg3)" stroke-width="3"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="${color}" stroke-width="3"
            stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"
            stroke-linecap="round" style="transition:stroke-dashoffset .25s,stroke .3s"/>
        </svg>
        <div>
          <div class="timer-label">Descanso</div>
          <div class="timer-time" style="color:${color}">${fmt(left)}</div>
        </div>
        <div class="timer-actions">
          <button class="btn btn-dim btn-sm" id="t-minus">-15s</button>
          <button class="btn btn-dim btn-sm" id="t-plus">+15s</button>
          <button class="btn btn-red btn-sm" id="t-stop">✕</button>
        </div>
      </div>`;
    document.getElementById('t-minus')?.addEventListener('pointerdown', () => adjust(-15));
    document.getElementById('t-plus')?.addEventListener('pointerdown',  () => adjust(15));
    document.getElementById('t-stop')?.addEventListener('pointerdown',  stop);
  };

  const start = (d = 90) => {
    duration = d;
    endTime = Date.now() + d * 1000;
    active = true;
    if (iv) clearInterval(iv);
    iv = setInterval(tick, 250);
    tick();
  };

  const stop = () => {
    active = false;
    endTime = null;
    if (iv) clearInterval(iv);
    iv = null;
    render(0);
  };

  const adjust = (s) => {
    if (!endTime) return;
    endTime += s * 1000;
    const left = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    render(left);
  };

  const isActive = () => active;

  return { start, stop, isActive };
})();
