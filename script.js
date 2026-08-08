/* ================================================================
   TECNOINCLUSIÓN — Contenido basado en el Plan de Área real:
   Media Técnica en Sistemas Teleinformática, Grados 10 y 11
   (Institución Educativa Carlos Lleras Restrepo, Yopal)
   ================================================================ */

const temas = [
  /* ---------- GRADO DÉCIMO ---------- */
  {
    id:'numeros', grado:10, name:'Números y Datos', icon:'🔢',
    theory:'Los computadores no entienden letras como nosotros: ellos solo entienden números hechos de 0 y 1, un sistema llamado binario. También existen otras formas de contar, como el octal y el hexadecimal, que ayudan a representar la información de manera más corta. Además aprenderás ideas básicas de electricidad, como la corriente y el voltaje, porque todo computador funciona gracias a la electricidad.',
    game:{ word:'BINARIO', bombCount:6 },
    quiz:[
      {q:'¿Qué números usa el sistema binario?', opts:['0 y 1','0 al 9','A a la Z','1 al 100'], correct:0},
      {q:'¿Qué es el voltaje?', opts:['La fuerza de la electricidad','Un programa','Un cable','Un color'], correct:0},
      {q:'Además del binario, ¿qué otro sistema de numeración existe?', opts:['Hexadecimal','Romano','Chino','Maya'], correct:0},
      {q:'Los computadores entienden mejor...', opts:['Números binarios','Palabras en español','Dibujos','Sonidos'], correct:0}
    ]
  },
  {
    id:'algoritmos', grado:10, name:'Algoritmos y Programación', icon:'🧮',
    theory:'Un algoritmo es una lista de pasos ordenados para resolver un problema, como una receta de cocina. Antes de escribir código, se puede dibujar un diagrama de flujo para planear esos pasos. Luego, esos pasos se convierten en instrucciones reales usando lenguajes de programación como C++ o Python.',
    game:{ word:'ALGORITMO', bombCount:7 },
    quiz:[
      {q:'Un algoritmo es...', opts:['Una lista de pasos ordenados','Un dibujo sin sentido','Un cable','Una pantalla'], correct:0},
      {q:'¿Qué usamos para planear un algoritmo antes de programar?', opts:['Un diagrama de flujo','Una impresora','Un mouse','Un cable de red'], correct:0},
      {q:'¿Cuál es un lenguaje de programación?', opts:['Python','Español','Inglés','Binario'], correct:0},
      {q:'Si el orden de los pasos está mal...', opts:['El resultado puede salir mal','No importa','Siempre funciona','Se arregla solo'], correct:0}
    ]
  },
  {
    id:'arquitectura', grado:10, name:'Arquitectura y Mantenimiento', icon:'🖥️',
    theory:'La arquitectura de un computador es cómo están organizadas todas sus partes: el procesador, la memoria, los cables y las conexiones. El mantenimiento es cuidar esas partes: limpiarlas, revisarlas y solucionar problemas antes de que se dañen, usando herramientas como el voltímetro para medir la electricidad de forma segura.',
    game:{ word:'HARDWARE', bombCount:6 },
    quiz:[
      {q:'La arquitectura de un computador es...', opts:['Cómo están organizadas sus partes','Un edificio','Un programa','Un cable'], correct:0},
      {q:'¿Qué instrumento mide la electricidad?', opts:['El voltímetro','El mouse','El teclado','El parlante'], correct:0},
      {q:'El mantenimiento sirve para...', opts:['Cuidar el computador y evitar daños','Dañar el computador','Apagarlo para siempre','Nada'], correct:0},
      {q:'¿Cuál es una parte del hardware?', opts:['El procesador','Un archivo de texto','Una página web','Un correo'], correct:0}
    ]
  },
  {
    id:'sistemasop', grado:10, name:'Sistemas Operativos', icon:'💾',
    theory:'El sistema operativo es el programa principal que hace funcionar todo el computador, como Windows. Él organiza los archivos, administra la memoria y permite instalar otros programas. Formatear es borrar todo y dejar el computador como nuevo, algo que se hace con mucho cuidado.',
    game:{ word:'FORMATEO', bombCount:7 },
    quiz:[
      {q:'El sistema operativo es...', opts:['El programa principal que hace funcionar el computador','Un cable','Un mouse','Una impresora'], correct:0},
      {q:'¿Cuál es un ejemplo de sistema operativo?', opts:['Windows','Word','YouTube','WhatsApp'], correct:0},
      {q:'Formatear un computador significa...', opts:['Borrar todo y dejarlo como nuevo','Prenderlo','Apagarlo','Limpiarlo con agua'], correct:0},
      {q:'El sistema operativo organiza...', opts:['Los archivos y programas','Solo los colores','Solo la música','Nada'], correct:0}
    ]
  },
  /* ---------- GRADO ONCE ---------- */
  {
    id:'arduino', grado:11, name:'Arduino y Robótica', icon:'🤖',
    theory:'Arduino es una tarjeta electrónica pequeña que se puede programar para hacer cosas: prender luces, mover motores o leer sensores. Un sensor es como los sentidos del robot: puede sentir luz, temperatura o movimiento. Programando esas señales, ¡puedes construir tu propio robot!',
    game:{ word:'SENSOR', bombCount:5 },
    quiz:[
      {q:'Arduino es...', opts:['Una tarjeta electrónica programable','Un mouse','Un programa de dibujo','Un cable USB'], correct:0},
      {q:'Un sensor sirve para...', opts:['Detectar luz, temperatura o movimiento','Escuchar música','Imprimir','Navegar en internet'], correct:0},
      {q:'¿Qué puede mover un actuador como un motor?', opts:['Ruedas o brazos de un robot','Solo el mouse','Solo el teclado','Nada'], correct:0},
      {q:'Programar Arduino permite...', opts:['Encender luces y mover motores','Ver televisión','Cocinar','Dormir'], correct:0}
    ]
  },
  {
    id:'redes1', grado:11, name:'Redes de Datos I', icon:'🌐',
    theory:'Una red conecta varios computadores para compartir información. Existen redes pequeñas (LAN, como en un colegio) y redes gigantes (WAN, como internet). Cada computador en una red tiene una dirección única llamada dirección IP, como si fuera su nombre dentro de la red.',
    game:{ word:'TOPOLOGIA', bombCount:8 },
    quiz:[
      {q:'Una red conecta...', opts:['Varios computadores entre sí','Solo un computador','Un lápiz y un papel','Nada'], correct:0},
      {q:'Una red pequeña como la del colegio se llama...', opts:['LAN','WAN','Internet gigante','Ninguna'], correct:0},
      {q:'La dirección IP es...', opts:['El nombre único de un computador en la red','Un color','Un sonido','Una contraseña de WiFi'], correct:0},
      {q:'Internet es un ejemplo de red...', opts:['Muy grande (WAN)','Muy pequeña','Sin computadores','Imaginaria'], correct:0}
    ]
  },
  {
    id:'redes2', grado:11, name:'Redes de Datos II', icon:'🔌',
    theory:'Para que las redes funcionen bien, los cables se organizan siguiendo reglas llamadas normas de cableado estructurado. Con programas como Cisco Packet Tracer podemos simular redes completas en la pantalla, sin necesitar cables de verdad, para practicar antes de hacerlo con equipos reales.',
    game:{ word:'CABLEADO', bombCount:7 },
    quiz:[
      {q:'El cableado estructurado sigue...', opts:['Normas y reglas de instalación','Ningún orden','Solo colores bonitos','Nada'], correct:0},
      {q:'Cisco Packet Tracer sirve para...', opts:['Simular redes en la pantalla','Imprimir documentos','Ver videos','Jugar'], correct:0},
      {q:'¿Por qué es útil simular una red antes de armarla?', opts:['Para practicar sin dañar equipos reales','Para perder tiempo','No sirve para nada','Para hacer ruido'], correct:0},
      {q:'Los cables de red bien organizados ayudan a...', opts:['Que la red funcione mejor','Que se vea bonito nada más','Dañar la red','Nada'], correct:0}
    ]
  },
  {
    id:'webdev', grado:11, name:'Páginas Web', icon:'💻',
    theory:'Las páginas web que ves en internet están construidas con código. El HTML arma la estructura, como el esqueleto. El CSS le da color y estilo, como la ropa. Y JavaScript le da movimiento e interacción, como los músculos. ¡Con estos tres, tú también puedes construir páginas como esta!',
    game:{ word:'CODIGO', bombCount:6 },
    quiz:[
      {q:'El HTML se usa para...', opts:['Armar la estructura de una página web','Pintar paredes','Cocinar','Escuchar música'], correct:0},
      {q:'El CSS le da a la página...', opts:['Color y estilo','Solo texto sin forma','Sonido','Nada'], correct:0},
      {q:'JavaScript le da a la página...', opts:['Movimiento e interacción','Solo colores','Solo texto','Nada'], correct:0},
      {q:'Con HTML, CSS y JavaScript se pueden crear...', opts:['Páginas web','Solo dibujos en papel','Solo música','Nada de eso'], correct:0}
    ]
  }
];

