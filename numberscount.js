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
    // 2. LANGUAGE SETUP & DICTIONARIES
    /////////////////////////////////////////////////
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🔢 Learn Numbers", hi: "🔢 नंबर सीखें", mr: "🔢 क्रमांक शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "btnNext": { en: "21 to 40 ➡️", hi: "२१ से ४० ➡️", mr: "२१ ते ४० ➡️" },
        "btnPrev": { en: "⬅️ 1 to 20", hi: "⬅️ १ से २०", mr: "⬅️ १ ते २०" },
        "closeHint": { en: "Tap here to close ✖", hi: "बंद करने के लिए टैप करें ✖", mr: "बंद करण्यासाठी टॅप करा ✖" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
        "activitiesBtn": { en: "Numbers Activities", hi: "नंबर गतिविधियां", mr: "अंक ऍक्टिव्हिटीज" },
        "seoText": {
            en: `
                <h2>About The Interactive Counting Zone</h2>
                <p>Welcome to the KidsFunLearnHub Interactive Counting Zone! This vibrant early math activity teaches toddlers how to count by bringing numbers to life. Tap on any number card and watch as fun, colorful objects pop onto the screen one by one while a friendly voice counts them out loud.</p>
                <p><strong>Learning Outcomes:</strong> Sequential counting, 1-to-1 correspondence, auditory number association, and early math fluency.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>The secret to building a strong mathematical foundation is teaching children that numbers represent physical amounts, not just a memorized song. By watching objects pop onto the screen <em>one by one</em> in perfect sync with the audio, toddlers grasp the crucial concept of 1-to-1 correspondence. This sequential, visual counting ensures they understand that each spoken number correlates directly to exactly one new object on the screen.</p>
                        <p>This step-by-step counting mechanic is incredibly engaging for early learners. As the child taps the cards, the synchronized visual and auditory feedback reinforces their working memory. To further support bilingual households, this counting tool also introduces sequential counting in regional languages. Children can hear the objects counted out loud in English, Hindi, or Marathi, seamlessly connecting physical quantities to their native vocabulary.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Why is counting objects one-by-one important?</strong><br>It prevents "rote counting"—a phase where toddlers recite numbers like a song without actually understanding quantity. Counting items one at a time forces them to assign a single number value to a single physical object.</p>
                        <p><strong>Do you have printable counting worksheets?</strong><br>Yes! You can download our free "Count and Color" PDF worksheets from the Parents Corner so your child can practice these exact counting skills offline with physical crayons.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>इंटरएक्टिव काउंटिंग ज़ोन के बारे में</h2>
                <p>KidsFunLearnHub के इंटरएक्टिव काउंटिंग ज़ोन में आपका स्वागत है! यह जीवंत प्रारंभिक गणित गतिविधि संख्याओं को जीवंत करके बच्चों को गिनती करना सिखाती है। किसी भी नंबर कार्ड पर टैप करें और देखें कि कैसे मज़ेदार, रंगीन वस्तुएं एक-एक करके स्क्रीन पर पॉप अप होती हैं जबकि एक अनुकूल आवाज़ उन्हें ज़ोर से गिनती है।</p>
                <p><strong>सीखने के परिणाम:</strong> अनुक्रमिक गिनती, 1-से-1 संगति, श्रवण संख्या जुड़ाव, और प्रारंभिक गणित प्रवाह।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>एक मजबूत गणितीय आधार बनाने का रहस्य बच्चों को यह सिखाना है कि संख्याएँ भौतिक मात्राओं का प्रतिनिधित्व करती हैं, न कि केवल एक रटी-रटाई कविता का। ऑडियो के साथ पूर्ण तालमेल में स्क्रीन पर वस्तुओं को <em>एक-एक करके</em> आते हुए देखकर, बच्चे 1-से-1 संगति की महत्वपूर्ण अवधारणा को समझते हैं। यह अनुक्रमिक, दृश्य गिनती यह सुनिश्चित करती है कि वे समझें कि प्रत्येक बोली जाने वाली संख्या सीधे स्क्रीन पर ठीक एक नई वस्तु से संबंधित है।</p>
                        <p>यह चरण-दर-चरण गिनती तंत्र शुरुआती शिक्षार्थियों के लिए अविश्वसनीय रूप से आकर्षक है। जैसे ही बच्चा कार्ड टैप करता है, सिंक्रोनाइज़्ड विज़ुअल और ऑडियो फीडबैक उनकी कार्यशील स्मृति को मजबूत करता है। द्विभाषी घरों का समर्थन करने के लिए, यह गिनती टूल क्षेत्रीय भाषाओं में भी अनुक्रमिक गिनती पेश करता है। बच्चे अंग्रेजी, हिंदी या मराठी में वस्तुओं की गिनती ज़ोर से सुन सकते हैं, जिससे भौतिक मात्राएँ उनकी मूल भाषा से आसानी से जुड़ जाती हैं।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>एक-एक करके वस्तुओं की गिनती करना क्यों महत्वपूर्ण है?</strong><br>यह "रटने वाली गिनती" को रोकता है—एक ऐसा चरण जहाँ बच्चे वास्तव में मात्रा को समझे बिना गाने की तरह नंबर सुनाते हैं। एक बार में एक वस्तु को गिनना उन्हें एक भौतिक वस्तु को एक एकल संख्या मान निर्दिष्ट करने के लिए मजबूर करता है।</p>
                        <p><strong>क्या आपके पास प्रिंट करने योग्य गिनती की वर्कशीट हैं?</strong><br>हाँ! आप पेरेंट्स कॉर्नर से हमारी मुफ्त "काउंट एंड कलर" पीडीएफ वर्कशीट्स डाउनलोड कर सकते हैं ताकि आपका बच्चा वास्तविक क्रेयॉन के साथ ऑफ़लाइन इन सटीक गिनती कौशलों का अभ्यास कर सके।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>इंटरएक्टिव काउंटिंग झोनबद्दल</h2>
                <p>KidsFunLearnHub च्या इंटरएक्टिव्ह काउंटिंग झोनमध्ये आपले स्वागत आहे! ही रंगतदार प्रारंभिक गणित ऍक्टिव्हिटी संख्यांना जिवंत करून लहान मुलांना मोजणी करायला शिकवते. कोणत्याही नंबर कार्डवर टॅप करा आणि पहा की कशा मजेदार, रंगीबेरंगी वस्तू एक-एक करून स्क्रीनवर पॉप अप होतात तर एक अनुकूल आवाज त्यांना मोठ्याने मोजतो.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> अनुक्रमिक मोजणी, 1-ते-1 संबंध, ऑडिओ संख्या ओळख आणि प्रारंभिक गणितीय नैपुण्य.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>एक भक्कम गणितीय पाया तयार करण्याचे रहस्य मुलांना हे शिकवण्यात आहे की संख्या हे केवळ एक पाठ केलेले गाणे नसून भौतिक प्रमाणांचे प्रतिनिधित्व करतात. ऑडिओच्या अचूक सिंक्रोनाइझेशनमध्ये स्क्रीनवर वस्तू <em>एक-एक करून</em> पॉप अप होताना पाहून, लहान मुले 1-ते-1 संबंधांची महत्त्वपूर्ण संकल्पना समजून घेतात. ही अनुक्रमिक, दृश्यमान मोजणी हे सुनिश्चित करते की त्यांना समजेल की प्रत्येक बोललेला नंबर थेट स्क्रीनवरील एका नवीन वस्तूसोबत जोडलेला आहे.</p>
                        <p>ही टप्प्याटप्प्याने मोजण्याची पद्धत सुरुवातीच्या शिकणाऱ्यांसाठी अत्यंत आकर्षक आहे. मूल जसे कार्ड टॅप करते, तसे सिंक्रोनाइझ केलेले व्हिज्युअल आणि ऑडिओ प्रतिसाद त्यांच्या स्मरणशक्तीला बळकट करतात. द्विभाषिक कुटुंबांना मदत करण्यासाठी, हे काउंटिंग टूल प्रादेशिक भाषांमध्ये अनुक्रमिक मोजणी देखील सादर करते. मुले इंग्रजी, हिंदी किंवा मराठीत वस्तूंची मोजणी मोठ्याने ऐकू शकतात, ज्यामुळे भौतिक प्रमाण त्यांच्या मातृभाषेशी सहज जोडले जाते.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>एक-एक करून वस्तू मोजणे का महत्त्वाचे आहे?</strong><br>हे "पोपटपंची मोजणी" रोखते—अशी पायरी जिथे मुले संख्येचे प्रमाण न समजता गाण्यासारखे अंक पाठ करतात. एका वेळी एक वस्तू मोजल्याने त्यांना एका भौतिक वस्तूला एकच संख्या मूल्य देण्यास मदत होते.</p>
                        <p><strong>तुमच्याकडे प्रिंट करण्यायोग्य काउंटिंग वर्कशीट्स आहेत का?</strong><br>होय! तुम्ही पेरेंट्स कॉर्नरवरून आमची मोफत "काउंट अँड कलर" PDF वर्कशीट्स डाउनलोड करू शकता जेणेकरून तुमचे मूल प्रत्यक्ष क्रेयॉनच्या सहाय्याने स्क्रीनशिवाय या मोजणी कौशल्याचा सराव करू शकेल.</p>
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

    const numbersDict = {
        1: { en: "One", hi: "एक", mr: "एक" },
        2: { en: "Two", hi: "दो", mr: "दोन" },
        3: { en: "Three", hi: "तीन", mr: "तीन" },
        4: { en: "Four", hi: "चार", mr: "चार" },
        5: { en: "Five", hi: "पांच", mr: "पाच" },
        6: { en: "Six", hi: "छह", mr: "सहा" },
        7: { en: "Seven", hi: "सात", mr: "सात" },
        8: { en: "Eight", hi: "आठ", mr: "आठ" },
        9: { en: "Nine", hi: "नौ", mr: "नऊ" },
        10: { en: "Ten", hi: "दस", mr: "दहा" },
        11: { en: "Eleven", hi: "ग्यारह", mr: "अकरा" },
        12: { en: "Twelve", hi: "बारह", mr: "बारा" },
        13: { en: "Thirteen", hi: "तेरह", mr: "तेरा" },
        14: { en: "Fourteen", hi: "चौदह", mr: "चौदा" },
        15: { en: "Fifteen", hi: "पंद्रह", mr: "पंधरा" },
        16: { en: "Sixteen", hi: "सोलह", mr: "सोळा" },
        17: { en: "Seventeen", hi: "सत्रह", mr: "सतरा" },
        18: { en: "Eighteen", hi: "अठारह", mr: "अठरा" },
        19: { en: "Nineteen", hi: "उन्नीस", mr: "एकोणीस" },
        20: { en: "Twenty", hi: "बीस", mr: "वीस" },
        21: { en: "Twenty-one", hi: "इक्कीस", mr: "एकवीस" },
        22: { en: "Twenty-two", hi: "बाईस", mr: "बावीस" },
        23: { en: "Twenty-three", hi: "तेईस", mr: "तेवीस" },
        24: { en: "Twenty-four", hi: "चौबीस", mr: "चोवीस" },
        25: { en: "Twenty-five", hi: "पच्चीस", mr: "पंचवीस" },
        26: { en: "Twenty-six", hi: "छब्बीस", mr: "सव्वीस" },
        27: { en: "Twenty-seven", hi: "सत्ताईस", mr: "सत्तावीस" },
        28: { en: "Twenty-eight", hi: "अट्ठाईस", mr: "अठ्ठावीस" },
        29: { en: "Twenty-nine", hi: "उन्तीस", mr: "एकोणतीस" },
        30: { en: "Thirty", hi: "तीस", mr: "तीस" },
        31: { en: "Thirty-one", hi: "इकतीस", mr: "एकतीस" },
        32: { en: "Thirty-two", hi: "बत्तीस", mr: "बत्तीस" },
        33: { en: "Thirty-three", hi: "तैंतीस", mr: "तेहतीस" },
        34: { en: "Thirty-four", hi: "चौंतीस", mr: "चौतीस" },
        35: { en: "Thirty-five", hi: "पैंतीस", mr: "पस्तीस" },
        36: { en: "Thirty-six", hi: "छत्तीस", mr: "छत्तीस" },
        37: { en: "Thirty-seven", hi: "सैंतीस", mr: "सदतीस" },
        38: { en: "Thirty-eight", hi: "अड़तीस", mr: "अडतीस" },
        39: { en: "Thirty-nine", hi: "उनतालीस", mr: "एकोणचाळीस" },
        40: { en: "Forty", hi: "चालीस", mr: "चाळीस" }
    };

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    ////////////////////////////////////////////////////////
    // 3. NUMBER TRANSLATOR FUNCTION
    ////////////////////////////////////////////////////////
    function getLocalDigit(num) {
        if (currentLang === 'hi' || currentLang === 'mr') {
            const devanagariDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
            return num.toString().split('').map(digit => devanagariDigits[digit]).join('');
        }
        return num; 
    }

    ////////////////////////////////////////////////////////
    // 4. IMAGE MAP
    ////////////////////////////////////////////////////////
    const availableImages = [
      "images/numberscount/sparrow.webp",
      "images/numberscount/tiger.webp",
      "images/numberscount/lion.webp",
      "images/numberscount/elephant.webp",
      "images/numberscount/dog.webp",

      "images/numberscount/ant.webp",
      "images/numberscount/butterfly.webp",
      "images/numberscount/t1.webp",
      "images/numberscount/capsicum.webp",
      "images/numberscount/cat.webp",
      "images/numberscount/17.webp",
      "images/numberscount/parrot.webp",
      "images/numberscount/pigeon.webp",
      "images/numberscount/cow.webp",
      "images/numberscount/guava.webp",
      "images/numberscount/housefly.webp",
      "images/numberscount/ladybug.webp",
       "images/numberscount/lotus.webp",
      "images/numberscount/monkey.webp",
      "images/numberscount/8.webp",
      
      "images/numberscount/onion.webp",
      "images/numberscount/panda.webp",
      
      "images/numberscount/potato.webp",
      "images/numberscount/rabbit.webp",
      "images/numberscount/rose.webp",
      "images/numberscount/beetroot.webp",

      "images/numberscount/okra.webp",
      "images/numberscount/9.webp",
      "images/numberscount/10.webp",
      "images/numberscount/13.webp",
      "images/numberscount/14.webp",
    
      "images/numberscount/18.webp",
      "images/numberscount/22.webp",
      "images/numberscount/23.webp",
      "images/numberscount/24.webp",

      "images/numberscount/star.webp",
      "images/numberscount/sunflower.webp",
      "images/numberscount/th2.webp",
      "images/numberscount/zinnia.webp",

      
     
    ];

    const numberImages = {};
    for (let i = 1; i <= 40; i++) {
      numberImages[i] = availableImages[(i - 1) % availableImages.length];
    }

    ////////////////////////////////////////////////////////
    // 5. ELEMENTS & PAGINATION
    ////////////////////////////////////////////////////////
    const grid = document.getElementById("numbersGrid");
    const overlay = document.getElementById("counterOverlay");
    const square = document.getElementById("counterSquare");
    const circle = document.getElementById("counterCircle");
    const counterValue = document.getElementById("counterValue");
    const imageContainer = document.getElementById("imageContainer");
    const popupName = document.getElementById("popupName");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    let countInterval;
    let currentPage = 0; // 0 = (1-20), 1 = (21-40)
    const PAGE_SIZE = 20;

    function renderGrid() {
      grid.innerHTML = ""; 

      const startNum = (currentPage * PAGE_SIZE) + 1; 
      const endNum = startNum + PAGE_SIZE - 1;        

      for (let i = startNum; i <= endNum; i++) {
        const card = document.createElement("div");
        card.className = "card";
        card.setAttribute("role", "button");
        
        card.textContent = getLocalDigit(i);
        
        card.onclick = () => startCounting(i);
        grid.appendChild(card);
      }

      if (btnPrev) btnPrev.style.display = currentPage === 0 ? "none" : "block";
      if (btnNext) btnNext.style.display = currentPage === 1 ? "none" : "block";
    }

    if (btnNext) {
        btnNext.onclick = () => {
          currentPage = 1;
          renderGrid();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    if (btnPrev) {
        btnPrev.onclick = () => {
          currentPage = 0;
          renderGrid();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    renderGrid();

    ////////////////////////////////////////////////////////
    // 6. COUNTING LOGIC & AUDIO
    ////////////////////////////////////////////////////////
    function startCounting(finalNumber) {
      clearInterval(countInterval);

      let count = 0;
      counterValue.textContent = getLocalDigit(0); 
      imageContainer.innerHTML = ""; 
      popupName.textContent = ""; 

      // FIX: Used classList.remove instead of style.display to override the CSS !important rule
      overlay.classList.remove("hidden");
      overlay.style.display = "flex"; // Ensures flex layout applies properly once unhidden

      square.style.animation = "none";
      square.offsetHeight; 
      square.style.animation = "popup 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";

      countInterval = setInterval(() => {
        count++;
        
        counterValue.textContent = getLocalDigit(count);

        const audio = new Audio(`sounds/${currentLang}/numbers/${count}.mp3`);
        audio.play().catch(e => console.log("Sound not found for:", count));

        circle.style.background = randomGradient();

        const img = document.createElement("img");
        img.src = numberImages[finalNumber];
        img.className = "countImg";
        imageContainer.appendChild(img);

        if (count === finalNumber) {
          clearInterval(countInterval);
          
          popupName.textContent = numbersDict[finalNumber][currentLang];
          launchConfetti();
        }
      }, 600); // 600ms gap between each count pop
    }

    ////////////////////////////////////////////////////////
    // 7. CLOSE LOGIC & HELPERS
    ////////////////////////////////////////////////////////
    function closeOverlay() {
      clearInterval(countInterval);
      
      // FIX: Used classList.add to re-hide the popup correctly
      overlay.classList.add("hidden");
      
      // Clear out the images so they don't flash the next time it opens
      setTimeout(() => {
          imageContainer.innerHTML = ""; 
          popupName.textContent = ""; 
      }, 300);
    }

    overlay.onclick = closeOverlay;
    square.onclick = (e) => {
      e.stopPropagation(); 
    };
    
    // Allow clicking the close text specifically
    const closeHint = document.getElementById("closeHint");
    if (closeHint) {
        closeHint.onclick = (e) => {
            closeOverlay();
            e.stopPropagation();
        };
    }

    function randomGradient() {
      return `linear-gradient(135deg,
        hsl(${Math.random() * 360}, 85%, 55%),
        hsl(${Math.random() * 360}, 85%, 45%))`;
    }

    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }
    }
});