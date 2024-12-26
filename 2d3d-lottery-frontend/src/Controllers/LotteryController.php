<?php

namespace App\Controllers;

use App\Database\Connection;
use App\Exceptions\HttpException;
use PDO;

class LotteryController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Connection::getInstance();
    }

    public function getResults(array $request): array
    {
        $type = $request['type'] ?? null;
        $date = $request['date'] ?? date('Y-m-d');
        $page = (int)($request['page'] ?? 1);
        $perPage = (int)($request['per_page'] ?? 10);
        $offset = ($page - 1) * $perPage;

        $query = "SELECT * FROM lottery_results WHERE 1=1";
        $params = [];

        if ($type) {
            $query .= " AND lottery_type = :type";
            $params[':type'] = $type;
        }

        if ($date) {
            $query .= " AND draw_date = :date";
            $params[':date'] = $date;
        }

        $query .= " ORDER BY draw_date DESC, draw_time DESC LIMIT :limit OFFSET :offset";
        $params[':limit'] = $perPage;
        $params[':offset'] = $offset;

        $stmt = $this->db->prepare($query);
        foreach ($params as $key => &$value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getLatestResult(string $type): ?array
    {
        $stmt = $this->db->prepare("
            SELECT * FROM lottery_results 
            WHERE lottery_type = :type 
            ORDER BY draw_date DESC, draw_time DESC 
            LIMIT 1
        ");

        $stmt->execute([':type' => $type]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function checkWinningBets(string $type, string $number, string $date): void
    {
        $this->db->beginTransaction();

        try {
            // Update winning bets
            $stmt = $this->db->prepare("
                UPDATE bets 
                SET status = 'won', 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE lottery_type = :type 
                AND number = :number 
                AND draw_date = :date 
                AND status = 'pending'
            ");

            $stmt->execute([
                ':type' => $type,
                ':number' => $number,
                ':date' => $date
            ]);

            // Update losing bets
            $stmt = $this->db->prepare("
                UPDATE bets 
                SET status = 'lost', 
                    updated_at = CURRENT_TIMESTAMP 
                WHERE lottery_type = :type 
                AND number != :number 
                AND draw_date = :date 
                AND status = 'pending'
            ");

            $stmt->execute([
                ':type' => $type,
                ':number' => $number,
                ':date' => $date
            ]);

            $this->db->commit();
        } catch (\Exception $e) {
            $this->db->rollBack();
            throw new HttpException('Failed to update bets: ' . $e->getMessage(), 500);
        }
    }
} 