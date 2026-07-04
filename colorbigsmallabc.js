"use strict";

window.onload = function() {
    const themes = [
        { runner: '🖍️', target: '🍎' }, 
        { runner: '🚗', target: '🎈' }, 
        { runner: '🚀', target: '⭐' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('colorBigSmallThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('findAbcLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('colorBigSmallScore')) || 0;
    let currentLetterIndex = parseInt(sessionStorage.getItem('colorBigSmallLetterIdx')) || 0;
    
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
        "game-title": { en: "🎨 Color Big & Small!", hi: "🎨 बड़े और छोटे अक्षर रंगें!", mr: "🎨 मोठी आणि लहान अक्षरे रंगवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Color the letters...", hi: "अक्षरों को रंगें...", mr: "अक्षरे रंगवा..." },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Color Big & Small ABC | KidsFunLearnHub", hi: "बड़े और छोटे अक्षर रंगें | KidsFunLearnHub", mr: "मोठी आणि लहान अक्षरे रंगवा | KidsFunLearnHub" }
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
            document.getElementById("target-letter-name").innerText = targetLetterKey.toUpperCase() + " " + targetLetterKey.toLowerCase();
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
        
        // Use the combined "Aa.mp3" file for Big and Small letters
        let vocabAudio = new Audio(`sounds/${currentLang}/abc big-small/${targetLetterKey.toUpperCase()}${targetLetterKey.toLowerCase()}.mp3`);
        
        const triggerPhaseTwo = () => {
            vocabAudio.play().then(() => {
                vocabAudio.onended = () => { isAudioPlaying = false; };
            }).catch(e => { isAudioPlaying = false; });
        };

        let instructionAudio = new Audio(`sounds/${currentLang}/color_the_letters.mp3`);
        instructionAudio.play().then(() => {
            instructionAudio.onended = triggerPhaseTwo;
        }).catch(() => {
            let msg = new SpeechSynthesisUtterance(uiDict["instruction"][currentLang] + " " + targetLetterKey.toUpperCase() + " " + targetLetterKey.toLowerCase());
            msg.rate = 0.85; msg.pitch = 1.2;
            msg.onend = triggerPhaseTwo;
            window.speechSynthesis.speak(msg);
        });
    }

    document.getElementById("promptBox").addEventListener("click", playCustomAudio);


    // ==========================================
    // 4. THE LAYERED DILATION ENGINE
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
        const bigLetter = allLetters[currentLetterIndex].toUpperCase();
        const smallLetter = allLetters[currentLetterIndex].toLowerCase();
        
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        
        // Font sizes adjusted to fit BOTH letters comfortably side-by-side
        const bigFontSize = cw * 0.55; 
        const smallFontSize = cw * 0.45;
        const mobileSafeFonts = `'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif`;

        // Function to draw the text strings in the correct positions
        const drawLetters = (ctx, isOutline) => {
            // Big Letter
            ctx.font = `900 ${bigFontSize}px ${mobileSafeFonts}`;
            if(isOutline) {
                const outlineThickness = cw * 0.025; 
                for(let i = 0; i < 32; i++) {
                    const angle = (i / 32) * Math.PI * 2;
                    const dx = Math.cos(angle) * outlineThickness;
                    const dy = Math.sin(angle) * outlineThickness;
                    ctx.fillText(bigLetter, cw * 0.35 + dx, ch/2 + (bigFontSize * 0.05) + dy);
                }
            } else {
                ctx.fillText(bigLetter, cw * 0.35, ch/2 + (bigFontSize * 0.05));
            }

            // Small Letter
            ctx.font = `900 ${smallFontSize}px ${mobileSafeFonts}`;
            if(isOutline) {
                const outlineThickness = cw * 0.025; 
                for(let i = 0; i < 32; i++) {
                    const angle = (i / 32) * Math.PI * 2;
                    const dx = Math.cos(angle) * outlineThickness;
                    const dy = Math.sin(angle) * outlineThickness;
                    ctx.fillText(smallLetter, cw * 0.70 + dx, ch/2 + (smallFontSize * 0.05) + dy);
                }
            } else {
                ctx.fillText(smallLetter, cw * 0.70, ch/2 + (smallFontSize * 0.05));
            }
        };

        // 1. Draw the Bottom Layer: The Fat Black Shadow (Bypasses Android Stroke Bug!)
        ctxOutline.globalCompositeOperation = 'source-over';
        ctxOutline.clearRect(0, 0, cw, ch);
        ctxOutline.textAlign = 'center';
        ctxOutline.textBaseline = 'middle';
        ctxOutline.fillStyle = '#333333';
        drawLetters(ctxOutline, true);
        
        // 2. Draw the Top Layer: The White Paint Trap
        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.clearRect(0, 0, cw, ch);
        ctxMask.textAlign = 'center';
        ctxMask.textBaseline = 'middle';
        ctxMask.fillStyle = '#ffffff'; 
        drawLetters(ctxMask, false);
        
        // Count Target Pixels
        const imgData = ctxMask.getImageData(0, 0, cw, ch);
        const data = imgData.data;
        totalTargetPixels = 0;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 50) totalTargetPixels++;
        }
        
        // Lock the paint so it only draws over the white letter!
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

        // Strict 98% threshold to ensure they really color it!
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
        ctxMask.lineWidth = canvasMask.width * 0.08; // Healthy brush size
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
        document.getElementById("target-letter-name").innerText = targetLetterKey.toUpperCase() + " " + targetLetterKey.toLowerCase();

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
        const bigLetter = allLetters[currentLetterIndex].toUpperCase();
        const smallLetter = allLetters[currentLetterIndex].toLowerCase();
        const cw = canvasMask.width;
        const ch = canvasMask.height;
        const bigFontSize = cw * 0.6; 
        const smallFontSize = cw * 0.45;
        const mobileSafeFonts = `'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif`;
        
        ctxMask.globalCompositeOperation = 'source-over';
        ctxMask.fillStyle = currentColor;
        ctxMask.textAlign = 'center';
        ctxMask.textBaseline = 'middle';
        
        ctxMask.font = `900 ${bigFontSize}px ${mobileSafeFonts}`;
        ctxMask.fillText(bigLetter, cw * 0.35, ch/2 + (bigFontSize * 0.05));
        
        ctxMask.font = `900 ${smallFontSize}px ${mobileSafeFonts}`;
        ctxMask.fillText(smallLetter, cw * 0.70, ch/2 + (smallFontSize * 0.05));

        setTimeout(() => handleSuccess(allLetters[currentLetterIndex]), 500);
    }

    // function handleSuccess(targetLetterKey) {
    //     const feedback = document.getElementById("feedback");
    //     const feedbackText = document.getElementById("feedback-text");
    //     const feedbackImg = document.getElementById("feedback-img");
    //     const feedbackScore = document.getElementById("feedback-score");

    //     score += 10;
    //     document.getElementById("score").innerText = score;
    //     updateProgressTrack(true, roundsPlayedThisSession + 1);

    //     feedbackScore.innerText = uiDict["total-score"][currentLang] + score;
    //     feedbackScore.classList.remove("hidden");

    //     feedbackText.innerText = uiDict["correct"][currentLang];
    //     feedbackText.className = "correct-text";
    //     feedbackImg.classList.add("hidden"); 
    //     feedback.classList.remove("hidden");
    //     feedback.onclick = null; 

    //     if (typeof confetti === "function") {
    //         confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
    //     }

    //     let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        
    //     const triggerPhaseTwo = () => {
    //         feedbackText.innerText = abcDict[targetLetterKey][currentLang];
    //         feedbackImg.src = `images/abc/words/${targetLetterKey}.webp`;
    //         feedbackImg.classList.remove("hidden"); 

    //         let letterAudio = new Audio(`sounds/${currentLang}/abc big-small/${targetLetterKey.toUpperCase()}${targetLetterKey.toLowerCase()}.mp3`);
    //         let hasAdvanced = false;
    //         let autoTimer;

    //         const advanceToNext = () => {
    //             if (hasAdvanced) return; 
    //             hasAdvanced = true;
    //             clearTimeout(autoTimer); 
    //             letterAudio.pause(); 
    //             feedback.onclick = null; 
    //             feedback.classList.add("hidden");
                
    //             roundsPlayedThisSession++; 
    //             currentLetterIndex++;
    //             if (currentLetterIndex >= allLetters.length) currentLetterIndex = 0; 
                
    //             if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
    //                 sessionStorage.setItem('colorBigSmallScore', score);
    //                 sessionStorage.setItem('findAbcLang', currentLang);
    //                 sessionStorage.setItem('colorBigSmallLetterIdx', currentLetterIndex); 
    //                 sessionStorage.setItem('colorBigSmallThemeIndex', (themeIndex + 1) % themes.length);
    //                 window.location.reload();
    //             } else {
    //                 startNewRound();
    //             }
    //         };

    //         setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

    //         letterAudio.play().then(() => {
    //             letterAudio.onended = () => { autoTimer = setTimeout(advanceToNext, 1600); };
    //         }).catch(e => {
    //             autoTimer = setTimeout(advanceToNext, 2000);
    //         });
    //     };

    //     greatJobAudio.play().then(() => {
    //         greatJobAudio.onended = triggerPhaseTwo;
    //     }).catch(() => {
    //         setTimeout(triggerPhaseTwo, 1500); 
    //     });
    // }

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

        // AUDIO 1: "Great Job!"
        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        
        const triggerPhaseTwo = () => {
            feedbackText.innerText = abcDict[targetLetterKey][currentLang];
            feedbackImg.src = `images/abc/words/${targetLetterKey}.webp`;
            feedbackImg.classList.remove("hidden"); 

            // AUDIO 2: "Big A, Small a"
            let bigSmallAudio = new Audio(`sounds/${currentLang}/abc big-small/${targetLetterKey.toUpperCase()}${targetLetterKey.toLowerCase()}.mp3`);
            
            // AUDIO 3: "A for Apple"
            let vocabAudio = new Audio(`sounds/${currentLang}/abc/${targetLetterKey}.mp3`);
            
            let hasAdvanced = false;
            let autoTimer;

            const advanceToNext = () => {
                if (hasAdvanced) return; 
                hasAdvanced = true;
                clearTimeout(autoTimer); 
                
                // Stop any audio if the user taps to skip early
                bigSmallAudio.pause(); 
                vocabAudio.pause();
                
                feedback.onclick = null; 
                feedback.classList.add("hidden");
                
                roundsPlayedThisSession++; 
                currentLetterIndex++;
                if (currentLetterIndex >= allLetters.length) currentLetterIndex = 0; 
                
                if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                    sessionStorage.setItem('colorBigSmallScore', score);
                    sessionStorage.setItem('findAbcLang', currentLang);
                    sessionStorage.setItem('colorBigSmallLetterIdx', currentLetterIndex); 
                    sessionStorage.setItem('colorBigSmallThemeIndex', (themeIndex + 1) % themes.length);
                    window.location.reload();
                } else {
                    startNewRound();
                }
            };

            setTimeout(() => { feedback.onclick = advanceToNext; }, 500);

            // SEQUENCE CHAINING:
            // Play Audio 2 -> When Audio 2 ends -> Play Audio 3 -> When Audio 3 ends -> Advance
            bigSmallAudio.play().then(() => {
                bigSmallAudio.onended = () => {
                    vocabAudio.play().then(() => {
                        vocabAudio.onended = () => {
                            autoTimer = setTimeout(advanceToNext, 1600);
                        };
                    }).catch(e => {
                        // Fallback if vocab audio is missing
                        autoTimer = setTimeout(advanceToNext, 1600);
                    });
                };
            }).catch(e => {
                // Fallback if big-small audio is missing
                autoTimer = setTimeout(advanceToNext, 2000);
            });
        };

        // Start the sequence with Audio 1
        greatJobAudio.play().then(() => {
            greatJobAudio.onended = triggerPhaseTwo;
        }).catch(() => {
            setTimeout(triggerPhaseTwo, 1500); 
        });
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('colorBigSmallScore'); 
        sessionStorage.removeItem('colorBigSmallThemeIndex');
        sessionStorage.removeItem('colorBigSmallLetterIdx'); 
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html?topic=small_alphabets";
        window.location.href = returnUrl; 
    });

    initProgressTrack();
    updateLanguage(currentLang);
    startNewRound();
};