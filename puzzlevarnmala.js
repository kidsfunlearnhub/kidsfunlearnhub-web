"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleVarnmalaThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // Default to Hindi if coming from an English game, else use saved
    let currentLang = sessionStorage.getItem('findAbcLang'); 
    if (!currentLang || currentLang === 'en') {
        currentLang = 'hi';
    }

    let score = parseInt(sessionStorage.getItem('puzzleVarnmalaScore')) || 0;
    
    let matchesFound = 0; 
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 
    const MATCHES_PER_ROUND = 3;
    const TOTAL_MATCHES_PER_LEVEL = ROUNDS_BEFORE_RELOAD * MATCHES_PER_ROUND;

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
        "game-title": { hi: "🧩 वर्णमाला पहेली!", mr: "🧩 वर्णमाला कोडे!" },
        "score-label": { hi: "स्कोर:", mr: "गुण:" },
        "instruction": { hi: "चित्र को उसके अक्षर तक खींचें!", mr: "चित्र त्याच्या अक्षराकडे ओढा!" },
        "backBtn": { hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { hi: "वर्णमाला पहेली खेल | KidsFunLearnHub", mr: "वर्णमाला कोडे खेळ | KidsFunLearnHub" }
    };

    const varnmalaDict = {
        "a": { hi: "अ - अनार", mr: "अ - अननस" }, "aa": { hi: "आ - आम", mr: "आ - आई" },
        "i": { hi: "इ - इमली", mr: "इ - इमारत" }, "ee": { hi: "ई - ईख", mr: "ई - इडलिंबू" },
        "u": { hi: "उ - उल्लू", mr: "उ - उखळ" }, "oo": { hi: "ऊ - ऊन", mr: "ऊ - ऊस" },
        "ri": { hi: "ऋ - ऋषि", mr: "ऋ - ऋषी" }, "e": { hi: "ए - एड़ी", mr: "ए - एक" },
        "ai": { hi: "ऐ - ऐनक", mr: "ऐ - ऐरण" }, "o": { hi: "ओ - ओखली", mr: "ओ - ओझेवाला" },
        "au": { hi: "औ - औरत", mr: "औ - औषध" }, "ang": { hi: "अं - अंगूर", mr: "अं - अंजीर" },
        "aha": { hi: "अः - प्रातः", mr: "अः - स्वतः" }, "k": { hi: "क - कबूतर", mr: "क - कमळ" },
        "kh": { hi: "ख - खरगोश", mr: "ख - खडू" }, "g": { hi: "ग - गमला", mr: "ग - गणपती" },
        "gh": { hi: "घ - घर", mr: "घ - घर" }, "dn": { hi: "ङ", mr: "ङ" },
        "ch": { hi: "च - चम्मच", mr: "च - चमचा" }, "chh": { hi: "छ - छतरी", mr: "छ - छत्री" },
        "j": { hi: "ज - जग", mr: "ज - जहाज" }, "jh": { hi: "झ - झंडा", mr: "झ - झेंडा" },
        "trh": { hi: "ञ", mr: "ञ" }, "t1": { hi: "ट - टमाटर", mr: "ट - टरबूज" },
        "th1": { hi: "ठ - ठठेरा", mr: "ठ - ठसा" }, "d1": { hi: "ड - डमरू", mr: "ड - डबा" },
        "dh1": { hi: "ढ - ढक्कन", mr: "ढ - ढग" }, "n1": { hi: "ण - बाण", mr: "ण - बाण" },
        "t2": { hi: "त - तरबूज", mr: "त - तलवार" }, "th2": { hi: "थ - थर्मस", mr: "थ - थवा" },
        "d2": { hi: "द - दवात", mr: "द - दप्तर" }, "dh2": { hi: "ध - धनुष", mr: "ध - धनुष्य" },
        "n2": { hi: "न - नल", mr: "न - नळ" }, "p": { hi: "प - पतंग", mr: "प - पतंग" },
        "ph": { hi: "फ - फल", mr: "फ - फणस" }, "b": { hi: "ब - बस", mr: "ब - बदक" },
        "bh": { hi: "भ - भालू", mr: "भ - भटजी" }, "m": { hi: "म - मछली", mr: "म - मगर" },
        "y": { hi: "य - यज्ञ", mr: "य - यज्ञ" }, "r": { hi: "र - रथ", mr: "र - रथ" },
        "l": { hi: "ल - लट्टू", mr: "ल - लसूण" }, "v": { hi: "व - वन", mr: "व - वजन" },
        "sh": { hi: "श - शलगम", mr: "श - शहामृग" }, "shh": { hi: "ष - षट्कोण", mr: "ष - षटकोन" },
        "s": { hi: "स - सेब", mr: "स - ससा" }, "h": { hi: "ह - हाथी", mr: "ह - हत्ती" },
        "ksh": { hi: "क्ष - क्षत्रिय", mr: "क्ष - क्षत्रिय" }, "tr": { hi: "त्र - त्रिशूल", mr: "त्र - त्रिशूळ" },
        "gy": { hi: "ज्ञ - ज्ञानी", mr: "ज्ञ - ज्ञानी" }
    };

    const allVarnmalaKeys = Object.keys(varnmalaDict);
    document.getElementById("score").innerText = score;

    function initProgressTrack() {
        const dotsContainer = document.getElementById("dots-container");
        dotsContainer.innerHTML = "";
        for(let i = 0; i <= TOTAL_MATCHES_PER_LEVEL; i++) {
            let dot = document.createElement("div");
            dot.className = "path-dot";
            dotsContainer.appendChild(dot);
        }
    }

    function updateProgressTrack(isJumping = false) {
        const runner = document.getElementById("runner-icon");
        const progressLine = document.getElementById("progress-line"); 
        let currentTotalMatches = (roundsPlayedThisSession * MATCHES_PER_ROUND) + matchesFound;
        let percentage = (currentTotalMatches / TOTAL_MATCHES_PER_LEVEL) * 100;
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
        document.getElementById("feedback-text").innerText = uiDict["correct"][currentLang];
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newLang = e.target.dataset.lang;
            if(newLang !== currentLang) {
                updateLanguage(newLang);
                window.location.reload(); // Reloads to instantly switch the vocab images
            }
        });
    });

    document.getElementById("promptBox").addEventListener("click", () => {
        window.speechSynthesis.cancel();
        let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang]);
        msg.rate = 0.85; msg.pitch = 1.2;
        window.speechSynthesis.speak(msg);
    });

    function startNewRound() {
        matchesFound = 0;
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allVarnmalaKeys].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        // --- Left Side: Drop Zones (The Letter Half) ---
        currentOptions.forEach(vKey => {
            const dropZone = document.createElement("div");
            dropZone.className = "puzzle-drop-zone";
            dropZone.dataset.target = vKey;
            
            dropZone.innerHTML = `
                <div class="left-half-content">
                    <img src="images/varnamala/letters/${vKey}.webp" alt="${varnmalaDict[vKey]['hi']}">
                </div>
            `;
            leftColumn.appendChild(dropZone);
        });

        let dragOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        // --- Right Side: Draggable Pieces (The Picture Half) ---
        dragOptions.forEach(vKey => {
            const dragPiece = document.createElement("div");
            dragPiece.className = "draggable-piece";
            dragPiece.dataset.match = vKey;
            
            // Note: Vocabulary images are language specific!
            dragPiece.innerHTML = `<img src="images/varnamala/words/${currentLang}/${vKey}.webp" alt="Vocabulary Image">`;
            
            setupDragAndDrop(dragPiece);
            rightColumn.appendChild(dragPiece);
        });
    }

    // --- BULLETPROOF BOUNDING BOX DRAG AND DROP ---
    let currentDragItem = null;

    function setupDragAndDrop(element) {
        element.addEventListener('pointerdown', onPointerDown);
    }

    function onPointerDown(e) {
        if (e.target.closest('.matched')) return;
        currentDragItem = e.currentTarget;
        
        e.preventDefault(); 

        const rect = currentDragItem.getBoundingClientRect();
        
        currentDragItem.style.width = rect.width + 'px';
        currentDragItem.style.height = rect.height + 'px';
        
        currentDragItem.style.position = 'absolute';
        currentDragItem.style.zIndex = 1000;
        document.body.appendChild(currentDragItem);

        moveAt(e.pageX, e.pageY);

        currentDragItem.classList.add('dragging');
        currentDragItem.setPointerCapture(e.pointerId);

        currentDragItem.addEventListener('pointermove', onPointerMove);
        currentDragItem.addEventListener('pointerup', onPointerUp);
        currentDragItem.addEventListener('pointercancel', onPointerUp);
    }

    function moveAt(pageX, pageY) {
        currentDragItem.style.left = pageX - currentDragItem.offsetWidth / 2 + 'px';
        currentDragItem.style.top = pageY - currentDragItem.offsetHeight / 2 + 'px';
    }

    function getDropZone(dragItem) {
        const dragRect = dragItem.getBoundingClientRect();
        const dragCenterX = dragRect.left + dragRect.width / 2;
        const dragCenterY = dragRect.top + dragRect.height / 2;

        const dropZones = document.querySelectorAll('.puzzle-drop-zone:not(.matched)');
        for (let zone of dropZones) {
            const zoneRect = zone.getBoundingClientRect();
            if (dragCenterX >= zoneRect.left && dragCenterX <= zoneRect.right &&
                dragCenterY >= zoneRect.top && dragCenterY <= zoneRect.bottom) {
                return zone;
            }
        }
        return null;
    }

    function onPointerMove(e) {
        if (!currentDragItem) return;
        moveAt(e.pageX, e.pageY);

        const dropZone = getDropZone(currentDragItem);
        
        document.querySelectorAll('.puzzle-drop-zone').forEach(zone => zone.classList.remove('drag-over'));
        if (dropZone) {
            dropZone.classList.add('drag-over');
        }
    }

    function onPointerUp(e) {
        if (!currentDragItem) return;
        
        currentDragItem.removeEventListener('pointermove', onPointerMove);
        currentDragItem.removeEventListener('pointerup', onPointerUp);
        currentDragItem.removeEventListener('pointercancel', onPointerUp);
        currentDragItem.releasePointerCapture(e.pointerId);
        currentDragItem.classList.remove('dragging');

        let dropZone = getDropZone(currentDragItem);

        if (dropZone && dropZone.dataset.target === currentDragItem.dataset.match) {
            // --- MATCH SUCCESS ---
            dropZone.classList.remove('drag-over');
            dropZone.classList.add('matched');
            
            currentDragItem.style.position = 'static';
            currentDragItem.style.width = '45%'; 
            currentDragItem.style.height = '100%';
            currentDragItem.style.border = 'none';
            currentDragItem.style.boxShadow = 'none';
            
            dropZone.appendChild(currentDragItem);
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/varnamala/${currentDragItem.dataset.match}.mp3`);

            if (matchesFound === 3) {
                setTimeout(triggerVisualCelebration, 600);
                matchAudio.onended = triggerAudioCelebration;
                matchAudio.play().catch(e => { setTimeout(triggerAudioCelebration, 800); });
            } else {
                matchAudio.play().catch(e => console.log("Audio not found"));
            }

        } else {
            // --- MATCH FAILED ---
            let tryAgainAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Audio not found"));
            
            currentDragItem.classList.add("shake");
            
            const rightColumn = document.getElementById("right-column");
            currentDragItem.style.position = 'static';
            currentDragItem.style.width = '100%';
            currentDragItem.style.height = 'clamp(90px, 15vh, 120px)';
            rightColumn.appendChild(currentDragItem);
            
            setTimeout(() => { currentDragItem.classList.remove("shake"); }, 500);
        }

        if (dropZone) dropZone.classList.remove('drag-over');
        currentDragItem = null;
    }

    // --- CELEBRATION SEQUENCES ---
    function triggerVisualCelebration() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-score").innerText = uiDict["total-score"][currentLang] + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
    }

    let advanceTimer;
    function triggerAudioCelebration() {
        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Audio not found"));
        
        roundsPlayedThisSession++; 
        
        advanceTimer = setTimeout(advanceToNextRound, 2500);
        document.getElementById("feedback").onclick = advanceToNextRound;
    }

    function advanceToNextRound() {
        clearTimeout(advanceTimer);
        const feedback = document.getElementById("feedback");
        feedback.classList.add("hidden");
        feedback.onclick = null; 

        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
            sessionStorage.setItem('puzzleVarnmalaScore', score);
            let nextThemeIndex = (themeIndex + 1) % themes.length;
            sessionStorage.setItem('puzzleVarnmalaThemeIndex', nextThemeIndex);
            window.location.reload();
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleVarnmalaScore'); 
        sessionStorage.removeItem('puzzleVarnmalaThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=hindi";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};