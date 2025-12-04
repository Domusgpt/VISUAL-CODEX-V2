# Visualizer Parameter Morphing

**Pattern 08** - WebGL Shader Uniform Binding via GSAP

---

## Overview

This pattern connects GSAP scroll animations to WebGL shader parameters, enabling reactive visualizers that respond to user scroll behavior.

**Complexity**: Tier 3
**Dependencies**: GSAP 3.12+, ScrollTrigger, WebGL
**Source Files**: UnifiedScrollChoreographer.js, OceanVisualizer, HolographicVisualizer

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│             PARAMETER MORPHING PIPELINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────────┐    ┌─────────────────┐    │
│  │  Scroll  │    │  GSAP        │    │  Shader         │    │
│  │  Position│───▶│  Animation   │───▶│  Uniforms       │    │
│  │          │    │  (lerp)      │    │                 │    │
│  └──────────┘    └──────────────┘    └─────────────────┘    │
│       │                │                     │              │
│       ▼                ▼                     ▼              │
│  progress: 0-1    params object         gl.uniform1f()      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Implementation

### Basic Parameter Object

```javascript
// Visualizer parameters
const vizParams = {
  intensity: 0.15,
  chaos: 0.1,
  hue: 180,
  speed: 1.0,
  gridDensity: 20
};

// Animate parameters with GSAP
gsap.to(vizParams, {
  intensity: 0.8,
  chaos: 0.6,
  hue: 360,
  duration: 2,
  ease: "power2.inOut",
  onUpdate: () => {
    visualizer.updateParameters(vizParams);
  }
});
```

### Scroll-Bound Parameter Morphing

```javascript
const params = {
  intensity: 0.2,
  chaos: 0.1,
  density: 2.5,
  hue: 0
};

ScrollTrigger.create({
  trigger: ".content-section",
  start: "top center",
  end: "bottom center",

  onUpdate: (self) => {
    const progress = self.progress;

    // Linear interpolation
    params.intensity = 0.2 + (progress * 0.6);
    params.chaos = 0.1 + (progress * 0.4);
    params.hue = progress * 360;

    // Inverse density (fog clears on scroll)
    params.density = 2.5 - (progress * 2.0);

    visualizer.updateParameters(params);
  }
});
```

### Smoothed Parameter Updates

```javascript
class ParameterController {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.current = { intensity: 0, chaos: 0, hue: 0 };
    this.target = { ...this.current };
    this.lerpFactor = 0.05;
  }

  setTarget(newParams) {
    Object.assign(this.target, newParams);
  }

  update() {
    // Lerp current toward target
    Object.keys(this.target).forEach(key => {
      this.current[key] += (this.target[key] - this.current[key]) * this.lerpFactor;
    });

    this.visualizer.updateParameters(this.current);
  }
}

// Usage with GSAP ticker
const controller = new ParameterController(visualizer);

gsap.ticker.add(() => controller.update());

ScrollTrigger.create({
  trigger: ".section",
  onUpdate: (self) => {
    controller.setTarget({
      intensity: self.progress * 0.8,
      chaos: self.progress * 0.5,
      hue: self.progress * 360
    });
  }
});
```

---

## State-Based Morphing

### Discrete State Transitions

```javascript
const states = [
  { id: 'calm',    intensity: 0.15, chaos: 0.1, hue: 180 },
  { id: 'active',  intensity: 0.4,  chaos: 0.3, hue: 220 },
  { id: 'intense', intensity: 0.7,  chaos: 0.5, hue: 280 },
  { id: 'peak',    intensity: 0.9,  chaos: 0.8, hue: 320 }
];

function transitionToState(stateId) {
  const state = states.find(s => s.id === stateId);
  if (!state) return;

  gsap.to(vizParams, {
    intensity: state.intensity,
    chaos: state.chaos,
    hue: state.hue,
    duration: 1.2,
    ease: "power2.inOut",
    onUpdate: () => visualizer.updateParameters(vizParams)
  });
}

// Trigger on scroll sections
states.forEach((state, i) => {
  ScrollTrigger.create({
    trigger: `.section-${i}`,
    start: "top center",
    onEnter: () => transitionToState(state.id),
    onLeaveBack: () => transitionToState(states[Math.max(0, i-1)].id)
  });
});
```

---

## WebGL Integration

### Shader Uniform Updates

```javascript
class WebGLVisualizer {
  constructor(canvas) {
    this.gl = canvas.getContext('webgl2');
    this.params = {
      intensity: 0.5,
      chaos: 0.3,
      hue: 0.5
    };
    this.initShaders();
  }

  updateParameters(newParams) {
    Object.assign(this.params, newParams);
  }

  render() {
    const gl = this.gl;

    // Update uniforms
    gl.uniform1f(this.uniforms.intensity, this.params.intensity);
    gl.uniform1f(this.uniforms.chaos, this.params.chaos);
    gl.uniform1f(this.uniforms.hue, this.params.hue / 360);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
```

### Fragment Shader Example

```glsl
uniform float intensity;
uniform float chaos;
uniform float hue;
uniform float time;

// HSV to RGB conversion
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;

  // Procedural noise with chaos
  float noise = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time * 0.7);
  noise += sin(uv.x * 20.0 * chaos + time * 1.3) * 0.5;

  // Color based on hue
  vec3 color = hsv2rgb(vec3(hue + noise * 0.1, 0.6, intensity));

  gl_FragColor = vec4(color, 1.0);
}
```

---

## Parameter Ranges

| Parameter | Range | Default | Effect |
|-----------|-------|---------|--------|
| `intensity` | 0.0-1.0 | 0.5 | Brightness/saturation |
| `chaos` | 0.0-1.0 | 0.2 | Noise/randomness |
| `hue` | 0-360 | 180 | Color rotation |
| `speed` | 0.0-2.0 | 1.0 | Animation speed |
| `density` | 0.3-2.5 | 1.5 | Fog/particle density |
| `gridDensity` | 10-100 | 30 | Grid resolution |

---

## Optimization

```javascript
// Throttle updates to 60fps max
let lastUpdate = 0;
const updateInterval = 1000 / 60;

ScrollTrigger.create({
  trigger: ".section",
  onUpdate: (self) => {
    const now = Date.now();
    if (now - lastUpdate < updateInterval) return;
    lastUpdate = now;

    visualizer.updateParameters({
      intensity: self.progress
    });
  }
});
```

---

## Related Patterns

- [12 - Percentage Parameter Binding](./12-percentage-parameter-binding.md)
- [18 - Holographic Visualizer System](../visualizer_systems/18-holographic-visualizer-system.md)
- [19 - Impulse Event System](../visualizer_systems/19-impulse-event-system.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 08** - Visualizer Parameter Morphing

> *"Every shader uniform is a dimension. Scroll reveals the higher geometry."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
