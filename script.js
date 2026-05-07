"use strict";

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Card Click Effects ---
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            console.log("Learning card clicked!");
        });
    });

    // --- 2. Floating Bubbles Logic (Now purely decorative visual background) ---
    const container = document.getElementById("bubble-container");
    if (container) {
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const numbers = Array.from({ length: 20 }, (_, i) => i + 1);

        const alphaColors = ["#ffcc80", "#ffab91", "#e6ee9c", "#b2dfdb", "#c5cae9"];
        const numberColors = ["#bbdefb", "#c8e6c9", "#ffcdd2", "#d1c4e9", "#ffe082"];

        const createBubble = (type, dataArray, colorArray, positionProperty) => {
            const bubble = document.createElement("div");
            bubble.className = `bubble ${type}`;
            
            const item = dataArray[Math.floor(Math.random() * dataArray.length)];
            bubble.innerText = item;
            bubble.style.background = colorArray[Math.floor(Math.random() * colorArray.length)];
            
            // Random positioning either left or right side
            bubble.style[positionProperty] = Math.random() * 15 + "%"; 
            bubble.style.animationDuration = (12 + Math.random() * 8) + "s";

            container.appendChild(bubble);

            // Auto cleanup to prevent memory leaks when bubble leaves screen
            setTimeout(() => {
                if (bubble.parentNode) bubble.remove();
            }, 20000); 
        };

        // Create Alphabets from Left side
        setInterval(() => createBubble("alpha", alphabets, alphaColors, "left"), 1800);
        // Create Numbers from Right side
        setInterval(() => createBubble("number", numbers, numberColors, "right"), 2200);
    }

    // --- 3. Background Music Logic ---
    let bgMusicStarted = false;
    const bgMusic = new Audio("sounds/bg-music.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.05; // Soft volume

    // Play on first interaction
    document.addEventListener("click", () => {
        if (!bgMusicStarted) {
            bgMusic.play().then(() => {
                bgMusicStarted = true;
            }).catch(err => console.log("Audio play prevented by browser interaction policy"));
        }
    }, { once: true });

    // --- 4. Cursor Selection Logic ---
    const select = document.getElementById("cursorSelect");
    if (select) {
        const savedCursor = localStorage.getItem("kidsCursor");
        
        if (savedCursor) {
            document.documentElement.style.cursor = savedCursor;
            const cursorFile = savedCursor.split("/").pop().replace(/["')]/g, '').split(' ')[0];
            select.value = cursorFile;
        }

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
});

// --- 5. Global Cursor Enforcement (Applies to all pages linking this script) ---
document.addEventListener("DOMContentLoaded", () => {
    const savedCursor = localStorage.getItem("kidsCursor");
    if (savedCursor) {
        document.documentElement.style.cursor = savedCursor;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Array of beautiful, vibrant, kid-friendly gradients
    const vividGradients = [
        "linear-gradient(135deg, #ff5252 0%, #ff5252 100%)", /* Red */
        "linear-gradient(135deg, #9452ff 0%, #9452ff 100%)", /* Mint/Cyan */
        // "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", /* Peach/Orange */
        // "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", /* Purple/Pink */
        // "linear-gradient(135deg, #eb25ac 0%, #d57eeb 100%)", /* Orange/Magenta */
        "linear-gradient(135deg, #ea33ad 0%, #ea33ad 100%)", /* Bright Sky Blue */
        "linear-gradient(135deg, #1acf6b 0%, #1acf6b 100%)", /* Neon Green/Teal */
        "linear-gradient(135deg, #fee140 0%, #fee140 100%)", /* Hot Pink/Yellow */
        // "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", /* Deep Purple/Indigo */
        "linear-gradient(135deg, #ff0844 0%, #ff0844 100%)" /* Red/Light Orange */
        
        
    ];



    // Select all cards on the homepage
    const cards = document.querySelectorAll('.card');

    // Make a copy of the array so we can pull from it without repeating colors on the same page
    let availableGradients = [...vividGradients];

    cards.forEach(card => {
        // If we run out of unique colors, refill the array
        if (availableGradients.length === 0) {
            availableGradients = [...vividGradients];
        }

        // Pick a random gradient index
        const randomIndex = Math.floor(Math.random() * availableGradients.length);
        
        // Apply the gradient and remove it from the available list so the next card gets a different one
        card.style.background = availableGradients[randomIndex];
        availableGradients.splice(randomIndex, 1);
    });
});