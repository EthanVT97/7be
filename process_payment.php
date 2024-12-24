<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $amount = $_POST['amount'];
    $payment_method = $_POST['payment_method'];
    
    // Handle file upload
    if (isset($_FILES['payment_proof']) && $_FILES['payment_proof']['error'] === UPLOAD_ERR_OK) {
        $validation = validateFileUpload($_FILES['payment_proof']);
        
        if ($validation === true) {
            $filename = generateUniqueFilename($_FILES['payment_proof']['name']);
            $upload_path = 'uploads/payment_proofs/' . $filename;
            
            if (!is_dir('uploads/payment_proofs')) {
                mkdir('uploads/payment_proofs', 0777, true);
            }
            
            if (move_uploaded_file($_FILES['payment_proof']['tmp_name'], $upload_path)) {
                try {
                    if (savePayment($_SESSION['user_id'], $amount, $payment_method, $filename)) {
                        $success = 'Payment proof uploaded successfully. Please wait for admin verification.';
                    } else {
                        $error = 'Failed to save payment record.';
                    }
                } catch (PDOException $e) {
                    $error = 'Database error occurred.';
                }
            } else {
                $error = 'Failed to upload file.';
            }
        } else {
            $error = $validation;
        }
    } else {
        $error = 'Please select a file to upload.';
    }
}

// Redirect with message
if ($error) {
    $_SESSION['error'] = $error;
} elseif ($success) {
    $_SESSION['success'] = $success;
}

header('Location: index.php');
exit();
?>
