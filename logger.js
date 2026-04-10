// ── Goals View ────────────────────────────────────────────────────────────────
Views.goals = (root) => {
  let genning = false;

  const render = () => {
    const { goals, workouts } = Store.state;
    const done = goals.filter(g => g.completed).length;

    root.innerHTML = `
      <div class="section-header">
        <span class="section-title">Objetivos IA</span>
        <span style="font-size:20px">🎯</span>
      </div>

      <div class="ai-card">
        <div class="flex gap-10" style="align-items:center;margin-bottom:12px">
          <div style="background:rgba(167,139,250,.2);padding:8px;border-radius:10px;flex-shrink:0">
            ${svg(I.sparkles, 20)}
          </div>
          <div>
            <div style="font-weight:500;font-size:14px">Análisis con Claude AI</div>
            <div class="text-xs text-dim" style="margin-top:2px">
              ${workouts.length ? 'Genera objetivos SMART basados en tu historial' : 'Registra entrenamientos primero'}
            </div>
          </div>
        </div>
        <button id="btn-gen" class="btn btn-block ${!workouts.length?'btn-dim':'btn-green'}"
          style="font-size:14px;font-weight:500;padding:12px;border-radius:11px;${!workouts.length?'opacity:.5':''}" ${!workouts.length||genning?'disabled':''}>
          ${genning
            ? `<span class="spin">⟳</span>&nbsp; Analizando...`
            : `${svg(I.sparkles, 16)} ${goals.length ? 'Regenerar Objetivos' : 'Generar Objetivos'}`}
        </button>
      </div>

      <div id="goals-error"></div>

      ${goals.length && done > 0 ? `<div style="text-align:center;font-size:11px;color:var(--text3);margin-bottom:10px">${done}/${goals.length} completados</div>` : ''}

      <div id="goals-list">
        ${goals.map(g => `
          <button class="goal-item ${g.completed?'done':''}" data-id="${g.id}">
            <div class="goal-check ${g.completed?'done':''}">${g.completed ? svg(I.check, 12) : ''}</div>
            <span class="goal-text ${g.completed?'done':''}">${g.description}</span>
          </button>`).join('')}

        ${!goals.length && !genning ? `
          <div class="empty" style="padding:40px 20px">
            ${svg(I.target, 44)}
            <div class="empty-title">Sin objetivos todavía</div>
            <div class="empty-sub">${workouts.length ? 'Presiona el botón para que la IA analice tu historial.' : 'Registra al menos un entrenamiento primero.'}</div>
          </div>` : ''}
      </div>`;

    root.querySelector('#btn-gen')?.addEventListener('pointerdown', async () => {
      if (!workouts.length || genning) return;
      genning = true; render();
      try { await generateGoals(); }
      catch (e) {
        const eb = root.querySelector('#goals-error');
        if (eb) eb.innerHTML = `<div class="error-bar">${svg(I.alert,16)} No se pudo conectar con la IA. Verificá tu conexión.</div>`;
      } finally { genning = false; render(); }
    });

    root.querySelectorAll('.goal-item').forEach(btn => {
      btn.addEventListener('pointerdown', () => {
        Store.toggleGoal(btn.dataset.id); render();
      });
    });
  };

  const generateGoals = async () => {
    const prompt = `Eres un entrenador personal experto. Analiza este historial de entrenamientos y propón exactamente 3 objetivos SMART a corto/mediano plazo en español.

Historial: ${JSON.stringify(Store.state.workouts.slice(0,10))}

Responde SOLO con un array JSON válido, sin texto extra ni backticks:
[{"description":"objetivo 1"},{"description":"objetivo 2"},{"description":"objetivo 3"}]`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) throw new Error('API error ' + res.status);
    const data = await res.json();
    const text = (data.content || []).map(c => c.text || '').join('').replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    Store.setGoals(parsed.map(g => ({ id: uid(), description: g.description, completed: false, createdAt: new Date().toISOString() })));
  };

  render();
};
