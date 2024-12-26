<?php

namespace App\Controllers;

use App\Database\Connection;
use App\Exceptions\HttpException;
use PDO;

class TransactionController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Connection::getInstance();
    }

    public function getTransactions(array $request): array
    {
        $userId = $request['user_id'] ?? null;
        $status = $request['status'] ?? null;
        $type = $request['type'] ?? null;
        $page = (int)($request['page'] ?? 1);
        $perPage = (int)($request['per_page'] ?? 10);
        $offset = ($page - 1) * $perPage;

        $query = "SELECT * FROM payments WHERE 1=1";
        $params = [];

        if ($userId) {
            $query .= " AND user_id = :user_id";
            $params[':user_id'] = $userId;
        }

        if ($status) {
            $query .= " AND status = :status";
            $params[':status'] = $status;
        }

        if ($type) {
            $query .= " AND transaction_type = :type";
            $params[':type'] = $type;
        }

        $query .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";
        $params[':limit'] = $perPage;
        $params[':offset'] = $offset;

        $stmt = $this->db->prepare($query);
        foreach ($params as $key => &$value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createTransaction(array $request): array
    {
        $requiredFields = ['user_id', 'amount', 'payment_method', 'transaction_type'];
        foreach ($requiredFields as $field) {
            if (!isset($request[$field])) {
                throw new HttpException("Missing required field: {$field}", 400);
            }
        }

        $this->db->beginTransaction();

        try {
            // Insert payment record
            $stmt = $this->db->prepare("
                INSERT INTO payments (user_id, amount, payment_method, transaction_type, status)
                VALUES (:user_id, :amount, :payment_method, :transaction_type, 'pending')
                RETURNING *
            ");

            $stmt->execute([
                ':user_id' => $request['user_id'],
                ':amount' => $request['amount'],
                ':payment_method' => $request['payment_method'],
                ':transaction_type' => $request['transaction_type']
            ]);

            $payment = $stmt->fetch(PDO::FETCH_ASSOC);

            // Update user balance if payment is deposit
            if ($request['transaction_type'] === 'deposit') {
                $stmt = $this->db->prepare("
                    UPDATE users 
                    SET balance = balance + :amount 
                    WHERE id = :user_id
                    RETURNING balance
                ");

                $stmt->execute([
                    ':amount' => $request['amount'],
                    ':user_id' => $request['user_id']
                ]);
            }

            $this->db->commit();
            return $payment;

        } catch (\Exception $e) {
            $this->db->rollBack();
            throw new HttpException('Transaction failed: ' . $e->getMessage(), 500);
        }
    }
} 