import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

import { PaginationController } from '../js/gallery/pagination.js';

function setupDom(markup = '<div id="controls"></div>') {
  const dom = new JSDOM(`<!DOCTYPE html><body>${markup}</body>`);
  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.CustomEvent = dom.window.CustomEvent;
  return dom;
}

function teardownDom() {
  delete global.window;
  delete global.document;
  delete global.HTMLElement;
  delete global.CustomEvent;
}

test('PaginationController hides controls when pagination unnecessary', (t) => {
  const dom = setupDom();
  t.after(teardownDom);

  const controls = dom.window.document.getElementById('controls');
  const pagination = new PaginationController({ itemsPerPage: 5 });

  pagination.attach(controls);
  pagination.setTotal(4);

  assert.equal(controls.style.display, 'none');
  assert.equal(controls.children.length, 0);
});

test('PaginationController renders controls and responds to button clicks', (t) => {
  const dom = setupDom();
  t.after(teardownDom);

  const controls = dom.window.document.getElementById('controls');
  const pagination = new PaginationController({ itemsPerPage: 5 });

  pagination.attach(controls);
  pagination.setTotal(12);

  assert.equal(controls.style.display, 'flex');
  assert.equal(controls.querySelectorAll('.pagination__button').length, 2);
  assert.equal(controls.querySelectorAll('.pagination__indicator').length, 1);
  assert.equal(controls.querySelectorAll('.pagination__progress-bar').length, 1);

  const indicator = controls.querySelector('.pagination__indicator');
  assert.equal(indicator.textContent.replace(/\s+/g, ' ').trim(), 'Page 1 / 3');

  const progressBar = controls.querySelector('.pagination__progress-bar');
  assert.ok(Math.abs(parseFloat(progressBar.style.width) - 33.3333) < 0.01);

  const nextButton = controls.querySelector('[data-direction="next"]');
  nextButton.click();

  assert.equal(pagination.currentPage, 1);

  const refreshedIndicator = controls.querySelector('.pagination__indicator');
  assert.equal(refreshedIndicator.textContent.replace(/\s+/g, ' ').trim(), 'Page 2 / 3');

  const refreshedProgressBar = controls.querySelector('.pagination__progress-bar');
  assert.ok(Math.abs(parseFloat(refreshedProgressBar.style.width) - 66.6666) < 0.01);

  const prevButton = controls.querySelector('[data-direction="prev"]');
  assert.equal(prevButton.disabled, false);
  prevButton.click();

  assert.equal(pagination.currentPage, 0);
});
