# Visual Codex Manifest
## High-Level Component Registry

### Purpose
This manifest provides a quick reference for all cataloged visual components, their dependencies, and key parameters for reuse.

---

## Expansion Phases

To double the registry while maintaining clarity, the catalog is expanded in five deliberate phases:

1. **Phase 1 – HyperAV Foundations (Entries 1–5):** Original core rendering engines and style packs that define the Visual Codex baseline.
2. **Phase 2 – Advanced Dynamics (Entries 6–10):** High-fidelity motion systems and choreography layers that deepen the interactive vocabulary.
3. **Phase 3 – Orchestration & Frameworks (Entries 11–18):** Control infrastructure, context management, and mathematical toolkits that power the ecosystem.
4. **Phase 4 – Immersive Gallery Experiences (Entries 19–26):** New dimensional gallery shells showcasing distinct navigation paradigms and portal metaphors.
5. **Phase 5 – Mobile, QA & Operations (Entries 27–34):** Touch-native builds, automated validation suites, and operational tooling that keep the codex production-ready.

---

## Cataloged Components

### 1. VIB3CODE - Reactive HyperAV Core
- **Source**: vib3code-reactive-core.html
- **Dependencies**: Vanilla JavaScript, `<canvas>` 2D context, optional Web Audio API hook
- **Core Modules**:
  - `HyperAvEngine`: Boots render loop, orchestrates geometry updates, and maintains FPS targets.
  - `AudioReactiveController`: Binds microphone/track input, normalizes amplitudes, and exposes beat events.
  - `ThemePalette`: Derives chroma shifts, bloom intensity, and holographic overlays from codex-wide tokens.
- **Key Parameters**:
  - `HYPERCUBE_VERTICES` (16): Defines the 4D structure before projection collapse.
  - `ROTATION_SPEED` (0.001–0.008): Six-axis spin rate blended with beat timing.
  - `REACTIVE_THRESHOLD` (0.35–0.65): Energy gating for triggering full spectral shifts.
  - `AUDIO_DAMPING` (0.2): Prevents abrupt geometry snapping during quiet passages.
- **Feature Highlights**:
  - Hybrid Canvas/WebGL pipeline with graceful fallback for low-power devices.
  - Built-in performance telemetry overlay with target FPS and delta-time readings.
  - Palette inheritance ensures visual continuity with downstream codex shells.
- **Integration Considerations**:
  - Exposes `window.VIB3CODE.init(container, options)` bootstrap entry.
  - Accepts JSON patch files for parameter overrides without editing source.
  - Ships accessibility banner describing audio-reactive behavior for compliance reviews.
- **Primary Use**: Hero module powering real-time 4D visualizations that respond fluidly to ambient or curated audio feeds.

### 2. Enhanced Vaporwave System
- **Source**: enhanced-vaporwave-system/
- **Dependencies**: CSS Custom Properties, CSS3 keyframes, SVG filters, optional Web Fonts
- **Core Modules**:
  - `neon-grid.css`: Defines grid backdrops, scanline overlays, and CRT curvature simulations.
  - `vaporwave-panels.js`: Generates hero copy cards, glitch dividers, and timed entrance animations.
  - `palette-tuner.json`: Houses sixteen curated palettes mapped to tokyo, miami, and midnight variants.
- **Key Parameters**:
  - `--vaporwave-primary` / `--vaporwave-secondary`: Neon duo-tone anchor hues.
  - `--ambient-noise-opacity` (0.05–0.12): VHS grain density controlling visual noise.
  - `animation-duration` (2s–10s): Tempo slider for lane parallax and floating icon loops.
  - `scanline-tilt` (0deg–6deg): CRT distortion intensity for retro authenticity.
- **Feature Highlights**:
  - Offers both "Arcade" (high energy) and "Cassette" (lo-fi) layout presets via body data attributes.
  - Includes keyboard-navigable carousel that mirrors pointer interactions for accessibility compliance.
  - Integrates cameo slots for WebGL canvases, ensuring smooth blend between CSS shell and 3D showcases.
- **Integration Considerations**:
  - Delivered as drop-in `/css` and `/js` bundles with documented import order.
  - Supports theming through CSS variables and optional JSON tokens read by `vaporwave-panels.js`.
  - Ships with `aria-live="polite"` announcements when scenes swap to guide screen reader users.
- **Primary Use**: Signature retro-futuristic UI kit establishing the codex’s tone for marketing pages, launchers, and event microsites.

### 3. Dynamic Layout System
- **Source**: dynamic-layout-system/
- **Dependencies**: CSS Grid, Intersection Observer API, Resize Observer, Vanilla JS utilities
- **Core Modules**:
  - `layout-engine.js`: Calculates breakpoints, density targets, and orchestrates section reveals.
  - `motion-timeline.css`: Houses shared easing curves and keyframes for enter/exit choreography.
  - `data/portal-map.json`: Declarative mapping of cards, categories, and pinned callouts.
- **Key Parameters**:
  - `grid-template-columns`: Auto-responsive with density goals for XS/S/M/L breakpoints.
  - `transition-duration` (0.45s–0.75s): Controls card fade/scale interplay.
  - `scroll-threshold` (0.35–0.65): Intersection ratio required before a portal locks into the narrative.
  - `layoutMode`: `"gallery"`, `"timeline"`, or `"magazine"` for alternative card compositions.
- **Feature Highlights**:
  - Multi-column to single-column morphing with preserved focus order for keyboard navigation.
  - Intelligent lazy loading pipeline that batches fetches by section to avoid network spikes.
  - Deep-linking with hash state replay, ensuring users can bookmark specific cards.
- **Integration Considerations**:
  - Accepts JSON configuration; update `portal-map.json` to curate new experiences without touching markup.
  - Emits custom events (`layout:sectionEnter`, `layout:sectionLeave`) consumed by orchestration engines later in the codex.
  - Provides SCSS mixins for aligning bespoke components with default spacing scale.
- **Primary Use**: Adaptive content lattice delivering smooth transitions and narrative cohesion across desktop, tablet, and mobile contexts.

### 4. Neoskeuomorphic Holographic UI Kit
- **Source**: neoskeuomorphic-holographic-ui/
- **Dependencies**: CSS Custom Properties, `backdrop-filter`, Houdini Paint API (optional), Vanilla JS helpers
- **Core Modules**:
  - `holo-elements.css`: Defines card frames, rotary knobs, glass buttons, and depth shadows.
  - `gloss-controller.js`: Applies light direction, reflection speed, and reactive shimmer to interactive elements.
  - `holo-token-map.json`: Tokenizes radius, blur, and glow values for consistent scaling across breakpoints.
- **Key Parameters**:
  - `--holographic-angle` (30deg–60deg): Determines the prismatic gradient sweep.
  - `--depth-shadow`: Multi-layer box-shadow stack customizing perceived depth.
  - `--glass-blur` (6px–18px): Controls translucency and readability within glass panes.
  - `--accent-spectrum`: Array of neon stops to dial color richness.
- **Feature Highlights**:
  - Accessible focus rings tuned to stand out against glass surfaces without breaking aesthetic.
  - Optional Houdini paint module generates micro-texture for ultra high-end renders.
  - Includes Figma token export to synchronize design tooling with production values.
- **Integration Considerations**:
  - Provide semantic HTML structures; kit enhances rather than replaces markup semantics.
  - Use the supplied `prefers-reduced-transparency` query to fall back to solid backgrounds for sensitive users.
  - Pair with `gloss-controller.js` in orchestration mode to sync lighting with scene context.
- **Primary Use**: Premium skeuomorphic interface kit delivering tactile, holographic controls for dashboards and launch surfaces.

### 5. Moiré 4D Polytopal Visualizer
- **Source**: moire-hypercube-pattern/
- **Dependencies**: Canvas API (primary), WebGL optional for extended shader set, Web Workers for heavy math offload
- **Core Modules**:
  - `PolytopalGenerator`: Produces vertex/edge lists for hypercubes, prisms, and custom polytopes.
  - `MoireInterferenceEngine`: Calculates layered grid collisions and chromatic offsets per frame.
  - `RenderDirector`: Chooses Canvas vs. WebGL pipeline based on device performance heuristics.
- **Key Parameters**:
  - `DIMENSION` (4–6): Governs source polytope before projection to 3D space.
  - `PROJECTION_DISTANCE` (1.5–3.0): Alters perspective depth, balancing clarity and intensity.
  - `MOIRE_SCALE` (1.5–2.5): Adjusts interference density for different display resolutions.
  - `OSCILLATION_RATE` (0.25–1.75): Synchronizes pattern breathing with ambient audio or manual controls.
- **Feature Highlights**:
  - Supports deterministic seed loading, enabling art directors to reproduce exact pattern states.
  - Web Worker mode maintains >55 FPS even during deep interference sequences.
  - Ships with print/export helper to capture stills at poster-grade resolutions.
