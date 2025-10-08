(function () {
  'use strict';

  function collectRegistry() {
    const registry = window.VISUAL_CODEX_DATA || {};
    if (!Object.keys(registry).length) {
      console.error('❌ VISUAL_CODEX_DATA is not available or empty.');
    }
    return registry;
  }

  function requestedKey(defaultKey, registry) {
    let key = defaultKey;

    try {
      const searchParams = new URLSearchParams(window.location.search);
      key =
        searchParams.get('gallery') ||
        searchParams.get('dataset') ||
        searchParams.get('mode') ||
        key;

      if (key) {
        key = key.toLowerCase();
      }

      if (!registry[key]) {
        const hashKey = window.location.hash ? window.location.hash.substring(1).toLowerCase() : null;
        if (hashKey && registry[hashKey]) {
          key = hashKey;
        }
      }
    } catch (error) {
      console.warn('⚠️ Unable to parse gallery selection from URL.', error);
    }

    return key;
  }

  function applyPageTitle(dataset) {
    if (dataset?.pageTitle) {
      document.title = dataset.pageTitle;
    }
  }

  function applyTheme(dataset, registry) {
    const body = document.body;
    if (!body) return;

    const themeClass = dataset?.themeClass;
    Object.values(registry).forEach((entry) => {
      if (entry?.themeClass) {
        body.classList.remove(entry.themeClass);
      }
    });

    if (themeClass) {
      body.classList.add(themeClass);
    }
  }

  function configureDatasetSwitcher(registry, activeKey) {
    const container = document.getElementById('datasetSwitcher');
    if (!container) return;

    const currentPath = window.location.pathname;
    const baseSearchParams = new URLSearchParams(window.location.search);

    container.querySelectorAll('[data-gallery-target]').forEach((link) => {
      const targetKey = link.dataset.galleryTarget;
      const dataset = registry[targetKey];

      if (!dataset) {
        link.classList.add('is-disabled');
        link.setAttribute('aria-disabled', 'true');
        return;
      }

      link.textContent = dataset.switchLabel || dataset.title || targetKey;
      link.classList.remove('is-disabled');
      link.removeAttribute('aria-disabled');

      const params = new URLSearchParams(baseSearchParams.toString());
      params.set('gallery', targetKey);
      params.delete('dataset');
      params.delete('mode');

      const queryString = params.toString();
      link.href = queryString ? `${currentPath}?${queryString}` : currentPath;

      const isActive = targetKey === activeKey;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function resolveDataset() {
    const registry = collectRegistry();
    const defaultKey = document.body?.dataset?.galleryKey || 'proper';
    let key = requestedKey(defaultKey, registry);

    if (!registry[key]) {
      console.warn(`⚠️ Requested dataset "${key}" is unavailable. Falling back to default.`);
      if (registry[defaultKey]) {
        key = defaultKey;
      } else {
        const firstAvailable = Object.keys(registry)[0];
        key = firstAvailable;
      }
    }

    const dataset = registry[key];
    if (!dataset) {
      console.error('❌ Unable to locate a gallery dataset.');
      return { dataset: null, key: null, registry };
    }

    const body = document.body;
    if (body) {
      body.dataset.galleryKey = key;
      body.classList.add('gallery-shell');
    }

    applyTheme(dataset, registry);
    applyPageTitle(dataset);
    configureDatasetSwitcher(registry, key);

    return { dataset, key, registry };
  }

  window.addEventListener('DOMContentLoaded', () => {
    const { dataset, key } = resolveDataset();
    if (!dataset) {
      return;
    }

    if (typeof window.VisualCodexGallery !== 'function') {
      console.error('❌ VisualCodexGallery constructor is not available.');
      return;
    }

    console.log(`🚀 Bootstrapping Visual Codex gallery for dataset: ${key}`);
    const gallery = new window.VisualCodexGallery(dataset);
    gallery.startRenderLoop();
    window.visualCodexGallery = gallery;
  });
})();
