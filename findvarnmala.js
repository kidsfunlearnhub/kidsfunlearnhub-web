"use strict";

window.onload = function() {
    // --- THEME ROTATION SETUP ---
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findVarnmalaThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // Default to Hindi if coming from an English game, else use saved
    let currentLang = sessionStorage.getItem('findAbcLang'); 
    if (!currentLang || currentLang === 'en') {
        currentLang = 'hi';
    }
    
    let score = parseInt(sessionStorage.getItem('findVarnmalaScore')) || 0;
    
    let targetVarnmalaKey = "";
    let isPlaying = false;
    let isAudioPlaying = false; 

    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 

    // --- SOUND SYNTHESIZER ---
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

    // UI Dictionary (Hindi & Marathi Only)
    const uiDict = {
        "game-title": { hi: "🔠 वर्णमाला खोजें!", mr: "🔠 वर्णमाला शोधा!" },
        "score-label": { hi: "स्कोर:", mr: "गुण:" },
        "instruction": { hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { hi: "वर्णमाला खोजें खेल | KidsFunLearnHub", mr: "वर्णमाला शोधा खेळ | KidsFunLearnHub" }
    };

    const varnmalaDict = {
        "a": { hi: "अ - अनार", mr: "अ - अननस" },
        "aa": { hi: "आ - आम", mr: "आ - आई" },
        "i": { hi: "इ - इमली", mr: "इ - इमारत" },
        "ee": { hi: "ई - ईख", mr: "ई - इडलिंबू" },
        "u": { hi: "उ - उल्लू", mr: "उ - उखळ" },
        "oo": { hi: "ऊ - ऊन", mr: "ऊ - ऊस" },
        "ri": { hi: "ऋ - ऋषि", mr: "ऋ - ऋषी" },
        "e": { hi: "ए - एड़ी", mr: "ए - एक" },
        "ai": { hi: "ऐ - ऐनक", mr: "ऐ - ऐरण" },
        "o": { hi: "ओ - ओखली", mr: "ओ - ओझेवाला" },
        "au": { hi: "औ - औरत", mr: "औ - औषध" },
        "ang": { hi: "अं - अंगूर", mr: "अं - अंजीर" },
        "aha": { hi: "अः - प्रातः", mr: "अः - स्वतः" },
        "k": { hi: "क - कबूतर", mr: "क - कमळ" },
        "kh": { hi: "ख - खरगोश", mr: "ख - खडू" },
        "g": { hi: "ग - गमला", mr: "ग - गणपती" },
        "gh": { hi: "घ - घर", mr: "घ - घर" },
        "dn": { hi: "ङ", mr: "ङ" }, 
        "ch": { hi: "च - चम्मच", mr: "च - चमचा" },
        "chh": { hi: "छ - छतरी", mr: "छ - छत्री" },
        "j": { hi: "ज - जग", mr: "ज - जहाज" },
        "jh": { hi: "झ - झंडा", mr: "झ - झेंडा" },
        "trh": { hi: "ञ", mr: "ञ" },
        "t1": { hi: "ट - टमाटर", mr: "ट - टरबूज" },
        "th1": { hi: "ठ - ठठेरा", mr: "ठ - ठसा" },
        "d1": { hi: "ड - डमरू", mr: "ड - डबा" },
        "dh1": { hi: "ढ - ढक्कन", mr: "ढ - ढग" },
        "n1": { hi: "ण - बाण", mr: "ण - बाण" },
        "t2": { hi: "त - तरबूज", mr: "त - तलवार" },
        "th2": { hi: "थ - थर्मस", mr: "थ - थवा" },
        "d2": { hi: "द - दवात", mr: "द - दप्तर" },
        "dh2": { hi: "ध - धनुष", mr: "ध - धनुष्य" },
        "n2": { hi: "न - नल", mr: "न - नळ" },
        "p": { hi: "प - पतंग", mr: "प - पतंग" },
        "ph": { hi: "फ - फल", mr: "फ - फणस" },
        "b": { hi: "ब - बस", mr: "ब - बदक" },
        "bh": { hi: "भ - भालू", mr: "भ - भटजी" },
        "m": { hi: "म - मछली", mr: "म - मगर" },
        "y": { hi: "य - यज्ञ", mr: "य - यज्ञ" },
        "r": { hi: "र - रथ", mr: "र - रथ" },
        "l": { hi: "ल - लट्टू", mr: "ल - लसूण" },
        "v": { hi: "व - वन", mr: "व - वजन" },
        "sh": { hi: "श - शलगम", mr: "श - शहामृग" },
        "shh": { hi: "ष - षट्कोण", mr: "ष - षटकोन" },
        "s": { hi: "स - सेब", mr: "स - ससा" },
        "h": { hi: "ह - हाथी", mr: "ह - हत्ती" },
        "ksh": { hi: "क्ष - क्षत्रिय", mr: "क्ष - क्षत्रिय" },
        "tr": { hi: "त्र - त्रिशूल", mr: "त्र - त्रिशूळ" },
        "gy": { hi: "ज्ञ - ज्ञानी", mr: "ज्ञ - ज्ञानी" }
    };

    const allVarnmalaKeys = Object.keys(varnmalaDict);
    document.getElementById("score").innerText = score;

    // --- GENERATE DOTS ---
    function initProgressTrack() {
        const dotsContainer = document.getElementById("dots-container");
        dotsContainer.innerHTML = "";
        for(let i = 0; i <= ROUNDS_BEFORE_RELOAD; i++) {
            let dot = document.createElement("div");
            dot.className = "path-dot";
            dotsContainer.appendChild(dot);
        }
    }

    function updateProgressTrack(isJumping = false, step = 0) {
        const runner = document.getElementById("runner-icon");
        const progressLine = document.getElementById("progress-line"); 
        
        let percentage = (step / ROUNDS_BEFORE_RELOAD) * 100;
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

    // 2. UI & LANGUAGE HANDLING
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
        
        if (targetVarnmalaKey) {
            document.getElementById("target-varnmala-name").innerText = varnmalaDict[targetVarnmalaKey][currentLang];
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio(); 
        });
    });

    // 3. SEQUENTIAL AUDIO PLAYBACK (Letter + "Kahan Hai")
    function playCustomAudio() {
        if (isAudioPlaying || !targetVarnmalaKey) return; 
        isAudioPlaying = true;

        let part1, part2;

        if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/varnamala/${targetVarnmalaKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/varnamala/${targetVarnmalaKey}.mp3`);
            part2 = new Audio(`sounds/mr/kuthe_aahe.mp3`);
        }

        part1.play().catch(e => isAudioPlaying = false);

        part1.onended = () => {
            part2.play().catch(e => isAudioPlaying = false);
            part2.onended = () => { isAudioPlaying = false; };
        };
    }

    document.getElementById("promptBox").addEventListener("click", playCustomAudio);

    // 4. CORE GAME LOGIC
    function startNewRound() {
        isPlaying = true;
        
        updateProgressTrack(false, roundsPlayedThisSession);

        const grid = document.getElementById("gameGrid");
        grid.innerHTML = "";
        
        let shuffled = [...allVarnmalaKeys].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetVarnmalaKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-varnmala-name").innerText = varnmalaDict[targetVarnmalaKey][currentLang];

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(vKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + varnmalaDict[vKey]['hi']);
            
            // Displays the letter images in the 4 grid slots
            card.innerHTML = `<img src="images/varnamala/letters/${vKey}.webp" alt="${varnmalaDict[vKey]['hi']}">`;
            card.onclick = () => handleGuess(vKey, card);
            grid.appendChild(card);
        });
    }

    // 5. HANDLING THE GUESS & REWARD SEQUENCE
    function handleGuess(guessedKey, cardElement) {
        if (!isPlaying) return;

        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        if (guessedKey === targetVarnmalaKey) {
            isPlaying = false;
            score += 10;
            document.getElementById("score").innerText = score;
            
            updateProgressTrack(true, roundsPlayedThisSession + 1);

            setTimeout(() => {
                feedbackScore.innerText = uiDict["total-score"][currentLang] + score;
                feedbackScore.classList.remove("hidden");

                feedbackText.innerText = uiDict["correct"][currentLang];
                feedbackText.className = "correct-text";
                feedbackImg.classList.add("hidden"); 
                feedback.classList.remove("hidden");
                
                feedback.onclick = null; 

                if (typeof confetti === "function") {
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
                }

                let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
                
                const triggerPhaseTwo = () => {
                    feedbackText.innerText = varnmalaDict[targetVarnmalaKey][currentLang];
                    
                    // Displays the vocabulary word image (e.g. The Apple/Anar) as the reward!
                    feedbackImg.src = `images/varnamala/words/${currentLang}/${targetVarnmalaKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let wordAudio = new Audio(`sounds/${currentLang}/varnamala/${targetVarnmalaKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        wordAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findVarnmalaScore', score);
                            sessionStorage.setItem('findAbcLang', currentLang);
                            
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findVarnmalaThemeIndex', nextThemeIndex);
                            
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => {
                        feedback.onclick = advanceToNext;
                    }, 500);

                    wordAudio.play().then(() => {
                        wordAudio.onended = () => {
                            autoTimer = setTimeout(advanceToNext, 1600); 
                        };
                    }).catch(e => {
                        autoTimer = setTimeout(advanceToNext, 2000);
                    });
                };

                greatJobAudio.play().then(() => {
                    greatJobAudio.onended = triggerPhaseTwo;
                }).catch(() => {
                    setTimeout(triggerPhaseTwo, 1500); 
                });

            }, 800); 

        } else {
            cardElement.classList.add("shake");
            feedbackText.innerText = uiDict["wrong"][currentLang];
            feedbackText.className = "wrong-text";
            feedbackImg.classList.add("hidden"); 
            feedbackScore.classList.add("hidden"); 
            feedback.classList.remove("hidden");
            feedback.onclick = null;

            let tryAgainAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Try again audio not found"));

            setTimeout(() => {
                feedback.classList.add("hidden");
                cardElement.classList.remove("shake");
            }, 1200);
        }
    }

    // 6. BACK BUTTON ACTION
    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('findVarnmalaScore'); 
        sessionStorage.removeItem('findVarnmalaThemeIndex');
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=hindi";
        window.location.href = returnUrl; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};