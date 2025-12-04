# Holographic Visualizer System

**Pattern 18** - WebGL Raymarching with KIFS Fractals

---

## Overview

The Holographic Visualizer is a WebGL-based background system using raymarching and Kaleidoscopic Iterated Function System (KIFS) fractals. It provides reactive visual feedback to UI interactions and scroll position.

**Complexity**: Tier 4
**Dependencies**: WebGL 2.0
**Source Files**: JusDNCE HolographicVisualizer.ts, GlobalBackground.tsx
**Demo**: [Holographic Visualizer Demo](../demos/holographic-visualizer-demo.html)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              HOLOGRAPHIC VISUALIZER PIPELINE                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐   │
│  │  React/UI    │    │  Parameter   │    │  WebGL       │   │
│  │  Layer       │───▶│  Controller  │───▶│  Renderer    │   │
│  │              │    │              │    │              │   │
│  └──────────────┘    └──────────────┘    └──────────────┘   │
│         │                   │                   │           │
│         ▼                   ▼                   ▼           │
│  User Events          Lerped Params         GLSL Shaders    │
│  (click/hover)        (smooth updates)      (KIFS fractals) │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Holographic Parameters Interface

```typescript
interface HolographicParams {
  geometryType: number;    // 0=Tetrahedron, 1=Box, 2=Menger Sponge
  density: number;         // 0.3-2.5 (fog thickness)
  speed: number;           // 0.5-2.0 (animation speed)
  chaos: number;           // 0-1 (fractal mutation intensity)
  morph: number;           // 0-1 (geometry blending)
  hue: number;             // 0-360 (HSL color rotation)
  saturation: number;      // 0-1 (color vibrancy)
  intensity: number;       // 0.3-1.5 (brightness)
  gridOpacity: number;     // 0-1 (grid overlay)
}
```

---

## Core Implementation

### WebGL Setup

```javascript
class HolographicVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl2');
    this.params = {
      geometryType: 0,
      density: 2.5,
      speed: 1.0,
      chaos: 0.3,
      morph: 0.0,
      hue: 180,
      saturation: 0.6,
      intensity: 0.8,
      gridOpacity: 0.2
    };
    this.targetParams = { ...this.params };
    this.lerpFactor = 0.05;

    this.init();
  }

  init() {
    this.initShaders();
    this.initBuffers();
    this.initUniforms();
    this.resize();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  initShaders() {
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);
  }

  updateParameters(newParams) {
    Object.assign(this.targetParams, newParams);
  }

  animate() {
    // Lerp current params toward targets
    Object.keys(this.targetParams).forEach(key => {
      this.params[key] += (this.targetParams[key] - this.params[key]) * this.lerpFactor;
    });

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const gl = this.gl;

    // Update uniforms
    gl.uniform1f(this.uniforms.time, performance.now() * 0.001 * this.params.speed);
    gl.uniform1i(this.uniforms.geometryType, this.params.geometryType);
    gl.uniform1f(this.uniforms.density, this.params.density);
    gl.uniform1f(this.uniforms.chaos, this.params.chaos);
    gl.uniform1f(this.uniforms.morph, this.params.morph);
    gl.uniform1f(this.uniforms.hue, this.params.hue / 360.0);
    gl.uniform1f(this.uniforms.saturation, this.params.saturation);
    gl.uniform1f(this.uniforms.intensity, this.params.intensity);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
```

### Fragment Shader (KIFS Raymarching)

