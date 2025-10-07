
### RGB Moiré Hypercube Lattice

*   **File Path:** `/mnt/c/Users/millz/Desktop/moire-hypercube-project/moire-hypercube-pppalpha.html`
*   **Dependencies:** WebGL, CSS3
*   **Visual Description:** This is a WebGL-based animation that creates a morphing lattice grid. The grid can transform from a 3D cube into a 4D hypercube (tesseract). It features an RGB color splitting "glitch" effect and creates moiré patterns by overlaying grids. The overall aesthetic is a "vaporwave" style, with neon colors and a dark background. The effect is interactive, with mouse position and sliders controlling various parameters.
*   **Key Parameters/Settings:**
    *   **`morphFactor`**: Controls the morphing between a standard grid and a distorted, hypercube-like grid.
    *   **`dimension`**: Controls the transition from a 3D cube to a 4D hypercube projection.
    *   **`glitchIntensity`**: Controls the amount of RGB color separation.
    *   **`rotationSpeed`**: Controls the speed of the automatic rotation.
    *   **`gridDensity`**: Controls the density of the grid lines.
*   **Code Highlights:**

    *   **Fragment Shader (`<script>` tag):**
        ```glsl
        // Create a hypercube (tesseract) lattice
        float hypercubeLattice(vec3 p, float morphFactor, float gridSize) {
            // ...

            // Apply 4D rotation projection when morphing to a hypercube
            if (u_dimension > 3.0) {
              // Create a 4D point by extending our 3D point
              float w = sin(length(p) * 3.0 + u_time * 0.3) * (u_dimension - 3.0);
              vec4 p4d = vec4(distortedP, w);

              // Apply 4D rotations
              p4d = rotateXW(timeFactor * 0.31) * p4d;
              p4d = rotateYW(timeFactor * 0.27) * p4d;
              p4d = rotateZW(timeFactor * 0.23) * p4d;

              // Project back to 3D
              distortedP = project4Dto3D(p4d);
            }

            // ...
        }
        ```

    *   **CSS (`<style>` tag):**
        ```css
        h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, var(--color-primary), var(--color-tertiary));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 8px rgba(255, 0, 255, 0.6);
            text-transform: uppercase;
            margin-bottom: 10px;
        }
        ```
