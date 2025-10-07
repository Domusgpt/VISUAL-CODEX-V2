
### MVEP Plugins - Data-to-Visual Mapping Logic

*   **File Paths:**
    *   `/mnt/c/Users/millz/Desktop/mvep-plugins/src/audioInput.js`
    *   `/mnt/c/Users/millz/Desktop/mvep-plugins/src/jsonInput.js`
*   **Dependencies:** MVEP Kernel (WebGL, GLSL)
*   **Visual Description:** These plugins act as data processors, translating raw audio or JSON data into the `dimension`, `morphing`, `color`, `rotation`, and `density` parameters of the MVEP Kernel. This allows the abstract 4D polytope visualizations to directly reflect the characteristics of the input data.
*   **Key Features & Effects (Data Mapping):**

    *   **`AudioInputPlugin`:**
        *   **Frequency Bands to Visuals:**
            *   `volume` (overall audio amplitude) maps to `dimension` (3.0-4.2). Higher volume means higher dimensionality.
            *   `bass` frequencies map to `morphing` (0.0-1.0). Stronger bass means more morphing/distortion.
            *   `pitch` maps to `color` (0.0-1.0 hue). Different pitches result in different colors.
            *   `lowMid` and `highMid` frequencies map to `rotation` speed (0.5-2.0). Mid-range audio drives rotation.
            *   `treble` frequencies map to `density` (0.5-2.0). High frequencies increase visual complexity/density.
        *   **Smoothing:** Applies exponential smoothing to audio values for smoother visual transitions.
        *   **Pitch Tracking:** Includes logic for detecting dominant pitch and converting it to musical notes.
        *   **Code Highlight:**
            ```javascript
            // Map to visualization parameters
            return {
                dimension: this._mapVolumeToDimension(this.smoothedValues.volume),
                morphing: this._mapBassToMorphing(this.smoothedValues.bass),
                color: this._mapPitchToColor(this.smoothedValues.pitch),
                rotation: this._mapMidToRotation(this.smoothedValues.lowMid, this.smoothedValues.highMid),
                density: this._mapTrebleToDensity(this.smoothedValues.treble),
                // ...
            };
            ```

    *   **`JSONInputPlugin`:**
        *   **Structure Analysis to Visuals:**
            *   `maxDepth` (nesting level) maps to `dimension` (3.0-4.5). Deeper JSON structures result in higher dimensionality.
            *   `complexity` (number of keys/elements) maps to `morphing` (0.0-1.0). More complex JSON means more morphing.
            *   `dominantType` (object, array, string, number, boolean, null) maps to `color` (0.0-1.0 hue). Different data types are represented by different colors.
            *   `totalNodes` (total elements) maps to `rotation` speed (1.0-0.2). Larger structures rotate slower.
            *   `patterns` (homogeneous, nested, homogeneous-array) influence `density`.
        *   **Configurable Mappings:** Allows for `complexityMapping` (linear, logarithmic, exponential) and `colorScheme` (type, depth, size).
        *   **Specialized Plugins:** Includes `APIResponsePlugin` (maps HTTP status codes to color, errors to max distortion) and `ConfigPlugin` (reduces rotation, increases density for config files).
        *   **Code Highlight:**
            ```javascript
            // Map to visualization parameters
            return {
                dimension: this._mapDepthToDimension(analysis.maxDepth),
                morphing: this._mapComplexityToMorphing(analysis.complexity),
                color: this._mapTypeToColor(analysis.dominantType),
                rotation: this._mapSizeToRotation(analysis.totalNodes),
                density: this._mapDensityFromStructure(analysis),
                // ...
            };
            ```
