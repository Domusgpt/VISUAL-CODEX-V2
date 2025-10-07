
### VIB3CODE - Digital Sovereignty Magazine (Cyberpunk Dark Theme)

*   **File Path:** `/mnt/c/Users/millz/ParseratorMarketing/vib3code-blog-experiment/dark-index.html`
*   **Dependencies:** WebGL, CSS3, JavaScript
*   **Visual Description:** This is a digital magazine designed with a cyberpunk aesthetic. It features a full-page WebGL visualizer as a dynamic background, creating an immersive and futuristic atmosphere. The UI elements are styled with a dark theme, neon accents (cyber teal, cyber pink), and subtle interactive effects like mouse-reactive 3D transforms on cards.
*   **Key Features & Effects:**

    *   **Full-Page 4D Visualizer Background:**
        *   A `canvas` element (`#visualizer-canvas`) is used as a fixed, full-page background.
        *   The `VIB3VisualizerBackground` class initializes a `HypercubeCore` (a WebGL visualizer) with a specific cyberpunk color scheme (teal, pink, dark background) and parameters for `rotationSpeed`, `morphFactor`, `gridDensity`, and `patternIntensity`.
        *   **Audio Reactivity (Optional):** The visualizer attempts to integrate with a `SoundInterface` to make the visualizer react to audio levels, influencing `morphFactor` and `rotationSpeed`. If audio is not available, it still runs.
        *   **Fallback Background:** If WebGL is not supported, a CSS-only animated background is provided as a fallback, using `linear-gradient` and `radial-gradient` with subtle color shifts.
    *   **Cyberpunk UI Elements:**
        *   **`hero-title`:** Uses `linear-gradient` for text color and `text-shadow` for a glowing effect.
        *   **`btn-cyber`:** Buttons with `linear-gradient` backgrounds and hover effects that change background color and `box-shadow`.
        *   **`article-featured`, `ema-card`, `sidebar-article`:** These card-like elements have a subtle 3D transform (`perspective`, `rotateX`, `rotateY`) that reacts to mouse movement, creating a parallax effect.
        *   **`glass-container`:** A class for elements with a glassmorphism effect (though the `backdrop-filter` is not directly in this `index.html`, it's likely in the `dark-vib3.css` or `glassmorphic-ui-enhanced.css` files).
    *   **Neural Loading Indicator:** A fixed loading message (`.neural-loading`) with a `loading-cyber` element (likely a spinning loader, though its CSS is not provided here) that fades out (`fadeOut` animation) after a few seconds.
*   **Code Highlights:**

    *   **JavaScript (`VIB3VisualizerBackground` - Visualizer Initialization):**
        ```javascript
        this.core = new HypercubeCore(this.canvas, shaderManager, visualizerConfig);
        // ...
        this.setupAudioReactivity(); // Optional audio integration
        this.core.start();
        ```

    *   **JavaScript (Mouse-Reactive 3D Transform on Cards):**
        ```javascript
        document.addEventListener('mousemove', (e) => {
            // ...
            document.querySelectorAll('.ema-card, .article-featured, .sidebar-article').forEach(card => {
                // ...
                const rotateX = (cardY - 0.5) * 10;
                const rotateY = (cardX - 0.5) * -10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                // ...
            });
        });
        ```

    *   **CSS (Fallback Background):**
        ```css
        body.style.background = `
            linear-gradient(135deg, #0a0a0f 0%, #151529 100%),
            radial-gradient(circle at 20% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 16, 240, 0.1) 0%, transparent 50%)
        `;
        ```
