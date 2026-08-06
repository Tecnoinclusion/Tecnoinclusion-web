/* ================= DATOS ================= */
const categories = [
  {
    id:'hardware', name:'Hardware', icon:'🖥️', video:'rlMReK7rfTo', duration:'4:20',
    theory:'El hardware son todas las partes del computador que puedes tocar: la pantalla, el teclado, el mouse, la torre. Cada pieza cumple una función distinta, como los órganos de un cuerpo. Sin hardware, el computador no podría encender ni mostrarte nada en la pantalla.',
    game:{ type:'wordsearch', instructions:'Haz clic en las letras en orden para formar la palabra. ¡Cuidado con las bombas 💣, te hacen empezar de nuevo!', word:'TECLADO', bombCount:6 },
    quiz:[
      {q:'¿Cuál parte usamos para escribir?', opts:['Mouse','Teclado','Parlante','Impresora'], correct:1},
      {q:'¿Qué parte muestra la imagen del computador?', opts:['Monitor','Teclado','Mouse','Cable'], correct:0},
      {q:'¿Para qué sirve el mouse?', opts:['Escuchar música','Imprimir','Señalar y hacer clic','Escribir textos'], correct:2},
      {q:'¿Qué parte usamos para imprimir en papel?', opts:['Impresora','Monitor','Teclado','Mouse'], correct:0}
    ]
  },
  {
    id:'software', name:'Software', icon:'📀', video:'rM4__kTYwfw', duration:'3:10',
    theory:'El software son los programas que no puedes tocar, pero sí ves y usas en la pantalla: juegos, navegadores, programas para escribir o dibujar. El software le dice al hardware qué hacer, como si fuera el cerebro que da las órdenes al cuerpo.',
    game:{ type:'dragline', instructions:'Arrastra una línea desde cada programa hasta lo que hace.',
      pairs:[
        {a:'📝 Procesador de texto', b:'Sirve para escribir documentos'},
        {a:'🎨 Programa de dibujo', b:'Sirve para dibujar y pintar'},
        {a:'🌐 Navegador', b:'Sirve para entrar a páginas web'},
        {a:'🎵 Reproductor', b:'Sirve para escuchar música'}
      ]},
    quiz:[
      {q:'¿Qué programa usamos para escribir un cuento?', opts:['Reproductor de música','Procesador de texto','Navegador','Calculadora'], correct:1},
      {q:'¿Qué programa usamos para entrar a una página web?', opts:['Navegador','Programa de dibujo','Reproductor','Editor de fotos'], correct:0},
      {q:'El software es...', opts:['Una pieza que se toca','Un programa que se instala','Un cable','Una pantalla'], correct:1},
      {q:'¿Qué programa usamos para pintar en el computador?', opts:['Navegador','Reproductor','Programa de dibujo','Procesador de texto'], correct:2}
    ]
  },
  {
    id:'redes', name:'Redes', icon:'🌐', video:'td-vUgRofWE', duration:'4:12',
    theory:'Una red conecta varios computadores para que puedan compartir información entre sí. Internet es la red más grande del mundo: conecta millones de computadores en todos los países. Gracias a las redes puedes video llamar, mandar mensajes o ver videos al instante.',
    game:{ type:'wordsearch', instructions:'Forma la palabra en orden. ¡Cuidado con las bombas 💣!', word:'INTERNET', bombCount:6 },
    quiz:[
      {q:'¿Qué es una red?', opts:['Un juego','Computadores conectados entre sí','Un programa de dibujo','Una impresora'], correct:1},
      {q:'¿Qué necesitas para navegar en internet?', opts:['Conexión a la red','Solo un teclado','Solo un mouse','Nada'], correct:0},
      {q:'Cuando envías un mensaje, primero se convierte en...', opts:['Un dibujo','Datos','Un sonido','Un video'], correct:1},
      {q:'Internet permite que los computadores...', opts:['Se apaguen solos','Se comuniquen entre sí','No funcionen','Se rompan'], correct:1}
    ]
  },
  {
    id:'programacion', name:'Programación', icon:'🧑‍💻', video:'KKJIQYpR8GY', duration:'5:20',
    theory:'Programar es dar instrucciones, paso a paso y en orden, para que el computador o un robot haga algo. A ese conjunto ordenado de instrucciones se le llama algoritmo. Si el orden está mal, el resultado también sale mal, por eso hay que pensar bien cada paso.',
    game:{ type:'catch', ordered:true, instructions:'Atrapa las instrucciones en el orden correcto antes de que caigan, para que el robot llegue a la meta.',
      steps:['Encender el robot','Avanzar tres pasos','Girar a la derecha','Avanzar dos pasos más']},
    quiz:[
      {q:'Programar es...', opts:['Dar instrucciones paso a paso','Ver televisión','Dormir','Cocinar'], correct:0},
      {q:'¿Qué debe hacer el robot primero?', opts:['Girar','Encenderse','Apagarse','Saltar'], correct:1},
      {q:'Un conjunto de instrucciones en orden se llama...', opts:['Un algoritmo','Un color','Un mouse','Un cable'], correct:0},
      {q:'Si el orden de las instrucciones está mal, el robot...', opts:['Hace lo correcto igual','Puede perderse o fallar','Se apaga solo','Vuela'], correct:1}
    ]
  },
  {
    id:'mantenimiento', name:'Mantenimiento', icon:'🛠️', video:'y5jbjAmW8Ck', duration:'3:00',
    theory:'Mantenimiento es cuidar el computador para que dure más tiempo y funcione bien. Se hace limpiando el polvo, cerrando programas que no se usan y revisando que todo esté bien conectado. Un computador bien cuidado casi no se daña.',
    game:{ type:'catch', ordered:false, instructions:'Atrapa la mejor solución para cada problema antes de que se caiga.',
      cases:[
        {problem:'El computador está muy lento', options:['Cerrar programas que no uses','Tirarlo a la basura','Gritarle'], correct:0},
        {problem:'El teclado está muy sucio', options:['Ignorarlo','Limpiarlo con cuidado','Mojarlo con agua'], correct:1},
        {problem:'La pantalla está negra', options:['Revisar que esté encendida y conectada','Golpearla','Desconectar todo para siempre'], correct:0}
      ]},
    quiz:[
      {q:'Si el computador está lento, primero debemos...', opts:['Cerrar programas sin usar','Romperlo','Dejarlo prendido para siempre','Gritarle'], correct:0},
      {q:'¿Cómo debemos tratar el computador?', opts:['Con cuidado','Golpeándolo','Mojándolo','Rayándolo'], correct:0},
      {q:'Si la pantalla no enciende, primero revisamos...', opts:['Si está conectada','Si tiene stickers','El color del mouse','El volumen'], correct:0},
      {q:'Limpiar el teclado ayuda a...', opts:['Dañarlo','Mantenerlo en buen estado','Que se apague solo','Nada'], correct:1}
    ]
  }
];

