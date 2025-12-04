# ScrollTrigger Configurations

**Pattern 03** - Pinning, Scrub Variants, and Pure Triggers

---

## Overview

ScrollTrigger transforms scroll position into animation progress. This pattern covers the three primary configuration modes used in production.

**Complexity**: Tier 2
**Dependencies**: GSAP 3.12+, ScrollTrigger
**Source Files**: All choreographer files

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  SCROLLTRIGGER MODES                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐        │
│  │   PINNING   │   │    SCRUB    │   │    PURE     │        │
│  │             │   │             │   │   TRIGGER   │        │
│  │  pin: true  │   │  scrub: 1   │   │  callbacks  │        │
│  │  Locks      │   │  Ties to    │   │  only       │        │
│  │  element    │   │  scroll %   │   │             │        │
│  └─────────────┘   └─────────────┘   └─────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Pinning & Locking

Pin an element in place while scrolling through content.

```javascript
// Basic pinning
gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "+=200%",        // Pin for 2x viewport heights
    pin: true,
    anticipatePin: 1,     // Prevents jank on pin start
    pinSpacing: true      // Adds space for pinned content
  }
})
.to(".hero-title", { scale: 0.5, opacity: 0 })
.to(".hero-bg", { yPercent: -50 });
```

### Pin with Custom Spacer

```javascript
ScrollTrigger.create({
  trigger: ".sticky-section",
  start: "top top",
  end: "bottom top",
  pin: true,
  pinSpacing: "margin",  // Use margin instead of padding
  pinReparent: true      // Reparent to body (fixes z-index issues)
});
```

### Horizontal Scroll Pin

```javascript
const sections = gsap.utils.toArray(".horizontal-section");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),  // Snap to sections
    end: () => "+=" + document.querySelector(".horizontal-container").offsetWidth
  }
});
```

---

## 2. Scrub Variants

Control how tightly animation follows scroll position.

```javascript
// Scrub comparison
const scrubValues = {
  instant: true,    // Immediate follow
  fast: 0.3,        // Quick response
  balanced: 0.5,    // Default
  smooth: 1.0,      // Cinematic
  cinematic: 1.2    // Maximum smoothing
};

gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    scrub: scrubValues.smooth,  // Pick your style
    start: "top center",
    end: "bottom center"
  }
})
.from(".content", { y: 100, opacity: 0 });
```

### Scrub with Snap Points

```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: ".snap-section",
    scrub: 0.5,
    snap: {
      snapTo: [0, 0.25, 0.5, 0.75, 1],  // Snap points
      duration: 0.5,
      ease: "power2.inOut"
    }
  }
});
```

---

## 3. Pure Triggers (No Animation)

Use ScrollTrigger for callbacks only, without GSAP animations.

```javascript
// Pure trigger for state changes
ScrollTrigger.create({
  trigger: ".feature-section",
  start: "top center",
  end: "bottom center",

  onEnter: () => {
    document.body.classList.add('feature-active');
    visualizer.updateParameters({ chaos: 0.3 });
  },

  onLeave: () => {
    document.body.classList.remove('feature-active');
  },

  onEnterBack: () => {
    document.body.classList.add('feature-active');
  },

  onLeaveBack: () => {
    visualizer.updateParameters({ chaos: 0.1 });
  }
});
```

### Progress Tracking

```javascript
ScrollTrigger.create({
  trigger: ".progress-section",
  start: "top center",
  end: "bottom center",

  onUpdate: (self) => {
    // self.progress = 0 to 1
    const progress = self.progress;

    progressBar.style.width = `${progress * 100}%`;
    visualizer.updateParameters({
      hue: progress * 360,
      intensity: 0.5 + (progress * 0.5)
    });
  }
});
```

---

## Start/End Position Reference

### Format: `"element-position viewport-position"`

| Position | Description |
|----------|-------------|
| `top` | Top edge |
| `center` | Center |
| `bottom` | Bottom edge |
| `80%` | 80% from top |
| `+=500` | 500px after start |

### Common Configurations

```javascript
// Trigger when element enters viewport
start: "top bottom"
end: "bottom top"

// Trigger when element reaches center
start: "top center"
end: "bottom center"

// Trigger when element fills viewport
start: "top top"
end: "bottom bottom"

// Fixed distance
start: "top 80%"
end: "+=500"
```

---

## Advanced Configurations

### Refresh on Resize

```javascript
ScrollTrigger.create({
  trigger: ".responsive-section",
  invalidateOnRefresh: true,  // Recalculate on resize
  refreshPriority: 1,          // Higher = recalculates first
  onRefresh: (self) => {
    console.log("Trigger refreshed");
  }
});

// Manual refresh
ScrollTrigger.refresh();
```

### Batch Triggers

```javascript
// Efficient handling of many elements
ScrollTrigger.batch(".grid-item", {
  start: "top 80%",
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 50,
      stagger: 0.1
    });
  }
});
```

### Container-Based Scrolling

```javascript
// For scrollable containers (not window)
ScrollTrigger.create({
  trigger: ".inner-content",
  scroller: ".scroll-container",  // Custom scroll container
  start: "top top",
  end: "bottom bottom"
});
```

---

## Parameters Quick Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `trigger` | element/string | required | Element that triggers |
| `start` | string | "top bottom" | Trigger start |
| `end` | string | "bottom top" | Trigger end |
| `scrub` | bool/number | false | Tie to scroll |
| `pin` | bool/element | false | Pin element |
| `anticipatePin` | number | 0 | Preemptive pinning |
| `pinSpacing` | bool/string | true | Add space for pin |
| `snap` | number/array/object | none | Snap points |
| `markers` | bool | false | Debug markers |
| `toggleClass` | string/object | none | Toggle CSS class |
| `once` | bool | false | Trigger once only |

---

## Performance Tips

1. **Limit triggers**: Max 8-10 per page
2. **Use `batch()`**: For many similar elements
3. **Avoid nested triggers**: Can cause calculation loops
4. **Set `fastScrollEnd: true`**: For smooth fast scrolling
5. **Use `invalidateOnRefresh`**: Only when needed

```javascript
ScrollTrigger.config({
  limitCallbacks: true,    // Throttle callbacks
  syncInterval: 40,        // Sync check interval (ms)
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load"
});
```

---

## Related Patterns

- [01 - Timeline Creation](./01-timeline-creation-patterns.md)
- [08 - Visualizer Parameter Morphing](./08-visualizer-parameter-morphing.md)
- [12 - Percentage Parameter Binding](./12-percentage-parameter-binding.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 03** - ScrollTrigger Configurations

> *"ScrollTrigger is the conductor. Every scroll pixel is a beat in the visual rhythm."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
