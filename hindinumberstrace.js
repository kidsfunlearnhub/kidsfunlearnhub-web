// These are hand-coded approximations of Devanagari script strokes
const baseDigits = {
    '0': ["M 50 40 C 20 40 20 160 50 160 C 80 160 80 40 50 40"], // ० (Shunya)
    '1': ["M 30 60 C 30 30 70 30 70 60 L 70 140 C 70 160 90 160 90 140"], // १ (Ek)
    '2': ["M 30 60 C 30 20 80 20 80 60 C 80 100 30 120 40 160 C 50 180 80 160 80 140"], // २ (Do)
    '3': ["M 30 50 C 80 30 80 90 50 100 C 90 100 90 160 50 160 C 30 160 30 130 50 130"], // ३ (Teen)
    '4': ["M 70 60 C 50 30 30 50 30 80 C 30 110 60 130 60 130 C 90 150 90 180 60 180 C 30 180 30 150 60 130"], // ४ (Char)
    '5': ["M 30 40 C 30 100 80 100 80 60 L 80 160"], // ५ (Paanch)
    '6': ["M 70 40 C 20 40 20 100 50 100 C 10 100 10 160 50 160 C 80 160 80 120 50 120"], // ६ (Chhah)
    '7': ["M 40 60 C 40 40 60 40 60 60 C 60 80 40 100 40 120 C 40 150 70 150 70 150"], // ७ (Saat)
    '8': ["M 80 40 C 10 60 10 140 80 160"], // ८ (Aath)
    '9': ["M 60 100 C 20 100 20 40 60 40 L 60 160"] // ९ (Nau)
};

// --- 2. The Auto-Generator ---
// Safely shifts coordinates left or right for double digits
function shiftPath(path, shiftX) {
    return path.replace(/([-\d.]+)\s+([-\d.]+)/g, (match, x, y) => {
        return `${parseFloat(x) + shiftX} ${y}`;
    });
}

// Automatically build numbers 1 to 40 using the Hindi base paths!
const numberData = [];
for (let i = 1; i <= 40; i++) {
    let strNum = i.toString();
    let finalPaths = [];
    
    if (strNum.length === 1) {
        // Single digits
        finalPaths = baseDigits[strNum].map(p => shiftPath(p, 50));
    } else {
        // Double digits side-by-side
        let tensDigit = strNum[0];
        let onesDigit = strNum[1];
        finalPaths = [
            ...baseDigits[tensDigit].map(p => shiftPath(p, 10)), // Shift tens to left
            ...baseDigits[onesDigit].map(p => shiftPath(p, 90))  // Shift ones to right
        ];
    }
    
    numberData.push({
        number: strNum,
        paths: finalPaths,
        audioFile: `${i}_hi.mp3` // Looks for 1_hi.mp3, 12_hi.mp3 etc.
    });
}

// --- 3. Animation & Layout Engine ---
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
    
    // UPDATED: Tell the browser exactly which folders to look inside!
    currentAudio = new Audio(`sounds/hi/numbers/${itemData.audioFile}`);
    
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

// --- 4. Pagination Display Logic ---
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

        cardElement.addEventListener('click', () => {
            if (cardElement.classList.contains('active')) {
                closeCard(cardElement);
                return;
            }
            document.querySelectorAll('.card.active').forEach(c => closeCard(c));
            openCard(cardElement, item);
        });
    });
}

// Button Click Events
btnNext.addEventListener('click', () => {
    renderGrid(20, 40); 
    btnNext.style.display = 'none'; 
    btnPrev.style.display = 'block'; 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
});

btnPrev.addEventListener('click', () => {
    renderGrid(0, 20); 
    btnPrev.style.display = 'none'; 
    btnNext.style.display = 'block'; 
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Load the first page initially
renderGrid(0, 20);
