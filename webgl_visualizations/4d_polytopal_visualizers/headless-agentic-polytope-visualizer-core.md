
### Headless Agentic Polytope Visualizer - Core & Shader Details

*   **File Paths:**
    *   `/mnt/c/Users/millz/Desktop/visualizer-core-refactor-kernal/HypercubeCore.js`
    *   `/mnt/c/Users/millz/Desktop/visualizer-core-refactor-kernal/ShaderManager.js`
*   **Dependencies:** WebGL2 (with fallback to WebGL1), GLSL
*   **Visual Description:** This system renders N-dimensional polytopes (Hypercube, Hypersphere, Hypertetrahedron, Duocylinder) with dynamic visual properties. The visualizer is designed to be controlled by external data streams (`dataChannels`) from agentic systems, allowing for real-time representation of abstract data. It features advanced shader-based effects including:
    *   **Parameterized Geometry:** Each polytope type has a rich set of uniform parameters that control its density, line thickness, shell width, and complex W-coordinate transformations.
    *   **Dynamic 4D Rotations:** Rotations in 4D space are controlled by time, morph factors, and `dataChannels`, creating intricate and evolving movements.
    *   **Data-Driven Visuals:** The `pmk_channels` (dataChannels) array in the shader directly influences various visual aspects, such as camera rotation, color shifting, and glitch intensity, making the visualization a direct reflection of the agent's internal state or data.
    *   **RGB Glitch & Moiré:** Similar to previous findings, it includes RGB color splitting and moiré patterns, but these are now also influenced by `dataChannels`.
    *   **FullScreenLatticeEffect:** A dedicated rendering path for a full-screen lattice effect, with its own set of detailed parameters for line width, vertex size, distortion, and glow.
*   **Key Parameters/Settings (Shader Uniforms, controlled by `HypercubeCore.js`):**
    *   **Global Uniforms:** `u_time`, `u_resolution`, `u_mouse`, `u_dimension`, `u_morphFactor`, `u_rotationSpeed`, `u_universeModifier`, `u_patternIntensity`, `u_gridDensity`, `u_glitchIntensity`, `u_colorShift`, `u_primaryColor`, `u_secondaryColor`, `u_backgroundColor`.
    *   **`u_isFullScreenEffect` (new):** An integer flag (0 or 1) to switch between standard SDF rendering and a full-screen lattice effect.
    *   **`pmk_channels[64]` (new):** A Uniform Buffer Object (UBO) in WebGL2 (or individual uniforms in WebGL1) that holds 64 float values representing data streams from the agentic system. These channels are extensively used to drive visual parameters.
    *   **Projection-Specific Uniforms:** Detailed parameters for `perspective` and `stereographic` projections, including `baseDistance`, `morphFactorImpact`, and `channelImpact`.
    *   **Geometry-Specific Uniforms:** Each geometry type (Hypercube, Hypersphere, Hypertetrahedron, Duocylinder) has a unique set of uniforms to control its specific visual properties, such as:
        *   `geom_hypercube_gridDensity_channel0Factor`, `geom_hypercube_rotXW_channel2Factor`, `geom_hypercube_wCoord_pCoeffs1`, etc.
        *   `geom_hsphere_density_channel0Factor`, `geom_hsphere_shellWidth_channel1Factor`, `geom_hsphere_wCoord_pCoeffs`, etc.
        *   `geom_htetra_density_channel0Factor`, `geom_htetra_thickness_channel1Factor`, `geom_htetra_wCoord_pCoeffsCos`, etc.
        *   `geom_duocyl_r1_base`, `geom_duocyl_r2_channel0Factor`, `geom_duocyl_wCoord_len_pXY_Factor`, etc.
    *   **FullScreenLatticeEffect Uniforms:** `u_gridDensity_lattice`, `u_lattice_edgeLineWidth`, `u_lattice_vertexSize`, `u_lattice_distortP_morphCoeffs`, `u_lattice_glitch_rOffsetCoeffs`, `u_lattice_moire_mixCoeffs`, `u_lattice_glow_color`, etc.
*   **Code Highlights:**

    *   **`HypercubeCore.js` (UBO Initialization and Update):**
        ```javascript
        _initOrUpdateGlobalDataUBO(dataArray) {
            if (!this.isWebGL2) return;
            // ... (sets data into globalDataBuffer and updates UBO) ...
        }

        updateParameters(newParams) {
            // ...
            if (key === 'dataChannels') {
                if (this.isWebGL2) {
                    this._initOrUpdateGlobalDataUBO(newValue);
                } else {
                    // ... (WebGL1 fallback for dataChannels) ...
                }
                continue;
            }
            // ...
        }
        ```

    *   **`ShaderManager.js` (Fragment Shader Injection & UBO Declaration):**
        ```glsl
        // Injected into fragment shader
        //__GEOMETRY_CODE_INJECTION_POINT__ // This will now contain both calculateLattice and getLatticeEffectColor

        layout(std140) uniform GlobalDataBlock {
            float pmk_channels[64]; // Start with 64 floats
        };

        void main() {
            vec3 finalColor;

            if (u_isFullScreenEffect == 1) {
                // FullScreenLatticeEffect path
                finalColor = getLatticeEffectColor(v_uv, u_time, u_resolution, u_mouse,
                                                   u_morphFactor, u_glitchIntensity, u_rotationSpeed,
                                                   u_dimension, u_gridDensity_lattice);
            } else {
                // Standard SDF rendering path
                // ...
                float camRotY = u_time * 0.05 * u_rotationSpeed + pmk_channels[1] * 0.1;
                float camRotX = sin(u_time * 0.03 * u_rotationSpeed) * 0.15 + pmk_channels[2] * 0.1;
                // ...
                if (abs(u_colorShift) > 0.01) {
                    vec3 hsv = rgb2hsv(finalColor);
                    hsv.x = fract(hsv.x + u_colorShift * 0.5 + pmk_channels[2] * 0.1);
                    finalColor = hsv2rgb(hsv);
                }
                // ...
            }
            gl_FragColor = vec4(finalColor, 1.0);
        }
        ```
