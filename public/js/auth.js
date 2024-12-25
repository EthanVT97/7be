function showLoginModal() {
    const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    if (registerModal) {
        registerModal.hide();
    }
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

function showRegisterModal() {
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) {
        loginModal.hide();
    }
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = event.currentTarget.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Form validation and submission
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const response = await fetch(`${config.API_BASE_URL}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        
        if (result.success) {
            // Hide modal
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            // Show success message
            showAlert(result.message, 'success');
            
            // Reload page after 1 second
            setTimeout(() => window.location.reload(), 1000);
        } else {
            showAlert(result.message, 'danger');
        }
        
    } catch (error) {
        showAlert('စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။', 'danger');
        console.error('Login error:', error);
    }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const phone = document.getElementById('registerPhone').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            throw new Error('စကားဝှက်များ မတူညီပါ');
        }
        
        const response = await fetch('/api/auth/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, phone, password })
        });

        const result = await response.json();
        
        if (result.success) {
            // Hide register modal
            bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
            
            // Show success message
            showAlert(result.message, 'success');
            
            // Show login modal after 1 second
            setTimeout(() => showLoginModal(), 1000);
        } else {
            showAlert(result.message, 'danger');
        }
        
    } catch (error) {
        showAlert(error.message || 'စနစ်တွင် အမှားတစ်ခု ဖြစ်ပေါ်နေပါသည်။', 'danger');
        console.error('Registration error:', error);
    }
});

function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    alertContainer.appendChild(alert);
    setTimeout(() => alert.remove(), 5000);
} 