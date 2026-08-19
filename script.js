/* ================================================================
   TECNOINCLUSIÓN — Contenido ampliado basado en el Plan de Área:
   Media Técnica en Sistemas Teleinformática, Grados 10 y 11
   (Institución Educativa Carlos Lleras Restrepo, Yopal)
   ================================================================ */

/* ================================================================
   LOGIN + PROGRESO EN LA NUBE (Firebase)
   ================================================================
   1) Crea un proyecto gratis en https://console.firebase.google.com
   2) Activa "Firestore Database" (modo producción, región cercana)
   3) En "Configuración del proyecto" > "Tus apps" > "SDK setup and configuration",
      copia el objeto de configuración y pégalo abajo en FIREBASE_CONFIG.
   4) Cambia STUDENT_ACCESS_CODE y ADMIN_ACCESS_CODE por los códigos que quieras usar.
   ================================================================ */
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBFCB6sLtoewW0K_Z0pYf9NgXRi_tTNTus",
  authDomain: "tecnoinclusion-bc423.firebaseapp.com",
  projectId: "tecnoinclusion-bc423",
  storageBucket: "tecnoinclusion-bc423.firebasestorage.app",
  messagingSenderId: "104645259800",
  appId: "1:104645259800:web:57b74446fce8617877896d"
};
const STUDENT_ACCESS_CODE = "TECNO2026";  /* código para los estudiantes */
const ADMIN_ACCESS_CODE   = "PROFE2026";  /* código secreto solo para el profesor */

let db = null;
let currentUsername = null;
let currentDisplayName = null;
let currentGrado = null;
let _saveTimeout = null;
let _cloudReady = false;

function firebaseConfigued(){
  return FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey.indexOf('TU_') !== 0;
}

function initFirebaseIfNeeded(){
  if(db) return true;
  if(typeof firebase === 'undefined') return false;
  if(!firebaseConfigued()) return false;
  try{
    if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    return true;
  }catch(e){ console.warn('Firebase no se pudo iniciar:', e); return false; }
}

function sanitizeUsername(name){
  return name.trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9_-]+/g,'_').replace(/^_+|_+$/g,'').slice(0,40) || 'estudiante';
}

/* ---------- Overlay de inicio de sesión ---------- */
function showLoginGate(){
  if(document.getElementById('loginGate')) return;
  const overlay = document.createElement('div');
  overlay.id = 'loginGate';
  overlay.className = 'login-gate';
  overlay.innerHTML = `
    <div class="login-card">
      <h2><i class="bi bi-mortarboard-fill"></i> TecnoInclusión</h2>
      <p>Escribe tu nombre, elige tu grado y escribe el código de acceso que te dio tu profesor.</p>
      <input type="text" id="loginUsername" placeholder="Tu nombre completo" autocomplete="off">
      <div class="grado-select" id="loginGradoSelect">
        <button type="button" class="grado-opt" data-grado="10"><i class="bi bi-mortarboard-fill"></i> Grado Décimo</button>
        <button type="button" class="grado-opt" data-grado="11"><i class="bi bi-mortarboard"></i> Grado Once</button>
      </div>
      <input type="text" id="loginCode" placeholder="Código de acceso" autocomplete="off">
      <button id="loginBtn" class="ctrlbtn" type="button"><i class="bi bi-box-arrow-in-right"></i> Entrar</button>
      <p class="login-error" id="loginError"></p>
    </div>`;
  document.body.appendChild(overlay);
  let selectedGrado = null;
  overlay.querySelectorAll('.grado-opt').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      overlay.querySelectorAll('.grado-opt').forEach(b=> b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedGrado = btn.dataset.grado;
    });
  });
  document.getElementById('loginBtn').onclick = ()=> attemptLogin(selectedGrado);
  ['loginUsername','loginCode'].forEach(id=>{
    document.getElementById(id).addEventListener('keydown', e=>{ if(e.key==='Enter') attemptLogin(selectedGrado); });
  });
  document.getElementById('loginUsername').focus();
}

function attemptLogin(selectedGrado){
  const nameEl = document.getElementById('loginUsername');
  const codeEl = document.getElementById('loginCode');
  const errEl  = document.getElementById('loginError');
  const name = nameEl.value.trim();
  const code = codeEl.value.trim();
  if(!name){ errEl.textContent = 'Escribe tu nombre.'; return; }
  if(!selectedGrado){ errEl.textContent = 'Elige tu grado (Décimo u Once).'; return; }
  if(code !== STUDENT_ACCESS_CODE && code !== ADMIN_ACCESS_CODE){
    errEl.textContent = 'Código de acceso incorrecto.';
    return;
  }
  currentDisplayName = name;
  currentUsername = sanitizeUsername(name);
  currentGrado = parseInt(selectedGrado, 10);
  localStorage.setItem('tecno_username', currentUsername);
  localStorage.setItem('tecno_displayname', name);
  localStorage.setItem('tecno_grado', String(currentGrado));
  const gate = document.getElementById('loginGate');
  if(gate) gate.remove();
  showUserBadge();
  _cloudReady = initFirebaseIfNeeded();
  if(_cloudReady) loadProgressFromCloud();
  else refreshCurrentView();
}

function showUserBadge(){
  if(!currentDisplayName) return;
  let el = document.getElementById('userBadge');
  if(!el){
    el = document.createElement('div');
    el.id = 'userBadge';
    el.className = 'user-badge';
    document.body.appendChild(el);
  }
  const gradoLbl = currentGrado ? `<span class="user-badge-grado">Grado ${currentGrado === 10 ? 'Décimo' : 'Once'}</span>` : '';
  el.innerHTML = `
    <button id="userBadgeToggle" class="user-badge-toggle" type="button" title="${currentDisplayName}"><i class="bi bi-person-circle"></i></button>
    <div class="user-badge-drop" id="userBadgeDrop">
      <span class="user-badge-name">${currentDisplayName}</span>
      ${gradoLbl}
      <button id="logoutBtn" type="button" title="Cerrar sesión"><i class="bi bi-box-arrow-right"></i> Salir</button>
    </div>`;
  const toggle = document.getElementById('userBadgeToggle');
  const drop = document.getElementById('userBadgeDrop');
  toggle.onclick = (e)=>{ e.stopPropagation(); el.classList.toggle('open'); };
  document.addEventListener('click', (e)=>{ if(!el.contains(e.target)) el.classList.remove('open'); });
  document.getElementById('logoutBtn').onclick = ()=>{
    localStorage.removeItem('tecno_username');
    localStorage.removeItem('tecno_displayname');
    localStorage.removeItem('tecno_grado');
    location.reload();
  };
}

/* ---------- Cargar / guardar progreso en Firestore ---------- */
function loadProgressFromCloud(){
  if(!db || !currentUsername) return;
  db.collection('progress').doc(currentUsername).get().then(doc=>{
    if(doc.exists){
      const data = doc.data();
      if(typeof data.totalStars === 'number') totalStars = data.totalStars;
      if(data.temas){
        Object.keys(data.temas).forEach(id=>{
          if(progress[id]) Object.assign(progress[id], data.temas[id]);
        });
      }
      if(!currentGrado && data.grado){
        currentGrado = data.grado;
        localStorage.setItem('tecno_grado', String(currentGrado));
        showUserBadge();
      }
    }
    refreshCurrentView();
  }).catch(err=> console.warn('No se pudo cargar el progreso:', err));
}

function saveProgressToCloud(){
  if(!db || !currentUsername) return;
  clearTimeout(_saveTimeout);
  _saveTimeout = setTimeout(()=>{
    const temasData = {};
    Object.keys(progress).forEach(id=> temasData[id] = progress[id]);
    db.collection('progress').doc(currentUsername).set({
      username: currentDisplayName || currentUsername,
      grado: currentGrado || null,
      totalStars: totalStars,
      temas: temasData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge:true }).catch(err=> console.warn('No se pudo guardar el progreso:', err));
  }, 700);
}

function refreshCurrentView(){
  updateStarsBadge();
  if(window.PAGE_GRADO && currentTemaTab){ renderGradoTabs(window.PAGE_GRADO); renderTemaPanel(); }
  if(document.getElementById('evalTabs') && typeof renderEvalTabs === 'function'){ renderEvalTabs(); if(typeof updateEvalDashboard==='function') updateEvalDashboard(); if(typeof renderEvalPanel==='function' && currentEvalTab) renderEvalPanel(); }
  showGradoMismatchNoticeIfNeeded();
}

function showGradoMismatchNoticeIfNeeded(){
  const notice = document.getElementById('gradoMismatchNotice');
  if(notice) notice.remove();
  if(!window.PAGE_GRADO || !currentGrado || currentGrado === window.PAGE_GRADO) return;
  const otherPage = currentGrado === 10 ? 'grado10.html' : 'grado11.html';
  const otherLbl = currentGrado === 10 ? 'Grado Décimo' : 'Grado Once';
  const div = document.createElement('div');
  div.id = 'gradoMismatchNotice';
  div.className = 'grado-mismatch-notice';
  div.innerHTML = `<i class="bi bi-info-circle-fill"></i> Estás registrado en <b>${otherLbl}</b>. Esta página es de otro grado. <a href="${otherPage}">Ir a tu página</a>`;
  const tabs = document.getElementById('temaTabs');
  if(tabs && tabs.parentNode) tabs.parentNode.insertBefore(div, tabs);
}

function checkLoginOnLoad(){
  const savedUser = localStorage.getItem('tecno_username');
  const savedName = localStorage.getItem('tecno_displayname');
  const savedGrado = localStorage.getItem('tecno_grado');
  if(savedUser){
    currentUsername = savedUser;
    currentDisplayName = savedName || savedUser;
    currentGrado = savedGrado ? parseInt(savedGrado, 10) : null;
    showUserBadge();
    showGradoMismatchNoticeIfNeeded();
    _cloudReady = initFirebaseIfNeeded();
    if(_cloudReady) loadProgressFromCloud();
    else refreshCurrentView();
  } else {
    showLoginGate();
    initFirebaseIfNeeded();
  }
}

