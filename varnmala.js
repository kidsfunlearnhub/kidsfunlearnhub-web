"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // uiLang controls the buttons and descriptions
    let uiLang = localStorage.getItem('mySecretLanguage') || 'en';
    
    // contentLang controls the sounds and popup text (defaults to Hindi if English is selected)
    let contentLang = (uiLang === 'en') ? 'hi' : uiLang;

    const uiDictionary = {
        "page-title": { en: "अ Learn Varnamala", hi: "अ वर्णमाला सीखें", mr: "अ वर्णमाला शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "btn-vyanjan": { en: "➡ Show Vyanjan", hi: "➡ व्यंजन देखें", mr: "➡ व्यंजन पहा" },
        "btn-swar": { en: "⬅ Show Swar", hi: "⬅ स्वर देखें", mr: "⬅ स्वर पहा" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "traceBtn": { en: "Varnamala Tracing", hi: "वर्णमाला ट्रेसिंग", mr: "वर्णमाला ट्रेसिंग" },
        "activitiesBtn": { en: "Varnamala Activities", hi: "वर्णमाला गतिविधियां", mr: "वर्णमाला ऍक्टिव्हिटीज" },
        "closePopupBtn": { en: "Close ✖", hi: "बंद करें ✖", mr: "बंद करा ✖" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Varnamala Zone</strong>! Tap on any letter to see it come to life with fun vocabulary images and sounds. Explore both the Swar (vowels) and Vyanjan (consonants) to build a strong foundation in reading and pronunciation.",
            hi: "<strong>KidsFunLearnHub वर्णमाला ज़ोन</strong> में आपका स्वागत है! मज़ेदार शब्दावली छवियों और ध्वनियों के साथ इसे जीवंत होते देखने के लिए किसी भी अक्षर पर टैप करें। पढ़ने और उच्चारण में एक मजबूत नींव बनाने के लिए स्वर और व्यंजन दोनों का अन्वेषण करें।",
            mr: "<strong>KidsFunLearnHub वर्णमाला झोनमध्ये</strong> आपले स्वागत आहे! मजेदार शब्दसंग्रह प्रतिमा आणि आवाजांसह ते जिवंत होताना पाहण्यासाठी कोणत्याही अक्षरावर टॅप करा. वाचन आणि उच्चारणाचा मजबूत पाया तयार करण्यासाठी स्वर आणि व्यंजन दोन्ही एक्सप्लोर करा."
        }
    };

    // 2. SWAR DICTIONARY (Vowels)
    const swarDict = {
        "a": { hi: "अ - अनार", mr: "अ - अननस" },
        "aa": { hi: "आ - आम", mr: "आ - आई" },
        "i": { hi: "इ - इमली", mr: "इ - इमारत" },
        "ee": { hi: "ई - ईख", mr: "ई - इडलिंबू" },
        "u": { hi: "उ - उल्लू", mr: "उ - उखळ" },
        "oo": { hi: "ऊ - ऊन", mr: "ऊ - ऊस" },
        "ri": { hi: "ऋ - ऋषि", mr: "ऋ - ऋषी" },
        "e": { hi: "ए - एड़ी", mr: "ए - एक" },
        "ai": { hi: "ऐ - ऐनक", mr: "ऐ - ऐरण" },
        "o": { hi: "ओ - ओखली", mr: "ओ - ओझेवाला" },
        "au": { hi: "औ - औरत", mr: "औ - औषध" },
        "ang": { hi: "अं - अंगूर", mr: "अं - अंजीर" },
        "aha": { hi: "अः - प्रातः", mr: "अः - स्वतः" }
    };

    // 3. VYANJAN DICTIONARY (Consonants)
    const vyanjanDict = {
        "k": { hi: "क - कबूतर", mr: "क - कमळ" },
        "kh": { hi: "ख - खरगोश", mr: "ख - खडू" },
        "g": { hi: "ग - गमला", mr: "ग - गणपती" },
        "gh": { hi: "घ - घर", mr: "घ - घर" },
        "dn": { hi: "घ - घर", mr: "घ - घर" },
        "ch": { hi: "च - चम्मच", mr: "च - चमचा" },
        "chh": { hi: "छ - छतरी", mr: "छ - छत्री" },
        "j": { hi: "ज - जग", mr: "ज - जहाज" },
        "jh": { hi: "झ - झंडा", mr: "झ - झेंडा" },
        "trh": { hi: "घ - घर", mr: "घ - घर" },
        "t1": { hi: "ट - टमाटर", mr: "ट - टरबूज" }, 
        "th1": { hi: "ठ - ठठेरा", mr: "ठ - ठसा" },
        "d1": { hi: "ड - डमरू", mr: "ड - डबा" },
        "dh1": { hi: "ढ - ढक्कन", mr: "ढ - ढग" },
        "n1": { hi: "ण - बाण", mr: "ण - बाण" },
        "t2": { hi: "त - तरबूज", mr: "त - तलवार" }, 
        "th2": { hi: "थ - थर्मस", mr: "थ - थवा" },
        "d2": { hi: "द - दवात", mr: "द - दप्तर" },
        "dh2": { hi: "ध - धनुष", mr: "ध - धनुष्य" },
        "n2": { hi: "न - नल", mr: "न - नळ" },
        "p": { hi: "प - पतंग", mr: "प - पतंग" },
        "ph": { hi: "फ - फल", mr: "फ - फणस" },
        "b": { hi: "ब - बस", mr: "ब - बदक" },
        "bh": { hi: "भ - भालू", mr: "भ - भटजी" },
        "m": { hi: "म - मछली", mr: "म - मगर" },
        "y": { hi: "य - यज्ञ", mr: "य - यज्ञ" },
        "r": { hi: "र - रथ", mr: "र - रथ" },
        "l": { hi: "ल - लट्टू", mr: "ल - लसूण" },
        "v": { hi: "व - वन", mr: "व - वजन" },
        "sh": { hi: "श - शलगम", mr: "श - शहामृग" },
        "shh": { hi: "ष - षट्कोण", mr: "ष - षटकोन" },
        "s": { hi: "स - सेब", mr: "स - ससा" },
        "h": { hi: "ह - हाथी", mr: "ह - हत्ती" },
        "ksh": { hi: "क्ष - क्षत्रिय", mr: "क्ष - क्षत्रिय" },
        "tr": { hi: "त्र - त्रिशूल", mr: "त्र - त्रिशूळ" },
        "gy": { hi: "ज्ञ - ज्ञानी", mr: "ज्ञ - ज्ञानी" }
    };

    const allLettersDict = { ...swarDict, ...vyanjanDict };

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("varnamalaGrid");
    const popup = document.getElementById("popup");
    const popupImgLetter = document.getElementById("popupImgLetter");
    const popupImgWord = document.getElementById("popupImgWord");
    const popupName = document.getElementById("popupName");
    const toggleBtn = document.getElementById("toggleBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Apply text translations using innerHTML to keep bold tags
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][uiLang];
    }

    let currentMode = "swar"; // Starts with Swar

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE
    /////////////////////////////////////////////////

    const imageCacheLetters = {};
    const imageCacheWords = {};
    const soundCache = {};

    Object.keys(allLettersDict).forEach(name => {
      const imgLetter = new Image();
      imgLetter.src = `images/varnamala/letters/${name}.webp`;
      imageCacheLetters[name] = imgLetter;

      const imgWord = new Image();
      imgWord.src = `images/varnamala/words/${contentLang}/${name}.webp`; 
      imageCacheWords[name] = imgWord;

      const audio = new Audio();
      audio.src = `sounds/${contentLang}/varnamala/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadGrid() {
      if (!grid) return;
      grid.innerHTML = "";
      
      const activeDict = currentMode === "swar" ? swarDict : vyanjanDict;

      Object.keys(activeDict).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        // Main grid shows only the Letter Image
        card.innerHTML = `
          <img src="${imageCacheLetters[name].src}" alt="${name}">
        `;

        card.onclick = () => showLetter(name);
        grid.appendChild(card);
      });

      // Update toggle button text dynamically
      if (currentMode === "swar") {
          toggleBtn.innerHTML = uiDictionary["btn-vyanjan"][uiLang];
      } else {
          toggleBtn.innerHTML = uiDictionary["btn-swar"][uiLang];
      }
    }

    /////////////////////////////////////////////////
    // TOGGLE BUTTON LOGIC
    /////////////////////////////////////////////////

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            currentMode = currentMode === "swar" ? "vyanjan" : "swar";
            loadGrid();
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY (TWO IMAGES)
    /////////////////////////////////////////////////

    function showLetter(name) {
      if (popupImgLetter) popupImgLetter.src = imageCacheLetters[name].src;
      if (popupImgWord) popupImgWord.src = imageCacheWords[name].src;
      if (popupName) popupName.textContent = allLettersDict[name][contentLang]; // Falls back to Hindi if English
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    function closePopup() {
        if (popup) popup.classList.add("hidden");
    }

    if (popup) popup.onclick = closePopup;
    if (closePopupBtn) closePopupBtn.onclick = closePopup;

    /////////////////////////////////////////////////
    // CURSOR LOGIC
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
    // CONFETTI
    /////////////////////////////////////////////////

    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    // INIT
    loadGrid();
};