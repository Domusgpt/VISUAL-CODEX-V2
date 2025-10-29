const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const demos = [
  {
    name: 'enhanced vaporwave demo',
    file: 'demos/enhanced-vaporwave-system-demo.html',
    storageKey: 'enhancedVaporwaveSnapshot',
    control: { selector: '#opacityControl', modified: 90 },
  },
  {
    name: 'neoskeuomorphic holographic demo',
    file: 'demos/neoskeuomorphic-holographic-ui-demo.html',
    storageKey: 'neoskeuoSnapshot',
    control: { selector: '#depthControl', modified: 1.3 },
  },
  {
    name: 'vib34d dashboard demo',
    file: 'demos/vib34d-editor-dashboard-index-demo.html',
    storageKey: 'vib34dSnapshot',
    control: { selector: '#speedControl', modified: 180 },
  },
  {
    name: 'working final experience demo',
    file: 'demos/working-final-version-demo.html',
    storageKey: 'workingFinalSnapshot',
    control: { selector: '#chaosDial', modified: 24 },
  },
];

function toFileUrl(relativePath) {
  return pathToFileURL(path.resolve(__dirname, '..', relativePath)).href;
}

async function setRangeValue(page, { selector, modified }) {
  await page.evaluate(({ selector, value }) => {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Unable to locate range control: ${selector}`);
    }
    element.value = String(value);
    element.dispatchEvent(new Event('input', { bubbles: true }));
  }, { selector, value: modified });
}

async function expectRangeValue(page, selector, expected) {
  const actual = await page.evaluate((target) => {
    const element = document.querySelector(target);
    if (!element) {
      throw new Error(`Unable to locate range control for expectation: ${target}`);
    }
    return Number(element.value);
  }, selector);

  expect(actual).toBeCloseTo(Number(expected), 2);
}

async function togglePrefersContrast(page, matches) {
  await page.evaluate((flag) => {
    if (typeof window.__setPrefersContrast === 'function') {
      window.__setPrefersContrast(flag);
      return;
    }

    const query = window.matchMedia('(prefers-contrast: more)');
    if (typeof query.dispatchEvent === 'function') {
      try {
        const event = typeof MediaQueryListEvent === 'function'
          ? new MediaQueryListEvent('change', { matches: flag })
          : new Event('change');
        if (!('matches' in event)) {
          Object.defineProperty(event, 'matches', { value: flag });
        }
        query.dispatchEvent(event);
        return;
      } catch (error) {
        console.warn('MediaQueryListEvent dispatch fallback:', error);
      }
    }

    const fallbackEvent = new Event('change');
    Object.defineProperty(fallbackEvent, 'matches', { value: flag });
    if (typeof query.onchange === 'function') {
      query.onchange(fallbackEvent);
    }
  }, matches);
}

demos.forEach((demo) => {
  test.describe(demo.name, () => {
    test('captures, restores, and respects contrast preferences', async ({ page }) => {
      await page.addInitScript(
        (key) => {
          try {
            window.localStorage.removeItem(key);
          } catch (error) {
            console.warn('Unable to clear snapshot key before test:', error);
          }
        },
        demo.storageKey
      );

      await page.addInitScript(() => {
        const originalMatchMedia = window.matchMedia ? window.matchMedia.bind(window) : null;
        const contrastState = { matches: false };
        const contrastListeners = new Set();
        const contrastStub = {
          media: '(prefers-contrast: more)',
          addEventListener: (type, listener) => {
            if (type === 'change') {
              contrastListeners.add(listener);
            }
          },
          removeEventListener: (type, listener) => {
            if (type === 'change') {
              contrastListeners.delete(listener);
            }
          },
          addListener: (listener) => contrastListeners.add(listener),
          removeListener: (listener) => contrastListeners.delete(listener),
          dispatchEvent: (event) => {
            contrastListeners.forEach((listener) => listener(event));
            return true;
          },
        };
        Object.defineProperty(contrastStub, 'matches', {
          get: () => contrastState.matches,
        });

        window.__setPrefersContrast = (value) => {
          contrastState.matches = Boolean(value);
          const event = { matches: contrastState.matches, media: '(prefers-contrast: more)' };
          contrastListeners.forEach((listener) => listener(event));
        };

        window.matchMedia = (query) => {
          if (query === '(prefers-contrast: more)') {
            return contrastStub;
          }
          return originalMatchMedia ? originalMatchMedia(query) : contrastStub;
        };
      });

      await page.goto(toFileUrl(demo.file));
      await page.waitForSelector('#snapshotSave');

      const restoreButton = page.locator('#snapshotRestore');
      const copyButton = page.locator('#snapshotCopy');
      const statusLabel = page.locator('#snapshotStatus');

      const baselineValue = await page.evaluate((selector) => {
        const element = document.querySelector(selector);
        return element ? Number(element.value) : NaN;
      }, demo.control.selector);
      expect(Number.isFinite(baselineValue)).toBe(true);

      await expect(restoreButton).toBeDisabled();
      await expect(copyButton).toBeDisabled();

      await page.click('#snapshotSave');
      await page.waitForFunction(() => !document.getElementById('snapshotRestore').disabled);

      await expect(copyButton).toBeEnabled();

      const storedSnapshot = await page.evaluate((key) => window.localStorage.getItem(key), demo.storageKey);
      expect(storedSnapshot).not.toBeNull();
      expect(() => JSON.parse(storedSnapshot)).not.toThrow();

      await setRangeValue(page, demo.control);
      await page.waitForFunction(() => document.getElementById('snapshotStatus').textContent.trim() === 'modified');

      await page.click('#snapshotRestore');
      await page.waitForFunction(() => document.getElementById('snapshotStatus').textContent.trim() === 'synced');

      await expect(statusLabel).toHaveText(/synced/i);
      await expectRangeValue(page, demo.control.selector, baselineValue);

      await togglePrefersContrast(page, true);
      await page.waitForFunction(() => document.body.classList.contains('high-contrast'));

      await togglePrefersContrast(page, false);
      await page.waitForFunction(() => !document.body.classList.contains('high-contrast'));
    });
  });
});