- **Integration Considerations**:
  - Provide container element with explicit width/height for best projection fidelity.
  - Register optional `onStateChange` callback to coordinate color palette swaps with surrounding UI.
  - Combine with `AudioReactiveController` from Entry 1 for unified beat syncing across experiences.
- **Primary Use**: Precision mathematical visualizer delivering mesmerizing interference patterns suitable for hero sections, ambient displays, and performance art installations.

---

### 6. Elegant 4D Flow Visualizer
- **Source**: Desktop/629claude/ElegantVisualCore.js
- **Dependencies**: WebGL 2, requestAnimationFrame, Lightweight EventEmitter utility
- **Core Modules**:
  - `FlowFieldController`: Computes curl noise vectors across 4D lattices and emits normalized force maps per frame.
  - `ParticleIntegrator`: Maintains GPU buffer pools, applies RK4 integration, and rebuilds trails when attractors shift.
  - `LightingDirector`: Evaluates three-point lighting rig, Bloom kernel, and HDR tonemapping for cinematic depth.
- **Key Parameters**:
  - `flowSpeed` (0.1–2.0): Governs overall vector field velocity; values >1.6 require thermal throttling to stay <8ms frame time.
  - `particleCount` (50–500): Auto-switches between instanced rendering and sprite batching based on GPU benchmarks.
  - `eleganceLevel` (0.0–1.0): Blends between chaotic and balletic easing curves for motion arcs.
  - `dimensionBlend` (3.0–4.5): Interpolates additional axis projections; >4.2 unlocks kaleidoscopic overlays.
  - `colorHarmony` (0.0–1.0): Tunes golden-ratio palette offsets and accent bloom intensity.
  - `organicFlow` (0.0–1.0): Activates biologically inspired flow seeds, including flocking and pseudo-biological membranes.
- **Feature Highlights**:
  - GPU timer queries expose per-stage timings, enabling ops teams to flag regressions across drivers.
  - Ships with `FlowField.lab` preset library covering oceanic, aurora, and nebula scenarios for rapid art direction.
  - Exposes HDR frame capture routine exporting EXR sequences for motion graphics handoff.
- **Integration Considerations**:
  - Mount via `ElegantFlow.init(canvas, config)` after verifying WebGL2 availability; fallback renders animated PNG sequences.
  - Hook `FlowFieldController` events into codex orchestration buses to synchronize ambient flows with narrative beats.
  - Use `performanceBudget` option to cap GPU utilization on laptops; system auto-tunes particleCount + bloom passes.
- **Primary Use**: Sophisticated organic 4D visualizer delivering atmospheric hero backgrounds and live performance visuals.

### 7. Narrative Choreography Engine
- **Source**: Desktop/629claude/NarrativeChoreographyEngine.js
- **Dependencies**: DOM APIs, IntersectionObserver, requestIdleCallback, CSS custom properties
- **Core Modules**:
  - `NarrativeTimeline`: Parses JSON chapters, maps scroll percentages to narrative milestones, and stores reversible states.
  - `GestureBridge`: Harmonizes wheel, touch, keyboard, and gamepad input into standardized `momentum` signals.
  - `SceneDirector`: Manages staged transitions, orchestrates `transform`/`opacity` choreography, and triggers narration cues.
- **Key Parameters**:
  - `scrollRange` (0.0–1.0): Defines activation span per scene; overlapping ranges create cross-fades.
  - `triggerPoint` (0.1–0.9): Precise entry threshold supporting pre-roll animations and anticipation effects.
  - `emotionalTone`: Enum mapping to curated easing + color palettes (serene, urgent, triumphant, enigmatic).
  - `transformationType`: Library of motion archetypes (magnitude-reveal, concept-merge, fractal-fan, rapid-point-sequence).
  - `reversible` (boolean): Enables backwards playback when users scrub upward or use keyboard reverse commands.
  - `choreography`: Multi-element timing bundles referencing `coordinated-emergence`, `orbiting-focus`, etc.
- **Feature Highlights**:
  - JSON schema validation with TypeScript definitions ensures editor tooling catches misconfigured scenes early.
  - Supports narrative bookmarking; URL hashes restore user position and rehydrate in-flight transitions.
  - Accessibility narration hooks surface ARIA live-region summaries synchronized with major scene pivots.
- **Integration Considerations**:
  - Pair with `Dynamic Layout System` events to coordinate card reveals and headline swaps.
  - Provide `prefers-reduced-motion` alt timeline definitions to respect user comfort settings.
  - Extend via plugin slots that allow injecting bespoke transitions without modifying core engine.
- **Primary Use**: JSON-driven choreography platform for scroll or input-driven storytelling sequences across the codex.

### 8. Insane Hyperdimensional Matrix
- **Source**: Desktop/629claude/InsaneGeometry.js
- **Dependencies**: WebGL 2, Floating-point framebuffer extension, GPUCompute harness, optional WebAudio analyser
- **Core Modules**:
  - `RealityDistortionKernel`: GLSL compute pipeline blending chaotic attractors with hypercube tessellation inputs.
  - `TemporalWarpDirector`: Governs time dilation, frame blending, and glitch cascades tied to tempo envelopes.
  - `QuantumFluxRouter`: Routes audio or interaction energy into parameter envelopes controlling chaos states.
- **Key Parameters**:
  - `chaosLevel` (0.0–10.0): Multi-band slider gating fractal recursion depth, glitch intensity, and channel separation.
  - `dimensionBreak` (3.0–8.0): Expands base dimension set; >6 toggles hypersphere overlays and lensing shaders.
  - `timeWarp` (0.1–50.0): Alters internal tick rate; values >25 require `frameSmoothing` to maintain readability.
  - `fractalDepth` (1–20): Controls recursion loops, automatically enabling compute shaders for values >12.
  - `quantumTunnel` (0.0–5.0): Injects stochastic color tunneling derived from quantum random number seeds.
  - `realityBend` (0.0–100.0): Distorts projection matrix; pair with `stabilityGuard` to avoid viewer disorientation.
  - `hyperspaceFlow` (0.0–20.0): Governs vector field swirling overlays for sense of motion across layers.
- **Feature Highlights**:
  - Internal watchdog monitors GPU memory and flips to adaptive LOD when VRAM consumption exceeds 60%.
  - Offers cinematic preset stack (Surreal Ballet, Event Horizon, Neon Storm) for quick show-floor setups.
  - Emits performance telemetry to codex diagnostics dashboard, including GPU frame time and shader compilation metrics.
- **Integration Considerations**:
  - Requires instantiation within isolated `<canvas>` element; share context carefully to prevent driver crashes.
  - Provide audio analyser feed for best results; fallback uses pseudo-random seeds synchronized to BPM estimates.
  - Tweak `comfortMode` flag when deploying to public kiosks to restrict chaosLevel/timeWarp range.
- **Primary Use**: Mind-bending 4D+ showcase for exhibitions, product reveals, and immersive stage visuals demanding spectacle.

### 9. MVEP Enhanced 4D Hypercube
- **Source**: Desktop/629claude/MVEPEnhancedGeometry.js
- **Dependencies**: WebGL, Web Audio API, Optional MIDI input, GPU timer queries
- **Core Modules**:
  - `MVEPHypercube`: Extensible geometry builder generating animated vertex buffers for multiple hyper shapes.
  - `AudioModulator`: Converts audio spectral data into normalized energy bands and envelopes.
  - `GlitchDirector`: Applies RGB channel offsets, datamosh-inspired smear effects, and afterimage persistence.
- **Key Parameters**:
  - `dimension` (3.0–5.0): Switches core geometry; 5.0 introduces 5D slicing overlays.
  - `morphFactor` (0.0–1.5): Interpolates between base hypercube and alternative geometries (prisms, crystalline states).
  - `rotationSpeed` (0.0–3.0): Controls multi-axis rotation; `syncToBeat` toggles quantized rotation resets.
  - `gridDensity` (5.0–25.0): Adjusts lattice resolution; values above 18 auto-enable instancing optimizations.
  - `moireScale` (0.95–1.05): Fine-tunes interference layering; small adjustments yield dramatic moiré shifts.
  - `glitchIntensity` (0.0–0.2) & `colorShift` (-1.0–1.0): Determine chromatic aberration and hue cycling.
  - `audioBands`: `bassLevel`, `midLevel`, `highLevel`, `pitchFactor` feed reactive modulation curves.
- **Feature Highlights**:
  - Preset sequencer allows directors to queue visual states aligned with live setlists or interactive cues.
  - Supports multi-canvas deployment with shared audio bus, enabling panoramic stage installations.
  - Generates metadata snapshots for archival, capturing parameter states and showtime annotations.
- **Integration Considerations**:
  - Invoke `MVEP.start(canvas, audioContext, options)` and register fallback loops when audio permissions are denied.
  - Sync with codex orchestration `layout:sectionEnter` to pivot geometry around narrative beats.
  - Provide `safetyBounds` to limit glitch intensity on devices with lower persistence displays.
