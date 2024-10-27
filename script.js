'use strict'

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const params = {
  score: 0,
  lives: 3
}

let rightPressed = false;
let leftPressed = false;

class Bricks {
  constructor() {
    this.rowCount = 3;
    this.columnCount = 5;
    this.padding = 10;
    this.offsetTop = 30;
    this.offsetLeft = 30;
    this.bricks = this.createBricks();
  }

  createBricks() {
    const bricks = [];
    for (let col = 0; col < this.columnCount; col++) {
      bricks[col] = [];
      for (let row = 0; row < this.rowCount; row++) {
        bricks[col][row] = new Brick(0, 0);
      }
    }
    return bricks;
  }

  draw() {
    for (let col = 0; col < this.columnCount; col++) {
      for (let row = 0; row < this.rowCount; row++) {
        if (this.bricks[col][row].isAlive) {
          this.bricks[col][row].x = col * (this.bricks[col][row].width + this.padding) + this.offsetLeft;
          this.bricks[col][row].y = row * (this.bricks[col][row].height + this.padding) + this.offsetTop;
          this.bricks[col][row].draw();
        }
      }
    }
  }

  collisionDetection(ball) {
    for (let col = 0; col < this.columnCount; col++) {
      for (let row = 0; row < this.rowCount; row++) {
        const brick = this.bricks[col][row];
        if (brick.isAlive) {
          if (ball.x > brick.x && ball.x < brick.x + brick.width && ball.y > brick.y && ball.y < brick.y + brick.height) {
            ball.flipYDirection();
            brick.isAlive = false;
            params.score++;
            if (params.score === this.rowCount * this.columnCount) {
              alert("YOU WIN, CONGRATULATIONS!");
              document.location.reload();
            }
          }
        }
      }
    }
  }
}

class Brick {
  constructor(x, y, collor = "#0095DD") {
    this.x;
    this.y;
    this.width = 75;
    this.height = 20;
    this.collor = collor;
    this.isAlive = true;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.collor;
    ctx.fill();
    ctx.closePath();
  }
}

class Ball {
  constructor() {
    this.ballRadius = 10;
    this.positionInitialization();
  }

  positionInitialization() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  flipXDirection() {
    this.dx = -this.dx;
  }

  flipYDirection() {
    this.dy = -this.dy;
  }

  updatePosition() {
    this.x += this.dx;
    this.y += this.dy;
  }

  isCollisionWithXWall() {
    return this.x + this.dx > canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius;
  }

  isCollisionWithTopWall() {
    return this.y + this.dy < this.ballRadius;
  }

  isCollisionWithBottomWall() {
    return this.y + this.dy > canvas.height - this.ballRadius;
  }
}

class Paddle {
  constructor() {
    this.height = 10;
    this.width = 75;
    this.positionInitialization();
  }

  positionInitialization() {
    this.x = (canvas.width - this.width) / 2;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  isBlocked(ballPositionX) {
    return ballPositionX > this.x && ballPositionX < this.x + this.width;
  }

  updatePosition(rightPressed, leftPressed) {
    if (rightPressed && this.x < canvas.width - this.width) {
      this.x += 7;
    }
    else if (leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }

  seamlessPositionUpdates(relativeX) {
    if (relativeX > 0 && relativeX < canvas.width) {
      this.x = relativeX - this.width / 2;
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${params.score}`, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  paddle.seamlessPositionUpdates(relativeX);
}



function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  paddle.draw();
  bricks.draw();
  drawScore();

  bricks.collisionDetection(ball);

  if (ball.isCollisionWithXWall()) {
    ball.flipXDirection();
  }

  if (ball.isCollisionWithTopWall()) {
    ball.flipYDirection();
  }
  else if (ball.isCollisionWithBottomWall()) {
    if (paddle.isBlocked(ball.x)) {
      ball.flipYDirection();
    }
    else {
      params.lives--;
      if (params.lives < 0) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        ball.positionInitialization();
      }
    }
  }
  paddle.updatePosition(rightPressed, leftPressed);
  ball.updatePosition();
  requestAnimationFrame(draw);
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


const ball = new Ball();
const paddle = new Paddle();
const bricks = new Bricks();
draw();
