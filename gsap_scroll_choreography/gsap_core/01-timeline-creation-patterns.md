# Timeline Creation Patterns

**Pattern 01** - Scroll-Tied, Callback-Based, and Timed Timelines

---

## Overview

GSAP timelines are the foundation of complex scroll animations. This pattern covers three primary timeline creation methods used across Paul Phillips' productions.

**Complexity**: Tier 2
**Dependencies**: GSAP 3.12+, ScrollTrigger
**Source Files**: UnifiedScrollChoreographer.js, DetailedScrollChoreographer.js

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    TIMELINE TYPES                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐ │
│  │  Scroll-Tied   │  │  Callback-     │  │  Timed         │ │
│  │  Timeline      │  │  Based         │  │  Timeline      │ │
│  │                │  │  Timeline      │  │                │ │
│  │  scrub: 1      │  │  onEnter/      │  │  duration: 2   │ │
│  │  progress      │  │  onLeave       │  │  autoplay      │ │
│  └────────────────┘  └────────────────┘  └────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Implementations

### 1. Scroll-Tied Timeline (Scrub)

The most common pattern - animation progress tied directly to scroll position.

```javascript
// Basic scroll-tied timeline
const scrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".content-section",
    start: "top center",      // When element top hits viewport center
    end: "bottom center",     // When element bottom hits viewport center
    scrub: 1,                 // 1 second smoothing
    markers: true             // Debug markers (remove in production)
  }
});

// Chain animations
scrollTimeline
  .from(".hero-title", {
    opacity: 0,
    y: 100,
    duration: 0.5
  })
  .from(".hero-subtitle", {
    opacity: 0,
    y: 50,
    duration: 0.5
  }, "-=0.3")  // Overlap by 0.3
  .from(".cta-button", {
    scale: 0,
    duration: 0.4
  });
```

### 2. Callback-Based Timeline

Triggers animations on scroll events without scrubbing.

```javascript
// Callback timeline - plays on enter, reverses on leave
const callbackTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".feature-section",
    start: "top 80%",
    end: "bottom 20%",
    toggleActions: "play reverse play reverse",
    // Alternative: use callbacks
    onEnter: () => console.log("Section entered"),
    onLeave: () => console.log("Section left"),
    onEnterBack: () => console.log("Scrolled back in"),
    onLeaveBack: () => console.log("Scrolled back out")
  },
  defaults: {
    ease: "power2.out",
    duration: 0.8
  }
});

callbackTimeline
  .from(".feature-card", {
    opacity: 0,
    y: 80,
    stagger: 0.15
  })
  .from(".feature-icon", {
    scale: 0,
    rotation: -180,
    stagger: 0.1
  }, "-=0.5");
```

### 3. Timed Timeline with Scroll Trigger

Plays at normal speed when triggered, not tied to scroll position.

```javascript
// Timed animation triggered by scroll
const timedTimeline = gsap.timeline({
  paused: true,
  defaults: {
    ease: "power3.out"
  }
});

timedTimeline
  .to(".logo", { scale: 1.2, duration: 0.3 })
  .to(".logo", { scale: 1, duration: 0.2 })
  .to(".nav-items", { opacity: 1, y: 0, stagger: 0.05, duration: 0.4 });

// Trigger once on scroll
ScrollTrigger.create({
  trigger: ".header",
  start: "top 90%",
  once: true,  // Only trigger once
  onEnter: () => timedTimeline.play()
});
```

---

## Advanced Patterns

### Timeline with Defaults

```javascript
const timeline = gsap.timeline({
  scrollTrigger: { /* config */ },
  defaults: {
    ease: "power2.out",
    duration: 1,
    opacity: 0  // All animations start from opacity 0
  }
});

// All .from() calls inherit defaults
timeline
  .from(".item-1", { y: 50 })
  .from(".item-2", { x: -50 })
  .from(".item-3", { scale: 0.5 });
```

### Nested Timelines

```javascript
// Master timeline
const master = gsap.timeline({
  scrollTrigger: {
    trigger: ".page",
    start: "top top",
    end: "+=3000",
    scrub: 1,
    pin: true
  }
});

// Child timelines
const heroTl = gsap.timeline();
heroTl.from(".hero", { opacity: 0, scale: 0.8 });

const featuresTl = gsap.timeline();
featuresTl.from(".feature", { y: 100, stagger: 0.2 });

const ctaTl = gsap.timeline();
ctaTl.from(".cta", { scale: 0, rotation: 360 });

// Add children to master at specific points
master
  .add(heroTl, 0)
  .add(featuresTl, 0.3)
  .add(ctaTl, 0.7);
```

