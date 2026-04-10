// ── Routines View ─────────────────────────────────────────────────────────────
Views.routines = (root) => {
  const { routines } = Store.state;
  const today = new Date().getDay();

  const dLoad = () => { try { const d = localStorage.getItem('rd_draft'); return d ? JSON.parse(d) : null; } catch { return null; } };
  const dSave = (s) => { try { localStorage.setItem('rd_draft', JSON.stringify(s)); } catch {} };
  const dClear = () => localStorage.removeItem('rd_draft');

  // Check if we were mid-edit
  const saved = dLoad();
  if (saved?.open) { renderForm(root, saved); return; }
  renderList(root);

  function renderList(root) {
    root.innerHTML = `
      <div class="section-header">
        <span class="section-title">Mis Rutinas</span>
        <button class="btn btn-dim btn-icon" id="btn-new" style="width:36px;height:36px">${svg(I.plus, 18)}</button>
      </div>
      <div id="rlist"></div>`;

    root.querySelector('#btn-new').addEventListener('pointerdown', () => {
      dSave({ open: true, name: '', exercises: [], days: [], color: COLORS[0], editId: null });
      Views.routines(root);
    });

    const list = root.querySelector('#rlist');
    if (!routines.length) {
      list.innerHTML = `
        <div class="empty">
          ${svg(I.routines, 48)}
          <div class="empty-title">Sin rutinas todavía</div>
          <div class="empty-sub">Crea rutinas para iniciar entrenamientos rápidamente.</div>
          <button class="btn btn-dim" style="padding:10px 20px;font-size:13px;margin-top:4px" id="btn-new2">Crear Rutina</button>
        </div>`;
      list.querySelector('#btn-new2').addEventListener('pointerdown', () => {
        dSave({ open: true, name: '', exercises: [], days: [], color: COLORS[0], editId: null });
        Views.routines(root);
      });
      return;
    }

    routines.forEach(r => {
      const isToday = r.scheduledDays?.includes(today);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cssText = 'padding:0;overflow:hidden';
      card.innerHTML = `
        <div style="height:3px;background:${r.color||COLORS[0]}"></div>
        <div style="padding:14px">
          <div class="flex-between gap-8" style="margin-bottom:8px">
            <div style="flex:1;min-width:0">
              <div class="flex gap-6" style="align-items:center;margin-bottom:4px">
                <span style="font-weight:500;font-size:15px">${r.name}</span>
                ${isToday ? '<span class="tag tag-green" style="font-size:10px">Hoy</span>' : ''}
              </div>
              ${r.scheduledDays?.length ? `
                <div class="flex gap-6" style="flex-wrap:wrap;margin-bottom:4px">
                  ${r.scheduledDays.map(d => `<span style="font-size:10px;padding:2px 6px;border-radius:5px;font-weight:500;background:${d===today?r.color:'var(--bg3)'};color:${d===today?'#060c10':'var(--text3)'}">${DAYS[d]}</span>`).join('')}
                </div>` : ''}
              <div class="text-xs text-dim truncate">${r.exercises.map(e=>e.exerciseName).filter(Boolean).join(' · ')}</div>
            </div>
            <div class="flex gap-6" style="flex-shrink:0;align-items:flex-start">
              <button class="btn btn-dim btn-icon r-edit" style="width:30px;height:30px">${svg(I.edit, 13)}</button>
              <button class="btn btn-red btn-icon r-del" style="width:30px;height:30px">${svg(I.trash, 13)}</button>
            </div>
          </div>
          <button class="btn w-full r-start" style="padding:11px;font-size:13px;font-weight:500;border-radius:10px;color:#060c10;background:${r.color||COLORS[0]}">
            ${svg(I.play, 14)} Iniciar Entrenamiento
          </button>
        </div>`;

      card.querySelector('.r-edit').addEventListener('pointerdown', e => {
        e.stopPropagation();
        dSave({ open: true, name: r.name, exercises: r.exercises, days: r.scheduledDays||[], color: r.color||COLORS[0], editId: r.id });
        Views.routines(root);
      });
      card.querySelector('.r-del').addEventListener('pointerdown', e => {
        e.stopPropagation();
        showConfirm('¿Eliminar rutina?', 'Esta acción no se puede deshacer.', () => {
          Store.deleteRoutine(r.id); Router.go('routines');
        });
      });
      card.querySelector('.r-start').addEventListener('pointerdown', () => {
        Router.go('logger', { routine: r });
      });
      list.appendChild(card);
    });
  }

  function renderForm(root, draft) {
    const state = { name: draft.name, exercises: draft.exercises, days: draft.days, color: draft.color, editId: draft.editId, error: '' };

    const renderPage = () => {
      root.innerHTML = `
        <div class="flex-between mb-14">
          <span class="section-title">${state.editId ? 'Editar Rutina' : 'Nueva Rutina'}</span>
          <button class="btn btn-dim btn-icon" id="rf-cancel" style="border-radius:50%">${svg(I.x, 18)}</button>
        </div>

        ${state.error ? `<div class="error-bar">${svg(I.alert, 16)} ${state.error}</div>` : ''}

        <div class="field">
          <label class="label">Nombre</label>
          <input id="rf-name" class="input" type="text" placeholder="Ej: Empuje — Pecho, Hombro, Tríceps" value="${state.name}"/>
        </div>

        <div class="field">
          <label class="label">Color</label>
          <div class="color-dots">
            ${COLORS.map(c => `<div class="color-dot ${state.color===c?'on':''}" data-color="${c}" style="background:${c}"></div>`).join('')}
          </div>
        </div>

        <div class="field">
          <label class="label">Días programados</label>
          <div class="days-row">
            ${DAYS.map((d,i) => `<button class="day-pill ${state.days.includes(i)?'on':''}" data-day="${i}" style="${state.days.includes(i)?'background:'+state.color+';color:#060c10':''}">${d}</button>`).join('')}
          </div>
        </div>

        <label class="label">Ejercicios</label>
        <div id="rf-exlist"></div>
        <button class="btn btn-ghost btn-block mb-12" id="rf-add-ex" style="padding:12px;font-size:13px">
          ${svg(I.plus, 14)} Añadir Ejercicio
        </button>
        <button class="btn btn-green btn-block" id="rf-save" style="font-size:15px;font-weight:600;padding:15px">
          ${svg(I.save, 18)} Guardar Rutina
        </button>
        <div style="height:80px"></div>`;

      root.querySelector('#rf-cancel').addEventListener('pointerdown', () => { dClear(); Views.routines(root); });
      root.querySelector('#rf-name').addEventListener('input', e => { state.name = e.target.value; dSave({...state,open:true}); });

      root.querySelectorAll('.color-dot').forEach(el => {
        el.addEventListener('pointerdown', () => {
          state.color = el.dataset.color; dSave({...state,open:true}); renderPage();
        });
      });

      root.querySelectorAll('.day-pill').forEach(el => {
        el.addEventListener('pointerdown', () => {
          const d = parseInt(el.dataset.day);
          if (state.days.includes(d)) state.days = state.days.filter(x => x !== d);
          else state.days = [...state.days, d].sort();
          dSave({...state,open:true}); renderPage();
        });
      });

      root.querySelector('#rf-add-ex').addEventListener('pointerdown', () => {
        state.exercises.push({ id: uid(), exerciseName: '', targetSets: 3, targetReps: 10 });
        dSave({...state,open:true}); renderExList();
      });

      root.querySelector('#rf-save').addEventListener('pointerdown', () => {
        state.error = '';
        if (!state.name.trim()) { state.error = 'Ingresa un nombre para la rutina.'; renderPage(); return; }
        const valid = state.exercises.filter(e => e.exerciseName.trim());
        if (!valid.length) { state.error = 'Agrega al menos un ejercicio.'; renderPage(); return; }
        Store.saveRoutine({ id: state.editId || uid(), name: state.name, exercises: valid, scheduledDays: state.days, color: state.color });
        dClear(); Router.go('routines');
      });

      renderExList();
    };

    const renderExList = () => {
      const el = root.querySelector('#rf-exlist');
      if (!el) return;
      el.innerHTML = '';
      state.exercises.forEach((ex, i) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '8px';
        card.innerHTML = `
          <div class="flex gap-8" style="align-items:center;margin-bottom:10px">
            <span class="text-dim" style="font-size:12px;min-width:16px">${i+1}.</span>
            <input class="input-underline" type="text" value="${ex.exerciseName}" placeholder="Nombre del ejercicio" style="flex:1"/>
            <button class="btn btn-red btn-icon" style="width:28px;height:28px">${svg(I.trash, 13)}</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div><label class="label" style="font-size:9px">Series</label>
              <input class="input input-mono" type="number" inputmode="numeric" min="1" value="${ex.targetSets||3}"/></div>
            <div><label class="label" style="font-size:9px">Reps</label>
              <input class="input input-mono" type="number" inputmode="numeric" min="1" value="${ex.targetReps||10}"/></div>
          </div>`;
        card.querySelectorAll('input')[0].addEventListener('input', e => { ex.exerciseName = e.target.value; dSave({...state,open:true}); });
        card.querySelectorAll('input')[1].addEventListener('input', e => { ex.targetSets = parseInt(e.target.value)||3; dSave({...state,open:true}); });
        card.querySelectorAll('input')[2].addEventListener('input', e => { ex.targetReps = parseInt(e.target.value)||10; dSave({...state,open:true}); });
        card.querySelector('.btn-red').addEventListener('pointerdown', () => {
          state.exercises = state.exercises.filter(x => x.id !== ex.id); dSave({...state,open:true}); renderExList();
        });
        el.appendChild(card);
      });
    };

    renderPage();
  }
};
