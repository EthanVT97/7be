<?php
require_once __DIR__ . '/../bootstrap.php';

use App\Database\Connection;

try {
    // Get database connection
    $db = Connection::getInstance();
    
    // Get all migration files
    $migrations = glob(__DIR__ . '/migrations/*.sql');
    sort($migrations); // Sort by filename
    
    // Begin transaction
    $db->beginTransaction();
    
    foreach ($migrations as $migration) {
        echo "Running migration: " . basename($migration) . "\n";
        
        // Read and execute migration
        $sql = file_get_contents($migration);
        $db->exec($sql);
        
        echo "Completed migration: " . basename($migration) . "\n";
    }
    
    // Commit transaction
    $db->commit();
    echo "All migrations completed successfully.\n";
    
} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($db)) {
        $db->rollBack();
    }
    echo "Error during migration: " . $e->getMessage() . "\n";
    exit(1);
} 