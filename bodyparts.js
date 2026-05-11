"use strict";

document.addEventListener("DOMContentLoaded", () => {
    
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
    // 2. LANGUAGE SETUP & DICTIONARIES
    /////////////////////////////////////////////////
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    const uiDictionary = {
        "page-title": { en: "👶 Learn Body Parts", hi: "👶 शरीर के अंग सीखें", mr: "👶 शरीराचे अवयव शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        "learnBtn": { en: "Learn Body Parts", hi: "शरीर के अंग सीखें", mr: "शरीराचे अवयव शिका" },
        "activitiesBtn": { en: "Body Activities", hi: "शरीर गतिविधियां", mr: "शरीर ऍक्टिव्हिटीज" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: "Welcome to the <strong>KidsFunLearnHub Anatomy Zone</strong>! Tap the glowing blue dots on the body to discover different parts like the head, hands, and feet. This interactive visual learning helps toddlers develop self-awareness and essential physical vocabulary.",
            hi: "<strong>KidsFunLearnHub एनाटॉमी ज़ोन</strong> में आपका स्वागत है! सिर, हाथ और पैर जैसे विभिन्न हिस्सों को खोजने के लिए शरीर पर चमकते नीले बिंदुओं पर टैप करें। यह संवादात्मक दृश्य शिक्षा बच्चों में आत्म-जागरूकता और आवश्यक शारीरिक शब्दावली विकसित करने में मदद करती है।",
            mr: "<strong>KidsFunLearnHub ॲनाटॉमी झोनमध्ये</strong> आपले स्वागत आहे! डोके, हात आणि पाय यांसारखे विविध भाग शोधण्यासाठी शरीरावरील चमकणाऱ्या निळ्या ठिपक्यांवर टॅप करा. हे परस्परसंवादी दृश्य शिक्षण लहान मुलांना आत्म-जागरूकता आणि आवश्यक शारीरिक शब्दसंग्रह विकसित करण्यास मदत करते."
        },
        // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" }
    };

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

    // Translate UI elements on load
    for (let id in uiDictionary) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = uiDictionary[id][currentLang];
    }

    /////////////////////////////////////////////////
    // 3. ELEMENTS & CORE LOGIC
    /////////////////////////////////////////////////
    const hotspots = document.querySelectorAll(".hotspot");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupText = document.getElementById("popupText");
    let activeAudio = null; 

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
        if (activeAudio) { 
            activeAudio.pause(); 
            activeAudio.currentTime = 0; 
        }
        activeAudio = new Audio(`sounds/${currentLang}/bodyparts/${partKey}.mp3`);
        activeAudio.play().catch(e => console.log("Sound not found:", e));
    }

    // 6. HOTSPOT CLICK LOGIC
    hotspots.forEach(h => {
        h.addEventListener("click", () => {
            const key = h.dataset.key; 
            const img = h.dataset.img;

            popupImg.src = img;
            
            if (bodyDictionary[key]) {
                popupText.textContent = bodyDictionary[key][currentLang];
            } else {
                popupText.textContent = key; 
            }
            
            popup.classList.remove("hidden");
            popup.style.display = "flex";

            playSound(key);
            celebrate();
        });
    });

    /////////////////////////////////////////////////
    // 7. TODDLER-PROOF CLOSE LOGIC
    /////////////////////////////////////////////////
    function closePopup() {
        popup.classList.add("hidden");
        popup.style.display = "none";
        if (activeAudio) activeAudio.pause();
    }

    // Clicking anywhere on the popup overlay closes it
    if (popup) {
        popup.onclick = () => {
            closePopup();
        };
    }

    // The inner content stops propagation so users don't accidentally click through, 
    // BUT we will also allow clicking the popup card itself to close to make it toddler-proof.
    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
        popupContent.onclick = (e) => {
            closePopup();
            e.stopPropagation();
        };
    }
});