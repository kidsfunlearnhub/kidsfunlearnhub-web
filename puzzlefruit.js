"use strict";

window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🍓' }, 
        { runner: '🐘', target: '🍉' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleFruitThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleFruitLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleFruitScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetFruit = "";
    
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
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
        "game-title": { en: "🍓 Fruit Picture Puzzle!", hi: "🍓 फल चित्र पहेली!", mr: "🍓 फळ चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Fruit Picture Puzzle Game | KidsFunLearnHub", hi: "फल चित्र पहेली खेल | KidsFunLearnHub", mr: "फळ चित्र कोडे खेळ | KidsFunLearnHub" }
    };

    const fruitDict = {
        "mango": { en: "Mango", hi: "आम", mr: "आंबा" },
        "banana": { en: "Banana", hi: "केला", mr: "केळे" },
        "apple": { en: "Apple", hi: "सेब", mr: "सफरचंद" },
        "orange": { en: "Orange", hi: "संतरा", mr: "संत्री" },
        "grapes": { en: "Grapes", hi: "अंगूर", mr: "द्राक्षे" },
        "papaya": { en: "Papaya", hi: "पपीता", mr: "पपई" },
        "guava": { en: "Guava", hi: "अमरूद", mr: "पेरू" },
        "pineapple": { en: "Pineapple", hi: "अनानास", mr: "अननस" },
        "pomegranate": { en: "Pomegranate", hi: "अनार", mr: "डाळिंब" },
        "watermelon": { en: "Watermelon", hi: "तरबूज", mr: "कलिंगड" },
        "muskmelon": { en: "Muskmelon", hi: "खरबूजा", mr: "खरबूज" },
        "chikoo": { en: "Chikoo", hi: "चीकू", mr: "चिकू" },
        "custard apple": { en: "Custard Apple", hi: "सीताफल", mr: "सीताफळ" },
        "litchi": { en: "Litchi", hi: "लीची", mr: "लीची" },
        "jackfruit": { en: "Jackfruit", hi: "कटहल", mr: "फणस" },
        "pear": { en: "Pear", hi: "नाशपाती", mr: "पेअर" },
        "plum": { en: "Plum", hi: "आलूबुखारा", mr: "प्लम" },
        "peach": { en: "Peach", hi: "आड़ू", mr: "पीच" },
        "apricot": { en: "Apricot", hi: "खुबानी", mr: "जर्दाळू" },
        "kiwi": { en: "Kiwi", hi: "कीवी", mr: "कीवी" },
        "fig": { en: "Fig", hi: "अंजीर", mr: "अंजीर" },
        "dates": { en: "Dates", hi: "खजूर", mr: "खजूर" },
        "coconut": { en: "Coconut", hi: "नारियल", mr: "नारळ" },
        "jamun": { en: "Jamun", hi: "जामुन", mr: "जांभूळ" },
        "amla": { en: "Amla", hi: "आंवला", mr: "आवळा" },
        "star fruit": { en: "Star Fruit", hi: "कमरख", mr: "स्टार फ्रूट" },
        "dragon fruit": { en: "Dragon Fruit", hi: "ड्रैगन फ्रूट", mr: "ड्रॅगन फ्रूट" },
        "mulberry": { en: "Mulberry", hi: "शहतूत", mr: "तुती" },
        "wood apple": { en: "Wood Apple", hi: "बेल", mr: "कवठ" },
        "tamarind": { en: "Tamarind", hi: "इमली", mr: "चिंच" }
    };

    const allFruits = Object.keys(fruitDict);
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
        sessionStorage.setItem('puzzleFruitLang', lang); 
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
        let instructionAudio = new Audio(`sounds/${currentLang}/fruits/${currentTargetFruit}.mp3`);
        instructionAudio.play().catch(e => console.log("Instruction audio not found: ", e));
    }
    document.getElementById("promptBox").addEventListener("click", playInstructionAudio);

    const bgPositions = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];

    function startNewRound() {
        piecesPlaced = 0;
        selectedPieceCard = null;
        updateProgressTrack(false); 

        const board = document.getElementById("puzzle-board");
        const tray = document.getElementById("pieces-tray");
        board.innerHTML = "";
        tray.innerHTML = "";
        
        currentTargetFruit = allFruits[Math.floor(Math.random() * allFruits.length)];
        const imgUrl = `images/fruits/${currentTargetFruit}.webp`;

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

    // --- PHASE 2 REWARD LOGIC INTEGRATED HERE ---
    function showRoundComplete() {
        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        feedbackScore.innerText = uiDict["total-score"][currentLang] + score;
        feedbackScore.classList.remove("hidden");
        feedbackText.innerText = uiDict["correct"][currentLang];
        feedbackText.className = "correct-text";
        feedbackImg.classList.add("hidden"); // Hide image initially for "Great Job"
        feedback.classList.remove("hidden");
        feedback.onclick = null; 
        
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
        }

        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        
        const triggerPhaseTwo = () => {
            // Update UI to show Fruit Name & Image
            feedbackText.innerText = fruitDict[currentTargetFruit][currentLang];
            feedbackImg.src = `images/fruits/${currentTargetFruit}.webp`;
            feedbackImg.classList.remove("hidden"); 

            let fruitNameAudio = new Audio(`sounds/${currentLang}/fruits/${currentTargetFruit}.mp3`);
            
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                fruitNameAudio.pause(); 
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('puzzleFruitScore', score);
                    sessionStorage.setItem('puzzleFruitLang', currentLang);
                    let nextThemeIndex = (themeIndex + 1) % themes.length;
                    sessionStorage.setItem('puzzleFruitThemeIndex', nextThemeIndex);
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            fruitNameAudio.play().then(() => {
                fruitNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
            }).catch(e => { autoTimer = setTimeout(advanceToNext, 2000); });
        };

        // Start Phase 1 (Great Job), then move to Phase 2 (Fruit Name)
        greatJobAudio.play().then(() => {
            greatJobAudio.onended = triggerPhaseTwo;
        }).catch(() => { 
            setTimeout(triggerPhaseTwo, 1500); 
        });
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleFruitScore'); 
        sessionStorage.removeItem('puzzleFruitThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=fruits";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};