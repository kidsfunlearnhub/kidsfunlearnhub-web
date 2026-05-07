// The Translation Dictionary
const hubDictionary = {
    "nav-parent": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पालक कोपरा" },
    "main-title": { en: "🎉 Fun Learning for Kids 🎉", hi: "🎉 बच्चों के लिए मजेदार शिक्षा 🎉", mr: "🎉 मुलांसाठी मजेशीर शिक्षण 🎉" },
    "desc-abc": { en: "Learn Alphabets with Images", hi: "चित्रों के साथ अक्षर सीखें", mr: "चित्रांसह मुळाक्षरे शिका" },
    "desc-abc-trace": { en: "Learn Alphabets Tracing", hi: "अक्षर ट्रेसिंग सीखें", mr: "मुळाक्षरे ट्रेसिंग शिका" },
    "bounce-numbers": { en: "1 2 3", hi: "१ २ ३", mr: "१ २ ३" },
    "desc-numbers": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
    
    "bounce-count-numbers": { en: "Count 1 2 3", hi: "गिनती १ २ ३", mr: "मोजणे १ २ ३" },
    "desc-count-numbers": { en: "Learn Numbers Counting", hi: "नंबर गिनती सीखें", mr: "अंक मोजणे शिका" },

    "desc-numbers-trace": { en: "Learn Numbers Tracing", hi: "नंबर ट्रेसिंग सीखें", mr: "अंक ट्रेसिंग शिका" },
    "desc-abc-write": { en: "Learn Alphabets Writing", hi: "अक्षर लिखना सीखें", mr: "मुळाक्षरे लिहायला शिका" },
    
    "desc-hindi": { en: "Learn Hindi Alphabet", hi: "हिंदी वर्णमाला सीखें", mr: "हिंदी मुळाक्षरे शिका" },
    "desc-hindi-trace": { en: "Learn Hindi Alphabet Tracing", hi: "हिंदी अ आ इ ट्रेसिंग सीखें", mr: "हिंदी मुळाक्षरे ट्रेसिंग शिका" },
    "desc-hindi-numbers": { en: "Learn Hindi Numbers", hi: "हिंदी नंबर सीखें", mr: "हिंदी अंक शिका" },
    "desc-hindi-numberstrace": { en: "Learn Hindi Numbers Tracing", hi: "हिंदी नंबर ट्रेसिंग सीखें", mr: "हिंदी अंक ट्रेसिंग शिका" },

    "desc-marathi": { en: "Learn Marathi Alphabet", hi: "मराठी वर्णमाला सीखें", mr: "मराठी मुळाक्षरे शिका" },
    "desc-marathi-trace": { en: "Learn Marathi Alphabet Tracing", hi: "मराठी अ आ इ ट्रेसिंग सीखें", mr: "मराठी मुळाक्षरे ट्रेसिंग शिका" },
    "desc-marathi-numbers": { en: "Learn Marathi Numbers", hi: "मराठी नंबर सीखें", mr: "मराठी अंक शिका" },
    "desc-marathi-numberstrace": { en: "Learn Marathi Numbers Tracing", hi: "मराठी नंबर ट्रेसिंग सीखें", mr: "मराठी अंक ट्रेसिंग शिका" },

    "desc-shapes": { en: "Learn Shapes", hi: "आकार सीखें", mr: "आकार शिका" },
    "desc-shapes-trace": { en: "Learn Shapes Tracing", hi: "आकार ट्रेसिंग सीखें", mr: "आकार ट्रेसिंग शिका" },
    
    "desc-colors": { en: "Learn Colors", hi: "रंग सीखें", mr: "रंग शिका" },
    "desc-body": { en: "Learn Body Parts", hi: "शरीर के अंग सीखें", mr: "शरीराचे अवयव शिका" },
    "desc-animals": { en: "Learn Animals", hi: "जानवरों के नाम सीखें", mr: "प्राण्यांची नावे शिका" },
    "desc-seaanimals": { en: "Learn Shapes", hi: "आकार सीखें", mr: "आकार शिका" },
    "desc-birds": { en: "Learn Birds", hi: "पक्षियों के नाम सीखें", mr: "पक्ष्यांची नावे शिका" },
    "desc-insects": { en: "Learn Insects", hi: "कीड़ों के नाम सीखें", mr: "कीटकांची नावे शिका" },
    "desc-fruits": { en: "Learn Fruits", hi: "फलों के नाम सीखें", mr: "फळांची नावे शिका" },
    "desc-veg": { en: "Learn Vegetables", hi: "सब्जियों के नाम सीखें", mr: "भाज्यांची नावे शिका" },
    "desc-foods": { en: "Learn Food", hi: "भोजन के नाम सीखें", mr: "अन्नाची नावे शिका" },
    "desc-flowers": { en: "Learn Flowers", hi: "फूलों के नाम सीखें", mr: "फुलांची नावे शिका" },
    "desc-vehicles": { en: "Learn Vehicles", hi: "वाहनों के नाम सीखें", mr: "वाहनांची नावे शिका" },
    "desc-game": { en: "Identify correct Animal", hi: "सही जानवर को पहचानें", mr: "योग्य प्राणी ओळखा" },
    "nav-prev": { en: "⬅ Previous", hi: "⬅ पिछला", mr: "⬅ मागील" },
    "nav-next": { en: "Next ➡", hi: "अगला ➡", mr: "पुढील ➡" },
    "nav-home": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 मुख्यपृष्ठ" } // NEW: Home Button Translation
};

