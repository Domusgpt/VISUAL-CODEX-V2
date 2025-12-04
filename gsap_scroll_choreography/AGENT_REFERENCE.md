# GSAP Scroll Choreography - Agent Reference

**Compact context for AI agents implementing scroll animations**

---

## Core GSAP Patterns

### Timeline with ScrollTrigger
```javascript
gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top center",   // element top hits viewport center
    end: "bottom center",
    scrub: 1,              // 0.3=fast, 1=smooth, 1.2=cinematic
    pin: true,             // locks section during animation
    anticipatePin: 1
  }
})
.from(".item", { opacity: 0, y: 50, stagger: 0.15 })
.to(".bg", { backgroundColor: "#7B3FF2" }, "<");
```

### Easing Reference
| Easing | Use |
|--------|-----|
| `power2.out` | Card entrance |
| `power4.out` | Hero reveal |
| `back.out(1.7)` | Bounce/overshoot |
| `sine.inOut` | Breathing pulse |
| `none` | Linear rotation |

### Three-Phase Animation
```javascript
// 0-30%: ENTRANCE
.from(".card", { z: -3000, opacity: 0, scale: 0.2 })

// 30-70%: LOCK (center stage)
.to(".card", { scale: 1.03 }, "+=0.1")  // subtle pulse

// 70-100%: EXIT
.to(".card", { rotationY: 180, opacity: 0 })
```

### 3D Transform Ranges
| Transform | Range | Effect |
|-----------|-------|--------|
| `z` | -3000 to 0 | Depth emergence |
| `rotationY` | 180 to 0 | Flip reveal |
| `rotationX` | -90 to 0 | Tilt back |
| `scale` | 0.2 to 1.0 | Size reveal |

---

## WebGL Visualizer Binding

### Holographic Params (JusDNCE Style)
```typescript
interface HoloParams {
  geometryType: number;  // 0=Tetra, 1=Box, 2=Sponge
  density: number;       // 0.3-2.5 (fog, high=thick)
  chaos: number;         // 0-1 (fractal mutation)
  morph: number;         // 0-1 (geometry blend)
  hue: number;           // 0-360 (color)
  intensity: number;     // 0.3-1.5 (brightness)
}
```

### Scroll → Shader Binding
```javascript
ScrollTrigger.create({
  trigger: ".section",
  onUpdate: (self) => {
    // Inverse density: fog clears on scroll
    params.density = 2.5 - (self.progress * 2.0);
    params.chaos = 0.3 + (self.progress * 0.4);
    params.hue = self.progress * 360;
    visualizer.update(params);
  }
});
```

### Impulse Event System
```javascript
// Trigger visual impulse
window.dispatchEvent(new CustomEvent('ui-interaction', {
  detail: { type: 'click', intensity: 1.0 }
}));

// Listener in visualizer
window.addEventListener('ui-interaction', (e) => {
  this.impulse = e.detail.intensity;
  this.density = 0.4;  // Clear fog on interaction
});
```

---

## Quantum Glassmorphism CSS

### Glass Panel
```css
.glass-panel {
  background: rgba(15, 15, 17, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

### Glass Button Hover
```css
.glass-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}
```

### Keyframe Animations
```css
@keyframes holoReveal {
  from { transform: scale(0.8) translateY(20px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

---

## Chromatic Aberration

```javascript
// Per-word RGB split
words.forEach((word, i) => {
  gsap.to(word, {
    textShadow: `
      ${-offset}px 0 rgba(255,0,0,0.7),
      ${offset}px 0 rgba(0,255,255,0.7)
    `,
    scrollTrigger: {
      trigger: word,
      scrub: 0.5,
      start: "top 80%",
      end: "top 20%"
    }
  });
});
```

---

## Particle Explosion

```javascript
function createExplosion(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    document.body.appendChild(particle);

    const angle = (i / count) * Math.PI * 2;
    const distance = 100 + Math.random() * 200;

    gsap.fromTo(particle,
      { x, y, scale: 1, opacity: 1 },
      {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => particle.remove()
      }
    );
  }
}
```

---

## State-Based Scroll Canvas

```javascript
const states = [
  { id: 'hero',    start: 0,   end: 100, bg: '#F5F3EF', chaos: 0.1 },
  { id: 'purple',  start: 100, end: 200, bg: '#7B3FF2', chaos: 0.2 },
  { id: 'teal',    start: 200, end: 300, bg: '#26A69A', chaos: 0.3 },
];

states.forEach((state, i) => {
  ScrollTrigger.create({
    trigger: '.scroll-canvas',
    start: `${state.start}vh top`,
    end: `${state.end}vh top`,
    onEnter: () => activateState(i),
    onLeaveBack: () => activateState(i - 1)
  });
});

function activateState(index) {
  const state = states[index];
  gsap.to('.bg', { backgroundColor: state.bg, duration: 1.2 });
  visualizer.update({ chaos: state.chaos });
}
```

---

## Performance Tips

1. **Scrub**: 0.3-1.2 range, higher = smoother but laggier
2. **Pin**: Add `will-change: transform` to pinned elements
3. **WebGL**: Cap `devicePixelRatio` at 2
4. **Stagger**: Max 50 elements per group
5. **Reduced Motion**:
```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(0);
}
```

---

## CDN Links

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
```

---

**Visual Codex Chapter 5** | Paul Phillips | Clear Seas Solutions LLC
