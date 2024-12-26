// Lottery Sale Methods
async getLimits() {
    return this.fetchApi('/limits');
}

async getCustomerInfo(phone) {
    if (!phone) return null;
    return this.fetchApi(`/customers/${phone}`);
}

async submitSale(saleData) {
    return this.fetchApi('/sales', {
        method: 'POST',
        body: JSON.stringify(saleData)
    });
}

async getReceipt(saleId) {
    return this.fetchApi(`/sales/${saleId}/receipt`);
}

// Credit Management
async getCustomerCredit(customerId) {
    return this.fetchApi(`/customers/${customerId}/credit`);
}

async updateCustomerCredit(customerId, amount) {
    return this.fetchApi(`/customers/${customerId}/credit`, {
        method: 'PUT',
        body: JSON.stringify({ amount })
    });
} 