const temas = [
  /* ---------- GRADO DÉCIMO ---------- */
  {
    id:'numeros', grado:10, period:'Periodo I', name:'Números y Datos', icon:'<i class="bi bi-123"></i>',
    theory:'En este periodo vas a descubrir cómo "piensan" los computadores por dentro. A diferencia de nosotros, que contamos con 10 símbolos (0 al 9), los computadores solo entienden dos estados: encendido o apagado, que se representan con 0 y 1. A eso se le llama sistema binario, y es la base de absolutamente todo lo que hace un computador: cada letra que escribes, cada imagen que ves y cada sonido que escuchas se guarda finalmente como una larga secuencia de ceros y unos. También vas a conocer otros sistemas de numeración que facilitan trabajar con esos números binarios (el octal y el hexadecimal), y vas a dar tus primeros pasos en electricidad y electrónica, entendiendo conceptos como la corriente, el voltaje y la resistencia — ideas que necesitarás una y otra vez a lo largo de toda la técnica. Cerramos el periodo viendo cómo funciona la telefonía móvil e internet móvil, y dando los primeros pasos para planear tu proyecto de grado.',
    subtemas:[
      {icon:'<i class="bi bi-123"></i>', label:'Sistemas de numeración', text:'El sistema binario usa solo dos símbolos (0 y 1) porque así "piensan" los circuitos de un computador: con corriente (1) o sin corriente (0). El sistema octal usa 8 símbolos (0 al 7) y el hexadecimal usa 16 (0 al 9, y después A, B, C, D, E, F) — estos dos existen porque son más cortos de escribir que un número binario larguísimo, y los programadores los usan para representar colores, direcciones de memoria y mucho más. Aprenderás a convertir números de un sistema a otro, entendiendo que cada sistema es simplemente "otra forma de contar lo mismo".',
        videos:[{id:'VW-HXvlVOII', title:'Código binario explicado para niños'},{id:'Nrb8DVriCpA', title:'Sistema binario explicado paso a paso'}],
        fc:[{t:'Binario', d:'Sistema que usa solo 0 y 1'},{t:'Octal', d:'Sistema que usa 8 símbolos, del 0 al 7'},{t:'Hexadecimal', d:'Sistema que usa 16 símbolos: 0-9 y A-F'}],
        tf:[{s:'El sistema binario usa diez símbolos diferentes.', v:false},{s:'El hexadecimal se usa para representar colores y direcciones de memoria.', v:true},{s:'Convertir un número de un sistema a otro es imposible.', v:false}],
        mq:[{q:'¿Cuántos símbolos usa el sistema octal?', opts:['8','2','16','10'], correct:0},{q:'El sistema binario representa la corriente eléctrica como...', opts:['0 y 1','Colores','Letras','Sonidos'], correct:0}]},
      {icon:'<i class="bi bi-lightning-charge-fill"></i>', label:'Electricidad y electrónica', text:'Antes de armar o reparar cualquier equipo, necesitas entender la electricidad que lo hace funcionar. La carga eléctrica es la propiedad de la materia que produce fuerzas eléctricas; la resistencia es lo que se opone al paso de la corriente; la tensión (o voltaje) es la fuerza que "empuja" los electrones; la corriente es el flujo de esos electrones; y la potencia y la energía indican cuánto trabajo puede hacer esa electricidad. Estos cinco conceptos son la base de toda la electrónica que verás en los próximos periodos.',
        videos:[{id:'4VemysIlDAc', title:'¿Qué es el voltaje, la corriente y la resistencia?'},{id:'wHQrMuJAjak', title:'Ley de Ohm, explicación fácil'}],
        fc:[{t:'Voltaje', d:'Fuerza que empuja los electrones'},{t:'Corriente', d:'Flujo de electrones'},{t:'Resistencia', d:'Lo que se opone al paso de la corriente'}],
        tf:[{s:'La potencia indica cuánto trabajo puede hacer la electricidad.', v:true},{s:'La carga eléctrica no tiene relación con la materia.', v:false},{s:'La resistencia ayuda a que la corriente fluya sin ningún obstáculo.', v:false}],
        mq:[{q:'¿Qué mide el voltaje?', opts:['La fuerza que empuja los electrones','El color del cable','El tamaño del computador','La velocidad del internet'], correct:0},{q:'La corriente eléctrica es...', opts:['El flujo de electrones','Un tipo de pantalla','Un programa','Un mouse'], correct:0}]},
      {icon:'<i class="bi bi-phone-fill"></i>', label:'Telefonía', text:'La telefonía móvil te permite comunicarte sin cables, usando antenas y ondas de radio que conectan tu celular con una red. El internet móvil funciona de manera parecida, permitiendo navegar, ver videos y comunicarte a través de esa misma red inalámbrica, sin depender de un cable físico conectado a tu casa.',
        videos:[{id:'tmjmXQbHOJA', title:'Cómo funciona el teléfono móvil'},{id:'VU_wXCUb3nk', title:'¿Cómo funciona la telefonía móvil?'}],
        fc:[{t:'Telefonía móvil', d:'Comunicación sin cables usando antenas y ondas de radio'},{t:'Internet móvil', d:'Navegar usando la red inalámbrica del celular'},{t:'Antena', d:'Conecta el celular con la red'}],
        tf:[{s:'La telefonía móvil depende de un cable físico conectado a la casa.', v:false},{s:'El internet móvil usa la misma red inalámbrica que la telefonía móvil.', v:true}],
        mq:[{q:'La telefonía móvil permite comunicarse...', opts:['Sin cables','Solo por escrito','Solo con internet fijo','Nunca'], correct:0},{q:'¿Qué conecta el celular con la red móvil?', opts:['Las antenas','El teclado','El mouse','La impresora'], correct:0}]},
      {icon:'<i class="bi bi-pencil-square"></i>', label:'Anteproyecto', text:'Aquí das tus primeros pasos para planear tu proyecto de grado: eliges un problema real que quieras resolver con tecnología, estudias si es posible hacerlo (factibilidad), y piensas en cómo afecta tanto a las personas como al medio ambiente. También aprenderás a leer manuales técnicos, tanto en español como en inglés.',
        videos:[{id:'MYXqlGdcEes', title:'Cómo hacer el anteproyecto de investigación'},{id:'zPTcMPf-jjw', title:'Elaborar un anteproyecto de forma sencilla'}],
        fc:[{t:'Factibilidad', d:'Estudiar si el proyecto se puede realizar'},{t:'Problema', d:'Situación real que el proyecto busca resolver'},{t:'Manual técnico', d:'Documento que explica cómo usar o instalar algo'}],
        tf:[{s:'El anteproyecto ayuda a planear el proyecto de grado antes de desarrollarlo.', v:true},{s:'No es necesario pensar en el impacto ambiental del proyecto.', v:false}],
        mq:[{q:'La factibilidad estudia si el proyecto...', opts:['Se puede realizar','Es divertido','Tiene colores bonitos','Es gratis'], correct:0},{q:'El anteproyecto de grado se hace...', opts:['Antes de desarrollar el proyecto final','Después de graduarse','Nunca','Al mismo tiempo que se nace'], correct:0}]}
    ],
    game:{ word:'BINARIO', bombCount:6 },
    dragline:[
      {a:'Binario', b:'Sistema que usa solo 0 y 1'},
      {a:'Octal', b:'Sistema que usa 8 símbolos (0 al 7)'},
      {a:'Hexadecimal', b:'Sistema que usa 16 símbolos (0-9 y A-F)'},
      {a:'Voltaje', b:'La fuerza que empuja la electricidad'}
    ],
    quiz:[
      {q:'¿Qué números usa el sistema binario?', opts:['0 y 1','0 al 9','A a la Z','1 al 100'], correct:0},
      {q:'¿Qué es el voltaje?', opts:['La fuerza de la electricidad','Un programa','Un cable','Un color'], correct:0},
      {q:'Además del binario, ¿qué otro sistema de numeración existe?', opts:['Hexadecimal','Romano','Chino','Maya'], correct:0},
      {q:'Los computadores entienden mejor...', opts:['Números binarios','Palabras en español','Dibujos','Sonidos'], correct:0},
      {q:'¿Qué significa "bit"?', opts:['Dígito binario','Un tipo de cable','Una pantalla','Un mouse'], correct:0},
      {q:'La resistencia eléctrica se mide en...', opts:['Ohmios','Metros','Litros','Kilos'], correct:0},
      {q:'¿Cuántos símbolos usa el sistema hexadecimal?', opts:['16','8','2','10'], correct:0},
      {q:'La telefonía móvil permite...', opts:['Comunicarse sin cables','Solo usar internet fijo','Nada','Imprimir documentos'], correct:0}
    ]
  },
  {
    id:'algoritmos', grado:10, period:'Periodo II', name:'Algoritmos y Programación', icon:'<i class="bi bi-diagram-3-fill"></i>',
    theory:'En este periodo vas a aprender a pensar como un programador antes de escribir una sola línea de código. Todo programa, por complejo que sea, comienza siendo un algoritmo: una lista de pasos ordenados y precisos para resolver un problema, muy parecida a una receta de cocina. La diferencia es que un computador necesita instrucciones extremadamente claras, sin ambigüedades. Para no perdernos entre tantos pasos, usamos el diagrama de flujo, una forma de dibujar el algoritmo con figuras geométricas (óvalos para inicio y fin, rectángulos para procesos, rombos para decisiones) conectadas con flechas que muestran el camino a seguir. Una vez el algoritmo está bien planeado, lo convertimos en código real usando un lenguaje de programación como C++ o Python, donde aprenderás sobre variables (espacios que guardan información), constantes (valores que nunca cambian) y ciclos repetitivos (instrucciones que se repiten muchas veces sin tener que escribirlas una por una). Además, seguirás avanzando en tu anteproyecto de grado, definiendo el título, los objetivos y el cronograma de tu propuesta.',
    subtemas:[
      {icon:'<i class="bi bi-puzzle-fill"></i>', label:'Diagrama de flujo', text:'Un diagrama de flujo es la forma gráfica de mostrar un algoritmo, usando símbolos estandarizados: un óvalo marca el inicio o el final, un rectángulo representa un proceso o una acción, un rombo representa una decisión (sí/no), y un paralelogramo representa la entrada o salida de datos. Todo se conecta con flechas que muestran el orden exacto en que deben ejecutarse los pasos. Aprender a dibujar bien un diagrama de flujo facilita muchísimo escribir el programa después, porque ya tienes la lógica resuelta en papel.',
        videos:[{id:'9JUOpyanbeY', title:'Ejemplos de algoritmos y diagramas de flujo'},{id:'QouWtBY1_uU', title:'Diagrama de flujo: la representación gráfica de un algoritmo'}],
        fc:[{t:'Óvalo', d:'Marca el inicio o el final'},{t:'Rectángulo', d:'Representa un proceso o acción'},{t:'Rombo', d:'Representa una decisión (sí/no)'}],
        tf:[{s:'Un diagrama de flujo usa figuras y flechas para mostrar el orden de los pasos.', v:true},{s:'El rombo representa siempre el inicio del programa.', v:false},{s:'Planear en papel facilita escribir el programa después.', v:true}],
        mq:[{q:'¿Qué figura representa una decisión?', opts:['El rombo','El óvalo','El rectángulo','El paralelogramo'], correct:0},{q:'Un diagrama de flujo sirve para...', opts:['Planear un algoritmo antes de programar','Borrar archivos','Conectar el internet','Imprimir documentos'], correct:0}]},
      {icon:'<i class="bi bi-laptop"></i>', label:'Programación en C++ y Python', text:'C++ y Python son dos lenguajes de programación muy usados: C++ es más cercano a cómo funciona la máquina por dentro (por eso se usa mucho en sistemas que necesitan ser muy rápidos), mientras que Python tiene una sintaxis más sencilla de leer, ideal para aprender lógica de programación. En ambos aprenderás sobre variables (donde guardas un dato que puede cambiar, como la edad de una persona), constantes (un valor que nunca cambia, como el número Pi) y ciclos repetitivos (estructuras como "for" o "while" que repiten una acción muchas veces sin que tengas que escribirla una y otra vez).',
        videos:[{id:'DX9EgllsbSw', title:'Fundamentos de programación: variables y constantes'},{id:'vHKWMR2WaIQ', title:'Programación en C++: ciclos o bucles'}],
        fc:[{t:'Variable', d:'Espacio que guarda un dato que puede cambiar'},{t:'Constante', d:'Valor que nunca cambia'},{t:'Ciclo repetitivo', d:'Repite una acción varias veces'}],
        tf:[{s:'Python tiene una sintaxis más sencilla de leer que C++.', v:true},{s:'Una constante puede cambiar su valor durante el programa.', v:false},{s:'Un ciclo "for" o "while" repite instrucciones automáticamente.', v:true}],
        mq:[{q:'¿Qué guarda una variable?', opts:['Un dato que puede cambiar','Un color','Un cable','Una imagen fija'], correct:0},{q:'C++ se usa mucho porque...', opts:['Es rápido y cercano al funcionamiento de la máquina','Es el único lenguaje que existe','No sirve para programar','Es un sistema operativo'], correct:0}]},
      {icon:'<i class="bi bi-pencil-square"></i>', label:'Anteproyecto', text:'Sigues construyendo tu propuesta de proyecto de grado: defines el título definitivo, escribes un resumen claro de qué vas a hacer, planteas tus objetivos general y específicos, delimitas hasta dónde llega tu proyecto (alcances) y qué no vas a cubrir (limitaciones), describes las actividades que vas a realizar, armas un cronograma con fechas, y empiezas a recopilar la bibliografía que vas a usar.',
        videos:[{id:'MYXqlGdcEes', title:'Cómo hacer el anteproyecto de investigación'},{id:'zPTcMPf-jjw', title:'Elaborar un anteproyecto de forma sencilla'}],
        fc:[{t:'Objetivo general', d:'Lo que se quiere lograr con el proyecto'},{t:'Alcance', d:'Hasta dónde llega el proyecto'},{t:'Cronograma', d:'Calendario con las fechas de las actividades'}],
        tf:[{s:'El anteproyecto incluye objetivos, alcances y limitaciones.', v:true},{s:'El cronograma no necesita fechas.', v:false}],
        mq:[{q:'El anteproyecto de grado sirve para...', opts:['Planear el proyecto antes de desarrollarlo','Formatear el computador','Instalar Windows','Ver videos'], correct:0},{q:'Las limitaciones de un proyecto indican...', opts:['Qué no se va a cubrir','El color del informe','El nombre del autor','La marca del computador'], correct:0}]}
    ],
    game:{ word:'ALGORITMO', bombCount:7 },
    dragline:[
      {a:'Algoritmo', b:'Lista de pasos ordenados'},
      {a:'Diagrama de flujo', b:'Dibujo que muestra los pasos'},
      {a:'Variable', b:'Espacio que guarda un valor'},
      {a:'Ciclo repetitivo', b:'Repite una acción varias veces'}
    ],
    quiz:[
      {q:'Un algoritmo es...', opts:['Una lista de pasos ordenados','Un dibujo sin sentido','Un cable','Una pantalla'], correct:0},
      {q:'¿Qué usamos para planear un algoritmo antes de programar?', opts:['Un diagrama de flujo','Una impresora','Un mouse','Un cable de red'], correct:0},
      {q:'¿Cuál es un lenguaje de programación?', opts:['Python','Español','Inglés','Binario'], correct:0},
      {q:'Si el orden de los pasos está mal...', opts:['El resultado puede salir mal','No importa','Siempre funciona','Se arregla solo'], correct:0},
      {q:'Una variable en programación es...', opts:['Un espacio que guarda un valor','Un color','Un cable','Un mouse'], correct:0},
      {q:'Un ciclo repetitivo sirve para...', opts:['Repetir una acción varias veces','Borrar el programa','Apagar el computador','Nada'], correct:0},
      {q:'Además de C++, ¿qué otro lenguaje aprenderás?', opts:['Python','Binario puro','Ninguno','Español'], correct:0},
      {q:'Una constante es un valor que...', opts:['No cambia durante el programa','Cambia todo el tiempo','Es un color','Es un cable'], correct:0}
    ]
  },
  {
    id:'arquitectura', grado:10, period:'Periodo III', name:'Arquitectura y Mantenimiento', icon:'<i class="bi bi-pc-display-horizontal"></i>',
    theory:'En este periodo abrimos (con cuidado) la "carcasa" del computador para entender cómo está organizado por dentro y cómo cuidarlo correctamente. La arquitectura de un computador es la forma en que se organizan e interconectan todas sus partes: el hardware (piezas físicas), los componentes eléctricos que lo alimentan, y los periféricos que usamos para interactuar con él, como el teclado, el mouse o la impresora. También profundizarás en fundamentos de electricidad aplicados directamente a los equipos: la diferencia entre alimentación de corriente alterna (AC) y corriente directa (DC), la importancia del polo a tierra para evitar accidentes, y cómo protegerse de la electricidad estática que puede dañar componentes delicados. Aprenderás a interpretar planos de instalación y manuales de procedimiento, algo esencial para cualquier técnico. El corazón de este periodo es el mantenimiento de computadores, que se divide en tres tipos: preventivo (limpiar y revisar antes de que algo falle), predictivo (anticiparse a una falla analizando el comportamiento del equipo) y correctivo (reparar después de que ya ocurrió el problema). Para hacer todo esto de forma segura y precisa usarás instrumentos de medición como el voltímetro, el amperímetro, el generador de señales, el osciloscopio y la pinza multifunción.',
    subtemas:[
      {icon:'<i class="bi bi-pc-display"></i>', label:'Arquitectura de computadores', text:'Se refiere a cómo están organizadas todas las piezas del computador: el procesador (que ejecuta las instrucciones), la memoria RAM (donde se guardan los datos mientras el equipo está encendido), el disco duro o SSD (donde se guarda la información de forma permanente), la tarjeta madre (que conecta todo entre sí), la fuente de poder (que entrega la electricidad correcta a cada componente), y los periféricos (dispositivos externos como el teclado, el mouse, el monitor o la impresora).',
        videos:[{id:'rlMReK7rfTo', title:'Partes del computador (hardware)'},{id:'hcBZes1wViA', title:'Partes del computador, explicadas fácil'}],
        fc:[{t:'Procesador', d:'Ejecuta las instrucciones del computador'},{t:'RAM', d:'Guarda datos mientras el equipo está encendido'},{t:'Tarjeta madre', d:'Conecta todos los componentes entre sí'}],
        tf:[{s:'El disco duro guarda la información de forma permanente.', v:true},{s:'La fuente de poder entrega la electricidad correcta a cada componente.', v:true},{s:'El mouse es parte de la tarjeta madre.', v:false}],
        mq:[{q:'¿Qué hace el procesador?', opts:['Ejecuta las instrucciones','Guarda información para siempre','Imprime documentos','Da estilo a la página'], correct:0},{q:'Un periférico es...', opts:['Un dispositivo externo como el teclado','El procesador','La memoria RAM','Un cable interno'], correct:0}]},
      {icon:'<i class="bi bi-wrench-adjustable"></i>', label:'Mantenimiento', text:'El mantenimiento preventivo se hace de forma periódica, antes de que aparezca cualquier problema: limpiar el polvo, revisar cables, verificar temperaturas. El mantenimiento predictivo usa herramientas de monitoreo para anticipar cuándo es probable que falle una pieza, basándose en su comportamiento (por ejemplo, un disco duro que empieza a hacer ruidos raros). El mantenimiento correctivo es el que se hace cuando el daño ya ocurrió: identificar la falla exacta y repararla o cambiar la pieza dañada. Los tres tipos son complementarios y un buen técnico sabe cuándo aplicar cada uno.',
        videos:[{id:'ga4CVIFdzuI', title:'Mantenimiento preventivo hardware y software'},{id:'xsHfhDALj8w', title:'Tipos de mantenimiento: correctivo, preventivo y predictivo'}],
        fc:[{t:'Preventivo', d:'Se hace antes de que algo falle'},{t:'Predictivo', d:'Anticipa una falla analizando el comportamiento'},{t:'Correctivo', d:'Repara después de que ya ocurrió el problema'}],
        tf:[{s:'El mantenimiento preventivo se hace de forma periódica.', v:true},{s:'El mantenimiento correctivo se hace antes de que exista una falla.', v:false}],
        mq:[{q:'El mantenimiento predictivo busca...', opts:['Anticiparse a una falla','Ignorar el problema','Dañar el equipo','Nada'], correct:0},{q:'¿Qué mantenimiento se hace cuando el equipo ya falló?', opts:['Correctivo','Preventivo','Predictivo','Ninguno'], correct:0}]},
      {icon:'<i class="bi bi-rulers"></i>', label:'Instrumentos de medición', text:'El voltímetro mide la diferencia de tensión (voltaje) entre dos puntos de un circuito. El amperímetro mide la intensidad de corriente que fluye. El generador de señales produce ondas eléctricas de prueba para verificar que un circuito responde correctamente. El osciloscopio muestra gráficamente cómo cambia una señal eléctrica en el tiempo, siendo clave para diagnosticar problemas complejos. La pinza multifunción combina varias de estas mediciones en una sola herramienta portátil, muy usada en el trabajo de campo.',
        videos:[{id:'VDYnGJQjL6s', title:'Cómo usar un multímetro digital para principiantes'},{id:'WjIxLcG8uw4', title:'¿Cómo usar el multímetro? Guía para principiantes'}],
        fc:[{t:'Voltímetro', d:'Mide la diferencia de tensión (voltaje)'},{t:'Amperímetro', d:'Mide la intensidad de corriente'},{t:'Osciloscopio', d:'Muestra gráficamente cómo cambia una señal en el tiempo'}],
        tf:[{s:'La pinza multifunción combina varias mediciones en una sola herramienta.', v:true},{s:'El generador de señales sirve para cortar cables.', v:false}],
        mq:[{q:'¿Qué instrumento mide el voltaje?', opts:['El voltímetro','El teclado','El mouse','La impresora'], correct:0},{q:'El osciloscopio es útil para...', opts:['Diagnosticar problemas viendo señales eléctricas','Escuchar música','Navegar en internet','Nada'], correct:0}]}
    ],
    game:{ word:'HARDWARE', bombCount:6 },
    dragline:[
      {a:'Hardware', b:'Partes físicas del computador'},
      {a:'Mantenimiento preventivo', b:'Se hace antes de que algo falle'},
      {a:'Mantenimiento correctivo', b:'Se hace después de una falla'},
      {a:'Voltímetro', b:'Mide la electricidad'}
    ],
    quiz:[
      {q:'La arquitectura de un computador es...', opts:['Cómo están organizadas sus partes','Un edificio','Un programa','Un cable'], correct:0},
      {q:'¿Qué instrumento mide la electricidad?', opts:['El voltímetro','El mouse','El teclado','El parlante'], correct:0},
      {q:'El mantenimiento sirve para...', opts:['Cuidar el computador y evitar daños','Dañar el computador','Apagarlo para siempre','Nada'], correct:0},
      {q:'¿Cuál es una parte del hardware?', opts:['El procesador','Un archivo de texto','Una página web','Un correo'], correct:0},
      {q:'El mantenimiento predictivo busca...', opts:['Anticiparse a una falla antes de que ocurra','Esperar a que se dañe','Ignorar el problema','Nada'], correct:0},
      {q:'Un periférico es...', opts:['Un dispositivo externo como el mouse o la impresora','Solo el procesador','Un programa','Un cable de red'], correct:0},
      {q:'El osciloscopio sirve para...', opts:['Ver señales eléctricas en una gráfica','Escuchar música','Imprimir documentos','Navegar en internet'], correct:0},
      {q:'El mantenimiento correctivo se hace cuando...', opts:['El equipo ya presenta una falla','Todo funciona bien','Nunca es necesario','Antes de comprarlo'], correct:0}
    ]
  },
  {
    id:'sistemasop', grado:10, period:'Periodo IV', name:'Sistemas Operativos', icon:'<i class="bi bi-hdd-fill"></i>',
    theory:'En este último periodo del Grado Décimo aprenderás sobre el programa más importante de cualquier computador: el sistema operativo. Es el software principal que administra todo el hardware y permite que los demás programas funcionen, organizando la memoria, los archivos y la comunicación entre el usuario y la máquina. Verás las funciones que cumple un sistema operativo, los distintos tipos que existen, y los más comunes en el mercado (como Windows, Linux o macOS). Profundizarás en conceptos técnicos como las particiones (formas de dividir un disco duro en secciones independientes) y el sector de arranque (la parte del disco que le dice al computador cómo iniciar). También aprenderás sobre el formateo, el proceso de borrar completamente un disco y prepararlo con un sistema de archivos como NTFS, FAT o FAT32 — cada uno con sus propias ventajas según el uso que se le vaya a dar. Verás las partes del computador desde el punto de vista lógico (el software), y los distintos tipos de licencia que puede tener un programa (gratuito, de pago, de código abierto). El periodo cierra con la sustentación de tu anteproyecto de grado, así que trabajarás técnicas de redacción de informes técnicos siguiendo normas como IEEE, Icontec o APA.',
    subtemas:[
      {icon:'<i class="bi bi-floppy-fill"></i>', label:'Sistemas operativos', text:'Un sistema operativo es el programa que se ejecuta primero al encender un computador y que administra todos los recursos: qué programa usa el procesador en cada momento, dónde se guarda cada archivo, cómo se comunica el equipo con el teclado, el mouse o la pantalla. Sin sistema operativo, el hardware no sabría qué hacer. Windows, Linux y macOS son los sistemas operativos más comunes para computadores, mientras que Android e iOS dominan en celulares.',
        videos:[{id:'TERrKrQzXks', title:'Qué es el sistema operativo (para primaria)'},{id:'NBOdGiWAjis', title:'¿Qué es un sistema operativo? Explicación fácil'}],
        fc:[{t:'Sistema operativo', d:'Programa que administra todos los recursos del equipo'},{t:'Windows', d:'Sistema operativo muy usado en computadores'},{t:'Android', d:'Sistema operativo muy usado en celulares'}],
        tf:[{s:'Sin sistema operativo, el hardware no sabría qué hacer.', v:true},{s:'Linux y macOS también son sistemas operativos.', v:true}],
        mq:[{q:'¿Qué hace el sistema operativo?', opts:['Administra todos los recursos del equipo','Solo imprime documentos','Solo reproduce música','Nada'], correct:0},{q:'¿Cuál es un sistema operativo para celulares?', opts:['Android','Word','Excel','Chrome'], correct:0}]},
      {icon:'<i class="bi bi-folder-fill"></i>', label:'Formateo', text:'Formatear significa preparar un disco para guardar información, borrando todo lo que tenía antes y organizándolo según un sistema de archivos: NTFS (usado por Windows, permite archivos muy grandes y más seguridad), FAT (uno de los sistemas más antiguos y simples) o FAT32 (una versión mejorada de FAT, muy compatible entre distintos dispositivos, pero con límite en el tamaño de archivo). Formatear es un proceso delicado porque borra TODA la información, así que siempre se debe respaldar lo importante antes de hacerlo.',
        videos:[{id:'DZCtifxMpk8', title:'Formatea USB o disco rápido: FAT32, exFAT, NTFS'},{id:'fXZgeaz3AKk', title:'Sistemas de archivos FAT32, NTFS, exFAT'}],
        fc:[{t:'Formatear', d:'Borrar todo y preparar el disco con un sistema de archivos'},{t:'NTFS', d:'Sistema de archivos de Windows, permite archivos grandes'},{t:'FAT32', d:'Versión mejorada de FAT, muy compatible entre dispositivos'}],
        tf:[{s:'Formatear borra toda la información del disco.', v:true},{s:'FAT32 no tiene ningún límite de tamaño de archivo.', v:false}],
        mq:[{q:'Antes de formatear es importante...', opts:['Respaldar la información importante','Desconectar todo para siempre','Romper el disco','No hacer nada'], correct:0},{q:'¿Qué sistema de archivos usa Windows normalmente?', opts:['NTFS','PDF','MP3','JPG'], correct:0}]},
      {icon:'<i class="bi bi-file-earmark-text-fill"></i>', label:'Informes técnicos', text:'Un buen técnico no solo sabe hacer el trabajo, también sabe explicarlo por escrito. Aprenderás a redactar informes técnicos claros y organizados, aplicando normas de citación y formato como IEEE (muy usada en ingeniería), Icontec (estándar colombiano) o APA (muy usada en ciencias sociales), según lo que pida cada trabajo o tu proyecto de grado.',
        videos:[{id:'gNTfdcMkKGk', title:'Cómo hacer citas y referencias según normas APA 7'},{id:'0Zhr3qs1hm4', title:'Cómo citar un video de YouTube en APA 7'}],
        fc:[{t:'APA', d:'Norma muy usada en ciencias sociales'},{t:'IEEE', d:'Norma muy usada en ingeniería'},{t:'Icontec', d:'Estándar colombiano de presentación de trabajos'}],
        tf:[{s:'Un informe técnico debe ser claro y organizado.', v:true},{s:'Las normas de citación no importan en un informe técnico.', v:false}],
        mq:[{q:'¿Qué norma es un estándar colombiano?', opts:['Icontec','APA','IEEE','HTML'], correct:0},{q:'Un informe técnico sirve para...', opts:['Explicar por escrito el trabajo realizado','Borrar el disco','Formatear el computador','Nada'], correct:0}]}
    ],
    game:{ word:'FORMATEO', bombCount:7 },
    dragline:[
      {a:'Sistema operativo', b:'Programa principal que controla el equipo'},
      {a:'Formatear', b:'Borrar todo y dejar el equipo como nuevo'},
      {a:'NTFS', b:'Un sistema de archivos de Windows'},
      {a:'Licencia', b:'Permiso legal para usar un programa'}
    ],
    quiz:[
      {q:'El sistema operativo es...', opts:['El programa principal que hace funcionar el computador','Un cable','Un mouse','Una impresora'], correct:0},
      {q:'¿Cuál es un ejemplo de sistema operativo?', opts:['Windows','Word','YouTube','WhatsApp'], correct:0},
      {q:'Formatear un computador significa...', opts:['Borrar todo y dejarlo como nuevo','Prenderlo','Apagarlo','Limpiarlo con agua'], correct:0},
      {q:'El sistema operativo organiza...', opts:['Los archivos y programas','Solo los colores','Solo la música','Nada'], correct:0},
      {q:'NTFS y FAT32 son...', opts:['Sistemas de archivos','Tipos de mouse','Colores de pantalla','Marcas de computador'], correct:0},
      {q:'Antes de formatear es importante...', opts:['Respaldar la información importante','Romper el computador','No hacer nada','Desconectar todo para siempre'], correct:0},
      {q:'Una licencia de software indica...', opts:['Si el programa se puede usar legalmente','El color del programa','El tamaño de la pantalla','Nada'], correct:0},
      {q:'Un informe técnico debe ser...', opts:['Claro y organizado','Confuso','Muy corto sin explicar nada','Solo con dibujos'], correct:0}
    ]
  },
  /* ---------- GRADO ONCE ---------- */
  {
    id:'arduino', grado:11, period:'Periodo I', name:'Arduino y Robótica', icon:'<i class="bi bi-cpu-fill"></i>',
    theory:'En este periodo das el salto de la teoría a crear tus propios objetos interactivos usando Arduino, una tarjeta electrónica de hardware y software libre que se puede programar para percibir el mundo (a través de sensores) y actuar sobre él (a través de actuadores como motores o luces). Conocerás en detalle la tarjeta Arduino Uno, entendiendo qué hace cada uno de sus componentes. Aprenderás sobre señales analógicas (que pueden tomar cualquier valor dentro de un rango, como la temperatura) y señales digitales (que solo tienen dos estados, encendido o apagado). Practicarás con salidas digitales como encender y apagar un LED, hacer una secuencia de 3 LEDs, generar sonidos, o activar un motor DC; y con entradas digitales como leer el estado de un botón (push button). También trabajarás con entradas analógicas, leyendo una fotocelda (sensor de luz), una resistencia variable o potenciómetro, y un joystick; y con salidas analógicas usando señales PWM para variar la intensidad de un LED o la velocidad de un motor. Conocerás sensores de temperatura, humedad, movimiento y ultrasonido, además de actuadores como motores DC, motores paso a paso y servomotores, y aprenderás a usar un display de cristal líquido para mostrar información. Todo este conocimiento lo aplicarás en un proyecto real: un carro seguidor de línea.',
    subtemas:[
      {icon:'<i class="bi bi-plug-fill"></i>', label:'Tarjeta Arduino', text:'Arduino Uno es una placa con un microcontrolador (un pequeño "cerebro" programable), pines digitales y analógicos para conectar sensores y actuadores, un puerto USB para programarla desde el computador, y un regulador de voltaje que asegura que todo funcione con la energía correcta. Su software (el IDE de Arduino) te permite escribir el código, llamado "sketch", y cargarlo directamente en la placa.',
        videos:[{id:'lLIJL7x4HjA', title:'Cómo funciona un Arduino, explicado fácil'},{id:'Z3BNaeNWhhU', title:'¿Qué es un Arduino? Clase 1'}],
        fc:[{t:'Microcontrolador', d:'El "cerebro" programable de la placa'},{t:'Sketch', d:'El código que se escribe y carga en Arduino'},{t:'Puerto USB', d:'Permite programar la placa desde el computador'}],
        tf:[{s:'Arduino Uno tiene pines digitales y analógicos.', v:true},{s:'El sketch es una imagen que se sube a Arduino.', v:false}],
        mq:[{q:'¿Qué es Arduino?', opts:['Una tarjeta electrónica programable','Un mouse','Un programa de dibujo','Un cable'], correct:0},{q:'El código de Arduino se llama...', opts:['Sketch','Word','PDF','Excel'], correct:0}]},
      {icon:'<i class="bi bi-lightbulb-fill"></i>', label:'Entradas y salidas', text:'Las salidas digitales solo tienen dos estados (encendido/apagado), como un LED que prendes y apagas, o una secuencia de varios LEDs. Las entradas digitales leen ese mismo tipo de señal desde afuera, como saber si un botón está presionado o no. Las entradas analógicas pueden leer un rango completo de valores, como la cantidad de luz que capta una fotocelda, la posición de un potenciómetro, o la dirección de un joystick. Las salidas analógicas usan una técnica llamada PWM para simular distintos niveles de intensidad, por ejemplo variando el brillo de un LED o la velocidad de un motor DC.',
        videos:[{id:'ZUN2IABicVg', title:'Encender un LED con un pulsador'},{id:'jQR3IYY63wg', title:'Arduino: encender y apagar un LED con un pulsador'}],
        fc:[{t:'Salida digital', d:'Solo tiene dos estados: encendido o apagado'},{t:'Entrada analógica', d:'Puede leer un rango completo de valores'},{t:'PWM', d:'Técnica para simular distintos niveles de intensidad'}],
        tf:[{s:'Un botón (push button) es un ejemplo de entrada digital.', v:true},{s:'Una fotocelda es un ejemplo de salida digital.', v:false}],
        mq:[{q:'Encender y apagar un LED es un ejemplo de...', opts:['Salida digital','Entrada analógica','Sistema operativo','Formateo'], correct:0},{q:'El PWM sirve para...', opts:['Variar la intensidad de una señal','Borrar el programa','Apagar el computador','Nada'], correct:0}]},
      {icon:'<i class="bi bi-car-front-fill"></i>', label:'Proyecto', text:'Todo lo aprendido se aplica en un proyecto real y motivador: un carro seguidor de línea, un pequeño robot que usa sensores para detectar una línea pintada en el suelo y ajustar sus motores automáticamente para seguirla sin salirse del camino. Este proyecto combina sensores, actuadores y programación en un solo sistema funcionando en conjunto.',
        videos:[{id:'g83Z-Ymjf7w', title:'Tutorial de seguidor de línea con CNY70 y Arduino'},{id:'NZt_MXZc_aQ', title:'Cómo hacer un robot seguidor de líneas'}],
        fc:[{t:'Sensor', d:'Detecta la línea pintada en el suelo'},{t:'Actuador', d:'Motor que mueve las ruedas del carro'},{t:'Carro seguidor de línea', d:'Proyecto que combina sensores, actuadores y programación'}],
        tf:[{s:'El carro seguidor de línea usa sensores para detectar el camino.', v:true},{s:'El proyecto final no necesita programación.', v:false}],
        mq:[{q:'¿Qué detecta el carro seguidor de línea?', opts:['Una línea pintada en el suelo','El clima','La hora','La música'], correct:0},{q:'¿Qué combina este proyecto?', opts:['Sensores, actuadores y programación','Solo dibujos','Solo texto','Solo sonido'], correct:0}]}
    ],
    game:{ word:'SENSOR', bombCount:5 },
    dragline:[
      {a:'Arduino', b:'Tarjeta electrónica programable'},
      {a:'Sensor', b:'Detecta cambios del entorno'},
      {a:'Actuador', b:'Produce un movimiento o acción'},
      {a:'PWM', b:'Varía la intensidad de una señal'}
    ],
    quiz:[
      {q:'Arduino es...', opts:['Una tarjeta electrónica programable','Un mouse','Un programa de dibujo','Un cable USB'], correct:0},
      {q:'Un sensor sirve para...', opts:['Detectar luz, temperatura o movimiento','Escuchar música','Imprimir','Navegar en internet'], correct:0},
      {q:'¿Qué puede mover un actuador como un motor?', opts:['Ruedas o brazos de un robot','Solo el mouse','Solo el teclado','Nada'], correct:0},
      {q:'Programar Arduino permite...', opts:['Encender luces y mover motores','Ver televisión','Cocinar','Dormir'], correct:0},
      {q:'Un actuador es un dispositivo que...', opts:['Produce un movimiento o acción','Solo mide temperatura','Solo se ve bonito','No hace nada'], correct:0},
      {q:'Una entrada digital puede leer...', opts:['Si un botón está presionado o no','El color del cielo','La velocidad del viento','Nada'], correct:0},
      {q:'El PWM se usa para...', opts:['Variar la intensidad de una señal','Apagar el computador','Borrar un programa','Cambiar el idioma'], correct:0},
      {q:'Un servomotor puede...', opts:['Girar a un ángulo específico','Solo encender una luz','Solo hacer sonido','Nada'], correct:0}
    ]
  },
  {
    id:'redes1', grado:11, period:'Periodo II', name:'Redes de Datos I', icon:'<i class="bi bi-hdd-network-fill"></i>',
    theory:'En este periodo entras al mundo de las redes de datos, entendiendo cómo se conectan los computadores entre sí para compartir información. Conocerás los tipos de redes según su tamaño: LAN (una red local, como la de tu colegio), MAN (una red que cubre una ciudad) y WAN (una red gigante que puede cubrir países enteros, como internet). Aprenderás sobre topologías de red, que son las distintas formas de organizar físicamente las conexiones: bus (todos los equipos comparten un mismo cable principal), estrella (todos los equipos se conectan a un punto central, como un switch) y árbol (una combinación jerárquica de varias estrellas). Estudiarás los protocolos de red, que son las "reglas del lenguaje" que usan los computadores para entenderse, especialmente TCP/IP (el protocolo base de internet) y el modelo OSI (un modelo de referencia con 7 capas que ayuda a entender cómo viaja la información). Conocerás los equipos de interconexión: hub, switch, router, módem, access point, bridge y gateway, cada uno con una función específica. También verás los medios de transmisión, tanto cableados (UTP, coaxial, fibra óptica) como inalámbricos (microondas, infrarrojos, láser, Bluetooth, Wi-Fi), y el direccionamiento IP, aprendiendo la diferencia entre IP públicas e IP privadas (clases A, B y C).',
    subtemas:[
      {icon:'<i class="bi bi-globe"></i>', label:'Tipos de redes', text:'Una LAN (Local Area Network) conecta equipos en un espacio pequeño como un salón, un edificio o un colegio, y normalmente la administra una sola organización. Una MAN (Metropolitan Area Network) cubre un área más grande, como una ciudad completa. Una WAN (Wide Area Network) conecta redes a través de países o continentes enteros — internet es el ejemplo más grande de una WAN, formada por millones de redes más pequeñas conectadas entre sí.',
        videos:[{id:'t-_ctKOPwuU', title:'Tipos de redes: LAN, MAN y WAN explicado fácil'},{id:'ASXYvGV6sqE', title:'Curso de Redes: tipos de redes, LAN y WAN'}],
        fc:[{t:'LAN', d:'Red local, como la de un colegio'},{t:'MAN', d:'Red que cubre una ciudad'},{t:'WAN', d:'Red gigante que puede cubrir países, como internet'}],
        tf:[{s:'Internet es un ejemplo de una red WAN.', v:true},{s:'Una LAN cubre países completos.', v:false}],
        mq:[{q:'Una red pequeña como la del colegio se llama...', opts:['LAN','WAN','MAN gigante','Ninguna'], correct:0},{q:'¿Qué tipo de red es internet?', opts:['WAN','LAN','Ninguna','Solo un cable'], correct:0}]},
      {icon:'<i class="bi bi-signpost-split-fill"></i>', label:'Topologías', text:'La topología de bus conecta todos los equipos a un único cable central, es simple pero si el cable falla toda la red se cae. La topología de estrella conecta cada equipo directamente a un punto central (como un switch), de forma que si un cable falla solo afecta a ese equipo, no a toda la red — es la más usada actualmente. La topología de árbol combina varias estrellas en una estructura jerárquica, útil para redes grandes con varios departamentos o pisos.',
        videos:[{id:'E-Mto1FZEes', title:'Topologías de red: bus, anillo, estrella, malla, híbrida'},{id:'zsOvCfGFWN4', title:'Topologías de redes: anillo, bus, estrella, árbol'}],
        fc:[{t:'Bus', d:'Todos los equipos comparten un mismo cable principal'},{t:'Estrella', d:'Todos los equipos se conectan a un punto central'},{t:'Árbol', d:'Combinación jerárquica de varias estrellas'}],
        tf:[{s:'En la topología de estrella, un cable dañado solo afecta a ese equipo.', v:true},{s:'En la topología de bus, si el cable falla, toda la red se cae.', v:true}],
        mq:[{q:'¿Cuál es la topología más usada actualmente?', opts:['Estrella','Bus antiguo','Ninguna','Anillo doble'], correct:0},{q:'La topología de árbol combina...', opts:['Varias estrellas','Solo un cable','Nada','Solo routers'], correct:0}]},
      {icon:'<i class="bi bi-compass-fill"></i>', label:'Direccionamiento IP', text:'Cada dispositivo conectado a una red necesita una dirección IP única, similar a la dirección de una casa, para que los datos sepan exactamente a dónde llegar. Las IP públicas son visibles desde internet y las asigna tu proveedor de servicio; las IP privadas (de clase A, B o C) se usan dentro de una red local y no son visibles directamente desde internet, lo que también ayuda a la seguridad.',
        videos:[{id:'yzFZPjWI-dg', title:'Dirección IP pública y privada: diferencias y rangos'},{id:'4WolYmbaTP8', title:'Direcciones IPv4 públicas y privadas, clases A, B, C'}],
        fc:[{t:'IP pública', d:'Visible desde internet'},{t:'IP privada', d:'Se usa dentro de una red local'},{t:'Dirección IP', d:'Identifica un dispositivo en la red, como la dirección de una casa'}],
        tf:[{s:'Las IP privadas no son visibles directamente desde internet.', v:true},{s:'Todos los dispositivos de internet comparten la misma IP.', v:false}],
        mq:[{q:'¿Quién asigna la IP pública?', opts:['El proveedor de servicio de internet','El usuario final siempre','Nadie','El teclado'], correct:0},{q:'Una IP privada se usa...', opts:['Dentro de una red local','Solo en el extranjero','Nunca','En ningún dispositivo'], correct:0}]}
    ],
    game:{ word:'TOPOLOGIA', bombCount:8 },
    dragline:[
      {a:'LAN', b:'Red pequeña, como la del colegio'},
      {a:'WAN', b:'Red gigante, como internet'},
      {a:'Router', b:'Conecta redes distintas'},
      {a:'IP', b:'Dirección única de un equipo en la red'}
    ],
    quiz:[
      {q:'Una red conecta...', opts:['Varios computadores entre sí','Solo un computador','Un lápiz y un papel','Nada'], correct:0},
      {q:'Una red pequeña como la del colegio se llama...', opts:['LAN','WAN','Internet gigante','Ninguna'], correct:0},
      {q:'La dirección IP es...', opts:['El nombre único de un computador en la red','Un color','Un sonido','Una contraseña de WiFi'], correct:0},
      {q:'Internet es un ejemplo de red...', opts:['Muy grande (WAN)','Muy pequeña','Sin computadores','Imaginaria'], correct:0},
      {q:'El protocolo TCP/IP sirve para...', opts:['Que los computadores se comuniquen en la red','Pintar la pantalla','Imprimir documentos','Nada'], correct:0},
      {q:'Un router sirve para...', opts:['Conectar redes distintas y dirigir el tráfico','Escuchar música','Guardar archivos','Nada'], correct:0},
      {q:'Una topología de estrella conecta los equipos...', opts:['A través de un punto central','En línea recta','De forma aleatoria','Sin ningún orden'], correct:0},
      {q:'Un switch sirve para...', opts:['Conectar varios dispositivos dentro de una misma red','Conectar redes distintas entre países','Imprimir','Nada'], correct:0}
    ]
  },
  {
    id:'redes2', grado:11, period:'Periodo III', name:'Redes de Datos II', icon:'<i class="bi bi-ethernet"></i>',
    theory:'Este periodo profundiza en la parte más técnica y práctica de las redes de datos. Aprenderás las normas y estándares de instalación de cableado estructurado: TIA/EIA 568 (con sus variantes 568A y 568B, que definen cómo se conectan los cables de red), ANSI/TIA 606B, ISO/IEC 14763-1 y EN 50174-1, todas ellas reglas internacionales que aseguran que una instalación de red sea segura, organizada y fácil de mantener. Usarás el simulador de redes Cisco Packet Tracer, una herramienta que te permite diseñar y probar redes completas en la pantalla del computador antes de instalarlas de verdad, entendiendo su entorno, sus elementos, el gateway (la puerta de salida de una red hacia otra), rutas estáticas (caminos fijos configurados manualmente), direccionamiento LAN, DHCP (asignación automática de direcciones IP), VLAN y VPLAN (redes virtuales dentro de una misma red física), y protocolos de enrutamiento dinámico como OSPF y EIGRP, además del protocolo VTP. El periodo también incluye la corrección de tu anteproyecto de grado, identificando posibles problemas, sustituciones y sugerencias antes de la versión final.',
    subtemas:[
      {icon:'<i class="bi bi-link-45deg"></i>', label:'Cableado estructurado', text:'Las normas TIA/EIA 568A y 568B definen el orden exacto de los colores de los cables dentro de un conector RJ45, para que cualquier técnico en el mundo pueda instalar o reparar una red siguiendo el mismo estándar. Otras normas como ANSI/TIA 606B, ISO/IEC 14763-1 y EN 50174-1 regulan la administración, etiquetado y buenas prácticas de instalación, asegurando que una red sea fácil de mantener y ampliar en el futuro.',
        videos:[{id:'Qx5rYlJj1Xk', title:'Cableado estructurado en Cisco Packet Tracer'},{id:'GXTRXdr5JK8', title:'Armado de cable de red (RJ45): normas 568A y 568B'}],
        fc:[{t:'TIA/EIA 568', d:'Norma que define el orden de colores en un conector RJ45'},{t:'RJ45', d:'Conector usado en los cables de red'},{t:'Cableado estructurado', d:'Conjunto de normas para instalar y organizar cables de red'}],
        tf:[{s:'Las normas de cableado ayudan a que la red sea fácil de mantener.', v:true},{s:'No existen normas para instalar cables de red.', v:false}],
        mq:[{q:'¿Qué define la norma TIA/EIA 568?', opts:['El orden de los colores del cable','El precio del cable','El color de la pared','Nada'], correct:0},{q:'Un cableado bien organizado ayuda a...', opts:['Que la red funcione mejor','Dañar la red','Nada','Perder tiempo'], correct:0}]},
      {icon:'<i class="bi bi-diagram-2-fill"></i>', label:'Packet Tracer', text:'Cisco Packet Tracer es un simulador que permite armar redes completas de forma virtual: agregar computadores, switches, routers, cables, y configurarlos exactamente como lo harías con equipos reales. Esto permite practicar, cometer errores y aprender sin gastar dinero en equipos ni arriesgar dañar una red real. Aprenderás sobre el gateway (la puerta de enlace que conecta tu red con otras), DHCP (que asigna direcciones IP automáticamente) y VLAN (redes virtuales que dividen lógicamente una misma red física).',
        videos:[{id:'26H5mbZbxLc', title:'Diseño físico de una red en Packet Tracer'},{id:'IE--DWzfnwU', title:'Cisco Packet Tracer: tutorial para principiantes'}],
        fc:[{t:'Packet Tracer', d:'Simulador de redes de Cisco'},{t:'Gateway', d:'Puerta de enlace que conecta una red con otra'},{t:'DHCP', d:'Asigna direcciones IP automáticamente'}],
        tf:[{s:'Packet Tracer permite practicar sin dañar equipos reales.', v:true},{s:'El DHCP asigna direcciones IP manualmente siempre.', v:false}],
        mq:[{q:'¿Para qué sirve Cisco Packet Tracer?', opts:['Simular redes en la pantalla','Editar fotos','Ver películas','Nada'], correct:0},{q:'El DHCP sirve para...', opts:['Asignar direcciones IP automáticamente','Borrar archivos','Formatear discos','Nada'], correct:0}]},
      {icon:'<i class="bi bi-signpost-2-fill"></i>', label:'Enrutamiento', text:'Una ruta estática es un camino que el administrador de la red configura manualmente para que los datos sepan exactamente por dónde ir. Los protocolos de enrutamiento dinámico, como OSPF y EIGRP, permiten que los routers descubran automáticamente las mejores rutas y se adapten solos si algo cambia en la red, sin necesitar configuración manual constante.',
        videos:[{id:'c-Tt3lpKH3A', title:'Prelaboratorio: rutas estáticas y OSPF'},{id:'vrR5l4KwpTw', title:'Configuración de rutas estáticas en Packet Tracer'}],
        fc:[{t:'Ruta estática', d:'Camino fijo configurado manualmente'},{t:'OSPF', d:'Protocolo de enrutamiento dinámico'},{t:'Router', d:'Dispositivo que dirige el tráfico entre redes'}],
        tf:[{s:'Los protocolos dinámicos permiten que los routers se adapten solos.', v:true},{s:'Una ruta estática cambia automáticamente sola.', v:false}],
        mq:[{q:'¿Qué hace un protocolo de enrutamiento dinámico?', opts:['Descubre automáticamente las mejores rutas','Borra la red','Apaga los routers','Nada'], correct:0},{q:'Una ruta estática se configura...', opts:['Manualmente por el administrador','Sola, sin ayuda','Nunca','Por el usuario final'], correct:0}]}
    ],
    game:{ word:'CABLEADO', bombCount:7 },
    dragline:[
      {a:'Cableado estructurado', b:'Normas para organizar los cables'},
      {a:'Fibra óptica', b:'Transmite datos usando luz'},
      {a:'Packet Tracer', b:'Simulador de redes de Cisco'},
      {a:'Ruta estática', b:'Camino fijo configurado a mano'}
    ],
    quiz:[
      {q:'El cableado estructurado sigue...', opts:['Normas y reglas de instalación','Ningún orden','Solo colores bonitos','Nada'], correct:0},
      {q:'Cisco Packet Tracer sirve para...', opts:['Simular redes en la pantalla','Imprimir documentos','Ver videos','Jugar'], correct:0},
      {q:'¿Por qué es útil simular una red antes de armarla?', opts:['Para practicar sin dañar equipos reales','Para perder tiempo','No sirve para nada','Para hacer ruido'], correct:0},
      {q:'Los cables de red bien organizados ayudan a...', opts:['Que la red funcione mejor','Que se vea bonito nada más','Dañar la red','Nada'], correct:0},
      {q:'La fibra óptica transmite datos usando...', opts:['Luz','Agua','Electricidad únicamente','Sonido'], correct:0},
      {q:'Una ruta estática se configura...', opts:['Manualmente por el administrador de red','Sola, sin ayuda','Por el usuario final siempre','Nunca'], correct:0},
      {q:'El estándar TIA/EIA 568 regula...', opts:['El cableado estructurado','Los colores de la ropa','El software del computador','Nada'], correct:0},
      {q:'Simular una red antes de instalarla ayuda a...', opts:['Detectar errores sin gastar en equipos reales','Perder el tiempo','Complicar el trabajo','Nada'], correct:0}
    ]
  },
  {
    id:'webdev', grado:11, period:'Periodo IV', name:'Páginas Web', icon:'<i class="bi bi-code-slash"></i>',
    theory:'En este último periodo aprenderás cómo se construyen las páginas web que usas todos los días, como esta misma. Empezarás por la historia: cómo nació internet, cómo evolucionó hacia la Web tal como la conocemos, la historia de los navegadores web que nos permiten verla, y la historia del lenguaje HTML. Entenderás qué es el desarrollo web, la arquitectura de una aplicación web (cómo se comunican el navegador y el servidor), y el diseño gráfico de una aplicación. Profundizarás en HTML, tanto en sus conceptos básicos como avanzados, incluyendo HTML5, el estándar actual. Aprenderás CSS, desde lo básico hasta conceptos avanzados y CSS3, además de conocer los frameworks de CSS (herramientas que aceleran el diseño). Darás tus primeros pasos en JavaScript, el lenguaje que le da vida e interacción a las páginas web, tanto en sus conceptos básicos como avanzados. El periodo cierra con la elaboración de tu anteproyecto de grado y una introducción a la implementación de aplicaciones en la nube, conociendo los tipos de servicios: SaaS, PaaS e IaaS. Finalmente, este es el periodo de la sustentación final de tu proyecto de grado de Media Técnica, donde demuestras todo lo aprendido durante estos dos años.',
    subtemas:[
      {icon:'<i class="bi bi-globe2"></i>', label:'Historia de internet', text:'Internet nació como un proyecto militar y académico en los años 60, pensado para conectar computadores en red incluso si parte de la red fallaba. Décadas después, en 1989, Tim Berners-Lee propuso la World Wide Web: un sistema de documentos conectados por hipervínculos, mucho más fácil de usar. A partir de ahí aparecieron los primeros navegadores web, que permitieron a cualquier persona "ver" esas páginas, y el lenguaje HTML, que definía cómo se estructuraba el contenido de cada página.',
        videos:[{id:'K_VD9X1NuUw', title:'Historia del Internet'},{id:'SNw4m1m_2GE', title:'Tim Berners-Lee: creador de la World Wide Web'}],
        fc:[{t:'World Wide Web', d:'Sistema de documentos conectados por hipervínculos'},{t:'Tim Berners-Lee', d:'Propuso la World Wide Web en 1989'},{t:'Navegador web', d:'Programa que permite ver páginas web'}],
        tf:[{s:'Internet nació como un proyecto militar y académico.', v:true},{s:'La World Wide Web y el internet son exactamente lo mismo desde el inicio.', v:false}],
        mq:[{q:'¿Quién propuso la World Wide Web?', opts:['Tim Berners-Lee','Bill Gates','Steve Jobs','Mark Zuckerberg'], correct:0},{q:'Un navegador web sirve para...', opts:['Ver páginas web en internet','Imprimir documentos','Escuchar música únicamente','Nada'], correct:0}]},
      {icon:'<i class="bi bi-building"></i>', label:'HTML y CSS', text:'HTML (HyperText Markup Language) es el lenguaje que arma el "esqueleto" de una página: títulos, párrafos, imágenes, botones, enlaces. Cada elemento se marca con etiquetas, como &lt;h1&gt; para un título grande o &lt;p&gt; para un párrafo. CSS (Cascading Style Sheets) le da estilo a ese esqueleto: colores, tamaños, espacios, animaciones. Con CSS3 (la versión actual) se pueden lograr diseños muy sofisticados, y existen frameworks de CSS (conjuntos de reglas ya hechas) que aceleran mucho el trabajo de diseño.',
        videos:[{id:'ELSm-G201Ls', title:'Curso de HTML y CSS desde cero'},{id:'X5usDXtXt18', title:'HTML desde cero: etiquetas y estructura básica'}],
        fc:[{t:'HTML', d:'Arma el esqueleto de una página web'},{t:'CSS', d:'Da estilo: colores, tamaños y espacios'},{t:'Etiqueta', d:'Marca cada elemento del contenido en HTML'}],
        tf:[{s:'CSS3 permite lograr diseños muy sofisticados.', v:true},{s:'HTML se encarga de dar color a la página.', v:false}],
        mq:[{q:'El HTML se usa para...', opts:['Armar la estructura de una página web','Pintar paredes','Cocinar','Escuchar música'], correct:0},{q:'El CSS le da a la página...', opts:['Color y estilo','Solo texto sin forma','Sonido','Nada'], correct:0}]},
      {icon:'<i class="bi bi-gear-fill"></i>', label:'JavaScript', text:'Si HTML es el esqueleto y CSS es la ropa, JavaScript son los músculos: es el lenguaje que hace que la página reaccione — que un botón haga algo al hacer clic, que aparezca un mensaje, que se guarde información, o que (como en este mismo sitio) funcionen los juegos y las evaluaciones interactivas. Aprenderás conceptos básicos y avanzados de este lenguaje fundamental del desarrollo web moderno.',
        videos:[{id:'RqQ1d1qEWlE', title:'Curso JavaScript para principiantes'},{id:'8GTaO9XhA5M', title:'Aprende JavaScript en 10 minutos'}],
        fc:[{t:'JavaScript', d:'Lenguaje que da movimiento e interacción a la página'},{t:'Evento', d:'Una acción como hacer clic en un botón'},{t:'Interactividad', d:'Que la página reaccione a lo que hace el usuario'}],
        tf:[{s:'JavaScript permite que un botón haga algo al hacer clic.', v:true},{s:'JavaScript solo sirve para dar color a la página.', v:false}],
        mq:[{q:'JavaScript le da a la página...', opts:['Movimiento e interacción','Solo colores','Solo texto','Nada'], correct:0},{q:'Los juegos de este sitio funcionan gracias a...', opts:['JavaScript','Solo HTML','Solo CSS','Ninguno'], correct:0}]},
      {icon:'<i class="bi bi-cloud-fill"></i>', label:'Computación en la nube', text:'La computación en la nube permite usar programas y almacenar información a través de internet, sin necesitar instalarlo todo en tu propio computador. SaaS (Software as a Service) es un programa que usas directamente desde el navegador, como el correo electrónico. PaaS (Platform as a Service) ofrece una plataforma lista para que los desarrolladores construyan aplicaciones sin preocuparse por la infraestructura. IaaS (Infrastructure as a Service) alquila la infraestructura misma (servidores, almacenamiento) para que una empresa monte lo que necesite sobre ella.',
        videos:[{id:'9uksJU4XqlM', title:'IaaS, PaaS, SaaS: explicación rápida para principiantes'},{id:'bgEFjHMx7ec', title:'Cloud Computing explicado: fundamentos de la nube'}],
        fc:[{t:'SaaS', d:'Programa que se usa directamente desde el navegador'},{t:'PaaS', d:'Plataforma lista para construir aplicaciones'},{t:'IaaS', d:'Alquila la infraestructura misma (servidores, almacenamiento)'}],
        tf:[{s:'SaaS es un ejemplo de programa que se usa sin instalarlo.', v:true},{s:'IaaS alquila la infraestructura como servidores y almacenamiento.', v:true}],
        mq:[{q:'El correo electrónico que usas desde el navegador es un ejemplo de...', opts:['SaaS','IaaS','PaaS','Ninguno'], correct:0},{q:'¿Qué permite usar programas sin instalarlos en tu computador?', opts:['La computación en la nube','El formateo','El mantenimiento correctivo','Nada'], correct:0}]}
    ],
    game:{ word:'CODIGO', bombCount:6 },
    dragline:[
      {a:'HTML', b:'Arma la estructura de la página'},
      {a:'CSS', b:'Da color y estilo a la página'},
      {a:'JavaScript', b:'Da movimiento e interacción'},
      {a:'Nube', b:'Servicios que funcionan por internet'}
    ],
    quiz:[
      {q:'El HTML se usa para...', opts:['Armar la estructura de una página web','Pintar paredes','Cocinar','Escuchar música'], correct:0},
      {q:'El CSS le da a la página...', opts:['Color y estilo','Solo texto sin forma','Sonido','Nada'], correct:0},
      {q:'JavaScript le da a la página...', opts:['Movimiento e interacción','Solo colores','Solo texto','Nada'], correct:0},
      {q:'Con HTML, CSS y JavaScript se pueden crear...', opts:['Páginas web','Solo dibujos en papel','Solo música','Nada de eso'], correct:0},
      {q:'¿Quién propuso la World Wide Web?', opts:['Tim Berners-Lee','Bill Gates','Steve Jobs','Mark Zuckerberg'], correct:0},
      {q:'Un navegador web sirve para...', opts:['Ver páginas web en internet','Escuchar música únicamente','Imprimir documentos','Nada'], correct:0},
      {q:'SaaS significa que un programa...', opts:['Se usa desde internet sin instalarlo','Se debe instalar siempre','No funciona nunca','Es gratis siempre'], correct:0},
      {q:'Las etiquetas en HTML sirven para...', opts:['Definir la estructura del contenido','Pintar la pared','Tocar música','Nada'], correct:0}
    ]
  }
];

