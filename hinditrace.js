// Hindi Varnmala Data
// Remember: The Shirorekha (Top Line) is ALWAYS the last string in the paths array!
const hindiData = [
    // --- SWAR (VOWELS) ---
    { letter: 'अ', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 120 40 L 160 40"], audioFile: "a_hi.mp3" },
    { letter: 'आ', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 40 L 170 170", "M 120 40 L 190 40"], audioFile: "aa_hi.mp3" },
    { letter: 'इ', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 140, 100 140", "M 100 140 C 80 140, 70 150, 70 170", "M 70 40 L 140 40"], audioFile: "i_hi.mp3" },
    { letter: 'ई', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 140, 100 140", "M 100 140 C 80 140, 70 150, 70 170", "M 100 40 C 130 10, 150 10, 150 30", "M 70 40 L 140 40"], audioFile: "ee_hi.mp3" },
    { letter: 'उ', paths: ["M 70 50 C 130 30, 130 90, 80 100", "M 80 100 C 150 100, 150 170, 70 160", "M 50 40 L 140 40"], audioFile: "u_hi.mp3" },
    { letter: 'ऊ', paths: ["M 70 50 C 130 30, 130 90, 80 100", "M 80 100 C 150 100, 150 170, 70 160", "M 115 125 C 150 120, 160 150, 160 170", "M 50 40 L 140 40"], audioFile: "oo_hi.mp3" },
    { letter: 'ऋ', paths: ["M 100 40 L 100 170", "M 50 80 L 100 120", "M 50 150 L 100 120", "M 100 100 C 130 80, 140 100, 120 120 C 100 140, 150 140, 150 170", "M 80 40 L 130 40"], audioFile: "ri_hi.mp3" },
    { letter: 'ए', paths: ["M 80 40 L 80 100 L 130 160", "M 150 40 L 150 90 L 120 120", "M 60 40 L 170 40"], audioFile: "e_hi.mp3" },
    { letter: 'ऐ', paths: ["M 80 40 L 80 100 L 130 160", "M 150 40 L 150 90 L 120 120", "M 130 10 L 100 40", "M 60 40 L 170 40"], audioFile: "ai_hi.mp3" },
    { letter: 'ओ', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 40 L 170 170", "M 150 10 L 170 40", "M 120 40 L 190 40"], audioFile: "o_hi.mp3" },
    { letter: 'औ', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 40 L 170 170", "M 130 10 L 160 40", "M 160 10 L 180 40", "M 120 40 L 190 40"], audioFile: "au_hi.mp3" },
    { letter: 'अं', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 140 20 L 140 25", "M 120 40 L 160 40"], audioFile: "ang_hi.mp3" },
    { letter: 'अः', paths: ["M 60 50 C 110 30, 110 90, 70 100", "M 70 100 C 130 100, 130 170, 60 160", "M 105 130 L 140 130", "M 140 40 L 140 170", "M 170 80 L 170 85", "M 170 130 L 170 135", "M 120 40 L 160 40"], audioFile: "aha_hi.mp3" },

    // --- VYANJAN (CONSONANTS) ---
    // Ka-Varga
    { letter: 'क', paths: ["M 100 40 L 100 170", "M 100 100 C 60 100, 60 140, 100 140", "M 100 100 C 140 100, 140 150, 160 160", "M 60 40 L 160 40"], audioFile: "ka_hi.mp3" },
    { letter: 'ख', paths: ["M 60 60 C 100 30, 100 90, 70 120 L 70 160 L 140 160", "M 140 40 L 140 170", "M 140 100 C 100 100, 100 140, 140 140", "M 50 40 L 160 40"], audioFile: "kha_hi.mp3" },
    { letter: 'ग', paths: ["M 70 40 L 70 130 C 70 160, 110 160, 110 130 L 110 100", "M 150 40 L 150 170", "M 50 40 L 170 40"], audioFile: "ga_hi.mp3" },
    { letter: 'घ', paths: ["M 60 50 C 100 30, 110 70, 80 90 C 120 90, 120 140, 90 160 L 150 160", "M 150 40 L 150 170", "M 50 40 L 170 40"], audioFile: "gha_hi.mp3" },
    { letter: 'ङ', paths: ["M 100 40 L 100 70", "M 100 70 C 60 70, 60 110, 100 110", "M 100 110 C 140 110, 140 160, 100 160", "M 150 100 L 150 105", "M 70 40 L 140 40"], audioFile: "nga_hi.mp3" },

    // Cha-Varga
    { letter: 'च', paths: ["M 60 100 L 110 100", "M 110 100 C 110 140, 150 140, 150 100", "M 150 40 L 150 170", "M 50 40 L 170 40"], audioFile: "cha_hi.mp3" },
    { letter: 'छ', paths: ["M 130 50 C 90 30, 90 90, 110 100 C 70 100, 70 160, 110 160 C 140 160, 140 130, 120 130 C 110 130, 110 150, 120 150", "M 120 40 L 120 60", "M 80 40 L 150 40"], audioFile: "chha_hi.mp3" },
    { letter: 'ज', paths: ["M 70 110 C 70 150, 110 150, 110 110", "M 110 110 L 150 110", "M 150 40 L 150 170", "M 60 40 L 170 40"], audioFile: "ja_hi.mp3" },
    { letter: 'झ', paths: ["M 90 40 L 90 70", "M 90 70 C 50 70, 50 110, 90 110", "M 90 110 C 130 110, 130 140, 90 140", "M 90 140 C 70 140, 60 150, 60 170", "M 100 110 L 150 110", "M 150 40 L 150 170", "M 60 40 L 170 40"], audioFile: "jha_hi.mp3" },
    { letter: 'ञ', paths: ["M 100 60 C 50 60, 50 140, 100 140 C 120 140, 120 100, 100 100", "M 120 100 L 160 100", "M 160 40 L 160 170", "M 60 40 L 180 40"], audioFile: "nya_hi.mp3" },

    // --- PASTE YOUR SVG PATHS FROM FIGMA IN THE EMPTY ARRAYS BELOW ---
    // Ta-Varga
    { letter: 'ट', paths: [], audioFile: "ta_hi.mp3" },
    { letter: 'ठ', paths: [], audioFile: "tha_hi.mp3" },
    { letter: 'ड', paths: [], audioFile: "da_hi.mp3" },
    { letter: 'ढ', paths: [], audioFile: "dha_hi.mp3" },
    { letter: 'ण', paths: [], audioFile: "na_hi.mp3" },

    // Tha-Varga
    { letter: 'त', paths: [], audioFile: "taa_hi.mp3" },
    { letter: 'थ', paths: [], audioFile: "thaa_hi.mp3" },
    { letter: 'द', paths: [], audioFile: "daa_hi.mp3" },
    { letter: 'ध', paths: [], audioFile: "dhaa_hi.mp3" },
    { letter: 'न', paths: [], audioFile: "naa_hi.mp3" },

    // Pa-Varga
    { letter: 'प', paths: [], audioFile: "pa_hi.mp3" },
    { letter: 'फ', paths: [], audioFile: "pha_hi.mp3" },
    { letter: 'ब', paths: [], audioFile: "ba_hi.mp3" },
    { letter: 'भ', paths: [], audioFile: "bha_hi.mp3" },
    { letter: 'म', paths: [], audioFile: "ma_hi.mp3" },

    // Ya-Varga & Others
    { letter: 'य', paths: [], audioFile: "ya_hi.mp3" },
    { letter: 'र', paths: [], audioFile: "ra_hi.mp3" },
    { letter: 'ल', paths: [], audioFile: "la_hi.mp3" },
    { letter: 'व', paths: [], audioFile: "va_hi.mp3" },
    { letter: 'श', paths: [], audioFile: "sha_hi.mp3" },
    { letter: 'ष', paths: [], audioFile: "shha_hi.mp3" },
    { letter: 'स', paths: [], audioFile: "sa_hi.mp3" },
    { letter: 'ह', paths: [], audioFile: "ha_hi.mp3" },
    { letter: 'क्ष', paths: [], audioFile: "ksha_hi.mp3" },
    { letter: 'त्र', paths: [], audioFile: "tra_hi.mp3" },
    { letter: 'ज्ञ', paths: [], audioFile: "gya_hi.mp3" }
];

const gridContainer = document.getElementById('hindi-grid');
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
    currentAudio = new Audio(`sounds/${itemData.audioFile}`);
    currentAudio.play().catch(e => console.log("Letter sound missing"));

    const lines = cardElement.querySelectorAll('.tracing-line');
    lines.forEach(line => { line.style.strokeDashoffset = line.getTotalLength(); });
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

hindiData.forEach(item => {
    // Skip empty items so the page doesn't crash while you are building it
    if(item.paths.length === 0) return; 

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

    cardElement.addEventListener('click', () => {
        if (cardElement.classList.contains('active')) {
            closeCard(cardElement);
            return;
        }
        document.querySelectorAll('.card.active').forEach(c => closeCard(c));
        openCard(cardElement, item);
    });
});