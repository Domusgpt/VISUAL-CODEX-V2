
### MVEP Kernel - Advanced 4D Data Visualization

*   **File Path:** `/mnt/c/Users/millz/Desktop/mvep-kernel/README.md`
*   **Dependencies:** WebGL, GLSL
*   **Visual Description:** The MVEP Kernel is a WebGL-based engine designed to transform any data stream into higher-dimensional polytopal projections. It visualizes N-dimensional polytopes (Hypercube, Hypersphere, Hypertetrahedron, Duocylinder) with dynamic geometric forms. The visualization is driven by incoming data, allowing for real-time representation of data complexity, structure patterns, type diversity, and change rates.
*   **Key Features & Effects:**
    *   **True 4D Mathematics:** Utilizes six-axis rotation matrices (XY, XZ, XW, YZ, YW, ZW) for accurate 4D geometry manipulation.
    *   **Moiré Hypercube Projection:** Features an advanced shader capable of generating moiré patterns and RGB splitting effects, which are influenced by data parameters.
    *   **Data-Driven Morphing:** Real-time parameter mapping allows data streams to directly control visual properties like:
        *   **Dimension (3.0-4.5):** Data complexity maps to the 4D-ness level.
        *   **Morphing (0.0-1.0):** Structure patterns map to shape transformation.
        *   **Color (0.0-1.0):** Type diversity maps to the RGB spectrum.
        *   **Rotation (0.0-2.0):** Change rate maps to 4D rotation speed.
        *   **Density (0.3-2.0):** Detail level maps to grid complexity.
    *   **Extensible Plugin Architecture:** Designed to integrate with various data types through plugins (e.g., JSON, time series, audio input).
    *   **High Performance:** Optimized for 60fps rendering on modern GPUs.
    *   **EMA Compliant:** Supports export capabilities (PNG, MP4, JSON) and parameter history for data portability.
*   **Code Highlights (from `README.md`):**

    *   **4D Rotation Matrix (GLSL):**
        ```glsl
        // Six-axis 4D rotation matrices
        mat4 rotateXW(float theta) {
            float c = cos(theta);
            float s = sin(theta);
            return mat4(
                c, 0, 0, -s,
                0, 1, 0, 0,
                0, 0, 1, 0,
                s, 0, 0, c
            );
        }
        ```

    *   **Moiré Pattern Generation (GLSL):**
        ```glsl
        // Advanced interference patterns for data complexity
        float moireGrid1 = hypercubeLattice(p, morphFactor, gridDensity * 1.01);
        float moireGrid2 = hypercubeLattice(p, morphFactor, gridDensity * 0.99);
        float moire = abs(moireGrid1 - moireGrid2) * 0.5;
        ```

    *   **RGB Color Splitting (GLSL):**
        ```glsl
        // Data-driven color channel displacement
        vec2 rOffset = vec2(glitchAmount, glitchAmount * 0.5);
        vec2 gOffset = vec2(-glitchAmount * 0.3, glitchAmount * 0.2);
        vec2 bOffset = vec2(glitchAmount * 0.1, -glitchAmount * 0.4);
        ```
