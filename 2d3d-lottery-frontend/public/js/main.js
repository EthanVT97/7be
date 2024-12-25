// Load lottery numbers
function loadLotteryNumbers() {
    const container = document.querySelector('.lottery-numbers');
    if (!container) return;

    // Example numbers (replace with API call)
    const numbers = ['12', '34', '56', '78', '90'];
    
    container.innerHTML = numbers.map(num => `
        <div class="number-box">
            ${num}
        </div>
    `).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLotteryNumbers();
}); 