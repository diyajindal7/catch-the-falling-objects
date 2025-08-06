const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

let basket = { x: 180, y: 550, width: 40, height: 20, speed: 5 };
let objects = [];
let score = 0;
let timeLeft = 30;
let gameRunning = false;
let gameOver = false;
let objectSpeed = 3;
let objectInterval;

// Mouse control
canvas.addEventListener("mousemove", (e) => {
    let rect = canvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left - basket.width / 2;
});

// Mobile touch control
canvas.addEventListener("touchmove", (e) => {
    let rect = canvas.getBoundingClientRect();
    let touch = e.touches[0];
    basket.x = touch.clientX - rect.left - basket.width / 2;
    e.preventDefault();
});

// Start game on click/tap
canvas.addEventListener("click", () => {
    if (!gameRunning && !gameOver) startGame();
    if (gameOver) resetGame();
});

function startGame() {
    gameRunning = true;
    score = 0;
    timeLeft = 30;
    objectSpeed = 3;
    objects = [];

    objectInterval = setInterval(createObject, 1000);
    let timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
        if (timeLeft % 5 === 0) objectSpeed += 0.5; // speed up every 5 sec
    }, 1000);
}

function resetGame() {
    gameOver = false;
    startGame();
}

function endGame() {
    clearInterval(objectInterval);
    gameRunning = false;
    gameOver = true;
}

function createObject() {
    let x = Math.random() * (canvas.width - 20);
    objects.push({ x: x, y: 0, width: 20, height: 20, speed: objectSpeed });
}

function updateObjects() {
    for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        obj.y += obj.speed;

        // Collision with basket
        if (
            obj.x < basket.x + basket.width &&
            obj.x + obj.width > basket.x &&
            obj.y < basket.y + basket.height &&
            obj.y + obj.height > basket.y
        ) {
            score++;
            objects.splice(i, 1);
            i--;
        }

        // Remove if falls off
        if (obj.y > canvas.height) {
            objects.splice(i, 1);
            i--;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameRunning && !gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Click to Start", canvas.width / 2, canvas.height / 2);
        return;
    }

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "24px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 20);
        ctx.fillText("Click to Play Again", canvas.width / 2, canvas.height / 2 + 60);
        return;
    }

    // Draw basket
    ctx.fillStyle = "white";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

    // Draw objects
    ctx.fillStyle = "red";
    objects.forEach((obj) => {
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
    });

    // Draw score & timer
    ctx.fillStyle = "yellow";
    ctx.font = "20px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 10, 20);

    ctx.textAlign = "right";
    ctx.fillText("Time: " + timeLeft, canvas.width - 10, 20);
}

function gameLoop() {
    if (gameRunning) updateObjects();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
