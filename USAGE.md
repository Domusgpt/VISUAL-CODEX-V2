# Visual Codex - Usage Guide for AI Agents

This document provides detailed instructions for AI agents on how to effectively use and contribute to the Visual Codex.

## 1. Accessing the Codex

The primary entry point for the Visual Codex is the `TABLE_OF_CONTENTS.md` file. This file provides a hierarchical index of all documented visual effects and components.

**Path:** `/mnt/c/Users/millz/visual_codex/TABLE_OF_CONTENTS.md`

## 2. Navigating the Codex

The Codex is organized into a logical folder structure. AI agents should use `glob` and `read_file` tools to navigate and access the content.

**Top-Level Categories:**

*   `webgl_visualizations/`: WebGL-based effects.
*   `css_animations_effects/`: CSS-based animations and effects.
*   `interactive_ui_components/`: Interactive UI elements.
*   `core_documentation/`: Core architectural components.

**Sub-Categories:** Each top-level category contains further sub-folders for more granular organization (e.g., `webgl_visualizations/4d_polytopal_visualizers/`).

## 3. Understanding Documentation Files (`.md`)

Each visual effect or component is documented in its own `.md` file. AI agents should parse these files to extract relevant information.

**Standard Sections within each `.md` file:**

*   **Title:** The name of the visual effect/component.
*   **File Path:** The absolute path to the source file(s) of the effect.
*   **Dependencies:** Lists required technologies (e.g., WebGL, CSS3, JavaScript libraries).
*   **Visual Description:** A human-readable description of what the effect does visually.
*   **Key Features & Effects:** Detailed breakdown of the visual capabilities and characteristics.
*   **Key Parameters/Settings:** Important parameters that control the effect, often with their types and ranges.
*   **Code Highlights:** Relevant code snippets (HTML, CSS, GLSL, JavaScript) demonstrating the core implementation.

**Parsing Strategy for AI Agents:**

*   **Extracting Information:** Use regular expressions or Markdown parsing libraries to extract content from specific headings (e.g., "Key Features & Effects", "Code Highlights").
*   **Identifying Code:** Look for code blocks (fenced code blocks with language specifiers like ````javascript`, ````glsl`, ````css`, ````html`) within the "Code Highlights" section.
*   **Understanding Parameters:** Parse the "Key Parameters/Settings" section to understand how to programmatically control the effect. Look for parameter names, types, and value ranges.

## 4. Reusing Visual Effects

To reuse a visual effect, AI agents should:

1.  **Identify the Effect:** Determine the most suitable effect based on the user's request and the project's context.
2.  **Read Documentation:** Access and parse the corresponding `.md` file to understand its implementation details.
3.  **Copy Code:** Extract the necessary HTML, CSS, and JavaScript code snippets.
4.  **Integrate Dependencies:** Ensure all listed dependencies are met in the target project.
5.  **Adapt Parameters:** Modify the effect's parameters as needed to fit the new context, using the "Key Parameters/Settings" as a guide.
6.  **Test Integration:** Verify that the integrated effect functions as expected and integrates seamlessly with the existing codebase.

## 5. Contributing to the Codex

AI agents can contribute new visual effects to the Codex by:

1.  **Creating a New `.md` File:** Create a new Markdown file in the appropriate sub-category folder.
2.  **Following the Standard Structure:** Ensure the new `.md` file adheres to the standard section headings and content format described in Section 3.
3.  **Providing Clear Descriptions:** Write concise and accurate visual descriptions and feature breakdowns.
4.  **Including Code Highlights:** Provide relevant and well-commented code snippets.
5.  **Updating `TABLE_OF_CONTENTS.md`:** Add an entry for the new effect in the correct category within `TABLE_OF_CONTENTS.md`, including its title and file path.
6.  **Updating `gallery.html`:** Add an entry for the new effect in the `effects` JavaScript array within `gallery.html`, ensuring all fields (`id`, `title`, `description`, `tags`, `interactive`, `file`, `hasRealCode`, `demoClass`) are correctly populated.

## 6. Live Demo (`gallery.html`)

The `gallery.html` file provides a live, interactive demonstration of many of the documented effects. AI agents can analyze this file to understand how multiple effects are integrated and controlled in a live environment.

**Path:** `/mnt/c/Users/millz/visual_codex/gallery.html`

**Key Learnings from `gallery.html` for AI Agents:**

*   **Dynamic Loading:** Observe how effects are dynamically loaded into iframes or rendered using demo classes.
*   **Filtering:** Understand how the `setFilter` function works to categorize and display effects.
*   **Modal Interaction:** Analyze the `openModal` function to see how detailed information and live previews are presented.
*   **Parameter Control:** Note how interactive elements (sliders, buttons) are linked to effect parameters.

---
