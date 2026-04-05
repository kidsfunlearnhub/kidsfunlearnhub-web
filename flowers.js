// This tells the script to WAIT until the HTML is fully loaded on the screen
window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // Read the language clicked on the home page (default to English if empty)
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // Dictionary for the Page Title and Next Button
    const uiDictionary = {
        "page-title": { en: "🌹 Learn Flowers", hi: "🌹 फूल सीखें", mr: "🌹 फुले शिका" },
        "nextBtn": { en: "➡ Next Flowers", hi: "➡ अगले फूल", mr: "➡ पुढील फुले" }
    };

    // Dictionary for all 30 flowers
    const flowerDict = {
        "rose": { en: "Rose", hi: "गुलाब", mr: "गुलाब" },
        "tulip": { en: "Tulip", hi: "ट्यूलिप", mr: "ट्यूलिप" },
        "sunflower": { en: "Sunflower", hi: "सूरजमुखी", mr: "सूर्यफूल" },
        "lotus": { en: "Lotus", hi: "कमल", mr: "कमळ" },
        "daisy": { en: "Daisy", hi: "गुलबहार", mr: "डेझी" },
        "lily": { en: "Lily", hi: "कुमुदिनी", mr: "लिली" },
        "orchid": { en: "Orchid", hi: "ऑर्किड", mr: "ऑर्किड" },
        "marigold": { en: "Marigold", hi: "गेंदा", mr: "झेंडू" },
        "jasmine": { en: "Jasmine", hi: "चमेली", mr: "मोगरा" },
        "hibiscus": { en: "Hibiscus", hi: "गुड़हल", mr: "जास्वंद" },
        "lavender": { en: "Lavender", hi: "लैवेंडर", mr: "लॅव्हेंडर" },
        "peony": { en: "Peony", hi: "पियोनी", mr: "पिओनी" },
        "daffodil": { en: "Daffodil", hi: "डैफोडिल", mr: "डॅफोडिल" },
        "cherryblossom": { en: "Cherry Blossom", hi: "चेरी ब्लॉसम", mr: "चेरी ब्लॉसम" },
        "poppy": { en: "Poppy", hi: "खसखस", mr: "खसखस फूल" },
        "magnolia": { en: "Magnolia", hi: "चंपा", mr: "मॅग्नोलिया" },
        "bluebell": { en: "Bluebell", hi: "ब्लूबेल", mr: "ब्लूबेल" },
        "gardenia": { en: "Gardenia", hi: "गार्डेनिया", mr: "गार्डेनिया" },
        "carnation": { en: "Carnation", hi: "कार्नेशन", mr: "कार्नेशन" },
        "iris": { en: "Iris", hi: "आइरिस", mr: "आयरिस" },
        "zinnia": { en: "Zinnia", hi: "ज़िनिया", mr: "झिनिया" },
        "begonia": { en: "Begonia", hi: "बेगोनिया", mr: "बेगोनिया" },
        "camellia": { en: "Camellia", hi: "कैमेलिया", mr: "कॅमेलिया" },
        "petunia": { en: "Petunia", hi: "पेटूनिया", mr: "पिटुनिया" },
        "azalea": { en: "Azalea", hi: "अज़ेलिया", mr: "अझेलिया" },
        "geranium": { en: "Geranium", hi: "जेरेनियम", mr: "जेरेनियम" },
        "snapdragon": { en: "Snapdragon", hi: "स्नैपड्रैगन", mr: "स्नॅपड्रॅगन" },
        "cosmos": { en: "Cosmos", hi: "कॉसमॉस", mr: "कॉसमॉस" },
        "anemone": { en: "Anemone", hi: "एनीमोन", mr: "अॅनिमोन" },
        "buttercup": { en: "Buttercup", hi: "बटरकप", mr: "बटरकप" }
    };

    const flowers = Object.keys(flowerDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("flowerGrid");
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

    flowers.forEach(name => {
      const img = new Image();
      img.src = `images/flowers/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/flowers/${name}.mp3`;
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

      flowers.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        const translatedName = flowerDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${name}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFlower(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= flowers.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY
    /////////////////////////////////////////////////

    function showFlower(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = flowerDict[name][currentLang];
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