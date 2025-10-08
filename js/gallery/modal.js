import { highlightFromEffectId } from './effect-twin.js';
import { effects as allEffects } from './effects-data.js';

const WHEEL_NAVIGATION_THRESHOLD = 140;

const modalState = {
    list: [...allEffects],
    index: -1,
    isOpen: false,
    wheelAccumulator: 0
};

function getModalElements() {
    return {
        modal: document.getElementById('modal'),
        modalPreview: document.getElementById('modalPreview'),
        modalInfo: document.getElementById('modalInfo'),
        progress: document.getElementById('modalProgress'),
        prevButton: document.querySelector('[data-action="modal-prev"]'),
        nextButton: document.querySelector('[data-action="modal-next"]')
    };
}

function normaliseIndex(index, total) {
    if (total <= 0) {
        return -1;
    }

    const remainder = index % total;
    return remainder < 0 ? remainder + total : remainder;
}

function setModalList(effect, context = {}) {
    const providedList = Array.isArray(context.list) && context.list.length ? context.list : allEffects;
    modalState.list = [...providedList];

    if (!modalState.list.length) {
        modalState.list = [effect];
    }

    let initialIndex = typeof context.index === 'number' && context.index >= 0 && context.index < modalState.list.length
        ? context.index
        : modalState.list.findIndex(item => item?.id === effect.id);

    if (initialIndex < 0) {
        initialIndex = 0;
    }

    modalState.index = initialIndex;
}

function renderModalEffect(effect) {
    const { modal, modalPreview, modalInfo } = getModalElements();
    if (!modal || !modalPreview || !modalInfo) {
        return;
    }

    modalState.currentEffect = effect;
    modalState.wheelAccumulator = 0;

    modal.setAttribute('data-active-effect-id', String(effect.id));

    if (effect.hasRealCode && effect.file) {
        modalPreview.className = 'modal-preview';
        modalPreview.innerHTML = `<iframe src="${effect.file}" style="width: 100%; height: 100%; border: none; background: #000;"></iframe>`;
    } else {
        modalPreview.className = `modal-preview ${effect.demoClass ?? ''}`.trim();
        modalPreview.innerHTML = '';
    }

    modalPreview.classList.remove('modal-preview--active');
    modalPreview.style.setProperty('--pointer-x', '50%');
    modalPreview.style.setProperty('--pointer-y', '50%');

    const codeStatus = effect.hasRealCode
        ? '<span class="modal-info__badge modal-info__badge--live">LIVE CODE</span>'
        : '<span class="modal-info__badge modal-info__badge--demo">DEMO PREVIEW</span>';

    const positionLabel = modalState.list.length ? `${modalState.index + 1} / ${modalState.list.length}` : '1 / 1';

    modalInfo.innerHTML = `
        <header class="modal-info__heading">
            <div class="modal-info__position" aria-live="polite">${positionLabel}</div>
            <h2>${effect.title} ${codeStatus}</h2>
        </header>
        <p class="modal-info__description">${effect.description}</p>

        <section class="modal-info__section">
            <h3>Interactive Controls</h3>
            <ul class="modal-info__list">
                ${effect.interactive.map(input => `<li>▸ ${input.toUpperCase()}</li>`).join('')}
            </ul>
        </section>

        <section class="modal-info__section">
            <h3>Technology</h3>
            <div class="modal-info__tags">
                ${effect.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
            </div>
        </section>

        ${effect.hasRealCode ? `
            <section class="modal-info__section">
                <h3>Source File</h3>
                <div class="modal-info__source">${effect.file}</div>
                <button data-action="open-effect-page" class="modal-info__cta">
                    Open in New Tab
                </button>
            </section>
        ` : ''}

        <button class="modal-info__cta modal-info__cta--secondary">
            ${effect.hasRealCode ? 'View Source Code' : 'Implementation Notes'}
        </button>
    `;

    if (effect.hasRealCode) {
        const openButton = modalInfo.querySelector('[data-action="open-effect-page"]');
        if (openButton) {
            openButton.addEventListener('click', (event) => {
                event.preventDefault();
                openFullscreen(effect);
            });
        }
    }

    highlightFromEffectId(effect.id);
}

function updateModalNavigationState() {
    const { prevButton, nextButton, progress } = getModalElements();
    const total = modalState.list.length;
    const index = modalState.index;
    const disableNav = total <= 1;

    [prevButton, nextButton].forEach((button) => {
        if (!button) {
            return;
        }
        button.disabled = disableNav;
        button.setAttribute('aria-disabled', disableNav ? 'true' : 'false');
    });

    if (progress) {
        const bar = progress.querySelector('.modal-progress__bar');
        progress.classList.toggle('modal-progress--hidden', disableNav);
        if (bar) {
            const completion = total === 0 ? 0 : ((index + 1) / total) * 100;
            bar.style.width = `${completion}%`;
            bar.setAttribute('aria-valuemin', '1');
            bar.setAttribute('aria-valuemax', String(total));
            bar.setAttribute('aria-valuenow', String(index + 1));
            bar.setAttribute('data-label', total ? `${index + 1} / ${total}` : '');
        }
    }

    const position = document.querySelector('.modal-info__position');
    if (position) {
        position.textContent = total ? `${index + 1} / ${total}` : '1 / 1';
    }
}

