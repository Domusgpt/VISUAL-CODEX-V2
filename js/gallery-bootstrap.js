(function () {
  'use strict';

  function resolveDataset() {
    const key = document.body?.dataset?.galleryKey || 'proper';
    const registry = window.VISUAL_CODEX_DATA || {};
    const dataset = registry[key];
    if (!dataset) {
      console.error(`❌ Unable to locate dataset for key "${key}". Available keys:`, Object.keys(registry));
    }
    return { dataset, key };
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
