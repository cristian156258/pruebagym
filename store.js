// ── Logger View ───────────────────────────────────────────────────────────────
Views.logger = (root, ctx = {}) => {
  const { workout: initWorkout = null, routine: initRoutine = null } = ctx;

  // Draft persistence
  const draftLoad = () => {
    if (initWorkout) return { name: initWorkout.name, exercises: JSON.parse(JSON.stringify(initWorkout.exercises)) };
    if (initRoutine) return {
      name: initRoutine.name,
      exercises: initRoutine.exercises.map(ex => ({
        id: uid(), exerciseName: ex.exerciseName,
        sets: Array.from({ length: ex.targetSets }, () => ({ id: uid(), reps: ex.targetReps, weight: ex.targetWeight || 0, completed: false }))
      }))
    };
    try {
      const d = localStorage.getItem('wl_draft');
      return d ? JSON.parse(d) : { name: '', exercises: [] };
    } catch { return { name: '', exercises: [] }; }
  };
  const draftSave = () => {
    if (initWorkout) return;
    try { localStorage.setItem('wl_draft', JSON.stringify({ name: state.name, exercises: state.exercises })); } catch {}
  };
  const draftClear = () => localStorage.removeItem('wl_draft');

  const draft = draftLoad();
  const state = { name: draft.name, exercises: draft.exercises, error: '' };
  const startTime = Date.now();

  const render = () => {
    const done  = state.exercises.reduce((a,e) => a + e.sets.filter(s=>s.completed).length, 0);
    const total = state.exercises.reduce((a,e) => a + e.sets.length, 0);
    const pct   = total ? Math.round(done/total*100) : 0;

    root.innerHTML = `
      <div class="flex-between mb-14">
        <div>
          <div class="section-title">${initWorkout ? 'Editar Entreno' : 'Nuevo Entreno'}</div>
        </div>
        <button class="btn btn-dim btn-icon" id="btn-cancel" style="border-radius:50%">${svg(I.x, 18)}</button>
      </div>

      ${total > 0 ? `
        <div class="prog-wrap">
          <div class="prog-info"><span>${done}/${total} series</span><span class="text-green">${pct}%</span></div>
          <div class="prog-track"><div class="prog-fill" style="width:${pct}%"></div></div>
        </div>` : ''}

      ${state.error ? `<div class="error-bar">${svg(I.alert, 16)} ${state.error}</div>` : ''}

      <div class="field">
        <label class="label">Nombre del entrenamiento</label>
        <input id="wl-name" class="input" type="text" placeholder="Ej: Pecho y Tríceps" value="${state.name}"/>
      </div>

      <div id="ex-list"></div>

      <button class="btn btn-ghost btn-block mb-12" id="btn-add-ex" style="padding:13px">
        ${svg(I.dumbbell, 18)} Añadir Ejercicio
      </button>
      <button class="btn btn-green btn-block" id="btn-save" style="font-size:15px;font-weight:600;padding:15px">
        ${svg(I.check, 20)} ${initWorkout ? 'Actualizar Entreno' : 'Guardar Entreno'}
      </button>
      <div style="height:80px"></div>`;

    // Name
    root.querySelector('#wl-name').addEventListener('input', e => {
      state.name = e.target.value; draftSave();
    });

    // Cancel
    root.querySelector('#btn-cancel').addEventListener('pointerdown', () => {
      Router.go('dashboard');
    });

    // Add exercise
    root.querySelector('#btn-add-ex').addEventListener('pointerdown', () => {
      state.exercises.push({ id: uid(), exerciseName: '', sets: [{ id: uid(), reps: 0, weight: 0, completed: false }] });
      draftSave(); renderExercises();
    });

    // Save
    root.querySelector('#btn-save').addEventListener('pointerdown', () => {
      state.error = '';
      if (!state.name.trim()) { state.error = 'Ingresa un nombre para el entrenamiento.'; render(); return; }
      const valid = state.exercises.filter(e => e.exerciseName.trim());
      if (!valid.length) { state.error = 'Agrega al menos un ejercicio con nombre.'; render(); return; }
      const dur = Math.floor((Date.now()-startTime)/60000) || undefined;
      Store.saveWorkout({
        id: initWorkout?.id || uid(),
        date: initWorkout?.date || new Date().toISOString(),
        name: state.name, exercises: valid,
        routineId: initWorkout?.routineId || initRoutine?.id,
        duration: initWorkout?.duration || dur,
      });
      draftClear();
      Router.go('dashboard');
    });

    renderExercises();
  };

  const renderExercises = () => {
    const list = root.querySelector('#ex-list');
    if (!list) return;
    list.innerHTML = '';
    state.exercises.forEach((ex, idx) => renderExercise(list, ex, idx));
  };

  const renderExercise = (container, ex, idx) => {
    const prevHist = getHistory(ex.exerciseName);
    const card = document.createElement('div');
    card.className = 'ex-card';
    card.dataset.exid = ex.id;

    card.innerHTML = `
      <div class="ex-card-head">
        <div class="ex-name-row">
          <span class="ex-num">${idx+1}</span>
          <div class="ex-name-wrap">
            <input class="input-underline ex-name-input" type="text" value="${ex.exerciseName}" placeholder="Nombre del ejercicio"/>
            <div class="suggest-list" style="display:none"></div>
          </div>
          ${prevHist ? `<button class="btn btn-dim btn-icon hist-btn" style="width:30px;height:30px">${svg(I.histBack, 14)}</button>` : ''}
          <button class="btn btn-red btn-icon ex-del-btn" style="width:30px;height:30px">${svg(I.trash, 14)}</button>
        </div>
        <div class="history-panel" style="display:none">
          <div class="history-label">Última vez: ${prevHist ? fmtDate(prevHist.date) : ''}</div>
          <div class="history-sets">
            ${(prevHist?.sets || []).map(s => `<span class="history-set">${s.weight>0?s.weight+'×'+s.reps:'×'+s.reps}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="ex-card-body">
        <div class="sets-header">
          <span style="text-align:center">#</span><span style="text-align:center">kg</span><span style="text-align:center">reps</span><span style="text-align:center">✓</span><span></span>
        </div>
        <div class="sets-list"></div>
        <button class="btn btn-ghost w-full add-set-btn" style="padding:9px;font-size:12px;margin-top:4px">
          ${svg(I.plus, 14)} Añadir Serie
        </button>
      </div>`;

    // Exercise name autocomplete
    const nameInput = card.querySelector('.ex-name-input');
    const sugList   = card.querySelector('.suggest-list');

    nameInput.addEventListener('input', e => {
      ex.exerciseName = e.target.value; draftSave();
      const q = e.target.value.trim().toLowerCase();
      if (q.length >= 2) {
        const matches = EXERCISES.filter(s => s.toLowerCase().includes(q) && s.toLowerCase() !== q).slice(0, 6);
        if (matches.length) {
          sugList.innerHTML = matches.map(s => `<div class="suggest-item">${s}</div>`).join('');
          sugList.style.display = 'block';
        } else sugList.style.display = 'none';
      } else sugList.style.display = 'none';
    });
    nameInput.addEventListener('blur', () => setTimeout(() => { sugList.style.display = 'none'; }, 200));
    sugList.addEventListener('pointerdown', e => {
      const item = e.target.closest('.suggest-item');
      if (!item) return;
      ex.exerciseName = item.textContent; nameInput.value = item.textContent;
      sugList.style.display = 'none'; draftSave();
    });

    // History toggle
    card.querySelector('.hist-btn')?.addEventListener('pointerdown', () => {
      const hp = card.querySelector('.history-panel');
      hp.style.display = hp.style.display === 'none' ? 'block' : 'none';
    });

    // Delete exercise
    card.querySelector('.ex-del-btn').addEventListener('pointerdown', () => {
      state.exercises = state.exercises.filter(e => e.id !== ex.id);
      draftSave(); renderExercises();
    });

    // Add set
    card.querySelector('.add-set-btn').addEventListener('pointerdown', () => {
      const last = ex.sets[ex.sets.length-1];
      ex.sets.push({ id: uid(), reps: last?.reps||0, weight: last?.weight||0, completed: false });
      draftSave(); renderSets(card, ex);
    });

    container.appendChild(card);
    renderSets(card, ex);
  };

  const renderSets = (card, ex) => {
    const list = card.querySelector('.sets-list');
    list.innerHTML = '';
    ex.sets.forEach((s, si) => {
      const row = document.createElement('div');
      row.className = 'set-row' + (s.completed ? ' done' : '');
      row.innerHTML = `
        <span class="set-num">${si+1}</span>
        <input class="input input-mono" inputmode="decimal" value="${s.weight||''}" placeholder="0" style="padding:9px 4px"/>
        <input class="input input-mono" inputmode="numeric" value="${s.reps||''}" placeholder="0" style="padding:9px 4px"/>
        <button class="set-check ${s.completed?'checked':'unchecked'}">${svg(I.check, s.completed?16:14)}</button>
        <button class="set-del" ${ex.sets.length <= 1 ? 'disabled' : ''}>${svg(I.x, 12)}</button>`;

      row.querySelectorAll('input')[0].addEventListener('input', e => {
        s.weight = e.target.value === '' ? 0 : Math.max(0, parseFloat(e.target.value)||0); draftSave();
      });
      row.querySelectorAll('input')[1].addEventListener('input', e => {
        s.reps = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value)||0); draftSave();
      });
      row.querySelector('.set-check').addEventListener('pointerdown', () => {
        s.completed = !s.completed;
        if (s.completed && !Timer.isActive()) Timer.start(90);
        draftSave(); renderSets(card, ex);
        // Update progress bar
        const done  = state.exercises.reduce((a,e2) => a + e2.sets.filter(x=>x.completed).length, 0);
        const total = state.exercises.reduce((a,e2) => a + e2.sets.length, 0);
        const pct = total ? Math.round(done/total*100) : 0;
        const fill = root.querySelector('.prog-fill');
        const info = root.querySelector('.prog-info');
        if (fill) fill.style.width = pct + '%';
        if (info) info.innerHTML = `<span>${done}/${total} series</span><span class="text-green">${pct}%</span>`;
      });
      row.querySelector('.set-del').addEventListener('pointerdown', () => {
        if (ex.sets.length <= 1) return;
        ex.sets = ex.sets.filter(x => x.id !== s.id);
        draftSave(); renderSets(card, ex);
      });
      list.appendChild(row);
    });
  };

  const getHistory = (name) => {
    if (!name.trim()) return null;
    const initId = initWorkout?.id;
    const sorted = [...Store.state.workouts].sort((a,b) => new Date(b.date) - new Date(a.date));
    for (const w of sorted) {
      if (w.id === initId) continue;
      const ex = w.exercises.find(e => e.exerciseName.toLowerCase() === name.toLowerCase());
      if (ex?.sets.length) return { date: w.date, sets: ex.sets };
    }
    return null;
  };

  render();
};
