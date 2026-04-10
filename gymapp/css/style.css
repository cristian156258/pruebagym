/* ── Reset & Base ─────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; }
input, textarea, select { -webkit-user-select: text; user-select: text; }
html, body { height: 100%; overflow: hidden; background: #080c10; color: #e2eaf0; font-family: -apple-system, 'Segoe UI', sans-serif; font-size: 15px; -webkit-font-smoothing: antialiased; }

/* ── CSS Variables ────────────────────────────────────────── */
:root {
  --bg:     #080c10;
  --bg1:    #0d1117;
  --bg2:    #131920;
  --bg3:    #1a2330;
  --border: #1e2c3a;
  --border2:#263544;
  --text:   #e2eaf0;
  --text2:  #7a9ab5;
  --text3:  #3d5568;
  --green:  #00e090;
  --gdim:   rgba(0,224,144,.12);
  --gmid:   rgba(0,224,144,.25);
  --blue:   #3ba0ff;
  --red:    #ff4d5e;
  --amber:  #ffb340;
  --purple: #a78bfa;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

/* ── Layout ───────────────────────────────────────────────── */
#app { height: 100%; display: flex; flex-direction: column; }

header {
  background: var(--bg1);
  border-bottom: 1px solid var(--border);
  padding: 10px 16px;
  padding-top: max(10px, env(safe-area-inset-top));
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: space-between;
  max-width: 100%;
}
.header-logo { display: flex; align-items: center; gap: 10px; }
.header-logo svg { color: var(--green); }
.header-title { font-size: 17px; font-weight: 600; letter-spacing: -.3px; }
.header-date { font-size: 12px; color: var(--text3); }

#content {
  flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain; padding: 0 14px;
}
#content::-webkit-scrollbar { display: none; }

.view { max-width: 480px; margin: 0 auto; padding: 16px 0 90px; animation: fadeUp .2s ease; }

nav {
  background: var(--bg1); border-top: 1px solid var(--border);
  display: flex; flex-shrink: 0;
  padding: 6px 4px;
  padding-bottom: max(8px, var(--safe-bottom));
}
.nav-btn {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
  background: none; border: none; color: var(--text3); font-size: 10px; font-weight: 500;
  padding: 5px 2px; border-radius: 10px; cursor: pointer; touch-action: manipulation;
  transition: color .15s; font-family: inherit;
}
.nav-btn svg { width: 22px; height: 22px; stroke-width: 1.8; }
.nav-btn.active { color: var(--green); }
.nav-fab-wrap {
  flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px;
  cursor: pointer; touch-action: manipulation; background: none; border: none; font-family: inherit;
}
.nav-fab {
  background: var(--green); border-radius: 16px; padding: 10px;
  margin-top: -20px; box-shadow: 0 4px 20px rgba(0,224,144,.35);
  display: flex; align-items: center; justify-content: center;
  transition: transform .1s;
}
.nav-fab:active { transform: scale(.94); }
.nav-fab svg { color: #060c10; width: 24px; height: 24px; stroke-width: 2.5; }
.nav-fab-label { font-size: 10px; font-weight: 500; color: var(--text3); }
.nav-fab-wrap.active .nav-fab-label { color: var(--green); }

/* ── Animations ───────────────────────────────────────────── */
@keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }
@keyframes slideUp { from { transform:translateY(100%) } to { transform:none } }
@keyframes spin { to { transform: rotate(360deg) } }
@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }

/* ── Buttons ──────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 7px;
  border: none; border-radius: 12px; cursor: pointer; font-family: inherit;
  font-weight: 500; font-size: 14px; touch-action: manipulation;
  transition: transform .1s, opacity .15s; white-space: nowrap;
}
.btn:active { transform: scale(.95); opacity: .85; }
.btn-green { background: var(--green); color: #060c10; }
.btn-dim   { background: var(--bg3); color: var(--text2); border: 1px solid var(--border2); }
.btn-red   { background: rgba(255,77,94,.15); color: var(--red); border: 1px solid rgba(255,77,94,.25); }
.btn-ghost { background: transparent; color: var(--text3); border: 1.5px dashed var(--border2); }
.btn-block { width: 100%; padding: 14px; font-size: 15px; border-radius: 14px; }
.btn-sm    { padding: 7px 12px; font-size: 12px; border-radius: 9px; }
.btn-icon  { padding: 7px; border-radius: 9px; width: 32px; height: 32px; }

/* ── Inputs ───────────────────────────────────────────────── */
.input {
  width: 100%; background: var(--bg2); border: 1px solid var(--border2);
  border-radius: 11px; color: var(--text); font-family: inherit; font-size: 15px;
  padding: 11px 14px; outline: none; transition: border-color .15s;
}
.input:focus { border-color: var(--green); }
.input::placeholder { color: var(--text3); }
.input-mono { font-family: 'SF Mono', 'Courier New', monospace; text-align: center; padding: 10px 6px; }
input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
input[type=number] { -moz-appearance: textfield; }

