export class StorageManager {
    static setItem(key, value, encrypt = false) {
        const data = encrypt ? this.encrypt(JSON.stringify(value)) : JSON.stringify(value);
        localStorage.setItem(key, data);
    }

    static getItem(key, decrypt = false) {
        const data = localStorage.getItem(key);
        if (!data) return null;
        
        try {
            const parsed = decrypt ? JSON.parse(this.decrypt(data)) : JSON.parse(data);
            return parsed;
        } catch {
            return null;
        }
    }

    static encrypt(text) {
        // Implement encryption logic
        return text;
    }

    static decrypt(text) {
        // Implement decryption logic
        return text;
    }
} 