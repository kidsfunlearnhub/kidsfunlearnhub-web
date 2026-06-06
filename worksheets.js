"use strict";

document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Structured Worksheet Database
    // Note: Add your actual PDF and Thumbnail image paths here!
    const worksheetsData = [
        {
            id: 1,
            title: "Line Tracing Basics",
            category: "tracing",
            badge: "Ages 2-4",
            thumbnail: "images/thumbnails/line-tracing.png", // Replace with your image
            pdfUrl: "pdf/line-tracing.pdf", // Replace with your PDF
            keywords: ["strokes", "lines", "pre-writing", "dashed"]
        },
        {
            id: 2,
            title: "Fruit Shadow Match",
            category: "cognitive",
            badge: "Logic",
            thumbnail: "images/thumbnails/fruit-shadow.png",
            pdfUrl: "pdf/fruit-shadow.pdf",
            keywords: ["shapes", "matching", "fruits", "shadows"]
        },
        {
            id: 3,
            title: "Marathi Numbers 1-10",
            category: "language",
            badge: "Marathi",
            thumbnail: "images/thumbnails/marathi-numbers.png",
            pdfUrl: "pdf/marathi-numbers.pdf",
            keywords: ["marathi", "numbers", "tracing", "regional"]
        },
        {
            id: 4,
            title: "Hindi Swar Tracing",
            category: "language",
            badge: "Hindi",
            thumbnail: "images/thumbnails/hindi-swar.png",
            pdfUrl: "pdf/hindi-swar.pdf",
            keywords: ["hindi", "alphabet", "swar", "varnamala", "devanagari"]
        },
        {
            id: 5,
            title: "Count and Add (1-10)",
            category: "math",
            badge: "Math",
            thumbnail: "images/thumbnails/basic-math.png",
            pdfUrl: "pdf/kindergarten-math.pdf",
            keywords: ["math", "sum", "plus", "counting", "numbers"]
        },
        {
            id: 6,
            title: "English ABC Tracing",
            category: "tracing",
            badge: "English",
            thumbnail: "images/thumbnails/abc-tracing.png",
            pdfUrl: "pdf/abc-tracing.pdf",
            keywords: ["alphabets", "english", "letters", "abc"]
        }
    ];

    const worksheetsGrid = document.getElementById("worksheetsGrid");
    const searchInput = document.getElementById("worksheetSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noResults = document.getElementById("noResults");

    let currentCategory = "all";
    let searchQuery = "";

    // Render Function generating the small, compact cards
    function renderWorksheets() {
        worksheetsGrid.innerHTML = "";
        
        const filteredList = worksheetsData.filter(item => {
            const matchesCategory = (currentCategory === "all" || item.category === currentCategory);
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                                  item.keywords.some(kw => kw.toLowerCase().includes(searchQuery)) ||
                                  item.category.toLowerCase().includes(searchQuery);

            return matchesCategory && matchesSearch;
        });

        if (filteredList.length === 0) {
            noResults.classList.remove("hidden");
            worksheetsGrid.style.display = "none";
        } else {
            noResults.classList.add("hidden");
            worksheetsGrid.style.display = "flex";
            
            filteredList.forEach(sheet => {
                const card = document.createElement("div");
                card.className = "worksheet-card";
                
                // Clicking the card triggers the download button inside it
                card.onclick = (e) => {
                    if(e.target.tagName !== 'A') {
                        card.querySelector('.download-btn').click();
                    }
                };

                card.innerHTML = `
                    <div class="card-thumbnail-wrapper">
                        <span class="lang-badge">${sheet.badge}</span>
                        <img src="${sheet.thumbnail}" alt="${sheet.title}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><text x=\\'50%\\' y=\\'50%\\' font-size=\\'40\\' text-anchor=\\'middle\\' dy=\\'.3em\\'>📄</text></svg>'">
                    </div>
                    <h2>${sheet.title}</h2>
                    <a href="${sheet.pdfUrl}" class="download-btn" download>📥 Download PDF</a>
                `;
                worksheetsGrid.appendChild(card);
            });
        }
    }

    searchInput.addEventListener("input", function(e) {
        searchQuery = e.target.value.toLowerCase().trim();
        renderWorksheets();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", function() {
            filterButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            
            currentCategory = this.dataset.category;
            renderWorksheets();
        });
    });

    // Smart Back Button Logic
    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            const returnUrl = sessionStorage.getItem('hubReturnUrl') || "index.html";
            window.location.href = returnUrl; 
        });
    }

    renderWorksheets();
});