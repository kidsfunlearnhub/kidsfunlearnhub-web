// This tells the script to WAIT until the HTML is fully loaded on the screen
window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // Read the language clicked on the home page (default to English if empty)
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // Dictionary for the Page Title and Next Button
    const uiDictionary = {
        "page-title": { en: "🐾 Learn Animals", hi: "🐾 जानवर सीखें", mr: "🐾 प्राणी शिका" },
        "nextBtn": { en: "➡ Next Animals", hi: "➡ अगले जानवर", mr: "➡ पुढील प्राणी" }
    };

    // Dictionary for all 30 animals
    const animalDict = {
        "dog": { en: "Dog", hi: "कुत्ता", mr: "कुत्रा" },
        "cat": { en: "Cat", hi: "बिल्ली", mr: "मांजर" },
        "lion": { en: "Lion", hi: "शेर", mr: "सिंह" },
        "tiger": { en: "Tiger", hi: "बाघ", mr: "वाघ" },
        "elephant": { en: "Elephant", hi: "हाथी", mr: "हत्ती" },
        "monkey": { en: "Monkey", hi: "बंदर", mr: "माकड" },
        "cow": { en: "Cow", hi: "गाय", mr: "गाय" },
        "horse": { en: "Horse", hi: "घोड़ा", mr: "घोडा" },
        "goat": { en: "Goat", hi: "बकरी", mr: "शेळी" },
        "bear": { en: "Bear", hi: "भालू", mr: "अस्वल" },
        "zebra": { en: "Zebra", hi: "ज़ेबरा", mr: "झेब्रा" },
        "giraffe": { en: "Giraffe", hi: "जिराफ़", mr: "जिराफ" },
        "rabbit": { en: "Rabbit", hi: "खरगोश", mr: "ससा" },
        "fox": { en: "Fox", hi: "लोमड़ी", mr: "कोल्हा" },
        "deer": { en: "Deer", hi: "हिरण", mr: "हरीण" },
        "camel": { en: "Camel", hi: "ऊंट", mr: "उंट" },
        "wolf": { en: "Wolf", hi: "भेड़िया", mr: "लांडगा" },
        "kangaroo": { en: "Kangaroo", hi: "कंगारू", mr: "कांगारू" },
        "panda": { en: "Panda", hi: "पांडा", mr: "पांडा" },
        "rhino": { en: "Rhino", hi: "गैंडा", mr: "गेंडा" },
        "hippo": { en: "Hippo", hi: "दरियाई घोड़ा", mr: "पाणघोडा" },
        "cheetah": { en: "Cheetah", hi: "चीता", mr: "चित्ता" },
        "buffalo": { en: "Buffalo", hi: "भैंस", mr: "म्हैस" },
        "donkey": { en: "Donkey", hi: "गधा", mr: "गाढव" },
        "pig": { en: "Pig", hi: "सूअर", mr: "डुक्कर" },
        "sheep": { en: "Sheep", hi: "भेड़", mr: "मेंढी" },
        "yak": { en: "Yak", hi: "याक", mr: "याक" },
        "otter": { en: "Otter", hi: "ऊदबिलाव", mr: "पाणमांजर" },
        "squirrel": { en: "Squirrel", hi: "गिलहरी", mr: "खारूताई" },
        "leopard": { en: "Leopard", hi: "तेंदुआ", mr: "बिबट्या" }
    };

    const animals = Object.keys(animalDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("animalGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    // Safely update the title and button text
    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = uiDictionary["page-title"][currentLang];
    if (nextBtn) nextBtn.innerText = uiDictionary["nextBtn"][currentLang];

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE
    /////////////////////////////////////////////////

    const imageCache = {};
    const soundCache = {};

    animals.forEach(name => {
      const img = new Image();
      img.src = `images/animals/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/animals/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadPage() {
      if (!grid) return; // Extra safety check
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      animals.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        const translatedName = animalDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${name}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showAnimal(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= animals.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY
    /////////////////////////////////////////////////

    function showAnimal(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = animalDict[name][currentLang];
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    if (popup) {
        popup.onclick = () => popup.classList.add("hidden");
    }

    /////////////////////////////////////////////////
    // CONFETTI
    /////////////////////////////////////////////////

    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    /////////////////////////////////////////////////
    // INIT
    /////////////////////////////////////////////////

    loadPage();
};