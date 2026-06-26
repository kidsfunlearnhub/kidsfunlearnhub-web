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
    let currentLang = sessionStorage.getItem('colorsPageLang') || globalLang;

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
                sessionStorage.setItem('colorsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🌈 Learn Colours", hi: "🌈 रंग सीखें", mr: "🌈 रंग शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Colour Activities", hi: "रंग गतिविधियां", mr: "रंग ऍक्टिव्हिटीज" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "primary": { en: "Primary Colors", hi: "प्राथमिक रंग", mr: "प्राथमिक रंग" },
        "secondary": { en: "Secondary Colors", hi: "द्वितीयक रंग", mr: "दुय्यम रंग" },
        "neutral": { en: "Neutral Colors", hi: "तटस्थ रंग", mr: "तटस्थ रंग" },
        "advanced": { en: "Advanced Shades", hi: "उन्नत रंग", mr: "प्रगत छटा" },
        "seoText": {
            en: `
                <h2>About The Interactive Colour Studio</h2>
                <p>Welcome to the KidsFunLearnHub Colour Studio! This vibrant interactive activity helps early learners master color identification. Tap on any color card to reveal a bright, everyday object matching that hue and hear its exact name spoken aloud, making abstract colors easy to understand and remember.</p>
                <p><strong>Learning Outcomes:</strong> Color theory basics, visual categorization, auditory-visual association, and multilingual color vocabulary.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Understanding abstract concepts like "Red" or "Blue" can be tricky for toddlers until they are tied to real-world items. By tapping a red card and seeing it transform into a bright red apple or fire truck, children immediately grasp the concept of color categorization. This cause-and-effect digital flashcard mechanic grabs their attention and solidifies their visual identification skills without background distractions.</p>
                        <p>The visual learning is powerfully reinforced with our signature trilingual audio system. When the colorful object pops up, the child receives immediate auditory feedback. Learning that "Yellow" is seamlessly connected to 'Pivla' (पिवळा) in Marathi and 'Peela' (पीला) in Hindi ensures your child can confidently point out and describe the colorful world around them in their native language.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>What age is best for this color learning activity?</strong><br>Most toddlers begin recognizing and naming core colors between 18 months and 3 years old, making this interactive studio the perfect tool for early cognitive development.</p>
                        <p><strong>Can my child practice color recognition offline?</strong><br>Yes! We highly recommend downloading our free, high-quality printable color matching and coloring worksheets from the Parents Corner to reinforce these skills offline with physical crayons.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>इंटरएक्टिव कलर स्टूडियो के बारे में</h2>
                <p>KidsFunLearnHub कलर स्टूडियो में आपका स्वागत है! यह जीवंत गतिविधि बच्चों को रंग पहचानने में मदद करती है। किसी भी रंग कार्ड पर टैप करके उस रंग से मेल खाने वाली एक रोज़मर्रा की वस्तु देखें और उसका नाम सुनें, जिससे अमूर्त रंगों को समझना और याद रखना आसान हो जाता है।</p>
                <p><strong>सीखने के परिणाम:</strong> रंग सिद्धांत की मूल बातें, दृश्य वर्गीकरण, श्रवण-दृश्य जुड़ाव और बहुभाषी रंग शब्दावली।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>बच्चों के लिए "लाल" या "नीला" जैसी अमूर्त अवधारणाओं को समझना तब तक मुश्किल हो सकता है जब तक कि उन्हें वास्तविक दुनिया की वस्तुओं से न जोड़ा जाए। लाल कार्ड पर टैप करके और उसे एक चमकीले लाल सेब में बदलते हुए देखकर, बच्चे तुरंत रंग वर्गीकरण की अवधारणा को समझ जाते हैं। यह डिजिटल फ्लैशकार्ड तंत्र उनका ध्यान खींचता है और बिना किसी रुकावट के उनके दृश्य पहचान कौशल को मजबूत करता है।</p>
                        <p>हमारी त्रिभाषी ऑडियो प्रणाली के साथ दृश्य शिक्षा को शक्तिशाली रूप से सुदृढ़ किया जाता है। जब रंगीन वस्तु पॉप अप होती है, तो बच्चे को तुरंत ऑडियो सुनाई देता है। यह जानना कि "Yellow" मराठी में 'पिवळा' और हिंदी में 'पीला' से जुड़ा है, यह सुनिश्चित करता है कि आपका बच्चा अपनी मातृभाषा में अपने आस-पास की रंगीन दुनिया का आत्मविश्वास से वर्णन कर सके।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>इस रंग सीखने की गतिविधि के लिए कौन सी उम्र सबसे अच्छी है?</strong><br>ज्यादातर बच्चे 18 महीने से 3 साल की उम्र के बीच मुख्य रंगों को पहचानना और नाम देना शुरू कर देते हैं, जिससे यह इंटरएक्टिव स्टूडियो प्रारंभिक संज्ञानात्मक विकास के लिए एक आदर्श उपकरण बन जाता है।</p>
                        <p><strong>क्या मेरा बच्चा ऑफलाइन रंग पहचान का अभ्यास कर सकता है?</strong><br>हाँ! हम भौतिक क्रेयॉन के साथ ऑफ़लाइन इन कौशलों को सुदृढ़ करने के लिए पेरेंट्स कॉर्नर से हमारे मुफ्त मुद्रण योग्य रंग मिलान वर्कशीट डाउनलोड करने की अत्यधिक अनुशंसा करते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>इंटरएक्टिव कलर स्टुडिओबद्दल</h2>
                <p>KidsFunLearnHub कलर स्टुडिओमध्ये आपले स्वागत आहे! ही दोलायमान ऍक्टिव्हिटी लहान मुलांना रंग ओळखण्यास मदत करते. त्या रंगाशी जुळणारी एक रोजची वस्तू पाहण्यासाठी कोणत्याही रंग कार्डवर टॅप करा आणि तिचे नाव ऐका, ज्यामुळे रंग समजून घेणे आणि लक्षात ठेवणे सोपे होते.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> रंगाच्या सिद्धांताच्या मूलभूत गोष्टी, दृश्य वर्गीकरण, श्रवण-दृश्य संरेखन आणि बहुभाषिक शब्दसंग्रह.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>लहान मुलांसाठी "लाल" किंवा "निळा" सारख्या अमूर्त संकल्पना समजून घेणे कठीण होऊ शकते जोपर्यंत ते वास्तविक जगातील वस्तूंशी जोडले जात नाहीत. लाल कार्ड टॅप करून आणि त्याचे लाल सफरचंदात रूपांतर होताना पाहून, मुलांना रंगाच्या वर्गीकरणाची संकल्पना लगेच समजते. हे डिजिटल फ्लॅशकार्ड त्यांचे लक्ष वेधून घेते आणि त्यांची दृश्य ओळख कौशल्ये मजबूत करते.</p>
                        <p>आमच्या त्रिभाषिक ऑडिओ प्रणालीमुळे दृश्य शिक्षण अधिक प्रभावी होते. जेव्हा रंगीत वस्तू पॉप अप होते, तेव्हा मुलाला त्वरित ऑडिओ ऐकू येतो. "Yellow" ला मराठीत 'पिवळा' आणि हिंदीत 'पीला' म्हणतात हे शिकल्याने तुमचे बाळ स्वतःच्या मातृभाषेत रंगीत जगाचे आत्मविश्वासाने वर्णन करू शकते.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>या रंगांच्या ऍक्टिव्हिटीसाठी कोणते वय सर्वोत्तम आहे?</strong><br>बहुतेक मुले १८ महिने ते ३ वर्षांच्या दरम्यान मुख्य रंग ओळखण्यास आणि नावे देण्यास सुरुवात करतात, ज्यामुळे हा इंटरएक्टिव स्टुडिओ प्रारंभिक संज्ञानात्मक विकासासाठी एक परिपूर्ण साधन बनतो.</p>
                        <p><strong>माझे बाळ ऑफलाइन रंग ओळखण्याचा सराव करू शकते का?</strong><br>होय! भौतिक क्रेयॉनसह ऑफलाइन या कौशल्यांचा सराव करण्यासाठी आम्ही पेरेंट्स कॉर्नरमधून आमच्या मोफत प्रिंट करण्यायोग्य कलर मॅचिंग वर्कशीट डाउनलोड करण्याची शिफारस करतो.</p>
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

    const colorData = {
        primary: [
            { id: "red", hex: "#e74c3c", obj: "red.webp", en: "Red", hi: "लाल", mr: "लाल" },
            { id: "blue", hex: "#3498db", obj: "blue.webp", en: "Blue", hi: "नीला", mr: "निळा" },
            { id: "yellow", hex: "#f1c40f", obj: "yellow.webp", en: "Yellow", hi: "पीला", mr: "पिवळा" }
        ],
        secondary: [
            { id: "green", hex: "#2ecc71", obj: "green.webp", en: "Green", hi: "हरा", mr: "हिरवा" },
            { id: "orange", hex: "#e67e22", obj: "orange.webp", en: "Orange", hi: "नारंगी", mr: "केशरी" },
            { id: "purple", hex: "#9b59b6", obj: "purple.webp", en: "Purple", hi: "बैंगनी", mr: "जांभळा" }
        ],
        neutral: [
            { id: "black", hex: "#000000", obj: "black.webp", en: "Black", hi: "काला", mr: "काळा" },
            { id: "white", hex: "#ffffff", obj: "white.webp", en: "White", hi: "सफ़ेद", mr: "पांढरा" },
            { id: "grey", hex: "#95a5a6", obj: "grey.webp", en: "Grey", hi: "स्लेटी", mr: "राखाडी" },
            { id: "brown", hex: "#8b4513", obj: "brown.webp", en: "Brown", hi: "भूरा", mr: "तपकिरी" }
        ],
        advanced: [
            { id: "teal", hex: "#008080", obj: "teal.webp", en: "Teal", hi: "टील", mr: "टील" },
            { id: "magenta", hex: "#ff00ff", obj: "magenta.webp", en: "Magenta", hi: "मैजेंटा", mr: "मॅजेंटा" },
            { id: "lavender", hex: "#e6e6fa", obj: "lavender.webp", en: "Lavender", hi: "लैवेंडर", mr: "लव्हेंडर" },
            { id: "maroon", hex: "#800000", obj: "maroon.webp", en: "Maroon", hi: "मैरून", mr: "मरून" },
            { id: "turquoise", hex: "#40e0d0", obj: "turquoise.webp", en: "Turquoise", hi: "फिरोज़ा", mr: "फिरोजी" }
        ]
    };

    // Translate Static UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el && !["primary", "secondary", "neutral", "advanced"].includes(id)) {
            el.innerHTML = uiDictionary[id][currentLang];
        }
    }

    /////////////////////////////////////////////////
    // 3. PRELOAD CACHING
    /////////////////////////////////////////////////
    const imageCache = {};

    Object.values(colorData).flat().forEach(item => {
        const img = new Image();
        img.src = `images/colours/${item.obj}`;
        imageCache[item.id] = img;
    });

    /////////////////////////////////////////////////
    // 4. BUILD PAGE SECTIONS
    /////////////////////////////////////////////////
    function renderPage() {
        const main = document.getElementById("mainContent");
        main.innerHTML = "";

        for (let section in colorData) {
            const title = document.createElement("h2");
            title.className = "section-title";
            title.innerText = uiDictionary[section][currentLang];
            main.appendChild(title);

            const grid = document.createElement("div");
            grid.className = "color-grid";

            colorData[section].forEach(item => {
                const card = document.createElement("div");
                card.className = "card";
                card.setAttribute("role", "button");
                card.innerHTML = `
                    <div class="swatch-circle" style="background:${item.hex}"></div>
                    <p>${item[currentLang]}</p>
                `;
                card.onclick = () => showPopup(item);
                grid.appendChild(card);
            });
            main.appendChild(grid);
        }
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;
    const popup = document.getElementById("popup");

    function showPopup(item) {
        document.getElementById("popupColorBox").style.background = item.hex;
        document.getElementById("popupObjImg").src = imageCache[item.id].src;
        document.getElementById("popupName").innerText = item[currentLang];
        
        popup.classList.remove("hidden");
        popup.style.display = "flex";

        if (activeAudio) {
            activeAudio.pause();
            activeAudio.currentTime = 0;
        }

        activeAudio = new Audio(`sounds/${currentLang}/colours/${item.id}.mp3`);
        activeAudio.play().catch(e => console.log("Sound file missing at: ", e.target.src));

        if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
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
    // 6. CLEANUP LOGIC ON EXIT
    /////////////////////////////////////////////////
    const cleanupSession = () => sessionStorage.removeItem('colorsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // Run the render immediately
    renderPage();
});