<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || !isAdmin()) {
    header('Location: ../index.php');
    exit();
}

include '../templates/header.php';
?>

<div class="container-fluid mt-4">
    <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <div class="position-sticky">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="#dashboard">
                            Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#results">
                            Manage Results
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#payments">
                            Payment Verification
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#users">
                            User Management
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Main content -->
        <div class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <!-- Dashboard Overview -->
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Dashboard</h1>
            </div>

            <!-- Quick Stats -->
            <div class="row">
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-primary">
                        <div class="card-body">
                            <h5 class="card-title">Total Users</h5>
                            <p class="card-text h2"><?php echo getTotalUsers(); ?></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-success">
                        <div class="card-body">
                            <h5 class="card-title">Pending Payments</h5>
                            <p class="card-text h2"><?php echo getPendingPaymentsCount(); ?></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-info">
                        <div class="card-body">
                            <h5 class="card-title">Today's Results</h5>
                            <p class="card-text h2"><?php echo getTodayResultsCount(); ?></p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-4">
                    <div class="card text-white bg-warning">
                        <div class="card-body">
                            <h5 class="card-title">Active Users</h5>
                            <p class="card-text h2"><?php echo getActiveUsersCount(); ?></p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Latest Results -->
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Latest Results</h5>
                    <button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#addResultModal">
                        Add New Result
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Number</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $results = getLatestResults(null, 10);
                                foreach ($results as $result):
                                ?>
                                <tr>
                                    <td><?php echo $result['lottery_type']; ?></td>
                                    <td><?php echo $result['result_number']; ?></td>
                                    <td><?php echo $result['draw_date']; ?></td>
                                    <td><?php echo $result['draw_time']; ?></td>
                                    <td>
                                        <button class="btn btn-sm btn-warning">Edit</button>
                                        <button class="btn btn-sm btn-danger">Delete</button>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

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
                                $payments = getPendingPayments(10);
                                foreach ($payments as $payment):
                                ?>
                                <tr>
                                    <td><?php echo getUserName($payment['user_id']); ?></td>
                                    <td><?php echo $payment['amount']; ?></td>
                                    <td><?php echo $payment['payment_method']; ?></td>
                                    <td><?php echo $payment['created_at']; ?></td>
                                    <td>
                                        <a href="#" class="btn btn-sm btn-info" data-bs-toggle="modal" data-bs-target="#viewProofModal">
                                            View Proof
                                        </a>
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-success">Approve</button>
                                        <button class="btn btn-sm btn-danger">Reject</button>
                                    </td>
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

<!-- Add Result Modal -->
<div class="modal fade" id="addResultModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add New Result</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="addResultForm" action="add_result.php" method="POST">
                    <div class="mb-3">
                        <label for="lottery_type" class="form-label">Lottery Type</label>
                        <select class="form-control" id="lottery_type" name="lottery_type" required>
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="THAI">Thai Lottery</option>
                            <option value="LAOS">Laos Lottery</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="result_number" class="form-label">Result Number</label>
                        <input type="text" class="form-control" id="result_number" name="result_number" required>
                    </div>
                    <div class="mb-3">
                        <label for="draw_date" class="form-label">Draw Date</label>
                        <input type="date" class="form-control" id="draw_date" name="draw_date" required>
                    </div>
                    <div class="mb-3">
                        <label for="draw_time" class="form-label">Draw Time</label>
                        <input type="time" class="form-control" id="draw_time" name="draw_time">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" form="addResultForm" class="btn btn-primary">Add Result</button>
            </div>
        </div>
    </div>
</div>

<?php include '../templates/footer.php'; ?>
