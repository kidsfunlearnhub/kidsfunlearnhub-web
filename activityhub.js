window.onload = function() {
    
    // --- 1. DATA ARCHITECTURE ---

    // Level 1: Main Categories
    const mainCategories = [
        { id: "finding", name: "Finding", icon: "🔍", color: "color-orange", desc: "Find the hidden items!", targetVocab: "general" },
        { id: "shadow", name: "Shadow Matching", icon: "👥", color: "color-blue", desc: "Match the shapes!", targetVocab: "general" },
        { id: "joining", name: "Joining Image", icon: "🧩", color: "color-green", desc: "Put the pieces together!", targetVocab: "general" },
        { id: "tapping", name: "Tapping", icon: "👆", color: "color-pink", desc: "Tap as fast as you can!", targetVocab: "tapping" }
    ];

    // Level 2: General Vocabulary
    const generalSubCategories = [
        { id: "animals", name: "Animals", icon: "🦁" },
        { id: "birds", name: "Birds", icon: "🦚" },
        { id: "insects", name: "Insects", icon: "🦋" },
        { id: "fruits", name: "Fruits", icon: "🍎" },
        { id: "vegetables", name: "Vegetables", icon: "🥕" },
        { id: "foods", name: "Foods", icon: "🍔" },
        { id: "flowers", name: "Flowers", icon: "🌸" },
        { id: "vehicles", name: "Vehicles", icon: "🚗" },
        { id: "colours", name: "Colours", icon: "🎨" },
        { id: "bodyparts", name: "Body Parts", icon: "👀" },
        { id: "shapes", name: "Shapes", icon: "⭐" }
    ];

    // Level 2: Tapping Specific Vocab
    const tappingSubCategories = [
        { id: "alphabets", name: "Alphabets", icon: "🔤" },
        { id: "small_alphabets", name: "Small Alphabets", icon: "🔡" },
        { id: "numbers", name: "Numbers", icon: "🔢" },
        { id: "hindi", name: "Hindi (अ आ इ)", icon: "अ" }
    ];

    // Dictionary mapping Topic IDs to their actual Learn Pages
    const learnPageUrls = {
        "animals": "animals.html",
        "birds": "birds.html",
        "insects": "insects.html",
        "fruits": "fruits.html",
        "vegetables": "vegetables.html",
        "foods": "foods.html",
        "flowers": "flowers.html",
        "vehicles": "vehicles.html",
        "colours": "colors.html", 
        "bodyparts": "bodyparts.html",
        "shapes": "shapes.html",
        "alphabets": "alphabets.html",
        "small_alphabets": "small_alphabets.html",
        "numbers": "numbers.html",
        "hindi": "hindi.html"
    };

    // Map existing live URLs
    const liveUrls = {
        "finding_animals": "findanimal.html",
        "finding_birds": "findbird.html",
        "finding_insects": "findinsect.html",
        "finding_fruits": "findfruit.html",
        "finding_vegetables": "findvegetable.html",
        "finding_foods": "findfood.html",
        "finding_flowers": "findflower.html",
        "finding_vehicles": "findvehicle.html",
        "finding_colours": "findcolour.html",
        "finding_bodyparts": "findbodyparts.html",
        "finding_shapes": "findshape.html",
        "shadow_animals": "shadowgame.html",
        "shadow_birds": "shadowbird.html",
        "shadow_insects": "shadowinsect.html",
        "shadow_fruits": "shadowfruit.html",
        "shadow_vegetables": "shadowvegetable.html",
        "shadow_foods": "shadowfood.html",
        "shadow_flowers": "shadowflower.html",
        "shadow_vehicles": "shadowvehicle.html",
        "shadow_colours": "shadowcolour.html",
        "shadow_bodyparts": "shadowbodyparts.html",
        "shadow_shapes": "shadowshape.html",
        "joining_animals": "puzzleanimal.html",
        "joining_birds": "puzzlebird.html",
        "joining_insects": "puzzleinsect.html",
        "joining_fruits": "puzzlefruit.html",
        "joining_vegetables": "puzzlevegetable.html",
        "joining_foods": "puzzlefood.html",
        "joining_flowers": "puzzleflower.html",
        "joining_vehicles": "puzzlevehicle.html",
        "joining_colours": "puzzlecolour.html",
        "joining_bodyparts": "puzzlebodypart.html",
        "joining_shapes": "puzzleshape.html"
    };

    // --- 2. STATE MANAGEMENT ---
    
    const gridElement = document.getElementById("activity-grid");
    const breadcrumbElement = document.getElementById("breadcrumb");
    const bottomActionsElement = document.querySelector(".bottom-actions");
    
    const popup = document.getElementById('comingSoonPopup');
    const closeBtn = document.getElementById('closePopupBtn');

    // --- 3. RENDER FUNCTIONS ---

    // VIEW A: Main Activity Categories
    function renderMainView() {
        gridElement.innerHTML = "";
        
        breadcrumbElement.innerHTML = `
            <span class="breadcrumb-item" onclick="window.location.href='index.html'">🏠 Home</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Activity Hub</span>
        `;
        
        bottomActionsElement.innerHTML = `<button id="backBtn" class="back-home-btn" aria-label="Go Back">🏠 Back to Home</button>`;
        document.getElementById("backBtn").onclick = () => window.location.href = "index.html";

        mainCategories.forEach(cat => {
            // FIX: Always use standard div for bulletproof mobile tapping
            const card = document.createElement("div");
            card.className = `activity-card ${cat.color}`;
            card.innerHTML = `
                <div class="card-icon">${cat.icon}</div>
                <h2>${cat.name}</h2>
                <p>${cat.desc}</p>
                <div class="play-btn">▶</div>
            `;
            card.onclick = () => renderSubView(cat.id, cat.name, cat.targetVocab, cat.color);
            gridElement.appendChild(card);
        });

        if (typeof confetti === "function") {
            setTimeout(() => {
                confetti({ particleCount: 100, spread: 90, origin: { y: 0.2 }, colors: ['#ff9800', '#4caf50', '#2196f3', '#e91e63'], disableForReducedMotion: true });
            }, 300);
        }
    }

    // VIEW B: Sub-Categories inside a Main Category
    function renderSubView(categoryId, categoryName, vocabType, colorClass) {
        gridElement.innerHTML = "";
        
        breadcrumbElement.innerHTML = `
            <span class="breadcrumb-item" onclick="window.location.href='index.html'">🏠 Home</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item" id="bread-hub">Activity Hub</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">${categoryName}</span>
        `;
        document.getElementById("bread-hub").onclick = () => {
            clearUrlParams();
            renderMainView();
        };

        bottomActionsElement.innerHTML = `<button id="backBtn" class="back-home-btn" aria-label="Go Back">⬅ Back to Categories</button>`;
        document.getElementById("backBtn").onclick = () => {
            clearUrlParams();
            renderMainView();
        };

        const listToRender = (vocabType === "tapping") ? tappingSubCategories : generalSubCategories;

        listToRender.forEach(sub => {
            const urlKey = `${categoryId}_${sub.id}`;
            const isLive = liveUrls[urlKey] !== undefined;

            // FIX: Always use standard div for bulletproof mobile tapping
            const card = document.createElement("div");
            card.className = `activity-card ${colorClass}`;
            
            // FIX: Use Javascript window.location to force navigation on mobile
            if (isLive) {
                card.onclick = () => {
                    window.location.href = liveUrls[urlKey];
                };
            } else {
                card.classList.add("locked", "coming-soon");
                card.onclick = (e) => {
                    e.preventDefault();
                    popup.classList.remove('hidden');
                };
            }

            card.innerHTML = `
                ${!isLive ? `<div class="locked-badge">🔒 Soon</div>` : ""}
                <div class="card-icon">${sub.icon}</div>
                <h2>${sub.name}</h2>
                <p>${isLive ? 'Play Now!' : 'Building...'}</p>
                ${isLive ? `<div class="play-btn">▶</div>` : ""}
            `;

            gridElement.appendChild(card);
        });
    }

    // VIEW C: Topic Filter View (Shows Find, Shadow, Puzzle for a specific topic like 'Animals')
    function renderTopicView(topicId) {
        gridElement.innerHTML = "";

        const topicInfo = generalSubCategories.find(sub => sub.id === topicId) || tappingSubCategories.find(sub => sub.id === topicId);

        if (!topicInfo) {
            renderMainView(); 
            return;
        }
        
        breadcrumbElement.innerHTML = `
            <span class="breadcrumb-item" onclick="window.location.href='index.html'">🏠 Home</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item" id="bread-hub">Activity Hub</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">${topicInfo.name} Activities</span>
        `;
        document.getElementById("bread-hub").onclick = () => {
            clearUrlParams();
            renderMainView();
        };

        bottomActionsElement.innerHTML = ""; 

        if (learnPageUrls[topicId]) {
            const backToLearnBtn = document.createElement("button");
            backToLearnBtn.className = "back-home-btn return-learn-btn";
            backToLearnBtn.innerHTML = `📚 Back to Learn ${topicInfo.name}`;
            backToLearnBtn.onclick = () => window.location.href = learnPageUrls[topicId];
            bottomActionsElement.appendChild(backToLearnBtn);
        }

        const backToHubBtn = document.createElement("button");
        backToHubBtn.className = "back-home-btn";
        backToHubBtn.innerHTML = "⬅ Back to Activity Hub";
        backToHubBtn.onclick = () => {
            clearUrlParams();
            renderMainView();
        };
        bottomActionsElement.appendChild(backToHubBtn);

        mainCategories.forEach(mainCat => {
            if (mainCat.targetVocab === "tapping" && !tappingSubCategories.find(s => s.id === topicId)) return;
            if (mainCat.targetVocab === "general" && !generalSubCategories.find(s => s.id === topicId)) return;

            const urlKey = `${mainCat.id}_${topicId}`;
            const isLive = liveUrls[urlKey] !== undefined;

            // FIX: Always use standard div for bulletproof mobile tapping
            const card = document.createElement("div");
            card.className = `activity-card ${mainCat.color}`;
            
            // FIX: Use Javascript window.location to force navigation on mobile
            if (isLive) {
                card.onclick = () => {
                    window.location.href = liveUrls[urlKey];
                };
            } else {
                card.classList.add("locked", "coming-soon");
                card.onclick = (e) => {
                    e.preventDefault();
                    popup.classList.remove('hidden');
                };
            }

            card.innerHTML = `
                ${!isLive ? `<div class="locked-badge">🔒 Soon</div>` : ""}
                <div class="card-icon">${mainCat.icon}</div>
                <h2>${mainCat.name} ${topicInfo.name}</h2>
                <p>${isLive ? 'Play Now!' : 'Building...'}</p>
                ${isLive ? `<div class="play-btn">▶</div>` : ""}
            `;

            gridElement.appendChild(card);
        });
    }

    // UTILITY: Clean up the URL when going back to the main hub
    function clearUrlParams() {
        if (window.history.replaceState) {
            const url = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({path: url}, '', url);
        }
    }

    // --- 4. POPUP MANAGEMENT ---
    
    closeBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.classList.add('hidden');
    });

    // --- 5. INITIALIZATION (Check URL for ?topic=) ---
    const urlParams = new URLSearchParams(window.location.search);
    const topicFilter = urlParams.get('topic');

    if (topicFilter) {
        renderTopicView(topicFilter);
    } else {
        renderMainView();
    }
};