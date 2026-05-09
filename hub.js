"use strict";

// The Translation Dictionary
const hubDictionary = {
    "nav-parent": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पालक कोपरा" },
    "main-title": { en: "🎉 Fun Learning for Kids 🎉", hi: "🎉 बच्चों के लिए मजेदार शिक्षा 🎉", mr: "🎉 मुलांसाठी मजेशीर शिक्षण 🎉" },
    "desc-abc": { en: "Learn Alphabets", hi: "अक्षर सीखें", mr: "मुळाक्षरे शिका" },
    "desc-abc-trace": { en: "Alphabet Tracing", hi: "अक्षर ट्रेसिंग", mr: "मुळाक्षरे ट्रेसिंग" },
    "bounce-numbers": { en: "1 2 3", hi: "१ २ ३", mr: "१ २ ३" },
    "desc-numbers": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
    "bounce-count-numbers": { en: "Count 1 2 3", hi: "गिनती १ २ ३", mr: "मोजणे १ २ ३" },
    "desc-count-numbers": { en: "Learn Counting", hi: "गिनती सीखें", mr: "मोजणे शिका" },
    "desc-numbers-trace": { en: "Numbers Tracing", hi: "नंबर ट्रेसिंग", mr: "अंक ट्रेसिंग" },
    "desc-varnmala": { en: "Learn Hindi Alphabet", hi: "हिंदी वर्णमाला सीखें", mr: "मराठी मुळाक्षरे शिका" },
    "desc-hindi-trace": { en: "Hindi Tracing", hi: "हिंदी ट्रेसिंग", mr: "हिंदी ट्रेसिंग" },
    "desc-hindi-numberstrace": { en: "Hindi Numbers Tracing", hi: "हिंदी नंबर ट्रेसिंग", mr: "हिंदी अंक ट्रेसिंग" },
    "desc-marathi-numberstrace": { en: "Marathi Numbers Tracing", hi: "मराठी नंबर ट्रेसिंग", mr: "मराठी अंक ट्रेसिंग" },
    "desc-shapes": { en: "Learn Shapes", hi: "आकार सीखें", mr: "आकार शिका" },
    "desc-shapes-trace": { en: "Learn Shapes Tracing", hi: "आकार ट्रेसिंग सीखें", mr: "आकार ट्रेसिंग शिका" },
    "desc-colors": { en: "Learn Colors", hi: "रंग सीखें", mr: "रंग शिका" },
    "desc-body": { en: "Learn Body Parts", hi: "शरीर के अंग सीखें", mr: "शरीराचे अवयव शिका" },
    "desc-animals": { en: "Learn Animals", hi: "जानवरों के नाम सीखें", mr: "प्राण्यांची नावे शिका" },
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
    "nav-home": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 मुख्यपृष्ठ" } 
};

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Language Setup ---
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    for (let currentId in hubDictionary) {
        let elementToChange = document.getElementById(currentId);
        if (elementToChange) {
            elementToChange.innerText = hubDictionary[currentId][currentLang];
        }
    }

    // --- 2. Card Filtering & Pagination Logic ---
    const container = document.getElementById("cardContainer");
    if (!container) return; 
    
    const allCards = Array.from(container.children);

    allCards.forEach(card => {
        card.classList.remove('hidden-by-lang');
        
        const isEnglishOnly = card.classList.contains('abc') || card.classList.contains('abcbigsmall') || card.classList.contains('abctrace') || card.classList.contains('numberstrace');
        const isHindiOnly = card.classList.contains('hinditrace') || card.classList.contains('hindinumberstrace');
        const isMarathiOnly = card.classList.contains('marathinumberstrace');
        const isSharedHiMr = card.classList.contains('varnmala');

        if (currentLang === 'hi') {
            if (isEnglishOnly || isMarathiOnly) card.classList.add('hidden-by-lang');
        } 
        else if (currentLang === 'mr') {
            if (isEnglishOnly || isHindiOnly) card.classList.add('hidden-by-lang');
        }
        else { 
            if (isHindiOnly || isMarathiOnly || isSharedHiMr) card.classList.add('hidden-by-lang');
        }
    });

    const activeCards = allCards.filter(card => !card.classList.contains('hidden-by-lang'));
    const cardsPerPage = window.innerWidth <= 700 ? 5 : 9; // Show 9 per page on desktop (3x3 grid)
    
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

    // --- ADDED SCROLL BEHAVIOR HERE ---
    if (prevBtn) {
        prevBtn.addEventListener("click", () => { 
            if (currentPage > 0) { 
                currentPage--; 
                showPage(currentPage); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls to top
            } 
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", () => { 
            if (currentPage < totalPages - 1) { 
                currentPage++; 
                showPage(currentPage); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls to top
            } 
        });
    }

    // Initial Load
    showPage(currentPage);

    // --- 3. Dynamic Random Gradients (18 Vibrant Colors!) ---
    const vividGradients = [
        "linear-gradient(135deg, #ff5252 0%, #ff7a7a 100%)",
        "linear-gradient(135deg, #9452ff 0%, #b080ff 100%)",
        "linear-gradient(135deg, #ea33ad 0%, #ff66cc 100%)",
        "linear-gradient(135deg, #1acf6b 0%, #4ae58b 100%)",
        "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
        "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)",
        "linear-gradient(135deg, #f6d365 0%, #f5653e 100%)",
        "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
        "linear-gradient(135deg, #b224ef 0%, #7579ff 100%)",
        "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "linear-gradient(135deg, #f43b47 0%, #453a94 100%)",
        "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
        "linear-gradient(135deg, #ea647a 0%, #fc3588 100%)",
        "linear-gradient(135deg, #64b5f6 0%, #2196f3 100%)",
        "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
        "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
        "linear-gradient(135deg, #f83e44 0%, #fecfef 100%)"
    ];

    let availableGradients = [...vividGradients];

    // Apply colors only to active cards to ensure variety on the current page
    allCards.forEach(card => {
        // Skip the parent card so it keeps its dashed outline
        if(!card.classList.contains('parent-card')) {
            if (availableGradients.length === 0) availableGradients = [...vividGradients];
            const randomIndex = Math.floor(Math.random() * availableGradients.length);
            card.style.background = availableGradients[randomIndex];
            availableGradients.splice(randomIndex, 1);
        }
    });

    // --- 4. Extra Features ---
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => console.log("Learning card clicked!"));
    });

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

    // Background Bubbles
    const bubbleContainer = document.getElementById("bubble-container");
    if(bubbleContainer) {
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
        const alphaColors = ["#ffcc80", "#ffab91", "#e6ee9c", "#b2dfdb", "#c5cae9"];
        const numberColors = ["#bbdefb", "#c8e6c9", "#ffcdd2", "#d1c4e9", "#ffe082"];

        const createBubble = (type, dataArray, colorArray, posProp) => {
            const bubble = document.createElement("div");
            bubble.className = `bubble ${type}`;
            const item = dataArray[Math.floor(Math.random() * dataArray.length)];
            bubble.innerText = item;
            bubble.style.background = colorArray[Math.floor(Math.random() * colorArray.length)];
            bubble.style[posProp] = Math.random() * 15 + "%";
            bubble.style.animationDuration = (12 + Math.random() * 8) + "s";
            bubbleContainer.appendChild(bubble);
            setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 20000);
        };

        setInterval(() => createBubble("alpha", alphabets, alphaColors, "left"), 1800);
        setInterval(() => createBubble("number", numbers, numberColors, "right"), 2200);
    }
});

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
}, { once: true });