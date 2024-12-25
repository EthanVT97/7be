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
            
            // Add click handler
            numberBox.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            
            numberContainer.appendChild(numberBox);
        }
    }
}

function setupEventListeners() {
    // Add smooth scrolling for navigation
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Play button click handler
    const playButton = document.querySelector('.btn-primary');
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    }
}

// Add section IDs to match navigation
function addSectionIds() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (!section.id) {
            section.id = `section-${index + 1}`;
        }
    });
}

// Export functions for use in other scripts
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.initializeLottery = initializeLottery; 