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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
        <link rel="stylesheet" href="/css/style.css">
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
    </head>

    <body>
        <!-- Navigation -->
        <nav class="navbar navbar-expand-lg sticky-top">
            <div class="container">
                <a class="navbar-brand" href="/">
                    <i class="fas fa-ticket-alt me-2"></i>2D3D ထီ
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="/">
                                <i class="fas fa-home me-1"></i>ပင်မစာမျက်နှာ
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/results">
                                <i class="fas fa-list-ol me-1"></i>ထီထွက်ဂဏန်းများ
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/play">
                                <i class="fas fa-play me-1"></i>ထီထို��ရန်
                            </a>
                        </li>
                        <?php if (isset($_SESSION['user'])): ?>
                            <li class="nav-item">
                                <a class="nav-link" href="/account">
                                    <i class="fas fa-user me-1"></i>ကျွန်ုပ်၏အကောင့်
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/logout">
                                    <i class="fas fa-sign-out-alt me-1"></i>ထွက်ရန်
                                </a>
                            </li>
                        <?php else: ?>
                            <li class="nav-item">
                                <a class="nav-link" href="/login">
                                    <i class="fas fa-sign-in-alt me-1"></i>ဝင်ရန်
                                </a>
                            </li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Alert Container -->
        <div id="alertContainer" class="container mt-3"></div>

        <!-- Main Content -->
        <main class="container py-4">
            <section class="lottery-card">
                <h2>
                    <i class="fas fa-star me-2"></i>
                    ယနေ့ထီပေါက်ဂဏန်းများ
                </h2>
                <div class="lottery-numbers">
                    <!-- Numbers will be dynamically inserted here -->
                </div>
                <button class="btn btn-primary">
                    <i class="fas fa-play me-2"></i>
                    ထီထိုးရန်
                </button>
            </section>

            <section class="lottery-card">
                <h2>
                    <i class="fas fa-history me-2"></i>
                    ယခင်ထီပေါက်ဂဏန်းများ
                </h2>
                <div id="previous-results" class="table-responsive">
                    <!-- Previous results will be loaded here -->
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer>
            <div class="container text-center">
                <p>
                    <i class="fas fa-copyright me-2"></i>
                    <?php echo date('Y'); ?> 2D3D ထီ။ မူပိုင်ခွင့်အားလုံး ထိန်းသိမ်းပ��ီးဖြစ်သည်။
                </p>
            </div>
        </footer>

        <!-- Login Modal -->
        <?php include 'components/login-modal.html'; ?>

        <!-- Register Modal -->
        <?php include 'components/register-modal.html'; ?>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/js/main.js" type="module"></script>
        <script src="/js/auth.js"></script>
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