/* ================= ESTADO (en memoria) ================= */
const progress = {};
temas.forEach(t => progress[t.id] = { game:false, dragline:false, quiz:false, score:0 });
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

/* ================= VOZ ================= */
function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'es-ES'; u.rate = 0.95;
  window.speechSynthesis.speak(u);
}

/* ================= PESTAÑAS ================= */
function renderTabs(containerId, list, activeId, onClick){
  const el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = '';
  list.forEach(t=>{
    const btn = document.createElement('button');
    btn.className = 'tabbtn' + (t.id===activeId ? ' active':'');
    const done = progress[t.id].quiz ? ' <i class="bi bi-check-circle-fill"></i>' : '';
    const periodLbl = t.period ? `<span style="display:block; font-size:.7rem; opacity:.75;">${t.period}</span>` : '';
    btn.innerHTML = `${t.icon} ${periodLbl}${t.name}${done}`;
    btn.setAttribute('aria-pressed', t.id===activeId);
    btn.onclick = ()=> onClick(t.id);
    el.appendChild(btn);
  });
}

/* ================= PÁGINA DE GRADO: teoría + videos + 2 actividades ================= */
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

function updateStarsBadge(){
  const badge = document.querySelector('.stars-badge');
  if(badge) badge.innerHTML = `<i class="bi bi-star-fill"></i> ${totalStars} estrellas`;
  saveProgressToCloud();
}

