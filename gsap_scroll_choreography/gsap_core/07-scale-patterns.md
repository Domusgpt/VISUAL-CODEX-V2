# Scale Patterns

**Pattern 07** - Grow, Pulse, and Grid Offset Animations

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+

---

## Basic Scale Patterns

### Grow on Entrance

```javascript
gsap.from(".card", {
  scale: 0.2,
  opacity: 0,
  duration: 0.8,
  ease: "back.out(1.5)"
});
```

### Scale with Transform Origin

```javascript
// Scale from corner
gsap.from(".panel", {
  scale: 0,
  transformOrigin: "top left",
  ease: "power2.out"
});

// Scale from bottom
gsap.from(".tooltip", {
  scale: 0,
  transformOrigin: "bottom center",
  ease: "back.out(1.7)"
});
```

---

## Pulse/Breathing Effect

```javascript
// Subtle pulse
gsap.to(".pulse-element", {
  scale: 1.03,          // ±3% oscillation
  duration: 2,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});

// Heartbeat
gsap.timeline({ repeat: -1 })
  .to(".heart", { scale: 1.1, duration: 0.15 })
  .to(".heart", { scale: 1, duration: 0.15 })
  .to(".heart", { scale: 1.15, duration: 0.15 })
  .to(".heart", { scale: 1, duration: 0.5 });
```

---

## Grid Offset Scale

```javascript
const columns = 4;
const items = document.querySelectorAll('.grid-item');

items.forEach((item, i) => {
  const col = i % columns;
  const row = Math.floor(i / columns);

  gsap.from(item, {
    scale: 0.5 + (col * 0.1),  // Offset by column
    opacity: 0,
    delay: row * 0.1,          // Stagger by row
    duration: 0.6
  });
});
```

---

## Scroll-Bound Scale

```javascript
gsap.fromTo(".hero-text",
  { scale: 1 },
  {
    scale: 0.5,
    opacity: 0,
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1
    }
  }
);
```

---

## Common Scale Values

| Start | End | Effect |
|-------|-----|--------|
| 0 | 1 | Pop in |
| 0.2 | 1 | Emerge from small |
| 0.8 | 1 | Subtle grow |
| 1 | 1.03 | Hover/pulse |
| 1 | 0.5 | Recede exit |
| 1 | 0 | Pop out |

---

## Related Patterns

- [06 - 3D Transform Patterns](./06-3d-transform-patterns.md)
- [09 - Three-Phase Animation](./09-three-phase-animation.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
