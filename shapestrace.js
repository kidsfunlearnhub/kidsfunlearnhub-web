// Data for 10 Common Shapes
const shapeData = [
    { 
        name: 'Circle', 
        paths: ["M 100 40 A 60 60 0 1 1 100 160 A 60 60 0 1 1 100 40"], 
        audioFile: "circle.mp3" 
    },
    { 
        name: 'Square', 
        paths: ["M 50 50 L 150 50 L 150 150 L 50 150 L 50 50"], 
        audioFile: "square.mp3" 
    },
    { 
        name: 'Triangle', 
        paths: ["M 100 40 L 160 150 L 40 150 L 100 40"], 
        audioFile: "triangle.mp3" 
    },
    { 
        name: 'Rectangle', 
        paths: ["M 30 60 L 170 60 L 170 140 L 30 140 L 30 60"], 
        audioFile: "rectangle.mp3" 
    },
    { 
        name: 'Star', 
        paths: ["M 100 30 L 120 80 L 175 80 L 130 115 L 145 170 L 100 135 L 55 170 L 70 115 L 25 80 L 80 80 L 100 30"], 
        audioFile: "star.mp3" 
    },
    { 
        name: 'Heart', 
        // A beautifully curved continuous heart path
        paths: ["M 100 60 C 100 60 80 30 50 30 C 20 30 20 80 20 80 C 20 110 100 170 100 170 C 100 170 180 110 180 80 C 180 80 180 30 150 30 C 120 30 100 60 100 60"], 
        audioFile: "heart.mp3" 
    },
    { 
        name: 'Oval', 
        paths: ["M 100 50 A 70 50 0 1 1 100 150 A 70 50 0 1 1 100 50"], 
        audioFile: "oval.mp3" 
    },
    { 
        name: 'Diamond', 
        paths: ["M 100 40 L 160 100 L 100 160 L 40 100 L 100 40"], 
        audioFile: "diamond.mp3" 
    },
    { 
        name: 'Pentagon', 
        paths: ["M 100 40 L 160 85 L 135 160 L 65 160 L 40 85 L 100 40"], 
        audioFile: "pentagon.mp3" 
    },
    { 
        name: 'Hexagon', 
        paths: ["M 100 40 L 150 70 L 150 130 L 100 160 L 50 130 L 50 70 L 100 40"], 
        audioFile: "hexagon.mp3" 
    }
];

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
    currentAudio = new Audio(`sounds/${itemData.audioFile}`);
    currentAudio.play().catch(e => console.log("Sound missing"));

    const lines = cardElement.querySelectorAll('.tracing-line');
    lines.forEach(line => { line.style.strokeDashoffset = line.getTotalLength(); });
    const pencilGroup = cardElement.querySelector('.pencil-group');

    await new Promise(r => setTimeout(r, 400)); 

    for (let i = 0; i < lines.length; i++) {
        if (cardElement.dataset.animating !== "true") return; 
        // Increased duration slightly to 2000ms since shapes have longer continuous lines
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

// Generate the Shape Grid
shapeData.forEach(item => {
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