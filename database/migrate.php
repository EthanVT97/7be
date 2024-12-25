<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/Database/Connection.php';

use App\Database\Connection;

try {
    // Create database connection
    $pdo = Connection::getInstance();
    
    echo "Starting database migration...\n";
    
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
        // Read migration file
        $sql = file_get_contents($migration);
        
        // Convert SQLite syntax to PostgreSQL
        $sql = str_replace('INTEGER PRIMARY KEY AUTOINCREMENT', 'SERIAL PRIMARY KEY', $sql);
        $sql = str_replace('DATETIME', 'TIMESTAMP', $sql);
        $sql = str_replace('TEXT', 'VARCHAR(255)', $sql);
        
        // Execute migration
        $pdo->exec($sql);
        echo "Migration " . basename($migration) . " completed successfully.\n";
    }
    
    echo "All migrations completed successfully!\n";
    
} catch (Exception $e) {
    echo "Error during migration: " . $e->getMessage() . "\n";
    exit(1);
} 