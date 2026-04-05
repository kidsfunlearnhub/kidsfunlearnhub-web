const board = document.getElementById("board");
const title = document.getElementById("title");
const popup = document.getElementById("popup");
const starsDiv = document.getElementById("stars");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let level = 0;
let target;
let remaining = 0;

const wrongSound = new Audio("sounds/ohoh.mp3");
const correctSound = new Audio("sounds/hey.mp3");


// ============================
// GLOBAL CONFETTI CONTROL
// ============================

let confettiRunning = false;
let confettiTimeout;


// ============================
// START LEVEL
// ============================

function startLevel() {

  // hard reset everything
  stopConfetti();

  board.innerHTML = "";
  starsDiv.innerHTML = "";
  popup.classList.add("hidden");

  target = letters[level];
  title.textContent = `Tap all "${target}"`;

  remaining = 0;

  const total = 36;

  for (let i = 0; i < total; i++) {

    const circle = document.createElement("div");
    circle.className = "circle";

    let letter;

    if (Math.random() < 0.25) {
      letter = target;
      remaining++;
    } else {
      letter = letters[Math.floor(Math.random() * 26)];
    }

    circle.textContent = letter;
    circle.onclick = () => tap(circle, letter);

    board.appendChild(circle);
  }

  // safety fallback
  if (remaining === 0) {
    const c = board.firstChild;
    c.textContent = target;
    c.onclick = () => tap(c, target);
    remaining = 1;
  }
}


// ============================
// TAP HANDLER
// ============================

function tap(circle, letter) {

  if (circle.classList.contains("correct")) return;

  if (letter === target) {

    correctSound.currentTime = 0;
    correctSound.play();

    circle.classList.add("correct");

    remaining--;

    if (remaining === 0) win();

  } else {

    wrongSound.currentTime = 0;
    wrongSound.play();

    circle.classList.add("wrong");
    circle.textContent = "✖";

    setTimeout(() => {
      circle.classList.remove("wrong");
      circle.textContent = letter;
    }, 1000);
  }
}


// ============================
// WIN
// ============================

function win() {

  if (confettiRunning) return;

  popup.classList.remove("hidden");

  confetti();

  // stars animation
  let i = 0;
  const starTimer = setInterval(() => {

    const star = document.createElement("span");
    star.className = "star";
    star.textContent = "★";
    starsDiv.appendChild(star);

    i++;
    if (i === 5) clearInterval(starTimer);

  }, 300);

  popup.onclick = () => {

    popup.onclick = null; // prevent double click bug

    stopConfetti();

    level++;
    if (level >= letters.length) level = 0;

    startLevel();
  };
}


// ============================
// CONFETTI
// ============================

function confetti() {

  confettiRunning = true;

  for (let i = 0; i < 80; i++) {

    const c = document.createElement("div");

    c.style.position = "fixed";
    c.style.width = "8px";
    c.style.height = "8px";
    c.style.background = `hsl(${Math.random()*360},100%,50%)`;
    c.style.left = Math.random()*100 + "vw";
    c.style.top = "-10px";
    c.style.pointerEvents = "none";

    document.body.appendChild(c);

    const anim = c.animate([
      { transform: "translateY(0)" },
      { transform: "translateY(100vh)" }
    ], {
      duration: 1500 + Math.random()*1000,
      easing: "linear"
    });

    anim.onfinish = () => c.remove();
  }

  // auto stop safety
  confettiTimeout = setTimeout(stopConfetti, 2500);
}


// ============================
// STOP CONFETTI (HARD RESET)
// ============================

function stopConfetti() {

  confettiRunning = false;

  clearTimeout(confettiTimeout);

  document.querySelectorAll("body > div").forEach(el => {
    if (el.style?.position === "fixed") {
      el.remove();
    }
  });
}


// ============================
// INIT
// ============================

startLevel();
