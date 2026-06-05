"use strict";

window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleAnimalThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleAnimalLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleAnimalScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetAnimal = "";
    
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
        "game-title": { en: "🦁 Animal Picture Puzzle!", hi: "🦁 जानवर चित्र पहेली!", mr: "🦁 प्राणी चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Animal Picture Puzzle Game | KidsFunLearnHub", hi: "जानवर चित्र पहेली खेल | KidsFunLearnHub", mr: "प्राणी चित्र कोडे खेळ | KidsFunLearnHub" }
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
        sessionStorage.setItem('puzzleAnimalLang', lang); 
        document.title = uiDict["page-title"][currentLang];
        
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.dataset.lang === lang) btn.classList.add('active');
        });

        document.getElementById("game-title").innerText = uiDict["game-title"][currentLang];
        document.getElementById("score-label").innerText = uiDict["score-label"][currentLang];
        document.getElementById("instruction").innerText = uiDict["instruction"][currentLang];
        document.getElementById("backBtn").innerText = uiDict["backBtn"][currentLang];
        document.getElementById("feedback-text").innerText = uiDict["correct"][currentLang];
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
        });
    });

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
        
        // 1. Pick a random animal
        currentTargetAnimal = allAnimals[Math.floor(Math.random() * allAnimals.length)];
        const imgUrl = `images/animals/${currentTargetAnimal}.webp`;

        // 2. Setup the Board
        board.style.backgroundImage = `url('${imgUrl}')`;
        // Create 4 slots
        for(let i=0; i<4; i++) {
            let slot = document.createElement("div");
            slot.className = "board-slot";
            slot.dataset.index = i;
            slot.addEventListener("click", () => handleSlotClick(slot));
            board.appendChild(slot);
        }

        // 3. Setup the Pieces
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

    function showRoundComplete() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-score").innerText = uiDict["total-score"][currentLang] + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
        }

        let animalAudio = new Audio(`sounds/${currentLang}/animals/${currentTargetAnimal}.mp3`);
        
        animalAudio.play().catch(e => {
            let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
            greatJobAudio.play().catch(err => console.log("Audio not found"));
        });

        setTimeout(() => {
            feedback.classList.add("hidden");
            roundsPlayedThisSession++; 
            
            if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                sessionStorage.setItem('puzzleAnimalScore', score);
                sessionStorage.setItem('puzzleAnimalLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('puzzleAnimalThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    // 6. BACK BUTTON ACTION
    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleAnimalScore'); 
        sessionStorage.removeItem('puzzleAnimalThemeIndex'); 
        
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    // document.getElementById("backBtn").addEventListener("click", () => {
    //     sessionStorage.removeItem('puzzleAnimalScore'); 
    //     sessionStorage.removeItem('puzzleAnimalThemeIndex'); 
    //     // Redirecting back to the filtered Animal Activities hub view!
    //     window.location.href = "activityhub.html?topic=animals"; 
    // });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};