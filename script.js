/* ================= DATOS ================= */
const categories = [
  {
    id:'hardware', name:'Hardware', icon:'🖥️', video:'rlMReK7rfTo', duration:'4:20',
    theory:'El hardware son todas las partes del computador que puedes tocar: la pantalla, el teclado, el mouse, la torre. Cada pieza cumple una función distinta, como los órganos de un cuerpo. Sin hardware, el computador no podría encender ni mostrarte nada en la pantalla.',
    game:{ type:'match', instructions:'Une cada pieza con lo que hace. Haz clic en una pieza y luego en su función.',
      pairs:[
        {a:'🖥️ Monitor', b:'Muestra lo que hace el computador'},
        {a:'⌨️ Teclado', b:'Sirve para escribir'},
        {a:'🖱️ Mouse', b:'Sirve para señalar y hacer clic'},
        {a:'🖨️ Impresora', b:'Imprime documentos en papel'}
      ]},
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
    game:{ type:'match', instructions:'Une cada programa con lo que hace.',
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
    game:{ type:'order', instructions:'Ordena los pasos: ¿cómo viaja un mensaje por internet?',
      steps:[
        'Escribes el mensaje en tu computador',
        'El mensaje se convierte en datos',
        'Los datos viajan por la red',
        'El mensaje llega al otro computador'
      ]},
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
    game:{ type:'order', instructions:'Ordena las instrucciones para que el robot llegue a la meta.',
      steps:[
        'Encender el robot',
        'Avanzar tres pasos',
        'Girar a la derecha',
        'Avanzar dos pasos más'
      ]},
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
    game:{ type:'diagnose', instructions:'Elige la mejor solución para cada problema.',
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

/* ================= ESTADO (en memoria, dura mientras la pestaña esté abierta) ================= */
const progress = {};
categories.forEach(c => progress[c.id] = { game:false, quiz:false, score:0 });

let currentActTab = categories[0].id;
let currentVidTab = categories[0].id;
let currentEvalTab = categories[0].id;

/* ================= UTIL ================= */
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function catById(id){ return categories.find(c=>c.id===id); }

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

/* ================= ACTIVIDADES ================= */
function renderActTabs(){ renderTabs('actTabs', currentActTab, id=>{ currentActTab=id; renderActTabs(); renderActPanel(); }); }

function renderActPanel(){
  const panel = document.getElementById('actPanel');
  if(!panel) return;
  const cat = catById(currentActTab);
  const done = progress[cat.id].game;
  let html = `<h3>${cat.icon} ${cat.name} ${done ? '✅' : ''}</h3>
    <div class="theory"><span class="think">💡</span><div><h4>Un poco de teoría</h4><p>${cat.theory}</p></div></div>
    <p class="sub">${cat.game.instructions}</p>`;

  if(cat.game.type === 'match'){
    const left = cat.game.pairs.map((p,i)=>({...p, idx:i}));
    const right = shuffle(cat.game.pairs.map((p,i)=>({...p, idx:i})));
    html += `<div class="match-grid">
      <div class="match-col"><h4>¿Qué es?</h4>${left.map(p=>`<button class="match-item" data-side="a" data-idx="${p.idx}">${p.a}</button>`).join('')}</div>
      <div class="match-col"><h4>¿Para qué sirve?</h4>${right.map(p=>`<button class="match-item" data-side="b" data-idx="${p.idx}">${p.b}</button>`).join('')}</div>
    </div>
    <div class="feedback" id="actFeedback" role="status" aria-live="polite"></div>`;
    panel.innerHTML = html;
    setupMatchGame(cat);
  } else if(cat.game.type === 'order'){
    const shuffled = shuffle(cat.game.steps.map((s,i)=>({text:s, idx:i})));
    html += `<div class="order-pool" id="orderPool">${shuffled.map(s=>`<button class="order-chip" data-idx="${s.idx}">${s.text}</button>`).join('')}</div>
    <p style="font-family:'Baloo 2'; font-weight:700; color:var(--teal);">Tu orden:</p>
    <ol class="order-list" id="orderList"></ol>
    <button class="checkbtn" id="orderCheck" disabled>Comprobar orden</button>
    <div class="feedback" id="actFeedback" role="status" aria-live="polite"></div>`;
    panel.innerHTML = html;
    setupOrderGame(cat);
  } else if(cat.game.type === 'diagnose'){
    html += cat.game.cases.map((c,ci)=>`
      <div class="diag-case">
        <p class="problem">🔧 ${c.problem}</p>
        <div class="diag-opts">${c.options.map((o,oi)=>`<button class="diag-opt" data-case="${ci}" data-opt="${oi}">${o}</button>`).join('')}</div>
      </div>`).join('');
    html += `<div class="feedback" id="actFeedback" role="status" aria-live="polite"></div>`;
    panel.innerHTML = html;
    setupDiagnoseGame(cat);
  }
}

function markGameComplete(cat){
  progress[cat.id].game = true;
  renderActTabs();
  updateEvalDashboard();
}

function setupMatchGame(cat){
  const items = document.querySelectorAll('#actPanel .match-item');
  let selectedA = null, matchedCount = 0;
  const feedback = document.getElementById('actFeedback');
  items.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if(btn.classList.contains('correct')) return;
      if(btn.dataset.side === 'a'){
        document.querySelectorAll('.match-item[data-side="a"]').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedA = btn;
      } else {
        if(!selectedA){ feedback.textContent = '👆 Primero elige una pieza de la izquierda.'; return; }
        if(selectedA.dataset.idx === btn.dataset.idx){
          selectedA.classList.remove('selected'); selectedA.classList.add('correct');
          btn.classList.add('correct');
          matchedCount++;
          feedback.textContent = '🎉 ¡Correcto!';
          selectedA = null;
          if(matchedCount === cat.game.pairs.length){
            feedback.textContent = '🏆 ¡Completaste este juego!';
            markGameComplete(cat);
          }
        } else {
          btn.classList.add('wrong');
          feedback.textContent = '💡 Intenta de nuevo.';
          setTimeout(()=> btn.classList.remove('wrong'), 600);
        }
      }
    });
  });
}

