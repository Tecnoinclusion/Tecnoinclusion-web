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
        tiktoks:[{id:'7168294909148024070', url:'https://www.tiktok.com/@materg24/video/7168294909148024070', title:'Sistemas de numeración explicado'},{id:'6792298505047215365', url:'https://www.tiktok.com/@estudiaconmarisol/video/6792298505047215365', title:'Conversión entre sistemas numéricos'},{id:'7609884312728538388', url:'https://www.tiktok.com/@programacion.simple/video/7609884312728538388', title:'Sistema binario en programación'},{id:'7608369398046264596', url:'https://www.tiktok.com/@programacion.simple/video/7608369398046264596', title:'Sistema hexadecimal explicado'}],
        fc:[{t:'Binario', d:'Sistema que usa solo 0 y 1'},{t:'Octal', d:'Sistema que usa 8 símbolos, del 0 al 7'},{t:'Hexadecimal', d:'Sistema que usa 16 símbolos: 0-9 y A-F'}],
        tf:[{s:'El sistema binario usa diez símbolos diferentes.', v:false},{s:'El hexadecimal se usa para representar colores y direcciones de memoria.', v:true},{s:'Convertir un número de un sistema a otro es imposible.', v:false}],
        mq:[{q:'¿Cuántos símbolos usa el sistema octal?', opts:['16','8','2','10'], correct:1},{q:'El sistema binario representa la corriente eléctrica como...', opts:['Sonidos','Colores','Letras','0 y 1'], correct:3}], pic:[{emoji:'0️⃣1️⃣', q:'Esta imagen representa el sistema...', opts:['Decimal','Hexadecimal','Octal','Binario'], correct:3},{emoji:'🎨', q:'Los colores web usan códigos como #FF0000. ¿Qué sistema usan?', opts:['Hexadecimal','Romano','Binario','Decimal'], correct:0}], imgloc:[{q:'¿Cuál de estas imágenes representa un número en código binario?', pics:['🎵','🔤','🎨','0️⃣1️⃣0️⃣1️⃣'], correct:3},{q:'¿Cuál de estos íconos se usa para representar códigos hexadecimales de color?', pics:['🎨','📖','🎸','🍎'], correct:0}]},
      {icon:'<i class="bi bi-lightning-charge-fill"></i>', label:'Electricidad y electrónica', text:'Antes de armar o reparar cualquier equipo, necesitas entender la electricidad que lo hace funcionar. La carga eléctrica es la propiedad de la materia que produce fuerzas eléctricas; la resistencia es lo que se opone al paso de la corriente; la tensión (o voltaje) es la fuerza que "empuja" los electrones; la corriente es el flujo de esos electrones; y la potencia y la energía indican cuánto trabajo puede hacer esa electricidad. Estos cinco conceptos son la base de toda la electrónica que verás en los próximos periodos.',
        videos:[{id:'4VemysIlDAc', title:'¿Qué es el voltaje, la corriente y la resistencia?'},{id:'wHQrMuJAjak', title:'Ley de Ohm, explicación fácil'}],
        tiktoks:[{id:'7644292561581985046', url:'https://www.tiktok.com/@electrnica.facil0/video/7644292561581985046', title:'Electricidad básica explicada'},{id:'7433348793279515909', url:'https://www.tiktok.com/@prof_gerardo_leal/video/7433348793279515909', title:'Voltaje, corriente y resistencia'}],
        fc:[{t:'Voltaje', d:'Fuerza que empuja los electrones'},{t:'Corriente', d:'Flujo de electrones'},{t:'Resistencia', d:'Lo que se opone al paso de la corriente'}],
        tf:[{s:'La potencia indica cuánto trabajo puede hacer la electricidad.', v:true},{s:'La carga eléctrica no tiene relación con la materia.', v:false},{s:'La resistencia ayuda a que la corriente fluya sin ningún obstáculo.', v:false}],
        mq:[{q:'¿Qué mide el voltaje?', opts:['La velocidad del internet','El color del cable','El tamaño del computador','La fuerza que empuja los electrones'], correct:3},{q:'La corriente eléctrica es...', opts:['El flujo de electrones','Un tipo de pantalla','Un programa','Un mouse'], correct:0}], pic:[{emoji:'🔋', q:'Esta imagen representa...', opts:['Un balón','Una fuente de energía eléctrica','Un libro','Una fruta'], correct:1},{emoji:'⚡', q:'Este símbolo representa...', opts:['El fuego','El agua','El viento','La corriente eléctrica'], correct:3}], imgloc:[{q:'¿Cuál de estas imágenes representa una fuente de energía?', pics:['📚','🔋','⚽','🍕'], correct:1},{q:'¿Cuál de estos símbolos representa la corriente eléctrica?', pics:['💧','🌙','🌳','⚡'], correct:3}]},
      {icon:'<i class="bi bi-phone-fill"></i>', label:'Telefonía', text:'La telefonía móvil te permite comunicarte sin cables, usando antenas y ondas de radio que conectan tu celular con una red. El internet móvil funciona de manera parecida, permitiendo navegar, ver videos y comunicarte a través de esa misma red inalámbrica, sin depender de un cable físico conectado a tu casa.',
        videos:[{id:'tmjmXQbHOJA', title:'Cómo funciona el teléfono móvil'},{id:'VU_wXCUb3nk', title:'¿Cómo funciona la telefonía móvil?'}],
        tiktoks:[{id:'7227575096926342406', url:'https://www.tiktok.com/@jtech_urban1/video/7227575096926342406', title:'Cómo funciona la telefonía móvil'},{id:'7538224233906834710', url:'https://www.tiktok.com/@user36867462252211/video/7538224233906834710', title:'Redes móviles explicadas'}],
        fc:[{t:'Telefonía móvil', d:'Comunicación sin cables usando antenas y ondas de radio'},{t:'Internet móvil', d:'Navegar usando la red inalámbrica del celular'},{t:'Antena', d:'Conecta el celular con la red'}],
        tf:[{s:'La telefonía móvil depende de un cable físico conectado a la casa.', v:false},{s:'El internet móvil usa la misma red inalámbrica que la telefonía móvil.', v:true}],
        mq:[{q:'La telefonía móvil permite comunicarse...', opts:['Nunca','Sin cables','Solo por escrito','Solo con internet fijo'], correct:1},{q:'¿Qué conecta el celular con la red móvil?', opts:['La impresora','El mouse','Las antenas','El teclado'], correct:2}], pic:[{emoji:'📱', q:'¿Qué usa este dispositivo para comunicarse sin cables?', opts:['Solo cables','Humo','Antenas y ondas de radio','Espejos'], correct:2},{emoji:'📶', q:'Este ícono indica...', opts:['Modo avión','Batería baja','Silencio','Señal de red móvil'], correct:3}], imgloc:[{q:'¿Cuál de estas imágenes representa un dispositivo de telefonía móvil?', pics:['🖨️','📱','⌚','📺'], correct:1},{q:'¿Cuál de estos íconos indica señal de red móvil?', pics:['🔋','📶','🔊','💡'], correct:1}]},
      {icon:'<i class="bi bi-pencil-square"></i>', label:'Anteproyecto', text:'Aquí das tus primeros pasos para planear tu proyecto de grado: eliges un problema real que quieras resolver con tecnología, estudias si es posible hacerlo (factibilidad), y piensas en cómo afecta tanto a las personas como al medio ambiente. También aprenderás a leer manuales técnicos, tanto en español como en inglés.',
        videos:[{id:'MYXqlGdcEes', title:'Cómo hacer el anteproyecto de investigación'},{id:'zPTcMPf-jjw', title:'Elaborar un anteproyecto de forma sencilla'}],
        fc:[{t:'Factibilidad', d:'Estudiar si el proyecto se puede realizar'},{t:'Problema', d:'Situación real que el proyecto busca resolver'},{t:'Manual técnico', d:'Documento que explica cómo usar o instalar algo'}],
        tf:[{s:'El anteproyecto ayuda a planear el proyecto de grado antes de desarrollarlo.', v:true},{s:'No es necesario pensar en el impacto ambiental del proyecto.', v:false}],
        mq:[{q:'La factibilidad estudia si el proyecto...', opts:['Tiene colores bonitos','Es divertido','Se puede realizar','Es gratis'], correct:2},{q:'El anteproyecto de grado se hace...', opts:['Después de graduarse','Nunca','Al mismo tiempo que se nace','Antes de desarrollar el proyecto final'], correct:3}], pic:[{emoji:'📝', q:'Esta imagen representa...', opts:['Un documento de planeación','Una receta de cocina','Un videojuego','Un mapa'], correct:0},{emoji:'🎯', q:'Este símbolo representa...', opts:['Un juego de azar','Un objetivo a lograr','Un cuadro','Una moneda'], correct:1}], imgloc:[{q:'¿Cuál de estas imágenes representa un documento de planeación?', pics:['🍔','🎮','🎈','📝'], correct:3},{q:'¿Cuál de estos íconos representa un objetivo a lograr?', pics:['🎺','🎳','🎯','🎲'], correct:2}]}
    ],
    game:{ word:'BINARIO', bombCount:6 },
    dragline:[
      {a:'Binario', b:'Sistema que usa solo 0 y 1'},
      {a:'Octal', b:'Sistema que usa 8 símbolos (0 al 7)'},
      {a:'Hexadecimal', b:'Sistema que usa 16 símbolos (0-9 y A-F)'},
      {a:'Voltaje', b:'La fuerza que empuja la electricidad'}
    ],
    quiz:[
      {q:'¿Qué números usa el sistema binario?', opts:['0 al 9','A a la Z','0 y 1','1 al 100'], correct:2},
      {q:'¿Qué es el voltaje?', opts:['Un color','Un cable','La fuerza de la electricidad','Un programa'], correct:2},
      {q:'Además del binario, ¿qué otro sistema de numeración existe?', opts:['Maya','Chino','Hexadecimal','Romano'], correct:2},
      {q:'Los computadores entienden mejor...', opts:['Palabras en español','Dibujos','Sonidos','Números binarios'], correct:3},
      {q:'¿Qué significa "bit"?', opts:['Una pantalla','Un tipo de cable','Dígito binario','Un mouse'], correct:2},
      {q:'La resistencia eléctrica se mide en...', opts:['Kilos','Metros','Ohmios','Litros'], correct:2},
      {q:'¿Cuántos símbolos usa el sistema hexadecimal?', opts:['16','10','2','8'], correct:0},
      {q:'La telefonía móvil permite...', opts:['Nada','Solo usar internet fijo','Imprimir documentos','Comunicarse sin cables'], correct:3}
    ]
  },
  {
    id:'algoritmos', grado:10, period:'Periodo II', name:'Algoritmos y Programación', icon:'<i class="bi bi-diagram-3-fill"></i>',
    theory:'En este periodo vas a aprender a pensar como un programador antes de escribir una sola línea de código. Todo programa, por complejo que sea, comienza siendo un algoritmo: una lista de pasos ordenados y precisos para resolver un problema, muy parecida a una receta de cocina. La diferencia es que un computador necesita instrucciones extremadamente claras, sin ambigüedades. Para no perdernos entre tantos pasos, usamos el diagrama de flujo, una forma de dibujar el algoritmo con figuras geométricas (óvalos para inicio y fin, rectángulos para procesos, rombos para decisiones) conectadas con flechas que muestran el camino a seguir. Una vez el algoritmo está bien planeado, lo convertimos en código real usando un lenguaje de programación como C++ o Python, donde aprenderás sobre variables (espacios que guardan información), constantes (valores que nunca cambian) y ciclos repetitivos (instrucciones que se repiten muchas veces sin tener que escribirlas una por una). Además, seguirás avanzando en tu anteproyecto de grado, definiendo el título, los objetivos y el cronograma de tu propuesta.',
    subtemas:[
      {icon:'<i class="bi bi-puzzle-fill"></i>', label:'Diagrama de flujo', text:'Un diagrama de flujo es la forma gráfica de mostrar un algoritmo, usando símbolos estandarizados: un óvalo marca el inicio o el final, un rectángulo representa un proceso o una acción, un rombo representa una decisión (sí/no), y un paralelogramo representa la entrada o salida de datos. Todo se conecta con flechas que muestran el orden exacto en que deben ejecutarse los pasos. Aprender a dibujar bien un diagrama de flujo facilita muchísimo escribir el programa después, porque ya tienes la lógica resuelta en papel.',
        videos:[{id:'9JUOpyanbeY', title:'Ejemplos de algoritmos y diagramas de flujo'},{id:'QouWtBY1_uU', title:'Diagrama de flujo: la representación gráfica de un algoritmo'}],
        tiktoks:[{id:'7246224627372985605', url:'https://www.tiktok.com/@programate01/video/7246224627372985605', title:'Diagrama de flujo explicado'},{id:'7655097845535739156', url:'https://www.tiktok.com/@elzoodelcodigo/video/7655097845535739156', title:'Símbolos de un diagrama de flujo'},{id:'7664760933142760725', url:'https://www.tiktok.com/@elzoodelcodigo/video/7664760933142760725', title:'Cómo hacer un diagrama de flujo'},{id:'7667366012651703572', url:'https://www.tiktok.com/@elzoodelcodigo/video/7667366012651703572', title:'Diagrama de flujo paso a paso'}],
        fc:[{t:'Óvalo', d:'Marca el inicio o el final'},{t:'Rectángulo', d:'Representa un proceso o acción'},{t:'Rombo', d:'Representa una decisión (sí/no)'}],
        tf:[{s:'Un diagrama de flujo usa figuras y flechas para mostrar el orden de los pasos.', v:true},{s:'El rombo representa siempre el inicio del programa.', v:false},{s:'Planear en papel facilita escribir el programa después.', v:true}],
        mq:[{q:'¿Qué figura representa una decisión?', opts:['El rectángulo','El paralelogramo','El rombo','El óvalo'], correct:2},{q:'Un diagrama de flujo sirve para...', opts:['Imprimir documentos','Planear un algoritmo antes de programar','Borrar archivos','Conectar el internet'], correct:1}], pic:[{emoji:'🔷', q:'Este rombo en un diagrama de flujo representa...', opts:['El inicio','Un error','Una decisión','Un proceso'], correct:2},{emoji:'➡️', q:'Las flechas en un diagrama de flujo indican...', opts:['El color','Un error','El tamaño','El orden de los pasos'], correct:3}], imgloc:[{q:'¿Cuál de estas figuras representa una decisión en un diagrama de flujo?', pics:['🔺','⭕','⬜','🔷'], correct:3},{q:'¿Cuál de estos íconos indica el orden de los pasos?', pics:['🎁','🍀','➡️','🎨'], correct:2}]},
      {icon:'<i class="bi bi-laptop"></i>', label:'Programación en C++ y Python', text:'C++ y Python son dos lenguajes de programación muy usados: C++ es más cercano a cómo funciona la máquina por dentro (por eso se usa mucho en sistemas que necesitan ser muy rápidos), mientras que Python tiene una sintaxis más sencilla de leer, ideal para aprender lógica de programación. En ambos aprenderás sobre variables (donde guardas un dato que puede cambiar, como la edad de una persona), constantes (un valor que nunca cambia, como el número Pi) y ciclos repetitivos (estructuras como "for" o "while" que repiten una acción muchas veces sin que tengas que escribirla una y otra vez).',
        videos:[{id:'DX9EgllsbSw', title:'Fundamentos de programación: variables y constantes'},{id:'vHKWMR2WaIQ', title:'Programación en C++: ciclos o bucles'}],
        tiktoks:[{id:'7548660898005552391', url:'https://www.tiktok.com/@yapadev/video/7548660898005552391', title:'Programación: parte 1'},{id:'7549201341432876296', url:'https://www.tiktok.com/@yapadev/video/7549201341432876296', title:'Programación: parte 2'},{id:'7549575341702991122', url:'https://www.tiktok.com/@yapadev/video/7549575341702991122', title:'Programación: parte 3'},{id:'7549789334472232200', url:'https://www.tiktok.com/@yapadev/video/7549789334472232200', title:'Programación: parte 4'},{id:'7550907234528677127', url:'https://www.tiktok.com/@yapadev/video/7550907234528677127', title:'Programación: parte 5'},{id:'7551059333044243720', url:'https://www.tiktok.com/@yapadev/video/7551059333044243720', title:'Programación: parte 6'},{id:'7555552816740240647', url:'https://www.tiktok.com/@yapadev/video/7555552816740240647', title:'Programación: parte 7'},{id:'7555879852956568850', url:'https://www.tiktok.com/@yapadev/video/7555879852956568850', title:'Programación: parte 8'},{id:'7556668223240834311', url:'https://www.tiktok.com/@yapadev/video/7556668223240834311', title:'Programación: parte 9'},{id:'7576286838244101394', url:'https://www.tiktok.com/@yapadev/video/7576286838244101394', title:'Programación: parte 10'},{id:'7576653234979245320', url:'https://www.tiktok.com/@yapadev/video/7576653234979245320', title:'Programación: parte 11'},{id:'7578179998930980114', url:'https://www.tiktok.com/@yapadev/video/7578179998930980114', title:'Programación: parte 12'},{id:'7577930785936772353', url:'https://www.tiktok.com/@kedev21/video/7577930785936772353', title:'Python explicado'},{id:'7249870601895169285', url:'https://www.tiktok.com/@data_frame/video/7249870601895169285', title:'Python para principiantes'}],
        fc:[{t:'Variable', d:'Espacio que guarda un dato que puede cambiar'},{t:'Constante', d:'Valor que nunca cambia'},{t:'Ciclo repetitivo', d:'Repite una acción varias veces'}],
        tf:[{s:'Python tiene una sintaxis más sencilla de leer que C++.', v:true},{s:'Una constante puede cambiar su valor durante el programa.', v:false},{s:'Un ciclo "for" o "while" repite instrucciones automáticamente.', v:true}],
        mq:[{q:'¿Qué guarda una variable?', opts:['Un dato que puede cambiar','Una imagen fija','Un color','Un cable'], correct:0},{q:'C++ se usa mucho porque...', opts:['No sirve para programar','Es un sistema operativo','Es el único lenguaje que existe','Es rápido y cercano al funcionamiento de la máquina'], correct:3}], pic:[{emoji:'🐍', q:'Este animal es el logo de qué lenguaje de programación...', opts:['Java','C++','HTML','Python'], correct:3},{emoji:'💻', q:'Esta imagen representa...', opts:['Ver televisión','Dibujar','Cocinar','Escribir código de programación'], correct:3}], imgloc:[{q:'¿Cuál de estos íconos representa el lenguaje Python?', pics:['🐍','🐦','🐶','🐱'], correct:0},{q:'¿Cuál de estas imágenes representa escribir código?', pics:['🎤','🎨','📺','💻'], correct:3}]},
      {icon:'<i class="bi bi-pencil-square"></i>', label:'Anteproyecto', text:'Sigues construyendo tu propuesta de proyecto de grado: defines el título definitivo, escribes un resumen claro de qué vas a hacer, planteas tus objetivos general y específicos, delimitas hasta dónde llega tu proyecto (alcances) y qué no vas a cubrir (limitaciones), describes las actividades que vas a realizar, armas un cronograma con fechas, y empiezas a recopilar la bibliografía que vas a usar.',
        videos:[{id:'MYXqlGdcEes', title:'Cómo hacer el anteproyecto de investigación'},{id:'zPTcMPf-jjw', title:'Elaborar un anteproyecto de forma sencilla'}],
        fc:[{t:'Objetivo general', d:'Lo que se quiere lograr con el proyecto'},{t:'Alcance', d:'Hasta dónde llega el proyecto'},{t:'Cronograma', d:'Calendario con las fechas de las actividades'}],
        tf:[{s:'El anteproyecto incluye objetivos, alcances y limitaciones.', v:true},{s:'El cronograma no necesita fechas.', v:false}],
        mq:[{q:'El anteproyecto de grado sirve para...', opts:['Ver videos','Instalar Windows','Planear el proyecto antes de desarrollarlo','Formatear el computador'], correct:2},{q:'Las limitaciones de un proyecto indican...', opts:['El color del informe','El nombre del autor','Qué no se va a cubrir','La marca del computador'], correct:2}], pic:[{emoji:'📅', q:'Este ícono representa el...', opts:['Horóscopo','Menú del restaurante','Clima','Cronograma de actividades'], correct:3},{emoji:'🔍', q:'Esta imagen representa...', opts:['Buscar un tesoro','Investigar el problema del proyecto','Perder algo','Espiar a alguien'], correct:1}], imgloc:[{q:'¿Cuál de estas imágenes representa un cronograma?', pics:['🎭','📅','🎫','🎪'], correct:1},{q:'¿Cuál de estos íconos representa investigar un problema?', pics:['🎵','🎨','🎯','🔍'], correct:3}]}
    ],
    game:{ word:'ALGORITMO', bombCount:7 },
    dragline:[
      {a:'Algoritmo', b:'Lista de pasos ordenados'},
      {a:'Diagrama de flujo', b:'Dibujo que muestra los pasos'},
      {a:'Variable', b:'Espacio que guarda un valor'},
      {a:'Ciclo repetitivo', b:'Repite una acción varias veces'}
    ],
    quiz:[
      {q:'Un algoritmo es...', opts:['Un dibujo sin sentido','Una pantalla','Un cable','Una lista de pasos ordenados'], correct:3},
      {q:'¿Qué usamos para planear un algoritmo antes de programar?', opts:['Un cable de red','Una impresora','Un mouse','Un diagrama de flujo'], correct:3},
      {q:'¿Cuál es un lenguaje de programación?', opts:['Inglés','Python','Binario','Español'], correct:1},
      {q:'Si el orden de los pasos está mal...', opts:['Siempre funciona','El resultado puede salir mal','No importa','Se arregla solo'], correct:1},
      {q:'Una variable en programación es...', opts:['Un mouse','Un espacio que guarda un valor','Un cable','Un color'], correct:1},
      {q:'Un ciclo repetitivo sirve para...', opts:['Nada','Repetir una acción varias veces','Borrar el programa','Apagar el computador'], correct:1},
      {q:'Además de C++, ¿qué otro lenguaje aprenderás?', opts:['Binario puro','Ninguno','Español','Python'], correct:3},
      {q:'Una constante es un valor que...', opts:['Es un color','No cambia durante el programa','Es un cable','Cambia todo el tiempo'], correct:1}
    ]
  },
  {
    id:'arquitectura', grado:10, period:'Periodo III', name:'Arquitectura y Mantenimiento', icon:'<i class="bi bi-pc-display-horizontal"></i>',
    theory:'En este periodo abrimos (con cuidado) la "carcasa" del computador para entender cómo está organizado por dentro y cómo cuidarlo correctamente. La arquitectura de un computador es la forma en que se organizan e interconectan todas sus partes: el hardware (piezas físicas), los componentes eléctricos que lo alimentan, y los periféricos que usamos para interactuar con él, como el teclado, el mouse o la impresora. También profundizarás en fundamentos de electricidad aplicados directamente a los equipos: la diferencia entre alimentación de corriente alterna (AC) y corriente directa (DC), la importancia del polo a tierra para evitar accidentes, y cómo protegerse de la electricidad estática que puede dañar componentes delicados. Aprenderás a interpretar planos de instalación y manuales de procedimiento, algo esencial para cualquier técnico. El corazón de este periodo es el mantenimiento de computadores, que se divide en tres tipos: preventivo (limpiar y revisar antes de que algo falle), predictivo (anticiparse a una falla analizando el comportamiento del equipo) y correctivo (reparar después de que ya ocurrió el problema). Para hacer todo esto de forma segura y precisa usarás instrumentos de medición como el voltímetro, el amperímetro, el generador de señales, el osciloscopio y la pinza multifunción.',
    subtemas:[
      {icon:'<i class="bi bi-pc-display"></i>', label:'Arquitectura de computadores', text:'Se refiere a cómo están organizadas todas las piezas del computador: el procesador (que ejecuta las instrucciones), la memoria RAM (donde se guardan los datos mientras el equipo está encendido), el disco duro o SSD (donde se guarda la información de forma permanente), la tarjeta madre (que conecta todo entre sí), la fuente de poder (que entrega la electricidad correcta a cada componente), y los periféricos (dispositivos externos como el teclado, el mouse, el monitor o la impresora).',
        videos:[{id:'rlMReK7rfTo', title:'Partes del computador (hardware)'},{id:'hcBZes1wViA', title:'Partes del computador, explicadas fácil'}],
        tiktoks:[{id:'7511527508299336982', url:'https://www.tiktok.com/@enlace_tech_soporte/video/7511527508299336982', title:'Partes del computador'},{id:'7669035297467829512', url:'https://www.tiktok.com/@lexo.explica/video/7669035297467829512', title:'Arquitectura de computadores explicada'}],
        fc:[{t:'Procesador', d:'Ejecuta las instrucciones del computador'},{t:'RAM', d:'Guarda datos mientras el equipo está encendido'},{t:'Tarjeta madre', d:'Conecta todos los componentes entre sí'}],
        tf:[{s:'El disco duro guarda la información de forma permanente.', v:true},{s:'La fuente de poder entrega la electricidad correcta a cada componente.', v:true},{s:'El mouse es parte de la tarjeta madre.', v:false}],
        mq:[{q:'¿Qué hace el procesador?', opts:['Ejecuta las instrucciones','Guarda información para siempre','Da estilo a la página','Imprime documentos'], correct:0},{q:'Un periférico es...', opts:['Un dispositivo externo como el teclado','Un cable interno','La memoria RAM','El procesador'], correct:0}], pic:[{emoji:'🖥️', q:'Esta imagen representa...', opts:['Un microondas','El computador completo','Un televisor','Una impresora'], correct:1},{emoji:'🧠', q:'Este ícono representa qué parte del computador...', opts:['La pantalla','El mouse','El procesador (CPU)','El cable'], correct:2}], imgloc:[{q:'¿Cuál de estas imágenes representa el computador completo?', pics:['📻','🖥️','🎹','📷'], correct:1},{q:'¿Cuál de estos íconos representa el procesador (CPU)?', pics:['👁️','🧠','👃','👂'], correct:1}]},
      {icon:'<i class="bi bi-wrench-adjustable"></i>', label:'Mantenimiento', text:'El mantenimiento preventivo se hace de forma periódica, antes de que aparezca cualquier problema: limpiar el polvo, revisar cables, verificar temperaturas. El mantenimiento predictivo usa herramientas de monitoreo para anticipar cuándo es probable que falle una pieza, basándose en su comportamiento (por ejemplo, un disco duro que empieza a hacer ruidos raros). El mantenimiento correctivo es el que se hace cuando el daño ya ocurrió: identificar la falla exacta y repararla o cambiar la pieza dañada. Los tres tipos son complementarios y un buen técnico sabe cuándo aplicar cada uno.',
        videos:[{id:'ga4CVIFdzuI', title:'Mantenimiento preventivo hardware y software'},{id:'xsHfhDALj8w', title:'Tipos de mantenimiento: correctivo, preventivo y predictivo'}],
        tiktoks:[{id:'7350866945048104198', url:'https://www.tiktok.com/@ingensoftx/video/7350866945048104198', title:'Mantenimiento de computadores'},{id:'7216339598220250374', url:'https://www.tiktok.com/@40010125qt5/video/7216339598220250374', title:'Tipos de mantenimiento explicado'}],
        fc:[{t:'Preventivo', d:'Se hace antes de que algo falle'},{t:'Predictivo', d:'Anticipa una falla analizando el comportamiento'},{t:'Correctivo', d:'Repara después de que ya ocurrió el problema'}],
        tf:[{s:'El mantenimiento preventivo se hace de forma periódica.', v:true},{s:'El mantenimiento correctivo se hace antes de que exista una falla.', v:false}],
        mq:[{q:'El mantenimiento predictivo busca...', opts:['Ignorar el problema','Anticiparse a una falla','Dañar el equipo','Nada'], correct:1},{q:'¿Qué mantenimiento se hace cuando el equipo ya falló?', opts:['Preventivo','Predictivo','Correctivo','Ninguno'], correct:2}], pic:[{emoji:'🧹', q:'Esta imagen representa qué tipo de mantenimiento...', opts:['Predictivo solamente','Correctivo','Preventivo','Ninguno'], correct:2},{emoji:'🔧', q:'Esta herramienta se usa para...', opts:['Escribir','Cocinar','Reparar y dar mantenimiento','Pintar'], correct:2}], imgloc:[{q:'¿Cuál de estas imágenes representa el mantenimiento de un equipo?', pics:['🎁','🎈','🎨','🧹'], correct:3},{q:'¿Cuál de estas herramientas se usa para reparar equipos?', pics:['🔧','🎣','🖌️','🎤'], correct:0}]},
      {icon:'<i class="bi bi-rulers"></i>', label:'Instrumentos de medición', text:'El voltímetro mide la diferencia de tensión (voltaje) entre dos puntos de un circuito. El amperímetro mide la intensidad de corriente que fluye. El generador de señales produce ondas eléctricas de prueba para verificar que un circuito responde correctamente. El osciloscopio muestra gráficamente cómo cambia una señal eléctrica en el tiempo, siendo clave para diagnosticar problemas complejos. La pinza multifunción combina varias de estas mediciones en una sola herramienta portátil, muy usada en el trabajo de campo.',
        videos:[{id:'VDYnGJQjL6s', title:'Cómo usar un multímetro digital para principiantes'},{id:'WjIxLcG8uw4', title:'¿Cómo usar el multímetro? Guía para principiantes'}],
        tiktoks:[{id:'7487799183668251959', url:'https://www.tiktok.com/@jhony_rincon_/video/7487799183668251959', title:'Instrumentos de medición eléctrica'},{id:'7648779412321635592', url:'https://www.tiktok.com/@aprendeconyes/video/7648779412321635592', title:'Cómo usar el multímetro'}],
        fc:[{t:'Voltímetro', d:'Mide la diferencia de tensión (voltaje)'},{t:'Amperímetro', d:'Mide la intensidad de corriente'},{t:'Osciloscopio', d:'Muestra gráficamente cómo cambia una señal en el tiempo'}],
        tf:[{s:'La pinza multifunción combina varias mediciones en una sola herramienta.', v:true},{s:'El generador de señales sirve para cortar cables.', v:false}],
        mq:[{q:'¿Qué instrumento mide el voltaje?', opts:['El voltímetro','El teclado','El mouse','La impresora'], correct:0},{q:'El osciloscopio es útil para...', opts:['Escuchar música','Nada','Navegar en internet','Diagnosticar problemas viendo señales eléctricas'], correct:3}], pic:[{emoji:'📟', q:'Este instrumento mide...', opts:['La temperatura del cuerpo','El peso','Voltaje y corriente','La distancia'], correct:2},{emoji:'📈', q:'Esta gráfica representa una señal vista en un...', opts:['Libro','Televisor','Osciloscopio','Reloj'], correct:2}], imgloc:[{q:'¿Cuál de estos instrumentos mide voltaje y corriente?', pics:['📟','🎥','📻','📷'], correct:0},{q:'¿Cuál de estas imágenes representa una señal vista en un osciloscopio?', pics:['📈','🎪','🎭','🎨'], correct:0}]}
    ],
    game:{ word:'HARDWARE', bombCount:6 },
    dragline:[
      {a:'Hardware', b:'Partes físicas del computador'},
      {a:'Mantenimiento preventivo', b:'Se hace antes de que algo falle'},
      {a:'Mantenimiento correctivo', b:'Se hace después de una falla'},
      {a:'Voltímetro', b:'Mide la electricidad'}
    ],
    quiz:[
      {q:'La arquitectura de un computador es...', opts:['Cómo están organizadas sus partes','Un cable','Un programa','Un edificio'], correct:0},
      {q:'¿Qué instrumento mide la electricidad?', opts:['El mouse','El teclado','El voltímetro','El parlante'], correct:2},
      {q:'El mantenimiento sirve para...', opts:['Dañar el computador','Nada','Apagarlo para siempre','Cuidar el computador y evitar daños'], correct:3},
      {q:'¿Cuál es una parte del hardware?', opts:['Un archivo de texto','Un correo','El procesador','Una página web'], correct:2},
      {q:'El mantenimiento predictivo busca...', opts:['Nada','Anticiparse a una falla antes de que ocurra','Esperar a que se dañe','Ignorar el problema'], correct:1},
      {q:'Un periférico es...', opts:['Un cable de red','Un dispositivo externo como el mouse o la impresora','Solo el procesador','Un programa'], correct:1},
      {q:'El osciloscopio sirve para...', opts:['Navegar en internet','Escuchar música','Ver señales eléctricas en una gráfica','Imprimir documentos'], correct:2},
      {q:'El mantenimiento correctivo se hace cuando...', opts:['El equipo ya presenta una falla','Antes de comprarlo','Nunca es necesario','Todo funciona bien'], correct:0}
    ]
  },
  {
    id:'sistemasop', grado:10, period:'Periodo IV', name:'Sistemas Operativos', icon:'<i class="bi bi-hdd-fill"></i>',
    theory:'En este último periodo del Grado Décimo aprenderás sobre el programa más importante de cualquier computador: el sistema operativo. Es el software principal que administra todo el hardware y permite que los demás programas funcionen, organizando la memoria, los archivos y la comunicación entre el usuario y la máquina. Verás las funciones que cumple un sistema operativo, los distintos tipos que existen, y los más comunes en el mercado (como Windows, Linux o macOS). Profundizarás en conceptos técnicos como las particiones (formas de dividir un disco duro en secciones independientes) y el sector de arranque (la parte del disco que le dice al computador cómo iniciar). También aprenderás sobre el formateo, el proceso de borrar completamente un disco y prepararlo con un sistema de archivos como NTFS, FAT o FAT32 — cada uno con sus propias ventajas según el uso que se le vaya a dar. Verás las partes del computador desde el punto de vista lógico (el software), y los distintos tipos de licencia que puede tener un programa (gratuito, de pago, de código abierto). El periodo cierra con la sustentación de tu anteproyecto de grado, así que trabajarás técnicas de redacción de informes técnicos siguiendo normas como IEEE, Icontec o APA.',
    subtemas:[
      {icon:'<i class="bi bi-floppy-fill"></i>', label:'Sistemas operativos', text:'Un sistema operativo es el programa que se ejecuta primero al encender un computador y que administra todos los recursos: qué programa usa el procesador en cada momento, dónde se guarda cada archivo, cómo se comunica el equipo con el teclado, el mouse o la pantalla. Sin sistema operativo, el hardware no sabría qué hacer. Windows, Linux y macOS son los sistemas operativos más comunes para computadores, mientras que Android e iOS dominan en celulares.',
        videos:[{id:'TERrKrQzXks', title:'Qué es el sistema operativo (para primaria)'},{id:'NBOdGiWAjis', title:'¿Qué es un sistema operativo? Explicación fácil'}],
        tiktoks:[{id:'7374619248561376518', url:'https://www.tiktok.com/@sys.nodools/video/7374619248561376518', title:'Qué es un sistema operativo'},{id:'7503171556974021910', url:'https://www.tiktok.com/@enlace_tech_soporte/video/7503171556974021910', title:'Sistemas operativos explicados'},{id:'7362035864802741509', url:'https://www.tiktok.com/@sys.nodools/video/7362035864802741509', title:'Tipos de sistemas operativos'},{id:'7353695606252096773', url:'https://www.tiktok.com/@imecaf/video/7353695606252096773', title:'Sistemas operativos para principiantes'}],
        fc:[{t:'Sistema operativo', d:'Programa que administra todos los recursos del equipo'},{t:'Windows', d:'Sistema operativo muy usado en computadores'},{t:'Android', d:'Sistema operativo muy usado en celulares'}],
        tf:[{s:'Sin sistema operativo, el hardware no sabría qué hacer.', v:true},{s:'Linux y macOS también son sistemas operativos.', v:true}],
        mq:[{q:'¿Qué hace el sistema operativo?', opts:['Nada','Solo imprime documentos','Administra todos los recursos del equipo','Solo reproduce música'], correct:2},{q:'¿Cuál es un sistema operativo para celulares?', opts:['Chrome','Android','Word','Excel'], correct:1}], pic:[{emoji:'🪟', q:'Este ícono representa qué sistema operativo...', opts:['Un espejo','Windows','Una ventana de casa','Un cuadro'], correct:1},{emoji:'🤖', q:'Este ícono representa qué sistema operativo de celulares...', opts:['Un juguete','Android','Windows','Una aspiradora'], correct:1}], imgloc:[{q:'¿Cuál de estos íconos representa el sistema operativo Windows?', pics:['🪟','🏠','🚪','🌳'], correct:0},{q:'¿Cuál de estos íconos representa el sistema operativo Android?', pics:['🤖','🦾','🎮','👽'], correct:0}]},
      {icon:'<i class="bi bi-folder-fill"></i>', label:'Formateo', text:'Formatear significa preparar un disco para guardar información, borrando todo lo que tenía antes y organizándolo según un sistema de archivos: NTFS (usado por Windows, permite archivos muy grandes y más seguridad), FAT (uno de los sistemas más antiguos y simples) o FAT32 (una versión mejorada de FAT, muy compatible entre distintos dispositivos, pero con límite en el tamaño de archivo). Formatear es un proceso delicado porque borra TODA la información, así que siempre se debe respaldar lo importante antes de hacerlo.',
        videos:[{id:'DZCtifxMpk8', title:'Formatea USB o disco rápido: FAT32, exFAT, NTFS'},{id:'fXZgeaz3AKk', title:'Sistemas de archivos FAT32, NTFS, exFAT'}],
        fc:[{t:'Formatear', d:'Borrar todo y preparar el disco con un sistema de archivos'},{t:'NTFS', d:'Sistema de archivos de Windows, permite archivos grandes'},{t:'FAT32', d:'Versión mejorada de FAT, muy compatible entre dispositivos'}],
        tf:[{s:'Formatear borra toda la información del disco.', v:true},{s:'FAT32 no tiene ningún límite de tamaño de archivo.', v:false}],
        mq:[{q:'Antes de formatear es importante...', opts:['Romper el disco','Respaldar la información importante','Desconectar todo para siempre','No hacer nada'], correct:1},{q:'¿Qué sistema de archivos usa Windows normalmente?', opts:['PDF','MP3','JPG','NTFS'], correct:3}], pic:[{emoji:'💽', q:'Esta imagen representa...', opts:['Un CD de música','Una moneda','Un plato','Un disco de almacenamiento'], correct:3},{emoji:'🗑️', q:'Formatear un disco significa...', opts:['Pintarlo','Guardar todo para siempre','Nada','Borrar todo y prepararlo de nuevo'], correct:3}], imgloc:[{q:'¿Cuál de estas imágenes representa un disco de almacenamiento?', pics:['🎡','⚽','💽','🍩'], correct:2},{q:'¿Cuál de estos íconos representa borrar todo el contenido?', pics:['📋','🗑️','📤','📥'], correct:1}]},
      {icon:'<i class="bi bi-file-earmark-text-fill"></i>', label:'Informes técnicos', text:'Un buen técnico no solo sabe hacer el trabajo, también sabe explicarlo por escrito. Aprenderás a redactar informes técnicos claros y organizados, aplicando normas de citación y formato como IEEE (muy usada en ingeniería), Icontec (estándar colombiano) o APA (muy usada en ciencias sociales), según lo que pida cada trabajo o tu proyecto de grado.',
        videos:[{id:'gNTfdcMkKGk', title:'Cómo hacer citas y referencias según normas APA 7'},{id:'0Zhr3qs1hm4', title:'Cómo citar un video de YouTube en APA 7'}],
        fc:[{t:'APA', d:'Norma muy usada en ciencias sociales'},{t:'IEEE', d:'Norma muy usada en ingeniería'},{t:'Icontec', d:'Estándar colombiano de presentación de trabajos'}],
        tf:[{s:'Un informe técnico debe ser claro y organizado.', v:true},{s:'Las normas de citación no importan en un informe técnico.', v:false}],
        mq:[{q:'¿Qué norma es un estándar colombiano?', opts:['Icontec','IEEE','APA','HTML'], correct:0},{q:'Un informe técnico sirve para...', opts:['Borrar el disco','Formatear el computador','Explicar por escrito el trabajo realizado','Nada'], correct:2}], pic:[{emoji:'📄', q:'Esta imagen representa...', opts:['Una fotografía','Una canción','Un informe o documento escrito','Un video'], correct:2},{emoji:'🖊️', q:'Esta imagen representa la acción de...', opts:['Dibujar','Imprimir a color','Borrar el documento','Redactar y citar correctamente'], correct:3}], imgloc:[{q:'¿Cuál de estas imágenes representa un informe escrito?', pics:['📷','📄','🎧','🎬'], correct:1},{q:'¿Cuál de estos íconos representa redactar un documento?', pics:['🖊️','🎤','🎨','🖌️'], correct:0}]}
    ],
    game:{ word:'FORMATEO', bombCount:7 },
    dragline:[
      {a:'Sistema operativo', b:'Programa principal que controla el equipo'},
      {a:'Formatear', b:'Borrar todo y dejar el equipo como nuevo'},
      {a:'NTFS', b:'Un sistema de archivos de Windows'},
      {a:'Licencia', b:'Permiso legal para usar un programa'}
    ],
    quiz:[
      {q:'El sistema operativo es...', opts:['Una impresora','Un mouse','El programa principal que hace funcionar el computador','Un cable'], correct:2},
      {q:'¿Cuál es un ejemplo de sistema operativo?', opts:['WhatsApp','YouTube','Word','Windows'], correct:3},
      {q:'Formatear un computador significa...', opts:['Apagarlo','Limpiarlo con agua','Borrar todo y dejarlo como nuevo','Prenderlo'], correct:2},
      {q:'El sistema operativo organiza...', opts:['Solo los colores','Nada','Solo la música','Los archivos y programas'], correct:3},
      {q:'NTFS y FAT32 son...', opts:['Sistemas de archivos','Colores de pantalla','Marcas de computador','Tipos de mouse'], correct:0},
      {q:'Antes de formatear es importante...', opts:['No hacer nada','Desconectar todo para siempre','Respaldar la información importante','Romper el computador'], correct:2},
      {q:'Una licencia de software indica...', opts:['Nada','Si el programa se puede usar legalmente','El color del programa','El tamaño de la pantalla'], correct:1},
      {q:'Un informe técnico debe ser...', opts:['Claro y organizado','Muy corto sin explicar nada','Confuso','Solo con dibujos'], correct:0}
    ]
  },
  /* ---------- GRADO ONCE ---------- */
  {
    id:'arduino', grado:11, period:'Periodo I', name:'Arduino y Robótica', icon:'<i class="bi bi-cpu-fill"></i>',
    theory:'En este periodo das el salto de la teoría a crear tus propios objetos interactivos usando Arduino, una tarjeta electrónica de hardware y software libre que se puede programar para percibir el mundo (a través de sensores) y actuar sobre él (a través de actuadores como motores o luces). Conocerás en detalle la tarjeta Arduino Uno, entendiendo qué hace cada uno de sus componentes. Aprenderás sobre señales analógicas (que pueden tomar cualquier valor dentro de un rango, como la temperatura) y señales digitales (que solo tienen dos estados, encendido o apagado). Practicarás con salidas digitales como encender y apagar un LED, hacer una secuencia de 3 LEDs, generar sonidos, o activar un motor DC; y con entradas digitales como leer el estado de un botón (push button). También trabajarás con entradas analógicas, leyendo una fotocelda (sensor de luz), una resistencia variable o potenciómetro, y un joystick; y con salidas analógicas usando señales PWM para variar la intensidad de un LED o la velocidad de un motor. Conocerás sensores de temperatura, humedad, movimiento y ultrasonido, además de actuadores como motores DC, motores paso a paso y servomotores, y aprenderás a usar un display de cristal líquido para mostrar información. Todo este conocimiento lo aplicarás en un proyecto real: un carro seguidor de línea.',
    subtemas:[
      {icon:'<i class="bi bi-plug-fill"></i>', label:'Tarjeta Arduino', text:'Arduino Uno es una placa con un microcontrolador (un pequeño "cerebro" programable), pines digitales y analógicos para conectar sensores y actuadores, un puerto USB para programarla desde el computador, y un regulador de voltaje que asegura que todo funcione con la energía correcta. Su software (el IDE de Arduino) te permite escribir el código, llamado "sketch", y cargarlo directamente en la placa.',
        videos:[{id:'lLIJL7x4HjA', title:'Cómo funciona un Arduino, explicado fácil'},{id:'Z3BNaeNWhhU', title:'¿Qué es un Arduino? Clase 1'}],
        tiktoks:[{id:'7543644540003978502', url:'https://www.tiktok.com/@electromindscucuta/video/7543644540003978502', title:'Arduino explicado'},{id:'7520556576353045767', url:'https://www.tiktok.com/@somchaikongtham/video/7520556576353045767', title:'Arduino para principiantes'},{id:'7458029681854467334', url:'https://www.tiktok.com/@siscomelectronica/video/7458029681854467334', title:'Qué es Arduino'}],
        fc:[{t:'Microcontrolador', d:'El "cerebro" programable de la placa'},{t:'Sketch', d:'El código que se escribe y carga en Arduino'},{t:'Puerto USB', d:'Permite programar la placa desde el computador'}],
        tf:[{s:'Arduino Uno tiene pines digitales y analógicos.', v:true},{s:'El sketch es una imagen que se sube a Arduino.', v:false}],
        mq:[{q:'¿Qué es Arduino?', opts:['Un mouse','Un programa de dibujo','Una tarjeta electrónica programable','Un cable'], correct:2},{q:'El código de Arduino se llama...', opts:['Sketch','Excel','PDF','Word'], correct:0}], pic:[{emoji:'🔌', q:'Esta imagen representa...', opts:['Una impresora','Un teclado','Un mouse','Una placa Arduino'], correct:3},{emoji:'💾', q:'El código de Arduino que subes a la placa se llama...', opts:['Word','Sketch','PDF','Excel'], correct:1}], imgloc:[{q:'¿Cuál de estas imágenes representa una placa Arduino?', pics:['🎧','🔌','📺','🎮'], correct:1},{q:'¿Cuál de estos íconos representa el código que subes a la placa (sketch)?', pics:['💾','📷','🎵','🎨'], correct:0}]},
      {icon:'<i class="bi bi-lightbulb-fill"></i>', label:'Entradas y salidas', text:'Las salidas digitales solo tienen dos estados (encendido/apagado), como un LED que prendes y apagas, o una secuencia de varios LEDs. Las entradas digitales leen ese mismo tipo de señal desde afuera, como saber si un botón está presionado o no. Las entradas analógicas pueden leer un rango completo de valores, como la cantidad de luz que capta una fotocelda, la posición de un potenciómetro, o la dirección de un joystick. Las salidas analógicas usan una técnica llamada PWM para simular distintos niveles de intensidad, por ejemplo variando el brillo de un LED o la velocidad de un motor DC.',
        videos:[{id:'ZUN2IABicVg', title:'Encender un LED con un pulsador'},{id:'jQR3IYY63wg', title:'Arduino: encender y apagar un LED con un pulsador'}],
        tiktoks:[{id:'7299524779390848261', url:'https://www.tiktok.com/@edtplus/video/7299524779390848261', title:'Entradas y salidas en Arduino'},{id:'7167393106071981317', url:'https://www.tiktok.com/@eguides/video/7167393106071981317', title:'Entradas digitales y analógicas'},{id:'7543726640753331464', url:'https://www.tiktok.com/@meduca1/video/7543726640753331464', title:'Salidas digitales explicadas'},{id:'7570465040655076629', url:'https://www.tiktok.com/@meduca1/video/7570465040655076629', title:'PWM explicado'}],
        fc:[{t:'Salida digital', d:'Solo tiene dos estados: encendido o apagado'},{t:'Entrada analógica', d:'Puede leer un rango completo de valores'},{t:'PWM', d:'Técnica para simular distintos niveles de intensidad'}],
        tf:[{s:'Un botón (push button) es un ejemplo de entrada digital.', v:true},{s:'Una fotocelda es un ejemplo de salida digital.', v:false}],
        mq:[{q:'Encender y apagar un LED es un ejemplo de...', opts:['Entrada analógica','Sistema operativo','Formateo','Salida digital'], correct:3},{q:'El PWM sirve para...', opts:['Borrar el programa','Variar la intensidad de una señal','Nada','Apagar el computador'], correct:1}], pic:[{emoji:'💡', q:'Esta imagen representa una salida...', opts:['Digital','Ninguna','Analógica pura','Sonora'], correct:0},{emoji:'🎚️', q:'Este control representa una entrada...', opts:['Visual','Analógica','Digital','Sonora'], correct:1}], imgloc:[{q:'¿Cuál de estas imágenes representa una salida digital como un LED?', pics:['🎭','🎨','🎪','💡'], correct:3},{q:'¿Cuál de estos íconos representa un control de entrada analógica?', pics:['🖨️','🖱️','⌨️','🎚️'], correct:3}]},
      {icon:'<i class="bi bi-car-front-fill"></i>', label:'Proyecto', text:'Todo lo aprendido se aplica en un proyecto real y motivador: un carro seguidor de línea, un pequeño robot que usa sensores para detectar una línea pintada en el suelo y ajustar sus motores automáticamente para seguirla sin salirse del camino. Este proyecto combina sensores, actuadores y programación en un solo sistema funcionando en conjunto.',
        videos:[{id:'g83Z-Ymjf7w', title:'Tutorial de seguidor de línea con CNY70 y Arduino'},{id:'NZt_MXZc_aQ', title:'Cómo hacer un robot seguidor de líneas'}],
        tiktoks:[{id:'7643797349705223442', url:'https://www.tiktok.com/@sebastian.almonacid/video/7643797349705223442', title:'Proyecto con Arduino'},{id:'7570833023709547798', url:'https://www.tiktok.com/@ala.r.d/video/7570833023709547798', title:'Carro seguidor de línea'},{id:'7627326058106244360', url:'https://www.tiktok.com/@sebastian.almonacid/video/7627326058106244360', title:'Robot con sensores'},{id:'7578599793409150220', url:'https://www.tiktok.com/@rantech20/video/7578599793409150220', title:'Proyecto final Arduino'}],
        fc:[{t:'Sensor', d:'Detecta la línea pintada en el suelo'},{t:'Actuador', d:'Motor que mueve las ruedas del carro'},{t:'Carro seguidor de línea', d:'Proyecto que combina sensores, actuadores y programación'}],
        tf:[{s:'El carro seguidor de línea usa sensores para detectar el camino.', v:true},{s:'El proyecto final no necesita programación.', v:false}],
        mq:[{q:'¿Qué detecta el carro seguidor de línea?', opts:['El clima','Una línea pintada en el suelo','La música','La hora'], correct:1},{q:'¿Qué combina este proyecto?', opts:['Solo texto','Solo sonido','Solo dibujos','Sensores, actuadores y programación'], correct:3}], pic:[{emoji:'🚗', q:'Esta imagen representa el proyecto de...', opts:['Carro seguidor de línea','Un barco','Un avión','Un dron'], correct:0},{emoji:'👁️', q:'Este ícono representa la función de un...', opts:['Sensor','Cable','Motor','Tornillo'], correct:0}], imgloc:[{q:'¿Cuál de estas imágenes representa el proyecto del carro seguidor de línea?', pics:['✈️','🚢','🚀','🚗'], correct:3},{q:'¿Cuál de estos íconos representa la función de un sensor?', pics:['👅','👃','👁️','👂'], correct:2}]}
    ],
    game:{ word:'SENSOR', bombCount:5 },
    dragline:[
      {a:'Arduino', b:'Tarjeta electrónica programable'},
      {a:'Sensor', b:'Detecta cambios del entorno'},
      {a:'Actuador', b:'Produce un movimiento o acción'},
      {a:'PWM', b:'Varía la intensidad de una señal'}
    ],
    quiz:[
      {q:'Arduino es...', opts:['Un programa de dibujo','Una tarjeta electrónica programable','Un mouse','Un cable USB'], correct:1},
      {q:'Un sensor sirve para...', opts:['Detectar luz, temperatura o movimiento','Imprimir','Escuchar música','Navegar en internet'], correct:0},
      {q:'¿Qué puede mover un actuador como un motor?', opts:['Solo el teclado','Nada','Solo el mouse','Ruedas o brazos de un robot'], correct:3},
      {q:'Programar Arduino permite...', opts:['Cocinar','Encender luces y mover motores','Dormir','Ver televisión'], correct:1},
      {q:'Un actuador es un dispositivo que...', opts:['Solo mide temperatura','Solo se ve bonito','Produce un movimiento o acción','No hace nada'], correct:2},
      {q:'Una entrada digital puede leer...', opts:['La velocidad del viento','Nada','El color del cielo','Si un botón está presionado o no'], correct:3},
      {q:'El PWM se usa para...', opts:['Cambiar el idioma','Variar la intensidad de una señal','Apagar el computador','Borrar un programa'], correct:1},
      {q:'Un servomotor puede...', opts:['Nada','Solo encender una luz','Girar a un ángulo específico','Solo hacer sonido'], correct:2}
    ]
  },
  {
    id:'redes1', grado:11, period:'Periodo II', name:'Redes de Datos I', icon:'<i class="bi bi-hdd-network-fill"></i>',
    theory:'En este periodo entras al mundo de las redes de datos, entendiendo cómo se conectan los computadores entre sí para compartir información. Conocerás los tipos de redes según su tamaño: LAN (una red local, como la de tu colegio), MAN (una red que cubre una ciudad) y WAN (una red gigante que puede cubrir países enteros, como internet). Aprenderás sobre topologías de red, que son las distintas formas de organizar físicamente las conexiones: bus (todos los equipos comparten un mismo cable principal), estrella (todos los equipos se conectan a un punto central, como un switch) y árbol (una combinación jerárquica de varias estrellas). Estudiarás los protocolos de red, que son las "reglas del lenguaje" que usan los computadores para entenderse, especialmente TCP/IP (el protocolo base de internet) y el modelo OSI (un modelo de referencia con 7 capas que ayuda a entender cómo viaja la información). Conocerás los equipos de interconexión: hub, switch, router, módem, access point, bridge y gateway, cada uno con una función específica. También verás los medios de transmisión, tanto cableados (UTP, coaxial, fibra óptica) como inalámbricos (microondas, infrarrojos, láser, Bluetooth, Wi-Fi), y el direccionamiento IP, aprendiendo la diferencia entre IP públicas e IP privadas (clases A, B y C).',
    subtemas:[
      {icon:'<i class="bi bi-globe"></i>', label:'Tipos de redes', text:'Una LAN (Local Area Network) conecta equipos en un espacio pequeño como un salón, un edificio o un colegio, y normalmente la administra una sola organización. Una MAN (Metropolitan Area Network) cubre un área más grande, como una ciudad completa. Una WAN (Wide Area Network) conecta redes a través de países o continentes enteros — internet es el ejemplo más grande de una WAN, formada por millones de redes más pequeñas conectadas entre sí.',
        videos:[{id:'t-_ctKOPwuU', title:'Tipos de redes: LAN, MAN y WAN explicado fácil'},{id:'ASXYvGV6sqE', title:'Curso de Redes: tipos de redes, LAN y WAN'}],
        tiktoks:[{id:'7429075353508891936', url:'https://www.tiktok.com/@pedrofuentes2011/video/7429075353508891936', title:'Tipos de redes explicado'},{id:'7203520036928097541', url:'https://www.tiktok.com/@wolf_technology/video/7203520036928097541', title:'LAN, MAN y WAN'},{id:'7610143210228239624', url:'https://www.tiktok.com/@xo.verso/video/7610143210228239624', title:'Redes de computadores'},{id:'7490713678577208631', url:'https://www.tiktok.com/@cinatelsas/video/7490713678577208631', title:'¿Qué es una red LAN?'}],
        fc:[{t:'LAN', d:'Red local, como la de un colegio'},{t:'MAN', d:'Red que cubre una ciudad'},{t:'WAN', d:'Red gigante que puede cubrir países, como internet'}],
        tf:[{s:'Internet es un ejemplo de una red WAN.', v:true},{s:'Una LAN cubre países completos.', v:false}],
        mq:[{q:'Una red pequeña como la del colegio se llama...', opts:['LAN','Ninguna','MAN gigante','WAN'], correct:0},{q:'¿Qué tipo de red es internet?', opts:['Ninguna','WAN','Solo un cable','LAN'], correct:1}], pic:[{emoji:'🏫', q:'Una red dentro de un solo edificio se llama...', opts:['LAN','Internet completo','WAN','Ninguna'], correct:0},{emoji:'🌍', q:'Esta imagen representa una red tipo...', opts:['Ninguna','Solo un cable','WAN (mundial)','LAN pequeña'], correct:2}], imgloc:[{q:'¿Cuál de estas imágenes representa una red pequeña como la de un colegio (LAN)?', pics:['🌍','🌌','🏫','🪐'], correct:2},{q:'¿Cuál de estas imágenes representa una red mundial (WAN)?', pics:['🌍','🛏️','🚪','🏠'], correct:0}]},
      {icon:'<i class="bi bi-signpost-split-fill"></i>', label:'Topologías', text:'La topología de bus conecta todos los equipos a un único cable central, es simple pero si el cable falla toda la red se cae. La topología de estrella conecta cada equipo directamente a un punto central (como un switch), de forma que si un cable falla solo afecta a ese equipo, no a toda la red — es la más usada actualmente. La topología de árbol combina varias estrellas en una estructura jerárquica, útil para redes grandes con varios departamentos o pisos.',
        videos:[{id:'E-Mto1FZEes', title:'Topologías de red: bus, anillo, estrella, malla, híbrida'},{id:'zsOvCfGFWN4', title:'Topologías de redes: anillo, bus, estrella, árbol'}],
        tiktoks:[{id:'7475147341587139845', url:'https://www.tiktok.com/@erickramzhn/video/7475147341587139845', title:'Topologías de red'},{id:'7641749561333140743', url:'https://www.tiktok.com/@kexory/video/7641749561333140743', title:'Topología de estrella y bus'},{id:'7580100037234003208', url:'https://www.tiktok.com/@roberta.dev/video/7580100037234003208', title:'Topologías de red explicadas'}],
        fc:[{t:'Bus', d:'Todos los equipos comparten un mismo cable principal'},{t:'Estrella', d:'Todos los equipos se conectan a un punto central'},{t:'Árbol', d:'Combinación jerárquica de varias estrellas'}],
        tf:[{s:'En la topología de estrella, un cable dañado solo afecta a ese equipo.', v:true},{s:'En la topología de bus, si el cable falla, toda la red se cae.', v:true}],
        mq:[{q:'¿Cuál es la topología más usada actualmente?', opts:['Anillo doble','Ninguna','Estrella','Bus antiguo'], correct:2},{q:'La topología de árbol combina...', opts:['Solo routers','Varias estrellas','Nada','Solo un cable'], correct:1}], pic:[{emoji:'⭐', q:'Esta forma representa la topología de...', opts:['Árbol','Anillo','Estrella','Bus'], correct:2},{emoji:'➖', q:'Esta línea representa la topología de...', opts:['Árbol','Estrella','Bus','Malla'], correct:2}], imgloc:[{q:'¿Cuál de estas formas representa la topología de estrella?', pics:['➖','⬛','⭐','🔺'], correct:2},{q:'¿Cuál de estas imágenes representa la topología de bus?', pics:['⭐','🔶','🔵','➖'], correct:3}]},
      {icon:'<i class="bi bi-compass-fill"></i>', label:'Direccionamiento IP', text:'Cada dispositivo conectado a una red necesita una dirección IP única, similar a la dirección de una casa, para que los datos sepan exactamente a dónde llegar. Las IP públicas son visibles desde internet y las asigna tu proveedor de servicio; las IP privadas (de clase A, B o C) se usan dentro de una red local y no son visibles directamente desde internet, lo que también ayuda a la seguridad.',
        videos:[{id:'yzFZPjWI-dg', title:'Dirección IP pública y privada: diferencias y rangos'},{id:'4WolYmbaTP8', title:'Direcciones IPv4 públicas y privadas, clases A, B, C'}],
        tiktoks:[{id:'7669041078141455624', url:'https://www.tiktok.com/@lexo.explica/video/7669041078141455624', title:'Direccionamiento IP explicado'},{id:'7601289304328899847', url:'https://www.tiktok.com/@xo.verso/video/7601289304328899847', title:'IP pública y privada'},{id:'7658367060933741831', url:'https://www.tiktok.com/@pedrolinocaceres/video/7658367060933741831', title:'Clases de direcciones IP'}],
        fc:[{t:'IP pública', d:'Visible desde internet'},{t:'IP privada', d:'Se usa dentro de una red local'},{t:'Dirección IP', d:'Identifica un dispositivo en la red, como la dirección de una casa'}],
        tf:[{s:'Las IP privadas no son visibles directamente desde internet.', v:true},{s:'Todos los dispositivos de internet comparten la misma IP.', v:false}],
        mq:[{q:'¿Quién asigna la IP pública?', opts:['El usuario final siempre','Nadie','El proveedor de servicio de internet','El teclado'], correct:2},{q:'Una IP privada se usa...', opts:['Solo en el extranjero','Nunca','En ningún dispositivo','Dentro de una red local'], correct:3}], pic:[{emoji:'🏠', q:'Una IP privada es como la dirección de...', opts:['Un país entero','Nada','Una casa dentro de un barrio','El espacio exterior'], correct:2},{emoji:'🌐', q:'Esta imagen representa una IP...', opts:['Pública, visible en internet','Inexistente','De un teléfono viejo','De un CD'], correct:0}], imgloc:[{q:'¿Cuál de estas imágenes representa una IP privada, como la dirección de una casa?', pics:['🌐','🌎','🏠','🛰️'], correct:2},{q:'¿Cuál de estas imágenes representa una IP pública visible en internet?', pics:['🌐','🛏️','🏠','🚪'], correct:0}]}
    ],
    game:{ word:'TOPOLOGIA', bombCount:8 },
    dragline:[
      {a:'LAN', b:'Red pequeña, como la del colegio'},
      {a:'WAN', b:'Red gigante, como internet'},
      {a:'Router', b:'Conecta redes distintas'},
      {a:'IP', b:'Dirección única de un equipo en la red'}
    ],
    quiz:[
      {q:'Una red conecta...', opts:['Solo un computador','Varios computadores entre sí','Un lápiz y un papel','Nada'], correct:1},
      {q:'Una red pequeña como la del colegio se llama...', opts:['WAN','LAN','Ninguna','Internet gigante'], correct:1},
      {q:'La dirección IP es...', opts:['El nombre único de un computador en la red','Un color','Una contraseña de WiFi','Un sonido'], correct:0},
      {q:'Internet es un ejemplo de red...', opts:['Muy grande (WAN)','Imaginaria','Sin computadores','Muy pequeña'], correct:0},
      {q:'El protocolo TCP/IP sirve para...', opts:['Nada','Imprimir documentos','Que los computadores se comuniquen en la red','Pintar la pantalla'], correct:2},
      {q:'Un router sirve para...', opts:['Conectar redes distintas y dirigir el tráfico','Escuchar música','Nada','Guardar archivos'], correct:0},
      {q:'Una topología de estrella conecta los equipos...', opts:['Sin ningún orden','En línea recta','De forma aleatoria','A través de un punto central'], correct:3},
      {q:'Un switch sirve para...', opts:['Imprimir','Nada','Conectar redes distintas entre países','Conectar varios dispositivos dentro de una misma red'], correct:3}
    ]
  },
  {
    id:'redes2', grado:11, period:'Periodo III', name:'Redes de Datos II', icon:'<i class="bi bi-ethernet"></i>',
    theory:'Este periodo profundiza en la parte más técnica y práctica de las redes de datos. Aprenderás las normas y estándares de instalación de cableado estructurado: TIA/EIA 568 (con sus variantes 568A y 568B, que definen cómo se conectan los cables de red), ANSI/TIA 606B, ISO/IEC 14763-1 y EN 50174-1, todas ellas reglas internacionales que aseguran que una instalación de red sea segura, organizada y fácil de mantener. Usarás el simulador de redes Cisco Packet Tracer, una herramienta que te permite diseñar y probar redes completas en la pantalla del computador antes de instalarlas de verdad, entendiendo su entorno, sus elementos, el gateway (la puerta de salida de una red hacia otra), rutas estáticas (caminos fijos configurados manualmente), direccionamiento LAN, DHCP (asignación automática de direcciones IP), VLAN y VPLAN (redes virtuales dentro de una misma red física), y protocolos de enrutamiento dinámico como OSPF y EIGRP, además del protocolo VTP. El periodo también incluye la corrección de tu anteproyecto de grado, identificando posibles problemas, sustituciones y sugerencias antes de la versión final.',
    subtemas:[
      {icon:'<i class="bi bi-link-45deg"></i>', label:'Cableado estructurado', text:'Las normas TIA/EIA 568A y 568B definen el orden exacto de los colores de los cables dentro de un conector RJ45, para que cualquier técnico en el mundo pueda instalar o reparar una red siguiendo el mismo estándar. Otras normas como ANSI/TIA 606B, ISO/IEC 14763-1 y EN 50174-1 regulan la administración, etiquetado y buenas prácticas de instalación, asegurando que una red sea fácil de mantener y ampliar en el futuro.',
        videos:[{id:'Qx5rYlJj1Xk', title:'Cableado estructurado en Cisco Packet Tracer'},{id:'GXTRXdr5JK8', title:'Armado de cable de red (RJ45): normas 568A y 568B'},{id:'laWefp80lz4', title:'Cableado estructurado explicado'}],
        tiktoks:[{id:'7498176490723347717', url:'https://www.tiktok.com/@electrico_de_interiores_/video/7498176490723347717', title:'Cableado estructurado'},{id:'7266189805581634822', url:'https://www.tiktok.com/@maatit_/video/7266189805581634822', title:'Normas de cableado de red'}],
        fc:[{t:'TIA/EIA 568', d:'Norma que define el orden de colores en un conector RJ45'},{t:'RJ45', d:'Conector usado en los cables de red'},{t:'Cableado estructurado', d:'Conjunto de normas para instalar y organizar cables de red'}],
        tf:[{s:'Las normas de cableado ayudan a que la red sea fácil de mantener.', v:true},{s:'No existen normas para instalar cables de red.', v:false}],
        mq:[{q:'¿Qué define la norma TIA/EIA 568?', opts:['El color de la pared','El precio del cable','El orden de los colores del cable','Nada'], correct:2},{q:'Un cableado bien organizado ayuda a...', opts:['Nada','Perder tiempo','Dañar la red','Que la red funcione mejor'], correct:3}], pic:[{emoji:'🔌', q:'Este conector se llama...', opts:['HDMI','RJ45','Auxiliar','USB'], correct:1},{emoji:'🎨', q:'Los colores de un cable de red siguen la norma...', opts:['Icontec 1486','ISO 9001','TIA/EIA 568','Ninguna norma'], correct:2}], imgloc:[{q:'¿Cuál de estos conectores se llama RJ45?', pics:['🎧','💡','🔋','🔌'], correct:3},{q:'¿Cuál de estas imágenes representa los colores de un cable de red organizados por norma?', pics:['🎨','🎈','🎁','🎪'], correct:0}]},
      {icon:'<i class="bi bi-diagram-2-fill"></i>', label:'Packet Tracer', text:'Cisco Packet Tracer es un simulador que permite armar redes completas de forma virtual: agregar computadores, switches, routers, cables, y configurarlos exactamente como lo harías con equipos reales. Esto permite practicar, cometer errores y aprender sin gastar dinero en equipos ni arriesgar dañar una red real. Aprenderás sobre el gateway (la puerta de enlace que conecta tu red con otras), DHCP (que asigna direcciones IP automáticamente) y VLAN (redes virtuales que dividen lógicamente una misma red física).',
        videos:[{id:'26H5mbZbxLc', title:'Diseño físico de una red en Packet Tracer'},{id:'IE--DWzfnwU', title:'Cisco Packet Tracer: tutorial para principiantes'},{id:'dhKcOSAzJbU', title:'Packet Tracer: primeros pasos'},{id:'9FrsBHodw8E', title:'Cisco Packet Tracer tutorial'}],
        tiktoks:[{id:'7643588785803906312', url:'https://www.tiktok.com/@netlab.academy/video/7643588785803906312', title:'Packet Tracer explicado'},{id:'7605890731261054230', url:'https://www.tiktok.com/@reseaupro5/video/7605890731261054230', title:'Simulación de redes'},{id:'6969734432890572037', url:'https://www.tiktok.com/@broadevolutions/video/6969734432890572037', title:'Cisco Packet Tracer'}],
        fc:[{t:'Packet Tracer', d:'Simulador de redes de Cisco'},{t:'Gateway', d:'Puerta de enlace que conecta una red con otra'},{t:'DHCP', d:'Asigna direcciones IP automáticamente'}],
        tf:[{s:'Packet Tracer permite practicar sin dañar equipos reales.', v:true},{s:'El DHCP asigna direcciones IP manualmente siempre.', v:false}],
        mq:[{q:'¿Para qué sirve Cisco Packet Tracer?', opts:['Ver películas','Editar fotos','Nada','Simular redes en la pantalla'], correct:3},{q:'El DHCP sirve para...', opts:['Asignar direcciones IP automáticamente','Nada','Borrar archivos','Formatear discos'], correct:0}], pic:[{emoji:'🖧', q:'Esta imagen representa un dispositivo de red llamado...', opts:['Mouse','Teclado','Router o switch','Impresora'], correct:2},{emoji:'🧪', q:'Cisco Packet Tracer sirve para...', opts:['Simular redes sin dañar equipos reales','Escuchar música','Ver películas','Dibujar'], correct:0}], imgloc:[{q:'¿Cuál de estas imágenes representa un dispositivo de red como un router?', pics:['⌨️','🖧','🖨️','🖱️'], correct:1},{q:'¿Cuál de estos íconos representa simular una red sin dañar equipos reales?', pics:['🎵','🎮','🎨','🧪'], correct:3}]},
      {icon:'<i class="bi bi-signpost-2-fill"></i>', label:'Enrutamiento', text:'Una ruta estática es un camino que el administrador de la red configura manualmente para que los datos sepan exactamente por dónde ir. Los protocolos de enrutamiento dinámico, como OSPF y EIGRP, permiten que los routers descubran automáticamente las mejores rutas y se adapten solos si algo cambia en la red, sin necesitar configuración manual constante.',
        videos:[{id:'c-Tt3lpKH3A', title:'Prelaboratorio: rutas estáticas y OSPF'},{id:'vrR5l4KwpTw', title:'Configuración de rutas estáticas en Packet Tracer'},{id:'7jJylCfmVvQ', title:'Enrutamiento explicado'}],
        fc:[{t:'Ruta estática', d:'Camino fijo configurado manualmente'},{t:'OSPF', d:'Protocolo de enrutamiento dinámico'},{t:'Router', d:'Dispositivo que dirige el tráfico entre redes'}],
        tf:[{s:'Los protocolos dinámicos permiten que los routers se adapten solos.', v:true},{s:'Una ruta estática cambia automáticamente sola.', v:false}],
        mq:[{q:'¿Qué hace un protocolo de enrutamiento dinámico?', opts:['Descubre automáticamente las mejores rutas','Borra la red','Apaga los routers','Nada'], correct:0},{q:'Una ruta estática se configura...', opts:['Por el usuario final','Nunca','Manualmente por el administrador','Sola, sin ayuda'], correct:2}], pic:[{emoji:'🗺️', q:'Una ruta estática es como seguir un mapa...', opts:['Que cambia solo','Fijo, configurado a mano','Inexistente','Al azar'], correct:1},{emoji:'🔀', q:'Esta imagen representa que los datos pueden tomar...', opts:['Distintas rutas hacia su destino','Ningún camino','Un camino cerrado','Solo un camino posible'], correct:0}], imgloc:[{q:'¿Cuál de estas imágenes representa un mapa con una ruta fija (ruta estática)?', pics:['🎭','🎪','🗺️','🎨'], correct:2},{q:'¿Cuál de estos íconos representa varios caminos posibles para los datos?', pics:['⬆️','➡️','🔀','⬇️'], correct:2}]}
    ],
    game:{ word:'CABLEADO', bombCount:7 },
    dragline:[
      {a:'Cableado estructurado', b:'Normas para organizar los cables'},
      {a:'Fibra óptica', b:'Transmite datos usando luz'},
      {a:'Packet Tracer', b:'Simulador de redes de Cisco'},
      {a:'Ruta estática', b:'Camino fijo configurado a mano'}
    ],
    quiz:[
      {q:'El cableado estructurado sigue...', opts:['Ningún orden','Solo colores bonitos','Nada','Normas y reglas de instalación'], correct:3},
      {q:'Cisco Packet Tracer sirve para...', opts:['Ver videos','Imprimir documentos','Simular redes en la pantalla','Jugar'], correct:2},
      {q:'¿Por qué es útil simular una red antes de armarla?', opts:['Para perder tiempo','Para practicar sin dañar equipos reales','Para hacer ruido','No sirve para nada'], correct:1},
      {q:'Los cables de red bien organizados ayudan a...', opts:['Dañar la red','Que la red funcione mejor','Que se vea bonito nada más','Nada'], correct:1},
      {q:'La fibra óptica transmite datos usando...', opts:['Electricidad únicamente','Agua','Sonido','Luz'], correct:3},
      {q:'Una ruta estática se configura...', opts:['Sola, sin ayuda','Por el usuario final siempre','Manualmente por el administrador de red','Nunca'], correct:2},
      {q:'El estándar TIA/EIA 568 regula...', opts:['El software del computador','El cableado estructurado','Los colores de la ropa','Nada'], correct:1},
      {q:'Simular una red antes de instalarla ayuda a...', opts:['Detectar errores sin gastar en equipos reales','Nada','Complicar el trabajo','Perder el tiempo'], correct:0}
    ]
  },
  {
    id:'webdev', grado:11, period:'Periodo IV', name:'Páginas Web', icon:'<i class="bi bi-code-slash"></i>',
    theory:'En este último periodo aprenderás cómo se construyen las páginas web que usas todos los días, como esta misma. Empezarás por la historia: cómo nació internet, cómo evolucionó hacia la Web tal como la conocemos, la historia de los navegadores web que nos permiten verla, y la historia del lenguaje HTML. Entenderás qué es el desarrollo web, la arquitectura de una aplicación web (cómo se comunican el navegador y el servidor), y el diseño gráfico de una aplicación. Profundizarás en HTML, tanto en sus conceptos básicos como avanzados, incluyendo HTML5, el estándar actual. Aprenderás CSS, desde lo básico hasta conceptos avanzados y CSS3, además de conocer los frameworks de CSS (herramientas que aceleran el diseño). Darás tus primeros pasos en JavaScript, el lenguaje que le da vida e interacción a las páginas web, tanto en sus conceptos básicos como avanzados. El periodo cierra con la elaboración de tu anteproyecto de grado y una introducción a la implementación de aplicaciones en la nube, conociendo los tipos de servicios: SaaS, PaaS e IaaS. Finalmente, este es el periodo de la sustentación final de tu proyecto de grado de Media Técnica, donde demuestras todo lo aprendido durante estos dos años.',
    subtemas:[
      {icon:'<i class="bi bi-globe2"></i>', label:'Historia de internet', text:'Internet nació como un proyecto militar y académico en los años 60, pensado para conectar computadores en red incluso si parte de la red fallaba. Décadas después, en 1989, Tim Berners-Lee propuso la World Wide Web: un sistema de documentos conectados por hipervínculos, mucho más fácil de usar. A partir de ahí aparecieron los primeros navegadores web, que permitieron a cualquier persona "ver" esas páginas, y el lenguaje HTML, que definía cómo se estructuraba el contenido de cada página.',
        videos:[{id:'K_VD9X1NuUw', title:'Historia del Internet'},{id:'SNw4m1m_2GE', title:'Tim Berners-Lee: creador de la World Wide Web'},{id:'l-zFtlzanvQ', title:'Historia de internet'},{id:'rw41W8crZ_Y', title:'Cómo nació internet'}],
        tiktoks:[{id:'6969734432890572037', url:'https://www.tiktok.com/@broadevolutions/video/6969734432890572037', title:'Cómo nació internet'},{id:'7464760431400193285', url:'https://www.tiktok.com/@cideapps/video/7464760431400193285', title:'Historia de internet'},{id:'7461067498587196715', url:'https://www.tiktok.com/@clavedelpasado/video/7461067498587196715', title:'World Wide Web explicada'}],
        fc:[{t:'World Wide Web', d:'Sistema de documentos conectados por hipervínculos'},{t:'Tim Berners-Lee', d:'Propuso la World Wide Web en 1989'},{t:'Navegador web', d:'Programa que permite ver páginas web'}],
        tf:[{s:'Internet nació como un proyecto militar y académico.', v:true},{s:'La World Wide Web y el internet son exactamente lo mismo desde el inicio.', v:false}],
        mq:[{q:'¿Quién propuso la World Wide Web?', opts:['Mark Zuckerberg','Steve Jobs','Tim Berners-Lee','Bill Gates'], correct:2},{q:'Un navegador web sirve para...', opts:['Escuchar música únicamente','Nada','Imprimir documentos','Ver páginas web en internet'], correct:3}], pic:[{emoji:'🕸️', q:'Esta imagen representa...', opts:['Un mapa','La World Wide Web','Un juego','Una telaraña real'], correct:1},{emoji:'🧑‍💻', q:'Esta persona propuso la World Wide Web en 1989...', opts:['Steve Jobs','Bill Gates','Elon Musk','Tim Berners-Lee'], correct:3}], imgloc:[{q:'¿Cuál de estas imágenes representa la World Wide Web?', pics:['🕸️','🎪','🎭','🎨'], correct:0},{q:'¿Cuál de estos íconos representa a la persona que propuso la Web?', pics:['🧑‍🎨','🧑‍🍳','🧑‍🎤','🧑‍💻'], correct:3}]},
      {icon:'<i class="bi bi-building"></i>', label:'HTML y CSS', text:'HTML (HyperText Markup Language) es el lenguaje que arma el "esqueleto" de una página: títulos, párrafos, imágenes, botones, enlaces. Cada elemento se marca con etiquetas, como &lt;h1&gt; para un título grande o &lt;p&gt; para un párrafo. CSS (Cascading Style Sheets) le da estilo a ese esqueleto: colores, tamaños, espacios, animaciones. Con CSS3 (la versión actual) se pueden lograr diseños muy sofisticados, y existen frameworks de CSS (conjuntos de reglas ya hechas) que aceleran mucho el trabajo de diseño.',
        videos:[{id:'ELSm-G201Ls', title:'Curso de HTML y CSS desde cero'},{id:'X5usDXtXt18', title:'HTML desde cero: etiquetas y estructura básica'},{id:'EvKm8yhM7V8', title:'HTML básico explicado'}],
        tiktoks:[{id:'7565176830366387476', url:'https://www.tiktok.com/@qchone/video/7565176830366387476', title:'HTML explicado'},{id:'7499906542938967301', url:'https://www.tiktok.com/@learn.code.17/video/7499906542938967301', title:'Etiquetas HTML básicas'},{id:'7571518378850995464', url:'https://www.tiktok.com/@kedev21/video/7571518378850995464', title:'CSS explicado'},{id:'7544826015101619462', url:'https://www.tiktok.com/@juniordevstudio/video/7544826015101619462', title:'Estilos con CSS'}],
        fc:[{t:'HTML', d:'Arma el esqueleto de una página web'},{t:'CSS', d:'Da estilo: colores, tamaños y espacios'},{t:'Etiqueta', d:'Marca cada elemento del contenido en HTML'}],
        tf:[{s:'CSS3 permite lograr diseños muy sofisticados.', v:true},{s:'HTML se encarga de dar color a la página.', v:false}],
        mq:[{q:'El HTML se usa para...', opts:['Cocinar','Pintar paredes','Armar la estructura de una página web','Escuchar música'], correct:2},{q:'El CSS le da a la página...', opts:['Nada','Solo texto sin forma','Color y estilo','Sonido'], correct:2}], pic:[{emoji:'🏗️', q:'HTML arma qué parte de una página web...', opts:['La estructura (el esqueleto)','Nada','El sonido','Solo el color'], correct:0},{emoji:'🎨', q:'Esta imagen representa lo que hace...', opts:['CSS: darle estilo y color','El servidor','HTML: la estructura','JavaScript: la interacción'], correct:0}], imgloc:[{q:'¿Cuál de estas imágenes representa la estructura (esqueleto) de una página web?', pics:['🎵','🎬','🏗️','🎨'], correct:2},{q:'¿Cuál de estos íconos representa darle estilo y color a una página?', pics:['🔧','🏗️','📐','🎨'], correct:3}]},
      {icon:'<i class="bi bi-gear-fill"></i>', label:'JavaScript', text:'Si HTML es el esqueleto y CSS es la ropa, JavaScript son los músculos: es el lenguaje que hace que la página reaccione — que un botón haga algo al hacer clic, que aparezca un mensaje, que se guarde información, o que (como en este mismo sitio) funcionen los juegos y las evaluaciones interactivas. Aprenderás conceptos básicos y avanzados de este lenguaje fundamental del desarrollo web moderno.',
        videos:[{id:'RqQ1d1qEWlE', title:'Curso JavaScript para principiantes'},{id:'8GTaO9XhA5M', title:'Aprende JavaScript en 10 minutos'}],
        tiktoks:[{id:'7377572631127674118', url:'https://www.tiktok.com/@sys.nodools/video/7377572631127674118', title:'JavaScript explicado'},{id:'7572809586432953621', url:'https://www.tiktok.com/@kedev21/video/7572809586432953621', title:'JavaScript para principiantes'},{id:'7177090172750728454', url:'https://www.tiktok.com/@carlosazaustre/video/7177090172750728454', title:'Fundamentos de JavaScript'}],
        fc:[{t:'JavaScript', d:'Lenguaje que da movimiento e interacción a la página'},{t:'Evento', d:'Una acción como hacer clic en un botón'},{t:'Interactividad', d:'Que la página reaccione a lo que hace el usuario'}],
        tf:[{s:'JavaScript permite que un botón haga algo al hacer clic.', v:true},{s:'JavaScript solo sirve para dar color a la página.', v:false}],
        mq:[{q:'JavaScript le da a la página...', opts:['Solo texto','Solo colores','Movimiento e interacción','Nada'], correct:2},{q:'Los juegos de este sitio funcionan gracias a...', opts:['Solo HTML','JavaScript','Solo CSS','Ninguno'], correct:1}], pic:[{emoji:'⚙️', q:'Esta imagen representa lo que le da JavaScript a la página...', opts:['Nada','Solo color','Movimiento e interacción','Solo texto'], correct:2},{emoji:'🖱️', q:'Un clic en un botón que hace algo es un ejemplo de...', opts:['Ninguno','Solo CSS','Solo HTML','Evento de JavaScript'], correct:3}], imgloc:[{q:'¿Cuál de estas imágenes representa el movimiento e interacción de una página?', pics:['📚','⚙️','📄','🖼️'], correct:1},{q:'¿Cuál de estos íconos representa un clic que activa una acción?', pics:['⌨️','🖱️','📠','🖨️'], correct:1}]},
      {icon:'<i class="bi bi-cloud-fill"></i>', label:'Computación en la nube', text:'La computación en la nube permite usar programas y almacenar información a través de internet, sin necesitar instalarlo todo en tu propio computador. SaaS (Software as a Service) es un programa que usas directamente desde el navegador, como el correo electrónico. PaaS (Platform as a Service) ofrece una plataforma lista para que los desarrolladores construyan aplicaciones sin preocuparse por la infraestructura. IaaS (Infrastructure as a Service) alquila la infraestructura misma (servidores, almacenamiento) para que una empresa monte lo que necesite sobre ella.',
        videos:[{id:'9uksJU4XqlM', title:'IaaS, PaaS, SaaS: explicación rápida para principiantes'},{id:'bgEFjHMx7ec', title:'Cloud Computing explicado: fundamentos de la nube'},{id:'MCKdahh2lSo', title:'Computación en la nube explicada'},{id:'h4Af5bbFAq0', title:'Qué es la nube (cloud computing)'}],
        tiktoks:[{id:'7135685241825430790', url:'https://www.tiktok.com/@capacitateparaelempleo/video/7135685241825430790', title:'Computación en la nube'},{id:'7438071793379708216', url:'https://www.tiktok.com/@innovatorslab23/video/7438071793379708216', title:'Qué es la nube'},{id:'7664832373443366164', url:'https://www.tiktok.com/@gruposoporteti_oficial/video/7664832373443366164', title:'Servicios en la nube'}],
        fc:[{t:'SaaS', d:'Programa que se usa directamente desde el navegador'},{t:'PaaS', d:'Plataforma lista para construir aplicaciones'},{t:'IaaS', d:'Alquila la infraestructura misma (servidores, almacenamiento)'}],
        tf:[{s:'SaaS es un ejemplo de programa que se usa sin instalarlo.', v:true},{s:'IaaS alquila la infraestructura como servidores y almacenamiento.', v:true}],
        mq:[{q:'El correo electrónico que usas desde el navegador es un ejemplo de...', opts:['IaaS','SaaS','Ninguno','PaaS'], correct:1},{q:'¿Qué permite usar programas sin instalarlos en tu computador?', opts:['El mantenimiento correctivo','El formateo','La computación en la nube','Nada'], correct:2}], pic:[{emoji:'☁️', q:'Esta imagen representa...', opts:['Un dibujo','La computación en la nube','El clima','Un videojuego'], correct:1},{emoji:'📧', q:'Usar el correo electrónico desde el navegador es un ejemplo de...', opts:['Ninguno','PaaS','IaaS','SaaS'], correct:3}], imgloc:[{q:'¿Cuál de estas imágenes representa la computación en la nube?', pics:['❄️','🌞','☁️','🌧️'], correct:2},{q:'¿Cuál de estos íconos representa un servicio que usas sin instalarlo, como el correo?', pics:['💽','🖥️','📧','🖨️'], correct:2}]}
    ],
    game:{ word:'CODIGO', bombCount:6 },
    dragline:[
      {a:'HTML', b:'Arma la estructura de la página'},
      {a:'CSS', b:'Da color y estilo a la página'},
      {a:'JavaScript', b:'Da movimiento e interacción'},
      {a:'Nube', b:'Servicios que funcionan por internet'}
    ],
    quiz:[
      {q:'El HTML se usa para...', opts:['Cocinar','Escuchar música','Armar la estructura de una página web','Pintar paredes'], correct:2},
      {q:'El CSS le da a la página...', opts:['Color y estilo','Solo texto sin forma','Nada','Sonido'], correct:0},
      {q:'JavaScript le da a la página...', opts:['Solo colores','Nada','Solo texto','Movimiento e interacción'], correct:3},
      {q:'Con HTML, CSS y JavaScript se pueden crear...', opts:['Nada de eso','Páginas web','Solo música','Solo dibujos en papel'], correct:1},
      {q:'¿Quién propuso la World Wide Web?', opts:['Bill Gates','Tim Berners-Lee','Steve Jobs','Mark Zuckerberg'], correct:1},
      {q:'Un navegador web sirve para...', opts:['Ver páginas web en internet','Escuchar música únicamente','Nada','Imprimir documentos'], correct:0},
      {q:'SaaS significa que un programa...', opts:['No funciona nunca','Se debe instalar siempre','Es gratis siempre','Se usa desde internet sin instalarlo'], correct:3},
      {q:'Las etiquetas en HTML sirven para...', opts:['Tocar música','Definir la estructura del contenido','Pintar la pared','Nada'], correct:1}
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
    setupPicQuiz(`pic-${t.id}-${idx}`);
    setupImgLoc(`imgloc-${t.id}-${idx}`);
  });
  loadTikTokEmbedScript();
}

