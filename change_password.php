<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $current_password = $_POST['current_password'];
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_new_password'];
    
    if ($new_password !== $confirm_password) {
        $_SESSION['error'] = 'New passwords do not match';
    } else {
        if (changeUserPassword($_SESSION['user_id'], $current_password, $new_password)) {
            $_SESSION['success'] = 'Password changed successfully';
        } else {
            $_SESSION['error'] = 'Current password is incorrect';
        }
    }
}

header('Location: profile.php');
exit();
?>
