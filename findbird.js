window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findBirdThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findBirdLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findBirdScore')) || 0;
    
    let targetBirdKey = "";
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
        "game-title": { en: "🦚 Find The Bird!", hi: "🦚 पक्षी खोजें!", mr: "🦚 पक्षी शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is the...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find The Bird Game | KidsFunLearnHub", hi: "पक्षी खोजें खेल | KidsFunLearnHub", mr: "पक्षी शोधा खेळ | KidsFunLearnHub" }
    };

    const birdDict = {
        "peacock": { en: "Peacock", hi: "मोर", mr: "मोर" },
        "sparrow": { en: "Sparrow", hi: "गौरैया", mr: "चिमणी" },
        "crow": { en: "Crow", hi: "कौवा", mr: "कावळा" },
        "parrot": { en: "Parrot", hi: "तोता", mr: "पोपट" },
        "pigeon": { en: "Pigeon", hi: "कबूतर", mr: "कबूतर" },
        "myna": { en: "Myna", hi: "मैना", mr: "मैना" },
        "kingfisher": { en: "Kingfisher", hi: "किंगफिशर", mr: "खंड्या" },
        "bulbul": { en: "Bulbul", hi: "बुलबुल", mr: "बुलबुल" },
        "koel": { en: "Koel", hi: "कोयल", mr: "कोकिळा" },
        "eagle": { en: "Eagle", hi: "गरुड़", mr: "गरुड" },
        "owl": { en: "Owl", hi: "उल्लू", mr: "घुबड" },
        "vulture": { en: "Vulture", hi: "गिद्ध", mr: "गिधाड" },
        "crane": { en: "Crane", hi: "सारस", mr: "क्रौंच" },
        "heron": { en: "Heron", hi: "बगुला", mr: "बगळा" },
        "stork": { en: "Stork", hi: "स्टॉर्क", mr: "करकोचा" },
        "duck": { en: "Duck", hi: "बत्तख", mr: "बदक" },
        "goose": { en: "Goose", hi: "हंस", mr: "हंस" },
        "quail": { en: "Quail", hi: "बटेर", mr: "लावा" },
        "lapwing": { en: "Lapwing", hi: "टिटहरी", mr: "टिटवी" },
        "woodpecker": { en: "Woodpecker", hi: "कठफोड़वा", mr: "सुतारपक्षी" },
        "sunbird": { en: "Sunbird", hi: "शकरखोरा", mr: "शिंजीर" },
        "hornbill": { en: "Hornbill", hi: "धनेश", mr: "धनेश" },
        "kite": { en: "Kite", hi: "चील", mr: "घार" },
        "falcon": { en: "Falcon", hi: "बाज", mr: "ससाणा" },
        "weaverbird": { en: "Weaverbird", hi: "बया", mr: "सुगरण" },
        "drongo": { en: "Drongo", hi: "भुजंगा", mr: "कोतवाल" },
        "barbet": { en: "Barbet", hi: "बसंत बौरी", mr: "तांबट" },
        "roller": { en: "Roller", hi: "नीलकंठ", mr: "नीलकंठ" },
        "flamingo": { en: "Flamingo", hi: "राजहंस", mr: "रोहित पक्षी" },
        "ibis": { en: "Ibis", hi: "इबिस", mr: "शराटी" }
    };

    const allBirds = Object.keys(birdDict);
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
        sessionStorage.setItem('findBirdLang', lang); 
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        
        if (targetBirdKey) {
            document.getElementById("target-bird-name").innerText = birdDict[targetBirdKey][currentLang];
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio(); 
        });
    });

    function playCustomAudio() {
        if (isAudioPlaying || !targetBirdKey) return; 
        isAudioPlaying = true;
        let part1, part2;

        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/birds/${targetBirdKey}.mp3`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/birds/${targetBirdKey}.mp3`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/birds/${targetBirdKey}.mp3`);
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
        
        let shuffled = [...allBirds].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 4);
        
        targetBirdKey = currentOptions[Math.floor(Math.random() * currentOptions.length)];
        document.getElementById("target-bird-name").innerText = birdDict[targetBirdKey][currentLang];

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(birdKey => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + birdDict[birdKey]['en']);
            card.innerHTML = `<img src="images/birds/${birdKey}.webp" alt="${birdDict[birdKey]['en']}">`;
            card.onclick = () => handleGuess(birdKey, card);
            grid.appendChild(card);
        });
    }

    function handleGuess(guessedKey, cardElement) {
        if (!isPlaying) return;

        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        if (guessedKey === targetBirdKey) {
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
                    feedbackText.innerText = birdDict[targetBirdKey][currentLang];
                    feedbackImg.src = `images/birds/${targetBirdKey}.webp`;
                    feedbackImg.classList.remove("hidden"); 

                    let birdNameAudio = new Audio(`sounds/${currentLang}/birds/${targetBirdKey}.mp3`);
                    
                    let hasAdvanced = false;
                    let autoTimer;

                    const advanceToNext = () => {
                        if (hasAdvanced) return; 
                        hasAdvanced = true;
                        clearTimeout(autoTimer); 
                        birdNameAudio.pause(); 
                        feedback.onclick = null; 
                        feedback.classList.add("hidden");
                        
                        roundsPlayedThisSession++; 
                        
                        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                            sessionStorage.setItem('findBirdScore', score);
                            sessionStorage.setItem('findBirdLang', currentLang);
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findBirdThemeIndex', nextThemeIndex);
                            window.location.reload();
                        } else {
                            startNewRound();
                        }
                    };

                    setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

                    birdNameAudio.play().then(() => {
                        birdNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
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
        sessionStorage.removeItem('findBirdScore'); 
        sessionStorage.removeItem('findBirdThemeIndex');
        window.location.href = "index.html"; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};