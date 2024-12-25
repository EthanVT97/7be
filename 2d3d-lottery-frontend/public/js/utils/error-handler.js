export class ErrorHandler {
    static handle(error, errorDiv) {
        console.error('Error:', error);
        
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    ApiService.logout();
                    break;
                case 403:
                    window.location.href = '/unauthorized.html';
                    break;
                case 429:
                    errorDiv.textContent = 'တစ်မိနစ်အတွင်း request များလွန်းနေပါသည်။ ခဏစောင့်ပါ။';
                    break;
                default:
                    errorDiv.textContent = error.response.data.message || 'Something went wrong';
            }
        } else {
            errorDiv.textContent = 'Network error occurred';
        }
    }
} 