<?php
// Get latest lottery results by type
function getLatestResults($type, $limit = 5) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM lottery_results 
                           WHERE lottery_type = ? 
                           ORDER BY draw_date DESC, draw_time DESC 
                           LIMIT ?");
    $stmt->execute([$type, $limit]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get user notifications
function getUserNotifications($user_id, $limit = 10) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM notifications 
                           WHERE user_id = ? 
                           ORDER BY created_at DESC 
                           LIMIT ?");
    $stmt->execute([$user_id, $limit]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Format date and time
function formatDateTime($date, $time = null) {
    $format = 'Y-m-d';
    if ($time) {
        $format .= ' H:i:s';
        return date($format, strtotime("$date $time"));
    }
    return date($format, strtotime($date));
}

// Validate file upload
function validateFileUpload($file) {
    $allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    $maxSize = 5 * 1024 * 1024; // 5MB

    if (!in_array($file['type'], $allowedTypes)) {
        return "Invalid file type. Only JPG, JPEG & PNG files are allowed.";
    }

    if ($file['size'] > $maxSize) {
        return "File is too large. Maximum size is 5MB.";
    }

    return true;
}

// Generate unique filename
function generateUniqueFilename($originalName) {
    $extension = pathinfo($originalName, PATHINFO_EXTENSION);
    return uniqid() . '_' . time() . '.' . $extension;
}

// Save payment record
function savePayment($userId, $amount, $paymentMethod, $proofFile) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO payments (user_id, amount, payment_method, payment_proof) 
                           VALUES (?, ?, ?, ?)");
    return $stmt->execute([$userId, $amount, $paymentMethod, $proofFile]);
}

// Check if user is admin
function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

// Get user details
function getUserDetails($userId) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Get user payments
function getUserPayments($userId) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->execute([$userId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get payment details
function getPaymentDetails($paymentId) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM payments WHERE id = ?");
    $stmt->execute([$paymentId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

// Add notification
function addNotification($userId, $message) {
    global $conn;
    $stmt = $conn->prepare("INSERT INTO notifications (user_id, message) VALUES (?, ?)");
    return $stmt->execute([$userId, $message]);
}

// Get admin actions
function getAdminActions($type, $limit = 10) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM admin_logs WHERE action LIKE ? ORDER BY created_at DESC LIMIT ?");
    $stmt->execute([$type . '%', $limit]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// Get status badge class
function getStatusBadgeClass($status) {
    switch ($status) {
        case 'approved':
            return 'success';
        case 'rejected':
            return 'danger';
        case 'pending':
            return 'warning';
        default:
            return 'secondary';
    }
}

// Change user password
function changeUserPassword($userId, $currentPassword, $newPassword) {
    global $conn;
    
    // Verify current password
    $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($currentPassword, $user['password'])) {
        return false;
    }
    
    // Update to new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
    return $stmt->execute([$hashedPassword, $userId]);
}
?>
