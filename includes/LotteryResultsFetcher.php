<?php
require_once 'config.php';
require_once 'LotteryScraperUtil.php';

class LotteryResultsFetcher {
    private $conn;
    private $scraper;
    
    public function __construct($conn) {
        $this->conn = $conn;
        $this->scraper = new LotteryScraperUtil();
    }
    
    // Fetch results from both database and external sources
    public function getResults($type, $limit = 10) {
        $results = $this->getDbResults($type, $limit);
        $scrapedResults = $this->getScrapedResults($type);
        
        if ($scrapedResults) {
            // Save new results to database
            $this->saveNewResults($type, $scrapedResults);
            
            // Merge and sort results
            $results = array_merge($results, $scrapedResults);
            usort($results, function($a, $b) {
                $dateA = strtotime($a['draw_date'] . ' ' . ($a['draw_time'] ?? '00:00:00'));
                $dateB = strtotime($b['draw_date'] . ' ' . ($b['draw_time'] ?? '00:00:00'));
                return $dateB - $dateA;
            });
            
            // Limit results
            $results = array_slice($results, 0, $limit);
        }
        
        return $results;
    }
    
    // Get results from database
    private function getDbResults($type, $limit) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT * FROM lottery_results 
                WHERE lottery_type = ? 
                ORDER BY draw_date DESC, draw_time DESC 
                LIMIT " . intval($limit)
            );
            $stmt->execute([$type]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            return [];
        }
    }
    
    // Get results from scraper
    private function getScrapedResults($type) {
        switch ($type) {
            case '2D':
                return $this->scraper->fetch2DResults();
            case '3D':
                return $this->scraper->fetch3DResults();
            case 'THAI':
                return $this->scraper->fetchThaiResults();
            case 'LAOS':
                return $this->scraper->fetchLaosResults();
            default:
                return null;
        }
    }
    
    // Save new results to database
    private function saveNewResults($type, $results) {
        try {
            $stmt = $this->conn->prepare(
                "INSERT IGNORE INTO lottery_results 
                (lottery_type, result_number, draw_date, draw_time) 
                VALUES (?, ?, ?, ?)"
            );
            
            foreach ($results as $result) {
                $stmt->execute([
                    $type,
                    $result['result_number'],
                    $result['draw_date'],
                    $result['draw_time'] ?? null
                ]);
            }
        } catch (PDOException $e) {
            error_log("Error saving results: " . $e->getMessage());
        }
    }
    
    // Get latest result
    public function getLatestResult($type) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT * FROM lottery_results 
                WHERE lottery_type = ? 
                ORDER BY draw_date DESC, draw_time DESC 
                LIMIT 1"
            );
            $stmt->execute([$type]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting latest result: " . $e->getMessage());
            return null;
        }
    }
    
    // Get results by date range
    public function getResultsByDateRange($type, $startDate, $endDate) {
        try {
            $stmt = $this->conn->prepare(
                "SELECT * FROM lottery_results 
                WHERE lottery_type = ? 
                AND draw_date BETWEEN ? AND ? 
                ORDER BY draw_date DESC, draw_time DESC"
            );
            $stmt->execute([$type, $startDate, $endDate]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting results by date range: " . $e->getMessage());
            return [];
        }
    }
}
?>
