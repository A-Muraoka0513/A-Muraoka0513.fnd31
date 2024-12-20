'use strict'

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const params = {
  score: 0,
  lives: 3,
  tiemstamp: Date.now(),
  isTextView: true
}

const bottomOffset = 100;
const textColor = "#f8f8ff";
let rightPressed = false;
let leftPressed = false;
let stopGame = true;

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

class Bricks {
  constructor() {
    this.rowCount = 3;
    this.columnCount = 7;
    this.padding = 10;
    this.offsetTop = 50;
    this.offsetLeft = 30;
    this.speedSet = {0:2.5, 1:2.1, 2:1.8}
    this.collorSet = {0:"#dc143c", 1:"#ffd700", 2:"#228b22"}
    this.brickWidth = this.settingBrickWidth();
    this.bricks = this.createBricks();
  }

  settingBrickWidth() {
    return (canvas.width - this.padding * (this.columnCount + 1) - this.offsetLeft * 2) / this.columnCount;
  }

  createBricks() {
    const bricks = [];
    for (let col = 0; col < this.columnCount; col++) {
      bricks[col] = [];
      for (let row = 0; row < this.rowCount; row++) {
        bricks[col][row] = new Brick({x:0, y:0, width:this.brickWidth, collor:this.collorSet[row], speedSet : this.speedSet[row]});
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
            ball.updateSpeed(brick.speedSet)
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
  constructor({x, y, width, collor = "#0095DD", speedSet=1}) {
    this.x;
    this.y;
    this.width = width;
    this.height = 20;
    this.collor = collor;
    this.isAlive = true;
    this.speedSet = speedSet;
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
    this.radius = 11;
    this.speed = 1.8;
    this.posInit();
  }

  posInit() {
    this.x = canvas.width / 2;
    this.y = canvas.height - bottomOffset - 40;
    this.dx = 2;
    this.dy = -2;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#e0ffff";
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
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  isCollisionWithXWall() {
    return this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius;
  }

  isCollisionWithTopWall() {
    return this.y + this.dy < this.radius;
  }

  isCollisionWithBottomWall() {
    return this.y + this.dy > canvas.height - this.radius;
  }

  updateSpeed(speed) {
    if (this.speed < speed){
      this.speed = speed;
    }
  }
}

class Paddle {
  constructor() {
    this.height = 10;
    this.width = canvas.width / 6;
    this.posInit();
  }

  posInit() {
    this.x = (canvas.width - this.width) / 2;
    this.y = canvas.height - bottomOffset - this.height;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = "#87cefa";
    ctx.fill();
    ctx.closePath();
  }

  isBlocked(ball) {
    return ball.x > this.x && ball.x < this.x + this.width 
        && ball.y > this.y && ball.y < this.y + this.height ;
  }

  updatePosition(rightPressed, leftPressed) {
    if (rightPressed && this.x < canvas.width - this.width) {
      this.x += 7;
    }
    else if (leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }
}

function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${params.score}`, 8, 20);
}

function drawLives() {
  ctx.font = "20px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "left";
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
  ctx.fillStyle = textColor;
  ctx.textAlign = "center"
  ctx.fillText("Press Enter key!", canvas.width / 2, canvas.height / 2);
}

function drawOperationExplanation() {
  ctx.font = "35px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center"
  ctx.fillText("⇦  Move the left or right key!  ⇨", canvas.width / 2, canvas.height -20);
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
    drawOperationExplanation();
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
    if (paddle.isBlocked(ball)) {
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
          ball.posInit();
          paddle.posInit();
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
window.addEventListener("resize", resizeCanvas);

resizeCanvas()
const ball = new Ball();
const paddle = new Paddle();
const bricks = new Bricks();
draw();
