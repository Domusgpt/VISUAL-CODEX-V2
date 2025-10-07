
### MVEP Kernel - Advanced & Configurable Visualizations

*   **File Paths:**
    *   `/mnt/c/Users/millz/Desktop/mvep-kernel/src/MVEPKernel-Advanced.js`
    *   `/mnt/c/Users/millz/Desktop/mvep-kernel/src/MVEPKernel-Configurable.js`
*   **Dependencies:** WebGL, GLSL
*   **Visual Description:** This is a highly flexible WebGL-based engine for visualizing N-dimensional polytopes (primarily hypercubes in the provided shaders) where visual parameters are directly mapped from arbitrary data streams. It allows for deep customization of how data influences the visualization, including dynamic dimension scaling, morphing, color, rotation, and density. The visual output is a dynamic, abstract representation of data structures, with advanced moiré patterns and RGB splitting effects.
*   **Key Features & Effects:**
    *   **User-Configurable Dimension Scaling:** The `MVEPKernelConfigurable` allows setting `minDimension`, `maxDimension`, `defaultDimension`, and `scaleType` (linear, logarithmic, exponential) for how data complexity maps to the visual dimension.
    *   **User-Configurable Encoding Mappings:** This is a major new feature. Users can define how specific data properties (e.g., `depth`, `complexity`, `typeVariety`, `changeRate`, `detailLevel`) are transformed and mapped to visual parameters (`dimension`, `morphing`, `color`, `rotation`, `density`). It supports custom transform functions and custom data analysis.
    *   **Configurable Shader Parameters:** The `shaderConfig` allows control over `hypercubeVertices`, `rotationAxes`, `moireComplexity`, `rgbSplitting`, and `perspectiveDepth`, enabling fine-grained control over the shader's visual output.
    *   **Dynamic N-Dimensional Rotations:** The `_generateRotationMatrices` and `_generateDynamicRotations` functions in `MVEPKernel-Configurable.js` dynamically generate GLSL code for rotation matrices up to 6D (XY, XZ, XW, YZ, YW, ZW, XV, YV, ZV, WV, XU, YU, ZU, WU, VU), allowing for visualization of higher-dimensional data.
    *   **Configurable Moiré Patterns:** The `_generateMoirePatterns` function allows setting the `moireComplexity`, which generates multiple layers of moiré interference patterns in the shader.
    *   **Configurable RGB Splitting:** The `rgbSplitting` flag in `shaderConfig` allows enabling/disabling the RGB color channel offset effect.
    *   **Configurable Color Mapping:** The `_generateColorMapping` function allows selecting different color palettes (`spectrum`, `thermal`, `plasma`) based on the `encodingConfig`, enabling thematic color changes based on data.
*   **Code Highlights:**

    *   **`MVEPKernel-Configurable.js` (Dynamic Shader Generation - `_generateConfigurableFragmentShader`):**
        ```javascript
        // Generates the fragment shader dynamically based on configuration
        const fragmentShaderSource = this._generateConfigurableFragmentShader();
        ```

    *   **`MVEPKernel-Configurable.js` (N-Dimensional Rotation Matrix Generation):**
        ```javascript
        _generateRotationMatrices(maxDim) {
            let matrices = '';
            const axes = ['x', 'y', 'z', 'w', 'v', 'u']; // Up to 6D
            // ... (loops to generate mat4 rotateXX functions) ...
            return matrices;
        }
        ```

    *   **`MVEPKernel-Configurable.js` (Data Mapping and Transformation):**
        ```javascript
        _updateVisualizationFromData() {
            // ...
            Object.keys(this.encodingConfig.mappings).forEach(param => {
                const mapping = this.encodingConfig.mappings[param];
                const dataValue = analysis[mapping.dataProperty] || 0;
                let transformedValue = this._applyTransform(dataValue, mapping.transform, mapping);
                // ... (clamping and assignment) ...
            });
            // ...
        }
        ```
