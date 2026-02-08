/////////////////////////////////////////////////
// VEGETABLE DATA (30 vegetables → 2 pages)
/////////////////////////////////////////////////

const vegetables = [
  "potato","tomato","onion","carrot","brinjal",
"cabbage","cauliflower","peas","spinach","okra",
"bottle gourd","ridge gourd","bitter gourd","pumpkin","radish",

"beetroot","capsicum","cucumber","beans","turnip",
"drumstick","ivy gourd","cluster beans","fenugreek","mustard greens",
"colocasia","ash gourd","snake gourd","raw banana","sweet potato"

];

const PAGE_SIZE = 15;
let currentPage = 0;

/////////////////////////////////////////////////
// ELEMENTS
/////////////////////////////////////////////////

const grid = document.getElementById("vegetableGrid");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupName = document.getElementById("popupName");
const nextBtn = document.getElementById("nextBtn");

/////////////////////////////////////////////////
// 🚀 ULTRA-FAST PRELOAD CACHE
/////////////////////////////////////////////////

const imageCache = {};
const soundCache = {};

vegetables.forEach(name => {

  // preload image
  const img = new Image();
  img.src = `images/vegetables/${name}.png`;
  imageCache[name] = img;

  // preload sound
  const audio = new Audio();
  audio.src = `sounds/vegetables/${name}.mp3`;
  audio.preload = "auto";
  soundCache[name] = audio;

});

/////////////////////////////////////////////////
// BUILD PAGE GRID
/////////////////////////////////////////////////

function loadPage() {

  grid.innerHTML = "";

  const start = currentPage * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  vegetables.slice(start, end).forEach(name => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${imageCache[name].src}">
      <p>${capitalize(name)}</p>
    `;

    card.onclick = () => showVegetable(name);

    grid.appendChild(card);
  });
}

/////////////////////////////////////////////////
// NEXT BUTTON
/////////////////////////////////////////////////

nextBtn.onclick = () => {

  currentPage++;

  if (currentPage * PAGE_SIZE >= vegetables.length)
    currentPage = 0;

  loadPage();
};

/////////////////////////////////////////////////
// POPUP DISPLAY
/////////////////////////////////////////////////

function showVegetable(name) {

  popupImg.src = imageCache[name].src;
  popupName.textContent = capitalize(name);

  popup.classList.remove("hidden");

  const sound = soundCache[name];
  sound.currentTime = 0;
  sound.play();

  launchConfetti();
}

popup.onclick = () => popup.classList.add("hidden");

/////////////////////////////////////////////////
// CONFETTI
/////////////////////////////////////////////////

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 }
    });
  }
}

/////////////////////////////////////////////////
// HELPER
/////////////////////////////////////////////////

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/////////////////////////////////////////////////
// INIT
/////////////////////////////////////////////////

loadPage();
