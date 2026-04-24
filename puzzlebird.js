window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleBirdThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleBirdLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleBirdScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetBird = "";
    
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
        "game-title": { en: "🦚 Bird Picture Puzzle!", hi: "🦚 पक्षी चित्र पहेली!", mr: "🦚 पक्षी चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Bird Picture Puzzle Game | KidsFunLearnHub", hi: "पक्षी चित्र पहेली खेल | KidsFunLearnHub", mr: "पक्षी चित्र कोडे खेळ | KidsFunLearnHub" }
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
        sessionStorage.setItem('puzzleBirdLang', lang); 
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
        
        // 1. Pick a random bird
        currentTargetBird = allBirds[Math.floor(Math.random() * allBirds.length)];
        const imgUrl = `images/birds/${currentTargetBird}.webp`;

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
        // Create array of indices 0,1,2,3 and shuffle it
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
        
        // If clicking the same piece, just deselect it
        if (selectedPieceCard === piece) {
            selectedPieceCard = null;
            return;
        }

        selectedPieceCard = piece;
        piece.classList.add("selected");
    }

    function handleSlotClick(slot) {
        // If the slot is already filled, ignore
        if (slot.children.length > 0) return;

        // If no piece is selected, ignore
        if (!selectedPieceCard) return;

        const targetSlotIndex = slot.dataset.index;
        const selectedPieceIndex = selectedPieceCard.dataset.piece;

        if (targetSlotIndex === selectedPieceIndex) {
            // Match Correct!
            selectedPieceCard.classList.remove("selected");
            selectedPieceCard.classList.add("placed");
            
            // Move piece to board slot physically in DOM
            slot.appendChild(selectedPieceCard);
            slot.style.border = "none"; // Hide dashed border when filled
            
            score += 10;
            document.getElementById("score").innerText = score;
            piecesPlaced++;

            updateProgressTrack(true); 

            // Clear selection
            selectedPieceCard = null; 

            if (piecesPlaced === 4) {
                // Remove the fading overlay by hiding the ::after content via CSS class if needed, 
                // but placing all pieces covers it anyway.
                setTimeout(showRoundComplete, 600);
            }
        } else {
            // Wrong slot
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

        // Play the bird's specific audio to reinforce learning
        let birdAudio = new Audio(`sounds/${currentLang}/birds/${currentTargetBird}.mp3`);
        
        // Try playing specific audio, fallback to "great_job" if missing
        birdAudio.play().catch(e => {
            let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
            greatJobAudio.play().catch(err => console.log("Audio not found"));
        });

        setTimeout(() => {
            feedback.classList.add("hidden");
            roundsPlayedThisSession++; 
            
            if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                sessionStorage.setItem('puzzleBirdScore', score);
                sessionStorage.setItem('puzzleBirdLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('puzzleBirdThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleBirdScore'); 
        sessionStorage.removeItem('puzzleBirdThemeIndex'); 
        window.location.href = "index.html"; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};