/* ================= ESTADO (en memoria, dura mientras la pestaña esté abierta) ================= */
const progress = {};
temas.forEach(t => progress[t.id] = { game:false, quiz:false, score:0 });
let totalStars = 0;

function temasDeGrado(g){ return temas.filter(t => t.grado === g); }
function temaById(id){ return temas.find(t => t.id === id); }
function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

/* ================= SONIDO Y CONFETI ================= */
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

/* ================= VOZ (representación DUA: escuchar además de leer) ================= */
function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES'; u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

/* ================= PESTAÑAS (genérico) ================= */
function renderTabs(containerId, list, activeId, onClick){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = '';
  list.forEach(t=>{
    const btn = document.createElement('button');
    btn.className = 'tabbtn' + (t.id===activeId ? ' active':'');
    const done = progress[t.id].quiz ? ' ✅' : '';
    btn.innerHTML = `${t.icon} ${t.name}${done}`;
    btn.setAttribute('aria-pressed', t.id===activeId);
    btn.onclick = ()=> onClick(t.id);
    el.appendChild(btn);
  });
}

/* ================= PÁGINA DE GRADO (10 u 11): teoría + juego ================= */
let currentTemaTab = null;

function initGradoPage(gradoNum){
  const list = temasDeGrado(gradoNum);
  if(list.length === 0) return;
  currentTemaTab = list[0].id;
  renderGradoTabs(gradoNum);
  renderTemaPanel();
}

