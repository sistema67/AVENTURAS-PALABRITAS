/* ==========================================
   PALABRITAS
   Juego educativo de lectura y escritura
========================================== */

const $ = id => document.getElementById(id);

const STORAGE_KEY = "palabritas_v1";

let db = loadDB();
let currentUser = null;
let difficulty = "easy";
let tasks = [];
let taskIndex = 0;
let scoreAtStart = 0;
let timerInterval = null;
let secondsLeft = 600;
let soundOn = true;
let speechAvailable = "speechSynthesis" in window;

/* ==========================================
   BANCO DE SÍLABAS
========================================== */

const simpleSyllables = [
  "ba","be","bi","bo","bu",
  "ca","ce","ci","co","cu",
  "cha","che","chi","cho","chu",
  "da","de","di","do","du",
  "fa","fe","fi","fo","fu",
  "ga","ge","gi","go","gu",
  "ja","je","ji","jo","ju",
  "la","le","li","lo","lu",
  "lla","lle","lli","llo","llu",
  "ma","me","mi","mo","mu",
  "na","ne","ni","no","nu",
  "ña","ñe","ñi","ño","ñu",
  "pa","pe","pi","po","pu",
  "que","qui",
  "ra","re","ri","ro","ru",
  "rra","rre","rri","rro","rru",
  "sa","se","si","so","su",
  "ta","te","ti","to","tu",
  "va","ve","vi","vo","vu",
  "ya","ye","yi","yo","yu",
  "za","ze","zi","zo","zu"
];

const directSyllables = [
  "bla","ble","bli","blo","blu",
  "bra","bre","bri","bro","bru",
  "cla","cle","cli","clo","clu",
  "cra","cre","cri","cro","cru",
  "dra","dre","dri","dro","dru",
  "fla","fle","fli","flo","flu",
  "fra","fre","fri","fro","fru",
  "gla","gle","gli","glo","glu",
  "gra","gre","gri","gro","gru",
  "pla","ple","pli","plo","plu",
  "pra","pre","pri","pro","pru",
  "tra","tre","tri","tro","tru"
];

const otherSyllables = [
  "al","el","il","ol","ul",
  "an","en","in","on","un",
  "ar","er","ir","or","ur",
  "as","es","is","os","us",
  "am","em","im","om","um",
  "ai","au","ei","eu",
  "ia","ie","io","iu",
  "oi","ou","ua","ue","ui","uo"
];

/* ==========================================
   PALABRAS E ILUSTRACIONES DEL ABECEDARIO
========================================== */

const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

const alphabetExamples = [
  ["avión","✈️"],
  ["barco","⛵"],
  ["casa","🏠"],
  ["dado","🎲"],
  ["estrella","⭐"],
  ["flor","🌸"],
  ["gato","🐱"],
  ["helado","🍦"],
  ["isla","🏝️"],
  ["jirafa","🦒"],
  ["koala","🐨"],
  ["luna","🌙"],
  ["mano","✋"],
  ["nube","☁️"],
  ["ñandú","🐦"],
  ["oso","🐻"],
  ["pelota","⚽"],
  ["queso","🧀"],
  ["rana","🐸"],
  ["sol","☀️"],
  ["tortuga","🐢"],
  ["uvas","🍇"],
  ["vaca","🐮"],
  ["waffle","🧇"],
  ["xilófono","🎼"],
  ["yoyó","🪀"],
  ["zapato","👟"]
];

/* ==========================================
   EJERCICIOS
========================================== */

