
### Hypercube Lattice Applications - Interactive Visualizer Logic

*   **File Path:** `/mnt/c/Users/millz/Desktop/hypercubeapp0.2/app.js`
*   **Dependencies:** WebGL, JavaScript, HTML5 (Canvas, Audio API for Soundfields)
*   **Visual Description:** This JavaScript file drives a multi-faceted application where a central WebGL-rendered 4D hypercube lattice visualizer adapts its appearance and behavior across different "universes" or application tabs. Each tab (Timekeeper, Soundfields Synth, Spiritual Compass, World Builder, Design Patterns, Fusion Lab) manipulates the visualizer's parameters in unique ways, creating distinct interactive experiences. Effects include dynamic morphing, RGB glitching, rotation, grid density changes, and color shifts, all responsive to user input or simulated internal states.
*   **Key Features & Effects (per tab):**

    *   **Timekeeper's Lens:**
        *   **Visuals:** The hypercube lattice visualizer's `morphFactor`, `dimension`, and `rotationSpeed` are linked to a timeline scrubber. `glitchIntensity` and `patternIntensity` are affected by a "causal loop" slider.
        *   **Interaction:** Draggable timeline marker, sliders, and reference frame buttons dynamically alter the visualizer.
        *   **Code Highlight:**
            ```javascript
            function updateTimePosition(e) {
                // ...
                effect.morphFactor = 0.3 + percentage * 0.7;
                effect.dimension = 3 + percentage;
                effect.rotationSpeed = 0.2 + percentage * 0.6;
                // ...
            }
            ```

    *   **Soundfields Synth:**
        *   **Visuals:** An XY pad (`synth-pad`) maps position to the visualizer's `morphFactor`, `glitchIntensity`, and `dimension`. Simulated audio frequency bars are displayed, and various synth controls (knobs, toggles) influence the visualizer's parameters like `gridDensity`, `universeModifier`, and `patternIntensity`.
        *   **Interaction:** XY pad for continuous control, interactive knobs, toggle switches for effects (delay, reverb, arpeggiator), and a mini keyboard that changes the visualizer based on the played note.
        *   **Code Highlight:**
            ```javascript
            function updateSynthPosition(e) {
                // ...
                effect.morphFactor = synthY;
                effect.glitchIntensity = synthX;
                effect.dimension = 3 + synthY;
                // ...
            }
            function updateAudioVisualizer() {
                // ... (simulated frequency bar generation and styling) ...
                // bar.style.height = `${height}%`;
                // bar.style.backgroundColor = barColor;
                // bar.style.boxShadow = `0 0 ${glowAmount}px ${barColor}`; // Glow for distortion
                // ...
            }
            ```

    *   **Spiritual Compass:**
        *   **Visuals:** A pulsing "breath indicator" animates its scale, and the visualizer's `morphFactor`, `dimension`, `glitchIntensity`, and `rotationSpeed` are synchronized with the breath phases (inhale, hold, exhale, rest).
        *   **Interaction:** Start/pause/reset meditation session, selection of different breathing patterns (4-7-8, Box, Coherent).
        *   **Code Highlight:**
            ```javascript
            function updateBreathPhase(phase) {
                // ...
                // Make the circle expand/contract
                breathIndicator.style.animation = `breathe ${breathPattern.inhale}s forwards ease-in`; // or breathe-out
                // ...
                // Update visualization
                effect.morphFactor = 0.3; // or 0.5, 0.2, 0.1 based on phase
                effect.dimension = 3.2; // or 3.5, 3.0 based on phase
                // ...
            }
            ```

    *   **World Builder:**
        *   **Visuals:** The hypercube visualizer responds to "world building" tools, dimension controls, and topology selections.
        *   **Interaction:** Buttons for tool selection (select, create, modify, rotate, scale, mirror), increment/decrement buttons for X, Y, Z, W dimensions, and topology options (Euclidean, Toroidal, Hyperbolic, Folded Space).
        *   **Code Highlight:**
            ```javascript
            toolButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // ...
                    switch(tool) {
                        case 'select':
                            effect.morphFactor = 0.4;
                            effect.glitchIntensity = 0.2;
                            break;
                        // ...
                    }
                });
            });
            ```

    *   **Design Patterns:**
        *   **Visuals:** Multiple mini canvases, each running an instance of the `HypercubeLatticeEffect` with pre-configured parameters to demonstrate various design applications (animated backgrounds, loaders, interactive buttons, card backgrounds, data visualization, navigation menus). Some examples include periodic animations.
        *   **Interaction:** Primarily a showcase, but the underlying `HypercubeLatticeEffect` is interactive.
        *   **Code Highlight:**
            ```javascript
            miniCanvases.forEach(canvas => {
                const type = canvas.getAttribute('data-type');
                const effect = new HypercubeLatticeEffect(canvas);
                switch(type) {
                    case 'background':
                        effect.morphFactor = 0.3;
                        // ...
                        break;
                    case 'loader':
                        // ...
                        setInterval(() => {
                            effect.rotationSpeed = 0.8 + Math.sin(Date.now() * 0.001) * 0.5;
                            effect.morphFactor = 0.5 + Math.sin(Date.now() * 0.002) * 0.3;
                        }, 50);
                        break;
                    // ...
                }
            });
            ```

    *   **Fusion Lab:**
        *   **Visuals:** A single `HypercubeLatticeEffect` canvas where the visual parameters are a weighted mix of influences from the other "universes."
        *   **Interaction:** Sliders to control the mix percentage of each universe, feature toggles to enable/disable specific influences, and preset buttons to load predefined mixes.
        *   **Code Highlight:**
            ```javascript
            function updateFusionVisualization() {
                // ... calculate mixNormalized ...
                // Timekeeper influence
                if (featureToggles.timeline.checked) {
                    effect.rotationSpeed = 0.1 + mixNormalized.timekeeper * 0.8;
                    effect.colorShift = 0.1 + mixNormalized.timekeeper * 0.1;
                }
                // Sound influence
                if (featureToggles.audio.checked) {
                    effect.glitchIntensity = 0.1 + mixNormalized.sound * 0.8;
                    effect.colorShift += mixNormalized.sound * 0.3;
                    // ... audio pulsing ...
                }
                // ... and so on for spiritual and worldbuilder influences ...
            }
            ```

*   **Key Parameters/Settings (Controlled by JavaScript, passed to WebGL shader):**
    *   `morphFactor`: Controls the morphing of the lattice.
    *   `glitchIntensity`: Controls the RGB color separation.
    *   `rotationSpeed`: Controls the rotation speed.
    *   `dimension`: Controls the 3D to 4D projection.
    *   `gridDensity`: Controls the density of the lattice.
    *   `universeModifier`: Affects the contrast and intensity of the lattice.
    *   `colorShift`: Controls the hue of the lattice colors.
    *   `patternIntensity`: Controls the blending of moiré patterns.
