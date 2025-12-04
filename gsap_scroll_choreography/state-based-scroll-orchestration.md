# State-Based Scroll Orchestration

**Pattern 5.1: Multi-State Scroll Canvas with Sequential Content Morphing**

---

## Overview

This pattern creates an immersive scrolling experience where content transforms through discrete visual states, each with unique colors, animations, and visualizer parameters. The scroll position acts as a timeline, orchestrating sequential reveals and transitions.

**Source:** [Better Than Fresh - Morphing Experience](https://domusgpt.github.io/Better-Than-Fresh/branch-versions/morphing-experience.html)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    800vh SCROLL CANVAS                       │
├─────────────────────────────────────────────────────────────┤
│  State 1 (0-100vh)    │ Hero + White Background             │
│  State 2 (100-200vh)  │ Purple Circle + #7B3FF2             │
│  State 3 (200-300vh)  │ Four Pillars + Teal #26A69A         │
│  State 4 (300-400vh)  │ Value Cards + Aqua #4FC3F7          │
│  State 5 (400-500vh)  │ Philosophy Cards + Ocean #0A2540    │
│  State 6 (500-600vh)  │ Carousel (360° rotation)            │
│  State 7 (600-700vh)  │ Quality Features Grid               │
│  State 8 (700-800vh)  │ Contact + Final State               │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Implementation

### HTML Structure

```html
<!-- Extended scroll container -->
<div class="scroll-canvas" style="height: 800vh;">

  <!-- Fixed viewport for content -->
  <div class="viewport" style="position: fixed; inset: 0;">

    <!-- Background color layer (animated) -->
    <div class="bg-color-layer"></div>

    <!-- WebGL visualizer (fixed) -->
    <canvas id="ocean-visualizer"></canvas>

    <!-- State containers (toggled visibility) -->
    <section class="state state-hero" data-state="1">...</section>
    <section class="state state-purple" data-state="2">...</section>
    <section class="state state-pillars" data-state="3">...</section>
    <!-- ... more states ... -->

  </div>
</div>
```

### CSS Foundation

```css
/* Extended scroll space */
.scroll-canvas {
  height: 800vh;
  position: relative;
}

/* Fixed viewport contains all visual content */
.viewport {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

/* Background color morphing layer */
.bg-color-layer {
  position: absolute;
  inset: 0;
  transition: background-color 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

/* State sections - absolute positioned, opacity controlled */
.state {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.state.active {
  opacity: 1;
  pointer-events: auto;
}

/* Color palette as CSS variables */
:root {
  --ocean-deep: #0A2540;
  --aqua-bright: #4FC3F7;
  --teal: #26A69A;
  --purple: #7B3FF2;
  --sand: #F5F3EF;
}
```

### GSAP ScrollTrigger Orchestration

```javascript
// State configuration with visualizer parameters
const stateConfig = [
  {
    id: 'hero',
    start: 0,
    end: 100,
    bgColor: '#F5F3EF',
    visualizer: { intensity: 0.15, chaos: 0.1, hue: 0.5 }
  },
  {
    id: 'purple',
    start: 100,
    end: 200,
    bgColor: '#7B3FF2',
    visualizer: { intensity: 0.25, chaos: 0.15, hue: 0.75 }
  },
  {
    id: 'pillars',
    start: 200,
    end: 300,
    bgColor: '#26A69A',
    visualizer: { intensity: 0.3, chaos: 0.2, hue: 0.45 }
  },
  // ... additional states
];

// Master orchestration class
class ScrollOrchestrator {
  constructor(visualizer) {
    this.visualizer = visualizer;
    this.currentState = 0;
    this.initScrollTriggers();
  }

  initScrollTriggers() {
    stateConfig.forEach((state, index) => {
      // Create ScrollTrigger for each state
      ScrollTrigger.create({
        trigger: '.scroll-canvas',
        start: `${state.start}vh top`,
        end: `${state.end}vh top`,

        onEnter: () => this.activateState(index),
        onLeaveBack: () => this.activateState(index - 1),

        // Scrub for continuous parameter updates
        onUpdate: (self) => {
          const localProgress = self.progress;
          this.updateVisualizerParams(state, localProgress);
        }
      });

      // Content reveal timeline
      this.createStateTimeline(state);
    });
  }

  activateState(index) {
    if (index < 0 || index === this.currentState) return;

    // Deactivate previous state
    document.querySelector(`[data-state="${this.currentState + 1}"]`)
      ?.classList.remove('active');

    // Activate new state
    const newState = stateConfig[index];
    document.querySelector(`[data-state="${index + 1}"]`)
      ?.classList.add('active');

    // Morph background color
    gsap.to('.bg-color-layer', {
      backgroundColor: newState.bgColor,
      duration: 1.2,
      ease: 'power2.inOut'
    });

    this.currentState = index;
  }

  updateVisualizerParams(state, progress) {
    // Interpolate visualizer parameters based on scroll progress
    const params = {
      intensity: gsap.utils.interpolate(
        state.visualizer.intensity * 0.8,
        state.visualizer.intensity * 1.2,
        progress
      ),
      chaos: state.visualizer.chaos + (progress * 0.05),
      hue: state.visualizer.hue
    };

    this.visualizer.updateParameters(params);
  }

  createStateTimeline(state) {
    const stateEl = document.querySelector(`[data-state="${state.id}"]`);
    if (!stateEl) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-canvas',
        start: `${state.start + 10}vh top`,
        end: `${state.start + 50}vh top`,
        scrub: 1
      }
    })
    .from(stateEl.querySelectorAll('.reveal-item'), {
      opacity: 0,
      y: 50,
      scale: 0.9,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }
}
```

---

## Visualizer Integration

### OceanVisualizer WebGL Binding

```javascript
// WebGL visualizer with scroll-reactive parameters
class OceanVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2');
    this.params = {
      intensity: 0.15,
      chaos: 0.1,
      hue: 0.5,
      speed: 1.0,
      gridDensity: 20
    };
    this.targetParams = { ...this.params };
    this.init();
  }

  updateParameters(newParams) {
    // Smooth lerp to target parameters
    Object.assign(this.targetParams, newParams);
  }

  animate() {
    // Lerp current params toward targets
    const lerpFactor = 0.05;
    Object.keys(this.targetParams).forEach(key => {
      this.params[key] += (this.targetParams[key] - this.params[key]) * lerpFactor;
    });

    // Update shader uniforms
    this.gl.uniform1f(this.uniforms.intensity, this.params.intensity);
    this.gl.uniform1f(this.uniforms.chaos, this.params.chaos);
    this.gl.uniform1f(this.uniforms.hue, this.params.hue);

    this.render();
    requestAnimationFrame(() => this.animate());
  }
}

// Fragment shader excerpt
const fragmentShader = `
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

    // Procedural noise with chaos modulation
    float noise = sin(uv.x * 10.0 + time) * cos(uv.y * 10.0 + time * 0.7);
    noise += sin(uv.x * 20.0 * chaos + time * 1.3) * 0.5;

    // Color based on hue parameter
    vec3 color = hsv2rgb(vec3(hue + noise * 0.1, 0.6, intensity));

    gl_FragColor = vec4(color, 1.0);
  }
