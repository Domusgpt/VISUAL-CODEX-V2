# Card-Specific WebGL Visualizer

This entry documents a reusable WebGL visualizer designed to be embedded within smaller UI containers, such as the "floating cards" in the Dynamic Layout System. It features dynamic geometry, color, and animation, making it suitable for adding subtle or prominent visual flair to individual UI components. This effect is extracted from `DYNAMIC_LAYOUT_SYSTEM.html`.

## Visual Elements and Effects

*   **Dynamic Geometry:** Can render various geometric forms (hypercube, tetrahedron, sphere, torus, wave) based on configurable parameters.
*   **Reactive to Parent State:** Its visual properties (geometry, density, speed, color) can be smoothly transitioned based on an external "state" (e.g., the layout state of the parent system).
*   **Instance-Specific Customization:** Each instance can have unique base parameters (density multiplier, speed multiplier, color shift, intensity) to create visual variety.
*   **Subtle Interaction:** Responds to global mouse position and chaos intensity, adding a layer of reactivity.
*   **Holographic/Abstract:** The abstract geometric forms and glowing effects contribute to a futuristic, holographic aesthetic.

## Code Snippets and Explanation

### 1. HTML Structure

The visualizer requires a `<canvas>` element within its parent container (e.g., a `.floating-card`).

```html
<div class="floating-card" id="card-1">
    <canvas class="card-visualizer" id="card-visualizer-1"></canvas>
    <div class="card-content">...</div>
</div>
```

**Explanation:**
*   `card-visualizer`: The `<canvas>` element where the WebGL visualizer will render. It should be styled to fill its parent container.

### 2. CSS Styling

The CSS ensures the canvas fills its parent and can be layered.

```css
.card-visualizer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1; /* Ensures it's behind the card content */
    opacity: 0.8; /* Allows content to stand out */
}
```

**Customization:**
*   **`opacity`**: Adjust to control how much the visualizer shows through the content.
*   **`z-index`**: Ensure proper layering with other elements within the card.

### 3. JavaScript (`DynamicLayoutVisualizer` Class)

The `DynamicLayoutVisualizer` class is designed to be instantiated for each card. It takes a `canvasId` and an `instanceType` (which is 'card' for these visualizers).

#### Key Components:

*   **`instanceParams`:** This object defines unique characteristics for each visualizer instance. For 'card' instances, these are randomized to create visual variety.

    ```javascript
    // In DynamicLayoutVisualizer constructor
    this.instanceParams = instanceType === 'board' ? { /* ... */ } : {
        densityMult: 1.2 + Math.random() * 0.8, // Random density multiplier
        speedMult: 0.4 + Math.random() * 0.3,   // Random speed multiplier
        colorShift: Math.random() * 360,        // Random color hue shift
        intensity: 0.6 + Math.random() * 0.3    // Random intensity
    };
    ```

*   **`states` Array:** Defines the base visual parameters (geometry, density, speed, color) for different conceptual states (e.g., HOME, TECH, MEDIA). These are the same states used by the parent `DynamicLayoutSystem`.

    ```javascript
    // In DynamicLayoutVisualizer constructor
    this.states = [
        { geometry: 0.0, density: 6.0, speed: 0.6, color: [1.0, 0.0, 1.0], name: 'HOME', geometryName: 'Hypercube' },
        { geometry: 1.0, density: 4.0, speed: 0.4, color: [0.0, 1.0, 1.0], name: 'TECH', geometryName: 'Tetrahedron' },
        // ... other states ...
    ];
    ```

