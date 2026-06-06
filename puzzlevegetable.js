"use strict";

window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleVegetableThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleVegetableLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleVegetableScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetVegetable = "";
    
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    // 2x2 grid puzzle logic implies 4 pieces to win a round
    const PIECES_PER_ROUND = 4;
    const TOTAL_PIECES_PER_LEVEL = ROUNDS_BEFORE_RELOAD * PIECES_PER_ROUND;

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
        "game-title": { en: "🫛 Vegetable Picture Puzzle!", hi: "🫛 सब्जी चित्र पहेली!", mr: "🫛 भाजी चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Vegetable Picture Puzzle Game | KidsFunLearnHub", hi: "सब्जी चित्र पहेली खेल | KidsFunLearnHub", mr: "भाजी चित्र कोडे खेळ | KidsFunLearnHub" }
    };

    const vegetableDict = {
        "potato": { en: "Potato", hi: "आलू", mr: "बटाटा" },
        "tomato": { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
        "onion": { en: "Onion", hi: "प्याज", mr: "कांदा" },
        "carrot": { en: "Carrot", hi: "गाजर", mr: "गाजर" },
        "brinjal": { en: "Brinjal", hi: "बैंगन", mr: "वांगी" },
        "cabbage": { en: "Cabbage", hi: "पत्ता गोभी", mr: "कोबी" },
        "cauliflower": { en: "Cauliflower", hi: "फूल गोभी", mr: "फ्लॉवर" },
        "peas": { en: "Peas", hi: "मटर", mr: "वाटाणा" },
        "spinach": { en: "Spinach", hi: "पालक", mr: "पालक" },
        "okra": { en: "Okra", hi: "भिंडी", mr: "भेंडी" },
        "bottle gourd": { en: "Bottle Gourd", hi: "लौकी", mr: "दुधी भोपळा" },
        "ridge gourd": { en: "Ridge Gourd", hi: "तोरई", mr: "दोडका" },
        "bitter gourd": { en: "Bitter Gourd", hi: "करेला", mr: "कारले" },
        "pumpkin": { en: "Pumpkin", hi: "कद्दू", mr: "भोपळा" },
        "radish": { en: "Radish", hi: "मूली", mr: "मुळा" },
        "beetroot": { en: "Beetroot", hi: "चुकंदर", mr: "बीटरूट" },
        "capsicum": { en: "Capsicum", hi: "शिमला मिर्च", mr: "ढोबळी मिरची" },
        "cucumber": { en: "Cucumber", hi: "खीरा", mr: "काकडी" },
        "beans": { en: "Beans", hi: "बीन्स", mr: "फरसबी" },
        "turnip": { en: "Turnip", hi: "शलजम", mr: "सलगम" },
        "drumstick": { en: "Drumstick", hi: "सहजन", mr: "शेवगा" },
        "ivy gourd": { en: "Ivy Gourd", hi: "कुंदरू", mr: "तोंडली" },
        "cluster beans": { en: "Cluster Beans", hi: "ग्वार फली", mr: "गवार" },
        "fenugreek": { en: "Fenugreek", hi: "मेथी", mr: "मेथी" },
        "mustard greens": { en: "Mustard Greens", hi: "सरसों का साग", mr: "मोहरीची पाने" },
        "colocasia": { en: "Colocasia", hi: "अरबी", mr: "अळू" },
        "ash gourd": { en: "Ash Gourd", hi: "पेठा", mr: "कोहळा" },
        "snake gourd": { en: "Snake Gourd", hi: "चिचिंडा", mr: "पडवळ" },
        "raw banana": { en: "Raw Banana", hi: "कच्चा केला", mr: "कच्ची केळी" },
        "sweet potato": { en: "Sweet Potato", hi: "शकरकंद", mr: "रताळे" }
    };

    const allVegetables = Object.keys(vegetableDict);
    document.getElementById("score").innerText = score;

    function initProgressTrack() {
        const dotsContainer = document.getElementById("dots-container");
        dotsContainer.innerHTML = "";
        for(let i = 0; i <= TOTAL_PIECES_PER_LEVEL; i++) {
            let dot = document.createElement("div");
            dot.className = "path-dot";
            dotsContainer.appendChild(dot);
        }
    }

    function updateProgressTrack(isJumping = false) {
        const runner = document.getElementById("runner-icon");
        const progressLine = document.getElementById("progress-line"); 
        let currentTotalMatches = (roundsPlayedThisSession * PIECES_PER_ROUND) + piecesPlaced;
        let percentage = (currentTotalMatches / TOTAL_PIECES_PER_LEVEL) * 100;
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
        sessionStorage.setItem('puzzleVegetableLang', lang); 
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
        });
    });

    // Added Instruction Audio Playback
    function playInstructionAudio() {
        let instructionAudio = new Audio(`sounds/${currentLang}/vegetables/${currentTargetVegetable}.mp3`);
        instructionAudio.play().catch(e => console.log("Instruction audio not found: ", e));
    }
    document.getElementById("promptBox").addEventListener("click", playInstructionAudio);

    // Positions for a 2x2 grid (Top-Left, Top-Right, Bottom-Left, Bottom-Right)
    const bgPositions = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];

    function startNewRound() {
        piecesPlaced = 0;
        selectedPieceCard = null;
        updateProgressTrack(false); 

        const board = document.getElementById("puzzle-board");
        const tray = document.getElementById("pieces-tray");
        board.innerHTML = "";
        tray.innerHTML = "";
        
        currentTargetVegetable = allVegetables[Math.floor(Math.random() * allVegetables.length)];
        const imgUrl = `images/vegetables/${currentTargetVegetable}.webp`;

        board.style.backgroundImage = `url('${imgUrl}')`;
        for(let i=0; i<4; i++) {
            let slot = document.createElement("div");
            slot.className = "board-slot";
            slot.dataset.index = i;
            slot.addEventListener("click", () => handleSlotClick(slot));
            board.appendChild(slot);
        }

        let pieceIndices = [0, 1, 2, 3].sort(() => 0.5 - Math.random());
        
        pieceIndices.forEach(idx => {
            const piece = document.createElement("div");
            piece.className = "puzzle-piece";
            piece.dataset.piece = idx;
            piece.style.backgroundImage = `url('${imgUrl}')`;
            piece.style.backgroundPosition = bgPositions[idx];
            piece.setAttribute("role", "button");
            piece.setAttribute("tabindex", "0");
            piece.setAttribute("aria-label", "Puzzle piece");
            piece.addEventListener("click", () => handlePieceClick(piece));
            tray.appendChild(piece);
        });
    }

    function handlePieceClick(piece) {
        if (piece.classList.contains("placed")) return;
        
        if (selectedPieceCard) {
            selectedPieceCard.classList.remove("selected");
        }
        
        if (selectedPieceCard === piece) {
            selectedPieceCard = null;
            return;
        }

        selectedPieceCard = piece;
        piece.classList.add("selected");
    }

    function handleSlotClick(slot) {
        if (slot.children.length > 0) return;
        if (!selectedPieceCard) return;

        const targetSlotIndex = slot.dataset.index;
        const selectedPieceIndex = selectedPieceCard.dataset.piece;

        if (targetSlotIndex === selectedPieceIndex) {
            selectedPieceCard.classList.remove("selected");
            selectedPieceCard.classList.add("placed");
            
            slot.appendChild(selectedPieceCard);
            slot.style.border = "none";
            
            score += 10;
            document.getElementById("score").innerText = score;
            piecesPlaced++;

            updateProgressTrack(true); 
            selectedPieceCard = null; 

            if (piecesPlaced === 4) {
                setTimeout(showRoundComplete, 600);
            }
        } else {
            selectedPieceCard.classList.add("shake");
            let tryAgainAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Audio not found"));
            
            setTimeout(() => { 
                if(selectedPieceCard) selectedPieceCard.classList.remove("shake"); 
            }, 500);
        }
    }

    // --- PHASE 2 REWARD LOGIC ---
    function showRoundComplete() {
        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

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
            feedbackText.innerText = vegetableDict[currentTargetVegetable][currentLang];
            feedbackImg.src = `images/vegetables/${currentTargetVegetable}.webp`;
            feedbackImg.classList.remove("hidden"); 

            let vegNameAudio = new Audio(`sounds/${currentLang}/vegetables/${currentTargetVegetable}.mp3`);
            
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                vegNameAudio.pause(); 
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('puzzleVegetableScore', score);
                    sessionStorage.setItem('puzzleVegetableLang', currentLang);
                    let nextThemeIndex = (themeIndex + 1) % themes.length;
                    sessionStorage.setItem('puzzleVegetableThemeIndex', nextThemeIndex);
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            vegNameAudio.play().then(() => {
                vegNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
            }).catch(e => { autoTimer = setTimeout(advanceToNext, 2000); });
        };

        greatJobAudio.play().then(() => {
            greatJobAudio.onended = triggerPhaseTwo;
        }).catch(() => { 
            setTimeout(triggerPhaseTwo, 1500); 
        });
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleVegetableScore'); 
        sessionStorage.removeItem('puzzleVegetableThemeIndex'); 
        
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};