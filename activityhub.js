window.onload = function() {
    
    // --- 1. DATA ARCHITECTURE ---

    // Level 1: Main Categories
    const mainCategories = [
        { id: "finding", name: "Finding", icon: "🔍", color: "color-orange", desc: "Find the hidden items!", targetVocab: "general" },
        { id: "shadow", name: "Shadow Matching", icon: "👥", color: "color-blue", desc: "Match the shapes!", targetVocab: "general" },
        { id: "joining", name: "Joining Image", icon: "🧩", color: "color-green", desc: "Put the pieces together!", targetVocab: "general" },
        { id: "tapping", name: "Tapping", icon: "👆", color: "color-pink", desc: "Tap as fast as you can!", targetVocab: "tapping" }
    ];

    // Level 2: General Vocabulary (For Finding, Shadow, Joining)
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

    // Map existing live URLs (Everything else gets "Coming Soon")
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
    
    let currentView = "main"; // 'main' or a specific category id (e.g., 'finding')
    let currentCategoryName = "";

    const gridElement = document.getElementById("activity-grid");
    const breadcrumbElement = document.getElementById("breadcrumb");
    const backBtn = document.getElementById("backBtn");
    
    const popup = document.getElementById('comingSoonPopup');
    const closeBtn = document.getElementById('closePopupBtn');

    // --- 3. RENDER FUNCTIONS ---

    function renderMainView() {
        currentView = "main";
        currentCategoryName = "";
        gridElement.innerHTML = "";
        
        // Update Breadcrumb
        breadcrumbElement.innerHTML = `
            <span class="breadcrumb-item" onclick="window.location.href='index.html'">🏠 Home</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Activity Hub</span>
        `;
        
        // Update Back Button
        backBtn.innerHTML = "🏠 Back to Home";
        backBtn.onclick = () => window.location.href = "index.html";

        // Build Cards
        mainCategories.forEach(cat => {
            const card = document.createElement("div");
            card.className = `activity-card ${cat.color}`;
            card.innerHTML = `
                <div class="card-icon">${cat.icon}</div>
                <h2>${cat.name}</h2>
                <p>${cat.desc}</p>
                <div class="play-btn">▶</div>
            `;
            // On click, render the sub-menu for this category
            card.onclick = () => renderSubView(cat.id, cat.name, cat.targetVocab, cat.color);
            gridElement.appendChild(card);
        });

        // Trigger Confetti only on main hub load
        if (typeof confetti === "function") {
            setTimeout(() => {
                confetti({ particleCount: 100, spread: 90, origin: { y: 0.2 }, colors: ['#ff9800', '#4caf50', '#2196f3', '#e91e63'], disableForReducedMotion: true });
            }, 300);
        }
    }

    function renderSubView(categoryId, categoryName, vocabType, colorClass) {
        currentView = categoryId;
        currentCategoryName = categoryName;
        gridElement.innerHTML = "";
        
        // Update Breadcrumb
        breadcrumbElement.innerHTML = `
            <span class="breadcrumb-item" onclick="window.location.href='index.html'">🏠 Home</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-item" id="bread-hub">Activity Hub</span>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">${categoryName}</span>
        `;
        // Make the "Activity Hub" breadcrumb clickable
        document.getElementById("bread-hub").onclick = renderMainView;

        // Update Back Button
        backBtn.innerHTML = "⬅ Back to Categories";
        backBtn.onclick = renderMainView;

        // Select the correct sub-categories array
        const listToRender = (vocabType === "tapping") ? tappingSubCategories : generalSubCategories;

        // Build Cards
        listToRender.forEach(sub => {
            const urlKey = `${categoryId}_${sub.id}`;
            const isLive = liveUrls[urlKey] !== undefined;

            // Use an <a> tag for live games for better SEO crawling, Use a <div> for locked games
            const card = document.createElement(isLive ? "a" : "div");
            card.className = `activity-card ${colorClass}`;
            
            if (isLive) {
                card.href = liveUrls[urlKey];
            } else {
                card.classList.add("locked", "coming-soon");
            }

            card.innerHTML = `
                ${!isLive ? `<div class="locked-badge">🔒 Soon</div>` : ""}
                <div class="card-icon">${sub.icon}</div>
                <h2>${sub.name}</h2>
                <p>${isLive ? 'Play Now!' : 'Building...'}</p>
                ${isLive ? `<div class="play-btn">▶</div>` : ""}
            `;

            if (!isLive) {
                card.onclick = (e) => {
                    e.preventDefault();
                    popup.classList.remove('hidden');
                };
            }

            gridElement.appendChild(card);
        });
    }

    // --- 4. POPUP MANAGEMENT ---
    
    closeBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    popup.addEventListener('click', (e) => {
        if (e.target === popup) popup.classList.add('hidden');
    });

    // Initialize Page
    renderMainView();
};