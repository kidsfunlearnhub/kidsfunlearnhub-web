window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowInsectThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('shadowInsectLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowInsectScore')) || 0;
    
    let selectedInsectCard = null; 
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
        "game-title": { en: "🪰 Insect Shadow Match!", hi: "🪰 कीड़े की परछाई मिलाओ!", mr: "🪰 कीटकांची सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the insects to their shadows!", hi: "कीड़ों को उनकी परछाई से मिलाएँ!", mr: "कीटकांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Insect Shadow Match Game | KidsFunLearnHub", hi: "कीड़े छाया मिलान खेल | KidsFunLearnHub", mr: "कीटक सावली जुळवा खेळ | KidsFunLearnHub" }
    };

    const insectDict = {
        "ant": { en: "Ant", hi: "चींटी", mr: "मुंगी" },
        "bee": { en: "Bee", hi: "मधुमक्खी", mr: "मधमाशी" },
        "butterfly": { en: "Butterfly", hi: "तितली", mr: "फुलपाखरू" },
        "mosquito": { en: "Mosquito", hi: "मच्छर", mr: "डास" },
        "housefly": { en: "Housefly", hi: "मक्खी", mr: "माशी" },
        "dragonfly": { en: "Dragonfly", hi: "ड्रैगनफ्लाई", mr: "चतुर" },
        "grasshopper": { en: "Grasshopper", hi: "टिड्डा", mr: "नाकतोडा" },
        "cricket": { en: "Cricket", hi: "झींगुर", mr: "रातकिडा" },
        "ladybug": { en: "Ladybug", hi: "लेडीबग", mr: "सोनकिडा" },
        "termite": { en: "Termite", hi: "दीमक", mr: "वाळवी" },
        "beetle": { en: "Beetle", hi: "भृंग", mr: "भुंगा" },
        "moth": { en: "Moth", hi: "पतंगा", mr: "पतंग" },
        "firefly": { en: "Firefly", hi: "जुगनू", mr: "काजवा" },
        "wasp": { en: "Wasp", hi: "ततैया", mr: "गांधीलमाशी" },
        "hornet": { en: "Hornet", hi: "हॉर्नेट", mr: "मोठी गांधीलमाशी" },
        "weevil": { en: "Weevil", hi: "घुन", mr: "सोंड्या कीटक" },
        "aphid": { en: "Aphid", hi: "माहू", mr: "मावा" },
        "caterpillar": { en: "Caterpillar", hi: "इल्ली", mr: "सुरवंट" },
        "leafhopper": { en: "Leafhopper", hi: "फुदका", mr: "तुडतुडे" },
        "planthopper": { en: "Planthopper", hi: "प्लांटहॉपर", mr: "प्लांटहॉपर" },
        "mantis": { en: "Mantis", hi: "मैंटिस", mr: "मँटिस" },
        "stick insect": { en: "Stick Insect", hi: "लकड़ी कीड़ा", mr: "काडीकिडा" },
        "water strider": { en: "Water Strider", hi: "वाटर स्ट्राइडर", mr: "पाणकिडा" },
        "dung beetle": { en: "Dung Beetle", hi: "गोबरैला", mr: "शेणकिडा" },
        "carpenter ant": { en: "Carpenter Ant", hi: "बढ़ई चींटी", mr: "सुतार मुंगी" },
        "red ant": { en: "Red Ant", hi: "लाल चींटी", mr: "लाल मुंगी" },
        "silkworm": { en: "Silkworm", hi: "रेशम का कीड़ा", mr: "रेशीम कीटक" },
        "lacewing": { en: "Lacewing", hi: "लेसविंग", mr: "लेसविंग" },
        "bumblebee": { en: "Bumblebee", hi: "भौंरा", mr: "बंबलबी" },
        "fruit fly": { en: "Fruit Fly", hi: "फल मक्खी", mr: "फळमाशी" }
    };

    const allInsects = Object.keys(insectDict);
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
        sessionStorage.setItem('shadowInsectLang', lang); 
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
        selectedInsectCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allInsects].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(insectKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card"; 
            card.dataset.insect = insectKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + insectDict[insectKey]['en']);
            card.innerHTML = `<img src="images/insects/${insectKey}.webp" alt="${insectDict[insectKey]['en']}">`;
            card.addEventListener("click", () => handleInsectClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(insectKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = insectKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + insectDict[insectKey]['en'] + " shadow");
            card.innerHTML = `<img src="images/insects/${insectKey}.webp" alt="${insectDict[insectKey]['en']} Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleInsectClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedInsectCard) selectedInsectCard.classList.remove("selected");
        selectedInsectCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedInsectCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedInsectKey = selectedInsectCard.dataset.insect;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedInsectKey === targetShadowKey) {
            drawLine(selectedInsectCard, shadowCard);
            currentMatchedPairs.push({ left: selectedInsectCard, right: shadowCard });

            selectedInsectCard.classList.remove("selected");
            selectedInsectCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/insects/${selectedInsectKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedInsectCard = null; 

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
                sessionStorage.setItem('shadowInsectScore', score);
                sessionStorage.setItem('shadowInsectLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowInsectThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowInsectScore'); 
        sessionStorage.removeItem('shadowInsectThemeIndex'); 
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};