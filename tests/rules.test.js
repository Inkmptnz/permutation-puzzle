import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseCell, lineStatus, colValues, findDuplicates, missingNumbers } from '../js/rules.js';
import { EXAMPLES } from '../js/state.js';

test('lineStatus', () => {
  assert.equal(lineStatus([null, null, null], 'A'), 'neutral');
  assert.equal(lineStatus([1, null, 5], 'A'), 'neutral');
  assert.equal(lineStatus([5, null, 1], 'A'), 'bad');
  assert.equal(lineStatus([5, null, 1], 'D'), 'neutral');
  assert.equal(lineStatus([1, 3, 7], 'A'), 'ok');
  assert.equal(lineStatus([1, 3, 7], 'D'), 'bad');
  assert.equal(lineStatus([3, 3, null], 'A'), 'bad');
  assert.equal(lineStatus([9, 4, 2], 'D'), 'ok');
});

test('parseCell', () => {
  assert.equal(parseCell('17', 4), undefined);
  assert.equal(parseCell('0', 4), undefined);
  assert.equal(parseCell('abc', 4), undefined);
  assert.equal(parseCell('', 4), null);
  assert.equal(parseCell('16', 4), 16);
  assert.equal(parseCell('100', 10), 100);
});

test('colValues', () => {
  assert.deepEqual(colValues([[1, 2], [3, 4]], 1), [2, 4]);
});

test('findDuplicates', () => {
  const dups = findDuplicates([[5, 1], [null, 5]]);
  assert.deepEqual([...dups].sort(), ['0,0', '1,1']);
  assert.equal(findDuplicates([[1, 2], [3, 4]]).size, 0);
});

test('missingNumbers', () => {
  assert.deepEqual(missingNumbers([[null, null], [null, null]], 2), [1, 2, 3, 4]);
  assert.deepEqual(missingNumbers([[4, null], [1, null]], 2), [2, 3]);
});

function countSolutions(rowLabels, colLabels) {
  const n = rowLabels.length;
  const values = Array.from({ length: n * n }, (_, i) => i + 1);
  let count = 0;
  const perms = function* (rest, acc) {
    if (rest.length === 0) yield acc;
    for (let i = 0; i < rest.length; i++) {
      yield* perms([...rest.slice(0, i), ...rest.slice(i + 1)], [...acc, rest[i]]);
    }
  };
  for (const p of perms(values, [])) {
    const grid = Array.from({ length: n }, (_, r) => p.slice(r * n, r * n + n));
    const rowsOk = rowLabels.every((l, r) => lineStatus(grid[r], l) === 'ok');
    if (rowsOk && colLabels.every((l, c) => lineStatus(colValues(grid, c), l) === 'ok')) count++;
  }
  return count;
}

test('Übungsbeispiele: 1 lösbar, 2 unlösbar', () => {
  assert.equal(countSolutions([...EXAMPLES[1].rowLabels], [...EXAMPLES[1].colLabels]), 60);
  assert.equal(countSolutions([...EXAMPLES[2].rowLabels], [...EXAMPLES[2].colLabels]), 0);
});
