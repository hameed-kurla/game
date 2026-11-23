import { getResult, shuffledPairs } from './engine.js';

const dialog = document.querySelector('#game-dialog');
const content = document.querySelector('#game-content');
let cleanup = () => {};
const best = {
  get(key) { try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; } },
  set(key, value) { try { localStorage.setItem(key, String(value)); } catch { /* Games still work when storage is unavailable. */ } }
};
const statusElement = () => {
  const status = document.createElement('p');
  status.className = 'game-status';
  status.setAttribute('role', 'status');
  content.append(status);
  return status;
};
function resetButton(label, action) {
  const button = document.createElement('button');
  button.className = 'reset-button';
  button.textContent = label;
  button.addEventListener('click', action);
  content.append(button);
}
function prepare(title, instructions) {
  cleanup();
  cleanup = () => {};
  content.replaceChildren();
  document.querySelector('#dialog-title').textContent = title;
  document.querySelector('#game-instructions').textContent = instructions;
}

function memory() {
  prepare('Memory Match', 'Flip two cards at a time. Find all six pairs in as few moves as you can.');
  const deck = shuffledPairs();
  let selected = [], matched = new Set(), moves = 0, locked = false, timer;
  cleanup = () => clearTimeout(timer);
  const status = statusElement();
  status.textContent = '0 moves · 0 of 6 pairs';
  const board = document.createElement('div');
  board.className = 'memory-board';
  content.append(board);
  const buttons = deck.map((symbol, index) => {
    const button = document.createElement('button');
    button.className = 'memory-tile';
    button.textContent = '?';
    button.setAttribute('aria-label', `Card ${index + 1}, face down`);
    button.addEventListener('click', () => {
      if (locked || matched.has(index) || selected.includes(index)) return;
      selected.push(index);
      button.textContent = symbol;
      button.classList.add('revealed');
      button.setAttribute('aria-label', `Card ${index + 1}, ${symbol}`);
      if (selected.length !== 2) return;
      moves++;
      const [a,b] = selected;
      if (deck[a] === deck[b]) {
        selected.forEach(i => {
          matched.add(i);
          buttons[i].classList.add('matched');
          buttons[i].disabled = true;
          buttons[i].setAttribute('aria-label', `Card ${i + 1}, ${deck[i]}, matched`);
        });
        selected = [];
      } else {
        locked = true;
        timer = setTimeout(() => {
          selected.forEach(i => {
            buttons[i].textContent = '?';
            buttons[i].classList.remove('revealed');
            buttons[i].setAttribute('aria-label', `Card ${i + 1}, face down`);
          });
          selected = [];
          locked = false;
        }, 850);
      }
      status.textContent = `${moves} ${moves === 1 ? 'move' : 'moves'} · ${matched.size / 2} of 6 pairs`;
      if (matched.size === 12) {
        const previous = best.get('arcade-memory-best');
        if (!previous || moves < previous) best.set('arcade-memory-best', moves);
        status.textContent = `All matched in ${moves} moves! Best: ${best.get('arcade-memory-best')} moves.`;
      }
    });
    board.append(button);
    return button;
  });
  resetButton('Shuffle & restart', memory);
}

function tic() {
  prepare('Tic-Tac-Toe', 'Share this screen with a friend. X goes first. Make a line of three to win.');
  const board = Array(9).fill('');
  let player = 'X', finished = false;
  const status = statusElement();
  status.textContent = "X's turn";
  const grid = document.createElement('div');
  grid.className = 'tic-board';
  content.append(grid);
  const cells = board.map((_, index) => {
    const cell = document.createElement('button');
    cell.className = 'tic-cell';
    cell.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}, empty`);
    cell.addEventListener('click', () => {
      if (finished || board[index]) return;
      board[index] = player;
      cell.textContent = player;
      cell.setAttribute('aria-label', `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}, ${player}`);
      cell.disabled = true;
      const result = getResult(board);
      if (result) {
        finished = true;
        status.textContent = result.winner === 'draw' ? "It's a draw. A worthy rivalry!" : `${result.winner} wins! A beautiful line of three.`;
        result.line.forEach(i => cells[i].classList.add('winner'));
        cells.forEach(c => { c.disabled = true; });
      } else {
        player = player === 'X' ? 'O' : 'X';
        status.textContent = `${player}'s turn`;
      }
    });
    grid.append(cell);
    return cell;
  });
  resetButton('Play again', tic);
}

function reflex() {
  prepare('Quick Reflex', 'Start a round, then wait for green. Click, tap, or press Space when it changes.');
  let state = 'idle', timer, started;
  const status = statusElement();
  status.textContent = 'Take a breath. Find your focus.';
  const pad = document.createElement('button');
  pad.className = 'reaction-pad';
  pad.textContent = 'Click to start ↗';
  content.append(pad);
  const record = document.createElement('p');
  record.className = 'best';
  const updateBest = () => { record.textContent = best.get('arcade-reflex-best') ? `Personal best: ${best.get('arcade-reflex-best')} ms · saved in this browser` : 'Your personal best will be saved in this browser.'; };
  updateBest();
  content.append(record);
  function cancelRound(message) {
    clearTimeout(timer);
    state = 'idle';
    pad.className = 'reaction-pad';
    pad.textContent = 'Try again ↗';
    status.textContent = message;
  }
  function action() {
    if (state === 'waiting') { cancelRound('A little too early! Wait until the pad turns green.'); return; }
    if (state === 'ready') {
      const elapsed = Math.max(1, Math.round(performance.now() - started));
      const previous = best.get('arcade-reflex-best');
      if (!previous || elapsed < previous) best.set('arcade-reflex-best', elapsed);
      state = 'idle';
      pad.className = 'reaction-pad';
      pad.textContent = `${elapsed} ms · Play again ↗`;
      status.textContent = !previous || elapsed < previous ? 'A new personal best!' : 'Nice! Ready for another round?';
      updateBest();
      return;
    }
    state = 'waiting';
    pad.className = 'reaction-pad waiting';
    pad.textContent = 'Wait for green…';
    status.textContent = 'Hold steady…';
    timer = setTimeout(() => {
      state = 'ready';
      pad.className = 'reaction-pad ready';
      pad.textContent = 'GO!';
      status.textContent = 'React now!';
      // Measure from the color change using the browser's monotonic clock.
      started = performance.now();
    }, 1600 + Math.random() * 2800);
  }
  pad.addEventListener('click', action);
  const keydown = event => {
    if (event.code !== 'Space' || event.target.closest('#close-dialog')) return;
    event.preventDefault();
    if (!event.repeat) action();
  };
  const visibility = () => { if (document.hidden && state !== 'idle') cancelRound('Round paused while you were away. Try again.'); };
  dialog.addEventListener('keydown', keydown);
  document.addEventListener('visibilitychange', visibility);
  cleanup = () => { clearTimeout(timer); dialog.removeEventListener('keydown', keydown); document.removeEventListener('visibilitychange', visibility); };
}

const games = { memory, tic, reflex };
document.querySelectorAll('[data-game]').forEach(button => button.addEventListener('click', () => {
  games[button.dataset.game]();
  dialog.showModal();
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => { cleanup(); cleanup = () => {}; });
