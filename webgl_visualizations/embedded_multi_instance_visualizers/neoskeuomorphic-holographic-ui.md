
### VIB3STYLEPACK - Neoskeuomorphic Holographic UI

*   **File Path:** `/mnt/c/Users/millz/vib3stylepack-v2-production/NEOSKEUOMORPHIC_HOLOGRAPHIC_UI.html`
*   **Dependencies:** WebGL, CSS3, JavaScript
*   **Visual Description:** This UI creates an immersive, multi-layered holographic experience. It features dynamically positioned "neoskeuomorphic" cards that appear to float in 3D space, each containing its own WebGL visualizer. The entire system reacts to user input (mouse, scroll, click) with subtle animations, glowing effects, and a "chaos" overlay that intensifies with interaction. The aesthetic is futuristic, with deep purples and blues, neon accents (cyan, magenta, yellow), and transparent, blurred elements.
*   **Key Features & Effects:**

    *   **Holographic Depth System:**
        *   **`holographic-container`:** Applies `perspective: 1400px` and `transform-style: preserve-3d` so nested layers retain depth when rotated as a group.
        *   **`depth-layer`:** Background, midground, foreground, and accent layers start at `translateZ(-160px)`, `-40px`, `60px`, and `120px`. Layout scripts recalculate those offsets per mode to keep the parallax spacing consistent with the GEMINI capture.
    *   **Neoskeuomorphic Cards:**
        *   **Styling:** `.neomorphic-card` stacks outer shadows (`0 28px 55px rgba(0,0,0,0.6)`), rim lights (`0 0 0 1px rgba(0,255,255,0.12)`), and inner highlights to reproduce the soft glass extrusion.
        *   **Hover Effects:** Hover transforms apply `translateZ(24px) rotateX(-4deg) rotateY(3deg)` and swap the rim lighting for a brighter cyan/magenta glow, while click states lean forward with a yellow highlight ring.
        *   **Glassmorphism:** Each card uses `backdrop-filter: blur(28px) saturate(1.4)` and pseudo-elements to paint radial bloom and inset glows.
    *   **Multi-Layered Visualizers:** Each depth layer can embed a WebGL canvas (`visualizer-canvas`), and the CSS keeps them optically distinct via `mix-blend-mode: screen`, per-layer opacity, and custom hue rotations derived from root-level CSS variables.
    *   **Dynamic Layouts:** Layout presets (HOME, TECH, MEDIA, ORBIT, FLUX) manipulate layer transforms and update CSS custom properties for depth, hue, chaos, and grid opacity. The entire container tilts based on pointer position using `rotateX/rotateY` for live parallax.
    *   **Grid Overlay System:** `.grid-overlay` builds a cross-hatched hologram with two `repeating-linear-gradient` layers (cyan horizontal, magenta vertical). The `gridPulse` animation nudges opacity and translation so the grid shimmers.
    *   **Interactive Feedback Systems:**
        *   **`interaction-ripple`:** Clicks inside the container spawn an expanding radial gradient (360px diameter) to simulate depth ripples.
        *   **Chaos Overlay:** `.chaos-overlay` toggles via control buttons and uses `@keyframes chaosFlutter` to flicker twin diagonals of cyan/magenta streaks based on `--chaos-level`.
        *   **State Indicator:** A glass info bar (`.state-indicator`) displays live depth offset, grid intensity, and chaos level, refreshing whenever the layout changes.
        *   **Control Dock:** The flex-based `.control-dock` pairs layout buttons with depth and grid glow sliders, allowing reviewers to scale `--layer-depth` via a multiplier and rewrite `--grid-opacity` without editing code.
        *   **Focus Review Chip:** A pill control labeled “focus mode” toggles a calmer `focus-mode` presentation, dimming grid overlays, tightening card glows, and updating the indicator/ARIA live region for accessibility walkthroughs.

---

#### CSS Focus Points

```css
.depth-layer {
    --layer-depth: 0px;
    --layer-tilt-x: 0deg;
    --layer-tilt-y: 0deg;
    --layer-scale: 1;
    transform: translateZ(var(--layer-depth)) rotateX(var(--layer-tilt-x)) rotateY(var(--layer-tilt-y)) scale(var(--layer-scale));
}
.depth-layer.background { --layer-depth: -160px; --layer-scale: 1.12; }
.depth-layer.accent { --layer-depth: 120px; }
.neomorphic-card:hover {
    transform: translateZ(var(--hover-lift)) rotateX(-4deg) rotateY(3deg);
}
.holographic-container[data-layout="tech"] .depth-layer.foreground { --layer-tilt-y: 6deg; }
.control-dock input[type="range"]::-webkit-slider-thumb {
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.85), rgba(255, 0, 255, 0.85));
}
```

---

#### Interactive Behaviour

*   **Layout Buttons:** Buttons with `data-layout` values call `applyLayout`, which recalculates layer transforms (`translateZ`) relative to the base depth, updates CSS variables, and refreshes the info bar.
*   **Chaos Pulses:** The `chaos` button toggles `.chaos-overlay.active` for ~880 ms, amplifying the holographic streaks and rim lighting.
*   **Pointer Parallax:** Pointer movement rotates the entire container via `rotateX/rotateY`, keeping the 3D stack dynamic regardless of scroll.
*   **Depth & Glow Dials:** The calibration range inputs multiply the base `data-depth` offsets and update `--grid-opacity`, while keeping the state indicator in sync.
*   **Focus Mode Toggle:** The focus chip in the dock calls `setFocusMode`, flipping the chip label between “ON”/“OFF,” rewriting body classes, and announcing the calmer lighting profile without disturbing active layout presets.
*   **Ripple Feedback:** Clicks retrigger the `.interaction-ripple` animation by removing and re-adding the `active` class, and a `(prefers-reduced-motion)` listener disables the ripple and pointer tilt so the deck can be inspected statically.

---

#### Demo Reference

*   The standalone demo (`demos/neoskeuomorphic-holographic-ui-demo.html`) condenses the GEMINI asset into a gallery-safe HTML file, maintaining layered depth, grid overlays, chaos pulses, ripple feedback, and now a tuning dock with layout presets, depth multipliers, and reduced-motion friendly behaviour.
