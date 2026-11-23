// Pure game rules, separated from the page so they are easy to learn and test.
export const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
export function getResult(board) {
  const line = WIN_LINES.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
  return line ? { winner: board[line[0]], line } : board.every(Boolean) ? { winner: 'draw', line: [] } : null;
}
export function shuffledPairs(random = Math.random) {
  const symbols = ['✦','☀','♥','♫','☂','☾'];
  const deck = [...symbols, ...symbols];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
