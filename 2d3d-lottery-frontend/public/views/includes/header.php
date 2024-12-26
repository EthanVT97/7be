<!DOCTYPE html>
<html lang="my">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2D3D Lottery - Myanmar's Premier Online Lottery Platform</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="/css/style.css" rel="stylesheet">
</head>
<body>
    <!-- Alert Container -->
    <div id="alertContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 1050;"></div>

    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <a class="navbar-brand" href="/">
                <img src="/assets/logo.png" alt="2D3D Lottery" height="30">
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">ပင်မစာမျက်နှာ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/play">ထီထိုးရန်</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/results">ထီပေါက်စဉ်များ</a>
                    </li>
                </ul>
                
                <!-- Auth Buttons -->
                <div id="authButtons" class="d-flex">
                    <button class="btn btn-outline-light me-2" onclick="window.auth.showLoginModal()">
                        <i class="fas fa-sign-in-alt"></i> ဝင်ရောက်ရန်
                    </button>
                    <button class="btn btn-light" onclick="window.auth.showRegisterModal()">
                        <i class="fas fa-user-plus"></i> အကောင့်ဖွင့်ရန်
                    </button>
                </div>
                
                <!-- User Info (Hidden by default) -->
                <div id="userInfo" class="d-none text-light">
                    <span class="me-2">
                        <i class="fas fa-user"></i>
                        <span class="username"></span>
                    </span>
                    <span class="me-3">
                        <i class="fas fa-wallet"></i>
                        <span class="balance"></span> Ks
                    </span>
                    <button class="btn btn-outline-light btn-sm" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content Container -->
    <main class="container py-4"> 