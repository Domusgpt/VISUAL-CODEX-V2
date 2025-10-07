# VIB3CODE - Reactive HyperAV Core Codex Entry

This entry documents the "VIB3CODE - Reactive HyperAV Core" found in `vib3code-reactive-core - Copy.html`. This is a sophisticated WebGL-based system that provides a full-screen, reactive visual experience, dynamically morphing between various geometric forms (hypercube, tetrahedron, sphere, torus, Klein bottle, fractal, wave, crystal) based on user interaction and scroll position. It integrates a "magazine content layer" where each section triggers a different visual theme.

## Visual Elements and Effects

*   **Reactive Visualization:** The core strength is its real-time responsiveness to user input (mouse, click/hold, scroll, inactivity).
*   **Multi-Geometry Holographic Effects:** A single WebGL shader renders 8 distinct geometric forms, each representing a different "theme" or concept. This demonstrates highly versatile visual output from a single rendering pipeline.
*   **Smooth Transitions:** Parameters smoothly interpolate when switching between themes, creating fluid visual transitions.
*   **Dynamic Particle Systems (Lattices):** The various geometric lattices behave like dynamic particle systems, responding to interaction intensity.
*   **Interactive UI Feedback:** On-screen indicators provide real-time feedback on the current theme, interaction type, and visual parameters.
*   **Section-Based Theming:** Scrolling through content sections automatically changes the underlying visual theme, linking content to visual experience.

## Code Snippets and Explanation

### 1. HTML Structure

The HTML sets up the main canvas, a "hold indicator" for click/hold interactions, the scrollable content sections, interaction feedback display, and section navigation dots.

```html
<body>
    <!-- Reactive HyperAV Canvas -->
    <canvas id="reactive-canvas"></canvas>

    <!-- Hold Interaction Indicator -->
    <div class="hold-indicator" id="holdIndicator"></div>

    <!-- Magazine Content -->
    <div class="magazine-layer">
        <section class="section" data-theme="hypercube" data-section="home">...</section>
        <section class="section" data-theme="tetrahedron" data-section="hyperav">...</section>
        <!-- ... other sections ... -->
    </div>

    <!-- Interaction Feedback -->
    <div class="interaction-indicator">
        <div class="indicator-row"><span class="indicator-label">Theme:</span><span class="indicator-value" id="currentTheme"></span></div>
        <!-- ... other indicators ... -->
    </div>

    <!-- Section Navigation -->
    <div class="section-nav">
        <div class="nav-dot active" data-section="home" title="Home - Hypercube"></div>
        <!-- ... other nav dots ... -->
    </div>
</body>
```

**Explanation:**
*   `reactive-canvas`: The full-screen WebGL rendering target.
*   `hold-indicator`: A visual cue for the click/hold interaction.
*   `magazine-layer`: Contains `section` elements, each with `data-theme` and `data-section` attributes that drive the visual changes.
*   `interaction-indicator`: Displays real-time status of the visualizer.
*   `section-nav`: Provides clickable navigation dots that scroll to specific sections and update the theme.

### 2. CSS Styling

The CSS defines the layout, visual appearance, and basic animations. Crucially, it includes styles for the `magazine-layer` to create the content overlay and `section` elements for scroll-based theming.

```css
body {
    background: #000;
    color: #fff;
    font-family: 'Orbitron', 'Courier New', monospace;
    overflow-x: hidden;
    cursor: crosshair;
}

#reactive-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition: filter 0.3s ease;
}

.magazine-layer {
    position: relative;
    z-index: 10;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(0.5px);
}

.section {
    min-height: 100vh;
    padding: 80px 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.5s ease;
}

/* ... (styles for section-content, indicators, nav-dots, etc.) ... */
```

**Customization:**
*   **Fonts & Colors:** Adjust `font-family`, `color`, and background properties.
*   **Layout:** Modify `padding`, `margin`, `min-height` of sections to fit content.
*   **Theme-specific Borders:** The `section[data-theme="..."] .section-content` rules provide visual cues for the current theme.

### 3. JavaScript (Reactive HyperAV Core)

The `ReactiveHyperAVCore` class is the brain of the system.

#### Key Components:

*   **`themeConfigs` Object:** This is a central configuration for each visual theme. It defines `baseColor`, `gridDensity`, `morphFactor`, `dimension`, `glitchIntensity`, `rotationSpeed`, and `geometry` type for each theme. This is highly reusable for defining different visual states.

    ```javascript
    this.themeConfigs = {
        hypercube: {
            baseColor: [1.0, 0.0, 1.0], // Magenta
            gridDensity: 12.0,
            morphFactor: 0.5,
            dimension: 3.5,
            glitchIntensity: 0.3,
            rotationSpeed: 0.5,
            geometry: 'hypercube'
        },
        tetrahedron: {
            baseColor: [0.0, 1.0, 1.0], // Cyan
            gridDensity: 8.0,
            morphFactor: 0.7,
            dimension: 3.2,
            glitchIntensity: 0.2,
            rotationSpeed: 0.7,
            geometry: 'tetrahedron'
        },
        // ... (other themes) ...
    };
    ```

