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
let brickStrength = 1;
let brickStartX;
let brickStartY;
let brickWidth;
let brickHeight;
let brickPadding;
let brickMoveX;
let brickMoveY;
let isRunning = true;
const storage = window.localStorage;
let special_item, background_image, background_opacity, paddle_image, ball_image, brick_image, music, control;
let ballImgObj = null;
let paddleImgObj = null;
let backgroundImgObj = null;
let brickImgObj = null;
let bgmAudio = null;
let preferences;
let profile;
let currentLevel = 0;
let itemDisplayTimer = null;
let AnimaID = null;
let restartBallTimer = null;
let particles = [];
const itemRate = {
    0: 0.2,
    1: 0.25,
    2: 0.3,
    3: 0.4,
};


const SPECIAL_ITEMS = {
    BIG_PADDLE: {
        name: "Big Paddle",
        description: "공구 상자 - 패들 크기 일시적 증가",
        color: "#32CD32",
        duration: 3000,
        sound: "../audio/sfx/sizechange.mp3",
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
        sound: "../audio/sfx/extra_life.mp3",
        effect: () => {
            live++;
        }
    },
    DESTROY_AROUND: {
        name: "Destroy Around",
        description: "폭탄 - 주변 벽돌 파괴",
        color: "#FF4500",
        sound: "../audio/sfx/destroy_around.mp3",
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
        sound: "../audio/sfx/speed_up.mp3",
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
        sound: "../audio/sfx/restore_bricks.mp3",
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
        sound: "../audio/sfx/sizechange.mp3",
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
        sound: "../audio/sfx/reverse_control.mp3",
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
        sound: "../audio/sfx/slow_control.mp3",
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
        sound: "../audio/sfx/screen_flicker.mp3",
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
        description: "컴공식 물리학 - 공이 랜덤한 방향으로 튕김",
        color: "#00CED1",
        duration: 3000,
        sound: "../audio/sfx/random_bounce.mp3",
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
        sound: "../audio/sfx/invincible.mp3",
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


function breakEffect(brickI, brickJ) {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: bricks[brickI][brickJ].x + brickWidth / 2,
            y: bricks[brickI][brickJ].y + brickHeight / 2,
            dx: (Math.random() - 0.5) * 10,
            dy: (Math.random() - 0.5) * 10,
            life: 0.8,
            size: brickHeight
        });
    }
}

function playBrickSound(itemType = null) {
    let src;

    if (itemType && SPECIAL_ITEMS[itemType] && SPECIAL_ITEMS[itemType].sound) {
        src = SPECIAL_ITEMS[itemType].sound;
    } else {
        src = "../audio/sfx/brick_hit.mp3"; // 일반 벽돌 기본 효과음
    }

    const sfx = new Audio(src);
    sfx.volume = 0.3;
    sfx.play().catch(err => console.warn("벽돌 효과음 재생 실패:", err));
}

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


function showItem(item) {
    let item_container = $("#game-item");
    let item_img = $("#game-item > img");
    let item_desc = $("#game-item > span");

    if (itemDisplayTimer) clearTimeout(itemDisplayTimer);
    let iconPath = getIconPath(item.name);
    item_img.attr("src", iconPath);
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
        "Invincible": "../img/icons/invincible.png",
        "Reverse Control": "../img/icons/reverse_control.png"
    };

    return iconMap[itemName] || "Does not exist";
}


