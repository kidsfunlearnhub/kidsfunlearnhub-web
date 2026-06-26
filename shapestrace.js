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
    let currentLang = sessionStorage.getItem('shapesTracePageLang') || globalLang;

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
                sessionStorage.setItem('shapesTracePageLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "✏️ Shape Tracing", hi: "✏️ आकार ट्रेसिंग", mr: "✏️ आकार ट्रेसिंग" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { en: "Learn Shapes", hi: "आकार सीखें", mr: "आकार शिका" },
        "activitiesBtn": { en: "Shapes Activities", hi: "आकार गतिविधियां", mr: "आकार ऍक्टिव्हिटीज" },
        "seoText": {
            en: `
                <h2>About The Shape Tracing Zone</h2>
                <p>Welcome to the KidsFunLearnHub Shape Tracing Zone! Tap on any shape to watch the magic pencil draw it stroke by stroke. This interactive digital canvas helps toddlers and preschoolers develop the foundational fine motor movements needed for drawing and writing by guiding them through basic 2D geometry.</p>
                <p><strong>Learning Outcomes:</strong> Fine motor planning, directional stroke order, geometric construction, and pre-writing readiness.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Before a child can write complex letters or numbers, they must master basic directional strokes—like the continuous curve of a circle or the sharp, intersecting straight lines of a triangle. The "magic pencil" animation breaks down these geometric shapes into intuitive steps. By watching the pencil move, toddlers subconsciously internalize the correct starting points and angles necessary for handwriting, preventing awkward pencil grips and reversed strokes later on.</p>
                        <p>We pair this essential visual-motor training with our signature trilingual audio system. As children watch the shapes being constructed on the screen, they hear the correct pronunciations. A child tracing a square simultaneously connects the physical drawing motion with its English name, as well as its regional Hindi and Marathi equivalents, such as 'Chaukon' (चौकोन). This multi-sensory approach solidifies their understanding of spatial concepts in their native language.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Why is shape tracing important before letter tracing?</strong><br>All letters and numbers are fundamentally made up of basic shapes! For example, writing the letter 'A' requires mastering the slanted lines of a triangle, and 'O' requires the continuous curve of a circle.</p>
                        <p><strong>Can my child practice drawing these shapes on paper?</strong><br>Absolutely! We highly recommend downloading our free, high-quality printable shape tracing worksheets from the Parents Corner to help your child transition these digital concepts into physical pencil-and-paper practice.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>शेप ट्रेसिंग ज़ोन के बारे में</h2>
                <p>KidsFunLearnHub के शेप ट्रेसिंग ज़ोन में आपका स्वागत है! जादू की पेंसिल को स्ट्रोक दर स्ट्रोक आकार बनाते हुए देखने के लिए किसी भी आकृति पर टैप करें। यह इंटरैक्टिव डिजिटल कैनवास बच्चों को बुनियादी 2D ज्यामिति के माध्यम से मार्गदर्शन करके ड्राइंग और लेखन के लिए आवश्यक बुनियादी गामक (फाइन मोटर) आंदोलनों को विकसित करने में मदद करता है।</p>
                <p><strong>सीखने के परिणाम:</strong> ठीक गामक योजना (फाइन मोटर प्लानिंग), दिशात्मक स्ट्रोक क्रम, ज्यामितीय निर्माण, और लेखन-पूर्व तैयारी।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>इससे पहले कि कोई बच्चा जटिल अक्षर या संख्याएं लिख सके, उन्हें बुनियादी दिशात्मक स्ट्रोक में महारत हासिल करनी होगी—जैसे कि एक वृत्त का निरंतर वक्र या एक त्रिकोण की तेज, आपस में काटने वाली सीधी रेखाएं। "जादुई पेंसिल" एनीमेशन इन ज्यामितीय आकारों को सहज चरणों में तोड़ता है। पेंसिल को चलते हुए देखकर, बच्चे अवचेतन रूप से हस्तलेखन के लिए आवश्यक सही शुरुआती बिंदुओं और कोणों को आत्मसात कर लेते हैं, जिससे बाद में गलत पेंसिल पकड़ और उल्टे स्ट्रोक को रोका जा सकता है।</p>
                        <p>हम इस आवश्यक दृश्य-मोटर प्रशिक्षण को हमारे सिग्नेचर त्रिभाषी ऑडियो सिस्टम के साथ जोड़ते हैं। जैसे-जैसे बच्चे स्क्रीन पर आकृतियों को बनते हुए देखते हैं, वे सही उच्चारण सुनते हैं। एक चौकोर आकार को ट्रेस करने वाला बच्चा एक साथ शारीरिक ड्राइंग गति को उसके अंग्रेजी नाम के साथ-साथ उसके क्षेत्रीय हिंदी और मराठी समकक्षों, जैसे 'चौकोन' (Chaukon) से जोड़ता है। यह बहु-संवेदी दृष्टिकोण उनकी मूल भाषा में स्थानिक अवधारणाओं की समझ को ठोस बनाता है।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>अक्षर ट्रेसिंग से पहले आकार (शेप) ट्रेसिंग क्यों महत्वपूर्ण है?</strong><br>सभी अक्षर और संख्याएं मूल रूप से बुनियादी आकारों से बनी हैं! उदाहरण के लिए, अक्षर 'A' लिखने के लिए एक त्रिकोण की तिरछी रेखाओं में महारत हासिल करने की आवश्यकता होती है, और 'O' के लिए एक वृत्त के निरंतर वक्र की आवश्यकता होती है।</p>
                        <p><strong>क्या मेरा बच्चा इन आकारों को कागज पर बनाने का अभ्यास कर सकता है?</strong><br>बिल्कुल! हम इन डिजिटल अवधारणाओं को भौतिक पेंसिल और कागज के अभ्यास में बदलने में आपके बच्चे की मदद करने के लिए पेरेंट्स कॉर्नर से हमारे मुफ्त, उच्च गुणवत्ता वाले प्रिंट करने योग्य आकार ट्रेसिंग वर्कशीट डाउनलोड करने की अत्यधिक अनुशंसा करते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>शेप ट्रेसिंग झोनबद्दल</h2>
                <p>KidsFunLearnHub च्या शेप ट्रेसिंग झोनमध्ये आपले स्वागत आहे! जादूची पेन्सिल एकामागून एक रेषा ओढून आकार कसा काढते हे पाहण्यासाठी कोणत्याही आकारावर टॅप करा। हे इंटरएक्टिव्ह डिजिटल कॅनव्हास लहान मुलांना मूलभूत 2D भूमितीद्वारे मार्गदर्शन करून चित्र काढण्यासाठी आणि लिहिण्यासाठी आवश्यक असलेल्या हातांच्या स्नायूंच्या हालचाली (फाइन मोटर स्किल्स) विकसित करण्यास मदत करते.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> फाइन मोटर नियोजन, दिशात्मक स्ट्रोक क्रम, भूमितीय रचना आणि लेखनपूर्व तयारी.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>मुलाने गुंतागुंतीची अक्षरे किंवा संख्या लिहिण्यापूर्वी, त्याने मूलभूत दिशात्मक रेषांवर प्रभुत्व मिळवणे आवश्यक आहे—जसे की वर्तुळाचा सलग वक्र किंवा त्रिकोणाच्या टोकदार, एकमेकांना छेदणाऱ्या सरळ रेषा. "जादूची पेन्सिल" ॲनिमेशन या भूमितीय आकारांना सोप्या टप्प्यांत विभागते. पेन्सिल फिरताना पाहून, लहान मुले हस्ताक्षरासाठी आवश्यक असलेले योग्य सुरवातीचे बिंदू आणि कोन नकळत आत्मसात करतात, ज्यामुळे पुढे जाऊन पेन्सिल चुकीची पकडणे किंवा उलट्या रेषा ओढणे टाळता येते.</p>
                        <p>आम्ही या आवश्यक व्हिज्युअल-मोटर प्रशिक्षणाला आमच्या सिग्नेचर त्रिभाषिक ऑडिओ सिस्टीमशी जोडतो. मुले स्क्रीनवर आकार तयार होताना पाहत असताना, त्यांना योग्य उच्चारण ऐकू येते. चौकोन ट्रेस करणारे मूल शारीरिक चित्र काढण्याच्या हालचालीला त्याच्या इंग्रजी नावाशी, तसेच त्याच्या प्रादेशिक हिंदी आणि मराठी शब्द 'चौकोन' (Chaukon) शी जोडते. हा बहु-संवेदी दृष्टिकोन त्यांच्या मातृभाषेतील अवकाशीय संकल्पनांची समज दृढ करतो.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>अक्षर ट्रेसिंगपूर्वी आकार (शेप) ट्रेसिंग का महत्त्वाचे आहे?</strong><br>सर्व अक्षरे आणि संख्या मुळात मूलभूत आकारांपासून बनलेली असतात! उदाहरणार्थ, 'A' हे अक्षर लिहिण्यासाठी त्रिकोणाच्या तिरप्या रेषांवर प्रभुत्व मिळवणे आवश्यक आहे आणि 'O' साठी वर्तुळाच्या सलग वक्राची आवश्यकता असते.</p>
                        <p><strong>माझे मूल कागदावर हे आकार काढण्याचा सराव करू शकते का?</strong><br>नक्कीच! या डिजिटल संकल्पनांना प्रत्यक्ष पेन्सिल आणि कागदाच्या सरावात बदलण्यासाठी आम्ही पेरेंट्स कॉर्नरवरून आमचे मोफत, उच्च दर्जाचे प्रिंट करण्यायोग्य शेप ट्रेसिंग वर्कशीट्स डाउनलोड करण्याची शिफारस करतो.</p>
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

    /////////////////////////////////////////////////
    // 3. SHAPE DATA
    /////////////////////////////////////////////////
    const shapeData = [
        { 
            name: 'circle', 
            paths: ["M 100 40 A 60 60 0 1 1 100 160 A 60 60 0 1 1 100 40"], 
            audioFile: "circle.mp3" 
        },
        { 
            name: 'square', 
            paths: ["M 50 50 L 150 50 L 150 150 L 50 150 L 50 50"], 
            audioFile: "square.mp3" 
        },
        { 
            name: 'triangle', 
            paths: ["M 100 40 L 160 150 L 40 150 L 100 40"], 
            audioFile: "triangle.mp3" 
        },
        { 
            name: 'rectangle', 
            paths: ["M 30 60 L 170 60 L 170 140 L 30 140 L 30 60"], 
            audioFile: "rectangle.mp3" 
        },
        { 
            name: 'star', 
            paths: ["M 100 30 L 120 80 L 175 80 L 130 115 L 145 170 L 100 135 L 55 170 L 70 115 L 25 80 L 80 80 L 100 30"], 
            audioFile: "star.mp3" 
        },
        { 
            name: 'heart', 
            paths: ["M 100 60 C 100 60 80 30 50 30 C 20 30 20 80 20 80 C 20 110 100 170 100 170 C 100 170 180 110 180 80 C 180 80 180 30 150 30 C 120 30 100 60 100 60"], 
            audioFile: "heart.mp3" 
        },
        { 
            name: 'oval', 
            paths: ["M 100 50 A 70 50 0 1 1 100 150 A 70 50 0 1 1 100 50"], 
            audioFile: "oval.mp3" 
        },
        { 
            name: 'diamond', 
            paths: ["M 100 40 L 160 100 L 100 160 L 40 100 L 100 40"], 
            audioFile: "diamond.mp3" 
        },
        { 
            name: 'pentagon', 
            paths: ["M 100 40 L 160 85 L 135 160 L 65 160 L 40 85 L 100 40"], 
            audioFile: "pentagon.mp3" 
        },
        { 
            name: 'hexagon', 
            paths: ["M 100 40 L 150 70 L 150 130 L 100 160 L 50 130 L 50 70 L 100 40"], 
            audioFile: "hexagon.mp3" 
        }
    ];

    /////////////////////////////////////////////////
    // 4. CORE ANIMATION LOGIC & AUDIO
    /////////////////////////////////////////////////
    const gridContainer = document.getElementById('shapes-grid');

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
            lines.forEach(line => { line.style.strokeDashoffset = '0'; });
        } else {
            lines.forEach(line => { line.style.strokeDashoffset = line.getTotalLength(); });
        }
    }

    async function openCard(cardElement, itemData) {
        cardElement.classList.add('active');
        cardElement.dataset.animating = "true";
        cardElement.dataset.finished = "false"; 
        
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        
        // Correctly pulls audio based on the active language selected!
        currentAudio = new Audio(`sounds/${currentLang}/shapes/${itemData.audioFile}`);
        currentAudio.play().catch(e => console.log("Sound missing"));

        const lines = cardElement.querySelectorAll('.tracing-line');
        lines.forEach(line => { line.style.strokeDashoffset = line.getTotalLength(); });
        const pencilGroup = cardElement.querySelector('.pencil-group');

        await new Promise(r => setTimeout(r, 400)); 

        for (let i = 0; i < lines.length; i++) {
            if (cardElement.dataset.animating !== "true") return; 
            const completed = await animateSingleStroke(lines[i], pencilGroup, 2000, cardElement);
            if (!completed) return; 
            await new Promise(r => setTimeout(r, 200)); 
        }

        if (cardElement.dataset.animating === "true") {
            cardElement.dataset.finished = "true";
            cardElement.dataset.animating = "false";
            pencilGroup.style.display = 'none';
        }
    }

    /////////////////////////////////////////////////
    // 5. GRID GENERATION
    /////////////////////////////////////////////////
    if (gridContainer) {
        shapeData.forEach(item => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.animating = "false";
            cardElement.dataset.finished = "false";
            
            const guidePaths = item.paths.map(p => `<path class="guide-line" d="${p}"></path>`).join('');
            const tracingPaths = item.paths.map(p => `<path class="tracing-line" d="${p}"></path>`).join('');

            cardElement.innerHTML = `
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-label="Trace ${item.name}">
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
    }

    // Close shapes if clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.card.active').forEach(c => closeCard(c));
    });

    /////////////////////////////////////////////////
    // 6. CLEANUP LOGIC ON EXIT
    /////////////////////////////////////////////////
    const cleanupSession = () => sessionStorage.removeItem('shapesTracePageLang');
    
    document.getElementById("backBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("homeBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("hubBtnNav")?.addEventListener("click", cleanupSession);
    document.getElementById("learnBtn")?.addEventListener("click", cleanupSession);
    document.getElementById("activitiesBtn")?.addEventListener("click", cleanupSession);
};