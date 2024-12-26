<?php
if (!isset($_SESSION['user'])) {
    header('Location: /login');
    exit;
}
?>

<div class="row mb-4">
    <div class="col-md-4">
        <div class="dashboard-stats">
            <h5>Balance</h5>
            <h3 class="mb-0">K <span id="userBalance">0</span></h3>
        </div>
    </div>
    <div class="col-md-4">
        <div class="dashboard-stats">
            <h5>Total Bets</h5>
            <h3 class="mb-0"><span id="totalBets">0</span></h3>
        </div>
    </div>
    <div class="col-md-4">
        <div class="dashboard-stats">
            <h5>Total Wins</h5>
            <h3 class="mb-0"><span id="totalWins">0</span></h3>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-md-6">
        <div class="card lottery-card mb-4">
            <div class="card-header">
                <h5 class="mb-0">2D Lottery</h5>
            </div>
            <div class="card-body">
                <form id="2dLotteryForm">
                    <div class="mb-3">
                        <label for="2dNumber" class="form-label">Choose Number (00-99)</label>
                        <input type="text" class="form-control" id="2dNumber" maxlength="2" required>
                    </div>
                    <div class="mb-3">
                        <label for="2dAmount" class="form-label">Bet Amount</label>
                        <input type="number" class="form-control" id="2dAmount" min="100" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-lottery">Place Bet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card lottery-card mb-4">
            <div class="card-header">
                <h5 class="mb-0">3D Lottery</h5>
            </div>
            <div class="card-body">
                <form id="3dLotteryForm">
                    <div class="mb-3">
                        <label for="3dNumber" class="form-label">Choose Number (000-999)</label>
                        <input type="text" class="form-control" id="3dNumber" maxlength="3" required>
                    </div>
                    <div class="mb-3">
                        <label for="3dAmount" class="form-label">Bet Amount</label>
                        <input type="number" class="form-control" id="3dAmount" min="100" required>
                    </div>
                    <div class="d-grid">
                        <button type="submit" class="btn btn-lottery">Place Bet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
// Load user data
async function loadUserData() {
    try {
        const response = await fetch('/api/user/data');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('userBalance').textContent = data.balance.toLocaleString();
            document.getElementById('totalBets').textContent = data.totalBets.toLocaleString();
            document.getElementById('totalWins').textContent = data.totalWins.toLocaleString();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    
    // 2D Form submission
    document.getElementById('2dLotteryForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        // Add your 2D lottery bet submission logic here
    });
    
    // 3D Form submission
    document.getElementById('3dLotteryForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        // Add your 3D lottery bet submission logic here
    });
});</script> 