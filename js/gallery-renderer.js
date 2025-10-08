(function () {
  "use strict";

class PolytopBackgroundVisualizer {
            constructor(canvas, theme, sectionIndex) {
                this.canvas = canvas;
                this.theme = theme;
                this.sectionIndex = sectionIndex;
                
                // Force WebGL context creation with all possible options
                const contextOptions = {
                    alpha: true,
                    depth: true,
                    stencil: false,
                    antialias: true,
                    premultipliedAlpha: false,
                    preserveDrawingBuffer: false,
                    powerPreference: "default",
                    failIfMajorPerformanceCaveat: false
                };
                
                this.gl = canvas.getContext('webgl', contextOptions) || 
                         canvas.getContext('experimental-webgl', contextOptions) ||
                         canvas.getContext('webkit-3d', contextOptions) ||
                         canvas.getContext('moz-webgl', contextOptions);
                
                if (!this.gl) {
                    console.error(`❌ FORCING WebGL for visualizer ${sectionIndex} - trying alternative approaches`);
                    
                    // Try without options
                    this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                    
                    if (!this.gl) {
                        console.error(`❌ WebGL completely failed for visualizer ${sectionIndex}`);
                        console.error(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
                        console.error(`Canvas parent:`, canvas.parentElement);
                        throw new Error('WebGL not available');
                    }
                }
                
                console.log(`🎯 FORCING WebGL context for visualizer ${sectionIndex}: ${theme.name}`);
                console.log(`  - WebGL version: ${this.gl.getParameter(this.gl.VERSION)}`);
                console.log(`  - Renderer: ${this.gl.getParameter(this.gl.RENDERER)}`);
                console.log(`  - Vendor: ${this.gl.getParameter(this.gl.VENDOR)}`);
                console.log(`  - Canvas: ${canvas.width}x${canvas.height}`);
                
                this.mouseX = 0.5;
                this.mouseY = 0.5;
                this.mouseIntensity = 0.0;
                this.scrollProgress = 0.0;
                this.timeScale = 1.0;
                
                this.startTime = Date.now();
                this.initShaders();
                this.initBuffers();
                this.resize();
                
                console.log(`💎 Polytopal Visualizer ${sectionIndex}: ${theme.name} (${theme.geometry})`);
            }
            
            initShaders() {
                const vertexShaderSource = `
                    attribute vec2 a_position;
                    void main() {
                        gl_Position = vec4(a_position, 0.0, 1.0);
                    }
                `;
                
                const fragmentShaderSource = `
                    precision highp float;
                    
                    uniform vec2 u_resolution;
                    uniform float u_time;
                    uniform vec2 u_mouse;
                    uniform float u_geometry;
                    uniform float u_density;
                    uniform vec4 u_rotation;
                    uniform vec3 u_color;
                    uniform float u_mouseIntensity;
                    uniform float u_scrollProgress;
                    
                    // 4D rotation matrices for polytopal projections
                    mat4 rotateXW(float theta) {
                        float c = cos(theta);
                        float s = sin(theta);
                        return mat4(c, 0, 0, -s, 0, 1, 0, 0, 0, 0, 1, 0, s, 0, 0, c);
                    }
                    
                    mat4 rotateYW(float theta) {
                        float c = cos(theta);
                        float s = sin(theta);
                        return mat4(1, 0, 0, 0, 0, c, 0, -s, 0, 0, 1, 0, 0, s, 0, c);
                    }
                    
                    mat4 rotateZW(float theta) {
                        float c = cos(theta);
                        float s = sin(theta);
                        return mat4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, c, -s, 0, 0, s, c);
                    }
                    
                    mat4 rotateXY(float theta) {
                        float c = cos(theta);
                        float s = sin(theta);
                        return mat4(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
                    }
                    
                    vec3 project4Dto3D(vec4 p) {
                        float w = 2.0 / (2.0 + p.w + u_scrollProgress * 0.5);
                        return vec3(p.x * w, p.y * w, p.z * w);
                    }
                    
                    // Advanced polytopal geometry functions
                    float hypercubeLattice(vec3 p, float gridSize) {
                        vec3 grid = fract(p * gridSize);
                        vec3 edges = 1.0 - smoothstep(0.0, 0.02, abs(grid - 0.5));
                        float corners = length(grid - 0.5);
                        corners = 1.0 - smoothstep(0.0, 0.3, corners);
                        return max(max(max(edges.x, edges.y), edges.z), corners * 0.6);
                    }
                    
                    float octaplexLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        
                        // 8 vertices of octaplex
                        float d1 = length(q - vec3(0.5, 0.0, 0.0));
                        float d2 = length(q - vec3(-0.5, 0.0, 0.0));
                        float d3 = length(q - vec3(0.0, 0.5, 0.0));
                        float d4 = length(q - vec3(0.0, -0.5, 0.0));
                        float d5 = length(q - vec3(0.0, 0.0, 0.5));
                        float d6 = length(q - vec3(0.0, 0.0, -0.5));
                        
                        float minDist = min(min(min(d1, d2), min(d3, d4)), min(d5, d6));
                        return 1.0 - smoothstep(0.0, 0.2, minDist);
                    }
                    
                    float cell16Lattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        
                        // 16-cell vertices (4D cross-polytope projection)
                        float lattice = 0.0;
                        for (int i = 0; i < 4; i++) {
                            float fi = float(i);
                            vec3 vertex = vec3(
                                cos(fi * 1.57) * 0.3,
                                sin(fi * 1.57) * 0.3,
                                cos(fi * 3.14) * 0.2
                            );
                            float dist = length(q - vertex);
                            lattice += exp(-dist * 8.0);
                        }
                        return lattice;
                    }
                    
                    float cell120Lattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        
                        // 120-cell approximation with dodecahedral symmetry
                        float lattice = 0.0;
                        float phi = 1.618033988; // golden ratio
                        
                        // Icosahedral vertices
                        for (int i = 0; i < 12; i++) {
                            float fi = float(i);
                            float angle = fi * 0.5236; // pi/6
                            vec3 vertex = vec3(
                                cos(angle) / phi * 0.4,
                                sin(angle) / phi * 0.4,
                                sin(angle * 2.0) * 0.3
                            );
                            float dist = length(q - vertex);
                            lattice += exp(-dist * 6.0);
                        }
                        return lattice;
                    }
                    
                    float cell600Lattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        
                        // 600-cell approximation (most complex regular polytope)
                        float lattice = 0.0;
                        float phi = 1.618033988;
                        
                        // Complex vertex arrangement
                        for (int i = 0; i < 20; i++) {
                            float fi = float(i);
                            float angle1 = fi * 0.314159; // pi/10
                            float angle2 = fi * 0.628318; // pi/5
                            
                            vec3 vertex = vec3(
                                cos(angle1) * phi * 0.2,
                                sin(angle1) * phi * 0.2,
                                cos(angle2) * 0.3
                            );
                            float dist = length(q - vertex);
                            lattice += exp(-dist * 4.0);
                        }
                        return lattice;
                    }
                    
                    float tesseractLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        
                        // Tesseract (8-cell) vertices - manual calculation
                        float lattice = 0.0;
                        
                        // Calculate 8 cube vertices manually
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3(-0.3, -0.3, -0.3)));
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3( 0.3, -0.3, -0.3)));
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3(-0.3,  0.3, -0.3)));
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3( 0.3,  0.3, -0.3)));
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3(-0.3, -0.3,  0.3)));
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3( 0.3, -0.3,  0.3)));
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3(-0.3,  0.3,  0.3)));
                        lattice += 1.0 - smoothstep(0.0, 0.25, length(q - vec3( 0.3,  0.3,  0.3)));
                        
                        return lattice;
                    }
                    
                    float polytopeLattice(vec3 p, float gridSize) {
                        vec3 q = fract(p * gridSize) - 0.5;
                        
                        // General polytope with complex symmetries
                        float lattice = 0.0;
                        
                        // Multiple symmetry groups
                        for (int i = 0; i < 16; i++) {
                            float fi = float(i);
                            float angle = fi * 0.39269908; // 2*pi/16
                            
                            vec3 vertex = vec3(
                                cos(angle) * 0.4,
                                sin(angle) * 0.4,
                                cos(angle * 3.0) * 0.3
                            );
                            
                            float dist = length(q - vertex);
                            lattice += exp(-dist * 5.0) * (1.0 + cos(fi));
                        }
                        
                        return lattice;
                    }
                    
                    float getPolytopValue(vec3 p, float density, float geomType) {
                        if (geomType < 0.5) return hypercubeLattice(p, density);
                        else if (geomType < 1.5) return octaplexLattice(p, density);
                        else if (geomType < 2.5) return cell16Lattice(p, density);
                        else if (geomType < 3.5) return cell120Lattice(p, density);
                        else if (geomType < 4.5) return cell600Lattice(p, density);
                        else if (geomType < 5.5) return tesseractLattice(p, density);
                        else return polytopeLattice(p, density);
                    }
                    
                    vec3 hsv2rgb(vec3 c) {
                        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
                        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
                        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
                    }
                    
                    void main() {
                        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                        float aspectRatio = u_resolution.x / u_resolution.y;
                        uv.x *= aspectRatio;
                        uv -= 0.5;
                        
                        // Time-based rotation with scroll influence
                        float time = u_time * 0.0005;
                        
                        // Mouse influence on 4D space
                        vec2 mouseOffset = (u_mouse - 0.5) * u_mouseIntensity * 0.5;
                        
                        // 4D space with scroll-influenced depth
                        vec4 p4d = vec4(
                            uv.x + mouseOffset.x, 
                            uv.y + mouseOffset.y,
                            sin(time + u_scrollProgress) * 0.3, 
                            cos(time + u_scrollProgress) * 0.3
                        );
                        
                        // Multi-axis 4D rotations with mathematical grace
                        p4d = rotateXW(time * u_rotation.x + u_scrollProgress * 0.5) * p4d;
                        p4d = rotateYW(time * u_rotation.y + u_mouseIntensity * 0.3) * p4d;
                        p4d = rotateZW(time * u_rotation.z + u_scrollProgress * 0.3) * p4d;
                        p4d = rotateXY(time * u_rotation.w + u_mouseIntensity * 0.2) * p4d;
                        
                        vec3 p = project4Dto3D(p4d);
                        
                        // Scroll-influenced density
                        float density = u_density * (1.0 + u_scrollProgress * 0.5);
                        
                        // Get polytopal value
                        float polytop = getPolytopValue(p, density, u_geometry);
                        
                        // Color based on polytope and interactions
                        float baseHue = atan(u_color.r, u_color.g) + u_scrollProgress * 0.2;
                        float hue = baseHue + u_mouseIntensity * 0.3;
                        float saturation = 0.8 + polytop * 0.2;
                        float brightness = 0.3 + polytop * 0.7 + u_mouseIntensity * 0.2;
                        
                        vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
                        
                        // Mouse interaction glow
                        float mouseDist = length(uv - mouseOffset);
                        float mouseGlow = exp(-mouseDist * 3.0) * u_mouseIntensity * 0.3;
                        color += vec3(mouseGlow) * u_color;
                        
                        gl_FragColor = vec4(color, 0.8);
                    }
                `;
                
                this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
                this.uniforms = {
                    resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
                    time: this.gl.getUniformLocation(this.program, 'u_time'),
                    mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
                    geometry: this.gl.getUniformLocation(this.program, 'u_geometry'),
                    density: this.gl.getUniformLocation(this.program, 'u_density'),
                    rotation: this.gl.getUniformLocation(this.program, 'u_rotation'),
                    color: this.gl.getUniformLocation(this.program, 'u_color'),
                    mouseIntensity: this.gl.getUniformLocation(this.program, 'u_mouseIntensity'),
                    scrollProgress: this.gl.getUniformLocation(this.program, 'u_scrollProgress')
                };
            }
            
            createProgram(vertexSource, fragmentSource) {
                const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
                const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
                
                const program = this.gl.createProgram();
                this.gl.attachShader(program, vertexShader);
                this.gl.attachShader(program, fragmentShader);
                this.gl.linkProgram(program);
                
                if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                    console.error('Program linking failed:', this.gl.getProgramInfoLog(program));
                    return null;
                }
                
                return program;
            }
            
            createShader(type, source) {
                const shader = this.gl.createShader(type);
                this.gl.shaderSource(shader, source);
                this.gl.compileShader(shader);
                
                if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                    console.error('Shader compilation failed:', this.gl.getShaderInfoLog(shader));
                    return null;
                }
                
                return shader;
            }
            
            initBuffers() {
                const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
                
                this.buffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
                
                const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
                this.gl.enableVertexAttribArray(positionLocation);
                this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
            }
            
            resize() {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
                this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }
            
            updateInteraction(mouseX, mouseY, intensity) {
                this.mouseX = mouseX;
                this.mouseY = mouseY;
                this.mouseIntensity = intensity;
            }
            
            updateScroll(scrollProgress) {
                this.scrollProgress = scrollProgress;
            }
            
            setTimeScale(scale) {
                this.timeScale = scale;
            }
            
            render() {
                if (!this.program) return;
                
                this.resize();
                this.gl.useProgram(this.program);
                
                const time = (Date.now() - this.startTime) * (this.timeScale || 1.0);
                
                // Set uniforms
                this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
                this.gl.uniform1f(this.uniforms.time, time);
                this.gl.uniform2f(this.uniforms.mouse, this.mouseX, this.mouseY);
                this.gl.uniform1f(this.uniforms.geometry, this.sectionIndex);
                this.gl.uniform1f(this.uniforms.density, this.theme.density);
                this.gl.uniform4fv(this.uniforms.rotation, new Float32Array(this.theme.rotation));
                this.gl.uniform3fv(this.uniforms.color, new Float32Array(this.theme.colors));
                this.gl.uniform1f(this.uniforms.mouseIntensity, this.mouseIntensity);
                this.gl.uniform1f(this.uniforms.scrollProgress, this.scrollProgress);
                
                this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
            }
        }
        
        // PROPER SYSTEM MANAGER
        class VisualCodexGallery {
            constructor(dataset, options = {}) {
                this.data = dataset || {};
                this.options = options;

                this.contentSets = Array.isArray(this.data.contentSets) ? this.data.contentSets : [];
                this.polytopThemes = Array.isArray(this.data.polytopThemes) ? this.data.polytopThemes : [];
                this.subtitle = this.data.subtitle || '4D Polytopal Visualizer';
                this.navTitle = this.data.title || 'Visual Codex';
                this.logPrefix = this.data.logPrefix || 'Visual Codex System';
                this.tagline = this.data.tagline || this.subtitle;
                this.summary = this.data.summary || '';
                this.callouts = Array.isArray(this.data.callouts) ? this.data.callouts : [];
                this.baseControlDeckStatus = this.subtitle;
                this.heavyPreview = {
                    label: '⚡ MEGA SYSTEM',
                    button: '◆ Launch System',
                    description: ['125 WebGL visualizers'],
                    ...(this.data.heavyPreview || {})
                };
                this.sectionTagSets = this.computeSectionTagSets();
                this.tagIndex = this.buildTagIndex();
                this.searchIndex = this.buildSearchIndex();
                this.metrics = this.computeMetrics();
                this.activeTagFilter = null;
                this.activeSearchQuery = '';
                this.activeSearchDisplayValue = '';
                this.searchResults = [];
                this.searchSectionMatches = new Set();
                this.searchCardMatches = new Map();
                this.searchResultKeySet = new Set();
                this.navSections = [];

                this.sectionSlugs = this.buildSectionSlugs();
                this.sectionSlugMap = this.buildSectionSlugMap(this.sectionSlugs);

                this.storageAvailable = this.checkStorageAvailability();
                this.preferenceKey = this.buildPreferenceKey();
                this.preferences = this.loadPreferences();
                this.rememberViewEnabled = this.preferences.rememberView !== false;
                this.restoringState = false;
                this.initialTagFilter = null;
                this.initialSearchValue = '';
                this.initialDeckOpen = false;
                this.lastFocusedElement = null;
                this.shortcutOverlay = null;

                const initialTarget = this.parseLocationForTarget();

                if (this.rememberViewEnabled) {
                    const storedSection = typeof this.preferences.lastSection === 'number' ? this.preferences.lastSection : null;
                    if (initialTarget.sectionIndex === null && storedSection !== null) {
                        initialTarget.sectionIndex = storedSection;
                    }

                    const storedWafer = typeof this.preferences.lastWafer === 'number' ? this.preferences.lastWafer : null;
                    if (initialTarget.waferIndex === null && storedWafer !== null && storedWafer >= 0 && storedWafer < 3) {
                        initialTarget.waferIndex = storedWafer;
                    }

                    if (typeof this.preferences.lastTag === 'string' && this.preferences.lastTag.trim()) {
                        this.initialTagFilter = this.preferences.lastTag.trim();
                    }

                    if (typeof this.preferences.lastSearch === 'string') {
                        this.initialSearchValue = this.preferences.lastSearch;
                    }
                }

                const resolvedSection = typeof initialTarget.sectionIndex === 'number'
                    ? this.clampSectionIndex(initialTarget.sectionIndex)
                    : 0;

                this.currentSection = resolvedSection;
                this.spotlightWaferIndex = typeof initialTarget.waferIndex === 'number'
                    ? initialTarget.waferIndex
                    : null;

                if (typeof this.spotlightWaferIndex === 'number') {
                    if (this.spotlightWaferIndex < 0 || this.spotlightWaferIndex > 2) {
                        this.spotlightWaferIndex = null;
                    }
                }

                if (this.initialTagFilter && (!this.metrics || !this.metrics.tagCounts || !this.metrics.tagCounts.has(this.initialTagFilter))) {
                    this.initialTagFilter = null;
                }

                if (this.initialTagFilter) {
                    this.activeTagFilter = this.initialTagFilter;
                }

                this.initialSearchValue = typeof this.initialSearchValue === 'string' ? this.initialSearchValue : '';
                this.initialDeckOpen = Boolean(this.preferences.autoOpenDeck) || (this.rememberViewEnabled && Boolean(this.preferences.deckOpen));

                this.scrollMomentum = 0;
                this.isTransitioning = false;
                this.momentumThreshold = options.momentumThreshold ?? 25;
                this.polytopVisualizers = [];
                this.mouseX = 0.5;
                this.mouseY = 0.5;
                this.mouseIntensity = 0.0;
                this.motionMediaQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
                this.reducedMotion = options.forceReducedMotion ?? Boolean(this.motionMediaQuery && this.motionMediaQuery.matches);
                this.webglAvailable = false;
                this.renderLoopId = null;
                this.historyInitialized = false;
                this.suppressHistoryUpdate = false;
                this.shareStatusEl = null;
                this.boundPopStateHandler = this.handlePopState.bind(this);
                this.boundHashChangeHandler = () => this.handlePopState();

                if (this.motionMediaQuery) {
                    const handler = (event) => {
                        this.reducedMotion = event.matches;
                        this.handleMotionPreferenceChange();
                    };

                    if (typeof this.motionMediaQuery.addEventListener === 'function') {
                        this.motionMediaQuery.addEventListener('change', handler);
                    } else if (typeof this.motionMediaQuery.addListener === 'function') {
                        this.motionMediaQuery.addListener(handler);
                    }
                }

                this.initialize();
            }

            initialize() {
                console.log(`💎 Initializing ${this.logPrefix}...`);

                if (this.reducedMotion) {
                    document.body.classList.add('reduced-motion');
                    console.log('♿ Reduced motion preference detected - using CSS-first rendering mode.');
                } else {
                    document.body.classList.remove('reduced-motion');
                }

                this.applyMetadata();
                this.createPolytopBackgrounds();
                this.createCrystalWafers();
                this.createNavigation();
                this.createControlDeck();
                this.setupInteractions();
                this.updateContent();
                this.updateNavigation();
                this.updateUI();

                console.log('✅ System ready - 4D polytopal visualizers with reactive energy borders');
            }

            applyMetadata() {
                const navTitleEl = document.querySelector('.nav-title');
                const navSubtitleEl = document.querySelector('.nav-subtitle');
                if (navTitleEl) navTitleEl.textContent = this.navTitle;
                if (navSubtitleEl) navSubtitleEl.textContent = this.subtitle;
                const subtitleIndicator = document.getElementById('sectionSubtitle');
                if (subtitleIndicator) subtitleIndicator.textContent = this.subtitle;
            }

            buildPreferenceKey() {
                const datasetKey = this.data?.key || document.body?.dataset?.galleryKey || 'dataset';
                return `visualCodex:v2:preferences:${datasetKey}`;
            }

            checkStorageAvailability() {
                try {
                    if (typeof window === 'undefined' || !window.localStorage) {
                        return false;
                    }

                    const testKey = `${this.buildPreferenceKey()}:test`;
                    window.localStorage.setItem(testKey, '1');
                    window.localStorage.removeItem(testKey);
                    return true;
                } catch (error) {
                    console.warn('⚠️ Local storage unavailable for gallery preferences.', error);
                    return false;
                }
            }

            loadPreferences() {
                const defaults = {
                    rememberView: true,
                    autoOpenDeck: false,
                    lastSection: null,
                    lastWafer: null,
                    lastTag: null,
                    lastSearch: '',
                    deckOpen: false
                };

                if (!this.storageAvailable) {
                    return { ...defaults };
                }

                try {
                    const raw = window.localStorage.getItem(this.preferenceKey);
                    if (!raw) {
                        return { ...defaults };
                    }

                    const parsed = JSON.parse(raw);
                    if (!parsed || typeof parsed !== 'object') {
                        return { ...defaults };
                    }

                    return { ...defaults, ...parsed };
                } catch (error) {
                    console.warn('⚠️ Unable to load gallery preferences.', error);
                    return { ...defaults };
                }
            }

            savePreferences(patch = {}, options = {}) {
                const { force = false, skipStorage = false } = options || {};
                const next = { ...this.preferences, ...patch };
                this.preferences = next;

                if ((this.restoringState && !force) || skipStorage || !this.storageAvailable) {
                    return next;
                }

                try {
                    window.localStorage.setItem(this.preferenceKey, JSON.stringify(next));
                } catch (error) {
                    console.warn('⚠️ Unable to persist gallery preferences.', error);
                }

                return next;
            }

            persistViewState() {
                if (!this.rememberViewEnabled) {
                    return;
                }

                const deckOpen = Boolean(this.controlDeck && this.controlDeck.deck && this.controlDeck.deck.classList.contains('open'));
                const searchValue = this.activeSearchDisplayValue || (this.activeSearchQuery ? this.activeSearchQuery : '');

                this.savePreferences({
                    lastSection: this.currentSection,
                    lastWafer: typeof this.spotlightWaferIndex === 'number' ? this.spotlightWaferIndex : null,
                    lastTag: this.activeTagFilter || null,
                    lastSearch: searchValue,
                    deckOpen
                });
            }

            clearRememberedView() {
                this.savePreferences({
                    lastSection: null,
                    lastWafer: null,
                    lastTag: null,
                    lastSearch: '',
                    deckOpen: false
                }, { force: true });
            }

            computeSectionTagSets() {
                if (!Array.isArray(this.contentSets)) {
                    return [];
                }

                return this.contentSets.map((section) => {
                    const tags = new Set();

                    if (Array.isArray(section)) {
                        section.forEach((item) => {
                            if (!item || !Array.isArray(item.tags)) {
                                return;
                            }

                            item.tags.forEach((tag) => {
                                if (typeof tag === 'string' && tag.trim()) {
                                    tags.add(tag.trim());
                                }
                            });
                        });
                    }

                    return tags;
                });
            }

            buildTagIndex() {
                const index = new Map();

                if (!Array.isArray(this.contentSets)) {
                    return index;
                }

                this.contentSets.forEach((section, sectionIndex) => {
                    if (!Array.isArray(section)) {
                        return;
                    }

                    section.forEach((item, cardIndex) => {
                        if (!item) {
                            return;
                        }

                        const tags = Array.isArray(item.tags) ? item.tags : [];
                        tags.forEach((tag) => {
                            if (typeof tag !== 'string' || !tag.trim()) {
                                return;
                            }

                            const normalized = tag.trim();
                            if (!index.has(normalized)) {
                                index.set(normalized, []);
                            }

                            index.get(normalized).push({
                                sectionIndex,
                                cardIndex,
                                title: item.title || item.name || `Entry ${cardIndex + 1}`,
                                url: item.url || '#',
                                description: item.description || ''
                            });
                        });
                    });
                });

                return index;
            }

            buildSearchIndex() {
                const index = [];

                if (!Array.isArray(this.contentSets)) {
                    return index;
                }

                this.contentSets.forEach((section, sectionIndex) => {
                    if (!Array.isArray(section)) {
                        return;
                    }

                    section.forEach((item, cardIndex) => {
                        if (!item) {
                            return;
                        }

                        const title = item.title || item.name || `Entry ${cardIndex + 1}`;
                        const description = item.description || '';
                        const tags = Array.isArray(item.tags) ? item.tags : [];
                        const tagText = tags.join(' ');
                        const searchText = `${title} ${description} ${tagText}`.toLowerCase();

                        index.push({
                            sectionIndex,
                            cardIndex,
                            title,
                            description,
                            tags,
                            url: item.url || '#',
                            searchText
                        });
                    });
                });

                return index;
            }

            buildSectionSlugs() {
                if (!Array.isArray(this.polytopThemes) || !this.polytopThemes.length) {
                    return [];
                }

                const slugs = [];
                const seen = new Map();

                this.polytopThemes.forEach((theme, index) => {
                    const rawValue = (theme && typeof theme.slug === 'string' && theme.slug.trim())
                        ? theme.slug
                        : theme?.name;
                    const baseSlug = this.normalizeSlugValue(rawValue, index);
                    let slug = baseSlug;
                    let attempt = 2;

                    while (seen.has(slug)) {
                        slug = `${baseSlug}-${attempt++}`;
                    }

                    seen.set(slug, true);
                    slugs.push(slug);
                });

                return slugs;
            }

            buildSectionSlugMap(slugs) {
                const map = new Map();

                if (!Array.isArray(slugs)) {
                    return map;
                }

                slugs.forEach((slug, index) => {
                    if (typeof slug === 'string' && slug.trim()) {
                        map.set(slug, index);
                    }
                });

                return map;
            }

            normalizeSlugValue(value, index) {
                if (typeof value === 'string' && value.trim()) {
                    return value
                        .trim()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-+|-+$/g, '') || `section-${index + 1}`;
                }

                return `section-${index + 1}`;
            }

            clampSectionIndex(index) {
                if (typeof index !== 'number' || Number.isNaN(index)) {
                    return 0;
                }

                const maxIndex = Math.max(0, this.polytopThemes.length - 1);
                if (!Number.isFinite(maxIndex)) {
                    return 0;
                }

                return Math.min(Math.max(index, 0), maxIndex);
            }

            parseLocationForTarget(location = window.location) {
                const result = { sectionIndex: null, waferIndex: null };

                if (!location) {
                    return result;
                }

                try {
                    const params = new URLSearchParams(location.search || '');
                    const sectionParam = params.get('section') || params.get('focus');
                    const waferParam = params.get('wafer') || params.get('card');

                    if (sectionParam) {
                        const normalized = this.normalizeSlugValue(sectionParam, 0);
                        if (this.sectionSlugMap && this.sectionSlugMap.has(normalized)) {
                            result.sectionIndex = this.sectionSlugMap.get(normalized);
                        }
                    }

                    if (waferParam) {
                        const waferNumber = parseInt(waferParam, 10);
                        if (!Number.isNaN(waferNumber)) {
                            const zeroIndex = waferNumber - 1;
                            if (zeroIndex >= 0 && zeroIndex < 3) {
                                result.waferIndex = zeroIndex;
                            }
                        }
                    }

                    const hashValue = (location.hash || '').replace(/^#/, '');
                    if (result.sectionIndex === null && hashValue) {
                        const sectionMatch = hashValue.match(/section-([a-z0-9-]+)/i);
                        const extracted = sectionMatch ? sectionMatch[1].toLowerCase() : hashValue.toLowerCase();
                        if (this.sectionSlugMap && this.sectionSlugMap.has(extracted)) {
                            result.sectionIndex = this.sectionSlugMap.get(extracted);
                        }
                    }

                    if (result.waferIndex === null && hashValue) {
                        const waferMatch = hashValue.match(/wafer-(\d+)/i);
                        if (waferMatch) {
                            const zeroIndex = parseInt(waferMatch[1], 10) - 1;
                            if (!Number.isNaN(zeroIndex) && zeroIndex >= 0 && zeroIndex < 3) {
                                result.waferIndex = zeroIndex;
                            }
                        }
                    }
                } catch (error) {
                    console.warn('⚠️ Unable to parse deep link target from location.', error);
                }

                return result;
            }

            computeMetrics() {
                const metrics = {
                    totalSections: Array.isArray(this.contentSets) ? this.contentSets.length : 0,
                    totalEntries: 0,
                    webgl: 0,
                    css: 0,
                    gallery: 0,
                    mobile: 0,
                    tagCounts: new Map(),
                    tagList: []
                };

                if (!Array.isArray(this.contentSets)) {
                    return metrics;
                }

                this.contentSets.forEach((section) => {
                    if (!Array.isArray(section)) {
                        return;
                    }

                    section.forEach((item) => {
                        if (!item) {
                            return;
                        }

                        metrics.totalEntries += 1;

                        const tags = Array.isArray(item.tags) ? item.tags : [];
                        tags.forEach((tag) => {
                            if (typeof tag !== 'string' || !tag.trim()) {
                                return;
                            }

                            const normalized = tag.trim();
                            metrics.tagCounts.set(normalized, (metrics.tagCounts.get(normalized) || 0) + 1);
                        });

                        if (tags.includes('WebGL')) metrics.webgl += 1;
                        if (tags.includes('CSS')) metrics.css += 1;
                        if (tags.includes('Gallery')) metrics.gallery += 1;
                        if (tags.includes('Mobile')) metrics.mobile += 1;
                    });
                });

                metrics.tagList = Array.from(metrics.tagCounts.keys()).sort((a, b) => a.localeCompare(b));
                return metrics;
            }
            
            createPolytopBackgrounds() {
                const container = document.getElementById('polytopBackgrounds');

                if (!this.polytopThemes.length) {
                    console.warn('⚠️ No polytopal themes defined for gallery dataset.');
                    return;
                }

                console.log('🧭 Evaluating rendering capabilities...');
                console.log('  - User Agent:', navigator.userAgent);
                console.log('  - Platform:', navigator.platform);
                console.log('  - Reduced motion:', this.reducedMotion);

                this.webglAvailable = !this.reducedMotion && this.detectWebGL();

                if (this.webglAvailable) {
                    console.log('🚀 WebGL background mode enabled.');
                } else {
                    console.log('🎨 CSS-only background mode enabled (WebGL unavailable or disabled).');
                }

                this.polytopThemes.forEach((theme, index) => {
                    const backgroundDiv = document.createElement('div');
                    backgroundDiv.className = 'polytopal-background';
                    backgroundDiv.id = `polytop-${index}`;

                    if (!this.webglAvailable) {
                        backgroundDiv.classList.add('css-only');
                    }

                    if (this.webglAvailable) {
                        // Try WebGL first
                        const canvas = document.createElement('canvas');
                        canvas.className = 'polytopal-canvas';
                        canvas.id = `polytop-canvas-${index}`;

                        // FORCE proper canvas dimensions
                        canvas.width = window.innerWidth || 1920;
                        canvas.height = window.innerHeight || 1080;
                        canvas.style.width = '100%';
                        canvas.style.height = '100%';
                        canvas.style.display = 'block';
                        
                        backgroundDiv.appendChild(canvas);
                        
                        console.log(`🎯 Canvas ${index} created: ${canvas.width}x${canvas.height}`);

                        // Initialize visualizer array slot
                        this.polytopVisualizers[index] = null;

                        // Create polytopal visualizer after canvas is ready
                        setTimeout(() => {
                            try {
                                const visualizer = new PolytopBackgroundVisualizer(canvas, theme, index);
                                this.polytopVisualizers[index] = visualizer;
                                console.log(`✅ WebGL Visualizer ${index}: ${theme.name}`);
                            } catch (error) {
                                console.log(`🎨 WebGL failed for ${index}, using CSS fallback: ${theme.name}`);
                                this.polytopVisualizers[index] = null;
                                backgroundDiv.classList.add('css-only');
                            }
                        }, index * 100);
                    } else {
                        // Use CSS-only mode
                        this.polytopVisualizers[index] = null;
                        console.log(`🎨 CSS-Only Background ${index}: ${theme.name}`);
                    }
                    
                    container.appendChild(backgroundDiv);
                });
                
                // Activate first background immediately
                setTimeout(() => {
                    this.updatePolytopVisibility();
                }, 500);
            }

            detectWebGL() {
                try {
                    const canvas = document.createElement('canvas');
                    const options = { antialias: true, alpha: true, failIfMajorPerformanceCaveat: true };
                    const gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);

                    if (gl) {
                        const loseContext = gl.getExtension && gl.getExtension('WEBGL_lose_context');
                        if (loseContext) {
                            loseContext.loseContext();
                        }
                        return true;
                    }
                } catch (error) {
                    console.warn('⚠️ WebGL capability check failed:', error);
                }

                return false;
            }
            
            createNavigation() {
                const navSections = document.getElementById('navSections');

                if (!navSections) {
                    return;
                }

                if (!this.polytopThemes.length) {
                    return;
                }

                this.navSections = [];

                this.polytopThemes.forEach((theme, index) => {
                    const section = document.createElement('div');
                    section.className = 'nav-section';
                    const tagSummary = Array.from(this.sectionTagSets[index] || []).slice(0, 3);
                    const tagMarkup = tagSummary.length
                        ? `<div class="nav-section-tags">${tagSummary.join(' • ')}</div>`
                        : '';
                    section.innerHTML = `
                        <div class="nav-section-name">Section ${index + 1}: ${theme.name}</div>
                        <div class="nav-section-info">${theme.geometry} • density: ${theme.density} • 3 cards</div>
                        ${tagMarkup}
                    `;

                    section.dataset.sectionIndex = index;
                    section.addEventListener('click', () => {
                        this.jumpToSection(index);
                    });

                    navSections.appendChild(section);
                    this.navSections.push(section);
                });

                this.updateNavigationTagStates();
            }

            createControlDeck() {
                const deck = document.getElementById('controlDeck');
                const toggle = document.getElementById('controlDeckToggle');
                const panel = document.getElementById('controlDeckPanel');

                if (!deck || !toggle || !panel) {
                    return;
                }

                this.controlDeck = { deck, toggle, panel };

                this.setControlDeckOpen(deck.classList.contains('open'), { skipPersist: true });

                toggle.addEventListener('click', () => {
                    const nextState = !deck.classList.contains('open');
                    this.setControlDeckOpen(nextState);
                });

                this.renderControlDeck();
                this.setupSearchInterface();
                this.setupShareInterface();
                this.setupPreferenceControls();
                this.setupShortcutOverlay();
                this.applyInitialControlDeckState();
            }

            renderControlDeck() {
                const titleEl = document.getElementById('controlDeckTitle');
                if (titleEl) titleEl.textContent = this.navTitle;

                const subtitleEl = document.getElementById('controlDeckSubtitle');
                if (subtitleEl) subtitleEl.textContent = this.tagline;

                const statusEl = document.getElementById('controlDeckStatus');
                if (statusEl) statusEl.textContent = this.baseControlDeckStatus;

                const summaryEl = document.getElementById('controlDeckSummary');
                if (summaryEl) {
                    summaryEl.textContent = this.summary || 'Dataset overview loaded with reactive polytopal metrics.';
                }

                const metricsEl = document.getElementById('controlDeckMetrics');
                if (metricsEl) {
                    const metricData = [
                        { label: 'Sections', value: this.metrics.totalSections },
                        { label: 'Entries', value: this.metrics.totalEntries },
                        { label: 'WebGL', value: this.metrics.webgl },
                        { label: 'CSS', value: this.metrics.css },
                        { label: 'Gallery', value: this.metrics.gallery },
                        { label: 'Unique Tags', value: this.metrics.tagCounts.size }
                    ];

                    metricsEl.innerHTML = metricData.map((metric) => `
                        <div class="control-deck-metric">
                            <div class="control-deck-metric-value">${metric.value}</div>
                            <div class="control-deck-metric-label">${metric.label}</div>
                        </div>
                    `).join('');
                }

                const tagsEl = document.getElementById('controlDeckTags');
                if (tagsEl) {
                    tagsEl.innerHTML = '';
                    this.renderTagChips(tagsEl);
                }

                const calloutsEl = document.getElementById('controlDeckCallouts');
                if (calloutsEl) {
                    if (this.callouts.length) {
                        calloutsEl.innerHTML = this.callouts.map((callout) => `<div class="control-deck-callout">${callout}</div>`).join('');
                    } else {
                        calloutsEl.innerHTML = '<div class="control-deck-callout">No additional callouts supplied for this dataset.</div>';
                    }
                }

                this.updateControlDeckSection();
                this.updateShareControls();
                this.updateTagChipStates();
                this.updateTagFocusList();
                this.updateSearchResults();
                this.updateTagHighlights();
            }

            escapeHtml(value) {
                if (value === null || value === undefined) {
                    return '';
                }

                return String(value)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }

            setupSearchInterface() {
                const searchInput = document.getElementById('controlDeckSearchInput');
                const clearButton = document.getElementById('controlDeckSearchClear');

                if (!searchInput) {
                    return;
                }

                searchInput.addEventListener('input', (event) => {
                    this.handleSearchInput(event.target.value);
                });

                searchInput.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape') {
                        if (this.activeSearchQuery) {
                            event.preventDefault();
                            this.clearSearch();
                        } else {
                            searchInput.blur();
                        }
                    }
                });

                if (clearButton) {
                    clearButton.addEventListener('click', () => {
                        this.clearSearch();
                    });
                    clearButton.disabled = true;
                }
            }

            setupShareInterface() {
                const shareContainer = document.getElementById('controlDeckShare');
                if (!shareContainer) {
                    return;
                }

                this.shareStatusEl = document.getElementById('controlDeckShareStatus') || null;

                shareContainer.addEventListener('click', (event) => {
                    const button = event.target.closest('.control-deck-share-button');
                    if (!button) {
                        return;
                    }

                    if (button.disabled || button.getAttribute('aria-disabled') === 'true') {
                        return;
                    }

                    const target = button.dataset.shareTarget || 'section';
                    this.handleShareAction(target, button);
                });
            }

            setControlDeckOpen(isOpen, options = {}) {
                if (!this.controlDeck) {
                    return false;
                }

                const { deck, toggle, panel } = this.controlDeck;
                const desiredState = Boolean(isOpen);

                deck.classList.toggle('open', desiredState);
                if (toggle) {
                    toggle.setAttribute('aria-expanded', desiredState ? 'true' : 'false');
                }
                if (panel) {
                    panel.setAttribute('aria-hidden', desiredState ? 'false' : 'true');
                }

                this.preferences.deckOpen = desiredState;

                if (options.skipPersist) {
                    return desiredState;
                }

                if (this.rememberViewEnabled) {
                    this.persistViewState();
                } else if (this.preferences.autoOpenDeck) {
                    this.savePreferences({ deckOpen: desiredState }, { force: true });
                } else {
                    this.savePreferences({ deckOpen: desiredState });
                }

                return desiredState;
            }

            setupPreferenceControls() {
                const rememberToggle = document.getElementById('controlDeckRememberToggle');
                if (rememberToggle) {
                    rememberToggle.checked = this.rememberViewEnabled;
                    rememberToggle.setAttribute('aria-checked', this.rememberViewEnabled ? 'true' : 'false');
                    rememberToggle.addEventListener('change', () => {
                        const enabled = Boolean(rememberToggle.checked);
                        rememberToggle.setAttribute('aria-checked', enabled ? 'true' : 'false');
                        this.rememberViewEnabled = enabled;
                        this.savePreferences({ rememberView: enabled }, { force: true });
                        if (!enabled) {
                            this.clearRememberedView();
                        } else {
                            this.persistViewState();
                        }
                    });
                }

                const autoOpenToggle = document.getElementById('controlDeckAutoOpenToggle');
                if (autoOpenToggle) {
                    const autoOpen = Boolean(this.preferences.autoOpenDeck);
                    autoOpenToggle.checked = autoOpen;
                    autoOpenToggle.setAttribute('aria-checked', autoOpen ? 'true' : 'false');
                    autoOpenToggle.addEventListener('change', () => {
                        const enabled = Boolean(autoOpenToggle.checked);
                        autoOpenToggle.setAttribute('aria-checked', enabled ? 'true' : 'false');
                        this.savePreferences({ autoOpenDeck: enabled }, { force: true });
                        if (enabled && this.controlDeck && !this.controlDeck.deck.classList.contains('open')) {
                            this.setControlDeckOpen(true);
                        }
                    });
                }

                const helpButton = document.getElementById('controlDeckHelpButton');
                if (helpButton) {
                    helpButton.addEventListener('click', () => {
                        this.showShortcutOverlay();
                    });
                }
            }

            setupShortcutOverlay() {
                const overlay = document.getElementById('shortcutOverlay');
                if (!overlay) {
                    return;
                }

                const panel = overlay.querySelector('.shortcut-overlay-panel');
                const closeButton = document.getElementById('shortcutOverlayClose');
                const backdrop = document.getElementById('shortcutOverlayBackdrop');

                if (panel && !panel.hasAttribute('tabindex')) {
                    panel.setAttribute('tabindex', '-1');
                }

                this.shortcutOverlay = {
                    overlay,
                    panel,
                    closeButton,
                    backdrop,
                    focusables: []
                };

                const handleClose = () => {
                    this.hideShortcutOverlay();
                };

                if (closeButton) {
                    closeButton.addEventListener('click', handleClose);
                }

                if (backdrop) {
                    backdrop.addEventListener('click', handleClose);
                }

                overlay.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        this.hideShortcutOverlay();
                        return;
                    }

                    if (event.key === 'Tab' && this.shortcutOverlay && this.shortcutOverlay.focusables.length) {
                        const focusables = this.shortcutOverlay.focusables;
                        const first = focusables[0];
                        const last = focusables[focusables.length - 1];
                        const active = document.activeElement;

                        if (event.shiftKey) {
                            if (active === first || !focusables.includes(active)) {
                                event.preventDefault();
                                last.focus();
                            }
                        } else if (active === last || !focusables.includes(active)) {
                            event.preventDefault();
                            first.focus();
                        }
                    }
                });
            }

            applyInitialControlDeckState() {
                if (!this.controlDeck) {
                    return;
                }

                this.restoringState = true;

                try {
                    if (this.initialDeckOpen) {
                        this.setControlDeckOpen(true, { skipPersist: true });
                    }

                    if (typeof this.initialSearchValue === 'string' && this.initialSearchValue.trim()) {
                        const searchInput = document.getElementById('controlDeckSearchInput');
                        if (searchInput) {
                            searchInput.value = this.initialSearchValue;
                        }
                        this.handleSearchInput(this.initialSearchValue);
                    }
                } finally {
                    this.restoringState = false;
                }

                if (this.rememberViewEnabled) {
                    this.persistViewState();
                }
            }

            isShortcutOverlayVisible() {
                return Boolean(this.shortcutOverlay && this.shortcutOverlay.overlay && this.shortcutOverlay.overlay.classList.contains('is-visible'));
            }

            showShortcutOverlay() {
                if (!this.shortcutOverlay || !this.shortcutOverlay.overlay) {
                    return;
                }

                const { overlay, panel, closeButton } = this.shortcutOverlay;
                overlay.classList.add('is-visible');
                overlay.setAttribute('aria-hidden', 'false');
                document.body.classList.add('shortcut-overlay-open');

                const focusSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
                let focusables = [];
                if (panel) {
                    focusables = Array.from(panel.querySelectorAll(focusSelectors));
                    focusables = focusables.filter((el) => {
                        if (!el) return false;
                        if (el.hasAttribute('disabled')) return false;
                        if (el.getAttribute('aria-hidden') === 'true') return false;
                        const rects = el.getClientRects();
                        return rects && rects.length > 0;
                    });
                }

                if (closeButton && !focusables.includes(closeButton)) {
                    focusables.unshift(closeButton);
                }

                this.shortcutOverlay.focusables = focusables;
                this.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

                const focusTarget = focusables.length ? focusables[0] : panel;
                if (focusTarget && typeof focusTarget.focus === 'function') {
                    window.requestAnimationFrame(() => {
                        focusTarget.focus();
                    });
                }
            }

            hideShortcutOverlay() {
                if (!this.shortcutOverlay || !this.shortcutOverlay.overlay) {
                    return;
                }

                const { overlay } = this.shortcutOverlay;
                overlay.classList.remove('is-visible');
                overlay.setAttribute('aria-hidden', 'true');
                document.body.classList.remove('shortcut-overlay-open');
                this.shortcutOverlay.focusables = [];

                const restoreTarget = this.lastFocusedElement;
                this.lastFocusedElement = null;

                if (restoreTarget && typeof restoreTarget.focus === 'function') {
                    window.requestAnimationFrame(() => {
                        restoreTarget.focus();
                    });
                }
            }

            toggleShortcutOverlay(force) {
                const shouldShow = typeof force === 'boolean' ? force : !this.isShortcutOverlayVisible();
                if (shouldShow) {
                    this.showShortcutOverlay();
                } else {
                    this.hideShortcutOverlay();
                }
            }

            async handleShareAction(target, button) {
                const sectionIndex = this.currentSection;
                let waferIndex = null;

                if (typeof target === 'string' && target.startsWith('wafer-')) {
                    const parsed = parseInt(target.replace('wafer-', ''), 10);
                    if (!Number.isNaN(parsed) && parsed >= 0 && parsed < 3) {
                        waferIndex = parsed;
                    }
                }

                if (waferIndex !== null) {
                    this.setSpotlight(waferIndex, { replace: true });
                } else {
                    this.setSpotlight(null, { replace: true });
                }

                const shareUrl = this.buildShareUrl(sectionIndex, waferIndex);
                const label = (button?.dataset?.shareLabel || button?.textContent || '').trim() || (waferIndex !== null
                    ? `Card ${waferIndex + 1}`
                    : `Section ${sectionIndex + 1}`);

                try {
                    await this.copyTextToClipboard(shareUrl);
                    this.announceShareStatus(`Copied link for ${label}.`);
                } catch (error) {
                    console.warn('⚠️ Unable to copy share link.', error);
                    this.announceShareStatus('Copy failed. Use browser share controls.', true);
                }
            }

            updateShareControls() {
                const shareContainer = document.getElementById('controlDeckShare');
                if (!shareContainer) {
                    return;
                }

                const sectionButton = shareContainer.querySelector('[data-share-target="section"]');
                const theme = this.polytopThemes[this.currentSection];
                const sectionLabel = theme?.name || `Section ${this.currentSection + 1}`;

                if (sectionButton) {
                    sectionButton.textContent = `Copy ${sectionLabel} Link`;
                    sectionButton.dataset.shareLabel = `${sectionLabel} section`;
                    sectionButton.disabled = false;
                    sectionButton.setAttribute('aria-disabled', 'false');
                }

                const currentSet = this.contentSets[this.currentSection] || [];
                for (let i = 0; i < 3; i++) {
                    const button = shareContainer.querySelector(`[data-share-target="wafer-${i}"]`);
                    if (!button) {
                        continue;
                    }

                    const card = currentSet[i];
                    if (card) {
                        const cardTitle = card.title || card.name || `Card ${i + 1}`;
                        button.textContent = `Copy ${cardTitle} Link`;
                        button.dataset.shareLabel = `${cardTitle} card`;
                        button.disabled = false;
                        button.setAttribute('aria-disabled', 'false');
                    } else {
                        button.textContent = `Card ${i + 1} unavailable`;
                        button.dataset.shareLabel = `Card ${i + 1}`;
                        button.disabled = true;
                        button.setAttribute('aria-disabled', 'true');
                    }
                }

                if (this.shareStatusEl) {
                    this.shareStatusEl.textContent = '';
                    this.shareStatusEl.classList.remove('error');
                }
            }

            buildShareUrl(sectionIndex, waferIndex) {
                const safeSection = this.clampSectionIndex(sectionIndex);
                const url = new URL(window.location.href);
                const datasetKey = this.data?.key || document.body?.dataset?.galleryKey || null;

                if (datasetKey) {
                    url.searchParams.set('gallery', datasetKey);
                }

                const slug = this.sectionSlugs[safeSection];
                if (slug) {
                    url.searchParams.set('section', slug);
                    url.hash = `section-${slug}`;
                } else {
                    url.searchParams.delete('section');
                    if (url.hash) {
                        url.hash = '';
                    }
                }

                if (typeof waferIndex === 'number' && waferIndex >= 0 && waferIndex < 3) {
                    url.searchParams.set('wafer', String(waferIndex + 1));
                } else {
                    url.searchParams.delete('wafer');
                }

                url.searchParams.delete('focus');
                url.searchParams.delete('card');

                return url.toString();
            }

            async copyTextToClipboard(value) {
                if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                    await navigator.clipboard.writeText(value);
                    return;
                }

                const textarea = document.createElement('textarea');
                textarea.value = value;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'absolute';
                textarea.style.left = '-9999px';
                document.body.appendChild(textarea);

                const selection = document.getSelection();
                const savedRange = selection && selection.rangeCount ? selection.getRangeAt(0) : null;

                textarea.select();
                textarea.setSelectionRange(0, textarea.value.length);

                const successful = document.execCommand ? document.execCommand('copy') : false;
                document.body.removeChild(textarea);

                if (savedRange && selection) {
                    selection.removeAllRanges();
                    selection.addRange(savedRange);
                }

                if (!successful) {
                    throw new Error('Copy command was unsuccessful');
                }
            }

            announceShareStatus(message, isError = false) {
                if (!this.shareStatusEl) {
                    return;
                }

                this.shareStatusEl.textContent = message;
                this.shareStatusEl.classList.toggle('error', Boolean(isError));
            }

            handleSearchInput(value) {
                const rawQuery = typeof value === 'string' ? value.trim() : '';
                const normalized = rawQuery.toLowerCase();
                const meetsThreshold = normalized.length >= 2;
                this.activeSearchDisplayValue = meetsThreshold ? rawQuery : '';
                this.activeSearchQuery = meetsThreshold ? normalized : '';

                this.searchResults = [];
                this.searchSectionMatches = new Set();
                this.searchCardMatches = new Map();
                this.searchResultKeySet = new Set();

                if (this.activeSearchQuery) {
                    this.searchResults = this.searchIndex.filter((entry) => entry.searchText.includes(this.activeSearchQuery));

                    this.searchResults.forEach((entry) => {
                        this.searchSectionMatches.add(entry.sectionIndex);
                        if (!this.searchCardMatches.has(entry.sectionIndex)) {
                            this.searchCardMatches.set(entry.sectionIndex, new Set());
                        }
                        this.searchCardMatches.get(entry.sectionIndex).add(entry.cardIndex);
                        this.searchResultKeySet.add(`${entry.sectionIndex}:${entry.cardIndex}`);
                    });
                }

                const clearButton = document.getElementById('controlDeckSearchClear');
                if (clearButton) {
                    clearButton.disabled = !this.activeSearchQuery;
                }

                this.updateSearchResults();
                this.updateTagChipStates();
                this.updateTagFocusList();
                this.updateTagHighlights();
                this.persistViewState();
            }

            clearSearch() {
                if (!this.activeSearchQuery) {
                    return;
                }

                const searchInput = document.getElementById('controlDeckSearchInput');
                if (searchInput) {
                    searchInput.value = '';
                }

                this.handleSearchInput('');
            }

            updateSearchResults() {
                const resultsEl = document.getElementById('controlDeckSearchResults');
                if (!resultsEl) {
                    return;
                }

                resultsEl.classList.remove('empty');

                if (!this.activeSearchQuery) {
                    resultsEl.classList.add('empty');
                    resultsEl.innerHTML = '<div class="control-deck-search-placeholder">Search across demos, tags, and sections.</div>';
                    return;
                }

                const totalResults = this.searchResults.length;
                const hasTagFilter = Boolean(this.activeTagFilter);
                const filteredResults = hasTagFilter
                    ? this.searchResults.filter((entry) => Array.isArray(entry.tags) && entry.tags.includes(this.activeTagFilter))
                    : this.searchResults;

                if (!totalResults) {
                    resultsEl.classList.add('empty');
                    const searchLabel = this.activeSearchDisplayValue || this.activeSearchQuery;
                    const safeQuery = this.escapeHtml(searchLabel);
                    resultsEl.innerHTML = `<div class="control-deck-search-placeholder">No matches for “${safeQuery}”. Try another keyword.</div>`;
                    return;
                }

                if (!filteredResults.length) {
                    resultsEl.classList.add('empty');
                    const searchLabel = this.activeSearchDisplayValue || this.activeSearchQuery;
                    const safeQuery = this.escapeHtml(searchLabel);
                    const safeTag = this.escapeHtml(this.activeTagFilter);
                    resultsEl.innerHTML = `<div class="control-deck-search-placeholder">No matches for “${safeQuery}” with the ${safeTag} tag filter.</div>`;
                    return;
                }

                const maxResults = 6;
                const rendered = filteredResults.slice(0, maxResults).map((entry) => {
                    const sectionName = this.polytopThemes[entry.sectionIndex]?.name || `Section ${entry.sectionIndex + 1}`;
                    const tags = entry.tags && entry.tags.length ? entry.tags.join(', ') : 'Untagged';
                    const isCurrent = entry.sectionIndex === this.currentSection;
                    const classNames = ['control-deck-search-item'];
                    if (isCurrent) {
                        classNames.push('current-section');
                    }

                    const safeUrl = this.escapeHtml(entry.url || '#');
                    const safeTitle = this.escapeHtml(entry.title);
                    const safeSection = this.escapeHtml(sectionName);
                    const safeTags = this.escapeHtml(tags);

                    return `
                        <div class="${classNames.join(' ')}">
                            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>
                            <div class="control-deck-search-meta">Section ${entry.sectionIndex + 1} • ${safeSection}</div>
                            <div class="control-deck-search-tags">${safeTags}</div>
                        </div>
                    `;
                }).join('');

                const remainder = filteredResults.length - maxResults;
                const remainderNote = remainder > 0 ? `<div class="control-deck-search-more">+${remainder} more results</div>` : '';

                resultsEl.innerHTML = rendered + remainderNote;
            }

            renderTagChips(container) {
                if (!this.metrics.tagList.length) {
                    const placeholder = document.createElement('span');
                    placeholder.className = 'control-tag-chip reset';
                    placeholder.textContent = 'No tags available';
                    placeholder.setAttribute('aria-disabled', 'true');
                    placeholder.tabIndex = -1;
                    container.appendChild(placeholder);
                    return;
                }

                this.metrics.tagList.forEach((tag) => {
                    const chip = document.createElement('button');
                    chip.type = 'button';
                    chip.className = 'control-tag-chip';
                    chip.dataset.tag = tag;
                    const count = this.metrics.tagCounts.get(tag) || 0;
                    chip.textContent = `${tag} (${count})`;
                    chip.addEventListener('click', () => {
                        this.toggleTagFilter(tag);
                    });
                    container.appendChild(chip);
                });

                const resetChip = document.createElement('button');
                resetChip.type = 'button';
                resetChip.className = 'control-tag-chip reset';
                resetChip.dataset.reset = 'true';
                resetChip.textContent = 'Reset';
                resetChip.addEventListener('click', () => {
                    this.clearTagFilter();
                });
                container.appendChild(resetChip);
            }

            toggleTagFilter(tag) {
                if (this.activeTagFilter === tag) {
                    this.activeTagFilter = null;
                } else {
                    this.activeTagFilter = tag;
                }

                this.updateTagChipStates();
                this.updateTagFocusList();
                this.updateSearchResults();
                this.updateTagHighlights();
                this.persistViewState();
            }

            clearTagFilter() {
                if (!this.activeTagFilter) {
                    return;
                }

                this.activeTagFilter = null;
                this.updateTagChipStates();
                this.updateTagFocusList();
                this.updateSearchResults();
                this.updateTagHighlights();
                this.persistViewState();
            }

            updateTagChipStates() {
                const tagsEl = document.getElementById('controlDeckTags');
                if (!tagsEl) {
                    return;
                }

                tagsEl.querySelectorAll('.control-tag-chip[data-tag]').forEach((chip) => {
                    const isActive = this.activeTagFilter === chip.dataset.tag;
                    chip.classList.toggle('active', isActive);
                    chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                });

                const resetChip = tagsEl.querySelector('.control-tag-chip.reset');
                if (resetChip) {
                    resetChip.disabled = !this.activeTagFilter;
                }

                const statusEl = document.getElementById('controlDeckStatus');
                if (statusEl) {
                    if (this.activeSearchQuery) {
                        const displayQuery = this.activeSearchDisplayValue || this.activeSearchQuery;
                        statusEl.textContent = `Search • ${displayQuery}`;
                    } else if (this.activeTagFilter) {
                        statusEl.textContent = `Tag • ${this.activeTagFilter}`;
                    } else {
                        statusEl.textContent = this.baseControlDeckStatus;
                    }
                }
            }

            updateTagFocusList() {
                const focusEl = document.getElementById('controlDeckFocus');
                if (!focusEl) {
                    return;
                }

                if (!this.activeTagFilter) {
                    focusEl.classList.add('empty');
                    if (this.activeSearchQuery) {
                        focusEl.innerHTML = 'Search results are listed above. Select a tag to inspect coverage intersections.';
                    } else {
                        focusEl.innerHTML = 'Select a tag to inspect dataset coverage.';
                    }
                    return;
                }

                let entries = this.tagIndex.get(this.activeTagFilter) || [];
                if (this.activeSearchQuery && this.searchResultKeySet.size) {
                    entries = entries.filter((entry) => this.searchResultKeySet.has(`${entry.sectionIndex}:${entry.cardIndex}`));
                }
                if (!entries.length) {
                    focusEl.classList.add('empty');
                    const safeTagName = this.escapeHtml(this.activeTagFilter);
                    focusEl.innerHTML = `No entries mapped to ${safeTagName}.`;
                    return;
                }

                focusEl.classList.remove('empty');
                const listItems = entries.map((entry) => {
                    const sectionName = this.polytopThemes[entry.sectionIndex]?.name || `Section ${entry.sectionIndex + 1}`;
                    const isCurrent = entry.sectionIndex === this.currentSection;
                    const itemClass = isCurrent ? 'control-deck-focus-item current-section' : 'control-deck-focus-item';
                    const safeUrl = this.escapeHtml(entry.url || '#');
                    const safeTitle = this.escapeHtml(entry.title);
                    const safeSection = this.escapeHtml(sectionName);
                    return `
                        <div class="${itemClass}">
                            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>
                            <div class="control-deck-focus-meta">Section ${entry.sectionIndex + 1} • ${safeSection}</div>
                        </div>
                    `;
                }).join('');

                const safeTag = this.escapeHtml(this.activeTagFilter);
                focusEl.innerHTML = `
                    <div class="control-deck-focus-title">${safeTag} — ${entries.length} items</div>
                    <div class="control-deck-focus-list">${listItems}</div>
                `;
            }

            updateTagHighlights() {
                this.updateNavigationTagStates();
                this.updateWaferHighlighting();
            }

            updateNavigationTagStates() {
                const hasTagFilter = Boolean(this.activeTagFilter);
                const hasSearch = Boolean(this.activeSearchQuery);
                const hasFilter = hasTagFilter || hasSearch;
                const sections = this.navSections.length ? this.navSections : Array.from(document.querySelectorAll('.nav-section'));

                sections.forEach((section) => {
                    const index = Number(section.dataset.sectionIndex || -1);
                    const tags = this.sectionTagSets[index] || new Set();
                    const tagMatch = !hasTagFilter || tags.has(this.activeTagFilter);
                    const searchMatch = !hasSearch || this.searchSectionMatches.has(index);
                    const finalMatch = hasFilter ? (tagMatch && searchMatch) : true;

                    section.classList.toggle('tag-match', hasTagFilter && finalMatch);
                    section.classList.toggle('tag-muted', hasTagFilter && hasFilter && !finalMatch);

                    if (hasTagFilter) {
                        section.setAttribute('data-tag-match', finalMatch ? 'true' : 'false');
                    } else {
                        section.removeAttribute('data-tag-match');
                    }

                    section.classList.toggle('search-match', hasSearch && finalMatch);
                    section.classList.toggle('search-muted', hasSearch && hasFilter && !finalMatch);

                    if (hasFilter) {
                        section.setAttribute('data-filter-match', finalMatch ? 'true' : 'false');
                    } else {
                        section.removeAttribute('data-filter-match');
                    }
                });
            }

            updateControlDeckSection() {
                const sectionValue = document.getElementById('controlDeckSectionValue');
                if (!sectionValue) {
                    return;
                }

                const theme = this.polytopThemes[this.currentSection];
                if (theme) {
                    sectionValue.textContent = `${this.currentSection + 1} · ${theme.name}`;
                } else {
                    sectionValue.textContent = `Section ${this.currentSection + 1}`;
                }
            }

            updateWaferHighlighting() {
                const hasTagFilter = Boolean(this.activeTagFilter);
                const hasSearch = Boolean(this.activeSearchQuery);
                const hasFilter = hasTagFilter || hasSearch;
                const currentSet = this.contentSets[this.currentSection] || [];
                const searchMatches = this.searchCardMatches.get(this.currentSection) || new Set();

                for (let i = 0; i < 3; i++) {
                    const wafer = document.getElementById(`crystal-wafer-${i}`);
                    if (!wafer) {
                        continue;
                    }

                    wafer.classList.remove('tag-match', 'tag-muted', 'search-match');

                    if (!hasFilter) {
                        continue;
                    }

                    const content = currentSet[i];
                    const tagMatch = !hasTagFilter || (content && Array.isArray(content.tags) && content.tags.includes(this.activeTagFilter));
                    const searchMatch = !hasSearch || searchMatches.has(i);
                    const finalMatch = tagMatch && searchMatch;

                    if (finalMatch) {
                        if (hasTagFilter) {
                            wafer.classList.add('tag-match');
                        }
                        if (hasSearch) {
                            wafer.classList.add('search-match');
                        }
                    } else {
                        wafer.classList.add('tag-muted');
                    }
                }
            }

            setSpotlight(index, options = {}) {
                let resolvedIndex = typeof index === 'number' ? index : null;
                const currentSet = this.contentSets[this.currentSection] || [];

                if (resolvedIndex !== null) {
                    if (resolvedIndex < 0 || resolvedIndex >= currentSet.length) {
                        resolvedIndex = null;
                    }
                }

                this.spotlightWaferIndex = resolvedIndex;

                if (!options.deferRefresh) {
                    this.refreshSpotlight();
                }

                const shouldUpdateHistory = options.updateHistory !== false;
                const replace = options.replace !== undefined ? options.replace : true;

                if (shouldUpdateHistory) {
                    this.updateLocationState({
                        sectionIndex: this.currentSection,
                        waferIndex: resolvedIndex,
                        replace
                    });
                }

                this.persistViewState();
            }

            refreshSpotlight() {
                for (let i = 0; i < 3; i++) {
                    const wafer = document.getElementById(`crystal-wafer-${i}`);
                    if (!wafer) {
                        continue;
                    }

                    const isSpotlight = this.spotlightWaferIndex === i;
                    wafer.classList.toggle('spotlight', isSpotlight);

                    if (isSpotlight) {
                        wafer.setAttribute('data-spotlight', 'true');
                    } else {
                        wafer.removeAttribute('data-spotlight');
                    }
                }
            }

            updateLocationState(options = {}) {
                if (this.suppressHistoryUpdate) {
                    return;
                }

                if (!window || !window.history || typeof window.history.replaceState !== 'function') {
                    return;
                }

                try {
                    const url = new URL(window.location.href);
                    const datasetKey = this.data?.key || document.body?.dataset?.galleryKey || null;

                    if (datasetKey) {
                        url.searchParams.set('gallery', datasetKey);
                    }

                    const sectionIndex = typeof options.sectionIndex === 'number'
                        ? this.clampSectionIndex(options.sectionIndex)
                        : this.currentSection;

                    const slug = this.sectionSlugs[sectionIndex];
                    if (slug) {
                        url.searchParams.set('section', slug);
                        url.hash = `section-${slug}`;
                    } else {
                        url.searchParams.delete('section');
                        if (url.hash) {
                            url.hash = '';
                        }
                    }

                    let waferIndex;
                    if (Object.prototype.hasOwnProperty.call(options, 'waferIndex')) {
                        waferIndex = typeof options.waferIndex === 'number' && options.waferIndex >= 0 && options.waferIndex < 3
                            ? options.waferIndex
                            : null;
                    } else {
                        waferIndex = typeof this.spotlightWaferIndex === 'number' && this.spotlightWaferIndex >= 0 && this.spotlightWaferIndex < 3
                            ? this.spotlightWaferIndex
                            : null;
                    }

                    if (waferIndex !== null) {
                        url.searchParams.set('wafer', String(waferIndex + 1));
                    } else {
                        url.searchParams.delete('wafer');
                    }

                    url.searchParams.delete('focus');
                    url.searchParams.delete('card');

                    const state = {
                        sectionSlug: slug || null,
                        waferIndex: waferIndex !== null ? waferIndex : null
                    };

                    const shouldReplace = options.replace === true || !this.historyInitialized;
                    const targetUrl = `${url.pathname}${url.search}${url.hash}`;

                    if (shouldReplace) {
                        window.history.replaceState(state, '', targetUrl);
                        this.historyInitialized = true;
                    } else if (typeof window.history.pushState === 'function') {
                        window.history.pushState(state, '', targetUrl);
                    }
                } catch (error) {
                    console.warn('⚠️ Unable to update history state for deep link.', error);
                }
            }

            handlePopState(event) {
                const state = event && event.state ? event.state : {};
                let targetSection = null;
                let waferIndex = null;

                if (state.sectionSlug && this.sectionSlugMap && this.sectionSlugMap.has(state.sectionSlug)) {
                    targetSection = this.sectionSlugMap.get(state.sectionSlug);
                }

                if (typeof state.waferIndex === 'number') {
                    waferIndex = state.waferIndex;
                }

                if (targetSection === null || waferIndex === null) {
                    const parsed = this.parseLocationForTarget();
                    if (targetSection === null) {
                        targetSection = parsed.sectionIndex;
                    }
                    if (waferIndex === null) {
                        waferIndex = parsed.waferIndex;
                    }
                }

                const sectionIsValid = typeof targetSection === 'number' && !Number.isNaN(targetSection);
                const waferIsValid = typeof waferIndex === 'number' && waferIndex >= 0 && waferIndex < 3;

                if (sectionIsValid && targetSection !== this.currentSection) {
                    this.suppressHistoryUpdate = true;
                    this.jumpToSection(targetSection);

                    setTimeout(() => {
                        this.suppressHistoryUpdate = false;
                        if (waferIsValid) {
                            this.setSpotlight(waferIndex, { updateHistory: false, replace: true });
                        } else {
                            this.setSpotlight(null, { updateHistory: false, replace: true });
                        }
                    }, 1100);
                } else {
                    if (waferIsValid) {
                        this.setSpotlight(waferIndex, { updateHistory: false, replace: true });
                    } else {
                        this.setSpotlight(null, { updateHistory: false, replace: true });
                    }
                }
            }

            setupInteractions() {
                // Navigation toggle
                const navToggle = document.getElementById('navToggle');
                const navContainer = document.getElementById('navContainer');

                if (this.reducedMotion) {
                    document.body.classList.add('reduced-motion');
                }

                navToggle.addEventListener('click', () => {
                    navToggle.classList.toggle('open');
                    navContainer.classList.toggle('open');
                });

                // Close nav when clicking outside
                document.addEventListener('click', (e) => {
                    if (!navContainer.contains(e.target) && !navToggle.contains(e.target)) {
                        navToggle.classList.remove('open');
                        navContainer.classList.remove('open');
                    }
                });
                
                // Mouse tracking for reactive effects
                if (!this.reducedMotion) {
                    document.addEventListener('mousemove', (e) => {
                        this.mouseX = e.clientX / window.innerWidth;
                        this.mouseY = 1.0 - (e.clientY / window.innerHeight);
                        this.mouseIntensity = Math.min(1.0, Math.sqrt(e.movementX*e.movementX + e.movementY*e.movementY) / 50);

                        // Update all visualizers
                        this.polytopVisualizers.forEach(viz => {
                            if (viz) viz.updateInteraction(this.mouseX, this.mouseY, this.mouseIntensity);
                        });
                    });
                }

                // Scroll physics
                this.setupScrollPhysics();

                // Click reactions
                this.setupClickReactions();

                // Keyboard shortcuts
                this.setupKeyboardShortcuts();

                if (this.boundPopStateHandler) {
                    window.addEventListener('popstate', this.boundPopStateHandler);
                }

                if (this.boundHashChangeHandler) {
                    window.addEventListener('hashchange', this.boundHashChangeHandler);
                }
            }
            
            setupScrollPhysics() {
                const isMobile = window.innerWidth <= 768;
                const simplifiedScroll = isMobile || this.reducedMotion;

                if (simplifiedScroll) {
                    const snapType = this.reducedMotion ? 'y proximity' : 'y mandatory';
                    const modeLabel = this.reducedMotion ? '♿ Reduced motion scroll mode enabled' : '📱 Mobile scroll snap enabled';
                    console.log(modeLabel);
                    document.body.style.overflowY = 'auto';
                    document.body.style.scrollSnapType = snapType;

                    // Simple touch-friendly transitions
                    let scrollTimeout;
                    window.addEventListener('scroll', () => {
                        clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(() => {
                            // Basic section detection for simplified mode
                            const scrollableHeight = Math.max(1, document.body.scrollHeight - window.innerHeight);
                            const scrollPercent = window.scrollY / scrollableHeight;
                            const maxIndex = Math.max(0, this.polytopThemes.length - 1);
                            const newSection = Math.round(scrollPercent * maxIndex);
                            if (newSection !== this.currentSection && newSection >= 0 && newSection <= maxIndex) {
                                this.currentSection = newSection;
                                this.updatePolytopVisibility();
                                this.updateUI();
                            }
                        }, 100);
                    });

                    return;
                }
                
                // Desktop: Original momentum system
                let momentumDecay;
                
                console.log('🌀 Desktop tactile scroll physics initialized - threshold:', this.momentumThreshold);
                
                window.addEventListener('wheel', (e) => {
                    e.preventDefault();
                    
                    if (this.isTransitioning) return;
                    
                    // Build momentum - slower accumulation for proper threshold feel
                    const delta = Math.abs(e.deltaY);
                    this.scrollMomentum += delta * 0.25; // Reduced from 0.4 to build slower
                    this.scrollMomentum = Math.min(this.scrollMomentum, 100);
                    
                    // Update scroll progress for visualizers
                    const scrollProgress = this.scrollMomentum / 100;
                    this.polytopVisualizers.forEach(viz => {
                        if (viz) viz.updateScroll(scrollProgress);
                    });
                    
                    // Update card momentum effects as it builds
                    this.updateCardMomentumEffects();
                    
                    // Show momentum indicator
                    this.showMomentumIndicator();
                    
                    // Clear previous decay
                    clearTimeout(momentumDecay);
                    
                    // Debug tactile scroll behavior
                    if (this.scrollMomentum > 15) {
                        console.log(`⚡ Building momentum: ${this.scrollMomentum.toFixed(1)}/${this.momentumThreshold} - cards anticipating`);
                    }
                    
                    // Check for transition threshold - only trigger at 25, not before
                    if (this.scrollMomentum >= this.momentumThreshold) {
                        console.log(`🚀 THRESHOLD REACHED! Triggering transition at ${this.scrollMomentum.toFixed(1)}`);
                        this.triggerTransition(e.deltaY > 0 ? 1 : -1);
                    } else {
                        // Set momentum decay - longer delay to allow building
                        momentumDecay = setTimeout(() => {
                            this.decayMomentum();
                        }, 200); // Increased from 150ms
                    }
                }, { passive: false });
            }
            
            setupClickReactions() {
                document.addEventListener('click', (e) => {
                    // Site-wide reaction
                    this.triggerSiteReaction(e.clientX, e.clientY);

                    // Check if click was on a card
                    const card = e.target.closest('.crystal-wafer');
                    if (card) {
                        card.classList.add('clicked');
                        setTimeout(() => {
                            card.classList.remove('clicked');
                        }, 600);

                        // Check if click was on preview
                        const preview = e.target.closest('.wafer-preview');
                        if (preview) {
                            preview.classList.add('clicked');
                            setTimeout(() => {
                                preview.classList.remove('clicked');
                            }, 400);
                        }
                    }
                });
            }

            setupKeyboardShortcuts() {
                document.addEventListener('keydown', (event) => {
                    const overlayVisible = this.isShortcutOverlayVisible();
                    const isQuestionKey = event.key === '?' || (event.key === '/' && event.shiftKey);

                    if (overlayVisible) {
                        if (event.key === 'Escape' || isQuestionKey) {
                            event.preventDefault();
                            this.toggleShortcutOverlay(false);
                        }
                        return;
                    }

                    const target = event.target;
                    const isEditable = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
                    const hasModifier = event.altKey || event.ctrlKey || event.metaKey;

                    if (isEditable && !hasModifier) {
                        return;
                    }

                    switch (event.key) {
                        case 'ArrowRight':
                        case 'ArrowDown':
                            event.preventDefault();
                            this.triggerTransition(1);
                            break;
                        case 'ArrowLeft':
                        case 'ArrowUp':
                            event.preventDefault();
                            this.triggerTransition(-1);
                            break;
                        case 'Home':
                            event.preventDefault();
                            this.jumpToSection(0);
                            break;
                        case 'End':
                            event.preventDefault();
                            this.jumpToSection(Math.max(0, this.polytopThemes.length - 1));
                            break;
                        case '[':
                            if (!hasModifier) {
                                event.preventDefault();
                                this.triggerTransition(-1);
                            }
                            break;
                        case ']':
                            if (!hasModifier) {
                                event.preventDefault();
                                this.triggerTransition(1);
                            }
                            break;
                        case '0':
                            if (!hasModifier) {
                                event.preventDefault();
                                this.setSpotlight(null);
                            }
                            break;
                        case '1':
                        case '2':
                        case '3':
                            if (!hasModifier) {
                                event.preventDefault();
                                this.toggleSpotlightByKey(parseInt(event.key, 10) - 1);
                            }
                            break;
                        case '/':
                            if (!hasModifier) {
                                event.preventDefault();
                                this.openSearchFromShortcut();
                            }
                            break;
                        case '?':
                            event.preventDefault();
                            this.toggleShortcutOverlay();
                            break;
                        case 'd':
                        case 'D':
                            if (event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey) {
                                event.preventDefault();
                                const deckOpen = Boolean(this.controlDeck && this.controlDeck.deck && this.controlDeck.deck.classList.contains('open'));
                                this.setControlDeckOpen(!deckOpen);
                            }
                            break;
                        default:
                            break;
                    }
                });
            }

            toggleSpotlightByKey(index) {
                if (typeof index !== 'number' || index < 0 || index > 2) {
                    return;
                }

                if (this.spotlightWaferIndex === index) {
                    this.setSpotlight(null);
                } else {
                    this.setSpotlight(index);
                }
            }

            openSearchFromShortcut() {
                const searchInput = document.getElementById('controlDeckSearchInput');
                if (!this.controlDeck || !this.controlDeck.deck || !searchInput) {
                    return;
                }

                if (!this.controlDeck.deck.classList.contains('open')) {
                    this.setControlDeckOpen(true);
                }

                window.requestAnimationFrame(() => {
                    searchInput.focus();
                    searchInput.select();
                });
            }

            triggerSiteReaction(x, y) {
                const siteReaction = document.getElementById('siteReaction');
                siteReaction.style.setProperty('--click-x', (x / window.innerWidth * 100) + '%');
                siteReaction.style.setProperty('--click-y', (y / window.innerHeight * 100) + '%');
                
                // Reset animation
                siteReaction.style.animation = 'none';
                siteReaction.offsetHeight; // Trigger reflow
                siteReaction.style.animation = 'siteReaction 0.8s ease-out';
            }
            
            jumpToSection(sectionIndex) {
                if (this.isTransitioning) return;
                
                console.log(`💎 Navigation Jump: ${this.currentSection} → ${sectionIndex}`);
                
                this.isTransitioning = true;
                this.performTransition(sectionIndex);
                
                // Close navigation
                document.getElementById('navToggle').classList.remove('open');
                document.getElementById('navContainer').classList.remove('open');
                
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 1000);
            }
            
            triggerTransition(direction) {
                if (this.isTransitioning) return;
                
                const newSection = this.currentSection + direction;
                
                // Boundary check with wraparound
                const lastIndex = Math.max(0, this.polytopThemes.length - 1);
                let targetSection;
                if (newSection < 0) {
                    targetSection = lastIndex; // Wrap to last section
                } else if (newSection > lastIndex) {
                    targetSection = 0; // Wrap to first section
                } else {
                    targetSection = newSection;
                }
                
                console.log(`💎 Transition: ${this.currentSection} → ${targetSection} (momentum: ${this.scrollMomentum.toFixed(1)})`);
                
                this.isTransitioning = true;
                this.scrollMomentum = 0;
                this.hideMomentumIndicator();
                
                this.performTransition(targetSection);
                
                setTimeout(() => {
                    this.isTransitioning = false;
                }, 1000);
            }
            
            performTransition(targetSection) {
                this.currentSection = targetSection;
                this.spotlightWaferIndex = null;

                // Update polytopal background with mathematical grace
                this.updatePolytopVisibility();

                // Update navigation
                this.updateNavigation();
                
                // Crystal breaking and reforming sequence
                this.crystalBreakingSequence();
                
                // Update UI
                setTimeout(() => {
                    this.updateUI();
                }, 200);
            }
            
            updatePolytopVisibility() {
                const backgrounds = document.querySelectorAll('.polytopal-background');
                backgrounds.forEach((bg, index) => {
                    bg.classList.toggle('active', index === this.currentSection);
                    
                    // Ensure visualizer exists and is rendering
                    if (index === this.currentSection && this.polytopVisualizers[index]) {
                        // Activate the current visualizer
                        const themeName = this.polytopThemes[index]?.name || `Section ${index + 1}`;
                        console.log(`🎯 Activating visualizer ${index}: ${themeName}`);
                    }
                });
            }
            
            crystalBreakingSequence() {
                const wafers = document.querySelectorAll('.crystal-wafer');
                
                // Clear any momentum effects before starting
                wafers.forEach(wafer => {
                    wafer.style.transform = '';
                    wafer.style.filter = '';
                    wafer.style.transition = '';
                });
                
                // Phase 1: Breaking animation
                wafers.forEach((wafer, index) => {
                    setTimeout(() => {
                        wafer.classList.add('breaking');
                        
                        // Remove breaking class and add reforming
                        setTimeout(() => {
                            wafer.classList.remove('breaking');
                            wafer.classList.add('reforming');
                            
                            // Update content during reform
                            setTimeout(() => {
                                this.updateWaferContent(index);
                            }, 200);
                            
                            // Remove reforming class and ensure clean state
                            setTimeout(() => {
                                wafer.classList.remove('reforming');
                                // Ensure clean state after reforming
                                wafer.style.transform = '';
                                wafer.style.filter = '';
                                wafer.style.transition = '';
                            }, 1000);
                            
                        }, 800);
                    }, index * 80);
                });
            }
            
            // Add momentum-responsive card effects
            updateCardMomentumEffects() {
                // Don't interfere during transitions
                if (this.isTransitioning) return;
                
                const wafers = document.querySelectorAll('.crystal-wafer');
                const momentumPercent = this.scrollMomentum / this.momentumThreshold;
                
                wafers.forEach((wafer, index) => {
                    // Skip if card is in breaking/reforming state
                    if (wafer.classList.contains('breaking') || wafer.classList.contains('reforming')) {
                        return;
                    }
                    
                    const stagger = index * 0.1;
                    const effectIntensity = Math.max(0, momentumPercent - stagger);
                    
                    if (effectIntensity > 0) {
                        // Cards start to anticipate transition
                        const anticipationScale = 1 + (effectIntensity * 0.01); // Reduced intensity
                        const anticipationBrightness = 1 + (effectIntensity * 0.1);
                        
                        wafer.style.transform = `scale(${anticipationScale})`;
                        wafer.style.filter = `brightness(${anticipationBrightness})`;
                        wafer.style.transition = 'all 0.1s ease-out';
                    } else {
                        // Reset to normal only if not in animation state
                        wafer.style.transform = '';
                        wafer.style.filter = '';
                        wafer.style.transition = 'all 0.3s ease-out';
                    }
                });
            }
            
            createCrystalWafers() {
                const container = document.getElementById('crystalContainer');

                // Clear any existing content
                container.innerHTML = '';

                console.log('🔧 Creating 3 crystal wafers for desktop display');

                if (!this.contentSets.length) {
                    console.warn('⚠️ No content sets defined for gallery dataset.');
                }

                // Desktop: Always create exactly 3 cards in a centered grid
                container.style.display = 'grid';
                container.style.gridTemplateColumns = 'repeat(3, 1fr)';
                container.style.gridTemplateRows = '1fr';
                container.style.justifyContent = 'center';
                container.style.alignItems = 'center';
                container.style.gap = '30px';
                
                for (let i = 0; i < 3; i++) {
                    const wafer = this.createWaferElement(i);
                    container.appendChild(wafer);
                    console.log(`✅ Created crystal wafer ${i}`);
                }
                
                console.log('💎 Crystal wafers created successfully');
            }
            
            createWaferElement(index) {
                const wafer = document.createElement('div');
                wafer.className = 'crystal-wafer';
                wafer.id = `crystal-wafer-${index}`;
                
                wafer.innerHTML = `
                    <div class="wafer-title" id="title-${index}">Loading...</div>
                    <div class="wafer-preview" id="preview-${index}">
                        <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--crystal-teal); font-size: 1.0em;">
                            ◆ Initializing polytopal matrix...
                        </div>
                    </div>
                    <div class="wafer-info" id="info-${index}">
                        <div class="info-title" id="info-title-${index}">4D Analysis</div>
                        <div class="info-description" id="info-description-${index}">Scanning polytopal structure...</div>
                        <div class="info-tags" id="info-tags-${index}">
                            <!-- Tags will be populated dynamically -->
                        </div>
                    </div>
                `;
                
                // Add hover effects for background visualizer slowdown
                wafer.addEventListener('mouseenter', () => {
                    this.slowDownVisualizers();
                });
                
                wafer.addEventListener('mouseleave', () => {
                    this.speedUpVisualizers();
                });
                
                // Add click to navigate to source
                wafer.addEventListener('click', (e) => {
                    const currentSet = this.contentSets[this.currentSection];
                    const content = currentSet[index];
                    if (content && content.url) {
                        // Open demo in new tab
                        window.open(content.url, '_blank');
                        console.log(`🎯 Opening demo: ${content.name} → ${content.url}`);
                    }
                });
                
                return wafer;
            }
            
            updateWaferContent(waferIndex) {
                const currentSet = this.contentSets[this.currentSection];
                const content = currentSet[waferIndex];
                
                // Handle case where there are fewer than 3 items in a section
                if (!content) {
                    const wafer = document.getElementById(`crystal-wafer-${waferIndex}`);
                    if (wafer) {
                        wafer.style.display = 'none';
                        console.log(`⚠️ Hiding wafer ${waferIndex} - no content available`);
                    }
                    return;
                }
                
                const wafer = document.getElementById(`crystal-wafer-${waferIndex}`);
                if (wafer) {
                    wafer.style.display = 'flex';
                    console.log(`✅ Showing wafer ${waferIndex}:`, content.title);
                } else {
                    console.error(`❌ Wafer element ${waferIndex} not found!`);
                }
                
                // Update text content without destroying DOM structure
                const titleEl = document.getElementById(`title-${waferIndex}`);
                const infoTitleEl = document.getElementById(`info-title-${waferIndex}`);
                const infoDescEl = document.getElementById(`info-description-${waferIndex}`);
                
                if (titleEl) titleEl.textContent = content.title;
                if (infoTitleEl) infoTitleEl.textContent = content.title;
                if (infoDescEl) infoDescEl.textContent = content.description;
                
                // Update tags
                const tagsContainer = document.getElementById(`info-tags-${waferIndex}`);
                if (tagsContainer) {
                    tagsContainer.innerHTML = content.tags.map(tag => 
                        `<span class="info-tag">${tag}</span>`
                    ).join('');
                }
                
                // Auto-load preview
                this.autoLoadPreview(waferIndex, content);
            }
            
            updateContent() {
                const currentSet = this.contentSets[this.currentSection];
                
                console.log(`🔄 Updating content for section ${this.currentSection}:`, currentSet);
                
                for (let i = 0; i < 3; i++) {
                    this.updateWaferContent(i);
                    console.log(`✅ Updated wafer ${i} content`);
                }

                this.updateTagHighlights();

                console.log('💎 All wafers updated with current section content');
            }
            
            autoLoadPreview(waferIndex, content) {
                const preview = document.getElementById(`preview-${waferIndex}`);
                
                if (content.isHeavy) {
                    preview.innerHTML = `
                        <div style="padding: 20px; text-align: center;">
                            <div style="color: var(--crystal-teal); margin-bottom: 15px; font-size: 1.1em;">${this.heavyPreview.label}</div>
                            <div style="font-size: 0.8em; line-height: 1.6; color: var(--crystal-teal);">
                                ${(this.heavyPreview.description || []).map(line => `${line}<br>`).join('')}
                                <button onclick="window.open('${content.url}', '_blank')"
                                        style="margin-top: 10px; padding: 8px 16px; background: var(--silicon-green);
                                               border: 2px solid var(--crystal-teal); color: var(--crystal-teal);
                                               border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.8em;">
                                    ${this.heavyPreview.button}
                                </button>
                            </div>
                        </div>
                    `;
                } else {
                    // Auto-load with staggered entrance
                    setTimeout(() => {
                        preview.innerHTML = `
                            <iframe src="${content.url}" 
                                    width="100%" 
                                    height="100%" 
                                    frameborder="0"
                                    loading="lazy"
                                    style="opacity: 0; transition: opacity 0.6s ease;">
                            </iframe>
                        `;
                        
                        const iframe = preview.querySelector('iframe');
                        iframe.onload = () => {
                            iframe.style.opacity = '1';
                        };
                    }, waferIndex * 150 + 300);
                }
            }
            
            updateNavigation() {
                const navSections = document.querySelectorAll('.nav-section');
                navSections.forEach((section, index) => {
                    section.classList.toggle('active', index === this.currentSection);
                });

                this.updateNavigationTagStates();
            }
            
            showMomentumIndicator() {
                const indicator = document.getElementById('momentumIndicator');
                const fill = document.getElementById('momentumFill');
                
                indicator.classList.add('active');
                fill.style.width = `${this.scrollMomentum}%`;
            }
            
            hideMomentumIndicator() {
                const indicator = document.getElementById('momentumIndicator');
                indicator.classList.remove('active');
            }
            
            decayMomentum() {
                const decayInterval = setInterval(() => {
                    this.scrollMomentum -= 2; // Slower decay for better feel
                    
                    if (this.scrollMomentum <= 0) {
                        this.scrollMomentum = 0;
                        this.hideMomentumIndicator();
                        clearInterval(decayInterval);
                        
                        // Reset scroll progress
                        this.polytopVisualizers.forEach(viz => {
                            if (viz) viz.updateScroll(0);
                        });
                        
                        // Reset card effects
                        this.updateCardMomentumEffects();
                    } else {
                        this.showMomentumIndicator();
                        
                        // Update scroll progress and card effects during decay
                        const scrollProgress = this.scrollMomentum / 100;
                        this.polytopVisualizers.forEach(viz => {
                            if (viz) viz.updateScroll(scrollProgress);
                        });
                        this.updateCardMomentumEffects();
                    }
                }, 60); // Slightly slower decay rate
            }
            
            updateUI() {
                const theme = this.polytopThemes[this.currentSection];

                // Update section info
                const titleEl = document.getElementById('sectionTitle');
                if (titleEl) titleEl.textContent = theme?.name || this.navTitle;
                const subtitleEl = document.getElementById('sectionSubtitle');
                if (subtitleEl) subtitleEl.textContent = this.subtitle;

                this.updateControlDeckSection();
                this.updateShareControls();
                this.updateTagHighlights();
                this.updateTagFocusList();
                this.updateSearchResults();
                this.refreshSpotlight();
                this.updateLocationState();
                this.persistViewState();
            }
            
            slowDownVisualizers() {
                if (this.reducedMotion || !this.webglAvailable) {
                    return;
                }

                // Slow down all background visualizers
                const backgrounds = document.querySelectorAll('.polytopal-background');
                backgrounds.forEach(bg => {
                    bg.classList.add('slowed');
                });
                
                // Reduce visualizer speed
                this.polytopVisualizers.forEach(viz => {
                    if (viz) viz.setTimeScale(0.3);
                });
                
                console.log('🐌 Visualizers slowed down for focus mode');
            }

            speedUpVisualizers() {
                if (this.reducedMotion || !this.webglAvailable) {
                    return;
                }

                // Return visualizers to normal speed
                const backgrounds = document.querySelectorAll('.polytopal-background');
                backgrounds.forEach(bg => {
                    bg.classList.remove('slowed');
                });

                // Reset visualizer speed
                this.polytopVisualizers.forEach(viz => {
                    if (viz) viz.setTimeScale(1.0);
                });

                console.log('⚡ Visualizers returned to normal speed');
            }

            handleMotionPreferenceChange() {
                const reduced = this.reducedMotion;
                document.body.classList.toggle('reduced-motion', reduced);

                if (reduced) {
                    this.stopRenderLoop();
                    console.log('♿ Reduced motion activated - render loop halted.');
                } else {
                    if (!this.webglAvailable) {
                        console.log('ℹ️ Motion restored but WebGL visualizers were not created in this session. Reload to enable them.');
                        return;
                    }

                    if (!this.renderLoopId) {
                        this.startRenderLoop();
                    }
                }
            }

            startRenderLoop() {
                if (this.reducedMotion || !this.webglAvailable) {
                    console.log('🎬 Render loop skipped (reduced motion or CSS mode active).');
                    return;
                }

                if (this.renderLoopId) {
                    return;
                }

                const render = () => {
                    this.polytopVisualizers.forEach((viz, index) => {
                        if (viz && viz.gl && !viz.gl.isContextLost()) {
                            try {
                                viz.render();
                            } catch (error) {
                                console.warn(`⚠️ Visualizer ${index} render error:`, error);
                                // Don't break the entire render loop for one failed visualizer
                            }
                        }
                    });
                    this.renderLoopId = window.requestAnimationFrame(render);
                };

                this.renderLoopId = window.requestAnimationFrame(render);
                console.log('🎬 4D polytopal render loop started');
            }

            stopRenderLoop() {
                if (this.renderLoopId) {
                    cancelAnimationFrame(this.renderLoopId);
                    this.renderLoopId = null;
                    console.log('⏹ Render loop stopped.');
                }
            }
        }

        window.VisualCodexGallery = VisualCodexGallery;
})();