```glsl
precision highp float;

uniform float time;
uniform vec2 resolution;
uniform int geometryType;
uniform float density;
uniform float chaos;
uniform float morph;
uniform float hue;
uniform float saturation;
uniform float intensity;

// HSV to RGB
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// KIFS Fold Operations
vec3 fold(vec3 p) {
  p = abs(p);
  if (geometryType == 0) {
    // Tetrahedron fold
    if (p.x + p.y < 0.0) p.xy = -p.yx;
    if (p.x + p.z < 0.0) p.xz = -p.zx;
    if (p.y + p.z < 0.0) p.yz = -p.zy;
  } else if (geometryType == 1) {
    // Box fold
    p = clamp(p, -1.0, 1.0) * 2.0 - p;
  } else {
    // Menger fold
    float c = 3.0;
    p = mod(p + c/2.0, c) - c/2.0;
  }
  return p;
}

// Distance Estimator
float DE(vec3 p) {
  float scale = 2.0;
  float offset = 1.0 + chaos * 0.5;

  for (int i = 0; i < 8; i++) {
    p = fold(p);
    p = p * scale - offset * (scale - 1.0);
  }

  return length(p) * pow(scale, -8.0);
}

// Raymarching
float raymarch(vec3 ro, vec3 rd) {
  float t = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = DE(p);
    if (d < 0.001 || t > 20.0) break;
    t += d;
  }
  return t;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - resolution * 0.5) / resolution.y;

  // Camera
  vec3 ro = vec3(0.0, 0.0, -3.0 + sin(time * 0.2));
  vec3 rd = normalize(vec3(uv, 1.0));

  // Rotate camera
  float a = time * 0.1;
  mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
  rd.xz *= rot;
  ro.xz *= rot;

  // Raymarch
  float t = raymarch(ro, rd);

  // Color
  float fog = 1.0 - exp(-t * density * 0.1);
  float glow = 1.0 / (1.0 + t * t * 0.1);

  vec3 color = hsv2rgb(vec3(
    hue + glow * 0.1 + t * 0.01,
    saturation,
    intensity * glow
  ));

  // Apply fog
  color = mix(color, vec3(0.02, 0.02, 0.03), fog);

  // Vignette
  float vignette = 1.0 - length(uv) * 0.5;
  color *= vignette;

  // Chromatic aberration
  vec2 offset = uv * 0.002;
  float r = color.r;
  float g = color.g;
  float b = color.b;

  gl_FragColor = vec4(color, 1.0);
}
```

---

## Geometry Types

| Type | Value | Visual |
|------|-------|--------|
| Tetrahedron | 0 | Sharp crystalline edges |
| Box | 1 | Cubic fractal structure |
| Menger Sponge | 2 | Infinite hole pattern |

```javascript
// Switch geometry
visualizer.updateParameters({ geometryType: 1 });

// Morph between geometries
gsap.to(params, {
  morph: 1,
  duration: 2,
  onUpdate: () => visualizer.updateParameters(params)
});
```

---

## Integration with GSAP

### Scroll-Driven Parameters

```javascript
ScrollTrigger.create({
  trigger: ".content",
  start: "top top",
  end: "bottom bottom",
  onUpdate: (self) => {
    const p = self.progress;

    visualizer.updateParameters({
      density: 2.5 - (p * 2.0),    // Fog clears
      chaos: 0.3 + (p * 0.4),      // More chaotic
      hue: p * 360,                // Full spectrum
      intensity: 0.6 + (p * 0.4)   // Brighter
    });
  }
});
```

### Event-Driven Updates

```javascript
document.addEventListener('click', (e) => {
  // Pulse on click
  visualizer.updateParameters({
    intensity: 1.5,
    chaos: 0.8
  });

  // Return to normal
  gsap.to(visualizer.params, {
    intensity: 0.8,
    chaos: 0.3,
    duration: 0.5,
    ease: "power2.out"
  });
});
```

---

## Performance Optimization

```javascript
// Limit resolution on mobile
const dpr = Math.min(window.devicePixelRatio, 2);
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;

// Reduce iterations on low-power devices
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const maxIterations = isMobile ? 32 : 64;
```

---

## Related Patterns

- [08 - Visualizer Parameter Morphing](../gsap_core/08-visualizer-parameter-morphing.md)
- [19 - Impulse Event System](./19-impulse-event-system.md)
- [20 - Inverse Density Fog](./20-inverse-density-fog.md)

---

## A Paul Phillips Manifestation

**Visual Codex Pattern 18** - Holographic Visualizer System

> *"Fractals are the fingerprints of infinity. KIFS folds space until patterns emerge."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
