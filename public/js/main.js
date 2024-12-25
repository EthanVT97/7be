document.addEventListener('DOMContentLoaded', function() {
    initializeLottery();
    setupEventListeners();
});

function initializeLottery() {
    const numberContainer = document.querySelector('.lottery-numbers');
    if (numberContainer) {
        // Clear existing numbers
        numberContainer.innerHTML = '';
        
        // Generate sample numbers
        for (let i = 1; i <= 10; i++) {
            const numberBox = document.createElement('div');
            numberBox.className = 'number-box';
            
            // Generate random 2-digit number with leading zero
            const randomNum = Math.floor(Math.random() * 99);
            numberBox.textContent = randomNum.toString().padStart(2, '0');
            
            // Add animation class
            numberBox.addEventListener('click', function() {
                this.classList.add('selected');
            });
            
            numberContainer.appendChild(numberBox);
        }
    }
}

function setupEventListeners() {
    const playButton = document.querySelector('.btn-primary');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);

            // Generate new numbers
            initializeLottery();
        });
    }
}

// Add smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 