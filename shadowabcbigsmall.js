"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowAbcBigSmallThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let score = parseInt(sessionStorage.getItem('shadowAbcBigSmallScore')) || 0;
    
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

    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    
    // An array of vibrant colors to make the letters pop!
    const cardColors = ["#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#E91E63", "#00BCD4"];

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

    // Play instructions on click
    document.getElementById("promptBox").addEventListener("click", () => {
        window.speechSynthesis.cancel();
        let msg = new SpeechSynthesisUtterance("Match the Capital letters to their Small buddies!");
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
        
        // --- Left Side: Colorful Letters ---
        currentOptions.forEach((letter, index) => {
            const card = document.createElement("div");
            card.className = "match-card letter-card"; 
            card.dataset.letter = letter;
            card.setAttribute("role", "button");
            
            // Assign DIFFERENT colors to the big and small letter
            const bigColor = cardColors[index % cardColors.length];
            const smallColor = cardColors[(index + 2) % cardColors.length]; 
            
            card.innerHTML = `
                <span class="grid-big" style="color: ${bigColor};">${letter}</span>
                <span class="grid-small" style="color: ${smallColor};">${letter.toLowerCase()}</span>
            `;
            
            card.addEventListener("click", () => handleLetterClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        // --- Right Side: Shadow Silhouettes ---
        shadowOptions.forEach(letter => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = letter;
            card.setAttribute("role", "button");
            
            // Renders identical structure but styled black via CSS
            card.innerHTML = `
                <span class="grid-big shadow-text">${letter}</span>
                <span class="grid-small shadow-text">${letter.toLowerCase()}</span>
            `;
            
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

            // Formats to "Aa.mp3" to match the findabcbigsmall folder path
            const audioFileName = `${selectedLetterKey}${selectedLetterKey.toLowerCase()}.mp3`;
            let matchAudio = new Audio(`sounds/en/abc big-small/${audioFileName}`);

            if (matchesFound === 3) {
                // Play audio, wait for it to FINISH, then show "Great Job!" popup
                matchAudio.onended = triggerCelebration;
                matchAudio.play().catch(e => {
                    console.log("Audio not found", e);
                    setTimeout(triggerCelebration, 800); // Fallback if missing
                });
            } else {
                matchAudio.play().catch(e => console.log("Audio not found"));
            }

            selectedLetterCard = null; 

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

    // --- CELEBRATION SEQUENCE ---
    let advanceTimer;
    function triggerCelebration() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-score").innerText = "Total Score: " + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });

        let greatJobAudio = new Audio(`sounds/en/great_job.mp3`);
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
            sessionStorage.setItem('shadowAbcBigSmallScore', score);
            let nextThemeIndex = (themeIndex + 1) % themes.length;
            sessionStorage.setItem('shadowAbcBigSmallThemeIndex', nextThemeIndex);
            window.location.reload();
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowAbcBigSmallScore'); 
        sessionStorage.removeItem('shadowAbcBigSmallThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=small_alphabets";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    startNewRound();
};