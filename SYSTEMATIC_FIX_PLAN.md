# SYSTEMATIC FIX PLAN - Visual Codex Gallery Issues

## 🚨 CRITICAL ISSUES IDENTIFIED

### 1. **Main Gallery Lost Tactile Scroll Snap** ❌
- **Problem**: Removed the elegant scroll snap behavior where sections stay centered
- **Fix Required**: Restore scroll momentum physics with threshold triggering
- **Implementation**: Each section needs invisible scroll time + elegant transition animations

### 2. **Hover State Broken in Main Gallery** ❌
- **Problem**: All cards stay translucent when cursor leaves - should return to normal visibility
- **Fix Required**: Proper hover state management with normal→hover→normal transitions
- **Implementation**: Cards should be fully visible by default, enhanced on hover

### 3. **Card Expansion Not Working** ❌ 
- **Problem**: Cards not getting bigger on hover and not displaying their effects properly
- **Fix Required**: Larger hover scaling + actual effect preview activation
- **Implementation**: Scale to 1.3x + show live effect preview in card

### 4. **Active Holographic Demo Broken** ❌
- **Problem**: Click-to-expand not working, may need complete rebuild
- **Fix Required**: Rebuild click-to-expand with infinite scroll + mouse reactivity
- **Implementation**: Proper modal system with enhanced visualizer

### 5. **Parallax Demo Broken** ❌
- **Problem**: Click-to-expand not working properly  
- **Fix Required**: Same rebuild as active holographic
- **Implementation**: Modal system with infinite scroll

### 6. **Demo Content Reduced Incorrectly** ❌
- **Problem**: Reduced from 35 to 10 holographic demos - user wants ALL back
- **Fix Required**: Show all demos but in groups of 5-10 with substates
- **Implementation**: Pagination system like main gallery with substate navigation

### 7. **MVEP Scroll Physics Wrong** ❌
- **Problem**: Actual scrolling instead of parameter-only effects
- **Fix Required**: Scroll affects grid density/color but doesn't actually scroll page
- **Implementation**: Capture scroll events, prevent default, map to parameters only

## 🎯 SYSTEMATIC DEVELOPMENT PLAN

### PHASE 1: RESTORE MAIN GALLERY TACTILE SCROLL
**Priority: CRITICAL**

1. **Restore Original Scroll Physics**
   - Bring back momentum physics with threshold triggering
   - Each section gets "scroll time" where elements stay centered
   - Invisible scroll until threshold hit
   - Elegant transition animations between sections

2. **Fix Hover State Management**
   - Default state: All cards fully visible (opacity: 1.0)
   - Hover state: Target card enhanced, others slightly dimmed (opacity: 0.7)
   - Leave state: All cards return to fully visible
   - No persistent translucency

3. **Enhanced Card Expansion**
   - Hover scaling: 1.0 → 1.3x (larger than current)
   - Live effect preview activation in hover state
   - Preview iframe auto-plays effect on hover
   - Smooth transitions with proper z-index management

### PHASE 2: REBUILD DEMO CLICK-TO-EXPAND SYSTEMS
**Priority: HIGH**

4. **Active Holographic Systems**
   - Keep all original demos (restore from 10 back to full set)
   - Group display: Show 5-10 at a time with navigation
   - Click-to-expand: Full-screen modal with infinite scroll
   - Enhanced visualizer: Mouse reactivity + scroll effects
   - Substate navigation: Similar to main gallery pagination

5. **Parallax Systems** 
   - Restore all 35 original demos
   - Group display: 5-10 visible with navigation substates
   - Scrolling parallax effects: Layers move at different speeds
   - Subtle mouse reactivity: Parallax displacement
   - Click-to-expand: Modal with infinite scroll + enhanced interactivity

### PHASE 3: FIX PARAMETER-ONLY SCROLL SYSTEMS
**Priority: MEDIUM**

6. **MVEP Moire Hypercube**
   - Prevent actual page scrolling (preventDefault on scroll events)
   - Capture scroll wheel/touch events
   - Map scroll input directly to grid density (5.0-25.0)
   - Map scroll input to color shift (-1.0 to 1.0)
   - Visual feedback: Parameter indicators update
   - No actual page movement

7. **Enhanced VIB34D System**
   - Same parameter-only scroll system
   - Additional parameters: Moire effects, glassmorphic panels
   - New grid types: Hexagonal, triangular, organic
   - All controlled by scroll input without page movement

## 🛠️ TECHNICAL IMPLEMENTATION DETAILS

### Tactile Scroll Physics Restoration
```javascript
class TactileScrollManager {
    constructor() {
        this.scrollMomentum = 0;
        this.currentSection = 0;
        this.isTransitioning = false;
        this.scrollThreshold = 25;
        this.invisibleScrollTime = 2000; // 2 seconds per section
    }
    
    handleScroll(delta) {
        if (this.isTransitioning) return;
        
        this.scrollMomentum += Math.abs(delta);
        
        if (this.scrollMomentum >= this.scrollThreshold) {
            this.triggerSectionTransition(delta > 0 ? 1 : -1);
            this.scrollMomentum = 0;
        }
        
        // Decay momentum over time
        setTimeout(() => this.decayMomentum(), 50);
    }
}
```

### Hover State Management Fix
```css
/* Default: All cards visible */
.crystal-wafer {
    opacity: 1.0;
    transform: scale(1.0);
    transition: all 0.4s ease;
}

/* Hover: Target enhanced, others dimmed */
.crystal-container:hover .crystal-wafer:not(:hover) {
    opacity: 0.7;
    transform: scale(0.95);
}

.crystal-wafer:hover {
    opacity: 1.0;
    transform: scale(1.3) translateZ(40px);
    z-index: 1000;
}
```

