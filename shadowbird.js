window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowBirdThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('shadowBirdLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowBirdScore')) || 0;
    
    let selectedBirdCard = null; 
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
        "game-title": { en: "🦚 Bird Shadow Match!", hi: "🦚 पक्षी परछाई मिलाओ!", mr: "🦚 पक्षी सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the birds to their shadows!", hi: "पक्षियों को उनकी परछाई से मिलाएँ!", mr: "पक्ष्यांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Bird Shadow Match Game | KidsFunLearnHub", hi: "पक्षी छाया मिलान खेल | KidsFunLearnHub", mr: "पक्षी सावली जुळवा खेळ | KidsFunLearnHub" }
    };

    const birdDict = {
        "peacock": { en: "Peacock", hi: "मोर", mr: "मोर" },
        "sparrow": { en: "Sparrow", hi: "गौरैया", mr: "चिमणी" },
        "crow": { en: "Crow", hi: "कौवा", mr: "कावळा" },
        "parrot": { en: "Parrot", hi: "तोता", mr: "पोपट" },
        "pigeon": { en: "Pigeon", hi: "कबूतर", mr: "कबूतर" },
        "myna": { en: "Myna", hi: "मैना", mr: "मैना" },
        "kingfisher": { en: "Kingfisher", hi: "किंगफिशर", mr: "खंड्या" },
        "bulbul": { en: "Bulbul", hi: "बुलबुल", mr: "बुलबुल" },
        "koel": { en: "Koel", hi: "कोयल", mr: "कोकिळा" },
        "eagle": { en: "Eagle", hi: "गरुड़", mr: "गरुड" },
        "owl": { en: "Owl", hi: "उल्लू", mr: "घुबड" },
        "vulture": { en: "Vulture", hi: "गिद्ध", mr: "गिधाड" },
        "crane": { en: "Crane", hi: "सारस", mr: "क्रौंच" },
        "heron": { en: "Heron", hi: "बगुला", mr: "बगळा" },
        "stork": { en: "Stork", hi: "स्टॉर्क", mr: "करकोचा" },
        "duck": { en: "Duck", hi: "बत्तख", mr: "बदक" },
        "goose": { en: "Goose", hi: "हंस", mr: "हंस" },
        "quail": { en: "Quail", hi: "बटेर", mr: "लावा" },
        "lapwing": { en: "Lapwing", hi: "टिटहरी", mr: "टिटवी" },
        "woodpecker": { en: "Woodpecker", hi: "कठफोड़वा", mr: "सुतारपक्षी" },
        "sunbird": { en: "Sunbird", hi: "शकरखोरा", mr: "शिंजीर" },
        "hornbill": { en: "Hornbill", hi: "धनेश", mr: "धनेश" },
        "kite": { en: "Kite", hi: "चील", mr: "घार" },
        "falcon": { en: "Falcon", hi: "बाज", mr: "ससाणा" },
        "weaverbird": { en: "Weaverbird", hi: "बया", mr: "सुगरण" },
        "drongo": { en: "Drongo", hi: "भुजंगा", mr: "कोतवाल" },
        "barbet": { en: "Barbet", hi: "बसंत बौरी", mr: "तांबट" },
        "roller": { en: "Roller", hi: "नीलकंठ", mr: "नीलकंठ" },
        "flamingo": { en: "Flamingo", hi: "राजहंस", mr: "रोहित पक्षी" },
        "ibis": { en: "Ibis", hi: "इबिस", mr: "शराटी" }
    };

    const allBirds = Object.keys(birdDict);
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
        sessionStorage.setItem('shadowBirdLang', lang); 
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
        selectedBirdCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allBirds].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(birdKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card"; // Reusing class names for styling compatibility
            card.dataset.bird = birdKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + birdDict[birdKey]['en']);
            card.innerHTML = `<img src="images/birds/${birdKey}.webp" alt="${birdDict[birdKey]['en']}">`;
            card.addEventListener("click", () => handleBirdClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(birdKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = birdKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + birdDict[birdKey]['en'] + " shadow");
            card.innerHTML = `<img src="images/birds/${birdKey}.webp" alt="${birdDict[birdKey]['en']} Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleBirdClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedBirdCard) selectedBirdCard.classList.remove("selected");
        selectedBirdCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedBirdCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedBirdKey = selectedBirdCard.dataset.bird;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedBirdKey === targetShadowKey) {
            drawLine(selectedBirdCard, shadowCard);
            currentMatchedPairs.push({ left: selectedBirdCard, right: shadowCard });

            selectedBirdCard.classList.remove("selected");
            selectedBirdCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/birds/${selectedBirdKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedBirdCard = null; 

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
                sessionStorage.setItem('shadowBirdScore', score);
                sessionStorage.setItem('shadowBirdLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowBirdThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowBirdScore'); 
        sessionStorage.removeItem('shadowBirdThemeIndex'); 
        window.location.href = "index.html"; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};