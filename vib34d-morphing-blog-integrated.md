
### VIB34D Morphing Blog - Integrated System

*   **File Path:** `/mnt/c/Users/millz/!!prime!!VIB34D-STYLE-Claude/index.html`
*   **Dependencies:** WebGL, CSS3, JavaScript (specifically `src/main.js` which orchestrates the VIB34D system)
*   **Visual Description:** This system creates an immersive blog experience where content is presented on "floating" cards over a dynamic WebGL visualizer background. The aesthetic is dark, futuristic, and highly reactive, with neon accents (cyan, magenta, yellow, green). User interactions (mouse movement, hover, click, scroll, keyboard) directly influence the visual parameters of both the background and the individual card visualizers, creating a unified and responsive visual ecosystem.
*   **Key Features & Effects:**

    *   **Full-Page WebGL Visualizer Background:**
        *   A `canvas` element (`#board-visualizer`) serves as a continuous, full-page background.
        *   Its opacity is set to `0.6` and it has `filter: blur(0.5px) contrast(1.1) brightness(0.9)` with `mix-blend-mode: multiply`, creating a subtle, atmospheric, and slightly darker visual layer.
    *   **Floating Blog Cards (`.blog-card`):**
        *   **Glassmorphism & Dynamic Background:** Cards use `backdrop-filter: blur()` (with a dynamic blur intensity based on `--grid-vibrance`) and a `linear-gradient` background that changes opacity based on `--global-energy`.
        *   **Complex Box Shadows:** Cards have multiple `box-shadow` layers for depth, subtle neon glows (cyan), and inner highlights.
        *   **3D Transform on Hover:** On hover, cards `transform` (scale, translateY, translateZ, rotateX, rotateY) and their `box-shadow` intensifies with additional neon glows (cyan, magenta, yellow), and `backdrop-filter` increases blur and saturation, creating a strong interactive pop-out effect.
        *   **`card-visualizer`:** Each blog card contains its own `canvas` element (`.card-visualizer`) running a separate WebGL visualizer instance. These visualizers have `opacity: 0.9`, `mix-blend-mode: screen`, and `filter: contrast(1.2) saturate(1.3) brightness(1.1)`, making them appear as vibrant, glowing patterns within the cards.
    *   **Advanced CSS Variables for Real-time Reactivity:** The `body` element defines numerous CSS variables (e.g., `--global-energy`, `--section-focus`, `--portal-intensity`, `--micro-chaos`, `--inverse-flow`, `--grid-vibrance`, `--transition-phase`, `--reality-tear`, `--morph-factor`, `--dimension-value`, `--glitch-intensity`, `--rotation-speed`, `--grid-density`, `--interaction-intensity`). These variables are dynamically updated by JavaScript based on user interactions and system state, and then directly control visual properties in CSS and GLSL shaders.
    *   **Dynamic Layouts:** The `blog-container` uses classes like `layout-home`, `layout-tech`, `layout-media` to dynamically reposition and resize the `blog-card` elements, creating different content arrangements.
    *   **Interactive Feedback Systems:**
        *   **Parameter Display (`.parameter-display`):** A floating panel that shows the real-time values of various visual parameters (morph factor, dimension, glitch, rotation, grid density, interaction, geometry, layout) as they change with user interaction.
        *   **Interaction Guide (`.interaction-guide`):** A floating panel providing instructions on how user inputs (mouse, hover, click, scroll, keyboard) affect the visualizer.
        *   **State Controls (`.blog-controls`):** A floating control bar with circular "state dots" (`.state-dot`) that represent different blog layouts/states. The active dot has a linear gradient background (cyan to magenta) and a strong `box-shadow` glow, and scales up.
*   **Code Highlights:**

    *   **CSS (Dynamic CSS Variables for Reactivity):**
        ```css
        body {
            /* ... */
            --global-energy: 0.0;
            --section-focus: 0;
            --portal-intensity: 0.0;
            /* ... and many more ... */
        }
        ```

    *   **CSS (Blog Card Hover with Intense Holographic Effects):**
        ```css
        .blog-card[data-section-hover="true"] {
            transform: scale(1.12) translateY(-20px) translateZ(40px)
                      rotateX(8deg) rotateY(3deg);
            box-shadow:
                0 40px 80px rgba(0, 0, 0, 0.7),
                0 20px 60px rgba(0, 255, 255, 0.5),
                0 0 80px rgba(255, 0, 255, 0.4),
                0 0 120px rgba(255, 255, 0, 0.3),
                inset 0 2px 4px rgba(255, 255, 255, 0.6),
                inset 0 -2px 4px rgba(0, 255, 255, 0.3);
            backdrop-filter: blur(40px) saturate(300%) hue-rotate(30deg);
            animation: holographic-pulse 2s ease-in-out infinite alternate;
        }
        @keyframes holographic-pulse { /* ... */ }
        ```

    *   **CSS (`card-visualizer` Styling):**
        ```css
        .card-visualizer {
            opacity: 0.9;
            mix-blend-mode: screen;
            filter: contrast(1.2) saturate(1.3) brightness(1.1);
        }
        ```