- **Primary Use**: Audio-reactive hypercube engine powering headline codex demos and live performance backgrounds.

### 10. Elegant Motion CSS Animation System
- **Source**: Desktop/629claude/elegant-motion.css
- **Dependencies**: CSS custom properties, `prefers-reduced-motion` media query, progressive enhancement JS hooks
- **Core Modules**:
  - `motion-tokens.css`: Defines velocity ramps, bezier curves, and timing stacks reused across codex shells.
  - `atmospheric-backdrops.css`: Crafts layered gradients, animated noise, and parallax planes.
  - `interaction-states.js`: Optional JS helper toggling advanced focus states, halo pulses, and accessibility callouts.
- **Key Parameters**:
  - `--motion-duration` tokens (`xs`–`xl`): Standardized timings for consistent cross-component rhythm.
  - `--glassmorphic-opacity` (0.65–0.9): Controls translucency for cards and overlays.
  - `--glitch-border-strength` (0.0–1.0): Dial RGB border intensity, automatically clamped for readability.
  - `--hover-elevation` (6px–32px): Governs layered shadow stacks for depth illusions.
- **Feature Highlights**:
  - Includes focus-visible enhancements with dual ring styling to satisfy WCAG contrast requirements.
  - Provides fallback static states for email or PDF exports via `body[data-static-mode]` override.
  - Harmonizes typography through curated variable font pairings, ensuring consistent rhythm across viewport sizes.
- **Integration Considerations**:
  - Import `motion-tokens.css` before component-specific styles to avoid cascade conflicts.
  - Expose configuration via CSS variables; link with design tokens exported from Neoskeuomorphic kit for parity.
  - Attach optional `interaction-states.js` if advanced hover/focus choreography is required.
- **Primary Use**: Comprehensive CSS motion system infusing codex interfaces with refined, accessible animation behavior.

### 11. Comprehensive Interaction System
- **Source**: Desktop/629claude/InteractionCoordinator.js
- **Dependencies**: JSON config loader, `HomeMaster` base shell, DOM APIs, ResizeObserver, Pointer Events
- **Core Modules**:
  - `InteractionRegistry`: Maps subjects, siblings, ancestors, and ecosystem targets with relationship metadata.
  - `InputMuxer`: Normalizes keyboard, mouse, touch, gamepad, and sensor streams into unified action payloads.
  - `ResponseOrchestrator`: Queues animations, triggers class toggles, and dispatches custom events with priority handling.
- **Key Parameters**:
  - `interactionBlueprints`: JSON definition including targets, triggers, and response chains.
  - `gestureSensitivity` (0.25–1.5): Scales input thresholds for subtle vs. dramatic user actions.
  - `maxConcurrentResponses` (3–12): Prevents queue thrashing while preserving reactive feel.
  - `telemetrySampleRate` (250–2000ms): Governs logging cadence for analytics dashboards.
- **Feature Highlights**:
  - Built-in conflict resolver ensures overlapping blueprints gracefully degrade based on scope priority.
  - Exposes `InteractionInspector` debug overlay highlighting active relationships and recent triggers.
  - Provides accessibility bridging: keyboard shortcuts mirror gesture cues, and focus states propagate through relation map.
- **Integration Considerations**:
  - Load configuration via `InteractionCoordinator.loadBlueprints(jsonUrl)` during system boot.
  - Subscribe to `interaction:responseStart` events for synchronization with audio or lighting systems.
  - Use `scopedDisable` helper when overlays or modals require temporary interaction suspension.
- **Primary Use**: Unified interaction layer coordinating responsive behavior across the codex’s multi-surface experiences.

### 12. System Orchestration Engine
- **Source**: Desktop/629claude/SystemController.js
- **Dependencies**: JsonConfig, HomeMaster, VisualizerPool, InteractionCoordinator, EventEmitter
- **Core Modules**:
  - `BootSequencer`: Executes dependency graph, performs capability detection, and hydrates global state stores.
  - `EventBridge`: Brokers cross-module events with namespacing, throttling, and replay buffers.
  - `StateSupervisor`: Monitors performance metrics, toggles fallbacks, and handles error recovery workflows.
- **Key Parameters**:
  - `bootPhases`: Ordered array defining initialization steps and required modules.
  - `fallbackPolicies`: Declarative rules for downgrading effects when GPU, memory, or network health falters.
  - `heartbeatInterval` (2–10s): Governs system health pings feeding telemetry dashboards.
  - `moduleRegistry`: Metadata map describing active visualizers, inputs, and orchestration clients.
- **Feature Highlights**:
  - Hot-reload capability watches JSON configs and reinitializes modules without page refresh.
  - Provides timeline tracer for debugging cross-module events and verifying sequencing integrity.
  - Emits runtime contract checks, ensuring required APIs are available before enabling advanced modules.
- **Integration Considerations**:
  - Instantiate once via `SystemController.bootstrap(options)`; treat as singleton within codex environment.
  - Register additional modules with `controller.registerModule(name, instance, capabilities)`.
  - Surface telemetry to ops via the built-in `controller.attachTelemetryReporter(reporterFn)` hook.
- **Primary Use**: Central nervous system orchestrating boot, state management, and resilience for VIB34D deployments.

### 13. WebGL Context Management System
- **Source**: Desktop/629claude/VisualizerPool.js
- **Dependencies**: GeometryRegistry, HomeMaster, WebGL APIs, OffscreenCanvas (optional)
- **Core Modules**:
  - `ContextAllocator`: Negotiates WebGL contexts, enforces pooling limits, and handles context loss recovery.
  - `RenderScheduler`: Coordinates frame rendering across multiple visualizers using time-sliced scheduling.
  - `ResourceCache`: Shares shaders, buffers, and textures to minimize duplication across active canvases.
- **Key Parameters**:
  - `maxContexts` (2–6): Upper bound for concurrent WebGL contexts before fallback to static renders.
  - `targetFPS` (30–90): Dynamically adjusts scheduling cadence to maintain smoothness.
  - `resourceBudget`: Byte thresholds per resource class; triggers eviction or degradation when exceeded.
  - `contextRecoveryStrategy`: Policy matrix mapping vendor-specific recovery steps.
- **Feature Highlights**:
  - Monitors GPU vendor quirks and applies targeted workarounds (ANGLE resets, precision downgrades) as needed.
  - Supports headless OffscreenCanvas rendering for precomputing frames or running automated tests.
  - Logs per-visualizer performance metrics accessible via diagnostics overlay.
- **Integration Considerations**:
  - Register visualizers with `pool.add(visualizerConfig)` and provide `render` callbacks returning performance hints.
  - Use `pool.withContext(name, callback)` to borrow contexts for short-lived renders.
  - Wire telemetry output into `SystemController` heartbeat to maintain fleet-wide observability.
- **Primary Use**: Resource-conscious WebGL context steward keeping multi-visualizer experiences performant and stable.

### 14. Revolutionary VIB34D Complete Framework
- **Source**: Desktop/vib34d-editor-dashboard-feat-refactor-cube-navigation/VIB34D_COMPLETE_SYSTEM.js
- **Dependencies**: WebGL 2, advanced 4D mathematics, InteractionCoordinator, SystemController
- **Core Modules**:
  - `GeometrySuite`: Hosts hypercube, tetrahedron, sphere, torus, Klein bottle, fractal, wave, and crystal generators.
  - `InteractionAnalysisEngine`: Replaces audio reactivity with live interaction scoring (casual, rhythmic, intense, precise).
  - `MultiInstanceManager`: Synchronizes background/content/accent layers with independent parameter envelopes.
  - `PortalNavigator`: Drives infinite scroll, section alignment, and crossfade choreography between showcase portals.
- **Key Parameters**:
  - `geometryFocus`: Selects primary geometry per section while enabling blended overlays.
  - `interactionWeights`: Tunable coefficients for scoring gestures vs. scroll vs. pointer micro-movements.
  - `sectionMap`: JSON descriptor aligning geometry states, copy, and lighting themes to layout sections.
  - `analysisWindow` (500–3000ms): Defines input sampling window for pattern recognition.
  - `performanceBudget`: Maximum GPU milliseconds allowed per layer; system auto-scales effects if exceeded.
- **Feature Highlights**:
  - Derived parameter engine maintains mathematical relationships (e.g., rotation vs. morph factor) for continuity.
  - Built-in `ShowControl` dashboard surfaces real-time metrics, presets, and manual overrides.
  - Supports session recording and playback for QA review or design approvals.
- **Integration Considerations**:
  - Requires `SystemController` boot to supply telemetry and orchestration events.
  - Configure via `VIB34D.loadConfig(json)`; allow designers to edit JSON without touching code.
  - Provide `interactionInput` feed using InteractionCoordinator for consistent scoring across surfaces.
- **Primary Use**: Flagship VIB34D framework delivering deeply reactive multi-geometry experiences with interaction-led control.

