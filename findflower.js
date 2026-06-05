window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findFlowerThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findFlowerLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findFlowerScore')) || 0;
    
    let targetFlowerKey = "";
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
        "game-title": { en: "🌹 Find The Flower!", hi: "🌹 फूल खोजें!", mr: "🌹 फूल शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is the...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find The Flower Game | KidsFunLearnHub", hi: "फूल खोजें खेल | KidsFunLearnHub", mr: "फूल शोधा खेळ | KidsFunLearnHub" }
    };

    const flowerDict = {
        "rose": { en: "Rose", hi: "गुलाब", mr: "गुलाब" },
        "tulip": { en: "Tulip", hi: "ट्यूलिप", mr: "ट्यूलिप" },
        "sunflower": { en: "Sunflower", hi: "सूरजमुखी", mr: "सूर्यफूल" },
        "lotus": { en: "Lotus", hi: "कमल", mr: "कमळ" },
        "daisy": { en: "Daisy", hi: "गुलबहार", mr: "डेझी" },
        "lily": { en: "Lily", hi: "कुमुदिनी", mr: "लिली" },
        "orchid": { en: "Orchid", hi: "ऑर्किड", mr: "ऑर्किड" },
        "marigold": { en: "Marigold", hi: "गेंदा", mr: "झेंडू" },
        "jasmine": { en: "Jasmine", hi: "चमेली", mr: "मोगरा" },
        "hibiscus": { en: "Hibiscus", hi: "गुड़हल", mr: "जास्वंद" },
        "lavender": { en: "Lavender", hi: "लैवेंडर", mr: "लॅव्हेंडर" },
        "peony": { en: "Peony", hi: "पियोनी", mr: "पिओनी" },
        "daffodil": { en: "Daffodil", hi: "डैफोडिल", mr: "डॅफोडिल" },
        "cherryblossom": { en: "Cherry Blossom", hi: "चेरी ब्लॉसम", mr: "चेरी ब्लॉसम" },
        "poppy": { en: "Poppy", hi: "खसखस", mr: "खसखस फूल" },
        "magnolia": { en: "Magnolia", hi: "चंपा", mr: "मॅग्नोलिया" },
        "bluebell": { en: "Bluebell", hi: "ब्लूबेल", mr: "ब्लूबेल" },
        "gardenia": { en: "Gardenia", hi: "गार्डेनिया", mr: "गार्डेनिया" },
        "carnation": { en: "Carnation", hi: "कार्नेशन", mr: "कार्नेशन" },
        "iris": { en: "Iris", hi: "आइरिस", mr: "आयरिस" },
        "zinnia": { en: "Zinnia", hi: "ज़िनिया", mr: "झिनिया" },
        "begonia": { en: "Begonia", hi: "बेगोनिया", mr: "बेगोनिया" },
        "camellia": { en: "Camellia", hi: "कैमेलिया", mr: "कॅमेलिया" },
        "petunia": { en: "Petunia", hi: "पेटूनिया", mr: "पिटुनिया" },
        "azalea": { en: "Azalea", hi: "अज़ेलिया", mr: "अझेलिया" },
        "geranium": { en: "Geranium", hi: "जेरेनियम", mr: "जेरेनियम" },
        "snapdragon": { en: "Snapdragon", hi: "स्नैपड्रैगन", mr: "स्नॅपड्रॅगन" },
        "cosmos": { en: "Cosmos", hi: "कॉसमॉस", mr: "कॉसमॉस" },
        "anemone": { en: "Anemone", hi: "एनीमोन", mr: "अॅनिमोन" },
        "buttercup": { en: "Buttercup", hi: "बटरकप", mr: "बटरकप" }
    };

    const allFlowers = Object.keys(flowerDict);
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
        sessionStorage.setItem('findFlowerLang', lang); 
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetFlowerKey) {
            document.getElementById("target-flower-name").innerText = flowerDict[targetFlowerKey][currentLang];
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio(); 
        });
    });

    function playCustomAudio() {
        if (isAudioPlaying || !targetFlowerKey) return; 
        isAudioPlaying = true;
        let part1, part2;

        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/flowers/${targetFlowerKey}.mp3`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/flowers/${targetFlowerKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/flowers/${targetFlowerKey}.mp3`);
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
        
        let shuffled = [...allFlowers].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetFlowerKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-flower-name").innerText = flowerDict[targetFlowerKey][currentLang];

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(flowerKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + flowerDict[flowerKey]['en']);
            card.innerHTML = `<img src="images/flowers/${flowerKey}.webp" alt="${flowerDict[flowerKey]['en']}">`;
            card.onclick = () => handleGuess(flowerKey, card);
            grid.appendChild(card);
        });
    }

    function handleGuess(guessedKey, cardElement) {
        if (!isPlaying) return;

        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        if (guessedKey === targetFlowerKey) {
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
                    feedbackText.innerText = flowerDict[targetFlowerKey][currentLang];
                    feedbackImg.src = `images/flowers/${targetFlowerKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let flowerNameAudio = new Audio(`sounds/${currentLang}/flowers/${targetFlowerKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        flowerNameAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findFlowerScore', score);
                            sessionStorage.setItem('findFlowerLang', currentLang);
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findFlowerThemeIndex', nextThemeIndex);
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

                    flowerNameAudio.play().then(() => {
                        flowerNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
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
        sessionStorage.removeItem('findFlowerScore'); 
        sessionStorage.removeItem('findFlowerThemeIndex');
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};