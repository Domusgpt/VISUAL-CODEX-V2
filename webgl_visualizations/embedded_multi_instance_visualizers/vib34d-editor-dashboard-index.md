### VIB34D Editor Dashboard – Holographic Index Cards

*   **File Path:** `C:\\Users\\millz\\vib34d-editor-dashboard-2025-06-28-GEMINI\\archive\\unused-html\\index.html`
*   **Dependencies:** CSS3 (custom properties, filters, conic gradients), JavaScript (parameter randomization, interactive sequencing)
*   **Visual Summary:** The archived index page hosts the GEMINI dashboard's holographic card presets. Each card renders a mini visualizer tile, breathes with layered gradients, and pivots in 3D space while exposing morphing parameters. Clicking any card unleashes a 25-state cascade that rewires hue, glitch, density, morph, and layout selections in rapid succession, mirroring the prototype's randomized hologram previews.

---

#### Holographic Card Styling

*   **CSS Custom Properties:**
    *   `--hue`, `--glow-rgb`, `--grid-angle`, and `--grid-size` drive gradients, scan-line overlays, and animated grids per card.
    *   `--tilt-x`, `--tilt-y`, and `--lift` coordinate the 3D transform stack (`perspective(800px) rotateX(...) rotateY(...) translateY(...)`) for hover and click depth.
*   **Layered Effects:**
    *   Base background uses dual `radial-gradient` sources plus a `conic-gradient` for neon flares inside `.visualizer-preview`.
    *   Scan lines live on a pseudo-element with `repeating-linear-gradient` and `mix-blend-mode: screen` to emulate RGB grid shimmer.
    *   Card frames rely on stacked `box-shadow` declarations: global drop shadow, 1px holographic outline, and a cyan/magenta glow intensified on hover/active.
*   **Glassmorphism:** `backdrop-filter: blur(22px)` combined with `saturate(var(--saturation))` mirrors the flashing holographic surfaces documented in the GEMINI archive.
*   **Cascade Controls:** The `.control-panel` introduces a speed slider that rewrites `--cascade-delay`, an auto toggle rendered as a gradient pill switch, a palette selector that swaps between "Aurora Cascade", "Circuit Bloom", and "Luminous Grid" backgrounds by rewriting root custom properties, and a reset button that restores defaults while announcing the change through the status region.

---

#### Interactive Logic & Randomized Cascades

*   **25-State Sequencer:** Each click builds an array of 25 randomized states. Parameters include `hue`, `gradientSkew`, `gridSize`, `morph`, `rotation`, `glitch`, and a `dimension` label (`2.5D` → `XR`). A layout label is pulled from the card's serialized `data-layouts` list.
*   **Dynamic Pacing:** `setTimeout` advances through the 25 states at a delay defined by the `#speedControl` slider (`--cascade-delay`), so reviewers can slow cascades down or trigger instant updates when reduced motion is requested.
*   **Global Pulse Control:** The "pulse 25 states" control offsets the cascade trigger for each card, recreating the orchestrated randomization bursts captured in the archive footage.
*   **Auto Cascade:** Toggling the auto switch spins up an interval that replays the cascade on a loop, updating the status readout with manual vs. auto provenance and halting automatically when `(prefers-reduced-motion)` is detected.
*   **Color Conversion:** A small helper converts HSL hue values to RGB strings so the card glow (`--glow-rgb`) and drop shadows reflect the active palette.

---

#### Usage Notes

*   The demo (`demos/vib34d-editor-dashboard-index-demo.html`) reproduces the holographic cards, gradient grids, 25-iteration cascade, and now the pacing slider, auto loop, palette selector, and resettable status readout so testers can document behaviours without editing source.
*   Cards remain responsive down to 320 px widths thanks to `auto-fit` grid templates and clamped padding, keeping the GEMINI-era layout accessible for mobile previews, and `(prefers-reduced-motion)` requests automatically disable the auto loop and collapse delays.
