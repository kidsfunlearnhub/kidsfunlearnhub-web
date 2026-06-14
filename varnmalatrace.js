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
            en: "Welcome to the <strong>KidsFunLearnHub Varnamala Tracing Zone</strong>! Tap on any letter to watch the magic pencil show you exactly how to write the Devanagari script, stroke by stroke. This helps children develop fine motor skills and memorize letter formation.",
            hi: "<strong>KidsFunLearnHub वर्णमाला ट्रेसिंग ज़ोन</strong> में आपका स्वागत है! देवनागरी लिपि को स्ट्रोक दर स्ट्रोक लिखना सीखने के लिए किसी भी अक्षर पर टैप करें। यह बच्चों में मोटर कौशल विकसित करने और अक्षरों की बनावट को याद रखने में मदद करता है।",
            mr: "<strong>KidsFunLearnHub वर्णमाला ट्रेसिंग झोनमध्ये</strong> आपले स्वागत आहे! देवनागरी लिपी स्ट्रोक बाय स्ट्रोक कशी लिहायची हे पाहण्यासाठी कोणत्याही अक्षरावर टॅप करा. हे मुलांना मोटर कौशल्ये विकसित करण्यास आणि अक्षरांची रचना लक्षात ठेवण्यास मदत करते."
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
        // { letter: 'a', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 120 40 L 160 40"] },
        { letter: 'a', paths: ["M67.57,75.45C85.17,67.18,102.22,90.50,73.39,98.37C110.51,104.75,82.35,141.72,60.69,117.88", "M76.12,98.37L108.52,98.91", "M109.64,78.16L109.64,125.20", "M99.15,78.16L122.18,77.95"] },
   {letter: 'a', 
  paths: [
    "M 43.2 57.0 C 74.0 42.6, 103.9 83.4, 53.4 97.1 C 118.4 108.3, 69.1 173.0, 31.2 131.3", 
    "M 58.2 97.1 L 114.9 98.1", 
    "M 116.9 61.8 L 116.9 144.1", 
    "M 98.5 61.8 L 138.8 61.4"
  ] },
        { letter: 'aa', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 40 L 170 170", "M 120 40 L 190 40"] },
        { letter: 'i', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 140, 100 140", "M 100 140 C 80 140, 70 150, 70 170", "M 70 40 L 140 40"] },
        { letter: 'ee', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 140, 100 140", "M 100 140 C 80 140, 70 150, 70 170", "M 100 40 C 130 10, 150 10, 150 30", "M 70 40 L 140 40"] },
        
        { letter: 'ee', paths: ["M71.43,33.39L147.19,33.39", "M134.13,169.23C99.96,182.52,99.96,129.36,78.72,138.61C117.04,142.65,168.29,129.36,117.04,103.80C44.93,108.73,44.93,73.67,96.18,65.19L95.50,38.61C82.23,11.97,116.39,-1.32,131.08,11.97"] },
        
        { letter: 'u', paths: ["M 70 50 C 130 30, 130 90, 80 100", "M 80 100 C 150 100, 150 170, 70 160", "M 50 40 L 140 40"] },
        { letter: 'oo', paths: ["M 70 50 C 130 30, 130 90, 80 100", "M 80 100 C 150 100, 150 170, 70 160", "M 115 125 C 150 120, 160 150, 160 170", "M 50 40 L 140 40"] },
        { letter: 'ri', paths: ["M 100 40 L 100 170", "M 50 80 L 100 120", "M 50 150 L 100 120", "M 100 100 C 130 80, 140 100, 120 120 C 100 140, 150 140, 150 170", "M 80 40 L 130 40"] },
        { letter: 'e', paths: ["M 80 40 L 80 100 L 130 160", "M 150 40 L 150 90 L 120 120", "M 60 40 L 170 40"] },
        { letter: 'ai', paths: ["M 80 40 L 80 100 L 130 160", "M 150 40 L 150 90 L 120 120", "M 130 10 L 100 40", "M 60 40 L 170 40"] },
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
        { letter: 'ny', paths: ["M 100 60 C 50 60, 50 140, 100 140 C 120 140, 120 100, 100 100", "M 120 100 L 160 100", "M 160 40 L 160 170", "M 60 40 L 180 40"] },

        { letter: 't1', paths: ["M 100 40 L 100 80", "M 100 80 C 140 80, 140 150, 100 150 C 70 150, 60 130, 60 110", "M 70 40 L 140 40"] },
        { letter: 'th1', paths: ["M 100 40 L 100 80", "M 100 80 C 150 80, 150 160, 100 160 C 50 160, 50 80, 100 80", "M 70 40 L 140 40"] },
        { letter: 'd1', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 160, 100 160", "M 70 40 L 140 40"] },
        { letter: 'dh1', paths: ["M 100 40 L 100 80", "M 100 80 C 140 80, 140 150, 100 150 C 70 150, 60 130, 60 110 C 60 120, 80 130, 90 120", "M 70 40 L 140 40"] },
        { letter: 'n1', paths: ["M 60 40 L 60 100 C 60 140, 100 140, 100 100 L 100 40", "M 140 40 L 140 170", "M 40 40 L 160 40"] },

        { letter: 't2', paths: ["M 140 40 L 140 170", "M 140 100 L 90 100 C 60 100, 60 130, 60 170", "M 50 40 L 160 40"] },
        { letter: 'th2', paths: ["M 70 60 C 70 30, 110 30, 110 60 C 110 90, 70 90, 70 120 L 70 150 L 150 150", "M 150 40 L 150 170", "M 110 40 L 170 40"] },
        { letter: 'd2', paths: ["M 100 40 L 100 80", "M 100 80 C 140 80, 140 150, 100 150 C 70 150, 60 130, 60 110", "M 90 145 C 70 150, 60 160, 60 180", "M 70 40 L 140 40"] },
        { letter: 'dh2', paths: ["M 70 60 C 70 30, 110 30, 110 60 C 110 90, 80 90, 80 120 C 80 150, 120 150, 120 120 L 150 120", "M 150 40 L 150 170", "M 120 40 L 170 40"] },
        { letter: 'n2', paths: ["M 60 110 C 60 80, 100 80, 100 110 C 100 140, 60 140, 60 110", "M 100 110 L 150 110", "M 150 40 L 150 170", "M 50 40 L 170 40"] },

        { letter: 'p', paths: ["M 70 40 L 70 110 C 70 140, 140 140, 140 110", "M 140 40 L 140 170", "M 50 40 L 160 40"] },
        { letter: 'ph', paths: ["M 70 40 L 70 100 C 70 130, 110 130, 110 100", "M 110 40 L 110 170", "M 110 100 C 140 100, 150 130, 150 160", "M 50 40 L 160 40"] },
        { letter: 'b', paths: ["M 140 40 L 140 170", "M 100 100 C 60 100, 60 140, 100 140 C 140 140, 140 100, 100 100", "M 80 110 L 120 130", "M 50 40 L 160 40"] },
        { letter: 'bh', paths: ["M 70 60 C 70 30, 100 30, 100 60 C 100 90, 70 120, 70 120 L 140 120", "M 140 40 L 140 170", "M 110 40 L 160 40"] },
        { letter: 'm', paths: ["M 70 40 L 70 120 L 140 120", "M 70 120 C 70 140, 90 140, 90 120", "M 140 40 L 140 170", "M 50 40 L 160 40"] },

        { letter: 'y', paths: ["M 60 60 C 100 30, 110 70, 80 90 C 120 90, 120 140, 90 160 L 150 160", "M 150 40 L 150 170", "M 50 40 L 170 40"] },
        { letter: 'r', paths: ["M 60 60 C 100 30, 100 90, 70 110 L 70 160", "M 50 40 L 130 40"] },
        { letter: 'l', paths: ["M 150 40 L 150 170", "M 150 100 C 110 100, 110 140, 80 140 C 60 140, 60 100, 80 100 C 100 100, 110 130, 110 130", "M 60 40 L 170 40"] },
        { letter: 'v', paths: ["M 140 40 L 140 170", "M 100 100 C 60 100, 60 140, 100 140 C 140 140, 140 100, 100 100", "M 50 40 L 160 40"] },

        { letter: 'sh', paths: ["M 70 60 C 70 30, 110 30, 110 60 C 110 90, 70 90, 70 120 L 70 160", "M 140 40 L 140 170", "M 110 40 L 160 40"] },
        { letter: 'shh', paths: ["M 70 40 L 70 110 C 70 140, 140 140, 140 110", "M 140 40 L 140 170", "M 80 50 L 130 110", "M 50 40 L 160 40"] },
        { letter: 's', paths: ["M 60 60 C 100 30, 100 90, 70 110 L 70 160", "M 70 110 L 140 110", "M 140 40 L 140 170", "M 50 40 L 160 40"] },
        { letter: 'h', paths: ["M 100 40 L 100 80", "M 100 80 C 130 80, 130 120, 100 120 C 80 120, 70 100, 70 100", "M 90 110 C 130 110, 130 160, 90 160 C 70 160, 60 140, 60 140", "M 70 40 L 140 40"] },

        { letter: 'ksh', paths: ["M 140 40 L 140 170", "M 140 100 L 90 100 C 60 100, 60 70, 90 70 C 110 70, 110 100, 90 120 C 70 140, 70 160, 100 160 L 110 160", "M 50 40 L 160 40"] },
        { letter: 'tr', paths: ["M 140 40 L 140 170", "M 140 100 L 70 70", "M 140 100 L 70 140", "M 50 40 L 160 40"] },
        { letter: 'gy', paths: ["M 140 40 L 140 170", "M 140 100 L 100 100 C 70 100, 70 140, 100 140 C 120 140, 120 100, 100 100 L 100 120 L 120 160", "M 50 40 L 160 40"] }
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