### Demo Pagination System
```javascript
class DemoPagination {
    constructor(totalItems, itemsPerPage = 5) {
        this.totalItems = totalItems;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 0;
        this.totalPages = Math.ceil(totalItems / itemsPerPage);
    }
    
    getVisibleItems() {
        const start = this.currentPage * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return { start, end };
    }
    
    navigateToPage(page) {
        if (page >= 0 && page < this.totalPages) {
            this.performPageTransition(this.currentPage, page);
            this.currentPage = page;
        }
    }
}
```

### Parameter-Only Scroll System
```javascript
class ParameterScrollController {
    constructor(element) {
        this.element = element;
        this.preventActualScroll();
        this.setupScrollCapture();
    }
    
    preventActualScroll() {
        this.element.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.handleScrollInput(e.deltaY);
        }, { passive: false });
    }
    
    handleScrollInput(delta) {
        // Map scroll to parameters without moving page
        const scrollAmount = delta * 0.01;
        this.updateParameters(scrollAmount);
    }
}
```

## 📋 IMPLEMENTATION CHECKLIST

### PHASE 1 - Main Gallery Restoration
- [x] Restore tactile scroll physics class ✅ (Working with momentum threshold 25)
- [x] Fix hover state CSS (.crystal-container:hover logic) ✅ (Opacity 0.7 for non-hovered cards)
- [x] Enhance card scaling (1.0 → 1.3x) ✅ (Now scaling to 1.4x on hover)
- [x] Add live preview activation on hover ✅ (Auto-loading iframes with staggered entrance)
- [x] Test section transitions with momentum ✅ (Transitions working with crystal breaking/reforming)

### PHASE 2 - Demo Systems Rebuild
- [x] Restore all 35 holographic demos ✅ (Parallax mega demo now paginates through the full catalog with 10-up groupings)
- [x] Implement 5-item pagination system ✅ (Main gallery renders 5 cards per page with keyboard + progress controls)
- [x] Build click-to-expand modal system ✅ (Modal rebuilt with navigation overlay, contextual info, and storage-aware highlighting)
- [x] Add infinite scroll to expanded views ✅ (Wheel/keyboard navigation loops through effects without closing the modal)
- [x] Implement mouse reactivity in expanded views ✅ (Fullscreen preview responds to pointer position via neon spotlight shader)
- [x] Add scrolling parallax effects to parallax demos ✅ (Page wheel input advances paginated sets while preserving layer motion)

### PHASE 3 - Parameter-Only Scroll
- [x] Implement scroll event prevention ✅ (preventDefault on wheel events)
- [x] Map scroll input to MVEP parameters ✅ (Grid density 5-25, Color shift -1 to 1)
- [x] Add visual parameter feedback ✅ (Real-time slider and indicator updates)
- [x] Test smooth parameter transitions ✅ (Smooth parameter accumulation with clamping)
- [x] Ensure no actual page movement ✅ (Page stays fixed, only parameters change)

### PHASE 4 - Automated Regression Safety Nets
- [x] Establish Node-based test runner ✅ (`npm test` now executes `node --test tests`)
- [x] Add pagination controller unit coverage ✅ (`tests/pagination.test.mjs` validates empty/small sets and navigation bounds)
- [x] Validate pagination controls DOM rendering ✅ (`tests/pagination-dom.test.mjs` exercises button states, indicator math, and progress width)
- [ ] Capture modal navigation loop regressions ⏳ (Author Playwright coverage for wheel + keyboard interactions)
- [ ] Add parallax pagination smoke checks on mobile ⏳ (Simulate 35-card cycling with viewport overrides)
- [ ] Document QA playbook for gallery modules ⏳ (Map scenarios to automated/manual coverage)

## 🗒️ WORK SESSION LOG

### Session 4A — DOM Pagination Regression Guards
- **Date**: 2024-05-11
- **Focus**: Stabilize the pagination controls markup so button wiring, progress math, and indicator text don't regress as new filters land.
- **Actions**:
  - Introduced `jsdom` harnessing under `npm test` to emulate the gallery shell without a browser runtime.
  - Authored `tests/pagination-dom.test.mjs` to assert hide/show behavior, button enablement, indicator text, and progress bar width through real click events.
- **Plan Impact**: Phase 4 now tracks DOM rendering coverage as complete, freeing the next work session to concentrate on modal loop automation.


## 🎨 DESIGN PRINCIPLES TO MAINTAIN

1. **Nothing Lost**: All original demos and functionality preserved
2. **Enhanced Not Simplified**: Every change adds capability
3. **Smooth Transitions**: No jagged flips or sudden changes
4. **Tactile Feel**: Physical-like scroll behavior with momentum
5. **Visual Clarity**: Clear states for normal, hover, and expanded views
6. **Performance**: Smart canvas loading/unloading during transitions

## 🚀 SUCCESS CRITERIA

- [x] Main gallery scroll feels like original tactile physics
- [x] Cards are fully visible by default, enhanced on hover
- [x] All demos accessible through pagination (nothing lost)
- [x] Click-to-expand works with infinite scroll + mouse reactivity
- [x] Parameter-only scroll systems work without page movement
- [x] Smooth animations throughout with no jarring transitions
- [x] Performance maintained with smart canvas management

This plan ensures we fix everything systematically while preserving and enhancing all existing functionality.