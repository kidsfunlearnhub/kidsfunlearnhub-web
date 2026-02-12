// Simple click sound effect (can be expanded later)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        console.log("Kids clicked a learning card!");
    });
});
// for bubbles with abc--Start
document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("bubble-container");

    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

    const alphaColors = [
        "#ffcc80", "#ffab91", "#e6ee9c", "#b2dfdb", "#c5cae9"
    ];

    const numberColors = [
        "#bbdefb", "#c8e6c9", "#ffcdd2", "#d1c4e9", "#ffe082"
    ];

    function createAlphaBubble() {
        const bubble = document.createElement("div");
        bubble.className = "bubble alpha";

        const letter = alphabets[Math.floor(Math.random() * alphabets.length)];
        bubble.innerText = letter;
        bubble.style.background =
            alphaColors[Math.floor(Math.random() * alphaColors.length)];

        bubble.style.left = Math.random() * 120 + "px";
        bubble.style.animationDuration = (14 + Math.random() * 6) + "s";

        bubble.onclick = () => popBubble(bubble, `sounds/${letter.toLowerCase()}.mp3`);
        container.appendChild(bubble);
        autoRemove(bubble);
    }

    function createNumberBubble() {
        const bubble = document.createElement("div");
        bubble.className = "bubble number";

        const num = numbers[Math.floor(Math.random() * numbers.length)];
        bubble.innerText = num;
        bubble.style.background =
            numberColors[Math.floor(Math.random() * numberColors.length)];

        bubble.style.right = Math.random() * 120 + "px";
        bubble.style.animationDuration = (14 + Math.random() * 6) + "s";

        bubble.onclick = () => popBubble(bubble, `sounds/${num}.mp3`);
        container.appendChild(bubble);
        autoRemove(bubble);
    }

    function popBubble(bubble, soundFile) {
        bubble.classList.add("burst");
        new Audio(soundFile).play().catch(() => {});
        setTimeout(() => bubble.remove(), 300);
    }

    function autoRemove(bubble) {
        setTimeout(() => {
            if (bubble.parentNode) bubble.remove();
        }, 18000);
    }

    // A–Z from left
    setInterval(createAlphaBubble, 1800);

    // 1–20 from right
    setInterval(createNumberBubble, 2200);
});
// for bubbles with abc--End

// Background Music- start
let bgMusicStarted = false;
const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.05; // VERY soft

document.addEventListener("click", () => {
    if (!bgMusicStarted) {
        bgMusic.play().catch(() => {});
        bgMusicStarted = true;
    }
});
//background music -End

//cursor option--start

document.addEventListener("DOMContentLoaded", () => {

  const select = document.getElementById("cursorSelect");

  const savedCursor = localStorage.getItem("kidsCursor");
  if (savedCursor) {
    document.documentElement.style.cursor = savedCursor;
    select.value = savedCursor.split("/").pop().replace('"', '');
  }

  select.addEventListener("change", () => {

    if (!select.value) {
      document.documentElement.style.cursor = "auto";
      localStorage.removeItem("kidsCursor");
      return;
    }

    const cursorValue =
      `url("images/cursors/${select.value}") 16 16, auto`;

    document.documentElement.style.cursor = cursorValue;
    localStorage.setItem("kidsCursor", cursorValue);
  });

});

//cursor option--end

// cursor option local storage start-- add this code on every .js file
document.addEventListener("DOMContentLoaded", () => {
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
    }
});
// cursor option local storage end-- 