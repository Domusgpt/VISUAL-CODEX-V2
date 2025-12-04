# Repetition & Looping

**Pattern 14** - Infinite Loops, Yoyo, and Relative Rotation

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+

---

## Infinite Loop

```javascript
// Continuous rotation
gsap.to(".spinner", {
  rotation: "+=360",
  duration: 2,
  ease: "none",
  repeat: -1  // -1 = infinite
});
```

---

## Yoyo (Back and Forth)

```javascript
// Breathing pulse
gsap.to(".pulse", {
  scale: 1.1,
  duration: 1,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});

// Hover float
gsap.to(".float-element", {
  y: -15,
  duration: 2,
  ease: "sine.inOut",
  repeat: -1,
  yoyo: true
});
```

---

## Relative Values

```javascript
// Continuous rotation (relative)
gsap.to(".logo", {
  rotation: "+=360",  // Add to current
  repeat: -1,
  ease: "none",
  duration: 3
});

// Oscillating position
gsap.to(".wave", {
  x: "+=50",
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});
```

---

## Repeat with Delay

```javascript
gsap.to(".notification", {
  scale: 1.1,
  repeat: 3,
  yoyo: true,
  repeatDelay: 0.5,
  duration: 0.2
});
```

---

## Stagger with Repeat

```javascript
gsap.to(".dot", {
  scale: 1.5,
  stagger: {
    each: 0.1,
    repeat: -1,
    yoyo: true
  },
  duration: 0.3
});
```

---

## Parameters

| Parameter | Value | Effect |
|-----------|-------|--------|
| `repeat` | -1 | Infinite |
| `repeat` | 3 | 3 additional plays |
| `yoyo` | true | Reverse on repeat |
| `repeatDelay` | 0.5 | Pause between |
| `"+=value"` | relative | Add to current |

---

## Related Patterns

- [01 - Timeline Creation](./01-timeline-creation-patterns.md)
- [07 - Scale Patterns](./07-scale-patterns.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
