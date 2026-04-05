// This tells the script to WAIT until the HTML is fully loaded on the screen
window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // Read the language clicked on the home page (default to English if empty)
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // Dictionary for the Page Title and Next Button
    const uiDictionary = {
        "page-title": { en: "🫛 Learn Vegetables", hi: "🫛 सब्जियां सीखें", mr: "🫛 भाज्या शिका" },
        "nextBtn": { en: "➡ Next Vegetables", hi: "➡ अगली सब्जियां", mr: "➡ पुढील भाज्या" }
    };

    // Dictionary for all 30 vegetables
    const vegetableDict = {
        "potato": { en: "Potato", hi: "आलू", mr: "बटाटा" },
        "tomato": { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
        "onion": { en: "Onion", hi: "प्याज", mr: "कांदा" },
        "carrot": { en: "Carrot", hi: "गाजर", mr: "गाजर" },
        "brinjal": { en: "Brinjal", hi: "बैंगन", mr: "वांगी" },
        "cabbage": { en: "Cabbage", hi: "पत्ता गोभी", mr: "कोबी" },
        "cauliflower": { en: "Cauliflower", hi: "फूल गोभी", mr: "फ्लॉवर" },
        "peas": { en: "Peas", hi: "मटर", mr: "वाटाणा" },
        "spinach": { en: "Spinach", hi: "पालक", mr: "पालक" },
        "okra": { en: "Okra", hi: "भिंडी", mr: "भेंडी" },
        "bottle gourd": { en: "Bottle Gourd", hi: "लौकी", mr: "दुधी भोपळा" },
        "ridge gourd": { en: "Ridge Gourd", hi: "तोरई", mr: "दोडका" },
        "bitter gourd": { en: "Bitter Gourd", hi: "करेला", mr: "कारले" },
        "pumpkin": { en: "Pumpkin", hi: "कद्दू", mr: "भोपळा" },
        "radish": { en: "Radish", hi: "मूली", mr: "मुळा" },
        "beetroot": { en: "Beetroot", hi: "चुकंदर", mr: "बीटरूट" },
        "capsicum": { en: "Capsicum", hi: "शिमला मिर्च", mr: "ढोबळी मिरची" },
        "cucumber": { en: "Cucumber", hi: "खीरा", mr: "काकडी" },
        "beans": { en: "Beans", hi: "बीन्स", mr: "फरसबी" },
        "turnip": { en: "Turnip", hi: "शलजम", mr: "सलगम" },
        "drumstick": { en: "Drumstick", hi: "सहजन", mr: "शेवगा" },
        "ivy gourd": { en: "Ivy Gourd", hi: "कुंदरू", mr: "तोंडली" },
        "cluster beans": { en: "Cluster Beans", hi: "ग्वार फली", mr: "गवार" },
        "fenugreek": { en: "Fenugreek", hi: "मेथी", mr: "मेथी" },
        "mustard greens": { en: "Mustard Greens", hi: "सरसों का साग", mr: "मोहरीची पाने" },
        "colocasia": { en: "Colocasia", hi: "अरबी", mr: "अळू" },
        "ash gourd": { en: "Ash Gourd", hi: "पेठा", mr: "कोहळा" },
        "snake gourd": { en: "Snake Gourd", hi: "चिचिंडा", mr: "पडवळ" },
        "raw banana": { en: "Raw Banana", hi: "कच्चा केला", mr: "कच्ची केळी" },
        "sweet potato": { en: "Sweet Potato", hi: "शकरकंद", mr: "रताळे" }
    };

    const vegetables = Object.keys(vegetableDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("vegetableGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    // Safely update the title and button text
    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = uiDictionary["page-title"][currentLang];
    if (nextBtn) nextBtn.innerText = uiDictionary["nextBtn"][currentLang];

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE
    /////////////////////////////////////////////////

    const imageCache = {};
    const soundCache = {};

    vegetables.forEach(name => {
      const img = new Image();
      img.src = `images/vegetables/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/vegetables/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadPage() {
      if (!grid) return; // Extra safety check
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      vegetables.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        const translatedName = vegetableDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${name}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showVegetable(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= vegetables.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY
    /////////////////////////////////////////////////

    function showVegetable(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = vegetableDict[name][currentLang];
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    if (popup) {
        popup.onclick = () => popup.classList.add("hidden");
    }

    /////////////////////////////////////////////////
    // CONFETTI
    /////////////////////////////////////////////////

    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    /////////////////////////////////////////////////
    // INIT
    /////////////////////////////////////////////////

    loadPage();
};