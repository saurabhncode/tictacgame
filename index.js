const board = Array(9).fill(null);
const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
let gameOver = false;

// Create the 3x3 board in DOM
for (let i = 0; i < 9; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.addEventListener("click", () => handleClick(i));
  boardEl.appendChild(cell);
}

function render() {
  [...boardEl.children].forEach((cell, i) => {
    cell.textContent = board[i] || "";
    cell.style.backgroundColor = ""; // reset colors each time
  });
}

function checkWinner() {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      // highlight only winning cells
      pattern.forEach(index => {
        boardEl.children[index].style.backgroundColor = "lightgreen";
      });
      gameOver = true;
      statusEl.textContent = `${board[a]} Wins!`;
      resetBtn.style.display = "block";
      return board[a];
    }
  }
  if (!board.includes(null)) {
    gameOver = true;
    statusEl.textContent = "Draw!";
    resetBtn.style.display = "block";
  }
  return null;
}

function handleClick(i) {
  if (!board[i] && !gameOver) {
    board[i] = "X";
    render();
    if (!checkWinner()) {
      aiMove();
      checkWinner();
    }
  }
}

function aiMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  board[move] = "O";
  render();
}

const scores = {
  O: 1,   // AI win
  X: -1,  // Human win
  tie: 0
};

function minimax(newBoard, depth, isMaximizing) {
  let result = checkWinnerForAI(newBoard);
  if (result !== null) {
    return scores[result];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (!newBoard[i]) {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinnerForAI(b) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a, b1, c] of winPatterns) {
    if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
      return b[a];
    }
  }
  if (!b.includes(null)) {
    return "tie";
  }
  return null;
}


resetBtn.addEventListener("click", resetGame);

function resetGame() {
  for (let i = 0; i < board.length; i++) board[i] = null;
  gameOver = false;
  render();
  statusEl.textContent = "Your Turn (X)";
  resetBtn.style.display = "none";
}

render();
