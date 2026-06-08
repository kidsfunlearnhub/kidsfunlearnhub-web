"use strict";

window.onload = function() {
    const themes = [{ runner: '🖍️', target: '🍎' }, { runner: '🚗', target: '🎈' }, { runner: '🚀', target: '⭐' }];
    let themeIndex = parseInt(sessionStorage.getItem('tapAbcThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findAbcLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('tapAbcScore')) || 0;
    
    let targetLetterKey = "";
    let targetsFound = 0;
    let totalTargetsRequired = 4; 
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    let isPlaying = false;

    let activePrompt1 = null;
    let activePrompt2 = null;
    let activeEffectAudio = null;

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

    function stopAllAudio() {
        if (activePrompt1) { activePrompt1.pause(); activePrompt1.currentTime = 0; }
        if (activePrompt2) { activePrompt2.pause(); activePrompt2.currentTime = 0; }
        if (activeEffectAudio) { activeEffectAudio.pause(); activeEffectAudio.currentTime = 0; }
        window.speechSynthesis.cancel();
    }

    function playCustomAudio() {
        if (!targetLetterKey) return; 
        stopAllAudio(); 

        activePrompt1 = new Audio(`sounds/${currentLang}/tap_all.mp3`);
        activePrompt2 = new Audio(`sounds/${currentLang}/abc/${targetLetterKey}.mp3`);

        activePrompt1.play().catch(() => {
            let msg = new SpeechSynthesisUtterance("Tap all");
            msg.rate = 0.85; msg.pitch = 1.2;
            msg.onend = () => { activePrompt2.play().catch(e => console.log(e)); };
            window.speechSynthesis.speak(msg);
        });

        activePrompt1.onended = () => { activePrompt2.play().catch(e => console.log(e)); };
    }

    document.getElementById("promptBox").addEventListener("click", playCustomAudio);

    const dotsContainer = document.getElementById("dots-container");
    dotsContainer.innerHTML = "";
    for(let i = 0; i <= ROUNDS_BEFORE_RELOAD; i++) {
        dotsContainer.appendChild(document.createElement("div")).className = "path-dot";
    }

    function updateProgressTrack() {
        const runner = document.getElementById("runner-icon");
        const progressLine = document.getElementById("progress-line"); 
        let percentage = (roundsPlayedThisSession / ROUNDS_BEFORE_RELOAD) * 100;
        runner.style.left = percentage + "%";
        progressLine.style.width = percentage + "%";
    }

    function startNewRound() {
        isPlaying = true;
        targetsFound = 0;
        updateProgressTrack();

        const gameArea = document.getElementById("gameArea");
        gameArea.innerHTML = "";
        
        targetLetterKey = allLetters[Math.floor(Math.random() * allLetters.length)];
        document.getElementById("target-letter-name").innerText = abcDict[targetLetterKey];

        setTimeout(playCustomAudio, 500);

        let gridPositions = [];
        for (let r = 1; r <= 4; r++) {
            for (let c = 1; c <= 5; c++) { gridPositions.push({ r: r, c: c }); }
        }
        gridPositions.sort(() => Math.random() - 0.5); 

        let itemPool = [];
        for(let i = 0; i < totalTargetsRequired; i++) itemPool.push(targetLetterKey);
        
        while(itemPool.length < 20) {
            let randomDecoy = allLetters[Math.floor(Math.random() * allLetters.length)];
            if(randomDecoy !== targetLetterKey) itemPool.push(randomDecoy);
        }
        itemPool.sort(() => Math.random() - 0.5);

        itemPool.forEach((letter, index) => {
            let pos = gridPositions[index];
            let topPercent = (pos.r * 20) - 10 + (Math.random() * 4 - 2); 
            let leftPercent = (pos.c * 20) - 10 + (Math.random() * 4 - 2);

            const bubble = document.createElement("div");
            bubble.className = "letter-bubble";
            bubble.innerText = letter.toUpperCase();
            bubble.style.top = `${topPercent}%`;
            bubble.style.left = `${leftPercent}%`;
            bubble.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;

            bubble.onclick = () => handleTap(bubble, letter);
            gameArea.appendChild(bubble);
        });
    }

    function handleTap(bubble, letter) {
        if (!isPlaying || bubble.classList.contains("correct")) return;
        stopAllAudio(); 

        if (letter === targetLetterKey) {
            bubble.classList.add("correct");
            targetsFound++;
            score += 5;
            document.getElementById("score").innerText = score;
            
            activeEffectAudio = new Audio(`sounds/${currentLang}/abc/${targetLetterKey}.mp3`);
            
            if (targetsFound === totalTargetsRequired) {
                isPlaying = false;
                
                // 1. Show visual popup fast (Instant gratification)
                setTimeout(triggerVisualCelebration, 600);

                // 2. Wait for "A for Apple" to finish before playing "Great Job"
                activeEffectAudio.onended = triggerAudioCelebration;
                
                activeEffectAudio.play().catch(e => {
                    // Fallback if audio fails to load
                    setTimeout(triggerAudioCelebration, 800);
                });
            } else {
                activeEffectAudio.play().catch(e => console.log("Audio not found"));
            }

        } else {
            bubble.classList.add("wrong");
            activeEffectAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            activeEffectAudio.play().catch(e => console.log("Try again audio not found"));
            setTimeout(() => bubble.classList.remove("wrong"), 400);
        }
    }

    // --- CELEBRATION SEQUENCES ---
    function triggerVisualCelebration() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-score").innerText = "Total Score: " + score;
        feedback.classList.remove("hidden");
        if (typeof confetti === "function") confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
    }

    let advanceTimer;
    function triggerAudioCelebration() {
        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Great job audio not found"));
        
        roundsPlayedThisSession++;
        
        // Start auto-advance timer AFTER "Great Job" plays
        advanceTimer = setTimeout(advanceToNextRound, 2500);
        document.getElementById("feedback").onclick = advanceToNextRound;
    }

    function advanceToNextRound() {
        clearTimeout(advanceTimer);
        const feedback = document.getElementById("feedback");
        feedback.classList.add("hidden");
        feedback.onclick = null; 
        
        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
            sessionStorage.setItem('tapAbcScore', score);
            sessionStorage.setItem('tapAbcThemeIndex', (themeIndex + 1) % themes.length);
            window.location.reload();
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=alphabets";
        window.location.href = returnUrl; 
    });

    startNewRound();
};