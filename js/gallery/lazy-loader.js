export function createLazyLoader(contextPool) {
    const loadObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const lazyIframe = entry.target.querySelector('.lazy-iframe');
            if (lazyIframe && lazyIframe.dataset.src) {
                console.log(`🔍 Card intersecting, adding to queue: ${lazyIframe.dataset.src}`);
                contextPool.addToQueue(entry.target, lazyIframe.dataset.src);
                delete lazyIframe.dataset.src;
            } else {
                console.log('⚠️ Card intersecting but no data-src found');
            }
        });
    }, {
        rootMargin: '100px',
        threshold: 0.1,
    });

    const cleanupObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                contextPool.cleanupContext(entry.target);
            }
        });
    }, {
        rootMargin: '-100px',
    });

    function observeCard(card) {
        loadObserver.observe(card);
        cleanupObserver.observe(card);
    }

    function observeCards() {
        document.querySelectorAll('.effect-card').forEach(observeCard);
    }

    return {
        observeCard,
        observeCards,
        disconnect() {
            loadObserver.disconnect();
            cleanupObserver.disconnect();
        }
    };
}
