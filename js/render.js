import { lineStatus, rowValues, colValues, findDuplicates, missingNumbers } from './rules.js';

const DIRECTION = { A: 'aufsteigend', D: 'absteigend' };

function labelButton(kind, index) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `label ${kind}`;
  btn.dataset[kind === 'row' ? 'r' : 'c'] = index;
  btn.innerHTML = '<span class="dir"></span><span class="mark" aria-hidden="true"></span>';
  return btn;
}

export function buildBoard(board, state) {
  const { n } = state;
  board.replaceChildren();
  board.style.setProperty('--n', n);

  const corner = document.createElement('div');
  corner.className = 'corner';
  board.append(corner);
  for (let c = 0; c < n; c++) board.append(labelButton('col', c));

  for (let r = 0; r < n; r++) {
    board.append(labelButton('row', r));
    for (let c = 0; c < n; c++) {
      const cell = document.createElement('input');
      cell.className = 'cell';
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.inputMode = 'numeric';
      cell.autocomplete = 'off';
      cell.maxLength = 3;
      cell.setAttribute('aria-label', `Zeile ${r + 1}, Spalte ${c + 1}`);
      board.append(cell);
    }
  }
}

function updateLabel(btn, label, status, name) {
  btn.querySelector('.dir').textContent = label;
  btn.querySelector('.mark').textContent = status === 'ok' ? '✓' : status === 'bad' ? '✗' : '';
  btn.classList.toggle('ok', status === 'ok');
  btn.classList.toggle('bad', status === 'bad');
  btn.title = `${DIRECTION[label]} – klicken zum Umschalten`;
  btn.setAttribute('aria-label', `${name}: ${DIRECTION[label]}`);
}

export function updateBoard(board, state) {
  const { n, grid, rowLabels, colLabels, checkEnabled } = state;
  const status = s => (checkEnabled ? s : 'neutral');
  const rowStatus = rowLabels.map((l, r) => status(lineStatus(rowValues(grid, r), l)));
  const colStatus = colLabels.map((l, c) => status(lineStatus(colValues(grid, c), l)));
  const dups = findDuplicates(grid);

  board.querySelectorAll('.label.row').forEach(btn => {
    const r = Number(btn.dataset.r);
    updateLabel(btn, rowLabels[r], rowStatus[r], `Zeile ${r + 1}`);
  });
  board.querySelectorAll('.label.col').forEach(btn => {
    const c = Number(btn.dataset.c);
    updateLabel(btn, colLabels[c], colStatus[c], `Spalte ${c + 1}`);
  });

  board.querySelectorAll('.cell').forEach(cell => {
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    const v = grid[r][c];
    const text = v === null ? '' : String(v);
    if (cell.value !== text) cell.value = text;
    cell.classList.toggle('row-ok', rowStatus[r] === 'ok');
    cell.classList.toggle('row-bad', rowStatus[r] === 'bad');
    cell.classList.toggle('col-ok', colStatus[c] === 'ok');
    cell.classList.toggle('col-bad', colStatus[c] === 'bad');
    cell.classList.toggle('dup', dups.has(`${r},${c}`));
  });

  board.setAttribute('aria-label', `Spielfeld ${n} × ${n}`);
}

export function updateMissing(el, state) {
  const missing = missingNumbers(state.grid, state.n);
  el.replaceChildren();
  if (missing.length === 0) {
    el.className = 'missing done';
    el.textContent = `Alle Zahlen von 1 bis ${state.n * state.n} sind eingetragen.`;
    return;
  }
  el.className = 'missing';
  el.append('Noch nicht eingetragen: ');
  const set = document.createElement('span');
  set.className = 'set';
  set.append('{ ');
  missing.forEach((v, i) => {
    const num = document.createElement('i');
    num.textContent = v;
    set.append(num);
    if (i < missing.length - 1) set.append(', ');
  });
  set.append(' }');
  el.append(set);
}

export function updateControls(controls, state) {
  controls.size.value = state.n;
  controls.check.checked = state.checkEnabled;
  controls.caption.textContent = `Spielfeld der Größe ${state.n} × ${state.n}.`;
}
