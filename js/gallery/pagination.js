export class PaginationController {
    constructor({ itemsPerPage = 5, onChange = null } = {}) {
        this.itemsPerPage = itemsPerPage;
        this.onChange = onChange;
        this.currentPage = 0;
        this.totalItems = 0;
        this.totalPages = 1;
        this.controlsElement = null;
    }

    attach(element) {
        this.controlsElement = element;
        this.updateControls();
    }

    setOnChange(handler) {
        this.onChange = handler;
    }

    setTotal(totalItems) {
        this.totalItems = Math.max(0, totalItems);
        this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.itemsPerPage));
        if (this.currentPage >= this.totalPages) {
            this.currentPage = this.totalPages - 1;
        }
        this.updateControls();
    }

    getVisibleRange() {
        const start = this.currentPage * this.itemsPerPage;
        const end = Math.min(start + this.itemsPerPage, this.totalItems);
        return { start, end };
    }

    goTo(page) {
        const clamped = Math.min(Math.max(page, 0), this.totalPages - 1);
        if (clamped === this.currentPage) {
            return false;
        }

        this.currentPage = clamped;
        this.updateControls();
        if (typeof this.onChange === 'function') {
            this.onChange({ source: 'pagination', page: this.currentPage });
        }
        return true;
    }

    goToIndex(index) {
        if (index < 0 || index >= this.totalItems) {
            return false;
        }
        const page = Math.floor(index / this.itemsPerPage);
        return this.goTo(page);
    }

    next() {
        return this.goTo(this.currentPage + 1);
    }

    previous() {
        return this.goTo(this.currentPage - 1);
    }

    reset() {
        this.currentPage = 0;
        this.updateControls();
    }

    containsIndex(index) {
        if (index < 0 || index >= this.totalItems) {
            return false;
        }
        const { start, end } = this.getVisibleRange();
        return index >= start && index < end;
    }

    updateControls() {
        if (!this.controlsElement) {
            return;
        }

        if (this.totalItems <= this.itemsPerPage) {
            this.controlsElement.innerHTML = '';
            this.controlsElement.style.display = 'none';
            return;
        }

        this.controlsElement.style.display = 'flex';
        this.controlsElement.innerHTML = '';

        const prevButton = this.createButton('⟵ Previous', 'prev');
        const nextButton = this.createButton('Next ⟶', 'next');
        const indicator = this.createIndicator();
        const progress = this.createProgress();

        this.controlsElement.append(prevButton, indicator, nextButton, progress);
    }

    createButton(label, direction) {
        const button = document.createElement('button');
        button.className = 'pagination__button';
        button.type = 'button';
        button.textContent = label;
        button.dataset.direction = direction;
        button.disabled = direction === 'prev' ? this.currentPage === 0 : this.currentPage >= this.totalPages - 1;
        button.addEventListener('click', () => {
            if (direction === 'prev') {
                this.previous();
            } else {
                this.next();
            }
        });
        return button;
    }

    createIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'pagination__indicator';
        indicator.innerHTML = `Page <span>${this.currentPage + 1}</span> <span class="pagination__indicator-divider">/</span> <span>${this.totalPages}</span>`;
        return indicator;
    }

    createProgress() {
        const progress = document.createElement('div');
        progress.className = 'pagination__progress';

        const bar = document.createElement('div');
        bar.className = 'pagination__progress-bar';
        const completion = this.totalItems === 0 ? 0 : ((this.currentPage + 1) / this.totalPages) * 100;
        bar.style.width = `${completion}%`;

        progress.appendChild(bar);
        return progress;
    }
}
