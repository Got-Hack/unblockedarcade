// Constants
const boardSize = 4;
let board = [];
let selectedTile = { row: null, col: null };

// Initialization
function createBoard() {
  const gameBoard = document.querySelector('.game-board');
  gameBoard.innerHTML = '';

  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = 0;
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.dataset.row = i;
      tile.dataset.col = j;
      tile.addEventListener('click', () => selectTile(i, j));
      gameBoard.appendChild(tile);
    }
  }
  spawnTile();
  spawnTile();
  renderBoard();
}

function renderBoard() {
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const tile = document.querySelector(`.tile[data-row="${i}"][data-col="${j}"]`);
      const value = board[i][j];
      tile.textContent = value === 0 ? '' : value;
      tile.dataset.value = value;

      // Highlight selected tile
      if (selectedTile.row === i && selectedTile.col === j) {
        tile.classList.add('selected');
      } else {
        tile.classList.remove('selected');
      }
    }
  }
}

function spawnTile() {
  const emptyTiles = [];
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        emptyTiles.push({ row: i, col: j });
      }
    }
  }
  if (emptyTiles.length > 0) {
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[randomTile.row][randomTile.col] = Math.random() < 0.9 ? 2 : 4;
  }
}

// Select tile on click
function selectTile(row, col) {
  selectedTile = { row, col };
  renderBoard();
}

// Handle key presses to move selected tile
function handleKeyPress(event) {
  if (selectedTile.row === null || selectedTile.col === null) return;

  const { row, col } = selectedTile;
  let newRow = row;
  let newCol = col;

  switch (event.key) {
    case 'ArrowUp':
      if (row > 0) newRow--;
      break;
    case 'ArrowDown':
      if (row < boardSize - 1) newRow++;
      break;
    case 'ArrowLeft':
      if (col > 0) newCol--;
      break;
    case 'ArrowRight':
      if (col < boardSize - 1) newCol++;
      break;
    default:
      return;
  }

  if (newRow !== row || newCol !== col) {
    moveTile(row, col, newRow, newCol);
    selectedTile = { row: newRow, col: newCol };
    spawnTile();
    renderBoard();
  }
}

function moveTile(fromRow, fromCol, toRow, toCol) {
  // Move tile if target is empty or merge is possible
  if (board[toRow][toCol] === 0) {
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = 0;
  } else if (board[toRow][toCol] === board[fromRow][fromCol]) {
    board[toRow][toCol] *= 2;
    board[fromRow][fromCol] = 0;
  }
}

// Restart the game
document.querySelector('.restart-btn').addEventListener('click', () => {
  selectedTile = { row: null, col: null };
  createBoard();
});

// Key press event listener
document.addEventListener('keydown', handleKeyPress);

// Start the game
createBoard();
