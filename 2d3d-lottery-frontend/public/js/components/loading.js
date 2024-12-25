export class LoadingSpinner {
    constructor(container) {
        this.container = container;
        this.spinner = document.createElement('div');
        this.spinner.className = 'loading-spinner';
        this.spinner.innerHTML = `
            <div class="spinner"></div>
            <p>ခဏစောင့်ပါ...</p>
        `;
    }

    show() {
        this.container.appendChild(this.spinner);
    }

    hide() {
        this.spinner.remove();
    }
} 