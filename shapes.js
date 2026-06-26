"use strict";

window.onload = function() {

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
    let currentLang = sessionStorage.getItem('shapesPageLang') || globalLang;

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
                // Save only to sessionStorage so it doesn't affect the rest of the site!
                sessionStorage.setItem('shapesPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🟢 Learn Shapes", hi: "🟢 आकार सीखें", mr: "🟢 आकार शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "traceBtn": { en: "✏️ Practice Tracing!", hi: "✏️ ट्रेसिंग का अभ्यास करें!", mr: "✏️ गिरवण्याचा सराव करा!" },
        "activitiesBtn": { en: "Shapes Activities", hi: "आकार गतिविधियां", mr: "आकार ऍक्टिव्हिटीज" },
        "closeHint": { en: "Tap anywhere to close ✖", hi: "बंद करने के लिए टैप करें ✖", mr: "बंद करण्यासाठी टॅप करा ✖" },
        "seoText": {
            en: `
                <h2>About The Interactive Geometry Zone</h2>
                <p>Welcome to the KidsFunLearnHub Geometry Zone! Tap on any basic 2D shape card and watch it magically transform into an object you see every day. This engaging visual activity helps toddlers bridge the gap between abstract geometry and the real world, building strong cognitive recognition and spatial awareness.</p>
                <p><strong>Learning Outcomes:</strong> Geometric shape identification, real-world object association, spatial reasoning, and multilingual vocabulary.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Understanding that everything in our physical world is constructed from basic shapes is a massive cognitive milestone. By tapping a plain circle and watching it transform into a real-world object like a clock or a wheel, children learn to identify geometric structures in their everyday environment. This interactive "shape-to-object" translation is a foundational skill for advanced spatial reasoning, early mathematics, and problem-solving.</p>
                        <p>We enhance this visual transformation with our signature trilingual audio system. When a shape morphs into an object, the child receives immediate, clear auditory feedback. Learning about a "Square" or a "Circle" in English is seamlessly paired with regional Hindi and Marathi equivalents, such as 'Chaukon' (चौकोन) or 'Gol' (गोल). This localized approach ensures that children can effectively communicate about the geometric shapes they discover in their own homes.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Why connect shapes to real-world objects?</strong><br>Abstract shapes can be difficult for toddlers to grasp on their own. Connecting a simple triangle to a slice of pizza or a roof gives the shape concrete meaning, making it much easier for young minds to memorize and recall.</p>
                        <p><strong>Can my child practice drawing these shapes?</strong><br>Yes! We offer free, high-quality printable shape tracing and object coloring worksheets in our Parents Corner so your child can practice their fine motor skills offline.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>इंटरएक्टिव जियोमेट्री ज़ोन के बारे में</h2>
                <p>KidsFunLearnHub के जियोमेट्री ज़ोन में आपका स्वागत है! किसी भी बुनियादी 2D आकार के कार्ड पर टैप करें और उसे जादुई रूप से एक ऐसी वस्तु में बदलते हुए देखें जिसे आप हर दिन देखते हैं। यह आकर्षक दृश्य गतिविधि बच्चों को अमूर्त ज्यामिति और वास्तविक दुनिया के बीच की दूरी को पाटने में मदद करती है, जिससे मजबूत संज्ञानात्मक पहचान और स्थानिक जागरूकता का निर्माण होता है।</p>
                <p><strong>सीखने के परिणाम:</strong> ज्यामितीय आकार की पहचान, वास्तविक दुनिया की वस्तु का जुड़ाव, स्थानिक तर्क, और बहुभाषी शब्दावली।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>यह समझना कि हमारी भौतिक दुनिया की हर चीज़ बुनियादी आकारों से बनी है, एक बड़ा मानसिक मील का पत्थर है। एक साधारण वृत्त पर टैप करके और उसे घड़ी या पहिये जैसी वास्तविक दुनिया की वस्तु में बदलते हुए देखकर, बच्चे अपने रोज़मर्रा के वातावरण में ज्यामितीय संरचनाओं की पहचान करना सीखते हैं। यह इंटरैक्टिव "आकार-से-वस्तु" अनुवाद उन्नत स्थानिक तर्क, प्रारंभिक गणित और समस्या-समाधान के लिए एक आधारभूत कौशल है।</p>
                        <p>हम हमारे सिग्नेचर त्रिभाषी ऑडियो सिस्टम के साथ इस दृश्य परिवर्तन को और बेहतर बनाते हैं। जब कोई आकार किसी वस्तु में बदलता है, तो बच्चे को तुरंत, स्पष्ट श्रवण प्रतिक्रिया मिलती है। अंग्रेजी में "Square" या "Circle" के बारे में सीखना क्षेत्रीय हिंदी और मराठी समकक्षों जैसे 'चौकोन' (Chaukon) या 'गोल' (Gol) के साथ सहजता से जुड़ा हुआ है। यह स्थानीय दृष्टिकोण यह सुनिश्चित करता है कि बच्चे अपने घरों में खोजे जाने वाले ज्यामितीय आकारों के बारे में प्रभावी ढंग से संवाद कर सकें।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>आकारों को वास्तविक दुनिया की वस्तुओं से क्यों जोड़ें?</strong><br>अमूर्त आकारों को छोटे बच्चों के लिए अपने दम पर समझना मुश्किल हो सकता है। एक साधारण त्रिकोण को पिज्जा के टुकड़े या छत से जोड़ने से आकार को एक ठोस अर्थ मिलता है, जिससे युवा दिमागों के लिए इसे याद रखना और याद करना बहुत आसान हो जाता है।</p>
                        <p><strong>क्या मेरा बच्चा इन आकारों को बनाने का अभ्यास कर सकता है?</strong><br>हाँ! हम अपने पेरेंट्स कॉर्नर में मुफ्त, उच्च गुणवत्ता वाले प्रिंट करने योग्य शेप ट्रेसिंग और ऑब्जेक्ट कलरिंग वर्कशीट प्रदान करते हैं ताकि आपका बच्चा ऑफ़लाइन अपने ठीक मोटर कौशल का अभ्यास कर सके।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>इंटरएक्टिव भूमिती (जिओमेट्री) झोनबद्दल</h2>
                <p>KidsFunLearnHub च्या जिओमेट्री झोनमध्ये आपले स्वागत आहे! कोणत्याही मूलभूत 2D आकाराच्या कार्डवर टॅप करा आणि ते जादुईपणे तुम्ही दररोज पाहत असलेल्या वस्तूंमध्ये बदलताना पहा. ही आकर्षक दृश्य ऍक्टिव्हिटी लहान मुलांना अमूर्त भूमिती आणि वास्तविक जग यातील फरक समजून घेण्यास मदत करते, ज्यामुळे मजबूत संज्ञानात्मक ओळख आणि अवकाशीय जागरूकता निर्माण होतेम्।</p>
                <p><strong>शिकण्याचे परिणाम:</strong> भूमितीय आकार ओळखणे, वास्तविक जगातील वस्तूंचा संबंध जोडणे, अवकाशीय तर्क आणि बहुभाषिक शब्दसंग्रह.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>आपल्या भौतिक जगातील प्रत्येक गोष्ट मूलभूत आकारांपासून तयार झाली आहे हे समजणे हा मुलाच्या वाढीतील एक मोठा टप्पा आहे. साध्या वर्तुळावर टॅप करून त्याचे घड्याळ किंवा चाकासारख्या वास्तविक जगातील वस्तूमध्ये रूपांतर होताना पाहून मुले त्यांच्या दैनंदिन वातावरणातील भूमितीय रचना ओळखायला शिकतात. हे इंटरएक्टिव्ह "आकार-ते-वस्तू" रूपांतर प्रगत अवकाशीय तर्क, प्रारंभिक गणित आणि समस्या सोडवण्यासाठी एक पायाभूत कौशल्य आहे.</p>
                        <p>आम्ही आमच्या सिग्नेचर त्रिभाषिक ऑडिओ सिस्टमसह हे व्हिज्युअल रूपांतर अधिक स्पष्ट करतो. जेव्हा एखादा आकार वस्तूमध्ये बदलतो, तेव्हा मुलाला त्वरित आणि स्पष्ट ऑडिओ प्रतिसाद मिळतो. इंग्रजीमध्ये "Square" किंवा "Circle" शिकताना त्याला प्रादेशिक हिंदी आणि मराठी शब्द जसे की 'चौकोन' (Chaukon) किंवा 'गोल' (Gol) ची जोड दिली जाते. या स्थानिक पद्धतीमुळे मुले त्यांच्या स्वतःच्या घरात आढळणाऱ्या भूमितीय आकारांबद्दल प्रभावीपणे बोलू शकतात.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>आकारांना वास्तविक जगातील वस्तूंशी का जोडावे?</strong><br>अमूर्त आकार लहान मुलांना स्वतःहून समजून घेणे कठीण असू शकते. एका साध्या त्रिकोणाला पिझ्झाच्या स्लाइसशी किंवा घराच्या छपराशी जोडल्याने आकाराला एक ठोस अर्थ मिळतो, ज्यामुळे लहान मुलांना ते लक्षात ठेवणे खूप सोपे जाते.</p>
                        <p><strong>माझे मूल हे आकार काढण्याचा सराव करू शकते का?</strong><br>होय! आम्ही आमच्या पेरेंट्स कॉर्नरमध्ये मोफत, उच्च दर्जाचे प्रिंट करण्यायोग्य शेप ट्रेसिंग आणि ऑब्जेक्ट कलरिंग वर्कशीट्स देतो जेणेकरून तुमचे मूल ऑफलाइन त्यांच्या हाताच्या स्नायूंचा सराव करू शकेल.</p>
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

    // Apply translations using innerHTML to keep bold tags
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    // 3. SHAPES DICTIONARY
    const shapesDict = {
        "circle": { en: "Circle", hi: "वृत्त (गोल)", mr: "वर्तुळ (गोल)" },
        "square": { en: "Square", hi: "वर्ग (चौकोर)", mr: "चौरस (चौकोन)" },
        "triangle": { en: "Triangle", hi: "त्रिकोण", mr: "त्रिकोण" },
        "rectangle": { en: "Rectangle", hi: "आयत", mr: "आयत" },
        "star": { en: "Star", hi: "तारा", mr: "चांदणी" },
        "heart": { en: "Heart", hi: "दिल", mr: "हृदय" },
        "oval": { en: "Oval", hi: "अंडाकार", mr: "लंबवर्तुळ" },
        "diamond": { en: "Diamond", hi: "हीरा", mr: "समभुज चौकोन" },
        "pentagon": { en: "Pentagon", hi: "पंचभुज", mr: "पंचकोन" },
        "hexagon": { en: "Hexagon", hi: "षट्भुज", mr: "षटकोन" }
    };

    const shapesList = Object.keys(shapesDict);

    /////////////////////////////////////////////////
    // 4. ELEMENTS & CACHE
    /////////////////////////////////////////////////
    const grid = document.getElementById("shapesGrid");
    const popup = document.getElementById("popup");
    const popupImgShape = document.getElementById("popupImgShape");
    const popupImgObject = document.getElementById("popupImgObject");
    const popupName = document.getElementById("popupName");

    // Preload Images and Sounds
    const imageCacheBasic = {};
    const imageCacheObjects = {};
    const soundCache = {};

    shapesList.forEach(name => {
      const imgBasic = new Image();
      imgBasic.src = `images/shapes/basic/${name}.webp`;
      imageCacheBasic[name] = imgBasic;

      const imgObject = new Image();
      imgObject.src = `images/shapes/objects/${name}.webp`; 
      imageCacheObjects[name] = imgObject;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/shapes/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // 5. BUILD PAGE GRID
    /////////////////////////////////////////////////
    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      shapesList.forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", `Learn about ${name}`);

        card.innerHTML = `
          <img src="${imageCacheBasic[name].src}" alt="${name}">
          <p>${shapesDict[name][currentLang]}</p>
        `;

        card.onclick = () => showShape(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // 6. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    function showShape(name) {
      if (popupImgShape) popupImgShape.src = imageCacheBasic[name].src;
      if (popupImgObject) popupImgObject.src = imageCacheObjects[name].src;
      if (popupName) popupName.textContent = shapesDict[name][currentLang];
      
      if (popup) {
          popup.classList.remove("hidden");
          popup.style.display = "flex";
      }

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    function closePopup() {
        if (popup) {
            popup.classList.add("hidden");
            popup.style.display = "none";
        }
    }

    // Clicking absolutely ANYWHERE on the popup overlay or card will close it!
    if (popup) {
        popup.onclick = () => {
            closePopup();
        };
    }

    /////////////////////////////////////////////////
    // 7. CONFETTI & CLEANUP
    /////////////////////////////////////////////////
    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    const cleanupSession = () => sessionStorage.removeItem('shapesPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INITIALIZE
    loadPage();
};