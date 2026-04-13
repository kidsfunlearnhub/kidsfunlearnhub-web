window.onload = function() {

    // 1. LANGUAGE SETUP
    let currentLang = localStorage.getItem('mySecretLanguage') || 'hi'; // Default to hi or mr for this page
    if(currentLang === 'en') currentLang = 'hi'; // Fallback if they selected English on home page

    const uiDictionary = {
        "page-title": { hi: "अ वर्णमाला सीखें", mr: "अ वर्णमाला शिका" },
        "btn-vyanjan": { hi: "➡ व्यंजन देखें", mr: "➡ व्यंजन पहा" },
        "btn-swar": { hi: "⬅ स्वर देखें", mr: "⬅ स्वर पहा" }
    };

    // 2. SWAR DICTIONARY (Vowels)
    const swarDict = {
        "a": { char: "अ", hi: "अ - अनार", mr: "अ - अननस" },
        "aa": { char: "आ", hi: "आ - आम", mr: "आ - आई" },
        "i": { char: "इ", hi: "इ - इमली", mr: "इ - इमारत" },
        "ee": { char: "ई", hi: "ई - ईख", mr: "ई - इडलिंबू" },
        "u": { char: "उ", hi: "उ - उल्लू", mr: "उ - उखळ" },
        "oo": { char: "ऊ", hi: "ऊ - ऊन", mr: "ऊ - ऊस" },
        "ri": { char: "ऋ", hi: "ऋ - ऋषि", mr: "ऋ - ऋषी" },
        "e": { char: "ए", hi: "ए - एड़ी", mr: "ए - एक" },
        "ai": { char: "ऐ", hi: "ऐ - ऐनक", mr: "ऐ - ऐरण" },
        "o": { char: "ओ", hi: "ओ - ओखली", mr: "ओ - ओझेवाला" },
        "au": { char: "औ", hi: "औ - औरत", mr: "औ - औषध" },
        "ang": { char: "अं", hi: "अं - अंगूर", mr: "अं - अंजीर" },
        "aha": { char: "अः", hi: "अः - प्रातः", mr: "अः - स्वतः" }
    };

    // 3. VYANJAN DICTIONARY (Consonants)
    const vyanjanDict = {
        "k": { char: "क", hi: "क - कबूतर", mr: "क - कमळ" },
        "kh": { char: "ख", hi: "ख - खरगोश", mr: "ख - खडू" },
        "g": { char: "ग", hi: "ग - गमला", mr: "ग - गणपती" },
        "gh": { char: "घ", hi: "घ - घर", mr: "घ - घर" },
        "ch": { char: "च", hi: "च - चम्मच", mr: "च - चमचा" },
        "chh": { char: "छ", hi: "छ - छतरी", mr: "छ - छत्री" },
        "j": { char: "ज", hi: "ज - जग", mr: "ज - जहाज" },
        "jh": { char: "झ", hi: "झ - झंडा", mr: "झ - झेंडा" },
        "t1": { char: "ट", hi: "ट - टमाटर", mr: "ट - टरबूज" }, // ट वर्ग
        "th1": { char: "ठ", hi: "ठ - ठठेरा", mr: "ठ - ठसा" },
        "d1": { char: "ड", hi: "ड - डमरू", mr: "ड - डबा" },
        "dh1": { char: "ढ", hi: "ढ - ढक्कन", mr: "ढ - ढग" },
        "n1": { char: "ण", hi: "ण - बाण", mr: "ण - बाण" },
        "t2": { char: "त", hi: "त - तरबूज", mr: "त - तलवार" }, // त वर्ग
        "th2": { char: "थ", hi: "थ - थर्मस", mr: "थ - थवा" },
        "d2": { char: "द", hi: "द - दवात", mr: "द - दप्तर" },
        "dh2": { char: "ध", hi: "ध - धनुष", mr: "ध - धनुष्य" },
        "n2": { char: "न", hi: "न - नल", mr: "न - नळ" },
        "p": { char: "प", hi: "प - पतंग", mr: "प - पतंग" },
        "ph": { char: "फ", hi: "फ - फल", mr: "फ - फणस" },
        "b": { char: "ब", hi: "ब - बस", mr: "ब - बदक" },
        "bh": { char: "भ", hi: "भ - भालू", mr: "भ - भटजी" },
        "m": { char: "म", hi: "म - मछली", mr: "म - मगर" },
        "y": { char: "य", hi: "य - यज्ञ", mr: "य - यज्ञ" },
        "r": { char: "र", hi: "र - रथ", mr: "र - रथ" },
        "l": { char: "ल", hi: "ल - लट्टू", mr: "ल - लसूण" },
        "v": { char: "व", hi: "व - वन", mr: "व - वजन" },
        "sh": { char: "श", hi: "श - शलगम", mr: "श - शहामृग" },
        "shh": { char: "ष", hi: "ष - षट्कोण", mr: "ष - षटकोन" },
        "s": { char: "स", hi: "स - सेब", mr: "स - ससा" },
        "h": { char: "ह", hi: "ह - हाथी", mr: "ह - हत्ती" },
        "ksh": { char: "क्ष", hi: "क्ष - क्षत्रिय", mr: "क्ष - क्षत्रिय" },
        "tr": { char: "त्र", hi: "त्र - त्रिशूल", mr: "त्र - त्रिशूळ" },
        "gy": { char: "ज्ञ", hi: "ज्ञ - ज्ञानी", mr: "ज्ञ - ज्ञानेश्वर" }
    };

    // Combine both dictionaries so the popup can find everything easily
    const allLettersDict = { ...swarDict, ...vyanjanDict };

    // 4. ELEMENTS
    const grid = document.getElementById("varnamalaGrid");
    const popup = document.getElementById("popup");
    const popupImgLetter = document.getElementById("popupImgLetter");
    const popupImgWord = document.getElementById("popupImgWord");
    const popupName = document.getElementById("popupName");
    const toggleBtn = document.getElementById("toggleBtn");

    // Set UI Texts
    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = uiDictionary["page-title"][currentLang];
    
    let currentMode = "swar"; // Starts with Swar

    // 5. PRELOAD CACHE (Everything preloads instantly)
    const imageCacheLetters = {};
    const imageCacheWords = {};
    const soundCache = {};

    Object.keys(allLettersDict).forEach(name => {
      const imgLetter = new Image();
      imgLetter.src = `images/varnamala/letters/${name}.webp`;
      imageCacheLetters[name] = imgLetter;

      const imgWord = new Image();
      imgWord.src = `images/varnamala/words/${name}.webp`; 
      imageCacheWords[name] = imgWord;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/varnamala/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    // 6. LOAD GRID FUNCTION
    function loadGrid() {
      grid.innerHTML = "";
      
      // Choose which dictionary to loop through based on currentMode
      const activeDict = currentMode === "swar" ? swarDict : vyanjanDict;

      Object.keys(activeDict).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        // Main grid shows the Letter Image and the actual Devanagari character
        card.innerHTML = `
          <img src="${imageCacheLetters[name].src}" alt="${name}">
          <p>${activeDict[name].char}</p>
        `;

        card.onclick = () => showLetter(name);
        grid.appendChild(card);
      });

      // Update button text
      if (currentMode === "swar") {
          toggleBtn.innerText = uiDictionary["btn-vyanjan"][currentLang];
      } else {
          toggleBtn.innerText = uiDictionary["btn-swar"][currentLang];
      }
    }

    // Toggle Button Logic
    toggleBtn.onclick = () => {
        currentMode = currentMode === "swar" ? "vyanjan" : "swar";
        loadGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll back to top smoothly
    };

    // 7. POPUP DISPLAY
    function showLetter(name) {
      if (popupImgLetter) popupImgLetter.src = imageCacheLetters[name].src;
      if (popupImgWord) popupImgWord.src = imageCacheWords[name].src;
      if (popupName) popupName.textContent = allLettersDict[name][currentLang];
      
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    if (popup) {
        popup.onclick = (e) => {
            if(e.target === popup) {
                popup.classList.add("hidden");
            }
        };
    }

    // 8. CONFETTI
    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    // INITIALIZE
    loadGrid();
};