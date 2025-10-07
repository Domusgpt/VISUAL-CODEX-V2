# RGB Moiré Hypercube Lattice Animation Codex Entry

This entry documents the "RGB Moiré Hypercube Lattice Animation" found in `moire-hypercube-pppalpha.html`. This is a WebGL-based visualizer that creates dynamic, interactive holographic-like effects, featuring morphing lattice grids, hypercube projections, RGB color splitting, and moiré glitch effects.

## Visual Elements and Effects

*   **Holographic/Dimensional Effect:** Achieved through 4D hypercube projection into 3D space, with mathematical transformations and perspective division.
*   **Reactive User Feedback:** Mouse movement/touch changes the lattice center. Sliders control various parameters in real-time.
*   **Particle System (Implicit):** While not a traditional particle system, the lattice points and lines behave dynamically, creating a sense of moving elements.
*   **Transition Effect (Morphing):** The `morphFactor` and `dimension` parameters allow for smooth transitions between 3D cube and 4D hypercube visualizations.
*   **RGB Glitch/Moiré:** Color channel offsetting and overlaying slightly offset grids create a distinct glitch and moiré pattern.

## Code Snippets and Explanation

### 1. HTML Structure (`index.html` or similar)

The core visualizer requires a `<canvas>` element and can optionally include sliders for interactive control.

```html
<div class="canvas-container">
    <canvas id="hypercube-canvas"></canvas>
</div>

<div class="controls">
    <div class="control-group">
        <label for="morphFactor">Morph Factor</label>
        <div class="control-row">
            <input type="range" min="0" max="1" step="0.01" value="0.5" class="slider" id="morphFactor">
            <span class="value-display" id="morphFactor-value">0.50</span>
        </div>
    </div>
    <!-- Other sliders for dimension, glitchIntensity, rotationSpeed, gridDensity -->
</div>
```

**Explanation:**
*   `canvas-container`: Provides a responsive wrapper for the WebGL canvas.
*   `hypercube-canvas`: The target for the WebGL rendering.
*   `controls`: Contains interactive sliders to manipulate the animation parameters. Each slider has a `label`, `input` (range type), and a `span` to display its current value.

### 2. CSS Styling (`style.css` or embedded `<style>` tag)

The CSS defines the visual appearance of the page and the canvas. Key aspects include:

*   **Vaporwave Color Scheme:** Defined using CSS variables for easy customization.
*   **Responsive Layout:** `container` and `canvas-container` ensure proper scaling.
*   **Slider Styling:** Customizes the appearance of the range input sliders.

```css
:root {
    --color-primary: #ff00ff;      /* Neon pink */
    --color-secondary: #00ffff;    /* Cyan */
    --color-tertiary: #9933ff;     /* Purple */
    --color-dark: #0a1130;         /* Deep blue */
    --color-darker: #050a20;       /* Deeper blue */
    --color-text: #e0e0ff;         /* Light blue-white */
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Chakra Petch', 'Segoe UI', Tahoma, sans-serif;
    background-color: var(--color-darker);
    color: var(--color-text);
    overflow-x: hidden;
}

.canvas-container {
    position: relative;
    width: 100%;
    height: 70vh;
    min-height: 500px;
    max-height: 800px;
    overflow: hidden;
    background-color: rgba(5, 10, 32, 0.5);
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
    margin-bottom: 30px;
}

/* ... (rest of the CSS for controls, sliders, etc.) ... */
```

**Customization:**
*   **Colors:** Modify the `--color-primary`, `--color-secondary`, etc., variables in `:root` to change the overall theme.
*   **Layout:** Adjust `width`, `height`, `margin`, `padding` for different screen sizes or embedding contexts.

### 3. JavaScript (WebGL Animation Logic)

The core of the visualizer is a JavaScript class `HypercubeLatticeEffect` that handles WebGL initialization, shader compilation, buffer setup, interaction, rendering, and animation loop.

#### Key Components:

*   **`HypercubeLatticeEffect` Class:** Encapsulates the entire WebGL logic.
*   **Vertex Shader:** `a_position` defines the screen-space coordinates for rendering.
*   **Fragment Shader:** This is where the magic happens. It calculates the color of each pixel based on:
    *   **4D Rotation Matrices:** `rotateXY`, `rotateXZ`, `rotateXW`, `rotateYZ`, `rotateYW`, `rotateZW` for hypercube manipulation.
    *   **Projection Functions:** `project4Dto3D` and `project3Dto2D` to map higher dimensions to 2D screen space.
    *   **Lattice Generation:** `latticeEdges`, `latticeVertices`, `hypercubeLattice` functions create the grid structure.
    *   **RGB Glitch:** Offsets `r`, `g`, `b` channels based on `u_glitchIntensity`.
    *   **Moiré Pattern:** Created by blending slightly offset grids.
    *   **Uniforms:** `u_resolution`, `u_time`, `u_mouse`, `u_morphFactor`, `u_glitchIntensity`, `u_rotationSpeed`, `u_dimension`, `u_gridDensity` are passed from JavaScript to the shader to control the animation.