### Labels for Precise Timing

```javascript
const tl = gsap.timeline({
  scrollTrigger: { /* config */ }
});

tl.addLabel("start")
  .from(".title", { y: 100 })
  .addLabel("titleDone")
  .from(".cards", { opacity: 0, stagger: 0.1 })
  .addLabel("cardsDone")
  .to(".background", { backgroundColor: "#7B3FF2" }, "titleDone")
  .from(".particles", { scale: 0 }, "cardsDone-=0.5");
```

---

## Parameters Reference

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scrub` | boolean/number | false | Tie to scroll (number = smoothing seconds) |
| `pin` | boolean/element | false | Pin trigger element during animation |
| `anticipatePin` | number | 0 | Preemptive pinning (1 = full anticipation) |
| `start` | string | "top bottom" | Trigger start position |
| `end` | string | "bottom top" | Trigger end position |
| `toggleActions` | string | "play none none none" | Actions: onEnter onLeave onEnterBack onLeaveBack |
| `once` | boolean | false | Only trigger once |
| `markers` | boolean | false | Show debug markers |

### Scrub Values

| Value | Effect | Use Case |
|-------|--------|----------|
| `true` | Instant follow | Precise control |
| `0.3` | Fast follow | UI micro-interactions |
| `0.5` | Balanced | General content |
| `1.0` | Smooth | Full-page sections |
| `1.2` | Cinematic | Hero reveals |

### toggleActions Options

Format: `"onEnter onLeave onEnterBack onLeaveBack"`

| Action | Effect |
|--------|--------|
| `play` | Play forward |
| `pause` | Pause |
| `resume` | Resume from current |
| `reverse` | Play backward |
| `restart` | Start from beginning |
| `reset` | Reset to start (no animation) |
| `complete` | Jump to end |
| `none` | Do nothing |

---

## Combining Patterns

### Scroll Canvas with Multiple Sections

```javascript
class ScrollOrchestrator {
  constructor() {
    this.sections = document.querySelectorAll('.section');
    this.initTimelines();
  }

  initTimelines() {
    this.sections.forEach((section, index) => {
      // Each section gets its own timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          onEnter: () => this.onSectionEnter(index),
          onLeaveBack: () => this.onSectionLeave(index)
        }
      });

      // Add section-specific animations
      tl.from(section.querySelectorAll('.reveal-item'), {
        opacity: 0,
        y: 50,
        stagger: 0.1
      });
    });
  }

  onSectionEnter(index) {
    console.log(`Entered section ${index}`);
  }

  onSectionLeave(index) {
    console.log(`Left section ${index}`);
  }
}
```

---

## Performance Considerations

1. **Limit active triggers**: Max 8-10 ScrollTriggers per page
2. **Use `fastScrollEnd`**: Prevents over-triggering during fast scroll
3. **Batch similar animations**: Combine into single timeline
4. **Cleanup on unmount**: Call `timeline.kill()` and `ScrollTrigger.kill()`

```javascript
// Cleanup pattern
function cleanup() {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  gsap.killTweensOf("*");
}

// React useEffect cleanup
useEffect(() => {
  const tl = gsap.timeline({ /* config */ });
  return () => {
    tl.kill();
  };
}, []);
```

---

## Accessibility

```javascript
// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Instant transitions, no scrub
  gsap.timeline({
    scrollTrigger: {
      trigger: ".section",
      toggleActions: "play none none none"
    }
  })
  .set(".content", { opacity: 1, y: 0 });
} else {
  // Full animations
  gsap.timeline({
    scrollTrigger: {
      trigger: ".section",
      scrub: 1
    }
  })
  .from(".content", { opacity: 0, y: 50 });
}
```

---

## Related Patterns

- [03 - ScrollTrigger Configurations](./03-scrolltrigger-configurations.md)
- [14 - Repetition & Looping](./14-repetition-looping.md)
- [17 - Special Callbacks](./17-special-callbacks.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 01** - Timeline Creation Patterns

> *"Timelines are compositions. Each tween is a note in the scroll symphony."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
