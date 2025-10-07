# Scroll-Driven Layout Transition

This entry documents a JavaScript pattern for triggering dynamic UI layout changes based on user scroll activity. It introduces concepts like scroll accumulation, chaos intensity, and smooth transitions between predefined layouts, creating a reactive and engaging user experience. This effect is extracted from `DYNAMIC_LAYOUT_SYSTEM.html`.

## Visual Elements and Effects

*   **Scroll Accumulation:** User scrolling builds up a "scroll accumulation" value.
*   **Chaos Intensity:** As scroll accumulation increases, a "chaos intensity" parameter rises, which can be used to trigger visual glitch effects or overlays.
*   **Layout Switching:** When scroll accumulation reaches a threshold, the UI transitions to a new predefined layout.
*   **Smooth Transitions:** Layout changes are animated smoothly using CSS transitions.
*   **Decay:** Scroll accumulation and chaos intensity gradually decay when the user stops scrolling, returning the UI to a stable state.
*   **Visual Feedback:** A scroll progress indicator and a chaos overlay provide visual cues about the system's state.

## Code Snippets and Explanation

### 1. HTML Structure (for feedback elements)

Elements to provide visual feedback on scroll progress and chaos.

```html
<!-- SCROLL PROGRESS -->
<div class="scroll-progress">
    <div class="scroll-fill" id="scrollFill"></div>
</div>

<!-- CHAOS OVERLAY -->
<div class="chaos-overlay" id="chaosOverlay"></div>

<!-- STATE INDICATOR (for displaying current layout, chaos level) -->
<div class="state-indicator">
    <div class="state-row">Layout: <span class="state-value" id="current-layout">HOME</span></div>
    <div class="state-row">Chaos: <span class="state-value" id="chaos-level">0%</span></div>
    <div class="state-row">Scroll: <span class="state-value" id="scroll-progress">0/5</span></div>
</div>
```

**Explanation:**
*   `scroll-progress` and `scroll-fill`: A vertical bar that visually represents the `scrollAccumulation`.
*   `chaos-overlay`: A full-screen overlay that becomes visible and animated as `chaosIntensity` increases.
*   `state-indicator`: Displays textual feedback on the current layout, chaos level, and scroll progress.

### 2. CSS Styling (for feedback elements)

Styling for the scroll progress bar and chaos overlay.

```css
.scroll-progress {
    position: fixed;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    width: 4px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    z-index: 1000;
    border: 1px solid rgba(0, 255, 255, 0.3);
}

.scroll-fill {
    width: 100%;
    height: 0%; /* Height controlled by JS */
    background: linear-gradient(to top, #00ffff 0%, #ff00ff 50%, #ffff00 100%);
    border-radius: 2px;
    transition: all 0.3s ease; /* Smooth fill animation */
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.chaos-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
    opacity: 0; /* Hidden by default */
    background:
        repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 0, 255, 0.05) 2px, rgba(255, 0, 255, 0.05) 4px),
        repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 255, 255, 0.05) 2px, rgba(0, 255, 255, 0.05) 4px);
    transition: opacity 0.3s ease;
}

.chaos-overlay.active {
    opacity: 1;
    animation: chaosFlicker 0.15s infinite; /* Flickering animation */
}

@keyframes chaosFlicker {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
}
```

**Customization:**
*   **Colors:** Adjust gradients and `rgba` values for the scroll fill and chaos overlay.
*   **Animation:** Modify `transition` durations and `keyframes` for visual feedback elements.
*   **Overlay Pattern:** Change `repeating-linear-gradient` properties for different chaos patterns.

### 3. JavaScript (Core Logic)

The `DynamicLayoutSystem` class manages the scroll-driven transitions.

