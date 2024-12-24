<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';
require_once 'includes/LotteryResultsFetcher.php';

$lottery_type = $_GET['type'] ?? '2D';
$valid_types = ['2D', '3D', 'THAI', 'LAOS'];

if (!in_array($lottery_type, $valid_types)) {
    header('Location: results.php?type=2D');
    exit();
}

// Initialize results fetcher
$resultsFetcher = new LotteryResultsFetcher($conn);

// Get date range from query parameters
$startDate = $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
$endDate = $_GET['end_date'] ?? date('Y-m-d');

// Get results
$results = $resultsFetcher->getResultsByDateRange($lottery_type, $startDate, $endDate);
$latestResult = $resultsFetcher->getLatestResult($lottery_type);

include 'templates/header.php';
?>

<div class="container mt-4">
    <div class="row">
        <div class="col-md-12">
            <!-- Latest Result Card -->
            <?php if ($latestResult): ?>
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Latest <?php echo $lottery_type; ?> Result</h5>
                </div>
                <div class="card-body text-center">
                    <h2 class="display-4 text-primary"><?php echo $latestResult['result_number']; ?></h2>
                    <p class="lead">
                        Draw Date: <?php echo formatDateTime($latestResult['draw_date']); ?>
                        <?php if ($latestResult['draw_time']): ?>
                            at <?php echo date('h:i A', strtotime($latestResult['draw_time'])); ?>
                        <?php endif; ?>
                    </p>
                </div>
            </div>
            <?php endif; ?>

            <!-- Results Navigation -->
            <div class="card">
                <div class="card-header">
                    <ul class="nav nav-tabs card-header-tabs">
                        <?php foreach ($valid_types as $type): ?>
                        <li class="nav-item">
                            <a class="nav-link <?php echo ($lottery_type === $type) ? 'active' : ''; ?>" 
                               href="results.php?type=<?php echo $type; ?>">
                                <?php echo $type; ?> Results
                            </a>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="card-body">
                    <!-- Date Range Filter -->
                    <form class="row g-3 mb-4">
                        <input type="hidden" name="type" value="<?php echo $lottery_type; ?>">
                        <div class="col-md-4">
                            <label for="start_date" class="form-label">Start Date</label>
                            <input type="date" class="form-control" id="start_date" name="start_date" 
                                   value="<?php echo $startDate; ?>">
                        </div>
                        <div class="col-md-4">
                            <label for="end_date" class="form-label">End Date</label>
                            <input type="date" class="form-control" id="end_date" name="end_date" 
                                   value="<?php echo $endDate; ?>">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">&nbsp;</label>
                            <button type="submit" class="btn btn-primary d-block">Filter Results</button>
                        </div>
                    </form>

                    <!-- Results Table -->
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <?php if ($lottery_type === '2D'): ?>
                                        <th>Time</th>
                                    <?php endif; ?>
                                    <th>Result Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($results)): ?>
                                    <tr>
                                        <td colspan="3" class="text-center">No results found for the selected period</td>
                                    </tr>
                                <?php else: ?>
                                    <?php foreach ($results as $result): ?>
                                        <tr>
                                            <td><?php echo formatDateTime($result['draw_date']); ?></td>
                                            <?php if ($lottery_type === '2D'): ?>
                                                <td>
                                                    <?php echo $result['draw_time'] 
                                                        ? date('h:i A', strtotime($result['draw_time'])) 
                                                        : 'N/A'; ?>
                                                </td>
                                            <?php endif; ?>
                                            <td class="result-number">
                                                <?php echo $result['result_number']; ?>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.result-number {
    font-size: 1.2em;
    font-weight: bold;
    color: #e74c3c;
}

.nav-tabs .nav-link {
    color: #666;
}

.nav-tabs .nav-link.active {
    color: #2c3e50;
    font-weight: bold;
}

.display-4 {
    font-size: 3.5rem;
    font-weight: 300;
    line-height: 1.2;
}
</style>

<script>
// Date range validation
document.querySelector('form').addEventListener('submit', function(e) {
    const startDate = new Date(document.getElementById('start_date').value);
    const endDate = new Date(document.getElementById('end_date').value);
    
    if (startDate > endDate) {
        e.preventDefault();
        alert('Start date cannot be later than end date');
    }
});

// Auto-refresh latest results every 5 minutes
setInterval(function() {
    location.reload();
}, 300000);
</script>

<?php include 'templates/footer.php'; ?>
