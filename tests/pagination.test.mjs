import test from 'node:test';
import assert from 'node:assert/strict';

import { PaginationController } from '../js/gallery/pagination.js';

test('PaginationController defaults with empty data', () => {
  const pagination = new PaginationController({ itemsPerPage: 5 });

  pagination.setTotal(0);

  assert.equal(pagination.totalItems, 0);
  assert.equal(pagination.totalPages, 1);
  assert.equal(pagination.currentPage, 0);
  assert.deepEqual(pagination.getVisibleRange(), { start: 0, end: 0 });
});

test('PaginationController hides extra pages for small result sets', () => {
  const pagination = new PaginationController({ itemsPerPage: 5 });

  pagination.setTotal(3);

  assert.equal(pagination.totalPages, 1);
  assert.equal(pagination.currentPage, 0);
  assert.deepEqual(pagination.getVisibleRange(), { start: 0, end: 3 });
  assert.equal(pagination.containsIndex(2), true);
  assert.equal(pagination.containsIndex(3), false);
});

test('PaginationController clamps navigation within bounds', () => {
  const pagination = new PaginationController({ itemsPerPage: 5 });

  pagination.setTotal(23);
  assert.equal(pagination.totalPages, 5);

  pagination.goTo(7);
  assert.equal(pagination.currentPage, 4);

  pagination.goTo(-2);
  assert.equal(pagination.currentPage, 0);
});

test('PaginationController goToIndex calculates correct page', () => {
  const pagination = new PaginationController({ itemsPerPage: 5 });
  pagination.setTotal(12);

  assert.equal(pagination.goToIndex(10), true);
  assert.equal(pagination.currentPage, 2);
  assert.deepEqual(pagination.getVisibleRange(), { start: 10, end: 12 });

  assert.equal(pagination.goToIndex(12), false);
  assert.equal(pagination.currentPage, 2);
});

test('PaginationController triggers change handler', () => {
  const events = [];
  const pagination = new PaginationController({
    itemsPerPage: 5,
    onChange: (event) => events.push(event)
  });

  pagination.setTotal(15);
  pagination.goTo(1);
  pagination.next();
  pagination.previous();

  assert.deepEqual(events, [
    { source: 'pagination', page: 1 },
    { source: 'pagination', page: 2 },
    { source: 'pagination', page: 1 }
  ]);
});

test('PaginationController retains current page when range shrinks', () => {
  const pagination = new PaginationController({ itemsPerPage: 5 });

  pagination.setTotal(25);
  pagination.goTo(4);
  assert.equal(pagination.currentPage, 4);

  pagination.setTotal(12);
  assert.equal(pagination.currentPage, 2);
  assert.equal(pagination.totalPages, 3);
});
