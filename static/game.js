let canvas;
let context;
let main_element;

let request_id;
let fpsInterval = 1000/30; // The denominator is frames per second.
let now;
let then = Date.now();

let backgroundImage = new Image();

let tilesPerRow = 24;
let tileSize = 16;

let background = [
    [2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,73, 5,72, 9,72, 5,73, 3, 3, 3, 3, 3,75, 3, 3, 3, 3, 3, 4],
    [26,27,27,27,27,27,98,27,27,27,27,27,27,97,29,96,33,96,29,97,27,27,27,27,27,27,27,27,27,27,27,26],
    [26,220,221,221,221,221,221,221,221,221,221,221,221,272,53,247,57,245,53,271,221,221,221,221,221,221,221,221,221,221,222,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,243,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,264,265,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,240,241,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,218,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,242,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,225,226,227,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [26,244,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,245,246,26],
    [50, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,75, 3, 3, 3, 3, 3, 3, 3, 3, 3,28],
    [48,27,27,27,27,99,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,27,48]
];

let player = {
    x : 0,
    y : 0,
    width : 32,
    height : 48,
    frameX : 0,
    frameY : 0,
    xChange : 0,
    yChange : 0
};

let health = 100;
let health_element = document.querySelector("#health");

let playerImage = new Image();

let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

let fireball = [];
let fireballPossess = false;
let fireballShoot = false;
let fireballLeft = false;
let fireballRight = false;
let fireballUp = false;
let fireballDown = false;

let enemy = {
    x : 0,
    y : 0,
    width : 32,
    height : 48,
    frameX : 0,
    frameY : 0,
    xChange : 0,
    yChange : 0
};

let enemyHealth = 1;

let enemyImage = new Image();

let bottomWall;
let topWall;
let leftWall;
let rightWall;


let score = 0;

let xhttp;

let liked_count_element;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    liked_count_element = document.querySelector("#count");
    window.setInterval(update_liked_count,600);

    health_element.innerHTML = "Player health: " + health;
    window.addEventListener("keydown",activate,false);
    window.addEventListener("keyup",deactivate,false);

    bottomWall = canvas.height - 27;
    topWall = canvas.height - 280;
    leftWall = canvas.width - 470;
    rightWall = canvas.width - 10;

    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    enemy.x = canvas.width / 2;
    enemy.y = canvas.height - 293;

    backgroundImage.src = "../static/dungeon.png";
    playerImage.src = "../static/knight.png";
    enemyImage.src = "../static/enemy.png";


    draw();
    
}