*   **Interaction Setup:** Event listeners for mouse/touch and slider inputs update the uniform values.
*   **Animation Loop:** `requestAnimationFrame` ensures smooth rendering.

```javascript
// Main Animation Script
class HypercubeLatticeEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        // ... (initialization, properties) ...
    }

    initShaders() {
        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_mouse;
            uniform float u_morphFactor;
            uniform float u_glitchIntensity;
            uniform float u_rotationSpeed;
            uniform float u_dimension;
            uniform float u_gridDensity;

            // 4D rotation matrices (omitted for brevity, see full code)
            // ...

            // Project 4D to 3D, 3D to 2D (omitted for brevity, see full code)
            // ...

            // Grid and lattice functions (omitted for brevity, see full code)
            // ...

            void main() {
                // ... (main rendering logic, color calculation, glitch, moiré) ...
                gl_FragColor = vec4(color, 1.0);
            }
        `;
        // ... (shader compilation, program linking) ...
    }

    setupInteraction() {
        // Mouse/touch event listeners
        this.canvas.addEventListener('mousemove', (event) => { /* ... */ });
        this.canvas.addEventListener('touchmove', (event) => { /* ... */ });

        // Slider event listeners
        document.getElementById('morphFactor')?.addEventListener('input', (event) => {
            this.morphFactor = parseFloat(event.target.value);
        });
        // ... (other slider listeners) ...
    }

    animate() {
        // ... (render call, requestAnimationFrame) ...
    }
}

// Initialize the animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('hypercube-canvas');
    if (canvas) {
        const effect = new HypercubeLatticeEffect(canvas);
    }
});
```

**Customization and Reusability:**

*   **Parameters:** Adjust the initial `value` of the sliders in HTML or the default values in the `HypercubeLatticeEffect` constructor to change the starting appearance.
*   **Colors:** Modify `baseColor` and `latticeColor` in the fragment shader, or introduce new uniforms for dynamic color control.
*   **Geometry/Morphing:** Experiment with the `hypercubeLattice` function and the 4D rotation matrices in the fragment shader to alter the geometric transformations.
*   **Glitch Effect:** Adjust `glitchAmount` calculation and `rOffset`, `gOffset`, `bOffset` vectors in the fragment shader.
*   **Moiré Effect:** Modify the `moireGrid1` and `moireGrid2` calculations (e.g., `u_gridDensity * 1.01` and `u_gridDensity * 0.99`) to change the moiré patterns.
*   **Integration:** To integrate this into another project, copy the HTML canvas and slider structure, the CSS, and the entire JavaScript `HypercubeLatticeEffect` class. Ensure the canvas ID matches and the `DOMContentLoaded` listener correctly initializes the effect.

## Multi-Instance Demonstration (Conceptual)

To demonstrate multiple instances with varied settings, you would:

1.  Create multiple `<canvas>` elements, each with a unique ID (e.g., `hypercube-canvas-1`, `hypercube-canvas-2`).
2.  For each canvas, create a new instance of `HypercubeLatticeEffect`, passing its respective canvas element.
3.  To show variations, you could either:
    *   Hardcode different initial parameter values for each instance in the JavaScript.
    *   Create separate sets of sliders for each canvas, linking them to their respective `HypercubeLatticeEffect` instance.
    *   Implement a mechanism to randomize parameters for each instance on page load or button click.

This approach allows for a single page to showcase the versatility of the visualizer with different configurations.

```html
<!-- Example for multiple instances -->
<div class="canvas-container">
    <canvas id="hypercube-canvas-1"></canvas>
</div>
<div class="canvas-container">
    <canvas id="hypercube-canvas-2"></canvas>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const canvas1 = document.getElementById('hypercube-canvas-1');
        if (canvas1) {
            const effect1 = new HypercubeLatticeEffect(canvas1);
            // Optionally set different initial parameters for effect1
            effect1.morphFactor = 0.2;
            effect1.glitchIntensity = 0.8;
        }

        const canvas2 = document.getElementById('hypercube-canvas-2');
        if (canvas2) {
            const effect2 = new HypercubeLatticeEffect(canvas2);
            // Optionally set different initial parameters for effect2
            effect2.dimension = 3.1;
            effect2.rotationSpeed = 1.5;
        }
    });
</script>
```