### 15. Holographic Multi-Layer Particle System
- **Source**: Desktop/629claude/vib3code-fix-polytopal-kernel-errors/js/holographic-visualizer.js
- **Dependencies**: Canvas 2D, `requestAnimationFrame`, CSS blend modes, optional AudioContext
- **Core Modules**:
  - `ParticleEmitter`: Manages particle pools, depth layering, and easing for entry/exit choreography.
  - `WaveDirector`: Generates five sinusoidal waveforms modulating particle offsets and holographic plane wobble.
  - `OverlayManager`: Controls glassmorphic panels, RGB separation layers, and bloom overlays.
- **Key Parameters**:
  - `particles` (90–220): Particle count per layer; adaptive thresholds maintain 60 FPS.
  - `waves` (3–7): Number of simultaneous waveforms; each exposes amplitude/frequency controls.
  - `geometries`: Toggle set enabling hypercube, torus, fractal branches; each has rotation speed sub-params.
  - `holographicLayers` (3): CMY channel separation strength adjustable via `layerIntensity` (0.25–1.0).
  - `theme.intensity` (0.0–1.0): Global multiplier for color saturation and bloom.
  - `glassmorphicOverlay` (boolean): Enables rotating gradient panels with configurable `panelCount` (3–6).
- **Feature Highlights**:
  - Auto-adjusts composite mode between `screen` and `lighter` based on browser support and color gamut.
  - Exposes `captureFrame()` helper returning transparent PNGs for marketing assets.
  - Includes `reducedMotion` fallback replacing motion with subtle shimmer for accessibility.
- **Integration Considerations**:
  - Initialize via `HolographicVisualizer.mount(canvas, config)`; supply container dimensions for retina clarity.
  - Bind to audio analyser for synched particle acceleration, or pass manual modulation curves.
  - Use `VisualizerPool` to share Canvas contexts in multi-module deployments.
- **Primary Use**: High-energy holographic particle engine for card backdrops, hero sections, and ambient signage.

### 16. Moiré RGB Interference Advanced Patterns
- **Source**: Desktop/moire-hypercube-pppalpha.html, MVEPEnhancedGeometry.js, rgb effect/index.html
- **Dependencies**: WebGL 2, multi-render target extension, Fourier transform helper, Web Audio (optional)
- **Core Modules**:
  - `DualGridGenerator`: Produces layered lattice matrices with controllable phase offsets.
  - `RGBSplitter`: Manages per-channel displacement vectors and chromatic aberration timing.
  - `AudioPhaseModulator`: Translates audio band energy into grid oscillation, hue rotation, and glitch pulses.
- **Key Parameters**:
  - `moireScale` (0.95–1.05): Governs interference frequency; tie to display resolution for alias-free output.
  - `gridDensity` (5.0–25.0): Controls lattice resolution; >18 uses compute shader path for efficiency.
  - `glitchIntensity` (0.0–0.2): Adjusts RGB separation distance and smear duration.
  - `colorShift` (-1.0–1.0): Rotates hue matrix; synchronized to musical key changes when audio enabled.
  - `phaseDrift` (0.0–2.5): Introduces slow rotation between grid layers for evolving moiré patterns.
- **Feature Highlights**:
  - Mathematical toolkit exposes `calculateMoiré()` helper for educational overlays and interactive breakdowns.
  - Supports `stereoFusion` mode creating offset renders for anaglyph glasses or AR prototypes.
  - Integrates with `VisualizerPool` telemetry to warn when shader compile times exceed safe thresholds.
- **Integration Considerations**:
  - Deploy in dedicated `<canvas>` with pre-sized backing store; moiré crispness depends on pixel-perfect mapping.
  - Provide `safetyProfile` configuration when targeting sensitive audiences, smoothing high-frequency flicker.
  - Combine with `Narrative Choreography Engine` triggers to align moiré bursts with storytelling arcs.
- **Primary Use**: Precision interference visualizer marrying mathematics and art for high-impact transitions and exhibitions.

### 17. HypercubeCore WebGL Framework
- **Source**: Desktop/629claude/core/HypercubeCore.js + ShaderManager.js + GeometryManager.js + ProjectionManager.js
- **Documentation**: hypercube_core_webgl_system.md
- **Dependencies**: WebGL 1.0+, EXT_color_buffer_float, high-precision math libraries
- **Core Components**:
  - `HypercubeCore`: Main render loop with deterministic time-step and frame scheduler.
  - `ShaderManager`: Compiles shaders, injects geometry/projection constants, and caches program variants.
  - `GeometryManager`: Provides hypercube, hypersphere, hypertetrahedron, and custom polytope definitions.
  - `ProjectionManager`: Offers perspective, orthographic, stereographic, and hybrid projection pipelines.
- **Key Parameters**:
  - `dimensions` (4.0 default): Enables additional axes when combined with advanced geometries.
  - `morphFactor` (0.0–1.0): Blends between geometry states; linked to `AnimationController` for smooth morphing.
  - `rotationSpeed` (0.05–0.4): Multi-axis rotation speed with per-axis overrides.
  - `gridDensity` (4–16): Vertex density per face; >12 toggles adaptive tessellation.
  - `glitchIntensity` (0.0–0.15) & `colorShift` (-0.5–0.5): Chromatic effects controlled by shader uniforms.
  - `audioLevels`: Ingests normalized bass/mid/high to drive geometry modulation.
  - `universeModifier`: Advanced transformation stack (twist, pinch, flare) for experimental sequences.
- **Advanced Features**:
  - Hot-swappable shader graph enabling real-time experimentation without context loss.
  - Dirty state tracking ensures only changed uniforms update, minimizing GPU overhead.
  - Built-in diagnostics overlay showing frame time, draw call count, and active projections.
  - Audio-reactive pipeline with smoothing filters to prevent jitter.
- **Integration Considerations**:
  - Initialize via `HypercubeCore.create(canvas, config)`; integrate with `VisualizerPool` for resource management.
  - Extend geometry library by registering new primitives through `GeometryManager.register(name, factory)`.
  - Export frames via `core.captureFrame({resolution})` for print-quality stills.
- **Primary Use**: Backbone WebGL framework delivering high-fidelity 4D renders across multiple codex experiences.

### 18. Advanced Mathematical Geometry Systems
- **Source**: Desktop/629claude/CrystalGeometry.js + HypersphereGeometry.js + InsaneGeometry.js
- **Dependencies**: WebGL 2, GLSL math libraries, CPU-side BigFloat utilities
- **Subsystems**:
  - `CrystalGeometry`: Generates hypercubic lattice, applies 6-axis rotations, and optimizes buffers for massive vertex counts.
  - `HypersphereGeometry`: Computes S³ meshes with inner/outer tessellation modes and normal calculations for lighting.
  - `InsaneMatrixExtensions`: Adds 8D projections, chaos-based perturbations, and temporal warping algorithms.
- **Key Parameters**:
  - `dimensionCount` (4–8): Governs base math complexity; high values require compute shader path.
  - `subdivisionLevels` (1–10): Controls tessellation detail for hypersphere and crystal surfaces.
  - `chaosVector` (0.0–1.0): Injects controlled randomness for InsaneMatrix overlays.
  - `stabilityGuard` (boolean): Engages damping algorithms to maintain user comfort during extreme projections.
- **Feature Highlights**:
  - Precision math toolkit exports to CSV for offline scientific analysis or art direction review.
  - Includes unit-tested library of quaternion and matrix utilities shared across codex visualizers.
  - Supports hybrid CPU/GPU computation, falling back to CPU when GPU precision limits are detected.
- **Integration Considerations**:
  - Import modules into HypercubeCore or MVEP pipelines to extend geometry catalogues.
  - Utilize `GeometryWorkbench` CLI (bundled) to precompute assets for installations.
  - Documented extension points allow researchers to plug in novel parametric equations without rewriting core.
- **Primary Use**: Advanced geometry toolkit enabling scientific-grade and avant-garde visual structures across the codex.

### 19. Visual Codex Parallax Scroll System
- **Source**: gallery-parallax-system.html
- **Dependencies**: WebGL background shaders, CSS Grid, IntersectionObserver, ResizeObserver, vanilla JavaScript
- **Core Modules**:
  - `ParallaxSceneGraph`: Tracks section depth, offset multipliers, and WebGL canvas assignments for seamless parallax.
  - `SectionComposer`: Builds card lattices, metadata overlays, and chaos meter instrumentation per section.
  - `ScrollTelemetry`: Measures velocity, progress, and time-in-section for analytics plus adaptive difficulty tuning.
- **Key Parameters**:
  - `scrollExtent` (700vh default): Defines total narrative travel; adjustable for custom campaigns.
  - `backgroundProfiles`: JSON map pairing sections with shader presets, camera paths, and lighting cues.
  - `chaosIntensityRange` (0–100): Drives ambient particle density and audio cues to reinforce narrative state.
  - `navIndicators`: Config object enabling dots, progress bar, and textual breadcrumbs.
