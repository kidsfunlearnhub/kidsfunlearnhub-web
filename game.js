window.onload = function() {
    // 1. STATE & LOCALIZATION SETUP
    let currentLang = 'en'; 
    let score = 0;
    let selectedAnimalCard = null; // Tracks the clicked left-side animal
    let matchesFound = 0; // Tracks progress in current round (out of 3)
    let currentMatchedPairs = []; // Stores data to redraw lines if window resizes

    const uiDict = {
        "game-title": { en: "🐾 Shadow Match!", hi: "🐾 परछाई मिलाओ!", mr: "🐾 सावली जुळवा!" },
        "score-label": { en: "Score:", hi: "स्कोर:", mr: "गुण:" },
        "instruction": { en: "Match the animals to their shadows!", hi: "जानवरों को उनकी परछाई से मिलाएँ!", mr: "प्राण्यांना त्यांच्या सावलीशी जुळवा!" },
        "backBtn": { en: "⬅ Back to Activity Hub", hi: "⬅ वापस जाएँ", mr: "⬅ मागे जा" },
        "correct": { en: "Great Job! 🎉", hi: "बहुत अच्छे! 🎉", mr: "खूप छान! 🎉" }
    };

    // (Assuming the same full animalDict is here as in your original file)
    const animalDict = {
        "dog": { en: "Dog", hi: "कुत्ता", mr: "कुत्रा" },
        "cat": { en: "Cat", hi: "बिल्ली", mr: "मांजर" },
        "lion": { en: "Lion", hi: "शेर", mr: "सिंह" },
        "elephant": { en: "Elephant", hi: "हाथी", mr: "हत्ती" },
        "monkey": { en: "Monkey", hi: "बंदर", mr: "माकड" },
        "zebra": { en: "Zebra", hi: "ज़ेबरा", mr: "झेब्रा" }
        // ... include the rest of your animals!
    };

    const allAnimals = Object.keys(animalDict);

    // 2. UI & LANGUAGE HANDLING
    function updateLanguage(lang) {
        currentLang = lang;
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

    // Audio for the main instruction prompt
    document.getElementById("promptBox").addEventListener("click", () => {
        // You can add a general instruction audio file here if you make one!
        // let instructionAudio = new Audio(`sounds/${currentLang}/match_shadows.mp3`);
        // instructionAudio.play();
    });


    // 3. CORE GAME LOGIC
    function startNewRound() {
        matchesFound = 0;
        currentMatchedPairs = [];
        selectedAnimalCard = null;
        document.getElementById("line-canvas").innerHTML = ""; // Clear lines
        
        const leftColumn = document.getElementById("left-column");
        const rightColumn = document.getElementById("right-column");
        leftColumn.innerHTML = "";
        rightColumn.innerHTML = "";
        
        // Pick 3 random animals for this round
        let shuffled = [...allAnimals].sort(() => 0.5 - Math.random());
        let currentOptions = shuffled.slice(0, 3); 
        
        // Create Left Column (Colored Animals)
        currentOptions.forEach(animalKey => {
            const card = document.createElement("div");
            card.className = "match-card animal-card";
            card.dataset.animal = animalKey;
            card.innerHTML = `<img src="images/animals/${animalKey}.webp" alt="${animalKey}">`;
            
            card.addEventListener("click", () => handleAnimalClick(card));
            leftColumn.appendChild(card);
        });

        // Create Right Column (Shadows) - Shuffled differently!
        let shadowOptions = [...currentOptions].sort(() => 0.5 - Math.random());
        
        shadowOptions.forEach(animalKey => {
            const card = document.createElement("div");
            card.className = "match-card shadow-card";
            card.dataset.match = animalKey;
            // Notice we use the same exact image file, just applying the CSS class!
            card.innerHTML = `<img src="images/animals/${animalKey}.webp" alt="${animalKey} Shadow" class="shadow-img">`;
            
            card.addEventListener("click", () => handleShadowClick(card));
            rightColumn.appendChild(card);
        });
    }

    // 4. INTERACTION LOGIC
    function handleAnimalClick(card) {
        if (card.classList.contains("matched")) return;

        // Clear previous selection
        if (selectedAnimalCard) selectedAnimalCard.classList.remove("selected");
        
        // Set new selection
        selectedAnimalCard = card;
        card.classList.add("selected");
        
        // Optional: play a gentle pop sound when they select an animal
    }

    function handleShadowClick(shadowCard) {
        // Must have selected an animal first, and shadow must not be matched yet
        if (!selectedAnimalCard || shadowCard.classList.contains("matched")) {
            // If they click a shadow without selecting an animal, shake it gently
            if(!shadowCard.classList.contains("matched")) {
               shadowCard.classList.add("shake");
               setTimeout(() => shadowCard.classList.remove("shake"), 500);
            }
            return;
        }

        const selectedAnimalKey = selectedAnimalCard.dataset.animal;
        const targetShadowKey = shadowCard.dataset.match;

        if (selectedAnimalKey === targetShadowKey) {
            // --- CORRECT MATCH ---
            drawLine(selectedAnimalCard, shadowCard);
            
            // Save pair for redrawing if screen resizes
            currentMatchedPairs.push({ left: selectedAnimalCard, right: shadowCard });

            selectedAnimalCard.classList.remove("selected");
            selectedAnimalCard.classList.add("matched");
            shadowCard.classList.add("matched");
            
            score += 10;
            document.getElementById("score").innerText = score;
            matchesFound++;

            // Play the animal name audio as a reward
            let matchAudio = new Audio(`sounds/${currentLang}/animals/${selectedAnimalKey}.mp3`);
            matchAudio.play().catch(e => console.log("Audio not found"));

            selectedAnimalCard = null; // Reset selection

            // Check if round is over
            if (matchesFound === 3) {
                setTimeout(showRoundComplete, 800);
            }

        } else {
            // --- WRONG MATCH ---
            shadowCard.classList.add("shake");
            let tryAgainAudio = new Audio(`sounds/${currentLang}/try_again.mp3`);
            tryAgainAudio.play().catch(e => console.log("Audio not found"));
            
            setTimeout(() => {
                shadowCard.classList.remove("shake");
            }, 500);
        }
    }

    // 5. DRAWING THE SVG LINE
    function drawLine(el1, el2) {
        const container = document.getElementById("match-container");
        const svgCanvas = document.getElementById("line-canvas");
        
        const containerRect = container.getBoundingClientRect();
        const rect1 = el1.getBoundingClientRect();
        const rect2 = el2.getBoundingClientRect();

        // Calculate coordinates relative to the container
        const startX = rect1.right - containerRect.left;
        const startY = rect1.top + (rect1.height / 2) - containerRect.top;
        const endX = rect2.left - containerRect.left;
        const endY = rect2.top + (rect2.height / 2) - containerRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', '#4CAF50'); // Green line
        line.setAttribute('stroke-width', '6');
        line.setAttribute('stroke-linecap', 'round');

        // Add a nice animation to the line drawing
        line.style.strokeDasharray = '1000';
        line.style.strokeDashoffset = '1000';
        line.style.transition = 'stroke-dashoffset 0.5s ease-out';
        
        svgCanvas.appendChild(line);

        // Trigger animation
        setTimeout(() => {
            line.style.strokeDashoffset = '0';
        }, 10);
    }

    // Redraw lines if device is rotated or window resized
    window.addEventListener("resize", () => {
        document.getElementById("line-canvas").innerHTML = "";
        currentMatchedPairs.forEach(pair => drawLine(pair.left, pair.right));
    });

    // 6. ROUND COMPLETE REWARD
    function showRoundComplete() {
        const feedback = document.getElementById("feedback");
        feedback.classList.remove("hidden");
        
        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, zIndex: 9999 });
        }

        let greatJobAudio = new Audio(`sounds/${currentLang}/great_job.mp3`);
        greatJobAudio.play().catch(e => console.log("Audio not found"));

        // Wait a few seconds, hide overlay, start next round
        setTimeout(() => {
            feedback.classList.add("hidden");
            startNewRound();
        }, 2500);
    }

    // 7. BACK BUTTON
    document.getElementById("backBtn").addEventListener("click", () => {
        window.location.href = "index.html"; 
    });

    // Initialize
    updateLanguage(currentLang);
    startNewRound();
};