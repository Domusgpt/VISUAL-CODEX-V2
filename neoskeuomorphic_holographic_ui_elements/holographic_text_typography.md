# Holographic Text Typography

This entry documents the CSS and HTML structure for creating a "holographic" text effect, characterized by vibrant, glowing colors and a subtle animation that mimics a digital projection. This effect is extracted from `NEOSKEUOMORPHIC_HOLOGRAPHIC_UI.html`.

## Visual Elements and Effects

*   **Neon Glow:** Multiple `text-shadow` layers create a strong, diffused glow around the text.
*   **Color Shift/Pulse:** An animation subtly shifts the color or intensity of the glow over time.
*   **Subtle Glitch/Scanline:** Can be combined with other effects (like scan lines or chromatic aberration) for a more authentic holographic feel.

## Code Snippets and Explanation

### 1. HTML Structure

Apply the `holographic-text` class to any text element (e.g., `<h1>`, `<h2>`, `<p>`, `<span>`).

```html
<h1 class="holographic-text">SYSTEM ONLINE</h1>
<p class="holographic-text sub-text">Initializing Protocols...</p>
```

**Explanation:**
*   `holographic-text`: The primary class for the glowing effect.
*   `sub-text`: An optional class for smaller, secondary holographic text, often with a slightly different color or intensity.

### 2. CSS Styling

The CSS uses `text-shadow` for the glow and `@keyframes` for the animation.

```css
.holographic-text {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    color: #e0e0e0; /* Base text color */
    text-shadow:
        0 0 5px rgba(0, 255, 255, 0.6),   /* Cyan glow */
        0 0 15px rgba(0, 255, 255, 0.4),
        0 0 30px rgba(0, 255, 255, 0.2),
        0 0 5px rgba(255, 0, 255, 0.6),   /* Magenta glow */
        0 0 15px rgba(255, 0, 255, 0.4),
        0 0 30px rgba(255, 0, 255, 0.2);
    animation: holographic-pulse 3s infinite alternate ease-in-out;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.holographic-text.sub-text {
    font-size: 1.2rem;
    font-weight: 400;
    color: #a0a0a0;
    text-shadow:
        0 0 3px rgba(0, 255, 255, 0.4),
        0 0 8px rgba(0, 255, 255, 0.2);
    animation: holographic-pulse 4s infinite alternate ease-in-out;
}

@keyframes holographic-pulse {
    0% {
        text-shadow:
            0 0 5px rgba(0, 255, 255, 0.6),
            0 0 15px rgba(0, 255, 255, 0.4),
            0 0 30px rgba(0, 255, 255, 0.2),
            0 0 5px rgba(255, 0, 255, 0.6),
            0 0 15px rgba(255, 0, 255, 0.4),
            0 0 30px rgba(255, 0, 255, 0.2);
    }
    100% {
        text-shadow:
            0 0 8px rgba(0, 255, 255, 0.8),
            0 0 20px rgba(0, 255, 255, 0.6),
            0 0 40px rgba(0, 255, 255, 0.3),
            0 0 8px rgba(255, 0, 255, 0.8),
            0 0 20px rgba(255, 0, 255, 0.6),
            0 0 40px rgba(255, 0, 255, 0.3);
    }
}
```

**Customization:**
*   **Colors:** Adjust the `rgba` values in `text-shadow` to change the glow colors. Use complementary colors (like cyan and magenta here) for a vibrant effect.
*   **Glow Intensity/Spread:** Modify the `blur-radius` and `spread-radius` values in `text-shadow` (the third and fourth values, respectively) to control how diffused and wide the glow is.
*   **Animation Speed/Type:** Change the `animation` duration, `infinite`, `alternate`, and `ease-in-out` properties to alter the pulsing behavior.
*   **Font:** `font-family`, `font-size`, `font-weight`, `letter-spacing`, and `text-transform` can be adjusted to match your desired aesthetic.

## Reusability

To reuse this effect:

1.  Copy the CSS for `.holographic-text`, `.holographic-text.sub-text`, and the `@keyframes holographic-pulse` into your stylesheet.
2.  Apply the `holographic-text` class to any text element in your HTML.
3.  (Optional) Apply the `sub-text` class for a secondary, less intense holographic look.
4.  Ensure you have a suitable font (like 'Orbitron' used here) imported or available.

```html
<!-- Example of reusable holographic text -->
<div style="background-color: #0a0a1c; padding: 20px; text-align: center;">
    <h2 class="holographic-text" style="font-size: 2.5rem;">DATA STREAM</h2>
    <p class="holographic-text sub-text">Access Granted</p>
</div>
```