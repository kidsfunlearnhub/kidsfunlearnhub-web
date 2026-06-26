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
    let currentLang = sessionStorage.getItem('fruitsPageLang') || globalLang;

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
                sessionStorage.setItem('fruitsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🍓 Learn Fruits", hi: "🍓 फल सीखें", mr: "🍓 फळे शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Fruit Activities", hi: "फल गतिविधियां", mr: "फळ ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Fruits", hi: "➡ अगले फल", mr: "➡ पुढील फळे" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: `
                <h2>About The Fruit Learning Flashcards</h2>
                <p>Welcome to the Fruit Learning Flashcards at KidsFunLearnHub! This appetizing, colorful activity helps toddlers build a healthy food vocabulary. Tap any fruit to open a vibrant pop-up image and hear its name spoken aloud.</p>
                <p><strong>Learning Outcomes:</strong> Healthy dietary vocabulary, color association, speech mimicking, and multilingual food recognition.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Early childhood is the critical window for establishing positive associations with healthy foods. The large, distraction-free pop-up images of apples, bananas, and grapes make fruits look appealing and familiar. This digital familiarity often translates into a higher willingness for toddlers to try these actual foods at the dinner table!</p>
                        <p>Fruits are deeply tied to local culture and markets. Our interactive platform features comprehensive regional language integration. When a child opens the mango pop-up, they can learn the English word while seamlessly switching to hear the Hindi and Marathi 'Aamba' (आंबा), building a culturally relevant vocabulary.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Does this activity group fruits by color?</strong><br>While not grouped strictly by color, the vibrant, isolated pop-ups naturally reinforce a toddler's color wheel knowledge through visual exposure.</p>
                        <p><strong>Can I download these fruit cards?</strong><br>Absolutely. Free printable fruit flashcards and coloring PDFs are available for hands-on offline play.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>फल लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>KidsFunLearnHub पर फल लर्निंग फ्लैशकार्ड में आपका स्वागत है! यह स्वादिष्ट, रंगीन गतिविधि बच्चों को एक स्वस्थ भोजन शब्दावली बनाने में मदद करती है। एक जीवंत पॉप-अप छवि खोलने और उसका नाम जोर से सुनने के लिए किसी भी फल पर टैप करें।</p>
                <p><strong>सीखने के परिणाम:</strong> स्वस्थ आहार शब्दावली, रंग संघटन, भाषण की नकल करना, और बहुभाषी भोजन पहचान।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>स्वस्थ खाद्य पदार्थों के साथ सकारात्मक जुड़ाव स्थापित करने के लिए प्रारंभिक बचपन एक महत्वपूर्ण खिड़की है। सेब, केले और अंगूर की बड़ी, व्याकुलता मुक्त पॉप-अप छवियां फलों को आकर्षक और परिचित बनाती हैं। यह डिजिटल परिचितता अक्सर बच्चों को खाने की मेज पर इन वास्तविक खाद्य पदार्थों को आज़माने की उच्च इच्छा में बदल जाती है!</p>
                        <p>फल स्थानीय संस्कृति और बाज़ारों से गहराई से जुड़े होते हैं। हमारे इंटरैक्टिव प्लेटफॉर्म में व्यापक क्षेत्रीय भाषा एकीकरण है। जब कोई बच्चा आम का पॉप-अप खोलता है, तो वे अंग्रेजी शब्द सीख सकते हैं, जबकि हिंदी और मराठी में 'आंबा' (Aamba) सुनने के लिए सहजता से स्विच कर सकते हैं, जिससे एक सांस्कृतिक रूप से प्रासंगिक शब्दावली बनती है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या यह गतिविधि फलों को रंग के अनुसार समूहित करती है?</strong><br>यद्यपि सख्ती से रंग के अनुसार समूहित नहीं किया गया है, जीवंत, पृथक पॉप-अप स्वाभाविक रूप से दृश्य प्रदर्शन के माध्यम से एक बच्चे के रंग चक्र ज्ञान को सुदृढ़ करते हैं।</p>
                        <p><strong>क्या मैं इन फल कार्डों को डाउनलोड कर सकता हूँ?</strong><br>बिल्कुल। हैंड्स-ऑन ऑफ़लाइन खेलने के लिए मुफ्त प्रिंट करने योग्य फल फ्लैशकार्ड और रंग पीडीएफ उपलब्ध हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>फळे लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>KidsFunLearnHub वरील फळे लर्निंग फ्लॅशकार्ड्समध्ये आपले स्वागत आहे! ही रंगतदार, स्वादिष्ट ऍक्टिव्हिटी लहान मुलांना आरोग्यदायी अन्नाचा शब्दसंग्रह तयार करण्यास मदत करते. एक दोलायमान पॉप-अप प्रतिमा उघडण्यासाठी आणि त्याचे नाव मोठ्याने ऐकण्यासाठी कोणत्याही फळावर टॅप करा.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> निरोगी आहार शब्दसंग्रह, रंग ओळख, भाषण नक्कल आणि बहुभाषिक अन्न ओळख.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>निरोगी खाद्यपदार्थांशी सकारात्मक संबंध प्रस्थापित करण्यासाठी बालपण हा महत्त्वाचा टप्पा आहे. सफरचंद, केळी आणि द्राक्षे यांच्या मोठ्या, विचलित न करणाऱ्या पॉप-अप प्रतिमा फळांना आकर्षक आणि परिचित बनवतात. ही डिजिटल ओळख बऱ्याचदा लहान मुलांची जेवणाच्या टेबलावर हे प्रत्यक्ष अन्नपदार्थ खाऊन पाहण्याची इच्छा वाढवते!</p>
                        <p>फळे स्थानिक संस्कृती आणि बाजारपेठांशी खोलवर जोडलेली असतात. आमच्या इंटरएक्टिव्ह प्लॅटफॉर्ममध्ये सर्वसमावेशक प्रादेशिक भाषा एकत्रीकरण आहे. जेव्हा एखादे मूल आंब्याचा पॉप-अप उघडते, तेव्हा ते इंग्रजी शब्द शिकू शकतात आणि हिंदी आणि मराठीत 'आंबा' (Aamba) ऐकण्यासाठी सहजपणे स्विच करू शकतात, ज्यामुळे सांस्कृतिकदृष्ट्या संबंधित शब्दसंग्रह तयार होतो.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>ही ऍक्टिव्हिटी फळांची रंगांनुसार गटवारी करते का?</strong><br>जरी काटेकोरपणे रंगांनुसार गटवारी केली नसली तरी, दोलायमान, वेगळे पॉप-अप नैसर्गिकरित्या दृश्य प्रदर्शनाद्वारे लहान मुलांच्या रंगांचे ज्ञान वाढवतात.</p>
                        <p><strong>मी हे फळांचे कार्ड डाउनलोड करू शकतो का?</strong><br>नक्कीच. हँड्स-ऑन ऑफलाइन खेळासाठी मोफत प्रिंट करण्यायोग्य फळांचे फ्लॅशकार्ड आणि कलरिंग PDF उपलब्ध आहेत.</p>
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

    const fruitDict = {
        "mango": { en: "Mango", hi: "आम", mr: "आंबा" },
        "banana": { en: "Banana", hi: "केला", mr: "केळे" },
        "apple": { en: "Apple", hi: "सेब", mr: "सफरचंद" },
        "orange": { en: "Orange", hi: "संतरा", mr: "संत्री" },
        "grapes": { en: "Grapes", hi: "अंगूर", mr: "द्राक्षे" },
        "papaya": { en: "Papaya", hi: "पपीता", mr: "पपई" },
        "guava": { en: "Guava", hi: "अमरूद", mr: "पेरू" },
        "pineapple": { en: "Pineapple", hi: "अनानास", mr: "अननस" },
        "pomegranate": { en: "Pomegranate", hi: "अनार", mr: "डाळिंब" },
        "watermelon": { en: "Watermelon", hi: "तरबूज", mr: "कलिंगड" },
        "muskmelon": { en: "Muskmelon", hi: "खरबूजा", mr: "खरबूज" },
        "chikoo": { en: "Chikoo", hi: "चीकू", mr: "चिकू" },
        "custard apple": { en: "Custard Apple", hi: "सीताफल", mr: "सीताफळ" },
        "litchi": { en: "Litchi", hi: "लीची", mr: "लीची" },
        "jackfruit": { en: "Jackfruit", hi: "कटहल", mr: "फणस" },
        "pear": { en: "Pear", hi: "नाशपाती", mr: "पेअर" },
        "plum": { en: "Plum", hi: "आलूबुखारा", mr: "प्लम" },
        "peach": { en: "Peach", hi: "आड़ू", mr: "पीच" },
        "apricot": { en: "Apricot", hi: "खुबानी", mr: "जर्दाळू" },
        "kiwi": { en: "Kiwi", hi: "कीवी", mr: "कीवी" },
        "fig": { en: "Fig", hi: "अंजीर", mr: "अंजीर" },
        "dates": { en: "Dates", hi: "खजूर", mr: "खजूर" },
        "coconut": { en: "Coconut", hi: "नारियल", mr: "नारळ" },
        "jamun": { en: "Jamun", hi: "जामुन", mr: "जांभूळ" },
        "amla": { en: "Amla", hi: "आंवला", mr: "आवळा" },
        "star fruit": { en: "Star Fruit", hi: "कमरख", mr: "स्टार फ्रूट" },
        "dragon fruit": { en: "Dragon Fruit", hi: "ड्रैगन फ्रूट", mr: "ड्रॅगन फ्रूट" },
        "mulberry": { en: "Mulberry", hi: "शहतूत", mr: "तुती" },
        "wood apple": { en: "Wood Apple", hi: "बेल", mr: "कवठ" },
        "tamarind": { en: "Tamarind", hi: "इमली", mr: "चिंच" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const fruits = Object.keys(fruitDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("fruitGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    fruits.forEach(name => {
      const img = new Image();
      img.src = `images/fruits/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/fruits/${name}.mp3`;
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

      fruits.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = fruitDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFruit(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= fruits.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showFruit(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = fruitDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('fruitsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});