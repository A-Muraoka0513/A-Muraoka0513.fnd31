'use strict'

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const params = {
  score: 0,
  lives: 3,
  tiemstamp: Date.now(),
  isTextView: true
}

const bottomOffset = 50;
let rightPressed = false;
let leftPressed = false;
let stopGame = true;

class Bricks {
  constructor() {
    this.rowCount = 3;
    this.columnCount = 6;
    this.padding = 10;
    this.offsetTop = 50;
    this.offsetLeft = 30;
    this.brickWidth = this.settingBrickWidth();
    this.bricks = this.createBricks();
    console.log(this.brickWidth)
  }

  settingBrickWidth() {
    return (canvas.width - this.padding * (this.columnCount + 1) - this.offsetLeft * 2) / this.columnCount;
  }

  createBricks() {
    const bricks = [];
    for (let col = 0; col < this.columnCount; col++) {
      bricks[col] = [];
      for (let row = 0; row < this.rowCount; row++) {
        bricks[col][row] = new Brick(0, 0, this.brickWidth);
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
  constructor(x, y, width, collor = "#0095DD") {
    this.x;
    this.y;
    this.width = width;
    console.log(this.width)
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
    this.y = canvas.height - bottomOffset - 30;
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
    this.width = canvas.width / 6;
    this.positionInitialization();
  }

  positionInitialization() {
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - bottomOffset - this.height;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  isBlocked(ballPositionX, ballPositionY) {
    return ballPositionX > this.x && ballPositionX < this.x + this.width 
        && ballPositionY > this.y && ballPositionY < this.y + this.height ;
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
  ctx.font = "20px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${params.score}`, 8, 20);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`${getLives(params.lives)}`, canvas.width - 100, 20);
}

function getLives(num) {
  let res = "";
  for (let i = 0; i < num; i++) {
    res += "💗";
  }
  return res;
}

function drawStartText() {
  ctx.font = "45px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Press Enter key!", 175, canvas.height / 2);
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

function keyPressHandler(e) {
  if (e.key === "Enter" && stopGame) {
    stopGame = false;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  paddle.draw();
  bricks.draw();
  drawScore();
  drawLives();

  bricks.collisionDetection(ball);

  if (stopGame) {
    if (params.isTextView) {
      drawStartText();
    }
    if (Date.now() - params.tiemstamp > 750) {
      params.tiemstamp = Date.now();
      params.isTextView = !params.isTextView
    }
  } else {
    if (ball.isCollisionWithXWall()) {
      ball.flipXDirection();
    }

    if (ball.isCollisionWithTopWall()) {
      ball.flipYDirection();
    }
    if (paddle.isBlocked(ball.x, ball.y)) {
      ball.flipYDirection();
    }
    if (ball.isCollisionWithBottomWall()) {
        params.lives--;
        if (params.lives < 1) {
          alert("GAME OVER");
          params.lives = 3;
          params.score = 0;
          document.location.reload();
        } else {
          stopGame = true;
          ball.positionInitialization();
          paddle.positionInitialization();
        
      }
    }

    paddle.updatePosition(rightPressed, leftPressed);
    ball.updatePosition();
  }

  requestAnimationFrame(draw);
}


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("keypress", keyPressHandler, false);


const ball = new Ball();
const paddle = new Paddle();
const bricks = new Bricks();
draw();