const mediumTasks = [
  {
    type:"write",
    word:"gato",
    icon:"🐱",
    instruction:"Escribe el nombre del dibujo",
    hint:"¿Qué animal aparece?"
  },
  {
    type:"read",
    text:"El sol brilla en el cielo.",
    icon:"☀️",
    instruction:"Lee la oración en voz alta",
    hint:"Lee con calma y atención."
  },
  {
    type:"write",
    word:"mariposa",
    icon:"🦋",
    instruction:"Escribe el nombre del dibujo",
    hint:"Observa sus alas."
  },
  {
    type:"read",
    text:"Mi casa es bonita.",
    icon:"🏠",
    instruction:"Lee la oración en voz alta",
    hint:"Pronuncia cada palabra."
  },
  {
    type:"write",
    word:"pelota",
    icon:"⚽",
    instruction:"Escribe el nombre del dibujo",
    hint:"¿Con qué podemos jugar?"
  },
  {
    type:"read",
    text:"El pato nada en el agua.",
    icon:"🦆",
    instruction:"Lee la oración en voz alta",
    hint:"Sigue las palabras de izquierda a derecha."
  },
  {
    type:"write",
    word:"estrella",
    icon:"⭐",
    instruction:"Escribe el nombre del dibujo",
    hint:"Brilla en el cielo."
  },
  {
    type:"read",
    text:"La niña juega con su perro.",
    icon:"🐶",
    instruction:"Lee la oración en voz alta",
    hint:"¡Tú puedes leerla!"
  },
  {
    type:"write",
    word:"manzana",
    icon:"🍎",
    instruction:"Escribe el nombre de la fruta",
    hint:"Es una fruta roja."
  },
  {
    type:"read",
    text:"Mi familia cuida las plantas.",
    icon:"🌱",
    instruction:"Lee la oración en voz alta",
    hint:"Lee despacio."
  },
  {
    type:"write",
    word:"conejo",
    icon:"🐰",
    instruction:"Escribe el nombre del animal",
    hint:"Tiene orejas largas."
  },
  {
    type:"read",
    text:"La mariposa vuela sobre la flor.",
    icon:"🌸",
    instruction:"Lee la oración en voz alta",
    hint:"¡Muy bien, sigue practicando!"
  }
];

const hardTasks = [
  {
    type:"write",
    word:"mariposa",
    icon:"🦋",
    instruction:"Escribe el nombre del dibujo",
    hint:"Observa bien la ilustración."
  },
  {
    type:"read",
    text:"La pequeña mariposa vuela entre las flores del jardín.",
    icon:"🌺",
    instruction:"Lee esta oración en voz alta",
    hint:"Respeta los espacios y las pausas."
  },
  {
    type:"write",
    word:"biblioteca",
    icon:"📚",
    instruction:"Escribe el nombre del lugar",
    hint:"Es un lugar lleno de libros."
  },
  {
    type:"read",
    text:"Mi familia visita la biblioteca para elegir cuentos divertidos.",
    icon:"👨‍👩‍👧",
    instruction:"Lee esta oración en voz alta",
    hint:"Pronuncia cada palabra con claridad."
  },
  {
    type:"write",
    word:"helicóptero",
    icon:"🚁",
    instruction:"Escribe el nombre del dibujo",
    hint:"Recuerda colocar la tilde."
  },
  {
    type:"read",
    text:"El conejo blanco salta alegremente por el campo verde.",
    icon:"🐰",
    instruction:"Lee esta oración en voz alta",
    hint:"Haz una pequeña pausa al terminar."
  },
  {
    type:"write",
    word:"arcoíris",
    icon:"🌈",
    instruction:"Escribe el nombre del dibujo",
    hint:"Observa sus colores."
  },
  {
    type:"read",
    text:"Cada mañana, los niños llegan contentos a la escuela para aprender algo nuevo.",
    icon:"🏫",
    instruction:"Lee esta oración en voz alta",
    hint:"Lee con calma y claridad."
  },
  {
    type:"write",
    word:"computadora",
    icon:"💻",
    instruction:"Escribe el nombre del equipo",
    hint:"Escribe la palabra completa."
  },
  {
    type:"read",
    text:"Cuidar el agua, los animales y las plantas ayuda a nuestro planeta.",
    icon:"🌎",
    instruction:"Lee esta oración en voz alta",
    hint:"¡Un último gran esfuerzo!"
  }
];

/* ==========================================
   BASE DE DATOS Y USUARIOS
========================================== */

