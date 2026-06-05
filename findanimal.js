window.onload = function() {
    // --- THEME ROTATION SETUP ---
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findAnimalThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    // Inject the correct emojis into the HTML
    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // 1. STATE & LOCALIZATION SETUP
    let currentLang = sessionStorage.getItem('findAnimalLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findAnimalScore')) || 0;
    
    let targetAnimalKey = "";
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
        "game-title": { en: "🐾 Find The Animal!", hi: "🐾 जानवर खोजें!", mr: "🐾 प्राणी शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is the...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find The Animal Game | KidsFunLearnHub", hi: "जानवर खोजें खेल | KidsFunLearnHub", mr: "प्राणी शोधा खेळ | KidsFunLearnHub" }
    };

    const animalDict = {
        "dog": { en: "Dog", hi: "कुत्ता", mr: "कुत्रा" },
        "cat": { en: "Cat", hi: "बिल्ली", mr: "मांजर" },
        "lion": { en: "Lion", hi: "शेर", mr: "सिंह" },
        "tiger": { en: "Tiger", hi: "बाघ", mr: "वाघ" },
        "elephant": { en: "Elephant", hi: "हाथी", mr: "हत्ती" },
        "monkey": { en: "Monkey", hi: "बंदर", mr: "माकड" },
        "cow": { en: "Cow", hi: "गाय", mr: "गाय" },
        "horse": { en: "Horse", hi: "घोड़ा", mr: "घोडा" },
        "goat": { en: "Goat", hi: "बकरी", mr: "शेळी" },
        "bear": { en: "Bear", hi: "भालू", mr: "अस्वल" },
        "zebra": { en: "Zebra", hi: "ज़ेबरा", mr: "झेब्रा" },
        "giraffe": { en: "Giraffe", hi: "जिराफ़", mr: "जिराफ" },
        "rabbit": { en: "Rabbit", hi: "खरगोश", mr: "ससा" },
        "fox": { en: "Fox", hi: "लोमड़ी", mr: "कोल्हा" },
        "deer": { en: "Deer", hi: "हिरण", mr: "हरीण" },
        "camel": { en: "Camel", hi: "ऊंट", mr: "उंट" },
        "wolf": { en: "Wolf", hi: "भेड़िया", mr: "लांडगा" },
        "kangaroo": { en: "Kangaroo", hi: "कंगारू", mr: "कांगारू" },
        "panda": { en: "Panda", hi: "पांडा", mr: "पांडा" },
        "rhino": { en: "Rhino", hi: "गैंडा", mr: "गेंडा" },
        "hippo": { en: "Hippo", hi: "दरियाई घोड़ा", mr: "पाणघोडा" },
        "cheetah": { en: "Cheetah", hi: "चीता", mr: "चित्ता" },
        "buffalo": { en: "Buffalo", hi: "भैंस", mr: "म्हैस" },
        "donkey": { en: "Donkey", hi: "गधा", mr: "गाढव" },
        "pig": { en: "Pig", hi: "सूअर", mr: "डुक्कर" },
        "sheep": { en: "Sheep", hi: "भेड़", mr: "मेंढी" },
        "yak": { en: "Yak", hi: "याक", mr: "याक" },
        "otter": { en: "Otter", hi: "ऊदबिलाव", mr: "पाणमांजर" },
        "squirrel": { en: "Squirrel", hi: "गिलहरी", mr: "खारूताई" },
        "leopard": { en: "Leopard", hi: "तेंदुआ", mr: "बिबट्या" }
    };

    const allAnimals = Object.keys(animalDict);
    document.getElementById("score").innerText = score;

    // --- GENERATE DOTS ---
    function initProgressTrack() {
        const dotsContainer = document.getElementById("dots-container");
        dotsContainer.innerHTML = "";
        
        // Find Animal is 1 match per round. So 5 total steps to reach the end.
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
        sessionStorage.setItem('findAnimalLang', lang); 
        
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetAnimalKey) {
            document.getElementById("target-animal-name").innerText = animalDict[targetAnimalKey][currentLang];
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
        if (isAudioPlaying || !targetAnimalKey) return; 
        isAudioPlaying = true;

        let part1, part2;

        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/animals/${targetAnimalKey}.mp3`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/animals/${targetAnimalKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/animals/${targetAnimalKey}.mp3`);
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
        
        // Ensure character is positioned at current rounds played
        updateProgressTrack(false, roundsPlayedThisSession);

        const grid = document.getElementById("gameGrid");
        grid.innerHTML = "";
        
        let shuffled = [...allAnimals].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetAnimalKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-animal-name").innerText = animalDict[targetAnimalKey][currentLang];

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(animalKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + animalDict[animalKey]['en']);
            card.innerHTML = `<img src="images/animals/${animalKey}.webp" alt="${animalDict[animalKey]['en']}">`;
            card.onclick = () => handleGuess(animalKey, card);
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

        if (guessedKey === targetAnimalKey) {
            // --- CORRECT GUESS SEQUENCE ---
            isPlaying = false;
            score += 10;
            document.getElementById("score").innerText = score;
            
            // 1. Hop character immediately! 
            updateProgressTrack(true, roundsPlayedThisSession + 1);

            // 2. NEW: Wait 800ms to let the jump finish before showing the big celebration screen
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
                    feedbackText.innerText = animalDict[targetAnimalKey][currentLang];
                    feedbackImg.src = `images/animals/${targetAnimalKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let animalNameAudio = new Audio(`sounds/${currentLang}/animals/${targetAnimalKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        animalNameAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findAnimalScore', score);
                            sessionStorage.setItem('findAnimalLang', currentLang);
                            
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findAnimalThemeIndex', nextThemeIndex);
                            
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => {
                        feedback.onclick = advanceToNext;
                    }, 500);

                    animalNameAudio.play().then(() => {
                        animalNameAudio.onended = () => {
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

            }, 800); // <-- This is the magic delay!

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
        sessionStorage.removeItem('findAnimalScore'); 
        sessionStorage.removeItem('findAnimalThemeIndex');
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl;
    });

    // Initialize
    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};