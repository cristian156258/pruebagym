// ── Router: manages which view is shown ───────────────────────────────────────
const Router = (() => {
  let current = null;
  let routerCtx = {}; // extra context (e.g. which workout to edit)

  const go = (tab, ctx = {}) => {
    current = tab;
    routerCtx = ctx;
    render();
    // Update nav active state
    document.querySelectorAll('.nav-btn, .nav-fab-wrap').forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tab);
    });
  };

  const render = () => {
    const content = document.getElementById('content');
    if (!content) return;
    const div = document.createElement('div');
    div.className = 'view';

    switch (current) {
      case 'dashboard': Views.dashboard(div); break;
      case 'routines':  Views.routines(div);  break;
      case 'logger':    Views.logger(div, routerCtx); break;
      case 'progress':  Views.progress(div);  break;
      case 'goals':     Views.goals(div);     break;
    }

    content.innerHTML = '';
    content.appendChild(div);
    content.scrollTop = 0;
  };

  // Expose for keyboard detection to re-render (content only)
  const rerender = render;

  return { go, current: () => current, ctx: () => routerCtx, rerender };
})();
