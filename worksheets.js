"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const worksheetsGrid = document.getElementById("worksheetsGrid");
    const searchInput = document.getElementById("worksheetSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noResults = document.getElementById("noResults");
    
    const productModal = document.getElementById("productModal");
    const modalCarousel = document.getElementById("modalCarousel");
    const zoomModal = document.getElementById("zoomModal");
    const zoomImg = document.getElementById("zoomImg");
    
    let worksheetsData = [];
    let currentCategory = "all";
    let searchQuery = "";

    // Cache buster for live updates
    fetch("worksheets_data.json?v=" + new Date().getTime())
        .then(res => res.json())
        .then(data => {
            worksheetsData = data;
            renderWorksheets();
            handleAppDeepLinking();
        });

    function renderWorksheets() {
        worksheetsGrid.innerHTML = "";
        const filteredList = worksheetsData.filter(item => {
            const matchesCat = (currentCategory === "all" || item.categories.includes(currentCategory));
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) || item.subtitle.toLowerCase().includes(searchQuery);
            return matchesCat && matchesSearch;
        });

        if (filteredList.length === 0) {
            noResults.classList.remove("hidden");
            worksheetsGrid.style.display = "none";
        } else {
            noResults.classList.add("hidden");
            worksheetsGrid.style.display = "grid";
            
            filteredList.forEach(sheet => {
                const card = document.createElement("div");
                card.className = "worksheet-card";
                card.id = sheet.file_id;
                
                const coverImg = (sheet.images && sheet.images.length > 0) ? sheet.images[0] : '';
                
                card.innerHTML = `
                    <div class="lang-badge">${sheet.badge}</div>
                    <div class="price-badge">${sheet.price}</div>
                    ${coverImg ? `<img src="${coverImg}" style="width:100%; height:180px; object-fit:contain; margin-bottom:15px; border-radius:10px;">` : `<div class="card-icon">📚</div>`}
                    <h2>${sheet.title}</h2>
                    <p class="card-subtitle">${sheet.subtitle}</p>
                    <button class="buy-btn" style="pointer-events:none;">View Details</button>
                `;
                
                card.addEventListener('click', () => openModal(sheet));
                worksheetsGrid.appendChild(card);
            });
        }
    }

    // ==========================================
    // BULLETPROOF MOBILE BACK BUTTON LOGIC
    // ==========================================

    function openModal(sheet) {
        document.getElementById("modalBadge").innerText = sheet.badge;
        document.getElementById("modalTitle").innerText = sheet.title;
        document.getElementById("modalPrice").innerText = sheet.price;
        document.getElementById("modalDesc").innerText = sheet.description || sheet.subtitle; 
        document.getElementById("modalBuyBtn").href = sheet.buy_link;
        
        modalCarousel.innerHTML = "";
        if (sheet.images && sheet.images.length > 0) {
            sheet.images.forEach(imgSrc => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.addEventListener('click', () => openZoom(imgSrc));
                modalCarousel.appendChild(img);
            });
        } else {
            modalCarousel.innerHTML = `<div style="display:flex; justify-content:center; align-items:center; width:100%; height:100%; background:#f8f9fa; font-size:60px;">📚</div>`;
        }
        
        productModal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Background scroll lock kiya
        
        // Push Hash to URL so Mobile Back Button works perfectly
        window.location.hash = "modal"; 
    }

    function openZoom(src) {
        zoomImg.src = src;
        zoomModal.classList.remove("hidden");
        window.location.hash = "zoom"; 
    }

    // Listen for URL changes (which happens when Mobile Back button is pressed)
    window.addEventListener('hashchange', function() {
        const currentHash = window.location.hash;
        
        if (currentHash === "#modal") {
            // Hum zoom se wapas modal pe aaye hain
            if (!zoomModal.classList.contains("hidden")) {
                zoomModal.classList.add("hidden");
            }
        } 
        else if (currentHash === "" || (!currentHash.includes("modal") && !currentHash.includes("zoom"))) {
            // Hum modal se wapas main page par aaye hain
            if (!zoomModal.classList.contains("hidden")) {
                zoomModal.classList.add("hidden");
            }
            if (!productModal.classList.contains("hidden")) {
                productModal.classList.add("hidden");
                document.body.style.overflow = ""; // Background scroll wapas chalu kiya
            }
        }
    });

    // Modal Close Buttons (Calling browser back to trigger the logic above)
    document.getElementById("closeModal").addEventListener('click', () => window.history.back());
    document.getElementById("closeZoom").addEventListener('click', () => window.history.back());
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === productModal || e.target === zoomModal) {
            window.history.back();
        }
    });

    // Arrow Navigation inside Modal
    document.getElementById("nextSlide").addEventListener('click', () => {
        modalCarousel.scrollBy({ left: modalCarousel.clientWidth, behavior: 'smooth' });
    });
    document.getElementById("prevSlide").addEventListener('click', () => {
        modalCarousel.scrollBy({ left: -modalCarousel.clientWidth, behavior: 'smooth' });
    });

    searchInput.addEventListener("input", e => { searchQuery = e.target.value.toLowerCase().trim(); renderWorksheets(); });
    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            filterButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.dataset.category;
            renderWorksheets();
        });
    });

    function handleAppDeepLinking() {
        // Sirf tab trigger hoga jab URL app se aaya ho (e.g., #English_Bundle)
        if (window.location.hash && !window.location.hash.includes("modal") && !window.location.hash.includes("zoom")) {
            const targetId = window.location.hash.substring(1);
            const targetCard = document.getElementById(targetId);
            
            if (targetCard) {
                targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
                targetCard.classList.add("highlight-card");
                setTimeout(() => targetCard.classList.remove("highlight-card"), 2000);
                
                const sheetData = worksheetsData.find(s => s.file_id === targetId);
                if (sheetData) {
                    setTimeout(() => openModal(sheetData), 600);
                }
            }
        }
    }
});