<?php

class LotteryAPIClient {
    private $localBaseUrl;
    private $remoteBaseUrl;
    private $useRemote;
    private $apiToken;
    
    public function __construct($useRemote = false, $apiToken = null) {
        $this->localBaseUrl = 'http://localhost/2D3DKobo/api';
        $this->remoteBaseUrl = 'https://twod3d-lottery-api.onrender.com';
        $this->useRemote = $useRemote;
        $this->apiToken = $apiToken;
    }
    
    private function getBaseUrl() {
        return $this->useRemote ? $this->remoteBaseUrl : $this->localBaseUrl;
    }
    
    private function makeRequest($endpoint, $method = 'GET', $data = null) {
        $url = $this->getBaseUrl() . $endpoint;
        $ch = curl_init();
        
        $headers = [
            'Accept: application/json',
            'Content-Type: application/json'
        ];
        
        if ($this->apiToken) {
            $headers[] = 'Authorization: Bearer ' . $this->apiToken;
        }
        
        $options = [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_TIMEOUT => 30
        ];
        
        if ($method === 'POST' && $data) {
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_POSTFIELDS] = json_encode($data);
        }
        
        curl_setopt_array($ch, $options);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        
        curl_close($ch);
        
        if ($error) {
            throw new Exception("API Request Error: " . $error);
        }
        
        return [
            'code' => $httpCode,
            'data' => json_decode($response, true)
        ];
    }
    
    // Status endpoints
    public function checkStatus() {
        return $this->makeRequest('/');
    }
    
    // 2D endpoints
    public function get2DToday() {
        return $this->makeRequest('/api/2d/today');
    }
    
    public function get2DLatest() {
        return $this->makeRequest('/api/2d/latest');
    }
    
    public function get2DByDate($date) {
        return $this->makeRequest('/api/2d/date/' . $date);
    }
    
    public function get2DHistory($limit = 10) {
        return $this->makeRequest('/api/2d/history?limit=' . $limit);
    }
    
    public function update2DResult($data) {
        return $this->makeRequest('/api/2d/update', 'POST', $data);
    }
    
    // 3D endpoints
    public function get3DToday() {
        return $this->makeRequest('/api/3d/today');
    }
    
    public function get3DLatest() {
        return $this->makeRequest('/api/3d/latest');
    }
    
    public function get3DByDate($date) {
        return $this->makeRequest('/api/3d/date/' . $date);
    }
    
    public function get3DHistory($limit = 10) {
        return $this->makeRequest('/api/3d/history?limit=' . $limit);
    }
    
    public function update3DResult($data) {
        return $this->makeRequest('/api/3d/update', 'POST', $data);
    }
}
