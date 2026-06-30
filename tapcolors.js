"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🎨' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }
    ];
    let themeIndex = parseInt(sessionStorage.getItem('tapColorsThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('tapColorsLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('tapColorsScore')) || 0;
    
    let targetColorKey = "";
    let targetsFound = 0;
    let totalTargetsRequired = 4; 
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    let isPlaying = false;

    let activePrompt1 = null;
    let activePrompt2 = null;
    let activeEffectAudio = null;

    const uiDict = {
        "game-title": { en: "👆 Tap The Colours!", hi: "👆 रंग टैप करें!", mr: "👆 रंग टॅप करा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Tap all...", hi: "सभी को टैप करें...", mr: "सर्वांना टॅप करा..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" }
    };

    const colorsDict = {
        "red": { hex: "#e74c3c", name: { en: "Red", hi: "लाल", mr: "लाल" } },
        "blue": { hex: "#3498db", name: { en: "Blue", hi: "नीला", mr: "निळा" } },
        "yellow": { hex: "#f1c40f", name: { en: "Yellow", hi: "पीला", mr: "पिवळा" } },
        "green": { hex: "#2ecc71", name: { en: "Green", hi: "हरा", mr: "हिरवा" } },
        "orange": { hex: "#e67e22", name: { en: "Orange", hi: "नारंगी", mr: "केशरी" } },
        "purple": { hex: "#9b59b6", name: { en: "Purple", hi: "बैंगनी", mr: "जांभळा" } },
        "black": { hex: "#000000", name: { en: "Black", hi: "काला", mr: "काळा" } },
        "white": { hex: "#ffffff", name: { en: "White", hi: "सफ़ेद", mr: "पांढरा" } },
        "grey": { hex: "#95a5a6", name: { en: "Grey", hi: "स्लेटी", mr: "राखाडी" } },
        "brown": { hex: "#8b4513", name: { en: "Brown", hi: "भूरा", mr: "तपकिरी" } },
        "teal": { hex: "#008080", name: { en: "Teal", hi: "टील", mr: "टील" } },
        "magenta": { hex: "#ff00ff", name: { en: "Magenta", hi: "मैजेंटा", mr: "मॅजेंटा" } },
        "lavender": { hex: "#e6e6fa", name: { en: "Lavender", hi: "लैवेंडर", mr: "लव्हेंडर" } },
        "maroon": { hex: "#800000", name: { en: "Maroon", hi: "मैरून", mr: "मरून" } },
        "turquoise": { hex: "#40e0d0", name: { en: "Turquoise", hi: "फिरोज़ा", mr: "फिरोजी" } }
    };

    const allColors = Object.keys(colorsDict);
    document.getElementById("score").innerText = score;

    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('tapColorsLang', lang); 
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetColorKey) {
            const colorNameEl = document.getElementById("target-color-name");
            colorNameEl.innerText = colorsDict[targetColorKey].name[currentLang];
            // Dynamically change the text color to match the target color!
            colorNameEl.style.color = colorsDict[targetColorKey].hex;
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            stopAllAudio();
            updateLanguage(e.target.dataset.lang);
            playCustomAudio();
        });
    });

    function stopAllAudio() {
        if (activePrompt1) { activePrompt1.pause(); activePrompt1.currentTime = 0; }
        if (activePrompt2) { activePrompt2.pause(); activePrompt2.currentTime = 0; }
        if (activeEffectAudio) { activeEffectAudio.pause(); activeEffectAudio.currentTime = 0; }
        window.speechSynthesis.cancel();
    }

    function playCustomAudio() {
        if (!targetColorKey) return; 
        stopAllAudio(); 

        activePrompt1 = new Audio(`sounds/${currentLang}/tap_all.mp3`);
        activePrompt2 = new Audio(`sounds/${currentLang}/colours/${targetColorKey}.mp3`);

        activePrompt1.play().catch(() => {
            let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang]);
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
        
        targetColorKey = allColors[Math.floor(Math.random() * allColors.length)];
        
        const colorNameEl = document.getElementById("target-color-name");
        colorNameEl.innerText = colorsDict[targetColorKey].name[currentLang];
        colorNameEl.style.color = colorsDict[targetColorKey].hex;

        setTimeout(playCustomAudio, 500);

        let gridPositions = [];
        for (let r = 1; r <= 4; r++) {
            for (let c = 1; c <= 5; c++) { gridPositions.push({ r: r, c: c }); }
        }
        gridPositions.sort(() => Math.random() - 0.5); 

        let itemPool = [];
        for(let i = 0; i < totalTargetsRequired; i++) itemPool.push(targetColorKey);
        
        while(itemPool.length < 20) {
            let randomDecoy = allColors[Math.floor(Math.random() * allColors.length)];
            if(randomDecoy !== targetColorKey) itemPool.push(randomDecoy);
        }
        itemPool.sort(() => Math.random() - 0.5);

        itemPool.forEach((colorKey, index) => {
            let pos = gridPositions[index];
            let topPercent = (pos.r * 20) - 10 + (Math.random() * 4 - 2); 
            let leftPercent = (pos.c * 20) - 10 + (Math.random() * 4 - 2);

            const bubble = document.createElement("div");
            bubble.className = "color-bubble"; 
            bubble.dataset.key = colorKey; 
            
            // Set the visual color
            bubble.style.background = colorsDict[colorKey].hex;
            
            bubble.style.top = `${topPercent}%`;
            bubble.style.left = `${leftPercent}%`;

            bubble.onclick = () => handleTap(bubble, colorKey);
            gameArea.appendChild(bubble);
        });
    }

    function handleTap(bubble, tappedColorKey) {
        if (!isPlaying || bubble.classList.contains("correct")) return;
        stopAllAudio(); 

        if (tappedColorKey === targetColorKey) {
            bubble.classList.add("correct");
            targetsFound++;
            score += 5;
            document.getElementById("score").innerText = score;
            
            activeEffectAudio = new Audio(`sounds/${currentLang}/colours/${targetColorKey}.mp3`);
            
            if (targetsFound === totalTargetsRequired) {
                isPlaying = false;
                setTimeout(triggerVisualCelebration, 600);

                activeEffectAudio.onended = triggerAudioCelebration;
                activeEffectAudio.play().catch(e => {
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

    function triggerVisualCelebration() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-text").innerText = uiDict["correct"][currentLang];
        document.getElementById("feedback-score").innerText = uiDict["total-score"][currentLang] + score;
        feedback.classList.remove("hidden");
        if (typeof confetti === "function") confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
    }

    let advanceTimer;
    function triggerAudioCelebration() {
        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Great job audio not found"));
        
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
            sessionStorage.setItem('tapColorsScore', score);
            sessionStorage.setItem('tapColorsThemeIndex', (themeIndex + 1) % themes.length);
            window.location.reload(); 
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=colours";
        window.location.href = returnUrl; 
    });

    updateLanguage(currentLang);
    startNewRound();
};