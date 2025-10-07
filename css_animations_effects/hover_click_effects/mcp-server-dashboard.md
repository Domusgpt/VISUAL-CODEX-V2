
### MCP Server Dashboard - UI & Subtle Animations

*   **File Path:** `/mnt/c/Users/millz/Desktop/Web_Dashboards/mcp-dashboard.html`
*   **Dependencies:** CSS3, JavaScript
*   **Visual Description:** A clean, modern dashboard with a dark theme, designed for monitoring and managing MCP servers. The UI uses cards to display server information and command snippets.
*   **Key Features & Effects:**
    *   **Pulsing Status Dot:** The `.status-dot` for server status has a `pulse` animation that makes it subtly grow and shrink, indicating activity or a live status.
    *   **Refresh Button Rotation:** The `.refresh-btn` (a circular arrow icon) rotates 180 degrees on hover, providing visual feedback for a refresh action.
    *   **Card Hover Effect:** The `.card` elements slightly translate upwards and gain a subtle `box-shadow` on hover.
    *   **Button Hover Effects:** Standard buttons (`.action-button`) change background color on hover.
    *   **Tooltip:** A basic tooltip (`.tooltiptext`) appears on hover for copy buttons, providing feedback.
*   **Code Highlights:**

    *   **CSS (Pulsing Status Dot):**
        ```css
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: var(--accent-success);
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.95); }
        }
        ```

    *   **CSS (Refresh Button Rotation):**
        ```css
        .refresh-btn {
            background: none;
            border: none;
            color: var(--primary);
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.3s;
        }

        .refresh-btn:hover {
            transform: rotate(180deg);
        }
        ```
