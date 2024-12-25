<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'storage/logs/php-error.log');

// Load environment variables
require_once __DIR__ . '/../vendor/autoload.php';

try {
    // Initialize application
    session_start();
?>
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="2D3D Lottery - Your trusted online lottery platform">
        <title>2D3D Lottery</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/css/style.css">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </head>

    <body>
        <header>
            <div class="container">
                <h1>2D3D Lottery</h1>
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/results">Results</a></li>
                        <li><a href="/play">Play Now</a></li>
                        <?php if (isset($_SESSION['user'])): ?>
                            <li><a href="/account">My Account</a></li>
                            <li><a href="/logout">Logout</a></li>
                        <?php else: ?>
                            <li><a href="/login">Login</a></li>
                        <?php endif; ?>
                    </ul>
                </nav>
            </div>
        </header>

        <main class="container">
            <section class="lottery-card">
                <h2>Today's Draw</h2>
                <div class="lottery-numbers">
                    <!-- Numbers will be dynamically inserted here -->
                </div>
                <button class="btn-primary">Play Now</button>
            </section>

            <section class="lottery-card">
                <h2>Previous Results</h2>
                <div id="previous-results">
                    <!-- Previous results will be loaded here -->
                </div>
            </section>
        </main>

        <footer>
            <div class="container">
                <p>&copy; <?php echo date('Y'); ?> 2D3D Lottery. All rights reserved.</p>
            </div>
        </footer>

        <script src="/js/main.js"></script>
    </body>

    </html>
<?php
} catch (Exception $e) {
    // Log error
    error_log($e->getMessage());

    // Show generic error page in production
    if (!isset($_ENV['APP_DEBUG']) || $_ENV['APP_DEBUG'] === false) {
        include __DIR__ . '/error.php';
    } else {
        throw $e;
    }
}
?>