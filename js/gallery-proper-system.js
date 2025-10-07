export async function initGallery({
    containerSelector,
    manifestPath,
    variant = 'primary'
} = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.warn('⚠️ Codex container not found');
        return;
    }

    const searchInput = document.querySelector('[data-role="search"]');
    const categorySelect = document.querySelector('[data-role="category"]');
    const typeButtons = Array.from(document.querySelectorAll('[data-role="type"]'));
    const viewButtons = Array.from(document.querySelectorAll('[data-role="view"]'));
    const lensToggle = document.querySelector('[data-role="lens-toggle"]');
    const shuffleButton = document.querySelector('[data-role="shuffle"]');
    const detailPanel = document.getElementById('detail-panel');
    const detailCard = detailPanel?.querySelector('.detail-card');

    document.body.dataset.variant = variant;
    document.body.dataset.lens = variant === 'twin' ? 'outcome' : 'summary';

    if (variant === 'twin' && container instanceof HTMLElement) {
        container.dataset.view = 'list';
    }

    let manifest;
    try {
        const response = await fetch(manifestPath);
        manifest = await response.json();
    } catch (error) {
        console.error('Unable to load manifest', error);
        container.innerHTML = `<div class="empty-state">Unable to load Visual Codex manifest.</div>`;
        return;
    }

    const entries = manifest.map((entry, index) => ({
        ...entry,
        index,
        typeLabel: labelForType(entry.type)
    }));

    const categories = Array.from(new Set(entries.map(entry => entry.category))).sort();
    populateCategorySelect(categorySelect, categories);

    const state = {
        search: '',
        category: 'all',
        type: 'all',
        lens: document.body.dataset.lens,
        view: container.dataset.view || 'grid',
        sortSeed: variant === 'twin' ? Math.random() : 0
    };

    function updateControls() {
        if (!container) return;
        container.dataset.view = state.view;
        document.body.dataset.lens = state.lens;
        typeButtons.forEach(button => {
            const isActive = (button.dataset.type || 'all') === state.type;
            button.setAttribute('aria-pressed', String(isActive));
        });
        viewButtons.forEach(button => {
            const isActive = (button.dataset.view || 'grid') === state.view;
            button.setAttribute('aria-pressed', String(isActive));
        });
        if (lensToggle) {
            const active = state.lens === 'outcome';
            lensToggle.setAttribute('aria-pressed', String(active));
            lensToggle.textContent = active ? 'Show Summaries' : 'Outcome Lens';
        }
    }

    function applyFilters() {
        const searchValue = state.search.trim().toLowerCase();
        const filtered = entries.filter(entry => {
            const matchesSearch = !searchValue ||
                entry.title.toLowerCase().includes(searchValue) ||
                entry.summary.toLowerCase().includes(searchValue) ||
                entry.outcome.toLowerCase().includes(searchValue) ||
                entry.keywords.some(keyword => keyword.toLowerCase().includes(searchValue));

            const matchesCategory = state.category === 'all' || entry.category === state.category;
            const matchesType = state.type === 'all' || entry.type === state.type;
            return matchesSearch && matchesCategory && matchesType;
        });

        if (variant === 'twin' && state.sortSeed) {
            const seeded = [...filtered];
            shuffleWithSeed(seeded, state.sortSeed);
            return seeded;
        }

        return filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    function render() {
        const filteredEntries = applyFilters();
        container.innerHTML = '';

        if (!filteredEntries.length) {
            container.innerHTML = `<div class="empty-state">No codex sequences matched your filters. Adjust the lens or filters to continue exploring.</div>`;
            return;
        }

        const fragment = document.createDocumentFragment();
        filteredEntries.forEach(entry => {
            fragment.appendChild(createCard(entry));
        });

        container.appendChild(fragment);
    }

    function createCard(entry) {
        const article = document.createElement('article');
        article.className = 'codex-card';
        article.dataset.type = entry.type;
        article.dataset.category = entry.category;
        article.style.setProperty('--accent', entry.accent || 'var(--accent-default)');

        const header = document.createElement('div');
        header.className = 'card-header';
        header.innerHTML = `<span>${entry.typeLabel}</span><span>${entry.category}</span>`;

        const title = document.createElement('h3');
        title.textContent = entry.title;

        const summary = document.createElement('p');
        summary.className = 'card-summary';
        summary.textContent = entry.summary;

        const outcome = document.createElement('p');
        outcome.className = 'card-outcome';
        outcome.textContent = entry.outcome;

        const keywords = document.createElement('div');
        keywords.className = 'keywords';
        entry.keywords.forEach(keyword => {
            const chip = document.createElement('span');
            chip.textContent = keyword;
            keywords.appendChild(chip);
        });

        const actions = document.createElement('div');
        actions.className = 'card-actions';

        const launch = document.createElement('a');
        launch.href = entry.path;
        launch.target = '_blank';
        launch.rel = 'noopener';
        launch.textContent = 'Launch';

        const details = document.createElement('button');
        details.type = 'button';
        details.dataset.action = 'details';
        details.textContent = 'Details';
        details.addEventListener('click', () => openDetail(entry));

        actions.append(launch, details);

        article.append(header, title, summary, outcome, keywords, actions);
        return article;
    }

    function openDetail(entry) {
        if (!detailPanel || !detailCard) return;
        detailPanel.hidden = false;
        detailPanel.setAttribute('aria-hidden', 'false');
        detailCard.innerHTML = '';

        const closeButton = document.createElement('button');
        closeButton.className = 'detail-close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Close details');
        closeButton.textContent = '×';
        closeButton.addEventListener('click', closeDetail);

        const heading = document.createElement('h2');
        heading.textContent = entry.title;

        const meta = document.createElement('div');
        meta.className = 'detail-meta';
        meta.innerHTML = `<span>${entry.typeLabel}</span><span>${entry.category}</span>`;

        const summary = document.createElement('p');
        summary.textContent = entry.summary;

        const outcome = document.createElement('p');
        outcome.textContent = entry.outcome;

        const keywords = document.createElement('div');
        keywords.className = 'keywords';
        entry.keywords.forEach(keyword => {
            const chip = document.createElement('span');
            chip.textContent = keyword;
            keywords.appendChild(chip);
        });

        const launch = document.createElement('a');
        launch.href = entry.path;
        launch.target = '_blank';
        launch.rel = 'noopener';
        launch.className = 'control-button secondary';
        launch.style.display = 'inline-flex';
        launch.style.marginTop = '12px';
        launch.textContent = 'Open Experience';

        detailCard.style.setProperty('--accent', entry.accent || 'var(--accent-default)');
        detailCard.append(closeButton, heading, meta, summary, outcome, keywords, launch);

        requestAnimationFrame(() => {
            detailPanel.focus({ preventScroll: true });
        });
    }

    function closeDetail() {
        if (!detailPanel) return;
        detailPanel.hidden = true;
        detailPanel.setAttribute('aria-hidden', 'true');
    }

    detailPanel?.addEventListener('click', event => {
        if (event.target === detailPanel) {
            closeDetail();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeDetail();
        }
    });

    searchInput?.addEventListener('input', event => {
        state.search = event.target.value;
        render();
    });

    categorySelect?.addEventListener('change', event => {
        state.category = event.target.value;
        render();
    });

    typeButtons.forEach(button => {
        button.addEventListener('click', () => {
            state.type = button.dataset.type || 'all';
            updateControls();
            render();
        });
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            state.view = button.dataset.view || 'grid';
            updateControls();
            render();
        });
    });

    lensToggle?.addEventListener('click', () => {
        state.lens = state.lens === 'summary' ? 'outcome' : 'summary';
        updateControls();
    });

    shuffleButton?.addEventListener('click', () => {
        state.sortSeed = Math.random();
        render();
    });

    updateControls();
    render();
}

function populateCategorySelect(select, categories) {
    if (!select) return;
    const fragment = document.createDocumentFragment();
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    fragment.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        fragment.appendChild(option);
    });

    select.appendChild(fragment);
}

function labelForType(type) {
    switch (type) {
        case 'gallery':
            return 'Gallery System';
        case 'demo':
            return 'Interactive Demo';
        case 'effect':
            return 'Effect Engine';
        default:
            return 'Experience';
    }
}

function shuffleWithSeed(array, seed) {
    const rng = mulberry32(Math.floor(seed * 1_000_000));
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(rng() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function mulberry32(seed) {
    return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
