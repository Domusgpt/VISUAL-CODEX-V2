import { effects } from './effects-data.js';
import { openModal, initModal, openFullscreen } from './modal.js';
import { WebGLContextPool } from './context-pool.js';
import { createLazyLoader } from './lazy-loader.js';
import { initContextStatus, initServerStatusCheck } from './status.js';

let currentFilter = 'all';
const contextPool = new WebGLContextPool(6);
const lazyLoader = createLazyLoader(contextPool);
const TWIN_STORAGE_PREFIX = 'gallery:twin:';
let pendingEffectHighlight = null;

function createLivePreview(effect) {
    const lazyIframe = document.createElement('div');
    lazyIframe.className = 'lazy-iframe';
    lazyIframe.dataset.src = effect.file;
    lazyIframe.style.width = '100%';
    lazyIframe.style.height = '100%';

    const placeholder = document.createElement('div');
    placeholder.className = 'click-to-view';
    placeholder.style.cssText = 'width: 100%; height: 100%; background: linear-gradient(45deg, #0a0a0f, #1a0033); display: flex; align-items: center; justify-content: center; color: #00ffff; font-family: monospace; cursor: pointer; transition: all 0.3s ease;';
    placeholder.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 1rem; filter: drop-shadow(0 0 20px #00ffff);">🚀</div>
            <div style="font-size: 1.2rem; margin-bottom: 0.5rem; font-weight: bold;">Click to View</div>
            <div style="font-size: 1rem; margin-bottom: 1rem;">${effect.title}</div>
            <div style="font-size: 0.8rem; opacity: 0.7;">Opens in new tab</div>
        </div>
    `;
    placeholder.addEventListener('click', (event) => {
        event.stopPropagation();
        window.open(effect.file, '_blank');
    });

    lazyIframe.appendChild(placeholder);
    return lazyIframe;
}

function createDemoPreview(effect) {
    const demo = document.createElement('div');
    demo.className = effect.demoClass || 'demo-particles';
    demo.style.width = '100%';
    demo.style.height = '100%';
    return demo;
}

function createBadge(effect) {
    const badge = document.createElement('div');
    badge.style.cssText = `
        position: absolute;
        top: 5px;
        left: 5px;
        background: ${effect.hasRealCode ? 'rgba(0,255,0,0.8)' : 'rgba(255,255,0,0.8)'};
        color: #000;
        padding: 2px 6px;
        font-size: 10px;
        font-weight: bold;
    `;
    badge.textContent = effect.hasRealCode ? 'LIVE' : 'DEMO';
    return badge;
}

function createControls(effect) {
    const controls = document.createElement('div');
    controls.className = 'controls';

    const fullscreenButton = document.createElement('button');
    fullscreenButton.className = 'control-btn';
    fullscreenButton.title = 'Fullscreen';
    fullscreenButton.textContent = '⛶';
    fullscreenButton.addEventListener('click', (event) => {
        event.stopPropagation();
        openFullscreen(effect);
    });

    const codeButton = document.createElement('button');
    codeButton.className = 'control-btn';
    codeButton.title = 'Code';
    codeButton.textContent = '{ }';
    codeButton.addEventListener('click', (event) => event.stopPropagation());

    const settingsButton = document.createElement('button');
    settingsButton.className = 'control-btn';
    settingsButton.title = 'Settings';
    settingsButton.textContent = '⚙';
    settingsButton.addEventListener('click', (event) => event.stopPropagation());

    controls.append(fullscreenButton, codeButton, settingsButton);
    return controls;
}

function createInfo(effect) {
    const info = document.createElement('div');
    info.className = 'effect-info';
    info.innerHTML = `
        <div class="effect-title">${effect.title}</div>
        <div class="effect-description">${effect.description}</div>
        <div class="effect-tags">
            ${effect.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            ${effect.interactive.map(input => `<span class="tag" style="background: rgba(0,255,255,0.2); border-color: var(--neon-cyan);">${input}</span>`).join('')}
        </div>
    `;
    return info;
}

function createCard(effect) {
    const card = document.createElement('div');
    card.className = 'effect-card';
    card.id = `effect-${effect.id}`;
    card.dataset.effectId = effect.id;
    card.addEventListener('click', () => openModal(effect));

    const preview = document.createElement('div');
    preview.className = 'effect-preview';
    preview.style.position = 'relative';

    if (effect.hasRealCode && effect.file) {
        preview.appendChild(createLivePreview(effect));
    } else {
        preview.appendChild(createDemoPreview(effect));
    }

    preview.appendChild(createBadge(effect));
    preview.appendChild(createControls(effect));

    card.appendChild(preview);
    card.appendChild(createInfo(effect));

    return card;
}

function getFilteredEffects() {
    if (currentFilter === 'all') {
        return effects;
    }
    return effects.filter(effect => effect.tags.includes(currentFilter));
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    if (!gallery) return;

    contextPool.reset();
    lazyLoader.disconnect();
    gallery.innerHTML = '';

    getFilteredEffects().forEach(effect => {
        const card = createCard(effect);
        gallery.appendChild(card);
        if (effect.hasRealCode && effect.file) {
            lazyLoader.observeCard(card);
        }
    });

    requestAnimationFrame(() => {
        const hashReRendered = highlightEffectFromHash();
        if (hashReRendered) {
            return;
        }

        const storageReRendered = highlightEffectFromStorage();
        if (storageReRendered) {
            return;
        }

        if (pendingEffectHighlight) {
            if (highlightEffectById(pendingEffectHighlight)) {
                pendingEffectHighlight = null;
            }
        }
    });
}

function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    renderGallery();
}

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}

function initMouseTracking() {
    document.addEventListener('mousemove', (event) => {
        document.querySelectorAll('.effect-preview').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width;
            const y = (event.clientY - rect.top) / rect.height;

            if (x >= 0 && x <= 1 && y >= 0 && y <= 1) {
                card.style.setProperty('--mouse-x', x);
                card.style.setProperty('--mouse-y', y);
            }
        });
    });
}

function init() {
    initModal();
    initFilters();
    renderGallery();
    initMouseTracking();
    initContextStatus(contextPool);
    initServerStatusCheck();
    initHashNavigation();
}

document.addEventListener('DOMContentLoaded', init);

function highlightCard(card, behavior = 'smooth') {
    if (!card) return;

    if (behavior) {
        card.scrollIntoView({ behavior, block: 'center' });
    }

    card.classList.add('effect-card--highlight');
    window.setTimeout(() => {
        card.classList.remove('effect-card--highlight');
    }, 2600);
}

function highlightEffectFromHash(behavior = 'smooth') {
    const { hash } = window.location;
    if (!hash || !hash.startsWith('#effect-')) {
        return false;
    }

    const match = hash.match(/^#effect-(.+)$/);
    if (!match) {
        return false;
    }

    if (highlightEffectById(match[1], behavior)) {
        pendingEffectHighlight = null;
        return false;
    }

    pendingEffectHighlight = match[1];
    if (currentFilter !== 'all') {
        setFilter('all');
        return true;
    }

    return false;
}

function highlightEffectFromStorage() {
    try {
        const stored = localStorage.getItem(`${TWIN_STORAGE_PREFIX}last`);
        if (!stored) {
            return false;
        }

        localStorage.removeItem(`${TWIN_STORAGE_PREFIX}last`);

        if (highlightEffectById(stored)) {
            pendingEffectHighlight = null;
            return false;
        }

        pendingEffectHighlight = stored;
        if (currentFilter !== 'all') {
            setFilter('all');
            return true;
        }

        return false;
    } catch (error) {
        console.debug('[gallery] unable to read twin storage', error);
        return false;
    }
}

function highlightEffectById(effectId, behavior = 'smooth') {
    const card = document.getElementById(`effect-${effectId}`);
    if (!card) {
        return false;
    }

    highlightCard(card, behavior);
    return true;
}

function initHashNavigation() {
    window.addEventListener('hashchange', () => highlightEffectFromHash());
}
