window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleInsectThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleInsectLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleInsectScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetInsect = "";
    
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
        "game-title": { en: "🪰 Insect Picture Puzzle!", hi: "🪰 कीड़े चित्र पहेली!", mr: "🪰 कीटक चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Insect Picture Puzzle Game | KidsFunLearnHub", hi: "कीड़े चित्र पहेली खेल | KidsFunLearnHub", mr: "कीटक चित्र कोडे खेळ | KidsFunLearnHub" }
    };

    const insectDict = {
        "ant": { en: "Ant", hi: "चींटी", mr: "मुंगी" },
        "bee": { en: "Bee", hi: "मधुमक्खी", mr: "मधमाशी" },
        "butterfly": { en: "Butterfly", hi: "तितली", mr: "फुलपाखरू" },
        "mosquito": { en: "Mosquito", hi: "मच्छर", mr: "डास" },
        "housefly": { en: "Housefly", hi: "मक्खी", mr: "माशी" },
        "dragonfly": { en: "Dragonfly", hi: "ड्रैगनफ्लाई", mr: "चतुर" },
        "grasshopper": { en: "Grasshopper", hi: "टिड्डा", mr: "नाकतोडा" },
        "cricket": { en: "Cricket", hi: "झींगुर", mr: "रातकिडा" },
        "ladybug": { en: "Ladybug", hi: "लेडीबग", mr: "सोनकिडा" },
        "termite": { en: "Termite", hi: "दीमक", mr: "वाळवी" },
        "beetle": { en: "Beetle", hi: "भृंग", mr: "भुंगा" },
        "moth": { en: "Moth", hi: "पतंगा", mr: "पतंग" },
        "firefly": { en: "Firefly", hi: "जुगनू", mr: "काजवा" },
        "wasp": { en: "Wasp", hi: "ततैया", mr: "गांधीलमाशी" },
        "hornet": { en: "Hornet", hi: "हॉर्नेट", mr: "मोठी गांधीलमाशी" },
        "weevil": { en: "Weevil", hi: "घुन", mr: "सोंड्या कीटक" },
        "aphid": { en: "Aphid", hi: "माहू", mr: "मावा" },
        "caterpillar": { en: "Caterpillar", hi: "इल्ली", mr: "सुरवंट" },
        "leafhopper": { en: "Leafhopper", hi: "फुदका", mr: "तुडतुडे" },
        "planthopper": { en: "Planthopper", hi: "प्लांटहॉपर", mr: "प्लांटहॉपर" },
        "mantis": { en: "Mantis", hi: "मैंटिस", mr: "मँटिस" },
        "stick insect": { en: "Stick Insect", hi: "लकड़ी कीड़ा", mr: "काडीकिडा" },
        "water strider": { en: "Water Strider", hi: "वाटर स्ट्राइडर", mr: "पाणकिडा" },
        "dung beetle": { en: "Dung Beetle", hi: "गोबरैला", mr: "शेणकिडा" },
        "carpenter ant": { en: "Carpenter Ant", hi: "बढ़ई चींटी", mr: "सुतार मुंगी" },
        "red ant": { en: "Red Ant", hi: "लाल चींटी", mr: "लाल मुंगी" },
        "silkworm": { en: "Silkworm", hi: "रेशम का कीड़ा", mr: "रेशीम कीटक" },
        "lacewing": { en: "Lacewing", hi: "लेसविंग", mr: "लेसविंग" },
        "bumblebee": { en: "Bumblebee", hi: "भौंरा", mr: "बंबलबी" },
        "fruit fly": { en: "Fruit Fly", hi: "फल मक्खी", mr: "फळमाशी" }
    };

    const allInsects = Object.keys(insectDict);
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
        sessionStorage.setItem('puzzleInsectLang', lang); 
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
        
        // 1. Pick a random insect
        currentTargetInsect = allInsects[Math.floor(Math.random() * allInsects.length)];
        const imgUrl = `images/insects/${currentTargetInsect}.webp`;

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

        let insectAudio = new Audio(`sounds/${currentLang}/insects/${currentTargetInsect}.mp3`);
        
        insectAudio.play().catch(e => {
            let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
            greatJobAudio.play().catch(err => console.log("Audio not found"));
        });

        setTimeout(() => {
            feedback.classList.add("hidden");
            roundsPlayedThisSession++; 
            
            if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                sessionStorage.setItem('puzzleInsectScore', score);
                sessionStorage.setItem('puzzleInsectLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('puzzleInsectThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleInsectScore'); 
        sessionStorage.removeItem('puzzleInsectThemeIndex'); 
       // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl;
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};