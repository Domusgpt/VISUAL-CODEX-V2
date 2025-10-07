
### VIB34D Moiré RGB Effects Demo

*   **File Path:** `/mnt/c/Users/millz/vib3stylepack-v2-production/VIB34D_MOIRE_RGB_DEMO.html`
*   **Dependencies:** CSS3, JavaScript (VIB34D_MOIRE_RGB_SYSTEM.js, VIB34D_ENHANCED_MOIRE_INTEGRATION.js - external scripts)
*   **Visual Description:** This demo features a dark, cyberpunk-inspired theme with prominent neon magenta and cyan colors. It showcases various Moiré RGB interference patterns and their responsiveness to user controls. The UI is clean and functional, emphasizing the visual effects themselves.
*   **Key Features & Effects:**

    *   **Overall Theme:** Dark background (`#000`), with text in neon magenta (`#ff00ff`) and neon cyan (`#00ffff`).
    *   **`demo-title`:** Large, centered text with a strong neon magenta color and `text-shadow` for a glowing effect.
    *   **`demo-subtitle`:** Smaller, centered text in neon cyan, providing a subtle contrast.
    *   **`demo-card` (General Styling):**
        *   **Background:** Semi-transparent white (`rgba(255, 255, 255, 0.05)`).
        *   **Border:** 1px solid neon magenta (`rgba(255, 0, 255, 0.3)`).
        *   **Border-radius:** 12px.
        *   **Transition:** Smooth `all 0.3s ease` for hover effects.
        *   **Hover Effect:**
            *   `transform: translateY(-5px)`: Lifts the card slightly.
            *   `box-shadow: 0 10px 30px rgba(255, 0, 255, 0.3)`: Adds a glowing shadow in neon magenta.
    *   **`demo-visualizer` (Embedded within `demo-card`):**
        *   **Background:** Radial gradient from semi-transparent neon magenta to dark (`radial-gradient(circle, rgba(255, 0, 255, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%)`).
        *   **Border:** 1px solid neon cyan (`rgba(0, 255, 255, 0.3)`).
        *   **Purpose:** These are containers for the actual Moiré RGB visualizers, which are likely rendered by the external JavaScript files.
    *   **`controls-panel`:**
        *   **Background:** Semi-transparent black (`rgba(0, 0, 0, 0.7)`).
        *   **Border:** 1px solid neon magenta (`rgba(255, 0, 255, 0.5)`).
        *   **Border-radius:** 12px.
        *   **`controls-title`:** Centered text in neon magenta.
    *   **Slider Controls (`input[type="range"]`):**
        *   **Thumb:** Neon magenta circle with a neon cyan border and a strong `box-shadow` glow (`0 0 15px rgba(255, 0, 255, 0.8)`).
        *   **Track:** Linear gradient from neon magenta to neon cyan (`linear-gradient(90deg, #ff00ff, #00ffff)`).
        *   **`control-value`:** Displays the current slider value, likely updated by JavaScript.
    *   **Control Buttons (`.control-button`):**
        *   **Default:** Semi-transparent neon magenta background (`rgba(255, 0, 255, 0.1)`), neon magenta text and border.
        *   **Hover Effect:**
            *   `background: rgba(255, 0, 255, 0.3)`: Increases background opacity.
            *   `transform: translateY(-2px)`: Lifts the button slightly.
            *   `box-shadow: 0 5px 20px rgba(255, 0, 255, 0.4)`: Adds a glowing shadow.
        *   **Active State (`.active` class):**
            *   `background: rgba(255, 0, 255, 0.5)`: Darker background.
            *   `box-shadow: 0 0 20px rgba(255, 0, 255, 0.8)`: Stronger glow.
    *   **`status-display`:**
        *   **Background:** Semi-transparent black (`rgba(0, 0, 0, 0.8)`).
        *   **Border:** 1px solid neon cyan (`rgba(0, 255, 255, 0.5)`).
        *   **`status-label`:** Neon cyan text.
        *   **`status-value`:** White bold text.
    *   **`interaction-hint`:** Dashed border in semi-transparent white, providing visual guidance.
*   **Code Highlights:**

    *   **CSS (Demo Card Hover):**
        ```css
        .demo-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(255, 0, 255, 0.3);
        }
        ```

    *   **CSS (Slider Thumb & Track):**
        ```css
        .control-item input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            background: #ff00ff;
            border: 2px solid #00ffff;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(255, 0, 255, 0.8);
        }
        .control-item input[type="range"]::-webkit-slider-track {
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, #ff00ff, #00ffff);
            border-radius: 2px;
        }
        ```

    *   **CSS (Control Button Active State):**
        ```css
        .control-button.active {
            background: rgba(255, 0, 255, 0.5);
            box-shadow: 0 0 20px rgba(255, 0, 255, 0.8);
        }
        ```