- **Feature Highlights**:
  - Offers `AccessibilityMode` that reduces parallax depth and boosts contrast while retaining core storytelling beats.
  - Supports data-driven card generation; plug new codex entries into JSON to surface them automatically.
  - Integrates with codex telemetry, logging dwell time, exit points, and interaction highlights.
- **Integration Considerations**:
  - Serve via local server to ensure WebGL shader assets load without CORS issues.
  - Preload background shaders on desktop to avoid initial hitch; rely on IntersectionObserver to stage canvases.
  - Provide fallback background images for browsers without WebGL support.
- **Primary Use**: Cinematic desktop storytelling shell orchestrating deep background transitions with curated showcases.

### 20. Visual Codex Tactile Scroll System
- **Source**: gallery-tactile-scroll.html
- **Dependencies**: Canvas background renderer, CSS Grid, Pointer Events, vanilla JavaScript, IntersectionObserver
- **Core Modules**:
  - `TactileScrollManager`: Converts scroll momentum into stage unlocks, easing curves, and section transitions.
  - `ChaosEvolutionMeter`: Visualizes user input energy, seeding ambient effects and audio cues.
  - `ResponsiveLayoutDirector`: Morphs card grid from desktop (3×2) to mobile stack while preserving focus order.
- **Key Parameters**:
  - `momentumThresholds`: Array defining when new chaos tiers unlock; tuned for different input devices.
  - `stageProfiles`: Metadata describing card sets, copy, and background responses per chaos tier.
  - `inertiaDecay` (0.75–0.95): Controls how quickly momentum dissipates to encourage intentional interaction.
  - `hapticFeedback` (boolean): Toggles optional vibration cues on supported devices.
- **Feature Highlights**:
  - On-device diagnostics overlay displays velocity, tier, and GPU timing for QA sessions.
  - Built-in analytics hook publishes engagement metrics for experimentation teams.
  - Includes `prefers-reduced-motion` fallback that swaps momentum simulation for discrete step navigation.
- **Integration Considerations**:
  - Calibrate `momentumThresholds` when embedding inside scroll-jacked environments to avoid conflicting gestures.
  - Load Canvas textures asynchronously to maintain smooth first paint; system degrades gracefully to CSS gradients.
  - Pair with `Narrative Choreography Engine` for synchronized copy and audio transitions.
- **Primary Use**: Physically inspired narrative scroller emphasizing kinetic buildup and tactile affordances.

### 21. Visual Codex Crystal Wafer System
- **Source**: gallery-crystal-wafer.html
- **Dependencies**: CSS 3D transforms, Canvas particle overlays, vanilla JavaScript, CSS custom properties
- **Core Modules**:
  - `WaferGrid`: Generates hexagonal layout, handles responsive scaling, and manages active/inactive states.
  - `EnergyFieldController`: Drives border glows, resonance pulses, and hover magnification using CSS variables.
  - `MomentumTracker`: Captures user navigation rhythm, influencing which resonance set to surface next.
- **Key Parameters**:
  - `resonanceStates` (7 defaults): Collection of themed datasets; extendable via JSON configuration.
  - `hoverTilt` (0–18deg): Controls 3D tilt intensity; accessibility mode clamps to 6deg.
  - `particleDensity` (0.3–1.0): Governs overlay particle count; scaled for device performance tiers.
  - `focusDimming` (0.2–0.8): Determines how much inactive wafers fade to spotlight the active card.
- **Feature Highlights**:
  - Auto-generates alt text and metadata from dataset entries, reinforcing accessibility compliance.
  - Supports `showcaseMode` locking a single resonance state for live demos or kiosk usage.
  - Canvas overlay includes GPU-friendly instancing for crystal dust effects.
- **Integration Considerations**:
  - Provide curated dataset JSON with categories, tags, and asset URLs; system renders cards automatically.
  - Use CSS custom properties to align palette with other codex shells.
  - Trigger transitions via `waferGrid.setActive(stateName)` from orchestration events.
- **Primary Use**: Premium presentation grid evoking semiconductor wafers for executive reviews and hero selections.

### 22. Visual Codex Treasure Hunt Experience
- **Source**: gallery-treasure-experience.html
- **Dependencies**: Canvas particle renderer, vanilla JavaScript easing utilities, Pointer Events, LocalStorage
- **Core Modules**:
  - `TreasureHuntExperienceManager`: Coordinates treasure spawning, reveals, and break/reform animations.
  - `DiscoveryMomentum`: Tracks interaction energy, gating access to advanced treasure tiers.
  - `LoreConsole`: Updates subtitles, logs, and achievements with narrative copy.
- **Key Parameters**:
  - `treasureSets`: JSON catalog of treasures, metadata, and unlock requirements.
  - `momentumCurve`: Defines how quickly discovery energy accumulates/decays.
  - `particlePreset`: Chooses ambient dust style (nebula, aurora, crystalline) with adjustable intensity.
  - `sessionPersistence` (boolean): Enables LocalStorage saves for returning explorers.
- **Feature Highlights**:
  - Gamified scoring and achievements encourage full catalog exploration.
  - Supports cooperative mode where multiple users contribute to shared momentum via WebSocket bridge (optional).
  - Inline accessibility narration describes treasure reveals for screen readers.
- **Integration Considerations**:
  - Host via HTTPS when enabling cooperative mode to satisfy WebSocket security requirements.
  - Customize `treasureSets` for themed events; system automatically builds visuals and copy.
  - Provide `resetExperience()` admin hook for rapid QA iteration.
- **Primary Use**: Gamified gallery shell translating codex exploration into kinetic treasure discovery journeys.

### 23. Visual Codex Snap Scroll System
- **Source**: gallery-snap-scroll.html
- **Dependencies**: CSS scroll snapping, Canvas background animation, vanilla JavaScript, ResizeObserver
- **Core Modules**:
  - `SnapSectionBuilder`: Generates full-viewport sections, attaches metadata overlays, and binds navigation controls.
  - `BackgroundCanvasEngine`: Renders gradient and particle animations synced to the active section index.
  - `InputController`: Harmonizes keyboard, wheel, and touchpad gestures into deterministic snap transitions.
- **Key Parameters**:
  - `sectionConfig`: Array describing effect metadata, asset paths, and background themes.
  - `snapDuration` (400–900ms): Governs easing and interpolation between sections.
  - `preloadRadius` (1–3): Number of sections preloaded ahead/behind current view for smooth transitions.
  - `accessibilityMode`: Option to switch to button-based navigation with reduced motion.
- **Feature Highlights**:
  - Provides `minimap` overlay summarizing section order for quick navigation.
  - Auto-detects reduced motion preferences and switches to fade transitions.
  - Emits analytics events on section entry/exit for storytelling optimization.
- **Integration Considerations**:
  - Ensure sections have unique IDs for deep linking and hash navigation.
  - Pre-generate thumbnail images for quick share previews.
  - Pair with `SystemController` to pause heavy background renders when not in focus.
- **Primary Use**: Structured browsing experience presenting each effect as a focused full-screen chapter.

### 24. Visual Codex Standalone Gallery Mode
- **Source**: gallery-standalone.html
- **Dependencies**: Canvas 2D preview renderer, CSS Grid, vanilla JavaScript, LocalStorage
- **Core Modules**:
  - `PreviewRenderer`: Paints animated previews (sparks, particles, scanlines) on each card canvas.
  - `FilterController`: Handles category toggles, search chips, and state persistence.
  - `QuickActionPanel`: Surfaces links, metadata, and copy-to-clipboard commands.
- **Key Parameters**:
  - `previewProfiles`: JSON map defining animation recipes per category.
  - `cachePolicy`: Controls LocalStorage caching for preview state and filter preferences.
  - `gridBreakpoints`: Layout map for desktop/tablet/mobile presentations.
- **Feature Highlights**:
  - Offline-friendly: leverages service-worker-ready structure for bundling into static review packages.
  - Export utility captures high-res card spritesheets for marketing materials.
  - Keyboard shortcuts accelerate browsing (`/` search, `f` filter, arrow navigation).
- **Integration Considerations**:
  - Run behind local server for consistent asset loading; integrate with `start-gallery.py` for turnkey setup.
  - Update `gallery-data.json` to add new entries; system auto-renders previews.
  - Provide `prefersReducedData` toggle when shipping to constrained networks.
- **Primary Use**: Offline-capable gallery index delivering live previews without iframe dependencies.

### 25. Visual Codex Gallery Server Sentinel
- **Source**: gallery-server.html
- **Dependencies**: Static HTML/CSS, instructional content, copy-to-clipboard JavaScript helpers
- **Core Modules**:
  - `EnvironmentChecklist`: Verifies presence of `effects/`, `demos/`, and other required directories.
  - `ServerGuide`: Presents Python, Node, and VS Code Live Server instructions with platform notes.
  - `TroubleshootingMatrix`: Maps common issues (CORS, blocked iframes) to recommended fixes.
- **Key Parameters**:
  - `inventoryTargets`: List of directories/files to display with counts.
  - `commandSets`: Structured data driving command callouts for quick copying.
  - `iframeFallbacks`: Guidance toggles for environments requiring static preview mode.