function renderGradoTabs(gradoNum){
  renderTabs('temaTabs', temasDeGrado(gradoNum), currentTemaTab, (id)=>{
    currentTemaTab = id;
    renderGradoTabs(gradoNum);
    renderTemaPanel();
  });
}

function renderTemaPanel(){
  const panel = document.getElementById('temaPanel');
  if(!panel) return;
  const t = temaById(currentTemaTab);
  const done = progress[t.id].game;
  panel.innerHTML = `
    <div class="stars-badge">⭐ ${totalStars} estrellas</div>
    <h3>${t.icon} ${t.name} ${done ? '✅' : ''}</h3>
    <div class="theory"><span class="think">💡</span><div><h4>Teoría</h4><p>${t.theory}</p></div></div>
    <div class="game-controls">
      <button class="ctrlbtn" id="btnListen" type="button">🔊 Escuchar la teoría</button>
      <button class="ctrlbtn" id="btnHint" type="button">💡 Pista</button>
      <button class="ctrlbtn" id="btnReset" type="button">🔄 Reiniciar juego</button>
    </div>
    <p class="sub">Forma la palabra clave de este tema haciendo clic en las letras en orden. ¡Cuidado con las bombas 💣!</p>
    <div class="ws-progress" id="wsProgress"></div>
    <div class="ws-grid" id="wsGrid"></div>
    <div class="feedback" id="temaFeedback" role="status" aria-live="polite"></div>
  `;
  setupWordSearch(t);
  document.getElementById('btnListen').onclick = ()=> speak(t.theory);
  document.getElementById('btnReset').onclick = ()=> renderTemaPanel();
  document.getElementById('btnHint').onclick = ()=> giveHint(t);
}

