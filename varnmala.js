"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // uiLang controls the buttons and descriptions
    let uiLang = localStorage.getItem('mySecretLanguage') || 'en';
    
    // contentLang controls the sounds and popup text (defaults to Hindi if English is selected)
    let contentLang = (uiLang === 'en') ? 'hi' : uiLang;

    const uiDictionary = {
        "page-title": { en: "अ Learn Varnamala", hi: "अ वर्णमाला सीखें", mr: "अ वर्णमाला शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "btn-vyanjan": { en: "➡ Show Vyanjan", hi: "➡ व्यंजन देखें", mr: "➡ व्यंजन पहा" },
        "btn-swar": { en: "⬅ Show Swar", hi: "⬅ स्वर देखें", mr: "⬅ स्वर पहा" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "traceBtn": { en: "Varnamala Tracing", hi: "वर्णमाला ट्रेसिंग", mr: "वर्णमाला ट्रेसिंग" },
        "activitiesBtn": { en: "Varnamala Activities", hi: "वर्णमाला गतिविधियां", mr: "वर्णमाला ऍक्टिव्हिटीज" },
        "closePopupBtn": { en: "Close ✖", hi: "बंद करें ✖", mr: "बंद करा ✖" },
        "seoText": {
            en: `
                <h2>About The Interactive Varnamala Zone</h2>
                <p>Welcome to the KidsFunLearnHub Varnamala Zone! This interactive digital board is the perfect way to introduce the Devanagari script. Tap on any Swar (vowel) or Vyanjan (consonant) to see it come to life with a vibrant pop-up image and hear its native pronunciation.</p>
                <p><strong>Learning Outcomes:</strong> Devanagari script recognition, phonetic awareness, bilingual vocabulary, and early reading skills.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Learning the Devanagari script is an essential step for reading Hindi and Marathi. By isolating each letter with a large, distraction-free pop-up, children can easily study the unique curves and top-lines (Shirekha) of the characters. This visual isolation drastically improves character retention compared to looking at a crowded alphabet chart.</p>
                        <p>The instant auditory feedback reinforces this learning. Tapping 'क' (Ka) reveals a relatable object like a pigeon or lotus, bridging the gap between abstract letters and real-world vocabulary. Hearing the native pronunciation while seeing the character ensures a strong phonetic foundation for bilingual households.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Does this cover both Hindi and Marathi?</strong><br>Yes! The core Devanagari script is shared, and our vocabulary words are carefully selected to reflect common, easily recognizable terms used in both languages.</p>
                        <p><strong>Are offline worksheets available?</strong><br>Absolutely! You can download free Varnamala flashcards and tracing sheets in the Parents Corner for handwriting practice.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>इंटरएक्टिव वर्णमाला ज़ोन के बारे में</h2>
                <p>KidsFunLearnHub वर्णमाला ज़ोन में आपका स्वागत है! यह इंटरएक्टिव डिजिटल बोर्ड देवनागरी लिपि पेश करने का सही तरीका है। किसी भी स्वर या व्यंजन पर टैप करके उसे एक जीवंत पॉप-अप छवि के साथ जीवंत होते हुए देखें और उसका मूल उच्चारण सुनें।</p>
                <p><strong>सीखने के परिणाम:</strong> देवनागरी लिपि की पहचान, ध्वन्यात्मक जागरूकता, द्विभाषी शब्दावली, और प्रारंभिक पठन कौशल।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>हिंदी और मराठी पढ़ने के लिए देवनागरी लिपि सीखना एक आवश्यक कदम है। प्रत्येक अक्षर को एक बड़े, विकर्षण-मुक्त पॉप-अप के साथ अलग करके, बच्चे आसानी से अक्षरों के अनूठे घुमाव और शिरोरेखा का अध्ययन कर सकते हैं। यह दृश्य अलगाव एक भीड़-भाड़ वाले वर्णमाला चार्ट को देखने की तुलना में अक्षर प्रतिधारण में काफी सुधार करता है।</p>
                        <p>तत्काल श्रवण प्रतिक्रिया इस सीखने को सुदृढ़ करती है। 'क' पर टैप करने से कबूतर या कमल जैसी एक प्रासंगिक वस्तु का पता चलता है, जो अमूर्त अक्षरों और वास्तविक दुनिया की शब्दावली के बीच की दूरी को पाटता है। चरित्र को देखते हुए मूल उच्चारण सुनना द्विभाषी घरों के लिए एक मजबूत ध्वन्यात्मक आधार सुनिश्चित करता है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या इसमें हिंदी और मराठी दोनों शामिल हैं?</strong><br>हाँ! मूल देवनागरी लिपि साझा की जाती है, और हमारे शब्दावली शब्दों को दोनों भाषाओं में उपयोग किए जाने वाले सामान्य, आसानी से पहचाने जाने वाले शब्दों को दर्शाने के लिए सावधानीपूर्वक चुना जाता है।</p>
                        <p><strong>क्या ऑफ़लाइन वर्कशीट उपलब्ध हैं?</strong><br>बिल्कुल! आप लिखावट के अभ्यास के लिए पेरेंट्स कॉर्नर में मुफ्त वर्णमाला फ्लैशकार्ड और ट्रेसिंग शीट डाउनलोड कर सकते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>इंटरएक्टिव वर्णमाला झोनबद्दल</h2>
                <p>KidsFunLearnHub वर्णमाला झोनमध्ये आपले स्वागत आहे! हे इंटरएक्टिव्ह डिजिटल बोर्ड देवनागरी लिपीची ओळख करून देण्याचा एक उत्तम मार्ग आहे. कोणत्याही स्वर किंवा व्यंजनावर टॅप करा आणि एका आकर्षक पॉप-अप प्रतिमेसह ते जिवंत होताना पहा आणि त्याचे मूळ उच्चारण ऐका.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> देवनागरी लिपीची ओळख, ध्वन्यात्मक जागरूकता, द्विभाषिक शब्दसंग्रह आणि प्रारंभिक वाचन कौशल्ये.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>हिंदी आणि मराठी वाचण्यासाठी देवनागरी लिपी शिकणे ही एक आवश्यक पायरी आहे. प्रत्येक अक्षर एका मोठ्या, विचलित न करणाऱ्या पॉप-अपसह वेगळे करून, मुले अक्षरांचे अनोखे वक्र आणि शिरोरेषा यांचा सहज अभ्यास करू शकतात. अक्षरांच्या गर्दी असलेल्या तक्त्याकडे पाहण्याच्या तुलनेत हे दृश्य अलगाव अक्षरे लक्षात ठेवण्याची क्षमता लक्षणीयरीत्या सुधारते.</p>
                        <p>त्वरित ऑडिओ प्रतिसाद या शिक्षणाला बळकटी देतो. 'क' वर टॅप केल्याने कबूतर किंवा कमळासारखी संबंधित वस्तू समोर येते, जी अमूर्त अक्षरे आणि वास्तविक जगातील शब्दसंग्रह यातील दरी कमी करते. अक्षर पाहताना मूळ उच्चार ऐकणे द्विभाषिक कुटुंबांसाठी एक मजबूत ध्वन्यात्मक पाया सुनिश्चित करते.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>यामध्ये हिंदी आणि मराठी दोन्ही समाविष्ट आहेत का?</strong><br>होय! मूळ देवनागरी लिपी सामायिक केली जाते, आणि आमचे शब्दसंग्रह दोन्ही भाषांमध्ये वापरल्या जाणाऱ्या सामान्य, सहज ओळखता येण्याजोग्या शब्दांना प्रतिबिंबित करण्यासाठी काळजीपूर्वक निवडले आहेत.</p>
                        <p><strong>ऑफलाइन वर्कशीट्स उपलब्ध आहेत का?</strong><br>नक्कीच! तुम्ही हस्ताक्षराच्या सरावासाठी पेरेंट्स कॉर्नरमध्ये मोफत वर्णमाला फ्लॅशकार्ड्स आणि ट्रेसिंग शीट्स डाउनलोड करू शकता.</p>
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

    // 2. SWAR DICTIONARY (Vowels)
    const swarDict = {
        "a": { hi: "अ - अनार", mr: "अ - अननस" },
        "aa": { hi: "आ - आम", mr: "आ - आई" },
        "i": { hi: "इ - इमली", mr: "इ - इमारत" },
        "ee": { hi: "ई - ईख", mr: "ई - इडलिंबू" },
        "u": { hi: "उ - उल्लू", mr: "उ - उखळ" },
        "oo": { hi: "ऊ - ऊन", mr: "ऊ - ऊस" },
        "ri": { hi: "ऋ - ऋषि", mr: "ऋ - ऋषी" },
        "e": { hi: "ए - एड़ी", mr: "ए - एक" },
        "ai": { hi: "ऐ - ऐनक", mr: "ऐ - ऐरण" },
        "o": { hi: "ओ - ओखली", mr: "ओ - ओझेवाला" },
        "au": { hi: "औ - औरत", mr: "औ - औषध" },
        "ang": { hi: "अं - अंगूर", mr: "अं - अंजीर" },
        "aha": { hi: "अः - प्रातः", mr: "अः - स्वतः" }
    };

    // 3. VYANJAN DICTIONARY (Consonants)
    const vyanjanDict = {
        "k": { hi: "क - कबूतर", mr: "क - कमळ" },
        "kh": { hi: "ख - खरगोश", mr: "ख - खडू" },
        "g": { hi: "ग - गमला", mr: "ग - गणपती" },
        "gh": { hi: "घ - घर", mr: "घ - घर" },
        "dn": { hi: "ङ", mr: "ङ" },
        "ch": { hi: "च - चम्मच", mr: "च - चमचा" },
        "chh": { hi: "छ - छतरी", mr: "छ - छत्री" },
        "j": { hi: "ज - जग", mr: "ज - जहाज" },
        "jh": { hi: "झ - झंडा", mr: "झ - झेंडा" },
        "trh": { hi: "ञ", mr: "ञ" },
        "t1": { hi: "ट - टमाटर", mr: "ट - टरबूज" }, 
        "th1": { hi: "ठ - ठठेरा", mr: "ठ - ठसा" },
        "d1": { hi: "ड - डमरू", mr: "ड - डबा" },
        "dh1": { hi: "ढ - ढक्कन", mr: "ढ - ढग" },
        "n1": { hi: "ण - बाण", mr: "ण - बाण" },
        "t2": { hi: "त - तरबूज", mr: "त - तलवार" }, 
        "th2": { hi: "थ - थर्मस", mr: "थ - थवा" },
        "d2": { hi: "द - दवात", mr: "द - दप्तर" },
        "dh2": { hi: "ध - धनुष", mr: "ध - धनुष्य" },
        "n2": { hi: "न - नल", mr: "न - नळ" },
        "p": { hi: "प - पतंग", mr: "प - पतंग" },
        "ph": { hi: "फ - फल", mr: "फ - फणस" },
        "b": { hi: "ब - बस", mr: "ब - बदक" },
        "bh": { hi: "भ - भालू", mr: "भ - भटजी" },
        "m": { hi: "म - मछली", mr: "म - मगर" },
        "y": { hi: "य - यज्ञ", mr: "य - यज्ञ" },
        "r": { hi: "र - रथ", mr: "र - रथ" },
        "l": { hi: "ल - लट्टू", mr: "ल - लसूण" },
        "v": { hi: "व - वन", mr: "व - वजन" },
        "sh": { hi: "श - शलगम", mr: "श - शहामृग" },
        "shh": { hi: "ष - षट्कोण", mr: "ष - षटकोन" },
        "s": { hi: "स - सेब", mr: "स - ससा" },
        "h": { hi: "ह - हाथी", mr: "ह - हत्ती" },
        "ksh": { hi: "क्ष - क्षत्रिय", mr: "क्ष - क्षत्रिय" },
        "tr": { hi: "त्र - त्रिशूल", mr: "त्र - त्रिशूळ" },
        "gy": { hi: "ज्ञ - ज्ञानी", mr: "ज्ञ - ज्ञानी" }
    };

    const allLettersDict = { ...swarDict, ...vyanjanDict };

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("varnamalaGrid");
    const popup = document.getElementById("popup");
    const popupImgLetter = document.getElementById("popupImgLetter");
    const popupImgWord = document.getElementById("popupImgWord");
    const popupName = document.getElementById("popupName");
    const toggleBtn = document.getElementById("toggleBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");

    // Apply text translations using innerHTML to keep bold tags
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][uiLang];
    }

    let currentMode = "swar"; // Starts with Swar

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE
    /////////////////////////////////////////////////

    const imageCacheLetters = {};
    const imageCacheWords = {};
    const soundCache = {};

    Object.keys(allLettersDict).forEach(name => {
      const imgLetter = new Image();
      imgLetter.src = `images/varnamala/letters/${name}.webp`;
      imageCacheLetters[name] = imgLetter;

      const imgWord = new Image();
      imgWord.src = `images/varnamala/words/${contentLang}/${name}.webp`; 
      imageCacheWords[name] = imgWord;

      const audio = new Audio();
      audio.src = `sounds/${contentLang}/varnamala/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadGrid() {
      if (!grid) return;
      grid.innerHTML = "";
      
      const activeDict = currentMode === "swar" ? swarDict : vyanjanDict;

      Object.keys(activeDict).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        // Main grid shows only the Letter Image
        card.innerHTML = `
          <img src="${imageCacheLetters[name].src}" alt="${name}">
        `;

        card.onclick = () => showLetter(name);
        grid.appendChild(card);
      });

      // Update toggle button text dynamically
      if (currentMode === "swar") {
          toggleBtn.innerHTML = uiDictionary["btn-vyanjan"][uiLang];
      } else {
          toggleBtn.innerHTML = uiDictionary["btn-swar"][uiLang];
      }
    }

    /////////////////////////////////////////////////
    // TOGGLE BUTTON LOGIC
    /////////////////////////////////////////////////

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            currentMode = currentMode === "swar" ? "vyanjan" : "swar";
            loadGrid();
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY (TWO IMAGES)
    /////////////////////////////////////////////////

    function showLetter(name) {
      if (popupImgLetter) popupImgLetter.src = imageCacheLetters[name].src;
      if (popupImgWord) popupImgWord.src = imageCacheWords[name].src;
      if (popupName) popupName.textContent = allLettersDict[name][contentLang]; // Falls back to Hindi if English
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    function closePopup() {
        if (popup) popup.classList.add("hidden");
    }

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
    loadGrid();
};