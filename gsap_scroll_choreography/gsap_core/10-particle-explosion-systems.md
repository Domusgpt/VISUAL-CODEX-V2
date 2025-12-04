# Particle & Explosion Systems

**Pattern 10** - Radial Spawn and Per-Particle GSAP Animations

---

## Overview

This pattern creates burst effects where particles spawn from a point and animate outward with individual GSAP tweens. Used for celebrations, transitions, and emphasis effects.

**Complexity**: Tier 2
**Dependencies**: GSAP 3.12+
**Demo**: [Particle System Demo](../demos/particle-system-demo.html)

---

## Core Implementation

### Basic Radial Explosion

```javascript
function createExplosion(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    document.body.appendChild(particle);

    // Radial distribution
    const angle = (i / count) * Math.PI * 2;
    const distance = 100 + Math.random() * 200;
    const targetX = x + Math.cos(angle) * distance;
    const targetY = y + Math.sin(angle) * distance;

    // Individual particle animation
    gsap.fromTo(particle,
      {
        x: x,
        y: y,
        scale: 1,
        opacity: 1
      },
      {
        x: targetX,
        y: targetY,
        scale: 0,
        opacity: 0,
        duration: 0.6 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => particle.remove()
      }
    );
  }
}

// Trigger on click
document.addEventListener('click', (e) => {
  createExplosion(e.clientX, e.clientY, 30);
});
```

### Particle CSS

```css
.particle {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7B3FF2, #4FC3F7);
  pointer-events: none;
  z-index: 9999;
}
```

---

## Advanced Patterns

### Confetti Burst

```javascript
function createConfetti(x, y, count = 50) {
  const colors = ['#7B3FF2', '#4FC3F7', '#26A69A', '#FF6B6B', '#FFE66D'];

  for (let i = 0; i < count; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.background = colors[i % colors.length];
    document.body.appendChild(confetti);

    const angle = Math.random() * Math.PI * 2;
    const velocity = 200 + Math.random() * 300;
    const spin = (Math.random() - 0.5) * 1080;

    gsap.fromTo(confetti,
      {
        x: x,
        y: y,
        rotation: 0,
        scale: 1
      },
      {
        x: x + Math.cos(angle) * velocity,
        y: y + Math.sin(angle) * velocity + 200,  // Gravity pull
        rotation: spin,
        scale: 0,
        duration: 1 + Math.random() * 0.5,
        ease: "power1.out",
        onComplete: () => confetti.remove()
      }
    );
  }
}
```

### Star Burst

```javascript
function createStarBurst(x, y, points = 8) {
  for (let i = 0; i < points; i++) {
    const star = document.createElement('div');
    star.className = 'star-particle';
    document.body.appendChild(star);

    const angle = (i / points) * Math.PI * 2;
    const distance = 150;

    gsap.timeline()
      .set(star, { x, y, scale: 0 })
      .to(star, {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        scale: 1,
        duration: 0.3,
        ease: "back.out(2)"
      })
      .to(star, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        onComplete: () => star.remove()
      });
  }
}
```

---

## Scroll-Triggered Particles

```javascript
ScrollTrigger.create({
  trigger: ".particle-trigger",
  start: "top center",
  once: true,
  onEnter: () => {
    const rect = document.querySelector('.particle-trigger').getBoundingClientRect();
    createExplosion(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      40
    );
  }
});
```

---

## Continuous Particle Emitter

```javascript
class ParticleEmitter {
  constructor(x, y, rate = 10) {
    this.x = x;
    this.y = y;
    this.rate = rate;
    this.active = false;
  }

  start() {
    this.active = true;
    this.emit();
  }

  stop() {
    this.active = false;
  }

  emit() {
    if (!this.active) return;

    const particle = document.createElement('div');
    particle.className = 'emitter-particle';
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 100;

    gsap.fromTo(particle,
      { x: this.x, y: this.y, scale: 0.5, opacity: 1 },
      {
        x: this.x + Math.cos(angle) * distance,
        y: this.y + Math.sin(angle) * distance - 50,
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: "power1.out",
        onComplete: () => particle.remove()
      }
    );

    setTimeout(() => this.emit(), 1000 / this.rate);
  }
}

// Usage
const emitter = new ParticleEmitter(window.innerWidth / 2, window.innerHeight / 2, 15);
emitter.start();
// emitter.stop();
```

---

## Performance Optimization

### Object Pooling

```javascript
class ParticlePool {
  constructor(size = 100) {
    this.pool = [];
    for (let i = 0; i < size; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle pooled';
      particle.style.display = 'none';
      document.body.appendChild(particle);
      this.pool.push(particle);
    }
    this.available = [...this.pool];
  }

  get() {
    if (this.available.length === 0) return null;
    const particle = this.available.pop();
    particle.style.display = 'block';
    return particle;
  }

  release(particle) {
    particle.style.display = 'none';
    gsap.set(particle, { clearProps: "all" });
    this.available.push(particle);
  }
}

const pool = new ParticlePool(50);

function createPooledExplosion(x, y, count = 20) {
  for (let i = 0; i < count; i++) {
    const particle = pool.get();
    if (!particle) return;

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
        onComplete: () => pool.release(particle)
      }
    );
  }
}
```

---

## Parameters

| Parameter | Range | Effect |
|-----------|-------|--------|
| `count` | 10-100 | Number of particles |
| `distance` | 50-400 | Spread radius |
| `duration` | 0.4-1.5 | Animation length |
| `gravity` | 0-300 | Y offset (fall) |
| `spin` | 0-1080 | Rotation degrees |

---

## Related Patterns

- [05 - Stagger Patterns](./05-stagger-patterns.md)
- [11 - Chromatic Aberration](./11-chromatic-aberration.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 10** - Particle & Explosion Systems

> *"Particles are visual punctuation. Each burst is an exclamation mark."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
