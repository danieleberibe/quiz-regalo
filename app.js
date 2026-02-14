// 1) METTI QUI LE TUE DOMANDE
// correctIndex = indice (0..n-1) della risposta corretta
// Incolla questo in app.js (sostituisci il tuo array QUESTIONS)
// Cambia correctIndex e i testi come vuoi.

const QUESTIONS = [
  {
    img: "img/WhatsApp Image 2026-02-14 at 19.26.17.jpeg",
    q: "Chi ha sempre ragione?",
    options: [
      "Il gatto nero (quello grande)",
      "C'è da chiederlo? Federica.",
      "Il gatto bianco e rosso",
      "Tutti i gatti in foto"
    ],
    correctIndex: 1,
    note: "Ovviamente hai ragione..."
  },
  {
    img: "img/WhatsApp Image 2026-02-14 at 19.26.18.jpeg",
    q: "È vero che sei spesso in ritardo… tranne quando?",
    options: [
      "Quando gioca la Juve",
      "Quando c'è da mangiare",
      "Quando c'è Glutei e Addome",
      "Mai, sono sono sempre in ritardo"
    ],
    correctIndex: 3,
    note: "Ma non ti lasceremmo mai a piedi, comunque..."
  },
  {
    img: "img/WhatsApp Image 2026-02-14 at 19.40.33.jpeg",
    q: "Se potessi viaggiare ovunque, dove andresti?",
    options: [
      "A fan***o",
      "A Lourdes (la speranza è l'ultima a morire)",
      "Al museo dei capelli in Turchia, ad Avanos",
      "Nel deserto in Giordania"
    ],
    correctIndex: 1,
    note: "Ci stiamo informando per lo sconto di gruppo 😉"
  },
{
    img: "img/WhatsApp Image 2026-02-14 at 19.26.19.jpeg",
    q: "Il motivo più probabile per cui potrebbero arrestarti?",
    options: [
      "Per aver esagerato con la 'nduja",
      "Per aver scattato troppe foto al mare",
      "Per aver fatto una maxi truffa su Vinted",
      "Tutte le precedenti, dipende da quanto è severa la polizia"
    ],
    correctIndex: 3,
    note: "ni no ni no ni no... 👮"
  },
  {
    img: "img/WhatsApp Image 2026-02-14 at 20.01.08.jpeg",
    q: "Per i tuoi 30 anni, ti auguriamo...",
    options: [
      "Di diventare ricca",
      "Di trovare l'amore",
      "Di essere sempre felice",
      "Tutte le precedenti, e anche di più"
    ],
    correctIndex: 3,
    note: "E noi ci saremo per festeggiare ogni tuo successo! 🎉"
  }
];

