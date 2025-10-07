// Universal Collapsible Menu System for Visual Codex Demos
// Can be injected into any demo without modifying original code

class UniversalCollapsibleMenu {
    constructor(options = {}) {
        this.options = {
            startCollapsed: true,
            position: 'top-right',
            theme: 'dark',
            mobileOnly: false,
            zIndex: 10000,
            ...options
        };
        
        this.menuVisible = !this.options.startCollapsed;
        this.init();
    }
    
    init() {
        // Check if should show on current device
        if (this.options.mobileOnly && !this.isMobile()) {
            return;
        }
        
        // Create menu toggle button
        this.createToggleButton();
        
        // Find and wrap existing controls/menus
        this.wrapExistingMenus();
        
        // Add styles
        this.injectStyles();
        
        // Set initial state
        if (this.options.startCollapsed) {
            this.collapseMenu();
        }
        
        console.log('🎯 Universal Collapsible Menu initialized');
    }
    
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    createToggleButton() {
        this.toggleButton = document.createElement('div');
        this.toggleButton.className = 'ucm-toggle-button';
        this.toggleButton.innerHTML = `
            <span class="ucm-hamburger">
                <span></span>
                <span></span>
                <span></span>
            </span>
        `;
        
        this.toggleButton.addEventListener('click', () => this.toggleMenu());
        document.body.appendChild(this.toggleButton);
    }
    
