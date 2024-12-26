// ရက်စွဲပုံစံပြောင်းခြင်း
export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('my-MM', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// ငွေလွှဲအမျိုးအစား ပြောင်းခြင်း
export function getTransactionType(type) {
    const types = {
        'deposit': 'ငွေသွင်း',
        'withdraw': 'ငွေထုတ်',
        'bet': 'ထီထိုး',
        'win': 'ထီပေါက်',
        'refund': 'ငွေပြန်အမ်း'
    };
    return types[type] || type;
}

// ငွေလွှဲအခြေအနေ ပြောင်းခြင်း
export function getTransactionStatus(status) {
    const statuses = {
        'pending': '<span class="badge bg-warning">စောင့်ဆိုင်းဆဲ</span>',
        'approved': '<span class="badge bg-success">အတည်ပြုပြီး</span>',
        'rejected': '<span class="badge bg-danger">ငြင်းပယ်ခဲ့သည်</span>',
        'cancelled': '<span class="badge bg-secondary">ပယ်ဖျက်ခဲ့သည်</span>'
    };
    return statuses[status] || status;
}

// ငွေပမာဏ ပုံစံပြောင်းခြင်း
export function formatAmount(amount) {
    return amount.toLocaleString('my-MM') + ' ကျပ်';
} 