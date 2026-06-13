"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('puzzleAbcThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let score = parseInt(sessionStorage.getItem('puzzleAbcScore')) || 0;
    
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

    const abcDict = {
        "a": "A for Apple", "b": "B for Ball", "c": "C for Cat", "d": "D for Dog", 
        "e": "E for Elephant", "f": "F for Fish", "g": "G for Grapes", "h": "H for Horse", 
        "i": "I for Ice Cream", "j": "J for Jug", "k": "K for Kite", "l": "L for Lion", 
        "m": "M for Monkey", "n": "N for Nest", "o": "O for Orange", "p": "P for Parrot", 
        "q": "Q for Queen", "r": "R for Rabbit", "s": "S for Sun", "t": "T for Tiger", 
        "u": "U for Umbrella", "v": "V for Van", "w": "W for Watch", "x": "X for X-ray", 
        "y": "Y for Yak", "z": "Z for Zebra"
    };

    const allLetters = Object.keys(abcDict);
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

    document.getElementById("promptBox").addEventListener("click", () => {
        window.speechSynthesis.cancel();
        let msg = new SpeechSynthesisUtterance("Drag the picture to its matching letter!");
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
        
        let shuffled = [...allLetters].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        // --- Left Side: Drop Zones (The Letter Half) ---
        currentOptions.forEach(letterKey => {
            const dropZone = document.createElement("div");
            dropZone.className = "puzzle-drop-zone";
            dropZone.dataset.target = letterKey;
            
            dropZone.innerHTML = `
                <div class="left-half-content">
                    <img src="images/abc/letters/${letterKey}.webp" alt="Letter ${letterKey.toUpperCase()}">
                </div>
            `;
            leftColumn.appendChild(dropZone);
        });

        let dragOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        // --- Right Side: Draggable Pieces (The Picture Half) ---
        dragOptions.forEach(letterKey => {
            const dragPiece = document.createElement("div");
            dragPiece.className = "draggable-piece";
            dragPiece.dataset.match = letterKey;
            
            dragPiece.innerHTML = `<img src="images/abc/words/${letterKey}.webp" alt="${abcDict[letterKey]}">`;
            
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
        
        e.preventDefault(); // Prevents scroll

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

    // Mathematical collision detection!
    function getDropZone(dragItem) {
        const dragRect = dragItem.getBoundingClientRect();
        const dragCenterX = dragRect.left + dragRect.width / 2;
        const dragCenterY = dragRect.top + dragRect.height / 2;

        const dropZones = document.querySelectorAll('.puzzle-drop-zone:not(.matched)');
        for (let zone of dropZones) {
            const zoneRect = zone.getBoundingClientRect();
            // If the center of the dragged puzzle piece is inside the drop zone bounds
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
            
            // Snap it securely into the drop zone
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

            let matchAudio = new Audio(`sounds/en/abc/${currentDragItem.dataset.match}.mp3`);

            if (matchesFound === 3) {
                setTimeout(triggerVisualCelebration, 600);
                matchAudio.onended = triggerAudioCelebration;
                matchAudio.play().catch(e => { setTimeout(triggerAudioCelebration, 800); });
            } else {
                matchAudio.play().catch(e => console.log("Audio not found"));
            }

        } else {
            // --- MATCH FAILED ---
            let tryAgainAudio = new Audio(`sounds/en/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Audio not found"));
            
            currentDragItem.classList.add("shake");
            
            // Snap it back to the right column
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
        document.getElementById("feedback-score").innerText = "Total Score: " + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
    }

    let advanceTimer;
    function triggerAudioCelebration() {
        let greatJobAudio = new Audio(`sounds/en/great_job.mp3`);
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
            sessionStorage.setItem('puzzleAbcScore', score);
            let nextThemeIndex = (themeIndex + 1) % themes.length;
            sessionStorage.setItem('puzzleAbcThemeIndex', nextThemeIndex);
            window.location.reload();
        } else {
            startNewRound();
        }
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('puzzleAbcScore'); 
        sessionStorage.removeItem('puzzleAbcThemeIndex'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=alphabets";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    startNewRound();
};