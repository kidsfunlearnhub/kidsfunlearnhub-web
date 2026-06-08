"use strict";

window.onload = function() {
    
    // --- 1. DATA ARCHITECTURE ---

    const mainCategories = [
        { id: "finding", name: "Finding", icon: "🔍", color: "color-orange", desc: "Find the hidden items!", targetVocab: "general" },
        { id: "shadow", name: "Shadow Matching", icon: "👥", color: "color-blue", desc: "Match the shapes!", targetVocab: "general" },
        { id: "joining", name: "Joining Image", icon: "🧩", color: "color-green", desc: "Put the pieces together!", targetVocab: "general" },
        { id: "tapping", name: "Tapping", icon: "👆", color: "color-pink", desc: "Tap as fast as you can!", targetVocab: "tapping" }
    ];

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
        { id: "shapes", name: "Shapes", icon: "⭐" },
        // Added ABCs to general so they get Finding, Shadow, and Puzzle cards
        { id: "alphabets", name: "Alphabets", icon: "🔤" },
        { id: "small_alphabets", name: "Small Alphabets", icon: "🔡" },
        // --- NEW VARNMALA ADDED HERE ---
        { id: "hindi", name: "Hindi Varnmala", icon: "अ" },
        // --- NEW NUMBERS ADDED HERE ---
        { id: "numbers", name: "Numbers", icon: "🔢" }
    ];

    const tappingSubCategories = [
        { id: "alphabets", name: "Alphabets", icon: "🔤" },
        { id: "small_alphabets", name: "Small Alphabets", icon: "🔡" },
        { id: "numbers", name: "Numbers", icon: "🔢" },
        { id: "hindi", name: "Hindi (अ आ इ)", icon: "अ" }
    ];

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
        "alphabets": "abc.html",
        "small_alphabets": "small_abc.html",
        "numbers": "numbers.html",
        "hindi": "hindi.html"
    };

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
        "joining_bodyparts": "puzzlebodyparts.html",
        "joining_shapes": "puzzleshape.html",
        
        // --- NEW ALPHABET GAMES MAPPED HERE ---
        "finding_alphabets": "findabc.html",
        "shadow_alphabets": "shadowabc.html",
        "joining_alphabets": "puzzleabc.html",
        "finding_small_alphabets": "findabcbigsmall.html",
        "shadow_small_alphabets": "shadowabcbigsmall.html",
        "joining_small_alphabets": "puzzleabcbigsmall.html",

        // --- NEW VARNMALA GAMES MAPPED HERE ---
        "finding_hindi": "findvarnmala.html",
        "shadow_hindi": "shadowvarnmala.html",
        "joining_hindi": "puzzlevarnmala.html",

        // --- NEW NUMBER GAMES MAPPED HERE ---
        "finding_numbers": "findnumber.html",
        "shadow_numbers": "shadownumber.html",
        "joining_numbers": "puzzlenumber.html"
    };

    // --- 2. STATE MANAGEMENT ---
    
    const gridElement = document.getElementById("activity-grid");
    const breadcrumbElement = document.getElementById("breadcrumb");
    const bottomActionsElement = document.querySelector(".bottom-actions");
    const popup = document.getElementById('comingSoonPopup');
    const closeBtn = document.getElementById('closePopupBtn');

    // --- 3. RENDER FUNCTIONS ---

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
            const card = document.createElement("div");
            card.className = `activity-card ${cat.color}`;
            card.innerHTML = `
                <div class="card-icon">${cat.icon}</div>
                <h2>${cat.name}</h2>
                <p>${cat.desc}</p>
                <div class="play-btn">▶</div>
            `;
            card.onclick = () => {
                if (window.history.pushState) {
                    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?category=' + cat.id;
                    window.history.pushState({path: newUrl}, '', newUrl);
                }
                renderSubView(cat.id, cat.name, cat.targetVocab, cat.color);
            };
            gridElement.appendChild(card);
        });

        if (typeof confetti === "function") {
            setTimeout(() => {
                confetti({ particleCount: 100, spread: 90, origin: { y: 0.2 }, colors: ['#ff9800', '#4caf50', '#2196f3', '#e91e63'], disableForReducedMotion: true });
            }, 300);
        }
    }

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

            const card = document.createElement("div");
            card.className = `activity-card ${colorClass}`;
            
            if (isLive) {
                card.onclick = () => {
                    sessionStorage.setItem('hubReturnUrl', window.location.href);
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

            const card = document.createElement("div");
            card.className = `activity-card ${mainCat.color}`;
            
            if (isLive) {
                card.onclick = () => {
                    sessionStorage.setItem('hubReturnUrl', window.location.href);
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

    function clearUrlParams() {
        if (window.history.replaceState) {
            const url = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({path: url}, '', url);
        }
    }

    closeBtn.addEventListener('click', () => { popup.classList.add('hidden'); });
    popup.addEventListener('click', (e) => { if (e.target === popup) popup.classList.add('hidden'); });

    // --- 5. INITIALIZATION ---
    const urlParams = new URLSearchParams(window.location.search);
    const topicFilter = urlParams.get('topic');
    const categoryFilter = urlParams.get('category');

    if (topicFilter) {
        renderTopicView(topicFilter);
    } else if (categoryFilter) {
        const targetCategory = mainCategories.find(c => c.id === categoryFilter);
        if(targetCategory) {
            renderSubView(targetCategory.id, targetCategory.name, targetCategory.targetVocab, targetCategory.color);
        } else {
            renderMainView();
        }
    } else {
        renderMainView();
    }
    
    window.addEventListener('popstate', function() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('topic')) {
            renderTopicView(params.get('topic'));
        } else if (params.get('category')) {
            const cat = mainCategories.find(c => c.id === params.get('category'));
            if(cat) renderSubView(cat.id, cat.name, cat.targetVocab, cat.color);
        } else {
            renderMainView();
        }
    });
};