function renderTemaPanel(){
  const panel = document.getElementById('temaPanel');
  if(!panel) return;
  const t = temaById(currentTemaTab);
  const done = progress[t.id].game;

  const subtemasHtml = (t.subtemas || []).map((s, idx) => subtemaBlockHtml(t, s, idx)).join('');

  panel.innerHTML = `
    <div class="stars-badge"><i class="bi bi-star-fill"></i> ${totalStars} estrellas</div>
    <h3>${t.icon} ${t.period ? t.period + ': ' : ''}${t.name} ${done ? '<i class="bi bi-check-circle-fill"></i>' : ''}</h3>
    <div class="theory"><span class="think"><i class="bi bi-lightbulb-fill"></i></span><div><h4>Resumen del periodo</h4><p>${t.theory}</p></div></div>
    <div class="game-controls" style="margin-top:18px; margin-bottom:8px;">
      <button class="ctrlbtn" id="btnListenTheory" type="button"><i class="bi bi-volume-up-fill"></i> Escuchar la teoría</button>
    </div>

    <h4 style="font-family:'Baloo 2'; color:var(--teal); margin-top:26px;"><i class="bi bi-journal-text"></i> Temas de este periodo</h4>
    <div style="margin-top:10px;">${subtemasHtml}</div>

    <h4 style="font-family:'Baloo 2'; color:var(--coral); margin-top:10px;"><i class="bi bi-joystick"></i> Reto del periodo: Sopa de letras</h4>
    <div class="game-controls" style="margin-top:10px;">
      <button class="ctrlbtn" id="btnListenGame1" type="button"><i class="bi bi-volume-up-fill"></i> Escuchar instrucciones</button>
      <button class="ctrlbtn" id="btnHint1" type="button"><i class="bi bi-lightbulb"></i> Pista</button>
      <button class="ctrlbtn" id="btnReset1" type="button"><i class="bi bi-arrow-clockwise"></i> Reiniciar</button>
    </div>
    <p class="sub">Haz clic en las letras en orden para formar la palabra clave de este periodo. ¡Cuidado con las bombas!</p>
    <div class="ws-progress" id="wsProgress"></div>
    <div class="ws-grid" id="wsGrid"></div>
    <div class="feedback" id="temaFeedback1" role="status" aria-live="polite"></div>

    <h4 style="font-family:'Baloo 2'; color:var(--purple); margin-top:30px;"><i class="bi bi-link-45deg"></i> Reto del periodo: Arrastra las líneas</h4>
    <div class="game-controls" style="margin-top:10px;">
      <button class="ctrlbtn" id="btnReset2" type="button"><i class="bi bi-arrow-clockwise"></i> Reiniciar</button>
    </div>
    <p class="sub">Arrastra una línea desde cada término hasta su definición correcta.</p>
    <div class="dragline-wrap" id="dlWrap">
      <svg id="dlSvg"></svg>
      <div class="match-grid">
        <div class="match-col" id="dlLeftCol"><h4>Término</h4></div>
        <div class="match-col" id="dlRightCol"><h4>Definición</h4></div>
      </div>
    </div>
    <div class="feedback" id="temaFeedback2" role="status" aria-live="polite"></div>
  `;

  document.getElementById('btnListenTheory').onclick = ()=> speak(t.theory);
  setupWordSearch(t);
  setupDragLine(t);
  (t.subtemas || []).forEach((s, idx)=>{
    setupFlashcards(`fc-${t.id}-${idx}`);
    setupTrueFalse(`tf-${t.id}-${idx}`);
    setupMiniQuiz(`mq-${t.id}-${idx}`);
  });
}