function setupOrderGame(cat){
  const pool = document.getElementById('orderPool');
  const list = document.getElementById('orderList');
  const checkBtn = document.getElementById('orderCheck');
  const feedback = document.getElementById('actFeedback');
  let chosen = [];
  pool.querySelectorAll('.order-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      if(chip.classList.contains('used')) return;
      chip.classList.add('used');
      chosen.push(parseInt(chip.dataset.idx));
      const li = document.createElement('li');
      li.textContent = chip.textContent;
      list.appendChild(li);
      if(chosen.length === cat.game.steps.length) checkBtn.disabled = false;
    });
  });
  checkBtn.addEventListener('click', ()=>{
    const correct = chosen.every((v,i)=> v===i);
    if(correct){
      feedback.textContent = '🏆 ¡Perfecto! Ese es el orden correcto.';
      markGameComplete(cat);
    } else {
      feedback.textContent = '💡 El orden no es correcto todavía. Vuelve a intentarlo.';
      chosen = [];
      list.innerHTML = '';
      pool.querySelectorAll('.order-chip').forEach(c=>c.classList.remove('used'));
      checkBtn.disabled = true;
    }
  });
}

function setupDiagnoseGame(cat){
  const feedback = document.getElementById('actFeedback');
  let solved = new Set();
  document.querySelectorAll('#actPanel .diag-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const ci = btn.dataset.case;
      const oi = parseInt(btn.dataset.opt);
      const group = document.querySelectorAll(`.diag-opt[data-case="${ci}"]`);
      if([...group].some(b=>b.classList.contains('correct'))) return;
      const isCorrect = cat.game.cases[ci].correct === oi;
      if(isCorrect){
        btn.classList.add('correct');
        solved.add(ci);
        feedback.textContent = '🎉 ¡Buena solución!';
        if(solved.size === cat.game.cases.length){
          feedback.textContent = '🏆 ¡Resolviste todos los casos!';
          markGameComplete(cat);
        }
      } else {
        btn.classList.add('wrong');
        feedback.textContent = '💡 Intenta con otra opción.';
        setTimeout(()=> btn.classList.remove('wrong'), 600);
      }
    });
  });
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
      if(oi !== correctIdx) btn.classList.add('wrong');
      else correctCount++;
      answered++;
      if(answered === cat.quiz.length){
        progress[cat.id].quiz = true;
        progress[cat.id].score = correctCount;
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

/* ================= INIT: cada página solo renderiza lo que tiene ================= */
document.addEventListener('DOMContentLoaded', ()=>{
  renderActTabs(); renderActPanel();
  renderVidTabs(); renderVidPanel();
  renderEvalTabs(); renderEvalPanel();
  updateEvalDashboard();
});
