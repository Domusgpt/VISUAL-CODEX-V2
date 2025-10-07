# Neoskeuomorphic Base Styling

This entry documents the core CSS principles and snippets for creating a "neoskeuomorphic" or "soft UI" aesthetic, characterized by subtle shadows, gradients, and rounded shapes that give elements a sense of depth and tactility. This style is extracted from `NEOSKEUOMORPHIC_HOLOGRAPHIC_UI.html`.

## Visual Elements and Effects

*   **Soft Shadows:** Inner and outer shadows create a debossed or embossed effect, making elements appear to recede into or protrude from the background.
*   **Subtle Gradients:** Linear or radial gradients are used to give depth and a smooth, almost plastic-like finish to surfaces.
*   **Rounded Corners:** Generous `border-radius` values contribute to the soft, friendly feel of the UI.
*   **Translucency/Glassmorphism:** `backdrop-filter: blur()` combined with `rgba` backgrounds creates a frosted glass effect, allowing the background visualizer to show through.

## Code Snippets and Explanation

### 1. Body and Root Variables

The `body` sets a dark, subtle background, and `:root` defines a color palette suitable for a modern, tech-inspired neoskeuomorphic design.

```css
:root {
    --bg-color: #1a1a2e;
    --primary-color: #0f0f20;
    --secondary-color: #2c2c4a;
    --accent-color: #e94560;
    --text-color: #e0e0e0;
    --light-shadow: #3a3a5e;
    --dark-shadow: #0a0a1c;
    --holographic-blue: rgba(0, 255, 255, 0.15);
    --holographic-purple: rgba(255, 0, 255, 0.15);
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Orbitron', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    overflow: hidden;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #1a1a2e, #0f0f20); /* Subtle background gradient */
}
```

**Customization:**
*   **Colors:** Adjust the `--bg-color`, `--primary-color`, `--secondary-color`, and `--accent-color` to change the overall theme. The `light-shadow` and `dark-shadow` should be slightly lighter/darker variations of the `primary-color` or `secondary-color` for optimal effect.
*   **Font:** Change `font-family` to match your project's typography.

### 2. General Neoskeuomorphic Element Styling

This snippet demonstrates the common properties applied to elements to achieve the neoskeuomorphic look.

```css
.neoskeu-element {
    background: var(--primary-color); /* Base color for the element */
    border-radius: 20px; /* Soft rounded corners */
    box-shadow:
        5px 5px 10px var(--dark-shadow),   /* Outer dark shadow (bottom-right) */
        -5px -5px 10px var(--light-shadow), /* Outer light shadow (top-left) */
        inset 2px 2px 5px var(--light-shadow), /* Inner light shadow (top-left) */
        inset -2px -2px 5px var(--dark-shadow); /* Inner dark shadow (bottom-right) */
    padding: 20px;
    transition: all 0.3s ease; /* Smooth transitions for interactions */
}

.neoskeu-element:hover {
    box-shadow:
        7px 7px 14px var(--dark-shadow),
        -7px -7px 14px var(--light-shadow),
        inset 3px 3px 7px var(--light-shadow),
        inset -3px -3px 7px var(--dark-shadow);
    transform: translateY(-2px); /* Subtle lift on hover */
}

.neoskeu-element.active {
    box-shadow:
        inset 5px 5px 10px var(--dark-shadow),   /* Inset shadows for pressed/active state */
        inset -5px -5px 10px var(--light-shadow);
    transform: translateY(0); /* Reset transform for pressed state */
}
```

**Explanation:**
*   **`background`**: Sets the base color of the element.
*   **`border-radius`**: Controls the roundness of the corners. Larger values create softer shapes.
*   **`box-shadow`**: This is the most critical part.
    *   The first two `box-shadow` values create the outer, embossed effect. The `dark-shadow` is typically offset to the bottom-right, and the `light-shadow` to the top-left.
    *   The `inset` shadows create the inner, debossed effect, mimicking light hitting the inner edges.
*   **`transition`**: Ensures smooth visual changes when the element is hovered over or activated.
*   **`:hover` and `.active`**: Provide visual feedback for interaction, typically by adjusting the `box-shadow` offsets and `transform` properties to simulate a "lift" or "press" effect.

### 3. Translucent/Glassmorphic Overlays

For elements that sit above a dynamic background (like a WebGL visualizer), `backdrop-filter` is used to create a frosted glass effect.

```css
.glassmorphic-overlay {
    background: rgba(255, 255, 255, 0.05); /* Very subtle white background */
    backdrop-filter: blur(10px); /* The key for the frosted glass effect */
    border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border for definition */
    border-radius: 15px;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); /* Soft, deep shadow */
}
```

**Customization:**
*   **`background`**: Adjust the `rgba` values to control the transparency and tint of the glass.
*   **`backdrop-filter: blur()`**: Increase or decrease the `px` value to control the blur intensity.
*   **`border`**: Modify the border color and transparency for more or less definition.

## Reusability

To reuse these styles:

1.  Copy the `:root` variables into your main CSS file or a dedicated `variables.css`.
2.  Apply the `.neoskeu-element` class to any `div`, `button`, or other UI component you want to style with the soft UI look.
3.  Apply the `.glassmorphic-overlay` class to containers that should appear as frosted glass over a dynamic background.
4.  Adjust the `box-shadow` values and `border-radius` to fine-tune the depth and softness for different elements. Remember that the shadow offsets should generally be symmetrical but opposite for light and dark shadows to create the illusion of light source.

```html
<!-- Example of applying neoskeuomorphic styling -->
<div class="neoskeu-element">
    <p>This is a neoskeuomorphic card.</p>
    <button class="neoskeu-element">Click Me</button>
</div>

<!-- Example of a glassmorphic overlay -->
<div class="glassmorphic-overlay">
    <h1>Holographic Display</h1>
    <p>Content appears here.</p>
</div>
```