- **Feature Highlights**:
  - Visually distinct callouts streamline setup for reviewers regardless of technical skill.
  - Integrates QR code generator for quickly loading instructions on mobile devices.
  - Includes accessibility-friendly semantic structure and high-contrast theming.
- **Integration Considerations**:
  - Keep instructions synchronized with `start-gallery.py` to avoid drift.
  - Update `inventoryTargets` when new directories join the gallery pipeline.
  - Embed into distribution packages to reduce onboarding friction for stakeholders.
- **Primary Use**: Operational launchpad guiding teams to run codex galleries on compliant local servers.

### 26. Visual Codex Proper Fixed Layout System
- **Source**: gallery-proper-system.html
- **Dependencies**: CSS 3D transforms, Canvas background shaders, vanilla JavaScript, IntersectionObserver
- **Core Modules**:
  - `CardLattice`: Manages 3D tilt, shadow stacks, and responsive spacing for curated effect cards.
  - `ProperNavigator`: Coordinates subtitles, polytopal visualizer parameters, and card datasets per section.
  - `InitializationLogger`: Streams boot phases and diagnostics (“Visual Codex Proper 4D System”) to console and overlay.
- **Key Parameters**:
  - `tiltRange` (0–18deg): Controls card tilt responsiveness; auto-reduced under `prefers-reduced-motion`.
  - `backgroundShaderProfiles`: JSON mapping sections to shader uniforms and tempo cues.
  - `cardDataSource`: Structured data describing title, description, tags, and asset links.
  - `performanceTargets`: FPS and memory thresholds triggering fallback states.
- **Feature Highlights**:
  - Balanced emphasis on layout stability and spectacle ensures scroll context remains intuitive.
  - Provides manual override panel letting presenters pin spotlight cards or freeze animations.
  - Diagnostics overlay surfaces shader compile time, card render counts, and scroll position.
- **Integration Considerations**:
  - Requires bundling with `start-gallery.py` or equivalent server for shader asset loading.
  - Sync `cardDataSource` with central codex dataset to maintain consistency.
  - Pair with `VisualizerPool` to tune WebGL usage when multiple canvases run concurrently.
- **Primary Use**: Production-ready fixed layout shell showcasing polytopal and holographic systems with reliability.

### 27. Visual Codex Mobile-Native Gallery
- **Source**: gallery-mobile-native.html
- **Dependencies**: Touch APIs, optional ZingTouch gestures, IntersectionObserver, ResizeObserver, vanilla JavaScript
- **Core Modules**:
  - `MobileVisualCodex`: Performs device detection, performance profiling, and adaptive feature gating.
  - `GestureZone`: Manages swipe/tap detection with ZingTouch integration and fallback pointer tracking.
  - `PerformanceMonitor`: Displays FPS, CPU hints, and animation state to guide tuning.
- **Key Parameters**:
  - `hardwareProfiles`: JSON mapping device classes to animation density, preview quality, and effect toggles.
  - `gestureSensitivity` (0.3–1.2): Adjusts swipe distance thresholds for varied screen sizes.
  - `maxActiveCards` (6–14): Caps concurrent card animations based on detected performance tier.
  - `prefetchRadius` (1–2): Controls data preloading ahead of user navigation.
- **Feature Highlights**:
  - Progressive loading strategy balances fidelity and responsiveness per hardware tier.
  - Accessibility overlays include voiceover-friendly labels and high-contrast theme switch.
  - Session persistence stores last visited card to streamline return visits.
- **Integration Considerations**:
  - Test on physical devices; emulator touch events may lack nuance for momentum detection.
  - Update `mobile-gallery-data.json` when adding codex entries to keep parity with desktop catalog.
  - Pair with `test-mobile-gallery` suites for regression coverage.
- **Primary Use**: Touch-first codex explorer tuned for real devices with adaptive degradation strategies.

### 28. Visual Codex Mobile 6×7 State System
- **Source**: gallery-mobile-native-6x7.html
- **Dependencies**: Touch events, Canvas polytopal background, vanilla JavaScript, IntersectionObserver
- **Core Modules**:
  - `Mobile6x7Gallery`: Coordinates state transitions, lazy loading, and gesture routing.
  - `StateHUD`: Surfaces RGB glitch overlay, FPS monitor, and state buttons broadcasting system status.
  - `BackgroundVisualizer`: Renders polytopal canvases per state with adaptive shader complexity.
- **Key Parameters**:
  - `stateDefinitions`: Seven temporal states with curated demo lists and metadata.
  - `transitionThrottle` (250–600ms): Prevents rapid state flapping while keeping interaction responsive.
  - `glitchOverlayStrength` (0.0–0.4): Adjusts RGB separation intensity for comfort.
  - `mobileQueryParam` (`?mobile=1` default): Ensures responsive demo variants load.
- **Feature Highlights**:
  - One-handed browsing layout keeps key controls within thumb reach.
  - Performance watchdog downgrades shader complexity when FPS dips below thresholds.
  - Supports deep linking to specific states for marketing campaigns.
- **Integration Considerations**:
  - Align `stateDefinitions` with analytics data to highlight popular demos.
  - Provide `reducedMotion` state variant with static backgrounds for sensitive users.
  - Instrument with Puppeteer suites to ensure state transitions remain reliable.
- **Primary Use**: Dense yet navigable mobile gallery delivering codex breadth through compact state cycling.

### 29. Visual Codex Mobile Enhanced 4D System
- **Source**: gallery-mobile-enhanced.html
- **Dependencies**: Touch APIs, swipe zone overlays, Canvas polytopal shaders, vanilla JavaScript, CSS custom properties
- **Core Modules**:
  - `SwipeNavigator`: Defines ergonomic swipe zones with emoji affordances guiding motion.
  - `CrystalContainer`: Renders oversized wafers per state with adaptive content overlays and neon treatments.
  - `PolytopalThemeEngine`: Cycles eight geometry themes, altering rotation vectors and color harmonies.
- **Key Parameters**:
  - `themeProfiles`: Map geometry, palette, and motion envelopes to each state.
  - `swipeZonePadding` (24–48px): Ensures comfortable gestures without conflicting with system edges.
  - `backgroundIntensity` (0.4–1.0): Controls shader vigor for battery-conscious modes.
  - `contentMappings`: Keeps mobile cards synced with desktop catalog naming and URLs.
- **Feature Highlights**:
  - Provides `presentationMode` locking auto-advance for event displays.
  - Includes battery saver toggle reducing frame rate and background intensity for prolonged use.
  - Implements `aria-live` updates describing background shifts and card focus changes.
- **Integration Considerations**:
  - Coordinate with desktop metadata to ensure cross-platform consistency.
  - Validate swipes across iOS and Android browsers to tune sensitivity.
  - Cache shader assets for offline-friendly progressive web app packaging.
- **Primary Use**: Premium mobile showcase blending 4D background choreography with simplified card focus.

### 30. Visual Codex Mobile Gallery Test Report
- **Source**: MOBILE_GALLERY_TEST_REPORT.md
- **Dependencies**: Documentation only
- **Structure**:
  - Executive summary with overall pass rate (86%) and key findings.
  - Detailed table per test covering scope, device, results, and remediation notes.
  - Accessibility section summarizing touch target compliance and voiceover behavior.
  - Performance metrics comparing cold/warm loads and animation smoothness.
- **Feature Highlights**:
  - Provides prioritized remediation backlog with owners and estimated effort.
  - Links to screenshot evidence and Puppeteer logs for transparency.
  - Concludes with readiness statement and next-step recommendations.
- **Integration Considerations**:
  - Update after each major mobile release to maintain audit trail.
  - Cross-link with automated test suites to keep documentation aligned.
- **Primary Use**: QA artifact validating mobile gallery robustness with actionable insights.

### 31. Visual Codex Mobile Comprehensive Puppeteer Suite
- **Source**: test-mobile-gallery-comprehensive.js
- **Dependencies**: Node.js, Puppeteer, headful Chrome, dotenv (optional)
- **Test Phases**:
  - `phaseOne`: Validates core UI elements, navigation, and gesture handling.
  - `phaseTwo`: Iterates linked demos, confirms HTTP status, and monitors console logs for errors.
- **Key Parameters**:
  - `VIEWPORT` (iPhone 12 class): Tunable for alternate device targets.
  - `timeoutBudget` (60–120s): Ensures long-running demos have adequate load time.
  - `captureArtifacts` (boolean): Toggles screenshot and HAR capture for debugging.
- **Feature Highlights**:
  - Structured result object outputs metrics, pass/fail flags, and error traces.
  - Emits JSON report compatible with CI dashboards and documentation ingestion.
  - Supports environment variables for remote URL overrides in staging vs. production.
- **Integration Considerations**:
  - Run post-deploy in CI to catch regressions before release.
  - Keep selectors synchronized with gallery markup changes.
  - Store artifacts in build system for historical comparison.
