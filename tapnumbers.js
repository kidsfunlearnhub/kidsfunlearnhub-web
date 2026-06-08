"use strict";

window.onload = function() {
    const themes = [{ runner: '🖍️', target: '🍎' }, { runner: '🚗', target: '🎈' }, { runner: '🚀', target: '⭐' }];
    let themeIndex = parseInt(sessionStorage.getItem('tapNumbersThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findAbcLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('tapNumbersScore')) || 0;
    
    let targetNumberKey = "";
    let targetsFound = 0;
    let totalTargetsRequired = 4; 
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    let isPlaying = false;

    let activePrompt1 = null;
    let activePrompt2 = null;
    let activeEffectAudio = null;

    // Added "correct" translation for the Great Job popup
    const uiDict = {
        "game-title": { en: "👆 Tap The Numbers!", hi: "👆 नंबर टैप करें!", mr: "👆 अंक टॅप करा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Tap all...", hi: "सभी को टैप करें...", mr: "सर्वांना टॅप करा..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" }
    };

    const numbersDict = {
        "1": { name: { en: "1 (One)", hi: "१ (एक)", mr: "१ (एक)" }, num: { en: "1", hi: "१", mr: "१" } },
        "2": { name: { en: "2 (Two)", hi: "२ (दो)", mr: "२ (दोन)" }, num: { en: "2", hi: "२", mr: "२" } },
        "3": { name: { en: "3 (Three)", hi: "३ (तीन)", mr: "३ (तीन)" }, num: { en: "3", hi: "३", mr: "३" } },
        "4": { name: { en: "4 (Four)", hi: "४ (चार)", mr: "४ (चार)" }, num: { en: "4", hi: "४", mr: "४" } },
        "5": { name: { en: "5 (Five)", hi: "५ (पांच)", mr: "५ (पाच)" }, num: { en: "5", hi: "५", mr: "५" } },
        "6": { name: { en: "6 (Six)", hi: "६ (छह)", mr: "६ (सहा)" }, num: { en: "6", hi: "६", mr: "६" } },
        "7": { name: { en: "7 (Seven)", hi: "७ (सात)", mr: "७ (सात)" }, num: { en: "7", hi: "७", mr: "७" } },
        "8": { name: { en: "8 (Eight)", hi: "८ (आठ)", mr: "८ (आठ)" }, num: { en: "8", hi: "८", mr: "८" } },
        "9": { name: { en: "9 (Nine)", hi: "९ (नौ)", mr: "९ (नऊ)" }, num: { en: "9", hi: "९", mr: "९" } },
        "10": { name: { en: "10 (Ten)", hi: "१० (दस)", mr: "१० (दहा)" }, num: { en: "10", hi: "१०", mr: "१०" } },
        "11": { name: { en: "11 (Eleven)", hi: "११ (ग्यारह)", mr: "११ (अकरा)" }, num: { en: "11", hi: "११", mr: "११" } },
        "12": { name: { en: "12 (Twelve)", hi: "१२ (बारह)", mr: "१२ (बारा)" }, num: { en: "12", hi: "१२", mr: "१२" } },
        "13": { name: { en: "13 (Thirteen)", hi: "१३ (तेरह)", mr: "१३ (तेरा)" }, num: { en: "13", hi: "१३", mr: "१३" } },
        "14": { name: { en: "14 (Fourteen)", hi: "१४ (चौदह)", mr: "१४ (चौदा)" }, num: { en: "14", hi: "१४", mr: "१४" } },
        "15": { name: { en: "15 (Fifteen)", hi: "१५ (पंद्रह)", mr: "१५ (पंधरा)" }, num: { en: "15", hi: "१५", mr: "१५" } },
        "16": { name: { en: "16 (Sixteen)", hi: "१६ (सोलह)", mr: "१६ (सोळा)" }, num: { en: "16", hi: "१६", mr: "१६" } },
        "17": { name: { en: "17 (Seventeen)", hi: "१७ (सत्रह)", mr: "१७ (सतरा)" }, num: { en: "17", hi: "१७", mr: "१७" } },
        "18": { name: { en: "18 (Eighteen)", hi: "१८ (अठारह)", mr: "१८ (अठरा)" }, num: { en: "18", hi: "१८", mr: "१८" } },
        "19": { name: { en: "19 (Nineteen)", hi: "१९ (उन्नीस)", mr: "१९ (एकोणीस)" }, num: { en: "19", hi: "१९", mr: "१९" } },
        "20": { name: { en: "20 (Twenty)", hi: "२० (बीस)", mr: "२० (वीस)" }, num: { en: "20", hi: "२०", mr: "२०" } }
    };

    const allNumbers = Object.keys(numbersDict);
    document.getElementById("score").innerText = score;

    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('findAbcLang', lang); 
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetNumberKey) {
            document.getElementById("target-number-name").innerText = numbersDict[targetNumberKey].name[currentLang];
        }

        document.querySelectorAll('.letter-bubble').forEach(bubble => {
            const rawKey = bubble.dataset.key; 
            if (rawKey && numbersDict[rawKey]) {
                bubble.innerText = numbersDict[rawKey].num[currentLang];
            }
        });
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
        if (!targetNumberKey) return; 
        stopAllAudio(); 

        activePrompt1 = new Audio(`sounds/${currentLang}/tap_all.mp3`);
        activePrompt2 = new Audio(`sounds/${currentLang}/numbers/${targetNumberKey}.mp3`);

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
        
        targetNumberKey = allNumbers[Math.floor(Math.random() * allNumbers.length)];
        document.getElementById("target-number-name").innerText = numbersDict[targetNumberKey].name[currentLang];

        setTimeout(playCustomAudio, 500);

        let gridPositions = [];
        for (let r = 1; r <= 4; r++) {
            for (let c = 1; c <= 5; c++) { gridPositions.push({ r: r, c: c }); }
        }
        gridPositions.sort(() => Math.random() - 0.5); 

        let itemPool = [];
        for(let i = 0; i < totalTargetsRequired; i++) itemPool.push(targetNumberKey);
        
        while(itemPool.length < 20) {
            let randomDecoy = allNumbers[Math.floor(Math.random() * allNumbers.length)];
            if(randomDecoy !== targetNumberKey) itemPool.push(randomDecoy);
        }
        itemPool.sort(() => Math.random() - 0.5);

        itemPool.forEach((numKey, index) => {
            let pos = gridPositions[index];
            let topPercent = (pos.r * 20) - 10 + (Math.random() * 4 - 2); 
            let leftPercent = (pos.c * 20) - 10 + (Math.random() * 4 - 2);

            const bubble = document.createElement("div");
            bubble.className = "letter-bubble"; 
            bubble.dataset.key = numKey; 
            bubble.innerText = numbersDict[numKey].num[currentLang];
            
            bubble.style.top = `${topPercent}%`;
            bubble.style.left = `${leftPercent}%`;
            bubble.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;

            bubble.onclick = () => handleTap(bubble, numKey);
            gameArea.appendChild(bubble);
        });
    }

    function handleTap(bubble, tappedNumberKey) {
        if (!isPlaying || bubble.classList.contains("correct")) return;
        stopAllAudio(); 

        if (tappedNumberKey === targetNumberKey) {
            bubble.classList.add("correct");
            targetsFound++;
            score += 5;
            document.getElementById("score").innerText = score;
            
            activeEffectAudio = new Audio(`sounds/${currentLang}/numbers/${targetNumberKey}.mp3`);
            
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
        // Update the great job text dynamically right before showing the popup!
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
            sessionStorage.setItem('tapNumbersScore', score);
            sessionStorage.setItem('tapNumbersThemeIndex', (themeIndex + 1) % themes.length);
            window.location.reload(); 
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=numbers";
        window.location.href = returnUrl; 
    });

    updateLanguage(currentLang);
    startNewRound();
};