/////////////////////////////////////////////////
// 1. LANGUAGE DICTIONARY & SETUP
/////////////////////////////////////////////////

// Read the language clicked on the home page (default to English if empty)
let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

// Dictionary for the Page Title and Next Button
const uiDictionary = {
    "page-title": { en: "🍓 Learn Fruits", hi: "🍓 फल सीखें", mr: "🍓 फळे शिका" },
    "nextBtn": { en: "➡ Next Fruits", hi: "➡ अगले फल", mr: "➡ पुढील फळे" }
};

// Dictionary for all 30 fruits
const fruitDict = {
    "mango": { en: "Mango", hi: "आम", mr: "आंबा" },
    "banana": { en: "Banana", hi: "केला", mr: "केळे" },
    "apple": { en: "Apple", hi: "सेब", mr: "सफरचंद" },
    "orange": { en: "Orange", hi: "संतरा", mr: "संत्री" },
    "grapes": { en: "Grapes", hi: "अंगूर", mr: "द्राक्षे" },
    "papaya": { en: "Papaya", hi: "पपीता", mr: "पपई" },
    "guava": { en: "Guava", hi: "अमरूद", mr: "पेरू" },
    "pineapple": { en: "Pineapple", hi: "अनानास", mr: "अननस" },
    "pomegranate": { en: "Pomegranate", hi: "अनार", mr: "डाळिंब" },
    "watermelon": { en: "Watermelon", hi: "तरबूज", mr: "कलिंगड" },
    "muskmelon": { en: "Muskmelon", hi: "खरबूजा", mr: "खरबूज" },
    "chikoo": { en: "Chikoo", hi: "चीकू", mr: "चिकू" },
    "custard apple": { en: "Custard Apple", hi: "सीताफल", mr: "सीताफळ" },
    "litchi": { en: "Litchi", hi: "लीची", mr: "लीची" },
    "jackfruit": { en: "Jackfruit", hi: "कटहल", mr: "फणस" },
    "pear": { en: "Pear", hi: "नाशपाती", mr: "पेअर" },
    "plum": { en: "Plum", hi: "आलूबुखारा", mr: "प्लम" },
    "peach": { en: "Peach", hi: "आड़ू", mr: "पीच" },
    "apricot": { en: "Apricot", hi: "खुबानी", mr: "जर्दाळू" },
    "kiwi": { en: "Kiwi", hi: "कीवी", mr: "कीवी" },
    "fig": { en: "Fig", hi: "अंजीर", mr: "अंजीर" },
    "dates": { en: "Dates", hi: "खजूर", mr: "खजूर" },
    "coconut": { en: "Coconut", hi: "नारियल", mr: "नारळ" },
    "jamun": { en: "Jamun", hi: "जामुन", mr: "जांभूळ" },
    "amla": { en: "Amla", hi: "आंवला", mr: "आवळा" },
    "star fruit": { en: "Star Fruit", hi: "कमरख", mr: "स्टार फ्रूट" },
    "dragon fruit": { en: "Dragon Fruit", hi: "ड्रैगन फ्रूट", mr: "ड्रॅगन फ्रूट" },
    "mulberry": { en: "Mulberry", hi: "शहतूत", mr: "तुती" },
    "wood apple": { en: "Wood Apple", hi: "बेल", mr: "कवठ" },
    "tamarind": { en: "Tamarind", hi: "इमली", mr: "चिंच" }
};

const fruits = [
  "mango","banana","apple","orange","grapes",
  "papaya","guava","pineapple","pomegranate","watermelon",
  "muskmelon","chikoo","custard apple","litchi","jackfruit",
  "pear","plum","peach","apricot","kiwi",
  "fig","dates","coconut","jamun","amla",
  "star fruit","dragon fruit","mulberry","wood apple","tamarind"
];

const PAGE_SIZE = 15;
let currentPage = 0;

/////////////////////////////////////////////////
// ELEMENTS & TRANSLATING UI
/////////////////////////////////////////////////

const grid = document.getElementById("fruitGrid");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupName = document.getElementById("popupName");
const nextBtn = document.getElementById("nextBtn");

// Translate the main title and next button immediately
document.getElementById("page-title").innerText = uiDictionary["page-title"][currentLang];
nextBtn.innerText = uiDictionary["nextBtn"][currentLang];

/////////////////////////////////////////////////
// 🚀 ULTRA-FAST PRELOAD CACHE (UPDATED FOR LANGUAGES)
/////////////////////////////////////////////////

const imageCache = {};
const soundCache = {};

fruits.forEach(name => {
  // preload image (same for all languages)
  const img = new Image();
  img.src = `images/fruits/${name}.webp`;
  imageCache[name] = img;

  // preload sound (loads en, hi, or mr folder based on choice!)
  const audio = new Audio();
  audio.src = `sounds/${currentLang}/fruits/${name}.mp3`;
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

  fruits.slice(start, end).forEach(name => {
    const card = document.createElement("div");
    card.className = "card";

    // Grab the translated name from the dictionary
    const translatedName = fruitDict[name][currentLang];

    card.innerHTML = `
      <img src="${imageCache[name].src}">
      <p>${translatedName}</p>
    `;

    card.onclick = () => showFruit(name);

    grid.appendChild(card);
  });
}

/////////////////////////////////////////////////
// NEXT BUTTON
/////////////////////////////////////////////////

nextBtn.onclick = () => {
  currentPage++;

  if (currentPage * PAGE_SIZE >= fruits.length)
    currentPage = 0;

  loadPage();
};

/////////////////////////////////////////////////
// POPUP DISPLAY
/////////////////////////////////////////////////

function showFruit(name) {
  popupImg.src = imageCache[name].src;
  
  // Show the translated name in the popup
  popupName.textContent = fruitDict[name][currentLang];

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
// INIT
/////////////////////////////////////////////////

loadPage();