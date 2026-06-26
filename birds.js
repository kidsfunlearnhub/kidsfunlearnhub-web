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
    let currentLang = sessionStorage.getItem('birdsPageLang') || globalLang;

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
                sessionStorage.setItem('birdsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🦚 Learn Birds", hi: "🦚 पक्षी सीखें", mr: "🦚 पक्षी शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Bird Activities", hi: "पक्षी गतिविधियां", mr: "पक्षी ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Birds", hi: "➡ अगले पक्षी", mr: "➡ पुढील पक्षी" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: `
                <h2>About The Bird Learning Flashcards</h2>
                <p>Take flight with the Bird Learning Flashcards! This engaging educational tool invites preschoolers to explore the avian world. Tapping any bird reveals a beautiful, up-close pop-up image accompanied by a clear voice pronouncing its name.</p>
                <p><strong>Learning Outcomes:</strong> Nature observation, avian vocabulary, pronunciation clarity, and bilingual environmental awareness.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Birds share many similar characteristics, making them tricky for toddlers to differentiate. Our interactive pop-up mechanic isolates each bird—from the grand peacock to the tiny sparrow—allowing children to study distinct feather patterns and beak shapes without background clutter. This builds excellent visual discrimination skills.</p>
                        <p>Because children see birds every day, localizing this vocabulary is essential. Our platform provides precise Devanagari audio support. When the pop-up opens, a child can hear the English name alongside regional terms like 'Popat' (पोपट) for parrot and 'Mor' (मोर) for peacock, creating a highly engaging, multilingual nature lesson.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Does the pop-up play bird sounds or human voices?</strong><br>To prioritize early reading and speech development, the audio plays clear human pronunciations of the bird's name in the selected language.</p>
                        <p><strong>Can I print these bird images for my classroom?</strong><br>Yes! You can download printable bird flashcards and coloring pages directly from our website.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>पक्षी लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>पक्षी लर्निंग फ्लैशकार्ड के साथ उड़ान भरें! यह आकर्षक शैक्षिक उपकरण बच्चों को पक्षियों की दुनिया का पता लगाने के लिए आमंत्रित करता है। किसी भी पक्षी को टैप करने से एक सुंदर, करीब से पॉप-अप छवि दिखाई देती है और उसका नाम बोलने वाली स्पष्ट आवाज़ आती है।</p>
                <p><strong>सीखने के परिणाम:</strong> प्रकृति अवलोकन, पक्षी शब्दावली, उच्चारण स्पष्टता, और द्विभाषी पर्यावरण जागरूकता।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>पक्षियों में कई समान विशेषताएं होती हैं, जिससे बच्चों के लिए उनके बीच अंतर करना मुश्किल हो जाता है। हमारा इंटरएक्टिव पॉप-अप तंत्र प्रत्येक पक्षी को अलग करता है—भव्य मोर से लेकर छोटी गौरैया तक—जिससे बच्चों को पृष्ठभूमि की अव्यवस्था के बिना विशिष्ट पंख पैटर्न और चोंच के आकार का अध्ययन करने की अनुमति मिलती है। यह उत्कृष्ट दृश्य भेदभाव कौशल का निर्माण करता है।</p>
                        <p>चूंकि बच्चे हर दिन पक्षियों को देखते हैं, इसलिए इस शब्दावली को स्थानीय बनाना आवश्यक है। हमारा प्लेटफॉर्म सटीक देवनागरी ऑडियो सहायता प्रदान करता है। जब पॉप-अप खुलता है, तो एक बच्चा तोते के लिए 'पोपट' (Popat) और मोर के लिए 'मोर' (Mor) जैसे क्षेत्रीय शब्दों के साथ अंग्रेजी नाम सुन सकता है, जिससे एक अत्यधिक आकर्षक, बहुभाषी प्रकृति पाठ तैयार होता है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या पॉप-अप में पक्षियों की आवाज़ या इंसानों की आवाज़ आती है?</strong><br>शुरुआती पढ़ने और वाक् विकास को प्राथमिकता देने के लिए, ऑडियो चयनित भाषा में पक्षी के नाम का स्पष्ट मानव उच्चारण बजाता है。</p>
                        <p><strong>क्या मैं अपनी कक्षा के लिए इन पक्षियों की छवियों को प्रिंट कर सकता हूँ?</strong><br>हाँ! आप सीधे हमारी वेबसाइट से प्रिंट करने योग्य पक्षी फ्लैशकार्ड और रंग पेज डाउनलोड कर सकते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>पक्षी लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>पक्षी लर्निंग फ्लॅशकार्ड्ससह भरारी घ्या! हे आकर्षक शैक्षणिक साधन लहान मुलांना पक्ष्यांचे जग शोधण्यासाठी आमंत्रित करते. कोणत्याही पक्ष्यावर टॅप केल्यावर एक सुंदर, जवळची पॉप-अप प्रतिमा आणि त्याचे नाव उच्चारलेला स्पष्ट आवाज उघड होतो.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> निसर्ग निरीक्षण, पक्षी शब्दसंग्रह, उच्चारण स्पष्टता आणि द्विभाषिक पर्यावरणीय जागरूकता.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>पक्ष्यांमध्ये अनेक समान वैशिष्ट्ये असतात, ज्यामुळे लहान मुलांना त्यांच्यात फरक करणे कठीण जाते. आमचे इंटरएक्टिव्ह पॉप-अप तंत्र प्रत्येक पक्ष्याला वेगळे करते—भव्य मोरापासून ते चिमुकल्या चिमणीपर्यंत—ज्यामुळे मुलांना पार्श्वभूमीतील गोंधळाशिवाय पंखांचे नमुने आणि चोचीच्या आकारांचा अभ्यास करता येतो. हे उत्कृष्ट दृश्य ओळख कौशल्य निर्माण करते.</p>
                        <p>मुले दररोज पक्षी पाहत असल्यामुळे, हा शब्दसंग्रह स्थानिक भाषेत शिकणे आवश्यक आहे. आमचे प्लॅटफॉर्म अचूक देवनागरी ऑडिओ सपोर्ट देते. जेव्हा पॉप-अप उघडतो, तेव्हा मूल पोपटासाठी 'पोपट' (Popat) आणि मोरासाठी 'मोर' (Mor) यांसारख्या प्रादेशिक शब्दांसह इंग्रजी नाव ऐकू शकते, ज्यामुळे एक अतिशय आकर्षक, बहुभाषिक निसर्ग धडा तयार होतो.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>पॉप-अपमध्ये पक्ष्यांचा आवाज येतो की मानवी आवाज?</strong><br>लवकर वाचणे आणि भाषणाचा विकास याला प्राधान्य देण्यासाठी, ऑडिओ निवडलेल्या भाषेत पक्ष्यांच्या नावाचे स्पष्ट मानवी उच्चारण वाजवतो.</p>
                        <p><strong>मी माझ्या वर्गासाठी या पक्ष्यांच्या प्रतिमा प्रिंट करू शकतो का?</strong><br>होय! तुम्ही थेट आमच्या वेबसाइटवरून प्रिंट करण्यायोग्य पक्ष्यांचे फ्लॅशकार्ड आणि कलरिंग पेज डाउनलोड करू शकता.</p>
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

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const birds = Object.keys(birdDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("birdGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

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
    // 4. BUILD PAGE GRID
    /////////////////////////////////////////////////
    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      birds.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = birdDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showBird(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

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
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showBird(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = birdDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('birdsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});