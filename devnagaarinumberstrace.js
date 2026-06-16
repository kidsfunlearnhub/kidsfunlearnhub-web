"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE SETUP & TRANSLATIONS
    /////////////////////////////////////////////////
    let uiLang = localStorage.getItem('mySecretLanguage') || 'hi';
    if(uiLang === 'en') uiLang = 'hi'; // Default Devanagari UI to Hindi if English is active

    const uiDictionary = {
        "page-title": { hi: "🔢 नंबर ट्रेसिंग (१-४०)", mr: "🔢 क्रमांक ट्रेसिंग (१-४०)" },
        "homeBtnNav": { hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "btn-next": { hi: "२१ से ४० दिखाएं ➡️", mr: "२१ ते ४० दाखवा ➡️" },
        "btn-prev": { hi: "⬅️ १ से २० दिखाएं", mr: "⬅️ १ ते २० दाखवा" },
        "backBtn": { hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { hi: "नंबर सीखें", mr: "अंक शिका" },
        "activitiesBtn": { hi: "नंबर गतिविधियां", mr: "अंक ऍक्टिव्हिटीज" },
        "seoText": {
            hi: "<strong>KidsFunLearnHub देवनागरी नंबर ट्रेसिंग ज़ोन</strong> में आपका स्वागत है! देवनागरी नंबरों (१ से ४०) को स्ट्रोक दर स्ट्रोक लिखना सीखने के लिए किसी भी नंबर पर टैप करें। यह बच्चों में मोटर कौशल और गिनती की क्षमताओं को बढ़ाने में मदद करता है।",
            mr: "<strong>KidsFunLearnHub देवनागरी क्रमांक ट्रेसिंग झोनमध्ये</strong> आपले स्वागत आहे! देवनागरी क्रमांक (१ ते ४०) स्ट्रोक बाय स्ट्रोक कसे लिहायचे हे पाहण्यासाठी कोणत्याही क्रमांकावर टॅप करा. हे मुलांना मोटर कौशल्ये आणि मोजणी क्षमता वाढविण्यास मदत करते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][uiLang];
    }

    /////////////////////////////////////////////////
    // 2. THE AUTO-GENERATOR (DEVANAGARI BASE PATHS)
    /////////////////////////////////////////////////
    
    // Base SVG Paths for Devanagari 0-9 (०-९)
    const devanagariBase = {
            '0': ["M127.55,40.48C152.62,52.03,162.77,83.47,150.22,110.70C137.67,137.93,107.18,150.63,82.10,139.08C57.03,127.52,46.88,96.08,59.43,68.85C71.98,41.63,102.48,28.92,127.55,40.48z"], // ० (Shunya)
            '1': ["M102.91,90.91C9.09,63.64,100.00,-18.18,125.75,60.00Q118.18,90.91,73.63,112.43", "M81.82,109.09C103.08,136.36,141.78,145.45,120.26,181.82"], // १ (Ek)
            '2': ["M66.67,50.92C122.22,0.00,188.89,100.00,77.78,119.26","M90.03,118.35C30.00,130.00,77.78,29.07,130.00,180.00"], // २ (Do)
            '3': ["M63.64,45.45C118.18,0.00,166.60,72.73,81.82,84.34","M90.24,82.80C145.45,73.14,163.64,145.45,81.82,136.36","M90.91,136.36C45.45,143.56,81.82,52.54,113.26,177.62"], // ३ (Teen)
            '4': ["M44.71,38.33C100.00,77.68,177.78,157.59,103.13,162.07","M105.05,161.90C40.00,155.95,111.15,73.08,154.43,40.00"], // ४ (Char)
            '5': ["M66.67,27.78C35.63,66.67,85.71,171.43,132.68,100.00","M130.00,104.00C166.67,41.67,50.99,47.37,158.33,183.33"], // ५ (Paanch)
            '6': ["M123.33,26.67C25.00,1.25,50.00,100.78,131.90,75.00", "M130.19,75.47C9.09,73.24,87.50,175.00,137.50,130.67","M136.31,131.85C166.67,100.00,72.99,88.46,150.00,184.62"], // ६ (Chhah)
            '7': ["M40.92,32.68C55.56,188.89,157.14,214.29,160.42,104.64", "M160.43,111.07C157.14,-28.57,0.00,81.82,157.87,133.33"], // ७ (Saat)
            '8': ["M130.92,32.91C0.00,115.82,77.78,211.11,145.45,145.45"], // ८ (Aath)
            '9': ["M77.05,93.09C140.00,113.86,150.90,23.57,76.19,28.57", "M79.64,28.57C30.00,31.13,77.78,111.11,125.00,143.75", "M116.67,137.81Q143.75,156.25,115.20,174.39"] // ९ (Nau)
    };

    // function shiftPath(path, shiftX) {
    //     return path.replace(/([-\d.]+)\s+([-\d.]+)/g, (match, x, y) => {
    //         return `${parseFloat(x) + shiftX} ${y}`;
    //     });
    // }

    function shiftPath(path, shiftX) {
    // The [,\s]+ allows it to read coordinates separated by commas OR spaces
    return path.replace(/([-\d.]+)[,\s]+([-\d.]+)/g, (match, x, y) => {
        return `${parseFloat(x) + shiftX} ${y}`;
    });
}

    // // Generates the final paths array up to 40
    // const numberData = [];
    // for (let i = 1; i <= 40; i++) {
    //     let strNum = i.toString();
    //     let finalPaths = [];
        
    //     if (strNum.length === 1) {
    //         // Single digit: Center it (Shift right by 50px)
    //         finalPaths = devanagariBase[strNum].map(p => shiftPath(p, 50));
    //     } else {
    //         // Double digit: Shift tens left, Shift ones right
    //         let tensDigit = strNum[0];
    //         let onesDigit = strNum[1];
    //         finalPaths = [
    //             ...devanagariBase[tensDigit].map(p => shiftPath(p, 10)), 
    //             ...devanagariBase[onesDigit].map(p => shiftPath(p, 90))  
    //         ];
    //     }

    // Generates the final paths array up to 40
    const numberData = [];
    for (let i = 1; i <= 40; i++) {
        let strNum = i.toString();
        let finalPaths = [];
        
        if (strNum.length === 1) {
            // Single digit: Since you draw them centered, shift by 0
            finalPaths = devanagariBase[strNum].map(p => shiftPath(p, 0));
        } else {
            // Double digit: Shift the tens digit LEFT (-45), and ones digit RIGHT (+45)
            let tensDigit = strNum[0];
            let onesDigit = strNum[1];
            finalPaths = [
                ...devanagariBase[tensDigit].map(p => shiftPath(p, -50)), 
                ...devanagariBase[onesDigit].map(p => shiftPath(p, 50))  
            ];
        }
        // ... (keep the rest of the loop the same)
        
        numberData.push({
            number: strNum,
            paths: finalPaths,
            audioFile: `${i}.mp3` // Pulls the exact same sound files as English numbers!
        });
    }

    /////////////////////////////////////////////////
    // 3. CORE LOGIC & AUDIO
    /////////////////////////////////////////////////
    const gridContainer = document.getElementById('number-grid');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

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
        currentAudio = new Audio(`sounds/${uiLang}/numbers/${itemData.audioFile}`);
        currentAudio.play().catch(e => console.log("Sound missing"));

        const lines = cardElement.querySelectorAll('.tracing-line');
        lines.forEach(line => { line.style.strokeDashoffset = line.getTotalLength(); });
        const pencilGroup = cardElement.querySelector('.pencil-group');

        await new Promise(r => setTimeout(r, 400)); 

        for (let i = 0; i < lines.length; i++) {
            if (cardElement.dataset.animating !== "true") return; 
            const completed = await animateSingleStroke(lines[i], pencilGroup, 1000, cardElement); 
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
    // 4. PAGINATION LOGIC
    /////////////////////////////////////////////////
    function renderGrid(startIndex, endIndex) {
        if (!gridContainer) return;
        gridContainer.innerHTML = '';
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        scribbleAudio.pause();

        const pageData = numberData.slice(startIndex, endIndex);

        pageData.forEach(item => {
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
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            renderGrid(20, 40); // Load 21-40
            btnNext.style.display = 'none'; 
            btnPrev.style.display = 'block'; 
            window.scrollTo({ top: 0, behavior: 'smooth' }); 
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            renderGrid(0, 20); // Load 1-20
            btnPrev.style.display = 'none'; 
            btnNext.style.display = 'block'; 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

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

    // Initialize first page
    renderGrid(0, 20);
};