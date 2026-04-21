window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowVegetableThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('shadowVegetableLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowVegetableScore')) || 0;
    
    let selectedVegetableCard = null; 
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
        "game-title": { en: "🫛 Vegetable Shadow Match!", hi: "🫛 सब्जियों की परछाई मिलाओ!", mr: "🫛 भाज्यांची सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the vegetables to their shadows!", hi: "सब्जियों को उनकी परछाई से मिलाएँ!", mr: "भाज्यांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Vegetable Shadow Match Game | KidsFunLearnHub", hi: "सब्जी छाया मिलान खेल | KidsFunLearnHub", mr: "भाजी सावली जुळवा खेळ | KidsFunLearnHub" }
    };

    const vegetableDict = {
        "potato": { en: "Potato", hi: "आलू", mr: "बटाटा" },
        "tomato": { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
        "onion": { en: "Onion", hi: "प्याज", mr: "कांदा" },
        "carrot": { en: "Carrot", hi: "गाजर", mr: "गाजर" },
        "brinjal": { en: "Brinjal", hi: "बैंगन", mr: "वांगी" },
        "cabbage": { en: "Cabbage", hi: "पत्ता गोभी", mr: "कोबी" },
        "cauliflower": { en: "Cauliflower", hi: "फूल गोभी", mr: "फ्लॉवर" },
        "peas": { en: "Peas", hi: "मटर", mr: "वाटाणा" },
        "spinach": { en: "Spinach", hi: "पालक", mr: "पालक" },
        "okra": { en: "Okra", hi: "भिंडी", mr: "भेंडी" },
        "bottle gourd": { en: "Bottle Gourd", hi: "लौकी", mr: "दुधी भोपळा" },
        "ridge gourd": { en: "Ridge Gourd", hi: "तोरई", mr: "दोडका" },
        "bitter gourd": { en: "Bitter Gourd", hi: "करेला", mr: "कारले" },
        "pumpkin": { en: "Pumpkin", hi: "कद्दू", mr: "भोपळा" },
        "radish": { en: "Radish", hi: "मूली", mr: "मुळा" },
        "beetroot": { en: "Beetroot", hi: "चुकंदर", mr: "बीटरूट" },
        "capsicum": { en: "Capsicum", hi: "शिमला मिर्च", mr: "ढोबळी मिरची" },
        "cucumber": { en: "Cucumber", hi: "खीरा", mr: "काकडी" },
        "beans": { en: "Beans", hi: "बीन्स", mr: "फरसबी" },
        "turnip": { en: "Turnip", hi: "शलजम", mr: "सलगम" },
        "drumstick": { en: "Drumstick", hi: "सहजन", mr: "शेवगा" },
        "ivy gourd": { en: "Ivy Gourd", hi: "कुंदरू", mr: "तोंडली" },
        "cluster beans": { en: "Cluster Beans", hi: "ग्वार फली", mr: "गवार" },
        "fenugreek": { en: "Fenugreek", hi: "मेथी", mr: "मेथी" },
        "mustard greens": { en: "Mustard Greens", hi: "सरसों का साग", mr: "मोहरीची पाने" },
        "colocasia": { en: "Colocasia", hi: "अरबी", mr: "अळू" },
        "ash gourd": { en: "Ash Gourd", hi: "पेठा", mr: "कोहळा" },
        "snake gourd": { en: "Snake Gourd", hi: "चिचिंडा", mr: "पडवळ" },
        "raw banana": { en: "Raw Banana", hi: "कच्चा केला", mr: "कच्ची केळी" },
        "sweet potato": { en: "Sweet Potato", hi: "शकरकंद", mr: "रताळे" }
    };

    const allVegetables = Object.keys(vegetableDict);
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
        sessionStorage.setItem('shadowVegetableLang', lang); 
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
        selectedVegetableCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allVegetables].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(vegKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card"; // Generic class applied for styling
            card.dataset.vegetable = vegKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + vegetableDict[vegKey]['en']);
            card.innerHTML = `<img src="images/vegetables/${vegKey}.webp" alt="${vegetableDict[vegKey]['en']}">`;
            card.addEventListener("click", () => handleVegetableClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(vegKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = vegKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + vegetableDict[vegKey]['en'] + " shadow");
            card.innerHTML = `<img src="images/vegetables/${vegKey}.webp" alt="${vegetableDict[vegKey]['en']} Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleVegetableClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedVegetableCard) selectedVegetableCard.classList.remove("selected");
        selectedVegetableCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedVegetableCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedVegetableKey = selectedVegetableCard.dataset.vegetable;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedVegetableKey === targetShadowKey) {
            drawLine(selectedVegetableCard, shadowCard);
            currentMatchedPairs.push({ left: selectedVegetableCard, right: shadowCard });

            selectedVegetableCard.classList.remove("selected");
            selectedVegetableCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/vegetables/${selectedVegetableKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedVegetableCard = null; 

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
                sessionStorage.setItem('shadowVegetableScore', score);
                sessionStorage.setItem('shadowVegetableLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowVegetableThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowVegetableScore'); 
        sessionStorage.removeItem('shadowVegetableThemeIndex'); 
        window.location.href = "index.html"; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};