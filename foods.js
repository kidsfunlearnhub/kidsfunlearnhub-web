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
    let currentLang = sessionStorage.getItem('foodsPageLang') || globalLang;

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
                sessionStorage.setItem('foodsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🍛 Learn Foods", hi: "🍛 भोजन सीखें", mr: "🍛 पदार्थ शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Food Activities", hi: "भोजन गतिविधियां", mr: "अन्न ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Foods", hi: "➡ अगला भोजन", mr: "➡ पुढील पदार्थ" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Food Court</strong>! Tap on any food card to see a vibrant picture and hear its name. This interactive vocabulary activity helps toddlers recognize everyday Indian foods and dishes, improving their memory and early speech skills.",
            hi: "<strong>KidsFunLearnHub फ़ूड कोर्ट</strong> में आपका स्वागत है! एक जीवंत तस्वीर देखने और उसका नाम सुनने के लिए किसी भी भोजन कार्ड पर टैप करें। यह संवादात्मक शब्दावली गतिविधि बच्चों को रोजमर्रा के भारतीय खाद्य पदार्थों को पहचानने में मदद करती है, जिससे उनकी याददाश्त और प्रारंभिक भाषण कौशल में सुधार होता है।",
            mr: "<strong>KidsFunLearnHub फूड कोर्टमध्ये</strong> आपले स्वागत आहे! एक दोलायमान चित्र पाहण्यासाठी आणि त्याचे नाव ऐकण्यासाठी कोणत्याही खाद्यपदार्थाच्या कार्डवर टॅप करा. ही संवादात्मक शब्दसंग्रह ऍक्टिव्हिटी लहान मुलांना दररोजचे भारतीय पदार्थ ओळखण्यास मदत करते, त्यांची स्मरणशक्ती आणि प्रारंभिक भाषण कौशल्ये सुधारते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

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

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const foods = Object.keys(foodDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("foodGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    foods.forEach(name => {
      const img = new Image();
      img.src = `images/foods/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/foods/${name}.mp3`;
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

      foods.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = foodDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFood(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

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
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showFood(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = foodDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('foodsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});