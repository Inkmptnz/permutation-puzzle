import { MIN_N, MAX_N } from './rules.js';

export function clampN(n) {
  return Math.min(MAX_N, Math.max(MIN_N, Math.round(Number(n)) || MIN_N));
}

export function createState(n = 4) {
  n = clampN(n);
  return {
    n,
    grid: Array.from({ length: n }, () => Array(n).fill(null)),
    rowLabels: Array(n).fill('A'),
    colLabels: Array(n).fill('A'),
    checkEnabled: false,
  };
}

export function setCell(state, r, c, value) {
  state.grid[r][c] = value;
}

const flip = label => (label === 'A' ? 'D' : 'A');

export function toggleRowLabel(state, r) {
  state.rowLabels[r] = flip(state.rowLabels[r]);
}

export function toggleColLabel(state, c) {
  state.colLabels[c] = flip(state.colLabels[c]);
}

export function resize(state, n) {
  const { checkEnabled } = state;
  Object.assign(state, createState(n), { checkEnabled });
}

export function clearNumbers(state) {
  state.grid = state.grid.map(row => row.map(() => null));
}

export function randomizeLabels(state) {
  const rand = () => (Math.random() < 0.5 ? 'A' : 'D');
  state.rowLabels = state.rowLabels.map(rand);
  state.colLabels = state.colLabels.map(rand);
}

export const EXAMPLES = {
  1: { rowLabels: 'AAD', colLabels: 'AAD' },
  2: { rowLabels: 'AAD', colLabels: 'DAA' },
};

export function loadExample(state, key) {
  const { rowLabels, colLabels } = EXAMPLES[key];
  Object.assign(state, createState(rowLabels.length), {
    rowLabels: [...rowLabels],
    colLabels: [...colLabels],
    checkEnabled: true,
  });
}

export function setCheck(state, on) {
  state.checkEnabled = Boolean(on);
}

export function hasAnyNumber(state) {
  return state.grid.some(row => row.some(v => v !== null));
}
