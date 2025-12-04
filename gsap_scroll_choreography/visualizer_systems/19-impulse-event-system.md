# Impulse Event System

**Pattern 19** - UI Interaction to Shader Reactivity

---

## Overview

The Impulse Event System provides a bridge between UI interactions (clicks, hovers, key presses) and WebGL shader parameters. It creates visual feedback that responds to user actions with decaying impulse values.

**Complexity**: Tier 2
**Dependencies**: Custom Events, WebGL
**Source Files**: JusDNCE GlobalBackground.tsx

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    IMPULSE EVENT FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  UI Event    │    │  Impulse     │    │  Shader      │   │
│  │  (click)     │───▶│  Controller  │───▶│  Uniform     │   │
│  │              │    │              │    │              │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│                             │                               │
│                             ▼                               │
│                      Decay over time                        │
│                      1.0 ───▶ 0.0                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Implementation

### Impulse Trigger Function

```javascript
// Global impulse trigger
function triggerImpulse(type, intensity = 1.0) {
  window.dispatchEvent(new CustomEvent('ui-interaction', {
    detail: {
      type: type,         // 'click', 'hover', 'keypress'
      intensity: intensity, // 0.0 to 1.0
      timestamp: Date.now()
    }
  }));
}

// Usage
button.addEventListener('click', () => triggerImpulse('click', 1.0));
card.addEventListener('mouseenter', () => triggerImpulse('hover', 0.3));
document.addEventListener('keydown', () => triggerImpulse('keypress', 0.5));
```

### Impulse Controller Class

```javascript
class ImpulseController {
  constructor() {
    this.impulse = 0;
    this.decayRate = 0.95;  // Per-frame decay (0.9 = fast, 0.99 = slow)
    this.listeners = [];

    window.addEventListener('ui-interaction', (e) => this.onImpulse(e));
    this.update();
  }

  onImpulse(event) {
    const { type, intensity } = event.detail;

    // Different event types can have different effects
    switch (type) {
      case 'click':
        this.impulse = Math.min(this.impulse + intensity, 1.0);
        break;
      case 'hover':
        this.impulse = Math.max(this.impulse, intensity * 0.5);
        break;
      case 'keypress':
        this.impulse = Math.min(this.impulse + intensity * 0.3, 1.0);
        break;
    }
  }

  update() {
    // Decay impulse
    this.impulse *= this.decayRate;

    // Clamp very small values to 0
    if (this.impulse < 0.001) this.impulse = 0;

    // Notify listeners
    this.listeners.forEach(fn => fn(this.impulse));

    requestAnimationFrame(() => this.update());
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  unsubscribe(callback) {
    this.listeners = this.listeners.filter(fn => fn !== callback);
  }
}
```

### Visualizer Integration

```javascript
const impulseController = new ImpulseController();

// Subscribe visualizer to impulse updates
impulseController.subscribe((impulse) => {
  visualizer.updateParameters({
    // Increase chaos on impulse
    chaos: 0.2 + (impulse * 0.5),

    // Brighten on impulse
    intensity: 0.7 + (impulse * 0.5),

    // Clear fog on impulse (inverse density)
    density: 2.5 - (impulse * 2.0),

    // Shift hue on impulse
    hue: baseHue + (impulse * 30)
  });
});
```

---

## React Integration

```jsx
// React hook for impulse triggering
function useImpulse() {
  const triggerClick = useCallback(() => {
    triggerImpulse('click', 1.0);
  }, []);

  const triggerHover = useCallback(() => {
    triggerImpulse('hover', 0.2);
  }, []);

  return { triggerClick, triggerHover };
}

// Usage in component
function Button({ children }) {
  const { triggerClick, triggerHover } = useImpulse();

  return (
    <button
      onClick={triggerClick}
      onMouseEnter={triggerHover}
    >
      {children}
    </button>
  );
}
```

### GlobalBackground Component

```jsx
function GlobalBackground() {
  const canvasRef = useRef(null);
  const visualizerRef = useRef(null);

  useEffect(() => {
    visualizerRef.current = new HolographicVisualizer(canvasRef.current);

    const impulseController = new ImpulseController();
    impulseController.subscribe((impulse) => {
      visualizerRef.current.updateParameters({
        density: 2.5 - (impulse * 2.0),
        chaos: 0.3 + (impulse * 0.4),
        intensity: 0.8 + (impulse * 0.4)
      });
    });

    return () => {
      visualizerRef.current.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
}
```

---

## Impulse Types

| Type | Intensity | Decay Rate | Visual Effect |
|------|-----------|------------|---------------|
| `click` | 1.0 | 0.93 | Strong flash, fast decay |
| `hover` | 0.2-0.4 | 0.97 | Subtle glow, slow decay |
| `keypress` | 0.5 | 0.95 | Medium pulse |
| `scroll` | variable | 0.98 | Continuous flow |
| `focus` | 0.3 | 0.99 | Sustained attention |

---

## Advanced Patterns

### Multiple Impulse Channels

```javascript
class MultiChannelImpulse {
  constructor() {
    this.channels = {
      intensity: { value: 0, decay: 0.95 },
      chaos: { value: 0, decay: 0.92 },
      color: { value: 0, decay: 0.98 }
    };
  }

  trigger(channel, amount) {
    if (this.channels[channel]) {
      this.channels[channel].value = Math.min(
        this.channels[channel].value + amount,
        1.0
      );
    }
  }

  update() {
    Object.keys(this.channels).forEach(key => {
      const ch = this.channels[key];
      ch.value *= ch.decay;
      if (ch.value < 0.001) ch.value = 0;
    });
  }

  getValues() {
    const result = {};
    Object.keys(this.channels).forEach(key => {
      result[key] = this.channels[key].value;
    });
    return result;
  }
}
```

### GSAP-Enhanced Impulse

```javascript
function triggerGSAPImpulse(target, property, amount, duration = 0.5) {
  // Immediate spike
  gsap.set(target, { [property]: target[property] + amount });

  // Smooth decay
  gsap.to(target, {
    [property]: target[property] - amount,
    duration: duration,
    ease: "power2.out"
  });
}
```

---

## Related Patterns

- [18 - Holographic Visualizer](./18-holographic-visualizer-system.md)
- [20 - Inverse Density Fog](./20-inverse-density-fog.md)
- [15 - Mouse Interaction Binding](../gsap_core/15-mouse-interaction-binding.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 19** - Impulse Event System

> *"Every click sends ripples through the visual field. UI is a pond; interactions are stones."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