function markGameComplete(t){
  progress[t.id].game = true;
}

function giveHint(t){
  const word = t.game.word;
  const progressText = (document.getElementById('wsProgress').textContent || '').replace(/\s/g,'');
  let pointer = progressText.indexOf('_');
  if(pointer === -1) pointer = word.length;
  if(pointer >= word.length) return;
  const neededLetter = word[pointer];
  const tiles = document.querySelectorAll('#wsGrid .ws-tile:not(.bomb):not(.used)');
  const target = [...tiles].find(tile => tile.textContent === neededLetter);
  if(target){ target.classList.add('hint'); setTimeout(()=> target.classList.remove('hint'), 1600); }
}

/* ================= JUEGO: SOPA DE LETRAS ================= */
function setupWordSearch(t){
  const word = t.game.word;
  const grid = document.getElementById('wsGrid');
  const progressEl = document.getElementById('wsProgress');
  const feedback = document.getElementById('temaFeedback');
  let pointer = 0;

  function renderProgress(){
    progressEl.textContent = word.split('').map((l,i)=> i < pointer ? l : '_').join(' ');
  }
  renderProgress();

  let tiles = word.split('').map(l => ({letter:l, bomb:false, used:false}));
  for(let i=0;i<(t.game.bombCount||6);i++) tiles.push({letter:'💣', bomb:true, used:false});
  tiles = shuffle(tiles);

  function draw(){
    grid.innerHTML = '';
    tiles.forEach((tile, i)=>{
      const btn = document.createElement('button');
      btn.className = 'ws-tile' + (tile.bomb ? ' bomb':'') + (tile.used ? ' used':'');
      btn.textContent = tile.bomb ? '💣' : tile.letter;
      btn.disabled = tile.used;
      btn.onclick = ()=> handleClick(i);
      grid.appendChild(btn);
    });
  }
  draw();

  function handleClick(i){
    const tile = tiles[i];
    if(tile.used) return;
    const btnEl = grid.children[i];
    if(tile.bomb){
      if(btnEl) btnEl.classList.add('bombhit');
      playWrong();
      feedback.textContent = '💥 ¡Bomba! Empiezas de nuevo con esta palabra.';
      setTimeout(()=>{
        pointer = 0;
        tiles.forEach(tl => tl.used = false);
        renderProgress();
        draw();
      }, 350);
      return;
    }
    if(tile.letter === word[pointer]){
      if(btnEl) btnEl.classList.add('pop');
      playCorrect();
      setTimeout(()=>{
        tile.used = true;
        pointer++;
        totalStars++;
        feedback.textContent = '✅ ¡Bien! +1 estrella';
        renderProgress();
        draw();
        if(pointer === word.length){
          totalStars += 3;
          playFanfare();
          confettiBurst();
          feedback.textContent = '🏆 ¡Formaste la palabra completa! +3 estrellas';
          markGameComplete(t);
          const badge = document.querySelector('.stars-badge');
          if(badge) badge.textContent = `⭐ ${totalStars} estrellas`;
        }
        const badge = document.querySelector('.stars-badge');
        if(badge) badge.textContent = `⭐ ${totalStars} estrellas`;
      }, 220);
    } else {
      if(btnEl) btnEl.classList.add('bombhit');
      playWrong();
      feedback.textContent = '💡 Esa no es la letra que sigue, intenta otra.';
      setTimeout(()=> btnEl && btnEl.classList.remove('bombhit'), 400);
    }
  }
}

/* ================= EVALUACIONES: los 8 temas juntos ================= */
let currentEvalTab = temas[0].id;

function initEvalPage(){
  renderEvalTabs();
  renderEvalPanel();
  updateEvalDashboard();
}

function renderEvalTabs(){
  renderTabs('evalTabs', temas, currentEvalTab, (id)=>{
    currentEvalTab = id;
    renderEvalTabs();
    renderEvalPanel();
  });
}

