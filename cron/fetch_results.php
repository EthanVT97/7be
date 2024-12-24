<?php
require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/LotteryResultsFetcher.php';

// Set execution time limit
set_time_limit(300);

// Initialize fetcher
$fetcher = new LotteryResultsFetcher($conn);

// Array of lottery types
$lotteryTypes = ['2D', '3D', 'THAI', 'LAOS'];

// Log file
$logFile = __DIR__ . '/fetch_log.txt';

function logMessage($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Fetch results for each type
foreach ($lotteryTypes as $type) {
    try {
        logMessage("Starting fetch for $type");
        
        // Get results
        $results = $fetcher->getResults($type, 10);
        
        if ($results) {
            $count = count($results);
            logMessage("Successfully fetched $count results for $type");
        } else {
            logMessage("No new results found for $type");
        }
    } catch (Exception $e) {
        logMessage("Error fetching $type results: " . $e->getMessage());
    }
}

logMessage("Fetch process completed");
?>
