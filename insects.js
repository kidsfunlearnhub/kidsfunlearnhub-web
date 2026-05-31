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
    let currentLang = sessionStorage.getItem('insectsPageLang') || globalLang;

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
                sessionStorage.setItem('insectsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🪰 Learn Insects", hi: "🪰 कीड़े सीखें", mr: "🪰 कीटक शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Insect Activities", hi: "कीट गतिविधियां", mr: "कीटक ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Insects", hi: "➡ अगले कीड़े", mr: "➡ पुढील कीटक" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Bug Explorer</strong>! Tap on any insect card to see a larger picture and hear its name. This interactive vocabulary activity helps toddlers recognize nature's smallest creatures, improving their memory and early speech skills.",
            hi: "<strong>KidsFunLearnHub बग एक्सप्लोरर</strong> में आपका स्वागत है! बड़ी तस्वीर देखने और उसका नाम सुनने के लिए किसी भी कीट कार्ड पर टैप करें। यह संवादात्मक शब्दावली गतिविधि बच्चों को प्रकृति के सबसे छोटे जीवों को पहचानने में मदद करती है, जिससे उनकी याददाश्त और प्रारंभिक भाषण कौशल में सुधार होता है।",
            mr: "<strong>KidsFunLearnHub बग एक्सप्लोररमध्ये</strong> आपले स्वागत आहे! मोठे चित्र पाहण्यासाठी आणि त्याचे नाव ऐकण्यासाठी कोणत्याही कीटक कार्डवर टॅप करा. ही संवादात्मक शब्दसंग्रह ऍक्टिव्हिटी लहान मुलांना निसर्गातील सर्वात लहान जीव ओळखण्यास मदत करते, त्यांची स्मरणशक्ती आणि प्रारंभिक भाषण कौशल्ये सुधारते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

    const insectDict = {
        "ant": { en: "Ant", hi: "चींटी", mr: "मुंगी" },
        "bee": { en: "Bee", hi: "मधुमक्खी", mr: "मधमाशी" },
        "butterfly": { en: "Butterfly", hi: "तितली", mr: "फुलपाखरू" },
        "mosquito": { en: "Mosquito", hi: "मच्छर", mr: "डास" },
        "housefly": { en: "Housefly", hi: "मक्खी", mr: "माशी" },
        "dragonfly": { en: "Dragonfly", hi: "ड्रैगनफ्लाई", mr: "चतुर" },
        "grasshopper": { en: "Grasshopper", hi: "टिड्डा", mr: "नाकतोडा" },
        "cricket": { en: "Cricket", hi: "झींगुर", mr: "रातकिडा" },
        "ladybug": { en: "Ladybug", hi: "लेडीबग", mr: "सोनकिडा" },
        "termite": { en: "Termite", hi: "दीमक", mr: "वाळवी" },
        "beetle": { en: "Beetle", hi: "भृंग", mr: "भुंगा" },
        "moth": { en: "Moth", hi: "पतंगा", mr: "पतंग" },
        "firefly": { en: "Firefly", hi: "जुगनू", mr: "काजवा" },
        "wasp": { en: "Wasp", hi: "ततैया", mr: "गांधीलमाशी" },
        "hornet": { en: "Hornet", hi: "हॉर्नेट", mr: "मोठी गांधीलमाशी" },
        "weevil": { en: "Weevil", hi: "घुन", mr: "सोंड्या कीटक" },
        "aphid": { en: "Aphid", hi: "माहू", mr: "मावा" },
        "caterpillar": { en: "Caterpillar", hi: "इल्ली", mr: "सुरवंट" },
        "leafhopper": { en: "Leafhopper", hi: "फुदका", mr: "तुडतुडे" },
        "planthopper": { en: "Planthopper", hi: "प्लांटहॉपर", mr: "प्लांटहॉपर" },
        "mantis": { en: "Mantis", hi: "मैंटिस", mr: "मँटिस" },
        "stick insect": { en: "Stick Insect", hi: "लकड़ी कीड़ा", mr: "काडीकिडा" },
        "water strider": { en: "Water Strider", hi: "वाटर स्ट्राइडर", mr: "पाणकिडा" },
        "dung beetle": { en: "Dung Beetle", hi: "गोबरैला", mr: "शेणकिडा" },
        "carpenter ant": { en: "Carpenter Ant", hi: "बढ़ई चींटी", mr: "सुतार मुंगी" },
        "red ant": { en: "Red Ant", hi: "लाल चींटी", mr: "लाल मुंगी" },
        "silkworm": { en: "Silkworm", hi: "रेशम का कीड़ा", mr: "रेशीम कीटक" },
        "lacewing": { en: "Lacewing", hi: "लेसविंग", mr: "लेसविंग" },
        "bumblebee": { en: "Bumblebee", hi: "भौंरा", mr: "बंबलबी" },
        "fruit fly": { en: "Fruit Fly", hi: "फल मक्खी", mr: "फळमाशी" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const insects = Object.keys(insectDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("insectGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    insects.forEach(name => {
      const img = new Image();
      img.src = `images/insects/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/insects/${name}.mp3`;
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

      insects.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = insectDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showInsect(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= insects.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showInsect(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = insectDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('insectsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});