`;
```

---

## Key Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| `scrollHeight` | 400-1000vh | Total scroll canvas height |
| `stateCount` | 4-12 | Number of distinct visual states |
| `transitionDuration` | 0.6-1.5s | Background color morph speed |
| `staggerDelay` | 0.1-0.2s | Element reveal cascade timing |
| `lerpFactor` | 0.03-0.1 | Visualizer parameter smoothing |
| `scrub` | 0.5-2 | ScrollTrigger scrub smoothness |

---

## Best Practices

1. **Performance**: Use `will-change: opacity, transform` on state containers
2. **Accessibility**: Provide `prefers-reduced-motion` alternative with instant transitions
3. **Mobile**: Reduce scroll height (400-600vh) on touch devices
4. **Visualizer**: Cap device pixel ratio at 2x for shader performance
5. **States**: Keep to 6-8 states maximum to maintain narrative coherence

---

## Browser Compatibility

- **Chrome 88+**: Full support
- **Firefox 85+**: Full support
- **Safari 14+**: Requires `-webkit` prefixes for some transforms
- **Edge 88+**: Full support

---

## Related Patterns

- [Scroll-Reactive WebGL Parameters](./scroll-reactive-webgl-parameters.md)
- [Melting Theme Transitions](./melting-theme-transitions.md)
- [Parallax Depth Layering](./parallax-depth-layering.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 5.1** - State-Based Scroll Orchestration

> *"Each scroll state is a chapter. The scroll bar is the reader's progress through your visual novel."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
