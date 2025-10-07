
### Project Organizer Hub - UI & Animations

*   **File Path:** `/mnt/c/Users/millz/Desktop/Web_Dashboards/project-organizer-hub.html`
*   **Dependencies:** CSS3, JavaScript
*   **Visual Description:** The dashboard features a dark theme with vibrant accent colors (green, cyan, purple, yellow, orange). It uses a grid-based layout for project cards and panels. Key visual elements include:
    *   **Sidebar Navigation:** Items have a subtle background change and a left border animation on hover, and a distinct active state.
    *   **Tabbed Interface:** Tabs have background and text color changes on hover and when active.
    *   **Project Cards:** These cards have a border color change, a subtle `translateY` movement, and a `box-shadow` glow effect on hover. They also feature colored badges for project status.
    *   **MCP Integration Hub:** A floating panel with a `backdrop-filter: blur(10px)` for a glassmorphism effect, and buttons with hover effects that change background color, translate upwards, and add a `box-shadow` glow.
    *   **Activity Log:** Simple log entries with timestamps.
    *   **Refresh Button:** A circular button that changes background color and translates upwards on hover, with a `box-shadow` glow.
    *   **Scanning Animation:** A modal overlay with a spinning loader (`@keyframes spin`) and text, indicating a project scan is in progress.
    *   **Status Indicators:** Small colored dots (`.status-dot`) with `box-shadow` for a glowing effect, indicating online/offline status.
*   **Key Features & Effects:**
    *   **Glassmorphism (MCP Hub):** The `.mcp-hub` panel uses `backdrop-filter: blur(10px)` to create a translucent, blurred background.
    *   **Hover Effects:** Extensive use of `transition` for smooth visual feedback on hover for navigation items, tabs, project cards, and buttons, including `transform: translateY()`, `box-shadow`, and `border-color` changes.
    *   **Spinning Loader:** The `.scan-loader` uses a `spin` keyframe animation for a continuous rotation effect.
    *   **Dynamic Coloring:** Accent colors are used throughout the UI to highlight active elements and categories.
*   **Code Highlights:**

    *   **CSS (Project Card Hover Effect):**
        ```css
        .project-card:hover {
            border-color: var(--accent-cyan);
            box-shadow: 0 0 20px rgba(0, 255, 217, 0.2);
            transform: translateY(-2px);
        }
        ```

    *   **CSS (MCP Hub Glassmorphism & Button Hover):**
        ```css
        .mcp-hub {
            /* ... */
            background: linear-gradient(135deg, rgba(189, 94, 255, 0.2), rgba(189, 94, 255, 0.1));
            border: 2px solid var(--accent-purple);
            /* ... */
            backdrop-filter: blur(10px);
        }

        .mcp-button:hover {
            background-color: var(--accent-purple);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(189, 94, 255, 0.4);
        }
        ```

    *   **CSS (Scanning Animation):**
        ```css
        .scan-loader {
            width: 50px;
            height: 50px;
            border: 3px solid var(--bg-tertiary);
            border-top-color: var(--accent-green);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        ```
