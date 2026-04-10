// ── Progress View ─────────────────────────────────────────────────────────────
Views.progress = (root) => {
  const { workouts } = Store.state;

  const exercises = [...new Set(workouts.flatMap(w => w.exercises.map(e => e.exerciseName)))].sort();
  const totalVol  = workouts.reduce((a,w) => a + w.exercises.reduce((b,e) => b + e.sets.reduce((c,s) => c+(s.weight||0)*(s.reps||0),0),0),0);
  const totalSets = workouts.reduce((a,w) => a + w.exercises.reduce((b,e) => b + e.sets.length,0),0);

  if (!workouts.length) {
    root.innerHTML = `<div class="empty">${svg(I.chart,48)}<div class="empty-title">Sin datos todavía</div><div class="empty-sub">Registra entrenamientos para ver tu progreso.</div></div>`;
    return;
  }

  const prs = (() => {
    const r = {};
    workouts.forEach(w => w.exercises.forEach(ex => ex.sets.forEach(s => {
      if ((s.weight||0) > (r[ex.exerciseName]?.weight||0)) r[ex.exerciseName] = { weight: s.weight, reps: s.reps };
    })));
    return Object.entries(r).sort((a,b)=>b[1].weight-a[1].weight).slice(0,6);
  })();

  const weekly = (() => {
    const m = {};
    workouts.forEach(w => {
      const d = new Date(w.date); d.setDate(d.getDate()-d.getDay());
      const k = d.toLocaleDateString('es-ES',{month:'short',day:'numeric'});
      m[k] = (m[k]||0)+1;
    });
    return Object.entries(m).slice(-8).map(([label,value]) => ({label,value}));
  })();

  const selEx = exercises[0] || '';

  root.innerHTML = `
    <div class="section-header">
      <span class="section-title">Progreso</span>
      <span style="font-size:20px">📈</span>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
      <div class="stat-card"><div class="stat-val text-green">${(totalVol/1000).toFixed(1)}<span style="font-size:13px;font-weight:400;color:var(--text3)">t</span></div><div class="stat-lbl">Volumen Total</div></div>
      <div class="stat-card"><div class="stat-val" style="color:var(--blue)">${totalSets.toLocaleString()}</div><div class="stat-lbl">Total Series</div></div>
    </div>

    ${weekly.length > 1 ? `
    <div class="card mb-12">
      <div class="text-sm" style="font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px"><span style="color:var(--blue)">📅</span> Frecuencia Semanal</div>
      <div class="chart-wrap"><canvas id="chart-weekly"></canvas></div>
    </div>` : ''}

    <div class="card mb-12">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:12px">
        <div class="flex gap-6">
          <button class="btn btn-green btn-sm" id="mode-weight" data-mode="weight">Peso Máx</button>
          <button class="btn btn-dim btn-sm"   id="mode-vol"    data-mode="volume">Volumen</button>
        </div>
        <select id="ex-select" style="background:var(--bg3);border:1px solid var(--border2);border-radius:9px;color:var(--text);font-size:12px;padding:6px 10px;max-width:160px;outline:none">
          ${exercises.map(e=>`<option value="${e}">${e}</option>`).join('')}
        </select>
      </div>
      <div class="chart-wrap" id="line-wrap"><canvas id="chart-line"></canvas></div>
    </div>

    ${prs.length ? `
    <div class="card">
      <div class="text-sm" style="font-weight:500;margin-bottom:10px;display:flex;align-items:center;gap:6px"><span>🏆</span> Records Personales</div>
      ${prs.map(([n,r]) => `<div class="pr-row"><span class="pr-name">${n}</span><span class="pr-val">${r.weight}kg <span style="font-size:12px;color:var(--text3)">×${r.reps}</span></span></div>`).join('')}
    </div>` : ''}`;

  // Draw weekly bar chart
  if (weekly.length > 1) {
    requestAnimationFrame(() => Charts.drawBars(root.querySelector('#chart-weekly'), weekly));
  }

  // Line chart
  let mode = 'weight';
  const getLineData = (exName, m) => {
    const map = new Map();
    [...workouts].reverse().forEach(w => {
      const label = fmtDate(w.date, {month:'short',day:'numeric'});
      const ex = w.exercises.find(e => e.exerciseName === exName);
      if (!ex) return;
      const val = m === 'weight'
        ? Math.max(...ex.sets.map(s=>s.weight||0))
        : ex.sets.reduce((a,s)=>a+(s.weight||0)*(s.reps||0),0);
      if (!map.has(label) || map.get(label).value < val) map.set(label, {label, value: val});
    });
    return [...map.values()];
  };

  const drawLine = () => {
    const canvas = root.querySelector('#chart-line');
    const exName = root.querySelector('#ex-select')?.value || selEx;
    const data   = getLineData(exName, mode);
    requestAnimationFrame(() => Charts.drawLine(canvas, data, 'value', v => mode==='weight'?Math.round(v)+'kg':Math.round(v/100)/10+'t'));
  };

  root.querySelector('#ex-select')?.addEventListener('change', drawLine);

  root.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('pointerdown', () => {
      mode = btn.dataset.mode;
      root.querySelector('#mode-weight').className = mode==='weight' ? 'btn btn-green btn-sm' : 'btn btn-dim btn-sm';
      root.querySelector('#mode-vol').className    = mode==='volume' ? 'btn btn-green btn-sm' : 'btn btn-dim btn-sm';
      drawLine();
    });
  });

  drawLine();
};
