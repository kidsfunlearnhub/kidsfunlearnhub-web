"use strict";

window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleFlowerThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleFlowerLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleFlowerScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetFlower = "";
    
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
        "game-title": { en: "🌹 Flower Picture Puzzle!", hi: "🌹 फूल चित्र पहेली!", mr: "🌹 फूल चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Flower Picture Puzzle Game | KidsFunLearnHub", hi: "फूल चित्र पहेली खेल | KidsFunLearnHub", mr: "फूल चित्र कोडे खेळ | KidsFunLearnHub" }
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
        sessionStorage.setItem('puzzleFlowerLang', lang); 
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

    // Play Instruction Audio
    function playInstructionAudio() {
        let instructionAudio = new Audio(`sounds/${currentLang}/flowers/${currentTargetFlower}.mp3`);
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
        
        currentTargetFlower = allFlowers[Math.floor(Math.random() * allFlowers.length)];
        const imgUrl = `images/flowers/${currentTargetFlower}.webp`;

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
        if (selectedPieceCard) selectedPieceCard.classList.remove("selected");
        if (selectedPieceCard === piece) { selectedPieceCard = null; return; }
        selectedPieceCard = piece;
        piece.classList.add("selected");
    }

    function handleSlotClick(slot) {
        if (slot.children.length > 0 || !selectedPieceCard) return;

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

            if (piecesPlaced === 4) setTimeout(showRoundComplete, 600);
        } else {
            selectedPieceCard.classList.add("shake");
            let tryAgainAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Audio not found"));
            setTimeout(() => { if(selectedPieceCard) selectedPieceCard.classList.remove("shake"); }, 500);
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
            feedbackText.innerText = flowerDict[currentTargetFlower][currentLang];
            feedbackImg.src = `images/flowers/${currentTargetFlower}.webp`;
            feedbackImg.classList.remove("hidden"); 

            let flowerNameAudio = new Audio(`sounds/${currentLang}/flowers/${currentTargetFlower}.mp3`);
            
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
                    sessionStorage.setItem('puzzleFlowerScore', score);
                    sessionStorage.setItem('puzzleFlowerLang', currentLang);
                    let nextThemeIndex = (themeIndex + 1) % themes.length;
                    sessionStorage.setItem('puzzleFlowerThemeIndex', nextThemeIndex);
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
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleFlowerScore'); 
        sessionStorage.removeItem('puzzleFlowerThemeIndex'); 
        
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};