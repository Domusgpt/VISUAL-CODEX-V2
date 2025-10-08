# Visual Codex Gallery

## ⚠️ PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED ⚠️

**NO PERMISSIONS GRANTED. VIEWING FOR DEMONSTRATION ONLY.**

An advanced interactive gallery showcasing 39 unique visual effects and style demonstrations. This serves as a comprehensive library of holographic, parallax, and interactive CSS/WebGL systems.

## 🎨 Features

- **39 Visual Effects**: Holographic systems, 4D visualizers, particle effects, CSS animations
- **Lazy Loading**: Efficient iframe loading prevents WebGL context overload
- **Interactive Previews**: Mouse, scroll, and click interactions
- **Dataset Switcher**: Floating control for instant swapping between gallery datasets without leaving the page
- **Control Deck Analytics**: Inline insights panel with tag filters, section metrics, and curated callouts for each dataset
- **Instant Search**: New codex search overlays surface matching sections, wafers, and demos as you type (with keyboard-accessible clear control)
- **Deep Link Sharing**: Copyable section and card permalinks with history-aware URLs for quick collaboration
- **Session Memory**: Optional per-dataset preferences remember your last section, spotlight, tag focus, and search state when you return
- **Keyboard Navigation**: Arrow keys, bracket cycling, number spotlights, `/` to focus search, and `Shift + ?` to open an in-app shortcut guide with `Alt + Shift + D` control deck toggles
- **Accessibility Aware**: Honors `prefers-reduced-motion` and falls back to CSS backgrounds when WebGL is unavailable
- **Responsive Design**: Mobile-optimized with VaporWave aesthetics

## 🚀 Quick Start

### View on GitHub Pages
Visit: https://[your-username].github.io/visual-codex/

### Available Systems
- **Proper 4D System** (`gallery-proper-system.html?gallery=proper`): Original curated polytopal showcase with WebGL backgrounds and reactive crystal wafers.
- **Aurora Twin System** (`gallery-aurora-system.html?gallery=twin`): Alternate curation featuring Aurora-inspired palettes, mobile-first groupings, and tooling-oriented heavy entries.
- You can also stay on either shell and use the in-page dataset switcher to jump between modes; query parameters (`?gallery=...`) keep the view in sync.

### Local Development
```bash
cd visual_codex
python3 -m http.server 8080
# Visit: http://localhost:8080/gallery.html
```

## 📁 Structure

```
visual_codex/
├── gallery.html          # Main gallery interface
├── demos/               # 25 demo files
├── effects/             # 14 effect files
├── core_documentation/  # System documentation
└── interactive_ui_components/  # UI component docs
```

## ⚠️ LEGAL NOTICE

**PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED**

- This repository contains PROPRIETARY and CONFIDENTIAL material
- NO PERMISSION granted to use, copy, modify, distribute, or sell
- VIEWING PERMITTED for demonstration purposes ONLY  
- Any unauthorized use is STRICTLY PROHIBITED
- Violators will be prosecuted to the full extent of the law

**COPYRIGHT NOTICE**: This code is the exclusive property of Paul Phillips (domusgpt).
Unauthorized use, reproduction, or distribution may result in severe civil and criminal penalties.

---

*Copyright (c) 2025 Paul Phillips (domusgpt)*