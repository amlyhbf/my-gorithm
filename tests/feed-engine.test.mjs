import test from 'node:test';
import assert from 'node:assert/strict';
import { allocateAvailableSlots, recommendPage, updateRecentFeed } from '../feed-engine.js';

const items = Object.entries({ study: 8, tech: 9, culture: 7, hobby: 8 }).flatMap(
  ([category, n]) => Array.from({ length: n }, (_, i) => ({
    id: `${category}-${i}`, category, type: i % 2 ? 'video' : 'article'
  }))
);
const balanced = { study: 50, tech: 50, culture: 50, hobby: 50 };

test('unequal weights award residual slots to distinct largest remainders', () => {
  assert.deepEqual(allocateAvailableSlots(
    { study: 10, tech: 20, culture: 30, hobby: 40 },
    { study: 8, tech: 9, culture: 7, hobby: 8 }, 12
  ), { study: 1, tech: 2, culture: 4, hobby: 5 });
});

test('initial balanced feed has 12 unique cards, three per category', () => {
  const result = recommendPage(items, balanced, { seed: 123 });
  assert.equal(result.cards.length, 12);
  assert.equal(new Set(result.cards.map(c => c.id)).size, 12);
  assert.deepEqual(result.quotas, { study: 3, tech: 3, culture: 3, hobby: 3 });
  assert.equal(result.remaining, 20);
});

test('load-more exposes 12, then 12, then 8 without repeats', () => {
  let shown = [], history = [];
  for (const expected of [12, 12, 8]) {
    const result = recommendPage(items, balanced, {
      seed: 123, excludeIds: shown, recentIds: history
    });
    assert.equal(result.cards.length, expected);
    shown.push(...result.cards.map(c => c.id));
    history = updateRecentFeed(history, result.cards.map(c => c.id));
  }
  assert.equal(new Set(shown).size, 32);
  assert.equal(recommendPage(items, balanced, { excludeIds: shown }).cards.length, 0);
});

test('a fresh visit prioritizes unshown cards over the previous feed', () => {
  const first = recommendPage(items, balanced, { seed: 44 });
  const recentIds = updateRecentFeed([], first.cards.map(c => c.id));
  const second = recommendPage(items, balanced, { seed: 65, recentIds });
  assert.equal(first.cards.filter(a => second.cards.some(b => a.id === b.id)).length, 0);
});

test('a single preferred category never duplicates its limited inventory', () => {
  const result = recommendPage(items, { study: 100, tech: 0, culture: 0, hobby: 0 });
  assert.equal(result.cards.length, 8);
  assert.equal(result.remaining, 0);
});

test('unavailable category quota goes to other enabled categories', () => {
  const onlyTwoStudy = [
    ...items.filter(item => item.category === 'study').slice(0, 2),
    ...items.filter(item => item.category === 'tech')
  ];
  const result = recommendPage(onlyTwoStudy, { study: 50, tech: 50, culture: 0, hobby: 0 });
  assert.equal(result.cards.length, 11);
  assert.equal(result.quotas.study, 2);
  assert.equal(result.quotas.tech, 9);
});

test('all-off, type filters, duplicate IDs and recent ordering', () => {
  assert.equal(recommendPage(items, { study: 0, tech: 0, culture: 0, hobby: 0 }).cards.length, 0);
  assert(recommendPage(items, balanced, { type: 'video' }).cards.every(c => c.type === 'video'));
  assert.equal(recommendPage([...items, items[0]], balanced, { limit: 60 }).cards.length, 32);
  assert.deepEqual(updateRecentFeed(['a', 'b', 'c'], ['b', 'd']), ['a', 'c', 'b', 'd']);
});

test('availability limits are never exceeded', () => {
  const counts = allocateAvailableSlots(
    { study: 50, tech: 50, culture: 0, hobby: 0 },
    { study: 1, tech: 9, culture: 0, hobby: 0 }, 12
  );
  assert.deepEqual(counts, { study: 1, tech: 9, culture: 0, hobby: 0 });
});