function loadDB() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (data && data.users) {
      Object.values(data.users).forEach(user => {
        user.score = Number(user.score) || 0;
        user.completed = Number(user.completed) || 0;
        user.progress = user.progress || {
          easy:0, medium:0, hard:0
        };
        user.best = user.best || {
          easy:0, medium:0, hard:0
        };
      });

      return data;
    }
  } catch(error) {
    console.warn("No se pudieron cargar los usuarios.", error);
  }

  return {users:{}};
}

function saveDB() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch(error) {
    showToast("No se pudo guardar el avance.");
  }
}

function newUser(name) {
  const id = "u_" + Date.now() + "_" +
    Math.random().toString(36).slice(2,6);

  db.users[id] = {
    id,
    name,
    score:0,
    completed:0,
    progress:{easy:0,medium:0,hard:0},
    best:{easy:0,medium:0,hard:0}
  };

  saveDB();
  return id;
}

function refreshProfiles() {
  const select = $("profileSelect");
  select.innerHTML = "";

  const users = Object.values(db.users);

  if (!users.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Aún no hay usuarios";
    select.append(option);
    currentUser = null;
    return;
  }

  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = "🌟 " + user.name;
    select.append(option);
  });

  if (currentUser && db.users[currentUser]) {
    select.value = currentUser;
  } else {
    currentUser = users[0].id;
    select.value = currentUser;
  }
}

function createProfile() {
  const name = $("newName").value.trim();

  if (!name) {
    showToast("Escribe tu nombre primero.");
    $("newName").focus();
    return;
  }

  currentUser = newUser(name);

  $("newName").value = "";

  refreshProfiles();

  showToast("¡Hola, " + name + "! Usuario creado.");
}

function deleteCurrentProfile() {
  const id = $("profileSelect").value;

  if (!id || !db.users[id]) {
    showToast("Primero selecciona un usuario.");
    return;
  }

  const user = db.users[id];

  if (!confirm(
    "¿Eliminar el usuario " + user.name +
    " y todo su avance?"
  )) {
    return;
  }

  delete db.users[id];
  currentUser = null;

  saveDB();
  refreshProfiles();

  showToast("Usuario eliminado.");
}

/* ==========================================
   MENSAJES Y SONIDOS
========================================== */

function showToast(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function playTone(frequency=600, duration=.12) {
  if (!soundOn) return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(.07, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      .001,
      context.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);

    oscillator.onended = () => context.close();
  } catch(error) {
    console.warn("Audio no disponible.");
  }
}

function successSound() {
  playTone(660,.12);
  setTimeout(() => playTone(880,.16),120);
}

function errorSound() {
  playTone(230,.18);
}

function speak(text) {
  if (!speechAvailable || !text) {
    showToast("La voz no está disponible en este navegador.");
    return;
  }

  const synth = window.speechSynthesis;

  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(String(text));

  utterance.lang = "es-PE";
  utterance.rate = .88;
  utterance.pitch = 1.05;

  const voices = synth.getVoices();

  const spanishVoice = voices.find(voice =>
    voice.lang && voice.lang.toLowerCase().startsWith("es")
  );

  if (spanishVoice) {
    utterance.voice = spanishVoice;
  }

  synth.speak(utterance);
}

function speakSpelling(word) {
  const letters = [...word.toLocaleLowerCase("es")];

  speak(
    "La palabra se escribe así: " +
    letters.join(", ") +
    ". Ahora inténtalo tú."
  );
}

/* ==========================================
   PANTALLAS Y NAVEGACIÓN
========================================== */

function showScreen(screenId) {
  [
    "welcomeScreen",
    "gameScreen",
    "finishScreen"
  ].forEach(id => {
    $(id).classList.toggle("hidden", id !== screenId);
  });
}

function openPanel(panelId) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.add("hidden");
  });

  $(panelId).classList.remove("hidden");

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.panel === panelId
    );
  });

  if (panelId === "alphabetPanel") renderAlphabet();
  if (panelId === "syllablePanel") renderSyllables();
  if (panelId === "profilePanel") renderProgress();
}

