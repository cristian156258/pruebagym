// ── Dashboard View ────────────────────────────────────────────────────────────
const Views = window.Views || {};

Views.dashboard = (root) => {
  const { workouts } = Store.state;

  // Stats
  const streak = (() => {
    if (!workouts.length) return 0;
    const sorted = [...workouts].sort((a,b) => new Date(b.date) - new Date(a.date));
    let s = 0, cur = new Date(); cur.setHours(0,0,0,0);
    for (const w of sorted) {
      const d = new Date(w.date); d.setHours(0,0,0,0);
      const diff = Math.round((cur - d) / 86400000);
      if (diff <= 1) { s++; cur = new Date(d); cur.setDate(cur.getDate()-1); } else break;
    }
    return s;
  })();
  const thisWeek = workouts.filter(w => new Date(w.date) >= new Date(Date.now() - 7*864e5)).length;
  const totalVol = workouts.reduce((a,w) => a + w.exercises.reduce((b,e) => b + e.sets.reduce((c,s) => c + (s.weight||0)*(s.reps||0), 0), 0), 0);

  if (!workouts.length) {
    root.innerHTML = `
      <div class="empty">
        ${svg(I.dumbbell, 52)}
        <div class="empty-title">Sin entrenamientos aún</div>
        <div class="empty-sub">Presiona el <span class="text-green">+</span> para registrar tu primer entreno.</div>
      </div>`;
    return;
  }

  root.innerHTML = `
    <div class="section-header">
      <span class="section-title">Historial</span>
      <span class="tag tag-green">${workouts.length} entrenos</span>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-val" style="color:#ff6b6b">${streak} 🔥</div><div class="stat-lbl">Racha</div></div>
      <div class="stat-card"><div class="stat-val" style="color:var(--blue)">${thisWeek}</div><div class="stat-lbl">Esta semana</div></div>
      <div class="stat-card"><div class="stat-val" style="color:var(--purple)">${(totalVol/1000).toFixed(1)}t</div><div class="stat-lbl">Volumen</div></div>
    </div>
    <div id="wlist"></div>`;

  const list = root.querySelector('#wlist');

  workouts.forEach(w => {
    const wVol  = w.exercises.reduce((a,e) => a + e.sets.reduce((b,s) => b + (s.weight||0)*(s.reps||0), 0), 0);
    const wSets = w.exercises.reduce((a,e) => a + e.sets.length, 0);

    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'cursor:pointer';
    card.innerHTML = `
      <div class="flex-between gap-8">
        <div style="flex:1;min-width:0">
          <div style="font-weight:500;font-size:15px;margin-bottom:3px" class="truncate">${w.name}</div>
          <div class="text-xs text-dim">${fmtDate(w.date)}${w.duration ? ' · ' + w.duration + 'm' : ''}</div>
          <div class="flex gap-6 mt-8" style="flex-wrap:wrap">
            <span class="tag tag-blue">${w.exercises.length} ejerc.</span>
            <span class="tag tag-muted">${wSets} series</span>
            ${wVol > 0 ? `<span class="tag tag-green">${wVol.toLocaleString()}kg</span>` : ''}
          </div>
        </div>
        <div class="flex gap-6" style="flex-shrink:0;align-items:flex-start">
          <button class="btn btn-dim btn-icon btn-edit">${svg(I.edit, 14)}</button>
          <button class="btn btn-red btn-icon btn-del">${svg(I.trash, 14)}</button>
        </div>
      </div>
      <div class="detail" style="display:none"></div>`;

    // Edit
    card.querySelector('.btn-edit').addEventListener('pointerdown', e => {
      e.stopPropagation();
      Router.go('logger', { workout: w });
    });

    // Delete — show confirmation sheet
    card.querySelector('.btn-del').addEventListener('pointerdown', e => {
      e.stopPropagation();
      showConfirm('¿Eliminar entrenamiento?', 'Esta acción no se puede deshacer.', () => {
        Store.deleteWorkout(w.id);
        Router.go('dashboard');
      });
    });

    // Expand/collapse detail
    let expanded = false;
    card.addEventListener('pointerdown', () => {
      expanded = !expanded;
      const det = card.querySelector('.detail');
      if (expanded) {
        det.style.display = 'block';
        det.innerHTML = `
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
            ${w.exercises.map(ex => `
              <div class="flex-between" style="margin-bottom:8px;gap:8px">
                <span class="text-sm text-muted truncate" style="flex:1">${ex.exerciseName}</span>
                <div class="flex gap-6" style="flex-wrap:wrap;justify-content:flex-end">
                  ${ex.sets.map(s => `<span style="font-family:monospace;font-size:11px;background:var(--bg3);color:var(--text2);padding:2px 7px;border-radius:5px">${s.weight > 0 ? s.weight+'×'+s.reps : '×'+s.reps}</span>`).join('')}
                </div>
              </div>`).join('')}
          </div>`;
      } else {
        det.style.display = 'none';
      }
    });

    list.appendChild(card);
  });
};

// ── Shared confirm dialog ──────────────────────────────────────────────────────
function showConfirm(title, msg, onConfirm) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `
    <div class="sheet">
      <div style="font-size:17px;font-weight:600;margin-bottom:8px">${title}</div>
      <div class="text-sm text-muted">${msg}</div>
      <div class="sheet-row">
        <button class="btn btn-dim btn-block" id="c-no">Cancelar</button>
        <button class="btn btn-red btn-block" id="c-yes">Eliminar</button>
      </div>
    </div>`;
  ov.querySelector('#c-no').addEventListener('pointerdown',  () => document.body.removeChild(ov));
  ov.querySelector('#c-yes').addEventListener('pointerdown', () => { document.body.removeChild(ov); onConfirm(); });
  ov.addEventListener('pointerdown', e => { if (e.target === ov) document.body.removeChild(ov); });
  document.body.appendChild(ov);
}
