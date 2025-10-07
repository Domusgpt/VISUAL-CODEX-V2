
### Parserator Website - Minimalist UI & Animations

*   **File Path:** `/mnt/c/Users/millz/ParseratorMarketing/website/index-minimalist.html`
*   **Dependencies:** CSS3, JavaScript
*   **Visual Description:** This version of the Parserator website adopts a cleaner, more minimalist aesthetic compared to the "enhanced" version. It features a light/dark mode toggle based on user preferences, and uses subtle animations and interactive elements to enhance the user experience without overwhelming visuals. The design emphasizes readability and clarity, while still incorporating modern UI effects.
*   **Key Features & Effects:**

    *   **Adaptive Theme (Light/Dark Mode):** Uses `@media (prefers-color-scheme: dark)` to dynamically adjust CSS variables for colors, providing a seamless light and dark mode experience.
    *   **Subtle Background Gradients:** The `hero::before` pseudo-element creates a subtle radial gradient background with transparent sections, adding a soft, ambient glow to the hero section.
    *   **Navigation Bar Effects:**
        *   **Brand Underline:** The `nav-brand::after` pseudo-element creates an animated underline that expands on hover.
        *   **Link Background Highlight:** `nav-link::before` pseudo-element creates a background highlight that scales up and fades in on hover.
        *   **Scroll Effect:** The `nav` bar changes its background opacity and gains a `box-shadow` when scrolled (`scrolled` class).
    *   **Button Hover Effects:** Buttons (`.btn`) have a "shine" effect (`::before` pseudo-element with `linear-gradient`) that slides across the button on hover. They also `translateY` and gain `box-shadow`. `btn-secondary` has an additional `::after` pseudo-element with a `linear-gradient` that fades in on hover.
    *   **"Clear Seas Solutions" Interactive Text:** The `clear-seas-text` element has `::before` and `::after` pseudo-elements that create a subtle glowing border and background on hover. It also has a subtle "breathing" animation when not hovered.
    *   **Card Hover Effects:** Various card types (`card`, `manifesto-card`, `principle-card`, `feature-card`) have subtle hover effects that include `transform: translateY`, `box-shadow`, `border-color` changes, and animated `::before`/`::after` pseudo-elements that create subtle background overlays or border highlights.
    *   **Status Indicator:** A `status` element with a pulsing `status-dot` (`pulse` animation) for a live status indication.
    *   **Staggered Entrance Animations:** Uses an `IntersectionObserver` to trigger `fadeIn` animations on cards as they enter the viewport, with a staggered delay for a smooth, cascading effect.
    *   **Mouse-Reactive Card Tilt:** Cards (`card`, `manifesto-card`, `principle-card`, `feature-card`) subtly tilt in 3D space (`rotateX`, `rotateY`) based on mouse position relative to the card.
    *   **Custom Scrollbar:** The scrollbar is custom-styled with a track and thumb that change color based on the theme.
*   **Code Highlights:**

    *   **CSS (Adaptive Theme):**
        ```css
        :root { /* Light mode defaults */ }
        @media (prefers-color-scheme: dark) { :root { /* Dark mode overrides */ } }
        ```

    *   **CSS (Hero Background Radial Gradients):**
        ```css
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background:
                radial-gradient(circle at 20% 50%, rgba(0, 180, 166, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(233, 30, 99, 0.03) 0%, transparent 50%);
            pointer-events: none;
        }
        ```

    *   **JavaScript (Staggered Entrance Animation):**
        ```javascript
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('animate-in'); // Assuming this class applies the transition
                    }, index * 100); // Stagger the animations
                }
            });
        }, observerOptions);
        ```