/* ================= ESTADO (en memoria) ================= */
const progress = {};
categories.forEach(c => progress[c.id] = { game:false, quiz:false, score:0 });

let currentActTab = categories[0].id;
let currentVidTab = categories[0].id;
let currentEvalTab = categories[0].id;
let totalStars = 0;

function addStar(n){ totalStars += n; }

function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES';
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

function giveHint(cat){
  if(cat.game.type === 'wordsearch'){
    const word = cat.game.word;
    const progressText = (document.getElementById('wsProgress').textContent || '').replace(/\s/g,'');
    let pointer = progressText.indexOf('_');
    if(pointer === -1) pointer = word.length;
    if(pointer >= word.length) return;
    const neededLetter = word[pointer];
    const tiles = document.querySelectorAll('#wsGrid .ws-tile:not(.bomb):not(.used)');
    const target = [...tiles].find(t => t.textContent === neededLetter);
    if(target){ target.classList.add('hint'); setTimeout(()=> target.classList.remove('hint'), 1600); }
  } else if(cat.game.type === 'dragline'){
    const leftBtn = [...document.querySelectorAll('#dlLeftCol .match-item')].find(b => !b.classList.contains('correct'));
    if(!leftBtn) return;
    const rightBtn = document.querySelector(`#dlRightCol .match-item[data-idx="${leftBtn.dataset.idx}"]`);
    leftBtn.classList.add('hint'); if(rightBtn) rightBtn.classList.add('hint');
    setTimeout(()=>{ leftBtn.classList.remove('hint'); if(rightBtn) rightBtn.classList.remove('hint'); }, 1600);
  } else if(cat.game.type === 'catch'){
    const correctChip = document.querySelector('.catch-item[data-ok="true"]');
    if(correctChip){ correctChip.classList.add('hint'); setTimeout(()=> correctChip.classList.remove('hint'), 1600); }
  }
}

