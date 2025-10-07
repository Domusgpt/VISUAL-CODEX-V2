
### Project Organizer Widget - UI & Interactions

*   **File Path:** `/mnt/c/Users/millz/Desktop/Web_Dashboards/project-widget-fully-functional.html`
*   **Dependencies:** CSS3, JavaScript
*   **Visual Description:** This is a compact, floating widget designed for project organization. It has a dark theme with neon green and cyan accents. The widget is highly interactive, allowing users to open/close, minimize/maximize, and drag it around the screen. It features tabbed navigation and displays project information, MCP status, and a terminal interface.
*   **Key Features & Effects:**
    *   **Floating Action Button (FAB):** A circular button (`.widget-fab`) with a linear gradient background and a `box-shadow` that scales up on hover. It toggles the visibility of the main widget.
    *   **Draggable Widget:** The entire widget (`.widget-container`) can be dragged around the screen by its header, with smooth positioning updates.
    *   **Minimize/Maximize:** The widget can be minimized to a compact header-only view, and restored, with CSS transitions for height and content visibility.
    *   **Tabbed Navigation:** Tabs (`.widget-tab`) change background and text color on hover and when active, providing clear visual feedback.
    *   **Project Item Hover Effect:** Project cards (`.project-item`) change their border color and translate slightly to the right on hover.
    *   **Status Indicators:** Small colored dots (`.status-dot`) with `box-shadow` for a glowing effect, indicating online/offline status.
    *   **Custom Scrollbar:** The `widget-content` has a custom-styled scrollbar.
    *   **Button Hover Effects:** Various buttons throughout the widget have subtle background color changes and border color changes on hover.
*   **Code Highlights:**

    *   **CSS (Floating Action Button Hover):**
        ```css
        .widget-fab:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(0, 255, 159, 0.6);
        }
        ```

    *   **CSS (Project Item Hover):**
        ```css
        .project-item:hover {
            border-color: #00ffd9;
            transform: translateX(3px);
        }
        ```

    *   **JavaScript (Drag Functionality):**
        ```javascript
        function initDrag() {
            const widget = document.getElementById('widget');
            const header = document.getElementById('widgetHeader');

            header.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }

        function drag(e) {
            if (!isDragging) return;

            e.preventDefault();
            const widget = document.getElementById('widget');

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            widget.style.left = currentX + 'px';
            widget.style.top = currentY + 'px';
            widget.style.right = 'auto';
            widget.style.bottom = 'auto';
        }
        ```
