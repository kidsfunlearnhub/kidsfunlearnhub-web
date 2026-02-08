/////////////////////////////////////////////////
// VEHICLE DATA (30 vehicles → 2 pages)
/////////////////////////////////////////////////

const vehicles = [
  "car","bus","auto rickshaw","motorcycle","bicycle",
"scooter","truck","tractor","train","metro",
"ambulance","fire engine","police jeep","school bus","van",

"tempo","delivery truck","taxi","rickshaw","bulldozer",
"crane","excavator","boat","ferry","ship",
"helicopter","airplane","garbage truck","cement mixer","tow truck"
];

const PAGE_SIZE = 15;
let currentPage = 0;

/////////////////////////////////////////////////
// ELEMENTS
/////////////////////////////////////////////////

const grid = document.getElementById("vehicleGrid");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupName = document.getElementById("popupName");
const nextBtn = document.getElementById("nextBtn");

/////////////////////////////////////////////////
// 🚀 ULTRA-FAST PRELOAD CACHE
/////////////////////////////////////////////////

const imageCache = {};
const soundCache = {};

vehicles.forEach(name => {

  // preload image
  const img = new Image();
  img.src = `images/vehicles/${name}.png`;
  imageCache[name] = img;

  // preload sound
  const audio = new Audio();
  audio.src = `sounds/vehicles/${name}.mp3`;
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

  vehicles.slice(start, end).forEach(name => {

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${imageCache[name].src}">
      <p>${capitalize(name)}</p>
    `;

    card.onclick = () => showVehicle(name);

    grid.appendChild(card);
  });
}

/////////////////////////////////////////////////
// NEXT BUTTON
/////////////////////////////////////////////////

nextBtn.onclick = () => {

  currentPage++;

  if (currentPage * PAGE_SIZE >= vehicles.length)
    currentPage = 0;

  loadPage();
};

/////////////////////////////////////////////////
// POPUP DISPLAY
/////////////////////////////////////////////////

function showVehicle(name) {

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
