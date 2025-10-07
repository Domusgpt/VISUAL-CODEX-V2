
### VIB34D Interaction Coordinator - Responsive Visual Control

*   **File Path:** `/mnt/c/Users/millz/!!prime!!VIB34D-STYLE/src/interactions/InteractionCoordinator.js`
*   **Dependencies:** JavaScript (EventTarget API)
*   **Visual Description:** This module enables highly responsive and interactive visual experiences by translating diverse user inputs into changes in the VIB34D visualizer's parameters. It supports mouse movements, clicks, keyboard presses, touch gestures, and scrolling, allowing users to directly manipulate the 4D geometries, morphing, rotation, and other visual effects.
*   **Key Features & Effects (Interaction-driven):**

    *   **Unified Input Handling:** Captures events from mouse, keyboard, touch, and scroll, providing a single interface for all user interactions.
    *   **Event Throttling:** Uses a `throttle` function to limit the rate at which events are processed, ensuring smooth performance even with rapid user input.
    *   **Gesture Recognition (Planned):** The `setupGesturePatterns` and `processGesture` methods indicate an intention to recognize complex user gestures (e.g., swipes, pinches) and map them to specific visual transformations.
    *   **Parameter Mapping:** Directly maps input data to visual parameters managed by the `VIB3HomeMaster`:
        *   **Mouse Position:** `mouseX` and `mouseY` are mapped to `morphFactor` and `dimension`, allowing users to "draw" or "sculpt" the 4D geometry.
        *   **Scroll:** `deltaY` (scroll direction) is mapped to `gridDensity`, allowing users to increase or decrease the visual complexity of the lattice.
        *   **Click/Hold:** `isDown` (click/hold state) is mapped to `rotationSpeed` and `interactionIntensity`, enabling dynamic changes in animation speed and visual responsiveness.
        *   **Keyboard:** Specific keys (1-8) are mapped to `geometry` selection, allowing users to instantly switch between different 4D shapes. Arrow keys adjust `dimension` and `rotationSpeed`, and the spacebar toggles `glitchIntensity`.
    *   **Ecosystem Reaction Coordination:** Routes processed interaction events to other system modules (like `VIB3HomeMaster`) to trigger visual updates.
*   **Code Highlights:**

    *   **`handleMouseInteraction` (Mouse to Visual Parameters):**
        ```javascript
        handleMouseInteraction(x, y, intensity = 0.5) {
            // Map mouse position to morphFactor and dimension
            const morphFactor = x * 1.5;
            const dimension = 3.0 + (y * 1.5);

            this.homeMaster.setParameter('morphFactor', morphFactor, 'mouse');
            this.homeMaster.setParameter('dimension', dimension, 'mouse');
            this.homeMaster.setParameter('interactionIntensity', intensity, 'mouse');
        }
        ```

    *   **`handleKeyboardInteraction` (Keyboard to Visual Parameters):**
        ```javascript
        handleKeyboardInteraction(key, isDown = true) {
            if (!isDown) return;

            // Geometry switching (keys 1-8)
            if (/^[1-8]$/.test(key)) {
                const geometryIndex = parseInt(key) - 1;
                this.homeMaster.setParameter('geometry', geometryIndex, 'keyboard');
                return;
            }
            // ... (other key mappings for dimension, rotationSpeed, glitchIntensity) ...
        }
        ```