- **Primary Use**: Comprehensive automation ensuring mobile gallery usability and reliability thresholds.

### 32. Visual Codex Mobile Quick Smoke Suite
- **Source**: test-mobile-gallery-quick.js
- **Dependencies**: Node.js, Puppeteer, headful Chrome
- **Test Focus**:
  - Fast boot validation with iPhone SE viewport for lower-end device coverage.
  - Selector checks verifying header, navigation, cards, and performance monitor.
  - Interaction sampling with tap simulations and navigation button triggers.
  - Lightweight performance capture recording first meaningful paint and animation start.
- **Key Parameters**:
  - `smokeTimeout` (25–40s): Keeps runs CI-friendly.
  - `screenshotOnFail` (boolean): Captures state when assertions fail.
  - `demoSampleSize` (3–5): Number of linked demos spot-checked per run.
- **Feature Highlights**:
  - Designed for pre-commit or nightly runs to catch obvious regressions quickly.
  - Shares utility library with comprehensive suite for consistent logging.
  - Reports summarized results suitable for Slack or chat integrations.
- **Integration Considerations**:
  - Trigger on pull requests touching mobile code paths.
  - Maintain alignment with mobile gallery selectors.
  - Archive run history to spot performance drifts.
- **Primary Use**: Lightweight CI guardrail keeping mobile gallery in a known-good state between deeper tests.

### 33. Visual Codex Desktop Gallery Regression Harness
- **Source**: test-gallery-puppeteer.js
- **Dependencies**: Node.js, Puppeteer, desktop Chrome, fs/promises
- **Core Checks**:
  - Verifies card counts, lazy iframe data attributes, and WebGL context pool logs.
  - Captures before/after screenshots while scrolling to exercise lazy loading and context pooling.
  - Monitors console output, network requests, and HTTP anomalies.
- **Key Parameters**:
  - `VIEWPORT` (1440×900 default): Configurable for additional coverage.
  - `scrollSegments` (3–5): Number of scroll passes executed.
  - `enableTracing` (boolean): Collects Chrome performance trace when debugging.
- **Feature Highlights**:
  - Integrates with telemetry overlay to confirm context pooling health.
  - Provides diffable screenshot artifacts to detect visual regressions.
  - Emits machine-readable report consumed by QA dashboards.
- **Integration Considerations**:
  - Schedule regular runs on staging environments to validate asset availability.
  - Update selectors when gallery layout evolves.
  - Use alongside mobile suites for holistic coverage.
- **Primary Use**: Desktop-focused regression guardrail maintaining gallery quality across releases.

### 34. Visual Codex Local Server Bootstrap
- **Source**: start-gallery.py
- **Dependencies**: Python 3, http.server, socketserver, threading, webbrowser
- **Core Components**:
  - `CodexRequestHandler`: Custom handler injecting permissive CORS headers for iframe interoperability.
  - `ServerLauncher`: Auto-discovers codex directory, logs launch banner, and opens gallery in browser tab.
  - `DiagnosticsModule`: Provides actionable messaging for missing directories, occupied ports, or permission issues.
- **Key Parameters**:
  - `PORT` (8000 default): Configurable via CLI args or environment variable.
  - `AUTO_OPEN` (true/false): Toggles automatic browser launch.
  - `DIRECTORY_MAP`: Ensures required folders are present before serving content.
- **Feature Highlights**:
  - Generates quick links to gallery variants (gallery.html, gallery-standalone.html, gallery-parallax-system.html).
  - Provides remediation tips for Windows, macOS, and Linux users.
  - Supports graceful shutdown and port conflict resolution messaging.
- **Integration Considerations**:
  - Bundle with distribution zips to standardize review environment setup.
  - Align directory checks with gallery-server.html instructions for consistency.
  - Encourage QA teams to run before executing automated tests to avoid CORS issues.
- **Primary Use**: Turnkey local server ensuring codex galleries and demos run securely across environments.

---

## Chapter 5: GSAP Scroll Choreography Systems

### 18. Timeline Creation Patterns
- **Source**: gsap_scroll_choreography/gsap_core/01-timeline-creation-patterns.md
- **Dependencies**: GSAP Core, ScrollTrigger
- **Key Parameters**:
  - `scrollTrigger.trigger`: Element or selector
  - `scrollTrigger.start/end`: Scroll position triggers
  - `defaults.ease`: Timeline-wide easing
  - `defaults.duration`: Default animation duration
- **Primary Use**: Scroll-tied timeline orchestration with GSAP

### 19. Animation Methods (to/from/fromTo)
- **Source**: gsap_scroll_choreography/gsap_core/02-animation-methods.md
- **Dependencies**: GSAP Core
- **Key Parameters**:
  - `gsap.to()`: Forward animation
  - `gsap.from()`: Reverse animation
  - `gsap.fromTo()`: Explicit start/end states
- **Primary Use**: Fundamental GSAP animation method selection

### 20. ScrollTrigger Configurations
- **Source**: gsap_scroll_choreography/gsap_core/03-scrolltrigger-configurations.md
- **Dependencies**: GSAP Core, ScrollTrigger
- **Key Parameters**:
  - `pin`: true/element - Lock during scroll
  - `anticipatePin`: 1 - Smooth pin start
  - `scrub`: 0.3-1.2s - Scroll-to-animation smoothing
  - `markers`: true - Debug visualization
- **Primary Use**: Pinning, scrubbing, and scroll trigger configuration

### 21. Easing Functions Library
- **Source**: gsap_scroll_choreography/gsap_core/04-easing-functions-library.md
- **Dependencies**: GSAP Core
- **Key Parameters**:
  - `power2-4.out/in/inOut`: Progressive deceleration
  - `back.out(1.5-1.7)`: Overshoot bounce
  - `sine.inOut`: Smooth wave motion
  - `elastic.out`: Spring physics
- **Primary Use**: Comprehensive easing function reference

### 22. Stagger Patterns
- **Source**: gsap_scroll_choreography/gsap_core/05-stagger-patterns.md
- **Dependencies**: GSAP Core
- **Key Parameters**:
  - `stagger`: 0.02-0.1s - Fixed delay between elements
  - `stagger.from`: "start", "center", "end", "random"
  - `stagger.grid`: [rows, cols] - Grid-aware staggering
- **Primary Use**: Sequential and grid-based animation timing

### 23. 3D Transform Patterns
- **Source**: gsap_scroll_choreography/gsap_core/06-3d-transform-patterns.md
- **Dependencies**: GSAP Core, CSS 3D Transforms
- **Key Parameters**:
  - `z`: -3000px to 0px (depth emergence)
  - `rotationY`: 0-360° (Y-axis spin)
  - `rotationX`: -90° to 0° (tilt back)
  - `rotationZ`: 0° to 1080° (multi-spin)
  - `transformPerspective`: 1000px
- **Primary Use**: 3D space animations with depth and rotation

### 24. Scale Patterns
- **Source**: gsap_scroll_choreography/gsap_core/07-scale-patterns.md
- **Dependencies**: GSAP Core
- **Key Parameters**:
  - `scale`: 0.2-1.0 (grow reveal)
  - `scaleX/scaleY`: Independent axis scaling
  - `yoyo`: true - Breathing oscillation
  - `repeat`: -1 - Infinite pulsing
- **Primary Use**: Size-based animations and breathing effects

### 25. Visualizer Parameter Morphing
- **Source**: gsap_scroll_choreography/gsap_core/08-visualizer-parameter-morphing.md
- **Dependencies**: GSAP Core, WebGL
- **Key Parameters**:
  - `params.hue`: 0-360 color rotation
  - `params.intensity`: 0-1 brightness
  - `params.chaos`: 0-1 randomness
  - `params.gridDensity`: 10-100 resolution
- **Primary Use**: Scroll-driven WebGL shader parameter animation

### 26. Three-Phase Animation System
- **Source**: gsap_scroll_choreography/gsap_core/09-three-phase-animation.md
- **Dependencies**: GSAP Core, ScrollTrigger
- **Key Parameters**:
  - Phase 1 (0-30%): ENTRANCE - Emerge from depth
  - Phase 2 (30-70%): LOCK - Center stage, subtle pulse
  - Phase 3 (70-100%): EXIT - Disperse and fade
- **Primary Use**: Structured enter-hold-exit scroll choreography

### 27. Particle & Explosion Systems
- **Source**: gsap_scroll_choreography/gsap_core/10-particle-explosion-systems.md
- **Dependencies**: GSAP Core, DOM manipulation
- **Key Parameters**:
  - `particleCount`: 25-50 particles per burst
  - `spreadRadius`: 100-300px radial distance
  - `duration`: 0.6-1.2s particle lifespan
  - `gravity`: Physics simulation offset
- **Primary Use**: Click-triggered particle explosions and confetti

