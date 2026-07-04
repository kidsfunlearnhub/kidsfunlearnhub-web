"use strict";

window.onload = function() {
    // --- THEME ROTATION SETUP ---
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('colorAbcThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    // 1. STATE & LOCALIZATION SETUP
    let currentLang = sessionStorage.getItem('findAbcLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('colorAbcScore')) || 0;
    
    // Track the sequential index!
    let currentLetterIndex = parseInt(sessionStorage.getItem('colorAbcLetterIdx')) || 0;
    
    let isPlaying = false;
    let isAudioPlaying = false; 

    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 

    // --- SOUND SYNTHESIZER ---
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
        "game-title": { en: "🎨 Color The Alphabet!", hi: "🎨 अक्षर रंगें!", mr: "🎨 अक्षर रंगवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Color the letter...", hi: "अक्षर को रंगें...", mr: "अक्षर रंगवा..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Color The Alphabet Game | KidsFunLearnHub", hi: "अक्षर रंगें खेल | KidsFunLearnHub", mr: "अक्षर रंगवा खेळ | KidsFunLearnHub" }
    };

    const abcDict = {
        "a": { en: "A for Apple", hi: "A - सेब", mr: "A - सफरचंद" },
        "b": { en: "B for Ball", hi: "B - गेंद", mr: "B - चेंडू" },
        "c": { en: "C for Cat", hi: "C - बिल्ली", mr: "C - मांजर" },
        "d": { en: "D for Dog", hi: "D - कुत्ता", mr: "D - कुत्रा" },
        "e": { en: "E for Elephant", hi: "E - हाथी", mr: "E - हत्ती" },
        "f": { en: "F for Fish", hi: "F - मछली", mr: "F - मासा" },
        "g": { en: "G for Grapes", hi: "G - अंगूर", mr: "G - द्राक्षे" },
        "h": { en: "H for Horse", hi: "H - घोड़ा", mr: "H - घोडा" },
        "i": { en: "I for Ice Cream", hi: "I - आइसक्रीम", mr: "I - आईस्क्रीम" },
        "j": { en: "J for Jug", hi: "J - जग", mr: "J - जग" },
        "k": { en: "K for Kite", hi: "K - पतंग", mr: "K - पतंग" },
        "l": { en: "L for Lion", hi: "L - शेर", mr: "L - सिंह" },
        "m": { en: "M for Monkey", hi: "M - बंदर", mr: "M - माकड" },
        "n": { en: "N for Nest", hi: "N - घोंसला", mr: "N - घरटे" },
        "o": { en: "O for Orange", hi: "O - संतरा", mr: "O - संत्री" },
        "p": { en: "P for Parrot", hi: "P - तोता", mr: "P - पोपट" },
        "q": { en: "Q for Queen", hi: "Q - रानी", mr: "Q - राणी" },
        "r": { en: "R for Rabbit", hi: "R - खरगोश", mr: "R - ससा" },
        "s": { en: "S for Sun", hi: "S - सूरज", mr: "S - सूर्य" },
        "t": { en: "T for Tiger", hi: "T - बाघ", mr: "T - वाघ" },
        "u": { en: "U for Umbrella", hi: "U - छाता", mr: "U - छत्री" },
        "v": { en: "V for Van", hi: "V - वैन", mr: "V - व्हॅन" },
        "w": { en: "W for Watch", hi: "W - घड़ी", mr: "W - घड्याळ" },
        "x": { en: "X for X-ray", hi: "X - एक्स-रे", mr: "X - एक्स-रे" },
        "y": { en: "Y for Yak", hi: "Y - याक", mr: "Y - याक" },
        "z": { en: "Z for Zebra", hi: "Z - ज़ेबरा", mr: "Z - झेब्रा" }
    };

    const allLetters = Object.keys(abcDict);
    const colorSwatches = ["#FF5722", "#4CAF50", "#2196F3", "#FFEB3B", "#9C27B0", "#E91E63"];

    document.getElementById("score").innerText = score;

    function initProgressTrack() {
        const dotsContainer = document.getElementById("dots-container");
        dotsContainer.innerHTML = "";
        for(let i = 0; i <= ROUNDS_BEFORE_RELOAD; i++) {
            let dot = document.createElement("div");
            dot.className = "path-dot";
            dotsContainer.appendChild(dot);
        }
    }

    function updateProgressTrack(isJumping = false, step = 0) {
        const runner = document.getElementById("runner-icon");
        const progressLine = document.getElementById("progress-line"); 
        
        let percentage = (step / ROUNDS_BEFORE_RELOAD) * 100;
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
        
        const targetLetterKey = allLetters[currentLetterIndex];
        if (targetLetterKey) {
            document.getElementById("target-letter-name").innerText = targetLetterKey.toUpperCase();
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio();
        });
    });

    // ==========================================
    // 3. UPGRADED SEQUENTIAL AUDIO PLAYBACK
    // ==========================================
    function playCustomAudio() {
        if (isAudioPlaying) return; 
        isAudioPlaying = true;
        
        window.speechSynthesis.cancel();
        
        const targetLetterKey = allLetters[currentLetterIndex];
        
        // Prepare the saved vocabulary MP3 (e.g., "A for Apple")
        let vocabAudio = new Audio(`sounds/${currentLang}/abc/${targetLetterKey}.mp3`);
        
        // Helper to trigger the vocabulary sound
        const triggerPhaseTwo = () => {
            vocabAudio.play().then(() => {
                vocabAudio.onended = () => { isAudioPlaying = false; };
            }).catch(e => {
                console.log("Vocabulary audio missing:", e);
                isAudioPlaying = false; 
            });
        };

        // If you have a custom "color_the_letter.mp3", it will play that first!
        let instructionAudio = new Audio(`sounds/${currentLang}/color_the_letter.mp3`);
        
        instructionAudio.play().then(() => {
            instructionAudio.onended = triggerPhaseTwo;
        }).catch(() => {
            // FALLBACK: If there's no custom MP3, the computer speaks the instruction, 
            // then perfectly hands it off to your saved vocabulary MP3!
            let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang]);
            msg.rate = 0.85; 
            msg.pitch = 1.2;
            msg.onend = triggerPhaseTwo;
            window.speechSynthesis.speak(msg);
        });
    }

    document.getElementById("promptBox").addEventListener("click", playCustomAudio);


    // ==========================================
    // 4. CANVAS PIXEL COLORING LOGIC (THE MAGIC)
    // ==========================================
    const canvasMask = document.getElementById('canvasMask');
    const ctxMask = canvasMask.getContext('2d', { willReadFrequently: true });
    const canvasOutline = document.getElementById('canvasOutline');
    const ctxOutline = canvasOutline.getContext('2d');
    
    const pencilCursor = document.getElementById('pencilCursor');
    const pencilSVG = document.getElementById('pencilSVG');

    let currentColor = colorSwatches[0];
    let isDrawing = false;
    
    let totalTargetPixels = 0;
    let checkInterval = null;

    function resizeCanvas() {
        const rect = document.getElementById('coloringArea').getBoundingClientRect();
        canvasMask.width = rect.width;
        canvasMask.height = rect.height;
        canvasOutline.width = rect.width;
        canvasOutline.height = rect.height;
        renderLetterCanvas();
        centerPencil();
    }

    window.addEventListener('resize', resizeCanvas);

    function centerPencil() {
        const rect = canvasMask.getBoundingClientRect();
        pencilCursor.style.left = (rect.left + rect.width / 2) + 'px';
        pencilCursor.style.top = (rect.top + rect.height / 2) + 'px';
    }

    function renderLetterCanvas() {
        const letter = allLetters[currentLetterIndex].toUpperCase();
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        const fontSize = cw * 0.8; 

        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.clearRect(0, 0, cw, ch);
        ctxMask.font = `900 ${fontSize}px 'Comic Sans MS', sans-serif`;
        ctxMask.textAlign = 'center';
        ctxMask.textBaseline = 'middle';
        ctxMask.fillStyle = '#ffffff'; 
        ctxMask.fillText(letter, cw/2, ch/2 + (fontSize * 0.05)); 
        
        const imgData = ctxMask.getImageData(0, 0, cw, ch);
        const data = imgData.data;
        totalTargetPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 50) {
                totalTargetPixels++;
            }
        }
        
        ctxMask.globalCompositeOperation = 'source-atop'; 

        ctxOutline.clearRect(0, 0, cw, ch);
        ctxOutline.font = `900 ${fontSize}px 'Comic Sans MS', sans-serif`;
        ctxOutline.textAlign = 'center';
        ctxOutline.textBaseline = 'middle';
        ctxOutline.lineWidth = cw * 0.03; 
        ctxOutline.strokeStyle = '#333333';
        ctxOutline.strokeText(letter, cw/2, ch/2 + (fontSize * 0.05));
    }

    function checkFillProgress() {
        if (!isPlaying || totalTargetPixels === 0) return;

        const imgData = ctxMask.getImageData(0, 0, canvasMask.width, canvasMask.height);
        const data = imgData.data;
        let coloredPixels = 0;

        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 50) {
                if (data[i] < 240 || data[i + 1] < 240 || data[i + 2] < 240) {
                    coloredPixels++;
                }
            }
        }

        const percentageFilled = coloredPixels / totalTargetPixels;

        if (percentageFilled > 0.90) {
            clearInterval(checkInterval);
            finishColoring();
        }
    }

    function movePencil(e) {
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.clientX !== undefined) {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            return;
        }
        pencilCursor.style.left = clientX + 'px';
        pencilCursor.style.top = clientY + 'px';
    }

    function startColoring(e) {
        if (!isPlaying) return;
        isDrawing = true;

        const rect = canvasMask.getBoundingClientRect();
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        movePencil(e);
        
        ctxMask.beginPath();
        ctxMask.lineWidth = canvasMask.width * 0.25; 
        ctxMask.lineCap = 'round';
        ctxMask.lineJoin = 'round';
        ctxMask.strokeStyle = currentColor;
        ctxMask.moveTo(x, y);
        ctxMask.lineTo(x + 0.1, y);
        ctxMask.stroke();

        if (!checkInterval) {
            checkInterval = setInterval(checkFillProgress, 400); 
        }
    }

    function handlePointerMove(e) {
        movePencil(e);

        if (!isDrawing || !isPlaying) return;
        e.preventDefault(); 

        const rect = canvasMask.getBoundingClientRect();
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctxMask.lineTo(x, y);
        ctxMask.stroke();
        ctxMask.beginPath();
        ctxMask.moveTo(x, y);
    }

    function stopColoring() {
        isDrawing = false;
        ctxMask.beginPath();
        clearInterval(checkInterval);
        checkInterval = null;
        checkFillProgress(); 
    }

    canvasMask.addEventListener('mousedown', startColoring);
    canvasMask.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', stopColoring);
    
    canvasMask.addEventListener('touchstart', startColoring, {passive: false});
    canvasMask.addEventListener('touchmove', handlePointerMove, {passive: false});
    window.addEventListener('touchend', stopColoring);


    // ==========================================
    // 5. CORE GAME LOGIC
    // ==========================================
    function startNewRound() {
        isPlaying = true;
        clearInterval(checkInterval);
        checkInterval = null;
        updateProgressTrack(false, roundsPlayedThisSession);

        const targetLetterKey = allLetters[currentLetterIndex];
        document.getElementById("target-letter-name").innerText = targetLetterKey.toUpperCase();

        resizeCanvas(); 

        const paletteContainer = document.getElementById("colorPalette");
        paletteContainer.innerHTML = "";
        
        let shuffledColors = [...colorSwatches].sort(() => 0.5 - Math.random());
        currentColor = shuffledColors[0];
        pencilSVG.setAttribute('fill', currentColor);
        
        shuffledColors.forEach(hex => {
            const swatch = document.createElement("div");
            swatch.className = "color-swatch";
            if(hex === currentColor) swatch.classList.add("active");
            swatch.style.background = hex;
            swatch.onclick = () => {
                document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
                swatch.classList.add('active');
                currentColor = hex;
                pencilSVG.setAttribute('fill', hex);
            };
            paletteContainer.appendChild(swatch);
        });

        setTimeout(playCustomAudio, 500);
    }

    function finishColoring() {
        isPlaying = false;
        isDrawing = false;
        clearInterval(checkInterval);
        checkInterval = null;

        const letter = allLetters[currentLetterIndex].toUpperCase();
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        const fontSize = cw * 0.8;
        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.fillStyle = currentColor;
        ctxMask.fillText(letter, cw/2, ch/2 + (fontSize * 0.05));

        setTimeout(() => handleSuccess(allLetters[currentLetterIndex]), 500);
    }

    function handleSuccess(targetLetterKey) {
        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackImg = document.getElementById("feedback-img");
        const feedbackScore = document.getElementById("feedback-score");

        score += 10;
        document.getElementById("score").innerText = score;
        updateProgressTrack(true, roundsPlayedThisSession + 1);

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
            feedbackText.innerText = abcDict[targetLetterKey][currentLang];
            feedbackImg.src = `images/abc/words/${targetLetterKey}.webp`;
            feedbackImg.classList.remove("hidden"); 

            let letterAudio = new Audio(`sounds/${currentLang}/abc/${targetLetterKey}.mp3`);
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                letterAudio.pause(); 
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                
                currentLetterIndex++;
                if (currentLetterIndex >= allLetters.length) {
                    currentLetterIndex = 0; 
                }
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('colorAbcScore', score);
                    sessionStorage.setItem('findAbcLang', currentLang);
                    sessionStorage.setItem('colorAbcLetterIdx', currentLetterIndex); 
                    
                    let nextThemeIndex = (themeIndex + 1) % themes.length;
                    sessionStorage.setItem('colorAbcThemeIndex', nextThemeIndex);
                    
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            letterAudio.play().then(() => {
                letterAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
            }).catch(e => {
                autoTimer = setTimeout(advanceToNext, 2000);
            });
        };

        greatJobAudio.play().then(() => {
            greatJobAudio.onended = triggerPhaseTwo;
        }).catch(() => {
            setTimeout(triggerPhaseTwo, 1500); 
        });
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('colorAbcScore'); 
        sessionStorage.removeItem('colorAbcThemeIndex');
        sessionStorage.removeItem('colorAbcLetterIdx'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=alphabets";
        window.location.href = returnUrl; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};