import { effects } from './effects-data.js';

const STYLE_ID = 'effect-twin-style';
const STORAGE_PREFIX = 'gallery:twin:';
const DEFAULT_RETURN_URL = '../gallery.html';

function ensureStyles() {
    if (document.getElementById(STYLE_ID)) {
        return;
    }

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
        .effect-twin {
            position: fixed;
            top: 1.5rem;
            right: 1.5rem;
            width: min(340px, calc(100vw - 2rem));
            color: #e2f9ff;
            background: rgba(4, 8, 24, 0.92);
            border: 1px solid rgba(0, 255, 255, 0.25);
            border-radius: 18px;
            box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(20px) saturate(1.3);
            font-family: 'JetBrains Mono', 'Fira Code', 'SFMono-Regular', Consolas, monospace;
            padding: 1.25rem 1.5rem 1.5rem;
            z-index: 10000;
            transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .effect-twin .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }

        @media (max-width: 720px) {
            .effect-twin {
                left: 50%;
                right: auto;
                bottom: 1.5rem;
                top: auto;
                transform: translateX(-50%);
                width: min(480px, calc(100vw - 2rem));
            }

            .effect-twin.effect-twin--collapsed {
                transform: translateX(-50%) translateY(calc(100% - 3rem));
            }
        }

        .effect-twin__toggle {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            border: none;
            background: rgba(0, 255, 255, 0.15);
            color: #aaf8ff;
            border-radius: 999px;
            width: 2.5rem;
            height: 2.5rem;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.2s ease, transform 0.2s ease;
        }

        .effect-twin__toggle:hover {
            background: rgba(0, 255, 255, 0.3);
            transform: scale(1.05);
        }

        .effect-twin__toggle:focus-visible {
            outline: 2px solid #39d0ff;
            outline-offset: 2px;
        }

        .effect-twin--collapsed {
            transform: translateX(calc(100% - 3.5rem));
            opacity: 0.85;
        }

        .effect-twin__header {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            justify-content: space-between;
        }

        .effect-twin__title {
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: #7be0ff;
            margin: 0;
        }

        .effect-twin__status {
            font-size: 0.75rem;
            letter-spacing: 0.08em;
            padding: 0.25rem 0.6rem;
            border-radius: 999px;
            border: 1px solid rgba(0, 255, 255, 0.35);
            color: #06121f;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.75), rgba(0, 140, 255, 0.75));
            text-transform: uppercase;
            white-space: nowrap;
        }

        .effect-twin__description {
            font-size: 0.85rem;
            line-height: 1.6;
            color: rgba(214, 243, 255, 0.85);
            margin: 0;
        }

        .effect-twin__tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
        }

        .effect-twin__tag {
            font-size: 0.7rem;
            letter-spacing: 0.06em;
            padding: 0.25rem 0.55rem;
            border-radius: 0.75rem;
            border: 1px solid rgba(123, 224, 255, 0.4);
            background: rgba(8, 40, 66, 0.6);
            color: rgba(210, 244, 255, 0.9);
        }

        .effect-twin__actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .effect-twin__btn {
            flex: 1 1 45%;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            gap: 0.4rem;
            padding: 0.55rem 0.75rem;
            border-radius: 0.8rem;
            border: 1px solid rgba(0, 255, 255, 0.3);
            color: #081321;
            text-decoration: none;
            font-size: 0.8rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            background: linear-gradient(135deg, rgba(0, 255, 255, 0.65), rgba(0, 170, 255, 0.75));
            box-shadow: 0 10px 25px rgba(0, 200, 255, 0.2);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .effect-twin__btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 18px 30px rgba(0, 200, 255, 0.3);
        }

        .effect-twin__btn:focus-visible {
            outline: 2px solid rgba(0, 255, 255, 0.8);
            outline-offset: 2px;
        }

        .effect-twin__meta {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.6rem;
        }

        .effect-twin__meta-item {
            padding: 0.55rem 0.7rem;
            border-radius: 0.75rem;
            background: rgba(7, 25, 42, 0.6);
            border: 1px solid rgba(0, 255, 255, 0.18);
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
        }

        .effect-twin__meta-label {
            font-size: 0.65rem;
            letter-spacing: 0.1em;
            color: rgba(180, 231, 255, 0.7);
        }

        .effect-twin__meta-value {
            font-size: 0.85rem;
            color: rgba(225, 248, 255, 0.92);
            letter-spacing: 0.03em;
        }
    `;

    document.head.appendChild(style);
}

function createMetaItem(label, value) {
    const wrapper = document.createElement('div');
    wrapper.className = 'effect-twin__meta-item';

    const labelEl = document.createElement('div');
    labelEl.className = 'effect-twin__meta-label';
    labelEl.textContent = label;

    const valueEl = document.createElement('div');
    valueEl.className = 'effect-twin__meta-value';
    valueEl.textContent = value;

    wrapper.append(labelEl, valueEl);
    return wrapper;
}

function createTagElements(tags = []) {
    const container = document.createElement('div');
    container.className = 'effect-twin__tags';

    tags.forEach((tag) => {
        const badge = document.createElement('span');
        badge.className = 'effect-twin__tag';
        badge.textContent = tag;
        container.appendChild(badge);
    });

    return container;
}

function createActions({ effect, returnUrl, openInNewTab }) {
    const actions = document.createElement('div');
    actions.className = 'effect-twin__actions';

    const backLink = document.createElement('a');
    backLink.className = 'effect-twin__btn';
    backLink.href = returnUrl;
    backLink.innerHTML = '<span aria-hidden="true">⟵</span><span>Gallery</span>';
    backLink.setAttribute('data-effect-link', String(effect.id));
    backLink.addEventListener('click', () => {
        try {
            localStorage.setItem(`${STORAGE_PREFIX}last`, String(effect.id));
        } catch (error) {
            console.debug('Effect twin storage unavailable', error);
        }
    });

    actions.appendChild(backLink);

    if (openInNewTab) {
        const openUrl = (() => {
            if (!effect.file) {
                return window.location.href;
            }

            if (/^https?:/i.test(effect.file) || effect.file.startsWith('/')) {
                return effect.file;
            }

            try {
                return new URL(effect.file, window.location.origin).toString();
            } catch (error) {
                console.debug('Failed to resolve standalone link for effect', effect.file, error);
                return effect.file;
            }
        })();

        const openButton = document.createElement('a');
        openButton.className = 'effect-twin__btn';
        openButton.href = openUrl;
        openButton.target = '_blank';
        openButton.rel = 'noopener noreferrer';
        openButton.innerHTML = '<span aria-hidden="true">🡵</span><span>Standalone</span>';
        actions.appendChild(openButton);
    }

    return actions;
}

function createOverlay(effect, options) {
    ensureStyles();

    const container = document.createElement('aside');
    container.className = 'effect-twin';
    container.setAttribute('data-effect-id', String(effect.id));
    container.setAttribute('aria-label', `${effect.title} gallery info`);
    container.setAttribute('role', 'complementary');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'effect-twin__toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('title', 'Collapse gallery details');
    toggle.innerHTML = '<span aria-hidden="true">⇤</span><span class="sr-only">Toggle gallery details</span>';

    const header = document.createElement('div');
    header.className = 'effect-twin__header';

    const title = document.createElement('h2');
    title.className = 'effect-twin__title';
    title.textContent = effect.title;

    header.appendChild(title);

    if (effect.status) {
        const status = document.createElement('span');
        status.className = 'effect-twin__status';
        status.textContent = effect.status;
        header.appendChild(status);
    }

    const description = document.createElement('p');
    description.className = 'effect-twin__description';
    description.textContent = effect.description;

    const meta = document.createElement('div');
    meta.className = 'effect-twin__meta';
    meta.append(
        createMetaItem('ID', `#${effect.id}`),
        createMetaItem('Code', effect.hasRealCode ? 'Implemented' : 'Design Only'),
        createMetaItem('Inputs', effect.interactive.join(', '))
    );

    const tags = createTagElements(effect.tags);
    const actions = createActions(options);

    container.append(toggle, header, description, tags, meta, actions);

    const storageKey = `${STORAGE_PREFIX}${effect.id}:collapsed`;
    const stored = (() => {
        try {
            return localStorage.getItem(storageKey);
        } catch (error) {
            return null;
        }
    })();

    if (stored === 'true') {
        container.classList.add('effect-twin--collapsed');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('title', 'Expand gallery details');
    }

    toggle.addEventListener('click', () => {
        const collapsed = container.classList.toggle('effect-twin--collapsed');
        toggle.setAttribute('aria-expanded', String(!collapsed));
        toggle.setAttribute('title', collapsed ? 'Expand gallery details' : 'Collapse gallery details');
        try {
            localStorage.setItem(storageKey, collapsed ? 'true' : 'false');
        } catch (error) {
            console.debug('Effect twin storage unavailable', error);
        }
    });

    return container;
}

function findEffect({ effectId, file }) {
    if (effectId != null) {
        const numericId = Number(effectId);
        const match = effects.find((item) => Number(item.id) === numericId);
        if (match) {
            return match;
        }
    }

    if (file) {
        const normalized = file.replace(/^\.\//, '');
        return effects.find((item) => item.file === normalized || item.file.endsWith(normalized));
    }

    return null;
}

function onReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
        callback();
    }
}

export function registerEffectPage(options = {}) {
    const effect = findEffect(options);

    if (!effect) {
        console.warn('[gallery] Unable to find effect metadata for page', options);
        return;
    }

    const returnUrl = options.returnUrl ?? `${DEFAULT_RETURN_URL}#effect-${effect.id}`;
    const openInNewTab = options.openInNewTab ?? true;

    onReady(() => {
        const overlay = createOverlay(effect, { effect, returnUrl, openInNewTab });
        document.body.appendChild(overlay);
    });
}

export function highlightFromEffectId(effectId) {
    try {
        localStorage.setItem(`${STORAGE_PREFIX}last`, String(effectId));
    } catch (error) {
        console.debug('Effect twin storage unavailable', error);
    }
}
