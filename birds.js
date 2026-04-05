// This tells the script to WAIT until the HTML is fully loaded on the screen
window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // Read the language clicked on the home page (default to English if empty)
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // Dictionary for the Page Title and Next Button
    const uiDictionary = {
        "page-title": { en: "🦚 Learn Birds", hi: "🦚 पक्षी सीखें", mr: "🦚 पक्षी शिका" },
        "nextBtn": { en: "➡ Next Birds", hi: "➡ अगले पक्षी", mr: "➡ पुढील पक्षी" }
    };

    // Dictionary for all 30 birds
    const birdDict = {
        "peacock": { en: "Peacock", hi: "मोर", mr: "मोर" },
        "sparrow": { en: "Sparrow", hi: "गौरैया", mr: "चिमणी" },
        "crow": { en: "Crow", hi: "कौवा", mr: "कावळा" },
        "parrot": { en: "Parrot", hi: "तोता", mr: "पोपट" },
        "pigeon": { en: "Pigeon", hi: "कबूतर", mr: "कबूतर" },
        "myna": { en: "Myna", hi: "मैना", mr: "मैना" },
        "kingfisher": { en: "Kingfisher", hi: "किंगफिशर", mr: "खंड्या" },
        "bulbul": { en: "Bulbul", hi: "बुलबुल", mr: "बुलबुल" },
        "koel": { en: "Koel", hi: "कोयल", mr: "कोकिळा" },
        "eagle": { en: "Eagle", hi: "गरुड़", mr: "गरुड" },
        "owl": { en: "Owl", hi: "उल्लू", mr: "घुबड" },
        "vulture": { en: "Vulture", hi: "गिद्ध", mr: "गिधाड" },
        "crane": { en: "Crane", hi: "सारस", mr: "क्रौंच" },
        "heron": { en: "Heron", hi: "बगुला", mr: "बगळा" },
        "stork": { en: "Stork", hi: "स्टॉर्क", mr: "करकोचा" },
        "duck": { en: "Duck", hi: "बत्तख", mr: "बदक" },
        "goose": { en: "Goose", hi: "हंस", mr: "हंस" },
        "quail": { en: "Quail", hi: "बटेर", mr: "लावा" },
        "lapwing": { en: "Lapwing", hi: "टिटहरी", mr: "टिटवी" },
        "woodpecker": { en: "Woodpecker", hi: "कठफोड़वा", mr: "सुतारपक्षी" },
        "sunbird": { en: "Sunbird", hi: "शकरखोरा", mr: "शिंजीर" },
        "hornbill": { en: "Hornbill", hi: "धनेश", mr: "धनेश" },
        "kite": { en: "Kite", hi: "चील", mr: "घार" },
        "falcon": { en: "Falcon", hi: "बाज", mr: "ससाणा" },
        "weaverbird": { en: "Weaverbird", hi: "बया", mr: "सुगरण" },
        "drongo": { en: "Drongo", hi: "भुजंगा", mr: "कोतवाल" },
        "barbet": { en: "Barbet", hi: "बसंत बौरी", mr: "तांबट" },
        "roller": { en: "Roller", hi: "नीलकंठ", mr: "नीलकंठ" },
        "flamingo": { en: "Flamingo", hi: "राजहंस", mr: "रोहित पक्षी" },
        "ibis": { en: "Ibis", hi: "इबिस", mr: "शराटी" }
    };

    const birds = Object.keys(birdDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("birdGrid");
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

    birds.forEach(name => {
      const img = new Image();
      img.src = `images/birds/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/birds/${name}.mp3`;
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

      birds.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        const translatedName = birdDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${name}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showBird(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= birds.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY
    /////////////////////////////////////////////////

    function showBird(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = birdDict[name][currentLang];
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