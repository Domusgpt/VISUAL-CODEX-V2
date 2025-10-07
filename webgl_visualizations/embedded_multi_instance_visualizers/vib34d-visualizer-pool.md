
### VIB34D Visualizer Pool - Dynamic Visualizer Management

*   **File Path:** `/mnt/c/Users/millz/!!prime!!VIB34D-STYLE/src/managers/VisualizerPool.js`
*   **Dependencies:** JavaScript (WebGL context management)
*   **Visual Description:** The Visualizer Pool enables the VIB34D system to dynamically create, manage, and update multiple WebGL visualizer instances. This allows for complex visual layouts, such as dashboards with several interactive 4D geometries running simultaneously, or dynamic switching between different visualizer types. It ensures efficient resource allocation and smooth performance even with many active visual elements.
*   **Key Features & Effects (Management & Orchestration):**

    *   **Instance Creation and Destruction:** Manages the lifecycle of visualizer instances, allowing the system to dynamically add or remove visual elements from the display.
    *   **Resource Management:** Handles WebGL context creation and destruction for individual visualizers, and includes logic for context loss recovery, ensuring visual stability.
    *   **Instance Pooling and Recycling:** Supports pooling of visualizer instances to reduce overhead when creating new visualizers, and can recycle older instances to manage resource limits. This contributes to smoother visual transitions and overall system responsiveness.
    *   **Parameter Propagation:** Receives parameter updates from the `VIB3HomeMaster` and propagates them to the relevant visualizer instances, ensuring that all active visualizers reflect the current system state or user interactions. This enables synchronized visual changes across multiple displays.
    *   **Geometry Type Registration:** Registers different visualizer types (e.g., `VIB34D_MOIRE`, `VIB34D_POLYTOPAL`), each with its own resource profile and default role, allowing the system to instantiate various visual effects.
    *   **Performance Monitoring:** Tracks performance metrics across all instances, which can be used by the `VIB3SystemController` to optimize visual complexity and maintain target FPS.
    *   **Default Instance Initialization:** Can initialize a default layout of visualizer instances (e.g., a main "board" visualizer and several "card" visualizers), creating an immediate visual experience upon system startup.
*   **Code Highlights:**

    *   **`createInstance` (Dynamic Visualizer Instantiation):**
        ```javascript
        async createInstance(typeName, canvasElement, role = null, config = {}) {
            // ...
            const visualizerClass = window[typeConfig.className]; // Assumes visualizer classes are globally available
            // ...
            const visualizer = new visualizerClass(
                canvasElement,
                role || typeConfig.defaultRole,
                instanceId
            );
            // ...
        }
        ```

    *   **`updateInstanceParameters` (Parameter Propagation):**
        ```javascript
        updateInstanceParameters(instanceId, parameters) {
            const instance = this.instances.get(instanceId);
            // ...
            if (instance.visualizer && typeof instance.visualizer.setParameters === 'function') {
                instance.visualizer.setParameters(parameters);
                instance.lastUpdate = Date.now();
                return true;
            }
            // ...
        }
        ```
