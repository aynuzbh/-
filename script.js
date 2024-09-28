const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

let currentLevel = 1;
const maxLevels = 10;
const oracleCharacters = [
    ['甲', '骨', '文'],  // Level 1 characters
    ['天', '地', '人'],  // Level 2 characters
    // Add more characters for levels 3 to 10
];
let gameBoard = [];
const gridSize = 4; // 4x4 grid for level 1, can increase in higher levels

function initGame() {
    gameBoard = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        const randomChar = oracleCharacters[currentLevel - 1][Math.floor(Math.random() * oracleCharacters[currentLevel - 1].length)];
        gameBoard.push(randomChar);
    }
    drawBoard();
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const tileSize = canvas.width / gridSize;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            ctx.strokeRect(i * tileSize, j * tileSize, tileSize, tileSize);
            ctx.fillText(gameBoard[i * gridSize + j], i * tileSize + tileSize / 2, j * tileSize + tileSize / 2);
        }
    }
}

canvas.addEventListener('click', function(event) {
    // Add click functionality to match and remove characters
});

document.getElementById('restart-button').addEventListener('click', function() {
    currentLevel = 1;
    initGame();
});

initGame();
