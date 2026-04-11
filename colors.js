window.onload = function() {
    // 1. Automatically detect language from the previous page
    const currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDict = {
        "page-title": { en: "🌈 Learn Colours", hi: "🌈 रंग सीखें", mr: "🌈 रंग शिका" },
        "primary": { en: "Primary Colors", hi: "प्राथमिक रंग", mr: "प्राथमिक रंग" },
        "secondary": { en: "Secondary Colors", hi: "द्वितीयक रंग", mr: "दुय्यम रंग" },
        "neutral": { en: "Neutral Colors", hi: "तटस्थ रंग", mr: "तटस्थ रंग" },
        "advanced": { en: "Advanced Shades", hi: "उन्नत रंग", mr: "प्रगत छटा" }
    };

    const colorData = {
        primary: [
            { id: "red", hex: "#e74c3c", obj: "ladybug.png", en: "Red", hi: "लाल", mr: "लाल" },
            { id: "blue", hex: "#3498db", obj: "butterfly.png", en: "Blue", hi: "नीला", mr: "निळा" },
            { id: "yellow", hex: "#f1c40f", obj: "mango.png", en: "Yellow", hi: "पीला", mr: "पिवळा" }
        ],
        secondary: [
            { id: "green", hex: "#2ecc71", obj: "leaf.png", en: "Green", hi: "हरा", mr: "हिरवा" },
            { id: "orange", hex: "#e67e22", obj: "tiger.png", en: "Orange", hi: "नारंगी", mr: "केशरी" },
            { id: "purple", hex: "#9b59b6", obj: "brinjal.png", en: "Purple", hi: "बैंगनी", mr: "जांभळा" }
        ],
        neutral: [
            { id: "black", hex: "#2c3e50", obj: "crow.png", en: "Black", hi: "काला", mr: "काळा" },
            { id: "white", hex: "#ffffff", obj: "milk.png", en: "White", hi: "सफ़ेद", mr: "पांढरा" },
            { id: "grey", hex: "#95a5a6", obj: "elephant.png", en: "Grey", hi: "स्लेटी", mr: "राखाडी" },
            { id: "brown", hex: "#8b4513", obj: "bear.png", en: "Brown", hi: "भूरा", mr: "तपकिरी" }
        ],
        advanced: [
            { id: "teal", hex: "#008080", obj: "teal_duck.png", en: "Teal", hi: "टील", mr: "टील" },
            { id: "magenta", hex: "#ff00ff", obj: "flower.png", en: "Magenta", hi: "मैजेंटा", mr: "मॅजेंटा" },
            { id: "lavender", hex: "#e6e6fa", obj: "lavender_flower.png", en: "Lavender", hi: "लैवेंडर", mr: "लॅव्हेंडर" },
            { id: "maroon", hex: "#800000", obj: "cherry.png", en: "Maroon", hi: "मैरून", mr: "मरून" },
            { id: "turquoise", hex: "#40e0d0", obj: "gem.png", en: "Turquoise", hi: "फिरोज़ा", mr: "फिरोजी" }
        ]
    };

    const imageCache = {};

    // 2. Preload images based on the ID
    Object.values(colorData).flat().forEach(item => {
        const img = new Image();
        img.src = `images/colours/${item.obj}`;
        imageCache[item.id] = img;
    });

    // 3. Main render function
    function renderPage() {
        document.getElementById("page-title").innerText = uiDict["page-title"][currentLang];
        const main = document.getElementById("mainContent");
        main.innerHTML = "";

        for (let section in colorData) {
            const title = document.createElement("h2");
            title.className = "section-title";
            title.innerText = uiDict[section][currentLang];
            main.appendChild(title);

            const grid = document.createElement("div");
            grid.className = "color-grid";

            colorData[section].forEach(item => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
                    <div class="swatch-circle" style="background:${item.hex}"></div>
                    <p>${item[currentLang]}</p>
                `;
                card.onclick = () => showPopup(item);
                grid.appendChild(card);
            });
            main.appendChild(grid);
        }
    }

    // 4. Popup & Sound Logic
    function showPopup(item) {
        document.getElementById("popupColorBox").style.background = item.hex;
        document.getElementById("popupObjImg").src = imageCache[item.id].src;
        document.getElementById("popupName").innerText = item[currentLang];
        document.getElementById("popup").classList.remove("hidden");

        // Use the currentLang variable to pick the right folder
        const sound = new Audio(`sounds/${currentLang}/colours/${item.id}.mp3`);
        sound.play().catch(e => console.log("Sound file missing at: ", e.target.src));

        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    document.getElementById("popup").onclick = function() {
        this.classList.add("hidden");
    };

    // Run the render immediately on load
    renderPage();
};