function startGame() {
  if (!currentUser) {
    currentUser = $("profileSelect").value || null;
  }

  if (!currentUser || !db.users[currentUser]) {
    showToast("Primero crea o selecciona un usuario.");
    return;
  }

  $("playerName").textContent = db.users[currentUser].name;

  showScreen("gameScreen");
  openPanel("playPanel");

  resetToDifficulty();
  updateStats();
}

/* ==========================================
   DIFICULTADES Y RETOS
========================================== */

function startDifficulty(level) {
  difficulty = level;
  taskIndex = 0;
  typedKeys = "";

  if (level === "easy") {
    tasks = createEasyTasks();
  } else if (level === "medium") {
    tasks = shuffle([...mediumTasks]);
  } else {
    tasks = shuffle([...hardTasks]);
  }

  scoreAtStart = db.users[currentUser].score;

  $("difficultyPicker").classList.add("hidden");
  $("exerciseArea").classList.remove("hidden");

  $("difficultyTag").textContent =
    level === "easy" ? "FÁCIL" :
    level === "medium" ? "MEDIO" : "DIFÍCIL";

  if (level === "hard") {
    $("timerBox").classList.remove("hidden");
    startTimer();
  } else {
    $("timerBox").classList.add("hidden");
    stopTimer();
  }

  renderTask();
}

function createEasyTasks() {
  const tasksList = [];

  const letters = shuffle([...alphabet]).slice(0,12);

  letters.forEach(letter => {
    tasksList.push({
      type:"choice",
      prompt:letter,
      answer:letter,
      icon:"🔤",
      instruction:"Encuentra la letra indicada",
      hint:"Escucha y selecciona la letra correcta."
    });
  });

  const syllables = shuffle([
    ...simpleSyllables,
    ...directSyllables
  ]).slice(0,12);

  syllables.forEach(syllable => {
    tasksList.push({
      type:"choice",
      prompt:syllable.toUpperCase(),
      answer:syllable.toUpperCase(),
      icon:"📖",
      instruction:"Encuentra la sílaba indicada",
      hint:"Observa las opciones y elige la correcta."
    });
  });

  return tasksList;
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

function makeChoices(answer, pool) {
  const alternatives = shuffle(
    pool.filter(item => item !== answer)
  ).slice(0,3);

  return shuffle([answer, ...alternatives]);
}

/* ==========================================
   MOSTRAR EJERCICIOS
========================================== */

function renderTask() {
  if (taskIndex >= tasks.length) {
    finishGame(false);
    return;
  }

  const task = tasks[taskIndex];

  typedKeys = "";

  $("feedback").textContent = "";
  $("feedback").className = "feedback";

  $("nextExercise").classList.add("hidden");

  $("answerChoices").innerHTML = "";
  $("typingArea").classList.add("hidden");
  $("readArea").classList.add("hidden");

  $("answerInput").value = "";
  $("spellingSlots").innerHTML = "";

  $("exerciseIcon").textContent = task.icon || "🌟";
  $("exerciseInstruction").textContent = task.instruction;
  $("exerciseHint").textContent = task.hint || "";
  $("mascotFace").textContent = "🦊";

  $("levelTitle").textContent =
    "Nivel " + (Math.floor(taskIndex / 4) + 1);

  $("exerciseNumber").textContent =
    "Reto " + (taskIndex + 1) + " de " + tasks.length;

  $("progressText").textContent =
    "Tu aventura de " + difficulty;

  $("progressCount").textContent =
    (taskIndex + 1) + " / " + tasks.length;

  $("progressBar").style.width =
    (taskIndex / tasks.length * 100) + "%";

  if (task.type === "choice") {
    $("exercisePrompt").textContent = task.prompt;

    const pool = task.answer.length === 1
      ? alphabet
      : [...simpleSyllables, ...directSyllables]
          .map(item => item.toUpperCase());

    const choices = makeChoices(task.answer, pool);

    choices.forEach(choice => {
      const button = document.createElement("button");

      button.className = "answer-choice";
      button.textContent = choice;

      button.onclick = () => checkChoice(choice);

      $("answerChoices").append(button);
    });

    speak(task.prompt);
  }

  if (task.type === "write") {
    $("exercisePrompt").textContent = "¿Qué es?";

    $("typingArea").classList.remove("hidden");

    $("answerInput").maxLength = task.word.length + 3;

    $("repeatWordButton").onclick = () => speak(task.word);

    $("spellWordButton").onclick = () =>
      speakSpelling(task.word);

    $("answerInput").focus();

    renderSpellingSlots("");

    speak(task.word);
  }

  if (task.type === "read") {
    $("exercisePrompt").textContent = task.text;

    $("readArea").classList.remove("hidden");

    $("listenButton").onclick = () => speak(task.text);

    speak(task.text);
  }

  updateStats();
}

function renderSpellingSlots(value) {
  const root = $("spellingSlots");
  const task = tasks[taskIndex];

  if (!task || task.type !== "write") return;

  root.innerHTML = "";

  const letters = [...value.toLocaleUpperCase("es")];
  const total = [...task.word].length;

  for (let i = 0; i < total; i++) {
    const slot = document.createElement("span");

    slot.className = "spelling-slot";
    slot.textContent = letters[i] || "_";

    root.append(slot);
  }
}

/* ==========================================
   COMPROBAR RESPUESTAS
========================================== */

function normalize(text) {
  return String(text)
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[.,!?¿¡]/g,"")
    .replace(/\s+/g," ");
}

