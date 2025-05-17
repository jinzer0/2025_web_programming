let context;
let velocity;
let angle;
let ballVx;
let ballVy;
let ballX = 10;
let ballY = 250;
let ballRadius = 10;
let score = 0;
let image = new Image();
image.src = "lawn.jpg";
let backimage = new Image();
backimage.src = "net.jpg";
let timer;

function init() {
    ballX = 10;
    ballY = 250;
    ballRadius = 10;
    context = document.getElementById("canvas").getContext("2d");
    draw();
}



function draw() {
    context.clearRect(0, 0, 500, 300);
    drawBall();
    drawBackground();
}

function drawBall() {
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI, true);
    context.fillStyle = "red";
    context.fill();
}

function drawBackground() {
    context.drawImage(image, 0, 270);
    context.drawImage(backimage, 450, 60);
}

function calculate() {
    ballVy = ballVy + 1.98; // gravity
    ballX = ballX + ballVx;
    ballY = ballY + ballVy;

    if ((ballX >= 450) && (ballX <= 480) && (ballY >= 60) && (ballY <= 210)) {
        score++;
        document.getElementById("score").innerHTML = "점수 = " + score;
        clearInterval(timer);
    }

    if (ballY >= 300 || ballY < 0) clearInterval(timer);
    draw();
}

function start() {
    init();
    velocity = Number(document.getElementById("velocity").value);
    angle = Number(document.getElementById("angle").value);
    let angleR = angle * Math.PI / 180; // radian
    ballVx = velocity * Math.cos(angleR);
    ballVy = -velocity * Math.sin(angleR);

    timer = setInterval(calculate, 100);
    return false;
}