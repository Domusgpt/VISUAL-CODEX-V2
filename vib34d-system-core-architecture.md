
### VIB34D System - Core Architecture for Visualizer Management

*   **File Paths:**
    *   `/mnt/c/Users/millz/!!prime!!VIB34D-STYLE/src/core/VIB3HomeMaster.js`
    *   `/mnt/c/Users/millz/!!prime!!VIB34D-STYLE/src/core/VIB3SystemController.js`
*   **Dependencies:** JavaScript (ES6 Modules), EventTarget API
*   **Visual Description:** These modules establish a robust framework for dynamic, data-driven visualizations. They enable real-time control over visual parameters, cross-visualizer synchronization, and responsive interaction. The system is designed to manage multiple visualizer instances, each potentially displaying different 4D geometries and effects, all coordinated through a central parameter authority.
*   **Key Features & Effects (Architectural):**

    *   **`VIB3HomeMaster.js` (Central Parameter Authority):**
        *   **Unified Parameter State:** Maintains a single source of truth for all visual parameters (e.g., `dimension`, `morphFactor`, `rotationSpeed`, `glitchIntensity`, `gridDensity`, `geometry`, `globalTime`).
        *   **Parameter Validation:** Ensures that parameter updates are within defined ranges and types, preventing visual glitches or errors.
        *   **Cross-Visualizer Synchronization:** Distributes parameter updates to all registered visualizer instances, ensuring they display a consistent or coordinated visual state.
        *   **Interaction Mapping:** Translates user input (mouse, scroll, keyboard) into changes in visual parameters, enabling highly interactive experiences. For example, keyboard input can cycle through geometries or adjust parameters.
        *   **Preset Management:** Integrates with a `PresetDatabase` to load and save visual configurations.
        *   **Code Highlight (Parameter Update & Sync):**
            ```javascript
            setParameter(name, value, source = 'api') {
                // ... validation ...
                this.parameters[name] = value;
                // ... notify reactivity bridge ...
                this.syncParameterToVisualizers(name, value, source);
                // ... emit event ...
            }
            ```

    *   **`VIB3SystemController.js` (Top-Level Coordinator):**
        *   **Modular System:** Orchestrates the initialization, start, stop, and destruction of various system modules (HomeMaster, VisualizerPool, GeometryRegistry, etc.), ensuring a structured and scalable visual system.
        *   **Event Routing:** Manages a central event bus, routing user input, parameter updates, and system events to the appropriate modules. This allows for complex interactions where, for example, a user input event can trigger a parameter change in the HomeMaster, which then updates multiple visualizers.
        *   **Performance Monitoring:** Integrates with a `PerformanceMonitor` to track FPS and memory usage, allowing the system to adapt its visual complexity for optimal performance.
        *   **Dynamic Visualizer Management:** Coordinates with the `VisualizerPool` to create and manage instances of visualizers, enabling a dynamic display of multiple visual effects.
        *   **Code Highlight (Event Routing):**
            ```javascript
            routeEvent(eventType, eventData, source = 'unknown') {
                const routes = this.eventRouter.get(eventType);
                // ...
                routes.forEach(moduleName => {
                    const module = this.modules[moduleName];
                    if (module && typeof module.handleEvent === 'function') {
                        // ... call module.handleEvent ...
                    }
                });
                // ...
            }
            ```
