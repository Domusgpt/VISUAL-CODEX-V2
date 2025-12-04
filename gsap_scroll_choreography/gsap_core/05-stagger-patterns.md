# Stagger Patterns

**Pattern 05** - Fixed, Index-Based, and Callback Staggers

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+

---

## Basic Staggers

### Fixed Delay Stagger

```javascript
gsap.from(".card", {
  y: 50,
  opacity: 0,
  stagger: 0.15,  // 0.15s between each
  ease: "power2.out"
});
```

### Stagger Object

```javascript
gsap.from(".card", {
  y: 50,
  opacity: 0,
  stagger: {
    each: 0.1,       // Time between each
    from: "start",   // Direction: start, end, center, edges, random
    grid: "auto",    // For grid layouts
    ease: "power2.in" // Easing of stagger timing
  }
});
```

---

## Stagger Directions

| Value | Effect |
|-------|--------|
| `"start"` | First to last |
| `"end"` | Last to first |
| `"center"` | Center outward |
| `"edges"` | Edges to center |
| `"random"` | Random order |
| `[0.5, 0.5]` | From specific point (grid) |

```javascript
// Center outward
gsap.from(".item", {
  scale: 0,
  stagger: { each: 0.1, from: "center" }
});

// Random order
gsap.from(".particle", {
  opacity: 0,
  stagger: { each: 0.05, from: "random" }
});
```

---

## Grid Staggers

```javascript
// 4x3 grid animation
gsap.from(".grid-item", {
  scale: 0,
  stagger: {
    each: 0.1,
    grid: [4, 3],        // 4 columns, 3 rows
    from: "center",       // Ripple from center
    axis: "y"            // y-axis priority
  }
});
```

---

## Index-Based Delay

```javascript
const cards = document.querySelectorAll('.card');

cards.forEach((card, i) => {
  gsap.from(card, {
    y: 50,
    opacity: 0,
    delay: i * 0.2,  // Manual stagger
    duration: 0.5
  });
});
```

---

## Callback Stagger

```javascript
gsap.from(".item", {
  y: 50,
  stagger: {
    each: 0.1,
    onStart: function() {
      this.targets()[0].classList.add('animating');
    },
    onComplete: function() {
      this.targets()[0].classList.remove('animating');
    }
  }
});
```

---

## Common Values

| Timing | Use Case |
|--------|----------|
| `0.02-0.05s` | Fast reveals, particles |
| `0.1-0.15s` | Card grids |
| `0.2-0.3s` | Sequential content |
| `0.5s+` | Dramatic reveals |

---

## Related Patterns

- [01 - Timeline Creation](./01-timeline-creation-patterns.md)
- [10 - Particle Systems](./10-particle-explosion-systems.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
