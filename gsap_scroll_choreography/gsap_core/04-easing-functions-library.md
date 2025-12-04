# Easing Functions Library

**Pattern 04** - Complete GSAP Easing Catalog

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+

---

## Easing Categories

### Power Easings (Most Common)

| Easing | Visual Effect | Use Case |
|--------|---------------|----------|
| `power1.out` | Gentle deceleration | Subtle reveals |
| `power2.out` | Standard deceleration | Card entrance |
| `power3.out` | Strong deceleration | Title entrance |
| `power4.out` | Maximum deceleration | Hero reveal |
| `power1.in` | Gentle acceleration | Exit animations |
| `power2.inOut` | Symmetric | Parameter transitions |

```javascript
// Standard entrance
gsap.from(".card", { y: 50, ease: "power2.out" });

// Hero reveal with strong decel
gsap.from(".hero", { scale: 0.8, ease: "power4.out" });
```

### Back Easings (Overshoot)

| Easing | Overshoot | Use Case |
|--------|-----------|----------|
| `back.out(1.0)` | Slight | Subtle bounce |
| `back.out(1.5)` | Medium | Button press |
| `back.out(1.7)` | Strong | Logo flourish |
| `back.out(2.0)` | Maximum | Playful UI |

```javascript
// Logo entrance with bounce
gsap.from(".logo", {
  scale: 0,
  ease: "back.out(1.7)",
  duration: 0.8
});
```

### Elastic Easings

| Easing | Effect | Use Case |
|--------|--------|----------|
| `elastic.out(1, 0.3)` | Spring bounce | Notification pop |
| `elastic.out(1, 0.5)` | Softer spring | Modal entrance |

```javascript
// Notification pop-in
gsap.from(".notification", {
  scale: 0,
  ease: "elastic.out(1, 0.3)",
  duration: 1
});
```

### Sine Easings (Smooth)

| Easing | Effect | Use Case |
|--------|--------|----------|
| `sine.inOut` | Wave motion | Breathing/pulsing |
| `sine.out` | Gentle ease | Subtle fades |

```javascript
// Breathing effect
gsap.to(".pulse", {
  scale: 1.05,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true,
  duration: 2
});
```

### Special Easings

| Easing | Effect | Use Case |
|--------|--------|----------|
| `none` | Linear | Continuous rotation |
| `steps(5)` | Stepped | Frame animation |
| `circ.out` | Circular | Unique reveals |
| `expo.out` | Exponential | Dramatic reveals |

```javascript
// Continuous rotation
gsap.to(".spinner", {
  rotation: "+=360",
  ease: "none",
  repeat: -1,
  duration: 2
});

// Stepped animation (5 frames)
gsap.to(".sprite", {
  x: 500,
  ease: "steps(5)",
  duration: 1
});
```

---

## Custom Easings

### CustomEase Plugin

```javascript
// Create custom curve
CustomEase.create("paulPhillips", "M0,0 C0.2,0.8 0.4,1.2 1,1");

gsap.to(".element", {
  y: 100,
  ease: "paulPhillips"
});
```

### Functional Easing

```javascript
gsap.to(".element", {
  y: 100,
  ease: (progress) => {
    // Custom easing function
    return Math.pow(progress, 2) * (3 - 2 * progress);
  }
});
```

---

## Visual Reference

```
power2.out:    ████████████▓▓▓░░░░  (fast start, slow end)
power2.in:     ░░░░▓▓▓████████████  (slow start, fast end)
power2.inOut:  ░░░▓▓█████████▓▓░░░  (slow-fast-slow)

back.out:      ████████████▓▓▓░▓░░  (overshoot then settle)
elastic.out:   ████████▓░▓░░▓░░░░░  (bounce oscillation)

sine.inOut:    ░░▓▓▓█████████▓▓▓░░  (gentle wave)
none:          ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  (constant speed)
```

---

## Easing by Animation Type

| Animation Type | Recommended Easing |
|----------------|-------------------|
| Card entrance | `power2.out` |
| Modal open | `power3.out` or `back.out(1.5)` |
| Modal close | `power2.in` |
| Button press | `power1.out` |
| Hover state | `power1.out` |
| Page transition | `power2.inOut` |
| Loading spinner | `none` |
| Breathing pulse | `sine.inOut` |
| Notification | `back.out(1.7)` |
| Hero reveal | `power4.out` |

---

## Related Patterns

- [01 - Timeline Creation](./01-timeline-creation-patterns.md)
- [02 - Animation Methods](./02-animation-methods.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
