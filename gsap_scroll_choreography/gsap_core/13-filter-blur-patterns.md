# Filter & Blur Patterns

**Pattern 13** - Progressive Blur and CSS Filter Animation

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+

---

## Progressive Blur Entrance

```javascript
// Reveal through blur
gsap.from(".blur-reveal", {
  filter: "blur(20px)",
  opacity: 0,
  duration: 1,
  ease: "power2.out"
});
```

---

## Scroll-Bound Blur

```javascript
gsap.fromTo(".blur-section",
  { filter: "blur(20px)" },
  {
    filter: "blur(0px)",
    scrollTrigger: {
      trigger: ".blur-section",
      start: "top 80%",
      end: "top 30%",
      scrub: 1
    }
  }
);
```

---

## Combined Filter Strings

```javascript
// Multiple filters in one animation
gsap.from(".multi-filter", {
  filter: "blur(10px) saturate(0) brightness(0.5)",
  duration: 1.5,
  ease: "power2.out"
});

// To target state
gsap.to(".enhance", {
  filter: "blur(0px) saturate(1.2) brightness(1.1) contrast(1.1)",
  scrollTrigger: { trigger: ".enhance", scrub: 1 }
});
```

---

## Parameter Animation

```javascript
const filterParams = { blur: 20, saturate: 0, brightness: 0.5 };

gsap.to(filterParams, {
  blur: 0,
  saturate: 1,
  brightness: 1,
  scrollTrigger: { trigger: ".section", scrub: 1 },
  onUpdate: () => {
    element.style.filter = `
      blur(${filterParams.blur}px)
      saturate(${filterParams.saturate})
      brightness(${filterParams.brightness})
    `;
  }
});
```

---

## CSS Custom Properties

```css
.filter-animated {
  filter: blur(var(--blur, 0px)) saturate(var(--sat, 1));
}
```

```javascript
gsap.to(".filter-animated", {
  "--blur": "0px",
  "--sat": 1.2,
  scrollTrigger: { trigger: ".section", scrub: 1 }
});
```

---

## Common Filter Values

| Filter | Entrance | Normal | Enhanced |
|--------|----------|--------|----------|
| `blur` | 10-30px | 0px | 0px |
| `saturate` | 0 | 1 | 1.2 |
| `brightness` | 0.5 | 1 | 1.1 |
| `contrast` | 0.8 | 1 | 1.1 |
| `grayscale` | 1 | 0 | 0 |

---

## Performance Note

```css
/* GPU-accelerate filtered elements */
.filter-element {
  will-change: filter;
  transform: translateZ(0);  /* Force GPU layer */
}
```

---

## Related Patterns

- [06 - 3D Transform Patterns](./06-3d-transform-patterns.md)
- [11 - Chromatic Aberration](./11-chromatic-aberration.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
