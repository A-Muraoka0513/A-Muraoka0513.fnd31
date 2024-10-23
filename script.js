'use strict'

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

class Ball {
  constructor(){
    this.ballRadius = 10;
    this.x = canvas.width / 2;
    this.y = canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
  }
  
  get currentX(){
    return this.x
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  flipXDirection(){
    this.dx = -this.dx;
  }

  flipYDirection(){
    this.dy = -this.dy;
  }

  updatePosition(){
    this.x += this.dx;
    this.y += this.dy;
  }

  isCollisionWithXWall(){
    return this.x + this.dx > canvas.width - this.ballRadius || this.x + this.dx < this.ballRadius;
  }

  isCollisionWithTopWall(){
    return this.y + this.dy < this.ballRadius;
  }

  isCollisionWithBottomWall(){
    return this.y + this.dy > canvas.height - this.ballRadius;
  }
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

class Paddle {
  constructor() {
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.x = (canvas.width - this.paddleWidth) / 2;
  }

  draw() {
    ctx.beginPath();
    ctx.rect(this.x, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  
  isBlocked(ballPositionX) {
    return ballPositionX > this.x && ballPositionX < this.x + this.paddleWidth;
  }

  updatePosition(rightPressed, leftPressed) {
    if (rightPressed && this.x < canvas.width - this.paddleWidth) {
      this.x += 7;
    }
    else if (leftPressed && this.x > 0) {
      this.x -= 7;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ball.draw();
  paddle.draw();

  if (ball.isCollisionWithXWall()) {
    ball.flipXDirection();
  }

  if (ball.isCollisionWithTopWall()) {
    ball.flipYDirection();
  }
  else if (ball.isCollisionWithBottomWall()) {
    if (paddle.isBlocked(ball.currentX)) {
      ball.flipYDirection();
    }
    else {
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  }
  paddle.updatePosition(rightPressed, leftPressed);
  ball.updatePosition();
}

let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

const ball = new Ball();
const paddle = new Paddle();
let interval = setInterval(draw, 10);
