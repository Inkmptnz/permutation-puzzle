import { MIN_N, MAX_N } from './rules.js';

const KEY = 'permutation-puzzle.v1';

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return isValid(data) ? data : null;
  } catch {
    return null;
  }
}

function isValid(s) {
  if (!s || typeof s !== 'object') return false;
  const { n, grid, rowLabels, colLabels, checkEnabled } = s;
  if (!Number.isInteger(n) || n < MIN_N || n > MAX_N) return false;
  if (typeof checkEnabled !== 'boolean') return false;
  const isLabels = l => Array.isArray(l) && l.length === n && l.every(x => x === 'A' || x === 'D');
  if (!isLabels(rowLabels) || !isLabels(colLabels)) return false;
  const isCell = v => v === null || (Number.isInteger(v) && v >= 1 && v <= n * n);
  return Array.isArray(grid) && grid.length === n &&
    grid.every(row => Array.isArray(row) && row.length === n && row.every(isCell));
}
