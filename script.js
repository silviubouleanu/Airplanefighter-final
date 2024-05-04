const airplane = document.querySelector(".airplane");
const gameContainer = document.querySelector(".game-container");
const OBSTACLE_MARGIN_BOTTOM = 50;
let score = 0;
let isGameOver = false;

function checkCollision(projectile) {
    const airplaneRect = airplane.getBoundingClientRect();
    const obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach(function (obstacle) {
        const obstacleRect = obstacle.getBoundingClientRect();
        if (
            airplaneRect.left < obstacleRect.right &&
            airplaneRect.right > obstacleRect.left &&
            airplaneRect.top < obstacleRect.bottom &&
            airplaneRect.bottom > obstacleRect.top
        ) {
            endGame();
        }
        if (projectile) {
            const projectileRect = projectile.getBoundingClientRect();
            if (
                projectileRect.left < obstacleRect.right &&
                projectileRect.right > obstacleRect.left &&
                projectileRect.top < obstacleRect.bottom &&
                projectileRect.bottom > obstacleRect.top
            ) {
                obstacle.remove();
                score += 10;
                document.getElementById("score").innerText = "Score: " + score;
                projectile.remove();
            }
        }
    });
}

function endGame() {
    isGameOver = true;
    alert("Game Over! Score: " + score);
    restartBtn.style.display = "block";
}

function resetObstacles() {
    const obstacles = document.querySelectorAll(".obstacle");
    obstacles.forEach(function (obstacle) {
        obstacle.remove();
    });
}

restartBtn.addEventListener("click", function () {
    score = 0;
    isGameOver = false;
    restartBtn.style.display = "none";
    document.getElementById("score").innerText = "Score: " + score;
    resetObstacles();
    createObstacle();
});

document.addEventListener("keydown", function (event) {
    if (!isGameOver) {
        move(event.key);
        if (event.key === " ") {
            shootProjectile();
        }
    }
});

function move(direction) {
    const airplane = document.querySelector(".airplane");
    const gameContainerRect = gameContainer.getBoundingClientRect();
    const airplaneRect = airplane.getBoundingClientRect();

    let airplaneLeft = parseInt(window.getComputedStyle(airplane).getPropertyValue("left"));
    let airplaneTop = parseInt(window.getComputedStyle(airplane).getPropertyValue("top"));

    const moveAmount = 10;

    switch (direction) {
        case "ArrowLeft":
            if (airplaneLeft > 0) {
                airplane.style.left = airplaneLeft - moveAmount + "px";
            }
            break;
        case "ArrowRight":
            const gameContainerWidth = gameContainerRect.width;
            const airplaneWidth = airplane.offsetWidth;
            if (airplaneLeft + airplaneWidth < gameContainerWidth) {
                airplane.style.left = airplaneLeft + moveAmount + "px";
            }
            break;
        case "ArrowUp":
            const minUpPosition = gameContainerRect.top;
            if (airplaneRect.top > minUpPosition) {
                airplane.style.top = airplaneTop - moveAmount + "px";
            }
            break;
        case "ArrowDown":
            const gameContainerHeight = gameContainerRect.height;
            if (airplaneRect.bottom < gameContainerHeight) {
                airplane.style.top = airplaneTop + moveAmount + "px";
            }
            break;
    }
}

function shootProjectile() {
    const projectile = document.createElement("div");
    projectile.classList.add("projectile");
    gameContainer.appendChild(projectile);

    let projectileTop = parseInt(window.getComputedStyle(airplane).getPropertyValue("top")) + 20;
    let projectileLeft = parseInt(window.getComputedStyle(airplane).getPropertyValue("left")) + 70;
    projectile.style.top = projectileTop + "px";
    projectile.style.left = projectileLeft + "px";

    const projectileInterval = setInterval(function () {
        if (!isGameOver) {
            projectileLeft += 10;
            projectile.style.left = projectileLeft + "px";
            checkCollision(projectile);
            checkProjectileOutOfBounds(projectile, projectileInterval);
        } else {
            clearInterval(projectileInterval);
        }
    }, 50);
}

function checkProjectileOutOfBounds(projectile, interval) {
    const projectileRect = projectile.getBoundingClientRect();
    const gameContainerRect = gameContainer.getBoundingClientRect();
    if (projectileRect.right > gameContainerRect.right) {
        clearInterval(interval);
        projectile.remove();
    }
}

function createObstacle() {
    const obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");

    const gameContainerRect = gameContainer.getBoundingClientRect();
    const maxTop = gameContainerRect.height - OBSTACLE_MARGIN_BOTTOM;
    const obstacleTop = Math.floor(Math.random() * maxTop);
    const obstacleLeft = gameContainerRect.width;

    obstacle.style.top = obstacleTop - 10 + "px";
    obstacle.style.left = obstacleLeft - 10 + "px";

    gameContainer.appendChild(obstacle);

    const obstacleInterval = setInterval(function () {
        if (!isGameOver) {
            const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left"));
            if (obstacleLeft > -OBSTACLE_MARGIN_BOTTOM) {
                obstacle.style.left = obstacleLeft - 10 + "px";
            } else {
                clearInterval(obstacleInterval);
                obstacle.remove();
                createObstacle();
            }
            checkCollision();
        } else {
            clearInterval(obstacleInterval);
        }
    }, 100);
}

createObstacle();