"use strict";

window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleFoodThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('puzzleFoodLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleFoodScore')) || 0;
    
    let selectedPieceCard = null; 
    let piecesPlaced = 0; 
    let currentTargetFood = "";
    
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
        "game-title": { en: "🍛 Food Picture Puzzle!", hi: "🍛 भोजन चित्र पहेली!", mr: "🍛 पदार्थ चित्र कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Complete the picture!", hi: "चित्र पूरा करें!", mr: "चित्र पूर्ण करा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Food Picture Puzzle Game | KidsFunLearnHub", hi: "भोजन चित्र पहेली खेल | KidsFunLearnHub", mr: "पदार्थ चित्र कोडे खेळ | KidsFunLearnHub" }
    };

    const foodDict = {
        "idli": { en: "Idli", hi: "इडली", mr: "इडली" },
        "dosa": { en: "Dosa", hi: "डोसा", mr: "डोसा" },
        "vada": { en: "Vada", hi: "वड़ा", mr: "वडा" },
        "sambar": { en: "Sambar", hi: "सांभर", mr: "सांबार" },
        "poha": { en: "Poha", hi: "पोहा", mr: "पोहे" },
        "upma": { en: "Upma", hi: "उपमा", mr: "उपमा" },
        "paratha": { en: "Paratha", hi: "पराठा", mr: "पराठा" },
        "puri": { en: "Puri", hi: "पूरी", mr: "पुरी" },
        "chapati": { en: "Chapati", hi: "चपाती", mr: "चपाती" },
        "dal": { en: "Dal", hi: "दाल", mr: "डाळ" },
        "khichdi": { en: "Khichdi", hi: "खिचड़ी", mr: "खिचडी" },
        "biryani": { en: "Biryani", hi: "बिरयानी", mr: "बिर्याणी" },
        "pulao": { en: "Pulao", hi: "पुलाव", mr: "पुलाव" },
        "paneer": { en: "Paneer", hi: "पनीर", mr: "पनीर" },
        "rajma": { en: "Rajma", hi: "राजमा", mr: "राजमा" },
        "chole": { en: "Chole", hi: "छोले", mr: "छोले" },
        "bhindi": { en: "Bhindi", hi: "भिंडी", mr: "भेंडी" },
        "aloo_gobi": { en: "Aloo Gobi", hi: "आलू गोभी", mr: "आलू गोबी" },
        "pav_bhaji": { en: "Pav Bhaji", hi: "पाव भाजी", mr: "पाव भाजी" },
        "vada_pav": { en: "Vada Pav", hi: "वड़ा पाव", mr: "वडा पाव" },
        "dhokla": { en: "Dhokla", hi: "ढोकला", mr: "ढोकळा" },
        "thepla": { en: "Thepla", hi: "थेपला", mr: "थेपला" },
        "kachori": { en: "Kachori", hi: "कचौड़ी", mr: "कचोरी" },
        "samosa": { en: "Samosa", hi: "समोसा", mr: "समोसा" },
        "jalebi": { en: "Jalebi", hi: "जलेबी", mr: "जिलबी" },
        "gulab_jamun": { en: "Gulab Jamun", hi: "गुलाब जामुन", mr: "गुलाब जामुन" },
        "rasgulla": { en: "Rasgulla", hi: "रसगुल्ला", mr: "रसगुल्ला" },
        "kheer": { en: "Kheer", hi: "खीर", mr: "खीर" },
        "halwa": { en: "Halwa", hi: "हलवा", mr: "हलवा" },
        "laddu": { en: "Laddu", hi: "लड्डू", mr: "लाडू" }
    };

    const allFoods = Object.keys(foodDict);
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
        sessionStorage.setItem('puzzleFoodLang', lang); 
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

    // Play Instruction Audio Playback
    function playInstructionAudio() {
        let instructionAudio = new Audio(`sounds/${currentLang}/foods/${currentTargetFood}.mp3`);
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
        
        // 1. Pick a random food
        currentTargetFood = allFoods[Math.floor(Math.random() * allFoods.length)];
        const imgUrl = `images/foods/${currentTargetFood}.webp`;

        // 2. Setup the Board
        board.style.backgroundImage = `url('${imgUrl}')`;
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
            feedbackText.innerText = foodDict[currentTargetFood][currentLang];
            feedbackImg.src = `images/foods/${currentTargetFood}.webp`;
            feedbackImg.classList.remove("hidden"); 

            let foodNameAudio = new Audio(`sounds/${currentLang}/foods/${currentTargetFood}.mp3`);
            
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                foodNameAudio.pause(); 
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('puzzleFoodScore', score);
                    sessionStorage.setItem('puzzleFoodLang', currentLang);
                    let nextThemeIndex = (themeIndex + 1) % themes.length;
                    sessionStorage.setItem('puzzleFoodThemeIndex', nextThemeIndex);
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            foodNameAudio.play().then(() => {
                foodNameAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
            }).catch(e => { autoTimer = setTimeout(advanceToNext, 2000); });
        };

        greatJobAudio.play().then(() => {
            greatJobAudio.onended = triggerPhaseTwo;
        }).catch(() => { 
            setTimeout(triggerPhaseTwo, 1500); 
        });
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleFoodScore'); 
        sessionStorage.removeItem('puzzleFoodThemeIndex'); 
        
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};