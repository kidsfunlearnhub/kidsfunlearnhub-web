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
    let currentLang = sessionStorage.getItem('animalsPageLang') || globalLang;

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
                sessionStorage.setItem('animalsPageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "🐾 Learn Animals", hi: "🐾 जानवर सीखें", mr: "🐾 प्राणी शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "activitiesBtn": { en: "Animal Activities", hi: "जानवर गतिविधियां", mr: "प्राणी ऍक्टिव्हिटीज" },
        "nextBtn": { en: "➡ Next Animals", hi: "➡ अगले जानवर", mr: "➡ पुढील प्राणी" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: `
                <h2>About The Animal Learning Flashcards</h2>
                <p>Welcome to KidsFunLearnHub's Animal Learning Flashcards! This interactive digital vocabulary builder lets toddlers tap on vibrant wildlife cards to trigger a large pop-up image and instantly hear the animal's exact pronunciation.</p>
                <p><strong>Learning Outcomes:</strong> Wildlife vocabulary, auditory-visual association, speech development, and multilingual noun recognition.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Digital flashcards are incredibly effective for early childhood education. When a child taps an animal card, the large pop-up removes all screen distractions, focusing their complete attention on the animal's specific physical traits. This isolated visual focus drastically improves memory retention compared to looking at crowded picture books.</p>
                        <p>The true power of this activity is the immediate auditory feedback. As the image pops up, children hear a crystal-clear pronunciation of the animal. With our built-in language toggle, a toddler can hear "Dog" in English, and instantly switch to learn 'Kutta' (कुत्ता) in Hindi or 'Kutra' (कुत्रा) in Marathi, seamlessly building a rich, trilingual vocabulary.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Is this suitable for speech therapy or delayed speech?</strong><br>Yes! The cause-and-effect mechanic of tapping an image to hear a clear, isolated word is highly recommended for encouraging early speech and mimicking.</p>
                        <p><strong>Are there offline animal flashcards available?</strong><br>Absolutely. We offer high-quality, printable PDF animal flashcards for free in our Parents Corner.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>पशु लर्निंग फ्लैशकार्ड के बारे में</h2>
                <p>KidsFunLearnHub के पशु लर्निंग फ्लैशकार्ड में आपका स्वागत है! यह इंटरैक्टिव डिजिटल शब्दावली निर्माता बच्चों को जीवंत वन्यजीव कार्ड पर टैप करके एक बड़ी पॉप-अप छवि देखने और तुरंत जानवर का सटीक उच्चारण सुनने की सुविधा देता है।</p>
                <p><strong>सीखने के परिणाम:</strong> वन्यजीव शब्दावली, श्रवण-दृश्य जुड़ाव, वाक् विकास, और बहुभाषी संज्ञा पहचान।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>प्रारंभिक बचपन की शिक्षा के लिए डिजिटल फ्लैशकार्ड अविश्वसनीय रूप से प्रभावी हैं। जब कोई बच्चा किसी जानवर के कार्ड पर टैप करता है, तो बड़ा पॉप-अप स्क्रीन के सभी विकर्षणों को दूर कर देता है, जिससे उनका पूरा ध्यान जानवर के विशिष्ट शारीरिक लक्षणों पर केंद्रित हो जाता है। यह पृथक दृश्य फोकस भीड़-भाड़ वाली चित्र पुस्तकों को देखने की तुलना में स्मृति प्रतिधारण में काफी सुधार करता है।</p>
                        <p>इस गतिविधि की असली शक्ति तत्काल श्रवण प्रतिक्रिया है। जैसे ही छवि पॉप अप होती है, बच्चों को जानवर का स्पष्ट उच्चारण सुनाई देता है। हमारे इन-बिल्ट लैंग्वेज टॉगल के साथ, एक बच्चा अंग्रेजी में "Dog" सुन सकता है, और तुरंत हिंदी में 'कुत्ता' या मराठी में 'कुत्रा' सीखने के लिए स्विच कर सकता है, जिससे एक समृद्ध, त्रिभाषी शब्दावली का निर्माण होता है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या यह स्पीच थेरेपी या देरी से बोलने वाले बच्चों के लिए उपयुक्त है?</strong><br>हाँ! एक स्पष्ट, पृथक शब्द सुनने के लिए एक छवि को टैप करने के कारण-और-प्रभाव तंत्र की अत्यधिक अनुशंसा की जाती है ताकि शुरुआती बोलने और नकल करने को प्रोत्साहित किया जा सके।</p>
                        <p><strong>क्या ऑफ़लाइन पशु फ्लैशकार्ड उपलब्ध हैं?</strong><br>बिल्कुल। हम अपने पेरेंट्स कॉर्नर में मुफ्त में उच्च गुणवत्ता वाले, प्रिंट करने योग्य पीडीएफ पशु फ्लैशकार्ड प्रदान करते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>प्राणी लर्निंग फ्लॅशकार्ड्सबद्दल</h2>
                <p>KidsFunLearnHub च्या प्राणी लर्निंग फ्लॅशकार्ड्समध्ये आपले स्वागत आहे! हे इंटरएक्टिव्ह डिजिटल व्होकॅब्युलरी बिल्डर लहान मुलांना वन्यजीव कार्डवर टॅप करून एक मोठी पॉप-अप प्रतिमा पाहू देते आणि लगेच प्राण्याचे अचूक उच्चारण ऐकू देते.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> वन्यजीव शब्दसंग्रह, श्रवण-दृश्य ओळख, भाषण विकास आणि बहुभाषिक नाम ओळख.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>लहान मुलांच्या शिक्षणासाठी डिजिटल फ्लॅशकार्ड आश्चर्यकारकपणे प्रभावी आहेत. जेव्हा मूल प्राणी कार्ड टॅप करते, तेव्हा मोठे पॉप-अप स्क्रीनवरील सर्व विचलित करणाऱ्या गोष्टी काढून टाकते आणि त्यांचे पूर्ण लक्ष प्राण्यांच्या विशिष्ट शारीरिक वैशिष्ट्यांवर केंद्रित करते. पुस्तकातील गर्दीच्या चित्रांच्या तुलनेत या एकाग्र दृश्य फोकसमुळे स्मरणशक्तीमध्ये लक्षणीय सुधारणा होते.</p>
                        <p>या ऍक्टिव्हिटीची खरी ताकद म्हणजे त्वरित ऑडिओ प्रतिसाद. प्रतिमा पॉप अप होताच, मुलांना प्राण्याचे स्पष्ट उच्चारण ऐकू येते. आमच्या इन-बिल्ट लँग्वेज टॉगलसह, बाळ इंग्रजीमध्ये "Dog" ऐकू शकते आणि हिंदीमध्ये 'कुत्ता' किंवा मराठीत 'कुत्रा' शिकण्यासाठी त्वरित स्विच करू शकते, ज्यामुळे एक समृद्ध, त्रिभाषिक शब्दसंग्रह तयार होतो.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>हे स्पीच थेरपी किंवा उशिरा बोलणाऱ्या मुलांसाठी योग्य आहे का?</strong><br>होय! स्पष्ट, वेगळा शब्द ऐकण्यासाठी प्रतिमेवर टॅप करण्याच्या कृतीची शिफारस लवकर बोलण्यासाठी आणि नक्कल करण्यास प्रोत्साहित करण्यासाठी केली जाते.</p>
                        <p><strong>ऑफलाइन प्राणी फ्लॅशकार्ड्स उपलब्ध आहेत का?</strong><br>नक्कीच. आम्ही आमच्या पेरेंट्स कॉर्नरमध्ये मोफत उच्च दर्जाचे, प्रिंट करण्यायोग्य PDF प्राणी फ्लॅशकार्ड्स देतो.</p>
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

    const animalDict = {
        "dog": { en: "Dog", hi: "कुत्ता", mr: "कुत्रा" },
        "cat": { en: "Cat", hi: "बिल्ली", mr: "मांजर" },
        "lion": { en: "Lion", hi: "शेर", mr: "सिंह" },
        "tiger": { en: "Tiger", hi: "बाघ", mr: "वाघ" },
        "elephant": { en: "Elephant", hi: "हाथी", mr: "हत्ती" },
        "monkey": { en: "Monkey", hi: "बंदर", mr: "माकड" },
        "cow": { en: "Cow", hi: "गाय", mr: "गाय" },
        "horse": { en: "Horse", hi: "घोड़ा", mr: "घोडा" },
        "goat": { en: "Goat", hi: "बकरी", mr: "शेळी" },
        "bear": { en: "Bear", hi: "भालू", mr: "अस्वल" },
        "zebra": { en: "Zebra", hi: "ज़ेबरा", mr: "झेब्रा" },
        "giraffe": { en: "Giraffe", hi: "जिराफ़", mr: "जिराफ" },
        "rabbit": { en: "Rabbit", hi: "खरगोश", mr: "ससा" },
        "fox": { en: "Fox", hi: "लोमड़ी", mr: "कोल्हा" },
        "deer": { en: "Deer", hi: "हिरण", mr: "हरीण" },
        "camel": { en: "Camel", hi: "ऊंट", mr: "उंट" },
        "wolf": { en: "Wolf", hi: "भेड़िया", mr: "लांडगा" },
        "kangaroo": { en: "Kangaroo", hi: "कंगारू", mr: "कांगारू" },
        "panda": { en: "Panda", hi: "पांडा", mr: "पांडा" },
        "rhino": { en: "Rhino", hi: "गैंडा", mr: "गेंडा" },
        "hippo": { en: "Hippo", hi: "दरियाई घोड़ा", mr: "पाणघोडा" },
        "cheetah": { en: "Cheetah", hi: "चीता", mr: "चित्ता" },
        "buffalo": { en: "Buffalo", hi: "भैंस", mr: "म्हैस" },
        "donkey": { en: "Donkey", hi: "गधा", mr: "गाढव" },
        "pig": { en: "Pig", hi: "सूअर", mr: "डुक्कर" },
        "sheep": { en: "Sheep", hi: "भेड़", mr: "मेंढी" },
        "yak": { en: "Yak", hi: "याक", mr: "याक" },
        "otter": { en: "Otter", hi: "ऊदबिलाव", mr: "पाणमांजर" },
        "squirrel": { en: "Squirrel", hi: "गिलहरी", mr: "खारूताई" },
        "leopard": { en: "Leopard", hi: "तेंदुआ", mr: "बिबट्या" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. PAGINATION & CACHING
    /////////////////////////////////////////////////
    const animals = Object.keys(animalDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    const grid = document.getElementById("animalGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    const imageCache = {};
    const soundCache = {};

    animals.forEach(name => {
      const img = new Image();
      img.src = `images/animals/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/animals/${name}.mp3`;
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

      animals.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");

        const translatedName = animalDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${translatedName}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showAnimal(name);
        grid.appendChild(card);
      });
      
      // Auto-scroll slightly up when changing pages to reset view
      window.scrollTo({ top: grid.offsetTop - 50, behavior: 'smooth' });
    }

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= animals.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // 5. POPUP DISPLAY & LOGIC
    /////////////////////////////////////////////////
    let activeAudio = null;

    function showAnimal(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = animalDict[name][currentLang];
      
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
    const cleanupSession = () => sessionStorage.removeItem('animalsPageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);

    // INIT
    loadPage();
});