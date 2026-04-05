/////////////////////////////////////////////////
// ELEMENTS
/////////////////////////////////////////////////

const popup = document.getElementById("popup");
const circleText = document.getElementById("circleText");
const popupImage = document.getElementById("popupImage");

/////////////////////////////////////////////////
// 🚀 ULTRA-FAST PRELOAD CACHE
/////////////////////////////////////////////////

const imageCache = {};
const soundCache = {};

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

letters.forEach(letter => {

  // preload image
  const img = new Image();
  img.src = `images/abcwithimages/${letter}.webp`;
  imageCache[letter] = img;

  // preload sound
  const audio = new Audio();
  audio.src = `sounds/${letter}.mp3`;
  soundCache[letter] = audio;

});

/////////////////////////////////////////////////
// SHOW LETTER POPUP
/////////////////////////////////////////////////

function showLetter(letter) {

  // reset popup animation
  popup.classList.add("hidden");
  popup.classList.remove("show");
  popup.offsetWidth; // force reflow

  // set letter
  circleText.textContent = letter;

  // instant image from cache
  popupImage.src = imageCache[letter].src;

  // show popup
  popup.classList.remove("hidden");
  popup.classList.add("show");

  // instant sound from cache
  const cachedSound = soundCache[letter];
  cachedSound.currentTime = 0;
  cachedSound.play();

  // 🎉 confetti burst
  launchConfetti();

  // auto close popup
  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 5000);
}

/////////////////////////////////////////////////
// CLOSE POPUP ON CLICK
/////////////////////////////////////////////////

popup.addEventListener("click", () => {
  popup.classList.remove("show");
  popup.classList.add("hidden");
});

/////////////////////////////////////////////////
// CONFETTI EFFECT
/////////////////////////////////////////////////

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 150,
      spread: 120,
      startVelocity: 30,
      gravity: 0.6,
      scalar: 1.2
    });
  }
}