/* ================= SUBTEMA: bloque de videos + 3 actividades ================= */
function subtemaBlockHtml(t, s, idx){
  const videosHtml = (s.videos || []).map(v => `
    <div class="sub-video-item">
      <div class="video-frame-wrap sub-video-frame">
        <iframe src="https://www.youtube.com/embed/${v.id}" title="${v.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
      <p class="video-caption">${v.title}</p>
    </div>`).join('');

  const fcId = `fc-${t.id}-${idx}`;
  const tfId = `tf-${t.id}-${idx}`;
  const mqId = `mq-${t.id}-${idx}`;

  return `
    <div class="subtema-block">
      <div class="bubble">
        <h4>${s.icon} ${s.label}</h4>
        ${s.text}
      </div>

      <h5 class="sub-h"><i class="bi bi-camera-reels-fill"></i> Videos de ${s.label}</h5>
      <div class="sub-video-grid">${videosHtml}</div>

      <h5 class="sub-h"><i class="bi bi-controller"></i> Actividades de ${s.label}</h5>
      <div class="activity-grid">
        ${renderFlashcardsHtml(fcId, s.fc || [])}
        ${renderTrueFalseHtml(tfId, s.tf || [])}
        ${renderMiniQuizHtml(mqId, s.mq || [])}
      </div>
    </div>`;
}

