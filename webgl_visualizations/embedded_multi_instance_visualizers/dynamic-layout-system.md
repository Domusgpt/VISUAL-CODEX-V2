
### VIB3STYLEPACK - Dynamic Layout System

*   **File Path:** `/mnt/c/Users/millz/vib3stylehyperavjules/DYNAMIC_LAYOUT_SYSTEM.html`
*   **Dependencies:** WebGL, CSS3, JavaScript
*   **Visual Description:** This system creates a dynamic and interactive user interface where content cards and a background visualizer seamlessly transition between different predefined layouts. The aesthetic is futuristic, with a dark background, neon accents (cyan, magenta, yellow, green, pink), and glassmorphism effects. User interaction (mouse movement, scroll) influences the visualizers and can trigger "chaos" effects.
*   **Key Features & Effects:**

    *   **Dynamic Layout Transitions:**
        *   **`main-container`:** The main container dynamically changes its CSS class (`layout-home`, `layout-tech`, `layout-media`, `layout-audio`, `layout-quantum`) to apply different grid-based layouts to the floating cards.
        *   **`floating-card`:** These cards are positioned absolutely and use `backdrop-filter: blur(15px)` for glassmorphism. They have a `transition: all 1.2s cubic-bezier(...)` for smooth, complex animations when their position, size, or shape changes during layout transitions.
    *   **Multi-Instance Visualizers:**
        *   **`visualizer-board`:** A full-screen WebGL visualizer acts as a dynamic background.
        *   **`card-visualizer`:** Each floating card contains its own WebGL visualizer instance, allowing for localized visual effects within each content area.
        *   **Instance-Specific Parameters:** Visualizers have `instanceParams` (density multiplier, speed multiplier, color shift, intensity) that vary based on whether they are the board visualizer or a card visualizer, creating diverse visual behaviors.
    *   **Particle System:** A JavaScript-generated particle system (`.particle-system`) creates floating particles (`.particle`) with radial gradients and an `animation: floatParticle` that makes them move upwards and fade in/out, adding a subtle ambient visual effect.
    *   **Scroll-Driven Chaos Overlay:**
        *   **`scroll-progress`:** A vertical scrollbar with a multi-color linear gradient fill (`.scroll-fill`) that indicates scroll progress.
        *   **`chaos-overlay`:** A fixed overlay with repeating linear gradients (magenta and cyan) that becomes `active` and flickers (`chaosFlicker` animation) with increased opacity based on scroll accumulation, simulating a "chaos" or "glitch" effect.
    *   **State Controls:** A floating control bar (`.state-controls`) with circular "state dots" (`.state-dot`) that represent different visual states/layouts. The active dot has a vibrant linear gradient background (cyan to magenta) and a strong `box-shadow` glow, and scales up.
    *   **Enhanced Typography & UI Buttons:** Text elements have neon glow effects (`text-shadow`), and buttons (`.ui-button`) have `linear-gradient` backgrounds, `border` with transparency, `border-radius`, `text-shadow` for glow, and `backdrop-filter: blur()`. On hover, they `translateY` and gain `box-shadow` with intensified neon glows.
*   **Code Highlights:**

    *   **CSS (Floating Card Transitions & Glassmorphism):**
        ```css
        .floating-card {
            position: absolute;
            backdrop-filter: blur(15px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 5;
            transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth, complex transition */
            overflow: hidden;
            box-shadow:
                0 10px 30px rgba(0, 0, 0, 0.3),
                inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }
        ```

    *   **CSS (Particle System Animation):**
        ```css
        .particle {
            /* ... */
            animation: floatParticle 8s infinite linear;
        }
        @keyframes floatParticle {
            0% { opacity: 0; transform: translateY(100vh) scale(0); }
            10% { opacity: 1; transform: translateY(90vh) scale(1); }
            90% { opacity: 1; transform: translateY(10vh) scale(1); }
            100% { opacity: 0; transform: translateY(0) scale(0); }
        }
        ```

    *   **JavaScript (`DynamicLayoutVisualizer` - Embedded Shader):**
        ```glsl
        // Enhanced geometry functions (hypercube, tetrahedron, sphere, torus, wave)
        float hypercubeLattice(vec3 p, float gridSize) { /* ... */ }
        // ...
        // Enhanced effects (rgbGlitch, moirePattern)
        vec3 rgbGlitch(vec3 color, vec2 uv, float intensity) { /* ... */ }
        float moirePattern(vec2 uv, float intensity) { /* ... */ }
        // ...
        void main() {
            // ...
            // Deliberate 4D space
            // ...
            // Add effects during chaos
            color += vec3(moirePattern(uv, u_chaosIntensity));
            color = rgbGlitch(color, uv, u_chaosIntensity);
            // ...
        }
        ```
