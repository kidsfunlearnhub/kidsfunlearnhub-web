// 1. The Translation Dictionary for the Hub Page
const hubDictionary = {
    "nav-parent": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पालक कोपरा" },
    "main-title": { en: "🎉 Fun Learning for Kids 🎉", hi: "🎉 बच्चों के लिए मजेदार शिक्षा 🎉", mr: "🎉 मुलांसाठी मजेशीर शिक्षण 🎉" },
    "desc-abc-img": { en: "Learn Alphabets with Images", hi: "चित्रों के साथ अक्षर सीखें", mr: "चित्रांसह मुळाक्षरे शिका" },
    "desc-abc": { en: "Learn Alphabets", hi: "अक्षर सीखें", mr: "मुळाक्षरे शिका" },
    "desc-abc-write": { en: "Learn Alphabets Writing", hi: "अक्षर लिखना सीखें", mr: "मुळाक्षरे लिहायला शिका" },
    "desc-numbers": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
    "desc-body": { en: "Learn Body Parts", hi: "शरीर के अंग सीखें", mr: "शरीराचे अवयव शिका" },
    "desc-hindi": { en: "Learn Hindi Alphabet", hi: "हिंदी वर्णमाला सीखें", mr: "हिंदी मुळाक्षरे शिका" },
    "desc-shapes": { en: "Learn Shapes", hi: "आकार सीखें", mr: "आकार शिका" },
    "desc-animals": { en: "Learn Animals", hi: "जानवरों के नाम सीखें", mr: "प्राण्यांची नावे शिका" },
    "desc-insects": { en: "Learn Insects", hi: "कीड़ों के नाम सीखें", mr: "कीटकांची नावे शिका" },
    "desc-flowers": { en: "Learn Flowers", hi: "फूलों के नाम सीखें", mr: "फुलांची नावे शिका" },
    "desc-birds": { en: "Learn Birds", hi: "पक्षियों के नाम सीखें", mr: "पक्ष्यांची नावे शिका" },
    "desc-veg": { en: "Learn Vegetables", hi: "सब्जियों के नाम सीखें", mr: "भाज्यांची नावे शिका" },
    "desc-vehicles": { en: "Learn Vehicles", hi: "वाहनों के नाम सीखें", mr: "वाहनांची नावे शिका" },
    "desc-fruits": { en: "Learn Fruits", hi: "फलों के नाम सीखें", mr: "फळांची नावे शिका" },
    "desc-foods": { en: "Learn Food", hi: "भोजन के नाम सीखें", mr: "अन्नाची नावे शिका" },
    "desc-game": { en: "Identify correct Animal", hi: "सही जानवर को पहचानें", mr: "योग्य प्राणी ओळखा" },
    "nav-prev": { en: "⬅ Previous", hi: "⬅ पिछला", mr: "⬅ मागील" },
    "nav-next": { en: "Next ➡", hi: "अगला ➡", mr: "पुढील ➡" }
};

// 2. This code runs immediately when the page loads
window.addEventListener('DOMContentLoaded', () => {
    // Read the language clicked on the home page (default to English if empty)
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // Loop through the dictionary and change the text on the screen!
    for (let currentId in hubDictionary) {
        let elementToChange = document.getElementById(currentId);
        if (elementToChange) {
            elementToChange.innerText = hubDictionary[currentId][currentLang];
        }
    }

    // ==========================================
    // NEW CODE: HIDE & SHOW CARDS BY LANGUAGE
    // ==========================================

    // 1. Grab the specific cards from the page using their classes
    const cardAbcImage = document.querySelector('.abcwithimage');
    const cardAbc = document.querySelector('.abc');
    const cardAbcDraw = document.querySelector('.abcdraw');
    const cardHindi = document.querySelector('.hindi');

    // 2. Hide or show them based on the chosen language
    if (currentLang === 'en') {
        // ENGLISH: Show ABC cards, Hide Hindi card
        if(cardAbcImage) cardAbcImage.style.display = ''; 
        if(cardAbc) cardAbc.style.display = '';
        if(cardAbcDraw) cardAbcDraw.style.display = '';
        if(cardHindi) cardHindi.style.display = 'none'; // Hides the Hindi card
    } 
    else if (currentLang === 'hi') {
        // HINDI: Hide ABC cards, Show Hindi card
        if(cardAbcImage) cardAbcImage.style.display = 'none'; // Hides the card
        if(cardAbc) cardAbc.style.display = 'none';
        if(cardAbcDraw) cardAbcDraw.style.display = 'none';
        if(cardHindi) cardHindi.style.display = ''; 
    } 
    else if (currentLang === 'mr') {
        // MARATHI: Hide both ABC cards and Hindi card
        if(cardAbcImage) cardAbcImage.style.display = 'none';
        if(cardAbc) cardAbc.style.display = 'none';
        if(cardAbcDraw) cardAbcDraw.style.display = 'none';
        if(cardHindi) cardHindi.style.display = 'none';
    }
});