function attachCommonControls(cat){
  const btnListen = document.getElementById('btnListen');
  const btnHint = document.getElementById('btnHint');
  const btnReset = document.getElementById('btnReset');
  if(btnListen) btnListen.onclick = ()=> speak(cat.game.instructions);
  if(btnHint) btnHint.onclick = ()=> giveHint(cat);
  if(btnReset) btnReset.onclick = ()=> renderActPanel();
}

/* ---- Sonido tipo videojuego (sin archivos de audio) ---- */
function playTone(freq, duration, type, delay){
  type = type || 'sine'; delay = delay || 0;
  try{
    if(!window._audioCtx) window._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = window._audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration + 0.02);
  }catch(e){}
}
function playCorrect(){ playTone(660,.12); playTone(880,.15,'sine',.08); }
function playWrong(){ playTone(180,.25,'sawtooth'); }
function playFanfare(){ [523,659,784,1047].forEach((f,i)=> playTone(f,.22,'triangle', i*0.12)); }

/* ---- Confeti al ganar ---- */
function confettiBurst(){
  const colors = ['#FF8358','#FFC94A','#7C6FE0','#3FAE73','#FF7BAC','#1F6E72'];
  for(let i=0;i<22;i++){
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = (Math.random()*100) + 'vw';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.animationDuration = (2 + Math.random()*1.5) + 's';
    document.body.appendChild(piece);
    setTimeout(()=> piece.remove(), 3800);
  }
}

/* ================= UTIL ================= */
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function catById(id){ return categories.find(c=>c.id===id); }
function randLetter(){ const L='BFJKMQRSVXYZ'; return L[Math.floor(Math.random()*L.length)]; }

/* ================= TABS ================= */
function renderTabs(containerId, activeId, onClick){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = '';
  categories.forEach(c=>{
    const btn = document.createElement('button');
    btn.className = 'tabbtn' + (c.id===activeId ? ' active':'');
    btn.innerHTML = `${c.icon} ${c.name}`;
    btn.setAttribute('aria-pressed', c.id===activeId);
    btn.onclick = ()=> onClick(c.id);
    el.appendChild(btn);
  });
}

/* ================= ACTIVIDADES: router ================= */
function renderActTabs(){ renderTabs('actTabs', currentActTab, id=>{ currentActTab=id; renderActTabs(); renderActPanel(); }); }

function renderActPanel(){
  const panel = document.getElementById('actPanel');
  if(!panel) return;
  const cat = catById(currentActTab);
  const done = progress[cat.id].game;
  let html = `<div class="stars-badge">⭐ ${totalStars} estrellas</div>
    <h3>${cat.icon} ${cat.name} ${done ? '✅' : ''}</h3>
    <div class="theory"><span class="think">💡</span><div><h4>Un poco de teoría</h4><p>${cat.theory}</p></div></div>
    <div class="game-controls">
      <button class="ctrlbtn" id="btnListen" type="button">🔊 Escuchar instrucciones</button>
      <button class="ctrlbtn" id="btnHint" type="button">💡 Pista</button>
      <button class="ctrlbtn" id="btnReset" type="button">🔄 Reiniciar nivel</button>
    </div>
    <p class="sub">${cat.game.instructions}</p>`;

  if(cat.game.type === 'wordsearch'){
    html += `<div class="ws-progress" id="wsProgress"></div>
      <div class="ws-grid" id="wsGrid"></div>
      <div class="feedback" id="actFeedback" role="status" aria-live="polite"></div>`;
    panel.innerHTML = html;
    setupWordSearch(cat);
  } else if(cat.game.type === 'dragline'){
    const left = cat.game.pairs.map((p,i)=>({...p, idx:i}));
    const right = shuffle(cat.game.pairs.map((p,i)=>({...p, idx:i})));
    html += `<div class="dragline-wrap" id="dlWrap">
      <svg id="dlSvg"></svg>
      <div class="match-grid">
        <div class="match-col" id="dlLeftCol"><h4>Programa</h4>${left.map(p=>`<button class="match-item" data-side="a" data-idx="${p.idx}">${p.a}</button>`).join('')}</div>
        <div class="match-col" id="dlRightCol"><h4>Función</h4>${right.map(p=>`<button class="match-item" data-side="b" data-idx="${p.idx}">${p.b}</button>`).join('')}</div>
      </div>
    </div>
    <div class="feedback" id="actFeedback" role="status" aria-live="polite"></div>`;
    panel.innerHTML = html;
    setupDragLine(cat);
  } else if(cat.game.type === 'catch'){
    html += `<div class="catch-target" id="catchTarget"></div>
      <div class="catch-arena" id="catchArena"></div>
      <div class="feedback" id="actFeedback" role="status" aria-live="polite"></div>`;
    panel.innerHTML = html;
    setupCatch(cat);
  }
  attachCommonControls(cat);
}

