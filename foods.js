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
    let currentLang = sessionStorage.getItem('foodsPageLang') || globalLang;

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
                sessionStorage.setItem('foodsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🍛 Learn Foods", hi: "🍛 भोजन सीखें", mr: "🍛 पदार्थ शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Food Activities", hi: "भोजन गतिविधियां", mr: "अन्न ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Foods", hi: "➡ अगला भोजन", mr: "➡ पुढील पदार्थ" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: `
                <h2>About The Daily Foods Learning Flashcards</h2>
                <p>Step into the kitchen with our Daily Foods Learning Flashcards! This interactive vocabulary builder helps early learners identify everyday meals and snacks. Tapping an item triggers a full-screen pop-up and clear audio pronunciation.</p>
                <p><strong>Learning Outcomes:</strong> Daily routine vocabulary, cultural food awareness, speech articulation, and bilingual meal identification.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Learning the names of daily foods is a massive leap in a toddler’s ability to communicate their needs. By tapping on bread, milk, or a bowl of rice, the distraction-free pop-up helps them associate the visual dish with the spoken word. This drastically reduces frustration when a child is trying to ask parents for a specific snack.</p>
                        <p>Food is deeply tied to culture. We designed this interactive canvas to be highly relevant to our users by including audio dictionaries spanning English, Hindi, and Marathi. This ensures that children can clearly recognize and articulate the names of the dishes prepared in their own homes.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Are regional Indian dishes included?</strong><br>Yes, we prioritize a localized learning experience, ensuring the vocabulary matches the everyday foods children actually see on their plates.</p>
                        <p><strong>What age is appropriate for food flashcards?</strong><br>Children as young as 18 months can begin using this tool to point out and mimic the names of their favorite foods.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>दैनिक भोजन लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>हमारे दैनिक भोजन लर्निंग फ्लैशकार्ड के साथ रसोई में कदम रखें! यह इंटरैक्टिव शब्दावली निर्माता प्रारंभिक शिक्षार्थियों को रोज़मर्रा के भोजन और स्नैक्स को पहचानने में मदद करता है। किसी आइटम पर टैप करने से पूर्ण-स्क्रीन पॉप-अप और स्पष्ट ऑडियो उच्चारण ट्रिगर होता है।</p>
                <p><strong>सीखने के परिणाम:</strong> दैनिक दिनचर्या शब्दावली, सांस्कृतिक भोजन जागरूकता, वाक् स्पष्टता, और द्विभाषी भोजन पहचान।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>दैनिक खाद्य पदार्थों के नाम सीखना एक बच्चे की अपनी ज़रूरतों को संप्रेषित करने की क्षमता में एक बड़ी छलांग है। ब्रेड, दूध या चावल के कटोरे पर टैप करके, व्याकुलता मुक्त पॉप-अप उन्हें दृश्य पकवान को बोले गए शब्द के साथ जोड़ने में मदद करता है। जब कोई बच्चा माता-पिता से किसी विशिष्ट स्नैक के लिए पूछने की कोशिश कर रहा होता है तो यह हताशा को काफी कम कर देता है।</p>
                        <p>भोजन संस्कृति से गहराई से जुड़ा हुआ है। हमने अंग्रेजी, हिंदी और मराठी में ऑडियो डिक्शनरी शामिल करके इस इंटरैक्टिव कैनवास को अपने उपयोगकर्ताओं के लिए अत्यधिक प्रासंगिक बनाने के लिए डिज़ाइन किया है। यह सुनिश्चित करता है कि बच्चे अपने घरों में तैयार किए गए व्यंजनों के नामों को स्पष्ट रूप से पहचान और बोल सकें।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या इसमें क्षेत्रीय भारतीय व्यंजन शामिल हैं?</strong><br>हाँ, हम एक स्थानीय सीखने के अनुभव को प्राथमिकता देते हैं, यह सुनिश्चित करते हुए कि शब्दावली रोज़मर्रा के खाद्य पदार्थों से मेल खाती है जो बच्चे वास्तव में अपनी प्लेटों पर देखते हैं।</p>
                        <p><strong>भोजन फ्लैशकार्ड के लिए कौन सी उम्र उपयुक्त है?</strong><br>18 महीने के बच्चे अपने पसंदीदा खाद्य पदार्थों के नामों को इंगित करने और उनकी नकल करने के लिए इस उपकरण का उपयोग करना शुरू कर सकते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>दैनंदिन अन्न लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>आमच्या दैनंदिन अन्न लर्निंग फ्लॅशकार्ड्ससह स्वयंपाकघरात प्रवेश करा! हे इंटरएक्टिव्ह शब्दसंग्रह साधन सुरुवातीच्या शिकणाऱ्यांना रोजचे जेवण आणि स्नॅक्स ओळखण्यास मदत करते. आयटमवर टॅप केल्याने फुल-स्क्रीन पॉप-अप आणि स्पष्ट ऑडिओ उच्चार ट्रिगर होतो.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> दैनंदिन दिनचर्या शब्दसंग्रह, सांस्कृतिक अन्न जागरूकता, भाषण स्पष्टता आणि द्विभाषिक जेवण ओळख.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>दैनंदिन अन्नाची नावे शिकणे ही लहान मुलांच्या गरजा सांगण्याच्या क्षमतेत मोठी झेप आहे. ब्रेड, दूध किंवा तांदळाच्या वाटीवर टॅप करून, विचलित न करणारे पॉप-अप त्यांना दृश्य अन्नाला उच्चारलेल्या शब्दाशी जोडण्यास मदत करते. जेव्हा मूल पालकांना विशिष्ट स्नॅकसाठी विचारण्याचा प्रयत्न करत असते तेव्हा यामुळे निराशा मोठ्या प्रमाणात कमी होते.</p>
                        <p>अन्न संस्कृतीशी खोलवर जोडलेले आहे. इंग्रजी, हिंदी आणि मराठीतील ऑडिओ डिक्शनरी समाविष्ट करून आम्ही हा इंटरएक्टिव्ह कॅनव्हास आमच्या वापरकर्त्यांसाठी अत्यंत प्रासंगिक बनवण्यासाठी डिझाइन केला आहे. यामुळे मुले त्यांच्या स्वतःच्या घरात तयार केलेल्या पदार्थांची नावे स्पष्टपणे ओळखू आणि बोलू शकतील याची खात्री होते.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>यामध्ये प्रादेशिक भारतीय पदार्थांचा समावेश आहे का?</strong><br>होय, आम्ही स्थानिक शिकण्याच्या अनुभवाला प्राधान्य देतो, हे सुनिश्चित करून की शब्दसंग्रह रोजच्या अन्नाशी जुळतो जे मुले खरोखर त्यांच्या ताटात पाहतात.</p>
                        <p><strong>अन्न फ्लॅशकार्ड्ससाठी कोणते वय योग्य आहे?</strong><br>१८ महिन्यांची मुले त्यांच्या आवडत्या अन्नाकडे बोट दाखवण्यासाठी आणि नावांची नक्कल करण्यासाठी या साधनाची मदत घेऊ शकतात.</p>
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

    const foodDict = {
        "idli": { en: "Idli", hi: "इडली", mr: "इडली" },
        "dosa": { en: "Dosa", hi: "डोसा", mr: "डोसा" },
        "vada": { en: "Vada", hi: "वड़ा", mr: "वडा" },
        "sambar": { en: "Sambar", hi: "सांभर", mr: "सांबार" },
        "poha": { en: "Poha", hi: "पोहा", mr: "पोहे" },
        "upma": { en: "Upma", hi: "उपमा", mr: "उपमा" },
        "paratha": { en: "Paratha", hi: "पराठा", mr: "पराठा" },
        "puri": { en: "Puri", hi: "पूरी", mr: "पुरी" },
        "chapati": { en: "Chapati", hi: "चपाती", mr: "चपाती" },
        "dal": { en: "Dal", hi: "दाल", mr: "डाळ" },
        "khichdi": { en: "Khichdi", hi: "खिचड़ी", mr: "खिचडी" },
        "biryani": { en: "Biryani", hi: "बिरयानी", mr: "बिर्याणी" },
        "pulao": { en: "Pulao", hi: "पुलाव", mr: "पुलाव" },
        "paneer": { en: "Paneer", hi: "पनीर", mr: "पनीर" },
        "rajma": { en: "Rajma", hi: "राजमा", mr: "राजमा" },
        "chole": { en: "Chole", hi: "छोले", mr: "छोले" },
        "bhindi": { en: "Bhindi", hi: "भिंडी", mr: "भेंडी" },
        "aloo_gobi": { en: "Aloo Gobi", hi: "आलू गोभी", mr: "आलू गोबी" },
        "pav_bhaji": { en: "Pav Bhaji", hi: "पाव भाजी", mr: "पाव भाजी" },
        "vada_pav": { en: "Vada Pav", hi: "वड़ा पाव", mr: "वडा पाव" },
        "dhokla": { en: "Dhokla", hi: "ढोकला", mr: "ढोकळा" },
        "thepla": { en: "Thepla", hi: "थेपला", mr: "थेपला" },
        "kachori": { en: "Kachori", hi: "कचौड़ी", mr: "कचोरी" },
        "samosa": { en: "Samosa", hi: "समोसा", mr: "समोसा" },
        "jalebi": { en: "Jalebi", hi: "जलेबी", mr: "जिलबी" },
        "gulab_jamun": { en: "Gulab Jamun", hi: "गुलाब जामुन", mr: "गुलाब जामुन" },
        "rasgulla": { en: "Rasgulla", hi: "रसगुल्ला", mr: "रसगुल्ला" },
        "kheer": { en: "Kheer", hi: "खीर", mr: "खीर" },
        "halwa": { en: "Halwa", hi: "हलवा", mr: "हलवा" },
        "laddu": { en: "Laddu", hi: "लड्डू", mr: "लाडू" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const foods = Object.keys(foodDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("foodGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    foods.forEach(name => {
      const img = new Image();
      img.src = `images/foods/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/foods/${name}.mp3`;
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

      foods.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = foodDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFood(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= foods.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showFood(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = foodDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('foodsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});