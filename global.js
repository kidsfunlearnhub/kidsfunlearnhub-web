"use strict";

// 1. INSTANTLY apply the saved cursor (Runs before the page even finishes loading to prevent flickering)
(function applyGlobalCursor() {
    let savedCursorName = localStorage.getItem("kidsCursorName") || "dinosaur.webp"; // Dinosaur is default

    if (savedCursorName === "auto") {
        document.documentElement.style.setProperty('--main-cursor', 'auto');
        document.documentElement.style.setProperty('--pointer-cursor', 'pointer');
    } else {
        document.documentElement.style.setProperty('--main-cursor', `url("images/cursors/${savedCursorName}") 16 16, auto`);
        document.documentElement.style.setProperty('--pointer-cursor', `url("images/cursors/dinosaur_fire.webp") 16 16, pointer`);
    }
})();

// 2. Handle the dropdown menu (ONLY runs if the page actually has the dropdown box)
document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("cursorSelect");
    
    if (select) {
        let savedCursorName = localStorage.getItem("kidsCursorName") || "dinosaur.webp";
        select.value = savedCursorName; // Set the dropdown to match the current cursor

        select.addEventListener("change", (e) => {
            const newCursor = e.target.value;
            localStorage.setItem("kidsCursorName", newCursor);
            
            // Re-apply immediately when they pick a new one
            if (newCursor === "auto") {
                document.documentElement.style.setProperty('--main-cursor', 'auto');
                document.documentElement.style.setProperty('--pointer-cursor', 'pointer');
            } else {
                document.documentElement.style.setProperty('--main-cursor', `url("images/cursors/${newCursor}") 16 16, auto`);
                document.documentElement.style.setProperty('--pointer-cursor', `url("images/cursors/dinosaur_fire.webp") 16 16, pointer`);
            }
        });
    }
});