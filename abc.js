window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🔤 Learn ABC", hi: "🔤 एबीसी (ABC) सीखें", mr: "🔤 एबीसी (ABC) शिका" },
        "nextBtn": { en: "➡ Next Letters", hi: "➡ अगले अक्षर", mr: "➡ पुढील अक्षरे" }
    };

    // Dictionary for A-Z (Includes English, Hindi, and Marathi translations for the words)
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

    const letters = Object.keys(abcDict);
    const PAGE_SIZE = 13; // Exactly half the alphabet per page!
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("abcGrid");
    const popup = document.getElementById("popup");
    const popupImgLetter = document.getElementById("popupImgLetter");
    const popupImgWord = document.getElementById("popupImgWord");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = uiDictionary["page-title"][currentLang];
    if (nextBtn) nextBtn.innerText = uiDictionary["nextBtn"][currentLang];

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE (DOUBLE IMAGES)
    /////////////////////////////////////////////////

    const imageCacheLetters = {};
    const imageCacheWords = {};
    const soundCache = {};

    letters.forEach(name => {
      // 1. Preload the 3D Letter Image
      const imgLetter = new Image();
      imgLetter.src = `images/abc/letters/${name}.webp`;
      imageCacheLetters[name] = imgLetter;

      // 2. Preload the Associated Word Image (e.g. Apple)
      const imgWord = new Image();
      imgWord.src = `images/abc/words/${name}.webp`; 
      imageCacheWords[name] = imgWord;

      // 3. Preload the Sound ("A for Apple")
      const audio = new Audio();
      audio.src = `sounds/${currentLang}/abc/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      letters.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        // Main grid just shows the 3D letter and the Capital Letter text
        card.innerHTML = `
          <img src="${imageCacheLetters[name].src}" alt="${name}">
          <p>${name.toUpperCase()}</p>
        `;

        card.onclick = () => showLetter(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= letters.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY (TWO IMAGES)
    /////////////////////////////////////////////////

    function showLetter(name) {
      if (popupImgLetter) popupImgLetter.src = imageCacheLetters[name].src;
      if (popupImgWord) popupImgWord.src = imageCacheWords[name].src;
      if (popupName) popupName.textContent = abcDict[name][currentLang];
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