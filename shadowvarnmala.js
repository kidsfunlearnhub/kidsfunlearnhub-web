"use strict";

window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowVarnmalaThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // Default to Hindi if coming from an English game, else use saved
    let currentLang = sessionStorage.getItem('findAbcLang'); 
    if (!currentLang || currentLang === 'en') {
        currentLang = 'hi';
    }

    let score = parseInt(sessionStorage.getItem('shadowVarnmalaScore')) || 0;
    
    let selectedLetterCard = null; 
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
        "game-title": { hi: "🟢 वर्णमाला परछाई मिलान!", mr: "🟢 वर्णमाला सावली जुळवा!" },
        "score-label": { hi: "स्कोर:", mr: "गुण:" },
        "instruction": { hi: "अक्षरों को उनकी परछाई से मिलाएँ!", mr: "अक्षरांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { hi: "वर्णमाला छाया मिलान खेल | KidsFunLearnHub", mr: "वर्णमाला सावली जुळवा खेळ | KidsFunLearnHub" }
    };

    const varnmalaDict = {
        "a": { hi: "अ", mr: "अ" }, "aa": { hi: "आ", mr: "आ" }, "i": { hi: "इ", mr: "इ" }, "ee": { hi: "ई", mr: "ई" },
        "u": { hi: "उ", mr: "उ" }, "oo": { hi: "ऊ", mr: "ऊ" }, "ri": { hi: "ऋ", mr: "ऋ" }, "e": { hi: "ए", mr: "ए" },
        "ai": { hi: "ऐ", mr: "ऐ" }, "o": { hi: "ओ", mr: "ओ" }, "au": { hi: "औ", mr: "औ" }, "ang": { hi: "अं", mr: "अं" },
        "aha": { hi: "अः", mr: "अः" }, "k": { hi: "क", mr: "क" }, "kh": { hi: "ख", mr: "ख" }, "g": { hi: "ग", mr: "ग" },
        "gh": { hi: "घ", mr: "घ" }, "dn": { hi: "ङ", mr: "ङ" }, "ch": { hi: "च", mr: "च" }, "chh": { hi: "छ", mr: "छ" },
        "j": { hi: "ज", mr: "ज" }, "jh": { hi: "झ", mr: "झ" }, "trh": { hi: "ञ", mr: "ञ" }, "t1": { hi: "ट", mr: "ट" },
        "th1": { hi: "ठ", mr: "ठ" }, "d1": { hi: "ड", mr: "ड" }, "dh1": { hi: "ढ", mr: "ढ" }, "n1": { hi: "ण", mr: "ण" },
        "t2": { hi: "त", mr: "त" }, "th2": { hi: "थ", mr: "थ" }, "d2": { hi: "द", mr: "द" }, "dh2": { hi: "ध", mr: "ध" },
        "n2": { hi: "न", mr: "न" }, "p": { hi: "प", mr: "प" }, "ph": { hi: "फ", mr: "फ" }, "b": { hi: "ब", mr: "ब" },
        "bh": { hi: "भ", mr: "भ" }, "m": { hi: "म", mr: "म" }, "y": { hi: "य", mr: "य" }, "r": { hi: "र", mr: "र" },
        "l": { hi: "ल", mr: "ल" }, "v": { hi: "व", mr: "व" }, "sh": { hi: "श", mr: "श" }, "shh": { hi: "ष", mr: "ष" },
        "s": { hi: "स", mr: "स" }, "h": { hi: "ह", mr: "ह" }, "ksh": { hi: "क्ष", mr: "क्ष" }, "tr": { hi: "त्र", mr: "त्र" },
        "gy": { hi: "ज्ञ", mr: "ज्ञ" }
    };

    const allVarnmalaKeys = Object.keys(varnmalaDict);
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
        sessionStorage.setItem('findAbcLang', lang); 
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

    // Optional: Add simple text-to-speech for the instruction box if clicked
    document.getElementById("promptBox").addEventListener("click", () => {
        window.speechSynthesis.cancel();
        let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang]);
        msg.rate = 0.85; msg.pitch = 1.2;
        window.speechSynthesis.speak(msg);
    });

    function startNewRound() {
        matchesFound = 0;
        currentMatchedPairs = [];
        selectedLetterCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allVarnmalaKeys].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(vKey => {
            const card = document.createElement("div");
            card.className = "match-card letter-card"; 
            card.dataset.letter = vKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + varnmalaDict[vKey]['hi']);
            
            // Uses the colored varnmala letter image
            card.innerHTML = `<img src="images/varnamala/letters/${vKey}.webp" alt="${varnmalaDict[vKey]['hi']}">`;
            card.addEventListener("click", () => handleLetterClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(vKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = vKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + varnmalaDict[vKey]['hi'] + " shadow");
            
            // Uses the same letter image, but CSS filter turns it into a shadow
            card.innerHTML = `<img src="images/varnamala/letters/${vKey}.webp" alt="Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleLetterClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedLetterCard) selectedLetterCard.classList.remove("selected");
        selectedLetterCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedLetterCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
                shadowCard.classList.add("shake");
                setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedLetterKey = selectedLetterCard.dataset.letter;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedLetterKey === targetShadowKey) {
            drawLine(selectedLetterCard, shadowCard);
            currentMatchedPairs.push({ left: selectedLetterCard, right: shadowCard });

            selectedLetterCard.classList.remove("selected");
            selectedLetterCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            // Play the letter sound!
            let matchAudio = new Audio(`sounds/${currentLang}/varnamala/${selectedLetterKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedLetterCard = null; 

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
                sessionStorage.setItem('shadowVarnmalaScore', score);
                sessionStorage.setItem('findAbcLang', currentLang); // Sync language globally
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowVarnmalaThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowVarnmalaScore'); 
        sessionStorage.removeItem('shadowVarnmalaThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=hindi";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};