function checkChoice(value) {
  const task = tasks[taskIndex];

  if (value === task.answer) {
    correctFeedback();
  } else {
    wrongFeedback();
  }
}

function checkTyped() {
  const task = tasks[taskIndex];

  if (!task || task.type !== "write") return;

  if (normalize($("answerInput").value) === normalize(task.word)) {
    correctFeedback();
  } else {
    wrongFeedback();
  }
}

function completeRead() {
  correctFeedback();
}

function correctFeedback() {
  if (!$("nextExercise").classList.contains("hidden")) return;

  const user = db.users[currentUser];

  user.score += 10;
  user.completed++;

  saveDB();

  successSound();

  $("mascotFace").textContent = "🦊✨";

  $("feedback").textContent = shuffle([
    "¡Excelente! ¡Eres genial! 🌟",
    "¡Lo lograste! Sigue brillando. ✨",
    "¡Muy bien! Cada día aprendes más. 🦋",
    "¡Fantástico, explorador! 🚀"
  ])[0];

  $("feedback").className = "feedback good";

  $("nextExercise").classList.remove("hidden");

  $("answerChoices").querySelectorAll("button").forEach(button => {
    button.disabled = true;
  });

  $("checkAnswer").disabled = true;

  updateStats();
}

function wrongFeedback() {
  errorSound();

  $("mascotFace").textContent = "🦊💧";

  $("feedback").textContent = shuffle([
    "¡Casi lo consigues! Inténtalo de nuevo. 💪",
    "¡No te rindas! Aprender es practicar. 🌈",
    "¡Tú puedes! Vuelve a intentarlo. 🐣",
    "Cada intento te ayuda a aprender. ⭐"
  ])[0];

  $("feedback").className = "feedback try";
}

/* ==========================================
   AVANZAR Y FINALIZAR
========================================== */

function advanceExercise() {
  if ($("nextExercise").classList.contains("hidden")) return;

  $("checkAnswer").disabled = false;

  taskIndex++;
  renderTask();
}

function finishGame(timeUp) {
  stopTimer();

  const user = db.users[currentUser];

  user.progress[difficulty] = Math.max(
    user.progress[difficulty] || 0,
    Math.floor(taskIndex / 4) + 1
  );

  user.best[difficulty] = Math.max(
    user.best[difficulty] || 0,
    taskIndex
  );

  saveDB();

  $("progressBar").style.width = "100%";

  $("finishTitle").textContent = timeUp
    ? "¡Se acabó el tiempo!"
    : "¡Excelente trabajo, " + user.name + "!";

  $("finishMessage").textContent = timeUp
    ? "¡Lo importante es que practicaste! Puedes intentarlo otra vez."
    : "Has completado " + tasks.length + " retos. ¡Felicidades!";

  $("finishPoints").textContent =
    user.score - scoreAtStart;

  showScreen("finishScreen");

  successSound();
}

