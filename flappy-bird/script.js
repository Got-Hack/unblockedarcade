const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
canvas.width = 400;
canvas.height = 600;

// Game variables
let birdY = canvas.height / 2;
let birdX = canvas.width / 4;
let birdVelocity = 0;
let gravity = 0.5;
let isGameStarted = false;
let pipes = [];
let pipeWidth = 50;
let gap = 150;
let score = 0;
const birdSize = 20;
const pipeSpeed = 2;

// Initialize the game
function resetGame() {
  birdY = canvas.height / 2;
  birdVelocity = 0;
  isGameStarted = false;
  pipes = [];
  score = 0;
  spawnPipe();
  drawStartScreen();
}

// Draw bird
function drawBird() {
  ctx.fillStyle = '#f77f00';
  ctx.beginPath();
  ctx.arc(birdX, birdY, birdSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = '#008000';
  pipes.forEach((pipe) => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
    // Bottom pipe
    ctx.fillRect(pipe.x, canvas.height - pipe.bottomHeight, pipeWidth, pipe.bottomHeight);
  });
}

// Spawn pipes
function spawnPipe() {
  const pipeTopHeight = Math.random() * (canvas.height - gap - 100) + 50;
  const pipeBottomHeight = canvas.height - pipeTopHeight - gap;
  pipes.push({
    x: canvas.width,
    topHeight: pipeTopHeight,
    bottomHeight: pipeBottomHeight,
  });
}

// Update pipes
function updatePipes() {
  pipes.forEach((pipe, index) => {
    pipe.x -= pipeSpeed;
    if (pipe.x + pipeWidth < 0) {
      pipes.splice(index, 1);
      score++;
      spawnPipe();
    }
  });
}

// Collision detection
function checkCollision() {
  if (birdY + birdSize / 2 > canvas.height || birdY - birdSize / 2 < 0) {
    return true;
  }
  for (const pipe of pipes) {
    if (
      birdX + birdSize / 2 > pipe.x &&
      birdX - birdSize / 2 < pipe.x + pipeWidth &&
      (birdY - birdSize / 2 < pipe.topHeight || birdY + birdSize / 2 > canvas.height - pipe.bottomHeight)
    ) {
      return true;
    }
  }
  return false;
}

// Draw start screen
function drawStartScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Press SPACE to Start!', canvas.width / 2, canvas.height / 2);
  drawBird();
}

// Main game loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameStarted) {
    drawStartScreen();
    return;
  }

  // Draw bird and pipes
  drawBird();
  drawPipes();

  // Apply gravity
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Update pipes
  updatePipes();

  // Check for collisions
  if (checkCollision()) {
    resetGame(); // Automatically reset the game on collision
    return;
  }

  // Draw score
  ctx.fillStyle = '#000';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(animate);
}

// Handle space key
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    birdVelocity = -8; // Flap up
    if (!isGameStarted) {
      isGameStarted = true;
      animate();
    }
  }
});

// Start the game
resetGame();
