window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowFruitThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('shadowFruitLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowFruitScore')) || 0;
    
    let selectedFruitCard = null; 
    let matchesFound = 0; 
    let currentMatchedPairs = []; 
    
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    const MATCHES_PER_ROUND = 3;
    const TOTAL_MATCHES_PER_LEVEL = ROUNDS_BEFORE_RELOAD * MATCHES_PER_ROUND;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function playJumpSound() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }

    const uiDict = {
        "game-title": { en: "🍓 Fruit Shadow Match!", hi: "🍓 फलों की परछाई मिलाओ!", mr: "🍓 फळांची सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the fruits to their shadows!", hi: "फलों को उनकी परछाई से मिलाएँ!", mr: "फळांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Fruit Shadow Match Game | KidsFunLearnHub", hi: "फल छाया मिलान खेल | KidsFunLearnHub", mr: "फळे सावली जुळवा खेळ | KidsFunLearnHub" }
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

    const allFruits = Object.keys(fruitDict);
    document.getElementById("score").innerText = score;

    function initProgressTrack() {
        const dotsContainer = document.getElementById("dots-container");
        dotsContainer.innerHTML = "";
        for(let i = 0; i <= TOTAL_MATCHES_PER_LEVEL; i++) {
            let dot = document.createElement("div");
            dot.className = "path-dot";
            dotsContainer.appendChild(dot);
        }
    }

    function updateProgressTrack(isJumping = false) {
        const runner = document.getElementById("runner-icon");
        const progressLine = document.getElementById("progress-line"); 
        let currentTotalMatches = (roundsPlayedThisSession * MATCHES_PER_ROUND) + matchesFound;
        let percentage = (currentTotalMatches / TOTAL_MATCHES_PER_LEVEL) * 100;
        if (percentage > 100) percentage = 100;
        
        runner.style.left = percentage + "%";
        progressLine.style.width = percentage + "%";

        if (isJumping) {
            playJumpSound();
            runner.classList.remove("jump-animation");
            void runner.offsetWidth; 
            runner.classList.add("jump-animation");
        }
    }

    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('shadowFruitLang', lang); 
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        document.getElementById("feedback-text").innerText = uiDict["correct"][currentLang];
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
        });
    });

    function startNewRound() {
        matchesFound = 0;
        currentMatchedPairs = [];
        selectedFruitCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allFruits].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(fruitKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card"; 
            card.dataset.fruit = fruitKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + fruitDict[fruitKey]['en']);
            card.innerHTML = `<img src="images/fruits/${fruitKey}.webp" alt="${fruitDict[fruitKey]['en']}">`;
            card.addEventListener("click", () => handleFruitClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(fruitKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = fruitKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + fruitDict[fruitKey]['en'] + " shadow");
            card.innerHTML = `<img src="images/fruits/${fruitKey}.webp" alt="${fruitDict[fruitKey]['en']} Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleFruitClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedFruitCard) selectedFruitCard.classList.remove("selected");
        selectedFruitCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedFruitCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedFruitKey = selectedFruitCard.dataset.fruit;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedFruitKey === targetShadowKey) {
            drawLine(selectedFruitCard, shadowCard);
            currentMatchedPairs.push({ left: selectedFruitCard, right: shadowCard });

            selectedFruitCard.classList.remove("selected");
            selectedFruitCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/fruits/${selectedFruitKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedFruitCard = null; 

            if (matchesFound === 3) {
                setTimeout(showRoundComplete, 800);
            }

        } else {
            shadowCard.classList.add("shake");
            let tryAgainAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Audio not found"));
            setTimeout(() => { shadowCard.classList.remove("shake"); }, 500);
        }
    }

    function drawLine(el1, el2) {
        const container = document.getElementById("match-container");
        const svgCanvas = document.getElementById("line-canvas");
        const containerRect = container.getBoundingClientRect();
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        const startX = rect1.right - containerRect.left;
        const startY = rect1.top + (rect1.height / 2) - containerRect.top;
        const endX = rect2.left - containerRect.left;
        const endY = rect2.top + (rect2.height / 2) - containerRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', '#4CAF50'); 
        line.setAttribute('stroke-width', '6');
        line.setAttribute('stroke-linecap', 'round');
        line.style.strokeDasharray = '1000';
        line.style.strokeDashoffset = '1000';
        line.style.transition = 'stroke-dashoffset 0.5s ease-out';
        
        svgCanvas.appendChild(line);
        setTimeout(() => { line.style.strokeDashoffset = '0'; }, 10);
    }

    window.addEventListener("resize", () => {
        document.getElementById("line-canvas").innerHTML = "";
        currentMatchedPairs.forEach(pair => drawLine(pair.left, pair.right));
    });

    function showRoundComplete() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-score").innerText = uiDict["total-score"][currentLang] + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
        }

        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Audio not found"));

        setTimeout(() => {
            feedback.classList.add("hidden");
            roundsPlayedThisSession++; 
            
            if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                sessionStorage.setItem('shadowFruitScore', score);
                sessionStorage.setItem('shadowFruitLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowFruitThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowFruitScore'); 
        sessionStorage.removeItem('shadowFruitThemeIndex'); 
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};