/* ── Cards ────────────────────────────────────────────────── */
.card {
  background: var(--bg1); border: 1px solid var(--border);
  border-radius: 16px; padding: 14px; margin-bottom: 10px;
}
.card-section { background: var(--bg2); border: 1px solid var(--border); border-radius: 13px; padding: 12px; }

/* ── Tags ─────────────────────────────────────────────────── */
.tag { display: inline-flex; align-items: center; font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: 6px; }
.tag-green  { background: var(--gdim); color: var(--green); }
.tag-blue   { background: rgba(59,160,255,.15); color: var(--blue); }
.tag-amber  { background: rgba(255,179,64,.15); color: var(--amber); }
.tag-purple { background: rgba(167,139,250,.15); color: var(--purple); }
.tag-muted  { background: var(--bg3); color: var(--text3); }

/* ── Form helpers ─────────────────────────────────────────── */
.field { margin-bottom: 14px; }
.label { display: block; font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: .5px; margin-bottom: 6px; }
.input-underline {
  width: 100%; background: transparent; border: none; border-bottom: 1px solid var(--border2);
  color: var(--text); font-family: inherit; font-size: 14px; font-weight: 500;
  padding: 4px 2px 6px; outline: none; transition: border-color .15s;
}
.input-underline:focus { border-color: var(--green); }
.input-underline::placeholder { color: var(--text3); }

/* ── Section header ───────────────────────────────────────── */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.section-title  { font-size: 22px; font-weight: 700; letter-spacing: -.4px; }

/* ── Stats grid ───────────────────────────────────────────── */
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 14px; }
.stat-card  { background: var(--bg2); border-radius: 12px; padding: 12px 8px; text-align: center; }
.stat-val   { font-size: 21px; font-weight: 700; line-height: 1; }
.stat-lbl   { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: .5px; margin-top: 4px; }

/* ── Progress bar ─────────────────────────────────────────── */
.prog-wrap  { margin-bottom: 14px; }
.prog-info  { display: flex; justify-content: space-between; font-size: 12px; color: var(--text3); margin-bottom: 5px; }
.prog-track { height: 4px; background: var(--bg3); border-radius: 4px; overflow: hidden; }
.prog-fill  { height: 100%; background: var(--green); border-radius: 4px; transition: width .4s ease; }

/* ── Set row ──────────────────────────────────────────────── */
.sets-header, .set-row {
  display: grid; gap: 6px; align-items: center;
  grid-template-columns: 22px 1fr 1fr 40px 24px;
}
.sets-header { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: .4px; text-align: center; margin-bottom: 4px; padding: 0 2px; }
.set-row     { padding: 3px 2px; border-radius: 9px; transition: background .2s; margin-bottom: 5px; }
.set-row.done { background: var(--gdim); }
.set-num     { font-size: 12px; color: var(--text3); text-align: center; font-family: monospace; }
.set-check   { width: 40px; height: 40px; border-radius: 9px; border: none; cursor: pointer; touch-action: manipulation; display: flex; align-items: center; justify-content: center; transition: all .15s; }
.set-check.checked   { background: var(--green); color: #060c10; }
.set-check.unchecked { background: var(--bg3); color: var(--text3); }
.set-del { background: none; border: none; color: var(--text3); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; touch-action: manipulation; opacity: .5; }
.set-del:active { color: var(--red); opacity: 1; }

/* ── Exercise card ────────────────────────────────────────── */
.ex-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 14px; margin-bottom: 10px; overflow: hidden; }
.ex-card-head { padding: 12px 12px 8px; }
.ex-card-body { padding: 0 12px 12px; }
.ex-name-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.ex-num { font-size: 11px; font-family: monospace; background: var(--gdim); color: var(--green); min-width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-weight: 500; flex-shrink: 0; }
.ex-name-wrap { flex: 1; position: relative; }
.history-panel { background: var(--bg3); border-radius: 10px; padding: 10px; margin-bottom: 10px; }
.history-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: .4px; margin-bottom: 6px; }
.history-sets  { display: flex; gap: 5px; flex-wrap: wrap; }
.history-set   { font-size: 11px; font-family: monospace; background: var(--bg2); color: var(--text2); padding: 3px 7px; border-radius: 6px; border: 1px solid var(--border); }

/* ── Autocomplete ─────────────────────────────────────────── */
.suggest-list {
  position: absolute; left: 0; right: 0; top: calc(100% + 4px); z-index: 50;
  background: var(--bg2); border: 1px solid var(--border2); border-radius: 12px;
  overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,.5);
}
.suggest-item { padding: 11px 14px; font-size: 14px; color: var(--text); cursor: pointer; touch-action: manipulation; }
.suggest-item:active { background: var(--bg3); }

