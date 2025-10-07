
### Unified 4D Visualization Engine - Live Demo

*   **File Path:** `/mnt/c/Users/millz/unified-4d-visualization-package/index.html`
*   **Dependencies:** WebGL, CSS3, JavaScript
*   **Visual Description:** This is a full-page WebGL visualizer that renders a 4D hypercube lattice. It's highly interactive, allowing users to control various parameters (dimension, morph factor, rotation speed, grid density) through sliders and mouse/scroll interactions. The visualizer dynamically changes its appearance based on these parameters, creating a fluid and responsive abstract display. It also features a "proof banner" and status overlays, emphasizing its live demo nature.
*   **Key Features & Effects:**

    *   **Full-Page WebGL Canvas:** The `#mainCanvas` fills the entire viewport, providing an immersive visual experience.
    *   **Interactive 4D Hypercube Lattice:**
        *   **`calculateLattice` (Shader):** This core function in the fragment shader generates the 4D hypercube lattice. It incorporates dynamic `gridDensity` and `lineThickness` influenced by `audioBass` and `audioMid` (simulated by scroll and click interactions).
        *   **4D Rotations (`rotXW`, `rotYZ`, `rotZW`):** The shader explicitly defines and applies 4D rotation matrices, driven by `u_time`, `u_rotationSpeed`, and simulated audio parameters (`u_audioHigh`, `u_audioMid`, `u_audioBass`).
        *   **4D to 3D Projection (`project4Dto3D`):** A working projection function maps the 4D points to 3D space for rendering.
        *   **Dynamic W-coordinate:** The 4th dimension (`w_coord`) is dynamically calculated based on spatial position, time, morph factor, and simulated audio, contributing to the complex morphing.
        *   **Blending of 3D and 4D Lattices:** The `mix` function blends the 3D and 4D lattice calculations based on `u_morphFactor`, creating a smooth transition between different dimensional representations.
    *   **Coloring and Glow:** The lattice is colored using `u_primaryColor`, `u_secondaryColor`, and `u_backgroundColor`, with a glow effect (`glow`) influenced by `lattice` intensity and simulated audio (`u_audioHigh`, `u_audioMid`).
    *   **Mouse Interaction:** Mouse position (`u_mouse`) directly influences the lattice's position (`p.xy += mouseOffset * 0.3`), allowing users to control the focus point of the visualization.
    *   **Scroll and Click Interactions (Simulated Audio):** Scroll events are mapped to `audioBass` and click events to `audioMid`, which then influence the visualizer's parameters, creating a responsive feedback loop.
    *   **Live Demo UI Elements:**
        *   **`proof-banner`:** A large, pulsing (`@keyframes pulse`) banner that highlights the live demo status.
        *   **`controls-overlay`:** A floating panel with sliders and buttons to control the visualizer parameters.
        *   **`status-overlay`:** A floating panel displaying real-time engine status (FPS, WebGL version, canvas size, interaction status) with a blinking `working-indicator`.
        *   **`instructions`:** A panel providing guidance on how to interact with the demo.
*   **Code Highlights:**

    *   **Shader (`fragmentShaderSource` in `Unified4DEngine` class):**
        ```glsl
        // WORKING 4D HYPERCUBE LATTICE CALCULATION
        float calculateLattice(vec3 p) {
            // ...
            // 4D extension - THIS IS THE REAL 4D MATH
            float dim_factor = smoothstep(3.0, 4.5, u_dimension);
            if (dim_factor > 0.01) {
                // Calculate 4th dimension coordinate
                float w_coord = sin(p.x*1.4 - p.y*0.7 + p.z*1.5 + u_time * 0.25)
                              * cos(length(p) * 1.1 - u_time * 0.35 + u_audioMid * 2.5)
                              * dim_factor * (0.4 + u_morphFactor * 0.6 + u_audioHigh * 0.6);

                // Create 4D point
                vec4 p4d = vec4(p, w_coord);

                // Apply 4D rotations - ACTUAL 4D ROTATIONS
                p4d = rotXW(u_time * 0.33 * u_rotationSpeed + u_audioHigh * 0.25) *
                      rotYZ(u_time * 0.28 * u_rotationSpeed - u_audioMid * 0.28) *
                      rotZW(u_time * 0.25 * u_rotationSpeed + u_audioBass * 0.35) * p4d;

                // Project back to 3D
                vec3 projectedP = project4Dto3D(p4d);

                // Calculate 4D lattice
                // ...
                return mix(lattice3D, lattice4D, smoothstep(0.0, 1.0, u_morphFactor));
            }
            return lattice3D;
        }
        ```

    *   **CSS (Proof Banner Pulse Animation):**
        ```css
        .proof-banner {
            /* ... */
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
        }
        ```