function markGameComplete(cat){
  progress[cat.id].game = true;
  renderActTabs();
  updateEvalDashboard();
}

/* ================= JUEGO 1: SOPA DE LETRAS ================= */
function setupWordSearch(cat){
  const word = cat.game.word;
  const grid = document.getElementById('wsGrid');
  const progressEl = document.getElementById('wsProgress');
  const feedback = document.getElementById('actFeedback');
  let pointer = 0;

  function renderProgress(){
    progressEl.textContent = word.split('').map((l,i)=> i < pointer ? l : '_').join(' ');
  }
  renderProgress();

  let tiles = word.split('').map(l => ({letter:l, bomb:false, used:false}));
  for(let i=0;i<(cat.game.bombCount||6);i++) tiles.push({letter:'💣', bomb:true, used:false});
  tiles = shuffle(tiles);

  function draw(){
    grid.innerHTML = '';
    tiles.forEach((t, i)=>{
      const btn = document.createElement('button');
      btn.className = 'ws-tile' + (t.bomb ? ' bomb':'') + (t.used ? ' used':'');
      btn.textContent = t.bomb ? '💣' : t.letter;
      btn.disabled = t.used;
      btn.onclick = ()=> handleClick(i);
      grid.appendChild(btn);
    });
  }
  draw();

  function handleClick(i){
    const t = tiles[i];
    if(t.used) return;
    const btnEl = grid.children[i];
    if(t.bomb){
      if(btnEl) btnEl.classList.add('bombhit');
      playWrong();
      feedback.textContent = '💥 ¡Bomba! Empiezas de nuevo con esta palabra.';
      setTimeout(()=>{
        pointer = 0;
        tiles.forEach(tile => tile.used = false);
        renderProgress();
        draw();
      }, 350);
      return;
    }
    if(t.letter === word[pointer]){
      if(btnEl) btnEl.classList.add('pop');
      playCorrect();
      setTimeout(()=>{
        t.used = true;
        pointer++;
        addStar(1);
        feedback.textContent = '✅ ¡Bien! +1 estrella';
        renderProgress();
        draw();
        if(pointer === word.length){
          addStar(3);
          playFanfare();
          confettiBurst();
          feedback.textContent = '🏆 ¡Formaste la palabra completa! +3 estrellas';
          markGameComplete(cat);
        }
      }, 220);
    } else {
      if(btnEl) btnEl.classList.add('bombhit');
      playWrong();
      feedback.textContent = '💡 Esa no es la letra que sigue, intenta otra.';
      setTimeout(()=> btnEl && btnEl.classList.remove('bombhit'), 400);
    }
  }
}

