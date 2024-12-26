<?php
namespace App\Database;

class DatabaseTest {
    public static function testConnection() {
        try {
            $conn = Connection::getInstance()->getConnection();
            
            // Test basic query
            $stmt = $conn->query('SELECT 1');
            if (!$stmt->fetch()) {
                throw new \Exception("Basic query test failed");
            }
            
            // Test tables existence
            $requiredTables = ['users', 'transactions', 'bets_2d', 'bets_3d', 'winning_numbers'];
            $stmt = $conn->query("SHOW TABLES");
            $tables = $stmt->fetchAll(\PDO::FETCH_COLUMN);
            
            $missingTables = array_diff($requiredTables, $tables);
            if (!empty($missingTables)) {
                throw new \Exception("Missing tables: " . implode(', ', $missingTables));
            }
            
            return ['success' => true, 'message' => 'Database connection test passed'];
            
        } catch (\Exception $e) {
            return [
                'success' => false, 
                'message' => 'Database test failed: ' . $e->getMessage()
            ];
        }
    }
} 