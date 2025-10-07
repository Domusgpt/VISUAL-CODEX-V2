
### Project Organizer Widget (HTA) - Sleek Native UI

*   **File Path:** `/mnt/c/Users/millz/Desktop/Web_Dashboards/project-widget-native-sleek.hta`
*   **Dependencies:** HTML Application (HTA), CSS3, JavaScript
*   **Visual Description:** This widget presents a compact, native-like interface for project management. It uses a dark background with vibrant neon green for primary elements and magenta for highlights. The UI is designed to be clean and functional, with subtle transitions and visual cues.
*   **Key Features & Effects:**
    *   **Neon Border:** The `body` element has a `1px solid #00ff9f` border, creating a neon green outline for the entire widget.
    *   **Tabbed Navigation:** Tabs (`.tab`) change color and gain a neon green bottom border on hover and when active, with a subtle background change.
    *   **Project Card Hover Effect:** Project cards (`.project-card`) translate slightly to the right (`transform: translateX(5px)`) and change background color on hover, with a neon green left border.
    *   **Custom Scrollbar:** The `content-area` has a custom-styled scrollbar with dark track and light gray thumb that turns neon green on hover.
    *   **Floating Action Button:** A circular button (`.action-button`) with a neon green background and a `box-shadow` that scales up and increases its shadow on hover.
    *   **Quick Action Buttons:** Buttons (`.quick-action-btn`) change background and text color on hover.
    *   **Status Indicators:** Small circular dots (`.status-dot`) with `box-shadow` for a glowing effect, indicating online (neon green) or offline (magenta) status.
    *   **Terminal Output Styling:** The terminal output (`.terminal-output`) uses a dark background with neon green text, mimicking a classic terminal look.
*   **Code Highlights:**

    *   **CSS (Neon Border & Project Card Hover):**
        ```css
        body {
            background: #121212;
            color: #ffffff;
            overflow: hidden;
            border: 1px solid #00ff9f; /* Neon border */
            height: 100vh;
            width: 100vw;
        }

        .project-card:hover {
            transform: translateX(5px);
            background: #262626;
        }
        ```

    *   **CSS (Custom Scrollbar):**
        ```css
        .content-area::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 3px;
        }

        .content-area::-webkit-scrollbar-thumb:hover {
            background: #00ff9f;
        }
        ```

    *   **CSS (Floating Action Button Hover):**
        ```css
        .action-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 14px rgba(0, 255, 159, 0.4);
        }
        ```
