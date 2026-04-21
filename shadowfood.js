window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowFoodThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('shadowFoodLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowFoodScore')) || 0;
    
    let selectedFoodCard = null; 
    let matchesFound = 0; 
    let currentMatchedPairs = []; 
    
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
        "game-title": { en: "🍛 Food Shadow Match!", hi: "🍛 भोजन की परछाई मिलाओ!", mr: "🍛 पदार्थांची सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the foods to their shadows!", hi: "भोजन को उनकी परछाई से मिलाएँ!", mr: "पदार्थांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Food Shadow Match Game | KidsFunLearnHub", hi: "भोजन छाया मिलान खेल | KidsFunLearnHub", mr: "पदार्थ सावली जुळवा खेळ | KidsFunLearnHub" }
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
        sessionStorage.setItem('shadowFoodLang', lang); 
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

    function startNewRound() {
        matchesFound = 0;
        currentMatchedPairs = [];
        selectedFoodCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allFoods].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(foodKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card"; // Generic class applied for styling
            card.dataset.food = foodKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + foodDict[foodKey]['en']);
            card.innerHTML = `<img src="images/foods/${foodKey}.webp" alt="${foodDict[foodKey]['en']}">`;
            card.addEventListener("click", () => handleFoodClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(foodKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = foodKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + foodDict[foodKey]['en'] + " shadow");
            card.innerHTML = `<img src="images/foods/${foodKey}.webp" alt="${foodDict[foodKey]['en']} Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleFoodClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedFoodCard) selectedFoodCard.classList.remove("selected");
        selectedFoodCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedFoodCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedFoodKey = selectedFoodCard.dataset.food;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedFoodKey === targetShadowKey) {
            drawLine(selectedFoodCard, shadowCard);
            currentMatchedPairs.push({ left: selectedFoodCard, right: shadowCard });

            selectedFoodCard.classList.remove("selected");
            selectedFoodCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/foods/${selectedFoodKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedFoodCard = null; 

            // Use the 800ms delay so the final jump finishes before the popup appears
            if (matchesFound === 3) {
                setTimeout(showRoundComplete, 800);
            }

        } else {
            shadowCard.classList.add("shake");
            let tryAgainAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Audio not found"));
            setTimeout(() => { shadowCard.classList.remove("shake"); }, 500);
        }
    }

    function drawLine(el1, el2) {
        const container = document.getElementById("match-container");
        const svgCanvas = document.getElementById("line-canvas");
        const containerRect = container.getBoundingClientRect();
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        const startX = rect1.right - containerRect.left;
        const startY = rect1.top + (rect1.height / 2) - containerRect.top;
        const endX = rect2.left - containerRect.left;
        const endY = rect2.top + (rect2.height / 2) - containerRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', '#4CAF50'); 
        line.setAttribute('stroke-width', '6');
        line.setAttribute('stroke-linecap', 'round');
        line.style.strokeDasharray = '1000';
        line.style.strokeDashoffset = '1000';
        line.style.transition = 'stroke-dashoffset 0.5s ease-out';
        
        svgCanvas.appendChild(line);
        setTimeout(() => { line.style.strokeDashoffset = '0'; }, 10);
    }

    window.addEventListener("resize", () => {
        document.getElementById("line-canvas").innerHTML = "";
        currentMatchedPairs.forEach(pair => drawLine(pair.left, pair.right));
    });

    function showRoundComplete() {
        const feedback = document.getElementById("feedback");
        document.getElementById("feedback-score").innerText = uiDict["total-score"][currentLang] + score;
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
        }

        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Audio not found"));

        setTimeout(() => {
            feedback.classList.add("hidden");
            roundsPlayedThisSession++; 
            
            if (roundsPlayedThisSession >= ROUNDS_BEFORE_RELOAD) {
                sessionStorage.setItem('shadowFoodScore', score);
                sessionStorage.setItem('shadowFoodLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowFoodThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowFoodScore'); 
        sessionStorage.removeItem('shadowFoodThemeIndex'); 
        window.location.href = "index.html"; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};