```javascript
// In DynamicLayoutSystem class
this.scrollAccumulation = 0;
this.scrollThreshold = 5; // Number of scroll "units" to trigger a state change
this.scrollDecay = 0.95;   // Rate at which scroll accumulation decays
this.chaosIntensity = 0.0;
this.isTransitioning = false; // Flag to prevent multiple transitions

setupEnhancedScrolling() {
    let scrollTimeout; // To manage decay timeout

    document.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent default page scrolling

        if (this.isTransitioning) return; // Ignore scroll during transition

        const direction = e.deltaY > 0 ? 1 : -1; // Determine scroll direction
        this.scrollAccumulation += direction; // Accumulate scroll

        // Calculate chaos intensity based on accumulation
        this.chaosIntensity = Math.min(1.0, Math.abs(this.scrollAccumulation) / this.scrollThreshold);

        // Update all visualizers with chaos intensity (e.g., for glitch effects)
        this.visualizers.forEach(viz => {
            viz.updateChaos(this.chaosIntensity);
        });

        this.updateScrollFeedback(); // Update UI elements

        // Check if threshold reached to trigger a state change
        if (Math.abs(this.scrollAccumulation) >= this.scrollThreshold) {
            const newState = (this.currentState + (direction > 0 ? 1 : -1) + this.layoutNames.length) % this.layoutNames.length;
            this.triggerStateTransition(newState); // Trigger layout change
        }

        // Reset decay timeout
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            this.decayScrollAccumulation();
        }, 100); // Start decay after 100ms of no scroll
    });
}

updateScrollFeedback() {
    // Update scroll progress bar height
    const progress = Math.abs(this.scrollAccumulation) / this.scrollThreshold * 100;
    document.getElementById('scrollFill').style.height = `${Math.min(100, progress)}%`;

    // Update text indicators
    document.getElementById('scroll-progress').textContent = `${Math.abs(this.scrollAccumulation).toFixed(1)}/${this.scrollThreshold}`;
    document.getElementById('chaos-level').textContent = `${(this.chaosIntensity * 100).toFixed(0)}%`;

    // Toggle chaos overlay visibility
    const chaosOverlay = document.getElementById('chaosOverlay');
    if (this.chaosIntensity > 0.3) { // Threshold for showing overlay
        chaosOverlay.classList.add('active');
    } else {
        chaosOverlay.classList.remove('active');
    }
}

decayScrollAccumulation() {
    this.scrollAccumulation *= this.scrollDecay; // Reduce accumulation
    if (Math.abs(this.scrollAccumulation) < 0.1) { // If very low, reset to 0
        this.scrollAccumulation = 0;
        this.chaosIntensity = 0;
        this.visualizers.forEach(viz => { viz.updateChaos(0); }); // Reset chaos on visualizers
        document.getElementById('chaosOverlay').classList.remove('active');
    }

    this.updateScrollFeedback(); // Update UI

    if (this.scrollAccumulation !== 0) {
        setTimeout(() => this.decayScrollAccumulation(), 100); // Continue decaying
    }
}

triggerStateTransition(newState) {
    // ... (logic to change mainContainer class, update content, snap visualizers to new state) ...
    this.isTransitioning = true; // Set flag
    // ...
    setTimeout(() => {
        this.isTransitioning = false; // Reset flag after transition duration
    }, 1200); // Matches CSS transition duration for layout changes
}
```

**Customization:**
*   **`scrollThreshold`:** Adjust how much scrolling is needed to trigger a layout change. Lower values make it more sensitive.
*   **`scrollDecay`:** Control how quickly the system returns to a stable state after scrolling stops. Values closer to 1.0 mean slower decay.
*   **`chaosIntensity` Thresholds:** Modify the `0.3` threshold in `updateScrollFeedback` to control when the `chaos-overlay` becomes active.
*   **Visualizer Response:** The `viz.updateChaos(this.chaosIntensity)` call allows you to define how your WebGL visualizers react to the chaos level (e.g., increased glitch, faster movement).
*   **Transition Speed:** Ensure the `setTimeout` duration in `triggerStateTransition` matches the `transition` duration of your CSS layout changes for smooth synchronization.

## Reusability

To reuse this scroll-driven layout transition:

1.  **HTML:** Include the `scroll-progress`, `chaos-overlay`, and `state-indicator` elements (or your custom feedback elements).
2.  **CSS:** Copy the styling for these elements, including the `chaosFlicker` animation.
3.  **JavaScript:**
    *   Integrate the `scrollAccumulation`, `scrollThreshold`, `scrollDecay`, `chaosIntensity`, and `isTransitioning` variables into your main application logic.
    *   Implement the `setupEnhancedScrolling`, `updateScrollFeedback`, and `decayScrollAccumulation` functions.
    *   Modify your state transition function (`triggerStateTransition` in this example) to be called when `scrollAccumulation` reaches the `scrollThreshold`.
    *   Ensure your visual components (e.g., WebGL visualizers) have a mechanism to receive and react to the `chaosIntensity` value.