/* ── Overlay / Sheet ──────────────────────────────────────── */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.7); display: flex; align-items: flex-end; justify-content: center; z-index: 200; backdrop-filter: blur(3px); }
.sheet   { background: var(--bg1); border-radius: 20px 20px 0 0; border: 1px solid var(--border2); width: 100%; max-width: 480px; max-height: 80vh; overflow-y: auto; padding: 20px; animation: slideUp .22s ease; padding-bottom: max(20px, var(--safe-bottom)); }
.sheet::-webkit-scrollbar { display: none; }
.sheet-row { display: flex; gap: 10px; margin-top: 18px; }

/* ── Rest Timer ───────────────────────────────────────────── */
#timer-bar { position: fixed; bottom: 62px; left: 0; right: 0; z-index: 100; display: flex; justify-content: center; padding: 0 12px; pointer-events: none; }
.timer-pill { background: var(--bg1); border: 1px solid var(--green); border-radius: 18px; display: flex; align-items: center; gap: 10px; padding: 10px 14px; box-shadow: 0 4px 28px rgba(0,224,144,.25); pointer-events: all; max-width: 420px; width: 100%; }
.timer-time { font-family: monospace; font-size: 20px; font-weight: 700; min-width: 46px; line-height: 1; }
.timer-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: .4px; }
.timer-actions { display: flex; gap: 6px; margin-left: auto; }

/* ── Empty state ──────────────────────────────────────────── */
.empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 60px 20px; gap: 10px; }
.empty svg { color: var(--text3); opacity: .3; width: 52px; height: 52px; }
.empty-title { font-size: 17px; font-weight: 600; color: var(--text2); }
.empty-sub   { font-size: 13px; color: var(--text3); max-width: 220px; line-height: 1.5; }

/* ── Chart ────────────────────────────────────────────────── */
.chart-wrap { position: relative; width: 100%; }
canvas.chart { width: 100% !important; display: block; }

/* ── Routine day pills ────────────────────────────────────── */
.days-row { display: flex; gap: 5px; }
.day-pill { flex: 1; padding: 8px 2px; border-radius: 8px; font-size: 11px; font-weight: 500; text-align: center; border: none; cursor: pointer; touch-action: manipulation; background: var(--bg3); color: var(--text3); transition: all .15s; font-family: inherit; }
.day-pill.on { color: #060c10; }

/* ── Routine color dots ───────────────────────────────────── */
.color-dots { display: flex; gap: 8px; }
.color-dot  { width: 28px; height: 28px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; touch-action: manipulation; transition: transform .15s; }
.color-dot.on { border-color: white; transform: scale(1.2); }

/* ── Error banner ─────────────────────────────────────────── */
.error-bar { background: rgba(255,77,94,.12); border: 1px solid rgba(255,77,94,.3); border-radius: 10px; padding: 10px 12px; font-size: 13px; color: var(--red); display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }

/* ── Goal item ────────────────────────────────────────────── */
.goal-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px; background: var(--bg1); border: 1px solid var(--border); border-radius: 14px; cursor: pointer; margin-bottom: 8px; touch-action: manipulation; width: 100%; text-align: left; font-family: inherit; transition: border-color .2s, background .2s; }
.goal-item.done { background: var(--gdim); border-color: var(--gmid); }
.goal-check { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--border2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; transition: all .2s; }
.goal-check.done { background: var(--green); border-color: var(--green); }
.goal-text { font-size: 13px; line-height: 1.55; color: var(--text); transition: all .2s; }
.goal-text.done { color: var(--text3); text-decoration: line-through; }

/* ── AI card ──────────────────────────────────────────────── */
.ai-card { background: linear-gradient(135deg, rgba(167,139,250,.1), rgba(0,224,144,.08)); border: 1px solid rgba(167,139,250,.25); border-radius: 16px; padding: 16px; margin-bottom: 16px; }

/* ── PR list ──────────────────────────────────────────────── */
.pr-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); }
.pr-row:last-child { border-bottom: none; }
.pr-name { font-size: 13px; color: var(--text2); flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 10px; }
.pr-val  { font-family: monospace; font-size: 14px; font-weight: 600; color: var(--green); flex-shrink: 0; }

/* ── Utility ──────────────────────────────────────────────── */
.flex { display: flex; }
.flex-center { display: flex; align-items: center; }
.flex-between { display: flex; align-items: center; justify-content: space-between; }
.gap-6 { gap: 6px; }
.gap-8 { gap: 8px; }
.gap-10 { gap: 10px; }
.mt-8  { margin-top: 8px; }
.mt-12 { margin-top: 12px; }
.mb-12 { margin-bottom: 12px; }
.mb-14 { margin-bottom: 14px; }
.text-muted { color: var(--text2); }
.text-dim   { color: var(--text3); }
.text-green { color: var(--green); }
.text-sm    { font-size: 13px; }
.text-xs    { font-size: 11px; }
.font-bold  { font-weight: 700; }
.w-full     { width: 100%; }
.truncate   { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spin { animation: spin .8s linear infinite; display: inline-block; }
