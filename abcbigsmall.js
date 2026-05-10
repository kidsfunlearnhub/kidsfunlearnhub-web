"use strict";

document.addEventListener("DOMContentLoaded", () => {
    
    /////////////////////////////////////////////////
    // 1. GLOBAL SETTINGS & CURSOR
    /////////////////////////////////////////////////
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
    }
    
    // Add event listener to the dropdown so cursor selection updates immediately
    const select = document.getElementById("cursorSelect");
    if(select) {
        if (savedCursor) select.value = savedCursor.split("/").pop().replace(/["')]/g, '').split(' ')[0];
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

    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    /////////////////////////////////////////////////
    // 2. DICTIONARIES & TRANSLATIONS
    /////////////////////////////////////////////////
    const uiDictionary = {
        "page-title": { en: "🔠 Big & Small Letters", hi: "🔠 बड़े और छोटे अक्षर", mr: "🔠 मोठी आणि लहान अक्षरे" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { en: "Learn ABC", hi: "एबीसी (ABC) सीखें", mr: "एबीसी (ABC) शिका" },
        "activitiesBtn": { en: "ABC Activities", hi: "एबीसी गतिविधियां", mr: "एबीसी ऍक्टिव्हिटीज" },
        "close-hint": { en: "Tap anywhere to close ✖", hi: "बंद करने के लिए टैप करें ✖", mr: "बंद करण्यासाठी टॅप करा ✖" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Big & Small Letters Zone</strong>! Tap on any card to meet the Capital letter and its lowercase buddy. This interactive activity helps toddlers recognize letter pairs, an essential step in early reading and writing.",
            hi: "<strong>KidsFunLearnHub बड़े और छोटे अक्षर ज़ोन</strong> में आपका स्वागत है! कैपिटल अक्षर और उसके छोटे साथी से मिलने के लिए किसी भी कार्ड पर टैप करें। यह संवादात्मक गतिविधि बच्चों को अक्षर जोड़े पहचानने में मदद करती है, जो शुरुआती पढ़ने और लिखने में एक आवश्यक कदम है।",
            mr: "<strong>KidsFunLearnHub मोठी आणि लहान अक्षरे झोनमध्ये</strong> आपले स्वागत आहे! कॅपिटल अक्षर आणि त्याच्या लहान मित्राला भेटण्यासाठी कोणत्याही कार्डवर टॅप करा. ही संवादात्मक क्रियाकलाप लहान मुलांना अक्षर जोड्या ओळखण्यास मदत करते, जे लवकर वाचन आणि लेखनातील एक आवश्यक पाऊल आहे."
        }
    };

    // Apply translations using innerHTML to preserve bold tags
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. ELEMENTS & GRID GENERATION
    /////////////////////////////////////////////////
    const grid = document.getElementById("lettersGrid");
    const overlay = document.getElementById("abcOverlay");
    const popupCard = document.getElementById("abcPopupCard");
    const bigLetterDisplay = document.getElementById("bigLetter");
    const smallLetterDisplay = document.getElementById("smallLetter");
    const popupText = document.getElementById("popupText");

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    letters.forEach(letter => {
        const card = document.createElement("div");
        card.className = "letter-card clickable";
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Learn uppercase ${letter} and lowercase ${letter.toLowerCase()}`);
        
        // Wrapping letters in spans so we can make the Capital letter bigger!
        card.innerHTML = `<span class="grid-big">${letter}</span>&nbsp;&nbsp;<span class="grid-small">${letter.toLowerCase()}</span>`;

        // Apply your beautiful random colors
        applyRandomGradient(card);

        // Click Event
        card.addEventListener("click", () => {
            applyFixedColor(card); 
            showPopup(letter);     
        });

        grid.appendChild(card);
    });

    /////////////////////////////////////////////////
    // 4. POPUP LOGIC
    /////////////////////////////////////////////////
    function showPopup(letter) {
        const smallLetter = letter.toLowerCase();

        // Update the big and small letter text
        bigLetterDisplay.innerText = letter;
        smallLetterDisplay.innerText = smallLetter;

        // Dynamic Translation for "Big A, Small a"
        if (currentLang === 'hi') {
            popupText.innerText = `बड़ा ${letter}, छोटा ${smallLetter}`;
        } else if (currentLang === 'mr') {
            popupText.innerText = `मोठा ${letter}, छोटा ${smallLetter}`;
        } else {
            popupText.innerText = `Big ${letter}, Small ${smallLetter}`;
        }

        // Re-trigger the cute jump animation for the small letter
        smallLetterDisplay.style.animation = 'none';
        smallLetterDisplay.offsetHeight; 
        smallLetterDisplay.style.animation = 'buddyJump 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

        overlay.style.display = "flex";

        // Plays the letter sound (Ensure your files are named correctly, e.g., Aa.mp3)
        const audio = new Audio(`sounds/${currentLang}/abc big-small/${letter}${smallLetter}.mp3`);
        audio.play().catch(e => console.log("Sound not found:", e));

        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
    }

    // Close Popup Logic
    function closeOverlay() {
        overlay.style.display = "none";
    }
    overlay.onclick = closeOverlay;
    popupCard.onclick = (e) => {
        closeOverlay();
        e.stopPropagation(); 
    };

    /////////////////////////////////////////////////
    // 5. COLOR GENERATOR LOGIC (Original Design)
    /////////////////////////////////////////////////
    function applyRandomGradient(el) {
        const color1 = randomBrightColor();
        const color2 = randomBrightColor();
        el.style.background = `linear-gradient(135deg, ${color1}, ${color2})`;
        el.style.color = "#fff";
    }

    function applyFixedColor(el) {
        el.style.background = "#2e2a2a";
        el.style.color = "#fff";
        el.style.boxShadow = "0 0 25px rgba(233, 33, 169, 0.85)";
        setTimeout(() => {
            el.style.boxShadow = "0 8px 15px rgba(0, 0, 0, 0.1)"; // Returns to safe normal shadow
        }, 400);
    }

    function randomBrightColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 85;  
        const lightness = 40;   
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    /////////////////////////////////////////////////
    // 6. BACKGROUND MUSIC
    /////////////////////////////////////////////////
    let bgMusicStarted = false;
    const bgMusic = new Audio("sounds/bg-music.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.05; 

    document.addEventListener("click", () => {
        if (!bgMusicStarted) {
            bgMusic.play().catch(() => {});
            bgMusicStarted = true;
        }
    }, { once: true }); 

});