const els = {
  progressText: document.getElementById("progressText"),
  barFill: document.getElementById("barFill"),
  photoImg: document.getElementById("photoImg"),
  question: document.getElementById("question"),
  answers: document.getElementById("answers"),
  feedback: document.getElementById("feedback"),
  score: document.getElementById("score"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  continueBtn: document.getElementById("continueBtn"),

  // popup
  loveOverlay: document.getElementById("loveOverlay"),
  loveYes: document.getElementById("loveYes"),
  loveNo: document.getElementById("loveNo"),
  loveMsg: document.getElementById("loveMsg"),

  // schermata finale (la lasciamo, ma non la usiamo più)
  end: document.getElementById("end"),
  endText: document.getElementById("endText"),
  restartBtn: document.getElementById("restartBtn"),
};

let idx = 0;
let score = 0;
let answered = Array(QUESTIONS.length).fill(null);

// -----------------------
// POPUP
// -----------------------
function showLovePopup() {
  els.loveMsg.textContent = "";
  els.loveOverlay.classList.remove("hidden");
  els.loveNo.style.transform = "translate(0px, 0px)";
}

function hideLovePopup() {
  els.loveOverlay.classList.add("hidden");
}

function showFinalScreen() {
  const quizCard = document.querySelector(".card"); // la card del quiz (è la prima)
  quizCard.classList.add("hidden");

  const total = QUESTIONS.length;

    const msg = "SORPRESA!!!! Hai vinto un buono regalo della Rinascente!🎁 Tanti auguri da Valeria, Simone, Michelle, Daniele, Giovanni 🎂";

  els.endText.textContent = `${msg}\n\nPunteggio: ${score}/${total} `;
  els.end.classList.remove("hidden");

}

function moveRunawayButton() {
  const btn = els.loveNo;
  const modal = btn.closest(".modal");
  if (!modal) return;

  const modalRect = modal.getBoundingClientRect();
  const btnRect = btn.getBoundingClientRect();

  const padding = 12;
  const maxX = modalRect.width - btnRect.width - padding * 2;
  const maxY = modalRect.height - btnRect.height - padding * 2;

  // sicurezza (se area troppo piccola)
  if (maxX <= 0 || maxY <= 0) return;

  // posizione random entro la modal
  const xTarget = Math.floor(Math.random() * maxX) + padding;
  const yTarget = Math.floor(Math.random() * maxY) + padding;

  // converti in translate relativo alla posizione attuale del bottone
  const currentX = btnRect.left - modalRect.left;
  const currentY = btnRect.top - modalRect.top;

  const dx = xTarget - currentX;
  const dy = yTarget - currentY;

  btn.style.transform = `translate(${dx}px, ${dy}px)`;
}

// -----------------------
// RENDER
// -----------------------
function render() {
  const item = QUESTIONS[idx];

  els.photoImg.src = item.img;
  els.question.textContent = item.q;

  const total = QUESTIONS.length;
  els.progressText.textContent = `${idx + 1} / ${total}`;
  els.barFill.style.width = `${Math.round(((idx + 1) / total) * 100)}%`;

  els.score.textContent = score;

  const isLast = idx === QUESTIONS.length - 1;

  els.prevBtn.disabled = idx === 0;
  els.nextBtn.disabled = answered[idx] === null;

  // ultima domanda: nascondi "Avanti", mostra "Continua" solo dopo risposta
  els.nextBtn.classList.toggle("hidden", isLast);
  els.continueBtn.classList.toggle("hidden", !(isLast && answered[idx] !== null));

  // feedback reset
  els.feedback.className = "feedback";
  els.feedback.textContent = "";

  // risposte
  els.answers.innerHTML = "";
  item.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "answer";
    btn.textContent = opt;

    const already = answered[idx] !== null;
    btn.disabled = already;

    btn.addEventListener("click", () => onAnswer(i));
    els.answers.appendChild(btn);
  });

  if (answered[idx] !== null) {
    paintAnswered();
  }
}

// -----------------------
// QUIZ LOGIC
// -----------------------
function onAnswer(choiceIndex) {
  const item = QUESTIONS[idx];
  const isCorrect = choiceIndex === item.correctIndex;

  answered[idx] = isCorrect;
  if (isCorrect) score += 1;

  paintAnswered(choiceIndex);
  els.score.textContent = score;

  // abilita avanti (se non ultima) oppure mostra continua (se ultima)
  const isLast = idx === QUESTIONS.length - 1;
  if (!isLast) {
    els.nextBtn.disabled = false;
  } else {
    els.continueBtn.classList.remove("hidden");
  }
}

function paintAnswered(clickedIndex = null) {
  const item = QUESTIONS[idx];
  const buttons = Array.from(document.querySelectorAll(".answer"));

  buttons.forEach((b, i) => {
    if (i === item.correctIndex) b.classList.add("correct");
    if (clickedIndex !== null && i === clickedIndex && i !== item.correctIndex) b.classList.add("wrong");
    b.disabled = true;
  });

  const isCorrect = answered[idx] === true;
  els.feedback.classList.add(isCorrect ? "good" : "bad");
  els.feedback.textContent = isCorrect
    ? `Giusto! ${item.note ?? ""}`.trim()
    : `Sbagliato 😄 Risposta giusta: "${item.options[item.correctIndex]}".`;
}

// -----------------------
// EVENTS
// -----------------------
els.prevBtn.addEventListener("click", () => {
  if (idx > 0) idx -= 1;
  render();
});

els.nextBtn.addEventListener("click", () => {
  if (idx < QUESTIONS.length - 1) {
    idx += 1;
    render();
  }
});

els.continueBtn.addEventListener("click", () => {
  showLovePopup();
});

els.restartBtn?.addEventListener("click", () => {
  idx = 0;
  score = 0;
  answered = Array(QUESTIONS.length).fill(null);
  els.end?.classList.add("hidden");
  document.querySelector(".card")?.classList.remove("hidden");
  render();
});

// popup events
els.loveNo.addEventListener("mouseenter", moveRunawayButton);
els.loveNo.addEventListener("mousemove", moveRunawayButton);

els.loveYes.addEventListener("click", () => {
  els.loveMsg.textContent = "Indovina!!!!";
  setTimeout(() => {
    hideLovePopup();
    showFinalScreen();
  }, 1300);
});

render();