"use strict";

window.onload = function() {
    // --- THEME ROTATION SETUP ---
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findAbcThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    // Inject the correct emojis into the HTML
    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // 1. STATE & LOCALIZATION SETUP
    let currentLang = sessionStorage.getItem('findAbcLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findAbcScore')) || 0;
    
    let targetLetterKey = "";
    let isPlaying = false;
    let isAudioPlaying = false; 

    // Tracker for pageviews
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

    const uiDict = {
        "game-title": { en: "🔠 Find The Alphabet!", hi: "🔠 अक्षर खोजें!", mr: "🔠 अक्षर शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find The Alphabet Game | KidsFunLearnHub", hi: "अक्षर खोजें खेल | KidsFunLearnHub", mr: "अक्षर शोधा खेळ | KidsFunLearnHub" }
    };

    const abcDict = {
        "a": { en: "A for Apple", hi: "A - सेब", mr: "A - सफरचंद" },
        "b": { en: "B for Ball", hi: "B - गेंद", mr: "B - चेंडू" },
        "c": { en: "C for Cat", hi: "C - बिल्ली", mr: "C - मांजर" },
        "d": { en: "D for Dog", hi: "D - कुत्ता", mr: "D - कुत्रा" },
        "e": { en: "E for Elephant", hi: "E - हाथी", mr: "E - हत्ती" },
        "f": { en: "F for Fish", hi: "F - मछली", mr: "F - मासा" },
        "g": { en: "G for Grapes", hi: "G - अंगूर", mr: "G - द्राक्षे" },
        "h": { en: "H for Horse", hi: "H - घोड़ा", mr: "H - घोडा" },
        "i": { en: "I for Ice Cream", hi: "I - आइसक्रीम", mr: "I - आईस्क्रीम" },
        "j": { en: "J for Jug", hi: "J - जग", mr: "J - जग" },
        "k": { en: "K for Kite", hi: "K - पतंग", mr: "K - पतंग" },
        "l": { en: "L for Lion", hi: "L - शेर", mr: "L - सिंह" },
        "m": { en: "M for Monkey", hi: "M - बंदर", mr: "M - माकड" },
        "n": { en: "N for Nest", hi: "N - घोंसला", mr: "N - घरटे" },
        "o": { en: "O for Orange", hi: "O - संतरा", mr: "O - संत्री" },
        "p": { en: "P for Parrot", hi: "P - तोता", mr: "P - पोपट" },
        "q": { en: "Q for Queen", hi: "Q - रानी", mr: "Q - राणी" },
        "r": { en: "R for Rabbit", hi: "R - खरगोश", mr: "R - ससा" },
        "s": { en: "S for Sun", hi: "S - सूरज", mr: "S - सूर्य" },
        "t": { en: "T for Tiger", hi: "T - बाघ", mr: "T - वाघ" },
        "u": { en: "U for Umbrella", hi: "U - छाता", mr: "U - छत्री" },
        "v": { en: "V for Van", hi: "V - वैन", mr: "V - व्हॅन" },
        "w": { en: "W for Watch", hi: "W - घड़ी", mr: "W - घड्याळ" },
        "x": { en: "X for X-ray", hi: "X - एक्स-रे", mr: "X - एक्स-रे" },
        "y": { en: "Y for Yak", hi: "Y - याक", mr: "Y - याक" },
        "z": { en: "Z for Zebra", hi: "Z - ज़ेबरा", mr: "Z - झेब्रा" }
    };

    const allLetters = Object.keys(abcDict);
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

    // --- MOVE CHARACTER & DRAW LINE ---
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
        
        if (targetLetterKey) {
            document.getElementById("target-letter-name").innerText = abcDict[targetLetterKey][currentLang];
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio(); 
        });
    });

    // 3. SEQUENTIAL AUDIO PLAYBACK
    function playCustomAudio() {
        if (isAudioPlaying || !targetLetterKey) return; 
        isAudioPlaying = true;

        let part1, part2;

        // Uses the audio files from your ABC section
        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/abc/${targetLetterKey}.mp3`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/abc/${targetLetterKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/abc/${targetLetterKey}.mp3`);
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
        
        let shuffled = [...allLetters].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetLetterKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-letter-name").innerText = abcDict[targetLetterKey][currentLang];

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(letterKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + abcDict[letterKey]['en']);
            card.innerHTML = `<img src="images/abc/letters/${letterKey}.webp" alt="${abcDict[letterKey]['en']}">`;
            card.onclick = () => handleGuess(letterKey, card);
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

        if (guessedKey === targetLetterKey) {
            // --- CORRECT GUESS SEQUENCE ---
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
                    feedbackText.innerText = abcDict[targetLetterKey][currentLang];
                    // Display the vocabulary word image (e.g. the Apple for A) as the reward!
                    feedbackImg.src = `images/abc/words/${targetLetterKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let letterAudio = new Audio(`sounds/${currentLang}/abc/${targetLetterKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        letterAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findAbcScore', score);
                            sessionStorage.setItem('findAbcLang', currentLang);
                            
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findAbcThemeIndex', nextThemeIndex);
                            
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => {
                        feedback.onclick = advanceToNext;
                    }, 500);

                    letterAudio.play().then(() => {
                        letterAudio.onended = () => {
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
            // --- WRONG GUESS SEQUENCE ---
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
        sessionStorage.removeItem('findAbcScore'); 
        sessionStorage.removeItem('findAbcThemeIndex');
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    // Initialize
    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};