
### Parserator Website - Cyberpunk UI & Animations

*   **File Path:** `/mnt/c/Users/millz/ParseratorMarketing/website/index.html`
*   **Dependencies:** CSS3, JavaScript
*   **Visual Description:** The website uses a dark, cyberpunk-inspired theme with neon accents (teal, pink, orange, purple, green). It features a dynamic background with animated grids and floating particles, creating an immersive and futuristic atmosphere. UI elements are designed with glassmorphism, glowing text, and various interactive hover and entrance animations.
*   **Key Features & Effects:**

    *   **Animated Background Grid:** The `body::before` pseudo-element creates a repeating grid pattern that animates its `transform: translate` using the `gridMove` keyframes, giving a subtle scrolling grid effect.
    *   **Floating Particles:** Multiple `div` elements with the class `particle` are positioned absolutely and animated using the `float` keyframes. These particles have `box-shadow` for a glowing effect and are colored with neon hues, creating a dynamic, ambient background.
    *   **Gradient Text:** Many text elements (e.g., `hero-title`, `section-title`, `nav-brand`, footer text) use `linear-gradient` backgrounds with `-webkit-background-clip: text` and `-webkit-text-fill-color: transparent` to create multi-colored, animated text. The `gradientShift` animation makes these gradients subtly shift over time.
    *   **Glassmorphism:** Elements like the `nav` bar, `hero-badge`, `btn-secondary`, `card`, `principle-card`, and `feature-card` use `backdrop-filter: blur()` and transparent backgrounds to create a frosted glass effect.
    *   **Dynamic Navigation Bar:** The `nav` bar has a `backdrop-filter` and a `::before` pseudo-element that creates a glowing top border with a `gradient-cyber` background. It also changes its padding and gains a `box-shadow` when scrolled (`scrolled` class).
    *   **Navigation Link Hover Effects:** `nav-link` elements have a `::before` pseudo-element that scales up and fades in on hover, creating a background highlight. They also `translateY` and gain `text-shadow`.
    *   **Button Hover Effects:** Buttons (`.btn`) have a "shine" effect (`::before` pseudo-element with `linear-gradient`) that slides across the button on hover. They also `translateY` and gain `box-shadow`. `btn-secondary` has an additional `::after` pseudo-element with a `linear-gradient` that fades in on hover.
    *   **Hero Section Visuals:**
        *   **Video Background:** A `video` element (`hero-video`) plays in the background with `opacity` and `filter: blur` for a subtle, atmospheric effect.
        *   **Radial Gradient Overlay:** The `hero::before` pseudo-element creates a pulsing (`heroGlow` animation) radial gradient overlay with neon colors.
        *   **Hero Badge:** A `hero-badge` with a `linear-gradient` background, `backdrop-filter`, and a "shine" effect (`::before` pseudo-element) that slides across on hover.
        *   **Hero Title Glow:** The `hero-title::after` pseudo-element creates a pulsing (`titleGlow` animation) radial gradient glow behind the title.
    *   **"Clear Seas Solutions" Interactive Text:** The `clear-seas-text` element has complex `::before` and `::after` pseudo-elements that create a glowing, animated border and background on hover, with subtle `transform` effects. It also has a subtle "breathing" animation when not hovered.
    *   **Card Hover Effects:** Various card types (`card`, `first-principles-card`, `principle-card`, `feature-card`) have sophisticated hover effects that include `transform: translateY`, `box-shadow` (with neon glows), `border-color` changes, and animated `::before`/`::after` pseudo-elements that create glowing borders or background overlays.
    *   **Status Indicator:** A `status` element with a pulsing `status-dot` (`statusPulse` animation) for a live status indication.
    *   **Staggered Entrance Animations:** Uses an `IntersectionObserver` to trigger `fadeInUp` animations on cards as they enter the viewport, with a staggered delay for a smooth, cascading effect.
    *   **Mouse-Reactive Card Tilt:** Cards (`.card`, `.principle-card`, `.feature-card`, `.first-principles-card`) subtly tilt in 3D space (`rotateX`, `rotateY`) based on mouse position relative to the card.
    *   **Custom Scrollbar:** The scrollbar is custom-styled with a dark track and a gradient thumb that glows on hover.
    *   **NPM Launch Announcement Banner:** A fixed banner at the top with a `linear-gradient` background that animates (`gradientShift`) and a "shimmer" effect (`::before` pseudo-element with `shimmer` animation) that slides across.
*   **Code Highlights:**

    *   **CSS (Animated Background Grid):**
        ```css
        body::before {
            background-image:
                linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px);
            background-size: 100px 100px;
            animation: gridMove 20s linear infinite;
        }
        @keyframes gridMove { /* ... */ }
        ```

    *   **CSS (Floating Particles):**
        ```css
        .particle {
            animation: float 15s infinite ease-in-out;
            box-shadow: 0 0 10px var(--neon-teal); /* Example glow */
        }
        @keyframes float { /* ... */ }
        ```

    *   **CSS (Card Hover Effects with Pseudo-elements):**
        ```css
        .card:hover::before { opacity: 1; }
        .card:hover::after { opacity: 0.3; }
        /* ... similar for principle-card, feature-card, first-principles-card ... */
        ```

    *   **JavaScript (Mouse-Reactive Card Tilt):**
        ```javascript
        card.addEventListener('mousemove', (e) => {
            // ... calculate deltaX, deltaY ...
            card.style.transform += `perspective(1000px) rotateX(${deltaY * 3}deg) rotateY(${deltaX * 3}deg)`;
        });
        ```
