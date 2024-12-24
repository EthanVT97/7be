<?php
// Get total number of users
function getTotalUsers() {
    global $conn;
    $stmt = $conn->query("SELECT COUNT(*) FROM users");
    return $stmt->fetchColumn();
}

// Get number of pending payments
function getPendingPaymentsCount() {
    global $conn;
    $stmt = $conn->query("SELECT COUNT(*) FROM payments WHERE status = 'pending'");
    return $stmt->fetchColumn();
}

// Get count of today's results
function getTodayResultsCount() {
    global $conn;
    $stmt = $conn->query("SELECT COUNT(*) FROM lottery_results WHERE DATE(draw_date) = CURDATE()");
    return $stmt->fetchColumn();
}

// Get count of active users (users who logged in today)
function getActiveUsersCount() {
    global $conn;
    $stmt = $conn->query("SELECT COUNT(DISTINCT user_id) FROM user_activity WHERE DATE(last_activity) = CURDATE()");
    return $stmt->fetchColumn();
}

// Get pending payments
function getPendingPayments($limit = 10) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM payments WHERE status = 'pending' ORDER BY created_at DESC LIMIT ?");
    $stmt->execute([$limit]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get username by user ID
function getUserName($userId) {
    global $conn;
    $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetchColumn();
}

// Add new lottery result
function addLotteryResult($type, $number, $date, $time = null) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO lottery_results (lottery_type, result_number, draw_date, draw_time) VALUES (?, ?, ?, ?)");
    return $stmt->execute([$type, $number, $date, $time]);
}

// Update lottery result
function updateLotteryResult($id, $type, $number, $date, $time = null) {
    global $conn;
    $stmt = $conn->prepare("UPDATE lottery_results SET lottery_type = ?, result_number = ?, draw_date = ?, draw_time = ? WHERE id = ?");
    return $stmt->execute([$type, $number, $date, $time, $id]);
}

// Delete lottery result
function deleteLotteryResult($id) {
    global $conn;
    $stmt = $conn->prepare("DELETE FROM lottery_results WHERE id = ?");
    return $stmt->execute([$id]);
}

// Update payment status
function updatePaymentStatus($paymentId, $status) {
    global $conn;
    $stmt = $conn->prepare("UPDATE payments SET status = ? WHERE id = ?");
    return $stmt->execute([$status, $paymentId]);
}

// Get user activity
function getUserActivity($limit = 10) {
    global $conn;
    $stmt = $conn->prepare("
        SELECT u.username, ua.last_activity, ua.activity_type 
        FROM user_activity ua 
        JOIN users u ON ua.user_id = u.id 
        ORDER BY ua.last_activity DESC 
        LIMIT ?
    ");
    $stmt->execute([$limit]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Log admin action
function logAdminAction($adminId, $action, $details) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO admin_logs (admin_id, action, details) VALUES (?, ?, ?)");
    return $stmt->execute([$adminId, $action, $details]);
}
?>
