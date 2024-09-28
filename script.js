```javascript
const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const swapSound = document.getElementById('swapSound');
const matchSound = document.getElementById('matchSound');
const levelUpSound = document.getElementById('levelUpSound');

const allSymbols = [
    ['㐀', '㐁', '㐂', '㐃', '㐄', '㐅', '㐆', '㐇'],
    ['㐈', '㐉', '㐊', '㐋', '㐌', '㐍', '㐎', '㐏'],
    ['㐐', '㐑', '㐒', '㐓', '㐔', '㐕', '㐖', '㐗'],
    ['㐘', '㐙', '㐚', '㐛', '㐜', '㐝', '㐞', '㐟'],
    ['㐠', '㐡', '㐢', '㐣', '㐤', '㐥', '㐦', '㐧'],
    ['㐨', '㐩', '㐪', '㐫', '㐬', '㐭', '㐮', '㐯'],
    ['㐰', '㐱', '㐲', '㐳', '㐴', '㐵', '㐶', '㐷'],
    ['㐸', '㐹', '㐺', '㐻', '㐼', '㐽', '㐾', '㐿'],
    ['㑀', '㑁', '㑂', '㑃', '㑄', '㑅', '㑆', '㑇'],
    ['㑈', '㑉', '㑊', '㑋', '㑌', '㑍', '㑎', '㑏']
];

let score = 0;
let level = 1;
let grid = [];
let selectedCell = null;
let symbols = allSymbols[0];

function initializeGrid() {
    for (let i = 0; i < 8; i++) {
        grid[i] = [];
        for (let j = 0; j < 8; j++) {
            grid[i][j] = symbols[Math.floor(Math.random() * symbols.length)];
        }
    }
}

function renderGrid() {
    board.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = grid[i][j];
            cell.addEventListener('click', () => handleClick(i, j));
            board.appendChild(cell);
        }
    }
}

function handleClick(row, col) {
    if (selectedCell) {
        if (isAdjacent(selectedCell, {row, col})) {
            swapCells(selectedCell, {row, col});
            swapSound.play();
            if (!checkAndRemoveMatches()) {
                setTimeout(() => {
                    swapCells(selectedCell, {row, col});
                    renderGrid();
                }, 500);
            }
        }
        selectedCell = null;
    } else {
        selectedCell = {row, col};
        highlightCell(row, col);
    }
}

function highlightCell(row, col) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('selected'));
    cells[row * 8 + col].classList.add('selected');
}

function isAdjacent(cell1, cell2) {
    const rowDiff = Math.abs(cell1.row - cell2.row);
    const colDiff = Math.abs(cell1.col - cell2.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function swapCells(cell1, cell2) {
    const temp = grid[cell1.row][cell1.col];
    grid[cell1.row][cell1.col] = grid[cell2.row][cell2.col];
    grid[cell2.row][cell2.col] = temp;
    renderGrid();
}

function checkAndRemoveMatches() {
    let matched = false;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const horizontalMatch = findMatch(i, j, 0, 1);
            const verticalMatch = findMatch(i, j, 1, 0);
            if (horizontalMatch.length >= 3) {
                removeSymbols(horizontalMatch);
                matched = true;
            }
            if (verticalMatch.length >= 3) {
                removeSymbols(verticalMatch);
                matched = true;
            }
        }
    }
    if (matched) {
        matchSound.play();
        setTimeout(() => {
            shiftSymbols();
            fillEmptySpaces();
            renderGrid();
            setTimeout(() => {
                if (checkAndRemoveMatches()) {
                    renderGrid();
                }
            }, 300);
        }, 500);
    }
    return matched;
}

function findMatch(row, col, rowDir, colDir) {
    const symbol = grid[row][col];
    let match = [{row, col}];
    let nextRow = row + rowDir;
    let nextCol = col + colDir;
    while (nextRow >= 0 && nextRow < 8 && nextCol >= 0 && nextCol < 8 && grid[nextRow][nextCol] === symbol) {
        match.push({row: nextRow, col: nextCol});
        nextRow += rowDir;
        nextCol += colDir;
    }
    return match;
}

function removeSymbols(toRemove) {
    for (const {row, col} of toRemove) {
        const cell = board.children[row * 8 + col];
        cell.classList.add('matched');
        setTimeout(() => {
            grid[row][col] = null;
        }, 500);
    }
    score += toRemove.length * 10;
    scoreDisplay.textContent = `分数: ${score}`;
    checkLevelUp();
}

function shiftSymbols() {
    for (let col = 0; col < 8; col++) {
        let writeRow = 7;
        for (let row = 7; row >= 0; row--) {
            if (grid[row][col] !== null) {
                grid[writeRow][col] = grid[row][col];
                if (writeRow !== row) {
                    grid[row][col] = null;
                }
                writeRow--;
            }
        }
    }
}

function fillEmptySpaces() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (grid[i][j] === null) {
                grid[i][j] = symbols[Math.floor(Math.random() * symbols.length)];
            }
        }
    }
}

function checkLevelUp() {
    if (score >= level * 1000) {
        level++;
        levelDisplay.textContent = `关卡: ${level}`;
        levelUpSound.play();
        if (level <= 10) {
            symbols = allSymbols[level - 1];
            initializeGrid();
            renderGrid();
        } else {
            alert('恭喜你通关了！');
        }
    }
}

initializeGrid();
renderGrid();
```
