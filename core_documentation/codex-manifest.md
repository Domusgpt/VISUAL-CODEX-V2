# **CODEX MANIFEST**

**Last Updated:** 2025-06-30

This document provides a high-level manifest of all components currently cataloged in claude.md. It details their source, dependencies, and core parameters for reuse.

## **Core Systems**

### **\[CS-01\] VIB3CODE \- Reactive HyperAV Core**

* **Codex Entry:** claude.md\#vib3code---reactive-hyperav-core  
* **Source Project:** C:\\Users\\millz\\Vib3Code\\vib3code-reactive-core \- Copy.html  
* **Dependencies:**  
  * A single \<canvas\> element (e.g., \#reactive-canvas).  
  * IntersectionObserver for section-based theme switching.  
* **Key Parameters (JS themeConfigs object):**  
  * baseColor: \[R, G, B\] array for theme color.  
  * gridDensity: float for lattice density.  
  * morphFactor: float for geometric morphing.  
  * dimension: float for 3D/4D morphing.  
  * geometry: string ('hypercube', 'tetrahedron', etc.) to select GLSL function.

### **\[CS-02\] Enhanced Vaporwave System**

* **Codex Entry:** claude.md\#enhanced-vaporwave-system  
* **Source Project:** C:\\Users\\millz\\VaporwaveSystem\\ENHANCED\_VAPORWAVE\_SYSTEM.html  
* **Dependencies:**  
  * Five \<canvas\> elements (\#instance-0 through \#instance-4).  
  * Multiple divs for content overlays.  
* **Key Parameters (JS instanceParams object):**  
  * densityMult: float multiplier for instance-specific density.  
  * speedMult: float multiplier for instance-specific animation speed.  
  * colorShift: float for hue shift.  
  * intensity: float for brightness/opacity.

## **UI Element Suites**

### **\[UI-01\] Neoskeuomorphic Holographic UI Kit**

* **Codex Entry:** claude.md\#neoskeuomorphic-holographic-ui-kit  
* **Source Project:** C:\\Users\\millz\\HoloUI\\NEOSKEUOMORPHIC\_HOLOGRAPHIC\_UI.html  
* **Dependencies:**  
  * CSS variables for color theme (e.g., \--primary-color, \--dark-shadow, \--holographic-blue).  
  * Google Fonts: 'Orbitron'.  
* **Usage:** Apply classes like .holographic-text, .holographic-input, .holographic-toggle-switch to standard HTML elements.

## **Standalone Visualizers**

### **\[SV-01\] Moire 4D Polytopal Visualizer**

* **Codex Entry:** claude.md\#moire-4d-polytopal-visualizer-hypercube  
* **Source Project:** C:\\Users\\millz\\MoireHypercube\\moire-hypercube-pppalpha.html  
* **Dependencies:**  
  * A single \<canvas\> element.  
  * Optional sliders (\<input type="range"\>) for interactive control.  
* **Key Parameters (JS Uniforms):**  
  * u\_morphFactor: float (0.0 to 1.0) for 3D-4D morphing.  
  * u\_glitchIntensity: float for RGB glitch effect.  
  * u\_gridDensity: float for lattice density.