window.onload = function() {
    // 1. Language Setup
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    for (let currentId in hubDictionary) {
        let elementToChange = document.getElementById(currentId);
        if (elementToChange) {
            elementToChange.innerText = hubDictionary[currentId][currentLang];
        }
    }

    // 2. Identify all cards
    const container = document.getElementById("cardContainer");
    if (!container) return; // safety check
    
    const allCards = Array.from(container.children);
    
    // 3. Mark cards to be hidden based on language
    // allCards.forEach(card => {
    //     card.classList.remove('hidden-by-lang');
        
    //     const isEnglishAbc = card.classList.contains('abc') || card.classList.contains('abc11') ||card.classList.contains('abctrace') || card.classList.contains('numberstrace');
    //     const isHindiCard = card.classList.contains('varnmala') || card.classList.contains('hinditrace') || card.classList.contains('hindinumbers') || card.classList.contains('hindinumberstrace');
    //     const isMarathiCard = card.classList.contains('varnmala') || card.classList.contains('marathitrace') || card.classList.contains('marathinumbers') || card.classList.contains('marathinumberstrace');

    //     if (currentLang === 'hi') {
    //         if (isEnglishAbc|| isMarathiCard) card.classList.add('hidden-by-lang');
    //     } 
    //     else if (currentLang === 'mr') {
    //         if (isEnglishAbc || isHindiCard) card.classList.add('hidden-by-lang');
    //     }
    //     else { // English
    //         if (isHindiCard || isMarathiCard) card.classList.add('hidden-by-lang');
    //     }
    // });

    allCards.forEach(card => {
    // 1. Reset all cards to visible first
    card.classList.remove('hidden-by-lang');
    
    // 2. Separate them into clean, non-overlapping categories
    const isEnglishOnly = card.classList.contains('abc') || card.classList.contains('abcbigsmall') || card.classList.contains('abctrace') || card.classList.contains('numberstrace');
    
    const isHindiOnly = card.classList.contains('hinditrace') || card.classList.contains('hindinumbers') || card.classList.contains('hindinumberstrace');
    
    const isMarathiOnly = card.classList.contains('marathitrace') || card.classList.contains('marathinumbers') || card.classList.contains('marathinumberstrace');
    
    // 3. Create a shared category for cards that show in both Hindi and Marathi
    const isSharedHiMr = card.classList.contains('varnmala');

    // 4. Apply the hiding logic
    if (currentLang === 'hi') {
        // In Hindi mode: Hide English-only and Marathi-only
        if (isEnglishOnly || isMarathiOnly) {
            card.classList.add('hidden-by-lang');
        }
    } 
    else if (currentLang === 'mr') {
        // In Marathi mode: Hide English-only and Hindi-only
        if (isEnglishOnly || isHindiOnly) {
            card.classList.add('hidden-by-lang');
        }
    }
    else { 
        // In English mode: Hide all Hindi, Marathi, and Shared cards
        if (isHindiOnly || isMarathiOnly || isSharedHiMr) {
            card.classList.add('hidden-by-lang');
        }
    }
});

    // 4. SMART PAGINATION: Only paginate cards that are NOT hidden
    const activeCards = allCards.filter(card => !card.classList.contains('hidden-by-lang'));
    
    // SMART DEVICE CHECK: 5 cards per page on phone, 8 per page on computer!
    const cardsPerPage = window.innerWidth <= 700 ? 5 : 8;
    
    let currentPage = 0;
    const totalPages = Math.ceil(activeCards.length / cardsPerPage);

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    function showPage(page) {
        allCards.forEach(card => card.style.display = "none");

        const start = page * cardsPerPage;
        const end = start + cardsPerPage;

        for (let i = start; i < end && i < activeCards.length; i++) {
            activeCards[i].style.display = "flex";
        }

        if (pageInfo) pageInfo.textContent = `Page ${page + 1} / ${totalPages}`;
        if (prevBtn) prevBtn.disabled = page === 0;
        if (nextBtn) nextBtn.disabled = page >= totalPages - 1;
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                showPage(currentPage);
            }
        });
    }

    // Load first page
    showPage(currentPage);


    // ==========================================
    // EXTRA FEATURES (Cursors, Bubbles, Music)
    // ==========================================
    
    // Click sound effect
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            console.log("Kids clicked a learning card!");
        });
    });

    // Cursor Logic
    const select = document.getElementById("cursorSelect");
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
        if(select) select.value = savedCursor.split("/").pop().replace('"', '');
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

    // Bubbles Logic
    const bubbleContainer = document.getElementById("bubble-container");
    if(bubbleContainer) {
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
        const alphaColors = ["#ffcc80", "#ffab91", "#e6ee9c", "#b2dfdb", "#c5cae9"];
        const numberColors = ["#bbdefb", "#c8e6c9", "#ffcdd2", "#d1c4e9", "#ffe082"];

        function createAlphaBubble() {
            const bubble = document.createElement("div");
            bubble.className = "bubble alpha";
            const letter = alphabets[Math.floor(Math.random() * alphabets.length)];
            bubble.innerText = letter;
            bubble.style.background = alphaColors[Math.floor(Math.random() * alphaColors.length)];
            bubble.style.left = Math.random() * 120 + "px";
            bubble.style.animationDuration = (14 + Math.random() * 6) + "s";
            bubble.onclick = () => popBubble(bubble, `sounds/${letter.toLowerCase()}.mp3`);
            bubbleContainer.appendChild(bubble);
            autoRemove(bubble);
        }

        function createNumberBubble() {
            const bubble = document.createElement("div");
            bubble.className = "bubble number";
            const num = numbers[Math.floor(Math.random() * numbers.length)];
            bubble.innerText = num;
            bubble.style.background = numberColors[Math.floor(Math.random() * numberColors.length)];
            bubble.style.right = Math.random() * 120 + "px";
            bubble.style.animationDuration = (14 + Math.random() * 6) + "s";
            bubble.onclick = () => popBubble(bubble, `sounds/${num}.mp3`);
            bubbleContainer.appendChild(bubble);
            autoRemove(bubble);
        }

        function popBubble(bubble, soundFile) {
            bubble.classList.add("burst");
            new Audio(soundFile).play().catch(() => {});
            setTimeout(() => bubble.remove(), 300);
        }

        function autoRemove(bubble) {
            setTimeout(() => {
                if (bubble.parentNode) bubble.remove();
            }, 18000);
        }

        setInterval(createAlphaBubble, 1800);
        setInterval(createNumberBubble, 2200);
    }
};

// Background Music Logic
let bgMusicStarted = false;
const bgMusic = new Audio("sounds/bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.05; 

document.addEventListener("click", () => {
    if (!bgMusicStarted) {
        bgMusic.play().catch(() => {});
        bgMusicStarted = true;
    }
});