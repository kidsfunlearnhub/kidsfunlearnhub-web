window.onload = function() {
    
    // 1. Welcome Confetti!
    // A quick burst of stars to make arriving at the hub feel exciting
    if (typeof confetti === "function") {
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 90,
                origin: { y: 0.2 },
                colors: ['#ff9800', '#4caf50', '#2196f3', '#e91e63'],
                disableForReducedMotion: true
            });
        }, 300); // Slight delay so the page renders first
    }

    // 2. Handle "Coming Soon" Card Clicks
    const comingSoonCards = document.querySelectorAll('.coming-soon');
    const popup = document.getElementById('comingSoonPopup');
    const closeBtn = document.getElementById('closePopupBtn');

    // Attach click event to all locked cards
    comingSoonCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior if any
            popup.classList.remove('hidden');
            
            // Optional: Play a gentle "boop" sound if you have one
            // let boop = new Audio('sounds/en/try_again.mp3');
            // boop.play();
        });
    });

    // Close the popup when the button is clicked
    closeBtn.addEventListener('click', () => {
        popup.classList.add('hidden');
    });

    // Close the popup if clicking outside the white box
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.add('hidden');
        }
    });
};