function draw() {
    request_id = window.requestAnimationFrame(draw);
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    
    let f = {
        x : player.x,
        y : player.y,
        size: 10,
        xChange : 0,
        yChange : 0
    };

    let faceRight = (fireballShoot) && (player.frameY === 2);
    let faceLeft = (fireballShoot) && (player.frameY === 1);
    let faceUp = (fireballShoot) && (player.frameY === 3);
    let faceDown = (fireballShoot) && (player.frameY === 0);

    let enemyDown = (player.x === enemy.x) && (player.y > enemy.y);
    let enemyUp = (player.x === enemy.x) && (player.y < enemy.y);
    let enemyRight = (player.x > enemy.x) && (player.y === enemy.y);
    let enemyLeft = (player.x < enemy.x) && (player.y === enemy.y);
    let enemyBottomLeft = (player.x < enemy.x) && (player.y > enemy.y);
    let enemyBottomRight = (player.x > enemy.x) && (player.y > enemy.y);
    let enemyTopLeft = (player.x < enemy.x) && (player.y < enemy.y);
    let enemyTopRight = (player.x > enemy.x) && (player.y < enemy.y);
    // Draw background on canvas.
    
    for (let r = 0; r < 20; r += 1) {
        for (let c = 0; c < 32; c += 1) {
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    };

    // Draw enemy
    context.drawImage(enemyImage,
        enemy.width * enemy.frameX, enemy.height * enemy.frameY, enemy.width, enemy.height,
        enemy.x, enemy.y, enemy.width, enemy.height);
    if ((enemyLeft || enemyRight) && ! (enemyLeft && enemyRight) || (enemyUp || enemyDown) && ! (enemyUp && enemyDown) || (enemyTopLeft || enemyTopRight) && ! (enemyTopLeft && enemyTopRight) || (enemyBottomLeft || enemyBottomRight) && ! (enemyBottomLeft && enemyBottomRight)) {
        enemy.frameX = (enemy.frameX + 1) % 4;
    }
    // Draw player
    context.drawImage(playerImage,
        player.width * player.frameX, player.height * player.frameY, player.width, player.height,
        player.x, player.y, player.width, player.height);
    if ((moveLeft || moveRight) && ! (moveLeft && moveRight) || (moveUp || moveDown) && ! (moveUp && moveDown)) {
        player.frameX = (player.frameX + 1) % 4;
    }
    
    
    if (player_collides(enemy)) {
        stop("You Died!");
        return;
    } 
    
    for (let f of fireball) {
        if (fireball_collides(f)) {
            enemyHealth = enemyHealth - 1;
        }
    }
    if (enemyHealth === 0) {
        enemy.x = canvas.width / 2;
        enemy.y = canvas.height - 293;
        health = 100;
        health_element.innerHTML = "Player health: " + health;
        enemyHealth = enemyHealth + 1;
        score = score + 1;
    }
    
    
    // Fireballs
    
    if (fireballShoot) {
        document.getElementById("shoot").play();
        if (fireballPossess === false) {
            fireball.push(f);
            fireballPossess = true;
        }
    }

    context.fillStyle = "orange";

    for (let f of fireball) {
        context.fillRect(f.x,f.y,f.size,f.size);
    }
    
    if (faceRight) {
        fireballRight = true;
        fireballLeft = false;
        fireballUp = false;
        fireballDown = false;
    } else if (faceLeft) {
        fireballRight = false;
        fireballLeft = true;
        fireballUp = false;
        fireballDown = false;
    } else if (faceUp) {
        fireballRight = false;
        fireballLeft = false;
        fireballUp = true;
        fireballDown = false;
    } else if (faceDown) {
        fireballRight = false;
        fireballLeft = false;
        fireballUp = false;
        fireballDown = true;
    }
    
    if (fireballRight) {
        f.xChange = f.xChange + 15;
    } else if (fireballLeft) {
        f.xChange = f.xChange - 15;
    } else if (fireballUp) {
        f.yChange = f.yChange - 15;
    } else if (fireballDown) {
        f.yChange = f.yChange + 15;
    }

    for (let f of fireball) {
        f.x = f.x + f.xChange;
        f.y = f.y + f.yChange;
    }
    
    // Sprite frames
    if (moveRight) {
        player.x = player.x + 3;
        player.frameY = 2;
    }
    if (moveLeft) {
        player.x = player.x - 3;
        player.frameY = 1;
    }
    if (moveUp) {
        player.y = player.y - 3;
        player.frameY = 3;
    }
    if (moveDown) {
        player.y = player.y + 3;
        player.frameY = 0;
    }

    // Enemy going to player
    if (enemyDown) {
        enemy.y = enemy.y + 1;
        enemy.frameY = 0;
    } else if (enemyUp) {
        enemy.y = enemy.y - 1;
        enemy.frameY = 3;
    } else if (enemyRight) {
        enemy.x = enemy.x + 1;
        enemy.frameY = 2;
    } else if (enemyLeft) {
        enemy.x = enemy.x - 1;
        enemy.frameY = 1;
    } else if (enemyBottomLeft) {
        enemy.x = enemy.x - 1;
        enemy.y = enemy.y + 1;
        enemy.frameY = 0;
    } else if (enemyBottomRight) {
        enemy.x = enemy.x + 1;
        enemy.y = enemy.y + 1;
        enemy.frameY = 0;
    } else if (enemyTopLeft) {
        enemy.x = enemy.x - 1;
        enemy.y = enemy.y - 1;
        enemy.frameY = 3;
    } else if (enemyTopRight) {
        enemy.x = enemy.x + 1;
        enemy.y = enemy.y - 1;
        enemy.frameY = 3;
    }

    // Wall collisions
    if (player.y + player.height > bottomWall) {
        player.y = bottomWall - player.height;
        player.yChange = 0;
        player.frameX = 0;
        document.getElementById("wall").play();
    }
    if (player.y + player.height < topWall) {
        player.y = topWall - player.height;
        player.yChange = 0;
        player.frameX = 0;
        document.getElementById("wall").play();
    }
    if (player.x + player.width < leftWall) {
        player.x = leftWall - player.width;
        player.xChange = 0;
        player.frameX = 0;
        document.getElementById("wall").play();
    }
    if (player.x + player.width > rightWall) {
        player.x = rightWall - player.width;
        player.xChange = 0;
        player.frameX = 0;
        document.getElementById("wall").play();
    }
};


function randint(min,max) {
    return Math.round(Math.random() * (max-min)) + min;
};

// Controls
function activate(event) {
    let key = event.key;
    if ((key === "a") || (key === "ArrowLeft")) {
        moveLeft = true;
    } else if ((key === "d") || (key === "ArrowRight")) {
        moveRight = true;
    } else if ((key === "w") || (key === "ArrowUp")) {
        moveUp = true;
    } else if ((key === "s") || (key === "ArrowDown")) {
        moveDown = true;
    } else if ((key === "Enter") || (key === " ")) {
        fireballShoot = true;
    }
};

function deactivate(event) {
    let key = event.key;
    if ((key === "a") || (key === "ArrowLeft")) {
        moveLeft = false;
        player.frameX = 0;
    } else if ((key === "d") || (key === "ArrowRight")) {
        moveRight = false;
        player.frameX = 0;
    } else if ((key === "w") || (key === "ArrowUp")) {
        moveUp = false;
        player.frameX = 0;
    } else if ((key === "s") || (key === "ArrowDown")) {
        moveDown = false;
        player.frameX = 0;
    } else if ((key === "Enter") || (key === " ")) {
        fireballShoot = false;
        fireballPossess = false;
    }
};

function player_collides(enemy) {
    if  (player.x + player.width < enemy.x ||
        enemy.x + enemy.width < player.x ||
        player.y > enemy.y + enemy.height ||
        enemy.y > player.y + player.height)  {
            return false;
    } else {
        health_element.innerHTML = "Player health: " + health;
        health = health - 1;
        if (health === 0) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = "#B49BC2";
            context.fillRect(0, 0, canvas.width, canvas.height);
            health_element.innerHTML = "";
            document.getElementById("hit").play();
            return true;
        }
    }
};


