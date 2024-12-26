<?php
namespace App\Database;

class QueryBuilder {
    private $pdo;
    
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    
    public function select($table, $conditions = [], $params = []) {
        $query = "SELECT * FROM {$table}";
        
        if (!empty($conditions)) {
            $query .= " WHERE " . implode(' AND ', array_map(function($field) {
                return "{$field} = ?";
            }, array_keys($conditions)));
        }
        
        $stmt = $this->pdo->prepare($query);
        $stmt->execute(array_values($conditions));
        
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
    
    // Similar methods for insert, update, delete...
} 