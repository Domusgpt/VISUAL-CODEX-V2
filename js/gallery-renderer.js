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

                this.datasetKey = typeof this.data.key === 'string' ? this.data.key : 'proper';
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
                this.entriesByUrl = new Map();
                this.tagIndex = this.buildTagIndex();
                this.searchIndex = this.buildSearchIndex();
                this.metrics = this.computeMetrics();
                this.favoritesStorageKey = 'visualCodexFavorites';
                this.localStorageAvailable = this.checkLocalStorageAvailability();
                this.favoritesStore = this.loadFavoritesStore();
                this.favoriteUrls = new Set(this.extractDatasetFavorites(this.datasetKey));
                this.favoriteEntries = [];
                this.favoriteSectionCounts = new Map();
                this.favoriteCardMap = new Map();
                this.favoriteSectionIndexSet = new Set();
                this.activeTagFilter = null;
                this.activeSearchQuery = '';
                this.activeSearchDisplayValue = '';
                this.searchResults = [];
                this.searchSectionMatches = new Set();
                this.searchCardMatches = new Map();
                this.searchResultKeySet = new Set();
                this.navSections = [];

                this.recomputeFavoriteMappings();

                this.currentSection = 0;
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
                    if (this.entriesByUrl instanceof Map) {
                        this.entriesByUrl.clear();
                    }
                    return index;
                }

                if (!(this.entriesByUrl instanceof Map)) {
                    this.entriesByUrl = new Map();
                } else {
                    this.entriesByUrl.clear();
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
                        const normalizedUrl = (typeof item.url === 'string' && item.url.trim()) ? item.url.trim() : '';

                        const entry = {
                            sectionIndex,
                            cardIndex,
                            title,
                            description,
                            tags,
                            url: normalizedUrl || '#',
                            searchText,
                            datasetKey: this.datasetKey
                        };

                        index.push(entry);

                        if (normalizedUrl) {
                            if (!this.entriesByUrl.has(normalizedUrl)) {
                                this.entriesByUrl.set(normalizedUrl, []);
                            }
                            this.entriesByUrl.get(normalizedUrl).push(entry);
                        }
                    });
                });

                return index;
            }

            checkLocalStorageAvailability() {
                if (typeof window === 'undefined' || !window.localStorage) {
                    return false;
                }

                try {
                    const testKey = '__visual_codex_favorites__';
                    window.localStorage.setItem(testKey, testKey);
                    window.localStorage.removeItem(testKey);
                    return true;
                } catch (error) {
                    console.warn('⚠️ Local storage unavailable for favorites:', error);
                    return false;
                }
            }

            loadFavoritesStore() {
                const emptyStore = { version: 1, datasets: {} };

                if (!this.localStorageAvailable) {
                    return emptyStore;
                }

                try {
                    const raw = window.localStorage.getItem(this.favoritesStorageKey);
                    if (!raw) {
                        return emptyStore;
                    }

                    const parsed = JSON.parse(raw);
                    if (!parsed || typeof parsed !== 'object') {
                        return emptyStore;
                    }

                    if (!parsed.datasets || typeof parsed.datasets !== 'object') {
                        parsed.datasets = {};
                    }

                    return parsed;
                } catch (error) {
                    console.warn('⚠️ Failed to read favorites store:', error);
                    return emptyStore;
                }
            }

            extractDatasetFavorites(datasetKey) {
                if (!datasetKey || !this.favoritesStore || typeof this.favoritesStore !== 'object') {
                    return [];
                }

                const datasets = this.favoritesStore.datasets;
                if (!datasets || typeof datasets !== 'object') {
                    return [];
                }

                const stored = datasets[datasetKey];
                if (!Array.isArray(stored)) {
                    return [];
                }

                return stored
                    .filter((url) => typeof url === 'string' && url.trim())
                    .map((url) => url.trim());
            }

            persistFavoritesStore() {
                if (!this.localStorageAvailable) {
                    return;
                }

                try {
                    window.localStorage.setItem(this.favoritesStorageKey, JSON.stringify(this.favoritesStore));
                } catch (error) {
                    console.warn('⚠️ Unable to persist favorites store:', error);
                }
            }

            syncFavoritesStore() {
                if (!this.favoritesStore || typeof this.favoritesStore !== 'object') {
                    this.favoritesStore = { version: 1, datasets: {} };
                }

                if (!this.favoritesStore.datasets || typeof this.favoritesStore.datasets !== 'object') {
                    this.favoritesStore.datasets = {};
                }

                this.favoritesStore.datasets[this.datasetKey] = Array.from(this.favoriteUrls || []);
                this.persistFavoritesStore();
            }

            findRecordForUrl(url, sectionIndex, cardIndex) {
                const normalizedUrl = typeof url === 'string' ? url.trim() : '';
                if (!normalizedUrl || !(this.entriesByUrl instanceof Map)) {
                    return null;
                }

                const records = this.entriesByUrl.get(normalizedUrl) || [];
                const datasetRecords = records.filter((record) => record.datasetKey === this.datasetKey);

                if (!datasetRecords.length) {
                    return null;
                }

                const exactSection = Number.isFinite(sectionIndex) ? Number(sectionIndex) : null;
                const exactCard = Number.isFinite(cardIndex) ? Number(cardIndex) : null;

                if (exactSection !== null && exactCard !== null) {
                    const exactMatch = datasetRecords.find((record) => record.sectionIndex === exactSection && record.cardIndex === exactCard);
                    if (exactMatch) {
                        return exactMatch;
                    }
                }

                return datasetRecords.reduce((best, record) => {
                    if (!best) {
                        return record;
                    }

                    if (record.sectionIndex < best.sectionIndex) {
                        return record;
                    }

                    if (record.sectionIndex === best.sectionIndex && record.cardIndex < best.cardIndex) {
                        return record;
                    }

                    return best;
                }, null);
            }

            recomputeFavoriteMappings() {
                this.favoriteEntries = [];
                this.favoriteSectionCounts = new Map();
                this.favoriteCardMap = new Map();
                this.favoriteSectionIndexSet = new Set();

                if (!(this.favoriteUrls instanceof Set) || !this.favoriteUrls.size) {
                    return;
                }

                const sectionUrlMap = new Map();

                this.favoriteUrls.forEach((url) => {
                    const normalizedUrl = typeof url === 'string' ? url.trim() : '';
                    if (!normalizedUrl || !(this.entriesByUrl instanceof Map)) {
                        return;
                    }

                    const records = this.entriesByUrl.get(normalizedUrl) || [];
                    const datasetRecords = records.filter((record) => record.datasetKey === this.datasetKey);

                    if (!datasetRecords.length) {
                        return;
                    }

                    datasetRecords.forEach((record) => {
                        const sectionIndex = record.sectionIndex;
                        if (!sectionUrlMap.has(sectionIndex)) {
                            sectionUrlMap.set(sectionIndex, new Set());
                        }
                        sectionUrlMap.get(sectionIndex).add(normalizedUrl);

                        if (!this.favoriteCardMap.has(sectionIndex)) {
                            this.favoriteCardMap.set(sectionIndex, new Set());
                        }
                        this.favoriteCardMap.get(sectionIndex).add(record.cardIndex);
                    });

                    const primaryRecord = datasetRecords.reduce((best, record) => {
                        if (!best) {
                            return record;
                        }

                        if (record.sectionIndex < best.sectionIndex) {
                            return record;
                        }

                        if (record.sectionIndex === best.sectionIndex && record.cardIndex < best.cardIndex) {
                            return record;
                        }

                        return best;
                    }, null);

                    if (primaryRecord) {
                        const sectionName = this.polytopThemes[primaryRecord.sectionIndex]?.name || `Section ${primaryRecord.sectionIndex + 1}`;
                        this.favoriteEntries.push({
                            url: normalizedUrl,
                            title: primaryRecord.title,
                            sectionIndex: primaryRecord.sectionIndex,
                            cardIndex: primaryRecord.cardIndex,
                            sectionName,
                            tags: primaryRecord.tags || []
                        });
                    }
                });

                this.favoriteEntries.sort((a, b) => {
                    if (a.sectionIndex !== b.sectionIndex) {
                        return a.sectionIndex - b.sectionIndex;
                    }
                    if (a.cardIndex !== b.cardIndex) {
                        return a.cardIndex - b.cardIndex;
                    }
                    return a.title.localeCompare(b.title);
                });

                sectionUrlMap.forEach((urlSet, sectionIndex) => {
                    this.favoriteSectionCounts.set(sectionIndex, urlSet.size);
                    this.favoriteSectionIndexSet.add(sectionIndex);
                });
            }

            isFavorite(url) {
                const normalizedUrl = typeof url === 'string' ? url.trim() : '';
                if (!normalizedUrl || !(this.favoriteUrls instanceof Set)) {
                    return false;
                }

                return this.favoriteUrls.has(normalizedUrl);
            }

            setupFavoritesControls() {
                const clearButton = document.getElementById('controlDeckFavoritesClear');
                if (clearButton) {
                    clearButton.addEventListener('click', () => {
                        if (this.favoriteUrls.size) {
                            this.clearFavorites();
                        }
                    });
                }

                const list = document.getElementById('controlDeckFavoritesList');
                if (list) {
                    list.addEventListener('click', (event) => {
                        const removeButton = event.target.closest('.control-deck-favorites-remove');
                        if (removeButton) {
                            event.preventDefault();
                            event.stopPropagation();
                            const targetUrl = removeButton.dataset.favoriteUrl;
                            if (targetUrl) {
                                this.removeFavorite(targetUrl);
                            }
                        }
                    });
                }
            }

            handleFavoriteToggle({ url, sectionIndex, cardIndex }) {
                const normalizedUrl = typeof url === 'string' ? url.trim() : '';
                if (!normalizedUrl) {
                    return;
                }

                const record = this.findRecordForUrl(normalizedUrl, sectionIndex, cardIndex);
                if (!record) {
                    console.warn('⚠️ Unable to map favorite entry for URL:', normalizedUrl);
                    return;
                }

                if (this.isFavorite(normalizedUrl)) {
                    this.favoriteUrls.delete(normalizedUrl);
                } else {
                    this.favoriteUrls.add(normalizedUrl);
                }

                this.syncFavoritesStore();
                this.recomputeFavoriteMappings();
                this.refreshFavoritesUI();
            }

            removeFavorite(url) {
                const normalizedUrl = typeof url === 'string' ? url.trim() : '';
                if (!normalizedUrl || !this.isFavorite(normalizedUrl)) {
                    return;
                }

                this.favoriteUrls.delete(normalizedUrl);
                this.syncFavoritesStore();
                this.recomputeFavoriteMappings();
                this.refreshFavoritesUI();
            }

            clearFavorites() {
                if (!(this.favoriteUrls instanceof Set) || !this.favoriteUrls.size) {
                    return;
                }

                this.favoriteUrls.clear();
                this.syncFavoritesStore();
                this.recomputeFavoriteMappings();
                this.refreshFavoritesUI();
            }

            refreshFavoritesUI() {
                this.updateFavoritesMetric();
                this.updateFavoritesPanel();
                this.updateNavigationTagStates();
                this.updateWaferFavoriteStates();
                this.updateSearchResults();
            }

            updateFavoritesMetric() {
                const metricsEl = document.getElementById('controlDeckMetrics');
                if (!metricsEl) {
                    return;
                }

                const valueEl = metricsEl.querySelector('[data-metric="favorites"] .control-deck-metric-value');
                if (valueEl) {
                    valueEl.textContent = this.favoriteUrls.size;
                }
            }

            updateFavoritesPanel() {
                const list = document.getElementById('controlDeckFavoritesList');
                const clearButton = document.getElementById('controlDeckFavoritesClear');

                if (clearButton) {
                    clearButton.disabled = !this.favoriteUrls.size;
                }

                if (!list) {
                    return;
                }

                if (!this.favoriteEntries.length) {
                    list.classList.add('empty');
                    list.innerHTML = '<div class="control-deck-favorites-empty">Mark demos as favorites to pin them here.</div>';
                    return;
                }

                list.classList.remove('empty');

                const maxItems = 5;
                const rendered = this.favoriteEntries.slice(0, maxItems).map((entry) => {
                    const itemClasses = ['control-deck-favorites-item'];
                    if (entry.sectionIndex === this.currentSection) {
                        itemClasses.push('is-current');
                    }

                    const safeUrl = this.escapeHtml(entry.url);
                    const safeTitle = this.escapeHtml(entry.title);
                    const safeSection = this.escapeHtml(entry.sectionName);

                    return `
                        <div class="${itemClasses.join(' ')}" data-favorite-url="${safeUrl}" data-section-index="${entry.sectionIndex}">
                            <button type="button" class="control-deck-favorites-remove" data-favorite-url="${safeUrl}" aria-label="Remove ${safeTitle} from favorites">×</button>
                            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">
                                <span class="control-deck-search-favorite" aria-hidden="true">★</span>
                                <span class="control-deck-search-title">${safeTitle}</span>
                            </a>
                            <div class="control-deck-favorites-meta">Section ${entry.sectionIndex + 1} • ${safeSection}</div>
                        </div>
                    `;
                }).join('');

                const remainder = this.favoriteEntries.length - maxItems;
                const remainderNote = remainder > 0 ? `<div class="control-deck-favorites-more">+${remainder} more favorites</div>` : '';

                list.innerHTML = rendered + remainderNote;
            }

            updateWaferFavoriteStates() {
                const currentSet = this.contentSets[this.currentSection] || [];
                for (let i = 0; i < 3; i++) {
                    this.applyFavoriteStateToWafer(i, currentSet[i]);
                }
            }

            applyFavoriteStateToWafer(waferIndex, content) {
                const wafer = document.getElementById(`crystal-wafer-${waferIndex}`);
                if (!wafer) {
                    return;
                }

                const favoriteButton = wafer.querySelector('.wafer-favorite');
                const hasUrl = content && typeof content.url === 'string' && content.url.trim();
                const normalizedUrl = hasUrl ? content.url.trim() : '';
                const isFavorite = hasUrl && this.isFavorite(normalizedUrl);

                wafer.classList.toggle('is-favorite', Boolean(isFavorite));

                if (favoriteButton) {
                    favoriteButton.dataset.sectionIndex = String(this.currentSection);
                    favoriteButton.dataset.cardIndex = String(waferIndex);
                    favoriteButton.dataset.contentUrl = normalizedUrl;

                    if (hasUrl) {
                        favoriteButton.disabled = false;
                        favoriteButton.classList.toggle('is-active', Boolean(isFavorite));
                        favoriteButton.setAttribute('aria-pressed', isFavorite ? 'true' : 'false');
                        favoriteButton.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
                    } else {
                        favoriteButton.disabled = true;
                        favoriteButton.classList.remove('is-active');
                        favoriteButton.setAttribute('aria-pressed', 'false');
                        favoriteButton.setAttribute('aria-label', 'Favorites unavailable');
                    }
                }
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

                toggle.addEventListener('click', () => {
                    const isOpen = deck.classList.toggle('open');
                    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
                    panel.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
                });

                this.renderControlDeck();
                this.setupSearchInterface();
                this.setupFavoritesControls();
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
                        { label: 'Unique Tags', value: this.metrics.tagCounts.size },
                        { label: 'Favorites', value: this.favoriteUrls.size, key: 'favorites' }
                    ];

                    metricsEl.innerHTML = metricData.map((metric) => `
                        <div class="control-deck-metric"${metric.key ? ` data-metric="${metric.key}"` : ''}>
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

                this.updateFavoritesMetric();
                this.updateFavoritesPanel();
                this.updateControlDeckSection();
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
                    const isFavorite = this.isFavorite(entry.url);
                    const classNames = ['control-deck-search-item'];
                    if (isCurrent) {
                        classNames.push('current-section');
                    }
                    if (isFavorite) {
                        classNames.push('is-favorite');
                    }

                    const safeUrl = this.escapeHtml(entry.url || '#');
                    const safeTitle = this.escapeHtml(entry.title);
                    const safeSection = this.escapeHtml(sectionName);
                    const safeTags = this.escapeHtml(tags);
                    const favoriteIcon = isFavorite ? '<span class="control-deck-search-favorite" aria-hidden="true">★</span>' : '';

                    return `
                        <div class="${classNames.join(' ')}">
                            <a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${favoriteIcon}<span class="control-deck-search-title">${safeTitle}</span></a>
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

                    const favoriteCount = this.favoriteSectionCounts.get(index) || 0;
                    const hasFavorite = favoriteCount > 0;
                    section.classList.toggle('has-favorite', hasFavorite);

                    if (hasFavorite) {
                        section.setAttribute('data-favorite-count', String(favoriteCount));
                    } else {
                        section.removeAttribute('data-favorite-count');
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
                    const content = currentSet[i];
                    this.applyFavoriteStateToWafer(i, content);

                    const wafer = document.getElementById(`crystal-wafer-${i}`);
                    if (!wafer) {
                        continue;
                    }

                    wafer.classList.remove('tag-match', 'tag-muted', 'search-match');

                    if (!hasFilter) {
                        continue;
                    }

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
                    <button type="button" class="wafer-favorite" aria-pressed="false" aria-label="Add to favorites">★</button>
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

                const favoriteButton = wafer.querySelector('.wafer-favorite');
                if (favoriteButton) {
                    favoriteButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        this.handleFavoriteToggle({
                            url: favoriteButton.dataset.contentUrl,
                            sectionIndex: Number(favoriteButton.dataset.sectionIndex),
                            cardIndex: Number(favoriteButton.dataset.cardIndex)
                        });
                    });

                    favoriteButton.disabled = true;
                    favoriteButton.dataset.contentUrl = '';
                    favoriteButton.dataset.sectionIndex = String(this.currentSection);
                    favoriteButton.dataset.cardIndex = String(index);
                }

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
                    this.applyFavoriteStateToWafer(waferIndex, null);
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

                this.applyFavoriteStateToWafer(waferIndex, content);

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
                this.updateTagHighlights();
                this.updateTagFocusList();
                this.refreshFavoritesUI();
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
