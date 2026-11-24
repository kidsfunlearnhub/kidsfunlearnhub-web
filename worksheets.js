"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const BASE_SITE_URL = "https://www.kidsfunlearnhub.com";

    // DOM References
    const worksheetsGrid = document.getElementById("worksheetsGrid");
    const loadingBox = document.getElementById("loadingBox");
    const searchInput = document.getElementById("worksheetSearch");
    const clearSearchBtn = document.getElementById("clearSearchBtn");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const noResults = document.getElementById("noResults");
    const resetFiltersBtn = document.getElementById("resetFiltersBtn");

    const productModal = document.getElementById("productModal");
    const modalCarousel = document.getElementById("modalCarousel");
    const prevSlideBtn = document.getElementById("prevSlide");
    const nextSlideBtn = document.getElementById("nextSlide");
    const imageCounterPill = document.getElementById("imageCounterPill");

    const modalBadge = document.getElementById("modalBadge");
    const modalPagesBadge = document.getElementById("modalPagesBadge");
    const modalTitle = document.getElementById("modalTitle");
    const modalPrice = document.getElementById("modalPrice");
    const modalStrikePrice = document.getElementById("modalStrikePrice");
    const modalDesc = document.getElementById("modalDesc");
    const modalSampleBtn = document.getElementById("modalSampleBtn");
    const modalBuyBtn = document.getElementById("modalBuyBtn");
    const modalBuyTitle = document.getElementById("modalBuyTitle");

    const zoomModal = document.getElementById("zoomModal");
    const zoomImg = document.getElementById("zoomImg");

    let worksheetsData = [];
    let currentCategory = "all";
    let searchQuery = "";
    let selectedBundle = null;
    let currentSlideIndex = 0;

    // =========================================
    // FETCH LIVE DATA
    // =========================================
    fetch("worksheets_data.json?v=" + Date.now())
        .then((res) => {
            if (!res.ok) throw new Error("Failed to load worksheets");
            return res.json();
        })
        .then((data) => {
            worksheetsData = Array.isArray(data) ? data : [];
            loadingBox.classList.add("hidden");
            renderWorksheets();
            handleAppDeepLinking();
        })
        .catch((err) => {
            console.error("Worksheets load error:", err);
            loadingBox.classList.add("hidden");
            noResults.classList.remove("hidden");
        });

    // =========================================
    // GOOGLE DRIVE SAMPLE LINK HELPER
    // =========================================
    function getSampleRawUrl(sheet) {
        if (!sheet) return "";
        return (sheet.sample_pdf || sheet.sample_drive_link || sheet.sample_link || "").trim();
    }

    function formatDirectDownloadUrl(rawUrl) {
        if (!rawUrl) return "";

        // Google Drive sharing link -> direct PDF download link
        const fileMatch = rawUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (fileMatch && fileMatch[1]) {
            return `https://drive.google.com/uc?export=download&id=${fileMatch[1]}`;
        }

        const openMatch = rawUrl.match(/drive\.google\.com\/(?:open|uc)\?.*id=([a-zA-Z0-9_-]+)/);
        if (openMatch && openMatch[1]) {
            return `https://drive.google.com/uc?export=download&id=${openMatch[1]}`;
        }

        // Direct external URL ya relative website PDF path
        if (/^https?:\/\//i.test(rawUrl)) {
            return rawUrl;
        }
        return `${BASE_SITE_URL}/${rawUrl.replace(/^\//, "")}`;
    }

    function handleDownloadSample(bundleInfo) {
        const rawUrl = getSampleRawUrl(bundleInfo);

        if (!rawUrl) {
            alert("Is bundle ka free sample PDF jald hi add hone wala hai.");
            return;
        }

        const downloadUrl = formatDirectDownloadUrl(rawUrl);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    modalSampleBtn.addEventListener("click", function () {
        handleDownloadSample(selectedBundle);
    });

    // =========================================
    // RENDER CARDS
    // =========================================
    function renderWorksheets() {
        worksheetsGrid.innerHTML = "";

        const filteredList = worksheetsData.filter((item) => {
            const cats = Array.isArray(item.categories) ? item.categories : [];
            const matchesCat = currentCategory === "all" || cats.includes(currentCategory);
            const titleStr = (item.title || "").toLowerCase();
            const subStr = (item.subtitle || "").toLowerCase();
            const matchesSearch =
                searchQuery === "" || titleStr.includes(searchQuery) || subStr.includes(searchQuery);
            return matchesCat && matchesSearch;
        });

        if (filteredList.length === 0) {
            noResults.classList.remove("hidden");
            worksheetsGrid.style.display = "none";
            return;
        }

        noResults.classList.add("hidden");
        worksheetsGrid.style.display = "grid";

        filteredList.forEach((sheet) => {
            const card = document.createElement("div");
            card.className = "worksheet-card";
            card.id = sheet.file_id || String(sheet.id || "");

            const coverImg = sheet.images && sheet.images.length > 0 ? sheet.images[0] : "";
            const hasSample = Boolean(getSampleRawUrl(sheet));

            const badgeHTML = sheet.badge
                ? `<div class="lang-badge">${escapeHtml(sheet.badge)}</div>`
                : "";

            const strikePriceHTML = sheet.original_price
                ? `<span class="card-strike-price">${escapeHtml(sheet.original_price)}</span>`
                : "";

            const imageHTML = coverImg
                ? `<img src="${escapeHtml(coverImg)}" alt="${escapeHtml(sheet.title || "Worksheet")}" class="card-image" loading="lazy">`
                : `<div class="card-icon">📚</div>`;

            const sampleHintHTML = hasSample
                ? `<p class="sample-hint-text">🎁 Free Sample Inside</p>`
                : "";

            card.innerHTML = `
                ${badgeHTML}
                <div class="price-badge">
                    ${strikePriceHTML}
                    <span class="price-text">${escapeHtml(sheet.price || "")}</span>
                </div>
                <div class="card-image-box">
                    ${imageHTML}
                </div>
                <h2>${escapeHtml(sheet.title || "")}</h2>
                <p class="card-subtitle">${escapeHtml(sheet.subtitle || "")}</p>
                ${sampleHintHTML}
                <button type="button" class="preview-btn">Preview &amp; Sample</button>
            `;

            card.addEventListener("click", () => openModal(sheet));
            worksheetsGrid.appendChild(card);
        });
    }

    // =========================================
    // PRODUCT MODAL & CAROUSEL CONTROLS
    // =========================================
    function updateCarouselUI() {
        const total = selectedBundle && selectedBundle.images ? selectedBundle.images.length : 0;

        if (total > 1) {
            prevSlideBtn.classList.remove("hidden");
            nextSlideBtn.classList.remove("hidden");
            prevSlideBtn.disabled = currentSlideIndex <= 0;
            nextSlideBtn.disabled = currentSlideIndex >= total - 1;
        } else {
            prevSlideBtn.classList.add("hidden");
            nextSlideBtn.classList.add("hidden");
        }

        if (total > 0) {
            imageCounterPill.textContent = `🔍 Tap to zoom • ${currentSlideIndex + 1}/${total}`;
            imageCounterPill.classList.remove("hidden");
        } else {
            imageCounterPill.classList.add("hidden");
        }
    }

    function openModal(sheet) {
        selectedBundle = sheet;
        currentSlideIndex = 0;

        // Badges
        if (sheet.badge) {
            modalBadge.textContent = sheet.badge;
            modalBadge.classList.remove("hidden");
        } else {
            modalBadge.classList.add("hidden");
        }

        if (sheet.pages) {
            modalPagesBadge.textContent = `📄 ${sheet.pages}`;
            modalPagesBadge.classList.remove("hidden");
        } else {
            modalPagesBadge.classList.add("hidden");
        }

        // Title, Price & Description
        modalTitle.textContent = sheet.title || "";
        modalPrice.textContent = sheet.price || "";

        if (sheet.original_price) {
            modalStrikePrice.textContent = sheet.original_price;
            modalStrikePrice.classList.remove("hidden");
        } else {
            modalStrikePrice.classList.add("hidden");
        }

        modalDesc.textContent = sheet.description || sheet.subtitle || "";

        // Buy Button (Existing payment page + Google Drive flow)
        modalBuyTitle.textContent = `🔓 Unlock Full Bundle (${sheet.price || ""})`;
        if (sheet.buy_link) {
            modalBuyBtn.href = sheet.buy_link;
            modalBuyBtn.classList.remove("hidden");
        } else {
            modalBuyBtn.href = "#";
            modalBuyBtn.classList.add("hidden");
        }

        // Carousel Images
        modalCarousel.innerHTML = "";
        modalCarousel.scrollLeft = 0;

        if (sheet.images && sheet.images.length > 0) {
            sheet.images.forEach((imgSrc, idx) => {
                const img = document.createElement("img");
                img.src = imgSrc;
                img.alt = `${sheet.title || "Worksheet"} preview ${idx + 1}`;
                img.addEventListener("click", () => openZoom(imgSrc));
                modalCarousel.appendChild(img);
            });
        } else {
            modalCarousel.innerHTML =
                '<div style="display:flex;justify-content:center;align-items:center;width:100%;height:300px;font-size:64px;">📚</div>';
        }

        updateCarouselUI();

        productModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";

        if (window.location.hash !== "#modal") {
            window.location.hash = "modal";
        }
    }

    function openZoom(src) {
        zoomImg.src = src;
        zoomModal.classList.remove("hidden");
        if (window.location.hash !== "#zoom") {
            window.location.hash = "zoom";
        }
    }

    function closeCurrentModal() {
        if (window.location.hash === "#zoom" || window.location.hash === "#modal") {
            window.history.back();
        } else {
            zoomModal.classList.add("hidden");
            productModal.classList.add("hidden");
            document.body.style.overflow = "";
        }
    }

    // Mobile Back Button Handling
    window.addEventListener("hashchange", function () {
        const currentHash = window.location.hash;

        if (currentHash === "#modal") {
            if (!zoomModal.classList.contains("hidden")) {
                zoomModal.classList.add("hidden");
            }
        } else if (
            currentHash === "" ||
            (!currentHash.includes("modal") && !currentHash.includes("zoom"))
        ) {
            if (!zoomModal.classList.contains("hidden")) {
                zoomModal.classList.add("hidden");
            }
            if (!productModal.classList.contains("hidden")) {
                productModal.classList.add("hidden");
                document.body.style.overflow = "";
            }
        }
    });

    // Close Triggers
    document.getElementById("closeModal").addEventListener("click", closeCurrentModal);
    document.getElementById("closeZoom").addEventListener("click", closeCurrentModal);

    window.addEventListener("click", function (e) {
        if (e.target === productModal || e.target === zoomModal) {
            closeCurrentModal();
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (!zoomModal.classList.contains("hidden") || !productModal.classList.contains("hidden")) {
                closeCurrentModal();
            }
        }
    });

    // Carousel Navigation & Scroll Sync
    nextSlideBtn.addEventListener("click", function () {
        const total = selectedBundle && selectedBundle.images ? selectedBundle.images.length : 0;
        if (currentSlideIndex < total - 1) {
            currentSlideIndex += 1;
            modalCarousel.scrollTo({
                left: currentSlideIndex * modalCarousel.clientWidth,
                behavior: "smooth",
            });
            updateCarouselUI();
        }
    });

    prevSlideBtn.addEventListener("click", function () {
        if (currentSlideIndex > 0) {
            currentSlideIndex -= 1;
            modalCarousel.scrollTo({
                left: currentSlideIndex * modalCarousel.clientWidth,
                behavior: "smooth",
            });
            updateCarouselUI();
        }
    });

    let scrollTimer = null;
    modalCarousel.addEventListener("scroll", function () {
        if (scrollTimer) clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (modalCarousel.clientWidth > 0) {
                const newIndex = Math.round(modalCarousel.scrollLeft / modalCarousel.clientWidth);
                if (newIndex !== currentSlideIndex) {
                    currentSlideIndex = newIndex;
                    updateCarouselUI();
                }
            }
        }, 60);
    });

    // =========================================
    // SEARCH & CATEGORY FILTERS
    // =========================================
    function syncSearchClearBtn() {
        if (searchInput.value.length > 0) {
            clearSearchBtn.classList.remove("hidden");
        } else {
            clearSearchBtn.classList.add("hidden");
        }
    }

    searchInput.addEventListener("input", function (e) {
        searchQuery = e.target.value.toLowerCase().trim();
        syncSearchClearBtn();
        renderWorksheets();
    });

    clearSearchBtn.addEventListener("click", function () {
        searchInput.value = "";
        searchQuery = "";
        syncSearchClearBtn();
        renderWorksheets();
        searchInput.focus();
    });

    filterButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
            filterButtons.forEach((b) => b.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.dataset.category;
            renderWorksheets();
        });
    });

    resetFiltersBtn.addEventListener("click", function () {
        searchInput.value = "";
        searchQuery = "";
        currentCategory = "all";
        syncSearchClearBtn();
        filterButtons.forEach((b) => {
            b.classList.toggle("active", b.dataset.category === "all");
        });
        renderWorksheets();
    });

    // =========================================
    // DEEP LINKING (#Bundle_Id)
    // =========================================
    function handleAppDeepLinking() {
        if (
            window.location.hash &&
            !window.location.hash.includes("modal") &&
            !window.location.hash.includes("zoom")
        ) {
            const targetId = window.location.hash.substring(1);
            const targetCard = document.getElementById(targetId);

            if (targetCard) {
                targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
                targetCard.classList.add("highlight-card");
                setTimeout(() => targetCard.classList.remove("highlight-card"), 2000);

                const sheetData = worksheetsData.find(
                    (s) => s.file_id === targetId || String(s.id) === targetId
                );
                if (sheetData) {
                    setTimeout(() => openModal(sheetData), 600);
                }
            }
        }
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
});