### 28. Chromatic Aberration Animation
- **Source**: gsap_scroll_choreography/gsap_core/11-chromatic-aberration.md
- **Dependencies**: GSAP Core, CSS transforms
- **Key Parameters**:
  - `redOffset`: -4px to 0px (left shift)
  - `blueOffset`: 0px to 4px (right shift)
  - `opacity`: Per-channel transparency
  - `duration`: Glitch timing
- **Primary Use**: RGB channel split effects for text and elements

### 29. Percentage Parameter Binding
- **Source**: gsap_scroll_choreography/gsap_core/12-percentage-parameter-binding.md
- **Dependencies**: GSAP Core, ScrollTrigger
- **Key Parameters**:
  - `self.progress`: 0-1 scroll progress
  - Linear mapping: `value = min + (progress * range)`
  - Inverse mapping: `value = max - (progress * range)`
  - Sine wave: `Math.sin(progress * Math.PI)`
- **Primary Use**: Direct scroll-to-parameter value mapping

### 30. Filter & Blur Patterns
- **Source**: gsap_scroll_choreography/gsap_core/13-filter-blur-patterns.md
- **Dependencies**: GSAP Core, CSS Filters
- **Key Parameters**:
  - `filter`: "blur(20px) → blur(0px)"
  - `backdropFilter`: Glass effect blur
  - `brightness`: 0.5-1.5
  - `saturate`: 0-2
- **Primary Use**: CSS filter animations for reveal effects

### 31. Repetition & Looping Patterns
- **Source**: gsap_scroll_choreography/gsap_core/14-repetition-looping.md
- **Dependencies**: GSAP Core
- **Key Parameters**:
  - `repeat`: -1 (infinite), n (count)
  - `yoyo`: true - Reverse on each cycle
  - `repeatDelay`: Pause between cycles
  - Relative values: `+=90deg`, `+=10px`
- **Primary Use**: Continuous animations and breathing effects

### 32. Mouse & Interaction Binding
- **Source**: gsap_scroll_choreography/gsap_core/15-mouse-interaction-binding.md
- **Dependencies**: GSAP Core, DOM Events
- **Key Parameters**:
  - `mouseX/Y`: Normalized 0-1 coordinates
  - `quickTo()`: Optimized continuous updates
  - Parallax multipliers: Per-layer depth
  - Touch support: Touch events mapping
- **Primary Use**: Pointer-driven parameter control and parallax

### 33. Orbital Animation (Simone-Style)
- **Source**: gsap_scroll_choreography/gsap_core/16-orbital-animation.md
- **Dependencies**: GSAP Core, CSS Transforms
- **Key Parameters**:
  - `xPercent/yPercent`: Position-based stagger
  - Orbital radius: 200-400px
  - Rotation: 0-360° per element
  - Expand/collapse states: Click-driven
- **Primary Use**: Radial element arrangement with orbital motion

### 34. Special Callbacks & Lifecycle Hooks
- **Source**: gsap_scroll_choreography/gsap_core/17-special-callbacks.md
- **Dependencies**: GSAP Core, ScrollTrigger
- **Key Parameters**:
  - `onEnter/onLeave/onEnterBack/onLeaveBack`: Scroll triggers
  - `onStart/onComplete/onUpdate`: Timeline callbacks
  - `.call()`: Mid-timeline function calls
  - `.add()`: Label-based timeline control
- **Primary Use**: Custom code execution during animations

### 35. Holographic Visualizer System (JusDNCE-Style)
- **Source**: gsap_scroll_choreography/visualizer_systems/18-holographic-visualizer-system.md
- **Dependencies**: WebGL 2.0, GLSL ES 3.00
- **Key Parameters**:
  - `geometryType`: 0=Tetra, 1=Box, 2=Sponge (KIFS fractals)
  - `density`: 0.3-2.5 (fog thickness)
  - `chaos`: 0-1 (fractal mutation intensity)
  - `hue`: 0-360 (HSL color rotation)
  - `intensity`: 0.3-1.5 (brightness)
  - `morph`: 0-1 (geometry blending)
- **Primary Use**: WebGL raymarched fractal visualizations with KIFS folding

### 36. Impulse Event System
- **Source**: gsap_scroll_choreography/visualizer_systems/19-impulse-event-system.md
- **Dependencies**: CustomEvent API, GSAP
- **Key Parameters**:
  - `triggerImpulse(type, intensity)`: Event dispatcher
  - `impulseDecay`: 0.95 (exponential falloff)
  - Event types: 'click', 'hover', 'scroll', 'key'
  - Intensity range: 0-1
- **Primary Use**: UI interaction → WebGL shader reactivity bridging

### 37. Inverse Density Fog Effect
- **Source**: gsap_scroll_choreography/visualizer_systems/20-inverse-density-fog.md
- **Dependencies**: WebGL, Fragment Shaders
- **Key Parameters**:
  - `idleDensity`: 2.5 (thick quantum foam)
  - `activeDensity`: 0.4 (clear visualization)
  - `decayRate`: 0.02 (return to idle speed)
  - `impulseMultiplier`: 2.0 (density reduction factor)
- **Primary Use**: "Fog clears on interaction" revealing hidden geometry

### 38. Quantum Glassmorphism UI System
- **Source**: gsap_scroll_choreography/visualizer_systems/21-quantum-glassmorphism.md
- **Dependencies**: CSS backdrop-filter, CSS custom properties
- **Key Parameters**:
  - `--glass-bg`: rgba(15, 15, 17, 0.6)
  - `--blur-md`: 16px
  - `--glass-border`: rgba(255, 255, 255, 0.08)
  - `--glow-subtle/medium/strong`: Box-shadow presets
  - `--primary`: #7B3FF2 (accent purple)
  - `--secondary`: #4FC3F7 (accent cyan)
- **Primary Use**: Complete dark-mode glass design system with hover states and animations

---

## Chapter 5 Demo Files

### Timeline & ScrollTrigger Demo
- **Source**: gsap_scroll_choreography/demos/timeline-scrolltrigger-demo.html
- **Patterns Covered**: 18, 19, 20, 31
- **Features**: Scroll-tied timeline, pinning, scrub

### Three-Phase Animation Demo
- **Source**: gsap_scroll_choreography/demos/three-phase-animation-demo.html
- **Patterns Covered**: 26
- **Features**: ENTRANCE → LOCK → EXIT structure

### Particle System Demo
- **Source**: gsap_scroll_choreography/demos/particle-system-demo.html
- **Patterns Covered**: 27
- **Features**: Click explosions, confetti, star bursts

### Chromatic Aberration Demo
- **Source**: gsap_scroll_choreography/demos/chromatic-aberration-demo.html
- **Patterns Covered**: 28
- **Features**: RGB split text, glitch effects

### Visualizer Binding Demo
- **Source**: gsap_scroll_choreography/demos/visualizer-binding-demo.html
- **Patterns Covered**: 25, 29
- **Features**: Scroll-driven WebGL parameters

### Holographic Visualizer Demo
- **Source**: gsap_scroll_choreography/demos/holographic-visualizer-demo.html
- **Patterns Covered**: 35, 36, 37
- **Features**: KIFS fractals, impulse system, fog clearing

### Quantum Glassmorphism Demo
- **Source**: gsap_scroll_choreography/demos/quantum-glassmorphism-demo.html
- **Patterns Covered**: 38
- **Features**: Complete glass UI system

---

## Integration Guidelines

1. **Component Classification**
   - *Standalone Components* (e.g., CSS kits, documentation assets) can be dropped into projects with minimal configuration. Import the referenced CSS/JS bundles and follow semantic HTML structure for best results.
   - *System Components* (e.g., VIB34D framework, orchestration engines) require coordinated boot sequences, JSON configuration, and integration with codex telemetry. Consult the relevant sections for bootstrap APIs.
2. **Performance & Resource Planning**
   - Profile GPU/CPU budgets before deploying WebGL-heavy modules; leverage `VisualizerPool` and component-level throttles (`performanceBudget`, `maxContexts`) to stay within target frame times.
   - Preload shader and texture assets when running from local servers to avoid runtime hitches, and provide static fallbacks for low-power or WebGL-disabled environments.
3. **Accessibility & Inclusivity**
   - Honor `prefers-reduced-motion` and `prefers-reduced-transparency` user settings by supplying alternate animation timelines or static backgrounds.
   - Ensure ARIA labels, live-region updates, and focus-visible states remain intact when composing experiences from multiple components.
4. **Testing & QA Alignment**
   - Pair any gallery or mobile deployment with the appropriate Puppeteer suites (Entries 31–33) to maintain regression coverage.
   - Update `MOBILE_GALLERY_TEST_REPORT.md` after significant UX or performance changes to keep the audit trail fresh.
5. **Operational Readiness**
   - Use `start-gallery.py` or documented local server instructions to guarantee consistent CORS behavior across reviewers.
   - Surface telemetry via `SystemController` heartbeats and interaction logs for observability during live events or demos.

> **Maintenance Tip**: When new codex entries are added, update both the manifest and associated dataset JSON files to keep galleries, orchestration engines, and automated tests in sync.
