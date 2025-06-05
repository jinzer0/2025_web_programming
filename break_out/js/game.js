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
let brickRow = 3;
let brickCol = 3;
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
const itemRate = {
    0: 0.25,
    1: 0.2,
    2: 0.3,
    3: 0.5,
};
// TODO: 특수 아이템, 적용 및 구현 - DONE!
// TODO: 특수 아이템 활성화시 icon과 description 3초간 display - DONE!
// TODO: 난이도에 따라 벽돌 개수, 크기 및 brickStrength 조정


// 특수 아이템 객체
const SPECIAL_ITEMS = {
    BIG_PADDLE: {
        name: "Big Paddle",
        description: "공구 상자 - 패들 크기 일시적 증가",
        color: "#32CD32",
        duration: 3000,
        effect: () => {
            if (!activeEffects.bigPaddle.active) {
                activeEffects.bigPaddle.active = true;
                paddle.width *= 1.5;
                if (paddle.x + paddle.width > canvas.width) {
                    paddle.x = canvas.width - paddle.width;
                }
                activeEffects.bigPaddle.timer = setTimeout(() => {
                    if (activeEffects.bigPaddle.active) {
                        paddle.width /= 1.5;
                        activeEffects.bigPaddle.active = false;
                        activeEffects.bigPaddle.timer = null;
                    }
                }, 3000);
            } else {
                // 이미 활성화 상태면 타이머 리셋 - 다시 시작
                clearTimeout(activeEffects.bigPaddle.timer);
                activeEffects.bigPaddle.timer = setTimeout(() => {
                    if (activeEffects.bigPaddle.active) {
                        paddle.width /= 1.5;
                        activeEffects.bigPaddle.active = false;
                        activeEffects.bigPaddle.timer = null;
                    }
                }, 3000);
            }
        }
    },
    EXTRA_LIFE: {
        name: "Extra Life",
        description: "방탄 조끼 - 목숨 1 추가",
        color: "#FF69B4",
        effect: () => {
            live++;
        }
    },
    DESTROY_AROUND: {
        name: "Destroy Around",
        description: "폭탄 - 주변 벽돌 파괴",
        color: "#FF4500",
        effect: (brickI, brickJ) => {
            const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]; // 해당 벽돌 기준 모든 방향 1칸씩
            directions.forEach(([di, dj]) => {
                const ni = brickI + di;
                const nj = brickJ + dj;
                if (ni >= 0 && ni < brickRow && nj >= 0 && nj < brickCol && bricks[ni][nj].status) {
                    bricks[ni][nj].status = false;
                }
            });
        }
    },
    SPEED_UP: {
        name: "Speed Up",
        description: "공 속도 일시적 증가",
        color: "#FFD700",
        duration: 3000,
        effect: () => {
            if (!activeEffects.speedUp.active) {
                activeEffects.speedUp.active = true;
                activeEffects.speedUp.multiplier = 1.5;
                ball.dx *= activeEffects.speedUp.multiplier;
                ball.dy *= activeEffects.speedUp.multiplier;
                activeEffects.speedUp.timer = setTimeout(() => {
                    if (activeEffects.speedUp.active) {
                        ball.dx /= activeEffects.speedUp.multiplier;
                        ball.dy /= activeEffects.speedUp.multiplier;
                        activeEffects.speedUp.active = false;
                        activeEffects.speedUp.timer = null;
                    }
                }, 3000);
            } else {
                clearTimeout(activeEffects.speedUp.timer);
                activeEffects.speedUp.timer = setTimeout(() => {
                    if (activeEffects.speedUp.active) {
                        ball.dx /= activeEffects.speedUp.multiplier;
                        ball.dy /= activeEffects.speedUp.multiplier;
                        activeEffects.speedUp.active = false;
                        activeEffects.speedUp.timer = null;
                    }
                }, 3000);
            }
        }
    },
    RESTORE_BRICKS: {
        name: "Restore Bricks",
        description: "수배 레벨 증가 - 벽돌 추가(부순 벽돌 중 일부 재생성)",
        color: "#8B4513",
        effect: () => {
            const destroyedBricks = [];
            for (let i = 0; i < brickRow; i++) {
                for (let j = 0; j < brickCol; j++) {
                    if (!bricks[i][j].status) {
                        destroyedBricks.push([i, j]);
                    }
                }
            }

            // 파괴된 벽돌 중 50% 랜덤 추가
            const restoreCount = Math.min(Math.ceil(destroyedBricks.length * 0.5), 3);
            for (let k = 0; k < restoreCount; k++) {
                if (destroyedBricks.length > 0) {
                    const randomIndex = Math.floor(Math.random() * destroyedBricks.length);
                    const [i, j] = destroyedBricks.splice(randomIndex, 1)[0];
                    bricks[i][j].status = true;
                    bricks[i][j].strength = brickStrength;
                    if (Math.random() < 0.25) {
                        const itemKeys = Object.keys(SPECIAL_ITEMS);
                        bricks[i][j].specialItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
                    } else {
                        bricks[i][j].specialItem = null;
                    }
                }
            }
        }
    },
    SMALL_PADDLE: {
        name: "Small Paddle",
        description: "고장난 총 - 패들 크기 일시적 감소",
        color: "#DC143C",
        duration: 3000,
        effect: () => {
            if (!activeEffects.smallPaddle.active) {
                activeEffects.smallPaddle.active = true;
                activeEffects.smallPaddle.multiplier = 0.6;
                paddle.width *= activeEffects.smallPaddle.multiplier;
                activeEffects.smallPaddle.timer = setTimeout(() => {
                    if (activeEffects.smallPaddle.active) {
                        paddle.width /= activeEffects.smallPaddle.multiplier;
                        activeEffects.smallPaddle.active = false;
                        activeEffects.smallPaddle.timer = null;
                    }
                }, 3000);
            } else {
                clearTimeout(activeEffects.smallPaddle.timer);
                activeEffects.smallPaddle.timer = setTimeout(() => {
                    if (activeEffects.smallPaddle.active) {
                        paddle.width /= activeEffects.smallPaddle.multiplier;
                        activeEffects.smallPaddle.active = false;
                        activeEffects.smallPaddle.timer = null;
                    }
                }, 3000);
            }
        }
    },
    REVERSE_CONTROL: {
        name: "Reverse Control",
        description: "혼란 - 패틀 움직임 일시적 반전(입력 반전)",
        color: "#FF6347",
        duration: 3000,
        effect: () => {
            if (!activeEffects.reverseControl.active) {
                activeEffects.reverseControl.active = true;
                activeEffects.reverseControl.timer = setTimeout(() => {
                    paddle.speed = Math.abs(paddle.speed);
                    activeEffects.reverseControl.active = false;
                    activeEffects.reverseControl.timer = null;
                }, 3000);
            } else {
                clearTimeout(activeEffects.reverseControl.timer);
                activeEffects.reverseControl.timer = setTimeout(() => {
                    activeEffects.reverseControl.active = false;
                    activeEffects.reverseControl.timer = null;
                }, 3000);
            }
        }
    },
    SLOW_CONTROL: {
        name: "Slow Control",
        description: "해킹장치 오류 - 패들 움직임 일시적 둔화(입력 딜레이)",
        color: "#4B0082",
        duration: 3000,
        effect: () => {
            if (!activeEffects.slowControl.active) {
                activeEffects.slowControl.active = true;
                controlDelay = 200;
                activeEffects.slowControl.timer = setTimeout(() => {
                    activeEffects.slowControl.active = false;
                    controlDelay = 0;
                    activeEffects.slowControl.timer = null;
                }, 3000);
            } else {
                clearTimeout(activeEffects.slowControl.timer);
                activeEffects.slowControl.timer = setTimeout(() => {
                    activeEffects.slowControl.active = false;
                    controlDelay = 0;
                    activeEffects.slowControl.timer = null;
                }, 3000);
            }
        }
    },
    SCREEN_FLICKER: {
        name: "Screen Flicker",
        description: "정전 - 화면 일시적 깜빡거림",
        color: "#800080",
        duration: 3000,
        effect: () => {
            if (!activeEffects.screenFlicker.active) {
                activeEffects.screenFlicker.active = true;
                activeEffects.screenFlicker.interval = setInterval(() => {
                    canvas.style.opacity = canvas.style.opacity === "0.3" ? "1" : "0.3";
                }, 200);
                activeEffects.screenFlicker.timer = setTimeout(() => {
                    clearInterval(activeEffects.screenFlicker.interval);
                    canvas.style.opacity = "1";
                    activeEffects.screenFlicker.active = false;
                    activeEffects.screenFlicker.timer = null;
                    activeEffects.screenFlicker.interval = null;
                }, 3000);
            } else {
                clearTimeout(activeEffects.screenFlicker.timer);
                activeEffects.screenFlicker.timer = setTimeout(() => {
                    clearInterval(activeEffects.screenFlicker.interval);
                    canvas.style.opacity = "1";
                    activeEffects.screenFlicker.active = false;
                    activeEffects.screenFlicker.timer = null;
                    activeEffects.screenFlicker.interval = null;
                }, 3000);
            }
        }
    },
    RANDOM_BOUNCE: {
        name: "Random Bounce",
        description: "신물리학 - 공이 랜덤한 방향으로 튕김",
        color: "#00CED1",
        duration: 3000,
        effect: () => {
            if (!activeEffects.randomBounce.active) {
                activeEffects.randomBounce.active = true;
                activeEffects.randomBounce.timer = setTimeout(() => {
                    activeEffects.randomBounce.active = false;
                    activeEffects.randomBounce.timer = null;
                }, 3000);
            } else {
                clearTimeout(activeEffects.randomBounce.timer);
                activeEffects.randomBounce.timer = setTimeout(() => {
                    activeEffects.randomBounce.active = false;
                    activeEffects.randomBounce.timer = null;
                }, 3000);
            }
        }
    },
    INVINCIBLE: {
        name: "Invincible",
        description: "God Mode - 일정 시간 동안 무적",
        color: "#FFD700",
        duration: 3000,
        effect: () => {
            if (!activeEffects.invincible.active) {
                activeEffects.invincible.active = true;
                activeEffects.invincible.timer = setTimeout(() => {
                    activeEffects.invincible.active = false;
                    activeEffects.invincible.timer = null;
                }, 3000);
            } else {
                clearTimeout(activeEffects.invincible.timer);
                activeEffects.invincible.timer = setTimeout(() => {
                    activeEffects.invincible.active = false;
                    activeEffects.invincible.timer = null;
                }, 3000);
            }
        }
    }
};

