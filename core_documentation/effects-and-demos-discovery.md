# Effects & Demos Discovery Log

_Last updated: 2025-10-07 22:05 UTC_

## Wave 1 Snapshot
| Asset | Baseline Observations | Enhancements Implemented | Twin/Cousin Opportunities |
| --- | --- | --- | --- |
| `effects/holographic-visualizer.html` | Continuous animation loop lacked reduced-motion guardrails and there was no discoverable preference control. Mouse sensitivity spikes on high-intensity presets could induce motion sickness. | Added a reduced-motion control synced with system preferences, dampened animation math, and smoothed mouse influence/geometry scaling so the experience remains legible at lower energy. | Millz variant can lean into occult overlays with the new motion state toggles powering slower ritual pulses. |
| `effects/holographic-pulse-system.html` | Layered CSS animations defaulted to aggressive timing. No way to calm “quantum” effects or stop the 100 ms fluctuation timer. Keyboard users had to absorb flicker during exploration. | Introduced toolbar motion toggle, scaled all CSS custom properties when reduction is active, throttled quantum interval, and rewired JS interactions to respect calmer settings. | Vib3 twin can inherit the calmer baseline and swap in crystalline gradients without reworking interaction scaffolding. |
| `demos/holographic-particle-system-demo.html` | Particle factory spawned 200 ms loops with no pause logic; hover transforms were abrupt and inaccessible to motion-sensitive users. | Added global reduced-motion toggle, rebuilt particle scheduler with adaptive cadence, softened hover transforms, and updated UI controls to play nicely with paused states. | Millz cousin can reuse the new motion orchestration while introducing parchment textures and rune-based cards. |

## Wave 2 Snapshot
| Asset | Baseline Observations | Enhancements Implemented | Twin/Cousin Opportunities |
| --- | --- | --- | --- |
| `demos/holographic-depth-layers-demo.html` | Perspective and floating modes spun up instantly with no awareness of `prefers-reduced-motion`, and hover scaling snapped to 110 % regardless of sensitivity. | Added a motion toggle tied to system settings, scaled rotation/float durations with a motion factor, softened hover scaling via CSS variables, and refreshed status text to explain overrides. | Millz depth twin can re-skin calmer layers with ritual glyphs knowing the float/rotation math now honors accessibility toggles. |
| `demos/holographic-progress-indicators-demo.html` | Four indicator types pulsed on tight two-second loops with no descriptive control states, and random segment updates fired at a fixed cadence. | Introduced a reduced-motion control panel, rewired animation intervals to respect a motion factor, added pause/resume semantics, and stabilized assistive copy for the live controls. | Vib3 crystalline dashboard twin can inherit the calmer cadence and expose theme presets without reimplementing animation governance. |
| `demos/holographic-parallax-systems-mega-demo.html` | Ultra-bright filters, 2× hover scaling, and randomized activations created relentless motion with no opt-out. Timers and parallax offsets ignored system preferences. | Wired a header toggle that syncs to system settings, throttled parallax intensity, slowed activation cadence, lightened CSS filters, and centralized timer management for calmer states. | Millz control-room cousin can drop in ceremonial overlays and reuse the calmer activation scheduler to support ritual pacing. |

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

### demos/holographic-depth-layers-demo.html
- Motion toolbar reuses the plan’s hover/rotation UX, adds system-synced assistive copy, and converts hover scaling into motion-aware transforms.
- Layer separation readouts now update every depth badge, and the reduced-motion mode tempers float/rotation durations without breaking presets.
- Follow-up: capture before/after GIFs of static/rotating/floating modes for the documentation library.

### demos/holographic-progress-indicators-demo.html
- New motion controls slow shimmer, pulse, and conic rotations while keeping manual pause/resume accessible.
- Random refresh cadence now stretches under calmer settings, and the reduced-motion text surfaces whether the system or user override is in play.
- Follow-up: audit color contrast on the calmer state to ensure the darker background still meets AA when animations are slowed.

### demos/holographic-parallax-systems-mega-demo.html
- Header toggle syncs with system preferences, lightens global filters, and trims hover scaling to 1.35× when calmer pacing is active.
- Random activation and auto-cycle timers now restart whenever the motion state changes, avoiding runaway intervals and aligning scroll/mouse intensity with accessibility needs.
- Follow-up: produce a calmer-mode screenshot set for the twin storyboard and evaluate generating the missing 25 parallax variants on a future sweep.

## QA & Verification Checklist
- [x] Manual DOM inspection to confirm reduced-motion toggles update ARIA live regions and checkbox states.
- [x] Verified that disabling particles pauses interval timers to prevent runaway loops.
- [ ] Capture video clips for knowledge base (queued).
- [ ] Add automated assertion for reduced-motion class in gallery smoke tests.

## Next Sweep
1. Produce annotated screenshots for each modified experience and drop them into the shared media library.
2. Plan contrast + accessibility audit for hover states introduced by the calmer presets.
3. Queue Vib3/Millz twin storyboard drafts leveraging the new motion state hooks.
