# Inverse Density Fog Effect

**Pattern 20** - Fog Clears on Interaction

---

## Overview

This unique visual pattern inverts traditional fog behavior: **high density (thick fog) at idle, clearing to reveal structure on user interaction**. It creates a "quantum foam" effect that crystallizes when users engage.

**Complexity**: Tier 2
**Dependencies**: WebGL
**Source Files**: JusDNCE HolographicVisualizer

---

## Concept

```
┌─────────────────────────────────────────────────────────────┐
│                  INVERSE DENSITY LOGIC                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  IDLE STATE                        ACTIVE STATE              │
│  ───────────                       ────────────              │
│  density: 2.5                      density: 0.4              │
│  (thick fog)                       (clear view)              │
│                                                              │
│  ░░░░░░░░░░░░░░░                   ┌───┐                     │
│  ░░░░░░░░░░░░░░░    ───▶           │ ◆ │  (geometry visible) │
│  ░░░░░░░░░░░░░░░                   └───┘                     │
│                                                              │
│  "Quantum foam"                    "Crystallized structure"  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Implementation

### Basic Inverse Fog

```javascript
const fogParams = {
  density: 2.5,  // Thick fog at idle
  minDensity: 0.4,
  maxDensity: 2.5
};

// On interaction
function onInteraction(intensity) {
  // INVERSE: Lower density = more visible
  const targetDensity = fogParams.maxDensity - (intensity * (fogParams.maxDensity - fogParams.minDensity));

  gsap.to(fogParams, {
    density: targetDensity,
    duration: 0.3,
    ease: "power2.out",
    onUpdate: () => visualizer.updateParameters({ density: fogParams.density })
  });
}

// Return to fog on idle
function onIdle() {
  gsap.to(fogParams, {
    density: fogParams.maxDensity,
    duration: 1.5,
    ease: "power1.out",
    onUpdate: () => visualizer.updateParameters({ density: fogParams.density })
  });
}
```

### With Impulse System

```javascript
impulseController.subscribe((impulse) => {
  // Inverse mapping: high impulse = low density
  const density = 2.5 - (impulse * 2.0);

  visualizer.updateParameters({ density });
});
```

### Scroll-Driven Fog Clearing

```javascript
ScrollTrigger.create({
  trigger: ".content-section",
  start: "top center",
  end: "bottom center",

  onUpdate: (self) => {
    // Fog clears as user scrolls into content
    const density = 2.5 - (self.progress * 2.0);
    visualizer.updateParameters({ density });
  },

  onLeave: () => {
    // Fog returns when leaving
    gsap.to(fogParams, {
      density: 2.5,
      duration: 1.0,
      onUpdate: () => visualizer.updateParameters(fogParams)
    });
  }
});
```

---

## Shader Implementation

```glsl
uniform float density;

void main() {
  // ... raymarching code ...

  float t = raymarch(ro, rd);

  // Fog calculation
  // Higher density = more fog = less visible geometry
  float fog = 1.0 - exp(-t * density * 0.1);

  // Geometry glow (inverse of fog)
  float glow = 1.0 / (1.0 + t * t * 0.1);

  // Base color from geometry
  vec3 geometryColor = hsv2rgb(vec3(hue, saturation, intensity * glow));

  // Background color (fog color)
  vec3 fogColor = vec3(0.02, 0.02, 0.03);

  // Mix based on fog amount
  vec3 finalColor = mix(geometryColor, fogColor, fog);

  gl_FragColor = vec4(finalColor, 1.0);
}
```

---

## State Transitions

### Hover Effect

```javascript
element.addEventListener('mouseenter', () => {
  gsap.to(fogParams, {
    density: 0.8,  // Partial clearing
    duration: 0.4,
    ease: "power2.out"
  });
});

element.addEventListener('mouseleave', () => {
  gsap.to(fogParams, {
    density: 2.5,
    duration: 0.8,
    ease: "power1.out"
  });
});
```

### Click Flash

```javascript
element.addEventListener('click', () => {
  // Instant clear
  gsap.to(fogParams, {
    density: 0.3,
    duration: 0.1,
    ease: "power2.out"
  });

  // Slow return
  gsap.to(fogParams, {
    density: 2.5,
    duration: 2.0,
    delay: 0.1,
    ease: "power1.out"
  });
});
```

### Focus State

```javascript
input.addEventListener('focus', () => {
  gsap.to(fogParams, {
    density: 0.6,
    duration: 0.5
  });
});

input.addEventListener('blur', () => {
  gsap.to(fogParams, {
    density: 2.5,
    duration: 1.0
  });
});
```

---

## Parameters

| Parameter | Idle | Active | Effect |
|-----------|------|--------|--------|
| `density` | 2.5 | 0.3-0.8 | Fog thickness |
| `chaos` | 0.2 | 0.5-0.8 | Structure sharpness |
| `intensity` | 0.6 | 0.9-1.2 | Brightness |

---

## Combined Effect

```javascript
// Full interaction response
function onInteraction(type, amount) {
  const configs = {
    click: { density: 0.4, chaos: 0.7, intensity: 1.2 },
    hover: { density: 1.2, chaos: 0.4, intensity: 0.9 },
    scroll: { density: 1.0, chaos: 0.5, intensity: 0.85 }
  };

  const config = configs[type] || configs.hover;

  gsap.to(fogParams, {
    ...config,
    duration: type === 'click' ? 0.2 : 0.5,
    ease: "power2.out",
    onUpdate: () => visualizer.updateParameters(fogParams)
  });
}
```

---

## Visual Metaphor

The inverse density pattern represents:
- **Idle fog**: Potential, unrealized possibility
- **Cleared view**: Crystallized intent, focused attention
- **Returning fog**: Release, return to potential

This creates a breathing quality where the visual field responds to user presence.

---

## Related Patterns

- [18 - Holographic Visualizer](./18-holographic-visualizer-system.md)
- [19 - Impulse Event System](./19-impulse-event-system.md)
- [08 - Visualizer Parameter Morphing](../gsap_core/08-visualizer-parameter-morphing.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 20** - Inverse Density Fog Effect

> *"Attention is a clearing in the quantum fog. Focus reveals structure from chaos."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
