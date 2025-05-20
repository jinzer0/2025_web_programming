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
    // 시간 계산
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    time = `${hours}:${minutes}:${seconds}`;

    // 점수 계산
    const remainingBricks = bricks.flat().filter(brick => brick.status).length;
    const totalBricks = brickRow * brickCol;
    const destroyedBricks = totalBricks - remainingBricks;
    score = destroyedBricks * 10;

    // 모든 벽돌을 부쉈을 때 추가 점수
    if (remainingBricks === 0) {
        const bonus = Math.max(0, 1000 - elapsedTime); // 경과 시간이 짧을수록 보너스 점수
        score += bonus;
    }

    // 화면에 표시
    console.log(`Score: ${score}, Time: ${time}, Remained live: ${live}`);
}

function mouseMoveHandler(e) {
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    if (relativeX > 0 && relativeX < canvas.width) {
        const newX = relativeX - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, newX));
    }
}

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

    // 벽에 충돌 시 방향 반전 (입사각 고려)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx; // x축 반전
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy; // y축 반전
    }

    // 패들에 충돌 시 입사각에 따른 반사각 계산
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

function checkFloorCollision() {
    if (ball.y + ball.radius > canvas.height) {
        // 바닥에 충돌했을 때의 처리 (예: 게임 오버)
        console.log("Reached floor!");
        live -= 1;
        // 공의 y 방향 속도를 반전시키거나, 게임 상태를 변경하는 등의 로직 추가
        ball.dy = -ball.dy; // 간단하게는 공을 다시 위로 튕겨낼 수도 있습니다.
    }
}

function checkBrickCollision() {
    for (let r = 0; r < brickRow; r++) {
        for (let c = 0; c < brickCol; c++) {
            const brick = bricks[r][c];
            if (brick.status) {
                // 충돌 지점 계산
                const overlapX = Math.min(ball.x + ball.radius, brick.x + brickWidth) - Math.max(ball.x - ball.radius, brick.x);
                const overlapY = Math.min(ball.y + ball.radius, brick.y + brickHeight) - Math.max(ball.y - ball.radius, brick.y);

                if (overlapX > 0 && overlapY > 0) {
                    // 충돌 위치에 따른 반사 처리
                    if (overlapX < overlapY) {
                        ball.dx = -ball.dx; // 좌우 충돌
                    } else {
                        ball.dy = -ball.dy; // 상하 충돌
                    }

                    brick.status = false;
                    return; // 한 번의 충돌만 처리
                }
            }
        }
    }
}

function resetCanvas() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function checkPaddleCollision() {
    if (ball.y + ball.radius > paddle.y && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
        const angle = hitPoint * (Math.PI / 3); // 최대 반사각 60도
        const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2); // 속도 유지
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
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
    checkBrickCollision();
    checkFloorCollision();
    checkPaddleCollision();
    updatePaddle();
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

function gameLoop() {
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
        speed: 5,
        src: "img/img.jpg",
        color: "blue",
    }

    bricks = [];
    updatePaddle();
    updateBall();
    setBrick();
    updateStatus();
}

