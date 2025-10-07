
### Project Dashboard - UI & Animations

*   **File Path:** `/mnt/c/Users/millz/Desktop/Web_Dashboards/working-dashboard.html`
*   **Dependencies:** CSS3, JavaScript
*   **Visual Description:** A dark-themed dashboard with purple, blue, green, and orange accents. It displays project cards and an activity log.
*   **Key Features & Effects:**
    *   **Button Hover Effects:** Buttons (`.btn`) translate slightly upwards (`transform: translateY(-2px)`) and gain a `box-shadow` on hover.
    *   **Project Card Hover Effect:** Project cards (`.project-card`) also translate slightly upwards and change their border color and `box-shadow` on hover.
    *   **Toast Notifications:** Small, colored toast notifications (`.toast`) slide in from the right (`@keyframes slideIn`) to provide feedback on actions.
    *   **Modal Overlay:** A simple modal (`.modal`) with a semi-transparent dark background appears to display messages.
*   **Code Highlights:**

    *   **CSS (Button Hover):**
        ```css
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        ```

    *   **CSS (Project Card Hover):**
        ```css
        .project-card:hover {
            border-color: #9b59ff;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(155, 89, 255, 0.3);
        }
        ```

    *   **CSS (Toast Notification Animation):**
        ```css
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        ```
