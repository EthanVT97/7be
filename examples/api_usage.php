<?php
require_once __DIR__ . '/../includes/LotteryAPIClient.php';

// Create API client (use local API by default)
$apiClient = new LotteryAPIClient(false);

try {
    // Check API status
    $status = $apiClient->checkStatus();
    echo "API Status: " . json_encode($status['data']) . "\n\n";
    
    // Get today's 2D results
    $today2D = $apiClient->get2DToday();
    echo "Today's 2D Results: " . json_encode($today2D['data']) . "\n\n";
    
    // Get latest 3D results
    $latest3D = $apiClient->get3DLatest();
    echo "Latest 3D Results: " . json_encode($latest3D['data']) . "\n\n";
    
    // Get historical results
    $history = $apiClient->get2DHistory(5);
    echo "Last 5 2D Results: " . json_encode($history['data']) . "\n\n";
    
    // Example of updating results (requires authentication)
    $apiClient = new LotteryAPIClient(false, 'your-secret-token-1');
    $updateData = [
        'number' => '12',
        'date' => date('Y-m-d'),
        'time' => date('H:i:s')
    ];
    
    $updateResult = $apiClient->update2DResult($updateData);
    echo "Update Result: " . json_encode($updateResult['data']) . "\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
