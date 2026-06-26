"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE SETUP & TRANSLATIONS
    /////////////////////////////////////////////////
    let uiLang = localStorage.getItem('mySecretLanguage') || 'en';
    let contentLang = (uiLang === 'en') ? 'hi' : uiLang; // Forces Hindi/Marathi sounds for tracing

    const uiDictionary = {
        "page-title": { en: "✏️ Varnamala Tracing", hi: "✏️ वर्णमाला ट्रेसिंग", mr: "✏️ वर्णमाला ट्रेसिंग" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "btn-vyanjan": { en: "➡ Show Vyanjan", hi: "➡ व्यंजन देखें", mr: "➡ व्यंजन पहा" },
        "btn-swar": { en: "⬅ Show Swar", hi: "⬅ स्वर देखें", mr: "⬅ स्वर पहा" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { en: "Learn Varnamala", hi: "वर्णमाला सीखें", mr: "वर्णमाला शिका" },
        "activitiesBtn": { en: "Varnamala Activities", hi: "वर्णमाला गतिविधियां", mr: "वर्णमाला ऍक्टिव्हिटीज" },
        "seoText": {
            en: `
                <h2>About The Varnamala Tracing Zone</h2>
                <p>Welcome to the KidsFunLearnHub Varnamala Tracing Zone! Tap on any Devanagari letter to watch the magic pencil demonstrate exactly how to write it, stroke by stroke, beautifully guiding your child's early handwriting journey.</p>
                <p><strong>Learning Outcomes:</strong> Fine motor planning, Devanagari stroke order, Shirekha placement, and handwriting readiness.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Writing the Devanagari script requires specific directional strokes and the crucial top-line (Shirekha). The "magic pencil" animation breaks down these complex characters into intuitive, step-by-step movements. By visually tracking the pencil, toddlers subconsciously internalize the correct starting points and curves, preventing awkward pencil grips and incorrect formations later on.</p>
                        <p>We pair this essential visual-motor training with clear native audio. As children watch the Hindi and Marathi letters being constructed on the screen, they hear the correct pronunciations. This multi-sensory approach ensures they connect the physical drawing motion with the exact phonetic sound, solidifying their understanding of the alphabet.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Why is stroke order important?</strong><br>Correct stroke order prevents hand fatigue and ensures neat, legible handwriting as children transition from drawing single letters to writing full sentences.</p>
                        <p><strong>Can my child practice these strokes on paper?</strong><br>Yes! We highly recommend downloading our free, high-quality printable Varnamala tracing worksheets from the Parents Corner for physical pencil practice.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>वर्णमाला ट्रेसिंग ज़ोन के बारे में</h2>
                <p>KidsFunLearnHub वर्णमाला ट्रेसिंग ज़ोन में आपका स्वागत है! जादुई पेंसिल को स्ट्रोक दर स्ट्रोक, देवनागरी अक्षर लिखते हुए देखने के लिए किसी भी अक्षर पर टैप करें, जो आपके बच्चे की प्रारंभिक हस्तलेखन यात्रा का खूबसूरती से मार्गदर्शन करता है।</p>
                <p><strong>सीखने के परिणाम:</strong> ठीक गामक योजना (फाइन मोटर प्लानिंग), देवनागरी स्ट्रोक क्रम, शिरोरेखा प्लेसमेंट, और हस्तलेखन की तैयारी।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>देवनागरी लिपि लिखने के लिए विशिष्ट दिशात्मक स्ट्रोक और महत्वपूर्ण शीर्ष रेखा (शिरोरेखा) की आवश्यकता होती है। "जादुई पेंसिल" एनीमेशन इन जटिल अक्षरों को सहज, चरण-दर-चरण आंदोलनों में तोड़ देता है। पेंसिल को देखकर, बच्चे अवचेतन रूप से सही शुरुआती बिंदुओं और वक्रों को आत्मसात कर लेते हैं, जिससे बाद में गलत पेंसिल पकड़ और गलत बनावट को रोका जा सकता है।</p>
                        <p>हम इस आवश्यक दृश्य-मोटर प्रशिक्षण को स्पष्ट देशी ऑडियो के साथ जोड़ते हैं। जैसे ही बच्चे स्क्रीन पर हिंदी और मराठी अक्षरों को बनते हुए देखते हैं, वे सही उच्चारण सुनते हैं। यह बहु-संवेदी दृष्टिकोण यह सुनिश्चित करता है कि वे शारीरिक ड्राइंग गति को सटीक ध्वन्यात्मक ध्वनि के साथ जोड़ते हैं, जिससे वर्णमाला की उनकी समझ ठोस होती है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>स्ट्रोक का क्रम क्यों महत्वपूर्ण है?</strong><br>सही स्ट्रोक क्रम हाथ की थकान को रोकता है और यह सुनिश्चित करता है कि जब बच्चे एकल अक्षर खींचने से पूरे वाक्य लिखने की ओर बढ़ते हैं तो लिखावट साफ और सुपाठ्य हो।</p>
                        <p><strong>क्या मेरा बच्चा कागज पर इन स्ट्रोक्स का अभ्यास कर सकता है?</strong><br>हाँ! भौतिक पेंसिल अभ्यास के लिए हम पेरेंट्स कॉर्नर से हमारे मुफ्त, उच्च गुणवत्ता वाले प्रिंट करने योग्य वर्णमाला ट्रेसिंग वर्कशीट डाउनलोड करने की अत्यधिक अनुशंसा करते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>वर्णमाला ट्रेसिंग झोनबद्दल</h2>
                <p>KidsFunLearnHub वर्णमाला ट्रेसिंग झोनमध्ये आपले स्वागत आहे! जादूची पेन्सिल एकामागून एक रेषा ओढून देवनागरी अक्षर कसे काढते हे पाहण्यासाठी कोणत्याही अक्षरावर टॅप करा, जे तुमच्या मुलाच्या सुरुवातीच्या हस्ताक्षर प्रवासाला सुंदरपणे मार्गदर्शन करते.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> फाइन मोटर नियोजन, देवनागरी स्ट्रोक क्रम, शिरोरेषा आखणी आणि लेखनपूर्व तयारी.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>देवनागरी लिपी लिहिण्यासाठी विशिष्ट दिशात्मक स्ट्रोक आणि सर्वात महत्त्वाची वरची रेषा (शिरोरेषा) आवश्यक असते. "जादूची पेन्सिल" ॲनिमेशन या गुंतागुंतीच्या अक्षरांना सोप्या, टप्प्याटप्प्याच्या हालचालींमध्ये विभागते. पेन्सिलच्या हालचालींकडे पाहून, लहान मुले नकळतपणे योग्य सुरुवातीचे बिंदू आणि वक्र आत्मसात करतात, ज्यामुळे पुढे जाऊन पेन्सिल चुकीची पकडणे आणि चुकीची रचना करणे टळते.</p>
                        <p>आम्ही या आवश्यक व्हिज्युअल-मोटर प्रशिक्षणाला स्पष्ट मूळ ऑडिओची जोड देतो. स्क्रीनवर हिंदी आणि मराठी अक्षरे तयार होताना मुले पाहतात, तेव्हा त्यांना अचूक उच्चार ऐकू येतो. हा बहु-संवेदी दृष्टिकोन हे सुनिश्चित करतो की ते अक्षरे काढण्याच्या शारीरिक हालचालीला अचूक ध्वन्यात्मक आवाजाशी जोडतात, ज्यामुळे त्यांची वर्णमालेची समज पक्की होते.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>स्ट्रोकचा क्रम का महत्त्वाचा आहे?</strong><br>स्ट्रोकचा योग्य क्रम हाताचा थकवा टाळतो आणि जेव्हा मुले एकच अक्षर काढण्याकडून पूर्ण वाक्य लिहिण्याकडे वळतात तेव्हा हस्ताक्षर स्वच्छ आणि वाचनीय असल्याची खात्री देतो.</p>
                        <p><strong>माझे मूल कागदावर या स्ट्रोकचा सराव करू शकते का?</strong><br>होय! प्रत्यक्ष पेन्सिलच्या सरावासाठी आम्ही पेरेंट्स कॉर्नरवरून आमचे मोफत, उच्च दर्जाचे प्रिंट करण्यायोग्य वर्णमाला ट्रेसिंग वर्कशीट्स डाउनलोड करण्याची शिफारस करतो.</p>
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

    // Apply translations
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][uiLang];
    }

    /////////////////////////////////////////////////
    // 2. TRACING DICTIONARIES (Custom SVG Paths)
    /////////////////////////////////////////////////

    const swarTraceDict = [
        { letter: 'a', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 120 40 L 160 40"] },
        { letter: 'aa', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 40 L 170 170", "M 120 40 L 190 40"] },
        { letter: 'i', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 140, 100 140", "M 100 140 C 80 140, 70 150, 70 170", "M 70 40 L 140 40"] },
        
        { letter: 'ee', paths: ["M112.64,68.63L112.24,100.00", "M112.43,96.03C44.00,80.00,75.00,139.73,112.50,120.38", "M110.61,121.21C131.25,108.45,147.09,166.14,78.35,154.65", "M79.76,154.76C53.85,144.44,84.28,125.13,120.64,175.70", "M57.44,69.05L139.91,69.05", "M131.25,29.84C103.86,18.12,92.14,47.16,114.17,68.75"] },
        
        { letter: 'u', paths: ["M 70 50 C 130 30, 130 90, 80 100", "M 80 100 C 150 100, 150 170, 70 160", "M 50 40 L 140 40"] },
        { letter: 'oo', paths: ["M 70 50 C 130 30, 130 90, 80 100", "M 80 100 C 150 100, 150 170, 70 160", "M 115 125 C 150 120, 160 150, 160 170", "M 50 40 L 140 40"] },
        { letter: 'ri', paths: ["M 100 40 L 100 170", "M 50 80 L 100 120", "M 50 150 L 100 120", "M 100 100 C 130 80, 140 100, 120 120 C 100 140, 150 140, 150 170", "M 80 40 L 130 40"] },
        { letter: 'e', paths: ["M 80 40 L 80 100 L 130 160", "M 150 40 L 150 90 L 120 120", "M 60 40 L 170 40"] },
        { letter: 'ai', paths: ["M67.20,67.93L67.24,167.64", "M67.95,168.59C86.69,199.68,133.14,200.00,134.63,153.58", "M139.18,67.43C140.64,100.00,140.00,130.00,107.08,124.43", "M36.23,66.77L164.04,66.77", "M73.11,16.67C100.00,7.56,131.58,26.32,138.08,66.67"] },
        { letter: 'o', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 40 L 170 170", "M 150 10 L 170 40", "M 120 40 L 190 40"] },
        { letter: 'au', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 40 L 170 170", "M 130 10 L 160 40", "M 160 10 L 180 40", "M 120 40 L 190 40"] },
        { letter: 'ang', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 140 20 L 140 25", "M 120 40 L 160 40"] },
        { letter: 'aha', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 80 L 170 85", "M 170 130 L 170 135", "M 120 40 L 160 40"] }
    ];

    const vyanjanTraceDict = [
        // { letter: 'k', paths: ["M 100 40 L 100 170", "M 100 100 C 60 100, 60 140, 100 140", "M 100 100 C 140 100, 140 150, 160 160", "M 60 40 L 160 40"] },
        { letter: 'k', paths: ["M106.73,49.35L105.43,183.33", "M100.00,133.33C83.33,155.12,50.00,150.00,33.33,124.40C16.67,66.67,83.33,54.83,105.96,100.00C127.96,33.33,216.67,98.25,140.00,150.27", "M13.70,44.53L182.56,44.53"] },
        
        // { letter: 'kh', paths: ["M 60 60 C 100 30, 100 90, 70 120 L 70 160 L 140 160", "M 140 40 L 140 170", "M 140 100 C 100 100, 100 140, 140 140", "M 50 40 L 160 40"] },
        { letter: 'kh', paths: ["M60.00,40.00C100.00,73.60,72.60,120.00,30.18,100.00Q80.00,200.00,160.00,140.00", "M160.00,80.00C80.00,20.00,80.00,180.00,160.00,120.00", "M160.00,40.00L160.00,160.00", "M10.00,40.00L185.38,40.00"] },
        
        { letter: 'g', paths: ["M72.59,30.36L70.70,140.00C40.00,137.92,20.00,100.00,60.00,80.00", "M150.00,25.89L149.27,183.62", "M21.27,25.89L183.29,25.89"] },
        { letter: 'gh', paths: ["M53.06,20.00C40.00,40.00,42.70,100.00,102.43,85.75C0.00,100.00,80.00,220.00,140.00,140.00", "M150.00,20.00L148.62,188.65", "M10.00,20.00L184.46,20.00"] },
        { letter: 'ng', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 160, 100 160", "M 150 100 L 150 105", "M 70 40 L 140 40"] }, 

        { letter: 'ch', paths: ["M 60 100 L 110 100", "M 110 100 C 110 140, 150 140, 150 100", "M 150 40 L 150 170", "M 50 40 L 170 40"] },
        { letter: 'chh', paths: ["M80.00,74.13C20.00,40.30,0.00,138.63,80.00,117.36C-20.00,180.00,168.90,220.00,167.57,100.00C180.00,55.66,80.00,40.00,120.00,100.00Q140.00,120.00,160.00,109.05", "M130.03,33.63L130.19,61.11", "M13.78,33.59L190.00,33.77"] },
        { letter: 'j', paths: ["M 70 110 C 70 150, 110 150, 110 110", "M 110 110 L 150 110", "M 150 40 L 150 170", "M 60 40 L 170 40"] },
        { letter: 'jh', paths: ["M 90 40 L 90 70", "M 90 70 C 50 70, 50 110, 90 110", "M 90 110 C 130 110, 130 140, 90 140", "M 90 140 C 70 140, 60 150, 60 170", "M 100 110 L 150 110", "M 150 40 L 150 170", "M 60 40 L 170 40"] },
        { letter: 'ny', paths: ["M60.00,80.00C180.00,60.00,120.00,220.00,31.72,100.00", "M127.96,110.00L157.29,110.08", "M157.53,38.52L158.33,175.00", "M8.83,37.50L188.04,37.50"] },

        { letter: 't1', paths: ["M130.00,26.41L129.37,80.00C20.00,40.00,20.00,220.00,153.88,165.36", "M27.55,26.06L177.78,25.62"] },
        { letter: 'th1', paths: ["M 100 40 L 100 80", "M 100 80 C 150 80, 150 160, 100 160 C 50 160, 50 80, 100 80", "M 70 40 L 140 40"] },
        { letter: 'd1', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 160, 100 160", "M 70 40 L 140 40"] },
        { letter: 'dh1', paths: ["M130.00,29.57L129.65,78.57", "M130.06,72.47C22.22,55.56,22.22,188.89,129.34,175.53C188.89,136.12,111.11,77.78,105.03,146.67Q100.00,166.67,111.11,174.60", "M20.57,28.57L176.88,28.57"] },
        { letter: 'n1', paths: ["M 60 40 L 60 100 C 60 140, 100 140, 100 100 L 100 40", "M 140 40 L 140 170", "M 40 40 L 160 40"] },

        { letter: 't2', paths: ["M 140 40 L 140 170", "M 140 100 L 90 100 C 60 100, 60 130, 60 170", "M 50 40 L 160 40"] },
        { letter: 'th2', paths: ["M50.00,80.00C0.00,1.85,111.35,10.00,96.83,70.00Q90.00,100.00,44.68,100.00C36.36,130.00,100.00,190.00,140.00,110.00", "M141.36,36.90L140.00,188.09", "M123.23,35.88L176.83,36.26"] },
        { letter: 'd2', paths: ["M125.00,25.00L125.00,75.00", "M125.00,62.50C0.00,57.21,66.67,200.00,137.67,133.33", "M122.22,144.44C177.78,121.36,119.53,66.67,115.69,122.22Q115.44,155.56,146.43,177.78", "M30.21,25.05L170.00,26.50"] },
        { letter: 'dh2', paths: ["M91.17,62.16C80.00,-40.00,-40.00,80.00,91.71,92.12", "M84.75,92.12C25.00,116.67,51.38,200.00,138.40,141.67", "M139.46,33.33L138.23,191.67", "M125.29,33.33L175.88,33.33"] },
        { letter: 'n2', paths: ["M72.17,92.71C100.00,200.00,-20.00,60.00,72.17,92.71z", "M66.19,91.97L138.73,91.97", "M139.59,33.33L139.27,180.32", "M15.24,33.33L177.12,33.33"] },

        { letter: 'p', paths: ["M 70 40 L 70 110 C 70 140, 140 140, 140 110", "M 140 40 L 140 170", "M 50 40 L 160 40"] },
        { letter: 'ph', paths: ["M 70 40 L 70 100 C 70 130, 110 130, 110 100", "M 110 40 L 110 170", "M 110 100 C 140 100, 150 130, 150 160", "M 50 40 L 160 40"] },
        { letter: 'b', paths: ["M 140 40 L 140 170", "M 100 100 C 60 100, 60 140, 100 140 C 140 140, 140 100, 100 100", "M 80 110 L 120 130", "M 50 40 L 160 40"] },
        { letter: 'bh', paths: ["M40.00,80.00C-28.31,40.00,80.00,-20.00,73.05,60.00L73.13,146.45C0.00,100.00,33.00,100.00,146.63,109.44", "M148.95,31.69L147.99,180.00", "M127.72,31.03L180.04,31.03"] },
        { letter: 'm', paths: ["M70.00,36.81L69.94,141.67C44.98,141.67,21.05,98.49,70.21,110.53L144.00,110.53", "M144.07,37.50L143.56,179.04", "M21.43,36.57L178.57,36.56"] },

        { letter: 'y', paths: ["M62.62,30.00C90.00,50.00,90.00,90.00,49.75,100.00C58.33,158.33,108.33,158.33,144.38,116.67", "M145.48,28.17L145.69,187.50", "M20.24,28.74L181.23,28.74"] },
        { letter: 'r', paths: ["M104.82,27.30C144.44,55.56,130.80,115.79,77.78,111.11", "M64.13,88.89Q88.89,144.44,133.33,177.78","M35.52,27.89L165.54,27.89"] },
        { letter: 'l', paths: ["M107.10,111.27C100.00,-8.86,-40.00,120.00,100.00,172.00", "M107.51,100.52C88.89,66.67,133.33,55.56,148.02,77.78", "M149.70,37.89L149.28,173.30","M20.33,37.98L182.46,37.98"] },
        { letter: 'v', paths: ["M 140 40 L 140 170", "M 100 100 C 60 100, 60 140, 100 140 C 140 140, 140 100, 100 100", "M 50 40 L 160 40"] },

        { letter: 'sh', paths: ["M80.00,92.79C9.09,63.64,112.01,9.09,109.09,81.82", "M109.09,72.73C111.62,100.00,90.91,127.27,54.55,127.27", "M63.64,127.27C0.00,136.36,45.45,54.55,115.00,165.00", "M153.46,44.44L153.18,166.67", "M17.73,44.14L181.32,44.14"] },
        { letter: 'shh', paths: ["M 70 40 L 70 110 C 70 140, 140 140, 140 110", "M 140 40 L 140 170", "M 80 50 L 130 110", "M 50 40 L 160 40"] },
        { letter: 's', paths: ["M 60 60 C 100 30, 100 90, 70 110 L 70 160", "M 70 110 L 140 110", "M 140 40 L 140 170", "M 50 40 L 160 40"] },
        { letter: 'h', paths: ["M131.87,32.15L131.64,59.86C0.00,42.86,75.00,114.91,117.11,99.19C150.00,108.33,141.67,141.67,116.67,141.67", "M77.46,93.43C28.57,128.30,100.00,189.54,119.67,179.71", "M34.66,32.24L167.79,32.24"] },

        { letter: 'ksh', paths: ["M50.00,33.33C83.33,0.00,136.07,61.97,37.50,100.00C0.00,166.67,116.59,174.93,105.74,112.50C66.67,83.33,67.76,149.75,116.67,183.33",  "M72.23,22.84C0.00,40.00,60.00,94.33,144.74,71.43", "M145.04,28.57L144.21,157.14", "M131.07,28.57L179.97,28.57"] },
        { letter: 'tr', paths: ["M 140 40 L 140 170", "M 140 100 L 70 70", "M 140 100 L 70 140", "M 50 40 L 160 40"] },
        { letter: 'gy', paths: ["M140.00,60.00L58.61,60.00C140.00,100.00,100.00,140.00,51.87,131.09C36.16,60.00,100.00,140.00,102.11,180.00", "M141.93,27.74L141.56,154.16", "M31.81,27.24L169.64,27.24"] }
    ];

    /////////////////////////////////////////////////
    // 3. CORE LOGIC & AUDIO
    /////////////////////////////////////////////////
    const gridContainer = document.getElementById('varnamala-grid');
    const toggleBtn = document.getElementById('toggleBtn');
    
    let currentMode = "swar"; // Starts on Swar
    let currentAudio = null;
    let scribbleAudio = new Audio('sounds/scribble.mp3'); 
    scribbleAudio.loop = true; 

    const pencilSVG = `
        <svg width="40" height="40" x="-5" y="-35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" fill="#FFC107" stroke="#333" stroke-width="1"/>
        </svg>
    `;

    function animateSingleStroke(path, pencilGroup, duration, cardElement) {
        return new Promise(resolve => {
            const length = path.getTotalLength();
            let startTime = null;
            
            pencilGroup.style.display = 'block';
            scribbleAudio.play().catch(e => console.log("Sound error"));

            function step(timestamp) {
                if (cardElement.dataset.animating !== "true") {
                    scribbleAudio.pause();
                    return resolve(false); 
                }

                if (!startTime) startTime = timestamp;
                let progress = Math.min((timestamp - startTime) / duration, 1);
                let ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                path.style.strokeDashoffset = length - (length * ease);
                
                const point = path.getPointAtLength(length * ease);
                pencilGroup.setAttribute('transform', `translate(${point.x}, ${point.y})`);
                
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    scribbleAudio.pause(); 
                    resolve(true); 
                }
            }
            requestAnimationFrame(step);
        });
    }

    function closeCard(card) {
        card.classList.remove('active');
        card.dataset.animating = "false";
        scribbleAudio.pause();
        card.querySelector('.pencil-group').style.display = 'none';

        const lines = card.querySelectorAll('.tracing-line');
        if (card.dataset.finished === "true") {
            lines.forEach(line => line.style.strokeDashoffset = '0');
        } else {
            lines.forEach(line => line.style.strokeDashoffset = line.getTotalLength());
        }
    }

    async function openCard(cardElement, itemData) {
        cardElement.classList.add('active');
        cardElement.dataset.animating = "true";
        cardElement.dataset.finished = "false"; 
        
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        // Pulls sound from Hindi or Marathi folder based on selection
        currentAudio = new Audio(`sounds/${contentLang}/varnamala/${itemData.letter}.mp3`);
        currentAudio.play().catch(e => console.log("Sound missing"));

        const lines = cardElement.querySelectorAll('.tracing-line');
        lines.forEach(line => line.style.strokeDashoffset = line.getTotalLength());

        const pencilGroup = cardElement.querySelector('.pencil-group');
        await new Promise(r => setTimeout(r, 400)); 

        for (let i = 0; i < lines.length; i++) {
            if (cardElement.dataset.animating !== "true") return; 
            const completed = await animateSingleStroke(lines[i], pencilGroup, 1200, cardElement);
            if (!completed) return; 
            await new Promise(r => setTimeout(r, 300)); 
        }

        if (cardElement.dataset.animating === "true") {
            cardElement.dataset.finished = "true";
            cardElement.dataset.animating = "false";
            pencilGroup.style.display = 'none';
        }
    }

    /////////////////////////////////////////////////
    // 4. RENDER GRID (WITH 7/5 COLUMN FLEX LOGIC)
    /////////////////////////////////////////////////

    function renderGrid() {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        scribbleAudio.pause();

        // 7 columns for Swar, 5 columns for Vyanjan
        if (currentMode === "swar") {
            gridContainer.classList.add("swar-layout");
            gridContainer.classList.remove("vyanjan-layout");
        } else {
            gridContainer.classList.add("vyanjan-layout");
            gridContainer.classList.remove("swar-layout");
        }

        const activeData = currentMode === "swar" ? swarTraceDict : vyanjanTraceDict;

        activeData.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.animating = "false";
            cardElement.dataset.finished = "false";
            
            const guidePaths = item.paths.map(p => `<path class="guide-line" d="${p}"></path>`).join('');
            const tracingPaths = item.paths.map(p => `<path class="tracing-line" d="${p}"></path>`).join('');

            cardElement.innerHTML = `
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    ${guidePaths}
                    ${tracingPaths}
                    <g class="pencil-group" style="display: none;">
                        ${pencilSVG}
                    </g>
                </svg>
            `;

            gridContainer.appendChild(cardElement);

            const lines = cardElement.querySelectorAll('.tracing-line');
            lines.forEach(line => {
                const length = line.getTotalLength();
                line.style.strokeDasharray = length;
                line.style.strokeDashoffset = length;
            });

            cardElement.addEventListener('click', (e) => {
                e.stopPropagation(); 
                if (cardElement.classList.contains('active')) {
                    closeCard(cardElement);
                    return;
                }
                document.querySelectorAll('.card.active').forEach(c => closeCard(c));
                openCard(cardElement, item);
            });
        });

        // Update Toggle Button Text
        if (toggleBtn) {
            if (currentMode === "swar") {
                toggleBtn.innerHTML = uiDictionary["btn-vyanjan"][uiLang];
            } else {
                toggleBtn.innerHTML = uiDictionary["btn-swar"][uiLang];
            }
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            currentMode = currentMode === "swar" ? "vyanjan" : "swar";
            renderGrid();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Click anywhere outside to close the active card
    document.addEventListener('click', () => {
        document.querySelectorAll('.card.active').forEach(c => closeCard(c));
    });

    /////////////////////////////////////////////////
    // 5. CURSOR LOGIC
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

    // Initialize first load
    renderGrid();
};