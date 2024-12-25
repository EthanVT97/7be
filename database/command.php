<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../src/Config/env.php';

use App\Database\Connection;
use App\Database\Migration;
use App\Database\Seeder;

// Get command argument
$command = $argv[1] ?? '';

try {
    $db = Connection::getInstance();
    $conn = $db->getConnection();

    switch ($command) {
        case 'migrate':
            $migration = new Migration($conn);
            if ($migration->migrate()) {
                echo "Migration completed successfully\n";
            } else {
                echo "Migration failed\n";
            }
            break;

        case 'seed':
            $seeder = new Seeder($conn);
            if ($seeder->seed()) {
                echo "Seeding completed successfully\n";
            } else {
                echo "Seeding failed\n";
            }
            break;

        case 'refresh':
            $migration = new Migration($conn);
            $seeder = new Seeder($conn);
            
            if ($migration->migrate() && $seeder->seed()) {
                echo "Database refresh completed successfully\n";
            } else {
                echo "Database refresh failed\n";
            }
            break;

        default:
            echo "Available commands:\n";
            echo "php command.php migrate - Run migrations\n";
            echo "php command.php seed - Run seeders\n";
            echo "php command.php refresh - Refresh database\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
} 