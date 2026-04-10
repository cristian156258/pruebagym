// ── Store: data persistence & state ───────────────────────────────────────────
const Store = (() => {
  const load = (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } };
  const save = (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  const state = {
    workouts: load('workouts', []),
    goals:    load('goals', []),
    routines: load('routines', []),
    activeTab: 'dashboard',
  };

  const listeners = {};

  const on = (ev, fn) => { (listeners[ev] ??= []).push(fn); };
  const emit = (ev, data) => { (listeners[ev] || []).forEach(fn => fn(data)); };

  const persist = () => {
    save('workouts', state.workouts);
    save('goals',    state.goals);
    save('routines', state.routines);
  };

  // ── Workouts ──
  const saveWorkout = (w) => {
    const idx = state.workouts.findIndex(x => x.id === w.id);
    if (idx >= 0) state.workouts[idx] = w;
    else state.workouts.unshift(w);
    persist();
    emit('workouts');
  };
  const deleteWorkout = (id) => {
    state.workouts = state.workouts.filter(w => w.id !== id);
    persist(); emit('workouts');
  };

  // ── Routines ──
  const saveRoutine = (r) => {
    const idx = state.routines.findIndex(x => x.id === r.id);
    if (idx >= 0) state.routines[idx] = r;
    else state.routines.push(r);
    persist(); emit('routines');
  };
  const deleteRoutine = (id) => {
    state.routines = state.routines.filter(r => r.id !== id);
    persist(); emit('routines');
  };

  // ── Goals ──
  const setGoals = (goals) => { state.goals = goals; persist(); emit('goals'); };
  const toggleGoal = (id) => {
    state.goals = state.goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
    persist(); emit('goals');
  };

  return { state, on, emit, saveWorkout, deleteWorkout, saveRoutine, deleteRoutine, setGoals, toggleGoal };
})();

// ── Helpers ────────────────────────────────────────────────────────────────────
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);

const fmtDate = (iso, opts = { weekday:'short', day:'numeric', month:'short' }) =>
  new Date(iso).toLocaleDateString('es-ES', opts);

const EXERCISES = [
  'Press de banca','Press inclinado','Press declinado','Aperturas con mancuernas','Fondos en paralelas',
  'Sentadilla','Sentadilla goblet','Sentadilla hack','Prensa de piernas','Extensiones de cuádriceps',
  'Curl femoral','Peso muerto rumano','Peso muerto','Peso muerto sumo','Remo con barra','Dominadas',
  'Jalones al pecho','Remo en máquina','Remo con mancuerna','Facepull','Press militar','Press Arnold',
  'Elevaciones laterales','Elevaciones frontales','Pájaros','Curl bíceps con barra',
  'Curl con mancuernas','Curl martillo','Curl predicador','Extensiones de tríceps',
  'Press francés','Patada de tríceps','Dips para tríceps','Hip thrust','Abducción de cadera',
  'Elevación de talones de pie','Elevación de talones sentado','Plancha','Crunch','Crunch inverso',
  'Elevación de piernas','Russian twist','Rueda abdominal'
];

const DAYS   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const COLORS = ['#00e090','#3ba0ff','#a78bfa','#ffb340','#ff6b6b','#06d6a0','#f72585'];

// ── SVG icon helper ────────────────────────────────────────────────────────────
const svg = (paths, size = 22) => {
  const p = Array.isArray(paths) ? paths : [paths];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p.map(d=>`<path d="${d}"/>`).join('')}</svg>`;
};

const I = {
  history:   'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  routines:  ['M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2','M9 5a2 2 0 002 2h2a2 2 0 002-2','M9 5a2 2 0 012-2h2a2 2 0 012 2','M9 12l2 2 4-4'],
  plus:      'M12 5v14M5 12h14',
  chart:     ['M18 20V10','M12 20V4','M6 20v-6'],
  target:    ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 18a6 6 0 100-12 6 6 0 000 12z','M12 14a2 2 0 100-4 2 2 0 000 4z'],
  dumbbell:  ['M6.5 6.5h11','M6.5 17.5h11','M3 9.5h3v5H3z','M18 9.5h3v5h-3z'],
  check:     'M20 6L9 17l-5-5',
  x:         'M18 6L6 18M6 6l12 12',
  trash:     ['M3 6h18','M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2'],
  edit:      ['M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7','M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z'],
  play:      'M5 3l14 9-14 9V3z',
  save:      ['M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  timer:     ['M10 2h4','M12 14l3-3','M12 22a8 8 0 100-16 8 8 0 000 16z'],
  alert:     ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z','M12 9v4','M12 17h.01'],
  minus:     'M5 12h14',
  sparkles:  ['M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z','M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z','M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z'],
  histBack:  ['M3 3v5h5','M3.05 13A9 9 0 106 5.3L3 8'],
  trendUp:   'M23 6l-9.5 9.5-5-5L1 18',
  calendar:  ['M3 4a1 1 0 00-1 1v16a1 1 0 001 1h18a1 1 0 001-1V5a1 1 0 00-1-1H3z','M16 2v4M8 2v4M3 10h18'],
  flame:     'M12 2s-5 4.5-5 9a5 5 0 0010 0c0-4.5-5-9-5-9z',
  trophy:    ['M6 9H3v3a3 3 0 006 0V9','M18 9h3v3a3 3 0 01-6 0V9','M9 9h6v4a3 3 0 01-6 0V9','M12 19v3','M9 22h6','M6 4h12v5H6z'],
};
