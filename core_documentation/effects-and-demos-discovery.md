# Effects & Demos Discovery Log

_Last updated: 2025-10-07 20:44 UTC_

## Wave 1 Snapshot
| Asset | Baseline Observations | Enhancements Implemented | Twin/Cousin Opportunities |
| --- | --- | --- | --- |
| `effects/holographic-visualizer.html` | Continuous animation loop lacked reduced-motion guardrails and there was no discoverable preference control. Mouse sensitivity spikes on high-intensity presets could induce motion sickness. | Added a reduced-motion control synced with system preferences, dampened animation math, and smoothed mouse influence/geometry scaling so the experience remains legible at lower energy. | Millz variant can lean into occult overlays with the new motion state toggles powering slower ritual pulses. |
| `effects/holographic-pulse-system.html` | Layered CSS animations defaulted to aggressive timing. No way to calm “quantum” effects or stop the 100 ms fluctuation timer. Keyboard users had to absorb flicker during exploration. | Introduced toolbar motion toggle, scaled all CSS custom properties when reduction is active, throttled quantum interval, and rewired JS interactions to respect calmer settings. | Vib3 twin can inherit the calmer baseline and swap in crystalline gradients without reworking interaction scaffolding. |
| `demos/holographic-particle-system-demo.html` | Particle factory spawned 200 ms loops with no pause logic; hover transforms were abrupt and inaccessible to motion-sensitive users. | Added global reduced-motion toggle, rebuilt particle scheduler with adaptive cadence, softened hover transforms, and updated UI controls to play nicely with paused states. | Millz cousin can reuse the new motion orchestration while introducing parchment textures and rune-based cards. |

## Field Notes
### effects/holographic-visualizer.html
- Canvas render pipeline now respects `prefers-reduced-motion` and the inline toggle, cutting particle velocity and oscillation amplitude when active.
- Motion state transitions sync UI text, mouse sensitivity, and theme intensity without interfering with existing theme buttons.
- Follow-up: capture before/after FPS metrics to ensure motion damping does not regress performance on high-refresh displays.

### effects/holographic-pulse-system.html
- Motion toolbar anchors above the control stack, avoiding overlap with the info panel.
- `syncMotionState` feeds every slider through a scaling function so presets still work while honoring calmer intensity caps.
- Reduced-motion burst effects trim saturation spikes and shorten burst duration to 600 ms, lowering flash risk.
- Follow-up: author screenshot set covering reduced-motion versus full-motion states for the documentation hub.

### demos/holographic-particle-system-demo.html
- Particle scheduler now respects pause toggles and system preferences, including longer lifetimes and slower spawn cadence in calm mode.
- Mouse parallax math and moiré toggles consume the global motion flag so spatial interactions stay readable on sensitive devices.
- Follow-up: extend puppeteer smoke test to verify the reduced-motion toggle toggles `body.reduced-motion-active` for regression coverage.

## QA & Verification Checklist
- [x] Manual DOM inspection to confirm reduced-motion toggles update ARIA live regions and checkbox states.
- [x] Verified that disabling particles pauses interval timers to prevent runaway loops.
- [ ] Capture video clips for knowledge base (queued).
- [ ] Add automated assertion for reduced-motion class in gallery smoke tests.

## Next Sweep
1. Produce annotated screenshots for each modified experience and drop them into the shared media library.
2. Plan contrast + accessibility audit for hover states introduced by the calmer presets.
3. Queue Vib3/Millz twin storyboard drafts leveraging the new motion state hooks.
