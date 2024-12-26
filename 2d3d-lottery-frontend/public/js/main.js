document.addEventListener('DOMContentLoaded', function() {
    initializeLottery();
    setupEventListeners();
    addSectionIds();
});

function initializeLottery() {
    const numberContainer = document.querySelector('.lottery-numbers');
    if (!numberContainer) return;

    // Clear existing numbers
    numberContainer.innerHTML = '';
    
    // Generate sample numbers (replace with API call in production)
    for (let i = 1; i <= 10; i++) {
        const numberBox = document.createElement('div');
        numberBox.className = 'number-box';
        
        // Generate random 2-digit number with leading zero
        const randomNum = Math.floor(Math.random() * 99);
        numberBox.textContent = randomNum.toString().padStart(2, '0');
        
        // Add click handler
        numberBox.addEventListener('click', function() {
            this.classList.toggle('selected');
            updateSelectedNumbers();
        });
        
        numberContainer.appendChild(numberBox);
    }
}

function updateSelectedNumbers() {
    const selectedNumbers = [];
    document.querySelectorAll('.number-box.selected').forEach(box => {
        selectedNumbers.push(box.textContent);
    });
    
    // Update selected numbers display
    const selectedDisplay = document.querySelector('.selected-numbers');
    if (selectedDisplay) {
        selectedDisplay.textContent = selectedNumbers.join(', ') || 'No numbers selected';
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
            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                window.auth.showLoginModal();
                return;
            }

            // Animate button
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);

            // Get selected numbers
            const selectedNumbers = [];
            document.querySelectorAll('.number-box.selected').forEach(box => {
                selectedNumbers.push(box.textContent);
            });

            if (selectedNumbers.length === 0) {
                window.auth.showAlert('Please select at least one number', 'warning');
                return;
            }

            // TODO: Submit selected numbers to API
            console.log('Selected numbers:', selectedNumbers);
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
window.initializeLottery = initializeLottery;
window.updateSelectedNumbers = updateSelectedNumbers;
