"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('colorVarnmalaThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findAbcLang') || 'hi'; 
// Safety check: If they came from the ABC page with English selected, force it to Hindi
    if (currentLang === 'en') {
        currentLang = 'hi';
        sessionStorage.setItem('findAbcLang', 'hi');
    }

    let contentLang = currentLang;

    let score = parseInt(sessionStorage.getItem('colorVarnmalaScore')) || 0;
    let currentLetterIndex = parseInt(sessionStorage.getItem('colorVarnmalaLetterIdx')) || 0;
    
    let isPlaying = false;
    let isAudioPlaying = false; 
    let roundsPlayedThisSession = 0; 
    const ROUNDS_BEFORE_RELOAD = 5; 

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
        "game-title": { en: "🎨 Color Varnamala!", hi: "🎨 वर्णमाला रंगें!", mr: "🎨 वर्णमाला रंगवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Color the letter...", hi: "अक्षर को रंगें...", mr: "अक्षर रंगवा..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Color Varnamala | KidsFunLearnHub", hi: "वर्णमाला रंगें | KidsFunLearnHub", mr: "वर्णमाला रंगवा | KidsFunLearnHub" }
    };

    const swarDict = {
        "a": { hi: "अ - अनार", mr: "अ - अननस" },
        "aa": { hi: "आ - आम", mr: "आ - आई" },
        "i": { hi: "इ - इमली", mr: "इ - इमारत" },
        "ee": { hi: "ई - ईख", mr: "ई - इडलिंबू" },
        "u": { hi: "उ - उल्लू", mr: "उ - उखळ" },
        "oo": { hi: "ऊ - ऊन", mr: "ऊ - ऊस" },
        "ri": { hi: "ऋ - ऋषि", mr: "ऋ - ऋषी" },
        "e": { hi: "ए - एड़ी", mr: "ए - एक" },
        "ai": { hi: "ऐ - ऐनक", mr: "ऐ - ऐरण" },
        "o": { hi: "ओ - ओखली", mr: "ओ - ओझेवाला" },
        "au": { hi: "औ - औरत", mr: "औ - औषध" },
        "ang": { hi: "अं - अंगूर", mr: "अं - अंजीर" },
        "aha": { hi: "अः - प्रातः", mr: "अः - स्वतः" }
    };

    const vyanjanDict = {
        "k": { hi: "क - कबूतर", mr: "क - कमळ" },
        "kh": { hi: "ख - खरगोश", mr: "ख - खडू" },
        "g": { hi: "ग - गमला", mr: "ग - गणपती" },
        "gh": { hi: "घ - घर", mr: "घ - घर" },
        "dn": { hi: "ङ", mr: "ङ" },
        "ch": { hi: "च - चम्मच", mr: "च - चमचा" },
        "chh": { hi: "छ - छतरी", mr: "छ - छत्री" },
        "j": { hi: "ज - जग", mr: "ज - जहाज" },
        "jh": { hi: "झ - झंडा", mr: "झ - झेंडा" },
        "trh": { hi: "ञ", mr: "ञ" },
        "t1": { hi: "ट - टमाटर", mr: "ट - टरबूज" }, 
        "th1": { hi: "ठ - ठठेरा", mr: "ठ - ठसा" },
        "d1": { hi: "ड - डमरू", mr: "ड - डबा" },
        "dh1": { hi: "ढ - ढक्कन", mr: "ढ - ढग" },
        "n1": { hi: "ण - बाण", mr: "ण - बाण" },
        "t2": { hi: "त - तरबूज", mr: "त - तलवार" }, 
        "th2": { hi: "थ - थर्मस", mr: "थ - थवा" },
        "d2": { hi: "द - दवात", mr: "द - दप्तर" },
        "dh2": { hi: "ध - धनुष", mr: "ध - धनुष्य" },
        "n2": { hi: "न - नल", mr: "न - नळ" },
        "p": { hi: "प - पतंग", mr: "प - पतंग" },
        "ph": { hi: "फ - फल", mr: "फ - फणस" },
        "b": { hi: "ब - बस", mr: "ब - बदक" },
        "bh": { hi: "भ - भालू", mr: "भ - भटजी" },
        "m": { hi: "म - मछली", mr: "म - मगर" },
        "y": { hi: "य - यज्ञ", mr: "य - यज्ञ" },
        "r": { hi: "र - रथ", mr: "र - रथ" },
        "l": { hi: "ल - लट्टू", mr: "ल - लसूण" },
        "v": { hi: "व - वन", mr: "व - वजन" },
        "sh": { hi: "श - शलगम", mr: "श - शहामृग" },
        "shh": { hi: "ष - षट्कोण", mr: "ष - षटकोन" },
        "s": { hi: "स - सेब", mr: "स - ससा" },
        "h": { hi: "ह - हाथी", mr: "ह - हत्ती" },
        "ksh": { hi: "क्ष - क्षत्रिय", mr: "क्ष - क्षत्रिय" },
        "tr": { hi: "त्र - त्रिशूल", mr: "त्र - त्रिशूळ" },
        "gy": { hi: "ज्ञ - ज्ञानी", mr: "ज्ञ - ज्ञानी" }
    };

    const allLettersDict = { ...swarDict, ...vyanjanDict };
    const allLetters = Object.keys(allLettersDict);

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
        contentLang = (currentLang === 'en') ? 'hi' : currentLang;
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
            const devanagariChar = allLettersDict[targetLetterKey][contentLang].split("-")[0].trim();
            document.getElementById("target-letter-name").innerText = devanagariChar;
        }
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            updateLanguage(e.target.dataset.lang);
            playCustomAudio();
        });
    });

    function playCustomAudio() {
        if (isAudioPlaying) return; 
        isAudioPlaying = true;
        
        window.speechSynthesis.cancel();
        const targetLetterKey = allLetters[currentLetterIndex];
        const devanagariChar = allLettersDict[targetLetterKey][contentLang].split("-")[0].trim();
        
        let vocabAudio = new Audio(`sounds/${contentLang}/varnamala/${targetLetterKey}.mp3`);
        
        const triggerPhaseTwo = () => {
            vocabAudio.play().then(() => {
                vocabAudio.onended = () => { isAudioPlaying = false; };
            }).catch(e => { isAudioPlaying = false; });
        };

        let instructionAudio = new Audio(`sounds/${currentLang}/color_the_letter.mp3`);
        instructionAudio.play().then(() => {
            instructionAudio.onended = triggerPhaseTwo;
        }).catch(() => {
            let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang] + " " + devanagariChar);
            msg.rate = 0.85; msg.pitch = 1.2;
            msg.onend = triggerPhaseTwo;
            window.speechSynthesis.speak(msg);
        });
    }

    document.getElementById("promptBox").addEventListener("click", playCustomAudio);


    // ==========================================
    // 4. THE LAYERED DILATION ENGINE (EXACT COLORABC LOGIC)
    // ==========================================
    const canvasOutline = document.getElementById('canvasOutline');
    const ctxOutline = canvasOutline.getContext('2d', { willReadFrequently: true });
    const canvasMask = document.getElementById('canvasMask');
    const ctxMask = canvasMask.getContext('2d', { willReadFrequently: true });
    
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
        const targetLetterKey = allLetters[currentLetterIndex];
        const letter = allLettersDict[targetLetterKey][contentLang].split("-")[0].trim();
        
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        const fontSize = cw * 0.75; // Safely scaled for Hindi characters
        
        // Custom font stack for best Devanagari rendering
        const mobileSafeFonts = `900 ${fontSize}px 'Noto Sans Devanagari', 'Mangal', 'Arial', sans-serif`;

        // 1. Draw the Bottom Layer: The Fat Black Shadow (Bypasses Android Stroke Bug!)
        ctxOutline.globalCompositeOperation = 'source-over';
        ctxOutline.clearRect(0, 0, cw, ch);
        ctxOutline.font = mobileSafeFonts;
        ctxOutline.textAlign = 'center';
        ctxOutline.textBaseline = 'middle';
        ctxOutline.fillStyle = '#333333';
        
        const outlineThickness = cw * 0.025; 
        for(let i = 0; i < 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const dx = Math.cos(angle) * outlineThickness;
            const dy = Math.sin(angle) * outlineThickness;
            ctxOutline.fillText(letter, cw/2 + dx, ch/2 + dy);
        }

        // 2. Draw the Top Layer: The White Paint Trap
        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.clearRect(0, 0, cw, ch);
        ctxMask.font = mobileSafeFonts;
        ctxMask.textAlign = 'center';
        ctxMask.textBaseline = 'middle';
        ctxMask.fillStyle = '#ffffff'; 
        ctxMask.fillText(letter, cw/2, ch/2); 
        
        // Count Target Pixels directly from the mask just like colorabc.js!
        const imgData = ctxMask.getImageData(0, 0, cw, ch);
        const data = imgData.data;
        totalTargetPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 50) totalTargetPixels++;
        }
        
        // Lock the paint so it only draws over the white letter
        ctxMask.globalCompositeOperation = 'source-atop'; 
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

        // Set to 95% because Devanagari has some tricky dots/matras
        if (percentageFilled > 0.95) {
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
        ctxMask.lineWidth = canvasMask.width * 0.08; 
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
        const devanagariChar = allLettersDict[targetLetterKey][contentLang].split("-")[0].trim();
        document.getElementById("target-letter-name").innerText = devanagariChar;

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

        // Auto-fill everything perfectly
        const targetLetterKey = allLetters[currentLetterIndex];
        const devanagariChar = allLettersDict[targetLetterKey][contentLang].split("-")[0].trim();
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        const fontSize = cw * 0.75;
        
        const mobileSafeFonts = `900 ${fontSize}px 'Noto Sans Devanagari', 'Mangal', 'Arial', sans-serif`;
        
        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.fillStyle = currentColor;
        ctxMask.font = mobileSafeFonts;
        ctxMask.fillText(devanagariChar, cw/2, ch/2);

        setTimeout(() => handleSuccess(targetLetterKey), 500);
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
            feedbackText.innerText = allLettersDict[targetLetterKey][contentLang];
            
            // Check for 'dn' and 'trh' which don't have word images
            const imageExists = !["dn", "trh"].includes(targetLetterKey);
            if (imageExists) {
                feedbackImg.src = `images/varnamala/words/${contentLang}/${targetLetterKey}.webp`;
                feedbackImg.classList.remove("hidden"); 
            }

            let vocabAudio = new Audio(`sounds/${contentLang}/varnamala/${targetLetterKey}.mp3`);
            
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                vocabAudio.pause(); 
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                currentLetterIndex++;
                if (currentLetterIndex >= allLetters.length) currentLetterIndex = 0; 
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('colorVarnmalaScore', score);
                    sessionStorage.setItem('findAbcLang', currentLang);
                    sessionStorage.setItem('colorVarnmalaLetterIdx', currentLetterIndex); 
                    sessionStorage.setItem('colorVarnmalaThemeIndex', (themeIndex + 1) % themes.length);
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            vocabAudio.play().then(() => {
                vocabAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
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
        sessionStorage.removeItem('colorVarnmalaScore'); 
        sessionStorage.removeItem('colorVarnmalaThemeIndex');
        sessionStorage.removeItem('colorVarnmalaLetterIdx'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=hindi";
        window.location.href = returnUrl; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};