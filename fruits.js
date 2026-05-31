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
    let currentLang = sessionStorage.getItem('fruitsPageLang') || globalLang;

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
                sessionStorage.setItem('fruitsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🍓 Learn Fruits", hi: "🍓 फल सीखें", mr: "🍓 फळे शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Fruit Activities", hi: "फल गतिविधियां", mr: "फळ ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Fruits", hi: "➡ अगले फल", mr: "➡ पुढील फळे" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Fruit Orchard</strong>! Tap on any fruit card to see a vibrant picture and hear its name. This interactive vocabulary activity helps toddlers recognize healthy foods, improving their memory, early speech skills, and encouraging healthy eating habits.",
            hi: "<strong>KidsFunLearnHub फलों के बाग</strong> में आपका स्वागत है! एक जीवंत तस्वीर देखने और उसका नाम सुनने के लिए किसी भी फल कार्ड पर टैप करें। यह संवादात्मक शब्दावली गतिविधि बच्चों को स्वस्थ खाद्य पदार्थों को पहचानने में मदद करती है, जिससे उनकी याददाश्त, प्रारंभिक भाषण कौशल में सुधार होता है और स्वस्थ खाने की आदतों को बढ़ावा मिलता है।",
            mr: "<strong>KidsFunLearnHub फळबागेत</strong> आपले स्वागत आहे! एक दोलायमान चित्र पाहण्यासाठी आणि त्याचे नाव ऐकण्यासाठी कोणत्याही फळ कार्डवर टॅप करा. ही संवादात्मक शब्दसंग्रह ऍक्टिव्हिटी लहान मुलांना निरोगी अन्न ओळखण्यास मदत करते, त्यांची स्मरणशक्ती, प्रारंभिक भाषण कौशल्ये सुधारते आणि निरोगी खाण्याच्या सवयींना प्रोत्साहन देते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

    const fruitDict = {
        "mango": { en: "Mango", hi: "आम", mr: "आंबा" },
        "banana": { en: "Banana", hi: "केला", mr: "केळे" },
        "apple": { en: "Apple", hi: "सेब", mr: "सफरचंद" },
        "orange": { en: "Orange", hi: "संतरा", mr: "संत्री" },
        "grapes": { en: "Grapes", hi: "अंगूर", mr: "द्राक्षे" },
        "papaya": { en: "Papaya", hi: "पपीता", mr: "पपई" },
        "guava": { en: "Guava", hi: "अमरूद", mr: "पेरू" },
        "pineapple": { en: "Pineapple", hi: "अनानास", mr: "अननस" },
        "pomegranate": { en: "Pomegranate", hi: "अनार", mr: "डाळिंब" },
        "watermelon": { en: "Watermelon", hi: "तरबूज", mr: "कलिंगड" },
        "muskmelon": { en: "Muskmelon", hi: "खरबूजा", mr: "खरबूज" },
        "chikoo": { en: "Chikoo", hi: "चीकू", mr: "चिकू" },
        "custard apple": { en: "Custard Apple", hi: "सीताफल", mr: "सीताफळ" },
        "litchi": { en: "Litchi", hi: "लीची", mr: "लीची" },
        "jackfruit": { en: "Jackfruit", hi: "कटहल", mr: "फणस" },
        "pear": { en: "Pear", hi: "नाशपाती", mr: "पेअर" },
        "plum": { en: "Plum", hi: "आलूबुखारा", mr: "प्लम" },
        "peach": { en: "Peach", hi: "आड़ू", mr: "पीच" },
        "apricot": { en: "Apricot", hi: "खुबानी", mr: "जर्दाळू" },
        "kiwi": { en: "Kiwi", hi: "कीवी", mr: "कीवी" },
        "fig": { en: "Fig", hi: "अंजीर", mr: "अंजीर" },
        "dates": { en: "Dates", hi: "खजूर", mr: "खजूर" },
        "coconut": { en: "Coconut", hi: "नारियल", mr: "नारळ" },
        "jamun": { en: "Jamun", hi: "जामुन", mr: "जांभूळ" },
        "amla": { en: "Amla", hi: "आंवला", mr: "आवळा" },
        "star fruit": { en: "Star Fruit", hi: "कमरख", mr: "स्टार फ्रूट" },
        "dragon fruit": { en: "Dragon Fruit", hi: "ड्रैगन फ्रूट", mr: "ड्रॅगन फ्रूट" },
        "mulberry": { en: "Mulberry", hi: "शहतूत", mr: "तुती" },
        "wood apple": { en: "Wood Apple", hi: "बेल", mr: "कवठ" },
        "tamarind": { en: "Tamarind", hi: "इमली", mr: "चिंच" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const fruits = Object.keys(fruitDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("fruitGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    fruits.forEach(name => {
      const img = new Image();
      img.src = `images/fruits/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/fruits/${name}.mp3`;
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

      fruits.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = fruitDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFruit(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= fruits.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showFruit(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = fruitDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('fruitsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});