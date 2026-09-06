"use strict";

document.addEventListener("DOMContentLoaded", function() {
    const worksheetsGrid = document.getElementById("worksheetsGrid");
    const searchInput = document.getElementById("worksheetSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noResults = document.getElementById("noResults");
    
    // Modal Elements
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
            handleAppDeepLinking(); // YAHAN DEEP LINKING FUNCTION CALL WAPAS ADD KIYA HAI
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
                
                // Set the card cover image (first image in array)
                const coverImg = (sheet.images && sheet.images.length > 0) ? sheet.images[0] : '';
                
                card.innerHTML = `
                    <div class="lang-badge">${sheet.badge}</div>
                    <div class="price-badge">${sheet.price}</div>
                    ${coverImg ? `<img src="${coverImg}" style="width:100%; height:180px; object-fit:contain; margin-bottom:15px; border-radius:10px;">` : `<div class="card-icon">📚</div>`}
                    <h2>${sheet.title}</h2>
                    <p class="card-subtitle">${sheet.subtitle}</p>
                    <button class="buy-btn" style="pointer-events:none;">View Details</button>
                `;
                
                // Open Modal on Click
                card.addEventListener('click', () => openModal(sheet));
                worksheetsGrid.appendChild(card);
            });
        }
    }

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
    }

    function openZoom(src) {
        zoomImg.src = src;
        zoomModal.classList.remove("hidden");
    }

    // Modal Close Buttons
    document.getElementById("closeModal").addEventListener('click', () => productModal.classList.add("hidden"));
    document.getElementById("closeZoom").addEventListener('click', () => zoomModal.classList.add("hidden"));
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === productModal) productModal.classList.add("hidden");
        if (e.target === zoomModal) zoomModal.classList.add("hidden");
    });

    // Arrow Navigation Logic
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

    // DEEP LINKING LOGIC WAPAS ADD KIYA
    function handleAppDeepLinking() {
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetCard = document.getElementById(targetId);
            
            if (targetCard) {
                // 1. Scroll to the specific card smoothly
                targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
                
                // 2. Add a temporary highlight glow
                targetCard.classList.add("highlight-card");
                setTimeout(() => targetCard.classList.remove("highlight-card"), 2000);
                
                // 3. NAYA FEATURE: Automatically us bundle ka bada Modal open kar do
                const sheetData = worksheetsData.find(s => s.file_id === targetId);
                if (sheetData) {
                    setTimeout(() => openModal(sheetData), 600); // Thoda delay taaki pehle scroll ho jaye fir modal open ho
                }
            }
        }
    }
});