/* ================= SUBTEMA: bloque de videos + 4 actividades ================= */
function subtemaBlockHtml(t, s, idx){
  const videosHtml = (s.videos || []).map(v => `
    <div class="sub-video-item">
      <div class="video-frame-wrap sub-video-frame">
        <iframe src="https://www.youtube.com/embed/${v.id}" title="${v.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
      </div>
      <p class="video-caption">${v.title}</p>
    </div>`).join('');

  const tiktoksHtml = (s.tiktoks || []).map(v => `
    <div class="sub-video-item tiktok-item">
      <blockquote class="tiktok-embed" cite="${v.url}" data-video-id="${v.id}" style="max-width:325px; min-width:280px; margin:0 auto;">
        <section></section>
      </blockquote>
      <p class="video-caption">${v.title} <i class="bi bi-tiktok" style="opacity:.6;"></i></p>
    </div>`).join('');

  const fcId = `fc-${t.id}-${idx}`;
  const tfId = `tf-${t.id}-${idx}`;
  const mqId = `mq-${t.id}-${idx}`;
  const picId = `pic-${t.id}-${idx}`;
  const imgLocId = `imgloc-${t.id}-${idx}`;

  return `
    <div class="subtema-block">
      <div class="bubble">
        <h4>${s.icon} ${s.label}</h4>
        ${s.text}
      </div>

      <h5 class="sub-h"><i class="bi bi-camera-reels-fill"></i> Videos de ${s.label}</h5>
      <div class="sub-video-grid">${videosHtml}${tiktoksHtml}</div>

      <h5 class="sub-h"><i class="bi bi-controller"></i> Actividades de ${s.label}</h5>
      <div class="activity-grid">
        ${renderFlashcardsHtml(fcId, s.fc || [])}
        ${renderTrueFalseHtml(tfId, s.tf || [])}
        ${renderMiniQuizHtml(mqId, s.mq || [])}
        ${renderPicQuizHtml(picId, s.pic || [])}
        ${renderImgLocHtml(imgLocId, s.imgloc || [])}
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

function renderPicQuizHtml(id, items){
  return `
    <div class="activity-card pic-card">
      <div class="activity-head pic-head"><i class="bi bi-image-fill"></i> Adivina la imagen</div>
      <p class="activity-hint">Mira la imagen y elige la respuesta correcta.</p>
      <div id="${id}">
        ${items.map((it,ii)=>`
          <div class="pic-emoji">${it.emoji}</div>
          <div class="quiz-q">${it.q}</div>
          <div class="quiz-opts" data-qi="${ii}">
            ${it.opts.map((o,oi)=>`<button class="quiz-opt" data-o="${oi}" data-correct="${it.correct}" type="button">${o}</button>`).join('')}
          </div>`).join('')}
      </div>
    </div>`;
}

function setupPicQuiz(id){
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

function renderImgLocHtml(id, items){
  return `
    <div class="activity-card imgloc-card">
      <div class="activity-head imgloc-head"><i class="bi bi-geo-alt-fill"></i> Ubica la imagen</div>
      <p class="activity-hint">Lee la pregunta y toca la imagen correcta.</p>
      <div id="${id}">
        ${items.map((it,ii)=>`
          <div class="quiz-q">${it.q}</div>
          <div class="imgloc-grid" data-qi="${ii}">
            ${it.pics.map((p,pi)=>`<button class="imgloc-opt" data-o="${pi}" data-correct="${it.correct}" type="button"><span class="imgloc-emoji">${p}</span></button>`).join('')}
          </div>`).join('')}
      </div>
    </div>`;
}

function setupImgLoc(id){
  const wrap = document.getElementById(id);
  if(!wrap) return;
  wrap.querySelectorAll('.imgloc-grid').forEach(group=>{
    const btns = group.querySelectorAll('.imgloc-opt');
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

function setupSiteSticker(){
  if(document.getElementById('siteSticker')) return;
  const img = document.createElement('img');
  img.id = 'siteSticker';
  img.className = 'site-sticker';
  img.src = 'sticker.png';
  img.alt = 'Estudiantes de la Institución Educativa Carlos Lleras Restrepo';
  document.body.appendChild(img);
}

function loadTikTokEmbedScript(){
  // El widget de TikTok solo procesa los blockquotes que existen en el DOM
  // en el momento justo en que su script se ejecuta. Como nuestro sitio inserta
  // videos dinámicamente (al cambiar de pestaña o tema), hay que volver a insertar
  // el script cada vez (con un parámetro de tiempo para evitar la caché del navegador),
  // así TikTok vuelve a "barrer" la página y renderiza los videos nuevos.
  const old = document.getElementById('tiktokEmbedScript');
  if(old) old.remove();
  const script = document.createElement('script');
  script.id = 'tiktokEmbedScript';
  script.async = true;
  script.src = 'https://www.tiktok.com/embed.js?t=' + Date.now();
  document.body.appendChild(script);
}

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', ()=>{
  if(window.PAGE_GRADO) initGradoPage(window.PAGE_GRADO);
  if(document.getElementById('evalTabs')) initEvalPage();
  setupFloatingBit();
  setupSiteSticker();
  checkLoginOnLoad();
});
