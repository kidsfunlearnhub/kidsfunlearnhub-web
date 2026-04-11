window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🔢 Learn Numbers", hi: "🔢 नंबर सीखें", mr: "🔢 क्रमांक शिका" },
        "nextBtn": { en: "➡ Next Numbers", hi: "➡ अगले नंबर", mr: "➡ पुढील क्रमांक" }
    };

    // Dictionary for 1-40
    const numbersDict = {
        "1": { en: "One", hi: "एक", mr: "एक" },
        "2": { en: "Two", hi: "दो", mr: "दोन" },
        "3": { en: "Three", hi: "तीन", mr: "तीन" },
        "4": { en: "Four", hi: "चार", mr: "चार" },
        "5": { en: "Five", hi: "पांच", mr: "पाच" },
        "6": { en: "Six", hi: "छह", mr: "सहा" },
        "7": { en: "Seven", hi: "सात", mr: "सात" },
        "8": { en: "Eight", hi: "आठ", mr: "आठ" },
        "9": { en: "Nine", hi: "नौ", mr: "नऊ" },
        "10": { en: "Ten", hi: "दस", mr: "दहा" },
        "11": { en: "Eleven", hi: "ग्यारह", mr: "अकरा" },
        "12": { en: "Twelve", hi: "बारह", mr: "बारा" },
        "13": { en: "Thirteen", hi: "तेरह", mr: "तेरा" },
        "14": { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        "15": { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" },
        "16": { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        "17": { en: "Seventeen", hi: "सत्रह", mr: "सतरा" },
        "18": { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        "19": { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" },
        "20": { en: "Twenty", hi: "बीस", mr: "वीस" },
        "21": { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" },
        "22": { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        "23": { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" },
        "24": { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        "25": { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" },
        "26": { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        "27": { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" },
        "28": { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        "29": { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" },
        "30": { en: "Thirty", hi: "तीस", mr: "तीस" },
        "31": { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" },
        "32": { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        "33": { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" },
        "34": { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        "35": { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" },
        "36": { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        "37": { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" },
        "38": { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        "39": { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" },
        "40": { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    const numbers = Object.keys(numbersDict);
    const PAGE_SIZE = 20; // Show 20 numbers per page
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("numberGrid");
    const popup = document.getElementById("popup");
    const popupImgDigit = document.getElementById("popupImgDigit");
    const popupImgObject = document.getElementById("popupImgObject");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = uiDictionary["page-title"][currentLang];
    if (nextBtn) nextBtn.innerText = uiDictionary["nextBtn"][currentLang];

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE (DOUBLE IMAGES)
    /////////////////////////////////////////////////

    const imageCacheDigits = {};
    const imageCacheObjects = {};
    const soundCache = {};

    numbers.forEach(num => {
      // 1. Preload the Number Digit Image
      const imgDigit = new Image();
      imgDigit.src = `images/numbers/digits/${num}.webp`;
      imageCacheDigits[num] = imgDigit;

      // 2. Preload the Associated Counting Image (e.g. 5 apples)
      const imgObject = new Image();
      imgObject.src = `images/numbers/objects/${num}.webp`; 
      imageCacheObjects[num] = imgObject;

      // 3. Preload the Sound 
      const audio = new Audio();
      audio.src = `sounds/${currentLang}/numbers/${num}.mp3`;
      audio.preload = "auto";
      soundCache[num] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      numbers.slice(start, end).forEach(num => {
        const card = document.createElement("div");
        card.className = "card";

        // Main grid shows the digit image and the number text
        card.innerHTML = `
          <img src="${imageCacheDigits[num].src}" alt="${num}">
          <p>${num}</p>
        `;

        card.onclick = () => showNumber(num);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= numbers.length) {
            currentPage = 0; // Loop back to the first page (1-20)
          }
          loadPage();
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up nicely
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY (TWO IMAGES)
    /////////////////////////////////////////////////

    function showNumber(num) {
      if (popupImgDigit) popupImgDigit.src = imageCacheDigits[num].src;
      if (popupImgObject) popupImgObject.src = imageCacheObjects[num].src;
      if (popupName) popupName.textContent = numbersDict[num][currentLang];
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[num];
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