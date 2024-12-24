<?php
// Prevent direct access
defined('INCLUDED_FROM_INDEX') or define('INCLUDED_FROM_INDEX', true);

// Database configuration
define('DB_HOST', getenv('DB_HOST') ?: 'sql207.infinityfree.com');
define('DB_NAME', getenv('DB_NAME') ?: 'if0_37960691_if0_37960691_lottery');
define('DB_USER', getenv('DB_USER') ?: 'if0_37960691');
define('DB_PASS', getenv('DB_PASS') ?: 'j7Mw1ZKMjPD');

// Site configuration
define('SITE_NAME', '2D3D Kobo');
define('SITE_URL', 'https://twod3d-lottery-api.onrender.com');

// Timezone setting
date_default_timezone_set('Asia/Yangon');
