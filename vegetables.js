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
    let currentLang = sessionStorage.getItem('vegetablesPageLang') || globalLang;

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
                sessionStorage.setItem('vegetablesPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🫛 Learn Vegetables", hi: "🫛 सब्जियां सीखें", mr: "🫛 भाज्या शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Vegetable Activities", hi: "सब्जी गतिविधियां", mr: "भाजी ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Vegetables", hi: "➡ अगली सब्जियां", mr: "➡ पुढील भाज्या" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: `
                <h2>About The Vegetable Learning Flashcards</h2>
                <p>Get healthy with KidsFunLearnHub's Vegetable Learning Flashcards! This engaging educational tool introduces preschoolers to essential daily greens. Tapping a vegetable reveals a large pop-up image and plays a crisp audio pronunciation.</p>
                <p><strong>Learning Outcomes:</strong> Practical kitchen vocabulary, plant categorization, auditory learning, and regional food terminology.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Vegetables can sometimes cause mealtime anxiety for toddlers. This flashcard game removes the intimidation factor by allowing children to explore veggies in a fun, low-pressure digital environment. The isolated pop-up images help them clearly identify the unique shapes of broccoli, carrots, and tomatoes, building visual familiarity before mealtime.</p>
                        <p>Because vegetables are a daily staple in Indian households, learning their regional names is incredibly practical. This module provides flawless audio cues in Hindi and Marathi, ensuring kids learn daily conversational words like 'Batata' (बटाटा) or 'Kanda' (कांदा) right alongside their English equivalents.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Is this suitable for picky eaters?</strong><br>Yes! Exposure is the first step to acceptance. Engaging with digital vegetables makes them recognizable and less scary for picky toddlers.</p>
                        <p><strong>Do you have printable vegetable flashcards?</strong><br>Yes, our Parents Corner features completely free vegetable flashcards and tracing pages.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>सब्जी लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>KidsFunLearnHub के सब्जी लर्निंग फ्लैशकार्ड के साथ स्वस्थ हो जाएं! यह आकर्षक शैक्षिक उपकरण बच्चों को आवश्यक दैनिक हरी सब्जियों से परिचित कराता है। एक सब्जी को टैप करने से एक बड़ी पॉप-अप छवि दिखाई देती है और एक कुरकुरा ऑडियो उच्चारण चलता है।</p>
                <p><strong>सीखने के परिणाम:</strong> व्यावहारिक रसोई शब्दावली, पौधों का वर्गीकरण, श्रवण शिक्षा, और क्षेत्रीय भोजन शब्दावली।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>सब्जियां कभी-कभी बच्चों के लिए भोजन के समय चिंता का कारण बन सकती हैं। यह फ्लैशकार्ड गेम बच्चों को एक मज़ेदार, कम दबाव वाले डिजिटल वातावरण में सब्जियों का पता लगाने की अनुमति देकर डराने वाले कारक को दूर करता है। अलग-अलग पॉप-अप छवियां उन्हें ब्रोकोली, गाजर और टमाटर के अनूठे आकार को स्पष्ट रूप से पहचानने में मदद करती हैं, जिससे भोजन के समय से पहले दृश्य परिचितता बनती है।</p>
                        <p>चूंकि सब्जियां भारतीय घरों में एक दैनिक प्रधान हैं, इसलिए उनके क्षेत्रीय नाम सीखना अविश्वसनीय रूप से व्यावहारिक है। यह मॉड्यूल हिंदी और मराठी में दोषरहित ऑडियो संकेत प्रदान करता है, यह सुनिश्चित करते हुए कि बच्चे अपने अंग्रेजी समकक्षों के साथ-साथ 'बटाटा' (Batata) या 'कांदा' (Kanda) जैसे दैनिक संवादात्मक शब्द सीखें।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या यह नखरेबाज़ खाने वालों के लिए उपयुक्त है?</strong><br>हाँ! एक्सपोज़र स्वीकृति की दिशा में पहला कदम है। डिजिटल सब्जियों के साथ जुड़ने से वे पहचाने जाने योग्य हो जाती हैं और नखरेबाज़ बच्चों के लिए कम डरावनी लगती हैं।</p>
                        <p><strong>क्या आपके पास प्रिंट करने योग्य सब्जी फ्लैशकार्ड हैं?</strong><br>हाँ, हमारे पेरेंट्स कॉर्नर में पूरी तरह से मुफ्त सब्जी फ्लैशकार्ड और ट्रेसिंग पेज उपलब्ध हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>भाज्या लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>KidsFunLearnHub च्या भाज्या लर्निंग फ्लॅशकार्ड्ससह निरोगी राहा! हे आकर्षक शैक्षणिक साधन लहान मुलांना आवश्यक रोजच्या हिरव्या भाज्यांची ओळख करून देते. भाजीवर टॅप केल्यावर एक मोठी पॉप-अप प्रतिमा उघडते आणि एक स्पष्ट ऑडिओ उच्चार ऐकू येतो.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> व्यावहारिक स्वयंपाकघरातील शब्दसंग्रह, वनस्पतींचे वर्गीकरण, श्रवण शिक्षण आणि प्रादेशिक अन्न संज्ञा.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>भाज्यांमुळे कधीकधी लहान मुलांमध्ये जेवणाच्या वेळी चिंता निर्माण होऊ शकते. हा फ्लॅशकार्ड गेम मुलांना मजेदार, कमी दबावाच्या डिजिटल वातावरणात भाज्या एक्सप्लोर करू देऊन भीती दूर करतो. वेगळ्या पॉप-अप प्रतिमा त्यांना ब्रोकोली, गाजर आणि टोमॅटोचे अनोखे आकार स्पष्टपणे ओळखण्यास मदत करतात, ज्यामुळे जेवणाच्या वेळेपूर्वी भाज्यांची दृश्य ओळख निर्माण होते.</p>
                        <p>भारतीय घरांमध्ये भाज्या हा रोजचा मुख्य आहार असल्यामुळे, त्यांची प्रादेशिक नावे शिकणे अतिशय व्यावहारिक आहे. हे मॉड्यूल हिंदी आणि मराठीमध्ये निर्दोष ऑडिओ संकेत प्रदान करते, ज्यामुळे मुले त्यांच्या इंग्रजी शब्दांसोबत 'बटाटा' (Batata) किंवा 'कांदा' (Kanda) यांसारखे रोजचे संवादाचे शब्द शिकतात.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>हे खाण्यासाठी नखरे करणाऱ्या मुलांसाठी योग्य आहे का?</strong><br>होय! एक्सपोजर ही स्वीकृतीची पहिली पायरी आहे. डिजिटल भाज्यांसोबत गुंतल्याने त्या ओळखीच्या होतात आणि नखरे करणाऱ्या मुलांसाठी कमी भीतीदायक वाटतात.</p>
                        <p><strong>तुमच्याकडे प्रिंट करण्यायोग्य भाज्यांचे फ्लॅशकार्ड आहेत का?</strong><br>होय, आमच्या पेरेंट्स कॉर्नरमध्ये पूर्णपणे मोफत भाज्यांचे फ्लॅशकार्ड आणि ट्रेसिंग पृष्ठे उपलब्ध आहेत.</p>
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

    const vegetableDict = {
        "potato": { en: "Potato", hi: "आलू", mr: "बटाटा" },
        "tomato": { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
        "onion": { en: "Onion", hi: "प्याज", mr: "कांदा" },
        "carrot": { en: "Carrot", hi: "गाजर", mr: "गाजर" },
        "brinjal": { en: "Brinjal", hi: "बैंगन", mr: "वांगी" },
        "cabbage": { en: "Cabbage", hi: "पत्ता गोभी", mr: "कोबी" },
        "cauliflower": { en: "Cauliflower", hi: "फूल गोभी", mr: "फ्लॉवर" },
        "peas": { en: "Peas", hi: "मटर", mr: "वाटाणा" },
        "spinach": { en: "Spinach", hi: "पालक", mr: "पालक" },
        "okra": { en: "Okra", hi: "भिंडी", mr: "भेंडी" },
        "bottle gourd": { en: "Bottle Gourd", hi: "लौकी", mr: "दुधी भोपळा" },
        "ridge gourd": { en: "Ridge Gourd", hi: "तोरई", mr: "दोडका" },
        "bitter gourd": { en: "Bitter Gourd", hi: "करेला", mr: "कारले" },
        "pumpkin": { en: "Pumpkin", hi: "कद्दू", mr: "भोपळा" },
        "radish": { en: "Radish", hi: "मूली", mr: "मुळा" },
        "beetroot": { en: "Beetroot", hi: "चुकंदर", mr: "बीटरूट" },
        "capsicum": { en: "Capsicum", hi: "शिमला मिर्च", mr: "ढोबळी मिरची" },
        "cucumber": { en: "Cucumber", hi: "खीरा", mr: "काकडी" },
        "beans": { en: "Beans", hi: "बीन्स", mr: "फरसबी" },
        "turnip": { en: "Turnip", hi: "शलजम", mr: "सलगम" },
        "drumstick": { en: "Drumstick", hi: "सहजन", mr: "शेवगा" },
        "ivy gourd": { en: "Ivy Gourd", hi: "कुंदरू", mr: "तोंडली" },
        "cluster beans": { en: "Cluster Beans", hi: "ग्वार फली", mr: "गवार" },
        "fenugreek": { en: "Fenugreek", hi: "मेथी", mr: "मेथी" },
        "mustard greens": { en: "Mustard Greens", hi: "सरसों का साग", mr: "मोहरीची पाने" },
        "colocasia": { en: "Colocasia", hi: "अरबी", mr: "अळू" },
        "ash gourd": { en: "Ash Gourd", hi: "पेठा", mr: "कोहळा" },
        "snake gourd": { en: "Snake Gourd", hi: "चिचिंडा", mr: "पडवळ" },
        "raw banana": { en: "Raw Banana", hi: "कच्चा केला", mr: "कच्ची केळी" },
        "sweet potato": { en: "Sweet Potato", hi: "शकरकंद", mr: "रताळे" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const vegetables = Object.keys(vegetableDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("vegetableGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    vegetables.forEach(name => {
      const img = new Image();
      img.src = `images/vegetables/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/vegetables/${name}.mp3`;
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

      vegetables.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = vegetableDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showVegetable(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= vegetables.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showVegetable(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = vegetableDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('vegetablesPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});