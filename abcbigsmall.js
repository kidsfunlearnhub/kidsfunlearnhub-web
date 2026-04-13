document.addEventListener("DOMContentLoaded", () => {
    
    // 1. GLOBAL SETTINGS & CURSOR
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
    }

    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // 2. DICTIONARIES
    const uiDictionary = {
        "page-title": { en: "🔠 Big & Small Letters", hi: "🔠 बड़े और छोटे अक्षर", mr: "🔠 मोठी आणि लहान अक्षरे" },
        "close-hint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" }
    };

    document.getElementById("page-title").innerText = uiDictionary["page-title"][currentLang];
    document.getElementById("close-hint").innerText = uiDictionary["close-hint"][currentLang];

    // 3. ELEMENTS & GRID GENERATION
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
        
        // NEW: Wrapping letters in spans so we can make the Capital letter bigger!
        card.innerHTML = `<span class="grid-big">${letter}</span>&nbsp &nbsp;<span class="grid-small">${letter.toLowerCase()}</span>`;

        // Apply your beautiful random colors
        applyRandomGradient(card);

        // Click Event
        card.addEventListener("click", () => {
            applyFixedColor(card); 
            showPopup(letter);     
        });

        grid.appendChild(card);
    });

    // 4. POPUP LOGIC
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

        // Plays the letter sound (e.g. sounds/en/abc/a.mp3)
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

    // 5. COLOR GENERATOR LOGIC (Kept exactly as you designed it!)
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
            el.style.boxShadow = "";
        }, 400);
    }

    function randomBrightColor() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 85;  
        const lightness = 40;   
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // 6. BACKGROUND MUSIC
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