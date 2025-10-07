# Holographic Checkbox

This entry documents the HTML and CSS for creating a custom checkbox with a neoskeuomorphic design and a holographic glow effect when checked. It's suitable for options and selections in a futuristic UI. This effect is extracted from `NEOSKEUOMORPHIC_HOLOGRAPHIC_UI.html`.

## Visual Elements and Effects

*   **Neoskeuomorphic Box:** The checkbox itself has a soft, recessed appearance.
*   **Holographic Checkmark/Glow:** A glowing checkmark appears when the box is selected, accompanied by a vibrant holographic aura.
*   **Smooth Transition:** The checkmark and glow appear smoothly on selection.
*   **Interactive Feedback:** Visual change on click.

## Code Snippets and Explanation

### 1. HTML Structure

The checkbox uses a `label` element to wrap an `input` checkbox and a `span` for the custom checkbox design.

```html
<div class="checkbox-group">
    <label class="holographic-checkbox-label">
        <input type="checkbox" id="enableFeature">
        <span class="custom-checkbox"></span>
        Enable Advanced Features
    </label>
</div>
```

**Explanation:**
*   `checkbox-group`: A wrapper for layout purposes.
*   `holographic-checkbox-label`: The main container for the custom checkbox, acting as the clickable area.
*   `input type="checkbox"`: The hidden checkbox that holds the actual checked/unchecked state.
*   `custom-checkbox`: The visual representation of the checkbox.

### 2. CSS Styling

The CSS hides the default checkbox and styles the `custom-checkbox` to create the custom neoskeuomorphic and holographic appearance.

```css
.checkbox-group {
    margin-bottom: 15px;
    width: 100%;
    max-width: 300px;
}

.holographic-checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    color: var(--text-color);
    text-shadow: 0 0 5px rgba(0, 255, 255, 0.3);
}

/* Hide default HTML checkbox */
.holographic-checkbox-label input {
    opacity: 0;
    width: 0;
    height: 0;
}

.custom-checkbox {
    position: relative;
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 8px; /* Soft corners for the box */
    margin-right: 10px;
    transition: all 0.3s ease;

    /* Neoskeuomorphic base */
    background: var(--primary-color);
    box-shadow:
        inset 2px 2px 5px var(--dark-shadow),
        inset -2px -2px 5px var(--light-shadow);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Checkmark styling */
.custom-checkbox::after {
    content: '';
    position: absolute;
    display: none; /* Hidden by default */
    left: 8px;
    top: 3px;
    width: 6px;
    height: 12px;
    border: solid var(--accent-color); /* Checkmark color */
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    transition: all 0.3s ease;
}

/* When checked */
.holographic-checkbox-label input:checked + .custom-checkbox {
    background: var(--primary-color); /* Keep base color or change */
    box-shadow:
        inset 2px 2px 5px var(--dark-shadow),
        inset -2px -2px 5px var(--light-shadow),
        0 0 10px var(--holographic-blue), /* Holographic glow */
        0 0 20px var(--holographic-purple);
    border-color: rgba(0, 255, 255, 0.5);
}

.holographic-checkbox-label input:checked + .custom-checkbox::after {
    display: block; /* Show checkmark */
    border-color: var(--holographic-blue); /* Glow checkmark */
    text-shadow: 0 0 5px var(--holographic-blue); /* Checkmark glow */
}
```

**Customization:**
*   **Colors:** Adjust `var(--primary-color)`, `var(--dark-shadow)`, `var(--light-shadow)`, `var(--accent-color)` (for checkmark), `var(--holographic-blue)`, `var(--holographic-purple)` to match your theme.
*   **Size:** Modify `width` and `height` of `.custom-checkbox`.
*   **Shadows:** Tweak `box-shadow` values for the neoskeuomorphic depth.
*   **Glow:** Adjust the `box-shadow` values on `input:checked + .custom-checkbox` for the holographic glow intensity.
*   **Transition Speed:** Change `transition` duration.
*   **Checkmark Appearance:** Adjust `left`, `top`, `width`, `height`, `border-width`, and `transform` for the `::after` pseudo-element.

### 3. JavaScript (Optional: Event Handling)

Similar to the toggle switch, you can add JavaScript to react to the checkbox state change.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const enableFeatureCheckbox = document.getElementById('enableFeature');
    if (enableFeatureCheckbox) {
        enableFeatureCheckbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                console.log('Feature enabled!');
                // Add logic for when the checkbox is checked
            } else {
                console.log('Feature disabled.');
                // Add logic for when the checkbox is unchecked
            }
        });
    }
});
```

**Reusability:**

1.  Ensure you have the `:root` CSS variables (especially `--primary-color`, `--dark-shadow`, `--light-shadow`, `--accent-color`, `--holographic-blue`, `--holographic-purple`, `--text-color`) defined in your stylesheet.
2.  Copy the HTML structure for the checkbox group.
3.  Copy the CSS for `.checkbox-group`, `.holographic-checkbox-label`, `input`, `.custom-checkbox`, `::after`, and the `:checked` states into your stylesheet.
4.  (Optional) Include the JavaScript event listener to perform actions based on the checkbox state.

```html
<!-- Example of reusable holographic checkbox -->
<div style="background-color: #1a1a2e; padding: 30px; text-align: center; display: flex; flex-direction: column; align-items: flex-start;">
    <div class="checkbox-group">
        <label class="holographic-checkbox-label">
            <input type="checkbox" id="autoSave">
            <span class="custom-checkbox"></span>
            Enable Auto-Save
        </label>
    </div>
    <div class="checkbox-group">
        <label class="holographic-checkbox-label">
            <input type="checkbox" id="darkMode" checked>
            <span class="custom-checkbox"></span>
            Activate Dark Mode
        </label>
    </div>
</div>

<script>
    // Include the JavaScript event handling logic here if needed
    document.addEventListener('DOMContentLoaded', () => {
        const autoSaveCheckbox = document.getElementById('autoSave');
        if (autoSaveCheckbox) {
            autoSaveCheckbox.addEventListener('change', (event) => {
                console.log(`Auto-Save: ${event.target.checked ? 'ON' : 'OFF'}`);
            });
        }
        const darkModeCheckbox = document.getElementById('darkMode');
        if (darkModeCheckbox) {
            darkModeCheckbox.addEventListener('change', (event) => {
                console.log(`Dark Mode: ${event.target.checked ? 'Active' : 'Inactive'}`);
            });
        }
    });
</script>
