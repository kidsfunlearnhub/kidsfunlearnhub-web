"use strict";

document.addEventListener("DOMContentLoaded", function() {
    
    // Complete Bundled Worksheet Database
    // Replace the checkoutUrl values with your generated Instamojo Product Payment Links (e.g., https://imjo.in/xxxxxx)
    const worksheetsData = [
        {
            id: 1, 
            title: "Hindi Varnamala & Numbers Master Pack", 
            subtitle: "50+ Pages Swar, Vyanjan & Numbers (Color & Eco)", 
            price: "₹49",
            categories: ["tracing", "language", "math"], 
            badge: "Hindi", 
            thumbnail: "images/thumbnails/4line-varnmala.png", 
            checkoutUrl: "https://www.instamojo.com/@kidsfunlearnhub/hindi-varnamala-bundle",
            keywords: ["hindi", "varnamala", "swar", "vyanjan", "numbers", "tracing", "devanagari", "bundle"]
        },
        {
            id: 2, 
            title: "Marathi Aksharmala & Anka Practice Pack", 
            subtitle: "Structured 4-Line Tracing & Math Practice", 
            price: "₹49",
            categories: ["tracing", "language", "math"], 
            badge: "Marathi", 
            thumbnail: "images/thumbnails/circle-varnmala.png", 
            checkoutUrl: "https://www.instamojo.com/@kidsfunlearnhub/marathi-aksharmala-bundle",
            keywords: ["marathi", "varnamala", "aksharmala", "numbers", "tracing", "4 line", "anka"]
        },
        {
            id: 3, 
            title: "English Alphabet Master Tracing Pack", 
            subtitle: "Capital & Small Letters (A-Z, a-z) 4-Line Guide", 
            price: "₹49",
            categories: ["tracing", "language"], 
            badge: "English", 
            thumbnail: "images/thumbnails/4line-big-abc.png", 
            checkoutUrl: "https://www.instamojo.com/@kidsfunlearnhub/english-alphabet-bundle",
            keywords: ["english", "alphabets", "tracing", "capital", "small", "4 line", "pre-writing"]
        },
        {
            id: 4, 
            title: "Early Math & Number Recognition (1 to 50)", 
            subtitle: "Counting, Find-and-Circle & Number Tracing", 
            price: "₹49",
            categories: ["math", "cognitive", "tracing"], 
            badge: "Math", 
            thumbnail: "images/thumbnails/4line-numbers.png", 
            checkoutUrl: "https://www.instamojo.com/@kidsfunlearnhub/early-math-bundle",
            keywords: ["math", "numbers", "counting", "logic", "circle", "tracing", "preschool"]
        },
        {
            id: 5, 
            title: "Pre-Writing Strokes & Line Patterns", 
            subtitle: "Straight, Slanted, Zigzag & Curved Motor Training", 
            price: "₹21",
            categories: ["tracing", "cognitive"], 
            badge: "Fine Motor", 
            thumbnail: "images/thumbnails/tracing-lines.png", 
            checkoutUrl: "https://www.instamojo.com/@kidsfunlearnhub/pre-writing-bundle",
            keywords: ["lines", "strokes", "patterns", "fine motor", "toddler", "pencil grip"]
        },
        // {
        //     id: 6, 
        //     title: "Trilingual Coloring & Vocabulary Workbook", 
        //     subtitle: "Animals, Fruits & Shapes in English, Hindi & Marathi", 
        //     price: "₹129",
        //     categories: ["coloring", "language", "cognitive"], 
        //     badge: "Trilingual", 
        //     thumbnail: "images/thumbnails/color-shapes.png", 
        //     checkoutUrl: "https://www.instamojo.com/@kidsfunlearnhub/trilingual-coloring-bundle",
        //     keywords: ["coloring", "bilingual", "trilingual", "hindi", "marathi", "english", "shapes", "animals"]
        // }
    ];

    const worksheetsGrid = document.getElementById("worksheetsGrid");
    const searchInput = document.getElementById("worksheetSearch");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noResults = document.getElementById("noResults");

    let currentCategory = "all";
    let searchQuery = "";

    function renderWorksheets() {
        worksheetsGrid.innerHTML = "";
        
        const filteredList = worksheetsData.filter(item => {
            const matchesCategory = (currentCategory === "all" || item.categories.includes(currentCategory));
            
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) ||
                                  item.subtitle.toLowerCase().includes(searchQuery) ||
                                  item.keywords.some(kw => kw.toLowerCase().includes(searchQuery)) ||
                                  item.categories.some(cat => cat.toLowerCase().includes(searchQuery));

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
                
                card.innerHTML = `
                    <div class="price-tag">${sheet.price}</div>
                    <div class="card-thumbnail-wrapper">
                        <span class="lang-badge">${sheet.badge}</span>
                        <img src="${sheet.thumbnail}" alt="${sheet.title}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\'><text x=\\'50%\\' y=\\'50%\\' font-size=\\'40\\' text-anchor=\\'middle\\' dy=\\'.3em\\'>📚</text></svg>'">
                    </div>
                    <h2>${sheet.title}</h2>
                    <p class="card-subtitle">${sheet.subtitle}</p>
                    <div class="buy-group">
                        <a href="${sheet.checkoutUrl}" target="_blank" rel="noopener noreferrer" class="buy-btn">🛒 Buy Now</a>
                    </div>
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

    const backBtn = document.getElementById("backBtn");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            const returnUrl = sessionStorage.getItem('hubReturnUrl') || "index.html";
            window.location.href = returnUrl; 
        });
    }

    renderWorksheets();
});