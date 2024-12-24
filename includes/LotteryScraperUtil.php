<?php

class LotteryScraperUtil {
    private $html;
    
    public function __construct() {
        // No initialization needed
    }
    
    private function fetchUrl($url) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
    
    // Fetch 2D results
    public function fetch2DResults() {
        try {
            // Example URL - replace with actual source
            $url = 'https://example.com/2d-results';
            $html = $this->fetchUrl($url);
            
            if ($html) {
                $results = [];
                // Using regular expressions to extract data
                preg_match_all('/<div class="result-item">(.*?)<\/div>/s', $html, $matches);
                
                foreach($matches[1] as $item) {
                    preg_match('/<span class="date">(.*?)<\/span>/', $item, $date);
                    preg_match('/<span class="time">(.*?)<\/span>/', $item, $time);
                    preg_match('/<span class="number">(.*?)<\/span>/', $item, $number);
                    
                    $results[] = [
                        'draw_date' => $date[1] ?? '',
                        'draw_time' => $time[1] ?? '',
                        'result_number' => $number[1] ?? ''
                    ];
                }
                return $results;
            }
            return [];
        } catch (Exception $e) {
            error_log("Error in fetch2DResults: " . $e->getMessage());
            return [];
        }
    }
    
    // Fetch 3D results
    public function fetch3DResults() {
        try {
            $url = 'https://example.com/3d-results';
            $html = $this->fetchUrl($url);
            
            if ($html) {
                $results = [];
                preg_match_all('/<div class="result-item">(.*?)<\/div>/s', $html, $matches);
                
                foreach($matches[1] as $item) {
                    preg_match('/<span class="date">(.*?)<\/span>/', $item, $date);
                    preg_match('/<span class="number">(.*?)<\/span>/', $item, $number);
                    
                    $results[] = [
                        'draw_date' => $date[1] ?? '',
                        'result_number' => $number[1] ?? ''
                    ];
                }
                return $results;
            }
            return [];
        } catch (Exception $e) {
            error_log("Error in fetch3DResults: " . $e->getMessage());
            return [];
        }
    }
    
    // Fetch Thai lottery results
    public function fetchThaiResults() {
        try {
            $url = 'https://example.com/thai-results';
            $html = $this->fetchUrl($url);
            
            if ($html) {
                $results = [];
                preg_match_all('/<div class="result-item">(.*?)<\/div>/s', $html, $matches);
                
                foreach($matches[1] as $item) {
                    preg_match('/<span class="date">(.*?)<\/span>/', $item, $date);
                    preg_match('/<span class="number">(.*?)<\/span>/', $item, $number);
                    
                    $results[] = [
                        'draw_date' => $date[1] ?? '',
                        'result_number' => $number[1] ?? ''
                    ];
                }
                return $results;
            }
            return [];
        } catch (Exception $e) {
            error_log("Error in fetchThaiResults: " . $e->getMessage());
            return [];
        }
    }
    
    // Fetch Laos lottery results
    public function fetchLaosResults() {
        try {
            $url = 'https://example.com/laos-results';
            $html = $this->fetchUrl($url);
            
            if ($html) {
                $results = [];
                preg_match_all('/<div class="result-item">(.*?)<\/div>/s', $html, $matches);
                
                foreach($matches[1] as $item) {
                    preg_match('/<span class="date">(.*?)<\/span>/', $item, $date);
                    preg_match('/<span class="number">(.*?)<\/span>/', $item, $number);
                    
                    $results[] = [
                        'draw_date' => $date[1] ?? '',
                        'result_number' => $number[1] ?? ''
                    ];
                }
                return $results;
            }
            return [];
        } catch (Exception $e) {
            error_log("Error in fetchLaosResults: " . $e->getMessage());
            return [];
        }
    }
}