// 특수 아이템 활성화 유무 및 타이머 저장 객체
let activeEffects = {
    bigPaddle: {active: false, timer: null, multiplier: 1.5},
    speedUp: {active: false, timer: null, multiplier: 1.5},
    smallPaddle: {active: false, timer: null, multiplier: 0.6},
    reverseControl: {active: false, timer: null},
    slowControl: {active: false, timer: null},
    screenFlicker: {active: false, timer: null, interval: null},
    randomBounce: {active: false, timer: null},
    invincible: {active: false, timer: null}
};

// 입력 딜레이용 변수
let controlDelay = 0;
let lastControlTime = 0;


// 특수 아이템 활성화 함수
function activateSpecialItem(itemType, brickI, brickJ) {
    if (!SPECIAL_ITEMS[itemType]) return;

    const item = SPECIAL_ITEMS[itemType];

    if (itemType === "DESTROY_AROUND") item.effect(brickI, brickJ);
    else item.effect();

    showItem(item);

    console.log(`특수 아이템 활성화: ${item.name} - ${item.description}`);
}

let itemDisplayTimer = null;

function showItem(item) {
    let item_container = $("#game-item");
    let item_img = $("#game-item > img");
    let item_desc = $("#game-item > span");

    if (itemDisplayTimer) clearTimeout(itemDisplayTimer);
    let iconPath = getIconPath(item.name);
    item_img.attr("src", iconPath);
    item_img.attr("alt", item.name);
    item_img.css("display", "block");

    item_desc.text(item.description);

    item_container.addClass("show");
    itemDisplayTimer = setTimeout(() => {
        item_container.removeClass("show");
        setTimeout(() => {
            item_img.attr("src", "");
            item_desc.text("");
        }, 300);
    }, 3000);

}