*   **Fragment Shader (`fragmentShaderSource`):** This is a powerful, unified shader that contains functions for rendering various geometries (`hypercubeLattice`, `tetrahedronLattice`, `sphereLattice`, `torusLattice`, `kleinLattice`, `fractalLattice`, `waveLattice`, `crystalLattice`). A `u_geometry` uniform (an integer) is used to select which geometry function to execute for the current frame.

    ```glsl
    // Enhanced fragment shader with multiple geometries
    const fragmentShaderSource = `
        precision highp float;
        // ... uniforms ...
        uniform float u_geometry; // 0=hypercube, 1=tetrahedron, 2=sphere, 3=torus, 4=klein, 5=fractal, 6=wave, 7=crystal

        // Geometry generators (functions for each shape)
        float hypercubeLattice(vec3 p, float gridSize) { /* ... */ }
        float tetrahedronLattice(vec3 p, float gridSize) { /* ... */ }
        // ... (other geometry functions) ...

        float getGeometryValue(vec3 p, float gridSize, float geomType) {
            if (geomType < 0.5) return hypercubeLattice(p, gridSize);
            else if (geomType < 1.5) return tetrahedronLattice(p, gridSize);
            // ... (logic to select geometry based on u_geometry) ...
            else return crystalLattice(p, gridSize);
        }

        void main() {
            // ... (main rendering logic) ...
            float lattice = getGeometryValue(p, dynamicGridDensity, u_geometry);
            // ... (color, glitch, etc.) ...
        }
    `;
    ```

*   **Interaction Handling (`setupInteractions`):**
    *   **Mouse/Touch:** Updates `mouseX`, `mouseY`, and `interactionState.intensity`.
    *   **Click/Hold:** `isHolding` and `holdStart` track hold duration, which influences `u_dimension` for a "dimensional shift" effect. A visual `hold-indicator` provides feedback.
    *   **Scroll:** Calculates `scrollVelocity` and updates `interactionState.intensity`, affecting `gridDensity` and `morphFactor`.
    *   **Inactivity:** After 3 seconds, `interactionState.intensity` decays to 0, returning the visualizer to its base state.
    *   `updateInteractionState`: Central function to manage interaction type and intensity, and update UI indicators.

*   **Section Tracking (`setupSectionTracking`):**
    *   Uses `IntersectionObserver` to detect when a content section is in view.
    *   Calls `setTheme` when a new section becomes active.
    *   Updates the `nav-dot` elements to reflect the current section.

*   **Theme Switching (`setTheme`):**
    *   Takes a `themeName` (e.g., 'hypercube', 'tetrahedron').
    *   Retrieves the corresponding configuration from `themeConfigs`.
    *   Performs a smooth interpolation of parameters from the current state to the new theme's state over a `transitionDuration`. This creates the fluid visual transitions.

*   **Rendering (`render` and `animate`):**
    *   Passes all dynamic parameters (including those influenced by interaction and theme) as uniforms to the shader.
    *   The `animate` loop continuously calls `render` and decays `interactionState.intensity`.

```javascript
// Main JavaScript class
class ReactiveHyperAVCore {
    constructor(canvas) { /* ... initialization ... */ }
    initShaders() { /* ... vertex and fragment shader setup ... */ }
    createShader(type, source) { /* ... */ }
    createProgram(vertexShader, fragmentShader) { /* ... */ }
    initBuffers() { /* ... */ }

    setupInteractions() {
        // Mouse, click/hold, scroll, inactivity listeners
        // ...
    }

    setupSectionTracking() {
        // IntersectionObserver for sections
        // Nav dot click listeners
        // ...
    }

    updateInteractionState(type, intensity) { /* ... */ }

    setTheme(themeName) {
        // Smooth parameter transition logic
        // ...
    }

    resize() { /* ... */ }

    render() {
        // Calculate dynamic parameters based on interaction and theme
        // Pass uniforms to shader
        // ...
    }

    animate() { /* ... */ }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('reactive-canvas');
    if (canvas) {
        window.reactiveCore = new ReactiveHyperAVCore(canvas);
    }
});
```

**Customization and Reusability:**

*   **Adding New Geometries/Themes:**
    1.  Add a new entry to the `themeConfigs` object with desired parameters and a unique `geometry` string.
    2.  Implement a new `float yourNewGeometryLattice(vec3 p, float gridSize)` function in the fragment shader.
    3.  Add a condition to the `getGeometryValue` function in the fragment shader to select your new geometry based on its assigned `u_geometry` index.
    4.  (Optional) Add a new `<section>` in the HTML with `data-theme="yourNewTheme"` and a corresponding `nav-dot`.
*   **Adjusting Reactivity:** Modify the `interactionState.intensity` decay rate (`0.98` in `animate`), or the multipliers in `render` (e.g., `interactionMultiplier`, `holdEffect`) to change how strongly interactions affect the visuals.
*   **Color Schemes:** Change `baseColor` values in `themeConfigs` for each theme.
*   **Shader Effects:** Experiment with the existing `glitchAmount` calculation or add new visual effects directly in the fragment shader.
*   **Integration:** This entire system can be integrated as a full-page background visualizer. The `magazine-layer` provides a clean way to overlay content. You can adapt the `setupSectionTracking` to trigger themes based on other events if not using scrollable sections.

## Multi-Instance Demonstration

This system inherently demonstrates "multi-instance" capability through its theme-switching mechanism. Each theme is essentially a pre-configured "instance" of the visualizer with different parameters and a different underlying geometric function.

To create truly separate, simultaneously running instances, you would:

1.  Create multiple `<canvas>` elements.
2.  For each canvas, instantiate a *separate* `ReactiveHyperAVCore` object.
3.  Each instance would then run independently, potentially with its own set of controls or responding to different events. This would require careful management of event listeners if they are global.

However, the current design's strength lies in its single, dynamic instance that adapts to context, which is a powerful form of "multi-instance" in itself.
