# Visual Codex Demo Fixes Requirements

## Critical Demo Fixes Needed

### 1. Active Holograms (`demos/active-holographic-systems-mega-demo.html`)
- **Issue**: Loads 125 visualizers at once
- **Fix**: Rebuild with tabs showing only 3 canvases at a time, cycling through 30 different versions
- **Priority**: HIGH

### 2. VIB34D Complete (`effects/vib34d-complete-system.html`)
- **Issue**: Menu always visible
- **Fix**: Make menu collapsible, start collapsed
- **Priority**: HIGH

### 3. Working 4D HyperAV (`effects/working-4d-hyperav.html`)
- **Issue**: All 4 menus always visible
- **Fix**: Make all 4 menus collapsible, start collapsed
- **Priority**: HIGH

### 4. MVEP 4D Hypercube (`effects/mvep-moire-hypercube.html`)
- **Issue**: No touch reactions, menu always visible
- **Fix**: Add touch event handlers for mobile, make menu collapsible
- **Priority**: HIGH

### 5. Hypercube Codex (`demos/moire-hypercube-codex-demo.html`)
- **Issue**: Menu always visible, no export function
- **Fix**: Make menu collapsible, add export functionality
- **Priority**: MEDIUM

### 6. Lattice Visualizer (`demos/hypercube-lattice-visualizer-demo.html`)
- **Issue**: Missing export function
- **Fix**: Add export functionality for visualizations
- **Priority**: MEDIUM

### 7. Hyperdimensional Matrix (`effects/insane-hyperdimensional-matrix.html`)
- **Issue**: Menu always visible
- **Fix**: Make menu collapsible, start collapsed
- **Priority**: MEDIUM

### 8. Card Bending (`effects/vib34d-advanced-card-bending-system.html`)
- **Issue**: Menu always visible, poor mobile layout
- **Fix**: Make menu collapsible, improve mobile scrolling card placement
- **Priority**: HIGH

### 9. Color Shift (`effects/enhanced-color-shift-contrast-system.html`)
- **Issue**: Not working at all, menu issues
- **Fix**: Debug and fix functionality, make menu collapsible if present
- **Priority**: HIGH

### 10. Narrative Choreography (`effects/narrative-choreography-engine.html`)
- **Issue**: All points overlayed simultaneously, menu always visible
- **Fix**: Fix point rendering sequence, make menu collapsible
- **Priority**: HIGH

### 11. Tabbed Visualizer (`effects/tabbed-visualizer-system.html`)
- **Issue**: Left 3 tabs always show as "particle"
- **Fix**: Fix tab content initialization and labeling
- **Priority**: MEDIUM

### 12. WebGL Framework (`effects/hypercube-core-webgl-framework.html`)
- **Issue**: Perfect but needs menu collapse
- **Fix**: Make menu collapsible, start collapsed
- **Priority**: LOW

## Implementation Strategy

### Phase 1: Create Reusable Collapsible Menu System
1. Build universal collapsible menu component
2. Add touch-friendly collapse/expand controls
3. Ensure mobile-optimized sizing (44px touch targets)
4. Start all menus in collapsed state

### Phase 2: Fix Critical Functionality Issues
1. Active Holograms - Implement 3-canvas tab system
2. Color Shift - Debug and repair core functionality
3. Narrative Choreography - Fix point overlay issue
4. Tabbed Visualizer - Fix tab content initialization

### Phase 3: Add Missing Features
1. Export functionality for Hypercube Codex
2. Export functionality for Lattice Visualizer
3. Touch reactions for MVEP 4D Hypercube

### Phase 4: Mobile Layout Optimizations
1. Card Bending - Smart scrolling card placement
2. All demos - Responsive layout adjustments
3. Touch gesture enhancements

## Key Principles
- NO reduction of existing functionality
- NO removal of any systems
- ADD collapsible menus without breaking existing features
- ENHANCE mobile experience while preserving desktop
- MAINTAIN all visual effects and interactions