# Dynamic Layout System (CSS-driven)

This entry documents a flexible, CSS-driven dynamic layout system that allows for distinct arrangements of UI panels ("floating cards") based on a parent container's class. This system enables rapid switching between different UI configurations, creating a highly adaptable interface. This effect is extracted from `DYNAMIC_LAYOUT_SYSTEM.html`.

## Visual Elements and Effects

*   **State-Based Layouts:** Different CSS classes (`layout-home`, `layout-tech`, etc.) applied to a main container (`.main-container`) define unique positions, sizes, and transformations for child elements (`.floating-card`).
*   **Smooth Transitions:** CSS `transition` properties ensure that changes between layouts are animated smoothly, rather than abruptly.
*   **Modular Design:** Each "floating card" is a self-contained UI panel, allowing for easy rearrangement and content updates.

## Code Snippets and Explanation

### 1. HTML Structure

The core HTML involves a main container that receives layout classes and multiple "floating card" elements within it.

```html
<div class="main-container layout-home" id="mainContainer">
    <!-- FLOATING CARD SYSTEM -->
    <div class="floating-card" id="card-1">...</div>
    <div class="floating-card" id="card-2">...</div>
    <div class="floating-card" id="card-3">...</div>
    <div class="floating-card" id="card-4">...</div>
    <div class="floating-card" id="card-5">...</div>
</div>
```

**Explanation:**
*   `main-container`: The parent element that controls the overall layout. Its class (e.g., `layout-home`) determines the arrangement of its children.
*   `floating-card`: Individual UI panels. Their positioning and sizing are relative to the `main-container` and are defined by the layout-specific CSS classes.

### 2. CSS Styling

The CSS defines the base styling for `.floating-card` and then provides specific positioning rules for each layout class.

```css
/* DYNAMIC LAYOUT CONTAINER */
.main-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* FLOATING CARD SYSTEM - Base Styling */
.floating-card {
    position: absolute; /* Crucial for absolute positioning within the main-container */
    backdrop-filter: blur(15px); /* Glassmorphic effect */
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    z-index: 5;
    transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* Smooth transitions */
    overflow: hidden;
    box-shadow:
        0 10px 30px rgba(0, 0, 0, 0.3),
        inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

/* STATE-SPECIFIC LAYOUTS */

/* HOME LAYOUT - Traditional Grid */
.layout-home .floating-card:nth-child(1) { /* Header */
    top: 5%; left: 50%; transform: translateX(-50%);
    width: 60%; height: 18%;
}

.layout-home .floating-card:nth-child(2) { /* Left Nav */
    top: 25%; left: 5%;
    width: 28%; height: 65%;
}

/* ... (other cards for layout-home) ... */

/* TECH LAYOUT - Precise Geometric Grid */
.layout-tech .floating-card:nth-child(1) { /* Header - Full Width */
    top: 3%; left: 3%;
    width: 94%; height: 12%;
}

.layout-tech .floating-card:nth-child(2) { /* Left Panel - Narrow */
    top: 18%; left: 3%;
    width: 22%; height: 75%;
}

/* ... (other layout-tech cards, and other layouts like layout-media, layout-audio, layout-quantum) ... */
```

**Customization:**
*   **Layout Definitions:** To create new layouts, add a new class (e.g., `.layout-new`) to the `main-container` and define the `top`, `left`/`right`, `width`, `height`, `transform`, and `border-radius` properties for each `.floating-card:nth-child(n)` within that class.
*   **Transition Speed:** Adjust the `transition` duration and `cubic-bezier` function on `.floating-card` to control the animation speed and easing.
*   **Card Styling:** Modify the base `.floating-card` styles (e.g., `backdrop-filter`, `border`, `box-shadow`) to change the appearance of all cards.

### 3. JavaScript (Layout Switching)

JavaScript is used to change the class of the `main-container`, triggering the CSS transitions.

```javascript
// In DynamicLayoutSystem class
this.layoutNames = ['HOME', 'TECH', 'MEDIA', 'AUDIO', 'QUANTUM'];
this.layoutClasses = ['layout-home', 'layout-tech', 'layout-media', 'layout-audio', 'layout-quantum'];

triggerStateTransition(newState) {
    if (newState === this.currentState || this.isTransitioning) return;

    this.isTransitioning = true;
    this.currentState = newState;

    // Change layout class of the main container
    const mainContainer = document.getElementById('mainContainer');
    mainContainer.className = `main-container ${this.layoutClasses[newState]}`;

    // ... (other state-related updates like visualizer parameters, content) ...

    // Reset transition flag after animation completes
    setTimeout(() => {
        this.isTransitioning = false;
    }, 1200); // Matches CSS transition duration
}

// Example usage (e.g., from state controls)
// Assuming 'dynamicLayoutSystem' is an instance of DynamicLayoutSystem
// dynamicLayoutSystem.triggerStateTransition(1); // Switches to TECH layout
```

**Reusability:**

1.  Copy the HTML structure for the `main-container` and `floating-card` elements.
2.  Define your base `.floating-card` styles.
3.  For each desired layout, create a new CSS class (e.g., `.layout-yourname`) and define the `position`, `size`, and `transform` for each `floating-card:nth-child(n)` within that layout class.
4.  In your JavaScript, maintain an array of layout class names (e.g., `this.layoutClasses`) and implement a function to update the `className` of your `main-container` element. Ensure the JavaScript `setTimeout` duration matches your CSS `transition` duration for smooth synchronization.

```html
<!-- Example of a simple dynamic layout system -->
<style>
    .my-container {
        position: relative;
        width: 80vw;
        height: 60vh;
        border: 2px solid #333;
        margin: 50px auto;
        overflow: hidden;
    }
    .my-panel {
        position: absolute;
        background-color: rgba(0, 100, 200, 0.5);
        border: 1px solid rgba(0, 200, 255, 0.8);
        transition: all 1s ease-in-out;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 1.5rem;
    }

    /* Layout A */
    .layout-a .my-panel:nth-child(1) { top: 10%; left: 10%; width: 40%; height: 80%; }
    .layout-a .my-panel:nth-child(2) { top: 10%; right: 10%; width: 40%; height: 80%; }

    /* Layout B */
    .layout-b .my-panel:nth-child(1) { top: 5%; left: 5%; width: 90%; height: 30%; }
    .layout-b .my-panel:nth-child(2) { bottom: 5%; left: 5%; width: 90%; height: 30%; }
</style>

<div class="my-container layout-a" id="myDynamicLayout">
    <div class="my-panel">Panel 1</div>
    <div class="my-panel">Panel 2</div>
</div>

<button onclick="toggleLayout()" style="display: block; margin: 20px auto; padding: 10px 20px;">Toggle Layout</button>

<script>
    let currentLayout = 'a';
    function toggleLayout() {
        const container = document.getElementById('myDynamicLayout');
        if (currentLayout === 'a') {
            container.className = 'my-container layout-b';
            currentLayout = 'b';
        } else {
            container.className = 'my-container layout-a';
            currentLayout = 'a';
        }
    }
</script>
