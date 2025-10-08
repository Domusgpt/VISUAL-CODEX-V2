import { registerEffectPage } from './effect-twin.js';

const script = document.currentScript;
const dataset = script?.dataset ?? {};

const options = {};

if (dataset.effectId) {
    const value = Number(dataset.effectId);
    if (!Number.isNaN(value)) {
        options.effectId = value;
    }
}

if (dataset.effectFile) {
    options.file = dataset.effectFile;
}

if (dataset.returnUrl) {
    options.returnUrl = dataset.returnUrl;
}

if (dataset.openInNewTab) {
    const normalized = dataset.openInNewTab.toLowerCase();
    if (normalized === 'false' || normalized === '0' || normalized === 'no') {
        options.openInNewTab = false;
    } else if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
        options.openInNewTab = true;
    }
}

registerEffectPage(options);
