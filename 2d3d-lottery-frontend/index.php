<?php

require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Middleware\CorsMiddleware;
use App\Middleware\AuthMiddleware;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Initialize middleware stack
$middleware = [
    new CorsMiddleware(),
    new AuthMiddleware()
];

// Handle request through middleware
$request = $_REQUEST;
$response = null;

foreach ($middleware as $mw) {
    $response = $mw->handle($request, function($req) use (&$response) {
        return $response;
    });
}

// Route handling
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// API Routes
switch ($path) {
    case '/api/auth/login':
        require_once 'src/Controllers/AuthController.php';
        (new AuthController())->login();
        break;

    case '/api/auth/register':
        require_once 'src/Controllers/AuthController.php';
        (new AuthController())->register();
        break;

    case '/api/bets':
        require_once 'src/Controllers/BetController.php';
        $controller = new BetController();
        if ($method === 'GET') {
            $controller->getBets();
        } elseif ($method === 'POST') {
            $controller->placeBet();
        }
        break;

    case '/api/transactions':
        require_once 'src/Controllers/TransactionController.php';
        $controller = new TransactionController();
        if ($method === 'GET') {
            $controller->getTransactions();
        } elseif ($method === 'POST') {
            $controller->createTransaction();
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
        break;
}
