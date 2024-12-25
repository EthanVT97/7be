<?php
namespace App\Models;

class User {
    private $conn;
    private $table = "users";

    public $id;
    public $name;
    public $phone;
    public $role;
    public $password;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($phone, $password) {
        $query = "SELECT id, name, phone, password, role 
                 FROM " . $this->table . " 
                 WHERE phone = :phone";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":phone", $phone);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);
            
            if (password_verify($password, $row['password'])) {
                $this->id = $row['id'];
                $this->name = $row['name'];
                $this->phone = $row['phone'];
                $this->role = $row['role'];
                return true;
            }
        }

        return false;
    }
} 