
### HyperAV - 4D Audio-Reactive Visualizer

*   **File Paths:**
    *   `/mnt/c/Users/millz/Desktop/Synther/core/HypercubeCore.js`
    *   `/mnt/c/Users/millz/Desktop/Synther/js/visualizer-main.js`
    *   `/mnt/c/Users/millz/Desktop/Synther/css/enhanced-styles.css`
*   **Dependencies:** WebGL, Web Audio API, CSS3
*   **Visual Description:** This is a sophisticated audio-reactive visualizer that renders 4D geometric shapes (hypercubes, etc.) using WebGL. The visuals are heavily influenced by audio input from the microphone, with different frequency bands (bass, mid, high) and detected musical pitch affecting various parameters of the visualizer. The visual style is a "vaporwave" or "neon" aesthetic, with glowing lines, glassmorphism effects, and a dark, moody color palette. The visualizer is interactive, with both sliders and direct manipulation of the canvas affecting the visuals.
*   **Key Features & Effects:**
    *   **4D Geometry:** Renders various 4D shapes and allows for different projection methods (perspective, orthographic, etc.).
    *   **Audio Reactivity:**
        *   Bass, mid, and high frequencies from the microphone control parameters like `morphFactor`, `rotationSpeed`, and `gridDensity`.
        *   Musical pitch detection influences the color palette and other visual elements.
        *   A "dissonance proxy" affects color shifting.
    *   **Visual Effects:**
        *   **Glassmorphism:** Translucent, blurred backgrounds on UI elements.
        *   **Neon Glow:** Glowing lines and text, achieved with `box-shadow` and `text-shadow`.
        *   **Magnification Effect:** UI elements scale up on hover.
        *   **Particle System:** A particle system is present in the CSS, though its implementation in the JS is not fully shown in this file.
        *   **Moiré Patterns:** The fragment shader (not directly in these files, but referenced) creates moiré patterns.
        *   **RGB Glitch Effect:** The fragment shader also includes an RGB color splitting "glitch" effect.
*   **Code Highlights:**

    *   **`js/visualizer-main.js` (Audio Reactivity):**
        ```javascript
        // Calculate audio-influenced factors
        const dissonanceFactor = analysisData.midSmooth * analysisData.highSmooth * 2.0;
        const energyFactor = (analysisData.bassSmooth + analysisData.midSmooth) * 0.5;
        const transientFactor = Math.max(0, analysisData.highSmooth - lastEnergy) * 2.0;
        lastEnergy = analysisData.highSmooth * 0.8; // Update transient tracking with decay
        ```

    *   **`css/enhanced-styles.css` (Glassmorphism & Glow):**
        ```css
        /* Glassmorphism Variables */
        --glass-bg-color: rgba(15, 7, 30, 0.55);
        --glass-border-color: rgba(255, 255, 255, 0.1);
        --glass-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        --glass-blur: 8px;

        .control-module.focused {
          opacity: 1;
          transform: scale(1.02) translateZ(5px); /* Subtle pop */
          z-index: 10;
          border-color: var(--vp-focus-outline); /* Use secondary (cyan) for focus */
          box-shadow: 0 0 15px 2px var(--glow-secondary-strong), /* Cyan focus glow */
                      0 0 25px 5px rgba(var(--vp-glow-secondary-rgb), 0.4);
        }
        ```
