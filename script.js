// Elements
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");

const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

// Steps
const dateStep = document.getElementById("date-step");
const dateInput = document.getElementById("date-input");
const dateSubmit = document.getElementById("date-submit");
const dateResult = document.getElementById("date-result");

const quizStep = document.getElementById("quiz-step");
const quizQuestion = document.getElementById("quiz-question");
const quizChoices = document.getElementById("quiz-choices");
const quizResult = document.getElementById("quiz-result");
const nextQuestionBtn = document.getElementById("next-question");

const letterWindow = document.querySelector(".letter-window");

// ===== MUSIC (MP3) =====
const musicBtn = document.getElementById("music-btn");
const bgMusic = document.getElementById("bg-music");

let isPlaying = false;

bgMusic.addEventListener("play", () => {
  isPlaying = true;
  updateMusicIcon();
});

bgMusic.addEventListener("pause", () => {
  isPlaying = false;
  updateMusicIcon();
});

function updateMusicIcon(){
  musicBtn.textContent = isPlaying ? "🔊" : "🔇";
}

if (musicBtn && bgMusic) {
  updateMusicIcon();

  musicBtn.addEventListener("click", () => {
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        updateMusicIcon();
      }).catch(() => {
        // iOS บางทีจะบล็อคถ้าไม่ได้กดจริงๆ
        isPlaying = false;
        updateMusicIcon();
      });
    } else {
      bgMusic.pause();
      isPlaying = false;
      updateMusicIcon();
    }
  });
}



// ======= QUIZ DATA (Q1-Q3) =======
const quiz = [
  {
    q: "Q1: “What do you think I love the most about you?”",
    choices: ["Your smile 😊", "Your voice 🎧", "The way you care 💗", "Everything 😳"],
  },
  {
    q: "Q2: “If we could go on a date right now, where would you choose?”",
    choices: ["Café ☕", "Movie 🎬", "Beach 🌊", "Anywhere with you 🫶"],
  },
  {
    q: "Q3: “Do you know what I want to ask you today?”",
    choices: ["No 😅", "Maybe… 👀", "Yes 💘"],
  },
];

let quizIndex = 0;
let selectedChoice = null;

// Click Envelope
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    document.querySelector(".letter-window").classList.add("open");
  }, 50);

  // Start with DATE step
  setTimeout(() => {
    dateStep.style.display = "flex";
    dateInput.focus();
  }, 700);

});

// ======= DATE CHECK =======
function normalizeDate(str) {
  return str
    .trim()
    .toLowerCase()
    .replaceAll(" ", "")
    .replaceAll("-", "/");
}

dateSubmit.addEventListener("click", () => {
  const ans = normalizeDate(dateInput.value);

  // 🔥 เปลี่ยน "วันที่คบกัน" ตรงนี้ได้เลย
  const correctAnswers = [
    "softspot",
    "soft spot",
    "Soft spot",
    "Soft Spot",
    "Say",
    "Perfect",
    "Nothing",
    "จีบ",
    "DNA",
    "dna",
    "All about you",


  ].map(normalizeDate);

  if (correctAnswers.includes(ans)) {
    dateResult.textContent = "ถูกต้องงง 🥺💖";
    dateResult.style.color = "green";

    setTimeout(() => {
      dateStep.style.display = "none";
      startQuiz();
    }, 600);
  } else {
    dateResult.textContent = "ยังไม่ถูกน้าา ลองใหม่ 😼";
    dateResult.style.color = "red";
  }
});

dateInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") dateSubmit.click();
});

// ======= QUIZ LOGIC =======
function startQuiz() {
  quizStep.style.display = "flex";
  quizIndex = 0;

  letterWindow.classList.add("quiz-mode");

  renderQuestion();

}

function renderQuestion() {
title.textContent = `Question ${quizIndex + 1}/${quiz.length} 💗`;

  selectedChoice = null;
  quizResult.textContent = "";
  nextQuestionBtn.style.display = "none";

  const current = quiz[quizIndex];
  quizQuestion.textContent = current.q;

  quizChoices.innerHTML = "";

  current.choices.forEach((text) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = text;

    btn.addEventListener("click", () => {
      selectedChoice = text;

      // clear selection
      document.querySelectorAll(".choice-btn").forEach((b) => {
        b.classList.remove("selected");
      });

      btn.classList.add("selected");
        const lastChoice = quiz[quizIndex].choices[quiz[quizIndex].choices.length - 1];

        // Q1 + Q2
        if (quizIndex === 0 || quizIndex === 1) {
        if (text !== lastChoice) {
            quizResult.textContent = "Only this? 😳";
        } else {
            quizResult.textContent = "Aww That's cute 💗";
        }
        }

        // Q3
        if (quizIndex === 2) {
        quizResult.textContent = "Okayy 💗 So I'll tell you now 😳";
        }

        quizResult.style.color = "#c94b4b";
        nextQuestionBtn.style.display = "inline-block";
            });

    quizChoices.appendChild(btn);
  });
}

nextQuestionBtn.addEventListener("click", () => {
  if (!selectedChoice) return;

  quizIndex++;

  if (quizIndex >= quiz.length) {
    // finish quiz
    quizStep.style.display = "none";
    buttons.style.display = "flex";
    
  // กลับไปหัวข้อเดิม
  title.textContent = "Will you be my Valentine?";

  // ออกจากโหมด quiz (เพื่อให้แมวกลับตำแหน่งเดิมด้วย)
  letterWindow.classList.remove("quiz-mode");

    return;
  }

  renderQuestion();
});

// ======= NO Button (works on iOS + desktop) =======
function moveNoButton() {
  const distance = 220;
  const angle = Math.random() * Math.PI * 2;

  const moveX = Math.cos(angle) * distance;
  const moveY = Math.sin(angle) * distance;

  noBtn.style.transition = "transform 0.25s ease";
  noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
}

// Desktop hover
noBtn.addEventListener("mouseover", moveNoButton);

// Mobile tap (iOS)
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
});

// ======= YES is clicked =======
yesBtn.addEventListener("click", () => {
letterWindow.classList.remove("quiz-mode");
  title.textContent = "Yippeeee!";

  catImg.src = "cat_dance.gif";

  document.querySelector(".letter-window").classList.add("final");

  buttons.style.display = "none";

  finalText.style.display = "block";
});

