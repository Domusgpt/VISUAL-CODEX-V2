// Helper script to inject collapsible menu into any demo
// Usage: Add this script tag to any demo HTML

(function() {
    // Configuration - can be overridden by setting window.COLLAPSIBLE_MENU_CONFIG before this script loads
    const config = window.COLLAPSIBLE_MENU_CONFIG || {
        startCollapsed: true,
        position: 'top-right',
        theme: 'dark',
        mobileOnly: false
    };
    
    // Load the universal collapsible menu system
    function loadCollapsibleMenu() {
        // Check if already loaded
        if (window.UniversalCollapsibleMenu) {
            initializeMenu();
            return;
        }
        
        // Load the script
        const script = document.createElement('script');
        script.src = '../js/universal-collapsible-menu.js';
        script.onload = initializeMenu;
        script.onerror = () => {
            console.error('Failed to load universal collapsible menu system');
            // Try alternative path
            script.src = './js/universal-collapsible-menu.js';
            document.head.appendChild(script);
        };
        document.head.appendChild(script);
    }
    
    // Initialize the menu
    function initializeMenu() {
        if (window.UniversalCollapsibleMenu) {
            window.collapsibleMenu = new UniversalCollapsibleMenu(config);
            console.log('✅ Collapsible menu injected successfully');
            
            // Special handling for specific demos
            handleDemoSpecificMenus();
        }
    }
    
    // Handle demo-specific menu configurations
    function handleDemoSpecificMenus() {
        const pathname = window.location.pathname;
        
        // Working 4D HyperAV - Has 4 separate menus
        if (pathname.includes('working-4d-hyperav')) {
            handleMultipleMenus();
        }
        
        // Active Holograms - Needs special tab handling
        if (pathname.includes('active-holographic-systems')) {
            handleActiveHologramsMenu();
        }
        
        // VIB34D demos often have complex control structures
        if (pathname.includes('vib34d')) {
            handleVIB34DMenus();
        }
    }
    
    // Handle demos with multiple menus
    function handleMultipleMenus() {
        // Find all control panels
        const menus = document.querySelectorAll('.controls'); // Target elements with class 'controls'
        if (menus.length > 1) {
            console.log(`📊 Found ${menus.length} menus to collapse`);
            
            // Create a tab system for multiple menus
            const tabContainer = document.createElement('div');
            tabContainer.className = 'ucm-tab-container';
            
            const tabButtons = document.createElement('div');
            tabButtons.className = 'ucm-tabs';
            
            const tabContent = document.createElement('div');
            tabContent.className = 'ucm-tab-content';

            menus.forEach((menu, index) => {
                // Get title from h3 or h4 within the menu, or use a default
                const titleElement = menu.querySelector('h3, h4');
                const title = titleElement ? titleElement.textContent : `Menu ${index + 1}`;
                
                const tabButton = document.createElement('button');
                tabButton.className = 'ucm-tab';
                tabButton.dataset.tab = index;
                tabButton.textContent = title;
                
                tabButton.addEventListener('click', () => {
                    // Update active tab button
                    tabButtons.querySelectorAll('.ucm-tab').forEach(t => t.classList.remove('active'));
                    tabButton.classList.add('active');
                    
                    // Show corresponding menu and hide others
                    menus.forEach((m, i) => {
                        m.style.display = (i === index) ? 'block' : 'none';
                    });

                    // Sync values after showing the menu
                    if (window.collapsibleMenu) {
                        window.collapsibleMenu.syncWithOriginalControls();
                    }
                });
                
                tabButtons.appendChild(tabButton);
                tabContent.appendChild(menu); // Move the original menu element
            });
            
            tabContainer.appendChild(tabButtons);
            tabContainer.appendChild(tabContent);
            
            // Add to collapsible menu
            window.collapsibleMenu.addToMenu(tabContainer);
            
            // Show first tab by default
            tabButtons.querySelector('.ucm-tab')?.click();
        }
    }
    
    // Special handling for Active Holograms
    function handleActiveHologramsMenu() {
        console.log('🎯 Configuring Active Holograms menu system');
        // This will be implemented when we rebuild the Active Holograms demo
    }
    
    // Handle VIB34D specific menus
    function handleVIB34DMenus() {
        // Ensure value syncing for complex controls
        setTimeout(() => {
            window.collapsibleMenu?.syncWithOriginalControls();
        }, 1000);
    }
    
    // Add custom styles for multi-menu tabs
    function addTabStyles() {
        const styles = `
            .ucm-tab-container {
                width: 100%;
            }
            
            .ucm-tabs {
                display: flex;
                gap: 5px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }
            
            .ucm-tab {
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid #00ffff;
                color: #00ffff;
                padding: 8px 16px;
                cursor: pointer;
                border-radius: 4px;
                transition: all 0.3s ease;
                font-size: 14px;
                min-height: 44px;
            }
            
            .ucm-tab:hover {
                background: rgba(0, 255, 255, 0.2);
            }
            
            .ucm-tab.active {
                background: rgba(0, 255, 255, 0.3);
                border-width: 2px;
            }
            
            .ucm-tab-content {
                padding: 10px;
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 4px;
                background: rgba(0, 0, 0, 0.5);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadCollapsibleMenu();
            addTabStyles();
        });
    } else {
        loadCollapsibleMenu();
        addTabStyles();
    }
})();