    wrapExistingMenus() {
        // Find common control patterns
        const controlSelectors = [
            '.controls',
            '.control-panel',
            '.menu',
            '.sidebar',
            '.parameters',
            '.settings',
            '.control-group',
            '[class*="control"]',
            '[class*="menu"]',
            '[id*="control"]',
            '[id*="menu"]'
        ];
        
        // Create wrapper
        this.menuWrapper = document.createElement('div');
        this.menuWrapper.className = 'ucm-menu-wrapper';
        
        // Find and move controls
        let foundControls = false;
        for (const selector of controlSelectors) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Skip if already wrapped or is our own element
                if (element.closest('.ucm-menu-wrapper') || 
                    element.classList.contains('ucm-toggle-button')) {
                    return;
                }
                
                // Check if it's actually a control panel
                if (this.isControlElement(element)) {
                    this.menuWrapper.appendChild(element);
                    foundControls = true;
                }
            });
        }
        
        if (foundControls) {
            document.body.appendChild(this.menuWrapper);
            console.log('✅ Found and wrapped existing controls');
        } else {
            console.log('⚠️ No controls found to wrap');
        }
    }
    
    isControlElement(element) {
        // Check if element contains form controls
        const hasInputs = element.querySelectorAll('input, select, button, textarea').length > 0;
        const hasText = element.textContent.toLowerCase().match(/control|setting|parameter|option|config/);
        const isVisible = window.getComputedStyle(element).display !== 'none';
        
        return (hasInputs || hasText) && isVisible;
    }
    
    injectStyles() {
        const styles = `
            /* Universal Collapsible Menu Styles */
            .ucm-toggle-button {
                position: fixed;
                ${this.getPositionStyles()}
                width: 56px;
                height: 56px;
                background: rgba(0, 0, 0, 0.8);
                border: 2px solid #00ffff;
                border-radius: 8px;
                cursor: pointer;
                z-index: ${this.options.zIndex + 1};
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }
            
            .ucm-toggle-button:hover {
                background: rgba(0, 255, 255, 0.1);
                transform: scale(1.05);
            }
            
            .ucm-hamburger {
                width: 24px;
                height: 20px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            
            .ucm-hamburger span {
                display: block;
                height: 3px;
                width: 100%;
                background: #00ffff;
                border-radius: 2px;
                transition: all 0.3s ease;
                transform-origin: center;
            }
            
            .ucm-toggle-button.active .ucm-hamburger span:nth-child(1) {
                transform: translateY(8.5px) rotate(45deg);
            }
            
            .ucm-toggle-button.active .ucm-hamburger span:nth-child(2) {
                opacity: 0;
            }
            
            .ucm-toggle-button.active .ucm-hamburger span:nth-child(3) {
                transform: translateY(-8.5px) rotate(-45deg);
            }
            
            .ucm-menu-wrapper {
                position: fixed;
                ${this.getMenuPositionStyles()}
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #00ffff;
                border-radius: 8px;
                padding: 20px;
                z-index: ${this.options.zIndex};
                max-width: 90vw;
                max-height: 80vh;
                overflow-y: auto;
                transition: all 0.3s ease;
                backdrop-filter: blur(15px);
                transform-origin: ${this.getTransformOrigin()};
            }
            
            .ucm-menu-wrapper.collapsed {
                transform: scale(0);
                opacity: 0;
                pointer-events: none;
            }
            
            /* Ensure wrapped controls are visible */
            .ucm-menu-wrapper * {
                display: revert !important;
                visibility: visible !important;
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .ucm-menu-wrapper {
                    width: calc(100vw - 40px);
                    max-width: none;
                    left: 20px !important;
                    right: 20px !important;
                    top: 80px !important;
                }
                
                /* Ensure touch-friendly sizes */
                .ucm-menu-wrapper input[type="range"] {
                    min-height: 44px;
                }
                
                .ucm-menu-wrapper button {
                    min-height: 44px;
                    min-width: 44px;
                    padding: 10px;
                }
            }
            
            /* Backdrop for mobile */
            .ucm-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                z-index: ${this.options.zIndex - 1};
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            
            .ucm-backdrop.visible {
                opacity: 1;
                pointer-events: all;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    getPositionStyles() {
        const positions = {
            'top-right': 'top: 20px; right: 20px;',
            'top-left': 'top: 20px; left: 20px;',
            'bottom-right': 'bottom: 20px; right: 20px;',
            'bottom-left': 'bottom: 20px; left: 20px;'
        };
        return positions[this.options.position] || positions['top-right'];
    }
    
    getMenuPositionStyles() {
        const positions = {
            'top-right': 'top: 90px; right: 20px;',
            'top-left': 'top: 90px; left: 20px;',
            'bottom-right': 'bottom: 90px; right: 20px;',
            'bottom-left': 'bottom: 90px; left: 20px;'
        };
        return positions[this.options.position] || positions['top-right'];
    }
    
    getTransformOrigin() {
        const origins = {
            'top-right': 'top right',
            'top-left': 'top left',
            'bottom-right': 'bottom right',
            'bottom-left': 'bottom left'
        };
        return origins[this.options.position] || 'top right';
    }
    
    toggleMenu() {
        this.menuVisible = !this.menuVisible;
        
        if (this.menuVisible) {
            this.expandMenu();
        } else {
            this.collapseMenu();
        }
        
        // Haptic feedback on mobile
        if (this.isMobile() && navigator.vibrate) {
            navigator.vibrate(10);
        }
    }
    
    expandMenu() {
        if (this.menuWrapper) {
            this.menuWrapper.classList.remove('collapsed');
        }
        this.toggleButton.classList.add('active');
        
        // Add backdrop on mobile
        if (this.isMobile()) {
            this.addBackdrop();
        }
        
        console.log('📂 Menu expanded');
    }
    
    collapseMenu() {
        if (this.menuWrapper) {
            this.menuWrapper.classList.add('collapsed');
        }
        this.toggleButton.classList.remove('active');
        
        // Remove backdrop
        this.removeBackdrop();
        
        console.log('📁 Menu collapsed');
    }
    
    addBackdrop() {
        if (!this.backdrop) {
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'ucm-backdrop';
            this.backdrop.addEventListener('click', () => this.collapseMenu());
            document.body.appendChild(this.backdrop);
        }
        
        setTimeout(() => {
            this.backdrop.classList.add('visible');
        }, 10);
    }
    
    removeBackdrop() {
        if (this.backdrop) {
            this.backdrop.classList.remove('visible');
            setTimeout(() => {
                if (this.backdrop && this.backdrop.parentNode) {
                    this.backdrop.parentNode.removeChild(this.backdrop);
                    this.backdrop = null;
                }
            }, 300);
        }
    }
    
    // Method to manually add elements to menu
    addToMenu(element) {
        if (this.menuWrapper && element) {
            this.menuWrapper.appendChild(element);
        }
    }
}

// Auto-initialize on load if specified
if (typeof AUTO_INIT_COLLAPSIBLE_MENU !== 'undefined' && AUTO_INIT_COLLAPSIBLE_MENU) {
    window.addEventListener('DOMContentLoaded', () => {
        window.universalMenu = new UniversalCollapsibleMenu(window.MENU_OPTIONS || {});
    });
}

// Export for manual use
window.UniversalCollapsibleMenu = UniversalCollapsibleMenu;