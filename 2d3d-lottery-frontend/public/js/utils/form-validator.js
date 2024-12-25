export class FormValidator {
    static validateLotteryNumber(number, type) {
        const patterns = {
            '2d': /^\d{2}$/,
            '3d': /^\d{3}$/
        };
        return patterns[type].test(number);
    }

    static validateSaleForm(data) {
        const errors = [];

        if (!data.numbers || data.numbers.length === 0) {
            errors.push('ဂဏန်းရွေးချယ်ပါ');
        }

        if (!data.customer.name) {
            errors.push('ထီထိုးသူအမည် ထည့်သွင်းပါ');
        }

        if (!this.validatePhoneNumber(data.customer.phone)) {
            errors.push('မှန်ကန်သော ဖုန်းနံပါတ် ထည့်သွင်းပါ');
        }

        return errors;
    }

    static validatePhoneNumber(phone) {
        return /^(09|\+?959)\d{7,9}$/.test(phone);
    }
} 