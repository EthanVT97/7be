<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/Database/Connection.php';

use Dotenv\Dotenv;
use App\Database\Connection;

// Load test environment variables
$dotenv = Dotenv::createImmutable(__DIR__ . '/../', '.env.test');
$dotenv->load();

try {
    // Create test database connection
    $pdo = Connection::getInstance();
    
    // Begin transaction
    $pdo->beginTransaction();
    
    echo "Starting test migration...\n";
    
    // Array of migration files in order
    $migrations = [
        __DIR__ . '/migrations/001_create_users_table.sql',
        __DIR__ . '/migrations/002_create_lottery_numbers_table.sql',
        __DIR__ . '/migrations/003_create_bets_table.sql',
        __DIR__ . '/migrations/004_create_transactions_table.sql'
    ];
    
    // Execute each migration
    foreach ($migrations as $migration) {
        echo "Executing migration: " . basename($migration) . "\n";
        $sql = file_get_contents($migration);
        $pdo->exec($sql);
    }
    
    // Test data insertion
    echo "Inserting test data...\n";
    
    // Insert test user
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['testuser', 'test@example.com', password_hash('test123', PASSWORD_DEFAULT), 'user']);
    
    // Insert test lottery number
    $stmt = $pdo->prepare("INSERT INTO lottery_numbers (number, type, date, time_period) VALUES (?, ?, ?, ?)");
    $stmt->execute(['123', '2D', date('Y-m-d'), 'morning']);
    
    // Insert test bet
    $stmt = $pdo->prepare("INSERT INTO bets (user_id, lottery_number_id, amount) VALUES (?, ?, ?)");
    $stmt->execute([1, 1, 100.00]);

    // Insert test transactions
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, type, amount, status, payment_method, payment_account, payment_account_name, transaction_ref, remark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // Test deposit
    $stmt->execute([
        1, // user_id
        'deposit',
        1000.00,
        'pending',
        'kpay',
        '09123456789',
        'Test User',
        'DEP123456',
        'Test deposit'
    ]);

    // Test withdrawal
    $stmt->execute([
        1, // user_id
        'withdrawal',
        500.00,
        'pending',
        'wavepay',
        '09987654321',
        'Test User',
        'WIT123456',
        'Test withdrawal'
    ]);
    
    // Verify data
    echo "Verifying data...\n";
    
    // Check users table
    $users = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
    echo "Users count: $users\n";
    
    // Check lottery_numbers table
    $numbers = $pdo->query("SELECT COUNT(*) FROM lottery_numbers")->fetchColumn();
    echo "Lottery numbers count: $numbers\n";
    
    // Check bets table
    $bets = $pdo->query("SELECT COUNT(*) FROM bets")->fetchColumn();
    echo "Bets count: $bets\n";

    // Check transactions table
    $transactions = $pdo->query("SELECT COUNT(*) FROM transactions")->fetchColumn();
    echo "Transactions count: $transactions\n";

    // Check transaction types
    $deposits = $pdo->query("SELECT COUNT(*) FROM transactions WHERE type = 'deposit'")->fetchColumn();
    $withdrawals = $pdo->query("SELECT COUNT(*) FROM transactions WHERE type = 'withdrawal'")->fetchColumn();
    echo "Deposits count: $deposits\n";
    echo "Withdrawals count: $withdrawals\n";
    
    // If everything is successful, commit the transaction
    $pdo->commit();
    echo "Test migration completed successfully!\n";
    
} catch (Exception $e) {
    // If there's an error, roll back the transaction
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    echo "Error during test migration: " . $e->getMessage() . "\n";
    exit(1);
} 