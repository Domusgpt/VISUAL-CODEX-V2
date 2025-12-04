# Quantum Glassmorphism

**Pattern 21** - Complete Dark-Mode Glass Design System

---

## Overview

Quantum Glassmorphism is a dark-mode UI aesthetic combining translucent panels, blur effects, subtle borders, and glow states. It creates a premium, futuristic interface that integrates with WebGL backgrounds.

**Complexity**: Tier 2
**Dependencies**: CSS, backdrop-filter
**Demo**: [Quantum Glassmorphism Demo](../demos/quantum-glassmorphism-demo.html)

---

## Core Design Tokens

```css
:root {
  /* Glass backgrounds */
  --glass-bg: rgba(15, 15, 17, 0.6);
  --glass-bg-hover: rgba(255, 255, 255, 0.08);
  --glass-bg-active: rgba(255, 255, 255, 0.12);

  /* Borders */
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-border-hover: rgba(255, 255, 255, 0.2);
  --glass-border-active: rgba(255, 255, 255, 0.4);

  /* Glow effects */
  --glow-subtle: 0 0 20px rgba(255, 255, 255, 0.1);
  --glow-medium: 0 0 30px rgba(123, 63, 242, 0.2);
  --glow-strong: 0 0 40px rgba(123, 63, 242, 0.4);

  /* Text */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-tertiary: rgba(255, 255, 255, 0.4);

  /* Accent */
  --accent-primary: #7B3FF2;
  --accent-secondary: #4FC3F7;

  /* Blur values */
  --blur-sm: 8px;
  --blur-md: 16px;
  --blur-lg: 24px;

  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
}
```

---

## Glass Panel

The foundational glass container:

```css
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  padding: 24px;

  /* Smooth transitions */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-panel:hover {
  background: rgba(20, 20, 22, 0.7);
  border-color: var(--glass-border-hover);
  box-shadow: var(--glow-subtle);
}
```

---

## Glass Button

Interactive glass buttons with hover states:

```css
.glass-btn {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-sm));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 12px 24px;

  color: var(--text-primary);
  font-weight: 500;
  cursor: pointer;

  transition: all 0.2s ease;
}

.glass-btn:hover {
  background: var(--glass-bg-hover);
  border-color: var(--glass-border-active);
  box-shadow: var(--glow-subtle);
  transform: translateY(-1px);
}

.glass-btn:active {
  transform: translateY(0);
  background: var(--glass-bg-active);
}

/* Primary variant */
.glass-btn.primary {
  background: rgba(123, 63, 242, 0.2);
  border-color: rgba(123, 63, 242, 0.4);
}

.glass-btn.primary:hover {
  background: rgba(123, 63, 242, 0.3);
  box-shadow: var(--glow-medium);
}
```

---

## Glass Card

Content cards with layered effects:

```css
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  overflow: hidden;

  transition: all 0.3s ease;
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.3),
    var(--glow-subtle);
  border-color: var(--glass-border-hover);
}

.glass-card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--glass-border);
  background: rgba(255, 255, 255, 0.02);
}

.glass-card-body {
  padding: 24px;
}
```

---

## Glass Input

Form inputs with glass styling:

```css
.glass-input {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(var(--blur-sm));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;

  color: var(--text-primary);
  font-size: 16px;

  transition: all 0.2s ease;
}

.glass-input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(123, 63, 242, 0.2);
}

.glass-input::placeholder {
  color: var(--text-tertiary);
}
```

---

## Keyframe Animations

```css
/* Holographic reveal */
@keyframes holoReveal {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

.glass-panel.reveal {
  animation: holoReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Subtle float */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.glass-floating {
  animation: float 6s ease-in-out infinite;
}

/* Text shimmer */
@keyframes textShimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.glass-shimmer-text {
  background: linear-gradient(
    90deg,
    var(--text-primary) 0%,
    var(--accent-secondary) 50%,
    var(--text-primary) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShimmer 3s linear infinite;
}

/* Glitch effect */
@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

.glass-glitch:hover {
  animation: glitch 0.3s ease-in-out;
}
```

---

## GSAP Integration

```javascript
// Reveal with GSAP
gsap.from(".glass-panel", {
  opacity: 0,
  y: 30,
  scale: 0.95,
  filter: "blur(10px)",
  duration: 0.6,
  ease: "power3.out",
  stagger: 0.1
});

// Hover glow enhancement
const cards = document.querySelectorAll('.glass-card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, {
      boxShadow: "0 0 40px rgba(123, 63, 242, 0.3)",
      duration: 0.3
    });
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, {
      boxShadow: "0 0 0px rgba(123, 63, 242, 0)",
      duration: 0.5
    });
  });
});
```

---

## Grid Layout

```css
.glass-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  padding: 24px;
}

@media (max-width: 768px) {
  .glass-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
}
```

---

## Dark Mode Compatibility

```css
/* Already designed for dark backgrounds */
body {
  background: #0A0A0B;
  color: var(--text-primary);
}

/* Light mode override if needed */
@media (prefers-color-scheme: light) {
  :root {
    --glass-bg: rgba(255, 255, 255, 0.7);
    --glass-border: rgba(0, 0, 0, 0.1);
    --text-primary: rgba(0, 0, 0, 0.9);
  }
}
```

---

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| backdrop-filter | 76+ | 103+ | 9+ | 79+ |
| blur() | 18+ | 35+ | 6+ | 79+ |

```css
/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(1px)) {
  .glass-panel {
    background: rgba(15, 15, 17, 0.95);
  }
}
```

---

## Related Patterns

- [18 - Holographic Visualizer](./18-holographic-visualizer-system.md)
- [13 - Filter & Blur Patterns](../gsap_core/13-filter-blur-patterns.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 21** - Quantum Glassmorphism

> *"Glass panels are windows into the quantum field. The UI floats between dimensions."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
