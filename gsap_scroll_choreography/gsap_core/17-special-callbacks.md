# Special Callbacks

**Pattern 17** - .call(), onComplete, and Lifecycle Hooks

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+

---

## Timeline .call() Method

Insert function calls at specific points in a timeline:

```javascript
const tl = gsap.timeline();

tl.from(".title", { opacity: 0, y: 50 })
  .call(() => {
    console.log("Title animation complete");
    document.body.classList.add('title-visible');
  })
  .from(".content", { opacity: 0 })
  .call(() => analytics.track('content_revealed'));
```

---

## Animation Callbacks

```javascript
gsap.to(".element", {
  x: 100,
  duration: 1,

  onStart: () => {
    console.log("Animation started");
    element.classList.add('animating');
  },

  onUpdate: () => {
    // Called every frame
    updateProgress();
  },

  onComplete: () => {
    console.log("Animation complete");
    element.classList.remove('animating');
  },

  onReverseComplete: () => {
    console.log("Reversed back to start");
  }
});
```

---

## ScrollTrigger Lifecycle

```javascript
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  end: "bottom center",

  onEnter: () => {
    console.log("Entered section");
    visualizer.activate();
  },

  onLeave: () => {
    console.log("Left section");
    visualizer.deactivate();
  },

  onEnterBack: () => {
    console.log("Scrolled back into section");
  },

  onLeaveBack: () => {
    console.log("Scrolled back past section");
  },

  onToggle: (self) => {
    console.log("Active:", self.isActive);
  },

  onRefresh: () => {
    console.log("Trigger recalculated");
  }
});
```

---

## Class Toggle Shorthand

```javascript
ScrollTrigger.create({
  trigger: ".section",
  toggleClass: "active",  // Adds/removes 'active' class
  start: "top center",
  end: "bottom center"
});

// Advanced toggle
ScrollTrigger.create({
  trigger: ".section",
  toggleClass: {
    targets: ".nav-link",
    className: "highlighted"
  }
});
```

---

## Cleanup Pattern

```javascript
const tl = gsap.timeline({
  onComplete: () => {
    // Cleanup after timeline
    particles.forEach(p => p.remove());
    gsap.set(".container", { clearProps: "all" });
  }
});
```

---

## Common Use Cases

| Callback | Use Case |
|----------|----------|
| `onStart` | Add loading state class |
| `onComplete` | Remove elements, fire analytics |
| `onUpdate` | Sync external systems |
| `onEnter` | Activate visualizers |
| `onLeave` | Pause background animations |
| `.call()` | Class toggles mid-timeline |

---

## Related Patterns

- [01 - Timeline Creation](./01-timeline-creation-patterns.md)
- [03 - ScrollTrigger Configurations](./03-scrolltrigger-configurations.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
