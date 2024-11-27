const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 800;
canvas.height = 600;

// Paddle properties
const paddleWidth = 100;
const paddleHeight = 10;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// Ball properties
const ballSize = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX = 2;
let ballSpeedY = -2;

// Brick properties
const brickRowCount = 5;
const brickColumnCount = 8;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 35;

// Bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Game state
let isGameStarted = false;
let score = 0;
let lives = 10000;

// Draw paddle
function drawPaddle() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballSize / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}

// Draw bricks
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.fillStyle = '#f77f00';
        ctx.fillRect(brickX, brickY, brickWidth, brickHeight);
      }
    }
  }
}

// Draw score
function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// Draw lives
function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

// Check collision with walls
function checkWallCollision() {
  if (ballX + ballSize / 2 > canvas.width || ballX - ballSize / 2 < 0) {
    ballSpeedX *= -1; // Reverse X direction
  }
  if (ballY - ballSize / 2 < 0) {
    ballSpeedY *= -1; // Reverse Y direction
  }
}

// Check collision with paddle
function checkPaddleCollision() {
  if (
    ballY + ballSize / 2 >= canvas.height - paddleHeight &&
    ballX >= paddleX &&
    ballX <= paddleX + paddleWidth
  ) {
    ballSpeedY *= -1; // Reverse Y direction
    const paddleCenter = paddleX + paddleWidth / 2;
    const distanceFromCenter = ballX - paddleCenter;
    ballSpeedX = distanceFromCenter * 0.2; // Adjust angle based on where the ball hits
  }
}

// Check collision with bricks
function checkBrickCollision() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const brick = bricks[c][r];
      if (brick.status === 1) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          ballSpeedY *= -1; // Reverse Y direction
          brick.status = 0; // Destroy brick
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN!');
            document.location.reload();
          }
        }
      }
    }
  }
}

// Check for game over
function checkGameOver() {
  if (ballY + ballSize / 2 > canvas.height) {
    lives--;
    if (lives === 0) {
      alert('GAME OVER!');
      document.location.reload();
    } else {
      resetBallAndPaddle();
    }
  }
}

// Reset ball and paddle
function resetBallAndPaddle() {
  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballSpeedX = 4;
  ballSpeedY = -4;
  paddleX = (canvas.width - paddleWidth) / 2;
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameStarted) {
    drawStartScreen();
    return requestAnimationFrame(gameLoop);
  }

  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();
  drawLives();

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  checkWallCollision();
  checkPaddleCollision();
  checkBrickCollision();
  checkGameOver();

  requestAnimationFrame(gameLoop);
}

// Start screen
function drawStartScreen() {
  ctx.font = '20px Arial';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('Press Arrow Left or Arrow Right to Start!', canvas.width / 2, canvas.height / 2);

  drawBricks();
  drawPaddle();
  drawBall();
}

// Key handling
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
  if (!isGameStarted && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    isGameStarted = true;
    gameLoop();
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function movePaddle() {
  if (keys['ArrowLeft'] && paddleX > 0) {
    paddleX -= paddleSpeed;
  }
  if (keys['ArrowRight'] && paddleX + paddleWidth < canvas.width) {
    paddleX += paddleSpeed;
  }
}

// Paddle movement loop
function paddleMovementLoop() {
  movePaddle();
  requestAnimationFrame(paddleMovementLoop);
}

// Start paddle movement loop
paddleMovementLoop();

// Start game loop
gameLoop();
