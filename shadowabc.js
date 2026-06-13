"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowAbcThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let score = parseInt(sessionStorage.getItem('shadowAbcScore')) || 0;
    
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

    const abcDict = {
        "a": "A for Apple", "b": "B for Ball", "c": "C for Cat", "d": "D for Dog", 
        "e": "E for Elephant", "f": "F for Fish", "g": "G for Grapes", "h": "H for Horse", 
        "i": "I for Ice Cream", "j": "J for Jug", "k": "K for Kite", "l": "L for Lion", 
        "m": "M for Monkey", "n": "N for Nest", "o": "O for Orange", "p": "P for Parrot", 
        "q": "Q for Queen", "r": "R for Rabbit", "s": "S for Sun", "t": "T for Tiger", 
        "u": "U for Umbrella", "v": "V for Van", "w": "W for Watch", "x": "X for X-ray", 
        "y": "Y for Yak", "z": "Z for Zebra"
    };

    const allLetters = Object.keys(abcDict);
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

    document.getElementById("promptBox").addEventListener("click", () => {
        window.speechSynthesis.cancel();
        let msg = new SpeechSynthesisUtterance("Match the letters to their shadows!");
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
        
        let shuffled = [...allLetters].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(letterKey => {
            const card = document.createElement("div");
            card.className = "match-card letter-card"; 
            card.dataset.letter = letterKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + abcDict[letterKey]);
            
            card.innerHTML = `<img src="images/abc/letters/${letterKey}.webp" alt="${abcDict[letterKey]}">`;
            card.addEventListener("click", () => handleLetterClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(letterKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = letterKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + abcDict[letterKey] + " shadow");
            
            card.innerHTML = `<img src="images/abc/letters/${letterKey}.webp" alt="${abcDict[letterKey]} Silhouette" class="shadow-img">`;
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

            // Locked directly to English audio track
            let matchAudio = new Audio(`sounds/en/abc/${selectedLetterKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedLetterCard = null; 

            if (matchesFound === 3) {
                setTimeout(showRoundComplete, 800);
            }

        } else {
            shadowCard.classList.add("shake");
            let tryAgainAudio = new Audio(`sounds/en/try_again.mp3`);
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
        document.getElementById("feedback-score").innerText = "Total Score: " + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
        }

        let greatJobAudio = new Audio(`sounds/en/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Audio not found"));

        setTimeout(() => {
            feedback.classList.add("hidden");
            roundsPlayedThisSession++; 
            
            if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                sessionStorage.setItem('shadowAbcScore', score);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowAbcThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowAbcScore'); 
        sessionStorage.removeItem('shadowAbcThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=alphabets";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    startNewRound();
};