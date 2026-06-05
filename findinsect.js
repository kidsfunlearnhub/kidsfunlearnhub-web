window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findInsectThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findInsectLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findInsectScore')) || 0;
    
    let targetInsectKey = "";
    let isPlaying = false;
    let isAudioPlaying = false; 

    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 

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
        "game-title": { en: "🪰 Find The Insect!", hi: "🪰 कीड़े खोजें!", mr: "🪰 कीटक शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is the...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find The Insect Game | KidsFunLearnHub", hi: "कीड़े खोजें खेल | KidsFunLearnHub", mr: "कीटक शोधा खेळ | KidsFunLearnHub" }
    };

    const insectDict = {
        "ant": { en: "Ant", hi: "चींटी", mr: "मुंगी" },
        "bee": { en: "Bee", hi: "मधुमक्खी", mr: "मधमाशी" },
        "butterfly": { en: "Butterfly", hi: "तितली", mr: "फुलपाखरू" },
        "mosquito": { en: "Mosquito", hi: "मच्छर", mr: "डास" },
        "housefly": { en: "Housefly", hi: "मक्खी", mr: "माशी" },
        "dragonfly": { en: "Dragonfly", hi: "ड्रैगनफ्लाई", mr: "चतुर" },
        "grasshopper": { en: "Grasshopper", hi: "टिड्डा", mr: "नाकतोडा" },
        "cricket": { en: "Cricket", hi: "झींगुर", mr: "रातकिडा" },
        "ladybug": { en: "Ladybug", hi: "लेडीबग", mr: "सोनकिडा" },
        "termite": { en: "Termite", hi: "दीमक", mr: "वाळवी" },
        "beetle": { en: "Beetle", hi: "भृंग", mr: "भुंगा" },
        "moth": { en: "Moth", hi: "पतंगा", mr: "पतंग" },
        "firefly": { en: "Firefly", hi: "जुगनू", mr: "काजवा" },
        "wasp": { en: "Wasp", hi: "ततैया", mr: "गांधीलमाशी" },
        "hornet": { en: "Hornet", hi: "हॉर्नेट", mr: "मोठी गांधीलमाशी" },
        "weevil": { en: "Weevil", hi: "घुन", mr: "सोंड्या कीटक" },
        "aphid": { en: "Aphid", hi: "माहू", mr: "मावा" },
        "caterpillar": { en: "Caterpillar", hi: "इल्ली", mr: "सुरवंट" },
        "leafhopper": { en: "Leafhopper", hi: "फुदका", mr: "तुडतुडे" },
        "planthopper": { en: "Planthopper", hi: "प्लांटहॉपर", mr: "प्लांटहॉपर" },
        "mantis": { en: "Mantis", hi: "मैंटिस", mr: "मँटिस" },
        "stick insect": { en: "Stick Insect", hi: "लकड़ी कीड़ा", mr: "काडीकिडा" },
        "water strider": { en: "Water Strider", hi: "वाटर स्ट्राइडर", mr: "पाणकिडा" },
        "dung beetle": { en: "Dung Beetle", hi: "गोबरैला", mr: "शेणकिडा" },
        "carpenter ant": { en: "Carpenter Ant", hi: "बढ़ई चींटी", mr: "सुतार मुंगी" },
        "red ant": { en: "Red Ant", hi: "लाल चींटी", mr: "लाल मुंगी" },
        "silkworm": { en: "Silkworm", hi: "रेशम का कीड़ा", mr: "रेशीम कीटक" },
        "lacewing": { en: "Lacewing", hi: "लेसविंग", mr: "लेसविंग" },
        "bumblebee": { en: "Bumblebee", hi: "भौंरा", mr: "बंबलबी" },
        "fruit fly": { en: "Fruit Fly", hi: "फल मक्खी", mr: "फळमाशी" }
    };

    const allInsects = Object.keys(insectDict);
    document.getElementById("score").innerText = score;

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

    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('findInsectLang', lang); 
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetInsectKey) {
            document.getElementById("target-insect-name").innerText = insectDict[targetInsectKey][currentLang];
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio(); 
        });
    });

    function playCustomAudio() {
        if (isAudioPlaying || !targetInsectKey) return; 
        isAudioPlaying = true;
        let part1, part2;

        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/insects/${targetInsectKey}.mp3`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/insects/${targetInsectKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/insects/${targetInsectKey}.mp3`);
            part2 = new Audio(`sounds/mr/kuthe_aahe.mp3`);
        }

        part1.play().catch(e => isAudioPlaying = false);
        part1.onended = () => {
            part2.play().catch(e => isAudioPlaying = false);
            part2.onended = () => { isAudioPlaying = false; };
        };
    }

    document.getElementById("promptBox").addEventListener("click", playCustomAudio);

    function startNewRound() {
        isPlaying = true;
        updateProgressTrack(false, roundsPlayedThisSession);

        const grid = document.getElementById("gameGrid");
        grid.innerHTML = "";
        
        let shuffled = [...allInsects].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetInsectKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-insect-name").innerText = insectDict[targetInsectKey][currentLang];

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(insectKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + insectDict[insectKey]['en']);
            card.innerHTML = `<img src="images/insects/${insectKey}.webp" alt="${insectDict[insectKey]['en']}">`;
            card.onclick = () => handleGuess(insectKey, card);
            grid.appendChild(card);
        });
    }

    function handleGuess(guessedKey, cardElement) {
        if (!isPlaying) return;

        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        if (guessedKey === targetInsectKey) {
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
                    feedbackText.innerText = insectDict[targetInsectKey][currentLang];
                    feedbackImg.src = `images/insects/${targetInsectKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let insectNameAudio = new Audio(`sounds/${currentLang}/insects/${targetInsectKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        insectNameAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findInsectScore', score);
                            sessionStorage.setItem('findInsectLang', currentLang);
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findInsectThemeIndex', nextThemeIndex);
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

                    insectNameAudio.play().then(() => {
                        insectNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
                    }).catch(e => { autoTimer = setTimeout(advanceToNext, 2000); });
                };

                greatJobAudio.play().then(() => {
                    greatJobAudio.onended = triggerPhaseTwo;
                }).catch(() => { setTimeout(triggerPhaseTwo, 1500); });

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

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('findInsectScore'); 
        sessionStorage.removeItem('findInsectThemeIndex');
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};