function getIconPath(itemName) {
    const iconMap = {
        "Big Paddle": "../img/icons/big_paddle.png",
        "Extra Life": "../img/icons/extra_life.png",
        "Destroy Around": "../img/icons/destroy_around.png",
        "Speed Up": "../img/icons/speed_up.png",
        "Restore Bricks": "../img/icons/restore_bricks.png",
        "Small Paddle": "../img/icons/small_paddle.png",
        "Slow Control": "../img/icons/slow_control.png",
        "Screen Flicker": "../img/icons/screen_flicker.png",
        "Random Bounce": "../img/icons/random_bounce.png",
        "Invincible": "../img/icons/invincible.png"
    };

    return iconMap[itemName] || "Does not exist";
}


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
    brickRow = 4;
    brickCol = currentLevel + 2;
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


// 마우스 이동에 따라 패들 움직이기 (딜레이 적용)
function mouseMoveHandler(e) {
    const currentTime = Date.now();
    if (currentTime - lastControlTime < controlDelay) return;
    lastControlTime = currentTime;

    const rect = canvas.getBoundingClientRect();
    let relativeX = e.clientX - rect.left;

    if (activeEffects.reverseControl.active) relativeX = canvas.width - relativeX;

    if (relativeX > 0 && relativeX < canvas.width) {
        const newX = relativeX - paddle.width / 2;
        paddle.x = Math.max(0, Math.min(canvas.width - paddle.width, newX));
    }
}

