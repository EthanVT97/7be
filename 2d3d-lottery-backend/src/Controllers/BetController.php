<?php

namespace App\Controllers;

use App\Database\Connection;
use App\Exceptions\HttpException;
use PDO;

class BetController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Connection::getInstance();
    }

    public function getBets(array $request): array
    {
        $userId = $request['user_id'] ?? null;
        $status = $request['status'] ?? null;
        $page = (int)($request['page'] ?? 1);
        $perPage = (int)($request['per_page'] ?? 10);
        $offset = ($page - 1) * $perPage;

        $query = "SELECT * FROM bets WHERE 1=1";
        $params = [];

        if ($userId) {
            $query .= " AND user_id = :user_id";
            $params[':user_id'] = $userId;
        }

        if ($status) {
            $query .= " AND status = :status";
            $params[':status'] = $status;
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

    public function placeBet(array $request): array
    {
        $requiredFields = ['user_id', 'lottery_type', 'number', 'amount'];
        foreach ($requiredFields as $field) {
            if (!isset($request[$field])) {
                throw new HttpException("Missing required field: {$field}", 400);
            }
        }

        $stmt = $this->db->prepare("
            INSERT INTO bets (user_id, lottery_type, number, amount, status, draw_date)
            VALUES (:user_id, :lottery_type, :number, :amount, 'pending', CURRENT_DATE)
            RETURNING *
        ");

        $stmt->execute([
            ':user_id' => $request['user_id'],
            ':lottery_type' => $request['lottery_type'],
            ':number' => $request['number'],
            ':amount' => $request['amount']
        ]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
} 