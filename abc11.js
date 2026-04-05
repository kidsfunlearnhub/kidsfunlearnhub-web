
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const words = {
  A: { en: "Apple", hi: "सेब", mr: "सफरचंद", img: "images/apple.png", sound: "sounds/a.mp3" },
  B: { en: "Ball", hi: "गेंद", mr: "चेंडू", img: "images/ball.png", sound: "sounds/b.mp3" }
};

const container = document.getElementById("letters");

letters.forEach(l => {
  const div = document.createElement("div");
  div.className = "letter";
  div.innerText = l;
  div.onclick = () => show(l);
  container.appendChild(div);
});

function show(letter) {
  const lang = document.getElementById("lang").value;
  const data = words[letter];
  if (!data) return;

  document.getElementById("popupImg").src = data.img;
  document.getElementById("popupText").innerText = `${letter} for ${data[lang]}`;
  document.getElementById("popup").style.display = "block";

  new Audio(data.sound).play();
}

// random Color--Start
document.addEventListener("DOMContentLoaded", () => {
    const letters = document.querySelectorAll(".letter");

    letters.forEach(letter => {
        applyRandomGradient(letter);

        letter.addEventListener("click", () => {
            applyFixedColor(letter);
        });
    });
});

/* RANDOM GRADIENT */
function applyRandomGradient(el) {
    const color1 = randomBrightColor();
    const color2 = randomBrightColor();
    el.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
    el.style.color = "#fff";
}


/* ONE SPECIFIC COLOR ON CLICK */

function applyFixedColor(el) {
    el.style.background = "#2e2a2a";   // fixed color
    el.style.color = "#fff";

    // glow pulse
    el.style.boxShadow = "0 0 25px rgba(233, 33, 169, 0.85)";
    setTimeout(() => {
        el.style.boxShadow = "";
    }, 400);
}
/* BRIGHT BUT NICE COLORS */

function randomBrightColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 85;   // strong color
    const lightness = 40;    // lower = darker
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// random color-END

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


// cursor option start-- add this code on every .js file
document.addEventListener("DOMContentLoaded", () => {
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
    }
});
// cursor option end-- 



// // ===== DATA =====
// const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// const words = {
//   A: { en: "Apple", hi: "सेब", mr: "सफरचंद", img: "images/apple.png", sound: "sounds/a.mp3" },
//   B: { en: "Ball",  hi: "गेंद", mr: "चेंडू",  img: "images/ball.png",  sound: "sounds/b.mp3" }
// };

// // ===== INIT =====
// document.addEventListener("DOMContentLoaded", () => {

//   const container = document.getElementById("letters");

//   letters.forEach(l => {
//     const div = document.createElement("div");
//     div.textContent = l;

//     // ⭐ IMPORTANT for cursor + styles
//     div.classList.add("letter", "clickable");

//     // apply random gradient initially
//     applyRandomGradient(div);

//     // click behaviour
//     div.addEventListener("click", () => {
//       show(l);
//       applyFixedColor(div);
//     });

//     container.appendChild(div);
//   });

//   // restore cursor choice
//   const savedCursor = localStorage.getItem("kidsCursor");
//   if (savedCursor) {
//     document.documentElement.style.cursor = savedCursor;
//   }
// });

// // ===== SHOW POPUP =====
// function show(letter) {
//   const lang = document.getElementById("lang").value;
//   const data = words[letter];
//   if (!data) return;

//   document.getElementById("popupImg").src = data.img;
//   document.getElementById("popupText").innerText =
//     `${letter} for ${data[lang]}`;

//   document.getElementById("popup").style.display = "block";
//   new Audio(data.sound).play();
// }

// // ===== COLORS =====
// function applyRandomGradient(el) {
//   const color1 = randomBrightColor();
//   const color2 = randomBrightColor();
//   el.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
//   el.style.color = "#fff";
// }

// function applyFixedColor(el) {
//   el.style.background = "#2e2a2a";
//   el.style.color = "#fff";

//   // glow pulse
//   el.style.boxShadow = "0 0 25px rgba(233, 33, 169, 0.85)";
//   setTimeout(() => el.style.boxShadow = "", 400);
// }

// function randomBrightColor() {
//   const hue = Math.floor(Math.random() * 360);
//   return `hsl(${hue}, 85%, 40%)`;
// }
