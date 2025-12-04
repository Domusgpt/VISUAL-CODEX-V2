# 3D Transform Patterns

**Pattern 06** - Z-Axis Depth, Rotations, and 4D Shader Parameters

---

## Overview

3D transforms create depth and dimensionality in scroll animations. This pattern covers Z-axis emergence, rotation reveals, and integration with 4D shader systems.

**Complexity**: Tier 2
**Dependencies**: GSAP 3.12+, ScrollTrigger
**Source Files**: UnifiedScrollChoreographer.js, VIB3+ visualizers

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   3D TRANSFORM SPACE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    Z-Axis                  Rotations                         │
│    ───────                 ─────────                         │
│    -3000px                 rotationX (tilt)                  │
│      ↓                     rotationY (flip)                  │
│    -1000px                 rotationZ (spin)                  │
│      ↓                                                       │
│       0px   ←── viewport   4D Extensions                     │
│      ↓                     rot4dXW, rot4dYW, rot4dZW         │
│    +500px                  (quaternion shader params)        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Z-Axis Depth Patterns

### Emerge from Depth

```javascript
// Element emerges from far background
gsap.from(".card", {
  z: -3000,          // Start far back
  opacity: 0,
  scale: 0.2,
  duration: 1.5,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".section",
    start: "top center",
    scrub: 1
  }
});
```

### Depth Layers

```javascript
// Parallax depth effect
const layers = [
  { element: ".bg-far", z: -2000, speed: 0.3 },
  { element: ".bg-mid", z: -1000, speed: 0.5 },
  { element: ".bg-near", z: -500, speed: 0.7 },
  { element: ".content", z: 0, speed: 1 }
];

layers.forEach(layer => {
  gsap.from(layer.element, {
    z: layer.z,
    scrollTrigger: {
      trigger: ".parallax-section",
      scrub: layer.speed
    }
  });
});
```

### Push to Background

```javascript
// Element recedes on scroll
gsap.to(".receding-card", {
  z: -2000,
  opacity: 0,
  scale: 0.5,
  scrollTrigger: {
    trigger: ".exit-section",
    start: "top top",
    scrub: 1
  }
});
```

---

## Rotation Patterns

### Y-Axis Flip Reveal

```javascript
// Card flip entrance
gsap.from(".flip-card", {
  rotationY: 180,
  opacity: 0,
  duration: 1,
  ease: "power2.out",
  transformPerspective: 1000,  // Essential for 3D
  transformOrigin: "center center"
});
```

### X-Axis Tilt

```javascript
// Tilt back entrance
gsap.from(".tilt-element", {
  rotationX: -90,
  opacity: 0,
  transformPerspective: 800,
  transformOrigin: "bottom center",
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".section",
    scrub: 0.5
  }
});
```

### Z-Axis Spin

```javascript
// Logo spin entrance
gsap.from(".logo", {
  rotation: 1080,  // 3 full rotations
  scale: 0,
  duration: 1.5,
  ease: "back.out(1.7)"
});

// Continuous rotation
gsap.to(".spinner", {
  rotation: "+=360",
  duration: 2,
  ease: "none",
  repeat: -1
});
```

### Combined 3D Rotation

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "+=200%",
    scrub: 1,
    pin: true
  }
})
.from(".hero-card", {
  z: -2000,
  rotationY: 180,
  rotationX: -45,
  opacity: 0,
  scale: 0.3,
  transformPerspective: 1200
})
.to(".hero-card", {
  rotationY: 15,
  rotationX: 5,
  duration: 0.5
}, "+=0.2");
```

---

## 4D Shader Parameter Rotation

Integration with VIB3+ and quaternion-based visualizers.

### Basic 4D Rotation Binding

```javascript
// 4D rotation parameters for shader
const rot4dParams = {
  rot4dXW: 0,
  rot4dYW: 0,
  rot4dZW: 0
};

gsap.timeline({
  scrollTrigger: {
    trigger: ".visualizer-section",
    start: "top center",
    end: "bottom center",
    scrub: 1,
    onUpdate: (self) => {
      // Map scroll progress to 4D rotations
      rot4dParams.rot4dXW = self.progress * Math.PI * 2;
      rot4dParams.rot4dYW = self.progress * Math.PI * 1.5;
      rot4dParams.rot4dZW = self.progress * Math.PI;

      visualizer.updateRotation4D(rot4dParams);
    }
  }
});
```

### Continuous 4D Animation

```javascript
// Infinite 4D rotation (no scrub)
gsap.to(rot4dParams, {
  rot4dXW: "+=6.28318",  // 2π
  rot4dYW: "+=4.71238",  // 1.5π
  rot4dZW: "+=3.14159",  // π
  duration: 20,
  ease: "none",
  repeat: -1,
  onUpdate: () => visualizer.updateRotation4D(rot4dParams)
});
```

### 4D Rotation with Depth

```javascript
// Combined 3D transform + 4D shader
gsap.timeline({
  scrollTrigger: {
    trigger: ".hypercube-section",
    scrub: 1
  }
})
.from(".container", {
  z: -1500,
  opacity: 0,
  scale: 0.5
})
.to(rot4dParams, {
  rot4dXW: Math.PI,
  rot4dYW: Math.PI * 0.5,
  onUpdate: () => visualizer.update(rot4dParams)
}, "<");
```

---

## Transform Parameters

### Essential CSS Properties

```css
.transform-container {
  perspective: 1000px;           /* Parent perspective */
  transform-style: preserve-3d;  /* Enable 3D for children */
}

.transform-element {
  transform-origin: center center;
  backface-visibility: hidden;   /* Hide back face on flip */
  will-change: transform;        /* GPU optimization */
}
```

### GSAP Transform Properties

| Property | Range | Effect |
|----------|-------|--------|
| `z` | -3000 to +500 | Depth position |
| `rotationX` | -180 to 180 | Tilt up/down |
| `rotationY` | -180 to 180 | Turn left/right |
| `rotationZ` / `rotation` | 0 to 360+ | Spin |
| `scale` | 0 to 2+ | Size |
| `transformPerspective` | 400-2000 | 3D intensity |

### 4D Shader Parameters (VIB3+)

| Parameter | Range | Effect |
|-----------|-------|--------|
| `rot4dXW` | 0 to 2π | XW plane rotation |
| `rot4dYW` | 0 to 2π | YW plane rotation |
| `rot4dZW` | 0 to 2π | ZW plane rotation |

---

## Performance Tips

1. **Enable GPU**: Add `will-change: transform` to animated elements
2. **Limit perspective**: Only on container, not individual elements
3. **Batch transforms**: Combine into single timeline
4. **Simplify mobile**: Reduce 3D complexity on touch devices

```javascript
// Mobile-friendly fallback
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

gsap.from(".card", {
  z: isMobile ? -500 : -3000,
  rotationY: isMobile ? 0 : 180,
  opacity: 0
});
```

---

## Related Patterns

- [07 - Scale Patterns](./07-scale-patterns.md)
- [08 - Visualizer Parameter Morphing](./08-visualizer-parameter-morphing.md)
- [09 - Three-Phase Animation](./09-three-phase-animation.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 06** - 3D Transform Patterns

> *"The fourth dimension is just scroll-space waiting to unfold."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
