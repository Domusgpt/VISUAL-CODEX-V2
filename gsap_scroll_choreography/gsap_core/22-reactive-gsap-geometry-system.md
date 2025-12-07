# Pattern 22: Reactive GSAP Geometry System

## Quick Reference
- **Complexity**: Tier 4 (Advanced)
- **Dependencies**: GSAP, ScrollTrigger, WebGL 1.0
- **Source Files**: B-W-Blog-tenplate (AlgorithmicArtBackground.tsx, MorphingStory.tsx, HolographicBackground.tsx)
- **Demo**: [reactive-gsap-geometry-system.html](../demos/reactive-gsap-geometry-system.html)
- **Live Example**: https://domusgpt.github.io/B-W-Blog-tenplate/

---

## What This Pattern Does

Creates a full-screen WebGL geometry visualization that **reacts to multiple input sources**:
1. **Scroll position** - Drives color progression and organic distortion
2. **Mouse position** - Controls 4D rotation and camera offset
3. **Click events** - Triggers geometry variant changes with impulse effects
4. **GSAP ScrollTrigger** - Choreographs 800vh pinned scroll experience

The geometry uses **4D rotation matrices** to create hypercube-style projections, with ray marching for volumetric rendering and chakra-aligned color palettes.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INPUTS                              │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   SCROLL     │    MOUSE     │    CLICK     │     TIME       │
│   0-1        │   x,y 0-1    │   variant    │   continuous   │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                  WEBGL UNIFORMS                              │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   u_scroll   │   u_mouse    │  u_variant   │    u_time      │
│              │              │  u_impulse   │                │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       ▼              ▼              ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│               SHADER PROCESSING                              │
├─────────────────────────────────────────────────────────────┤
│  1. 4D Position: vec4(p, sin(time + scroll) * 2.0)          │
│  2. 4D Rotation: rotateXW(mouse.x) * rotateYW(mouse.y)      │
│  3. 3D Projection: perspective divide by w                   │
│  4. Noise Distortion: fbm() * scroll intensity               │
│  5. SDF Primitives: torus, sphere, octahedron, box           │
│  6. Smooth Blending: smin() based on variant                 │
│  7. Ray March: accumulate color + glow                       │
│  8. Chakra Colors: getChakraColor(scroll * 7.0)             │
└─────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    RENDERED OUTPUT                           │
│  - Morphing 4D geometry projection                          │
│  - Chakra color progression                                  │
│  - Volumetric glow                                           │
│  - Noise-based organic detail                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Code

### Minimal Example - Reactive Uniforms

```javascript
// STATE object holds all reactive values
const STATE = {
    scrollProgress: 0,    // 0-1, from ScrollTrigger
    currentVariant: 0,    // 0-7, from click events
    mouse: { x: 0.5, y: 0.5 },
    intensity: 0.5,
    clickImpulse: 0       // 0-1, decays after click
};

// GSAP ScrollTrigger binds scroll to state
ScrollTrigger.create({
    trigger: '.morphing-journey',
    start: 'top top',
    end: '+=8000', // 800vh
    pin: true,
    scrub: 1,
    onUpdate: (self) => {
        STATE.scrollProgress = self.progress;
    }
});

// Click handler triggers geometry reaction
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
        STATE.currentVariant = parseInt(card.dataset.variant);

        // Trigger impulse
        STATE.clickImpulse = 1;
        gsap.to(STATE, {
            clickImpulse: 0,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
});

// WebGL render loop passes state to uniforms
function render() {
    gl.uniform1f(uniforms.scroll, STATE.scrollProgress);
    gl.uniform2f(uniforms.mouse, STATE.mouse.x, STATE.mouse.y);
    gl.uniform1f(uniforms.variant, STATE.currentVariant);
    gl.uniform1f(uniforms.impulse, STATE.clickImpulse);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}
```

### 4D Rotation Matrices (GLSL)

```glsl
// Rotate in XW plane (3D→4D rotation)
mat4 rotateXW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(c, 0, 0, -s, 0, 1, 0, 0, 0, 0, 1, 0, s, 0, 0, c);
}

// Rotate in YW plane
mat4 rotateYW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(1, 0, 0, 0, 0, c, 0, -s, 0, 0, 1, 0, 0, s, 0, c);
}

// Rotate in ZW plane
mat4 rotateZW(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, c, -s, 0, 0, s, c);
}

// Project 4D to 3D
vec3 project4D(vec4 p) {
    float w = 2.5 / (2.5 + p.w);
    return vec3(p.xyz * w);
}
```

### Reactive Scene Function

