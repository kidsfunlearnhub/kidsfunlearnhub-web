"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🔢 Learn Numbers", hi: "🔢 नंबर सीखें", mr: "🔢 क्रमांक शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "nextBtn": { en: "➡ Next Numbers", hi: "➡ अगले नंबर", mr: "➡ पुढील क्रमांक" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "traceBtn": { en: "Number Tracing", hi: "नंबर ट्रेसिंग", mr: "अंक ट्रेसिंग" },
        "activitiesBtn": { en: "Numbers Activities", hi: "नंबर गतिविधियां", mr: "अंक ऍक्टिव्हिटीज" },
        "closePopupBtn": { en: "Close ✖", hi: "बंद करें ✖", mr: "बंद करा ✖" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Numbers Learning Zone</strong>! Tap on any number to see it come to life with fun counting images and sounds. This interactive activity helps toddlers connect digits to visual quantities, boosting their early math skills, counting abilities, and pronunciation.",
            hi: "<strong>KidsFunLearnHub नंबर्स लर्निंग ज़ोन</strong> में आपका स्वागत है! मज़ेदार गिनती वाली छवियों और ध्वनियों के साथ इसे जीवंत होते देखने के लिए किसी भी नंबर पर टैप करें। यह संवादात्मक गतिविधि बच्चों को अंकों को दृश्य मात्रा से जोड़ने में मदद करती है, जिससे उनके शुरुआती गणित कौशल, गिनती की क्षमताओं और उच्चारण को बढ़ावा मिलता है।",
            mr: "<strong>KidsFunLearnHub नंबर्स लर्निंग झोनमध्ये</strong> आपले स्वागत आहे! मजेदार मोजणीच्या प्रतिमा आणि आवाजांसह ते जिवंत होताना पाहण्यासाठी कोणत्याही क्रमांकावर टॅप करा. हा संवादात्मक क्रियाकलाप लहान मुलांना अंकांना दृश्य प्रमाणाशी जोडण्यास मदत करतो, ज्यामुळे त्यांचे सुरुवातीचे गणित कौशल्य, मोजणी क्षमता आणि उच्चार वाढतो."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

    // Dictionary for 1-40
    const numbersDict = {
        "1": { en: "One", hi: "एक", mr: "एक" }, "2": { en: "Two", hi: "दो", mr: "दोन" },
        "3": { en: "Three", hi: "तीन", mr: "तीन" }, "4": { en: "Four", hi: "चार", mr: "चार" },
        "5": { en: "Five", hi: "पांच", mr: "पाच" }, "6": { en: "Six", hi: "छह", mr: "सहा" },
        "7": { en: "Seven", hi: "सात", mr: "सात" }, "8": { en: "Eight", hi: "आठ", mr: "आठ" },
        "9": { en: "Nine", hi: "नौ", mr: "नऊ" }, "10": { en: "Ten", hi: "दस", mr: "दहा" },
        "11": { en: "Eleven", hi: "ग्यारह", mr: "अकरा" }, "12": { en: "Twelve", hi: "बारह", mr: "बारा" },
        "13": { en: "Thirteen", hi: "तेरह", mr: "तेरा" }, "14": { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        "15": { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" }, "16": { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        "17": { en: "Seventeen", hi: "सत्रह", mr: "सतरा" }, "18": { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        "19": { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" }, "20": { en: "Twenty", hi: "बीस", mr: "वीस" },
        "21": { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" }, "22": { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        "23": { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" }, "24": { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        "25": { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" }, "26": { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        "27": { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" }, "28": { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        "29": { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" }, "30": { en: "Thirty", hi: "तीस", mr: "तीस" },
        "31": { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" }, "32": { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        "33": { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" }, "34": { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        "35": { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" }, "36": { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        "37": { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" }, "38": { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        "39": { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" }, "40": { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    const numbers = Object.keys(numbersDict);
    const PAGE_SIZE = 20; 
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("numberGrid");
    const popup = document.getElementById("popup");
    const popupImgDigit = document.getElementById("popupImgDigit");
    
    // Original image tag from HTML
    const popupImgObject = document.getElementById("popupImgObject"); 
    
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");
    const traceBtn = document.getElementById("traceBtn");

    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    if (traceBtn) {
        if (currentLang === 'hi' || currentLang === 'mr') {
            traceBtn.href = "devnagaarinumberstrace.html";
        } else {
            traceBtn.href = "numberstrace.html";
        }
    }

    /////////////////////////////////////////////////
    // OBJECT IMAGE MAPPING LOGIC
    /////////////////////////////////////////////////
    
    const availableImages = [
      "images/numberscount/sparrow.webp", "images/numberscount/tiger.webp", "images/numberscount/lion.webp",
      "images/numberscount/elephant.webp", "images/numberscount/dog.webp", "images/numberscount/ant.webp",
      "images/numberscount/butterfly.webp", "images/numberscount/t1.webp", "images/numberscount/capsicum.webp",
      "images/numberscount/cat.webp", "images/numberscount/17.webp", "images/numberscount/parrot.webp",
      "images/numberscount/pigeon.webp", "images/numberscount/cow.webp", "images/numberscount/guava.webp",
      "images/numberscount/housefly.webp", "images/numberscount/ladybug.webp", "images/numberscount/lotus.webp",
      "images/numberscount/monkey.webp", "images/numberscount/8.webp", "images/numberscount/onion.webp",
      "images/numberscount/panda.webp", "images/numberscount/potato.webp", "images/numberscount/rabit.webp",
      "images/numberscount/rose.webp", "images/numberscount/beetroot.webp", "images/numberscount/okra.webp",
      "images/numberscount/9.webp", "images/numberscount/10.webp", "images/numberscount/13.webp",
      "images/numberscount/14.webp", "images/numberscount/18.webp", "images/numberscount/22.webp",
      "images/numberscount/23.webp", "images/numberscount/24.webp", "images/numberscount/star.webp",
      "images/numberscount/sunflower.webp", "images/numberscount/th2.webp", "images/numberscount/zinnia.webp"
    ];

    const numberImages = {};
    for (let i = 1; i <= 40; i++) {
      let index = (i - 1) % availableImages.length;
      numberImages[String(i)] = availableImages[index];
    }

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE
    /////////////////////////////////////////////////

    const imageCacheDigits = {};
    const soundCache = {};

    let imageFolder = 'en'; 
    if (currentLang === 'hi' || currentLang === 'mr') {
        imageFolder = 'devanagari'; 
    }

    numbers.forEach(num => {
      // Preload text digits
      const imgDigit = new Image();
      imgDigit.src = `images/numbers/digits/${imageFolder}/${num}.webp`;
      imageCacheDigits[num] = imgDigit;

      // Preload audio
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
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Learn number " + num);

        card.innerHTML = `
          <img src="${imageCacheDigits[num].src}" alt="${num}">
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
            currentPage = 0; 
          }
          loadPage();
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY (DYNAMIC MULTIPLE IMAGES)
    /////////////////////////////////////////////////

    function showNumber(num) {
      num = String(num); 

      if (popupImgDigit) popupImgDigit.src = imageCacheDigits[num].src;
      
      if (popupImgObject) {
          popupImgObject.style.display = 'none';
          
          let repeatedContainer = document.getElementById("popupRepeatedObjects");
          if (!repeatedContainer) {
              repeatedContainer = document.createElement("div");
              repeatedContainer.id = "popupRepeatedObjects";
              
              // MASSIVELY INCREASED CONTAINER SIZE!
              repeatedContainer.style.cssText = "display: flex; flex-wrap: wrap; justify-content: center; align-content: center; gap: 2px; background: #f1f8e9; border-radius: 15px; padding: 5px; box-shadow: inset 0 4px 8px rgba(0,0,0,0.05); overflow: hidden; flex-shrink: 0; box-sizing: border-box;";
              
              const popupImagesDiv = document.querySelector(".popup-images");
              if (popupImagesDiv) {
                  popupImagesDiv.appendChild(repeatedContainer);
              }
          }

          const limit = parseInt(num);
          
          // INCREASED DIMENSIONS: 280px on desktop, 250px on mobile
          const boxSize = window.innerWidth <= 500 ? 250 : 280; 
          
          repeatedContainer.style.width = boxSize + "px";
          repeatedContainer.style.height = boxSize + "px";

          const availableSpace = boxSize - 10; 
          const cols = Math.ceil(Math.sqrt(limit));
          const exactSize = Math.floor((availableSpace - ((cols - 1) * 2)) / cols);
          
          // CAP INCREASED: Allows single items to be up to 130px big!
          const dynamicSize = Math.min(130, exactSize);

          let imagesHtml = '';
          const imgSrc = numberImages[num]; 
          
          for(let i = 0; i < limit; i++) {
              imagesHtml += `<img src="${imgSrc}" style="width: ${dynamicSize}px; height: ${dynamicSize}px; object-fit: contain; pointer-events: none; background: transparent; padding: 0; box-shadow: none; margin: 0;" alt="Object">`;
          }
          
          repeatedContainer.innerHTML = imagesHtml;
      }

      if (popupName) popupName.textContent = numbersDict[num][currentLang];
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[num];
      if (sound) {
          sound.currentTime = 0;
          sound.play().catch(e => console.log("Sound play error: ", e));
      }

      launchConfetti();
    }

    function closePopup() {
        if (popup) popup.classList.add("hidden");
    }

    // Ensures sizes stay perfect if the user rotates their phone
    window.addEventListener('resize', () => {
        if (!popup.classList.contains("hidden")) {
            const currentName = popupName.textContent;
            for (let num in numbersDict) {
                if (numbersDict[num][currentLang] === currentName) {
                    showNumber(num);
                    break;
                }
            }
        }
    });

    if (popup) popup.onclick = closePopup;
    if (closePopupBtn) closePopupBtn.onclick = closePopup;

    /////////////////////////////////////////////////
    // CURSOR LOGIC
    /////////////////////////////////////////////////
    const select = document.getElementById("cursorSelect");
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
        if(select) select.value = savedCursor.split("/").pop().replace(/["')]/g, '').split(' ')[0];
    }
    if(select) {
        select.addEventListener("change", () => {
            if (!select.value) {
                document.documentElement.style.cursor = "auto";
                localStorage.removeItem("kidsCursor");
                return;
            }
            const cursorValue = `url("images/cursors/${select.value}") 16 16, auto`;
            document.documentElement.style.cursor = cursorValue;
            localStorage.setItem("kidsCursor", cursorValue);
        });
    }

    /////////////////////////////////////////////////
    // CONFETTI
    /////////////////////////////////////////////////

    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    // INIT
    loadPage();
};