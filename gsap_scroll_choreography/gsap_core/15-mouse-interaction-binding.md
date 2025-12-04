# Mouse & Interaction Binding

**Pattern 15** - Pointer Parallax to Visualizer Parameters

---

## Overview

This pattern binds mouse/touch position and movement to GSAP animations and visualizer parameters, creating interactive experiences that respond to user input.

**Complexity**: Tier 2
**Dependencies**: GSAP 3.12+
**Source Files**: VIB3+ visualizers, Simone orbital systems

---

## Core Implementation

### Mouse Position Tracking

```javascript
const mouse = { x: 0.5, y: 0.5 };  // Normalized 0-1

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX / window.innerWidth;
  mouse.y = e.clientY / window.innerHeight;
});

// Touch support
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  mouse.x = touch.clientX / window.innerWidth;
  mouse.y = touch.clientY / window.innerHeight;
});
```

### Smooth Follow with GSAP

```javascript
const follower = document.querySelector('.cursor-follower');
const target = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
  target.x = e.clientX;
  target.y = e.clientY;
});

gsap.ticker.add(() => {
  gsap.to(follower, {
    x: target.x,
    y: target.y,
    duration: 0.3,
    ease: "power2.out"
  });
});
```

---

## Parallax Effects

### Element Parallax

```javascript
const parallaxElements = document.querySelectorAll('.mouse-parallax');

document.addEventListener('mousemove', (e) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  parallaxElements.forEach((el) => {
    const depth = parseFloat(el.dataset.depth) || 1;
    const moveX = (e.clientX - centerX) * depth * 0.02;
    const moveY = (e.clientY - centerY) * depth * 0.02;

    gsap.to(el, {
      x: moveX,
      y: moveY,
      duration: 0.6,
      ease: "power2.out"
    });
  });
});
```

### 3D Tilt Effect

```javascript
const tiltCard = document.querySelector('.tilt-card');

tiltCard.addEventListener('mousemove', (e) => {
  const rect = tiltCard.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const mouseX = e.clientX - rect.left - centerX;
  const mouseY = e.clientY - rect.top - centerY;

  gsap.to(tiltCard, {
    rotationY: (mouseX / centerX) * 15,
    rotationX: -(mouseY / centerY) * 15,
    duration: 0.3,
    ease: "power2.out"
  });
});

tiltCard.addEventListener('mouseleave', () => {
  gsap.to(tiltCard, {
    rotationY: 0,
    rotationX: 0,
    duration: 0.5,
    ease: "power2.out"
  });
});
```

---

## Visualizer Parameter Binding

### Mouse Position → Shader Params

```javascript
const vizParams = {
  rotX: 0,
  rotY: 0,
  intensity: 0.5
};

document.addEventListener('mousemove', (e) => {
  const normX = (e.clientX / window.innerWidth) - 0.5;  // -0.5 to 0.5
  const normY = (e.clientY / window.innerHeight) - 0.5;

  gsap.to(vizParams, {
    rotX: normY * Math.PI * 0.25,
    rotY: normX * Math.PI * 0.25,
    intensity: 0.5 + Math.abs(normX) * 0.3,
    duration: 0.5,
    ease: "power2.out",
    onUpdate: () => visualizer.updateParameters(vizParams)
  });
});
```

### Wheel Event Micro-Adjustments

```javascript
let wheelDelta = 0;

document.addEventListener('wheel', (e) => {
  wheelDelta += e.deltaY * 0.001;
  wheelDelta = Math.max(-1, Math.min(1, wheelDelta));  // Clamp

  gsap.to(vizParams, {
    chaos: 0.2 + Math.abs(wheelDelta) * 0.3,
    duration: 0.3,
    onUpdate: () => visualizer.updateParameters(vizParams)
  });
});
```

---

## Interactive Hover States

### Magnetic Button

```javascript
const button = document.querySelector('.magnetic-btn');

button.addEventListener('mousemove', (e) => {
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  gsap.to(button, {
    x: x * 0.3,
    y: y * 0.3,
    duration: 0.3,
    ease: "power2.out"
  });
});

button.addEventListener('mouseleave', () => {
  gsap.to(button, {
    x: 0,
    y: 0,
    duration: 0.5,
    ease: "elastic.out(1, 0.5)"
  });
});
```

### Spotlight Effect

```javascript
const spotlight = document.querySelector('.spotlight');

document.addEventListener('mousemove', (e) => {
  gsap.to(spotlight, {
    background: `radial-gradient(circle at ${e.clientX}px ${e.clientY}px,
      transparent 0%,
      rgba(0,0,0,0.8) 300px)`,
    duration: 0.1
  });
});
```

---

## Touch Support

```javascript
class InteractionController {
  constructor() {
    this.position = { x: 0.5, y: 0.5 };
    this.isTouch = 'ontouchstart' in window;
    this.bindEvents();
  }

  bindEvents() {
    if (this.isTouch) {
      document.addEventListener('touchmove', (e) => this.onMove(e.touches[0]));
      document.addEventListener('touchend', () => this.onEnd());
    } else {
      document.addEventListener('mousemove', (e) => this.onMove(e));
    }
  }

  onMove(e) {
    this.position.x = e.clientX / window.innerWidth;
    this.position.y = e.clientY / window.innerHeight;
    this.update();
  }

  onEnd() {
    // Reset or maintain state
  }

  update() {
    visualizer.updateParameters({
      rotX: (this.position.y - 0.5) * Math.PI * 0.5,
      rotY: (this.position.x - 0.5) * Math.PI * 0.5
    });
  }
}
```

---

## Parameters

| Input | Mapping | Effect |
|-------|---------|--------|
| Mouse X | -0.5 to 0.5 | Horizontal rotation |
| Mouse Y | -0.5 to 0.5 | Vertical rotation |
| Wheel | Cumulative | Zoom/intensity |
| Distance from center | 0-1 | Intensity multiplier |

---

## Related Patterns

- [08 - Visualizer Parameter Morphing](./08-visualizer-parameter-morphing.md)
- [16 - Orbital Animation](./16-orbital-animation.md)
- [19 - Impulse Event System](../visualizer_systems/19-impulse-event-system.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 15** - Mouse & Interaction Binding

> *"The mouse is a wand. Every movement casts a visual spell."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
