let canvas;
let context;
let rightPressed;
let leftPressed;
let ball;
let score
let time;
let live;
let prevStatus;
let startTime;
let paddle;
let bricks;
const brickRow = 5;
const brickCol = 5;
const brickPadding = 10;
const brickStartX = 30;
const brickStartY = 30;
const brickStrength = 1;
let brickWidth;
let brickHeight;

let isRunning = true;

$(() => {
    init();
    gameLoop();
});


function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

function drawPaddle() {
    context.beginPath();
    context.fillStyle = paddle.color;
    context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.closePath();
}

function drawBrick() {
    for (let i = 0; i < brickRow; i++) {
        for (let j = 0; j < brickCol; j++) {
            if (bricks[i][j].status) {
                context.fillStyle = "white";
                context.fillRect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
            }
        }
    }
}

function updateStatus() {
    // 시간 계산 - 왼쪽 상단 경과 시간 표시용
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    time = `${hours}:${minutes}:${seconds}`;

    // 점수 계산 - 왼쪽 상단 현재점수 표시용
    const remainingBricks = bricks.flat().filter(brick => brick.status).length;
    const totalBricks = brickRow * brickCol;
    const destroyedBricks = totalBricks - remainingBricks;
    score = destroyedBricks * 10;

    // 모든 벽돌을 부쉈을 때 추가 점수 - 경과 시간이 짧을수록 더 많은 추가점수
    if (remainingBricks === 0) {
        const bonus = Math.max(0, 1000 - elapsedTime); // 경과 시간이 짧을수록 보너스 점수
        score += bonus;
    }

    console.log(`Score: ${score}, Time: ${time}, Remained live: ${live}`);
}

// 마우스 이동에 따라 패들 움직이기
function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    if (relativeX > 0 && relativeX < canvas.width) {
        const newX = relativeX - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, newX));
    }
}

// 키보드 방향키 좌우로 패들 움직이기
function keyboardMoveHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (e.type === 'keyup') {
        if (e.key === 'Right' || e.key === 'ArrowRight') {
            rightPressed = false;
        } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }

    if (e.type === "keyup") {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
        if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    } else if (e.type === "keydown") {
        if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
        if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    }
}

function setBrick() {
    bricks = []
    for (let i = 0; i < brickRow; i++) {
        bricks[i] = []
        for (let j = 0; j < brickCol; j++) {
            bricks[i][j] = {
                x: i * (brickWidth + brickPadding) + brickStartX,
                y: j * (brickHeight + brickPadding) + brickStartY,
                status: true,
                strength: brickStrength,
            }
        }
    }
}


function updatePaddle() {
    if (rightPressed) {
        const newX = paddle.x + paddle.speed;
        paddle.x = Math.min(canvas.width - paddle.width, newX);
    }
    if (leftPressed) {
        const newX = paddle.x - paddle.speed;
        paddle.x = Math.max(0, newX);
    }
}


function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // 벽에 충돌 시 방향 반전 (입사각 고려) Work in Progress
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx; // x축 반전
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy; // y축 반전
    }

    // 패들에 충돌 시 입사각에 따른 반사각 계산 Work in Progress
    if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        const angle = hitPoint * (Math.PI / 3); // 최대 반사각 60도
        const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2); // 속도 유지
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
    }
}

function checkWin() {
    if (live === 0) {
        console.log("Player lose!");
        alert("Are you idiot?");
        isRunning = false;
    } else if (bricks.flat().filter(brick => brick.status).length === 0) {
        console.log("Player win!");
        alert("Are you genius?");
        isRunning = false;
    }
}



function resetCanvas() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
}


function checkCollision() { // Work in Progress
    let isCollison = false;
    // 좌우 벽 Collision 확인
    if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
        ball.dx = -ball.dx;
        isCollison = true;
    }

    if (ball.y - ball.radius <= 0) {
        ball.dy = -ball.dy;
        isCollison = true;
    }

    // 벽돌과 Collision 확인
    if (!isCollison) {
        for (let i = 0; i < brickRow; i++) {
            for (let j = 0; j < brickCol; j++) {
                const brick = bricks[i][j];
                if (brick.status) {
                    let x = Math.min(ball.x + ball.radius, brick.x + brickWidth) -
                        Math.max(ball.x - ball.radius, brick.x);
                    let y = Math.min(ball.y + ball.radius, brick.y + brickHeight) -
                        Math.max(ball.y - ball.radius, brick.y);

                    if (x > 0 && y > 0) {
                        if (x < y) ball.dx = -ball.dx;
                        else ball.dy = -ball.dy;
                        brick.status = false;
                        isCollison = true;
                        break;
                    }
                }
            }
            if (isCollison) break;
        }
    }

    // 바닥 벽과 부딪혔을 때 목숨 -1 Work in Progress
    if (!isCollison && ball.y + ball.radius > canvas.height) {
        live--;
        if (live <= 0) {
            isRunning = false;
            return;
        }
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 7;
        ball.dy = -5;
        isCollison = true;
    }

    // 패들과 부딪혔을 때 각도 속도 Work in Progress
    if (!isCollison && ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height && ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {
        let hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        let angle = hitPoint * (Math.PI / 3);
        let speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
        ball.dx = speed * Math.sin(angle);
        ball.dy = -Math.abs(speed * Math.cos(angle));
    }
}

function setStatus() {
    if (prevStatus.score !== score) {
        $("#game-info>span:nth-of-type(1)").text(`Score : ${score}`);
        prevStatus.score = score;
    }

    if (prevStatus.time !== time) {
        $("#game-info>span:nth-of-type(2)").text(`Time : ${time}`);
        prevStatus.time = time;
    }

    if (prevStatus.live !== live) {
        $("#game-info>span:nth-of-type(3)").text(`Remained live : ${live}`);
        prevStatus.live = live;
    }
}

function updateGame() {
    updatePaddle();
    checkCollision();
    updateBall();
    updateStatus();
    setStatus();
    checkWin();
}

function drawGame() {
    resetCanvas();
    drawBrick();
    drawBall();
    drawPaddle();
}

function gameLoop() { // Game 재귀적 실행
    if (!isRunning) return;
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function init() {
    $(document).mousemove(mouseMoveHandler);
    $(document).keydown(keyboardMoveHandler);
    $(document).keyup(keyboardMoveHandler);

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = $("#game-screen").width();
    canvas.height = $("#game-screen").height() * 0.7;
    brickWidth = canvas.width / (brickCol + 1);
    brickHeight = canvas.height * 0.05;
    rightPressed = false;
    leftPressed = false;
    ball = {
        x: canvas.width / 2,
        y: canvas.height - 30,
        radius: canvas.width * 0.015,
        src: "img/img.jpg",
        dx: 7,
        dy: -5,
        color: "red",
    }

    score = 0;
    time = 0;
    live = 3;
    prevStatus = {score: score, time: time, live: live};
    startTime = Date.now();

    paddle = {
        height: canvas.height * 0.03,
        width: canvas.width * 0.15,
        x: (canvas.width - canvas.width * 0.15) / 2,
        y: canvas.height - canvas.height * 0.03 - 10,
        speed: 20,
        src: "img/img.jpg",
        color: "blue",
    }

    bricks = [];
    updatePaddle();
    updateBall();
    setBrick();
    updateStatus();
}

