export class WebGLContextPool {
    constructor(maxContexts = 6) {
        this.maxContexts = maxContexts;
        this.activeContexts = new Map();
        this.loadQueue = [];
        this.isProcessing = false;

        console.log(`🎯 WebGL Context Pool initialized: Max ${maxContexts} contexts`);
    }

    addToQueue(cardElement, src) {
        if (this.activeContexts.has(cardElement)) {
            console.log('⚠️ Context already active for card');
            return;
        }

        this.loadQueue.push({ cardElement, src });
        console.log(`📋 Added to queue: ${this.loadQueue.length} pending, ${this.activeContexts.size} active`);
        this.processQueue();
    }

    processQueue() {
        if (this.isProcessing || this.loadQueue.length === 0) return;
        if (this.activeContexts.size >= this.maxContexts) {
            console.log(`🚫 Context limit reached (${this.maxContexts}), waiting for cleanup`);
            return;
        }

        this.isProcessing = true;
        const { cardElement, src } = this.loadQueue.shift();

        console.log(`🚀 Loading context ${this.activeContexts.size + 1}/${this.maxContexts}`);
        this.loadIframe(cardElement, src);

        setTimeout(() => {
            this.isProcessing = false;
            this.processQueue();
        }, 500);
    }

    loadIframe(cardElement, src) {
        const lazyIframe = cardElement.querySelector('.lazy-iframe');
        if (!lazyIframe) return;

        const iframe = document.createElement('iframe');
        iframe.src = src;
        iframe.style.cssText = 'width: 100%; height: 100%; border: none; background: #000;';
        iframe.sandbox = 'allow-scripts allow-same-origin';

        lazyIframe.style.background = '#000';
        lazyIframe.innerHTML = `
            <div style="color: #00ffff; text-align: center; padding: 20px; font-family: monospace;">
                <div style="font-size: 1.5rem; margin-bottom: 1rem;">⚡</div>
                <div>Loading WebGL Context ${this.activeContexts.size + 1}/${this.maxContexts}...</div>
                <div style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.7;">Queue: ${this.loadQueue.length} waiting</div>
            </div>
        `;

        iframe.onload = () => {
            console.log(`✅ Iframe loaded: ${src}`);
            lazyIframe.innerHTML = '';
            lazyIframe.appendChild(iframe);
            this.activeContexts.set(cardElement, iframe);
            console.log(`✅ Context loaded successfully: ${this.activeContexts.size}/${this.maxContexts} active`);
        };

        iframe.onerror = () => {
            console.log(`❌ Iframe failed to load: ${src}`);
            lazyIframe.innerHTML = `
                <div style="color: #ff0080; text-align: center; padding: 20px; font-family: monospace;">
                    <div style="font-size: 1.5rem; margin-bottom: 1rem;">⚠️</div>
                    <div>Preview unavailable</div>
                    <div style="font-size: 0.8rem; margin-top: 0.5rem;">CORS or loading error</div>
                    <button style="margin-top: 1rem; padding: 0.5rem 1rem; background: rgba(0,255,255,0.2); border: 1px solid #00ffff; color: #00ffff; cursor: pointer;">
                        Open Direct
                    </button>
                </div>
            `;
            const retryButton = lazyIframe.querySelector('button');
            if (retryButton) {
                retryButton.addEventListener('click', () => window.open(src, '_blank'));
            }
        };

        const timeout = setTimeout(() => {
            if (!iframe.contentDocument) {
                console.log(`⏰ Iframe load timeout: ${src}`);
                iframe.onerror();
            }
        }, 10000);

        iframe.addEventListener('load', () => clearTimeout(timeout));
    }

    cleanupContext(cardElement) {
        if (!this.activeContexts.has(cardElement)) {
            return;
        }

        const iframe = this.activeContexts.get(cardElement);
        const lazyIframe = cardElement.querySelector('.lazy-iframe');
        if (lazyIframe) {
            lazyIframe.innerHTML = `
                <div style="color: #00ffff; text-align: center; padding: 20px; font-family: monospace;">
                    <div style="font-size: 1.5rem; margin-bottom: 1rem;">💤</div>
                    <div>Context Cleaned Up</div>
                    <div style="font-size: 0.8rem; margin-top: 0.5rem; opacity: 0.7;">Scroll back to reload</div>
                </div>
            `;
            lazyIframe.dataset.src = iframe?.src || '';
        }

        iframe?.remove();
        this.activeContexts.delete(cardElement);

        console.log(`🧹 Context cleaned up: ${this.activeContexts.size}/${this.maxContexts} active, ${this.loadQueue.length} in queue`);

        setTimeout(() => this.processQueue(), 100);
    }

    getStatus() {
        return {
            active: this.activeContexts.size,
            max: this.maxContexts,
            queue: this.loadQueue.length,
            available: this.maxContexts - this.activeContexts.size,
        };
    }

    reset() {
        this.activeContexts.forEach((_, cardElement) => {
            this.cleanupContext(cardElement);
        });
        this.loadQueue = [];
    }
}