function renderEvalPanel(){
  const panel = document.getElementById('evalPanel');
  if(!panel) return;
  const t = temaById(currentEvalTab);
  let html = `<h3>${t.icon} ${t.name} <span style="font-size:.9rem; color:#5b7072; font-family:'Baloo 2';">(Grado ${t.grado})</span></h3>
    <div class="game-controls">
      <button class="ctrlbtn" id="btnListenQ" type="button">🔊 Escuchar preguntas</button>
    </div>
    <p class="sub">Responde las ${t.quiz.length} preguntas para ganar tu insignia 🏅</p>`;
  t.quiz.forEach((q, qi)=>{
    html += `<div class="quiz-q">${qi+1}. ${q.q}</div>
      <div class="quiz-opts" data-qidx="${qi}">
        ${q.opts.map((o,oi)=>`<button class="quiz-opt" data-q="${qi}" data-o="${oi}">${o}</button>`).join('')}
      </div>`;
  });
  html += `<div class="feedback" id="evalFeedback" role="status" aria-live="polite"></div>`;
  panel.innerHTML = html;
  setupQuiz(t);
  document.getElementById('btnListenQ').onclick = ()=>{
    const text = t.quiz.map((q,i)=> `Pregunta ${i+1}: ${q.q}`).join('. ');
    speak(text);
  };
}

function setupQuiz(t){
  const feedback = document.getElementById('evalFeedback');
  let answered = 0, correctCount = 0;
  document.querySelectorAll('#evalPanel .quiz-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const qi = btn.dataset.q;
      const group = document.querySelectorAll(`.quiz-opts[data-qidx="${qi}"] .quiz-opt`);
      if([...group].some(b=>b.disabled)) return;
      const oi = parseInt(btn.dataset.o);
      const correctIdx = t.quiz[qi].correct;
      group.forEach(b=> b.disabled = true);
      group[correctIdx].classList.add('correct');
      if(oi !== correctIdx){ btn.classList.add('wrong'); playWrong(); } else { correctCount++; playCorrect(); }
      answered++;
      if(answered === t.quiz.length){
        progress[t.id].quiz = true;
        progress[t.id].score = correctCount;
        playFanfare();
        confettiBurst();
        feedback.textContent = `🏆 ¡Terminaste! Acertaste ${correctCount} de ${t.quiz.length}. ¡Insignia ganada!`;
        updateEvalDashboard();
        renderEvalTabs();
      }
    });
  });
}

function updateEvalDashboard(){
  const dash = document.getElementById('badgeDash');
  if(!dash) return;
  dash.innerHTML = temas.map(t=>{
    const unlocked = progress[t.id].quiz;
    return `<div class="dash-item ${unlocked?'unlocked':''}">
      <span class="emoji">${t.icon}</span>
      <span class="lbl">${t.name}</span>
      <div style="font-size:.75rem; margin-top:4px;">${unlocked ? '🏅 Ganada' : '🔒 Bloqueada'}</div>
    </div>`;
  }).join('');
  const total = temas.length;
  const done = temas.filter(t=>progress[t.id].quiz).length;
  const bar = document.getElementById('totalProgress');
  if(bar) bar.style.width = Math.round((done/total)*100) + '%';
}

/* ================= MASCOTA BIT (quieta, solo responde al clic) ================= */
function setupFloatingBit(){
  const bit = document.getElementById('floatingBit');
  if(!bit) return;
  const bubble = document.getElementById('bitBubble');
  const phrases = ['¡Tú puedes! 💪','¡Sigue así! 🌟','¿Jugamos? 🎮','¡Casi lo logras! 🚀','¡Bien hecho! 🎉'];
  let i = 0;
  bit.addEventListener('click', ()=>{ i = (i+1) % phrases.length; if(bubble) bubble.textContent = phrases[i]; });
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', ()=>{
  if(window.PAGE_GRADO) initGradoPage(window.PAGE_GRADO);
  if(document.getElementById('evalTabs')) initEvalPage();
  setupFloatingBit();
});