/* ================= JUEGO 2: ARRASTRAR LÍNEAS ================= */
function setupDragLine(cat){
  const wrap = document.getElementById('dlWrap');
  const svg = document.getElementById('dlSvg');
  const feedback = document.getElementById('actFeedback');
  const leftItems = wrap.querySelectorAll('#dlLeftCol .match-item');
  const rightItems = wrap.querySelectorAll('#dlRightCol .match-item');
  let dragging = null, tempLine = null, matchedCount = 0;

  function pointFor(el, side){
    const r = el.getBoundingClientRect();
    const cr = wrap.getBoundingClientRect();
    const x = side === 'right' ? (r.right - cr.left) : (r.left - cr.left);
    const y = (r.top - cr.top) + r.height/2;
    return {x, y};
  }

  leftItems.forEach(btn=>{
    btn.addEventListener('pointerdown', (e)=>{
      if(btn.classList.contains('correct')) return;
      dragging = btn;
      const p0 = pointFor(btn, 'right');
      tempLine = document.createElementNS('http://www.w3.org/2000/svg','line');
      tempLine.setAttribute('x1', p0.x); tempLine.setAttribute('y1', p0.y);
      tempLine.setAttribute('x2', p0.x); tempLine.setAttribute('y2', p0.y);
      tempLine.setAttribute('stroke', '#7C6FE0'); tempLine.setAttribute('stroke-width', '3');
      svg.appendChild(tempLine);
      e.preventDefault();
    });
  });

  document.addEventListener('pointermove', (e)=>{
    if(!dragging || !tempLine) return;
    const cr = wrap.getBoundingClientRect();
    tempLine.setAttribute('x2', e.clientX - cr.left);
    tempLine.setAttribute('y2', e.clientY - cr.top);
  });

  document.addEventListener('pointerup', (e)=>{
    if(!dragging) return;
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const rightBtn = el ? el.closest('.match-item[data-side="b"]') : null;
    if(rightBtn && rightBtn.dataset.idx === dragging.dataset.idx && !rightBtn.classList.contains('correct')){
      const p0 = pointFor(dragging, 'right');
      const p1 = pointFor(rightBtn, 'left');
      tempLine.setAttribute('x1', p0.x); tempLine.setAttribute('y1', p0.y);
      tempLine.setAttribute('x2', p1.x); tempLine.setAttribute('y2', p1.y);
      tempLine.setAttribute('stroke', '#3FAE73'); tempLine.setAttribute('stroke-width', '4');
      dragging.classList.add('correct');
      rightBtn.classList.add('correct');
      matchedCount++;
      addStar(1);
      playCorrect();
      feedback.textContent = '🎉 ¡Correcto! +1 estrella';
      if(matchedCount === leftItems.length){
        addStar(3);
        playFanfare();
        confettiBurst();
        feedback.textContent = '🏆 ¡Uniste todas las líneas! +3 estrellas';
        markGameComplete(cat);
      }
    } else {
      if(tempLine && tempLine.parentNode) svg.removeChild(tempLine);
      dragging.classList.add('wrong');
      playWrong();
      feedback.textContent = '💡 Esa línea no es correcta, intenta de nuevo.';
      setTimeout(()=> dragging && dragging.classList.remove('wrong'), 500);
    }
    dragging = null; tempLine = null;
  });
}