*   **Fragment Shader:** A versatile shader capable of rendering multiple geometries (hypercube, tetrahedron, sphere, torus, wave). It uses uniforms to receive parameters from JavaScript, including instance-specific multipliers and global chaos intensity.

    ```glsl
    // Fragment shader snippet (inside DynamicLayoutVisualizer.initShaders)
    const fragmentShaderSource = `
        precision highp float;

        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform float u_geometry; // Selects which geometry function to use
        uniform float u_density;
        uniform float u_speed;
        uniform vec3 u_color;
        uniform float u_intensity;
        uniform float u_instanceDensity; // Instance-specific multiplier
        uniform float u_instanceSpeed;   // Instance-specific multiplier
        uniform float u_colorShift;      // Instance-specific color shift
        uniform float u_chaosIntensity;  // Global chaos from parent system

        // Geometry functions (hypercubeLattice, tetrahedronLattice, sphereLattice, torusLattice, waveLattice)
        // ...

        float getGeometryValue(vec3 p, float gridSize, float geomType) {
            // Logic to select and call the appropriate geometry function
            // ...
        }

        vec3 hsv2rgb(vec3 c) { /* ... */ } // HSV to RGB conversion

        // Enhanced effects (rgbGlitch, moirePattern)
        vec3 rgbGlitch(vec3 color, vec2 uv, float intensity) { /* ... */ }
        float moirePattern(vec2 uv, float intensity) { /* ... */ }

        void main() {
            // ... (coordinate setup, 4D projection) ...

            float instanceDensity = u_density * u_instanceDensity; // Apply instance multiplier
            float lattice = getGeometryValue(p, instanceDensity, u_geometry);

            // Apply instance-specific color shift
            float hue = atan(u_color.r, u_color.g) + u_colorShift * 0.017453;
            vec3 color = hsv2rgb(vec3(hue, saturation, brightness));

            // Add effects during chaos (influenced by u_chaosIntensity)
            color += vec3(moirePattern(uv, u_chaosIntensity));
            color = rgbGlitch(color, uv, u_chaosIntensity);

            // Subtle mouse interaction
            // ...

            gl_FragColor = vec4(color, 0.95);
        }
    `;
    ```

*   **`snapToState(stateIndex)`:** This method is called by the parent system to smoothly transition the visualizer's parameters to a new state. It interpolates between the current and target state parameters.
*   **`updateChaos(intensity)`:** Receives the global chaos intensity from the parent system and updates its internal `chaosIntensity` uniform.
*   **`updateInteraction(mouseX, mouseY)`:** Receives global mouse coordinates.
*   **`render()`:** Updates uniforms with interpolated values, instance-specific multipliers, and chaos intensity, then draws the scene.

```javascript
// DynamicLayoutVisualizer class (simplified)
class DynamicLayoutVisualizer {
    constructor(canvasId, instanceType = 'card') {
        // ... (canvas, gl context, instanceParams, states setup) ...
        this.initShaders();
        this.initBuffers();
        this.resize();
    }

    initShaders() { /* ... vertex and fragment shader setup ... */ }
    createShader(type, source) { /* ... */ }
    createProgram(vertexShader, fragmentShader) { /* ... */ }
    initBuffers() { /* ... */ }
    resize() { /* ... */ }

    snapToState(stateIndex) {
        // Smoothly interpolates parameters to the new state
        this.targetState = stateIndex;
        this.transitionProgress = 0.0;
    }

    updateChaos(intensity) {
        this.chaosIntensity = intensity;
    }

    updateInteraction(mouseX, mouseY) {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    render() {
        // ... (interpolation logic) ...
        // Set uniforms: u_geometry, u_density, u_speed, u_color, u_intensity,
        // u_instanceDensity, u_instanceSpeed, u_colorShift, u_chaosIntensity
        // ...
    }
}

// Instantiation example (from DynamicLayoutSystem)
// const cardViz = new DynamicLayoutVisualizer(`card-visualizer-${i}`, 'card');
```

**Customization and Reusability:**

*   **New Geometries:** Add new geometry functions to the fragment shader and update the `getGeometryValue` logic.
*   **Visual Parameters:** Modify the `states` array to define different visual characteristics for each state.
*   **Instance Variation:** Adjust the randomization logic in `instanceParams` to control the range of visual differences between card visualizers.
*   **Interaction Response:** Modify how `u_mouse` and `u_chaosIntensity` are used in the fragment shader to change the visualizer's reactivity.
*   **Color Schemes:** Change the `color` values in the `states` array. The `hsv2rgb` function and `u_colorShift` allow for flexible color manipulation.
*   **Integration:** This class is designed to be instantiated multiple times, each rendering to a different canvas. It's ideal for adding dynamic backgrounds or effects to individual UI components.

## Multi-Instance Demonstration

This visualizer is inherently designed for multi-instance use. In `DYNAMIC_LAYOUT_SYSTEM.html`, five instances of `DynamicLayoutVisualizer` are created, each targeting a different `<canvas>` element within a `.floating-card`. They all respond to the same global state changes and chaos intensity but maintain their unique randomized visual properties.

```javascript
// Example from DynamicLayoutSystem.initialize()
// Create card visualizers
for (let i = 1; i <= 5; i++) {
    const cardViz = new DynamicLayoutVisualizer(`card-visualizer-${i}`, 'card');
    this.visualizers.push(cardViz);
}
```
This demonstrates how multiple instances can be easily created and managed, each contributing to the overall dynamic UI.
