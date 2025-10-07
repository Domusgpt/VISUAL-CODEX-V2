# Holographic Input Field

This entry documents the HTML and CSS for creating an input field with a neoskeuomorphic design and a holographic glow effect on focus. It's suitable for data entry in a futuristic UI. This effect is extracted from `NEOSKEUOMORPHIC_HOLOGRAPHIC_UI.html`.

## Visual Elements and Effects

*   **Neoskeuomorphic Base:** The input field has a soft, recessed appearance with subtle shadows.
*   **Holographic Focus Glow:** On focus, the input field emits a vibrant, pulsing glow.
*   **Translucent Background:** Allows background visuals to show through.
*   **Clear Text Input:** Ensures readability of entered text.

## Code Snippets and Explanation

### 1. HTML Structure

Use a standard `<input type="text">` element with the `holographic-input` class.

```html
<div class="input-group">
    <label for="username" class="input-label">Username</label>
    <input type="text" id="username" class="holographic-input" placeholder="Enter your username">
</div>
```

**Explanation:**
*   `input-group`: A wrapper for layout, often used to group a label and its input.
*   `input-label`: A label for accessibility and clarity.
*   `holographic-input`: The primary class for styling the input field.
*   `placeholder`: Provides a hint to the user.

### 2. CSS Styling

The CSS styles the input field with neoskeuomorphic properties and applies a holographic glow on focus.

```css
.input-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    max-width: 300px;
}

.input-label {
    color: var(--text-color);
    font-size: 0.9rem;
    margin-bottom: 8px;
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

.holographic-input {
    width: 100%;
    padding: 12px 15px;
    border: none;
    border-radius: 10px;
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    color: var(--text-color);
    outline: none;
    transition: all 0.3s ease;

    /* Neoskeuomorphic base */
    background: var(--primary-color);
    box-shadow:
        inset 3px 3px 7px var(--dark-shadow),
        inset -3px -3px 7px var(--light-shadow);

    /* Translucency */
    background: rgba(15, 15, 32, 0.4); /* Slightly transparent primary color */
    backdrop-filter: blur(3px); /* Frosted glass effect */
    border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
}

.holographic-input::placeholder {
    color: rgba(224, 224, 224, 0.5);
}

.holographic-input:focus {
    box-shadow:
        inset 3px 3px 7px var(--dark-shadow),
        inset -3px -3px 7px var(--light-shadow),
        0 0 15px var(--holographic-blue), /* Holographic glow on focus */
        0 0 25px var(--holographic-purple);
    border-color: rgba(0, 255, 255, 0.5); /* Brighter border on focus */
}
```

**Customization:**
*   **Colors:** Adjust `var(--primary-color)`, `var(--dark-shadow)`, `var(--light-shadow)`, `var(--holographic-blue)`, `var(--holographic-purple)`, and `var(--text-color)` to match your theme.
*   **Size:** Modify `width`, `padding`, and `font-size`.
*   **Shadows:** Tweak `box-shadow` values for the neoskeuomorphic depth.
*   **Glow:** Adjust the `box-shadow` values on `:focus` for the holographic glow intensity.
*   **Transition Speed:** Change `transition` duration.

## Reusability

To reuse this input field:

1.  Ensure you have the `:root` CSS variables (especially `--primary-color`, `--dark-shadow`, `--light-shadow`, `--holographic-blue`, `--holographic-purple`, `--text-color`) defined in your stylesheet.
2.  Copy the HTML structure for the input group and the input field.
3.  Copy the CSS for `.input-group`, `.input-label`, `.holographic-input`, `::placeholder`, and `:focus` states into your stylesheet.

```html
<!-- Example of reusable holographic input field -->
<div style="background-color: #1a1a2e; padding: 30px; text-align: center; display: flex; flex-direction: column; align-items: center;">
    <div class="input-group">
        <label for="email" class="input-label">Email Address</label>
        <input type="email" id="email" class="holographic-input" placeholder="your.email@example.com">
    </div>
    <div class="input-group">
        <label for="password" class="input-label">Password</label>
        <input type="password" id="password" class="holographic-input" placeholder="••••••••">
    </div>
</div>
```