JS
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

/* Start-pagination with 6 cards per page  */
// ===== CARD PAGINATION =====

// const cards = document.querySelectorAll("#cardContainer .card");

// const cardsPerPage = 6;
// let currentPage = 0;

// const totalPages = Math.ceil(cards.length / cardsPerPage);

// const prevBtn = document.getElementById("prevBtn");
// const nextBtn = document.getElementById("nextBtn");
// const pageInfo = document.getElementById("pageInfo");

// function showPage(page){

// cards.forEach((card, index)=>{

// card.style.display =
// (index >= page * cardsPerPage &&
//  index < (page+1) * cardsPerPage)
// ? "block" : "none";

// });

// pageInfo.textContent = `Page ${page+1} / ${totalPages}`;

// prevBtn.disabled = page === 0;
// nextBtn.disabled = page === totalPages-1;

// }

// prevBtn.onclick = ()=>{
// if(currentPage > 0){
// currentPage--;
// showPage(currentPage);
// }
// };

// nextBtn.onclick = ()=>{
// if(currentPage < totalPages-1){
// currentPage++;
// showPage(currentPage);
// }
// };

// // initial load
// showPage(currentPage);

// ===== FIXED CARD PAGINATION =====

// ===== WORKING CARD PAGINATION =====

window.addEventListener("load", () => {

  const container = document.getElementById("cardContainer");
  const cards = Array.from(container.children);

  const cardsPerPage = 6;
  let currentPage = 0;

  const totalPages = Math.ceil(cards.length / cardsPerPage);

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageInfo = document.getElementById("pageInfo");

  function showPage(page) {

    cards.forEach(card => card.style.display = "none");

    const start = page * cardsPerPage;
    const end = start + cardsPerPage;

    for (let i = start; i < end && i < cards.length; i++) {
      cards[i].style.display = "flex";
    }

    pageInfo.textContent = `Page ${page + 1} / ${totalPages}`;

    prevBtn.disabled = page === 0;
    nextBtn.disabled = page === totalPages - 1;
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      showPage(currentPage);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      showPage(currentPage);
    }
  });

  showPage(currentPage);
});


// document.addEventListener("DOMContentLoaded", () => {

//   const cards = Array.from(document.querySelectorAll("#cardContainer .card"));
//   const cardsPerPage = 6;

//   let currentPage = 0;
//   const totalPages = Math.ceil(cards.length / cardsPerPage);

//   const prevBtn = document.getElementById("prevBtn");
//   const nextBtn = document.getElementById("nextBtn");
//   const pageInfo = document.getElementById("pageInfo");

//   function showPage(page) {

//     // hide all cards
//     cards.forEach(card => card.style.display = "none");

//     // show only required cards
//     const start = page * cardsPerPage;
//     const end = start + cardsPerPage;

//     cards.slice(start, end).forEach(card => {
//       card.style.display = "flex";
//     });

//     pageInfo.textContent = `Page ${page + 1} / ${totalPages}`;

//     prevBtn.disabled = page === 0;
//     nextBtn.disabled = page === totalPages - 1;
//   }

//   prevBtn.onclick = () => {
//     if (currentPage > 0) {
//       currentPage--;
//       showPage(currentPage);
//     }
//   };

//   nextBtn.onclick = () => {
//     if (currentPage < totalPages - 1) {
//       currentPage++;
//       showPage(currentPage);
//     }
//   };

//   showPage(currentPage);
// });


/* End-pagination with 6 cards per page  */


