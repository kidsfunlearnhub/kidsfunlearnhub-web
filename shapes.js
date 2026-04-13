window.onload = function() {

    // 1. LANGUAGE SETUP
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🟢 Learn Shapes", hi: "🟢 आकार सीखें", mr: "🟢 आकार शिका" },
        "traceBtn": { en: "✏️ Practice Tracing!", hi: "✏️ ट्रेसिंग का अभ्यास करें!", mr: "✏️ गिरवण्याचा सराव करा!" }
    };

    // 2. SHAPES DICTIONARY
    const shapesDict = {
        "circle": { en: "Circle", hi: "वृत्त (गोल)", mr: "वर्तुळ (गोल)" },
        "square": { en: "Square", hi: "वर्ग (चौकोर)", mr: "चौरस (चौकोन)" },
        "triangle": { en: "Triangle", hi: "त्रिकोण", mr: "त्रिकोण" },
        "rectangle": { en: "Rectangle", hi: "आयत", mr: "आयत" },
        "star": { en: "Star", hi: "तारा", mr: "चांदणी" },
        "heart": { en: "Heart", hi: "दिल", mr: "हृदय" },
        "oval": { en: "Oval", hi: "अंडाकार", mr: "लंबवर्तुळ" },
        "diamond": { en: "Diamond", hi: "हीरा", mr: "समभुज चौकोन" },
        "pentagon": { en: "Pentagon", hi: "पंचभुज", mr: "पंचकोन" },
        "hexagon": { en: "Hexagon", hi: "षट्भुज", mr: "षटकोन" }
    };

    const shapesList = Object.keys(shapesDict);

    // 3. ELEMENTS
    const grid = document.getElementById("shapesGrid");
    const popup = document.getElementById("popup");
    const popupImgShape = document.getElementById("popupImgShape");
    const popupImgObject = document.getElementById("popupImgObject");
    const popupName = document.getElementById("popupName");
    const traceBtn = document.getElementById("traceBtn");

    // Translate Title and Button
    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = uiDictionary["page-title"][currentLang];
    if (traceBtn) traceBtn.innerText = uiDictionary["traceBtn"][currentLang];

    // 4. PRELOAD CACHE (DOUBLE IMAGES)
    const imageCacheBasic = {};
    const imageCacheObjects = {};
    const soundCache = {};

    shapesList.forEach(name => {
      const imgBasic = new Image();
      imgBasic.src = `images/shapes/basic/${name}.webp`;
      imageCacheBasic[name] = imgBasic;

      const imgObject = new Image();
      imgObject.src = `images/shapes/objects/${name}.webp`; 
      imageCacheObjects[name] = imgObject;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/shapes/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    // 5. BUILD PAGE GRID (FIXED)
    function loadPage() {
      grid.innerHTML = "";

      shapesList.forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        // FIX: Now using shapesDict to get the correct language for the card text!
        card.innerHTML = `
          <img src="${imageCacheBasic[name].src}" alt="${name}">
          <p>${shapesDict[name][currentLang]}</p>
        `;

        card.onclick = () => showShape(name);
        grid.appendChild(card);
      });
    }

    // 6. POPUP DISPLAY
    function showShape(name) {
      if (popupImgShape) popupImgShape.src = imageCacheBasic[name].src;
      if (popupImgObject) popupImgObject.src = imageCacheObjects[name].src;
      if (popupName) popupName.textContent = shapesDict[name][currentLang];
      
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    // Close popup if clicking outside the card
    if (popup) {
        popup.onclick = (e) => {
            if(e.target === popup) {
                popup.classList.add("hidden");
            }
        };
    }

    // 7. CONFETTI
    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    }

    // INITIALIZE
    loadPage();
};