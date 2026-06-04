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
    let currentLang = sessionStorage.getItem('colorsPageLang') || globalLang;

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
                sessionStorage.setItem('colorsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🌈 Learn Colours", hi: "🌈 रंग सीखें", mr: "🌈 रंग शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Colour Activities", hi: "रंग गतिविधियां", mr: "रंग ऍक्टिव्हिटीज" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "primary": { en: "Primary Colors", hi: "प्राथमिक रंग", mr: "प्राथमिक रंग" },
        "secondary": { en: "Secondary Colors", hi: "द्वितीयक रंग", mr: "दुय्यम रंग" },
        "neutral": { en: "Neutral Colors", hi: "तटस्थ रंग", mr: "तटस्थ रंग" },
        "advanced": { en: "Advanced Shades", hi: "उन्नत रंग", mr: "प्रगत छटा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Colour Studio</strong>! Tap on any colour card to see a vibrant object matching that colour and hear its name. This visual activity helps toddlers grasp early categorisation concepts and visual identification.",
            hi: "<strong>KidsFunLearnHub कलर स्टूडियो</strong> में आपका स्वागत है! उस रंग से मेल खाने वाली एक जीवंत वस्तु को देखने और उसका नाम सुनने के लिए किसी भी रंग कार्ड पर टैप करें। यह दृश्य गतिविधि बच्चों को प्रारंभिक वर्गीकरण अवधारणाओं और दृश्य पहचान को समझने में मदद करती है।",
            mr: "<strong>KidsFunLearnHub कलर स्टुडिओमध्ये</strong> आपले स्वागत आहे! त्या रंगाशी जुळणारी एक दोलायमान वस्तू पाहण्यासाठी आणि तिचे नाव ऐकण्यासाठी कोणत्याही रंग कार्डवर टॅप करा. ही दृश्य ऍक्टिव्हिटी लहान मुलांना प्रारंभिक वर्गीकरण संकल्पना आणि दृश्य ओळख समजून घेण्यास मदत करते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

    const colorData = {
        primary: [
            { id: "red", hex: "#e74c3c", obj: "red.webp", en: "Red", hi: "लाल", mr: "लाल" },
            { id: "blue", hex: "#3498db", obj: "blue.webp", en: "Blue", hi: "नीला", mr: "निळा" },
            { id: "yellow", hex: "#f1c40f", obj: "yellow.webp", en: "Yellow", hi: "पीला", mr: "पिवळा" }
        ],
        secondary: [
            { id: "green", hex: "#2ecc71", obj: "green.webp", en: "Green", hi: "हरा", mr: "हिरवा" },
            { id: "orange", hex: "#e67e22", obj: "orange.webp", en: "Orange", hi: "नारंगी", mr: "केशरी" },
            { id: "purple", hex: "#9b59b6", obj: "purple.webp", en: "Purple", hi: "बैंगनी", mr: "जांभळा" }
        ],
        neutral: [
            { id: "black", hex: "#000000", obj: "black.webp", en: "Black", hi: "काला", mr: "काळा" },
            { id: "white", hex: "#ffffff", obj: "white.webp", en: "White", hi: "सफ़ेद", mr: "पांढरा" },
            { id: "grey", hex: "#95a5a6", obj: "grey.webp", en: "Grey", hi: "स्लेटी", mr: "राखाडी" },
            { id: "brown", hex: "#8b4513", obj: "brown.webp", en: "Brown", hi: "भूरा", mr: "तपकिरी" }
        ],
        advanced: [
            { id: "teal", hex: "#008080", obj: "teal.webp", en: "Teal", hi: "टील", mr: "टील" },
            { id: "magenta", hex: "#ff00ff", obj: "magenta.webp", en: "Magenta", hi: "मैजेंटा", mr: "मॅजेंटा" },
            { id: "lavender", hex: "#e6e6fa", obj: "lavender.webp", en: "Lavender", hi: "लैवेंडर", mr: "लव्हेंडर" },
            { id: "maroon", hex: "#800000", obj: "maroon.webp", en: "Maroon", hi: "मैरून", mr: "मरून" },
            { id: "turquoise", hex: "#40e0d0", obj: "turquoise.webp", en: "Turquoise", hi: "फिरोज़ा", mr: "फिरोजी" }
        ]
    };

    // Translate Static UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el && !["primary", "secondary", "neutral", "advanced"].includes(id)) {
            el.innerHTML = uiDictionary[id][currentLang];
        }
    }

    /////////////////////////////////////////////////
    // 3. PRELOAD CACHING
    /////////////////////////////////////////////////
    const imageCache = {};

    Object.values(colorData).flat().forEach(item => {
        const img = new Image();
        img.src = `images/colours/${item.obj}`;
        imageCache[item.id] = img;
    });

    /////////////////////////////////////////////////
    // 4. BUILD PAGE SECTIONS
    /////////////////////////////////////////////////
    function renderPage() {
        const main = document.getElementById("mainContent");
        main.innerHTML = "";

        for (let section in colorData) {
            const title = document.createElement("h2");
            title.className = "section-title";
            title.innerText = uiDictionary[section][currentLang];
            main.appendChild(title);

            const grid = document.createElement("div");
            grid.className = "color-grid";

            colorData[section].forEach(item => {
                const card = document.createElement("div");
                card.className = "card";
                card.setAttribute("role", "button");
                card.innerHTML = `
                    <div class="swatch-circle" style="background:${item.hex}"></div>
                    <p>${item[currentLang]}</p>
                `;
                card.onclick = () => showPopup(item);
                grid.appendChild(card);
            });
            main.appendChild(grid);
        }
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;
    const popup = document.getElementById("popup");

    function showPopup(item) {
        document.getElementById("popupColorBox").style.background = item.hex;
        document.getElementById("popupObjImg").src = imageCache[item.id].src;
        document.getElementById("popupName").innerText = item[currentLang];
        
        popup.classList.remove("hidden");
        popup.style.display = "flex";

        if (activeAudio) {
            activeAudio.pause();
            activeAudio.currentTime = 0;
        }

        activeAudio = new Audio(`sounds/${currentLang}/colours/${item.id}.mp3`);
        activeAudio.play().catch(e => console.log("Sound file missing at: ", e.target.src));

        if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
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
    // 6. CLEANUP LOGIC ON EXIT
    /////////////////////////////////////////////////
    const cleanupSession = () => sessionStorage.removeItem('colorsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // Run the render immediately
    renderPage();
});