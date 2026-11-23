import test from 'node:test';
import assert from 'node:assert/strict';
import { WIN_LINES, getResult, shuffledPairs } from './engine.js';
test('both players can win on all eight lines', () => {
  for (const player of ['X', 'O']) for (const line of WIN_LINES) {
    const board = Array(9).fill('');
    line.forEach(i => { board[i] = player; });
    assert.deepEqual(getResult(board), { winner: player, line });
  }
});
test('distinguishes an unfinished game, a draw, and a last-move win', () => {
  assert.equal(getResult(Array(9).fill('')), null);
  assert.deepEqual(getResult(['X','O','X','X','O','O','O','X','X']), { winner: 'draw', line: [] });
  assert.equal(getResult(['X','O','X','O','X','O','O','X','X']).winner, 'X');
});
test('every shuffled memory deck contains exactly six pairs', () => {
  for (let run = 0; run < 100; run++) {
    const deck = shuffledPairs();
    assert.equal(deck.length, 12);
    assert.equal(new Set(deck).size, 6);
    for (const symbol of new Set(deck)) assert.equal(deck.filter(x => x === symbol).length, 2);
  }
});
