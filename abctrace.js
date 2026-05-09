"use strict";

window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "✏️ Alphabet Tracing", hi: "✏️ अक्षर ट्रेसिंग", mr: "✏️ मुळाक्षरे ट्रेसिंग" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnAbcBtn": { en: "Learn ABC", hi: "एबीसी (ABC) सीखें", mr: "एबीसी (ABC) शिका" },
        "activitiesBtn": { en: "ABC Activities", hi: "एबीसी गतिविधियां", mr: "एबीसी ऍक्टिव्हिटीज" }
    };

    // Apply translations to UI elements
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerText = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 2. TRACING DATA
    /////////////////////////////////////////////////
    const alphabetData = [
        { letter: 'A', paths: ["M 100 20 L 40 180", "M 100 20 L 160 180", "M 65 120 L 135 120"] },
        { letter: 'B', paths: ["M 50 20 L 50 180", "M 50 20 C 130 20, 130 100, 50 100", "M 50 100 C 140 100, 140 180, 50 180"] },
        { letter: 'C', paths: ["M 160 40 A 70 70 0 1 0 160 160"] },
        { letter: 'D', paths: ["M 50 20 L 50 180", "M 50 20 C 150 20, 150 180, 50 180"] },
        { letter: 'E', paths: ["M 50 20 L 50 180", "M 50 20 L 150 20", "M 50 100 L 130 100", "M 50 180 L 150 180"] },
        { letter: 'F', paths: ["M 50 20 L 50 180", "M 50 20 L 150 20", "M 50 100 L 130 100"] },
        { letter: 'G', paths: ["M 160 40 A 70 70 0 1 0 160 160", "M 160 160 L 160 100", "M 110 100 L 160 100"] },
        { letter: 'H', paths: ["M 50 20 L 50 180", "M 150 20 L 150 180", "M 50 100 L 150 100"] },
        { letter: 'I', paths: ["M 100 20 L 100 180", "M 50 20 L 150 20", "M 50 180 L 150 180"] },
        { letter: 'J', paths: ["M 100 20 L 100 140 A 40 40 0 0 1 60 180", "M 50 20 L 150 20"] },
        { letter: 'K', paths: ["M 50 20 L 50 180", "M 140 20 L 50 100", "M 50 100 L 140 180"] },
        { letter: 'L', paths: ["M 50 20 L 50 180", "M 50 180 L 150 180"] },
        { letter: 'M', paths: ["M 40 20 L 40 180", "M 40 20 L 100 100", "M 160 20 L 100 100", "M 160 20 L 160 180"] },
        { letter: 'N', paths: ["M 40 20 L 40 180", "M 40 20 L 160 180", "M 160 20 L 160 180"] },
        { letter: 'O', paths: ["M 100 20 A 80 80 0 1 0 100 180 A 80 80 0 1 0 100 20"] },
        { letter: 'P', paths: ["M 50 20 L 50 180", "M 50 20 C 130 20, 130 100, 50 100"] },
        { letter: 'Q', paths: ["M 100 20 A 80 80 0 1 0 100 180 A 80 80 0 1 0 100 20", "M 120 130 L 170 180"] },
        { letter: 'R', paths: ["M 50 20 L 50 180", "M 50 20 C 130 20, 130 100, 50 100", "M 50 100 L 140 180"] },
        { letter: 'S', paths: ["M 150 40 C 150 0, 50 0, 50 60 C 50 110, 150 110, 150 160 C 150 210, 50 210, 50 170"] },
        { letter: 'T', paths: ["M 100 20 L 100 180", "M 30 20 L 170 20"] },
        { letter: 'U', paths: ["M 50 20 L 50 130 A 50 50 0 0 0 150 130 L 150 20"] },
        { letter: 'V', paths: ["M 40 20 L 100 180", "M 160 20 L 100 180"] },
        { letter: 'W', paths: ["M 30 20 L 65 180", "M 100 100 L 65 180", "M 100 100 L 135 180", "M 170 20 L 135 180"] },
        { letter: 'X', paths: ["M 40 20 L 160 180", "M 160 20 L 40 180"] },
        { letter: 'Y', paths: ["M 40 20 L 100 100", "M 160 20 L 100 100", "M 100 100 L 100 180"] },
        { letter: 'Z', paths: ["M 40 20 L 160 20", "M 160 20 L 40 180", "M 40 180 L 160 180"] }
    ];

    const gridContainer = document.getElementById('alphabet-grid');
    let currentAudio = null;
    let scribbleAudio = new Audio('sounds/scribble.mp3'); 
    scribbleAudio.loop = true; 

    const pencilSVG = `
        <svg width="40" height="40" x="-5" y="-35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" fill="#FFC107" stroke="#333" stroke-width="1"/>
        </svg>
    `;

    /////////////////////////////////////////////////
    // 3. ANIMATION HELPERS
    /////////////////////////////////////////////////

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
        
        // Use translation-aware sound path (e.g., sounds/hi/abc/a.mp3)
        if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
        currentAudio = new Audio(`sounds/${currentLang}/abc/${itemData.letter.toLowerCase()}.mp3`);
        currentAudio.play().catch(e => console.log("Letter sound missing"));

        const lines = cardElement.querySelectorAll('.tracing-line');
        lines.forEach(line => line.style.strokeDashoffset = line.getTotalLength());

        const pencilGroup = cardElement.querySelector('.pencil-group');
        await new Promise(r => setTimeout(r, 400)); 

        for (let i = 0; i < lines.length; i++) {
            if (cardElement.dataset.animating !== "true") return; 
            const completed = await animateSingleStroke(lines[i], pencilGroup, 1500, cardElement);
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
    // 4. BUILD THE GRID
    /////////////////////////////////////////////////

    if (gridContainer) {
        alphabetData.forEach(item => {
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
                e.stopPropagation(); // Prevents document click from immediately closing it
                if (cardElement.classList.contains('active')) {
                    closeCard(cardElement);
                    return;
                }
                document.querySelectorAll('.card.active').forEach(c => closeCard(c));
                openCard(cardElement, item);
            });
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
};