function fireball_collides(f) {
    if (f.x + f.size < enemy.x ||
        enemy.x + enemy.width < f.x ||
        f.y > enemy.y + enemy.height ||
        enemy.y > f.y + f.size) {
        return false;
    } else {
        return true;
    }
};



function stop(outcome) {
    window.removeEventListener("keydown",activate,false);
    window.removeEventListener("keyup",deactivate,false);
    window.cancelAnimationFrame(request_id);
    let outcome_element = document.querySelector("#outcome");
    outcome_element.innerHTML = outcome;

    let data = new FormData();
    data.append("score",score);
    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response, false);
    xhttp.open("POST","/store_score",true);
    xhttp.send(data);
};

function handle_response() {
    // Check that the response has fully arrived.
    if ( xhttp.readyState === 4 ) {
        // Check that the request was successful.
        if ( xhttp.status === 200 ) {
            if ( xhttp.responseText === "success" ) {
                // score was successfully stored in database
            } else {
                // score wasn't successfully stored in database
            }
        }
    }
};


function update_liked_count() {
    xhttp = new XMLHttpRequest();
    xhttp.addEventListener("readystatechange", handle_response2, false);
    xhttp.open("GET","/get_num_likes", true);
    xhttp.send(null);
};

function handle_response2() {
    // Check that the response has fully arrived.
    if ( xhttp.readyState === 4 ) {
        // Check the request was successful.
        if ( xhttp.status === 200 ) {
            let response = JSON.parse(xhttp.responseText)
            liked_count_element.innerHTML = response.count + " people like this game!";
        }
    }
};
