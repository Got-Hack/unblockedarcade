const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 800;
canvas.height = 400;

// Paddle and ball properties
const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 5;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Game state
let isGameStarted = false;
let leftPlayerReady = false;
let rightPlayerReady = false;
let leftHoldTime = 0;
let rightHoldTime = 0;

let leftScore = 0;
let rightScore = 0;

// Draw paddles
function drawPaddles() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(10, leftPaddleY, paddleWidth, paddleHeight); // Left paddle
  ctx.fillRect(canvas.width - 20, rightPaddleY, paddleWidth, paddleHeight); // Right paddle
}

// Draw ball
function drawBall() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(ballX, ballY, ballSize, ballSize);
}

// Draw score
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillText(`Left Player: ${leftScore}`, 50, 30);
  ctx.fillText(`Right Player: ${rightScore}`, canvas.width - 200, 30);
}

// Check collision with walls
function checkWallCollision() {
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY *= -1; // Reverse Y direction
  }
}

// Check collision with paddles
function checkPaddleCollision() {
  // Left paddle collision
  if (
    ballX <= 20 &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) {
    ballSpeedX *= -1; // Reverse X direction
    ballX = 20; // Adjust ball position
  }

  // Right paddle collision
  if (
    ballX + ballSize >= canvas.width - 20 &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) {
    ballSpeedX *= -1; // Reverse X direction
    ballX = canvas.width - 20 - ballSize; // Adjust ball position
  }
}

// Reset ball after a point
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX *= -1; // Reverse direction
}

// Check for scoring
function checkScoring() {
  if (ballX <= 0) {
    rightScore++;
    resetBall();
  } else if (ballX + ballSize >= canvas.width) {
    leftScore++;
    resetBall();
  }
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameStarted) {
    drawStartScreen();
    return requestAnimationFrame(gameLoop);
  }

  // Draw elements
  drawPaddles();
  drawBall();
  drawScore();

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  checkWallCollision();
  checkPaddleCollision();
  checkScoring();

  requestAnimationFrame(gameLoop);
}

// Start screen
function drawStartScreen() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Hold X and M for 3 seconds to start!', canvas.width / 2 - 200, canvas.height / 2);

  // Draw paddles and initial ball
  drawPaddles();
  drawBall();
}

// Key press and release handling
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;

  // Track readiness
  if (keys['x']) leftPlayerReady = true;
  if (keys['m']) rightPlayerReady = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;

  // Reset readiness
  if (e.key === 'w') leftPlayerReady = false;
  if (e.key === 'ArrowUp') rightPlayerReady = false;

  // Reset hold times
  if (e.key === 'w' || e.key === 'ArrowUp') {
    leftHoldTime = 0;
    rightHoldTime = 0;
  }
});

// Player controls
function movePaddles() {
  if (keys['w'] && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
  if (keys['s'] && leftPaddleY + paddleHeight < canvas.height) leftPaddleY += paddleSpeed;

  if (keys['ArrowUp'] && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
  if (keys['ArrowDown'] && rightPaddleY + paddleHeight < canvas.height) rightPaddleY += paddleSpeed;
}

// Readiness timer
function readinessTimer() {
  if (leftPlayerReady) leftHoldTime += 0.016; // ~16ms per frame
  if (rightPlayerReady) rightHoldTime += 0.016;

  if (leftHoldTime >= 3 && rightHoldTime >= 3) {
    isGameStarted = true;
  }

  movePaddles();
  requestAnimationFrame(readinessTimer);
}

// Start the game
readinessTimer();
gameLoop();