// 키보드 방향키 좌우로 패들 움직이기 Work in Progress
function keyboardMoveHandler(e) {
    // const currentTime = Date.now();
    // if (e.type === "keydown" && currentTime - lastControlTime < controlDelay) return;
    // TODO: 입력 반전 아이템 적용시 방향키 입력 반전 적용
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        if (e.type === "keydown") {
            rightPressed = true;
            lastControlTime = currentTime;
        } else if (e.type === "keyup") {
            rightPressed = false;
        }
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        if (e.type === "keydown") {
            leftPressed = true;
            lastControlTime = currentTime;
        } else if (e.type === "keyup") {
            leftPressed = false;
        }
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
                let brickColor = "white";
                if (bricks[i][j].specialItem) {
                    brickColor = SPECIAL_ITEMS[bricks[i][j].specialItem].color;
                }

                context.fillStyle = brickColor;
                context.fillRect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);

                if (bricks[i][j].specialItem) {
                    context.fillStyle = "white";
                    context.font = "12px Arial";
                    context.textAlign = "center";
                    context.fillText(bricks[i][j].specialItem,
                        bricks[i][j].x + brickWidth / 2,
                        bricks[i][j].y + brickHeight / 2 + 4
                    );
                }
            }
        }
    }
}


function setBrick() {
    bricks = []
    for (let i = 0; i < brickRow; i++) {
        bricks[i] = []
        for (let j = 0; j < brickCol; j++) {
            // 25% 확률로 특수 아이템 부여
            let specialItem = null;
            if (Math.random() < itemRate[currentLevel]) {
                const itemKeys = Object.keys(SPECIAL_ITEMS);
                specialItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
                // specialItem = itemKeys[6];
            }

            bricks[i][j] = {
                x: j * (brickWidth + brickPadding) + brickStartX,
                y: i * (brickHeight + brickPadding) + brickStartY,
                status: true,
                strength: brickStrength,
                specialItem: specialItem
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
                        if (brick.strength === 0) {
                            brick.status = false;
                            if (brick.specialItem) {
                                activateSpecialItem(brick.specialItem, i, j);
                            }
                        }
                        isCollison = true;
                        break;
                    }
                }
            }
            if (isCollison) break;
        }
    }

    // 바닥 벽과 부딪혔을 때 목숨 -1 (무적 상태가 아닐 때만)
    if (!isCollison && ball.y + ball.radius > canvas.height) {
        if (!activeEffects.invincible.active) {
            live--;
        }
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = 5;
        ball.dy = 7;
        isCollison = true;
    }

    // 패들과 부딪혔을 때 각도 속도 Work in Progress
    if (!isCollison && ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height && ball.x + ball.radius > paddle.x && ball.x - ball.radius < paddle.x + paddle.width) {
        if (activeEffects.randomBounce.active) {
            // 특수 아이템 활성화시
            const randomAngle = (Math.random() - 0.5) * Math.PI; // -90도 ~ 90도
            const speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
            ball.dx = speed * Math.sin(randomAngle);
            ball.dy = -Math.abs(speed * Math.cos(randomAngle));
        } else {
            // 특수 아이템 미적용시 
            let hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            let angle = hitPoint * (Math.PI / 3);
            let speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
            ball.dx = speed * Math.sin(angle);
            ball.dy = -Math.abs(speed * Math.cos(angle));
        }
    }
}


function Logger() {
    console.log(`ball dx: ${ball.dx}`);
    console.log(`ball dy: ${ball.dy}`);
    console.log(`live: ${live}`);
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

    if (activeEffects.invincible.active) {
        context.strokeStyle = "gold";
        context.lineWidth = 3;
        context.strokeRect(paddle.x - 2, paddle.y - 2, paddle.width + 4, paddle.height + 4);
        context.lineWidth = 1;
    }
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