function navigateToIndex(index) {
    const total = modalState.list.length;
    if (!total) {
        return;
    }

    const normalised = normaliseIndex(index, total);
    modalState.index = normalised;
    const effect = modalState.list[normalised];
    if (!effect) {
        return;
    }

    renderModalEffect(effect);
    updateModalNavigationState();
}

function navigateModal(direction) {
    if (!modalState.isOpen) {
        return;
    }
    navigateToIndex(modalState.index + direction);
}

function handleModalWheel(event) {
    if (!modalState.isOpen) {
        return;
    }

    const { modalInfo } = getModalElements();
    const isInfoPanel = modalInfo && event.currentTarget === modalInfo;
    let shouldNavigate = true;

    if (isInfoPanel && modalInfo) {
        const canScroll = modalInfo.scrollHeight > modalInfo.clientHeight;
        if (canScroll) {
            const atTop = modalInfo.scrollTop <= 0;
            const atBottom = modalInfo.scrollTop + modalInfo.clientHeight >= modalInfo.scrollHeight;

            if ((event.deltaY < 0 && !atTop) || (event.deltaY > 0 && !atBottom)) {
                shouldNavigate = false;
            }
        }
    }

    if (!shouldNavigate) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    modalState.wheelAccumulator += event.deltaY;
    if (Math.abs(modalState.wheelAccumulator) >= WHEEL_NAVIGATION_THRESHOLD) {
        const direction = modalState.wheelAccumulator > 0 ? 1 : -1;
        modalState.wheelAccumulator = 0;
        navigateModal(direction);
    }
}

function handleModalMouseMove(event) {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
        return;
    }

    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    target.style.setProperty('--pointer-x', `${x}%`);
    target.style.setProperty('--pointer-y', `${y}%`);
    target.classList.add('modal-preview--active');
}

function handleModalMouseLeave(event) {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) {
        return;
    }

    target.classList.remove('modal-preview--active');
    target.style.setProperty('--pointer-x', '50%');
    target.style.setProperty('--pointer-y', '50%');
}

export function openModal(effect, context = {}) {
    const { modal } = getModalElements();
    if (!modal) {
        return;
    }

    setModalList(effect, context);
    modalState.isOpen = true;
    modalState.wheelAccumulator = 0;

    renderModalEffect(effect);
    updateModalNavigationState();

    modal.style.display = 'block';
}

export function closeModal() {
    const { modal, modalPreview } = getModalElements();
    if (!modal) {
        return;
    }

    modal.style.display = 'none';
    modal.removeAttribute('data-active-effect-id');
    modalState.isOpen = false;
    modalState.wheelAccumulator = 0;

    if (modalPreview) {
        modalPreview.classList.remove('modal-preview--active');
        modalPreview.style.removeProperty('--pointer-x');
        modalPreview.style.removeProperty('--pointer-y');
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
    if (event.target instanceof HTMLElement && event.target.id === 'modal') {
        closeModal();
    }
}

function handleKeydown(event) {
    if (!modalState.isOpen) {
        return;
    }

    if (event.key === 'Escape') {
        event.stopPropagation();
        closeModal();
        return;
    }

    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        event.stopPropagation();
        navigateModal(1);
    } else if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        event.stopPropagation();
        navigateModal(-1);
    } else if (event.key === 'Home') {
        event.preventDefault();
        event.stopPropagation();
        navigateToIndex(0);
    } else if (event.key === 'End') {
        event.preventDefault();
        event.stopPropagation();
        navigateToIndex(modalState.list.length - 1);
    }
}

export function initModal() {
    const { modal, modalPreview, modalInfo, prevButton, nextButton } = getModalElements();
    if (!modal) {
        return;
    }

    const closeButton = modal.querySelector('[data-action="close-modal"]');
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.preventDefault();
            closeModal();
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            navigateModal(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            navigateModal(1);
        });
    }

    if (modalPreview) {
        modalPreview.addEventListener('wheel', handleModalWheel, { passive: false });
        modalPreview.addEventListener('mousemove', handleModalMouseMove);
        modalPreview.addEventListener('mouseleave', handleModalMouseLeave);
    }

    if (modalInfo) {
        modalInfo.addEventListener('wheel', handleModalWheel, { passive: false });
    }

    modal.addEventListener('click', handleBackdropClick);
    document.addEventListener('keydown', handleKeydown);

    updateModalNavigationState();
}

