"use strict";

window.onload = function() {
    const themes = [{ runner: '🖍️', target: '🍎' }, { runner: '🚗', target: '🎈' }, { runner: '🚀', target: '⭐' }];
    let themeIndex = parseInt(sessionStorage.getItem('tapVarnmalaThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // Check saved language. If it is 'en' (from another game) or null, force it to 'hi'
    let currentLang = sessionStorage.getItem('findAbcLang'); 
    if (!currentLang || currentLang === 'en') {
        currentLang = 'hi';
    }

    let score = parseInt(sessionStorage.getItem('tapVarnmalaScore')) || 0;
    
    let targetVarnmalaKey = "";
    let targetsFound = 0;
    let totalTargetsRequired = 4; 
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    let isPlaying = false;

    let activePrompt1 = null;
    let activePrompt2 = null;
    let activeEffectAudio = null;

    // UI Dictionary (Hindi & Marathi Only)
    const uiDict = {
        "game-title": { hi: "👆 वर्णमाला टैप करें!", mr: "👆 वर्णमाला टॅप करा!" },
        "score-label": { hi: "स्कोर:", mr: "गुण:" },
        "instruction": { hi: "सभी को टैप करें...", mr: "सर्वांना टॅप करा..." },
        "backBtn": { hi: "⬅ पीछे", mr: "⬅ मागे" },
        "total-score": { hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "correct": { hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" }
    };

    // Master Dictionary using EXACT keys from your varnmala.js file
    const varnmalaDict = {
        "a": { name: { hi: "अ - अनार", mr: "अ - अननस" }, char: "अ" },
        "aa": { name: { hi: "आ - आम", mr: "आ - आई" }, char: "आ" },
        "i": { name: { hi: "इ - इमली", mr: "इ - इमारत" }, char: "इ" },
        "ee": { name: { hi: "ई - ईख", mr: "ई - इडलिंबू" }, char: "ई" },
        "u": { name: { hi: "उ - उल्लू", mr: "उ - उखळ" }, char: "उ" },
        "oo": { name: { hi: "ऊ - ऊन", mr: "ऊ - ऊस" }, char: "ऊ" },
        "ri": { name: { hi: "ऋ - ऋषि", mr: "ऋ - ऋषी" }, char: "ऋ" },
        "e": { name: { hi: "ए - एड़ी", mr: "ए - एक" }, char: "ए" },
        "ai": { name: { hi: "ऐ - ऐनक", mr: "ऐ - ऐरण" }, char: "ऐ" },
        "o": { name: { hi: "ओ - ओखली", mr: "ओ - ओझेवाला" }, char: "ओ" },
        "au": { name: { hi: "औ - औरत", mr: "औ - औषध" }, char: "औ" },
        "ang": { name: { hi: "अं - अंगूर", mr: "अं - अंजीर" }, char: "अं" },
        "aha": { name: { hi: "अः - प्रातः", mr: "अः - स्वतः" }, char: "अः" },
        "k": { name: { hi: "क - कबूतर", mr: "क - कमळ" }, char: "क" },
        "kh": { name: { hi: "ख - खरगोश", mr: "ख - खडू" }, char: "ख" },
        "g": { name: { hi: "ग - गमला", mr: "ग - गणपती" }, char: "ग" },
        "gh": { name: { hi: "घ - घर", mr: "घ - घर" }, char: "घ" },
        "dn": { name: { hi: "ङ", mr: "ङ" }, char: "ङ" }, 
        "ch": { name: { hi: "च - चम्मच", mr: "च - चमचा" }, char: "च" },
        "chh": { name: { hi: "छ - छतरी", mr: "छ - छत्री" }, char: "छ" },
        "j": { name: { hi: "ज - जग", mr: "ज - जहाज" }, char: "ज" },
        "jh": { name: { hi: "झ - झंडा", mr: "झ - झेंडा" }, char: "झ" },
        "trh": { name: { hi: "ञ", mr: "ञ" }, char: "ञ" },
        "t1": { name: { hi: "ट - टमाटर", mr: "ट - टरबूज" }, char: "ट" },
        "th1": { name: { hi: "ठ - ठठेरा", mr: "ठ - ठसा" }, char: "ठ" },
        "d1": { name: { hi: "ड - डमरू", mr: "ड - डबा" }, char: "ड" },
        "dh1": { name: { hi: "ढ - ढक्कन", mr: "ढ - ढग" }, char: "ढ" },
        "n1": { name: { hi: "ण - बाण", mr: "ण - बाण" }, char: "ण" },
        "t2": { name: { hi: "त - तरबूज", mr: "त - तलवार" }, char: "त" },
        "th2": { name: { hi: "थ - थर्मस", mr: "थ - थवा" }, char: "थ" },
        "d2": { name: { hi: "द - दवात", mr: "द - दप्तर" }, char: "द" },
        "dh2": { name: { hi: "ध - धनुष", mr: "ध - धनुष्य" }, char: "ध" },
        "n2": { name: { hi: "न - नल", mr: "न - नळ" }, char: "न" },
        "p": { name: { hi: "प - पतंग", mr: "प - पतंग" }, char: "प" },
        "ph": { name: { hi: "फ - फल", mr: "फ - फणस" }, char: "फ" },
        "b": { name: { hi: "ब - बस", mr: "ब - बदक" }, char: "ब" },
        "bh": { name: { hi: "भ - भालू", mr: "भ - भटजी" }, char: "भ" },
        "m": { name: { hi: "म - मछली", mr: "म - मगर" }, char: "म" },
        "y": { name: { hi: "य - यज्ञ", mr: "य - यज्ञ" }, char: "य" },
        "r": { name: { hi: "र - रथ", mr: "र - रथ" }, char: "र" },
        "l": { name: { hi: "ल - लट्टू", mr: "ल - लसूण" }, char: "ल" },
        "v": { name: { hi: "व - वन", mr: "व - वजन" }, char: "व" },
        "sh": { name: { hi: "श - शलगम", mr: "श - शहामृग" }, char: "श" },
        "shh": { name: { hi: "ष - षट्कोण", mr: "ष - षटकोन" }, char: "ष" },
        "s": { name: { hi: "स - सेब", mr: "स - ससा" }, char: "स" },
        "h": { name: { hi: "ह - हाथी", mr: "ह - हत्ती" }, char: "ह" },
        "ksh": { name: { hi: "क्ष - क्षत्रिय", mr: "क्ष - क्षत्रिय" }, char: "क्ष" },
        "tr": { name: { hi: "त्र - त्रिशूल", mr: "त्र - त्रिशूळ" }, char: "त्र" },
        "gy": { name: { hi: "ज्ञ - ज्ञानी", mr: "ज्ञ - ज्ञानी" }, char: "ज्ञ" }
    };

    const allVarnmalaKeys = Object.keys(varnmalaDict);
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
        
        if (targetVarnmalaKey) {
            document.getElementById("target-varnmala-name").innerText = varnmalaDict[targetVarnmalaKey].name[currentLang];
        }

        // Bubbles don't need to change text since Devanagari characters are the same in Hindi and Marathi
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
        if (!targetVarnmalaKey) return; 
        stopAllAudio(); 

        activePrompt1 = new Audio(`sounds/${currentLang}/tap_all.mp3`);
        // CORRECTED FOLDER: 'varnamala' to match your main app exactly
        activePrompt2 = new Audio(`sounds/${currentLang}/varnamala/${targetVarnmalaKey}.mp3`);

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
        
        targetVarnmalaKey = allVarnmalaKeys[Math.floor(Math.random() * allVarnmalaKeys.length)];
        document.getElementById("target-varnmala-name").innerText = varnmalaDict[targetVarnmalaKey].name[currentLang];

        setTimeout(playCustomAudio, 500);

        let gridPositions = [];
        for (let r = 1; r <= 4; r++) {
            for (let c = 1; c <= 5; c++) { gridPositions.push({ r: r, c: c }); }
        }
        gridPositions.sort(() => Math.random() - 0.5); 

        let itemPool = [];
        for(let i = 0; i < totalTargetsRequired; i++) itemPool.push(targetVarnmalaKey);
        
        while(itemPool.length < 20) {
            let randomDecoy = allVarnmalaKeys[Math.floor(Math.random() * allVarnmalaKeys.length)];
            if(randomDecoy !== targetVarnmalaKey) itemPool.push(randomDecoy);
        }
        itemPool.sort(() => Math.random() - 0.5);

        itemPool.forEach((vKey, index) => {
            let pos = gridPositions[index];
            let topPercent = (pos.r * 20) - 10 + (Math.random() * 4 - 2); 
            let leftPercent = (pos.c * 20) - 10 + (Math.random() * 4 - 2);

            const bubble = document.createElement("div");
            bubble.className = "letter-bubble"; 
            bubble.dataset.key = vKey; 
            // The character (e.g. "अ")
            bubble.innerText = varnmalaDict[vKey].char;
            
            bubble.style.top = `${topPercent}%`;
            bubble.style.left = `${leftPercent}%`;
            bubble.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 30 - 15}deg)`;

            bubble.onclick = () => handleTap(bubble, vKey);
            gameArea.appendChild(bubble);
        });
    }

    function handleTap(bubble, tappedKey) {
        if (!isPlaying || bubble.classList.contains("correct")) return;
        stopAllAudio(); 

        if (tappedKey === targetVarnmalaKey) {
            bubble.classList.add("correct");
            targetsFound++;
            score += 5;
            document.getElementById("score").innerText = score;
            
            // CORRECTED FOLDER: 'varnamala'
            activeEffectAudio = new Audio(`sounds/${currentLang}/varnamala/${targetVarnmalaKey}.mp3`);
            
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
            sessionStorage.setItem('tapVarnmalaScore', score);
            sessionStorage.setItem('tapVarnmalaThemeIndex', (themeIndex + 1) % themes.length);
            window.location.reload(); 
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=hindi";
        window.location.href = returnUrl; 
    });

    // Ensure UI is set to the correct language on first load
    updateLanguage(currentLang);
    startNewRound();
};