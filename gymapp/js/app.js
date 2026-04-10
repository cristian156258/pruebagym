// ── App Bootstrap ─────────────────────────────────────────────────────────────
(function () {
  const app = document.getElementById('app');

  // ── Build shell ──────────────────────────────────────────────────────────────
  app.innerHTML = `
    <header>
      <div class="header-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/>
          <path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/>
        </svg>
        <span class="header-title">GymTracker AI</span>
      </div>
      <span class="header-date" id="hdate"></span>
    </header>

    <div id="content"></div>

    <div id="timer-bar"></div>

    <nav id="mainnav">
      <button class="nav-btn" data-tab="dashboard">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        Historial
      </button>
      <button class="nav-btn" data-tab="routines">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><path d="M9 5a2 2 0 002 2h2a2 2 0 002-2"/><path d="M9 5a2 2 0 012-2h2a2 2 0 012 2"/><path d="M9 12l2 2 4-4"/></svg>
        Rutinas
      </button>
      <button class="nav-fab-wrap" data-tab="logger" id="nav-fab-btn">
        <div class="nav-fab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        </div>
        <span class="nav-fab-label">Entrenar</span>
      </button>
      <button class="nav-btn" data-tab="progress">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
        Progreso
      </button>
      <button class="nav-btn" data-tab="goals">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/><path d="M12 14a2 2 0 100-4 2 2 0 000 4z"/></svg>
        Objetivos
      </button>
    </nav>`;

  // Date header
  document.getElementById('hdate').textContent =
    new Date().toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

  // ── Nav click handlers ────────────────────────────────────────────────────────
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('pointerdown', () => Router.go(btn.dataset.tab));
  });
  document.getElementById('nav-fab-btn').addEventListener('pointerdown', () => {
    Router.go('logger', {});
  });

  // ── Keyboard detection ────────────────────────────────────────────────────────
  const vv = window.visualViewport;
  if (vv) {
    const h0 = vv.height;
    vv.addEventListener('resize', () => {
      const kbOpen = (h0 - vv.height) > 150;
      document.getElementById('mainnav').style.display  = kbOpen ? 'none' : '';
      document.getElementById('timer-bar').style.bottom = kbOpen ? '10px'  : '62px';
    });
  }

  // ── Initial route ─────────────────────────────────────────────────────────────
  Router.go('dashboard');
})();
