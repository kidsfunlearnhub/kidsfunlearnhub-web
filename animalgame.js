window.onload = function() {
    // 1. STATE & LOCALIZATION SETUP (Now with sessionStorage!)
    let currentLang = sessionStorage.getItem('findAnimalLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findAnimalScore')) || 0;
    
    let targetAnimalKey = "";
    let isPlaying = false;
    let isAudioPlaying = false; 

    // Tracker for pageviews
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; // Refreshes page after 5 rounds

    const uiDict = {
        "game-title": { en: "🐾 Find The Animal!", hi: "🐾 जानवर खोजें!", mr: "🐾 प्राणी शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is the...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " }
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

    // Initial Score Display
    document.getElementById("score").innerText = score;

    // 2. UI & LANGUAGE HANDLING
    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('findAnimalLang', lang); // Save choice
        
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

    // 3. SEQUENTIAL AUDIO PLAYBACK (The Question)
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
            card.innerHTML = `<img src="images/animals/${animalKey}.webp" alt="${animalKey}">`;
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
            
            // Setup Score Text for the pop-up
            feedbackScore.innerText = uiDict["total-score"][currentLang] + score;
            feedbackScore.classList.remove("hidden");

            // Phase 1: "Great Job!"
            feedbackText.innerText = uiDict["correct"][currentLang];
            feedbackText.className = "correct-text";
            feedbackImg.classList.add("hidden"); 
            feedback.classList.remove("hidden");
            
            feedback.onclick = null; 

            if (typeof confetti === "function") {
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
            }

            let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
            
            // Phase 2: Show Animal Name + Image + Sound
            const triggerPhaseTwo = () => {
                feedbackText.innerText = animalDict[targetAnimalKey][currentLang];
                feedbackImg.src = `images/animals/${targetAnimalKey}.webp`;
                feedbackImg.classList.remove("hidden"); 

                let animalNameAudio = new Audio(`sounds/${currentLang}/animals/${targetAnimalKey}.mp3`);
                
                // --- RELOAD LOGIC ADDED HERE ---
                let hasAdvanced = false;
                let autoTimer;

                const advanceToNext = () => {
                    if (hasAdvanced) return; 
                    hasAdvanced = true;
                    clearTimeout(autoTimer); 
                    animalNameAudio.pause(); 
                    feedback.onclick = null; 
                    feedback.classList.add("hidden");
                    
                    roundsPlayedThisSession++; // Increment tracker
                    
                    // Check if it's time to force a pageview
                    if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                        sessionStorage.setItem('findAnimalScore', score);
                        sessionStorage.setItem('findAnimalLang', currentLang);
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

        } else {
            // --- WRONG GUESS SEQUENCE ---
            cardElement.classList.add("shake");
            feedbackText.innerText = uiDict["wrong"][currentLang];
            feedbackText.className = "wrong-text";
            feedbackImg.classList.add("hidden"); 
            feedbackScore.classList.add("hidden"); // Hide score for wrong guess
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
        sessionStorage.removeItem('findAnimalScore'); // Clear score on exit
        window.location.href = "index.html"; 
    });

    // Initialize
    updateLanguage(currentLang);
    startNewRound();
};