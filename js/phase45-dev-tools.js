(function () {
  if (window.Phase45DevConsole) {
    return;
  }

  const STORAGE_KEY = 'phase45DevPrefs';
  const defaultPrefs = {
    reducedMotion: false,
    highContrast: false,
    telemetry: true,
  };

  const state = {
    prefs: loadPrefs(),
    overlay: null,
    fpsEl: null,
    fps: 0,
    frames: 0,
    lastFrameTime: performance.now(),
    experience: null,
  };

  const mediaQueries = {
    reducedMotion: matchMediaSafe('(prefers-reduced-motion: reduce)'),
    highContrast: matchMediaSafe('(prefers-contrast: more)'),
  };

  if (mediaQueries.reducedMotion?.matches) {
    state.prefs.reducedMotion = true;
  }
  if (mediaQueries.highContrast?.matches) {
    state.prefs.highContrast = true;
  }

  ensureStyles();
  applyPrefs();
  initMediaListeners();
  startFpsLoop();

  window.Phase45DevConsole = {
    registerExperience(config) {
      if (!config || state.overlay) {
        return;
      }

      state.experience = {
        id: config.id || 'phase45-experience',
        name: config.name || 'Phase 4/5 Experience',
        phase: config.phase || 4,
        entry: config.entry || '—',
        version: config.version || '1.0.0',
        modules: Array.isArray(config.modules) ? config.modules : [],
        features: Array.isArray(config.features) ? config.features : [],
        telemetryNotes: config.telemetryNotes || '',
      };

      state.overlay = createOverlay();
      document.body.appendChild(state.overlay);
      updateOverlay();
      dispatchPrefs();
      console.info(
        `%cPhase45DevConsole` +
          `%c Registered ${state.experience.name} (Phase ${state.experience.phase}, Entry ${state.experience.entry})`,
        'color:#00ffaa;font-weight:bold;',
        'color:#ccefff;'
      );
    },
    getPreferences() {
      return { ...state.prefs };
    },
    setPreference(key, value) {
      if (!(key in state.prefs)) {
        return;
      }
      state.prefs[key] = Boolean(value);
      persistPrefs();
      applyPrefs();
      updateOverlay();
      dispatchPrefs();
    },
  };

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...defaultPrefs };
      }
      const parsed = JSON.parse(raw);
      return { ...defaultPrefs, ...parsed };
    } catch (error) {
      console.warn('[Phase45DevConsole] Failed to load preferences', error);
      return { ...defaultPrefs };
    }
  }

  function persistPrefs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prefs));
    } catch (error) {
      console.warn('[Phase45DevConsole] Failed to persist preferences', error);
    }
  }

  function ensureStyles() {
    if (document.getElementById('phase45-dev-tools-style')) {
      return;
    }
    const style = document.createElement('style');
    style.id = 'phase45-dev-tools-style';
    style.textContent = `
      .phase45-dev-console {
        position: fixed;
        bottom: 24px;
        left: 24px;
        width: min(340px, 90vw);
        background: rgba(6, 14, 18, 0.88);
        border: 1px solid rgba(0, 255, 170, 0.35);
        border-radius: 18px;
        box-shadow: 0 16px 32px rgba(0, 0, 0, 0.35), 0 0 22px rgba(0, 255, 170, 0.25);
        backdrop-filter: blur(18px);
        color: #e6fff5;
        font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
        z-index: 9999;
        overflow: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }
      .phase45-dev-console[data-collapsed="true"] {
        transform: translateY(calc(100% - 56px));
        opacity: 0.9;
      }
      .phase45-dev-console__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(0, 255, 170, 0.18);
        background: linear-gradient(135deg, rgba(0, 255, 170, 0.12), rgba(0, 102, 255, 0.1));
      }
      .phase45-dev-console__title {
        font-size: 0.82rem;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-weight: 700;
        color: #aefbde;
      }
      .phase45-dev-console__toggle {
        appearance: none;
        border: 1px solid rgba(0, 255, 170, 0.35);
        background: rgba(2, 20, 18, 0.6);
        color: #aefbde;
        border-radius: 10px;
        padding: 4px 10px;
        font-size: 0.7rem;
        cursor: pointer;
      }
      .phase45-dev-console__body {
        padding: 16px 18px 18px;
        display: grid;
        gap: 14px;
      }
      .phase45-dev-console__meta {
        display: grid;
        gap: 8px;
        font-size: 0.78rem;
      }
      .phase45-dev-console__meta strong {
        font-weight: 600;
        color: #6cf4ff;
      }
      .phase45-dev-console__chipset {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .phase45-dev-console__chip {
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 0.7rem;
        background: rgba(0, 255, 170, 0.14);
        border: 1px solid rgba(0, 255, 170, 0.28);
        color: #aefbde;
      }
      .phase45-dev-console__prefs {
        display: grid;
        gap: 10px;
        font-size: 0.78rem;
      }
      .phase45-dev-console__pref {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 8px 10px;
        border-radius: 12px;
        background: rgba(0, 30, 45, 0.4);
        border: 1px solid rgba(0, 130, 255, 0.25);
      }
      .phase45-dev-console__pref button {
        appearance: none;
        border: none;
        background: rgba(0, 255, 170, 0.15);
        color: #d8fff2;
        border-radius: 12px;
        padding: 6px 12px;
        font-size: 0.72rem;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .phase45-dev-console__pref button[data-active="true"] {
        background: rgba(0, 255, 170, 0.35);
        color: #04150f;
        font-weight: 600;
      }
      .phase45-dev-console__status {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.76rem;
        color: #87f0ff;
      }
      .phase45-dev-console__status-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #1affd5;
        box-shadow: 0 0 12px rgba(26, 255, 213, 0.65);
      }
      .phase45-dev-console__modules,
      .phase45-dev-console__features {
        display: grid;
        gap: 4px;
        font-size: 0.72rem;
        color: #d0faff;
      }
      .phase45-dev-console__modules h4,
      .phase45-dev-console__features h4 {
        font-size: 0.74rem;
        font-weight: 600;
        color: #6cf4ff;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .phase45-dev-console__list {
        display: grid;
        gap: 4px;
        max-height: 92px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .phase45-dev-console__list::-webkit-scrollbar {
        width: 6px;
      }
      .phase45-dev-console__list::-webkit-scrollbar-thumb {
        background: rgba(0, 255, 170, 0.25);
        border-radius: 999px;
      }
      html[data-phase45-reduced-motion="true"] * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      html[data-phase45-high-contrast="true"] body {
        filter: contrast(1.2) saturate(1.1);
      }
      html[data-phase45-high-contrast="true"] * {
        text-shadow: none !important;
      }
      @media (max-width: 720px) {
        .phase45-dev-console {
          left: 12px;
          right: 12px;
          width: auto;
          bottom: 12px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function createOverlay() {
    const overlay = document.createElement('aside');
    overlay.className = 'phase45-dev-console';
    overlay.setAttribute('data-collapsed', 'false');

    const header = document.createElement('header');
    header.className = 'phase45-dev-console__header';
    header.innerHTML = `
      <span class="phase45-dev-console__title">Phase ${state.experience.phase} · Entry ${state.experience.entry}</span>
    `;

    const collapseButton = document.createElement('button');
    collapseButton.className = 'phase45-dev-console__toggle';
    collapseButton.type = 'button';
    collapseButton.textContent = 'Collapse';
    collapseButton.addEventListener('click', () => {
      const current = overlay.getAttribute('data-collapsed') === 'true';
      overlay.setAttribute('data-collapsed', current ? 'false' : 'true');
      collapseButton.textContent = current ? 'Collapse' : 'Expand';
    });

    header.appendChild(collapseButton);

    const body = document.createElement('section');
    body.className = 'phase45-dev-console__body';

    const meta = document.createElement('div');
    meta.className = 'phase45-dev-console__meta';
    meta.innerHTML = `
      <div><strong>${state.experience.name}</strong></div>
      <div>Version ${state.experience.version}</div>
      <div class="phase45-dev-console__status">
        <span class="phase45-dev-console__status-dot" aria-hidden="true"></span>
        <span data-phase45-fps>FPS: syncing…</span>
      </div>
    `;
    state.fpsEl = meta.querySelector('[data-phase45-fps]');

    const prefs = document.createElement('div');
    prefs.className = 'phase45-dev-console__prefs';
    prefs.appendChild(createPrefRow('Reduced Motion', 'reducedMotion'));
    prefs.appendChild(createPrefRow('High Contrast', 'highContrast'));
    prefs.appendChild(createPrefRow('Telemetry Logs', 'telemetry'));

    body.appendChild(meta);

    if (state.experience.modules.length) {
      const modules = document.createElement('div');
      modules.className = 'phase45-dev-console__modules';
      modules.innerHTML = '<h4>Core Modules</h4>';
      const list = document.createElement('div');
      list.className = 'phase45-dev-console__list';
      state.experience.modules.forEach((module) => {
        const chip = document.createElement('div');
        chip.className = 'phase45-dev-console__chip';
        chip.textContent = module;
        list.appendChild(chip);
      });
      modules.appendChild(list);
      body.appendChild(modules);
    }

    if (state.experience.features.length) {
      const features = document.createElement('div');
      features.className = 'phase45-dev-console__features';
      features.innerHTML = '<h4>Feature Highlights</h4>';
      const list = document.createElement('div');
      list.className = 'phase45-dev-console__list';
      state.experience.features.forEach((feature) => {
        const pill = document.createElement('div');
        pill.className = 'phase45-dev-console__chip';
        pill.textContent = feature;
        list.appendChild(pill);
      });
      features.appendChild(list);
      body.appendChild(features);
    }

    body.appendChild(prefs);

    if (state.experience.telemetryNotes) {
      const notes = document.createElement('div');
      notes.className = 'phase45-dev-console__features';
      notes.innerHTML = `
        <h4>Telemetry</h4>
        <div>${state.experience.telemetryNotes}</div>
      `;
      body.appendChild(notes);
    }

    overlay.appendChild(header);
    overlay.appendChild(body);
    return overlay;
  }

  function createPrefRow(label, key) {
    const wrapper = document.createElement('div');
    wrapper.className = 'phase45-dev-console__pref';

    const title = document.createElement('span');
    title.textContent = label;

    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.prefKey = key;
    button.addEventListener('click', () => {
      state.prefs[key] = !state.prefs[key];
      persistPrefs();
      applyPrefs();
      updateOverlay();
      dispatchPrefs();
      if (key === 'telemetry' && state.prefs.telemetry) {
        logTelemetry('Telemetry toggled on via developer console');
      }
    });

    wrapper.appendChild(title);
    wrapper.appendChild(button);
    return wrapper;
  }

  function updateOverlay() {
    if (!state.overlay) {
      return;
    }
    state.overlay
      .querySelectorAll('button[data-pref-key]')
      .forEach((button) => {
        const key = button.dataset.prefKey;
        const active = Boolean(state.prefs[key]);
        button.dataset.active = String(active);
        button.textContent = active ? 'On' : 'Off';
      });
    if (state.fpsEl) {
      state.fpsEl.textContent = `FPS: ${state.fps}`;
    }
  }

  function applyPrefs() {
    const root = document.documentElement;
    root.setAttribute('data-phase45-reduced-motion', String(Boolean(state.prefs.reducedMotion)));
    root.setAttribute('data-phase45-high-contrast', String(Boolean(state.prefs.highContrast)));
    if (state.prefs.telemetry) {
      logTelemetry('Telemetry active');
    }
  }

  function dispatchPrefs() {
    const event = new CustomEvent('phase45:preferences', {
      detail: { ...state.prefs },
    });
    window.dispatchEvent(event);
  }

  function startFpsLoop() {
    const step = (now) => {
      state.frames += 1;
      if (now - state.lastFrameTime >= 1000) {
        state.fps = Math.max(1, Math.round((state.frames * 1000) / (now - state.lastFrameTime)));
        state.frames = 0;
        state.lastFrameTime = now;
        updateOverlay();
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function logTelemetry(message) {
    if (!state.prefs.telemetry) {
      return;
    }
    const stamp = new Date().toISOString();
    console.info(`%c[Phase45] %c${stamp}%c ${message}`, 'color:#00ffaa;', 'color:#6cf4ff;', 'color:#e6fff5;');
  }

  function initMediaListeners() {
    attachMediaListener(mediaQueries.reducedMotion, 'reducedMotion');
    attachMediaListener(mediaQueries.highContrast, 'highContrast');
  }

  function matchMediaSafe(query) {
    if (typeof window.matchMedia !== 'function') {
      return null;
    }
    try {
      return window.matchMedia(query);
    } catch (error) {
      console.warn('[Phase45DevConsole] matchMedia error', error);
      return null;
    }
  }

  function attachMediaListener(mediaQuery, key) {
    if (!mediaQuery || !(key in state.prefs)) {
      return;
    }

    const handler = (event) => {
      state.prefs[key] = event.matches;
      persistPrefs();
      applyPrefs();
      updateOverlay();
      dispatchPrefs();
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handler);
    }
  }
})();
