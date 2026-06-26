"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🔢 Learn Numbers", hi: "🔢 नंबर सीखें", mr: "🔢 क्रमांक शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "nextBtn": { en: "➡ Next Numbers", hi: "➡ अगले नंबर", mr: "➡ पुढील क्रमांक" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "traceBtn": { en: "Number Tracing", hi: "नंबर ट्रेसिंग", mr: "अंक ट्रेसिंग" },
        "activitiesBtn": { en: "Numbers Activities", hi: "नंबर गतिविधियां", mr: "अंक ऍक्टिव्हिटीज" },
        "closePopupBtn": { en: "Close ✖", hi: "बंद करें ✖", mr: "बंद करा ✖" },
        "seoText": {
            en: `
                <h2>About The Interactive Numbers Learning Zone</h2>
                <p>Welcome to the KidsFunLearnHub Numbers Learning Zone! This interactive digital math board is designed to help early learners grasp the magic of numbers. Tap on any digit to see it come to life with fun, countable images and hear its exact pronunciation, seamlessly connecting abstract numbers to visual quantities.</p>
                <p><strong>Learning Outcomes:</strong> Number recognition, 1-to-1 correspondence, early math readiness, and multilingual counting vocabulary.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Understanding that the symbol "3" actually represents three physical items is a massive cognitive leap for a toddler. By tapping a number on the screen, children are instantly rewarded with a pop-up showing that exact quantity of fun objects. This engaging cause-and-effect mechanic effectively teaches "1-to-1 correspondence," which is the absolute foundation of all future mathematics and problem-solving.</p>
                        <p>To fully support our diverse early learners, this interactive counting tool features built-in multilingual audio. As the countable objects pop up, your child will hear clear human pronunciations. They can learn to count in English, and instantly switch to hear the regional Devanagari equivalents, such as learning 'Ek' (एक) in Hindi and Marathi. This creates a highly versatile, trilingual foundation for preschool math.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Does this activity teach tracing or just counting?</strong><br>This specific page focuses heavily on number recognition, auditory counting, and quantity association. If your child is ready to start writing, you can explore our free printable tracing resources.</p>
                        <p><strong>Can I download counting worksheets?</strong><br>Yes! Parents can access our high-quality, free PDF number tracing and counting worksheets directly from the Parents Corner for hands-on, screen-free practice.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>इंटरएक्टिव नंबर्स लर्निंग ज़ोन के बारे में</h2>
                <p>KidsFunLearnHub के नंबर्स लर्निंग ज़ोन में आपका स्वागत है! यह इंटरएक्टिव डिजिटल गणित बोर्ड शुरुआती शिक्षार्थियों को संख्याओं के जादू को समझने में मदद करने के लिए डिज़ाइन किया गया है। किसी भी अंक पर टैप करके उसे मज़ेदार, गिने जाने योग्य चित्रों के साथ जीवंत होते हुए देखें और उसका सटीक उच्चारण सुनें, जो अमूर्त संख्याओं को सीधे दृश्य मात्राओं से जोड़ता है।</p>
                <p><strong>सीखने के परिणाम:</strong> संख्या पहचान, 1-से-1 संगति (संख्या-मात्रा संबंध), प्रारंभिक गणित की तैयारी, और बहुभाषी गिनती शब्दावली।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>यह समझना कि प्रतीक "3" वास्तव में तीन भौतिक वस्तुओं का प्रतिनिधित्व करता है, एक छोटे बच्चे के लिए एक बड़ी मानसिक छलांग है। स्क्रीन पर किसी संख्या को टैप करके, बच्चों को तुरंत एक पॉप-अप मिलता है जो मज़ेदार वस्तुओं की सटीक मात्रा दिखाता है। यह आकर्षक कारण-और-प्रभाव तंत्र प्रभावी रूप से "1-से-1 संगति" सिखाता है, जो भविष्य के सभी गणित और समस्या-समाधान की पूर्ण नींव है।</p>
                        <p>हमारे विविध शुरुआती शिक्षार्थियों को पूरी तरह से समर्थन देने के लिए, इस इंटरैक्टिव गिनती टूल में इन-बिल्ट बहुभाषी ऑडियो है। जैसे ही गिनने योग्य वस्तुएं पॉप अप होती हैं, आपका बच्चा स्पष्ट मानवीय उच्चारण सुनेगा। वे अंग्रेजी में गिनती सीख सकते हैं, और तुरंत क्षेत्रीय देवनागरी समकक्षों को सुनने के लिए स्विच कर सकते हैं, जैसे कि हिंदी और मराठी में 'एक' (Ek) सीखना। यह प्रीस्कूल गणित के लिए एक अत्यधिक बहुमुखी, त्रिभाषी आधार बनाता है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या यह गतिविधि लिखना (ट्रेसिंग) सिखाती है या केवल गिनती?</strong><br>यह विशिष्ट पृष्ठ संख्या पहचान, श्रवण गिनती और मात्रा जुड़ाव पर भारी ध्यान केंद्रित करता है। यदि आपका बच्चा लिखना शुरू करने के लिए तैयार है, तो आप हमारे मुफ्त प्रिंट करने योग्य ट्रेसिंग संसाधनों का पता लगा सकते हैं।</p>
                        <p><strong>क्या मैं गिनती की वर्कशीट डाउनलोड कर सकता हूँ?</strong><br>हाँ! माता-पिता हाथों-हाथ, स्क्रीन-मुक्त अभ्यास के लिए सीधे पेरेंट्स कॉर्नर से हमारे उच्च गुणवत्ता वाले, मुफ्त पीडीएफ नंबर ट्रेसिंग और गिनती वर्कशीट्स तक पहुंच सकते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>इंटरएक्टिव नंबर्स लर्निंग झोनबद्दल</h2>
                <p>KidsFunLearnHub च्या नंबर्स लर्निंग झोनमध्ये आपले स्वागत आहे! हे इंटरएक्टिव्ह डिजिटल मॅथ बोर्ड सुरुवातीच्या शिकणाऱ्यांना संख्यांचे महत्त्व समजून घेण्यास मदत करण्यासाठी डिझाइन केलेले आहे. कोणत्याही अंकावर टॅप करून त्याला मजेदार, मोजण्यायोग्य चित्रांसह जिवंत होताना पहा आणि त्याचे अचूक उच्चारण ऐका, जे अमूर्त संख्यांना थेट दृश्य प्रमाणांशी जोडते.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> संख्या ओळख, 1-ते-1 संबंध (संख्या-प्रमाण ओळख), लवकर गणित शिकण्याची तयारी आणि बहुभाषिक मोजणी शब्दसंग्रह.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>"३" हे चिन्ह प्रत्यक्षात तीन भौतिक वस्तूंचे प्रतिनिधित्व करते हे समजणे लहान मुलासाठी एक मोठी मानसिक झेप आहे. स्क्रीनवरील संख्येवर टॅप केल्याने, मुलांना लगेचच एक पॉप-अप दिसते ज्यामध्ये मजेदार वस्तूंचे अचूक प्रमाण दर्शवले जाते. ही आकर्षक कृती प्रभावीपणे "1-ते-1 संबंध" शिकवते, जी भविष्यातील सर्व गणित आणि समस्या सोडवण्याचा मूळ पाया आहे.</p>
                        <p>आमच्या विविध बालमित्रांना पूर्ण पाठबळ देण्यासाठी, या इंटरएक्टिव्ह काउंटिंग टूलमध्ये इन-बिल्ट बहुभाषिक ऑडिओ समाविष्ट आहे. मोजण्यायोग्य वस्तू पॉप अप होताच, तुमचे मूल स्पष्ट मानवी उच्चारण ऐकेल. ते इंग्रजीत मोजायला शिकू शकतात आणि हिंदी आणि मराठीत 'एक' (Ek) यांसारखे प्रादेशिक देवनागरी उच्चार ऐकण्यासाठी त्वरित स्विच करू शकतात. हे प्रीस्कूल गणितासाठी एक अत्यंत उपयुक्त, त्रिभाषिक पाया तयार करते.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>ही ऍक्टिव्हिटी ट्रेसिंग (लेखन) शिकवते की फक्त मोजणी?</strong><br>हे विशिष्ट पृष्ठ प्रामुख्याने संख्या ओळख, ऑडिओ मोजणी आणि प्रमाण ओळख यावर लक्ष केंद्रित करते. जर तुमचे मूल लिहायला शिकण्यास तयार असेल, तर तुम्ही आमची मोफत प्रिंट करण्यायोग्य ट्रेसिंग संसाधने पाहू शकता.</p>
                        <p><strong>मी मोजणीच्या वर्कशीट्स डाउनलोड करू शकतो का?</strong><br>होय! प्रत्यक्ष अभ्यासासाठी पालकांना आमच्या उच्च दर्जाच्या, मोफत PDF नंबर ट्रेसिंग आणि काउंटिंग वर्कशीट्स थेट पेरेंट्स कॉर्नरवरून डाउनलोड करता येतील.</p>
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

    // Dictionary for 1-40
    const numbersDict = {
        "1": { en: "One", hi: "एक", mr: "एक" }, "2": { en: "Two", hi: "दो", mr: "दोन" },
        "3": { en: "Three", hi: "तीन", mr: "तीन" }, "4": { en: "Four", hi: "चार", mr: "चार" },
        "5": { en: "Five", hi: "पांच", mr: "पाच" }, "6": { en: "Six", hi: "छह", mr: "सहा" },
        "7": { en: "Seven", hi: "सात", mr: "सात" }, "8": { en: "Eight", hi: "आठ", mr: "आठ" },
        "9": { en: "Nine", hi: "नौ", mr: "नऊ" }, "10": { en: "Ten", hi: "दस", mr: "दहा" },
        "11": { en: "Eleven", hi: "ग्यारह", mr: "अकरा" }, "12": { en: "Twelve", hi: "बारह", mr: "बारा" },
        "13": { en: "Thirteen", hi: "तेरह", mr: "तेरा" }, "14": { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        "15": { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" }, "16": { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        "17": { en: "Seventeen", hi: "सत्रह", mr: "सतरा" }, "18": { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        "19": { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" }, "20": { en: "Twenty", hi: "बीस", mr: "वीस" },
        "21": { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" }, "22": { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        "23": { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" }, "24": { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        "25": { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" }, "26": { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        "27": { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" }, "28": { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        "29": { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" }, "30": { en: "Thirty", hi: "तीस", mr: "तीस" },
        "31": { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" }, "32": { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        "33": { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" }, "34": { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        "35": { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" }, "36": { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        "37": { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" }, "38": { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        "39": { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" }, "40": { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    const numbers = Object.keys(numbersDict);
    const PAGE_SIZE = 20; 
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("numberGrid");
    const popup = document.getElementById("popup");
    const popupImgDigit = document.getElementById("popupImgDigit");
    const popupRepeatedObjects = document.getElementById("popupRepeatedObjects");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");
    const closePopupBtn = document.getElementById("closePopupBtn");
    const traceBtn = document.getElementById("traceBtn");

    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    if (traceBtn) {
        if (currentLang === 'hi' || currentLang === 'mr') {
            traceBtn.href = "devnagaarinumberstrace.html";
        } else {
            traceBtn.href = "numberstrace.html";
        }
    }

    /////////////////////////////////////////////////
    // EXACT IMAGE MAPPING LOGIC (1 TO 40)
    /////////////////////////////////////////////////
    
    const availableImages = [
      "images/numberscount/sparrow.webp", "images/numberscount/tiger.webp", "images/numberscount/lion.webp",
      "images/numberscount/elephant.webp", "images/numberscount/dog.webp", "images/numberscount/ant.webp",
      "images/numberscount/butterfly.webp", "images/numberscount/t1.webp", "images/numberscount/capsicum.webp",
      "images/numberscount/cat.webp", "images/numberscount/17.webp", "images/numberscount/parrot.webp",
      "images/numberscount/pigeon.webp", "images/numberscount/cow.webp", "images/numberscount/guava.webp",
      "images/numberscount/housefly.webp", "images/numberscount/ladybug.webp", "images/numberscount/lotus.webp",
      "images/numberscount/monkey.webp", "images/numberscount/8.webp", "images/numberscount/onion.webp",
      "images/numberscount/panda.webp", "images/numberscount/potato.webp", "images/numberscount/rabbit.webp",
      "images/numberscount/rose.webp", "images/numberscount/beetroot.webp", "images/numberscount/okra.webp",
      "images/numberscount/9.webp", "images/numberscount/10.webp", "images/numberscount/13.webp",
      "images/numberscount/14.webp", "images/numberscount/18.webp", "images/numberscount/22.webp",
      "images/numberscount/23.webp", "images/numberscount/24.webp", "images/numberscount/star.webp",
      "images/numberscount/sunflower.webp", "images/numberscount/th2.webp", "images/numberscount/zinnia.webp"
    ];

    const numberImages = {};
    for (let i = 1; i <= 40; i++) {
      let index = (i - 1) % availableImages.length;
      numberImages[String(i)] = availableImages[index];
    }

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE
    /////////////////////////////////////////////////

    const imageCacheDigits = {};
    const soundCache = {};

    let imageFolder = 'en'; 
    if (currentLang === 'hi' || currentLang === 'mr') {
        imageFolder = 'devanagari'; 
    }

    numbers.forEach(num => {
      const imgDigit = new Image();
      imgDigit.src = `images/numbers/digits/${imageFolder}/${num}.webp`;
      imageCacheDigits[num] = imgDigit;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/numbers/${num}.mp3`;
      audio.preload = "auto";
      soundCache[num] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadPage() {
      if (!grid) return;
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      numbers.slice(start, end).forEach(num => {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Learn number " + num);

        card.innerHTML = `
          <img src="${imageCacheDigits[num].src}" alt="${num}">
        `;

        card.onclick = () => showNumber(num);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= numbers.length) {
            currentPage = 0; 
          }
          loadPage();
          window.scrollTo({ top: 0, behavior: 'smooth' }); 
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY (DYNAMICALLY GROWING IMAGES)
    /////////////////////////////////////////////////

    function showNumber(num) {
      num = String(num); 

      if (popupImgDigit) popupImgDigit.src = imageCacheDigits[num].src;
      
      if (popupRepeatedObjects) {
          const limit = parseInt(num);
          const isMobile = window.innerWidth <= 500;
          let dynamicSize = 100;
          
          // Image sizing tiers! They remain large enough to be easily counted, while CSS handles expanding the box.
          if (limit <= 4) {
              dynamicSize = isMobile ? 80 : 100;
          } else if (limit <= 9) {
              dynamicSize = isMobile ? 60 : 70;
          } else if (limit <= 16) {
              dynamicSize = isMobile ? 45 : 55;
          } else if (limit <= 25) {
              dynamicSize = isMobile ? 35 : 45;
          } else {
              dynamicSize = isMobile ? 30 : 38; 
          }

          let imagesHtml = '';
          const imgSrc = numberImages[num]; 
          
          for(let i = 0; i < limit; i++) {
              imagesHtml += `<img src="${imgSrc}" style="width: ${dynamicSize}px; height: ${dynamicSize}px; object-fit: contain; pointer-events: none; background: transparent; padding: 0; box-shadow: none; margin: 0;" alt="Object">`;
          }
          
          popupRepeatedObjects.innerHTML = imagesHtml;
      }

      if (popupName) popupName.textContent = numbersDict[num][currentLang];
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[num];
      if (sound) {
          sound.currentTime = 0;
          sound.play().catch(e => console.log("Sound play error: ", e));
      }

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
    loadPage();
};