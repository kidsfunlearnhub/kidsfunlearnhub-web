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
    let currentLang = sessionStorage.getItem('vegetablesPageLang') || globalLang;

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
                sessionStorage.setItem('vegetablesPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🫛 Learn Vegetables", hi: "🫛 सब्जियां सीखें", mr: "🫛 भाज्या शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Vegetable Activities", hi: "सब्जी गतिविधियां", mr: "भाजी ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Vegetables", hi: "➡ अगली सब्जियां", mr: "➡ पुढील भाज्या" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Vegetable Garden</strong>! Tap on any vegetable card to see a vibrant picture and hear its name. This interactive vocabulary activity helps toddlers recognize healthy everyday foods, improving their memory, early speech skills, and encouraging nutritious eating habits.",
            hi: "<strong>KidsFunLearnHub सब्जी उद्यान</strong> में आपका स्वागत है! एक जीवंत तस्वीर देखने और उसका नाम सुनने के लिए किसी भी सब्जी कार्ड पर टैप करें। यह संवादात्मक शब्दावली गतिविधि बच्चों को रोजमर्रा के स्वस्थ खाद्य पदार्थों को पहचानने में मदद करती है, जिससे उनकी याददाश्त, प्रारंभिक भाषण कौशल में सुधार होता है और पौष्टिक खाने की आदतों को बढ़ावा मिलता है।",
            mr: "<strong>KidsFunLearnHub भाजीपाला बागेत</strong> आपले स्वागत आहे! एक दोलायमान चित्र पाहण्यासाठी आणि त्याचे नाव ऐकण्यासाठी कोणत्याही भाजीच्या कार्डवर टॅप करा. ही संवादात्मक शब्दसंग्रह ऍक्टिव्हिटी लहान मुलांना दररोजचे निरोगी अन्न ओळखण्यास मदत करते, त्यांची स्मरणशक्ती, प्रारंभिक भाषण कौशल्ये सुधारते आणि पौष्टिक खाण्याच्या सवयींना प्रोत्साहन देते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

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

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const vegetables = Object.keys(vegetableDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("vegetableGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

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
    // 4. BUILD PAGE GRID
    /////////////////////////////////////////////////
    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      vegetables.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = vegetableDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showVegetable(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

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
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showVegetable(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = vegetableDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('vegetablesPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});