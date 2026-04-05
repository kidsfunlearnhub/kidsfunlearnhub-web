// The Translation Dictionary
const hubDictionary = {
    "nav-parent": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पालक कोपरा" },
    "main-title": { en: "🎉 Fun Learning for Kids 🎉", hi: "🎉 बच्चों के लिए मजेदार शिक्षा 🎉", mr: "🎉 मुलांसाठी मजेशीर शिक्षण 🎉" },
    "desc-abc-img": { en: "Learn Alphabets with Images", hi: "चित्रों के साथ अक्षर सीखें", mr: "चित्रांसह मुळाक्षरे शिका" },
    "desc-abc": { en: "Learn Alphabets", hi: "अक्षर सीखें", mr: "मुळाक्षरे शिका" },
    "desc-abc-write": { en: "Learn Alphabets Writing", hi: "अक्षर लिखना सीखें", mr: "मुळाक्षरे लिहायला शिका" },
    "desc-numbers": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
    "desc-body": { en: "Learn Body Parts", hi: "शरीर के अंग सीखें", mr: "शरीराचे अवयव शिका" },
    "desc-hindi": { en: "Learn Hindi Alphabet", hi: "हिंदी वर्णमाला सीखें", mr: "हिंदी मुळाक्षरे शिका" },
    "desc-shapes": { en: "Learn Shapes", hi: "आकार सीखें", mr: "आकार शिका" },
    "desc-animals": { en: "Learn Animals", hi: "जानवरों के नाम सीखें", mr: "प्राण्यांची नावे शिका" },
    "desc-insects": { en: "Learn Insects", hi: "कीड़ों के नाम सीखें", mr: "कीटकांची नावे शिका" },
    "desc-flowers": { en: "Learn Flowers", hi: "फूलों के नाम सीखें", mr: "फुलांची नावे शिका" },
    "desc-birds": { en: "Learn Birds", hi: "पक्षियों के नाम सीखें", mr: "पक्ष्यांची नावे शिका" },
    "desc-veg": { en: "Learn Vegetables", hi: "सब्जियों के नाम सीखें", mr: "भाज्यांची नावे शिका" },
    "desc-vehicles": { en: "Learn Vehicles", hi: "वाहनों के नाम सीखें", mr: "वाहनांची नावे शिका" },
    "desc-fruits": { en: "Learn Fruits", hi: "फलों के नाम सीखें", mr: "फळांची नावे शिका" },
    "desc-foods": { en: "Learn Food", hi: "भोजन के नाम सीखें", mr: "अन्नाची नावे शिका" },
    "desc-game": { en: "Identify correct Animal", hi: "सही जानवर को पहचानें", mr: "योग्य प्राणी ओळखा" },
    "nav-prev": { en: "⬅ Previous", hi: "⬅ पिछला", mr: "⬅ मागील" },
    "nav-next": { en: "Next ➡", hi: "अगला ➡", mr: "पुढील ➡" }
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
    allCards.forEach(card => {
        // Reset custom hide class
        card.classList.remove('hidden-by-lang');
        
        const isEnglishAbc = card.classList.contains('abcwithimage') || card.classList.contains('abc') || card.classList.contains('abcdraw');
        const isHindiCard = card.classList.contains('hindi');

        if (currentLang === 'hi') {
            if (isEnglishAbc) card.classList.add('hidden-by-lang');
        } 
        else if (currentLang === 'mr') {
            if (isEnglishAbc || isHindiCard) card.classList.add('hidden-by-lang');
        }
        else { // English
            if (isHindiCard) card.classList.add('hidden-by-lang');
        }
    });

    // 4. SMART PAGINATION: Only paginate cards that are NOT hidden
    const activeCards = allCards.filter(card => !card.classList.contains('hidden-by-lang'));
    
    // Set 8 cards per page as requested
    const cardsPerPage = 8;
    let currentPage = 0;
    const totalPages = Math.ceil(activeCards.length / cardsPerPage);

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    function showPage(page) {
        // First, firmly hide ALL cards
        allCards.forEach(card => card.style.display = "none");

        // Calculate limits for the ACTIVE array
        const start = page * cardsPerPage;
        const end = start + cardsPerPage;

        // Display only the active cards for this specific page
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