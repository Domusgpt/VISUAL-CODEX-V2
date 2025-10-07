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
                this.heavyPreview = {
                    label: '⚡ MEGA SYSTEM',
                    button: '◆ Launch System',
                    description: ['125 WebGL visualizers'],
                    ...(this.data.heavyPreview || {})
                };

                this.currentSection = 0;
                this.scrollMomentum = 0;
                this.isTransitioning = false;
                this.momentumThreshold = options.momentumThreshold ?? 25;
                this.polytopVisualizers = [];
                this.mouseX = 0.5;
                this.mouseY = 0.5;
                this.mouseIntensity = 0.0;

                this.initialize();
            }

            initialize() {
                console.log(`💎 Initializing ${this.logPrefix}...`);

                this.applyMetadata();
                this.createPolytopBackgrounds();
                this.createCrystalWafers();
                this.createNavigation();
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
            
            createPolytopBackgrounds() {
                const container = document.getElementById('polytopBackgrounds');

                if (!this.polytopThemes.length) {
                    console.warn('⚠️ No polytopal themes defined for gallery dataset.');
                    return;
                }

                // FORCE WebGL - always try to create visualizers
                console.log('🔥 FORCING WebGL visualizer creation - ignoring detection');
                console.log('  - User Agent:', navigator.userAgent);
                console.log('  - Platform:', navigator.platform);
                console.log('  - GitHub Pages:', window.location.hostname.includes('github.io'));
                
                const webglAvailable = true; // FORCE IT
                
                this.polytopThemes.forEach((theme, index) => {
                    const backgroundDiv = document.createElement('div');
                    backgroundDiv.className = 'polytopal-background';
                    backgroundDiv.id = `polytop-${index}`;
                    
                    if (webglAvailable) {
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
            
            createNavigation() {
                const navSections = document.getElementById('navSections');

                if (!this.polytopThemes.length) {
                    return;
                }

                this.polytopThemes.forEach((theme, index) => {
                    const section = document.createElement('div');
                    section.className = 'nav-section';
                    section.innerHTML = `
                        <div class="nav-section-name">Section ${index + 1}: ${theme.name}</div>
                        <div class="nav-section-info">${theme.geometry} • density: ${theme.density} • 3 cards</div>
                    `;
                    
                    section.addEventListener('click', () => {
                        this.jumpToSection(index);
                    });
                    
                    navSections.appendChild(section);
                });
            }
            
            setupInteractions() {
                // Navigation toggle
                const navToggle = document.getElementById('navToggle');
                const navContainer = document.getElementById('navContainer');
                
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
                document.addEventListener('mousemove', (e) => {
                    this.mouseX = e.clientX / window.innerWidth;
                    this.mouseY = 1.0 - (e.clientY / window.innerHeight);
                    this.mouseIntensity = Math.min(1.0, Math.sqrt(e.movementX*e.movementX + e.movementY*e.movementY) / 50);
                    
                    // Update all visualizers
                    this.polytopVisualizers.forEach(viz => {
                        if (viz) viz.updateInteraction(this.mouseX, this.mouseY, this.mouseIntensity);
                    });
                });
                
                // Scroll physics
                this.setupScrollPhysics();
                
                // Click reactions
                this.setupClickReactions();
            }
            
            setupScrollPhysics() {
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    // Mobile: Use native scroll snap
                    console.log('📱 Mobile scroll snap enabled');
                    document.body.style.overflowY = 'auto';
                    document.body.style.scrollSnapType = 'y mandatory';
                    
                    // Simple touch-friendly transitions
                    let scrollTimeout;
                    window.addEventListener('scroll', () => {
                        clearTimeout(scrollTimeout);
                        scrollTimeout = setTimeout(() => {
                            // Basic section detection for mobile
                            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
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
            }
            
            slowDownVisualizers() {
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
            
            startRenderLoop() {
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
                    requestAnimationFrame(render);
                };
                
                render();
                console.log('🎬 4D polytopal render loop started');
            }
        }

        window.VisualCodexGallery = VisualCodexGallery;
})();
