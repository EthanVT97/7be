<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', 'storage/logs/php-error.log');

require_once __DIR__ . '/../vendor/autoload.php';

try {
    session_start();
?>
    <!DOCTYPE html>
    <html lang="my">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="2D3D ထီ - သင်ယုံကြည်စိတ်ချရသော အွန်လိုင်းထီဝက်ဘ်ဆိုက်">
        <title>2D3D ထီ</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/css/style.css">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </head>

    <body>
        <nav class="navbar navbar-expand-lg">
            <div class="container">
                <a class="navbar-brand" href="/">2D3D ထီ</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="/">ပင်မစာမျက်နှာ</a></li>
                        <li class="nav-item"><a class="nav-link" href="/results">ထီထွက်ဂဏန်းများ</a></li>
                        <li class="nav-item"><a class="nav-link" href="/play">ထီထိုးရန်</a></li>
                        <?php if (isset($_SESSION['user'])): ?>
                            <li class="nav-item"><a class="nav-link" href="/account">ကျွန်ုပ်၏အကောင့်</a></li>
                            <li class="nav-item"><a class="nav-link" href="/logout">ထွက်ရန်</a></li>
                        <?php else: ?>
                            <li class="nav-item"><a class="nav-link" href="/login">ဝင်ရန်</a></li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
        </nav>

        <main class="container py-4">
            <section class="lottery-card">
                <h2>ယနေ့ထီပေါက်ဂဏန်းများ</h2>
                <div class="lottery-numbers">
                    <!-- Numbers will be dynamically inserted here -->
                </div>
                <button class="btn btn-primary">ထီထိုးရန်</button>
            </section>

            <section class="lottery-card">
                <h2>ယခင်ထီပေါက်ဂဏန်းများ</h2>
                <div id="previous-results" class="table-responsive">
                    <!-- Previous results will be loaded here -->
                </div>
            </section>
        </main>

        <footer>
            <div class="container text-center">
                <p>&copy; <?php echo date('Y'); ?> 2D3D ထီ။ မူပိုင်ခွင့်အားလုံး ထိန်းသိမ်းပြီးဖြစ်သည်။</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/js/main.js"></script>
    </body>

    </html>
<?php
} catch (Exception $e) {
    error_log($e->getMessage());
    if (!isset($_ENV['APP_DEBUG']) || $_ENV['APP_DEBUG'] === false) {
        include __DIR__ . '/error.php';
    } else {
        throw $e;
    }
}
?>