function renderFlashcardsHtml(id, cards){
  return `
    <div class="activity-card fc-card">
      <div class="activity-head fc-head"><i class="bi bi-lightning-charge-fill"></i> Tarjetas relámpago</div>
      <p class="activity-hint">Toca cada tarjeta para ver la respuesta.</p>
      <div class="flip-grid" id="${id}">
        ${cards.map((c,i)=>`
          <button class="flip-card" data-i="${i}" type="button" aria-label="Tarjeta ${c.t}">
            <span class="flip-inner">
              <span class="flip-front">${c.t}</span>
              <span class="flip-back">${c.d}</span>
            </span>
          </button>`).join('')}
      </div>
    </div>`;
}

function setupFlashcards(id){
  const wrap = document.getElementById(id);
  if(!wrap) return;
  wrap.querySelectorAll('.flip-card').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const first = !btn.classList.contains('everFlipped');
      btn.classList.toggle('flipped');
      if(first && btn.classList.contains('flipped')){
        btn.classList.add('everFlipped');
        totalStars++;
        updateStarsBadge();
      }
      playCorrect();
    });
  });
}

function renderTrueFalseHtml(id, items){
  return `
    <div class="activity-card tf-card">
      <div class="activity-head tf-head"><i class="bi bi-check2-square"></i> Verdadero o falso</div>
      <p class="activity-hint">Lee la frase y toca tu respuesta.</p>
      <div id="${id}">
        ${items.map((it,i)=>`
          <div class="tf-item" data-i="${i}" data-v="${it.v}">
            <p>${it.s}</p>
            <div class="tf-btns">
              <button class="tf-btn" data-ans="true" type="button">Verdadero</button>
              <button class="tf-btn" data-ans="false" type="button">Falso</button>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function setupTrueFalse(id){
  const wrap = document.getElementById(id);
  if(!wrap) return;
  wrap.querySelectorAll('.tf-item').forEach(item=>{
    const correct = item.dataset.v === 'true';
    const btns = item.querySelectorAll('.tf-btn');
    btns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if(item.classList.contains('answered')) return;
        item.classList.add('answered');
        const chosen = btn.dataset.ans === 'true';
        btns.forEach(b=> b.disabled = true);
        const correctBtn = [...btns].find(b => (b.dataset.ans === 'true') === correct);
        if(correctBtn) correctBtn.classList.add('correct');
        if(chosen !== correct){ btn.classList.add('wrong'); playWrong(); }
        else { totalStars++; playCorrect(); }
        updateStarsBadge();
      });
    });
  });
}

