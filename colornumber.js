"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('colorNumberThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findAbcLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('colorNumberScore')) || 0;
    let currentNumberIndex = parseInt(sessionStorage.getItem('colorNumberIdx')) || 0;
    
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
        "game-title": { en: "🎨 Color Numbers!", hi: "🎨 नंबर रंगें!", mr: "🎨 क्रमांक रंगवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Color the number...", hi: "नंबर को रंगें...", mr: "क्रमांक रंगवा..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Color Numbers Game | KidsFunLearnHub", hi: "नंबर रंगें खेल | KidsFunLearnHub", mr: "क्रमांक रंगवा खेळ | KidsFunLearnHub" }
    };

    const numbersDict = {
        "1": { en: "One", hi: "एक", mr: "एक" },
        "2": { en: "Two", hi: "दो", mr: "दोन" },
        "3": { en: "Three", hi: "तीन", mr: "तीन" },
        "4": { en: "Four", hi: "चार", mr: "चार" },
        "5": { en: "Five", hi: "पांच", mr: "पाच" },
        "6": { en: "Six", hi: "छह", mr: "सहा" },
        "7": { en: "Seven", hi: "सात", mr: "सात" },
        "8": { en: "Eight", hi: "आठ", mr: "आठ" },
        "9": { en: "Nine", hi: "नौ", mr: "नऊ" },
        "10": { en: "Ten", hi: "दस", mr: "दहा" },
        "11": { en: "Eleven", hi: "ग्यारह", mr: "अकरा" },
        "12": { en: "Twelve", hi: "बारह", mr: "बारा" },
        "13": { en: "Thirteen", hi: "तेरह", mr: "तेरा" },
        "14": { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        "15": { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" },
        "16": { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        "17": { en: "Seventeen", hi: "सत्रह", mr: "सतरा" },
        "18": { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        "19": { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" },
        "20": { en: "Twenty", hi: "बीस", mr: "वीस" },
        "21": { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" },
        "22": { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        "23": { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" },
        "24": { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        "25": { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" },
        "26": { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        "27": { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" },
        "28": { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        "29": { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" },
        "30": { en: "Thirty", hi: "तीस", mr: "तीस" },
        "31": { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" },
        "32": { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        "33": { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" },
        "34": { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        "35": { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" },
        "36": { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        "37": { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" },
        "38": { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        "39": { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" },
        "40": { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    const allNumbers = Object.keys(numbersDict);
    const colorSwatches = ["#FF5722", "#4CAF50", "#2196F3", "#FFEB3B", "#9C27B0", "#E91E63"];

    const availableImages = [
      "images/numberscount/sparrow.webp", "images/numberscount/tiger.webp", "images/numberscount/lion.webp",
      "images/numberscount/elephant.webp", "images/numberscount/dog.webp", "images/numberscount/ant.webp",
      "images/numberscount/butterfly.webp", "images/numberscount/t1.webp", "images/numberscount/capsicum.webp",
      "images/numberscount/cat.webp", "images/numberscount/17.webp", "images/numberscount/parrot.webp",
      "images/numberscount/pigeon.webp", "images/numberscount/cow.webp", "images/numberscount/guava.webp",
      "images/numberscount/housefly.webp", "images/numberscount/ladybug.webp", "images/numberscount/lotus.webp",
      "images/numberscount/monkey.webp", "images/numberscount/8.webp", "images/numberscount/onion.webp",
      "images/numberscount/panda.webp", "images/numberscount/potato.webp", "images/numberscount/rabbit.webp",
      "images/numberscount/rose.webp", "images/numberscount/beetroot.webp", "images/numberscount/okra.webp",
      "images/numberscount/9.webp", "images/numberscount/10.webp", "images/numberscount/13.webp",
      "images/numberscount/14.webp", "images/numberscount/18.webp", "images/numberscount/22.webp",
      "images/numberscount/23.webp", "images/numberscount/24.webp", "images/numberscount/star.webp",
      "images/numberscount/sunflower.webp", "images/numberscount/th2.webp", "images/numberscount/zinnia.webp"
    ];

    const numberImages = {};
    for (let i = 1; i <= 40; i++) {
      let index = (i - 1) % availableImages.length;
      numberImages[String(i)] = availableImages[index];
    }

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

    function getDisplayNumber(numStr, lang) {
        if (lang === 'en') return numStr;
        const devanagariDigits = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
        return numStr.split('').map(char => devanagariDigits[char] || char).join('');
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
        
        const targetNumberKey = allNumbers[currentNumberIndex];
        if (targetNumberKey) {
            document.getElementById("target-letter-name").innerText = getDisplayNumber(targetNumberKey, currentLang);
        }
    }

    // ==========================================
    // INSTANT CANVAS REDRAW ON LANGUAGE SWITCH
    // ==========================================
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedLang = e.target.dataset.lang;
            if (currentLang === selectedLang) return; // Prevent unnecessary redraws
            
            updateLanguage(selectedLang);
            
            if (isPlaying) {
                // Instantly wipe and redraw the canvas with the new language shape!
                renderNumberCanvas();
            }
            playCustomAudio();
        });
    });

    function playCustomAudio() {
        if (isAudioPlaying) return; 
        isAudioPlaying = true;
        
        window.speechSynthesis.cancel();
        const targetNumberKey = allNumbers[currentNumberIndex];
        
        let vocabAudio = new Audio(`sounds/${currentLang}/numbers/${targetNumberKey}.mp3`);
        
        const triggerPhaseTwo = () => {
            vocabAudio.play().then(() => {
                vocabAudio.onended = () => { isAudioPlaying = false; };
            }).catch(e => { isAudioPlaying = false; });
        };

        let instructionAudio = new Audio(`sounds/${currentLang}/color_the_number.mp3`);
        instructionAudio.play().then(() => {
            instructionAudio.onended = triggerPhaseTwo;
        }).catch(() => {
            if (currentLang === 'mr') {
                triggerPhaseTwo();
            } else {
                const spokenText = getDisplayNumber(targetNumberKey, currentLang);
                let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang] + " " + spokenText);
                msg.rate = 0.85; msg.pitch = 1.2;
                msg.onend = triggerPhaseTwo;
                window.speechSynthesis.speak(msg);
            }
        });
    }

    document.getElementById("promptBox").addEventListener("click", playCustomAudio);


    // ==========================================
    // 4. THE EXACT COLORABC LOGIC (NO HIDDEN CANVASES)
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
        renderNumberCanvas();
        centerPencil();
    }

    window.addEventListener('resize', resizeCanvas);

    function centerPencil() {
        const rect = canvasMask.getBoundingClientRect();
        pencilCursor.style.left = (rect.left + rect.width / 2) + 'px';
        pencilCursor.style.top = (rect.top + rect.height / 2) + 'px';
    }

    function renderNumberCanvas() {
        const targetNumberKey = allNumbers[currentNumberIndex];
        const displayNum = getDisplayNumber(targetNumberKey, currentLang);
        
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        
        const isDoubleDigit = displayNum.length > 1;
        const fontSize = isDoubleDigit ? cw * 0.65 : cw * 0.8; 
        const mobileSafeFonts = `900 ${fontSize}px 'Noto Sans Devanagari', 'Comic Sans MS', sans-serif`;

        // 1. Draw the Bottom Layer
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
            ctxOutline.fillText(displayNum, cw/2 + dx, ch/2 + (fontSize * 0.05) + dy);
        }

        // 2. Draw the Top Layer
        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.clearRect(0, 0, cw, ch);
        ctxMask.font = mobileSafeFonts;
        ctxMask.textAlign = 'center';
        ctxMask.textBaseline = 'middle';
        ctxMask.fillStyle = '#ffffff'; 
        ctxMask.fillText(displayNum, cw/2, ch/2 + (fontSize * 0.05)); 
        
        // 3. Count Target Pixels directly from the mask
        const imgData = ctxMask.getImageData(0, 0, cw, ch);
        const data = imgData.data;
        totalTargetPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 50) totalTargetPixels++;
        }
        
        // Lock the paint so it only draws over the white number
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

        if (percentageFilled > 0.98) {
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

    const coloringArea = document.getElementById('coloringArea');
    coloringArea.addEventListener('mousedown', startColoring);
    coloringArea.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', stopColoring);
    
    coloringArea.addEventListener('touchstart', startColoring, {passive: false});
    coloringArea.addEventListener('touchmove', handlePointerMove, {passive: false});
    window.addEventListener('touchend', stopColoring);


    // ==========================================
    // 5. CORE GAME LOGIC
    // ==========================================
    function startNewRound() {
        isPlaying = true;
        clearInterval(checkInterval);
        checkInterval = null;
        updateProgressTrack(false, roundsPlayedThisSession);

        const targetNumberKey = allNumbers[currentNumberIndex];
        document.getElementById("target-letter-name").innerText = getDisplayNumber(targetNumberKey, currentLang);

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

        const targetNumberKey = allNumbers[currentNumberIndex];
        const displayNum = getDisplayNumber(targetNumberKey, currentLang);
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        const isDoubleDigit = displayNum.length > 1;
        const fontSize = isDoubleDigit ? cw * 0.65 : cw * 0.8; 
        const mobileSafeFonts = `900 ${fontSize}px 'Noto Sans Devanagari', 'Comic Sans MS', sans-serif`;
        
        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.fillStyle = currentColor;
        ctxMask.font = mobileSafeFonts;
        ctxMask.fillText(displayNum, cw/2, ch/2 + (fontSize * 0.05));

        setTimeout(() => handleSuccess(allNumbers[currentNumberIndex]), 500);
    }

    function handleSuccess(targetNumberKey) {
        const feedback = document.getElementById("feedback");
        const feedbackText = document.getElementById("feedback-text");
        const feedbackObjects = document.getElementById("feedback-objects");
        const feedbackScore = document.getElementById("feedback-score");

        score += 10;
        document.getElementById("score").innerText = score;
        updateProgressTrack(true, roundsPlayedThisSession + 1);

        feedbackScore.innerText = uiDict["total-score"][currentLang] + score;
        feedbackScore.classList.remove("hidden");

        feedbackText.innerText = uiDict["correct"][currentLang];
        feedbackText.className = "correct-text";
        feedback.classList.remove("hidden");
        feedback.onclick = null; 

        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
        }

        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        
        const triggerPhaseTwo = () => {
            feedbackText.innerText = numbersDict[targetNumberKey][currentLang];
            
            const limit = parseInt(targetNumberKey);
            const isMobile = window.innerWidth <= 500;
            let dynamicSize = 100;
            if (limit <= 4) { dynamicSize = isMobile ? 80 : 100; } 
            else if (limit <= 9) { dynamicSize = isMobile ? 60 : 70; } 
            else if (limit <= 16) { dynamicSize = isMobile ? 45 : 55; } 
            else if (limit <= 25) { dynamicSize = isMobile ? 35 : 45; } 
            else { dynamicSize = isMobile ? 30 : 38; }

            let imagesHtml = '';
            const imgSrc = numberImages[targetNumberKey]; 
            for(let i = 0; i < limit; i++) {
                imagesHtml += `<img src="${imgSrc}" style="width: ${dynamicSize}px; height: ${dynamicSize}px; object-fit: contain; pointer-events: none; margin: 2px;" alt="Object">`;
            }
            feedbackObjects.innerHTML = imagesHtml;
            feedbackObjects.classList.remove("hidden");

            let numberAudio = new Audio(`sounds/${currentLang}/numbers/${targetNumberKey}.mp3`);
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                numberAudio.pause(); 
                
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                feedbackObjects.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                currentNumberIndex++;
                if (currentNumberIndex >= allNumbers.length) currentNumberIndex = 0; 
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('colorNumberScore', score);
                    sessionStorage.setItem('findAbcLang', currentLang);
                    sessionStorage.setItem('colorNumberIdx', currentNumberIndex); 
                    sessionStorage.setItem('colorNumberThemeIndex', (themeIndex + 1) % themes.length);
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            numberAudio.play().then(() => {
                numberAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
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
        sessionStorage.removeItem('colorNumberScore'); 
        sessionStorage.removeItem('colorNumberThemeIndex');
        sessionStorage.removeItem('colorNumberIdx'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=numbers";
        window.location.href = returnUrl; 
    });

    document.getElementById("prevBtn").addEventListener("click", () => {
        isPlaying = false;
        isDrawing = false;
        if (checkInterval) { clearInterval(checkInterval); checkInterval = null; }
        window.speechSynthesis.cancel();
        document.getElementById("feedback").classList.add("hidden");
        document.getElementById("feedback-objects").classList.add("hidden");
        
        // Go back, handle wrap-around from 1 to 40
        roundsPlayedThisSession = Math.max(0, roundsPlayedThisSession - 1);
        currentNumberIndex = (currentNumberIndex - 1 + allNumbers.length) % allNumbers.length;
        
        startNewRound();
    });
    
    document.getElementById("skipBtn").addEventListener("click", () => {
        isPlaying = false;
        isDrawing = false;
        if (checkInterval) { clearInterval(checkInterval); checkInterval = null; }
        window.speechSynthesis.cancel();
        document.getElementById("feedback").classList.add("hidden");
        document.getElementById("feedback-objects").classList.add("hidden");
        
        roundsPlayedThisSession++; 
        currentNumberIndex++;
        if (currentNumberIndex >= allNumbers.length) currentNumberIndex = 0; 
        
        if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
            sessionStorage.setItem('colorNumberScore', score);
            sessionStorage.setItem('findAbcLang', currentLang);
            sessionStorage.setItem('colorNumberIdx', currentNumberIndex); 
            sessionStorage.setItem('colorNumberThemeIndex', (themeIndex + 1) % themes.length);
            window.location.reload();
        } else {
            startNewRound();
        }
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};