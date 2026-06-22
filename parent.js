"use strict";

document.addEventListener("DOMContentLoaded", function() {
    
    // Set a return URL marker so that if the user goes into worksheets, 
    // the back button on the worksheets page knows to bring them back here.
    const activeCards = document.querySelectorAll('.active-card');
    
    activeCards.forEach(card => {
        card.addEventListener('click', () => {
            sessionStorage.setItem('hubReturnUrl', 'parent.html');
        });
    });

    /* ==========================================
       HIDDEN FOR ADSENSE APPROVAL 
       Uncomment this block when you restore 
       the "Coming Soon" cards in the HTML.
       ========================================== */
       
    /*
    // Gentle shake animation for "Coming Soon" cards
    const comingSoonCards = document.querySelectorAll('.coming-soon');
    
    comingSoonCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent accidental routing
            
            // Add a temporary gentle 'shake' class just for physical feedback
            card.style.animation = "shake 0.4s cubic-bezier(.36,.07,.19,.97) both";
            setTimeout(() => {
                card.style.animation = "";
            }, 400);
        });
    });

    // Inject shake keyframes into document dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            10%, 90% { transform: translate3d(-2px, 0, 0); }
            20%, 80% { transform: translate3d(4px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
            40%, 60% { transform: translate3d(6px, 0, 0); }
        }
    `;
    document.head.appendChild(style);
    */
});