function renderMiniQuizHtml(id, questions){
  return `
    <div class="activity-card mq-card">
      <div class="activity-head mq-head"><i class="bi bi-stars"></i> Reto relámpago</div>
      <p class="activity-hint">Responde y gana estrellas.</p>
      <div id="${id}">
        ${questions.map((q,qi)=>`
          <div class="quiz-q">${q.q}</div>
          <div class="quiz-opts" data-qi="${qi}">
            ${q.opts.map((o,oi)=>`<button class="quiz-opt" data-o="${oi}" data-correct="${q.correct}" type="button">${o}</button>`).join('')}
          </div>`).join('')}
      </div>
    </div>`;
}

function setupMiniQuiz(id){
  const wrap = document.getElementById(id);
  if(!wrap) return;
  wrap.querySelectorAll('.quiz-opts').forEach(group=>{
    const btns = group.querySelectorAll('.quiz-opt');
    btns.forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if([...btns].some(b=>b.disabled)) return;
        const correctIdx = parseInt(btn.dataset.correct, 10);
        btns.forEach(b=> b.disabled = true);
        btns[correctIdx].classList.add('correct');
        if(parseInt(btn.dataset.o, 10) !== correctIdx){ btn.classList.add('wrong'); playWrong(); }
        else { totalStars++; playCorrect(); }
        updateStarsBadge();
      });
    });
  });
}

