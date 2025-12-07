# GSAP Scroll Choreography Systems

**Visual Codex Chapter 5** - Advanced Scroll-Driven Animation Orchestration

---

## Overview

This chapter catalogs 22 sophisticated scroll-driven animation patterns extracted from Paul Phillips' web productions. It covers GSAP ScrollTrigger integration with WebGL visualizers, state-based scroll canvases, and the revolutionary Holographic Visualizer system.

**Repository:** https://github.com/Domusgpt/VISUAL-CODEX-V2

---

## Pattern Categories

### GSAP Core Patterns (01-17)

| # | Pattern | Depth | Description |
|---|---------|-------|-------------|
| 01 | [Timeline Creation Patterns](./gsap_core/01-timeline-creation-patterns.md) | Tutorial | Scroll-tied, callback-based, and timed timelines |
| 02 | [Animation Methods](./gsap_core/02-animation-methods.md) | Quick Ref | gsap.to(), from(), fromTo() with parameter morphing |
| 03 | [ScrollTrigger Configurations](./gsap_core/03-scrolltrigger-configurations.md) | Tutorial | Pinning, scrub variants, pure triggers |
| 04 | [Easing Functions Library](./gsap_core/04-easing-functions-library.md) | Quick Ref | Complete easing catalog with visual effects |
| 05 | [Stagger Patterns](./gsap_core/05-stagger-patterns.md) | Quick Ref | Fixed, index-based, and callback staggers |
| 06 | [3D Transform Patterns](./gsap_core/06-3d-transform-patterns.md) | Tutorial | Z-axis depth, rotations, 4D shader params |
| 07 | [Scale Patterns](./gsap_core/07-scale-patterns.md) | Quick Ref | Grow, pulse, grid offset animations |
| 08 | [Visualizer Parameter Morphing](./gsap_core/08-visualizer-parameter-morphing.md) | Tutorial | WebGL shader uniform binding |
| 09 | [Three-Phase Animation](./gsap_core/09-three-phase-animation.md) | Tutorial | ENTRANCE → LOCK → EXIT lifecycle |
| 10 | [Particle & Explosion Systems](./gsap_core/10-particle-explosion-systems.md) | Tutorial | Radial spawn, per-particle GSAP |
| 11 | [Chromatic Aberration](./gsap_core/11-chromatic-aberration.md) | Tutorial | RGB channel offset effects |
| 12 | [Percentage Parameter Binding](./gsap_core/12-percentage-parameter-binding.md) | Quick Ref | Scroll progress → shader params |
| 13 | [Filter & Blur Patterns](./gsap_core/13-filter-blur-patterns.md) | Quick Ref | Progressive blur, CSS filter animation |
| 14 | [Repetition & Looping](./gsap_core/14-repetition-looping.md) | Quick Ref | Infinite loops, yoyo, relative rotation |
| 15 | [Mouse & Interaction Binding](./gsap_core/15-mouse-interaction-binding.md) | Tutorial | Pointer parallax to visualizer |
| 16 | [Orbital Animation](./gsap_core/16-orbital-animation.md) | Tutorial | Simone-style expand/collapse orbits |
| 17 | [Special Callbacks](./gsap_core/17-special-callbacks.md) | Quick Ref | .call(), onComplete, lifecycle hooks |
| 22 | [Reactive GSAP Geometry System](./gsap_core/22-reactive-gsap-geometry-system.md) | Tutorial | Multi-input WebGL with 4D rotation, click impulse, chakra colors |

### Visualizer System Patterns (18-21)

| # | Pattern | Depth | Description |
|---|---------|-------|-------------|
| 18 | [Holographic Visualizer System](./visualizer_systems/18-holographic-visualizer-system.md) | Tutorial | WebGL raymarching with KIFS fractals |
| 19 | [Impulse Event System](./visualizer_systems/19-impulse-event-system.md) | Tutorial | UI interaction → shader reactivity |
| 20 | [Inverse Density Fog Effect](./visualizer_systems/20-inverse-density-fog.md) | Tutorial | Fog clears on interaction pattern |
| 21 | [Quantum Glassmorphism](./visualizer_systems/21-quantum-glassmorphism.md) | Tutorial | Complete dark-mode glass design system |

---

## Standalone Demos

| Demo | Patterns Covered | Description |
|------|------------------|-------------|
| [Timeline & ScrollTrigger](./demos/timeline-scrolltrigger-demo.html) | 01, 02, 03, 14 | Core GSAP scroll orchestration |
| [Three-Phase Animation](./demos/three-phase-animation-demo.html) | 09 | ENTRANCE → LOCK → EXIT lifecycle |
| [Particle System](./demos/particle-system-demo.html) | 10 | Explosion spawn patterns |
| [Chromatic Aberration](./demos/chromatic-aberration-demo.html) | 11 | RGB split text effects |
| [Visualizer Binding](./demos/visualizer-binding-demo.html) | 08, 12 | Scroll → WebGL parameter sync |
| [Holographic Visualizer](./demos/holographic-visualizer-demo.html) | 18, 19, 20 | Complete JusDNCE-style WebGL |
| [Quantum Glassmorphism](./demos/quantum-glassmorphism-demo.html) | 21 | Dark glass UI components |
| [Reactive GSAP Geometry](./demos/reactive-gsap-geometry-system.html) | 22 | Full 800vh scroll with 4D geometry |
| [Reactive Geometry Variations](./demos/reactive-geometry-variations.html) | 22 | 4 variations: buttons, sliders, hover, scroll |

---

## Live Reference Projects

