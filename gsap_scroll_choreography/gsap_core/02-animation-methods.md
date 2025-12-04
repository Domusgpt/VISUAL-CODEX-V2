# Animation Methods

**Pattern 02** - gsap.to(), from(), fromTo() with Parameter Morphing

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+
**Demo**: [Timeline Demo](../demos/timeline-scrolltrigger-demo.html)

---

## Core Methods

### gsap.to() - Animate TO a state

```javascript
// Animate from current state TO target
gsap.to(".element", {
  x: 100,
  opacity: 1,
  scale: 1.2,
  duration: 1,
  ease: "power2.out"
});
```

### gsap.from() - Animate FROM a state

```javascript
// Animate FROM initial state to current
gsap.from(".element", {
  x: -100,
  opacity: 0,
  scale: 0.5,
  duration: 1,
  ease: "power2.out"
});
```

### gsap.fromTo() - Define both states

```javascript
// Explicit start AND end states
gsap.fromTo(".element",
  { x: -100, opacity: 0 },     // FROM
  { x: 100, opacity: 1, duration: 1 }  // TO
);
```

---

## Parameter Morphing

Animate JavaScript object properties directly:

```javascript
const params = {
  intensity: 0,
  chaos: 0.1,
  hue: 0
};

gsap.to(params, {
  intensity: 1,
  chaos: 0.8,
  hue: 360,
  duration: 2,
  ease: "sine.inOut",
  onUpdate: () => {
    visualizer.updateParameters(params);
  }
});
```

### With ScrollTrigger

```javascript
const shaderParams = { blur: 20, saturation: 0 };

gsap.to(shaderParams, {
  blur: 0,
  saturation: 1,
  scrollTrigger: {
    trigger: ".section",
    scrub: 1
  },
  onUpdate: () => {
    element.style.filter = `blur(${shaderParams.blur}px) saturate(${shaderParams.saturation})`;
  }
});
```

---

## Method Comparison

| Method | Use When |
|--------|----------|
| `to()` | Animating to a known end state |
| `from()` | Revealing elements (entrance animations) |
| `fromTo()` | Need explicit control of both states |
| `set()` | Instant property change (no animation) |

---

## Common Patterns

### Reveal on Scroll
```javascript
gsap.from(".card", {
  y: 80,
  opacity: 0,
  stagger: 0.15,
  scrollTrigger: { trigger: ".cards", start: "top 80%" }
});
```

### Exit Animation
```javascript
gsap.to(".modal", {
  y: -50,
  opacity: 0,
  duration: 0.3,
  onComplete: () => modal.remove()
});
```

### State Toggle
```javascript
gsap.fromTo(".toggle",
  { rotation: 0 },
  { rotation: 180, duration: 0.3, paused: true }
);
```

---

## Related Patterns

- [01 - Timeline Creation](./01-timeline-creation-patterns.md)
- [08 - Visualizer Parameter Morphing](./08-visualizer-parameter-morphing.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
