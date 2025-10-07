
### VIB34D Preset Database - Customizable Visual Configurations

*   **File Path:** `/mnt/c/Users/millz/!!prime!!VIB34D-STYLE/src/presets/PresetDatabase.js`
*   **Dependencies:** JavaScript
*   **Visual Description:** The Preset Database allows users to define and switch between various visual and behavioral configurations of the VIB34D system. This means that complex visual effects, such as specific 4D geometries, morphing intensities, rotation speeds, glitch effects, and color schemes, can be saved, categorized, and instantly recalled. This enables a highly personalized and dynamic visual experience without requiring manual adjustment of individual parameters.
*   **Key Features & Effects (Configuration & Customization):**

    *   **Preset Storage and Management:** Stores a collection of "presets," each representing a complete configuration of the visualizer's parameters.
    *   **Categorization and Tagging:** Presets can be organized into categories (e.g., 'system', 'geometry', 'artistic', 'dynamic', 'technical', 'experimental', 'presentation') and assigned tags, making them easily discoverable.
    *   **Parameter Validation:** Ensures that loaded or saved presets contain valid parameter values, preventing visual errors or unexpected behavior.
    *   **Default Presets:** Initializes with a set of predefined presets that showcase different visual styles and effects, such as:
        *   **"Default":** Standard VIB34D configuration.
        *   **"Hypercube Focus":** Emphasizes 4D hypercube geometry with minimal morphing and low glitch.
        *   **"Fractal Dreams":** Ethereal fractal geometries with high morphing and glitch.
        *   **"Wave Interference":** Dynamic wave patterns with high responsiveness.
        *   **"Crystal Matrix":** Precise crystalline structures with minimal effects.
        *   **"Chaos Mode":** Maximum chaos and glitch effects.
        *   **"Minimal Clean":** Clean, minimal design with low intensity and no glitch.
    *   **Real-time Preset Switching:** When a preset is loaded, its parameters are applied to the `VIB3HomeMaster`, which then updates all active visualizers, resulting in an instant change in the visual display.
    *   **Visual and Behavioral Properties:** Presets can define not only numerical parameters but also visual properties (e.g., `colorScheme`, `effectIntensity`, `particleCount`, `bloomIntensity`) and behavioral properties (e.g., `autoRotation`, `mouseResponsive`, `keyboardControls`, `scrollEffects`).
*   **Code Highlights:**

    *   **`addPreset` (Preset Structure):**
        ```javascript
        this.addPreset({
            id: 'default',
            name: 'Default',
            description: 'Standard VIB34D configuration',
            category: 'system',
            tags: ['default', 'basic'],
            parameters: {
                dimension: 3.5,
                morphFactor: 0.5,
                rotationSpeed: 0.5,
                intensity: 0.8,
                glitchIntensity: 0.5,
                gridDensity: 12.0,
                interactionIntensity: 0.3,
                geometry: 0, // Index of Hypercube
                animationSpeed: 1.0
            },
            visual: {
                colorScheme: 'neon',
                effectIntensity: 0.8,
                particleCount: 1000,
                bloomIntensity: 0.6
            },
            behavior: {
                autoRotation: true,
                mouseResponsive: true,
                keyboardControls: true,
                scrollEffects: true
            }
        });
        ```

    *   **`loadPreset` (Applying Parameters):**
        ```javascript
        loadPreset(presetData) {
            // ...
            for (const [name, value] of Object.entries(presetData.parameters)) {
                this.setParameter(name, value, 'preset'); // Calls HomeMaster's setParameter
            }
            // ...
        }
        ```
