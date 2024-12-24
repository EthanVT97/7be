<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once 'functions.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || !isAdmin()) {
    header('Location: ../index.php');
    exit();
}

$success = '';
$error = '';

// Handle payment verification
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $payment_id = $_POST['payment_id'];
    $action = $_POST['action'];
    
    if ($action === 'approve' || $action === 'reject') {
        try {
            if (updatePaymentStatus($payment_id, $action === 'approve' ? 'approved' : 'rejected')) {
                $success = 'Payment ' . ($action === 'approve' ? 'approved' : 'rejected') . ' successfully';
                logAdminAction($_SESSION['user_id'], 'payment_' . $action, "Payment ID: $payment_id");
                
                // Get user ID for notification
                $payment = getPaymentDetails($payment_id);
                if ($payment) {
                    $message = $action === 'approve' 
                        ? 'Your payment has been approved.' 
                        : 'Your payment has been rejected. Please contact support for more information.';
                    addNotification($payment['user_id'], $message);
                }
            } else {
                $error = 'Failed to update payment status';
            }
        } catch (PDOException $e) {
            $error = 'Database error occurred';
        }
    }
}

include '../templates/header.php';
?>

<div class="container-fluid mt-4">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <?php include 'sidebar.php'; ?>
        </div>

        <!-- Main content -->
        <div class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Payment Verification</h1>
            </div>

            <?php if ($success): ?>
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="alert alert-danger"><?php echo $error; ?></div>
            <?php endif; ?>

            <!-- Pending Payments -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">Pending Payments</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Method</th>
                                    <th>Date</th>
                                    <th>Proof</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $payments = getPendingPayments(20);
                                foreach ($payments as $payment):
                                    $username = getUserName($payment['user_id']);
                                ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($username); ?></td>
                                    <td><?php echo number_format($payment['amount'], 2); ?></td>
                                    <td><?php echo htmlspecialchars($payment['payment_method']); ?></td>
                                    <td><?php echo formatDateTime($payment['created_at']); ?></td>
                                    <td>
                                        <button type="button" class="btn btn-sm btn-info" 
                                                data-bs-toggle="modal" 
                                                data-bs-target="#proofModal"
                                                data-proof="../uploads/payment_proofs/<?php echo $payment['payment_proof']; ?>">
                                            View Proof
                                        </button>
                                    </td>
                                    <td>
                                        <form action="" method="POST" class="d-inline">
                                            <input type="hidden" name="payment_id" value="<?php echo $payment['id']; ?>">
                                            <input type="hidden" name="action" value="approve">
                                            <button type="submit" class="btn btn-sm btn-success" 
                                                    onclick="return confirm('Are you sure you want to approve this payment?')">
                                                Approve
                                            </button>
                                        </form>
                                        <form action="" method="POST" class="d-inline">
                                            <input type="hidden" name="payment_id" value="<?php echo $payment['id']; ?>">
                                            <input type="hidden" name="action" value="reject">
                                            <button type="submit" class="btn btn-sm btn-danger" 
                                                    onclick="return confirm('Are you sure you want to reject this payment?')">
                                                Reject
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Recent Actions -->
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="mb-0">Recent Payment Actions</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Admin</th>
                                    <th>Action</th>
                                    <th>Details</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $actions = getAdminActions('payment', 10);
                                foreach ($actions as $action):
                                ?>
                                <tr>
                                    <td><?php echo htmlspecialchars(getUserName($action['admin_id'])); ?></td>
                                    <td><?php echo htmlspecialchars($action['action']); ?></td>
                                    <td><?php echo htmlspecialchars($action['details']); ?></td>
                                    <td><?php echo formatDateTime($action['created_at']); ?></td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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

<script>
// Initialize payment proof modal
document.querySelectorAll('[data-bs-target="#proofModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const proofPath = this.getAttribute('data-proof');
        document.querySelector('.payment-proof-img').src = proofPath;
    });
});
</script>

<?php include '../templates/footer.php'; ?>
