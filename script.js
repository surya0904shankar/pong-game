const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PLAYER_X = 20;
const AI_X = WIDTH - PLAYER_X - PADDLE_WIDTH;
let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
const PADDLE_SPEED = 4;

// Ball settings
const BALL_SIZE = 14;
let ballX = WIDTH / 2 - BALL_SIZE / 2;
let ballY = HEIGHT / 2 - BALL_SIZE / 2;
let ballVX = 4;
let ballVY = 3;

// Score
let playerScore = 0;
let aiScore = 0;

// Mouse movement to control left paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp within bounds
  if (playerY < 0) playerY = 0;
  if (playerY > HEIGHT - PADDLE_HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT;
});

// Simple AI paddle movement
function moveAI() {
  const centerAI = aiY + PADDLE_HEIGHT / 2;
  if (centerAI < ballY + BALL_SIZE / 2 - 10) {
    aiY += PADDLE_SPEED;
  } else if (centerAI > ballY + BALL_SIZE / 2 + 10) {
    aiY -= PADDLE_SPEED;
  }
  // Clamp within bounds
  if (aiY < 0) aiY = 0;
  if (aiY > HEIGHT - PADDLE_HEIGHT) aiY = HEIGHT - PADDLE_HEIGHT;
}

// Ball movement and collision
function moveBall() {
  ballX += ballVX;
  ballY += ballVY;

  // Top and bottom wall collision
  if (ballY < 0 || ballY + BALL_SIZE > HEIGHT) {
    ballVY *= -1;
    ballY = ballY < 0 ? 0 : HEIGHT - BALL_SIZE;
  }

  // Left paddle collision
  if (
    ballX <= PLAYER_X + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballVX *= -1;
    ballX = PLAYER_X + PADDLE_WIDTH;
    // Add some vertical variation based on where it hits
    let hitPos = (ballY + BALL_SIZE / 2) - (playerY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Right paddle (AI) collision
  if (
    ballX + BALL_SIZE >= AI_X &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballVX *= -1;
    ballX = AI_X - BALL_SIZE;
    let hitPos = (ballY + BALL_SIZE / 2) - (aiY + PADDLE_HEIGHT / 2);
    ballVY += hitPos * 0.15;
  }

  // Left and right wall: score!
  if (ballX < 0) {
    aiScore++;
    resetBall(-1);
  }
  if (ballX + BALL_SIZE > WIDTH) {
    playerScore++;
    resetBall(1);
  }
}

// Reset ball to center, serve towards scoring player
function resetBall(direction) {
  ballX = WIDTH / 2 - BALL_SIZE / 2;
  ballY = HEIGHT / 2 - BALL_SIZE / 2;
  ballVX = direction * (4 + Math.random() * 1.5);
  ballVY = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw net
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
  ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

  // Draw ball
  ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

  // Draw scores
  ctx.font = '32px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(playerScore, WIDTH / 4, 40);
  ctx.fillText(aiScore, WIDTH * 3 / 4, 40);
}

// Game loop
function loop() {
  moveAI();
  moveBall();
  draw();
  requestAnimationFrame(loop);
}

// Start game
loop();