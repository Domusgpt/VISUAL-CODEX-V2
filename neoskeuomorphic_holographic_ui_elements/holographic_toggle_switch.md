# Holographic Toggle Switch

This entry documents the HTML, CSS, and JavaScript for creating an interactive toggle switch with a neoskeuomorphic design and a holographic glow effect. It's suitable for settings or options in a futuristic UI. This effect is extracted from `NEOSKEUOMORPHIC_HOLOGRAPHIC_UI.html`.

## Visual Elements and Effects

*   **Neoskeuomorphic Track:** The background of the switch has a soft, recessed appearance.
*   **Neoskeuomorphic Thumb:** The draggable part of the switch has a protruding, tactile look.
*   **Holographic Glow:** The thumb emits a vibrant glow when active.
*   **Smooth Transition:** The thumb slides smoothly between ON and OFF states.
*   **Interactive Feedback:** Visual change on toggle.

## Code Snippets and Explanation

### 1. HTML Structure

The toggle switch uses a `label` element to wrap an `input` checkbox and a `span` for the custom slider.

```html
<div class="toggle-container">
    <label class="holographic-toggle-switch">
        <input type="checkbox" id="holographicToggle">
        <span class="slider round"></span>
    </label>
    <span class="toggle-label">Holographic Mode</span>
</div>
```

**Explanation:**
*   `toggle-container`: A wrapper for layout purposes.
*   `holographic-toggle-switch`: The main container for the custom switch, acting as the track.
*   `input type="checkbox"`: The hidden checkbox that holds the actual ON/OFF state.
*   `slider`: The visual representation of the switch's thumb.
*   `round`: Adds rounded corners to the slider.
*   `toggle-label`: A text label associated with the switch.

### 2. CSS Styling

The CSS hides the default checkbox and styles the `slider` to create the custom neoskeuomorphic and holographic appearance.

```css
.toggle-container {
    display: flex;
    align-items: center;
    gap: 15px;
    margin: 20px 0;
}

/* Hide default HTML checkbox */
.holographic-toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.holographic-toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    border-radius: 34px;
    cursor: pointer;
    transition: all 0.3s ease;

    /* Neoskeuomorphic track */
    background: var(--primary-color);
    box-shadow:
        inset 3px 3px 7px var(--dark-shadow),
        inset -3px -3px 7px var(--light-shadow);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.holographic-toggle-switch .slider {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: var(--secondary-color);
    transition: all 0.3s ease;

    /* Neoskeuomorphic thumb */
    box-shadow:
        3px 3px 6px var(--dark-shadow),
        -3px -3px 6px var(--light-shadow);
}

.holographic-toggle-switch .slider.round {
    border-radius: 50%;
}

/* When checked (ON state) */
.holographic-toggle-switch input:checked + .slider {
    transform: translateX(26px);
    background-color: var(--accent-color); /* Accent color for ON state */
    box-shadow:
        3px 3px 6px var(--dark-shadow),
        -3px -3px 6px var(--light-shadow),
        0 0 15px var(--holographic-blue), /* Holographic glow */
        0 0 25px var(--holographic-purple);
}

/* When checked, the track can also change appearance */
.holographic-toggle-switch input:checked + .slider + .round {
    background-color: var(--primary-color); /* Or a different color for the active track */
    box-shadow:
        inset 3px 3px 7px var(--dark-shadow),
        inset -3px -3px 7px var(--light-shadow),
        0 0 5px var(--holographic-blue); /* Subtle glow on track */
}

.toggle-label {
    color: var(--text-color);
    font-size: 1rem;
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}
```

**Customization:**
*   **Colors:** Adjust `var(--primary-color)`, `var(--secondary-color)`, `var(--accent-color)`, `var(--dark-shadow)`, `var(--light-shadow)`, `var(--holographic-blue)`, `var(--holographic-purple)` to match your theme.
*   **Size:** Modify `width` and `height` of `.holographic-toggle-switch` and `.slider` to change the overall size. Ensure `transform: translateX()` value matches the width difference.
*   **Shadows:** Tweak `box-shadow` values for the neoskeuomorphic depth.
*   **Glow:** Adjust the `box-shadow` values on `input:checked + .slider` for the holographic glow intensity.
*   **Transition Speed:** Change `transition` duration on `.holographic-toggle-switch` and `.slider`.

### 3. JavaScript (Optional: Event Handling)

While the basic toggle works with just CSS, you might want to add JavaScript to react to the toggle state change.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const holographicToggle = document.getElementById('holographicToggle');
    if (holographicToggle) {
        holographicToggle.addEventListener('change', (event) => {
            if (event.target.checked) {
                console.log('Holographic Mode: ON');
                // Add logic for when the toggle is ON
            } else {
                console.log('Holographic Mode: OFF');
                // Add logic for when the toggle is OFF
            }
        });
    }
});
```

**Reusability:**

1.  Ensure you have the `:root` CSS variables (especially `--primary-color`, `--secondary-color`, `--accent-color`, `--dark-shadow`, `--light-shadow`, `--holographic-blue`, `--holographic-purple`, `--text-color`) defined in your stylesheet.
2.  Copy the HTML structure for the toggle switch.
3.  Copy the CSS for `.toggle-container`, `.holographic-toggle-switch`, `.holographic-toggle-switch input`, `.holographic-toggle-switch .slider`, `.holographic-toggle-switch .slider.round`, and the `:checked` states into your stylesheet.
4.  (Optional) Include the JavaScript event listener to perform actions based on the toggle state.

```html
<!-- Example of reusable holographic toggle switch -->
<div style="background-color: #1a1a2e; padding: 30px; text-align: center; display: flex; flex-direction: column; align-items: center;">
    <div class="toggle-container">
        <label class="holographic-toggle-switch">
            <input type="checkbox" id="exampleToggle">
            <span class="slider round"></span>
        </label>
        <span class="toggle-label">Enable Feature X</span>
    </div>
    <div class="toggle-container">
        <label class="holographic-toggle-switch">
            <input type="checkbox" id="anotherToggle" checked>
            <span class="slider round"></span>
        </label>
        <span class="toggle-label">Dark Theme</span>
    </div>
</div>

<script>
    // Include the JavaScript event handling logic here if needed
    document.addEventListener('DOMContentLoaded', () => {
        const exampleToggle = document.getElementById('exampleToggle');
        if (exampleToggle) {
            exampleToggle.addEventListener('change', (event) => {
                console.log(`Feature X: ${event.target.checked ? 'Enabled' : 'Disabled'}`);
            });
        }
        const anotherToggle = document.getElementById('anotherToggle');
        if (anotherToggle) {
            anotherToggle.addEventListener('change', (event) => {
                console.log(`Dark Theme: ${event.target.checked ? 'Active' : 'Inactive'}`);
            });
        }
    });
</script>
