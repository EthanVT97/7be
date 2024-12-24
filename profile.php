<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$user_id = $_SESSION['user_id'];
$user = getUserDetails($user_id);
$payments = getUserPayments($user_id);
$notifications = getUserNotifications($user_id);

include 'templates/header.php';
?>

<div class="container mt-4">
    <div class="row">
        <!-- Profile Information -->
        <div class="col-md-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Profile Information</h5>
                </div>
                <div class="card-body">
                    <p><strong>Username:</strong> <?php echo htmlspecialchars($user['username']); ?></p>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($user['email']); ?></p>
                    <p><strong>Member Since:</strong> <?php echo formatDateTime($user['created_at']); ?></p>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changePasswordModal">
                        Change Password
                    </button>
                </div>
            </div>

            <!-- Notifications -->
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="mb-0">Notifications</h5>
                </div>
                <div class="card-body">
                    <div class="notifications-list">
                        <?php if (empty($notifications)): ?>
                            <p class="text-muted">No notifications</p>
                        <?php else: ?>
                            <?php foreach ($notifications as $notification): ?>
                                <div class="notification-item <?php echo $notification['read'] ? '' : 'unread'; ?>">
                                    <p class="mb-1"><?php echo htmlspecialchars($notification['message']); ?></p>
                                    <small class="text-muted"><?php echo formatDateTime($notification['created_at']); ?></small>
                                </div>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment History -->
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Payment History</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Proof</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($payments)): ?>
                                    <tr>
                                        <td colspan="5" class="text-center">No payment history</td>
                                    </tr>
                                <?php else: ?>
                                    <?php foreach ($payments as $payment): ?>
                                        <tr>
                                            <td><?php echo formatDateTime($payment['created_at']); ?></td>
                                            <td><?php echo number_format($payment['amount'], 2); ?></td>
                                            <td><?php echo htmlspecialchars($payment['payment_method']); ?></td>
                                            <td>
                                                <span class="badge bg-<?php echo getStatusBadgeClass($payment['status']); ?>">
                                                    <?php echo ucfirst($payment['status']); ?>
                                                </span>
                                            </td>
                                            <td>
                                                <button type="button" class="btn btn-sm btn-info" 
                                                        data-bs-toggle="modal" 
                                                        data-bs-target="#proofModal"
                                                        data-proof="uploads/payment_proofs/<?php echo $payment['payment_proof']; ?>">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- New Payment Button -->
            <div class="text-end mt-3">
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newPaymentModal">
                    Submit New Payment
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Change Password Modal -->
<div class="modal fade" id="changePasswordModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Change Password</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="change_password.php" method="POST">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="current_password" class="form-label">Current Password</label>
                        <input type="password" class="form-control" id="current_password" name="current_password" required>
                    </div>
                    <div class="mb-3">
                        <label for="new_password" class="form-label">New Password</label>
                        <input type="password" class="form-control" id="new_password" name="new_password" required>
                    </div>
                    <div class="mb-3">
                        <label for="confirm_new_password" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control" id="confirm_new_password" name="confirm_new_password" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Change Password</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- New Payment Modal -->
<div class="modal fade" id="newPaymentModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Submit New Payment</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="process_payment.php" method="POST" enctype="multipart/form-data">
                <div class="modal-body">
                    <div class="mb-3">
                        <label for="amount" class="form-label">Amount</label>
                        <input type="number" class="form-control" id="amount" name="amount" required step="0.01">
                    </div>
                    <div class="mb-3">
                        <label for="payment_method" class="form-label">Payment Method</label>
                        <select class="form-control" id="payment_method" name="payment_method" required>
                            <option value="">Select Payment Method</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="mobile_payment">Mobile Payment</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="payment_proof" class="form-label">Payment Proof</label>
                        <input type="file" class="form-control" id="payment_proof" name="payment_proof" required accept="image/*">
                        <div class="form-text">Upload a clear image of your payment proof</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Submit Payment</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Payment Proof Modal -->
<div class="modal fade" id="proofModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Payment Proof</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
                <img src="" alt="Payment Proof" class="img-fluid payment-proof-img">
            </div>
        </div>
    </div>
</div>

<style>
.notification-item {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.notification-item.unread {
    background-color: #f8f9fa;
}

.notification-item:last-child {
    border-bottom: none;
}
</style>

<script>
// Initialize payment proof modal
document.querySelectorAll('[data-bs-target="#proofModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const proofPath = this.getAttribute('data-proof');
        document.querySelector('.payment-proof-img').src = proofPath;
    });
});

// Password validation
document.querySelector('#changePasswordModal form').addEventListener('submit', function(e) {
    const newPassword = document.getElementById('new_password').value;
    const confirmPassword = document.getElementById('confirm_new_password').value;
    
    if (newPassword !== confirmPassword) {
        e.preventDefault();
        alert('New passwords do not match');
    }
});
</script>

<?php include 'templates/footer.php'; ?>
