"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }
    ];
    let themeIndex = parseInt(sessionStorage.getItem('tapShapesThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('tapShapesLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('tapShapesScore')) || 0;
    
    let targetShapeKey = "";
    let targetsFound = 0;
    let totalTargetsRequired = 4; 
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    let isPlaying = false;

    let activePrompt1 = null;
    let activePrompt2 = null;
    let activeEffectAudio = null;

    const uiDict = {
        "game-title": { en: "👆 Tap The Shapes!", hi: "👆 आकार टैप करें!", mr: "👆 आकार टॅप करा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Tap all...", hi: "सभी को टैप करें...", mr: "सर्वांना टॅप करा..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" }
    };

    const shapesDict = {
        "circle": { en: "Circle", hi: "वृत्त (गोल)", mr: "वर्तुळ (गोल)" },
        "square": { en: "Square", hi: "वर्ग (चौकोर)", mr: "चौरस (चौकोन)" },
        "triangle": { en: "Triangle", hi: "त्रिकोण", mr: "त्रिकोण" },
        "rectangle": { en: "Rectangle", hi: "आयत", mr: "आयत" },
        "star": { en: "Star", hi: "तारा", mr: "चांदणी" },
        "heart": { en: "Heart", hi: "दिल", mr: "हृदय" },
        "oval": { en: "Oval", hi: "अंडाकार", mr: "लंबवर्तुळ" },
        "diamond": { en: "Diamond", hi: "हीरा", mr: "समभुज चौकोन" },
        "pentagon": { en: "Pentagon", hi: "पंचभुज", mr: "पंचकोन" },
        "hexagon": { en: "Hexagon", hi: "षट्भुज", mr: "षटकोन" }
    };

    const allShapes = Object.keys(shapesDict);
    document.getElementById("score").innerText = score;

    // --- PRELOAD SHAPE IMAGES FOR INSTANT RENDERING ---
    const imageCacheBasic = {};
    allShapes.forEach(name => {
        const imgBasic = new Image();
        imgBasic.src = `images/shapes/basic/${name}.webp`;
        imageCacheBasic[name] = imgBasic;
    });

    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('tapShapesLang', lang); 
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetShapeKey) {
            document.getElementById("target-shape-name").innerText = shapesDict[targetShapeKey][currentLang];
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
        if (!targetShapeKey) return; 
        stopAllAudio(); 

        activePrompt1 = new Audio(`sounds/${currentLang}/tap_all.mp3`);
        activePrompt2 = new Audio(`sounds/${currentLang}/shapes/${targetShapeKey}.mp3`);

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
        
        targetShapeKey = allShapes[Math.floor(Math.random() * allShapes.length)];
        document.getElementById("target-shape-name").innerText = shapesDict[targetShapeKey][currentLang];

        setTimeout(playCustomAudio, 500);

        let gridPositions = [];
        for (let r = 1; r <= 4; r++) {
            for (let c = 1; c <= 5; c++) { gridPositions.push({ r: r, c: c }); }
        }
        gridPositions.sort(() => Math.random() - 0.5); 

        let itemPool = [];
        for(let i = 0; i < totalTargetsRequired; i++) itemPool.push(targetShapeKey);
        
        while(itemPool.length < 20) {
            let randomDecoy = allShapes[Math.floor(Math.random() * allShapes.length)];
            if(randomDecoy !== targetShapeKey) itemPool.push(randomDecoy);
        }
        itemPool.sort(() => Math.random() - 0.5);

        itemPool.forEach((shapeKey, index) => {
            let pos = gridPositions[index];
            let topPercent = (pos.r * 20) - 10 + (Math.random() * 4 - 2); 
            let leftPercent = (pos.c * 20) - 10 + (Math.random() * 4 - 2);

            const bubble = document.createElement("div");
            bubble.className = "shape-bubble"; 
            bubble.dataset.key = shapeKey; 
            
            // Render the shape image inside the bubble
            bubble.innerHTML = `<img src="${imageCacheBasic[shapeKey].src}" alt="${shapesDict[shapeKey][currentLang]}">`;
            
            bubble.style.top = `${topPercent}%`;
            bubble.style.left = `${leftPercent}%`;
            bubble.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;

            bubble.onclick = () => handleTap(bubble, shapeKey);
            gameArea.appendChild(bubble);
        });
    }

    function handleTap(bubble, tappedShapeKey) {
        if (!isPlaying || bubble.classList.contains("correct")) return;
        stopAllAudio(); 

        if (tappedShapeKey === targetShapeKey) {
            bubble.classList.add("correct");
            targetsFound++;
            score += 5;
            document.getElementById("score").innerText = score;
            
            activeEffectAudio = new Audio(`sounds/${currentLang}/shapes/${targetShapeKey}.mp3`);
            
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
            sessionStorage.setItem('tapShapesScore', score);
            sessionStorage.setItem('tapShapesThemeIndex', (themeIndex + 1) % themes.length);
            window.location.reload(); 
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=shapes";
        window.location.href = returnUrl; 
    });

    updateLanguage(currentLang);
    startNewRound();
};