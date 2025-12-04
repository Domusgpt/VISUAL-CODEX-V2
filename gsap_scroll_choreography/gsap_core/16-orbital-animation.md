# Orbital Animation

**Pattern 16** - Simone-Style Expand/Collapse Orbits

---

## Overview

This pattern creates orbital element arrangements that expand and collapse based on scroll or interaction, inspired by the Simone web project's navigation system.

**Complexity**: Tier 3
**Dependencies**: GSAP 3.12+
**Source Files**: Simone project, ClearSeas orbital nav

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ORBITAL ARRANGEMENT                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│         Collapsed                    Expanded                │
│                                                              │
│            ●●●                    ●       ●                  │
│            ●●●          ───▶          ●                      │
│            ●●●                    ●       ●                  │
│                                                              │
│     (stacked center)            (radial orbit)               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Implementation

### Basic Orbital Expand

```javascript
const items = gsap.utils.toArray('.orbit-item');
const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const radius = 200;

function expandOrbit() {
  items.forEach((item, i) => {
    const angle = (i / items.length) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    gsap.to(item, {
      x: x,
      y: y,
      scale: 1,
      opacity: 1,
      duration: 0.6,
      ease: "back.out(1.5)",
      delay: i * 0.05
    });
  });
}

function collapseOrbit() {
  items.forEach((item, i) => {
    gsap.to(item, {
      x: 0,
      y: 0,
      scale: 0.5,
      opacity: 0.5,
      duration: 0.4,
      ease: "power2.in",
      delay: (items.length - i) * 0.03
    });
  });
}
```

### Scroll-Triggered Orbit

```javascript
const orbitTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".orbit-section",
    start: "top center",
    end: "bottom center",
    scrub: 1
  }
});

items.forEach((item, i) => {
  const angle = (i / items.length) * Math.PI * 2;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  orbitTl.to(item, {
    x: x,
    y: y,
    rotation: 360,
    duration: 1
  }, 0);
});
```

---

## xPercent/yPercent Based

Position relative to element's own dimensions:

```javascript
const orbitalConfig = [
  { xPercent: 0, yPercent: -200 },      // Top
  { xPercent: 150, yPercent: -100 },    // Top-right
  { xPercent: 200, yPercent: 0 },       // Right
  { xPercent: 150, yPercent: 100 },     // Bottom-right
  { xPercent: 0, yPercent: 200 },       // Bottom
  { xPercent: -150, yPercent: 100 },    // Bottom-left
  { xPercent: -200, yPercent: 0 },      // Left
  { xPercent: -150, yPercent: -100 }    // Top-left
];

items.forEach((item, i) => {
  const pos = orbitalConfig[i % orbitalConfig.length];

  gsap.to(item, {
    xPercent: pos.xPercent,
    yPercent: pos.yPercent,
    scrollTrigger: {
      trigger: ".orbit-section",
      scrub: 1
    }
  });
});
```

---

## Continuous Orbital Rotation

```javascript
// Rotate entire orbit group
gsap.to(".orbit-container", {
  rotation: 360,
  duration: 30,
  ease: "none",
  repeat: -1
});

// Counter-rotate items to keep upright
items.forEach(item => {
  gsap.to(item, {
    rotation: -360,
    duration: 30,
    ease: "none",
    repeat: -1
  });
});
```

---

## Interactive Orbit

```javascript
class OrbitalMenu {
  constructor(container, items) {
    this.container = container;
    this.items = gsap.utils.toArray(items);
    this.isExpanded = false;
    this.radius = 180;

    this.container.addEventListener('click', () => this.toggle());
  }

  toggle() {
    this.isExpanded ? this.collapse() : this.expand();
    this.isExpanded = !this.isExpanded;
  }

  expand() {
    this.items.forEach((item, i) => {
      const angle = (i / this.items.length) * Math.PI * 2 - Math.PI / 2;

      gsap.to(item, {
        x: Math.cos(angle) * this.radius,
        y: Math.sin(angle) * this.radius,
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: i * 0.05
      });
    });
  }

  collapse() {
    this.items.forEach((item, i) => {
      gsap.to(item, {
        x: 0,
        y: 0,
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        delay: (this.items.length - 1 - i) * 0.03
      });
    });
  }
}

new OrbitalMenu('.orbit-trigger', '.orbit-item');
```

---

## Elliptical Orbit

```javascript
const radiusX = 250;
const radiusY = 150;

items.forEach((item, i) => {
  const angle = (i / items.length) * Math.PI * 2;

  gsap.to(item, {
    x: Math.cos(angle) * radiusX,
    y: Math.sin(angle) * radiusY,
    scrollTrigger: {
      trigger: ".section",
      scrub: 1
    }
  });
});
```

---

## CSS Setup

```css
.orbit-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit-item {
  position: absolute;
  transform-origin: center center;
  will-change: transform;
}
```

---

## Parameters

| Parameter | Range | Effect |
|-----------|-------|--------|
| `radius` | 100-400 | Orbit size |
| `items` | 4-12 | Number of elements |
| `delay` | 0.03-0.1 | Stagger between items |
| `ease` | back.out | Bounce effect |

---

## Related Patterns

- [05 - Stagger Patterns](./05-stagger-patterns.md)
- [15 - Mouse Interaction](./15-mouse-interaction-binding.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 16** - Orbital Animation

> *"Every element finds its orbit. The UI is a solar system."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
