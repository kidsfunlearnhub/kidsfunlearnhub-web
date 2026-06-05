window.onload = function() {
    const themes = [
        { runner: '🐒', target: '🍌' }, 
        { runner: '🐇', target: '🥕' }, 
        { runner: '🐸', target: '🏞️' }  
    ];
    
    let themeIndex = parseInt(sessionStorage.getItem('shadowVehicleThemeIndex')) || 0;
    const currentTheme = themes[themeIndex];

    document.getElementById("runner-emoji").innerText = currentTheme.runner;
    document.getElementById("target-icon").innerText = currentTheme.target;

    let currentLang = sessionStorage.getItem('shadowVehicleLang') || 'en'; 
    let score = parseInt(sessionStorage.getItem('shadowVehicleScore')) || 0;
    
    let selectedVehicleCard = null; 
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
        "game-title": { en: "🚌 Vehicle Shadow Match!", hi: "🚌 वाहनों की परछाई मिलाओ!", mr: "🚌 वाहनांची सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the vehicles to their shadows!", hi: "वाहनों को उनकी परछाई से मिलाएँ!", mr: "वाहनांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" },
        "total-score": { en: "Total Score: ", hi: "कुल स्कोर: ", mr: "एकूण गुण: " },
        "page-title": { en: "Vehicle Shadow Match Game | KidsFunLearnHub", hi: "वाहन छाया मिलान खेल | KidsFunLearnHub", mr: "वाहन सावली जुळवा खेळ | KidsFunLearnHub" }
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
        sessionStorage.setItem('shadowVehicleLang', lang); 
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
        selectedVehicleCard = null;
        document.getElementById("line-canvas").innerHTML = ""; 
        updateProgressTrack(false); 

        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        let shuffled = [...allVehicles].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        currentOptions.forEach(vehKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card"; 
            card.dataset.vehicle = vehKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Select " + vehicleDict[vehKey]['en']);
            card.innerHTML = `<img src="images/vehicles/${vehKey}.webp" alt="${vehicleDict[vehKey]['en']}">`;
            card.addEventListener("click", () => handleVehicleClick(card));
            leftColumn.appendChild(card);
        });

        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(vehKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = vehKey;
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-label", "Match with " + vehicleDict[vehKey]['en'] + " shadow");
            card.innerHTML = `<img src="images/vehicles/${vehKey}.webp" alt="${vehicleDict[vehKey]['en']} Silhouette" class="shadow-img">`;
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    function handleVehicleClick(card) {
        if (card.classList.contains("matched")) return;
        if (selectedVehicleCard) selectedVehicleCard.classList.remove("selected");
        selectedVehicleCard = card;
        card.classList.add("selected");
    }

    function handleShadowClick(shadowCard) {
        if (!selectedVehicleCard || shadowCard.classList.contains("matched")) {
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedVehicleKey = selectedVehicleCard.dataset.vehicle;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedVehicleKey === targetShadowKey) {
            drawLine(selectedVehicleCard, shadowCard);
            currentMatchedPairs.push({ left: selectedVehicleCard, right: shadowCard });

            selectedVehicleCard.classList.remove("selected");
            selectedVehicleCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            updateProgressTrack(true); 

            let matchAudio = new Audio(`sounds/${currentLang}/vehicles/${selectedVehicleKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedVehicleCard = null; 

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
                sessionStorage.setItem('shadowVehicleScore', score);
                sessionStorage.setItem('shadowVehicleLang', currentLang);
                let nextThemeIndex = (themeIndex + 1) % themes.length;
                sessionStorage.setItem('shadowVehicleThemeIndex', nextThemeIndex);
                window.location.reload();
            } else {
                startNewRound();
            }
        }, 2500);
    }

    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('shadowVehicleScore'); 
        sessionStorage.removeItem('shadowVehicleThemeIndex'); 
        // Grab the saved URL, or default to the hub if none exists
        const returnUrl = sessionStorage.getItem('hubReturnUrl') || "activityhub.html";
        window.location.href = returnUrl; 
    });

    initProgressTrack(); 
    updateLanguage(currentLang);
    startNewRound();
};