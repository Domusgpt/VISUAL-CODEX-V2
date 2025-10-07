
### VIB3CODE Enhanced Theme & Animations

*   **File Path:** `/mnt/c/Users/millz/Desktop/vib3code-enhanced-main/styles/enhanced-vib3.css`
*   **Dependencies:** CSS3
*   **Visual Description:** This CSS file defines a "cyberpunk" theme with a dark, moody color palette and neon accent colors. It includes several animations, such as a glowing effect for the hero section title, a shimmering effect for buttons, and a pulsing animation. It also defines a reusable "glassmorphism" style for cards and other UI elements.
*   **Key Features & Effects:**
    *   **Animated Gradient Background:** The `body` has a `linear-gradient` background that animates using the `enhancedGradient` keyframes, creating a slow, shifting color effect.
    *   **Glowing Text:** The `h1` in the hero section has a `heroGlow` animation that animates the `text-shadow` property to create a pulsing glow effect.
    *   **Button Shine Effect:** The `.btn` class has a `::before` pseudo-element that creates a shine effect that moves across the button on hover.
    *   **Glassmorphism:** The `.glass-card` class defines a reusable glassmorphism effect with `backdrop-filter: blur(12px);`.
    *   **Pulse and Slide-in Animations:** The file includes `pulse` and `slideIn` keyframe animations for general use.
*   **Code Highlights:**

    *   **CSS (Animated Gradient):**
        ```css
        body {
            font-family: var(--font-display);
            background: linear-gradient(135deg, var(--color-sovereignty), var(--color-liberation), var(--color-bridge));
            background-size: 400% 400%;
            animation: enhancedGradient 20s ease infinite;
            color: var(--color-wisdom);
            line-height: 1.6;
            overflow-x: hidden;
            min-height: 100vh;
        }

        @keyframes enhancedGradient {
            0% { background-position: 0% 50%; }
            25% { background-position: 100% 50%; }
            50% { background-position: 100% 100%; }
            75% { background-position: 0% 100%; }
            100% { background-position: 0% 50%; }
        }
        ```

    *   **CSS (Button Shine):**
        ```css
        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s ease;
        }

        .btn:hover::before {
            left: 100%;
        }
        ```
