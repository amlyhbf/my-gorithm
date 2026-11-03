// Pure recommendation helpers: preserve user-controlled category weights without
// duplicating an item or repeatedly prioritizing the same registered entries.
export const FEED_CATEGORIES = ['study', 'tech', 'culture', 'hobby'];

function shuffledTieRank(id, seed) {
  let value = (seed >>> 0) || 2166136261;
  for (let i = 0; i < id.length; i++) {
    value = Math.imul(value ^ id.charCodeAt(i), 16777619) >>> 0;
  }
  return value;
}

// Largest-remainder allocation with per-category inventory limits.
// When one category runs out, only other enabled categories can fill its slots.
export function allocateAvailableSlots(weights, capacity, requested) {
  const counts = Object.fromEntries(FEED_CATEGORIES.map(c => [c, 0]));
  const total = Math.min(
    Math.max(0, Math.floor(requested) || 0),
    FEED_CATEGORIES.reduce((sum, c) => sum + (weights[c] > 0 ? Math.max(0, capacity[c] || 0) : 0), 0)
  );
  let remaining = total;
  while (remaining > 0) {
    const active = FEED_CATEGORIES.filter(c => weights[c] > 0 && counts[c] < (capacity[c] || 0));
    if (!active.length) break;
    const weightSum = active.reduce((sum, c) => sum + weights[c], 0);
    const ideals = active.map(c => ({ c, exact: remaining * weights[c] / weightSum }));
    let allocated = 0;
    for (const { c, exact } of ideals) {
      const add = Math.min(Math.floor(exact), (capacity[c] || 0) - counts[c]);
      counts[c] += add;
      allocated += add;
    }
    remaining -= allocated;
    if (!remaining) break;
    ideals.sort((a, b) =>
      (b.exact % 1) - (a.exact % 1) ||
      weights[b.c] - weights[a.c] ||
      FEED_CATEGORIES.indexOf(a.c) - FEED_CATEGORIES.indexOf(b.c)
    );
    // Award each remainder once before recalculating after inventory caps.
    for (const { c } of ideals) {
      if (!remaining) break;
      if (counts[c] >= (capacity[c] || 0)) continue;
      counts[c] += 1;
      remaining -= 1;
    }
  }
  return counts;
}

export function recommendPage(items, weights, { limit = 12, type = 'all', excludeIds = [], recentIds = [], seed = 0 } = {}) {
  const excluded = new Set(excludeIds);
  const unique = new Set();
  const pool = items.filter(item => {
    if (!item?.id || unique.has(item.id)) return false;
    unique.add(item.id);
    return !excluded.has(item.id) && weights[item.category] > 0 && (type === 'all' || item.type === type);
  });
  const recentRank = new Map(recentIds.map((id, index) => [id, index]));
  const buckets = {};
  const capacity = {};
  for (const c of FEED_CATEGORIES) {
    buckets[c] = pool.filter(item => item.category === c).sort((a, b) => {
      const aRank = recentRank.has(a.id) ? recentRank.get(a.id) : -1;
      const bRank = recentRank.has(b.id) ? recentRank.get(b.id) : -1;
      return aRank - bRank || shuffledTieRank(a.id, seed) - shuffledTieRank(b.id, seed);
    });
    capacity[c] = buckets[c].length;
  }
  const quotas = allocateAvailableSlots(weights, capacity, limit);
  const order = [...FEED_CATEGORIES].sort((a, b) =>
    weights[b] - weights[a] || FEED_CATEGORIES.indexOf(a) - FEED_CATEGORIES.indexOf(b)
  );
  const selected = [];
  let round = 0;
  let any = true;
  while (any) {
    any = false;
    for (const c of order) {
      if (round < quotas[c]) {
        selected.push(buckets[c][round]);
        any = true;
      }
    }
    round++;
  }
  return { cards: selected, available: pool.length, remaining: pool.length - selected.length, quotas };
}

// Oldest -> newest. Previously shown cards can gradually return after
// the finite catalog is exhausted rather than repeating immediately.
export function updateRecentFeed(previous, newIds, maxLength = 120) {
  const next = [...previous.filter(id => !newIds.includes(id)), ...newIds];
  return [...new Set(next)].slice(-maxLength);
}
