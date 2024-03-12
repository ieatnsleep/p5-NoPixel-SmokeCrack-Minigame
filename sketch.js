let targetString = '';
let currentIndex = 0;
let boxSize = 50;

let gameStarted = false;
let gameOverFlag = false; // Flag to track if game over screen is displayed

let timerBarWidth; 
let timerBarHeight = 20; 
let timerBarInitialWidth; 
let timerBarX; 
let timerBarY = 10;
let timerDecreaseRate = 2.25; // Rate at which the timer bar decreases per frame

let correctness = []; 

function setup() {
    createCanvas(800, 800);
    textAlign(CENTER, CENTER);
    timerBarInitialWidth = width - 50;
    timerBarWidth = timerBarInitialWidth; 
    timerBarX = width / 2; 
    targetString = generateRandomString();
    for (let i = 0; i < targetString.length; i++) {
        correctness.push(null); // Initially set all characters as untyped
    }
}

function draw() {
    background(200);

    fill('red');
    rect(timerBarX - timerBarWidth / 2, timerBarY, timerBarWidth, timerBarHeight);

    if (!gameStarted) {
        fill(0);
        gameInfo();
    } else {
        displayStringWithBoxes();
    }

    if (gameOverFlag || timerBarWidth <= 0) { 
        gameOver();
    }

    decreaseTimerBarWidth() 
}

function startTimer() {
    if (gameStarted && timerBarWidth > 0) {
        timerBarWidth -= timerDecreaseRate;
    }
    if (timerBarWidth <= 0) {
        gameOver();
    }
}

function decreaseTimerBarWidth() {
    if (gameStarted && timerBarWidth > 0) {
        timerBarWidth -= timerDecreaseRate;
    }
}

function gameInfo() {
    textSize(20);
    text("Inspired from NoPixel SmokeCrack Hack", width / 2, height / 2 - 350);
    textSize(40);
    text("Press SPACEBAR to start hacking", width / 2, height / 2);
    textSize(20);
}

function gameOver() {
    fill(0);
    textSize(30);
    text("SPACEBAR to restart", width / 2, height / 2 + 200);
    if (keyCode === 32) { // Restart the game if spacebar is pressed in game over state
        restartGame();
        return false; 
    }
    noLoop();
}

function displayStringWithBoxes() {
    const xStart = (width - (targetString.length * boxSize)) / 2;
    for (let i = 0; i < targetString.length; i++) {
        const x = xStart + i * boxSize;
        const y = height / 2 - boxSize / 2;
        textSize(40);
        if (correctness[i] === true) {
            fill('green'); // Correctly typed characters
        } else if (correctness[i] === false) {
            fill('red'); // Incorrectly typed characters
        } else {
            fill('black'); // Characters yet to be typed
        }
        rect(x, y, boxSize, boxSize);
        fill('white');
        text(targetString.charAt(i), x + boxSize / 2, y + boxSize / 2);
    }
}

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = Math.floor(Math.random() * 4) + 8; // Length of generated string
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function startGame() {
    targetString = generateRandomString();
    currentIndex = 0;
    gameStarted = true;
}

function restartGame() {
    targetString = generateRandomString();
    currentIndex = 0;
    timerBarWidth = timerBarInitialWidth; // Reset timer bar width
    gameOverFlag = false;
    correctness = []; // Reset correctness array
    for (let i = 0; i < targetString.length; i++) {
        correctness.push(null); // Reset all characters as untyped
    }
    loop();
    startGame();
}

function keyPressed() {
    if (!gameStarted && keyCode === 32) {
        startGame();
        return false;
    }

    if (gameOverFlag) {
        if (keyCode === 32) { // Restart the game if spacebar is pressed in game over state
            restartGame();
            return false;
        } else {
            return false; // Prevent any other key press after game over
        }
    }

    if (gameStarted && currentIndex < targetString.length) {
        const typedCharUpper = key.toUpperCase(); // Convert typed input to uppercase
        const targetCharUpper = targetString.charAt(currentIndex).toUpperCase(); // Convert target string to uppercase

        if (typedCharUpper === targetCharUpper) {
            currentIndex++;
            correctness[currentIndex - 1] = true; // Mark as correctly typed
        } else {
            gameOver();
            gameOverFlag = true;
            correctness[currentIndex] = false; // Mark as incorrectly typed
            return false;
        }
    }
    
    if (currentIndex === targetString.length) { // Check if the whole string has been typed correctly
        restartGame();
    }
    return false;
}
