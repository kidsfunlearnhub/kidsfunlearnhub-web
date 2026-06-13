"use strict";

window.onload = function() {
    const themes = [
        { runner: '🦁', target: '🥩' }, 
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐘', target: '🌿' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowAnimalThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('animalsPageLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowAnimalScore')) || 0;
    
    let selectedAnimalCard = null; 
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
        "game-title": { en: "🦁 Animal Shadow Match!", hi: "🦁 जानवर परछाई मिलान!", mr: "🦁 प्राणी सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the animals to their shadows!", hi: "जानवरों को उनकी परछाई से मिलाएँ!", mr: "प्राण्यांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Animal Shadow Match Game | KidsFunLearnHub", hi: "जानवर छाया मिलान खेल | KidsFunLearnHub", mr: "प्राणी सावली जुळवा खेळ | KidsFunLearnHub" }
    };

    const animalDict = {
        "dog": { en: "Dog", hi: "कुत्ता", mr: "कुत्रा" },
        "cat": { en: "Cat", hi: "बिल्ली", mr: "मांजर" },
        "lion": { en: "Lion", hi: "शेर", mr: "सिंह" },
        "tiger": { en: "Tiger", hi: "बाघ", mr: "वाघ" },
        "elephant": { en: "Elephant", hi: "हाथी", mr: "हत्ती" },
        "monkey": { en: "Monkey", hi: "बंदर", mr: "माकड" },
        "cow": { en: "Cow", hi: "गाय", mr: "गाय" },
        "horse": { en: "Horse", hi: "घोड़ा", mr: "घोडा" },
        "goat": { en: "Goat", hi: "बकरी", mr: "शेळी" },
        "bear": { en: "Bear", hi: "भालू", mr: "अस्वल" },
        "zebra": { en: "Zebra", hi: "ज़ेबरा", mr: "झेब्रा" },
        "giraffe": { en: "Giraffe", hi: "जिराफ़", mr: "जिराफ" },
        "rabbit": { en: "Rabbit", hi: "खरगोश", mr: "ससा" },
        "fox": { en: "Fox", hi: "लोमड़ी", mr: "कोल्हा" },
        "deer": { en: "Deer", hi: "हिरण", mr: "हरीण" },
        "camel": { en: "Camel", hi: "ऊंट", mr: "उंट" },
        "wolf": { en: "Wolf", hi: "भेड़िया", mr: "लांडगा" },
        "kangaroo": { en: "Kangaroo", hi: "कंगारू", mr: "कांगारू" },
        "panda": { en: "Panda", hi: "पांडा", mr: "पांडा" },
        "rhino": { en: "Rhino", hi: "गैंडा", mr: "गेंडा" },
        "hippo": { en: "Hippo", hi: "दरियाई घोड़ा", mr: "पाणघोडा" },
        "cheetah": { en: "Cheetah", hi: "चीता", mr: "चित्ता" },
        "buffalo": { en: "Buffalo", hi: "भैंस", mr: "म्हैस" },
        "donkey": { en: "Donkey", hi: "गधा", mr: "गाढव" },
        "pig": { en: "Pig", hi: "सूअर", mr: "डुक्कर" },
        "sheep": { en: "Sheep", hi: "भेड़", mr: "मेंढी" },
        "yak": { en: "Yak", hi: "याक", mr: "याक" },
        "otter": { en: "Otter", hi: "ऊदबिलाव", mr: "पाणमांजर" },
        "squirrel": { en: "Squirrel", hi: "गिलहरी", mr: "खारूताई" },
        "leopard": { en: "Leopard", hi: "तेंदुआ", mr: "बिबट्या" }
    };

    const allAnimals = Object.keys(animalDict);
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
        sessionStorage.setItem('animalsPageLang', lang); 
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

    document.getElementById("promptBox").addEventListener("click", () => {
        window.speechSynthesis.cancel();
        let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang]);
        msg.rate = 0.85; msg.pitch = 1.2;
        window.speechSynthesis.speak(msg);
    });

    function startNewRound() {
        matchesFound = 0;
        currentMatchedPairs = [];
        selectedAnimalCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allAnimals].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(animalKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card"; 
            card.dataset.animal = animalKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + animalDict[animalKey]['en']);
            card.innerHTML = `<img src="images/animals/${animalKey}.webp" alt="${animalDict[animalKey]['en']}">`;
            card.addEventListener("click", () => handleAnimalClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(animalKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = animalKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + animalDict[animalKey]['en'] + " shadow");
            card.innerHTML = `<img src="images/animals/${animalKey}.webp" alt="${animalDict[animalKey]['en']} Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleAnimalClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedAnimalCard) selectedAnimalCard.classList.remove("selected");
        selectedAnimalCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedAnimalCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedAnimalKey = selectedAnimalCard.dataset.animal;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedAnimalKey === targetShadowKey) {
            drawLine(selectedAnimalCard, shadowCard);
            currentMatchedPairs.push({ left: selectedAnimalCard, right: shadowCard });

            selectedAnimalCard.classList.remove("selected");
            selectedAnimalCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/animals/${selectedAnimalKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedAnimalCard = null; 

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
                sessionStorage.setItem('shadowAnimalScore', score);
                sessionStorage.setItem('animalsPageLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowAnimalThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowAnimalScore'); 
        sessionStorage.removeItem('shadowAnimalThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};