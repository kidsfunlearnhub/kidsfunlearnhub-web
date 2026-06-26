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
            en: `
                <h2>About The Vehicle Learning Flashcards</h2>
                <p>Zoom into learning with the Vehicle Learning Flashcards! This exciting digital activity introduces toddlers to community transport. Tapping any vehicle triggers a massive pop-up image and a clear, precise audio pronunciation.</p>
                <p><strong>Learning Outcomes:</strong> Community transport vocabulary, mechanical categorization, early speech development, and regional language integration.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Vehicles are incredibly engaging for young minds. Our pop-up flashcard system allows children to closely examine the structural details of land, air, and water transport. Isolating a fire truck or an airplane on the screen helps them focus on distinct parts like wheels, windows, and wings, building early mechanical awareness.</p>
                        <p>Our interactive audio system provides precise Devanagari pronunciations alongside English. This allows children to confidently learn regional terms for trains, boats, and cars that match their local environment, ensuring their vocabulary grows rapidly in English, Hindi, and Marathi simultaneously.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Does this module include emergency vehicles?</strong><br>Yes, recognizing community helper vehicles like ambulances and police cars is a key part of this vocabulary lesson.</p>
                        <p><strong>Are transport flashcards available for offline play?</strong><br>Absolutely! Check the Parents Corner for high-quality, printable transport flashcards and puzzles.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>वाहन लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>वाहन लर्निंग फ्लैशकार्ड के साथ सीखने में ज़ूम इन करें! यह रोमांचक डिजिटल गतिविधि बच्चों को सामुदायिक परिवहन से परिचित कराती है। किसी भी वाहन को टैप करने से एक विशाल पॉप-अप छवि और एक स्पष्ट, सटीक ऑडियो उच्चारण ट्रिगर होता है।</p>
                <p><strong>सीखने के परिणाम:</strong> सामुदायिक परिवहन शब्दावली, यांत्रिक वर्गीकरण, प्रारंभिक वाक् विकास, और क्षेत्रीय भाषा एकीकरण।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>वाहन युवा दिमाग के लिए अविश्वसनीय रूप से आकर्षक हैं। हमारा पॉप-अप फ्लैशकार्ड सिस्टम बच्चों को भूमि, वायु और जल परिवहन के संरचनात्मक विवरणों की बारीकी से जांच करने की अनुमति देता है। स्क्रीन पर फायर ट्रक या हवाई जहाज को अलग करने से उन्हें पहियों, खिड़कियों और पंखों जैसे अलग-अलग हिस्सों पर ध्यान केंद्रित करने में मदद मिलती है, जिससे प्रारंभिक यांत्रिक जागरूकता का निर्माण होता है।</p>
                        <p>हमारा इंटरैक्टिव ऑडियो सिस्टम अंग्रेजी के साथ-साथ सटीक देवनागरी उच्चारण प्रदान करता है। इससे बच्चों को ट्रेनों, नावों और कारों के लिए क्षेत्रीय शब्द आत्मविश्वास से सीखने की अनुमति मिलती है जो उनके स्थानीय वातावरण से मेल खाते हैं, यह सुनिश्चित करते हुए कि उनकी शब्दावली अंग्रेजी, हिंदी और मराठी में एक साथ तेजी से बढ़ती है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या इस मॉड्यूल में आपातकालीन वाहन शामिल हैं?</strong><br>हाँ, एम्बुलेंस और पुलिस कारों जैसे सामुदायिक सहायक वाहनों को पहचानना इस शब्दावली पाठ का एक महत्वपूर्ण हिस्सा है।</p>
                        <p><strong>क्या ऑफ़लाइन खेलने के लिए परिवहन फ्लैशकार्ड उपलब्ध हैं?</strong><br>बिल्कुल! उच्च गुणवत्ता वाले, प्रिंट करने योग्य परिवहन फ्लैशकार्ड और पहेलियों के लिए पेरेंट्स कॉर्नर देखें।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>वाहने लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>वाहने लर्निंग फ्लॅशकार्ड्ससह शिकण्याला वेग द्या! ही रोमांचक डिजिटल ऍक्टिव्हिटी लहान मुलांना सार्वजनिक वाहतुकीची ओळख करून देते. कोणत्याही वाहनावर टॅप केल्याने एक मोठी पॉप-अप प्रतिमा आणि एक स्पष्ट, अचूक ऑडिओ उच्चार ट्रिगर होतो.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> सार्वजनिक वाहतूक शब्दसंग्रह, यांत्रिक वर्गीकरण, प्रारंभिक भाषण विकास आणि प्रादेशिक भाषा एकत्रीकरण.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>वाहने तरुण मनांसाठी आश्चर्यकारकपणे आकर्षक आहेत. आमची पॉप-अप फ्लॅशकार्ड प्रणाली मुलांना जमीन, हवा आणि जल वाहतुकीच्या संरचनात्मक तपशीलांचे बारकाईने परीक्षण करण्यास अनुमती देते. स्क्रीनवर फायर ट्रक किंवा विमान वेगळे केल्याने त्यांना चाके, खिडक्या आणि पंख यांसारख्या विशिष्ट भागांवर लक्ष केंद्रित करण्यास मदत होते, ज्यामुळे प्रारंभिक यांत्रिक जागरूकता निर्माण होते.</p>
                        <p>आमची इंटरएक्टिव्ह ऑडिओ प्रणाली इंग्रजीच्या बरोबरीने अचूक देवनागरी उच्चार प्रदान करते. यामुळे मुलांना त्यांच्या स्थानिक वातावरणाशी जुळणाऱ्या ट्रेन, बोटी आणि गाड्यांसाठी प्रादेशिक शब्द आत्मविश्वासाने शिकता येतात, ज्यामुळे त्यांचा शब्दसंग्रह एकाच वेळी इंग्रजी, हिंदी आणि मराठीमध्ये वेगाने वाढतो.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>या मॉड्यूलमध्ये आपत्कालीन वाहनांचा समावेश आहे का?</strong><br>होय, रुग्णवाहिका आणि पोलिसांच्या गाड्यांसारख्या सार्वजनिक मदतनीस वाहनांना ओळखणे हा या शब्दसंग्रह धड्याचा एक महत्त्वाचा भाग आहे.</p>
                        <p><strong>ऑफलाइन खेळासाठी वाहतूक फ्लॅशकार्ड्स उपलब्ध आहेत का?</strong><br>नक्कीच! उच्च दर्जाच्या, प्रिंट करण्यायोग्य वाहतूक फ्लॅशकार्ड्स आणि पझल्ससाठी पेरेंट्स कॉर्नर तपासा.</p>
                    </div>
                </details>
            `
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