```glsl
float scene(vec3 p) {
    float time = u_time * 0.0002;

    // Click impulse makes geometry "breathe"
    float impulseScale = 1.0 + u_impulse * 0.5;

    // Create 4D position - scroll drives W coordinate
    vec4 p4 = vec4(p, sin(time * 2.0 + u_scroll * 0.5) * 2.0);

    // REACTIVE 4D ROTATION - Mouse and scroll drive rotation
    p4 = rotateXW(time + u_mouse.x + u_impulse * 3.14159) * p4;
    p4 = rotateYW(time * 0.7 + u_mouse.y) * p4;
    p4 = rotateZW(time * 0.5 + u_scroll * 0.1) * p4;

    vec3 p3 = project4D(p4);

    // Organic noise distortion increases with scroll
    float noiseDisp = fbm(p3.xy * 2.0 + time) * 0.3 * (0.5 + u_scroll * 0.5);
    p3 += vec3(
        noiseDisp * sin(time * 3.0),
        noiseDisp * cos(time * 2.5),
        noiseDisp * sin(time * 1.8)
    );

    // Multiple SDF primitives
    float d1 = sdTorus(p3, vec2(1.5 * impulseScale, 0.4));
    float d2 = sdSphere(p3, 0.8 * impulseScale);
    float d3 = sdOctahedron(p3, 1.2 * impulseScale);
    float d4 = sdBox(p3, vec3(0.7) * impulseScale);

    // Variant controls blending
    float blend = 0.3 + u_variant * 0.1;
    float d = smin(d1, d2, blend);
    d = smin(d, d3, blend + 0.1);
    d = smin(d, d4, blend + 0.2);

    return d;
}
```

### Chakra Color Palette

```glsl
vec3 getChakraColor(float t) {
    t = mod(t, 7.0);
    if (t < 1.0) return mix(vec3(0.78, 0.17, 0.21), vec3(0.91, 0.44, 0.20), fract(t)); // Root→Sacral
    else if (t < 2.0) return mix(vec3(0.91, 0.44, 0.20), vec3(0.96, 0.78, 0.27), fract(t)); // Sacral→Solar
    else if (t < 3.0) return mix(vec3(0.96, 0.78, 0.27), vec3(0.40, 0.72, 0.57), fract(t)); // Solar→Heart
    else if (t < 4.0) return mix(vec3(0.40, 0.72, 0.57), vec3(0.36, 0.64, 0.85), fract(t)); // Heart→Throat
    else if (t < 5.0) return mix(vec3(0.36, 0.64, 0.85), vec3(0.55, 0.48, 0.72), fract(t)); // Throat→Third Eye
    else if (t < 6.0) return mix(vec3(0.55, 0.48, 0.72), vec3(0.90, 0.78, 0.92), fract(t)); // Third Eye→Crown
    else return mix(vec3(0.90, 0.78, 0.92), vec3(0.78, 0.17, 0.21), fract(t)); // Crown→Root (loop)
}
```

---

## Parameters Reference

| Parameter | Type | Range | Default | Description |
|-----------|------|-------|---------|-------------|
| `u_scroll` | float | 0-1 | 0 | Scroll progress from ScrollTrigger |
| `u_mouse` | vec2 | 0-1 | (0.5, 0.5) | Normalized mouse position |
| `u_variant` | float | 0-7 | 0 | Geometry variant (click selection) |
| `u_intensity` | float | 0.3-1.0 | 0.5 | Brightness/glow intensity |
| `u_impulse` | float | 0-1 | 0 | Click impulse (decays over 1.5s) |
| `u_time` | float | 0-∞ | 0 | Time in milliseconds |
| `u_resolution` | vec2 | varies | viewport | Canvas resolution |

---

## GSAP Integration Points (14)

| # | Integration | Purpose |
|---|------------|---------|
| 1 | Main ScrollTrigger | 800vh pinned experience with scrub |
| 2 | Progress indicator | scaleY tied to scroll progress |
| 3 | Service cards entrance | fromTo with stagger |
| 4 | State label update | onUpdate callback |
| 5-11 | State transitions | Per-state title/content animations |
| 12 | Parallax layer 1 | y: -400 over scroll |
| 13 | Parallax layer 2 | y: -800 over scroll |
| 14 | Floating particles | Per-particle scroll animation |

---

## Customization Points

### Changing Color Palette

Replace the `getChakraColor()` function with your own palette:

```glsl
vec3 getCustomColor(float t) {
    t = mod(t, 5.0);
    if (t < 1.0) return mix(vec3(0.1, 0.1, 0.3), vec3(0.2, 0.1, 0.4), fract(t));
    else if (t < 2.0) return mix(vec3(0.2, 0.1, 0.4), vec3(0.4, 0.2, 0.5), fract(t));
    // ... etc
}
```

### Changing Geometry Primitives

Replace or add SDF functions:

