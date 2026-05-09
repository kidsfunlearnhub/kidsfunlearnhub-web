"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "🔢 Numbers Tracing 1-40", hi: "🔢 नंबर ट्रेसिंग 1-40", mr: "🔢 अंक ट्रेसिंग 1-40" },
        "btn-next": { en: "Show 21 to 40 ➡️", hi: "21 से 40 दिखाएं ➡️", mr: "21 ते 40 दाखवा ➡️" },
        "btn-prev": { en: "⬅️ Show 1 to 20", hi: "⬅️ 1 से 20 दिखाएं", mr: "⬅️ 1 ते 20 दाखवा" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
        "activitiesBtn": { en: "Numbers Activities", hi: "नंबर गतिविधियां", mr: "अंक ऍक्टिव्हिटीज" }
    };

    // Apply translations to UI elements
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerText = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 2. THE AUTO-GENERATOR (1 to 40)
    /////////////////////////////////////////////////
    const baseDigits = {
        '0': ["M 50 40 C 20 40 20 160 50 160 C 80 160 80 40 50 40"],
        '1': ["M 35 60 L 50 40 L 50 160", "M 35 160 L 65 160"],
        '2': ["M 25 80 C 25 40 75 40 75 80 C 75 120 25 160 25 160", "M 25 160 L 75 160"],
        '3': ["M 25 60 C 75 30 75 100 50 100", "M 50 100 C 85 100 85 170 25 150"],
        '4': ["M 65 160 L 65 40 L 15 120 L 85 120"],
        '5': ["M 75 40 L 30 40 L 30 100 C 80 80 85 170 30 160"],
        '6': ["M 70 40 C 25 20 15 160 50 160 C 80 160 80 100 50 100 C 25 100 30 150 50 160"],
        '7': ["M 20 40 L 80 40 L 40 160"],
        '8': ["M 50 100 C 80 60 50 20 25 60 C 5 100 95 100 75 140 C 50 180 20 140 50 100"],
        '9': ["M 70 70 C 70 20 30 20 30 70 C 30 120 70 120 70 70 L 70 160"]
    };

    function shiftPath(path, shiftX) {
        return path.replace(/([-\d.]+)\s+([-\d.]+)/g, (match, x, y) => {
            return `${parseFloat(x) + shiftX} ${y}`;
        });
    }

    const numberData = [];
    for (let i = 1; i <= 40; i++) {
        let strNum = i.toString();
        let finalPaths = [];
        
        if (strNum.length === 1) {
            finalPaths = baseDigits[strNum].map(p => shiftPath(p, 50));
        } else {
            let tensDigit = strNum[0];
            let onesDigit = strNum[1];
            finalPaths = [
                ...baseDigits[tensDigit].map(p => shiftPath(p, 10)), 
                ...baseDigits[onesDigit].map(p => shiftPath(p, 90))  
            ];
        }
        
        numberData.push({
            number: strNum,
            paths: finalPaths,
            audioFile: `${i}.mp3` 
        });
    }

    /////////////////////////////////////////////////
    // 3. ANIMATION HELPERS
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
        
        // Translated Audio Path matching your language structure
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        currentAudio = new Audio(`sounds/${currentLang}/numbers/${itemData.audioFile}`);
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
                e.stopPropagation(); // Prevents document click from instantly closing
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

    // Initialize first page
    renderGrid(0, 20);
};