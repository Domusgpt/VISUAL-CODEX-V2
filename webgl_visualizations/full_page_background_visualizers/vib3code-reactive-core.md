
### VIB3CODE - Reactive HyperAV Core

*   **File Path:** `/mnt/c/Users/millz/Desktop/vib3code-reactive-core - Copy.html`
*   **Dependencies:** WebGL, CSS3, JavaScript
*   **Visual Description:** This is an interactive, full-screen WebGL visualizer that dynamically changes its geometric theme and behavior based on user interaction (mouse movement, clicks/holds, scrolling, and inactivity). It features various 4D geometric projections (hypercube, tetrahedron, sphere, torus, Klein bottle, fractal, wave, crystal lattices) that morph and glitch. The UI is designed as a "magazine" overlay with glassmorphism effects, and the background visualizer reacts to the content being viewed.
*   **Key Features & Effects:**
    *   **Dynamic 4D Geometry Visualization:** The core effect is a WebGL shader that renders different 4D geometries projected into 3D space. The `u_geometry` uniform dynamically switches between these shapes.
    *   **Interaction-Driven Morphing & Glitch:** User interactions (mouse, scroll, hold) directly influence parameters like `morphFactor`, `glitchIntensity`, `rotationSpeed`, and `dimension`, creating a highly reactive visual experience.
    *   **Themed Visuals:** Each "section" of the magazine content is associated with a specific geometric theme (e.g., "hypercube", "tetrahedron", "sphere"), and the visualizer smoothly transitions between these themes.
    *   **Glassmorphism UI:** The "magazine" content and floating UI elements (interaction indicator, section navigator) use `backdrop-filter: blur()` to create a translucent, frosted glass effect.
    *   **Animated Title:** The main `h1` title uses a `linear-gradient` for text color and a `titlePulse` animation for a subtle glowing and scaling effect.
    *   **Hold Interaction Indicator:** A visual circle expands when the user clicks and holds, indicating a dimensional shift.
*   **Key Parameters/Settings (Shader Uniforms):**
    *   `u_resolution`: Canvas resolution.
    *   `u_time`: Elapsed time for animations.
    *   `u_mouse`: Mouse coordinates for interaction.
    *   `u_morphFactor`: Controls the morphing of the geometry.
    *   `u_glitchIntensity`: Controls the RGB color splitting glitch effect.
    *   `u_rotationSpeed`: Controls the rotation speed of the geometry.
    *   `u_dimension`: Controls the 3D to 4D projection.
    *   `u_gridDensity`: Controls the density of the lattice.
    *   `u_baseColor`: Base color for the geometry, changes with theme.
    *   `u_interactionIntensity`: Overall intensity of user interaction, affecting various visual parameters.
    *   `u_geometry`: An integer (0-7) that selects the active geometric lattice (hypercube, tetrahedron, sphere, torus, Klein, fractal, wave, crystal).
*   **Code Highlights:**

    *   **Fragment Shader (Multiple Geometries & Interaction):**
        ```glsl
        // Geometry generators (functions for hypercube, tetrahedron, sphere, torus, klein, fractal, wave, crystal)
        float getGeometryValue(vec3 p, float gridSize, float geomType) {
            if (geomType < 0.5) return hypercubeLattice(p, gridSize);
            else if (geomType < 1.5) return tetrahedronLattice(p, gridSize);
            // ... and so on for other geometries
            else return crystalLattice(p, gridSize);
        }

        void main() {
            // ...
            // Interaction-driven rotation
            float timeRotation = u_time * 0.2 * u_rotationSpeed * (1.0 + u_interactionIntensity);
            // ...
            // Apply 4D transformations based on interaction
            if (u_dimension > 3.0) {
              float w = sin(length(p) * 3.0 + u_time * 0.3) * (u_dimension - 3.0) * (1.0 + u_interactionIntensity * 0.5);
              vec4 p4d = vec4(p, w);
              // ... 4D rotations ...
              p = project4Dto3D(p4d);
            }
            // ...
            float lattice = getGeometryValue(p, dynamicGridDensity, u_geometry);
            // ...
            float glitchAmount = u_glitchIntensity * (0.1 + 0.1 * sin(u_time * 5.0)) * (1.0 + u_interactionIntensity);
            // ... RGB color splitting based on glitchAmount ...
        }
        ```

    *   **CSS (Glassmorphism & Animated Title):**
        ```css
        .section-content {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            /* ... other styles ... */
        }

        h1 {
            background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: titlePulse 3s ease-in-out infinite;
        }

        @keyframes titlePulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
        }
        ```