/* ================= JUEGO 3: ATRAPAR ================= */
function setupCatch(cat){
  const arena = document.getElementById('catchArena');
  const targetEl = document.getElementById('catchTarget');
  const feedback = document.getElementById('actFeedback');

  if(cat.game.ordered){
    let stepIndex = 0;
    const steps = cat.game.steps;

    function nextRound(){
      arena.innerHTML = '';
      if(stepIndex >= steps.length){
        addStar(3);
        playFanfare();
        confettiBurst();
        targetEl.textContent = '🏆 ¡Todas las instrucciones en orden! +3 estrellas';
        markGameComplete(cat);
        return;
      }
      targetEl.textContent = `Paso ${stepIndex+1}: atrapa la instrucción correcta`;
      const correctText = steps[stepIndex];
      const decoyPool = steps.filter((s,i)=> i !== stepIndex);
      const decoys = shuffle(decoyPool).slice(0,2);
      const batch = shuffle([{text:correctText, ok:true}, ...decoys.map(d=>({text:d, ok:false}))]);
      spawnBatch(batch);
    }

    function spawnOne(item, slotIndex, positions){
      const chip = document.createElement('div');
      chip.className = 'catch-item';
      chip.textContent = item.text;
      chip.dataset.ok = item.ok ? 'true' : 'false';
      chip.style.left = positions[slotIndex] + '%';
      chip.onclick = ()=>{
        if(chip.dataset.caught === 'true') return;
        if(item.ok){
          chip.dataset.caught = 'true';
          addStar(1);
          playCorrect();
          chip.classList.add('caught');
          feedback.textContent = '✅ ¡Correcto! +1 estrella';
          stepIndex++;
          setTimeout(nextRound, 260);
        } else {
          chip.classList.add('wrong');
          playWrong();
          feedback.textContent = '💡 Ese no es el paso que sigue.';
        }
      };
      chip.addEventListener('animationend', ()=>{
        // Si nadie la atrapó a tiempo, solo esa ficha se repone (no borra las demás)
        if(chip.isConnected && chip.dataset.caught !== 'true'){
          chip.remove();
          spawnOne(item, slotIndex, positions);
        }
      });
      arena.appendChild(chip);
    }

    function spawnBatch(batch){
      arena.querySelectorAll('.catch-item').forEach(n=>n.remove());
      const positions = [8, 40, 68];
      batch.forEach((item, i)=> spawnOne(item, i, positions));
    }
    nextRound();

  } else {
    let caseIndex = 0;
    const cases = cat.game.cases;

    function nextCase(){
      arena.innerHTML = '';
      if(caseIndex >= cases.length){
        addStar(3);
        playFanfare();
        confettiBurst();
        targetEl.textContent = '🏆 ¡Resolviste todos los casos! +3 estrellas';
        markGameComplete(cat);
        return;
      }
      const c = cases[caseIndex];
      targetEl.textContent = `🔧 ${c.problem}`;
      const batch = shuffle(c.options.map((o,i)=> ({text:o, ok: i===c.correct})));
      spawnBatch(batch);
    }

    function spawnOne(item, slotIndex, positions){
      const chip = document.createElement('div');
      chip.className = 'catch-item';
      chip.textContent = item.text;
      chip.dataset.ok = item.ok ? 'true' : 'false';
      chip.style.left = positions[slotIndex % positions.length] + '%';
      chip.onclick = ()=>{
        if(chip.dataset.caught === 'true') return;
        if(item.ok){
          chip.dataset.caught = 'true';
          addStar(1);
          playCorrect();
          chip.classList.add('caught');
          feedback.textContent = '🎉 ¡Buena solución! +1 estrella';
          caseIndex++;
          setTimeout(nextCase, 260);
        } else {
          chip.classList.add('wrong');
          playWrong();
          feedback.textContent = '💡 Intenta con otra opción.';
        }
      };
      chip.addEventListener('animationend', ()=>{
        if(chip.isConnected && chip.dataset.caught !== 'true'){
          chip.remove();
          spawnOne(item, slotIndex, positions);
        }
      });
      arena.appendChild(chip);
    }

    function spawnBatch(batch){
      arena.querySelectorAll('.catch-item').forEach(n=>n.remove());
      const positions = [8, 38, 66];
      batch.forEach((item, i)=> spawnOne(item, i, positions));
    }
    nextCase();
  }
}

/* ================= VIDEOS ================= */
function renderVidTabs(){ renderTabs('vidTabs', currentVidTab, id=>{ currentVidTab=id; renderVidTabs(); renderVidPanel(); }); }

function renderVidPanel(){
  const panel = document.getElementById('vidPanel');
  if(!panel) return;
  const cat = catById(currentVidTab);
  panel.innerHTML = `
    <h3>${cat.icon} ${cat.name}</h3>
    <div class="theory"><span class="think">🎬</span><div><h4>¿Qué vas a aprender?</h4><p>${cat.theory}</p></div></div>
    <div class="a11y-row"><span class="a11y">⏱️ ${cat.duration}</span><span class="a11y">CC Subtítulos disponibles en YouTube</span></div>
    <div class="video-frame-wrap">
      <iframe src="https://www.youtube.com/embed/${cat.video}" title="Video sobre ${cat.name}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
    </div>
    <a class="video-open" href="https://www.youtube.com/watch?v=${cat.video}" target="_blank" rel="noopener">▶️ Ver en YouTube si no carga aquí</a>
    <p class="sub" style="margin-top:10px;">Consejo: activa los subtítulos (CC) desde el reproductor de YouTube si los necesitas.</p>`;
}

/* ================= EVALUACIONES ================= */
function renderEvalTabs(){ renderTabs('evalTabs', currentEvalTab, id=>{ currentEvalTab=id; renderEvalTabs(); renderEvalPanel(); }); }

