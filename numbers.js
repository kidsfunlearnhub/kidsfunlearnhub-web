////////////////////////////////////////////////////////
// 1. LANGUAGE SETUP & DICTIONARIES
////////////////////////////////////////////////////////

let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

const uiDictionary = {
    "page-title": { en: "🔢 Learn Numbers", hi: "🔢 नंबर सीखें", mr: "🔢 क्रमांक शिका" },
    "btnNext": { en: "21 to 40 ➡️", hi: "२१ से ४० ➡️", mr: "२१ ते ४० ➡️" },
    "btnPrev": { en: "⬅️ 1 to 20", hi: "⬅️ १ से २०", mr: "⬅️ १ ते २०" },
    "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" }
};

const numbersDict = {
    1: { en: "One", hi: "एक", mr: "एक" },
    2: { en: "Two", hi: "दो", mr: "दोन" },
    3: { en: "Three", hi: "तीन", mr: "तीन" },
    4: { en: "Four", hi: "चार", mr: "चार" },
    5: { en: "Five", hi: "पांच", mr: "पाच" },
    6: { en: "Six", hi: "छह", mr: "सहा" },
    7: { en: "Seven", hi: "सात", mr: "सात" },
    8: { en: "Eight", hi: "आठ", mr: "आठ" },
    9: { en: "Nine", hi: "नौ", mr: "नऊ" },
    10: { en: "Ten", hi: "दस", mr: "दहा" },
    11: { en: "Eleven", hi: "ग्यारह", mr: "अकरा" },
    12: { en: "Twelve", hi: "बारह", mr: "बारा" },
    13: { en: "Thirteen", hi: "तेरह", mr: "तेरा" },
    14: { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
    15: { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" },
    16: { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
    17: { en: "Seventeen", hi: "सत्रह", mr: "सतरा" },
    18: { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
    19: { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" },
    20: { en: "Twenty", hi: "बीस", mr: "वीस" },
    21: { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" },
    22: { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
    23: { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" },
    24: { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
    25: { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" },
    26: { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
    27: { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" },
    28: { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
    29: { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" },
    30: { en: "Thirty", hi: "तीस", mr: "तीस" },
    31: { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" },
    32: { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
    33: { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" },
    34: { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
    35: { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" },
    36: { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
    37: { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" },
    38: { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
    39: { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" },
    40: { en: "Forty", hi: "चालीस", mr: "चाळीस" }
};

// Translate UI elements on load
document.getElementById("page-title").innerText = uiDictionary["page-title"][currentLang];
document.getElementById("btnNext").innerText = uiDictionary["btnNext"][currentLang];
document.getElementById("btnPrev").innerText = uiDictionary["btnPrev"][currentLang];
document.getElementById("close-hint").innerText = uiDictionary["closeHint"][currentLang];

////////////////////////////////////////////////////////
// NEW: NUMBER TRANSLATOR FUNCTION
////////////////////////////////////////////////////////

// This perfectly converts "12" into "१२" if Hindi or Marathi is selected
function getLocalDigit(num) {
    if (currentLang === 'hi' || currentLang === 'mr') {
        const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
        return num.toString().split('').map(digit => devanagariDigits[digit]).join('');
    }
    return num; // Keeps it as normal 1, 2, 3 for English
}

////////////////////////////////////////////////////////
// 2. IMAGE MAP (Cycles through your images)
////////////////////////////////////////////////////////

const availableImages = [
  "images/panda.png",
  "images/baby-elephant.png",
  "images/world.png",
  "images/baby-panda.png",
  "images/tiger-dr.png",
  "images/winnie-pooh.png"
];

const numberImages = {};
for (let i = 1; i <= 40; i++) {
  numberImages[i] = availableImages[(i - 1) % availableImages.length];
}

////////////////////////////////////////////////////////
// 3. ELEMENTS & PAGINATION
////////////////////////////////////////////////////////

const grid = document.getElementById("numbersGrid");
const overlay = document.getElementById("counterOverlay");
const square = document.getElementById("counterSquare");
const circle = document.getElementById("counterCircle");
const counterValue = document.getElementById("counterValue");
const imageContainer = document.getElementById("imageContainer");
const popupName = document.getElementById("popupName");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

let countInterval;
let currentPage = 0; // 0 = (1-20), 1 = (21-40)
const PAGE_SIZE = 20;

function renderGrid() {
  grid.innerHTML = ""; 

  const startNum = (currentPage * PAGE_SIZE) + 1; 
  const endNum = startNum + PAGE_SIZE - 1;        

  for (let i = startNum; i <= endNum; i++) {
    const card = document.createElement("div");
    card.className = "card";
    
    // Use our new translator for the card display!
    card.textContent = getLocalDigit(i);
    
    // We still pass the actual math number (i) to the function
    card.onclick = () => startCounting(i);
    grid.appendChild(card);
  }

  btnPrev.style.display = currentPage === 0 ? "none" : "block";
  btnNext.style.display = currentPage === 1 ? "none" : "block";
}

btnNext.onclick = () => {
  currentPage = 1;
  renderGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

btnPrev.onclick = () => {
  currentPage = 0;
  renderGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

renderGrid();

////////////////////////////////////////////////////////
// 4. COUNTING LOGIC & AUDIO
////////////////////////////////////////////////////////

function startCounting(finalNumber) {
  clearInterval(countInterval);

  let count = 0;
  // Use our translator for the starting "0" (or "०")
  counterValue.textContent = getLocalDigit(0); 
  imageContainer.innerHTML = ""; 
  popupName.textContent = ""; 

  overlay.style.display = "flex";

  square.style.animation = "none";
  square.offsetHeight; 
  square.style.animation = "popup 0.35s ease forwards";

  countInterval = setInterval(() => {
    count++;
    
    // Update the circle with the translated numeral!
    counterValue.textContent = getLocalDigit(count);

    // Audio path stays mathematically identical
    const audio = new Audio(`sounds/${currentLang}/numbers/${count}_${currentLang}.mp3`);
    audio.play().catch(e => console.log("Sound not found for:", count));

    circle.style.background = randomGradient();

    const img = document.createElement("img");
    img.src = numberImages[finalNumber];
    img.className = "countImg";
    imageContainer.appendChild(img);

    if (count === finalNumber) {
      clearInterval(countInterval);
      
      // Display the translated word
      popupName.textContent = numbersDict[finalNumber][currentLang];
      
      launchConfetti();
    }
  }, 600);
}

////////////////////////////////////////////////////////
// 5. CLOSE EARLY & HELPERS
////////////////////////////////////////////////////////

function closeOverlay() {
  clearInterval(countInterval);
  overlay.style.display = "none";
}

overlay.onclick = closeOverlay;
square.onclick = (e) => {
  closeOverlay();
  e.stopPropagation(); 
};

function randomGradient() {
  return `linear-gradient(135deg,
    hsl(${Math.random() * 360}, 85%, 55%),
    hsl(${Math.random() * 360}, 85%, 45%))`;
}

function launchConfetti() {
  if (typeof confetti === "function") {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
  }
}