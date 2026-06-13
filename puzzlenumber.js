"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleNumberThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findNumberLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('puzzleNumberScore')) || 0;
    
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
        "game-title": { en: "🔢 Number Puzzle Match!", hi: "🔢 नंबर पहेली!", mr: "🔢 क्रमांक कोडे!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Drag the objects to the correct number!", hi: "वस्तुओं को सही नंबर पर खींचें!", mr: "वस्तूंना योग्य क्रमांकावर ओढा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Number Puzzle Match | KidsFunLearnHub", hi: "नंबर पहेली खेल | KidsFunLearnHub", mr: "क्रमांक कोडे खेळ | KidsFunLearnHub" }
    };

    // Dictionary limited strictly to 1 through 20
    const numbersDict = {
        "1": { en: "One", hi: "एक", mr: "एक" }, "2": { en: "Two", hi: "दो", mr: "दोन" },
        "3": { en: "Three", hi: "तीन", mr: "तीन" }, "4": { en: "Four", hi: "चार", mr: "चार" },
        "5": { en: "Five", hi: "पांच", mr: "पाच" }, "6": { en: "Six", hi: "छह", mr: "सहा" },
        "7": { en: "Seven", hi: "सात", mr: "सात" }, "8": { en: "Eight", hi: "आठ", mr: "आठ" },
        "9": { en: "Nine", hi: "नौ", mr: "नऊ" }, "10": { en: "Ten", hi: "दस", mr: "दहा" },
        "11": { en: "Eleven", hi: "ग्यारह", mr: "अकरा" }, "12": { en: "Twelve", hi: "बारह", mr: "बारा" },
        "13": { en: "Thirteen", hi: "तेरह", mr: "तेरा" }, "14": { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        "15": { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" }, "16": { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        "17": { en: "Seventeen", hi: "सत्रह", mr: "सतरा" }, "18": { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        "19": { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" }, "20": { en: "Twenty", hi: "बीस", mr: "वीस" }
    };

    const allNumbers = Object.keys(numbersDict);
    
    // Extracted directly from numberscount.js
    const availableImages = [
      "images/numberscount/sparrow.webp", "images/numberscount/tiger.webp", "images/numberscount/lion.webp",
      "images/numberscount/elephant.webp", "images/numberscount/dog.webp", "images/numberscount/ant.webp",
      "images/numberscount/butterfly.webp", "images/numberscount/t1.webp", "images/numberscount/capsicum.webp",
      "images/numberscount/cat.webp", "images/numberscount/17.webp", "images/numberscount/parrot.webp",
      "images/numberscount/pigeon.webp", "images/numberscount/cow.webp", "images/numberscount/guava.webp",
      "images/numberscount/housefly.webp", "images/numberscount/ladybug.webp", "images/numberscount/lotus.webp",
      "images/numberscount/monkey.webp", "images/numberscount/8.webp"
    ];

    const numberImages = {};
    for (let i = 1; i <= 20; i++) {
      numberImages[i] = availableImages[(i - 1) % availableImages.length];
    }

    const cardColors = ["#FF5722", "#4CAF50", "#2196F3", "#9C27B0", "#E91E63", "#00BCD4"];
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

    function getLocalDigit(num) {
        if (currentLang === 'hi' || currentLang === 'mr') {
            const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
            return num.toString().split('').map(digit => devanagariDigits[digit]).join('');
        }
        return num; 
    }

    function updateLanguage(lang) {
        currentLang = lang;
        sessionStorage.setItem('findNumberLang', lang); 
        
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

        if (document.getElementById("left-column").innerHTML !== "") {
            document.querySelectorAll('.puzzle-drop-zone .number-text').forEach(span => {
                const numKey = span.parentElement.parentElement.dataset.target;
                span.textContent = getLocalDigit(numKey);
            });
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const newLang = e.target.dataset.lang;
            if(newLang !== currentLang) {
                updateLanguage(newLang);
                window.location.reload(); 
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
        
        let shuffled = [...allNumbers].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        // --- Left Side: Drop Zones (Number Digits in Text) ---
        currentOptions.forEach((numKey, index) => {
            const dropZone = document.createElement("div");
            dropZone.className = "puzzle-drop-zone";
            dropZone.dataset.target = numKey;
            
            const color = cardColors[index % cardColors.length];
            const displayDigit = getLocalDigit(numKey);
            
            dropZone.innerHTML = `
                <div class="left-half-content">
                    <span class="number-text" style="color: ${color};">${displayDigit}</span>
                </div>
            `;
            leftColumn.appendChild(dropZone);
        });

        let dragOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        // --- Right Side: Draggable Pieces (Dynamic Sized Images) ---
        dragOptions.forEach(numKey => {
            const dragPiece = document.createElement("div");
            dragPiece.className = "draggable-piece";
            dragPiece.dataset.match = numKey;
            
            let imagesHtml = '';
            const imgSrc = numberImages[numKey];
            const limit = parseInt(numKey);
            
            // INCREASED DYNAMIC SIZING: Max size 100px for 1 object, perfectly scaled down for 20
            // const dynamicSize = Math.min(100, Math.floor(130 / Math.sqrt(limit)));

            const dynamicSize = Math.min(120, Math.floor(160 / Math.sqrt(limit)));
            
            for(let i = 0; i < limit; i++) {
                imagesHtml += `<img src="${imgSrc}" class="mini-count-img" style="width: ${dynamicSize}px; height: ${dynamicSize}px;" alt="Object">`;
            }
            
            dragPiece.innerHTML = `<div class="repeated-images-container">${imagesHtml}</div>`;
            
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

            let matchAudio = new Audio(`sounds/${currentLang}/numbers/${currentDragItem.dataset.match}.mp3`);

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
            
            // Adjusted the fallback height to match the new larger CSS height
            const rightColumn = document.getElementById("right-column");
            currentDragItem.style.position = 'static';
            currentDragItem.style.width = '100%';
            currentDragItem.style.height = 'clamp(130px, 22vh, 180px)';
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
            sessionStorage.setItem('puzzleNumberScore', score);
            sessionStorage.setItem('findNumberLang', currentLang);
            let nextThemeIndex = (themeIndex + 1) % themes.length;
            sessionStorage.setItem('puzzleNumberThemeIndex', nextThemeIndex);
            window.location.reload();
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleNumberScore'); 
        sessionStorage.removeItem('puzzleNumberThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=numbers";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};