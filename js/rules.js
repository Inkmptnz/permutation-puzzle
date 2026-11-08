export const MIN_N = 2;
export const MAX_N = 10;

export function parseCell(str, n) {
  const s = String(str).trim();
  if (s === '') return null;
  if (!/^\d+$/.test(s)) return undefined;
  const v = Number(s);
  return v >= 1 && v <= n * n ? v : undefined;
}

export function lineStatus(values, label) {
  const filled = values.filter(v => v !== null);
  for (let i = 1; i < filled.length; i++) {
    const a = filled[i - 1];
    const b = filled[i];
    if (label === 'A' ? !(a < b) : !(a > b)) return 'bad';
  }
  return filled.length === values.length ? 'ok' : 'neutral';
}

export function rowValues(grid, r) {
  return grid[r];
}

export function colValues(grid, c) {
  return grid.map(row => row[c]);
}

export function findDuplicates(grid) {
  const positions = new Map();
  grid.forEach((row, r) => row.forEach((v, c) => {
    if (v === null) return;
    if (!positions.has(v)) positions.set(v, []);
    positions.get(v).push(`${r},${c}`);
  }));
  const dups = new Set();
  for (const keys of positions.values()) {
    if (keys.length > 1) keys.forEach(k => dups.add(k));
  }
  return dups;
}

export function missingNumbers(grid, n) {
  const used = new Set(grid.flat());
  const missing = [];
  for (let v = 1; v <= n * n; v++) {
    if (!used.has(v)) missing.push(v);
  }
  return missing;
}
