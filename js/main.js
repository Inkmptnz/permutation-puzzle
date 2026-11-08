import { parseCell } from './rules.js';
import {
  createState, clampN, setCell, toggleRowLabel, toggleColLabel,
  resize, clearNumbers, randomizeLabels, setCheck, hasAnyNumber, EXAMPLES, loadExample,
} from './state.js';
import { save, load } from './storage.js';
import { buildBoard, updateBoard, updateMissing, updateControls } from './render.js';

const state = load() ?? createState();

const linked = location.hash.match(/^#puzzle-(\d+)$/)?.[1];
if (linked in EXAMPLES) {
  loadExample(state, linked);
  save(state);
  history.replaceState(null, '', location.pathname + location.search);
}

const board = document.getElementById('board');
const missing = document.getElementById('missing');
const controls = {
  form: document.getElementById('settings'),
  size: document.getElementById('size'),
  check: document.getElementById('check'),
  clear: document.getElementById('clear'),
  random: document.getElementById('random'),
  caption: document.getElementById('caption'),
};

function update() {
  updateBoard(board, state);
  updateMissing(missing, state);
  updateControls(controls, state);
}

function commit() {
  save(state);
  update();
}

board.addEventListener('input', e => {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const r = Number(cell.dataset.r);
  const c = Number(cell.dataset.c);
  const value = parseCell(cell.value.replace(/\D/g, ''), state.n);
  if (value === undefined) {
    const old = state.grid[r][c];
    cell.value = old === null ? '' : String(old);
    return;
  }
  setCell(state, r, c, value);
  commit();
});

board.addEventListener('click', e => {
  const btn = e.target.closest('.label');
  if (!btn) return;
  if (btn.classList.contains('row')) toggleRowLabel(state, Number(btn.dataset.r));
  else toggleColLabel(state, Number(btn.dataset.c));
  commit();
});

const MOVES = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };

function focusCell(r, c) {
  board.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`)?.focus();
}

board.addEventListener('keydown', e => {
  const cell = e.target.closest('.cell');
  if (!cell) return;
  const r = Number(cell.dataset.r);
  const c = Number(cell.dataset.c);
  const { n } = state;
  if (e.key in MOVES) {
    e.preventDefault();
    const [dr, dc] = MOVES[e.key];
    focusCell(Math.min(n - 1, Math.max(0, r + dr)), Math.min(n - 1, Math.max(0, c + dc)));
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const next = r * n + c + 1;
    if (next < n * n) focusCell(Math.floor(next / n), next % n);
  }
});

board.addEventListener('focusin', e => {
  if (e.target.classList.contains('cell')) e.target.select();
});

controls.form.addEventListener('submit', e => {
  e.preventDefault();
  const n = clampN(controls.size.value);
  if (n === state.n && !hasAnyNumber(state)) {
    update();
    return;
  }
  if (hasAnyNumber(state) && !confirm('Das Spielfeld wird geleert. Fortfahren?')) {
    update();
    return;
  }
  resize(state, n);
  buildBoard(board, state);
  commit();
});

controls.check.addEventListener('change', () => {
  setCheck(state, controls.check.checked);
  commit();
});

controls.clear.addEventListener('click', () => {
  if (hasAnyNumber(state) && !confirm('Alle eingetragenen Zahlen löschen?')) return;
  clearNumbers(state);
  commit();
});

document.querySelectorAll('.example').forEach(btn => btn.addEventListener('click', () => {
  if (hasAnyNumber(state) && !confirm('Das Spielfeld wird geleert. Fortfahren?')) return;
  loadExample(state, btn.dataset.example);
  buildBoard(board, state);
  commit();
}));

controls.random.addEventListener('click', () => {
  randomizeLabels(state);
  commit();
});

buildBoard(board, state);
update();
