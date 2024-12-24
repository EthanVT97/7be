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

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'add':
            $type = $_POST['lottery_type'];
            $number = $_POST['result_number'];
            $date = $_POST['draw_date'];
            $time = $_POST['draw_time'] ?? null;
            
            if (addLotteryResult($type, $number, $date, $time)) {
                $success = 'Result added successfully';
                logAdminAction($_SESSION['user_id'], 'add_result', "Added $type result: $number");
            } else {
                $error = 'Failed to add result';
            }
            break;
            
        case 'update':
            $id = $_POST['result_id'];
            $type = $_POST['lottery_type'];
            $number = $_POST['result_number'];
            $date = $_POST['draw_date'];
            $time = $_POST['draw_time'] ?? null;
            
            if (updateLotteryResult($id, $type, $number, $date, $time)) {
                $success = 'Result updated successfully';
                logAdminAction($_SESSION['user_id'], 'update_result', "Updated $type result ID: $id");
            } else {
                $error = 'Failed to update result';
            }
            break;
            
        case 'delete':
            $id = $_POST['result_id'];
            if (deleteLotteryResult($id)) {
                $success = 'Result deleted successfully';
                logAdminAction($_SESSION['user_id'], 'delete_result', "Deleted result ID: $id");
            } else {
                $error = 'Failed to delete result';
            }
            break;
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
                <h1 class="h2">Manage Results</h1>
                <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addResultModal">
                    Add New Result
                </button>
            </div>

            <?php if ($success): ?>
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="alert alert-danger"><?php echo $error; ?></div>
            <?php endif; ?>

            <!-- Results Table -->
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Number</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $results = getLatestResults(null, 50); // Get last 50 results
                        foreach ($results as $result):
                        ?>
                        <tr>
                            <td><?php echo $result['id']; ?></td>
                            <td><?php echo $result['lottery_type']; ?></td>
                            <td><?php echo $result['result_number']; ?></td>
                            <td><?php echo $result['draw_date']; ?></td>
                            <td><?php echo $result['draw_time']; ?></td>
                            <td>
                                <button class="btn btn-sm btn-warning" 
                                        data-bs-toggle="modal" 
                                        data-bs-target="#editResultModal"
                                        data-id="<?php echo $result['id']; ?>"
                                        data-type="<?php echo $result['lottery_type']; ?>"
                                        data-number="<?php echo $result['result_number']; ?>"
                                        data-date="<?php echo $result['draw_date']; ?>"
                                        data-time="<?php echo $result['draw_time']; ?>">
                                    Edit
                                </button>
                                <form action="" method="POST" class="d-inline">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="result_id" value="<?php echo $result['id']; ?>">
                                    <button type="submit" class="btn btn-sm btn-danger" 
                                            onclick="return confirm('Are you sure you want to delete this result?')">
                                        Delete
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
</div>

<!-- Add Result Modal -->
<div class="modal fade" id="addResultModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Add New Result</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <input type="hidden" name="action" value="add">
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
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Add Result</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Edit Result Modal -->
<div class="modal fade" id="editResultModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Edit Result</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <form action="" method="POST">
                <div class="modal-body">
                    <input type="hidden" name="action" value="update">
                    <input type="hidden" name="result_id" id="edit_result_id">
                    <div class="mb-3">
                        <label for="edit_lottery_type" class="form-label">Lottery Type</label>
                        <select class="form-control" id="edit_lottery_type" name="lottery_type" required>
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="THAI">Thai Lottery</option>
                            <option value="LAOS">Laos Lottery</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="edit_result_number" class="form-label">Result Number</label>
                        <input type="text" class="form-control" id="edit_result_number" name="result_number" required>
                    </div>
                    <div class="mb-3">
                        <label for="edit_draw_date" class="form-label">Draw Date</label>
                        <input type="date" class="form-control" id="edit_draw_date" name="draw_date" required>
                    </div>
                    <div class="mb-3">
                        <label for="edit_draw_time" class="form-label">Draw Time</label>
                        <input type="time" class="form-control" id="edit_draw_time" name="draw_time">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="submit" class="btn btn-primary">Update Result</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
// Initialize edit modal with result data
document.querySelectorAll('[data-bs-target="#editResultModal"]').forEach(button => {
    button.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        const type = this.getAttribute('data-type');
        const number = this.getAttribute('data-number');
        const date = this.getAttribute('data-date');
        const time = this.getAttribute('data-time');
        
        document.getElementById('edit_result_id').value = id;
        document.getElementById('edit_lottery_type').value = type;
        document.getElementById('edit_result_number').value = number;
        document.getElementById('edit_draw_date').value = date;
        document.getElementById('edit_draw_time').value = time;
    });
});
</script>

<?php include '../templates/footer.php'; ?>