| Project | URL | Key Patterns |
|---------|-----|--------------|
| Better Than Fresh | [morphing-experience.html](https://domusgpt.github.io/Better-Than-Fresh/branch-versions/morphing-experience.html) | 8-state scroll canvas, OceanVisualizer |
| Working AI Blog | [working-ai-blog](https://working-ai-blog-structure-209731282315.us-west1.run.app/) | Framer Motion morphing, D3.js |
| MINOOTS Web | [minoots-web](https://domusgpt.github.io/minoots-web/) | VIB3+ Quantum, melting transitions |
| JusDNCE | [JusDNCE-core2](https://domusgpt.github.io/JusDNCE-core2/) | Holographic Visualizer, Impulse System |
| Clear Seas Codex | [minoots-flow](https://domusgpt.github.io/Clearseas-codex-web/builds/minoots-flow/index.html) | 3D carousel, GSAP choreography |
| Crystal Grimoire | [crystal-grimoire-2025](https://crystal-grimoire-2025.web.app) | Glassmorphic cards, AI response streaming |
| B-W-Blog-tenplate | [B-W-Blog-tenplate](https://domusgpt.github.io/B-W-Blog-tenplate/) | Reactive GSAP Geometry, 4D rotations, chakra colors |

---

## Quick Start

### Basic ScrollTrigger Pattern

```javascript
// Import GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Create scroll-tied timeline
gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    onEnter: () => visualizer.updateParameters({ chaos: 0.3 }),
    onLeaveBack: () => visualizer.updateParameters({ chaos: 0.1 })
  }
})
.from(".card", { opacity: 0, y: 50, stagger: 0.15 })
.to(".background", { backgroundColor: "#7B3FF2" }, "<");
```

### Holographic Visualizer Integration

```javascript
// JusDNCE-style parameter binding
const holoParams = {
  geometryType: 0,  // 0=Tetra, 1=Box, 2=Sponge
  density: 2.5,     // Fog thickness (clears on interaction)
  chaos: 0.3,       // Fractal mutation
  hue: 180,         // HSL color
  intensity: 0.8    // Brightness
};

// Scroll-driven parameter morphing
ScrollTrigger.create({
  trigger: ".content-section",
  start: "top center",
  end: "bottom center",
  onUpdate: (self) => {
    holoParams.density = 2.5 - (self.progress * 2.0);
    holoParams.chaos = 0.3 + (self.progress * 0.4);
    visualizer.updateParameters(holoParams);
  }
});
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SCROLL ORCHESTRATION                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │   GSAP       │    │  ScrollTrigger│    │  WebGL       │   │
│  │   Timeline   │───▶│  Controller   │───▶│  Visualizer  │   │
│  │              │    │              │    │              │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │                   │                   │           │
│         ▼                   ▼                   ▼           │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  DOM         │    │  Scroll      │    │  Shader      │   │
│  │  Animations  │    │  Progress    │    │  Uniforms    │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Parameters Reference

### ScrollTrigger Scrub Values

| Value | Effect | Use Case |
|-------|--------|----------|
| `0.3` | Fast follow | UI micro-interactions |
| `0.5` | Balanced | General content |
| `1.0` | Smooth | Full-page sections |
| `1.2` | Cinematic | Hero reveals |

### Easing Quick Reference

| Easing | Effect | Use For |
|--------|--------|---------|
| `power2.out` | Deceleration | Card entrance |
| `power4.out` | Strong decel | Hero reveal |
| `back.out(1.7)` | Overshoot | Logo flourish |
| `sine.inOut` | Wave | Breathing/pulse |
| `none` | Linear | Continuous rotation |

### Holographic Params

| Parameter | Range | Default | Effect |
|-----------|-------|---------|--------|
| `geometryType` | 0-2 | 0 | Tetra/Box/Sponge |
| `density` | 0.3-2.5 | 2.5 | Fog thickness |
| `chaos` | 0-1 | 0.3 | Fractal mutation |
| `hue` | 0-360 | 180 | HSL color |
| `intensity` | 0.3-1.5 | 0.8 | Brightness |

---

## Browser Compatibility

| Browser | Version | GSAP | WebGL 2 | Notes |
|---------|---------|------|---------|-------|
| Chrome | 88+ | ✅ | ✅ | Full support |
| Firefox | 85+ | ✅ | ✅ | Full support |
| Safari | 14+ | ✅ | ✅ | Requires `-webkit` prefixes |
| Edge | 88+ | ✅ | ✅ | Full support |

---

## Performance Guidelines

1. **ScrollTrigger**: Limit to 8-10 triggers per page
2. **WebGL**: Cap devicePixelRatio at 2x
3. **Stagger**: Keep < 50 elements per stagger group
4. **will-change**: Apply to pinned elements only
5. **Reduced Motion**: Always provide `prefers-reduced-motion` fallback

---

## Related Chapters

- [Chapter 1: Holographic Parallax](../holographic_parallax/) - Multi-layer depth effects
- [Chapter 2: Neoskeuomorphic UI](../neoskeuomorphic/) - Tactile interface patterns
- [Chapter 3: VIB34D Architecture](../vib34d_architecture/) - 4D polytopal systems
- [Chapter 4: Reality Distortion](../reality_distortion/) - Shader-based transforms

---

## A Paul Phillips Manifestation

**Visual Codex Chapter 5** - GSAP Scroll Choreography Systems

> *"Scroll is the new timeline. Every pixel of progress is a frame of narrative."*

**Contact:** Paul@clearseassolutions.com
**Movement:** [Parserator.com](https://parserator.com)

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
