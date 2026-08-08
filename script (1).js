/* ================================================================
   TECNOINCLUSIÓN — Contenido basado en el Plan de Área real:
   Media Técnica en Sistemas Teleinformática, Grados 10 y 11
   (Institución Educativa Carlos Lleras Restrepo, Yopal)
   ================================================================ */

const temas = [
  /* ---------- GRADO DÉCIMO ---------- */
  {
    id:'numeros', grado:10, period:'Periodo I', name:'Números y Datos', icon:'🔢',
    theory:'En este periodo aprenderás cómo los computadores representan la información usando números, y algunas bases de electricidad.',
    subtemas:[
      {icon:'🔢', label:'Sistemas de numeración', text:'Cómo contar en binario (0 y 1), octal y hexadecimal — el lenguaje numérico de los computadores.'},
      {icon:'⚡', label:'Electricidad y electrónica', text:'Conceptos básicos: carga eléctrica, resistencia, tensión, corriente y energía.'},
      {icon:'📱', label:'Telefonía', text:'Cómo funciona la telefonía móvil y el internet móvil.'},
      {icon:'📝', label:'Anteproyecto', text:'Primeros pasos para planear tu proyecto de grado: elegir el problema a resolver.'}
    ],
    game:{ word:'BINARIO', bombCount:6 },
    quiz:[
      {q:'¿Qué números usa el sistema binario?', opts:['0 y 1','0 al 9','A a la Z','1 al 100'], correct:0},
      {q:'¿Qué es el voltaje?', opts:['La fuerza de la electricidad','Un programa','Un cable','Un color'], correct:0},
      {q:'Además del binario, ¿qué otro sistema de numeración existe?', opts:['Hexadecimal','Romano','Chino','Maya'], correct:0},
      {q:'Los computadores entienden mejor...', opts:['Números binarios','Palabras en español','Dibujos','Sonidos'], correct:0}
    ]
  },
  {
    id:'algoritmos', grado:10, period:'Periodo II', name:'Algoritmos y Programación', icon:'🧮',
    theory:'En este periodo aprenderás a planear pasos ordenados (algoritmos) y a convertirlos en código real.',
    subtemas:[
      {icon:'🧩', label:'Diagrama de flujo', text:'Dibujos con figuras que muestran, paso a paso, cómo resolver un problema.'},
      {icon:'💻', label:'Programación en C++ y Python', text:'Variables, constantes y ciclos repetitivos: las piezas básicas de un programa.'},
      {icon:'📝', label:'Anteproyecto', text:'Título, objetivos, alcances y cronograma de tu proyecto de grado.'}
    ],
    game:{ word:'ALGORITMO', bombCount:7 },
    quiz:[
      {q:'Un algoritmo es...', opts:['Una lista de pasos ordenados','Un dibujo sin sentido','Un cable','Una pantalla'], correct:0},
      {q:'¿Qué usamos para planear un algoritmo antes de programar?', opts:['Un diagrama de flujo','Una impresora','Un mouse','Un cable de red'], correct:0},
      {q:'¿Cuál es un lenguaje de programación?', opts:['Python','Español','Inglés','Binario'], correct:0},
      {q:'Si el orden de los pasos está mal...', opts:['El resultado puede salir mal','No importa','Siempre funciona','Se arregla solo'], correct:0}
    ]
  },
  {
    id:'arquitectura', grado:10, period:'Periodo III', name:'Arquitectura y Mantenimiento', icon:'🖥️',
    theory:'En este periodo aprenderás cómo está armado un computador por dentro y cómo cuidarlo.',
    subtemas:[
      {icon:'🖥️', label:'Arquitectura de computadores', text:'El hardware, las partes eléctricas y los periféricos del equipo.'},
      {icon:'🔧', label:'Mantenimiento', text:'Preventivo (antes de que se dañe), predictivo (anticiparse) y correctivo (arreglarlo).'},
      {icon:'📏', label:'Instrumentos de medición', text:'Voltímetro, amperímetro, osciloscopio y pinza multifunción.'}
    ],
    game:{ word:'HARDWARE', bombCount:6 },
    quiz:[
      {q:'La arquitectura de un computador es...', opts:['Cómo están organizadas sus partes','Un edificio','Un programa','Un cable'], correct:0},
      {q:'¿Qué instrumento mide la electricidad?', opts:['El voltímetro','El mouse','El teclado','El parlante'], correct:0},
      {q:'El mantenimiento sirve para...', opts:['Cuidar el computador y evitar daños','Dañar el computador','Apagarlo para siempre','Nada'], correct:0},
      {q:'¿Cuál es una parte del hardware?', opts:['El procesador','Un archivo de texto','Una página web','Un correo'], correct:0}
    ]
  },
  {
    id:'sistemasop', grado:10, period:'Periodo IV', name:'Sistemas Operativos', icon:'💾',
    theory:'En este periodo aprenderás qué es un sistema operativo y cómo formatear un equipo con cuidado.',
    subtemas:[
      {icon:'💾', label:'Sistemas operativos', text:'Qué son, sus funciones, y ejemplos como Windows.'},
      {icon:'🗂️', label:'Formateo', text:'Sistemas de archivos como NTFS, FAT y FAT32; borrar todo y dejar el equipo como nuevo.'},
      {icon:'📄', label:'Informes técnicos', text:'Cómo redactar y presentar tu sustentación con normas IEEE, Icontec o APA.'}
    ],
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
    id:'arduino', grado:11, period:'Periodo I', name:'Arduino y Robótica', icon:'🤖',
    theory:'En este periodo aprenderás a programar una tarjeta Arduino para crear objetos interactivos.',
    subtemas:[
      {icon:'🔌', label:'Tarjeta Arduino', text:'Qué es Arduino Uno: su hardware y su software.'},
      {icon:'💡', label:'Entradas y salidas', text:'Encender leds, leer botones (entradas digitales) y sensores (entradas analógicas).'},
      {icon:'🚗', label:'Proyecto', text:'Construir un carro seguidor de línea, tu primer robot.'}
    ],
    game:{ word:'SENSOR', bombCount:5 },
    quiz:[
      {q:'Arduino es...', opts:['Una tarjeta electrónica programable','Un mouse','Un programa de dibujo','Un cable USB'], correct:0},
      {q:'Un sensor sirve para...', opts:['Detectar luz, temperatura o movimiento','Escuchar música','Imprimir','Navegar en internet'], correct:0},
      {q:'¿Qué puede mover un actuador como un motor?', opts:['Ruedas o brazos de un robot','Solo el mouse','Solo el teclado','Nada'], correct:0},
      {q:'Programar Arduino permite...', opts:['Encender luces y mover motores','Ver televisión','Cocinar','Dormir'], correct:0}
    ]
  },
  {
    id:'redes1', grado:11, period:'Periodo II', name:'Redes de Datos I', icon:'🌐',
    theory:'En este periodo aprenderás cómo se conectan los computadores entre sí para compartir información.',
    subtemas:[
      {icon:'🌐', label:'Tipos de redes', text:'LAN (pequeña), MAN (de ciudad) y WAN (gigante, como internet).'},
      {icon:'🔀', label:'Topologías', text:'Formas de conectar los equipos: bus, estrella y árbol.'},
      {icon:'🧭', label:'Direccionamiento IP', text:'La dirección única de cada computador en la red: IP pública y privada.'}
    ],
    game:{ word:'TOPOLOGIA', bombCount:8 },
    quiz:[
      {q:'Una red conecta...', opts:['Varios computadores entre sí','Solo un computador','Un lápiz y un papel','Nada'], correct:0},
      {q:'Una red pequeña como la del colegio se llama...', opts:['LAN','WAN','Internet gigante','Ninguna'], correct:0},
      {q:'La dirección IP es...', opts:['El nombre único de un computador en la red','Un color','Un sonido','Una contraseña de WiFi'], correct:0},
      {q:'Internet es un ejemplo de red...', opts:['Muy grande (WAN)','Muy pequeña','Sin computadores','Imaginaria'], correct:0}
    ]
  },
  {
    id:'redes2', grado:11, period:'Periodo III', name:'Redes de Datos II', icon:'🔌',
    theory:'En este periodo aprenderás las normas del cableado y a simular redes completas en el computador.',
    subtemas:[
      {icon:'🧵', label:'Cableado estructurado', text:'Normas TIA/EIA 568 para organizar bien los cables de una red.'},
      {icon:'🖧', label:'Packet Tracer', text:'El simulador de Cisco para practicar redes sin necesitar equipos reales.'},
      {icon:'🛣️', label:'Enrutamiento', text:'Rutas estáticas y protocolos dinámicos que guían la información por la red.'}
    ],
    game:{ word:'CABLEADO', bombCount:7 },
    quiz:[
      {q:'El cableado estructurado sigue...', opts:['Normas y reglas de instalación','Ningún orden','Solo colores bonitos','Nada'], correct:0},
      {q:'Cisco Packet Tracer sirve para...', opts:['Simular redes en la pantalla','Imprimir documentos','Ver videos','Jugar'], correct:0},
      {q:'¿Por qué es útil simular una red antes de armarla?', opts:['Para practicar sin dañar equipos reales','Para perder tiempo','No sirve para nada','Para hacer ruido'], correct:0},
      {q:'Los cables de red bien organizados ayudan a...', opts:['Que la red funcione mejor','Que se vea bonito nada más','Dañar la red','Nada'], correct:0}
    ]
  },
  {
    id:'webdev', grado:11, period:'Periodo IV', name:'Páginas Web', icon:'💻',
    theory:'En este periodo aprenderás cómo se construyen las páginas web que usas todos los días.',
    subtemas:[
      {icon:'🌍', label:'Historia de internet', text:'Cómo nació internet, la web y los navegadores.'},
      {icon:'🏗️', label:'HTML y CSS', text:'HTML arma la estructura de la página, CSS le da color y estilo.'},
      {icon:'⚙️', label:'JavaScript', text:'Le da movimiento e interacción a la página, como los botones que responden al clic.'},
      {icon:'☁️', label:'Computación en la nube', text:'Servicios como SaaS, PaaS e IaaS que funcionan a través de internet.'}
    ],
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
    btn.innerHTML = `${t.icon} <span style="display:block; font-size:.72rem; opacity:.75;">${t.period || ''}</span>${t.name}${done}`;
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
  const subtemasHtml = (t.subtemas || []).map(s => `
    <div class="bubble">
      <h4>${s.icon} ${s.label}</h4>
      ${s.text}
    </div>`).join('');

  panel.innerHTML = `
    <div class="stars-badge">⭐ ${totalStars} estrellas</div>
    <h3>${t.icon} ${t.period ? t.period + ': ' : ''}${t.name} ${done ? '✅' : ''}</h3>
    <div class="theory"><span class="think">💡</span><div><h4>Resumen del periodo</h4><p>${t.theory}</p></div></div>
    <h4 style="font-family:'Baloo 2'; color:var(--teal); margin-top:22px;">📚 Temas de este periodo</h4>
    <div class="inclu-row" style="margin-top:10px;"><div class="inclu-col" style="flex:1 1 100%;">${subtemasHtml}</div></div>
    <div class="game-controls" style="margin-top:22px;">
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
