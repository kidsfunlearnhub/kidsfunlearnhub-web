window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findBodyPartsThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findBodyPartsLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findBodyPartsScore')) || 0;
    
    let targetBodyPartKey = "";
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
        "game-title": { en: "👶 Find The Body Part!", hi: "👶 शरीर का अंग खोजें!", mr: "👶 शरीराचा अवयव शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is the...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find The Body Part Game | KidsFunLearnHub", hi: "शरीर का अंग खोजें खेल | KidsFunLearnHub", mr: "शरीराचा अवयव शोधा खेळ | KidsFunLearnHub" }
    };

    const bodyDictionary = {
        "head": { en: "Head", hi: "सिर", mr: "डोके" },
        "hair": { en: "Hair", hi: "बाल", mr: "केस" },
        "eyes": { en: "Eyes", hi: "आंखें", mr: "डोळे" },
        "cheek": { en: "Cheek", hi: "गाल", mr: "गाल" },
        "nose": { en: "Nose", hi: "नाक", mr: "नाक" },
        "mouth": { en: "Mouth", hi: "मुंह", mr: "तोंड" },
        "ear": { en: "Ear", hi: "कान", mr: "कान" },
        "neck": { en: "Neck", hi: "गर्दन", mr: "मान" },
        "chest": { en: "Chest", hi: "छाती", mr: "छाती" },
        "stomach": { en: "Stomach", hi: "पेट", mr: "पोट" },
        "hand": { en: "Hand", hi: "हाथ", mr: "हात" },
        "fingers": { en: "Fingers", hi: "उंगलियां", mr: "बोटे" },
        "thigh": { en: "Thigh", hi: "जांघ", mr: "मांडी" },
        "knee": { en: "Knee", hi: "घुटना", mr: "गुडघा" },
        "leg": { en: "Leg", hi: "पैर", mr: "पाय" },
        "foot": { en: "Foot", hi: "पैर का पंजा", mr: "पाऊल" }
    };

    const allBodyParts = Object.keys(bodyDictionary);
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
        sessionStorage.setItem('findBodyPartsLang', lang); 
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetBodyPartKey) {
            document.getElementById("target-bodypart-name").innerText = bodyDictionary[targetBodyPartKey][currentLang];
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio(); 
        });
    });

    function playCustomAudio() {
        if (isAudioPlaying || !targetBodyPartKey) return; 
        isAudioPlaying = true;
        let part1, part2;

        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/bodyparts/${targetBodyPartKey}.mp3`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/bodyparts/${targetBodyPartKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/bodyparts/${targetBodyPartKey}.mp3`);
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
        
        let shuffled = [...allBodyParts].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetBodyPartKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-bodypart-name").innerText = bodyDictionary[targetBodyPartKey][currentLang];

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(partKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + bodyDictionary[partKey]['en']);
            card.innerHTML = `<img src="images/bodyparts/${partKey}.webp" alt="${bodyDictionary[partKey]['en']}">`;
            card.onclick = () => handleGuess(partKey, card);
            grid.appendChild(card);
        });
    }

    function handleGuess(guessedKey, cardElement) {
        if (!isPlaying) return;

        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        if (guessedKey === targetBodyPartKey) {
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
                    feedbackText.innerText = bodyDictionary[targetBodyPartKey][currentLang];
                    feedbackImg.src = `images/bodyparts/${targetBodyPartKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let partNameAudio = new Audio(`sounds/${currentLang}/bodyparts/${targetBodyPartKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        partNameAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findBodyPartsScore', score);
                            sessionStorage.setItem('findBodyPartsLang', currentLang);
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findBodyPartsThemeIndex', nextThemeIndex);
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

                    partNameAudio.play().then(() => {
                        partNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
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
        sessionStorage.removeItem('findBodyPartsScore'); 
        sessionStorage.removeItem('findBodyPartsThemeIndex');
        window.location.href = "index.html"; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};