"use strict";

window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleVehicleThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleVehicleLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleVehicleScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetVehicle = "";
    
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
        "game-title": { en: "🚌 Vehicle Picture Puzzle!", hi: "🚌 वाहन चित्र पहेली!", mr: "🚌 वाहन चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Vehicle Picture Puzzle Game | KidsFunLearnHub", hi: "वाहन चित्र पहेली खेल | KidsFunLearnHub", mr: "वाहन चित्र कोडे खेळ | KidsFunLearnHub" }
    };

    const vehicleDict = {
        "car": { en: "Car", hi: "कार", mr: "कार" },
        "bus": { en: "Bus", hi: "बस", mr: "बस" },
        "auto rickshaw": { en: "Auto Rickshaw", hi: "ऑटो रिक्शा", mr: "ऑटो रिक्षा" },
        "motorcycle": { en: "Motorcycle", hi: "मोटरसाइकिल", mr: "मोटारसायकल" },
        "bicycle": { en: "Bicycle", hi: "साइकिल", mr: "सायकल" },
        "scooter": { en: "Scooter", hi: "स्कूटर", mr: "स्कूटर" },
        "truck": { en: "Truck", hi: "ट्रक", mr: "ट्रक" },
        "tractor": { en: "Tractor", hi: "ट्रैक्टर", mr: "ट्रॅक्टर" },
        "train": { en: "Train", hi: "रेलगाड़ी", mr: "रेल्वे" },
        "metro": { en: "Metro", hi: "मेट्रो", mr: "मेट्रो" },
        "ambulance": { en: "Ambulance", hi: "एम्बुलेंस", mr: "रुग्णवाहिका" },
        "fire engine": { en: "Fire Engine", hi: "दमकल", mr: "अग्निशमन दल" },
        "police jeep": { en: "Police Jeep", hi: "पुलिस जीप", mr: "पोलीस जीप" },
        "school bus": { en: "School Bus", hi: "स्कूल बस", mr: "स्कूल बस" },
        "van": { en: "Van", hi: "वैन", mr: "व्हॅन" },
        "tempo": { en: "Tempo", hi: "टेम्पो", mr: "टेम्पो" },
        "delivery truck": { en: "Delivery Truck", hi: "डिलीवरी ट्रक", mr: "मालवाहू ट्रक" },
        "taxi": { en: "Taxi", hi: "टैक्सी", mr: "टॅक्सी" },
        "rickshaw": { en: "Rickshaw", hi: "रिक्शा", mr: "रिक्षा" },
        "bulldozer": { en: "Bulldozer", hi: "बुलडोजर", mr: "बुलडोझर" },
        "crane": { en: "Crane", hi: "क्रेन", mr: "क्रेन" },
        "excavator": { en: "Excavator", hi: "उत्खनन मशीन", mr: "एक्साव्हेटर" },
        "boat": { en: "Boat", hi: "नाव", mr: "बोट" },
        "ferry": { en: "Ferry", hi: "नौका", mr: "फेरी" },
        "ship": { en: "Ship", hi: "पानी का जहाज", mr: "जहाज" },
        "helicopter": { en: "Helicopter", hi: "हेलीकॉप्टर", mr: "हेलिकॉप्टर" },
        "airplane": { en: "Airplane", hi: "हवाई जहाज", mr: "विमान" },
        "garbage truck": { en: "Garbage Truck", hi: "कचरा ट्रक", mr: "कचऱ्याचा ट्रक" },
        "cement mixer": { en: "Cement Mixer", hi: "सीमेंट मिक्सर", mr: "सिमेंट मिक्सर" },
        "tow truck": { en: "Tow Truck", hi: "टो ट्रक", mr: "टोइंग ट्रक" }
    };

    const allVehicles = Object.keys(vehicleDict);
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
        sessionStorage.setItem('puzzleVehicleLang', lang); 
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

    // Added Instruction Audio Playback
    function playInstructionAudio() {
        let instructionAudio = new Audio(`sounds/${currentLang}/vehicles/${currentTargetVehicle}.mp3`);
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
        
        // 1. Pick a random vehicle
        currentTargetVehicle = allVehicles[Math.floor(Math.random() * allVehicles.length)];
        const imgUrl = `images/vehicles/${currentTargetVehicle}.webp`;

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
            feedbackText.innerText = vehicleDict[currentTargetVehicle][currentLang];
            feedbackImg.src = `images/vehicles/${currentTargetVehicle}.webp`;
            feedbackImg.classList.remove("hidden"); 

            let vehicleNameAudio = new Audio(`sounds/${currentLang}/vehicles/${currentTargetVehicle}.mp3`);
            
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                vehicleNameAudio.pause(); 
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('puzzleVehicleScore', score);
                    sessionStorage.setItem('puzzleVehicleLang', currentLang);
                    let nextThemeIndex = (themeIndex + 1) % themes.length;
                    sessionStorage.setItem('puzzleVehicleThemeIndex', nextThemeIndex);
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            vehicleNameAudio.play().then(() => {
                vehicleNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
            }).catch(e => { autoTimer = setTimeout(advanceToNext, 2000); });
        };

        greatJobAudio.play().then(() => {
            greatJobAudio.onended = triggerPhaseTwo;
        }).catch(() => { 
            setTimeout(triggerPhaseTwo, 1500); 
        });
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleVehicleScore'); 
        sessionStorage.removeItem('puzzleVehicleThemeIndex'); 
        
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};