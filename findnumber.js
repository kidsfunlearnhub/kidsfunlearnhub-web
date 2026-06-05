"use strict";

window.onload = function() {
    // --- THEME ROTATION SETUP ---
    const themes = [
        { runner: '✏️', target: '📓' }, 
        { runner: '🐢', target: '🌊' }, 
        { runner: '🧸', target: '🎈' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findNumberThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    // Inject the correct emojis into the HTML
    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // 1. STATE & LOCALIZATION SETUP
    let currentLang = sessionStorage.getItem('findNumberLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findNumberScore')) || 0;
    
    let targetNumberKey = "";
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
        "game-title": { en: "🔢 Find The Number!", hi: "🔢 नंबर खोजें!", mr: "🔢 क्रमांक शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find The Number Game | KidsFunLearnHub", hi: "नंबर खोजें खेल | KidsFunLearnHub", mr: "क्रमांक शोधा खेळ | KidsFunLearnHub" }
    };

    const numbersDict = {
        "1": { en: "One", hi: "एक", mr: "एक" },
        "2": { en: "Two", hi: "दो", mr: "दोन" },
        "3": { en: "Three", hi: "तीन", mr: "तीन" },
        "4": { en: "Four", hi: "चार", mr: "चार" },
        "5": { en: "Five", hi: "पांच", mr: "पाच" },
        "6": { en: "Six", hi: "छह", mr: "सहा" },
        "7": { en: "Seven", hi: "सात", mr: "सात" },
        "8": { en: "Eight", hi: "आठ", mr: "आठ" },
        "9": { en: "Nine", hi: "नौ", mr: "नऊ" },
        "10": { en: "Ten", hi: "दस", mr: "दहा" },
        "11": { en: "Eleven", hi: "ग्यारह", mr: "अकरा" },
        "12": { en: "Twelve", hi: "बारह", mr: "बारा" },
        "13": { en: "Thirteen", hi: "तेरह", mr: "तेरा" },
        "14": { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        "15": { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" },
        "16": { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        "17": { en: "Seventeen", hi: "सत्रह", mr: "सतरा" },
        "18": { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        "19": { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" },
        "20": { en: "Twenty", hi: "बीस", mr: "वीस" },
        "21": { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" },
        "22": { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        "23": { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" },
        "24": { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        "25": { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" },
        "26": { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        "27": { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" },
        "28": { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        "29": { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" },
        "30": { en: "Thirty", hi: "तीस", mr: "तीस" },
        "31": { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" },
        "32": { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        "33": { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" },
        "34": { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        "35": { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" },
        "36": { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        "37": { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" },
        "38": { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        "39": { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" },
        "40": { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    const allNumbers = Object.keys(numbersDict);
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
        sessionStorage.setItem('findNumberLang', lang); 
        
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetNumberKey) {
            document.getElementById("target-number-name").innerText = numbersDict[targetNumberKey][currentLang];
        }

        // If playing, re-render grid so the Devanagari numerals update instantly when switching languages
        if (isPlaying) {
            renderGridOptions(Array.from(document.getElementById("gameGrid").children).map(c => c.getAttribute("data-key")));
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio(); 
        });
    });

    // Determine the correct image folder for numerals
    function getImageFolder() {
        return (currentLang === 'hi' || currentLang === 'mr') ? 'devanagari' : 'en';
    }

    function renderGridOptions(options) {
        const grid = document.getElementById("gameGrid");
        grid.innerHTML = "";
        const imageFolder = getImageFolder();

        options.forEach(numKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("data-key", numKey); // Store key for dynamic re-rendering
            card.setAttribute("aria-label", "Select " + numbersDict[numKey]['en']);
            card.innerHTML = `<img src="images/numbers/digits/${imageFolder}/${numKey}.webp" alt="${numbersDict[numKey]['en']}">`;
            card.onclick = () => handleGuess(numKey, card);
            grid.appendChild(card);
        });
    }

    // 3. SEQUENTIAL AUDIO PLAYBACK
    function playCustomAudio() {
        if (isAudioPlaying || !targetNumberKey) return; 
        isAudioPlaying = true;

        let part1, part2;

        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/numbers/${targetNumberKey}.mp3`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/numbers/${targetNumberKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/numbers/${targetNumberKey}.mp3`);
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

        let shuffled = [...allNumbers].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetNumberKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-number-name").innerText = numbersDict[targetNumberKey][currentLang];

        renderGridOptions(currentOptions);
        setTimeout(playCustomAudio, 500);
    }

    // 5. HANDLING THE GUESS & REWARD SEQUENCE
    function handleGuess(guessedKey, cardElement) {
        if (!isPlaying) return;

        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        if (guessedKey === targetNumberKey) {
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
                    feedbackText.innerText = numbersDict[targetNumberKey][currentLang];
                    // Display the counting object image as the reward!
                    feedbackImg.src = `images/numbers/objects/${targetNumberKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let numberAudio = new Audio(`sounds/${currentLang}/numbers/${targetNumberKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        numberAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findNumberScore', score);
                            sessionStorage.setItem('findNumberLang', currentLang);
                            
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findNumberThemeIndex', nextThemeIndex);
                            
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => {
                        feedback.onclick = advanceToNext;
                    }, 500);

                    numberAudio.play().then(() => {
                        numberAudio.onended = () => {
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
        sessionStorage.removeItem('findNumberScore'); 
        sessionStorage.removeItem('findNumberThemeIndex');
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    // Initialize
    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};