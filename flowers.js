"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /////////////////////////////////////////////////
    // 1. CURSOR LOGIC
    /////////////////////////////////////////////////
    const select = document.getElementById("cursorSelect");
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
        if(select) select.value = savedCursor.split("/").pop().replace(/["')]/g, '').split(' ')[0];
    }
    if(select) {
        select.addEventListener("change", () => {
            if (!select.value) {
                document.documentElement.style.cursor = "auto";
                localStorage.removeItem("kidsCursor");
                return;
            }
            const cursorValue = `url("images/cursors/${select.value}") 16 16, auto`;
            document.documentElement.style.cursor = cursorValue;
            localStorage.setItem("kidsCursor", cursorValue);
        });
    }

    /////////////////////////////////////////////////
    // 2. LANGUAGE SETUP, DICTIONARIES & BUTTONS
    /////////////////////////////////////////////////
    
    // Get the global language from index.html
    let globalLang = localStorage.getItem('mySecretLanguage') || 'en';
    
    // Get this specific page's language, fallback to global if not clicked yet
    let currentLang = sessionStorage.getItem('flowersPageLang') || globalLang;

    // Highlight the active language button and set up the reload logic
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', (e) => {
            const selectedLang = e.target.dataset.lang;
            if (selectedLang !== currentLang) {
                // Save only to sessionStorage so it doesn't affect the rest of the site
                sessionStorage.setItem('flowersPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🌹 Learn Flowers", hi: "🌹 फूल सीखें", mr: "🌹 फुले शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Flower Activities", hi: "फूल गतिविधियां", mr: "फुले ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Flowers", hi: "➡ अगले फूल", mr: "➡ पुढील फुले" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Botanical Garden</strong>! Tap on any flower card to see a beautiful picture and hear its name. This interactive vocabulary activity helps toddlers recognize nature's colorful plants, improving their memory and early speech skills.",
            hi: "<strong>KidsFunLearnHub बोटैनिकल गार्डन</strong> में आपका स्वागत है! एक सुंदर तस्वीर देखने और उसका नाम सुनने के लिए किसी भी फूल कार्ड पर टैप करें। यह संवादात्मक शब्दावली गतिविधि बच्चों को प्रकृति के रंगीन पौधों को पहचानने में मदद करती है, जिससे उनकी याददाश्त और प्रारंभिक भाषण कौशल में सुधार होता है।",
            mr: "<strong>KidsFunLearnHub बोटॅनिकल गार्डनमध्ये</strong> आपले स्वागत आहे! एक सुंदर चित्र पाहण्यासाठी आणि त्याचे नाव ऐकण्यासाठी कोणत्याही फूल कार्डवर टॅप करा. ही संवादात्मक शब्दसंग्रह ऍक्टिव्हिटी लहान मुलांना निसर्गातील रंगीबेरंगी वनस्पती ओळखण्यास मदत करते, त्यांची स्मरणशक्ती आणि प्रारंभिक भाषण कौशल्ये सुधारते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

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

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const flowers = Object.keys(flowerDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("flowerGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

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
    // 4. BUILD PAGE GRID
    /////////////////////////////////////////////////
    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      flowers.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = flowerDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFlower(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

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
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showFlower(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = flowerDict[name][currentLang];
      
      if (popup) {
          popup.classList.remove("hidden");
          popup.style.display = "flex";
      }

      if (activeAudio) {
          activeAudio.pause();
          activeAudio.currentTime = 0;
      }
      activeAudio = soundCache[name];
      activeAudio.currentTime = 0;
      activeAudio.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    function closePopup() {
        if (popup) {
            popup.classList.add("hidden");
            popup.style.display = "none";
        }
        if (activeAudio) activeAudio.pause();
    }

    // Toddler-proof closing
    if (popup) {
        popup.onclick = () => { closePopup(); };
    }

    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
        popupContent.onclick = (e) => {
            closePopup();
            e.stopPropagation();
        };
    }

    /////////////////////////////////////////////////
    // 6. CONFETTI
    /////////////////////////////////////////////////
    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    /////////////////////////////////////////////////
    // 7. CLEANUP LOGIC ON EXIT
    /////////////////////////////////////////////////
    const cleanupSession = () => sessionStorage.removeItem('flowersPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});