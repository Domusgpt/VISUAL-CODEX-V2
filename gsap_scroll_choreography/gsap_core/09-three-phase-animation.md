# Three-Phase Animation

**Pattern 09** - ENTRANCE → LOCK → EXIT Lifecycle

---

## Overview

The Three-Phase Animation pattern creates a complete content lifecycle where elements enter, hold center stage, then exit. This creates narrative scroll experiences with clear visual hierarchy.

**Complexity**: Tier 3
**Dependencies**: GSAP 3.12+, ScrollTrigger
**Demo**: [Three-Phase Demo](../demos/three-phase-animation-demo.html)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              THREE-PHASE ANIMATION LIFECYCLE                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PHASE 1: ENTRANCE (0-30%)                                   │
│  ────────────────────────                                    │
│  • Emerge from depth (z: -3000 → 0)                         │
│  • Scale up (0.2 → 1.0)                                     │
│  • Fade in (opacity: 0 → 1)                                 │
│  • Optional rotation                                         │
│                                                              │
│  PHASE 2: LOCK (30-70%)                                      │
│  ──────────────────────                                      │
│  • Center stage                                              │
│  • Full opacity                                              │
│  • Subtle pulse only (scale: 1 → 1.03 → 1)                  │
│  • User focus zone                                           │
│                                                              │
│  PHASE 3: EXIT (70-100%)                                     │
│  ───────────────────────                                     │
│  • Disperse/rotate out                                       │
│  • Scale down or up                                          │
│  • Fade out                                                  │
│  • Make room for next element                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Implementation

### Basic Three-Phase Timeline

```javascript
function createThreePhaseTimeline(element, config = {}) {
  const defaults = {
    entranceDepth: -3000,
    entranceScale: 0.2,
    lockScale: 1.03,
    exitRotation: 180,
    exitScale: 0.5
  };
  const opts = { ...defaults, ...config };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1
    }
  });

  // PHASE 1: ENTRANCE (0-30%)
  tl.from(element, {
    z: opts.entranceDepth,
    scale: opts.entranceScale,
    opacity: 0,
    duration: 0.3,
    ease: "power3.out"
  });

  // PHASE 2: LOCK (30-70%) - subtle pulse
  tl.to(element, {
    scale: opts.lockScale,
    duration: 0.2,
    ease: "sine.inOut"
  })
  .to(element, {
    scale: 1,
    duration: 0.2,
    ease: "sine.inOut"
  });

  // PHASE 3: EXIT (70-100%)
  tl.to(element, {
    rotationY: opts.exitRotation,
    scale: opts.exitScale,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in"
  });

  return tl;
}

// Apply to elements
document.querySelectorAll('.phase-card').forEach(card => {
  createThreePhaseTimeline(card);
});
```

### Pinned Section Variant

```javascript
const pinnedPhase = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "+=300%",  // 3x viewport for full lifecycle
    pin: true,
    scrub: 1
  }
});

// Phase 1: Entrance (0-33% of scroll)
pinnedPhase
  .from(".hero-title", {
    y: 200,
    opacity: 0,
    scale: 0.5,
    duration: 1
  })
  .from(".hero-subtitle", {
    y: 100,
    opacity: 0,
    duration: 0.5
  }, "-=0.5");

// Phase 2: Lock (33-66% of scroll)
pinnedPhase
  .to(".hero-title", {
    scale: 1.02,
    duration: 0.5
  })
  .to(".hero-title", {
    scale: 1,
    duration: 0.5
  });

// Phase 3: Exit (66-100% of scroll)
pinnedPhase
  .to(".hero-title", {
    y: -200,
    opacity: 0,
    scale: 1.5,
    duration: 1
  })
  .to(".hero-subtitle", {
    y: -100,
    opacity: 0,
    duration: 0.5
  }, "-=0.5");
```

---

## Card Stack Pattern

Multiple cards with staggered phases:

```javascript
const cards = gsap.utils.toArray('.stack-card');

cards.forEach((card, i) => {
  const phaseOffset = i * 0.2;  // Offset each card's phase

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".stack-container",
      start: `${phaseOffset * 100}% top`,
      end: `${(phaseOffset + 0.6) * 100}% top`,
      scrub: 1
    }
  });

  // Entrance
  tl.from(card, {
    z: -2000 - (i * 500),
    rotationX: -45,
    opacity: 0,
    duration: 0.3
  });

  // Lock
  tl.to(card, {
    y: -10,
    duration: 0.2
  })
  .to(card, {
    y: 0,
    duration: 0.2
  });

  // Exit
  tl.to(card, {
    y: -300,
    rotationX: 30,
    opacity: 0,
    duration: 0.3
  });
});
```

---

## Visualizer Integration

Sync visualizer params with phases:

```javascript
const phaseParams = {
  entrance: { chaos: 0.8, intensity: 0.3, density: 2.5 },
  lock:     { chaos: 0.2, intensity: 0.8, density: 0.5 },
  exit:     { chaos: 0.6, intensity: 0.4, density: 1.5 }
};

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top top",
    end: "+=300%",
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress;
      let params;

      if (progress < 0.3) {
        // Entrance phase
        const p = progress / 0.3;
        params = lerpParams(phaseParams.entrance, phaseParams.lock, p);
      } else if (progress < 0.7) {
        // Lock phase
        params = phaseParams.lock;
      } else {
        // Exit phase
        const p = (progress - 0.7) / 0.3;
        params = lerpParams(phaseParams.lock, phaseParams.exit, p);
      }

      visualizer.updateParameters(params);
    }
  }
});

function lerpParams(a, b, t) {
  const result = {};
  Object.keys(a).forEach(key => {
    result[key] = a[key] + (b[key] - a[key]) * t;
  });
  return result;
}
```

---

## Phase Timing Reference

| Phase | Scroll Range | Duration | Purpose |
|-------|--------------|----------|---------|
| Entrance | 0-30% | 0.3 | Capture attention |
| Lock | 30-70% | 0.4 | Content consumption |
| Exit | 70-100% | 0.3 | Clear for next |

### Adjusting Phase Ratios

```javascript
// Short lock phase (quick scroll)
const quickPhases = { entrance: 0.4, lock: 0.2, exit: 0.4 };

// Long lock phase (reading content)
const readingPhases = { entrance: 0.2, lock: 0.6, exit: 0.2 };

// Dramatic entrance
const dramaticPhases = { entrance: 0.5, lock: 0.3, exit: 0.2 };
```

---

## CSS Support

```css
.phase-card {
  perspective: 1200px;
  transform-style: preserve-3d;
  will-change: transform, opacity;
}

/* Lock phase indicator */
.phase-card.locked {
  box-shadow: 0 0 40px rgba(123, 63, 242, 0.3);
}
```

---

## Related Patterns

- [06 - 3D Transform Patterns](./06-3d-transform-patterns.md)
- [07 - Scale Patterns](./07-scale-patterns.md)
- [08 - Visualizer Parameter Morphing](./08-visualizer-parameter-morphing.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 09** - Three-Phase Animation

> *"Every element has a birth, a purpose, and a graceful departure. Three acts of the scroll drama."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
