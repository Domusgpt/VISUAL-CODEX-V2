
### Lighthouse Landscape - UI & Animations

*   **File Path:** `/mnt/c/Users/millz/Desktop/lighthouselandscaping/index.html`
*   **Dependencies:** CSS3, JavaScript, AOS (Animate On Scroll) library, Font Awesome
*   **Visual Description:** This website uses a clean, modern design with a focus on subtle animations and interactive elements to enhance user experience. It features scroll-triggered animations, dynamic header behavior, and various hover effects on images, buttons, and links.
*   **Key Features & Effects:**
    *   **AOS (Animate On Scroll) Animations:** Elements like `about-content`, `about-image`, `section-header`, `service-card`, `contact-info`, and `contact-form` use `data-aos` attributes to trigger fade-in and slide-up animations as they enter the viewport.
    *   **Preloader:** A spinning loader animation (`@keyframes spin`) that displays on page load and fades out (`fade-out` class) once the content is ready.
    *   **Scroll Progress Bar:** A thin, linear gradient bar (`.scroll-progress`) at the top of the viewport that visually indicates scroll progress by expanding its width as the user scrolls down the page.
    *   **Dynamic Header:** The header (`.header`) shrinks its padding and height (`scrolled` class) when the user scrolls down, providing a more compact navigation experience.
    *   **Hero Section Entrance Animations:** The `h2`, `p`, and buttons within the hero section use `fadeInUp` keyframe animation to slide up and fade into view sequentially.
    *   **Bouncing Scroll Down Indicator:** A "Scroll Down" text with a chevron icon (`.scroll-down`) that continuously bounces (`@keyframes bounce`) to encourage user interaction.
    *   **Image Hover Effects:**
        *   `about-image`: Rotates slightly on the Y-axis and its inner image scales up on hover, creating a subtle 3D pop-out effect.
        *   `service-card`: Translates upwards, its inner image scales up, and a colored left border expands from top to bottom on hover.
    *   **Button Hover Effects:** Buttons (`.btn`) feature a subtle background overlay that slides from left to right on hover, creating a "shine" effect. They also slightly translate upwards and gain a `box-shadow`.
    *   **Link Hover Effects:** Navigation links and service links have an underline that expands on hover. Footer links translate right and change color.
    *   **Social Link Hover Effects:** Social media icons (`.social-link`) translate upwards on hover.
    *   **Contact Item Hover Effects:** Contact information items (`.contact-item`) translate right on hover, and their associated icons rotate on the Y-axis (`transform: rotateY(180deg)`).
    *   **Testimonial Slider:** A basic JavaScript-controlled slider that transitions between testimonials by changing their `opacity` and `display` properties. Navigation dots (`.testimonial-dot`) highlight the active testimonial and scale up on hover.
    *   **Back to Top Button:** A circular button (`.back-to-top`) that appears when the user scrolls down, fades in/out, and translates upwards on hover.
*   **Code Highlights:**

    *   **CSS (Preloader & Spin Animation):**
        ```css
        .preloader .loader::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: var(--accent);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        ```

    *   **CSS (Service Card Hover Effect):**
        ```css
        .service-card:hover {
            transform: translateY(-15px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 0;
            background-color: var(--accent);
            transition: height 0.4s ease;
        }

        .service-card:hover::before {
            height: 100%;
        }
        ```