```html
<!-- Example of reusable scroll-driven transition feedback -->
<div style="height: 200vh; background: linear-gradient(to bottom, #000, #333);">
    <div class="scroll-progress" style="height: 150px; right: 50px;">
        <div class="scroll-fill" id="exampleScrollFill"></div>
    </div>
    <div class="chaos-overlay" id="exampleChaosOverlay"></div>
    <div style="position: fixed; top: 20px; left: 20px; background: rgba(0,0,0,0.7); padding: 10px; color: white; border-radius: 5px;">
        Scroll Accumulation: <span id="exampleScrollAccumulation">0</span><br>
        Chaos Level: <span id="exampleChaosLevel">0%</span>
    </div>
</div>

<script>
    let exampleScrollAccumulation = 0;
    const exampleScrollThreshold = 10;
    const exampleScrollDecay = 0.9;
    let exampleChaosIntensity = 0;
    let exampleScrollTimeout;

    function updateExampleScrollFeedback() {
        const progress = Math.abs(exampleScrollAccumulation) / exampleScrollThreshold * 100;
        document.getElementById('exampleScrollFill').style.height = `${Math.min(100, progress)}%`;
        document.getElementById('exampleScrollAccumulation').textContent = exampleScrollAccumulation.toFixed(1);
        document.getElementById('exampleChaosLevel').textContent = `${(exampleChaosIntensity * 100).toFixed(0)}%`;

        const chaosOverlay = document.getElementById('exampleChaosOverlay');
        if (exampleChaosIntensity > 0.2) {
            chaosOverlay.classList.add('active');
        } else {
            chaosOverlay.classList.remove('active');
        }
    }

    function decayExampleScrollAccumulation() {
        exampleScrollAccumulation *= exampleScrollDecay;
        exampleChaosIntensity *= exampleScrollDecay; // Decay chaos too

        if (Math.abs(exampleScrollAccumulation) < 0.1) {
            exampleScrollAccumulation = 0;
            exampleChaosIntensity = 0;
        }

        updateExampleScrollFeedback();

        if (exampleScrollAccumulation !== 0) {
            exampleScrollTimeout = setTimeout(decayExampleScrollAccumulation, 100);
        }
    }

    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        exampleScrollAccumulation += direction;
        exampleChaosIntensity = Math.min(1.0, Math.abs(exampleScrollAccumulation) / exampleScrollThreshold);

        updateExampleScrollFeedback();

        if (Math.abs(exampleScrollAccumulation) >= exampleScrollThreshold) {
            console.log("Threshold reached! Trigger layout change here.");
            // In a real app, you'd call your layout transition function here
            exampleScrollAccumulation = 0; // Reset after triggering
            exampleChaosIntensity = 0;
        }

        clearTimeout(exampleScrollTimeout);
        exampleScrollTimeout = setTimeout(decayExampleScrollAccumulation, 100);
    });

    // Initial update
    updateExampleScrollFeedback();
</script>

<style>
    /* Include .scroll-progress, .scroll-fill, .chaos-overlay, @keyframes chaosFlicker CSS here */
    .scroll-progress {
        position: fixed; top: 50%; right: 20px; transform: translateY(-50%);
        width: 4px; height: 200px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; z-index: 1000; border: 1px solid rgba(0, 255, 255, 0.3);
    }
    .scroll-fill {
        width: 100%; height: 0%; background: linear-gradient(to top, #00ffff 0%, #ff00ff 50%, #ffff00 100%);
        border-radius: 2px; transition: all 0.3s ease; box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
    }
    .chaos-overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100; opacity: 0;
        background: repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 0, 255, 0.05) 2px, rgba(255, 0, 255, 0.05) 4px),
                    repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 255, 255, 0.05) 2px, rgba(0, 255, 255, 0.05) 4px);
        transition: opacity 0.3s ease;
    }
    .chaos-overlay.active { opacity: 1; animation: chaosFlicker 0.15s infinite; }
    @keyframes chaosFlicker { 0% { opacity: 0.7; } 50% { opacity: 1; } 100% { opacity: 0.7; } }
</style>
