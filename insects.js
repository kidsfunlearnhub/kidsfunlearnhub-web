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
    let currentLang = sessionStorage.getItem('insectsPageLang') || globalLang;

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
                sessionStorage.setItem('insectsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🪰 Learn Insects", hi: "🪰 कीड़े सीखें", mr: "🪰 कीटक शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Insect Activities", hi: "कीट गतिविधियां", mr: "कीटक ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Insects", hi: "➡ अगले कीड़े", mr: "➡ पुढील कीटक" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
       "seoText": {
            en: `
                <h2>About The Insect Learning Flashcards</h2>
                <p>Explore the microscopic world safely with our Insect Learning Flashcards! This fun digital tool replaces bug-related fears with scientific curiosity by allowing toddlers to tap, pop up, and learn the names of friendly backyard insects.</p>
                <p><strong>Learning Outcomes:</strong> Scientific curiosity, backyard vocabulary, auditory processing, and regional nature terminology.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Insects can be intimidating for young children. By presenting them as bright, friendly flashcards that pop up on command, we give the child complete control over their learning environment. This macro-view allows them to safely count the legs on an ant or observe the colorful wings of a butterfly, fostering early scientific observation.</p>
                        <p>Coupled with our English, Hindi, and Marathi audio dictionaries, this activity builds practical vocabulary. A child interacting with the butterfly pop-up will simultaneously absorb the English term alongside the regional word 'Phulpakhru' (फुलपाखरू), enriching their daily conversational language.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Why are digital flashcards effective for toddlers?</strong><br>They introduce "cause and effect." The child learns that their physical action (tapping) yields a specific reward (a fun pop-up and sound), keeping them highly engaged.</p>
                        <p><strong>Are printable bug flashcards available?</strong><br>Yes, we offer ink-friendly printable insect cards for offline nature walks in the Parents Corner.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>कीट लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>हमारे कीट लर्निंग फ्लैशकार्ड के साथ सुरक्षित रूप से सूक्ष्म दुनिया का अन्वेषण करें! यह मज़ेदार डिजिटल टूल बच्चों को कीड़ों से जुड़े डर को वैज्ञानिक जिज्ञासा में बदल देता है, जिससे वे टैप करके दोस्ताना कीड़ों के नाम सीख सकते हैं।</p>
                <p><strong>सीखने के परिणाम:</strong> वैज्ञानिक जिज्ञासा, पिछवाड़े की शब्दावली, श्रवण प्रसंस्करण, और क्षेत्रीय प्रकृति शब्दावली।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>छोटे बच्चों के लिए कीड़े डरावने हो सकते हैं। उन्हें चमकीले, मैत्रीपूर्ण फ्लैशकार्ड के रूप में प्रस्तुत करके जो टैप करने पर पॉप अप होते हैं, हम बच्चे को उनके सीखने के माहौल पर पूर्ण नियंत्रण देते हैं। यह मैक्रो-दृश्य उन्हें सुरक्षित रूप से एक चींटी के पैरों को गिनने या तितली के रंगीन पंखों का निरीक्षण करने की अनुमति देता है, जिससे प्रारंभिक वैज्ञानिक अवलोकन को बढ़ावा मिलता है।</p>
                        <p>हमारे अंग्रेजी, हिंदी और मराठी ऑडियो डिक्शनरी के साथ मिलकर, यह गतिविधि व्यावहारिक शब्दावली का निर्माण करती है। तितली पॉप-अप के साथ बातचीत करने वाला बच्चा एक साथ क्षेत्रीय शब्द 'फुलपाखरू' (Phulpakhru) के साथ-साथ अंग्रेजी शब्द को भी सीखेगा, जिससे उनकी दैनिक संवादात्मक भाषा समृद्ध होगी।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>बच्चों के लिए डिजिटल फ्लैशकार्ड क्यों प्रभावी हैं?</strong><br>वे "कारण और प्रभाव" पेश करते हैं। बच्चा सीखता है कि उनकी शारीरिक क्रिया (टैपिंग) से एक विशिष्ट इनाम (एक मज़ेदार पॉप-अप और आवाज़) मिलता है, जिससे वे अत्यधिक व्यस्त रहते हैं।</p>
                        <p><strong>क्या प्रिंट करने योग्य बग फ्लैशकार्ड उपलब्ध हैं?</strong><br>हाँ, हम पेरेंट्स कॉर्नर में ऑफ़लाइन प्रकृति की सैर के लिए स्याही-अनुकूल प्रिंट करने योग्य कीट कार्ड प्रदान करते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>कीटक लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>आमच्या कीटक लर्निंग फ्लॅशकार्ड्ससह सूक्ष्म जग सुरक्षितपणे एक्सप्लोर करा! हे मजेशीर डिजिटल साधन कीटकांशी संबंधित भीतीची जागा वैज्ञानिक कुतूहलाने घेते, ज्यामुळे लहान मुलांना टॅप करून, पॉप अप करून बागेतील अनुकूल कीटकांची नावे शिकता येतात.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> वैज्ञानिक कुतूहल, बागेतील शब्दसंग्रह, श्रवण प्रक्रिया आणि प्रादेशिक निसर्ग संज्ञा.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>लहान मुलांसाठी कीटक भीतीदायक असू शकतात. त्यांना टॅप केल्यावर पॉप अप होणाऱ्या चमकदार, अनुकूल फ्लॅशकार्ड्सच्या रूपात सादर करून, आम्ही मुलाला त्यांच्या शिकण्याच्या वातावरणावर पूर्ण नियंत्रण देतो. हे मॅक्रो-दृश्य त्यांना सुरक्षितपणे मुंगीचे पाय मोजण्यास किंवा फुलपाखराच्या रंगीबेरंगी पंखांचे निरीक्षण करण्यास अनुमती देते, ज्यामुळे प्रारंभिक वैज्ञानिक निरीक्षणाला चालना मिळते.</p>
                        <p>आमच्या इंग्रजी, हिंदी आणि मराठी ऑडिओ डिक्शनरीसह एकत्रित केलेली ही ऍक्टिव्हिटी व्यावहारिक शब्दसंग्रह तयार करते. फुलपाखराच्या पॉप-अपशी संवाद साधणारे मूल प्रादेशिक शब्द 'फुलपाखरू' (Phulpakhru) सोबत इंग्रजी शब्द एकाच वेळी ग्रहण करेल, ज्यामुळे त्यांची दैनंदिन संवादाची भाषा समृद्ध होईल.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>लहान मुलांसाठी डिजिटल फ्लॅशकार्ड का प्रभावी आहेत?</strong><br>ते "कारण आणि परिणाम" ओळख करून देतात. मूल शिकते की त्यांच्या शारीरिक कृतीमुळे (टॅपिंग) एक विशिष्ट बक्षीस (मजेदार पॉप-अप आणि आवाज) मिळते, ज्यामुळे ते व्यस्त राहतात.</p>
                        <p><strong>प्रिंट करण्यायोग्य कीटकांचे फ्लॅशकार्ड उपलब्ध आहेत का?</strong><br>होय, आम्ही पेरेंट्स कॉर्नरमध्ये ऑफलाइन निसर्ग भ्रमंतीसाठी शाई-अनुकूल प्रिंट करण्यायोग्य कीटक कार्ड देतो.</p>
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

    const insectDict = {
        "ant": { en: "Ant", hi: "चींटी", mr: "मुंगी" },
        "bee": { en: "Bee", hi: "मधुमक्खी", mr: "मधमाशी" },
        "butterfly": { en: "Butterfly", hi: "तितली", mr: "फुलपाखरू" },
        "mosquito": { en: "Mosquito", hi: "मच्छर", mr: "डास" },
        "housefly": { en: "Housefly", hi: "मक्खी", mr: "माशी" },
        "dragonfly": { en: "Dragonfly", hi: "ड्रैगनफ्लाई", mr: "चतुर" },
        "grasshopper": { en: "Grasshopper", hi: "टिड्डा", mr: "नाकतोडा" },
        "cricket": { en: "Cricket", hi: "झींगुर", mr: "रातकिडा" },
        "ladybug": { en: "Ladybug", hi: "लेडीबग", mr: "सोनकिडा" },
        "termite": { en: "Termite", hi: "दीमक", mr: "वाळवी" },
        "beetle": { en: "Beetle", hi: "भृंग", mr: "भुंगा" },
        "moth": { en: "Moth", hi: "पतंगा", mr: "पतंग" },
        "firefly": { en: "Firefly", hi: "जुगनू", mr: "काजवा" },
        "wasp": { en: "Wasp", hi: "ततैया", mr: "गांधीलमाशी" },
        "hornet": { en: "Hornet", hi: "हॉर्नेट", mr: "मोठी गांधीलमाशी" },
        "weevil": { en: "Weevil", hi: "घुन", mr: "सोंड्या कीटक" },
        "aphid": { en: "Aphid", hi: "माहू", mr: "मावा" },
        "caterpillar": { en: "Caterpillar", hi: "इल्ली", mr: "सुरवंट" },
        "leafhopper": { en: "Leafhopper", hi: "फुदका", mr: "तुडतुडे" },
        "planthopper": { en: "Planthopper", hi: "प्लांटहॉपर", mr: "प्लांटहॉपर" },
        "mantis": { en: "Mantis", hi: "मैंटिस", mr: "मँटिस" },
        "stick insect": { en: "Stick Insect", hi: "लकड़ी कीड़ा", mr: "काडीकिडा" },
        "water strider": { en: "Water Strider", hi: "वाटर स्ट्राइडर", mr: "पाणकिडा" },
        "dung beetle": { en: "Dung Beetle", hi: "गोबरैला", mr: "शेणकिडा" },
        "carpenter ant": { en: "Carpenter Ant", hi: "बढ़ई चींटी", mr: "सुतार मुंगी" },
        "red ant": { en: "Red Ant", hi: "लाल चींटी", mr: "लाल मुंगी" },
        "silkworm": { en: "Silkworm", hi: "रेशम का कीड़ा", mr: "रेशीम कीटक" },
        "lacewing": { en: "Lacewing", hi: "लेसविंग", mr: "लेसविंग" },
        "bumblebee": { en: "Bumblebee", hi: "भौंरा", mr: "बंबलबी" },
        "fruit fly": { en: "Fruit Fly", hi: "फल मक्खी", mr: "फळमाशी" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const insects = Object.keys(insectDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("insectGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    insects.forEach(name => {
      const img = new Image();
      img.src = `images/insects/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/insects/${name}.mp3`;
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

      insects.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = insectDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showInsect(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= insects.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showInsect(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = insectDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('insectsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});