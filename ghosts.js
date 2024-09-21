const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

import { maze } from './maze.js';

import { fireman } from './movement.js'; 
const tilesize = Math.min(canvas.width / maze[0].length, canvas.height / maze.length);
const ghostObject = {
    height: tilesize,
    width: 30,
    speed: 2,
    currentDirection: null,  
    framesToChangeDirection: 0, 
};

const blinky = Object.create(ghostObject); 
blinky.x = canvas.width / 2;  
blinky.y = canvas.height / 2;  
const blinkyimg = new Image(); 
blinkyimg.src = './images/ghost2.png';

const pinky = Object.create(ghostObject);
pinky.x = 32*29; 
pinky.y = tilesize; 
const pinkyimg = new Image();
pinkyimg.src = './images/ghost1.png';

const inky = Object.create(ghostObject);
inky.x = 32*10; 
inky.y = tilesize*2; 
const inkyimg = new Image();
inkyimg.src = './images/ghost3.png';

const clyde = Object.create(ghostObject);
clyde.x = canvas.width / 2; 
clyde.y = canvas.height / 2; 
const clydeimg = new Image();
clydeimg.src = './images/ghost4.png';


function getRandomDirection() {
    const directions = ["up", "down", "left", "right"];
    return directions[Math.floor(Math.random() * directions.length)];
}

function moveBlinky() {
    const direction = getDirectionTowards(fireman.x, fireman.y, blinky.x, blinky.y);
   moveGhost(blinky, direction); }
function moveGhostRandomly(ghost) {
    if (ghost.framesToChangeDirection <= 0) {
        // When the counter reaches zero, choose a new random direction
        ghost.framesToChangeDirection = Math.floor(Math.random() * 60) + 30;
        ghost.currentDirection = getRandomDirection();
    } 
    moveGhost(ghost, ghost.currentDirection);
}


function canMoveTo(x, y,ghost) {
    
    const tileX1 = Math.floor(x / 32);
    const tileY1 = Math.floor(y / tilesize);
    const tileX2 = Math.floor((x + ghost.width - 1) / 32);
    const tileY2 = Math.floor((y + ghost.height - 1) / tilesize);

    for (let tx = tileX1; tx <= tileX2; tx++) {
        for (let ty = tileY1; ty <= tileY2; ty++) {
            if (ty >= 0 && ty < maze.length && tx >= 0 && tx < maze[0].length) {
                if (maze[ty][tx] === 1) {
                    return 1; 
                }
            }
        }
    }
    return 0; 
}



function moveGhost(ghost, direction) {
    let newX = ghost.x;
    let newY = ghost.y;

    const OffsetX = Math.random() > 0.5 ? ghost.speed * (Math.random() - 0.5) : 0; 
    const OffsetY = Math.random() > 0.5 ? ghost.speed * (Math.random() - 0.5) : 0;

   
    newX += OffsetX;
    newY += OffsetY;
  
    switch (direction) {
        case "up": newY -= ghost.speed; break;
        case "down": newY += ghost.speed; break;
        case "left": newX -= ghost.speed; break;
        case "right": newX += ghost.speed; break;
    }


    if (canMoveTo(newX, newY, ghost)===0 ){
        ghost.x = newX;
        ghost.y = newY;
    }
}
let gameOver=false;
function checkCollision(ghost) {
    return (
        fireman.x < ghost.x + ghost.width &&
        fireman.x + fireman.width > ghost.x &&
        fireman.y < ghost.y + ghost.height &&
        fireman.y + fireman.height > ghost.y
    );
}


function checkCollisions() {
    const ghosts = [pinky, inky, clyde];
    
    for (let ghost of ghosts) {
        if (checkCollision(ghost)) {
            gameOver=true;
            localStorage.setItem('gameScore', score);
            window.location.href = 'exitpage.html';
            return; 
        }
    }
}

function getDirectionTowards(targetX, targetY, currentX, currentY) {
    if (Math.abs(targetX - currentX) > Math.abs(targetY - currentY)) {
        return targetX > currentX ? "right" : "left";
    } else {
        return targetY > currentY ? "down" : "up";
    }
}



function drawGhosts() {
    ctx.drawImage(pinkyimg, pinky.x, pinky.y, pinky.width, pinky.height);
    ctx.drawImage(inkyimg, inky.x, inky.y, inky.width, inky.height);
    ctx.drawImage(clydeimg, clyde.x, clyde.y, clyde.width, clyde.height);
    ctx.drawImage(blinkyimg,blinky.x,blinky.y,blinky.width,blinky.height);
}


function updateGhosts() {
    if (gameOver) return;
    moveGhostRandomly(pinky);
    moveGhostRandomly(inky); 
    moveGhostRandomly(clyde); 
    moveBlinky();
    drawGhosts(); 
    checkCollisions();
    window.requestAnimationFrame(updateGhosts);
}


Promise.all([
    new Promise(resolve => pinkyimg.onload = resolve),
    new Promise(resolve => inkyimg.onload = resolve),
    new Promise(resolve => clydeimg.onload = resolve),
    new Promise(resolve => blinkyimg.onload = resolve),
]).then(() => {
    console.log("All ghost images are loaded");
    window.requestAnimationFrame(updateGhosts);  
});

export { updateGhosts };