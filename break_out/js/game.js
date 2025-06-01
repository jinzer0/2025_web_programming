let canvas;
let context;
let rightPressed;
let leftPressed;
let ball;
let score
let time;
let live;
let status;
let startTime;
let paddle;
let bricks;
const brickRow = 3;
const brickCol = 3;
const brickStrength = 1;
let brickStartX;
let brickStartY;
let brickWidth;
let brickHeight;
let brickPadding;
let isRunning = true;
const storage = window.localStorage;
let special_item, background_image, background_opacity, paddle_image, ball_image, brick_image, music, control;
let profile;
let currentLevel = 0;
// TODO: 특수 아이템, 적용 및 구현
// TODO: 특수 아이템 활성화시 icon과 description 3초간 display
// TODO: 난이도에 따라 벽돌 개수, 크기 및 brickStrength 조정

let it = [
    {name: "item1", description: "아이템 설명", icon: "img/item1.jpg", is_enabled: true},
];

function initSetting() {
    // special_item = storage.getItem("settings")["special_item"] || true;
    // background_image = storage.getItem("settings")["background_image"] || "../img/bg1.jpg";
    // background_opacity = storage.getItem("settings")["background_opacity"] || 1.0;
    // paddle_image = storage.getItem("settings")["paddle_image"] || "../img/bat.jpg";
    // ball_image = storage.getItem("settings")["ball_image"] || "../img/grenade.jpg";
    // brick_image = storage.getItem("settings")["brick_image"] || "../img/brick.jpg";
    // music = storage.getItem("settings")["music"] || "../audio/1.mp3";
    // control = storage.getItem("settings")["control"] || "mouse";
    //TODO Error: profile is null - need to check JSON.parse or stringify
    profile = profileManager.getCurrentProfile();
    console.log(`Current level: ${profile["current_level"]}`);
    currentLevel = profile["current_level"];
    console.log(`Current Level: ${currentLevel}`);
}

function saveRecord(is_win, is_impossible) {
    // TODO profile 객체 내 level_progress 객체 업데이트, 다음 레벨로 진행할 수 있도록 profile["current_level"] 업데이트
    profile["total_play_count"]++;
    profile["higest_score"] = Math.max(score, profile["higest_score"]);

    // 게임을 이긴 경우, 현재 레벨이 최고 레벨보다 낮은 경우 current_level +=1, leve_progress update
    if (is_win) {
        if (currentLevel < LEVEL.IMPOSSIBLE) currentLevel++;
        profile["current_level"] = currentLevel;
        profile["level_progress"][currentLevel]["unlocked"] = true;
        profile["level_progress"][currentLevel - 1]["completed"] = true;
    }

    if (is_impossible) {
        // impossible 레벨인 경우 longest_survived_time, average_survived_time 업데이트
        let longest_survived_time = Math.max(parseTime(profile["longest_survived_time"]), parseTime(time));
        profile["longest_survived_time"] = stringTime(longest_survived_time);
        let average_survived_time = (parseTime(profile["average_survived_time"]) * (profile["total_play_count"] - 1) + parseTime(time)) / profile["total_play_count"];
        profile["average_survived_time"] = stringTime(average_survived_time);
    }
    profileManager.updateProfile(profile["name"], profile);
}


$(() => {
    init();
    gameLoop();
});


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


function setBrick() {
    bricks = []
    for (let i = 0; i < brickRow; i++) {
        bricks[i] = []
        for (let j = 0; j < brickCol; j++) {
            bricks[i][j] = {
                x: j * (brickWidth + brickPadding) + brickStartX,
                y: i * (brickHeight + brickPadding) + brickStartY,
                status: true,
                strength: brickStrength,
            }
        }
    }
}

function setStatus() {
    if (status.score !== score) {
        $("#game-info>span:nth-of-type(1)").text(`Score : ${score}`);
        status.score = score;
    }

    if (status.time !== time) {
        $("#game-info>span:nth-of-type(2)").text(`Time : ${time}`);
        status.time = time;
    }

    if (status.live !== live) {
        $("#game-info>span:nth-of-type(3)").text(`Remained live : ${live}`);
        status.live = live;
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
    saveRecord(bricks.flat().filter(brick => brick.status).length === 0 && live > 0, currentLevel === 3);
}


function resetCanvas() {
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "white";
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.closePath();
}


function checkCollision() { // Work in Progress
    let isCollison = false;
    // 좌우 벽 Collision 확인
    if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
        ball.dx = -ball.dx;
        isCollison = true;
    }

    // 천장 벽 Collision 확인
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
                        if (brick.strength > 0) brick.strength--;
                        if (brick.strength === 0) brick.status = false;
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
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 5;
        ball.dy = 7;
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


function Logger() {
    console.log(`ball dx: ${ball.dx}`);
    console.log(`ball dy: ${ball.dy}`);
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
    initSetting();
    $(document).mousemove(mouseMoveHandler);
    $(document).keydown(keyboardMoveHandler);
    $(document).keyup(keyboardMoveHandler);

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = $("#game-screen").width();
    canvas.height = $("#game-screen").height() * 0.7;
    brickPadding = canvas.width * 0.004;
    brickWidth = canvas.width / (brickCol + 2);
    brickHeight = canvas.height * 0.05;
    brickStartX = (canvas.width - (brickWidth + brickPadding) * brickCol) / 2;
    brickStartY = canvas.height * 0.08;
    rightPressed = false;
    leftPressed = false;
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.width * 0.015,
        src: "img/img.jpg",
        dx: 5,
        dy: 7,
        color: "red",
    }

    score = 0;
    time = "00:00:00";
    live = 3;
    status = {score: score, time: time, live: live};
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
    setBrick();
    setInterval(Logger, 1000);
}


