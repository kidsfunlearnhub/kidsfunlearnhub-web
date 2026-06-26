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
    // 2. LANGUAGE SETUP, DICTIONARIES & BUTTONS
    /////////////////////////////////////////////////
    
    // Get the global language from index.html
    let globalLang = localStorage.getItem('mySecretLanguage') || 'en';
    
    // Get this specific page's language, fallback to global if not clicked yet
    let currentLang = sessionStorage.getItem('bodyPartsLang') || globalLang;

    // Highlight the active language button and set up the reload logic
    document.querySelectorAll('.lang-btn').forEach(btn => {
        if(btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        
        btn.addEventListener('click', (e) => {
            const selectedLang = e.target.dataset.lang;
            if (selectedLang !== currentLang) {
                // IMPORTANT FIX: Save only to sessionStorage so it doesn't affect the rest of the site!
                sessionStorage.setItem('bodyPartsLang', selectedLang);
                window.location.reload(); 
            }
        });
    });

    const uiDictionary = {
        "page-title": { en: "👶 Learn Body Parts", hi: "👶 शरीर के अंग सीखें", mr: "👶 शरीराचे अवयव शिका" },
        "homeBtnNav": { en: "🏠 Home", hi: "🏠 होम", mr: "🏠 होम" },
        "hubBtnNav": { en: "🎮 Activity Hub", hi: "🎮 एक्टिविटी हब", mr: "🎮 ऍक्टिव्हिटी हब" },
        "parentCornerBtn": { en: "👨‍👩‍👧 Parent Corner", hi: "👨‍👩‍👧 पेरेंट कॉर्नर", mr: "👨‍👩‍👧 पेरेंट कॉर्नर" },
        "backBtn": { en: "⬅ Back", hi: "⬅ पीछे", mr: "⬅ मागे" },
        // "learnBtn": { en: "Learn Body Parts", hi: "शरीर के अंग सीखें", mr: "शरीराचे अवयव शिका" },
        "activitiesBtn": { en: "Body Activities", hi: "शरीर गतिविधियां", mr: "शरीर ऍक्टिव्हिटीज" },
        "closeHint": { en: "Tap anywhere to close", hi: "बंद करने के लिए कहीं भी टैप करें", mr: "बंद करण्यासाठी कुठेही टॅप करा" },
        "seoText": {
            en: `
                <h2>About The Interactive Anatomy Zone</h2>
                <p>Welcome to the KidsFunLearnHub Anatomy Zone! This interactive digital activity is designed to help early learners discover the human body. By tapping the glowing blue dots on the character, toddlers trigger fun visual pop-ups and sounds that reveal different body parts like the head, hands, and feet.</p>
                <p><strong>Learning Outcomes:</strong> Physical self-awareness, anatomical vocabulary, spatial orientation, and multilingual physical identification.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>How to Play & Educational Benefits</h3>
                        <p>Learning body parts is a critical developmental milestone for personal autonomy. It allows toddlers to clearly communicate their physical needs, movements, and discomforts to parents or caregivers. The interactive "glowing dot" mechanic bridges the gap between digital learning and physical awareness. As children tap a dot on the screen's character to reveal an arm or a leg, they naturally mirror the action by pointing to their own bodies, which drastically improves their physical spatial orientation.</p>
                        <p>Physical vocabulary is arguably the most important language for young children to learn in their native tongue. This module provides crisp audio pronunciations to reinforce the visual pop-ups. A child tapping the head dot will simultaneously learn the English word alongside regional translations, such as 'Sir' (सिर) in Hindi and 'Doke' (डोके) in Marathi, giving them the exact words they need for daily communication at home.</p>
                        <h3>Frequently Asked Questions (FAQs)</h3>
                        <p><strong>Is this activity suitable for 2-year-olds?</strong><br>Yes! Pointing to basic body parts on command is a standard 18-to-24-month developmental milestone, making this intuitive dot-tapping game perfect for early toddlers.</p>
                        <p><strong>Do you offer offline activities for body parts?</strong><br>Absolutely. We offer free, high-quality printable body-part identification and coloring worksheets in the Parents Corner to reinforce this physical vocabulary away from the screen.</p>
                    </div>
                </details>
            `,
            hi: `
                <h2>इंटरएक्टिव एनाटॉमी ज़ोन के बारे में</h2>
                <p>KidsFunLearnHub एनाटॉमी ज़ोन में आपका स्वागत है! यह डिजिटल गतिविधि बच्चों को मानव शरीर के बारे में जानने में मदद करती है। चरित्र पर चमकते नीले बिंदुओं को टैप करके, बच्चे मज़ेदार दृश्य पॉप-अप और ध्वनियों को ट्रिगर करते हैं जो सिर, हाथ और पैर जैसे शरीर के विभिन्न अंगों को प्रकट करते हैं।</p>
                <p><strong>सीखने के परिणाम:</strong> शारीरिक आत्म-जागरूकता, शारीरिक शब्दावली, स्थानिक अभिविन्यास, और बहुभाषी शारीरिक पहचान।</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कैसे खेलें और शैक्षिक लाभ</h3>
                        <p>शरीर के अंगों को सीखना व्यक्तिगत स्वायत्तता के लिए एक महत्वपूर्ण विकासात्मक मील का पत्थर है। यह बच्चों को माता-पिता को अपनी शारीरिक जरूरतों और आंदोलनों को स्पष्ट रूप से संप्रेषित करने की अनुमति देता है। जब बच्चे बांह या पैर को प्रकट करने के लिए बिंदु पर टैप करते हैं, तो वे स्वाभाविक रूप से अपने स्वयं के शरीर की ओर इशारा करके कार्रवाई को दोहराते हैं, जो उनके शारीरिक अभिविन्यास में काफी सुधार करता है।</p>
                        <p>छोटे बच्चों के लिए अपनी मातृभाषा में सीखने के लिए शारीरिक शब्दावली यकीनन सबसे महत्वपूर्ण भाषा है। दृश्य पॉप-अप को सुदृढ़ करने के लिए यह मॉड्यूल कुरकुरा ऑडियो प्रदान करता है। सिर के बिंदु पर टैप करने वाला बच्चा एक साथ अंग्रेजी शब्द के साथ-साथ हिंदी में 'सिर' और मराठी में 'डोके' (Doke) जैसे क्षेत्रीय अनुवाद सीखेगा।</p>
                        <h3>अक्सर पूछे जाने वाले प्रश्न (FAQs)</h3>
                        <p><strong>क्या यह गतिविधि 2 साल के बच्चों के लिए उपयुक्त है?</strong><br>हाँ! शरीर के मूल अंगों की ओर इशारा करना 18-से-24-महीने का एक मानक विकासात्मक मील का पत्थर है, जो इस गेम को छोटे बच्चों के लिए एकदम सही बनाता है।</p>
                        <p><strong>क्या आप शरीर के अंगों के लिए ऑफ़लाइन गतिविधियों की पेशकश करते हैं?</strong><br>बिल्कुल। हम स्क्रीन से दूर इस भौतिक शब्दावली को सुदृढ़ करने के लिए पेरेंट्स कॉर्नर में मुफ्त प्रिंट करने योग्य वर्कशीट प्रदान करते हैं।</p>
                    </div>
                </details>
            `,
            mr: `
                <h2>इंटरएक्टिव ॲनाटॉमी झोनबद्दल</h2>
                <p>KidsFunLearnHub ॲनाटॉमी झोनमध्ये आपले स्वागत आहे! ही डिजिटल ऍक्टिव्हिटी लहान मुलांना मानवी शरीराबद्दल जाणून घेण्यास मदत करते. पात्रावरील चमकणाऱ्या निळ्या ठिपक्यांवर टॅप करून, मुले डोके, हात आणि पाय यांसारख्या शरीराचे विविध भाग उघड करणारे मजेशीर पॉप-अप आणि आवाज ट्रिगर करतात.</p>
                <p><strong>शिकण्याचे परिणाम:</strong> शारीरिक आत्म-जागरूकता, शारीरिक शब्दसंग्रह, आणि बहुभाषिक शारीरिक ओळख.</p>
                <details class="seo-accordion">
                    <summary><span class="read-more-btn"></span></summary>
                    <div class="seo-content-wrapper">
                        <h3>कसे खेळायचे आणि शैक्षणिक फायदे</h3>
                        <p>शरीराचे अवयव शिकणे हा वैयक्तिक स्वायत्ततेसाठी एक महत्त्वाचा टप्पा आहे. यामुळे लहान मुलांना त्यांच्या शारीरिक गरजा आणि हालचाली पालकांना स्पष्टपणे सांगता येतात. जेव्हा मुले हात किंवा पाय पाहण्यासाठी स्क्रीनवरील बिंदूवर टॅप करतात, तेव्हा ते नैसर्गिकरित्या स्वतःच्या शरीराकडे बोट दाखवून कृतीची नक्कल करतात, ज्यामुळे त्यांचे शारीरिक ज्ञान सुधारते.</p>
                        <p>लहान मुलांसाठी त्यांच्या मातृभाषेत शिकण्यासाठी शारीरिक शब्दसंग्रह ही सर्वात महत्त्वाची भाषा आहे. डोक्यावरील बिंदूवर टॅप करणारे मूल एकाच वेळी इंग्रजी शब्दासोबतच हिंदीत 'सिर' आणि मराठीत 'डोके' असे प्रादेशिक अनुवाद शिकेल, ज्यामुळे त्यांना घरी रोजच्या संवादासाठी आवश्यक असलेले नेमके शब्द मिळतील.</p>
                        <h3>वारंवार विचारले जाणारे प्रश्न (FAQs)</h3>
                        <p><strong>ही ऍक्टिव्हिटी २ वर्षांच्या मुलांसाठी योग्य आहे का?</strong><br>होय! शरीराचे मूलभूत भाग ओळखून दाखवणे हा १८ ते २४ महिन्यांचा एक मानक विकासात्मक टप्पा आहे, ज्यामुळे हा गेम लहान मुलांसाठी योग्य बनतो.</p>
                        <p><strong>तुम्ही शरीराच्या अवयवांसाठी ऑफलाइन ऍक्टिव्हिटी देता का?</strong><br>नक्कीच. स्क्रीनपासून दूर या शारीरिक शब्दसंग्रहाला बळकटी देण्यासाठी आम्ही पेरेंट्स कॉर्नरमध्ये मोफत, उच्च दर्जाचे प्रिंट करण्यायोग्य वर्कशीट देतो.</p>
                    </div>
                </details>
            `
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

    if (popup) {
        popup.onclick = () => {
            closePopup();
        };
    }

    const popupContent = document.querySelector('.popup-content');
    if (popupContent) {
        popupContent.onclick = (e) => {
            closePopup();
            e.stopPropagation();
        };
    }

    // 8. CLEAR SESSION STORAGE ON EXIT
    // If the user clicks back to the hub or home, clear this page's temporary language memory
    document.getElementById("backBtn").addEventListener("click", () => {
        sessionStorage.removeItem('bodyPartsLang');
    });
    
    document.getElementById("homeBtnNav").addEventListener("click", () => {
        sessionStorage.removeItem('bodyPartsLang');
    });

    document.getElementById("hubBtnNav").addEventListener("click", () => {
        sessionStorage.removeItem('bodyPartsLang');
    });
});