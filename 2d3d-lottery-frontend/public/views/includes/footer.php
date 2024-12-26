    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>2D3D Lottery</h5>
                    <p>မြန်မာနိုင်ငံ၏ ယုံကြည်စိတ်ချရသော အွန်လိုင်းထီဝန်ဆောင်မှု</p>
                </div>
                <div class="col-md-4">
                    <h5>အကူအညီ</h5>
                    <ul class="list-unstyled">
                        <li><a href="/help" class="text-light">အသုံးပြုနည်း</a></li>
                        <li><a href="/faq" class="text-light">မေးလေ့ရှိသောမေးခွန်းများ</a></li>
                        <li><a href="/contact" class="text-light">ဆက်သွယ်ရန်</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>ဆက်သွယ်ရန်</h5>
                    <p>
                        <i class="fas fa-envelope"></i> support@twod3d.onrender.com<br>
                        <i class="fas fa-phone"></i> +95 9123456789
                    </p>
                </div>
            </div>
            <hr>
            <div class="text-center">
                <p>&copy; <?php echo date('Y'); ?> 2D3D Lottery. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">အကောင့်ဝင်ရန်</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="loginForm">
                        <div class="mb-3">
                            <label class="form-label">အသုံးပြုသူအမည်</label>
                            <input type="text" class="form-control" id="loginUsername" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">စကားဝှက်</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="loginPassword" required>
                                <button type="button" class="btn btn-outline-secondary" onclick="window.auth.togglePassword('loginPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">ဝင်ရောက်မည်</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Register Modal -->
    <div class="modal fade" id="registerModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">အကောင့်အသစ်ဖွင့်ရန်</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="registerForm">
                        <div class="mb-3">
                            <label class="form-label">အသုံးပြုသူအမည်</label>
                            <input type="text" class="form-control" id="registerUsername" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">အီးမေးလ်</label>
                            <input type="email" class="form-control" id="registerEmail" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">ဖုန်းနံပါတ်</label>
                            <input type="tel" class="form-control" id="registerPhone" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">စကားဝှက်</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="registerPassword" required>
                                <button type="button" class="btn btn-outline-secondary" onclick="window.auth.togglePassword('registerPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">စကားဝှက်အတည်ပြုရန်</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="confirmPassword" required>
                                <button type="button" class="btn btn-outline-secondary" onclick="window.auth.togglePassword('confirmPassword')">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">အကောင့်ဖွင့်မည်</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- App Scripts -->
    <script type="module" src="/js/config.js"></script>
    <script type="module" src="/js/app.js"></script>
    <script type="module" src="/js/auth.js"></script>
    <script type="module" src="/js/main.js"></script>
</body>
</html> 