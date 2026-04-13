// 1. LANGUAGE DETECTION
let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

// 2. DICTIONARIES
const uiDictionary = {
    "page-title": { en: "👶 Learn Body Parts", hi: "👶 शरीर के अंग सीखें", mr: "👶 शरीराचे अवयव शिका" }
};

// Expanded dictionary with all new body parts!
const bodyDictionary = {
    "head": { en: "Head", hi: "सिर", mr: "डोके" },
    "hair": { en: "Hair", hi: "बाल", mr: "केस" },
    "eyes": { en: "Eyes", hi: "आंखें", mr: "डोळे" },
    "cheek": { en: "Cheek", hi: "गाल", mr: "गाल" },
    "nose": { en: "Nose", hi: "नाक", mr: "नाक" },
    "mouth": { en: "Mouth", hi: "मुंह", mr: "तोंड" },
    "ear": { en: "Ear", hi: "कान", mr: "कान" },
    "neck": { en: "Neck", hi: "गर्दन", mr: "मान" },
    "chest": { en: "Chest", hi: "छाती", mr: "छाती" },
    "stomach": { en: "Stomach", hi: "पेट", mr: "पोट" },
    "hand": { en: "Hand", hi: "हाथ", mr: "हात" },
    "fingers": { en: "Fingers", hi: "उंगलियां", mr: "बोटे" },
    "thigh": { en: "Thigh", hi: "जांघ", mr: "मांडी" },
    "knee": { en: "Knee", hi: "घुटना", mr: "गुडघा" },
    "leg": { en: "Leg", hi: "पैर", mr: "पाय" },
    "foot": { en: "Foot", hi: "पैर का पंजा", mr: "पाऊल" }
};

// Translate UI on load
const pageTitleElement = document.getElementById("page-title");
if (pageTitleElement) {
    pageTitleElement.innerText = uiDictionary["page-title"][currentLang];
}

// 3. ELEMENTS
const hotspots = document.querySelectorAll(".hotspot");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const popupText = document.getElementById("popupText");
const closeBtn = document.getElementById("closeBtn");
let activeAudio = null; // Keeps track of playing audio

// 4. ANIMATION (STARS)
function celebrate() {
    const colors = ["⭐", "🌟", "✨", "💫", "🎯"];
    for (let i = 0; i < 8; i++) {
        const star = document.createElement("div");
        star.textContent = colors[Math.floor(Math.random() * colors.length)];
        star.style.position = "fixed";
        star.style.left = (Math.random() * 80 + 10) + "vw";
        star.style.top = (Math.random() * 80 + 10) + "vh";
        star.style.fontSize = (Math.random() * 20 + 20) + "px";
        star.style.pointerEvents = "none";
        star.style.zIndex = "2000";
        star.style.transition = "all 1s ease-out";
        
        document.body.appendChild(star);

        requestAnimationFrame(() => {
            star.style.transform = `translateY(-100px) scale(1.5)`;
            star.style.opacity = "0";
        });

        setTimeout(() => star.remove(), 1000);
    }
}

// 5. CUSTOM AUDIO PLAYER
function playSound(partKey) {
    // Stop any currently playing audio before starting the new one
    if (activeAudio) { 
        activeAudio.pause(); 
        activeAudio.currentTime = 0; 
    }
    
    // Builds the path dynamically: e.g., "sounds/hi/bodyparts/head.mp3"
    activeAudio = new Audio(`sounds/${currentLang}/bodyparts/${partKey}.mp3`);
    activeAudio.play().catch(e => console.log("Sound not found:", e));
}

// 6. HOTSPOT CLICK LOGIC
hotspots.forEach(h => {
    h.addEventListener("click", () => {
        const key = h.dataset.key; 
        const img = h.dataset.img;

        popupImg.src = img;
        
        // Lookup the translated word from the dictionary
        if (bodyDictionary[key]) {
            popupText.textContent = bodyDictionary[key][currentLang];
        } else {
            popupText.textContent = key; // Fallback just in case
        }
        
        popup.classList.remove("hidden");

        playSound(key);
        celebrate();
    });
});

// 7. CLOSE LOGIC (Stop audio if closed early)
closeBtn.onclick = () => {
    popup.classList.add("hidden");
    if (activeAudio) activeAudio.pause();
};

popup.onclick = (e) => {
    if (e.target === popup) {
        popup.classList.add("hidden");
        if (activeAudio) activeAudio.pause();
    }
};

// // ==========================================
// // UPGRADED DEVELOPER TOOL: HOTSPOT FINDER
// // ==========================================
// document.querySelector(".body-img").addEventListener("click", function(e) {
//     const rect = this.getBoundingClientRect();
    
//     // Calculate precise percentages
//     const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
//     const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    
//     const coordinateString = `top: ${y}%; left: ${x}%;`;
    
//     // 1. Always print it to the hidden Developer Console as a backup
//     console.log("Hotspot Found:", coordinateString);
    
//     // 2. Secretly copy it straight to your computer's clipboard!
//     navigator.clipboard.writeText(coordinateString).then(() => {
        
//         // 3. Show a temporary "Toast" message so you know it worked
//         const toast = document.createElement("div");
//         toast.textContent = `📋 Copied! ${coordinateString}`;
//         toast.style.cssText = `
//             position: fixed; 
//             bottom: 30px; 
//             left: 50%; 
//             transform: translateX(-50%); 
//             background: #FF5722; 
//             color: #fff; 
//             padding: 12px 24px; 
//             border-radius: 50px; 
//             font-size: 16px;
//             font-weight: bold;
//             box-shadow: 0 4px 10px rgba(0,0,0,0.3);
//             z-index: 9999;
//             transition: opacity 0.5s;
//         `;
        
//         document.body.appendChild(toast);
        
//         // Make the message magically disappear after 2 seconds
//         setTimeout(() => {
//             toast.style.opacity = "0";
//             setTimeout(() => toast.remove(), 500);
//         }, 2000);
        
//     }).catch(err => {
//         // Fallback just in case your browser blocks clipboard access
//         console.error("Clipboard copy failed.", err);
//         alert(`Coordinates: ${coordinateString}`);
//     });
// });
// developer toool ends here

