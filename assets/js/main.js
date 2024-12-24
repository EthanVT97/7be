document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // File upload preview
    const fileInput = document.querySelector('.payment-proof-input');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const preview = document.querySelector('.file-preview');
            const file = e.target.files[0];
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <div class="preview-image">
                            <img src="${e.target.result}" alt="Payment Proof Preview">
                        </div>
                    `;
                }
                reader.readAsDataURL(file);
            }
        });
    }

    // Real-time notifications
    function checkNotifications() {
        fetch('api/notifications.php')
            .then(response => response.json())
            .then(data => {
                const notificationsList = document.querySelector('.notifications-list');
                if (notificationsList && data.notifications) {
                    notificationsList.innerHTML = data.notifications.map(notification => `
                        <div class="notification-item ${notification.read ? '' : 'unread'}">
                            <div class="notification-content">${notification.message}</div>
                            <div class="notification-time">${notification.time}</div>
                        </div>
                    `).join('');
                }
            })
            .catch(error => console.error('Error fetching notifications:', error));
    }

    // Check for new notifications every 30 seconds
    if (document.querySelector('.notifications-list')) {
        checkNotifications();
        setInterval(checkNotifications, 30000);
    }

    // Lottery results tabs
    const resultTabs = document.querySelectorAll('.result-tab');
    resultTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            
            // Remove active class from all tabs and contents
            resultTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.result-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and its content
            this.classList.add('active');
            document.querySelector(target).classList.add('active');
        });
    });
});
