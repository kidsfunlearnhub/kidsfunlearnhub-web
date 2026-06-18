"use strict";

window.onload = function() {

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
    let currentLang = sessionStorage.getItem('shapesPageLang') || globalLang;

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
                // Save only to sessionStorage so it doesn't affect the rest of the site!
                sessionStorage.setItem('shapesPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🟢 Learn Shapes", hi: "🟢 आकार सीखें", mr: "🟢 आकार शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "traceBtn": { en: "✏️ Practice Tracing!", hi: "✏️ ट्रेसिंग का अभ्यास करें!", mr: "✏️ गिरवण्याचा सराव करा!" },
        "activitiesBtn": { en: "Shapes Activities", hi: "आकार गतिविधियां", mr: "आकार ऍक्टिव्हिटीज" },
        "closeHint": { en: "Tap anywhere to close ✖", hi: "बंद करने के लिए टैप करें ✖", mr: "बंद करण्यासाठी टॅप करा ✖" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Geometry Zone</strong>! Tap on any shape card to see how basic 2D geometry transforms into objects you see every day. This interactive visual matching activity helps toddlers build strong cognitive recognition and spatial awareness.",
            hi: "<strong>KidsFunLearnHub ज्योमेट्री ज़ोन</strong> में आपका स्वागत है! किसी भी आकार कार्ड पर टैप करके देखें कि कैसे बुनियादी 2D ज्यामिति उन वस्तुओं में बदल जाती है जिन्हें आप हर दिन देखते हैं। यह गतिविधि बच्चों को मजबूत संज्ञानात्मक पहचान और स्थानिक जागरूकता बनाने में मदद करती है।",
            mr: "<strong>KidsFunLearnHub भूमिती झोनमध्ये</strong> आपले स्वागत आहे! मूलभूत 2D भूमिती तुम्ही रोज पाहत असलेल्या वस्तूंमध्ये कशी बदलते हे पाहण्यासाठी कोणत्याही आकार कार्डवर टॅप करा. ही क्रियाकलाप लहान मुलांना मजबूत संज्ञानात्मक ओळख आणि अवकाशीय जागरूकता निर्माण करण्यास मदत करते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

    // Apply translations using innerHTML to keep bold tags
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    // 3. SHAPES DICTIONARY
    const shapesDict = {
        "circle": { en: "Circle", hi: "वृत्त (गोल)", mr: "वर्तुळ (गोल)" },
        "square": { en: "Square", hi: "वर्ग (चौकोर)", mr: "चौरस (चौकोन)" },
        "triangle": { en: "Triangle", hi: "त्रिकोण", mr: "त्रिकोण" },
        "rectangle": { en: "Rectangle", hi: "आयत", mr: "आयत" },
        "star": { en: "Star", hi: "तारा", mr: "चांदणी" },
        "heart": { en: "Heart", hi: "दिल", mr: "हृदय" },
        "oval": { en: "Oval", hi: "अंडाकार", mr: "लंबवर्तुळ" },
        "diamond": { en: "Diamond", hi: "हीरा", mr: "समभुज चौकोन" },
        "pentagon": { en: "Pentagon", hi: "पंचभुज", mr: "पंचकोन" },
        "hexagon": { en: "Hexagon", hi: "षट्भुज", mr: "षटकोन" }
    };

    const shapesList = Object.keys(shapesDict);

    /////////////////////////////////////////////////
    // 4. ELEMENTS & CACHE
    /////////////////////////////////////////////////
    const grid = document.getElementById("shapesGrid");
    const popup = document.getElementById("popup");
    const popupImgShape = document.getElementById("popupImgShape");
    const popupImgObject = document.getElementById("popupImgObject");
    const popupName = document.getElementById("popupName");

    // Preload Images and Sounds
    const imageCacheBasic = {};
    const imageCacheObjects = {};
    const soundCache = {};

    shapesList.forEach(name => {
      const imgBasic = new Image();
      imgBasic.src = `images/shapes/basic/${name}.webp`;
      imageCacheBasic[name] = imgBasic;

      const imgObject = new Image();
      imgObject.src = `images/shapes/objects/${name}.webp`; 
      imageCacheObjects[name] = imgObject;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/shapes/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // 5. BUILD PAGE GRID
    /////////////////////////////////////////////////
    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      shapesList.forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Learn about ${name}`);

        card.innerHTML = `
          <img src="${imageCacheBasic[name].src}" alt="${name}">
          <p>${shapesDict[name][currentLang]}</p>
        `;

        card.onclick = () => showShape(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // 6. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    function showShape(name) {
      if (popupImgShape) popupImgShape.src = imageCacheBasic[name].src;
      if (popupImgObject) popupImgObject.src = imageCacheObjects[name].src;
      if (popupName) popupName.textContent = shapesDict[name][currentLang];
      
      if (popup) {
          popup.classList.remove("hidden");
          popup.style.display = "flex";
      }

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    function closePopup() {
        if (popup) {
            popup.classList.add("hidden");
            popup.style.display = "none";
        }
    }

    // Clicking absolutely ANYWHERE on the popup overlay or card will close it!
    if (popup) {
        popup.onclick = () => {
            closePopup();
        };
    }

    /////////////////////////////////////////////////
    // 7. CONFETTI & CLEANUP
    /////////////////////////////////////////////////
    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    const cleanupSession = () => sessionStorage.removeItem('shapesPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INITIALIZE
    loadPage();
};