function resetToDifficulty() {
  stopTimer();

  $("exerciseArea").classList.add("hidden");
  $("difficultyPicker").classList.remove("hidden");
  $("timerBox").classList.add("hidden");

  $("progressBar").style.width = "0%";
}

/* ==========================================
   TEMPORIZADOR
========================================== */

function startTimer() {
  stopTimer();

  secondsLeft = 600;
  updateTimer();

  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimer();

    if (secondsLeft <= 0) {
      finishGame(true);
    }
  },1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimer() {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  $("timerValue").textContent =
    String(minutes).padStart(2,"0") + ":" +
    String(seconds).padStart(2,"0");
}

/* ==========================================
   ESTADÍSTICAS Y AVANCE
========================================== */

function updateStats() {
  const user = db.users[currentUser];

  if (!user) return;

  $("scoreValue").textContent = user.score;

  $("levelValue").textContent =
    Math.floor(user.completed / 4) + 1;

  $("playerName").textContent = user.name;
}

function renderProgress() {
  const user = db.users[currentUser];

  if (!user) return;

  $("totalScore").textContent = user.score;
  $("totalDone").textContent = user.completed;

  $("unlockedLevels").textContent =
    Object.values(user.progress).reduce((a,b) => a + b,0) + 3;

  $("progressByDifficulty").innerHTML = "";

  const levels = [
    {id:"easy",name:"🐣 Fácil"},
    {id:"medium",name:"🦋 Medio"},
    {id:"hard",name:"🦁 Difícil"}
  ];

  levels.forEach(level => {
    const row = document.createElement("div");

    row.className = "progress-line";

    const name = document.createElement("span");
    name.textContent = level.name;

    const info = document.createElement("small");

    info.textContent =
      (user.progress[level.id] || 0) +
      " niveles registrados · mejor reto " +
      (user.best[level.id] || 0);

    row.append(name,info);

    $("progressByDifficulty").append(row);
  });
}

function resetCurrentProgress() {
  if (!confirm("¿Seguro que quieres reiniciar todos tus puntos y avances?")) {
    return;
  }

  const user = db.users[currentUser];

  if (!user) return;

  user.score = 0;
  user.completed = 0;

  user.progress = {
    easy:0,
    medium:0,
    hard:0
  };

  user.best = {
    easy:0,
    medium:0,
    hard:0
  };

  saveDB();

  renderProgress();
  updateStats();

  showToast("Tu avance se ha reiniciado.");
}

/* ==========================================
   ABECEDARIO INTERACTIVO
========================================== */

function renderAlphabet() {
  const grid = $("alphabetGrid");

  grid.innerHTML = "";

  alphabet.forEach((letter,index) => {
    const example = alphabetExamples[index];

    const button = document.createElement("button");

    button.className = "alphabet-card";

    const letterBox = document.createElement("span");
    letterBox.className = "alpha-letter";
    letterBox.textContent = letter;

    const lower = document.createElement("small");
    lower.textContent = letter.toLocaleLowerCase("es");
    letterBox.append(lower);

    const icon = document.createElement("span");
    icon.className = "alpha-icon";
    icon.textContent = example[1];

    const word = document.createElement("span");
    word.className = "alpha-word";
    word.textContent = example[0];

    button.append(letterBox,icon,word);

    button.onclick = () => {
      speak(letter + ". " + example[0]);
      playTone(550 + index * 10,.1);
    };

    grid.append(button);
  });
}

/* ==========================================
   SÍLABAS INTERACTIVAS
========================================== */

