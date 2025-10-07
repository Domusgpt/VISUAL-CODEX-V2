(function () {
  const properContentSets = [
    [
      {
        "title": "Neoskeuomorphic",
        "description": "Modern depth-based card design with advanced shadow systems and interactive hover states",
        "tags": ["CSS", "Design", "Cards"],
        "url": "demos/neoskeuomorphic-cards-demo.html",
        "name": "Neoskeuomorphic Cards"
      },
      {
        "title": "Glassmorphism",
        "description": "Translucent glass-like interface elements with backdrop blur and transparency",
        "tags": ["CSS", "Glass", "Modern"],
        "url": "demos/css-glassmorphism-demo.html",
        "name": "Glassmorphism UI"
      },
      {
        "title": "Holographic Progress",
        "description": "Futuristic progress indicators with neon glow effects and smooth animations",
        "tags": ["CSS", "Progress", "Neon"],
        "url": "demos/holographic-progress-indicators-demo.html",
        "name": "Holographic Progress"
      },
      {
        "title": "State Control",
        "description": "Interactive navigation dot systems with smooth state transitions",
        "tags": ["CSS", "Controls", "Interactive"],
        "url": "demos/state-control-dots-demo.html",
        "name": "State Control Dots"
      },
      {
        "title": "Vaporwave",
        "description": "Retro-futuristic aesthetic elements with classic 80s styling",
        "tags": ["CSS", "Retro", "Aesthetic"],
        "url": "demos/css-vaporwave-aesthetics-demo.html",
        "name": "Vaporwave Aesthetics"
      },
      {
        "title": "Grid Overlay",
        "description": "Dynamic grid pattern animations with morphing geometric structures",
        "tags": ["CSS", "Grid", "Animation"],
        "url": "demos/animated-grid-overlay-demo.html",
        "name": "Animated Grid Overlay"
      }
    ],
    [
      {
        "title": "Holographic Visualizer",
        "description": "Multi-layer WebGL blend mode system with depth-based holographic effects",
        "tags": ["WebGL", "Holographic", "Blend"],
        "url": "effects/holographic-visualizer.html",
        "name": "Holographic Visualizer"
      },
      {
        "title": "Cyberpunk UI",
        "description": "Futuristic interface design elements with neon highlights and tech aesthetics",
        "tags": ["CSS", "Cyberpunk", "Interface"],
        "url": "demos/css-cyberpunk-ui-demo.html",
        "name": "Cyberpunk UI"
      },
      {
        "title": "Particle System",
        "description": "Advanced particle physics visualization with 3D depth and movement",
        "tags": ["WebGL", "Particles", "Physics"],
        "url": "demos/holographic-particle-system-demo.html",
        "name": "Particle System"
      },
      {
        "title": "Glitch Effects",
        "description": "Digital corruption and distortion effects with RGB channel separation",
        "tags": ["CSS", "Glitch", "Digital"],
        "url": "demos/css-glitch-effects-demo.html",
        "name": "Glitch Effects"
      },
      {
        "title": "Depth Layers",
        "description": "Multi-dimensional depth visualization with parallax scrolling effects",
        "tags": ["CSS", "Depth", "Layers"],
        "url": "demos/holographic-depth-layers-demo.html",
        "name": "Depth Layers"
      },
      {
        "title": "Adaptive Cards",
        "description": "Dynamic responsive card system with intelligent layout adaptation",
        "tags": ["CSS", "Adaptive", "Responsive"],
        "url": "demos/vib34d-adaptive-cards-demo.html",
        "name": "VIB34D Adaptive Cards"
      }
    ],
    [
      {
        "title": "MVEP Hypercube",
        "description": "4D hypercube with interference patterns and mathematical precision",
        "tags": ["WebGL", "4D", "Hypercube"],
        "url": "effects/mvep-moire-hypercube.html",
        "name": "MVEP Hypercube"
      },
      {
        "title": "Hypercube Codex",
        "description": "Advanced 4D mathematical visualization with interactive rotation controls",
        "tags": ["WebGL", "Math", "4D"],
        "url": "demos/moire-hypercube-codex-demo.html",
        "name": "Hypercube Codex"
      },
      {
        "title": "Lattice Visualizer",
        "description": "Geometric lattice structure system with crystalline formations",
        "tags": ["WebGL", "Lattice", "Geometry"],
        "url": "demos/hypercube-lattice-visualizer-demo.html",
        "name": "Lattice Visualizer"
      },
      {
        "title": "Chaos Overlay",
        "description": "Digital interference and chaos patterns with algorithmic generation",
        "tags": ["WebGL", "Chaos", "Interference"],
        "url": "demos/chaos-overlay-effects-demo.html",
        "name": "Chaos Overlay"
      },
      {
        "title": "Orchestration Engine",
        "description": "Coordinated multi-system visualization with synchronized behaviors",
        "tags": ["WebGL", "System", "Orchestra"],
        "url": "demos/system-orchestration-engine-demo.html",
        "name": "System Orchestration"
      },
      {
        "title": "Reactive Core",
        "description": "Reactive state management system with real-time data visualization",
        "tags": ["WebGL", "Reactive", "Core"],
        "url": "demos/vib3code-reactive-core-demo.html",
        "name": "VIB3Code Reactive Core"
      }
    ],
    [
      {
        "title": "VIB34D Complete",
        "description": "Revolutionary 4D framework with 8+ geometric systems and advanced rendering",
        "tags": ["WebGL", "VIB34D", "Framework"],
        "url": "effects/vib34d-complete-system.html",
        "name": "VIB34D Complete System"
      },
      {
        "title": "4D HyperAV",
        "description": "Proven 4D audiovisual system with synchronized sound and visuals",
        "tags": ["WebGL", "4D", "Audio"],
        "url": "effects/working-4d-hyperav.html",
        "name": "4D HyperAV"
      },
      {
        "title": "Core Framework",
        "description": "Core 4D mathematics framework with optimized projection algorithms",
        "tags": ["WebGL", "Core", "Math"],
        "url": "effects/hypercube-core-framework.html",
        "name": "Hypercube Core Framework"
      },
      {
        "title": "Consciousness Shader",
        "description": "N-dimensional consciousness visualization with abstract thought patterns",
        "tags": ["WebGL", "Polytopal", "Consciousness"],
        "url": "demos/polytopal-consciousness-shader-demo.html",
        "name": "Polytopal Consciousness"
      },
      {
        "title": "Elegant 4D Flow",
        "description": "Graceful 4D particle systems with fluid dynamics",
        "tags": ["WebGL", "4D", "Flow"],
        "url": "effects/elegant-4d-flow-visualizer.html",
        "name": "Elegant 4D Flow"
      },
      {
        "title": "Holographic Pulse",
        "description": "Rhythmic holographic pulse visualization system",
        "tags": ["WebGL", "Holographic", "Pulse"],
        "url": "effects/holographic-pulse-system.html",
        "name": "Holographic Pulse"
      }
    ],
    [
      {
        "title": "Hyperdimensional Matrix",
        "description": "8D+ chaos visualization with fractal tessellations and infinite complexity",
        "tags": ["WebGL", "8D", "Chaos"],
        "url": "effects/insane-hyperdimensional-matrix.html",
        "name": "Hyperdimensional Matrix"
      },
      {
        "title": "Card Bending",
        "description": "Advanced 3D CSS transform morphing with 6 unique bending behaviors",
        "tags": ["CSS", "3D", "Morphing"],
        "url": "effects/vib34d-advanced-card-bending-system.html",
        "name": "VIB34D Card Bending"
      },
      {
        "title": "Color Shift",
        "description": "Extreme filter effects with contrast shifts and chromatic aberration",
        "tags": ["CSS", "Color", "Filters"],
        "url": "effects/enhanced-color-shift-contrast-system.html",
        "name": "Enhanced Color Shift"
      },
      {
        "title": "Maleficarum Codex",
        "description": "Advanced magical interface system with spell-casting interactions",
        "tags": ["WebGL", "Magic", "Interface"],
        "url": "demos/millzmaleficarum-codex-demo.html",
        "name": "Millzmaleficarum Codex"
      },
      {
        "title": "Morphing Blog",
        "description": "Dynamic content morphing system with seamless transitions",
        "tags": ["WebGL", "Morphing", "Blog"],
        "url": "demos/vib34d-morphing-blog-demo.html",
        "name": "VIB34D Morphing Blog"
      },
      {
        "title": "Multi Canvas",
        "description": "Multiple synchronized visualizer instances with coordinated behaviors",
        "tags": ["WebGL", "Multi", "Canvas"],
        "url": "effects/multi-canvas-visualizer-system.html",
        "name": "Multi Canvas System"
      }
    ],
    [
      {
        "title": "Narrative Choreography",
        "description": "JSON-driven scroll transformations with story-based interactions",
        "tags": ["WebGL", "Narrative", "Choreography"],
        "url": "effects/narrative-choreography-engine.html",
        "name": "Narrative Choreography"
      },
      {
        "title": "Tabbed Visualizer",
        "description": "Advanced WebGL tab management with state preservation",
        "tags": ["WebGL", "Tabs", "Management"],
        "url": "effects/tabbed-visualizer-system.html",
        "name": "Tabbed Visualizer"
      },
      {
        "title": "WebGL Framework",
        "description": "High-performance shader framework with optimization algorithms",
        "tags": ["WebGL", "Framework", "Performance"],
        "url": "effects/hypercube-core-webgl-framework.html",
        "name": "WebGL Framework"
      },
      {
        "title": "Digital Magazine",
        "description": "Interactive digital publication with immersive page transitions",
        "tags": ["WebGL", "Magazine", "Interactive"],
        "url": "demos/vib3code-digital-magazine-demo.html",
        "name": "VIB3Code Digital Magazine"
      },
      {
        "title": "Tech Layout",
        "description": "Advanced layout with active systems and dynamic positioning",
        "tags": ["WebGL", "Layout", "Tech"],
        "url": "demos/tech-layout-active-holographic-demo.html",
        "name": "Tech Layout Active"
      },
      {
        "title": "Parallax Systems",
        "description": "Advanced parallax visualization with infinite depth perception",
        "tags": ["WebGL", "Parallax", "System"],
        "url": "demos/holographic-parallax-systems-mega-demo.html",
        "name": "Holographic Parallax"
      }
    ],
    [
      {
        "title": "Active Holographic",
        "description": "125 WebGL visualizers in mega-demo with coordinated chaos",
        "tags": ["WebGL", "Mega", "Active"],
        "url": "demos/active-holographic-systems-mega-demo.html",
        "name": "Active Holographic Mega",
        "isHeavy": true
      },
      {
        "title": "VIB34D Complete",
        "description": "Revolutionary 4D framework with all geometric systems enabled",
        "tags": ["WebGL", "VIB34D", "Complete"],
        "url": "effects/vib34d-complete-system.html",
        "name": "VIB34D Complete"
      },
      {
        "title": "Working 4D HyperAV",
        "description": "Proven audiovisual 4D system with synchronized rendering",
        "tags": ["WebGL", "4D", "Audio"],
        "url": "effects/working-4d-hyperav.html",
        "name": "Working 4D HyperAV"
      },
      {
        "title": "Hypercube Core",
        "description": "Core hypercube framework with mathematical precision",
        "tags": ["WebGL", "Hypercube", "Core"],
        "url": "effects/hypercube-core-framework.html",
        "name": "Hypercube Core"
      },
      {
        "title": "Insane Matrix",
        "description": "8D+ hyperdimensional chaos with infinite complexity",
        "tags": ["WebGL", "8D", "Matrix"],
        "url": "effects/insane-hyperdimensional-matrix.html",
        "name": "Hyperdimensional Matrix"
      },
      {
        "title": "MVEP Hypercube",
        "description": "Production MVEP system with moire interference patterns",
        "tags": ["WebGL", "MVEP", "Hypercube"],
        "url": "effects/mvep-moire-hypercube.html",
        "name": "MVEP Moire Hypercube"
      }
    ]
  ];

  const properPolytopThemes = [
    { "name": "Holographic Genesis", "geometry": "hypercube", "rotation": [0.3, 0.2, 0.4, 0.1], "density": 5.0, "colors": [1.0, 0.0, 1.0] },
    { "name": "Plasma Emergence", "geometry": "octaplex", "rotation": [0.4, 0.3, 0.2, 0.5], "density": 6.5, "colors": [0.0, 1.0, 1.0] },
    { "name": "Neural Awakening", "geometry": "16cell", "rotation": [0.2, 0.5, 0.3, 0.4], "density": 8.0, "colors": [1.0, 1.0, 0.0] },
    { "name": "Crystal Resonance", "geometry": "120cell", "rotation": [0.5, 0.1, 0.6, 0.2], "density": 10.0, "colors": [0.0, 1.0, 0.0] },
    { "name": "Quantum Chaos", "geometry": "600cell", "rotation": [0.6, 0.4, 0.1, 0.7], "density": 12.5, "colors": [1.0, 0.5, 0.0] },
    { "name": "Fractal Storm", "geometry": "tesseract", "rotation": [0.7, 0.6, 0.5, 0.3], "density": 15.0, "colors": [0.5, 0.0, 1.0] },
    { "name": "Dimensional Collapse", "geometry": "polytope", "rotation": [0.8, 0.7, 0.6, 0.8], "density": 20.0, "colors": [1.0, 0.0, 0.0] }
  ];

  const twinContentSets = [
    [
      {
        title: "Crystal Prism Nexus",
        description: "Refined wafer formations showcasing crystalline depth layering for desktop curation",
        tags: ["Gallery", "Crystal", "Desktop"],
        url: "gallery-crystal-wafer.html",
        name: "Crystal Wafer Array"
      },
      {
        title: "Treasure Vault Relay",
        description: "Immersive scroll experience blending treasure chamber lighting with holographic reveals",
        tags: ["Gallery", "Scroll", "Immersive"],
        url: "gallery-treasure-experience.html",
        name: "Treasure Experience"
      },
      {
        title: "Snap Grid Corridor",
        description: "Momentum-guided snap scrolling corridor with rhythmic camera locks and neon anchors",
        tags: ["Gallery", "Scroll", "Momentum"],
        url: "gallery-snap-scroll.html",
        name: "Snap Scroll Gallery"
      },
      {
        title: "Tactile Field",
        description: "Haptic-inspired scroll physics translated into glass-panel transitions for tactile control",
        tags: ["Gallery", "Tactile", "Physics"],
        url: "gallery-tactile-scroll.html",
        name: "Tactile Scroll"
      },
      {
        title: "Parallax Observatory",
        description: "Multi-depth parallax showcase with orbital camera sweeps and reactive focus nodes",
        tags: ["Gallery", "Parallax", "Depth"],
        url: "gallery-parallax-system.html",
        name: "Parallax System"
      },
      {
        title: "Crystal Lattice Revision",
        description: "Iterated wafer refinement demonstrating calibrated lighting and panel choreography",
        tags: ["Gallery", "Crystal", "Revision"],
        url: "gallery-crystal-perfected.html",
        name: "Crystal Wafer Perfected"
      }
    ],
    [
      {
        title: "Native Holo Deck",
        description: "Original mobile-first interface with low-latency transitions and tap-driven parallax",
        tags: ["Mobile", "Gallery", "Native"],
        url: "gallery-mobile-native.html",
        name: "Mobile Native"
      },
      {
        title: "Enhanced Vapor Core",
        description: "Upgraded mobile gallery with expanded preview cells and neon fog overlays",
        tags: ["Mobile", "Enhancement", "Fog"],
        url: "gallery-mobile-enhanced.html",
        name: "Mobile Enhanced"
      },
      {
        title: "Six by Seven Array",
        description: "High-density 6x7 lattice optimized for fingertip scanning and rapid loading",
        tags: ["Mobile", "Grid", "Performance"],
        url: "gallery-mobile-native-6x7.html",
        name: "Mobile 6x7"
      },
      {
        title: "Server Relay Portal",
        description: "Local server landing view with diagnostic overlays for gallery orchestration",
        tags: ["Ops", "Server", "Diagnostics"],
        url: "gallery-server.html",
        name: "Server Portal"
      },
      {
        title: "Standalone Capsule",
        description: "Minimalist standalone deployment with capsule transitions and quick boot",
        tags: ["Deployment", "Standalone", "Minimal"],
        url: "gallery-standalone.html",
        name: "Standalone Gallery"
      },
      {
        title: "Prime Gallery",
        description: "Primary aggregated gallery entry with curated hover preloads and matrix layout",
        tags: ["Gallery", "Aggregate", "Curated"],
        url: "gallery.html",
        name: "Main Gallery"
      }
    ],
    [
      {
        title: "Production Spectacular",
        description: "VIB34D stage show with sequenced reveals and cinematic gradient choreography",
        tags: ["VIB34D", "Showcase", "Cinematic"],
        url: "demos/vib34d-production-spectacular-demo.html",
        name: "Production Spectacular"
      },
      {
        title: "Director Console",
        description: "Command dashboard for orchestrating multiple VIB pipelines with editor-grade overlays",
        tags: ["VIB34D", "Dashboard", "Control"],
        url: "demos/vib34d-editor-dashboard-demo.html",
        name: "Editor Dashboard"
      },
      {
        title: "Mega Systems Hub",
        description: "Tabbed control surface for cycling between packed active holographic clusters",
        tags: ["Holographic", "Tabs", "Control"],
        url: "demos/active-holographic-systems-tabbed.html",
        name: "Tabbed Holographic Hub"
      },
      {
        title: "Mobile Control Dots",
        description: "Touch-optimized navigation dots with inertia curves and mobile telemetry",
        tags: ["Mobile", "Navigation", "Control"],
        url: "demos/state-control-dots-mobile.html",
        name: "State Dots Mobile"
      },
      {
        title: "Pocket Cards",
        description: "Compact neoskeuomorphic card pack tuned for handset rendering budgets",
        tags: ["Mobile", "Cards", "Depth"],
        url: "demos/neoskeuomorphic-cards-mobile.html",
        name: "Cards Mobile"
      },
      {
        title: "Index Redirect",
        description: "Zero-latency redirect entry for handing users into the polytopal selector",
        tags: ["Routing", "Bootstrap", "Redirect"],
        url: "index.html",
        name: "Index Redirect"
      }
    ],
    [
      {
        title: "Complete Enhanced",
        description: "Elevated VIB34D core featuring additional shader stacks and colorway cycling",
        tags: ["VIB34D", "Enhanced", "Shaders"],
        url: "effects/vib34d-complete-system-enhanced.html",
        name: "Complete Enhanced"
      },
      {
        title: "Hypercube Weave",
        description: "Hypercube lattice weaving variant emphasising structural resonance",
        tags: ["WebGL", "Hypercube", "Resonance"],
        url: "effects/mvep-moire-hypercube.html",
        name: "Hypercube Weave"
      },
      {
        title: "Pulse Harmonics",
        description: "Holographic pulse retimed for harmonic layering and multi-channel glow",
        tags: ["WebGL", "Pulse", "Audio"],
        url: "effects/holographic-pulse-system.html",
        name: "Pulse Harmonics"
      },
      {
        title: "Flow Atlas",
        description: "Fluid atlas variant emphasising ribboned particle striations and curl maps",
        tags: ["WebGL", "Flow", "Particles"],
        url: "effects/elegant-4d-flow-visualizer.html",
        name: "Flow Atlas"
      },
      {
        title: "Matrix Storm",
        description: "Hyperdimensional matrix tuned for stormfront intensity and turbulence",
        tags: ["WebGL", "Matrix", "Chaos"],
        url: "effects/insane-hyperdimensional-matrix.html",
        name: "Matrix Storm"
      },
      {
        title: "Narrative Shell",
        description: "Story engine variant with extended timeline curves and chapter cues",
        tags: ["WebGL", "Narrative", "Engine"],
        url: "effects/narrative-choreography-engine.html",
        name: "Narrative Engine"
      }
    ],
    [
      {
        title: "Iframe Diagnostics",
        description: "Diagnostics pass for lazy iframe hydration and sandbox verification",
        tags: ["Testing", "Iframe", "Diagnostics"],
        url: "test-iframe-loading.html",
        name: "Iframe Diagnostics"
      },
      {
        title: "Gallery Bootstrap",
        description: "Python launcher manifest for orchestrating local gallery servers",
        tags: ["Ops", "Launcher", "Python"],
        url: "start-gallery.py",
        name: "Start Gallery Script",
        isHeavy: true
      },
      {
        title: "Comprehensive Mobile Test",
        description: "Automated Puppeteer sweep covering mobile layout assertions and scroll cases",
        tags: ["Testing", "Mobile", "Automation"],
        url: "test-mobile-gallery-comprehensive.js",
        name: "Mobile Test Full",
        isHeavy: true
      },
      {
        title: "Quick Mobile Test",
        description: "Lightweight smoke test script verifying mission-critical gallery endpoints",
        tags: ["Testing", "Smoke", "Automation"],
        url: "test-mobile-gallery-quick.js",
        name: "Mobile Test Quick",
        isHeavy: true
      },
      {
        title: "Server Automation",
        description: "Batch bootstrap for gallery server spin-up with instrumentation hooks",
        tags: ["Ops", "Server", "Bootstrap"],
        url: "start-gallery.bat",
        name: "Server Bootstrap",
        isHeavy: true
      },
      {
        title: "Puppeteer Harness",
        description: "Headless harness validating iframe sequencing and fallback states",
        tags: ["Testing", "Harness", "Automation"],
        url: "test-gallery-puppeteer.js",
        name: "Puppeteer Harness",
        isHeavy: true
      }
    ],
    [
      {
        title: "Adaptive Cards Alt",
        description: "Alternate adaptive card arrangement showcasing color-coded zones",
        tags: ["CSS", "Adaptive", "Alt"],
        url: "demos/vib34d-adaptive-cards-demo.html",
        name: "Adaptive Cards Alt"
      },
      {
        title: "Glassmorphism Drift",
        description: "Glass surfaces retuned for colder palette and additional motion blur",
        tags: ["CSS", "Glass", "Variant"],
        url: "demos/css-glassmorphism-demo.html",
        name: "Glassmorphism Drift"
      },
      {
        title: "Cyberpunk Switchback",
        description: "Cyberpunk UI variant focusing on alert channels and status ribbons",
        tags: ["CSS", "Cyberpunk", "Variant"],
        url: "demos/css-cyberpunk-ui-demo.html",
        name: "Cyberpunk Switchback"
      },
      {
        title: "Particle Bloom",
        description: "Particle system emphasising bloom intensity and camera drift",
        tags: ["WebGL", "Particles", "Bloom"],
        url: "demos/holographic-particle-system-demo.html",
        name: "Particle Bloom"
      },
      {
        title: "Glitch Strata",
        description: "Glitch showcase focusing on layered tearing and chroma abrasion",
        tags: ["CSS", "Glitch", "Variant"],
        url: "demos/css-glitch-effects-demo.html",
        name: "Glitch Strata"
      },
      {
        title: "Depth Chamber",
        description: "Depth layers retimed for breathing motion and extended parallax",
        tags: ["CSS", "Depth", "Variant"],
        url: "demos/holographic-depth-layers-demo.html",
        name: "Depth Chamber"
      }
    ],
    [
      {
        title: "Active Resonance",
        description: "Mega system focusing on resonance mapping and system overload visuals",
        tags: ["WebGL", "Mega", "Resonance"],
        url: "demos/active-holographic-systems-mega-demo.html",
        name: "Active Resonance",
        isHeavy: true
      },
      {
        title: "Core Lattice",
        description: "Hypercube core variant tuned for lattice clarity and axis markers",
        tags: ["WebGL", "Core", "Lattice"],
        url: "effects/hypercube-core-framework.html",
        name: "Core Lattice"
      },
      {
        title: "Moire Field",
        description: "Moire hypercube reinterpreted with focus on interference envelopes",
        tags: ["WebGL", "Moire", "Field"],
        url: "effects/mvep-moire-hypercube.html",
        name: "Moire Field"
      },
      {
        title: "Pulse Array",
        description: "Pulse system reconfigured as stacked array for multi-channel output",
        tags: ["WebGL", "Pulse", "Array"],
        url: "effects/holographic-pulse-system.html",
        name: "Pulse Array"
      },
      {
        title: "Matrix Collapse",
        description: "Hyperdimensional matrix pushed to collapse threshold for glitch cascades",
        tags: ["WebGL", "Matrix", "Collapse"],
        url: "effects/insane-hyperdimensional-matrix.html",
        name: "Matrix Collapse"
      },
      {
        title: "Hypercube Audio",
        description: "Working HyperAV variant focusing on audio waveform integration",
        tags: ["WebGL", "Audio", "Hypercube"],
        url: "effects/working-4d-hyperav.html",
        name: "HyperAV Audio"
      }
    ]
  ];

  const twinPolytopThemes = [
    { name: "Aurora Bloom", geometry: "stellated", rotation: [0.25, 0.45, 0.3, 0.55], density: 6.0, colors: [0.5, 0.9, 1.0] },
    { name: "Singularity Drift", geometry: "polychoron", rotation: [0.6, 0.25, 0.5, 0.35], density: 7.8, colors: [0.7, 0.6, 1.0] },
    { name: "Celestial Lattice", geometry: "starcell", rotation: [0.35, 0.6, 0.4, 0.2], density: 9.4, colors: [0.6, 0.85, 1.0] },
    { name: "Spectral Cascade", geometry: "aurora", rotation: [0.55, 0.3, 0.65, 0.4], density: 11.0, colors: [0.8, 0.7, 1.0] },
    { name: "Nebula Circuit", geometry: "quantum", rotation: [0.7, 0.5, 0.25, 0.6], density: 13.2, colors: [0.5, 0.7, 1.0] },
    { name: "Prismatic Flux", geometry: "lumen", rotation: [0.65, 0.7, 0.55, 0.3], density: 16.5, colors: [0.9, 0.6, 1.0] },
    { name: "Eventide Echo", geometry: "nocturne", rotation: [0.75, 0.8, 0.6, 0.7], density: 19.8, colors: [0.7, 0.5, 1.0] }
  ];

  const proper = {
    key: "proper",
    title: "Visual Codex Proper 4D System",
    subtitle: "4D Polytopal Visualizer",
    logPrefix: "Visual Codex Proper 4D System v2.3",
    heavyPreview: {
      label: "⚡ MEGA SYSTEM",
      button: "◆ Launch System",
      description: ["125 WebGL visualizers"]
    },
    contentSets: properContentSets,
    polytopThemes: properPolytopThemes
  };

  const twin = {
    key: "twin",
    title: "Visual Codex Aurora Twin",
    subtitle: "Quantum Harmonic Array",
    logPrefix: "Visual Codex Aurora Twin System",
    heavyPreview: {
      label: "⚙ Automation Artifact",
      button: "◆ Open Resource",
      description: ["Tooling & diagnostics payload"]
    },
    contentSets: twinContentSets,
    polytopThemes: twinPolytopThemes
  };

  window.VISUAL_CODEX_DATA = Object.freeze({ proper, twin });
})();
