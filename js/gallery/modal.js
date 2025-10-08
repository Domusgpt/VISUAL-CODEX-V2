import { highlightFromEffectId } from './effect-twin.js';

function getModalElements() {
    return {
        modal: document.getElementById('modal'),
        modalPreview: document.getElementById('modalPreview'),
        modalInfo: document.getElementById('modalInfo')
    };
}

export function openModal(effect) {
    const { modal, modalPreview, modalInfo } = getModalElements();
    if (!modal || !modalPreview || !modalInfo) return;

    if (effect.hasRealCode && effect.file) {
        modalPreview.className = 'modal-preview';
        modalPreview.innerHTML = `<iframe src="${effect.file}" style="width: 100%; height: 100%; border: none; background: #000;"></iframe>`;
    } else {
        modalPreview.className = `modal-preview ${effect.demoClass ?? ''}`.trim();
        modalPreview.innerHTML = '';
    }

    const codeStatus = effect.hasRealCode
        ? '<span style="color: #00ff00; font-weight: bold;">[LIVE CODE]</span>'
        : '<span style="color: #ffff00; font-weight: bold;">[DEMO PREVIEW]</span>';

    modalInfo.innerHTML = `
        <h2 style="color: var(--neon-magenta); margin-bottom: 1rem;">${effect.title} ${codeStatus}</h2>
        <p style="margin-bottom: 1rem;">${effect.description}</p>

        <h3 style="color: var(--neon-cyan); margin-bottom: 0.5rem;">Interactive Controls:</h3>
        <ul style="margin-bottom: 1rem; list-style: none;">
            ${effect.interactive.map(input => `<li style="margin-bottom: 0.3rem;">▸ ${input.toUpperCase()}</li>`).join('')}
        </ul>

        <h3 style="color: var(--neon-cyan); margin-bottom: 0.5rem;">Technology:</h3>
        <div style="margin-bottom: 1rem;">
            ${effect.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
        </div>

        ${effect.hasRealCode ? `
            <h3 style="color: var(--neon-cyan); margin-bottom: 0.5rem;">Source File:</h3>
            <div style="background: rgba(0,0,0,0.5); padding: 10px; margin-bottom: 1rem; font-family: monospace; color: #00ffff;">
                ${effect.file}
            </div>

            <button data-action="open-effect-page" style="background: var(--card-bg); border: 1px solid var(--neon-cyan); color: var(--neon-cyan); padding: 0.5rem 1rem; cursor: pointer; width: 100%; margin-bottom: 10px;">
                Open in New Tab
            </button>
        ` : ''}

        <button style="background: var(--card-bg); border: 1px solid var(--neon-cyan); color: var(--neon-cyan); padding: 0.5rem 1rem; cursor: pointer; width: 100%;">
            ${effect.hasRealCode ? 'View Source Code' : 'Implementation Notes'}
        </button>
    `;

    modal.style.display = 'block';

    if (effect.hasRealCode) {
        const openButton = modalInfo.querySelector('[data-action="open-effect-page"]');
        if (openButton) {
            openButton.addEventListener('click', (event) => {
                event.preventDefault();
                openFullscreen(effect);
            });
        }
    }
}

export function closeModal() {
    const { modal } = getModalElements();
    if (modal) {
        modal.style.display = 'none';
    }
}

export function openFullscreen(effectOrFile) {
    if (!effectOrFile) {
        return;
    }

    if (typeof effectOrFile === 'object' && effectOrFile !== null) {
        if (effectOrFile.id != null) {
            highlightFromEffectId(effectOrFile.id);
        }

        if (effectOrFile.file) {
            window.open(effectOrFile.file, '_blank');
        }

        return;
    }

    window.open(effectOrFile, '_blank');
}

function handleBackdropClick(event) {
    if (event.target.id === 'modal') {
        closeModal();
    }
}

function handleKeydown(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}

export function initModal() {
    const { modal } = getModalElements();
    if (!modal) return;

    const closeButton = modal.querySelector('[data-action="close-modal"]');
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal();
        });
    }

    modal.addEventListener('click', handleBackdropClick);
    document.addEventListener('keydown', handleKeydown);
}

