# Chromatic Aberration

**Pattern 11** - RGB Channel Offset Effects

---

## Overview

Chromatic aberration creates a visual "glitch" effect by offsetting RGB color channels, commonly used for emphasis, hover states, and scroll-driven reveals.

**Complexity**: Tier 2
**Dependencies**: GSAP 3.12+
**Demo**: [Chromatic Aberration Demo](../demos/chromatic-aberration-demo.html)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              CHROMATIC ABERRATION LAYERS                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    Original Text: "HELLO"                                    │
│                                                              │
│    R Channel: ─── shifted left ───▶  "HELLO"                │
│    G Channel: ─── center ──────────▶ "HELLO"                │
│    B Channel: ─── shifted right ──▶  "HELLO"                │
│                                                              │
│    Result: Prismatic edge fringing                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## CSS Implementation

### Text Shadow Method

```css
.chromatic-text {
  color: #fff;
  text-shadow:
    -2px 0 rgba(255, 0, 0, 0.7),
    2px 0 rgba(0, 255, 255, 0.7);
}

/* Animated version */
.chromatic-text.active {
  animation: chromatic-pulse 0.1s ease-in-out;
}

@keyframes chromatic-pulse {
  0%, 100% {
    text-shadow:
      -2px 0 rgba(255, 0, 0, 0.7),
      2px 0 rgba(0, 255, 255, 0.7);
  }
  50% {
    text-shadow:
      -4px 0 rgba(255, 0, 0, 0.9),
      4px 0 rgba(0, 255, 255, 0.9);
  }
}
```

### Box Shadow Method (Elements)

```css
.chromatic-element {
  position: relative;
  box-shadow:
    -3px 0 0 rgba(255, 0, 0, 0.5),
    3px 0 0 rgba(0, 255, 255, 0.5);
}
```

---

## GSAP Implementation

### Scroll-Driven Chromatic

```javascript
const words = document.querySelectorAll('.chromatic-word');

words.forEach((word, i) => {
  gsap.fromTo(word,
    {
      textShadow: "0 0 rgba(255,0,0,0), 0 0 rgba(0,255,255,0)"
    },
    {
      textShadow: "-3px 0 rgba(255,0,0,0.7), 3px 0 rgba(0,255,255,0.7)",
      scrollTrigger: {
        trigger: word,
        start: "top 80%",
        end: "top 30%",
        scrub: 0.5
      }
    }
  );
});
```

### Intensity Animation

```javascript
const aberrationParams = { offset: 0 };

gsap.to(aberrationParams, {
  offset: 5,
  duration: 0.5,
  ease: "power2.inOut",
  onUpdate: () => {
    const offset = aberrationParams.offset;
    element.style.textShadow = `
      ${-offset}px 0 rgba(255, 0, 0, 0.7),
      ${offset}px 0 rgba(0, 255, 255, 0.7)
    `;
  }
});
```

### Per-Character Chromatic

```javascript
// Split text into characters
const text = document.querySelector('.split-chromatic');
const chars = text.textContent.split('').map(char => {
  const span = document.createElement('span');
  span.textContent = char;
  return span;
});
text.textContent = '';
chars.forEach(span => text.appendChild(span));

// Stagger chromatic effect
gsap.fromTo(chars,
  { textShadow: "0 0 transparent, 0 0 transparent" },
  {
    textShadow: "-2px 0 rgba(255,0,0,0.8), 2px 0 rgba(0,255,255,0.8)",
    stagger: 0.02,
    scrollTrigger: {
      trigger: text,
      start: "top 70%",
      scrub: 1
    }
  }
);
```

---

## Advanced Patterns

### Glitch Effect

```javascript
function glitchEffect(element, duration = 0.5) {
  const tl = gsap.timeline();

  for (let i = 0; i < 10; i++) {
    const offset = Math.random() * 10 - 5;
    tl.to(element, {
      textShadow: `
        ${offset}px ${Math.random() * 2}px rgba(255,0,0,${0.5 + Math.random() * 0.5}),
        ${-offset}px ${Math.random() * 2}px rgba(0,255,255,${0.5 + Math.random() * 0.5})
      `,
      duration: duration / 10,
      ease: "steps(1)"
    });
  }

  tl.to(element, {
    textShadow: "none",
    duration: 0.1
  });

  return tl;
}

// Trigger on hover
element.addEventListener('mouseenter', () => glitchEffect(element));
```

### Scroll-Velocity Based

```javascript
let lastScroll = 0;
let velocity = 0;

ScrollTrigger.create({
  trigger: ".velocity-section",
  start: "top bottom",
  end: "bottom top",
  onUpdate: (self) => {
    velocity = Math.abs(self.getVelocity()) / 1000;
    velocity = Math.min(velocity, 10);  // Cap at 10px

    document.querySelector('.velocity-text').style.textShadow = `
      ${-velocity}px 0 rgba(255, 0, 0, ${0.3 + velocity * 0.07}),
      ${velocity}px 0 rgba(0, 255, 255, ${0.3 + velocity * 0.07})
    `;
  }
});
```

### RGB Split Filter (CSS)

```css
.chromatic-filter {
  position: relative;
}

.chromatic-filter::before,
.chromatic-filter::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chromatic-filter::before {
  color: rgba(255, 0, 0, 0.8);
  transform: translateX(-2px);
  mix-blend-mode: screen;
}

.chromatic-filter::after {
  color: rgba(0, 255, 255, 0.8);
  transform: translateX(2px);
  mix-blend-mode: screen;
}
```

---

## Parameters

| Parameter | Range | Effect |
|-----------|-------|--------|
| `offset` | 1-10px | Channel separation |
| `opacity` | 0.3-0.9 | Color intensity |
| `duration` | 0.05-0.5s | Animation speed |
| `stagger` | 0.01-0.05s | Per-char delay |

---

## Color Combinations

| Effect | Left Channel | Right Channel |
|--------|--------------|---------------|
| Classic | Red (#FF0000) | Cyan (#00FFFF) |
| Warm | Red (#FF0000) | Blue (#0000FF) |
| Cool | Magenta (#FF00FF) | Green (#00FF00) |
| Neon | Pink (#FF1493) | Lime (#39FF14) |

---

## Related Patterns

- [10 - Particle Systems](./10-particle-explosion-systems.md)
- [13 - Filter & Blur](./13-filter-blur-patterns.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 11** - Chromatic Aberration

> *"Split the light, reveal the spectrum. Every pixel contains a rainbow waiting to separate."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