```glsl
// Tetrahedron
float sdTetrahedron(vec3 p, float s) {
    float d = 0.0;
    d = max(d, abs(p.x + p.y) - p.z);
    d = max(d, abs(p.x - p.y) + p.z);
    d = max(d, abs(p.x + p.z) - p.y);
    d = max(d, abs(p.x - p.z) + p.y);
    return d / sqrt(3.0) - s;
}

// Klein bottle (advanced)
float sdKleinBottle(vec3 p) {
    // Complex implementation...
}
```

### Adjusting Scroll Behavior

Modify ScrollTrigger configuration:

```javascript
ScrollTrigger.create({
    trigger: '.morphing-journey',
    start: 'top top',
    end: '+=4000', // Reduce to 400vh for faster progression
    pin: true,
    scrub: 0.5, // Faster scrub for more responsive feel
    // ...
});
```

### Adding Audio Reactivity

Extend the uniform system:

```javascript
// Add audio uniforms
STATE.audioBass = 0;
STATE.audioMid = 0;
STATE.audioHigh = 0;

// In render loop
gl.uniform1f(uniforms.audioBass, STATE.audioBass);
gl.uniform1f(uniforms.audioMid, STATE.audioMid);
gl.uniform1f(uniforms.audioHigh, STATE.audioHigh);
```

```glsl
// In shader
uniform float u_audioBass;
uniform float u_audioMid;
uniform float u_audioHigh;

// Use in scene
float impulseScale = 1.0 + u_impulse * 0.5 + u_audioBass * 0.3;
```

---

## Combining with Other Patterns

### With Pattern 09: Three-Phase Animation
Use the Entrance→Lock→Exit phases for geometry sections within the 800vh journey.

### With Pattern 11: Chromatic Aberration
Add RGB splitting to text elements for glitch effects during state transitions.

### With Pattern 18: Holographic Visualizer (JusDNCE)
Replace the generic geometry with the KIFS fractal shader for more complex visuals.

### With Pattern 19: Impulse Event System
Create a global event bus for UI→shader communication.

---

## Performance Considerations

1. **Ray march iterations**: 80 iterations is reasonable; reduce to 50 for mobile
2. **FBM octaves**: 6 octaves is heavy; reduce to 4 for performance
3. **Resolution scaling**: Use `devicePixelRatio` clamped to 1.5 max
4. **Throttle mouse events**: Use `requestAnimationFrame` for mouse updates
5. **Pause when not visible**: Use `IntersectionObserver` to pause rendering

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        STATE.isVisible = entry.isIntersecting;
    });
});
observer.observe(canvas);

function render() {
    if (!STATE.isVisible) {
        requestAnimationFrame(render);
        return;
    }
    // ... render
}
```

---

## Accessibility

### Reduced Motion Support

```javascript
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable scroll pinning
    ScrollTrigger.getAll().forEach(st => st.disable());

    // Set static colors
    STATE.scrollProgress = 0.5;
    STATE.intensity = 0.3;
}
```

### Keyboard Navigation

```javascript
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        STATE.currentVariant = (STATE.currentVariant + 1) % 8;
    } else if (e.key === 'ArrowLeft') {
        STATE.currentVariant = (STATE.currentVariant - 1 + 8) % 8;
    }
});
```

---

## Browser Support

| Browser | Version | Notes |
|---------|---------|-------|
| Chrome | 88+ | Full support |
| Firefox | 78+ | Full support |
| Safari | 14+ | Full support |
| Edge | 88+ | Full support |
| Mobile Safari | 14+ | Performance dependent |
| Chrome Android | 88+ | Performance dependent |

---

## Related Patterns

- [09-three-phase-animation.md](09-three-phase-animation.md) - Entrance→Lock→Exit choreography
- [11-chromatic-aberration.md](11-chromatic-aberration.md) - RGB splitting effects
- [18-holographic-visualizer-system.md](../visualizer_systems/18-holographic-visualizer-system.md) - KIFS fractals
- [19-impulse-event-system.md](../visualizer_systems/19-impulse-event-system.md) - UI event handling
- [15-mouse-interaction-binding.md](15-mouse-interaction-binding.md) - Mouse-driven parameters

---

## Source Attribution

**Extracted from**: B-W-Blog-tenplate
- `components/AlgorithmicArtBackground.tsx` - 389 lines
- `components/MorphingStory.tsx` - 422 lines
- `components/HolographicBackground.tsx` - 320 lines

**Live Example**: https://domusgpt.github.io/B-W-Blog-tenplate/

---

**A Paul Phillips Manifestation**

**Visual Codex Pattern 22** - Reactive GSAP Geometry System
**Repository**: https://github.com/Domusgpt/VISUAL-CODEX-V2

> *"Every interaction is a conversation. The geometry listens and responds."*

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
