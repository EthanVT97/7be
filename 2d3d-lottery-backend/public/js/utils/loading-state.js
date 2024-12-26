export class LoadingState {
    static show(elementId = 'contentArea') {
        const element = document.getElementById(elementId);
        const loader = `
            <div class="loading-overlay">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
        element.insertAdjacentHTML('beforeend', loader);
    }

    static hide(elementId = 'contentArea') {
        const element = document.getElementById(elementId);
        const loader = element.querySelector('.loading-overlay');
        if (loader) {
            loader.remove();
        }
    }
} 