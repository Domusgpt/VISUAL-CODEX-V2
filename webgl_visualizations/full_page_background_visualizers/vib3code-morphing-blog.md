
### VIB3CODE - Morphing Blog System

*   **File Path:** `/mnt/c/Users/millz/vib3stylepack-v2-production/vib3code-morphing-blog.html`
*   **Dependencies:** WebGL, CSS3, JavaScript
*   **Visual Description:** This system creates an immersive, interactive blog experience where content is displayed on the "faces" of a virtual 4D hypercube (tesseract). Users navigate by "folding" the tesseract, which triggers smooth 3D transitions between different content layouts. The background is a dynamic WebGL visualizer that morphs and reacts to user interaction and the current content. The aesthetic is futuristic, with deep space colors, neon accents, and complex visual effects.
*   **Key Features & Effects:**

    *   **Tesseract 8-Cell Hypercube Container:**
        *   **`tesseract-container`:** Uses `perspective` and `transform-style: preserve-3d` to create a 3D scene for the hypercube.
        *   **`hypercube-face`:** Each "face" of the hypercube is a `div` that can host content and a WebGL visualizer. These faces are dynamically positioned and transformed to simulate the folding of a tesseract.
        *   **Tesseract Folding States:** CSS classes like `folding-right`, `folding-left`, `folding-up`, `folding-down` apply `transform` (rotateY, rotateX, translateZ) to the hypercube faces, creating smooth 3D folding animations.
        *   **Hypercube Tension Mechanics:** The `tension-building` class applies a `filter: blur` and `transform: scale` and `rotateZ` to the entire tesseract, creating a visual distortion effect that can be linked to system state or user interaction.
    *   **Dynamic Blog Cards:**
        *   **Floating Cards:** Blog cards (`.blog-card`) are positioned absolutely and use `backdrop-filter` for glassmorphism. They have complex `box-shadow` properties for depth and glowing effects.
        *   **Hover Effects:** On hover, cards `scale`, `translateY`, `translateZ`, and `rotateX`/`rotateY`, with intensified `box-shadow` and `backdrop-filter` for a strong interactive pop-out effect.
        *   **`::before` Pseudo-element for Gradient Glow:** Each card has a `::before` pseudo-element with a `conic-gradient` background that animates its rotation (`rotate-gradient` animation) and opacity, creating a dynamic, multi-colored glow.
        *   **Smart Opacity States:** CSS variables (`--visualizer-opacity`, `--focused-opacity`, `--reading-opacity`, `--gravity-opacity`, `--board-opacity`) dynamically control the opacity of visualizers within cards based on interaction and focus, allowing the content to come forward.
    *   **Visualizer Background Board:** A full-screen WebGL visualizer (`#board-visualizer`) acts as a dynamic background, with its opacity and blur controlled by CSS variables.
    *   **Portal Transition Effects:** A fixed overlay (`.portal-transition`) with `radial-gradient` and `conic-gradient` backgrounds that animates its opacity, `transform: rotate`, and `backdrop-filter` (blur, hue-rotate) to create a dramatic "portal" effect during transitions.
    *   **Reality Tear Effects:** Another fixed overlay (`.reality-tear`) with repeating linear gradients that animates its opacity, `filter` (contrast, brightness), and `transform: translateX` to create a "glitch" or "tear" in reality effect.
    *   **4D Cube Navigation Bezels:** Fixed UI elements (`.nav-bezel`) positioned at the edges of the screen (left, right, top, bottom) that act as interactive navigation controls. They have `linear-gradient` backgrounds, `backdrop-filter` for glassmorphism, and `box-shadow` for glowing effects. They also contain embedded `bezel-visualizer` canvases and `drag-indicator` text.
    *   **Blog State Controls:** A floating control bar (`.blog-controls`) with circular "state dots" (`.state-dot`) that represent different blog layouts/states. The active dot has a linear gradient background and a strong `box-shadow` glow, and scales up.
    *   **Scroll Interaction Feedback:** A vertical scroll progress bar (`.scroll-progress`) with a multi-color linear gradient fill (`.scroll-fill`) that indicates scroll position. A `morphing-indicator` text appears when morphing is in progress.
*   **Code Highlights:**

    *   **CSS (Tesseract Folding):**
        ```css
        .tesseract-container.folding-right .hypercube-face.face-0 {
            transform: rotateY(-90deg) translateZ(-100px);
        }
        /* ... similar for other folding directions ... */
        ```

    *   **CSS (Blog Card `::before` Gradient & Animation):**
        ```css
        .blog-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(calc(135deg + var(--transition-phase) * 180deg),
                rgba(0, 255, 255, calc(0.08 + var(--grid-vibrance) * 0.12)) 0%,
                rgba(255, 0, 255, calc(0.06 + var(--grid-vibrance) * 0.10)) 25%,
                /* ... other colors ... */
            );
            animation: pulse-glow calc(2s / (1 + var(--grid-vibrance))) ease-in-out infinite;
        }
        @keyframes pulse-glow { /* ... */ }
        ```

    *   **CSS (Portal Transition & Reality Tear):**
        ```css
        .portal-transition {
            background:
                radial-gradient(circle at var(--portal-x, 50%) var(--portal-y, 50%),
                    rgba(0, 255, 255, 0.3) 0%, transparent 60%),
                conic-gradient(from 0deg at var(--portal-x, 50%) var(--portal-y, 50%),
                    rgba(255, 0, 255, 0.2), rgba(0, 255, 255, 0.2), /* ... */ );
            animation: portal-spin calc(0.8s / (1 + var(--portal-intensity))) linear infinite;
            backdrop-filter: blur(calc(var(--portal-intensity) * 20px)) hue-rotate(calc(var(--portal-intensity) * 180deg));
        }
        @keyframes portal-spin { /* ... */ }

        .reality-tear {
            background:
                repeating-linear-gradient(calc(45deg + var(--transition-phase) * 90deg), transparent, transparent 2px, rgba(255, 0, 255, calc(0.1 * var(--reality-tear))) 2px, rgba(255, 0, 255, calc(0.1 * var(--reality-tear))) 4px),
                /* ... other gradients ... */
            filter: contrast(calc(1 + var(--reality-tear) * 0.5)) brightness(calc(1 + var(--reality-tear) * 0.3));
            animation: reality-glitch calc(0.15s / (1 + var(--reality-tear))) infinite;
        }
        @keyframes reality-glitch { /* ... */ }
        ```

    *   **JavaScript (`ReactiveHyperAVCore` - Embedded Shader & Logic):**
        ```glsl
        // Enhanced 4D rotation matrices
        mat4 rotateXW(float theta) { /* ... */ }
        // ...
        // Enhanced geometric functions with more detail (hypercube, tetrahedron, sphere, mandelbulb, wave)
        float hypercubeLattice(vec3 p, float gridSize) { /* ... */ }
        float mandelbulbLattice(vec3 p, float gridSize) { /* ... */ } // New geometry!
        // ...
        void main() {
            // ...
            // Enhanced 4D space with mouse reactivity
            // ...
            // Enhanced 4D rotations with mouse reactivity
            // ...
            // Dynamic density with variation
            // ...
            // Enhanced coloring with mouse reactivity
            // ...
            // Add enhanced effects (moire, grid, rgbGlitch)
            // ...
            // Mouse interaction glow
            // ...
            // Section focus glow
            // ...
            // Portal intensity enhancement
            // ...
        }
        ```
