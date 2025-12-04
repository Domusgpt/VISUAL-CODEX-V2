# Percentage Parameter Binding

**Pattern 12** - Scroll Progress to Shader Parameters

---

## Quick Reference

**Complexity**: Tier 1
**Dependencies**: GSAP 3.12+, ScrollTrigger

---

## Core Pattern

Map `self.progress` (0-1) directly to shader/visualizer parameters.

```javascript
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  end: "bottom center",

  onUpdate: (self) => {
    const p = self.progress;  // 0 to 1

    visualizer.updateParameters({
      hue: p * 360,              // Full color wheel
      intensity: 0.3 + (p * 0.5), // 0.3 to 0.8
      chaos: p * 0.6             // 0 to 0.6
    });
  }
});
```

---

## Common Mappings

### Linear Mapping

```javascript
// Direct progress mapping
value = progress * maxValue;

// Range mapping
value = minValue + (progress * (maxValue - minValue));
```

### Sine Wave

```javascript
// Oscillate 0 → 1 → 0
value = Math.sin(progress * Math.PI);

// Oscillate across full scroll
value = 0.5 + Math.sin(progress * Math.PI * 2) * 0.5;
```

### Eased Progress

```javascript
// Use GSAP utils
const eased = gsap.parseEase("power2.inOut")(progress);
value = eased * maxValue;
```

---

## Examples

### Hue Rotation

```javascript
onUpdate: (self) => {
  params.hue = self.progress * 360;
}
```

### Inverse Density (Fog Clears)

```javascript
onUpdate: (self) => {
  params.density = 2.5 - (self.progress * 2.0);  // 2.5 → 0.5
}
```

### Breathing Effect

```javascript
onUpdate: (self) => {
  const breathe = Math.sin(self.progress * Math.PI * 4);
  params.scale = 1 + (breathe * 0.1);  // ±10%
}
```

---

## Progress Utilities

```javascript
// Clamp to range
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

// Map from one range to another
const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

// Example usage
const opacity = mapRange(self.progress, 0.2, 0.8, 0, 1);
```

---

## Related Patterns

- [08 - Visualizer Parameter Morphing](./08-visualizer-parameter-morphing.md)
- [03 - ScrollTrigger Configurations](./03-scrolltrigger-configurations.md)

---

**© 2025 Paul Phillips - Clear Seas Solutions LLC**
