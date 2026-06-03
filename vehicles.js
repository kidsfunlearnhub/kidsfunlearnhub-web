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
    // 2. LANGUAGE SETUP, DICTIONARIES & BUTTONS
    /////////////////////////////////////////////////
    
    // Get the global language from index.html
    let globalLang = localStorage.getItem('mySecretLanguage') || 'en';
    
    // Get this specific page's language, fallback to global if not clicked yet
    let currentLang = sessionStorage.getItem('vehiclesPageLang') || globalLang;

    // Highlight the active language button and set up the reload logic
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', (e) => {
            const selectedLang = e.target.dataset.lang;
            if (selectedLang !== currentLang) {
                // Save only to sessionStorage so it doesn't affect the rest of the site
                sessionStorage.setItem('vehiclesPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🚌 Learn Vehicles", hi: "🚌 वाहन सीखें", mr: "🚌 वाहने शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Vehicle Activities", hi: "वाहन गतिविधियां", mr: "वाहन ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Vehicles", hi: "➡ अगले वाहन", mr: "➡ पुढील वाहने" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Transportation Hub</strong>! Tap on any vehicle card to see a larger picture and hear its name. This interactive vocabulary activity helps toddlers recognize different modes of transport, improving their memory and early speech skills.",
            hi: "<strong>KidsFunLearnHub ट्रांसपोर्टेशन हब</strong> में आपका स्वागत है! बड़ी तस्वीर देखने और उसका नाम सुनने के लिए किसी भी वाहन कार्ड पर टैप करें। यह संवादात्मक शब्दावली गतिविधि बच्चों को परिवहन के विभिन्न साधनों को पहचानने में मदद करती है, जिससे उनकी याददाश्त और प्रारंभिक भाषण कौशल में सुधार होता है।",
            mr: "<strong>KidsFunLearnHub ट्रान्सपोर्टेशन हबमध्ये</strong> आपले स्वागत आहे! मोठे चित्र पाहण्यासाठी आणि त्याचे नाव ऐकण्यासाठी कोणत्याही वाहन कार्डवर टॅप करा. ही संवादात्मक शब्दसंग्रह ऍक्टिव्हिटी लहान मुलांना वाहतुकीचे विविध मार्ग ओळखण्यास मदत करते, त्यांची स्मरणशक्ती आणि प्रारंभिक भाषण कौशल्ये सुधारते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

    const vehicleDict = {
        "car": { en: "Car", hi: "कार", mr: "कार" },
        "bus": { en: "Bus", hi: "बस", mr: "बस" },
        "auto rickshaw": { en: "Auto Rickshaw", hi: "ऑटो रिक्शा", mr: "ऑटो रिक्षा" },
        "motorcycle": { en: "Motorcycle", hi: "मोटरसाइकिल", mr: "मोटारसायकल" },
        "bicycle": { en: "Bicycle", hi: "साइकिल", mr: "सायकल" },
        "scooter": { en: "Scooter", hi: "स्कूटर", mr: "स्कूटर" },
        "truck": { en: "Truck", hi: "ट्रक", mr: "ट्रक" },
        "tractor": { en: "Tractor", hi: "ट्रैक्टर", mr: "ट्रॅक्टर" },
        "train": { en: "Train", hi: "रेलगाड़ी", mr: "रेल्वे" },
        "metro": { en: "Metro", hi: "मेट्रो", mr: "मेट्रो" },
        "ambulance": { en: "Ambulance", hi: "एम्बुलेंस", mr: "रुग्णवाहिका" },
        "fire engine": { en: "Fire Engine", hi: "दमकल", mr: "अग्निशमन दल" },
        "police jeep": { en: "Police Jeep", hi: "पुलिस जीप", mr: "पोलीस जीप" },
        "school bus": { en: "School Bus", hi: "स्कूल बस", mr: "स्कूल बस" },
        "van": { en: "Van", hi: "वैन", mr: "व्हॅन" },
        "tempo": { en: "Tempo", hi: "टेम्पो", mr: "टेम्पो" },
        "delivery truck": { en: "Delivery Truck", hi: "डिलीवरी ट्रक", mr: "मालवाहू ट्रक" },
        "taxi": { en: "Taxi", hi: "टैक्सी", mr: "टॅक्सी" },
        "rickshaw": { en: "Rickshaw", hi: "रिक्शा", mr: "रिक्षा" },
        "bulldozer": { en: "Bulldozer", hi: "बुलडोजर", mr: "बुलडोझर" },
        "crane": { en: "Crane", hi: "क्रेन", mr: "क्रेन" },
        "excavator": { en: "Excavator", hi: "उत्खनन मशीन", mr: "एक्साव्हेटर" },
        "boat": { en: "Boat", hi: "नाव", mr: "बोट" },
        "ferry": { en: "Ferry", hi: "नौका", mr: "फेरी" },
        "ship": { en: "Ship", hi: "पानी का जहाज", mr: "जहाज" },
        "helicopter": { en: "Helicopter", hi: "हेलीकॉप्टर", mr: "हेलिकॉप्टर" },
        "airplane": { en: "Airplane", hi: "हवाई जहाज", mr: "विमान" },
        "garbage truck": { en: "Garbage Truck", hi: "कचरा ट्रक", mr: "कचऱ्याचा ट्रक" },
        "cement mixer": { en: "Cement Mixer", hi: "सीमेंट मिक्सर", mr: "सिमेंट मिक्सर" },
        "tow truck": { en: "Tow Truck", hi: "टो ट्रक", mr: "टोइंग ट्रक" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const vehicles = Object.keys(vehicleDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("vehicleGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    vehicles.forEach(name => {
      const img = new Image();
      img.src = `images/vehicles/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/vehicles/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // 4. BUILD PAGE GRID
    /////////////////////////////////////////////////
    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      vehicles.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = vehicleDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showVehicle(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= vehicles.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showVehicle(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = vehicleDict[name][currentLang];
      
      if (popup) {
          popup.classList.remove("hidden");
          popup.style.display = "flex";
      }

      if (activeAudio) {
          activeAudio.pause();
          activeAudio.currentTime = 0;
      }
      activeAudio = soundCache[name];
      activeAudio.currentTime = 0;
      activeAudio.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    function closePopup() {
        if (popup) {
            popup.classList.add("hidden");
            popup.style.display = "none";
        }
        if (activeAudio) activeAudio.pause();
    }

    // Toddler-proof closing
    if (popup) {
        popup.onclick = () => { closePopup(); };
    }

    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
        popupContent.onclick = (e) => {
            closePopup();
            e.stopPropagation();
        };
    }

    /////////////////////////////////////////////////
    // 6. CONFETTI
    /////////////////////////////////////////////////
    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    /////////////////////////////////////////////////
    // 7. CLEANUP LOGIC ON EXIT
    /////////////////////////////////////////////////
    const cleanupSession = () => sessionStorage.removeItem('vehiclesPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});