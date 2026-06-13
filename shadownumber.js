"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowNumberThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findNumberLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowNumberScore')) || 0;
    
    let selectedNumberCard = null; 
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
        "game-title": { en: "🔢 Number Shadow Match!", hi: "🔢 नंबर परछाई मिलान!", mr: "🔢 क्रमांक सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the numbers to their shadows!", hi: "नंबरों को उनकी परछाई से मिलाएँ!", mr: "क्रमांकांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Number Shadow Match Game | KidsFunLearnHub", hi: "नंबर छाया मिलान खेल | KidsFunLearnHub", mr: "क्रमांक सावली जुळवा खेळ | KidsFunLearnHub" }
    };

    const numbersDict = {
        "1": { en: "One", hi: "एक", mr: "एक" }, "2": { en: "Two", hi: "दो", mr: "दोन" },
        "3": { en: "Three", hi: "तीन", mr: "तीन" }, "4": { en: "Four", hi: "चार", mr: "चार" },
        "5": { en: "Five", hi: "पांच", mr: "पाच" }, "6": { en: "Six", hi: "छह", mr: "सहा" },
        "7": { en: "Seven", hi: "सात", mr: "सात" }, "8": { en: "Eight", hi: "आठ", mr: "आठ" },
        "9": { en: "Nine", hi: "नौ", mr: "नऊ" }, "10": { en: "Ten", hi: "दस", mr: "दहा" },
        "11": { en: "Eleven", hi: "ग्यारह", mr: "अकरा" }, "12": { en: "Twelve", hi: "बारह", mr: "बारा" },
        "13": { en: "Thirteen", hi: "तेरह", mr: "तेरा" }, "14": { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        "15": { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" }, "16": { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        "17": { en: "Seventeen", hi: "सत्रह", mr: "सतरा" }, "18": { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        "19": { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" }, "20": { en: "Twenty", hi: "बीस", mr: "वीस" },
        "21": { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" }, "22": { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        "23": { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" }, "24": { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        "25": { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" }, "26": { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        "27": { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" }, "28": { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        "29": { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" }, "30": { en: "Thirty", hi: "तीस", mr: "तीस" },
        "31": { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" }, "32": { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        "33": { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" }, "34": { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        "35": { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" }, "36": { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        "37": { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" }, "38": { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        "39": { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" }, "40": { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    const allNumbers = Object.keys(numbersDict);
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

    function getImageFolder() {
        return (currentLang === 'hi' || currentLang === 'mr') ? 'devanagari' : 'en';
    }

    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('findNumberLang', lang); 
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

        // Dynamically update the images if they are already rendered on screen
        if (document.getElementById("left-column").innerHTML !== "") {
            const folder = getImageFolder();
            
            document.querySelectorAll('.number-card img').forEach(img => {
                const numKey = img.parentElement.dataset.number;
                img.src = `images/numbers/digits/${folder}/${numKey}.webp`;
            });
            document.querySelectorAll('.shadow-card img').forEach(img => {
                const numKey = img.parentElement.dataset.match;
                img.src = `images/numbers/digits/${folder}/${numKey}.webp`;
            });
        }
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
        selectedNumberCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allNumbers].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        const folder = getImageFolder();
        
        currentOptions.forEach(numKey => {
            const card = document.createElement("div");
            card.className = "match-card number-card"; 
            card.dataset.number = numKey;
            card.setAttribute("role", "button");
            
            card.innerHTML = `<img src="images/numbers/digits/${folder}/${numKey}.webp" alt="${numbersDict[numKey]['en']}">`;
            card.addEventListener("click", () => handleNumberClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(numKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = numKey;
            card.setAttribute("role", "button");
            
            // Re-uses the image but casts a shadow
            card.innerHTML = `<img src="images/numbers/digits/${folder}/${numKey}.webp" alt="Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleNumberClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedNumberCard) selectedNumberCard.classList.remove("selected");
        selectedNumberCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedNumberCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedNumberKey = selectedNumberCard.dataset.number;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedNumberKey === targetShadowKey) {
            drawLine(selectedNumberCard, shadowCard);
            currentMatchedPairs.push({ left: selectedNumberCard, right: shadowCard });

            selectedNumberCard.classList.remove("selected");
            selectedNumberCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/numbers/${selectedNumberKey}.mp3`);
            
            if (matchesFound === 3) {
                // Ensure audio finishes BEFORE calling the popup
                matchAudio.onended = () => { setTimeout(showRoundComplete, 200); };
                matchAudio.play().catch(e => {
                    console.log("Audio not found");
                    setTimeout(showRoundComplete, 600);
                });
            } else {
                matchAudio.play().catch(e => console.log("Audio not found"));
            }

            selectedNumberCard = null; 

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

    let advanceTimer;
    function showRoundComplete() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-score").innerText = uiDict["total-score"][currentLang] + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });

        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Audio not found"));

        roundsPlayedThisSession++; 
        
        advanceTimer = setTimeout(advanceToNextRound, 2500);
        document.getElementById("feedback").onclick = advanceToNextRound;
    }

    function advanceToNextRound() {
        clearTimeout(advanceTimer);
        const feedback = document.getElementById("feedback");
        feedback.classList.add("hidden");
        feedback.onclick = null; 

        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
            sessionStorage.setItem('shadowNumberScore', score);
            sessionStorage.setItem('findNumberLang', currentLang);
            let nextThemeIndex = (themeIndex + 1) % themes.length;
            sessionStorage.setItem('shadowNumberThemeIndex', nextThemeIndex);
            window.location.reload();
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowNumberScore'); 
        sessionStorage.removeItem('shadowNumberThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=numbers";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};