function markGameComplete(t){
  progress[t.id].game = true;
  renderGradoTabsIfPresent();
  saveProgressToCloud();
}
function markDraglineComplete(t){
  progress[t.id].dragline = true;
  renderGradoTabsIfPresent();
  saveProgressToCloud();
}
function renderGradoTabsIfPresent(){
  if(currentTemaTab){
    const t = temaById(currentTemaTab);
    if(t) renderGradoTabs(t.grado);
  }
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

/* ================= ACTIVIDAD 1: SOPA DE LETRAS ================= */
function setupWordSearch(t){
  const word = t.game.word;
  const grid = document.getElementById('wsGrid');
  const progressEl = document.getElementById('wsProgress');
  const feedback = document.getElementById('temaFeedback1');
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
      feedback.textContent = 'Bomba. Empiezas de nuevo con esta palabra.';
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
        feedback.textContent = 'Bien. +1 estrella';
        renderProgress();
        draw();
        updateStarsBadge();
        if(pointer === word.length){
          totalStars += 3;
          playFanfare();
          confettiBurst();
          feedback.textContent = 'Formaste la palabra completa. +3 estrellas';
          markGameComplete(t);
          updateStarsBadge();
        }
      }, 220);
    } else {
      if(btnEl) btnEl.classList.add('bombhit');
      playWrong();
      feedback.textContent = 'Esa no es la letra que sigue, intenta otra.';
      setTimeout(()=> btnEl && btnEl.classList.remove('bombhit'), 400);
    }
  }

  document.getElementById('btnListenGame1').onclick = ()=> speak('Haz clic en las letras en orden para formar la palabra ' + word + '. Cuidado con las bombas.');
  document.getElementById('btnHint1').onclick = ()=> giveHint(t);
  document.getElementById('btnReset1').onclick = ()=> renderTemaPanel();
}

/* ================= ACTIVIDAD 2: ARRASTRAR LÍNEAS ================= */
function setupDragLine(t){
  const wrap = document.getElementById('dlWrap');
  const svg = document.getElementById('dlSvg');
  const leftCol = document.getElementById('dlLeftCol');
  const rightCol = document.getElementById('dlRightCol');
  const feedback = document.getElementById('temaFeedback2');

  const pairs = t.dragline || [];
  const left = pairs.map((p,i)=>({...p, idx:i}));
  const right = shuffle(pairs.map((p,i)=>({...p, idx:i})));

  left.forEach(p=>{
    const btn = document.createElement('button');
    btn.className = 'match-item'; btn.dataset.side='a'; btn.dataset.idx=p.idx;
    btn.textContent = p.a;
    leftCol.appendChild(btn);
  });
  right.forEach(p=>{
    const btn = document.createElement('button');
    btn.className = 'match-item'; btn.dataset.side='b'; btn.dataset.idx=p.idx;
    btn.textContent = p.b;
    rightCol.appendChild(btn);
  });

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
    if(rightBtn && wrap.contains(rightBtn) && rightBtn.dataset.idx === dragging.dataset.idx && !rightBtn.classList.contains('correct')){
      const p0 = pointFor(dragging, 'right');
      const p1 = pointFor(rightBtn, 'left');
      tempLine.setAttribute('x1', p0.x); tempLine.setAttribute('y1', p0.y);
      tempLine.setAttribute('x2', p1.x); tempLine.setAttribute('y2', p1.y);
      tempLine.setAttribute('stroke', '#3FAE73'); tempLine.setAttribute('stroke-width', '4');
      dragging.classList.add('correct');
      rightBtn.classList.add('correct');
      matchedCount++;
      totalStars++;
      playCorrect();
      updateStarsBadge();
      feedback.textContent = 'Correcto. +1 estrella';
      if(matchedCount === leftItems.length){
        totalStars += 3;
        playFanfare();
        confettiBurst();
        updateStarsBadge();
        feedback.textContent = 'Uniste todas las líneas. +3 estrellas';
        markDraglineComplete(t);
      }
    } else if(dragging && wrap.contains(dragging)){
      if(tempLine && tempLine.parentNode) svg.removeChild(tempLine);
      dragging.classList.add('wrong');
      playWrong();
      feedback.textContent = 'Esa línea no es correcta, intenta de nuevo.';
      setTimeout(()=> dragging && dragging.classList.remove('wrong'), 500);
    }
    dragging = null; tempLine = null;
  });

  document.getElementById('btnReset2').onclick = ()=> renderTemaPanel();
}

/* ================= EVALUACIONES: los 8 temas juntos ================= */
let currentEvalTab = temas[0].id;

function evalTemasList(){
  return currentGrado ? temasDeGrado(currentGrado) : temas;
}

function initEvalPage(){
  const list = evalTemasList();
  if(list.length && !list.some(t=>t.id === currentEvalTab)) currentEvalTab = list[0].id;
  renderEvalTabs();
  renderEvalPanel();
  updateEvalDashboard();
}

function renderEvalTabs(){
  const list = evalTemasList();
  if(list.length && !list.some(t=>t.id === currentEvalTab)) currentEvalTab = list[0].id;
  renderTabs('evalTabs', list, currentEvalTab, (id)=>{
    currentEvalTab = id;
    renderEvalTabs();
    renderEvalPanel();
  });
}

function renderEvalPanel(){
  const panel = document.getElementById('evalPanel');
  if(!panel) return;
  const t = temaById(currentEvalTab);
  let html = `<h3>${t.icon} ${t.name} <span style="font-size:.9rem; color:#5b7072; font-family:'Baloo 2';">(Grado ${t.grado} — ${t.period})</span></h3>
    <div class="game-controls">
      <button class="ctrlbtn" id="btnListenQ" type="button"><i class="bi bi-volume-up-fill"></i> Escuchar preguntas</button>
    </div>
    <p class="sub">Responde las ${t.quiz.length} preguntas para ganar tu insignia.</p>`;
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
        feedback.textContent = `Terminaste. Acertaste ${correctCount} de ${t.quiz.length}. Insignia ganada.`;
        updateEvalDashboard();
        renderEvalTabs();
        saveProgressToCloud();
      }
    });
  });
}

function updateEvalDashboard(){
  const dash = document.getElementById('badgeDash');
  if(!dash) return;
  const list = evalTemasList();
  dash.innerHTML = list.map(t=>{
    const unlocked = progress[t.id].quiz;
    return `<div class="dash-item ${unlocked?'unlocked':''}">
      <span class="emoji">${t.icon}</span>
      <span class="lbl">${t.name}</span>
      <div style="font-size:.75rem; margin-top:4px;">${unlocked ? '<i class="bi bi-award-fill"></i> Ganada' : '<i class="bi bi-lock-fill"></i> Bloqueada'}</div>
    </div>`;
  }).join('');
  const total = list.length;
  const done = list.filter(t=>progress[t.id].quiz).length;
  const bar = document.getElementById('totalProgress');
  if(bar) bar.style.width = Math.round((done/total)*100) + '%';
}

/* ================= MASCOTA FLOTANTE (quieta, solo responde al clic) ================= */
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
  checkLoginOnLoad();
});