function renderEvalPanel(){
  const panel = document.getElementById('evalPanel');
  if(!panel) return;
  const cat = catById(currentEvalTab);
  let html = `<h3>${cat.icon} ${cat.name}</h3><p class="sub">Responde las ${cat.quiz.length} preguntas para ganar tu insignia 🏅</p>`;
  cat.quiz.forEach((q, qi)=>{
    html += `<div class="quiz-q">${qi+1}. ${q.q}</div>
      <div class="quiz-opts" data-qidx="${qi}">
        ${q.opts.map((o,oi)=>`<button class="quiz-opt" data-q="${qi}" data-o="${oi}">${o}</button>`).join('')}
      </div>`;
  });
  html += `<div class="feedback" id="evalFeedback" role="status" aria-live="polite"></div>`;
  panel.innerHTML = html;
  setupQuiz(cat);
}

function setupQuiz(cat){
  const feedback = document.getElementById('evalFeedback');
  let answered = 0, correctCount = 0;
  document.querySelectorAll('#evalPanel .quiz-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const qi = btn.dataset.q;
      const group = document.querySelectorAll(`.quiz-opts[data-qidx="${qi}"] .quiz-opt`);
      if([...group].some(b=>b.disabled)) return;
      const oi = parseInt(btn.dataset.o);
      const correctIdx = cat.quiz[qi].correct;
      group.forEach(b=> b.disabled = true);
      group[correctIdx].classList.add('correct');
      if(oi !== correctIdx){ btn.classList.add('wrong'); playWrong(); } else { correctCount++; playCorrect(); }
      answered++;
      if(answered === cat.quiz.length){
        progress[cat.id].quiz = true;
        progress[cat.id].score = correctCount;
        playFanfare();
        confettiBurst();
        feedback.textContent = `🏆 ¡Terminaste! Acertaste ${correctCount} de ${cat.quiz.length}. ¡Insignia ganada!`;
        updateEvalDashboard();
      }
    });
  });
}

/* ================= DASHBOARD DE PROGRESO ================= */
function updateEvalDashboard(){
  const dash = document.getElementById('badgeDash');
  if(!dash) return;
  dash.innerHTML = categories.map(c=>{
    const unlocked = progress[c.id].quiz;
    return `<div class="dash-item ${unlocked?'unlocked':''}">
      <span class="emoji">${c.icon}</span>
      <span class="lbl">${c.name}</span>
      <div style="font-size:.8rem; margin-top:4px;">${unlocked ? '🏅 Ganada' : '🔒 Bloqueada'}</div>
    </div>`;
  }).join('');
  const total = categories.length;
  const done = categories.filter(c=>progress[c.id].quiz).length;
  const bar = document.getElementById('totalProgress');
  if(bar) bar.style.width = Math.round((done/total)*100) + '%';
}

/* ================= MASCOTA FLOTANTE ================= */
function setupFloatingBit(){
  const bit = document.getElementById('floatingBit');
  if(!bit) return;
  const pupilL = document.getElementById('pupilL');
  const pupilR = document.getElementById('pupilR');
  const bubble = document.getElementById('bitBubble');
  const phrases = ['¡Tú puedes! 💪','¡Sigue así! 🌟','¿Jugamos? 🎮','¡Casi lo logras! 🚀','¡Bien hecho! 🎉'];
  let i = 0;
  let ticking = false;
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e)=>{
    lastX = e.clientX; lastY = e.clientY;
    if(!ticking){
      window.requestAnimationFrame(()=>{
        const rect = bit.getBoundingClientRect();
        const range = Math.max(window.innerWidth, window.innerHeight) * 0.6;
        const dx = Math.max(-1, Math.min(1, (lastX - (rect.left+35))/range));
        const dy = Math.max(-1, Math.min(1, (lastY - (rect.top+35))/range));
        if(pupilL){ pupilL.setAttribute('cx', 75 + dx*4); pupilL.setAttribute('cy', 100 + dy*4); }
        if(pupilR){ pupilR.setAttribute('cx', 125 + dx*4); pupilR.setAttribute('cy', 100 + dy*4); }
        ticking = false;
      });
      ticking = true;
    }
  });

  bit.addEventListener('click', ()=>{ i = (i+1) % phrases.length; if(bubble) bubble.textContent = phrases[i]; });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', ()=>{
  renderActTabs(); renderActPanel();
  renderVidTabs(); renderVidPanel();
  renderEvalTabs(); renderEvalPanel();
  updateEvalDashboard();
  setupFloatingBit();
});
