// This tells the script to WAIT until the HTML is fully loaded on the screen
window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // Read the language clicked on the home page (default to English if empty)
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // Dictionary for the Page Title and Next Button
    const uiDictionary = {
        "page-title": { en: "🍛 Learn Foods", hi: "🍛 भोजन सीखें", mr: "🍛 पदार्थ शिका" },
        "nextBtn": { en: "➡ Next Foods", hi: "➡ अगला भोजन", mr: "➡ पुढील पदार्थ" }
    };

    // Dictionary for all 30 foods
    const foodDict = {
        "idli": { en: "Idli", hi: "इडली", mr: "इडली" },
        "dosa": { en: "Dosa", hi: "डोसा", mr: "डोसा" },
        "vada": { en: "Vada", hi: "वड़ा", mr: "वडा" },
        "sambar": { en: "Sambar", hi: "सांभर", mr: "सांबार" },
        "poha": { en: "Poha", hi: "पोहा", mr: "पोहे" },
        "upma": { en: "Upma", hi: "उपमा", mr: "उपमा" },
        "paratha": { en: "Paratha", hi: "पराठा", mr: "पराठा" },
        "puri": { en: "Puri", hi: "पूरी", mr: "पुरी" },
        "chapati": { en: "Chapati", hi: "चपाती", mr: "चपाती" },
        "dal": { en: "Dal", hi: "दाल", mr: "डाळ" },
        "khichdi": { en: "Khichdi", hi: "खिचड़ी", mr: "खिचडी" },
        "biryani": { en: "Biryani", hi: "बिरयानी", mr: "बिर्याणी" },
        "pulao": { en: "Pulao", hi: "पुलाव", mr: "पुलाव" },
        "paneer": { en: "Paneer", hi: "पनीर", mr: "पनीर" },
        "rajma": { en: "Rajma", hi: "राजमा", mr: "राजमा" },
        "chole": { en: "Chole", hi: "छोले", mr: "छोले" },
        "bhindi": { en: "Bhindi", hi: "भिंडी", mr: "भेंडी" },
        "aloo_gobi": { en: "Aloo Gobi", hi: "आलू गोभी", mr: "आलू गोबी" },
        "pav_bhaji": { en: "Pav Bhaji", hi: "पाव भाजी", mr: "पाव भाजी" },
        "vada_pav": { en: "Vada Pav", hi: "वड़ा पाव", mr: "वडा पाव" },
        "dhokla": { en: "Dhokla", hi: "ढोकला", mr: "ढोकळा" },
        "thepla": { en: "Thepla", hi: "थेपला", mr: "थेपला" },
        "kachori": { en: "Kachori", hi: "कचौड़ी", mr: "कचोरी" },
        "samosa": { en: "Samosa", hi: "समोसा", mr: "समोसा" },
        "jalebi": { en: "Jalebi", hi: "जलेबी", mr: "जिलबी" },
        "gulab_jamun": { en: "Gulab Jamun", hi: "गुलाब जामुन", mr: "गुलाब जामुन" },
        "rasgulla": { en: "Rasgulla", hi: "रसगुल्ला", mr: "रसगुल्ला" },
        "kheer": { en: "Kheer", hi: "खीर", mr: "खीर" },
        "halwa": { en: "Halwa", hi: "हलवा", mr: "हलवा" },
        "laddu": { en: "Laddu", hi: "लड्डू", mr: "लाडू" }
    };

    const foods = Object.keys(foodDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("foodGrid");
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

    foods.forEach(name => {
      const img = new Image();
      img.src = `images/foods/${name}.png`; // Kept .png as you had it!
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/foods/${name}.mp3`;
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

      foods.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        const translatedName = foodDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${name}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFood(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= foods.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY
    /////////////////////////////////////////////////

    function showFood(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = foodDict[name][currentLang];
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