"use strict";

window.onload = function() {
    // --- THEME ROTATION SETUP ---
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('findAbcBigSmallThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // 1. STATE & LOCALIZATION SETUP
    let currentLang = sessionStorage.getItem('findAbcLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('findAbcBigSmallScore')) || 0;
    
    let targetLetterKey = "";
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

    const uiDict = {
        "game-title": { en: "🔠 Find Big & Small!", hi: "🔠 बड़े और छोटे खोजें!", mr: "🔠 मोठी आणि लहान शोधा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Where is...", hi: "कहाँ है...", mr: "कुठे आहे..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "wrong": { en: "Try Again! ❌", hi: "फिर से कोशिश करें! ❌", mr: "पुन्हा प्रयत्न करा! ❌" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Find Big & Small Letters | KidsFunLearnHub", hi: "बड़े और छोटे अक्षर खोजें | KidsFunLearnHub", mr: "मोठी आणि लहान अक्षरे शोधा | KidsFunLearnHub" }
    };

    // Helper to dynamically generate "Big A, Small a" text translations
    function getLetterPairName(letter, lang) {
        const small = letter.toLowerCase();
        if (lang === 'hi') return `बड़ा ${letter}, छोटा ${small}`;
        if (lang === 'mr') return `मोठा ${letter}, छोटा ${small}`;
        return `Big ${letter}, Small ${small}`;
    }

    const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
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
            document.getElementById("target-letter-name").innerText = getLetterPairName(targetLetterKey, currentLang);
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

        // Path logic mapping from the abcbigsmall code
        // e.g. "Aa.mp3"
        const audioFileName = `${targetLetterKey}${targetLetterKey.toLowerCase()}.mp3`;

        if (currentLang === 'en') {
            part1 = new Audio(`sounds/en/where_is_the.mp3`);
            part2 = new Audio(`sounds/en/abc big-small/${audioFileName}`);
        } else if (currentLang === 'hi') {
            part1 = new Audio(`sounds/hi/abc big-small/${audioFileName}`);
            part2 = new Audio(`sounds/hi/kahan_hai.mp3`);
        } else if (currentLang === 'mr') {
            part1 = new Audio(`sounds/mr/abc big-small/${audioFileName}`);
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
        
        // Sets the text "Big A, Small a" in the target box dynamically
        document.getElementById("target-letter-name").innerText = getLetterPairName(targetLetterKey, currentLang);

        setTimeout(playCustomAudio, 500);

        currentOptions.forEach(letter => {
            const card = document.createElement("div");
            card.className = "card";
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", `Select Big ${letter} and Small ${letter.toLowerCase()}`);
            
            // Replaces the image logic with our beautiful colored text layout
            card.innerHTML = `
                <span class="grid-big">${letter}</span>
                <span class="grid-small">${letter.toLowerCase()}</span>
            `;
            
            card.onclick = () => handleGuess(letter, card);
            grid.appendChild(card);
        });
    }

    // 5. HANDLING THE GUESS & REWARD SEQUENCE
    function handleGuess(guessedKey, cardElement) {
        if (!isPlaying) return;

        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackDisplay = document.getElementById("feedback-letter-display");
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
                
                // Show the big and small letters in the popup box
                feedbackDisplay.innerHTML = `
                    <span class="feedback-big">${targetLetterKey}</span>
                    <span class="feedback-small">${targetLetterKey.toLowerCase()}</span>
                `;
                feedbackDisplay.classList.remove("hidden"); 
                
                feedback.classList.remove("hidden");
                feedback.onclick = null; 

                if (typeof confetti === "function") {
                    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
                }

                let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
                
                const triggerPhaseTwo = () => {
                    feedbackText.innerText = getLetterPairName(targetLetterKey, currentLang);

                    const audioFileName = `${targetLetterKey}${targetLetterKey.toLowerCase()}.mp3`;
                    let letterAudio = new Audio(`sounds/${currentLang}/abc big-small/${audioFileName}`);
                    
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
                            sessionStorage.setItem('findAbcBigSmallScore', score);
                            sessionStorage.setItem('findAbcLang', currentLang);
                            
                            let nextThemeIndex = (themeIndex + 1) % themes.length;
                            sessionStorage.setItem('findAbcBigSmallThemeIndex', nextThemeIndex);
                            
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
            feedbackDisplay.classList.add("hidden"); 
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
        sessionStorage.removeItem('findAbcBigSmallScore'); 
        sessionStorage.removeItem('findAbcBigSmallThemeIndex');
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=small_alphabets";
        window.location.href = returnUrl; 
    });

    // Initialize
    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};