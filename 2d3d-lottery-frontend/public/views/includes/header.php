<!DOCTYPE html>
<html lang="my">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="2D3D ထီ - မြန်မာနိုင်ငံ၏ ယုံကြည်စိတ်ချရသော အွန်လိုင်းထီဝန်ဆောင်မှု">
    <meta name="theme-color" content="#4a90e2">
    
    <title>2D3D ထီ</title>
    
    <!-- သင်္ကေတပုံများ -->
    <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
    <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
    
    <!-- အရေးကြီးဖိုင်များအား ကြိုတင်ရယူထားခြင်း -->
    <link rel="preload" href="/assets/css/bootstrap.min.css" as="style">
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap" as="style">
    
    <!-- CSS ဖိုင်များ -->
    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Padauk:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    
    <!-- လုံခြုံရေးဆိုင်ရာ headers -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://twod3d-lottery-api-q68w.onrender.com;">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
</head>
<body class="myanmar-text">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="/">2D3D ထီ</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <?php if (isset($_SESSION['user'])): ?>
                        <li class="nav-item">
                            <a class="nav-link" href="/dashboard">ဒိုင်ခွက်</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link logout-btn" href="/logout">ထွက်ရန်</a>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link" href="/login">အကောင့်ဝင်ရန်</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/register">အကောင့်ဖွင့်ရန်</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>
    <main class="container py-4"> 