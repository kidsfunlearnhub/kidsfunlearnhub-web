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
    let currentLang = sessionStorage.getItem('flowersPageLang') || globalLang;

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
                sessionStorage.setItem('flowersPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🌹 Learn Flowers", hi: "🌹 फूल सीखें", mr: "🌹 फुले शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Flower Activities", hi: "फूल गतिविधियां", mr: "फुले ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Flowers", hi: "➡ अगले फूल", mr: "➡ पुढील फुले" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: `
                <h2>About The Flower Learning Flashcards</h2>
                <p>Welcome to the Flower Learning Flashcards! This visually stunning module teaches children about the wonders of nature. Tap any beautiful bloom to trigger a high-resolution pop-up image and hear its exact name spoken aloud.</p>
                <p><strong>Learning Outcomes:</strong> Botanical vocabulary, nature appreciation, auditory-visual matching, and multilingual sensory words.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Flowers feature incredible geometric patterns and vivid color gradients. Our pop-up mechanic isolates the flower on the screen, allowing preschoolers to focus intently on the shape of the petals and the vivid colors without background distractions. This focused observation is a foundational skill for later art and science education.</p>
                        <p>The gentle, engaging visuals are paired with our powerful trilingual audio system. A child can tap a lotus to see it bloom on screen, learn its English name, and immediately switch to hear the Hindi and Marathi translations like 'Kamal' (कमळ). This makes vocabulary building an immersive, relaxing experience.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Is this activity good for learning colors?</strong><br>Absolutely. The rich, full-screen pop-ups of red roses and yellow sunflowers naturally reinforce early color recognition.</p>
                        <p><strong>Can I print these flower flashcards?</strong><br>Yes! We offer free, printable PDF flower flashcards and coloring sheets in our printable section.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>फूल लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>फूल लर्निंग फ्लैशकार्ड में आपका स्वागत है! यह आकर्षक मॉड्यूल बच्चों को प्रकृति के अजूबों के बारे में सिखाता है। एक उच्च-रिज़ॉल्यूशन पॉप-अप छवि को ट्रिगर करने और उसका सटीक नाम ज़ोर से सुनने के लिए किसी भी सुंदर फूल पर टैप करें।</p>
                <p><strong>सीखने के परिणाम:</strong> वानस्पतिक शब्दावली, प्रकृति प्रशंसा, श्रवण-दृश्य मिलान, और बहुभाषी संवेदी शब्द।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>फूलों में अविश्वसनीय ज्यामितीय पैटर्न और ज्वलंत रंग ग्रेडिएंट होते हैं। हमारा पॉप-अप मैकेनिक स्क्रीन पर फूल को अलग करता है, जिससे प्रीस्कूलर बिना पृष्ठभूमि के विकर्षणों के पंखुड़ियों के आकार और ज्वलंत रंगों पर ध्यान केंद्रित कर सकते हैं। यह केंद्रित अवलोकन बाद की कला और विज्ञान शिक्षा के लिए एक आधारभूत कौशल है।</p>
                        <p>सौम्य, आकर्षक दृश्यों को हमारे शक्तिशाली त्रिभाषी ऑडियो सिस्टम के साथ जोड़ा गया है। एक बच्चा कमल को स्क्रीन पर खिलते हुए देखने के लिए उस पर टैप कर सकता है, उसका अंग्रेजी नाम सीख सकता है, और तुरंत 'कमल' (Kamal) जैसे हिंदी और मराठी अनुवाद सुनने के लिए स्विच कर सकता है। यह शब्दावली निर्माण को एक गहन, आरामदायक अनुभव बनाता है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या यह गतिविधि रंग सीखने के लिए अच्छी है?</strong><br>बिल्कुल। लाल गुलाब और पीले सूरजमुखी के समृद्ध, पूर्ण-स्क्रीन पॉप-अप स्वाभाविक रूप से प्रारंभिक रंग पहचान को सुदृढ़ करते हैं।</p>
                        <p><strong>क्या मैं इन फूल फ्लैशकार्ड को प्रिंट कर सकता हूँ?</strong><br>हाँ! हम अपने प्रिंट करने योग्य अनुभाग में मुफ्त, प्रिंट करने योग्य पीडीएफ फूल फ्लैशकार्ड और रंग शीट प्रदान करते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>फुले लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>फुले लर्निंग फ्लॅशकार्ड्समध्ये आपले स्वागत आहे! हे दृश्यात्मक दृष्ट्या आश्चर्यकारक मॉड्यूल मुलांना निसर्गाच्या चमत्कारांबद्दल शिकवते. हाय-रिझोल्यूशन पॉप-अप प्रतिमा ट्रिगर करण्यासाठी आणि तिचे अचूक नाव मोठ्याने ऐकण्यासाठी कोणत्याही सुंदर फुलावर टॅप करा.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> वनस्पतिशास्त्रीय शब्दसंग्रह, निसर्गाची आवड, श्रवण-दृश्य मिलान आणि बहुभाषिक संवेदी शब्द.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>फुलांमध्ये अविश्वसनीय भौमितिक नमुने आणि ज्वलंत रंग असतात. आमचे पॉप-अप मेकॅनिक स्क्रीनवरील फुलाला वेगळे करते, ज्यामुळे लहान मुलांना पार्श्वभूमीतील गोंधळाशिवाय पाकळ्यांच्या आकारावर आणि ज्वलंत रंगांवर लक्ष केंद्रित करण्यास मदत होते. हे केंद्रित निरीक्षण नंतरच्या कला आणि विज्ञान शिक्षणासाठी एक पायाभूत कौशल्य आहे.</p>
                        <p>सौम्य, आकर्षक व्हिज्युअल्स आमच्या शक्तिशाली त्रिभाषिक ऑडिओ प्रणालीशी जोडलेले आहेत. एक मूल कमळ स्क्रीनवर फुललेले पाहण्यासाठी टॅप करू शकते, त्याचे इंग्रजी नाव शिकू शकते आणि 'कमळ' (Kamal) सारखे हिंदी आणि मराठी भाषांतर ऐकण्यासाठी त्वरित स्विच करू शकते. हे शब्दसंग्रह तयार करण्याला एक तल्लीन करणारा, आरामदायी अनुभव बनवते.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>ही ऍक्टिव्हिटी रंग शिकण्यासाठी चांगली आहे का?</strong><br>नक्कीच. लाल गुलाब आणि पिवळ्या सूर्यफुलाचे समृद्ध, फुल-स्क्रीन पॉप-अप नैसर्गिकरित्या प्रारंभिक रंग ओळख मजबूत करतात.</p>
                        <p><strong>मी हे फुलांचे फ्लॅशकार्ड प्रिंट करू शकतो का?</strong><br>होय! आम्ही आमच्या प्रिंटेबल विभागात मोफत, प्रिंट करण्यायोग्य PDF फुलांचे फ्लॅशकार्ड आणि कलरिंग शीट्स देतो.</p>
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

    const flowerDict = {
        "rose": { en: "Rose", hi: "गुलाब", mr: "गुलाब" },
        "tulip": { en: "Tulip", hi: "ट्यूलिप", mr: "ट्यूलिप" },
        "sunflower": { en: "Sunflower", hi: "सूरजमुखी", mr: "सूर्यफूल" },
        "lotus": { en: "Lotus", hi: "कमल", mr: "कमळ" },
        "daisy": { en: "Daisy", hi: "गुलबहार", mr: "डेझी" },
        "lily": { en: "Lily", hi: "कुमुदिनी", mr: "लिली" },
        "orchid": { en: "Orchid", hi: "ऑर्किड", mr: "ऑर्किड" },
        "marigold": { en: "Marigold", hi: "गेंदा", mr: "झेंडू" },
        "jasmine": { en: "Jasmine", hi: "चमेली", mr: "मोगरा" },
        "hibiscus": { en: "Hibiscus", hi: "गुड़हल", mr: "जास्वंद" },
        "lavender": { en: "Lavender", hi: "लैवेंडर", mr: "लॅव्हेंडर" },
        "peony": { en: "Peony", hi: "पियोनी", mr: "पिओनी" },
        "daffodil": { en: "Daffodil", hi: "डैफोडिल", mr: "डॅफोडिल" },
        "cherryblossom": { en: "Cherry Blossom", hi: "चेरी ब्लॉसम", mr: "चेरी ब्लॉसम" },
        "poppy": { en: "Poppy", hi: "खसखस", mr: "खसखस फूल" },
        "magnolia": { en: "Magnolia", hi: "चंपा", mr: "मॅग्नोलिया" },
        "bluebell": { en: "Bluebell", hi: "ब्लूबेल", mr: "ब्लूबेल" },
        "gardenia": { en: "Gardenia", hi: "गार्डेनिया", mr: "गार्डेनिया" },
        "carnation": { en: "Carnation", hi: "कार्नेशन", mr: "कार्नेशन" },
        "iris": { en: "Iris", hi: "आइरिस", mr: "आयरिस" },
        "zinnia": { en: "Zinnia", hi: "ज़िनिया", mr: "झिनिया" },
        "begonia": { en: "Begonia", hi: "बेगोनिया", mr: "बेगोनिया" },
        "camellia": { en: "Camellia", hi: "कैमेलिया", mr: "कॅमेलिया" },
        "petunia": { en: "Petunia", hi: "पेटूनिया", mr: "पिटुनिया" },
        "azalea": { en: "Azalea", hi: "अज़ेलिया", mr: "अझेलिया" },
        "geranium": { en: "Geranium", hi: "जेरेनियम", mr: "जेरेनियम" },
        "snapdragon": { en: "Snapdragon", hi: "स्नैपड्रैगन", mr: "स्नॅपड्रॅगन" },
        "cosmos": { en: "Cosmos", hi: "कॉसमॉस", mr: "कॉसमॉस" },
        "anemone": { en: "Anemone", hi: "एनीमोन", mr: "अॅनिमोन" },
        "buttercup": { en: "Buttercup", hi: "बटरकप", mr: "बटरकप" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const flowers = Object.keys(flowerDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("flowerGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    flowers.forEach(name => {
      const img = new Image();
      img.src = `images/flowers/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/flowers/${name}.mp3`;
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

      flowers.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = flowerDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showFlower(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= flowers.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showFlower(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = flowerDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('flowersPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});