function renderSyllables() {
  const groups = [
    {
      name:"Sílabas simples",
      data:simpleSyllables,
      kind:"simple"
    },
    {
      name:"Sílabas trabadas",
      data:directSyllables,
      kind:"direct"
    },
    {
      name:"Sílabas inversas y otras",
      data:otherSyllables,
      kind:"special"
    }
  ];

  const query = normalize($("syllableSearch").value);
  const filter = $("syllableFilter").value;
  const root = $("syllableGroups");

  root.innerHTML = "";

  groups
    .filter(group => filter === "all" || filter === group.kind)
    .forEach(group => {
      const values = group.data.filter(syllable =>
        normalize(syllable).includes(query)
      );

      if (!values.length) return;

      const card = document.createElement("div");
      card.className = "syllable-group";

      const heading = document.createElement("h3");
      heading.textContent = group.name;

      const list = document.createElement("div");
      list.className = "syllable-list";

      values.forEach(syllable => {
        const button = document.createElement("button");

        button.className = "syllable-btn";
        button.textContent = syllable.toUpperCase();

        button.onclick = () => {
          speak(syllable);
          playTone(500,.08);
        };

        list.append(button);
      });

      card.append(heading,list);
      root.append(card);
    });

  if (!root.children.length) {
    root.textContent =
      "No encontramos esa sílaba. Prueba otra búsqueda.";
  }
}

/* ==========================================
   ESCRITURA LIBRE
========================================== */

function speakFreeText() {
  const text = $("freeTextArea").value.trim();

  if (!text) {
    showToast("Escribe algo en el bloc primero.");
    return;
  }

  speak(text);
}

/* ==========================================
   TEMA Y SONIDO
========================================== */

function toggleTheme() {
  document.body.classList.toggle("dark");

  const dark = document.body.classList.contains("dark");

  $("themeToggle").textContent = dark ? "☀️" : "🌙";

  localStorage.setItem(
    "palabritasTheme",
    dark ? "dark" : "light"
  );
}

function toggleSound() {
  soundOn = !soundOn;

  $("soundToggle").textContent =
    soundOn ? "🔊" : "🔇";

  showToast(
    soundOn ? "Sonido activado" : "Sonido silenciado"
  );

  if (soundOn) successSound();
}

/* ==========================================
   CONECTAR TODOS LOS BOTONES
========================================== */

$("createProfile").addEventListener("click",createProfile);

$("newName").addEventListener("keydown",event => {
  if (event.key === "Enter") createProfile();
});

$("profileSelect").addEventListener("change",event => {
  currentUser = event.target.value || null;
});

$("deleteProfile").addEventListener("click",deleteCurrentProfile);

$("startButton").addEventListener("click",startGame);

$("homeButton").addEventListener("click",() => {
  stopTimer();
  refreshProfiles();
  showScreen("welcomeScreen");
});

$("backLevels").addEventListener("click",resetToDifficulty);

document.querySelectorAll(".difficulty-card").forEach(button => {
  button.addEventListener("click",() => {
    startDifficulty(button.dataset.difficulty);
  });
});

document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click",() => {
    openPanel(button.dataset.panel);
  });
});

$("checkAnswer").addEventListener("click",checkTyped);

$("answerInput").addEventListener("input",event => {
  renderSpellingSlots(event.target.value);
});

$("answerInput").addEventListener("keydown",event => {
  if (event.key === "Enter") checkTyped();
});

$("readDone").addEventListener("click",completeRead);

$("nextExercise").addEventListener("click",advanceExercise);

$("playAgain").addEventListener("click",() => {
  showScreen("gameScreen");
  openPanel("playPanel");
  resetToDifficulty();
  updateStats();
});

$("switchUser").addEventListener("click",() => {
  stopTimer();
  refreshProfiles();
  showScreen("welcomeScreen");
});

$("resetProgress").addEventListener("click",resetCurrentProgress);

$("syllableSearch").addEventListener("input",renderSyllables);

$("syllableFilter").addEventListener("change",renderSyllables);

$("speakFreeTextBtn").addEventListener("click",speakFreeText);

$("themeToggle").addEventListener("click",toggleTheme);

$("soundToggle").addEventListener("click",toggleSound);

/* ==========================================
   INICIAR EL JUEGO
========================================== */

const savedTheme = localStorage.getItem("palabritasTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  $("themeToggle").textContent = "☀️";
}

refreshProfiles();
renderAlphabet();
renderSyllables();