function initSetting() {
    profile = profileManager.getCurrentProfile();
    preferences = profile["preferences"];
    console.log(preferences);
    control = preferences["controlMethod"] || "mouse";
    special_item = preferences["specialItem"] || true;
    background_image = "../img/" + preferences["backgroundImage"] + ".jpg" || "../img/bg1.jpg";
    backgroundImgObj = new Image();
    backgroundImgObj.src = background_image;
    background_opacity = Number(preferences["backgroundOpacity"]) || 1.0;
    paddle_image = "../img/" + preferences["selectedPaddle"] + ".jpg" || "../img/bat.jpg";
    paddleImgObj = new Image();
    paddleImgObj.src = paddle_image;
    ball_image = "../img/" + preferences["selectedBall"] + ".jpg" || "../img/grenade.jpg";
    ballImgObj = new Image();
    ballImgObj.src = ball_image;
    brick_image = "../img/" + preferences["selectedBrick"] + ".jpg" || "../img/money.jpg";
    brickImgObj = new Image();
    brickImgObj.src = brick_image;
    music = "../audio/" + preferences["selectedMusic"] + ".mp3" || "../audio/1.mp3";
    bgmAudio = new Audio(music);
    bgmAudio.loop = true;
    bgmAudio.volume = preferences["musicVolume"] || 0.5;  // 0.0 ~ 1.0
    document.addEventListener("click", () => {
        if (bgmAudio && bgmAudio.paused) {
            bgmAudio.play();
        }
    });
    console.log(`Current level: ${profile["current_level"]}`);
    currentLevel = profile["current_level"];
    brickRow = currentLevel + 3 > 5 ? 5 : currentLevel + 3;
    brickCol = 4;
    if (currentLevel === LEVEL.IMPOSSIBLE) {
        brickRow = 15;
        brickCol = 18;
    }
    brickMoveX = Math.random() * 3 + currentLevel * 0.6;
    brickMoveY = Math.random() * 3 + currentLevel * 0.6;
}

function saveRecord(is_win, is_impossible) {
    profile["total_play_count"]++;
    profile["highest_score"] = Math.max(score, profile["highest_score"]);

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
    storage.setItem("gameResult", JSON.stringify({...status, "is_win": is_win}));
}

function StartButton() {
    const startBtn = $("<button/>");
    startBtn.css({
        position: "absolute",
        left: "50%",
        top: "40%",
        transform: "translate(-50%, -50%)",
        padding: "16px 32px",
        fontSize: "30px",
        cursor: "pointer",
        zIndex: 1,
        backgroundColor: "#4CAF50",
        color: "white",
        border: "1px solid #45A049",
        borderRadius: "4px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
        fontFamily: "Quantico, IBM Plex Sans KR, sans-serif",
        transition: "0.3s ease-in-out",
    });
    startBtn.text("Start game");
    startBtn.on("mouseenter", function() {
        $(this).css({
            backgroundColor: "black",
            border: "1px solid white",
        });
    }).on("mouseleave", function() {
        $(this).css({
            backgroundColor: "#4CAF50",
            border: "1px solid #45A049",
        });
    }).on("click", () => {
        if (bgmAudio && bgmAudio.paused) {
            bgmAudio.play().catch(err => console.warn("BGM play blocked:", err));
        }
        startBtn.remove();
        init();
        gameLoop();
    });
    $("body").append(startBtn);
}


