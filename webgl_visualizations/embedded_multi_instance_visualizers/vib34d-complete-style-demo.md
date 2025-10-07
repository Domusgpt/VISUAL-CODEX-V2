
### VIB34D Complete Style System Demo

*   **File Path:** `/mnt/c/Users/millz/ParseratorMarketing/vib3stylepack-production/archive/unused-html/VIB34D_COMPLETE_STYLE_DEMO.html`
*   **Dependencies:** WebGL, CSS3, JavaScript
*   **Visual Description:** This demo showcases a modular approach to integrating WebGL visualizers into various UI components. It features a dark, futuristic aesthetic with neon accents (cyan, magenta, yellow). The visualizers are used as dynamic backgrounds for borders, shadows, full-page sections, interactive buttons, navigation items, and even behind text and media content. The system reacts to user interaction (mouse hover, click, scroll, text selection, media play/pause) by dynamically adjusting the visualizer parameters, creating a highly responsive and immersive experience.
*   **Key Features & Effects:**

    *   **Modular Visualizer Integration:**
        *   **`border-top-container`, `border-bottom-container`, `border-sides-container`:** Visualizers are used as dynamic borders, reacting to mouse movement.
        *   **`shadow-depth-container`, `shadow-glow-container`:** Visualizers create dynamic depth and glowing shadow effects behind UI elements.
        *   **`background-full-container`, `background-section-container`:** Visualizers serve as full-page or section-specific dynamic backgrounds, adapting to content and scroll.
        *   **`button-interactive-container`:** Visualizers are embedded within buttons, reacting to clicks with dramatic visual bursts and then returning to a normal state.
        *   **`nav-crystal-container`:** Visualizers are embedded within navigation items, creating synchronized crystal-like patterns that react to navigation actions.
        *   **`content-text-container`:** A visualizer runs behind text content, subtly reacting to text selection to enhance readability.
        *   **`content-media-container`:** A visualizer runs behind media content, reacting to play/pause actions with changes in speed, density, and color intensity.
    *   **Dynamic Parameter Control:** The JavaScript code dynamically updates visualizer parameters (e.g., `gridDensity`, `speed`, `morphFactor`, `colorIntensity`) based on user interactions and the specific UI component the visualizer is embedded in.
    *   **Global Controls:** A control panel allows for global adjustments to presets, interaction styles, speed, and intensity, affecting all visualizers simultaneously.
    *   **"Global Reality Inversion" Effect:** A button to trigger a global effect, likely a dramatic visual transformation across all visualizers.
    *   **"Save Current as Preset" Functionality:** Allows users to capture the current visual state as a preset.
*   **Code Highlights:**

    *   **JavaScript (`initializeVIB34DSystem` - Dynamic Visualizer Creation):**
        ```javascript
        containers.forEach(container => {
            const styleClass = container.dataset.style;
            // ...
            const visualizer = window.VIB34DStyleSystem.createStyledVisualizer(styleClass, container);
            // ...
        });
        ```

    *   **JavaScript (`buttonAction` - Interactive Button Visualizer):**
        ```javascript
        // Trigger dramatic effect
        visualizer.updateParameters({
            gridDensity: visualizer.config.gridDensity * 3,
            speed: visualizer.config.speed * 2,
            morphFactor: 2.0
        }, { duration: 300 });

        // Return to normal
        setTimeout(() => {
            const styleConfig = window.VIB34DStyleSystem.getStyleClassConfig('button-interactive');
            if (styleConfig) {
                visualizer.updateParameters(styleConfig.parameters, { duration: 800 });
            }
        }, 300);
        ```

    *   **JavaScript (`toggleMedia` - Media Play/Pause Visualizer):**
        ```javascript
        if (isMediaPlaying) {
            visualizer.updateParameters({
                speed: 1.5,
                gridDensity: 20.0,
                morphFactor: 1.2,
                colorIntensity: 1.8
            }, { duration: 300 });
        } else {
            const styleConfig = window.VIB34DStyleSystem.getStyleClassConfig('content-media');
            if (styleConfig) {
                visualizer.updateParameters(styleConfig.parameters, { duration: 500 });
            }
        }
        ```

    *   **JavaScript (Text Selection Visualizer):**
        ```javascript
        document.addEventListener('selectionchange', function() {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                visualizerInstances.forEach(visualizer => {
                    if (visualizer.styleClass === 'content-text') {
                        if (visualizer.updateParameters) {
                            visualizer.updateParameters({
                                gridDensity: 5.0,
                                speed: 0.2,
                                colorIntensity: 0.8
                            }, { duration: 200 });
                        }
                    }
                });
            } else {
                visualizerInstances.forEach(visualizer => {
                    if (visualizer.styleClass === 'content-text') {
                        const styleConfig = window.VIB34DStyleSystem.getStyleClassConfig('content-text');
                        if (styleConfig && visualizer.updateParameters) {
                            visualizer.updateParameters(styleConfig.parameters, { duration: 400 });
                        }
                    }
                });
            }
        });
        ```
