<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Check if user is logged in
session_start();

// Redirect to login if not authenticated
if (!isset($_SESSION['user_id']) && !in_array(basename($_SERVER['PHP_SELF']), ['login.php', 'register.php'])) {
    header('Location: login.php');
    exit();
}

include 'templates/header.php';
?>

<section class="hero">
    <div class="hero-content">
        <h1>Welcome to <?php echo SITE_NAME; ?></h1>
        <p>Your trusted platform for 2D, 3D, Thai, and Laos lottery results</p>
        <?php if (!isset($_SESSION['user_id'])): ?>
            <div class="auth-buttons">
                <a href="login.php" class="btn btn-primary">Login</a>
                <a href="register.php" class="btn btn-secondary">Register</a>
            </div>
        <?php endif; ?>
    </div>
</section>

<section class="features">
    <div class="container">
        <h2 class="text-center mb-5">Our Features</h2>
        <div class="features-grid">
            <div class="feature-card">
                <h3>2D/3D Results</h3>
                <p>Get instant access to the latest 2D and 3D lottery results</p>
            </div>
            <div class="feature-card">
                <h3>Thai Lottery</h3>
                <p>Stay updated with Thai lottery results and winning numbers</p>
            </div>
            <div class="feature-card">
                <h3>Laos Lottery</h3>
                <p>Access Laos lottery results quickly and easily</p>
            </div>
            <div class="feature-card">
                <h3>Secure Payments</h3>
                <p>Safe and secure payment processing for all transactions</p>
            </div>
        </div>
    </div>
</section>

<?php if (isset($_SESSION['user_id'])): ?>
<section class="dashboard container mt-5">
    <div class="dashboard-card results-panel">
        <h3>Latest Results</h3>
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active result-tab" data-target="#2d" href="#">2D</a>
            </li>
            <li class="nav-item">
                <a class="nav-link result-tab" data-target="#3d" href="#">3D</a>
            </li>
            <li class="nav-item">
                <a class="nav-link result-tab" data-target="#thai" href="#">Thai</a>
            </li>
            <li class="nav-item">
                <a class="nav-link result-tab" data-target="#laos" href="#">Laos</a>
            </li>
        </ul>
        <div class="tab-content mt-3">
            <div id="2d" class="result-content active">
                <!-- 2D results will be loaded here -->
            </div>
            <div id="3d" class="result-content">
                <!-- 3D results will be loaded here -->
            </div>
            <div id="thai" class="result-content">
                <!-- Thai lottery results will be loaded here -->
            </div>
            <div id="laos" class="result-content">
                <!-- Laos lottery results will be loaded here -->
            </div>
        </div>
    </div>

    <div class="dashboard-card">
        <h3>Payment Upload</h3>
        <form class="payment-form" action="upload_payment.php" method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label for="amount">Amount</label>
                <input type="number" class="form-control" id="amount" name="amount" required>
            </div>
            <div class="form-group">
                <label for="payment_method">Payment Method</label>
                <select class="form-control" id="payment_method" name="payment_method" required>
                    <option value="">Select Payment Method</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_payment">Mobile Payment</option>
                </select>
            </div>
            <div class="form-group">
                <label for="payment_proof">Payment Proof</label>
                <input type="file" class="form-control payment-proof-input" id="payment_proof" name="payment_proof" required>
                <div class="file-preview mt-2"></div>
            </div>
            <button type="submit" class="btn btn-primary">Upload Payment</button>
        </form>
    </div>

    <div class="dashboard-card notifications-panel">
        <h3>Notifications</h3>
        <div class="notifications-list">
            <!-- Notifications will be loaded here -->
        </div>
    </div>
</section>
<?php endif; ?>

<?php include 'templates/footer.php'; ?>