$(() => {
    StartButton();
    // init(); //StartButton 안에 존재
    // gameLoop();
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
    const currentTime = Date.now();
    if (e.type === "keydown" && currentTime - lastControlTime < controlDelay) return;

    const isReversed = activeEffects.reverseControl.active;

    if ((isReversed ? e.key === 'Left' || e.key === 'ArrowLeft' : e.key === 'Right' || e.key === 'ArrowRight')) {
        if (e.type === "keydown") {
            rightPressed = true;
            lastControlTime = currentTime;
        } else if (e.type === "keyup") {
            rightPressed = false;
        }
    } else if ((isReversed ? e.key === 'Right' || e.key === 'ArrowRight' : e.key === 'Left' || e.key === 'ArrowLeft')) {
        if (e.type === "keydown") {
            leftPressed = true;
            lastControlTime = currentTime;
        } else if (e.type === "keyup") {
            leftPressed = false;
        }
    }
}

function drawBall() {
    if (ballImgObj && ballImgObj.complete) {
        context.drawImage(ballImgObj, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
    } else {
        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        context.fillStyle = ball.color;
        context.fill();
        context.closePath();
    }
}

function drawPaddle() {
    if (paddleImgObj && paddleImgObj.complete) {
        context.drawImage(paddleImgObj, paddle.x, paddle.y, paddle.width, paddle.height);
    } else {
        context.beginPath();
        context.fillStyle = paddle.color;
        context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        context.closePath();
    }
}

function drawTintedImage(img, x, y, width, height, tintColor) {
    context.drawImage(img, x, y, width, height);
    context.fillStyle = tintColor;
    context.globalAlpha = 0.5;
    context.globalCompositeOperation = "source-atop";
    context.fillRect(x, y, width, height);
    context.globalAlpha = 1.0;
    context.globalCompositeOperation = "source-over";
}

function drawBrick() {
    for (let i = 0; i < brickRow; i++) {
        for (let j = 0; j < brickCol; j++) {
            if (bricks[i][j].status) {
                if (bricks[i][j].specialItem) {
                    let brickColor = SPECIAL_ITEMS[bricks[i][j].specialItem].color;
                    brickColor = "#191919";
                    if (brickImgObj && brickImgObj.complete) {
                        drawTintedImage(brickImgObj, bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight, brickColor);
                    } else {
                        context.fillStyle = brickColor;
                        context.fillRect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
                    }
                } else {
                    if (brickImgObj && brickImgObj.complete) {
                        context.drawImage(brickImgObj, bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
                    } else {
                        context.fillStyle = "white";
                        context.fillRect(bricks[i][j].x, bricks[i][j].y, brickWidth, brickHeight);
                    }
                }
            }
        }
    }
}

function moveBrick() {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let i = 0; i < brickRow; i++) {
        for (let j = 0; j < brickCol; j++) {
            if (bricks[i][j].status) {
                minX = Math.min(minX, bricks[i][j].x);
                maxX = Math.max(maxX, bricks[i][j].x + brickWidth);
                minY = Math.min(minY, bricks[i][j].y);
                maxY = Math.max(maxY, bricks[i][j].y + brickHeight);
            }
        }
    }
    if (minX <= 0) brickMoveX = -brickMoveX;
    if (maxX >= canvas.width) brickMoveX = -brickMoveX;
    if (minY <= 0) brickMoveY = -brickMoveY;
    if (maxY >= canvas.height / 2) brickMoveY = -brickMoveY;

    for (let i = 0; i < brickRow; i++) {
        for (let j = 0; j < brickCol; j++) {
            if (bricks[i][j].status) {
                bricks[i][j].x += brickMoveX;
                bricks[i][j].y += brickMoveY;
            }
        }
    }
}

function setBrick() {
    bricks = []
    for (let i = 0; i < brickRow; i++) {
        bricks[i] = []
        for (let j = 0; j < brickCol; j++) {
            let specialItem = null;
            if (special_item && Math.random() < itemRate[currentLevel]) {
                const itemKeys = Object.keys(SPECIAL_ITEMS);
                specialItem = itemKeys[Math.floor(Math.random() * itemKeys.length)];
                if (Math.random() < 0.4) specialItem = itemKeys[3];
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
    $("#game-info>span:nth-of-type(4)").text(`Level : ${"★".repeat(currentLevel + 2)}${"☆".repeat(5 - (currentLevel + 2))}`);
}

function updateStatus() {
    // 시간 계산 - 왼쪽 상단 경과 시간 표시용
    time = stringTime(Math.floor(Date.now() - startTime));
    const elapsedTime = parseTime(time);
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

function setBallSpeed(isSlow) {
    if (restartBallTimer) restartBallTimer = null;

    if (isSlow) {
        ball.dx *= 0.7;
        ball.dy *= 0.7;
        restartBallTimer = setTimeout(() => {
            ball.dx /= 0.7;
            ball.dy /= 0.7;
        }, 1500);
    }
}

function checkWin() {
    if (live === 0 && isRunning) {
        console.log("Player lose!");
        alert("Are you idiot?");
        isRunning = false;
    } else if (bricks.flat().filter(brick => brick.status).length === 0 && isRunning) {
        console.log("Player win!");
        alert("Are you genius?");
        isRunning = false;
    }
    if (currentLevel === LEVEL.IMPOSSIBLE && parseTime(time) > parseTime("00:00:59")) {
        alert("Time done.");
        isRunning = false;
    }
    if (!isRunning) saveRecord(bricks.flat().filter(brick => brick.status).length === 0 && live > 0, currentLevel === LEVEL.IMPOSSIBLE);
}


function resetCanvas() {
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "white";
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.closePath();
    if (backgroundImgObj && backgroundImgObj.complete) {
        context.globalAlpha = background_opacity || 0.5;  // 불투명도 조절
        context.drawImage(backgroundImgObj, 0, 0, canvas.width, canvas.height);
        context.globalAlpha = 1.0; // 원상복구
    }
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
                            playBrickSound(brick.specialItem);
                            breakEffect(i, j);
                            console.log("breakEffect called");
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
        setBallSpeed(true);
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
            ball.dx *= Math.random() * 0.3 + 0.9;
            ball.dx *= Math.random() * 0.3 + 0.9;
            // 일정 속도 이하일 시 1.2배
            if (Math.abs(ball.dx) < 5) ball.dx *= 1.4;
            if (Math.abs(ball.dy) < 5) ball.dy *= 1.4;
        } else {
            // 특수 아이템 미적용시
            let hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
            let angle = hitPoint * (Math.PI / 3);
            let speed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);
            ball.dx = speed * Math.sin(angle);
            ball.dy = -Math.abs(speed * Math.cos(angle));
            ball.dx *= Math.random() * 0.3 + 0.9;
            ball.dx *= Math.random() * 0.3 + 0.9;
            if (Math.abs(ball.dx) < 5) ball.dx *= 1.4;
            if (Math.abs(ball.dy) < 5) ball.dy *= 1.4;
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
    if (currentLevel >= LEVEL.NORMAL) moveBrick();
    updateStatus();
    setStatus();
    checkWin();
}

function drawGame() {
    resetCanvas();
    drawBrick();
    drawBall();
    drawPaddle();

    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.life -= 0.02;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        context.save();
        context.globalAlpha = p.life;
        context.drawImage(brickImgObj, p.x - p.size, p.y - p.size, p.size * 6, p.size * 1);
        context.restore();
    }

    if (activeEffects.invincible.active) {
        context.strokeStyle = "gold";
        context.lineWidth = 3;
        context.strokeRect(paddle.x - 2, paddle.y - 2, paddle.width + 4, paddle.height + 4);
        context.lineWidth = 1;
    }
}



function gameLoop() { // Game 재귀적 실행
    if (!isRunning) {
        if (AnimaID) {
            cancelAnimationFrame(AnimaID);
            AnimaID = null;
        }
        window.location.href = "result.html";
    }
    updateGame();
    drawGame();
    requestAnimationFrame(gameLoop);
}

function init() {
    initSetting();
    switch (control) {
        case "mouse":
            $(document).mousemove(mouseMoveHandler);
            break;
        case "keyboard":
            $(document).keydown(keyboardMoveHandler);
            $(document).keyup(keyboardMoveHandler);
            break;
        default:
            $(document).mousemove(mouseMoveHandler);
            break;
    }

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    canvas.width = $("#game-screen").width();
    canvas.height = $("#game-screen").height() * 0.7;
    brickPadding = canvas.width * 0.004;
    brickWidth = canvas.width / (brickCol + 2);
    brickHeight = canvas.height * 0.05;
    if (currentLevel === LEVEL.IMPOSSIBLE) {
        brickHeight = canvas.height * 0.01;
    }
    brickStartX = (canvas.width - (brickWidth + brickPadding) * brickCol) / 2;
    brickStartY = canvas.height * 0.08;
    rightPressed = false;
    leftPressed = false;
    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.width * 0.015,
        src: "img/img.jpg",
        dx: 7,
        dy: 10,
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
    if (currentLevel === LEVEL.IMPOSSIBLE) {
        paddle.width = canvas.width * 0.1;
        ball.radius = canvas.width * 0.005;
        brickStrength = 2;
    }


    bricks = [];
    setBrick();
    setBallSpeed(true);
    setInterval(Logger, 1000);
}