"use strict";

// The Translation Dictionary
const hubDictionary = {
    "nav-parent": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पालक कोपरा" },
    "main-title": { en: "🎉 Fun Learning for Kids 🎉", hi: "🎉 बच्चों के लिए मजेदार शिक्षा 🎉", mr: "🎉 मुलांसाठी मजेशीर शिक्षण 🎉" },
    "desc-abc": { en: "Learn Alphabets", hi: "अक्षर सीखें", mr: "मुळाक्षरे शिका" },
    "desc-abc-trace": { en: "Alphabet Tracing", hi: "अक्षर ट्रेसिंग", mr: "मुळाक्षरे ट्रेसिंग" },
    "bounce-numbers": { en: "1 2 3", hi: "१ २ ३", mr: "१ २ ३" },
    "desc-numbers": { en: "Learn Numbers", hi: "नंबर सीखें", mr: "अंक शिका" },
    "bounce-count-numbers": { en: "Count 1 2 3", hi: "गिनती १ २ ३", mr: "मोजणे १ २ ३" },
    "desc-count-numbers": { en: "Learn Counting", hi: "गिनती सीखें", mr: "मोजणे शिका" },
    "desc-numbers-trace": { en: "Numbers Tracing", hi: "नंबर ट्रेसिंग", mr: "अंक ट्रेसिंग" },
    "desc-varnmala": { en: "Learn Hindi Marathi Varnmala", hi: "हिंदी वर्णमाला सीखें", mr: "मराठी मुळाक्षरे शिका" },
    "desc-varnmalatrace": { en: "Varnmala Tracing", hi: "वर्णमाला ट्रेसिंग", mr: "मुळाक्षरे ट्रेसिंग" },
    "desc-devnagaarinumberstrace": { en: "Hindi Marathi Numbers Tracing", hi: "हिंदी नंबर ट्रेसिंग", mr: "मराठी अंक ट्रेसिंग" },
    // "desc-marathi-numberstrace": { en: "Marathi Numbers Tracing", hi: "मराठी नंबर ट्रेसिंग", mr: "मराठी अंक ट्रेसिंग" },
    "name-shapes": { en: "Shapes", hi: "आकार", mr: "आकार" },
    "desc-shapes": { en: "Learn Shapes", hi: "आकार सीखें", mr: "आकार शिका" },
    "name-shapes-trace": { en: "Trace Shapes", hi: "आकार ट्रेसिंग", mr: "आकार ट्रेसिंग" },
    "desc-shapes-trace": { en: "Learn Shapes Tracing", hi: "आकार ट्रेसिंग सीखें", mr: "आकार ट्रेसिंग शिका" },
    "name-colors": { en: "Colors", hi: "रंग", mr: "रंग" },
    "desc-colors": { en: "Learn Colors", hi: "रंग सीखें", mr: "रंग शिका" },
    "name-body-parts": { en: "Body Parts", hi: "शरीर के अंग", mr: "शरीराचे अवयव" },
    "desc-body": { en: "Learn Body Parts", hi: "शरीर के अंग सीखें", mr: "शरीराचे अवयव शिका" },
    "desc-animals": { en: "Learn Animals", hi: "जानवरों के नाम सीखें", mr: "प्राण्यांची नावे शिका" },
    "desc-birds": { en: "Learn Birds", hi: "पक्षियों के नाम सीखें", mr: "पक्ष्यांची नावे शिका" },
    "desc-insects": { en: "Learn Insects", hi: "कीड़ों के नाम सीखें", mr: "कीटकांची नावे शिका" },
    "desc-fruits": { en: "Learn Fruits", hi: "फलों के नाम सीखें", mr: "फळांची नावे शिका" },
    "desc-veg": { en: "Learn Vegetables", hi: "सब्जियों के नाम सीखें", mr: "भाज्यांची नावे शिका" },
    "desc-foods": { en: "Learn Food", hi: "भोजन के नाम सीखें", mr: "अन्नाची नावे शिका" },
    "desc-flowers": { en: "Learn Flowers", hi: "फूलों के नाम सीखें", mr: "फुलांची नावे शिका" },
    "desc-vehicles": { en: "Learn Vehicles", hi: "वाहनों के नाम सीखें", mr: "वाहनांची नावे शिका" },
    "desc-game": { en: "Identify correct Animal", hi: "सही जानवर को पहचानें", mr: "योग्य प्राणी ओळखा" },
    "nav-prev": { en: "⬅ Previous", hi: "⬅ पिछला", mr: "⬅ मागील" },
    "nav-next": { en: "Next ➡", hi: "अगला ➡", mr: "पुढील ➡" },
    "nav-home": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 मुख्यपृष्ठ" },

    // Footer Translations
        "footerAbout": { en: "About Us", hi: "हमारे बारे में", mr: "आमच्याबद्दल" },
        "footerTerms": { en: "Terms & Conditions", hi: "नियम और शर्तें", mr: "नियम आणि अटी" },
        "footerPrivacy": { en: "Privacy Policy", hi: "गोपनीयता नीति", mr: "गोपनीयता धोरण" },
        "footerDisclaimer": { en: "Disclaimer", hi: "अस्वीकरण", mr: "अस्वीकरण" },
        "footerContact": { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" },

    // SEO Text Accordion
    "seoText": {
        en: `
            <h2>About The KidsFunLearnHub Learning Hub</h2>
            <p>Welcome to the KidsFunLearnHub Learning Hub! This is the ultimate educational dashboard where toddlers, preschoolers, and early learners can safely explore a world of interactive games, flashcards, and tracing activities.</p>
            <p><strong>Learning Outcomes:</strong> Comprehensive early childhood development, cognitive skill building, bilingual vocabulary expansion, and fine motor coordination.</p>
            <details class="seo-accordion">
                <summary><span class="read-more-btn"></span></summary>
                <div class="seo-content-wrapper">
                    <h3>How to Play & Educational Benefits</h3>
                    <p>Our Learning Hub is designed to give children the freedom to choose their own learning path. Whether they want to practice their ABCs, learn counting, trace the Hindi and Marathi Varnamala, or discover colorful animals and vehicles, every single activity is just one tap away. This variety keeps children highly engaged and prevents learning fatigue.</p>
                    <p>We believe that foundational education should be accessible in a child's native language. That is why almost every activity in this hub features comprehensive trilingual support in English, Hindi, and Marathi. By navigating this colorful dashboard, children naturally develop digital literacy while absorbing critical early-education concepts.</p>
                    <h3>Frequently Asked Questions (FAQs)</h3>
                    <p><strong>Is the Learning Hub safe for toddlers?</strong><br>Yes! The hub provides a closed, educational environment focused purely on interactive learning without distracting pop-ups during gameplay.</p>
                    <p><strong>Where can parents find offline materials?</strong><br>Parents can click the "Parent Corner" button at the top of the screen to access hundreds of free, high-quality printable worksheets that perfectly match the digital activities found here.</p>
                </div>
            </details>
        `,
        hi: `
            <h2>KidsFunLearnHub-लर्निंग हब के बारे में</h2>
            <p>KidsFunLearnHub लर्निंग हब में आपका स्वागत है! यह एक बेहतरीन शैक्षिक डैशबोर्ड है जहां छोटे बच्चे और प्रीस्कूलर इंटरैक्टिव गेम, फ्लैशकार्ड और ट्रेसिंग गतिविधियों की दुनिया को सुरक्षित रूप से एक्सप्लोर कर सकते हैं।</p>
            <p><strong>सीखने के परिणाम:</strong> व्यापक प्रारंभिक बाल विकास, संज्ञानात्मक कौशल निर्माण, द्विभाषी शब्दावली विस्तार, और ठीक गामक (फाइन मोटर) समन्वय।</p>
            <details class="seo-accordion">
                <summary><span class="read-more-btn"></span></summary>
                <div class="seo-content-wrapper">
                    <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                    <p>हमारा लर्निंग हब बच्चों को अपना खुद का सीखने का रास्ता चुनने की स्वतंत्रता देने के लिए डिज़ाइन किया गया है। चाहे वे अपनी ABC का अभ्यास करना चाहते हों, गिनती सीखना चाहते हों, हिंदी और मराठी वर्णमाला को ट्रेस करना चाहते हों, या रंगीन जानवरों और वाहनों की खोज करना चाहते हों, हर एक गतिविधि बस एक टैप दूर है। यह विविधता बच्चों को अत्यधिक व्यस्त रखती है और सीखने की थकान को रोकती है।</p>
                    <p>हमारा मानना है कि मूलभूत शिक्षा बच्चे की मातृभाषा में सुलभ होनी चाहिए। यही कारण है कि इस हब में लगभग हर गतिविधि में अंग्रेजी, हिंदी और मराठी में व्यापक त्रिभाषी समर्थन है। इस रंगीन डैशबोर्ड को नेविगेट करके, बच्चे स्वाभाविक रूप से डिजिटल साक्षरता विकसित करते हैं जबकि महत्वपूर्ण प्रारंभिक शिक्षा अवधारणाओं को भी अवशोषित करते हैं।</p>
                    <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                    <p><strong>क्या लर्निंग हब छोटे बच्चों के लिए सुरक्षित है?</strong><br>हाँ! हब एक सुरक्षित, शैक्षिक वातावरण प्रदान करता है जो गेमप्ले के दौरान विचलित करने वाले पॉप-अप के बिना पूरी तरह से इंटरैक्टिव सीखने पर केंद्रित है।</p>
                    <p><strong>माता-पिता ऑफ़लाइन सामग्री कहां पा सकते हैं?</strong><br>माता-पिता स्क्रीन के शीर्ष पर "पेरेंट कॉर्नर" बटन पर क्लिक करके सैकड़ों मुफ्त, उच्च गुणवत्ता वाले प्रिंट करने योग्य वर्कशीट तक पहुंच सकते हैं जो यहां पाई जाने वाली डिजिटल गतिविधियों से पूरी तरह मेल खाते हैं।</p>
                </div>
            </details>
        `,
        mr: `
            <h2>KidsFunLearnHub-लर्निंग हबबद्दल</h2>
            <p>KidsFunLearnHub लर्निंग हबमध्ये आपले स्वागत आहे! हा एक सर्वोत्कृष्ट शैक्षणिक डॅशबोर्ड आहे जिथे लहान मुले आणि प्रीस्कूलर सुरक्षितपणे इंटरएक्टिव्ह गेम्स, फ्लॅशकार्ड्स आणि ट्रेसिंग ऍक्टिव्हिटीजचे जग एक्सप्लोर करू शकतात.</p>
            <p><strong>शिकण्याचे परिणाम:</strong> सर्वसमावेशक बाल विकास, संज्ञानात्मक कौशल्य वाढ, द्विभाषिक शब्दसंग्रह विस्तार, आणि हातांच्या स्नायूंचे (फाइन मोटर) समन्वय.</p>
            <details class="seo-accordion">
                <summary><span class="read-more-btn"></span></summary>
                <div class="seo-content-wrapper">
                    <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                    <p>आमचे लर्निंग हब मुलांना त्यांचा स्वतःचा शिकण्याचा मार्ग निवडण्याचे स्वातंत्र्य देण्यासाठी डिझाइन केले आहे. त्यांना ABC चा सराव करायचा असेल, मोजणी शिकायची असेल, हिंदी आणि मराठी वर्णमाला ट्रेस करायची असेल किंवा रंगीबेरंगी प्राणी आणि वाहने शोधायची असतील, प्रत्येक ऍक्टिव्हिटी फक्त एका टॅपवर उपलब्ध आहे. ही विविधता मुलांना अत्यंत व्यस्त ठेवते आणि शिकण्याचा कंटाळा येऊ देत नाही.</p>
                    <p>आमचा असा विश्वास आहे की मूलभूत शिक्षण मुलाच्या मातृभाषेत उपलब्ध असावे. म्हणूनच या हबमधील जवळजवळ प्रत्येक ऍक्टिव्हिटीमध्ये इंग्रजी, हिंदी आणि मराठी भाषेचा सर्वसमावेशक पाठिंबा आहे. या रंगीत डॅशबोर्डवर नेव्हिगेट करून, मुले नैसर्गिकरित्या डिजिटल साक्षरता विकसित करतात आणि त्याचबरोबर प्रारंभिक शिक्षणाच्या महत्त्वाच्या संकल्पनाही आत्मसात करतात.</p>
                    <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                    <p><strong>हे लर्निंग हब लहान मुलांसाठी सुरक्षित आहे का?</strong><br>होय! हे हब एक सुरक्षित आणि शैक्षणिक वातावरण प्रदान करते जे गेमप्लेच्या दरम्यान विचलित करणाऱ्या पॉप-अप्सशिवाय पूर्णपणे इंटरएक्टिव्ह शिक्षणावर लक्ष केंद्रित करते.</p>
                    <p><strong>पालकांना ऑफलाइन साहित्य कुठे मिळेल?</strong><br>येथे आढळणाऱ्या डिजिटल ऍक्टिव्हिटीजशी तंतोतंत जुळणाऱ्या शेकडो मोफत, उच्च दर्जाच्या प्रिंट करण्यायोग्य वर्कशीट्स मिळवण्यासाठी पालक स्क्रीनच्या वरच्या बाजूला असलेल्या "पेरेंट कॉर्नर" बटणावर क्लिक करू शकतात.</p>
                </div>
            </details>
        `
    }



};

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Language Setup ---
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    for (let currentId in hubDictionary) {
        let elementToChange = document.getElementById(currentId);
        if (elementToChange) {
            elementToChange.innerHTML = hubDictionary[currentId][currentLang];
        }
    }

    // --- 2. Card Filtering & Pagination Logic ---
    const container = document.getElementById("cardContainer");
    if (!container) return; 
    
    const allCards = Array.from(container.children);

    allCards.forEach(card => {
        card.classList.remove('hidden-by-lang');
        
        const isEnglishOnly = card.classList.contains('abc') || card.classList.contains('abcbigsmall') || card.classList.contains('abctrace') || card.classList.contains('numberstrace');
        const isHindiOnly = card.classList.contains('hindinumberstrace');
        const isMarathiOnly = card.classList.contains('marathinumberstrace');
        const isSharedHiMr = card.classList.contains('varnmala') || card.classList.contains('varnmalatrace') || card.classList.contains('devnagaarinumberstrace');

        if (currentLang === 'hi') {
            if (isEnglishOnly || isMarathiOnly) card.classList.add('hidden-by-lang');
        } 
        else if (currentLang === 'mr') {
            if (isEnglishOnly || isHindiOnly) card.classList.add('hidden-by-lang');
        }
        else { 
            if (isHindiOnly || isMarathiOnly || isSharedHiMr) card.classList.add('hidden-by-lang');
        }
    });

    const activeCards = allCards.filter(card => !card.classList.contains('hidden-by-lang'));
    const cardsPerPage = window.innerWidth <= 700 ? 5 : 9; // Show 9 per page on desktop (3x3 grid)
    
    let currentPage = 0;
    const totalPages = Math.ceil(activeCards.length / cardsPerPage);

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const pageInfo = document.getElementById("pageInfo");

    function showPage(page) {
        allCards.forEach(card => card.style.display = "none");

        const start = page * cardsPerPage;
        const end = start + cardsPerPage;

        for (let i = start; i < end && i < activeCards.length; i++) {
            activeCards[i].style.display = "flex";
        }

        if (pageInfo) pageInfo.textContent = `Page ${page + 1} / ${totalPages}`;
        if (prevBtn) prevBtn.disabled = page === 0;
        if (nextBtn) nextBtn.disabled = page >= totalPages - 1;
    }

    // --- ADDED SCROLL BEHAVIOR HERE ---
    if (prevBtn) {
        prevBtn.addEventListener("click", () => { 
            if (currentPage > 0) { 
                currentPage--; 
                showPage(currentPage); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls to top
            } 
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", () => { 
            if (currentPage < totalPages - 1) { 
                currentPage++; 
                showPage(currentPage); 
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Scrolls to top
            } 
        });
    }

    // Initial Load
    showPage(currentPage);

    // --- 3. Dynamic Random Gradients (18 Vibrant Colors!) ---
    const vividGradients = [
        "linear-gradient(135deg, #ff5252 0%, #ff7a7a 100%)",
        "linear-gradient(135deg, #9452ff 0%, #b080ff 100%)",
        "linear-gradient(135deg, #ea33ad 0%, #ff66cc 100%)",
        "linear-gradient(135deg, #1acf6b 0%, #4ae58b 100%)",
        "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
        "linear-gradient(135deg, #00c6fb 0%, #005bea 100%)",
        "linear-gradient(135deg, #f6d365 0%, #f5653e 100%)",
        "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
        "linear-gradient(135deg, #b224ef 0%, #7579ff 100%)",
        "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        "linear-gradient(135deg, #f43b47 0%, #453a94 100%)",
        "linear-gradient(135deg, #0ba360 0%, #3cba92 100%)",
        "linear-gradient(135deg, #ea647a 0%, #fc3588 100%)",
        "linear-gradient(135deg, #64b5f6 0%, #2196f3 100%)",
        "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
        "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
        "linear-gradient(135deg, #f83e44 0%, #fecfef 100%)"
    ];

    let availableGradients = [...vividGradients];

    // Apply colors only to active cards to ensure variety on the current page
    allCards.forEach(card => {
        // Skip the parent card so it keeps its dashed outline
        if(!card.classList.contains('parent-card')) {
            if (availableGradients.length === 0) availableGradients = [...vividGradients];
            const randomIndex = Math.floor(Math.random() * availableGradients.length);
            card.style.background = availableGradients[randomIndex];
            availableGradients.splice(randomIndex, 1);
        }
    });

    // --- 4. Extra Features ---
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => console.log("Learning card clicked!"));
    });

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

    // Background Bubbles
    const bubbleContainer = document.getElementById("bubble-container");
    if(bubbleContainer) {
        const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const numbers = Array.from({ length: 20 }, (_, i) => i + 1);
        const alphaColors = ["#ffcc80", "#ffab91", "#e6ee9c", "#b2dfdb", "#c5cae9"];
        const numberColors = ["#bbdefb", "#c8e6c9", "#ffcdd2", "#d1c4e9", "#ffe082"];

        const createBubble = (type, dataArray, colorArray, posProp) => {
            const bubble = document.createElement("div");
            bubble.className = `bubble ${type}`;
            const item = dataArray[Math.floor(Math.random() * dataArray.length)];
            bubble.innerText = item;
            bubble.style.background = colorArray[Math.floor(Math.random() * colorArray.length)];
            bubble.style[posProp] = Math.random() * 15 + "%";
            bubble.style.animationDuration = (12 + Math.random() * 8) + "s";
            bubbleContainer.appendChild(bubble);
            setTimeout(() => { if (bubble.parentNode) bubble.remove(); }, 20000);
        };

        setInterval(() => createBubble("alpha", alphabets, alphaColors, "left"), 1800);
        setInterval(() => createBubble("number", numbers, numberColors, "right"), 2200);
    }
});

// Background Music Logic
// let bgMusicStarted = false;
// const bgMusic = new Audio("sounds/bg-music.mp3");
// bgMusic.loop = true;
// bgMusic.volume = 0.05; 

// document.addEventListener("click", () => {
//     if (!bgMusicStarted) {
//         bgMusic.play().catch(() => {});
//         bgMusicStarted = true;
//     }
// }, { once: true });