"use strict";

document.addEventListener("DOMContentLoaded", () => {
    
    /////////////////////////////////////////////////
    // 1. CURSOR LOGIC
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
    // 2. LANGUAGE SETUP & DICTIONARIES
    /////////////////////////////////////////////////
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🔢 Learn Numbers", hi: "🔢 नंबर सीखें", mr: "🔢 क्रमांक शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "btnNext": { en: "21 to 40 ➡️", hi: "२१ से ४० ➡️", mr: "२१ ते ४० ➡️" },
        "btnPrev": { en: "⬅️ 1 to 20", hi: "⬅️ १ से २०", mr: "⬅️ १ ते २०" },
        "closeHint": { en: "Tap anywhere to close ✖", hi: "बंद करने के लिए टैप करें ✖", mr: "बंद करण्यासाठी टॅप करा ✖" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
        "activitiesBtn": { en: "Numbers Activities", hi: "नंबर गतिविधियां", mr: "अंक ऍक्टिव्हिटीज" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Interactive Counting Zone</strong>! Tap on any number card and watch as fun, colorful objects pop onto the screen one by one as we count out loud. Connecting the visual quantity to the spoken number is the absolute best way for toddlers to build strong early math skills.",
            hi: "<strong>KidsFunLearnHub इंटरएक्टिव काउंटिंग ज़ोन</strong> में आपका स्वागत है! किसी भी नंबर कार्ड पर टैप करें और देखें कि कैसे मज़ेदार, रंग-बिरंगी वस्तुएं एक-एक करके स्क्रीन पर आती हैं और हम उन्हें जोर से गिनते हैं। दृश्य मात्रा को बोले गए नंबर से जोड़ना बच्चों में मजबूत शुरुआती गणित कौशल विकसित करने का सबसे अच्छा तरीका है।",
            mr: "<strong>KidsFunLearnHub इंटरएक्टिव्ह काउंटिंग झोनमध्ये</strong> आपले स्वागत आहे! कोणत्याही नंबर कार्डवर टॅप करा आणि पहा की मजेदार, रंगीत वस्तू एकामागून एक स्क्रीनवर येतात आणि आम्ही त्यांना मोठ्याने मोजतो. दृश्य प्रमाणाला बोलल्या जाणार्‍या संख्येशी जोडणे हा लहान मुलांसाठी सुरुवातीची गणित कौशल्ये विकसित करण्याचा सर्वोत्तम मार्ग आहे."
        }
    };

    const numbersDict = {
        1: { en: "One", hi: "एक", mr: "एक" },
        2: { en: "Two", hi: "दो", mr: "दोन" },
        3: { en: "Three", hi: "तीन", mr: "तीन" },
        4: { en: "Four", hi: "चार", mr: "चार" },
        5: { en: "Five", hi: "पांच", mr: "पाच" },
        6: { en: "Six", hi: "छह", mr: "सहा" },
        7: { en: "Seven", hi: "सात", mr: "सात" },
        8: { en: "Eight", hi: "आठ", mr: "आठ" },
        9: { en: "Nine", hi: "नौ", mr: "नऊ" },
        10: { en: "Ten", hi: "दस", mr: "दहा" },
        11: { en: "Eleven", hi: "ग्यारह", mr: "अकरा" },
        12: { en: "Twelve", hi: "बारह", mr: "बारा" },
        13: { en: "Thirteen", hi: "तेरह", mr: "तेरा" },
        14: { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        15: { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" },
        16: { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        17: { en: "Seventeen", hi: "सत्रह", mr: "सतरा" },
        18: { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        19: { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" },
        20: { en: "Twenty", hi: "बीस", mr: "वीस" },
        21: { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" },
        22: { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        23: { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" },
        24: { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        25: { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" },
        26: { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        27: { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" },
        28: { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        29: { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" },
        30: { en: "Thirty", hi: "तीस", mr: "तीस" },
        31: { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" },
        32: { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        33: { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" },
        34: { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        35: { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" },
        36: { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        37: { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" },
        38: { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        39: { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" },
        40: { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    ////////////////////////////////////////////////////////
    // 3. NUMBER TRANSLATOR FUNCTION
    ////////////////////////////////////////////////////////
    function getLocalDigit(num) {
        if (currentLang === 'hi' || currentLang === 'mr') {
            const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
            return num.toString().split('').map(digit => devanagariDigits[digit]).join('');
        }
        return num; 
    }

    ////////////////////////////////////////////////////////
    // 4. IMAGE MAP
    ////////////////////////////////////////////////////////
    const availableImages = [
      "images/numberscount/sparrow.webp",
      "images/numberscount/tiger.webp",
      "images/numberscount/lion.webp",
      "images/numberscount/elephant.webp",
      "images/numberscount/dog.webp",

      "images/numberscount/ant.webp",
      "images/numberscount/butterfly.webp",
      "images/numberscount/t1.webp",
      "images/numberscount/capsicum.webp",
      "images/numberscount/cat.webp",
      "images/numberscount/17.webp",
      "images/numberscount/parrot.webp",
      "images/numberscount/pigeon.webp",
      "images/numberscount/cow.webp",
      "images/numberscount/guava.webp",
      "images/numberscount/housefly.webp",
      "images/numberscount/ladybug.webp",
       "images/numberscount/lotus.webp",
      "images/numberscount/monkey.webp",
      "images/numberscount/8.webp",
      
      "images/numberscount/onion.webp",
      "images/numberscount/panda.webp",
      
      "images/numberscount/potato.webp",
      "images/numberscount/rabit.webp",
      "images/numberscount/rose.webp",
      "images/numberscount/beetroot.webp",

      "images/numberscount/okra.webp",
      "images/numberscount/9.webp",
      "images/numberscount/10.webp",
      "images/numberscount/13.webp",
      "images/numberscount/14.webp",
    
      "images/numberscount/18.webp",
      "images/numberscount/22.webp",
      "images/numberscount/23.webp",
      "images/numberscount/24.webp",

      "images/numberscount/star.webp",
      "images/numberscount/sunflower.webp",
      "images/numberscount/th2.webp",
      "images/numberscount/zinnia.webp",

      
     
    ];

    const numberImages = {};
    for (let i = 1; i <= 40; i++) {
      numberImages[i] = availableImages[(i - 1) % availableImages.length];
    }

    ////////////////////////////////////////////////////////
    // 5. ELEMENTS & PAGINATION
    ////////////////////////////////////////////////////////
    const grid = document.getElementById("numbersGrid");
    const overlay = document.getElementById("counterOverlay");
    const square = document.getElementById("counterSquare");
    const circle = document.getElementById("counterCircle");
    const counterValue = document.getElementById("counterValue");
    const imageContainer = document.getElementById("imageContainer");
    const popupName = document.getElementById("popupName");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    let countInterval;
    let currentPage = 0; // 0 = (1-20), 1 = (21-40)
    const PAGE_SIZE = 20;

    function renderGrid() {
      grid.innerHTML = ""; 

      const startNum = (currentPage * PAGE_SIZE) + 1; 
      const endNum = startNum + PAGE_SIZE - 1;        

      for (let i = startNum; i <= endNum; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");
        
        card.textContent = getLocalDigit(i);
        
        card.onclick = () => startCounting(i);
        grid.appendChild(card);
      }

      if (btnPrev) btnPrev.style.display = currentPage === 0 ? "none" : "block";
      if (btnNext) btnNext.style.display = currentPage === 1 ? "none" : "block";
    }

    if (btnNext) {
        btnNext.onclick = () => {
          currentPage = 1;
          renderGrid();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    if (btnPrev) {
        btnPrev.onclick = () => {
          currentPage = 0;
          renderGrid();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    renderGrid();

    ////////////////////////////////////////////////////////
    // 6. COUNTING LOGIC & AUDIO
    ////////////////////////////////////////////////////////
    function startCounting(finalNumber) {
      clearInterval(countInterval);

      let count = 0;
      counterValue.textContent = getLocalDigit(0); 
      imageContainer.innerHTML = ""; 
      popupName.textContent = ""; 

      // FIX: Used classList.remove instead of style.display to override the CSS !important rule
      overlay.classList.remove("hidden");
      overlay.style.display = "flex"; // Ensures flex layout applies properly once unhidden

      square.style.animation = "none";
      square.offsetHeight; 
      square.style.animation = "popup 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";

      countInterval = setInterval(() => {
        count++;
        
        counterValue.textContent = getLocalDigit(count);

        const audio = new Audio(`sounds/${currentLang}/numbers/${count}.mp3`);
        audio.play().catch(e => console.log("Sound not found for:", count));

        circle.style.background = randomGradient();

        const img = document.createElement("img");
        img.src = numberImages[finalNumber];
        img.className = "countImg";
        imageContainer.appendChild(img);

        if (count === finalNumber) {
          clearInterval(countInterval);
          
          popupName.textContent = numbersDict[finalNumber][currentLang];
          launchConfetti();
        }
      }, 600); // 600ms gap between each count pop
    }

    ////////////////////////////////////////////////////////
    // 7. CLOSE LOGIC & HELPERS
    ////////////////////////////////////////////////////////
    function closeOverlay() {
      clearInterval(countInterval);
      
      // FIX: Used classList.add to re-hide the popup correctly
      overlay.classList.add("hidden");
      
      // Clear out the images so they don't flash the next time it opens
      setTimeout(() => {
          imageContainer.innerHTML = ""; 
          popupName.textContent = ""; 
      }, 300);
    }

    overlay.onclick = closeOverlay;
    square.onclick = (e) => {
      e.stopPropagation(); 
    };
    
    // Allow clicking the close text specifically
    const closeHint = document.getElementById("closeHint");
    if (closeHint) {
        closeHint.onclick = (e) => {
            closeOverlay();
            e.stopPropagation();
        };
    }

    function randomGradient() {
      return `linear-gradient(135deg,
        hsl(${Math.random() * 360}, 85%, 55%),
        hsl(${Math.random() * 360}, 85%, 45%))`;
    }

    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
    }
});