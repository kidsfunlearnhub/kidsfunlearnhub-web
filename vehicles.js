// This tells the script to WAIT until the HTML is fully loaded on the screen
window.onload = function() {

    /////////////////////////////////////////////////
    // 1. LANGUAGE DICTIONARY & SETUP
    /////////////////////////////////////////////////

    // Read the language clicked on the home page (default to English if empty)
    let currentLang = localStorage.getItem('mySecretLanguage') || 'en';

    // Dictionary for the Page Title and Next Button
    const uiDictionary = {
        "page-title": { en: "🚌 Learn Vehicles", hi: "🚌 वाहन सीखें", mr: "🚌 वाहने शिका" },
        "nextBtn": { en: "➡ Next Vehicles", hi: "➡ अगले वाहन", mr: "➡ पुढील वाहने" }
    };

    // Dictionary for all 30 vehicles
    const vehicleDict = {
        "car": { en: "Car", hi: "कार", mr: "कार" },
        "bus": { en: "Bus", hi: "बस", mr: "बस" },
        "auto rickshaw": { en: "Auto Rickshaw", hi: "ऑटो रिक्शा", mr: "ऑटो रिक्षा" },
        "motorcycle": { en: "Motorcycle", hi: "मोटरसाइकिल", mr: "मोटारसायकल" },
        "bicycle": { en: "Bicycle", hi: "साइकिल", mr: "सायकल" },
        "scooter": { en: "Scooter", hi: "स्कूटर", mr: "स्कूटर" },
        "truck": { en: "Truck", hi: "ट्रक", mr: "ट्रक" },
        "tractor": { en: "Tractor", hi: "ट्रैक्टर", mr: "ट्रॅक्टर" },
        "train": { en: "Train", hi: "रेलगाड़ी", mr: "रेल्वे" },
        "metro": { en: "Metro", hi: "मेट्रो", mr: "मेट्रो" },
        "ambulance": { en: "Ambulance", hi: "एम्बुलेंस", mr: "रुग्णवाहिका" },
        "fire engine": { en: "Fire Engine", hi: "दमकल", mr: "अग्निशमन दल" },
        "police jeep": { en: "Police Jeep", hi: "पुलिस जीप", mr: "पोलीस जीप" },
        "school bus": { en: "School Bus", hi: "स्कूल बस", mr: "स्कूल बस" },
        "van": { en: "Van", hi: "वैन", mr: "व्हॅन" },
        "tempo": { en: "Tempo", hi: "टेम्पो", mr: "टेम्पो" },
        "delivery truck": { en: "Delivery Truck", hi: "डिलीवरी ट्रक", mr: "मालवाहू ट्रक" },
        "taxi": { en: "Taxi", hi: "टैक्सी", mr: "टॅक्सी" },
        "rickshaw": { en: "Rickshaw", hi: "रिक्शा", mr: "रिक्षा" },
        "bulldozer": { en: "Bulldozer", hi: "बुलडोजर", mr: "बुलडोझर" },
        "crane": { en: "Crane", hi: "क्रेन", mr: "क्रेन" },
        "excavator": { en: "Excavator", hi: "उत्खनन मशीन", mr: "एक्साव्हेटर" },
        "boat": { en: "Boat", hi: "नाव", mr: "बोट" },
        "ferry": { en: "Ferry", hi: "नौका", mr: "फेरी" },
        "ship": { en: "Ship", hi: "पानी का जहाज", mr: "जहाज" },
        "helicopter": { en: "Helicopter", hi: "हेलीकॉप्टर", mr: "हेलिकॉप्टर" },
        "airplane": { en: "Airplane", hi: "हवाई जहाज", mr: "विमान" },
        "garbage truck": { en: "Garbage Truck", hi: "कचरा ट्रक", mr: "कचऱ्याचा ट्रक" },
        "cement mixer": { en: "Cement Mixer", hi: "सीमेंट मिक्सर", mr: "सिमेंट मिक्सर" },
        "tow truck": { en: "Tow Truck", hi: "टो ट्रक", mr: "टोइंग ट्रक" }
    };

    const vehicles = Object.keys(vehicleDict);
    const PAGE_SIZE = 15;
    let currentPage = 0;

    /////////////////////////////////////////////////
    // ELEMENTS & TRANSLATING UI
    /////////////////////////////////////////////////

    const grid = document.getElementById("vehicleGrid");
    const popup = document.getElementById("popup");
    const popupImg = document.getElementById("popupImg");
    const popupName = document.getElementById("popupName");
    const nextBtn = document.getElementById("nextBtn");

    // Safely update the title and button text
    const titleElement = document.getElementById("page-title");
    if (titleElement) titleElement.innerText = uiDictionary["page-title"][currentLang];
    if (nextBtn) nextBtn.innerText = uiDictionary["nextBtn"][currentLang];

    /////////////////////////////////////////////////
    // 🚀 ULTRA-FAST PRELOAD CACHE
    /////////////////////////////////////////////////

    const imageCache = {};
    const soundCache = {};

    vehicles.forEach(name => {
      const img = new Image();
      img.src = `images/vehicles/${name}.webp`;
      imageCache[name] = img;

      const audio = new Audio();
      audio.src = `sounds/${currentLang}/vehicles/${name}.mp3`;
      audio.preload = "auto";
      soundCache[name] = audio;
    });

    /////////////////////////////////////////////////
    // BUILD PAGE GRID
    /////////////////////////////////////////////////

    function loadPage() {
      if (!grid) return; // Extra safety check
      grid.innerHTML = "";

      const start = currentPage * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      vehicles.slice(start, end).forEach(name => {
        const card = document.createElement("div");
        card.className = "card";

        const translatedName = vehicleDict[name][currentLang];

        card.innerHTML = `
          <img src="${imageCache[name].src}" alt="${name}">
          <p>${translatedName}</p>
        `;

        card.onclick = () => showVehicle(name);
        grid.appendChild(card);
      });
    }

    /////////////////////////////////////////////////
    // NEXT BUTTON
    /////////////////////////////////////////////////

    if (nextBtn) {
        nextBtn.onclick = () => {
          currentPage++;
          if (currentPage * PAGE_SIZE >= vehicles.length) {
            currentPage = 0;
          }
          loadPage();
        };
    }

    /////////////////////////////////////////////////
    // POPUP DISPLAY
    /////////////////////////////////////////////////

    function showVehicle(name) {
      if (popupImg) popupImg.src = imageCache[name].src;
      if (popupName) popupName.textContent = vehicleDict[name][currentLang];
      if (popup) popup.classList.remove("hidden");

      const sound = soundCache[name];
      sound.currentTime = 0;
      sound.play().catch(e => console.log("Sound play error: ", e));

      launchConfetti();
    }

    if (popup) {
        popup.onclick = () => popup.classList.add("hidden");
    }

    /////////////////////////////////////////////////
    // CONFETTI
    /////////////////////////////////////////////////

    function launchConfetti() {
      if (typeof confetti === "function") {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
      }
    }

    /////////////////////////////////////////////////
    // INIT
    /////////////////////////////////////////////////

    loadPage();
};