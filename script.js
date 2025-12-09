const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const pvpBtn = document.getElementById('pvpBtn');
const pveBtn = document.getElementById('pveBtn');
const scoreXElement = document.getElementById('scoreX');
const scoreOElement = document.getElementById('scoreO');

let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = 'pvp'; // 'pvp' or 'pve'
let scores = { x: 0, o: 0 };

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellClick = (clickedCellEvent) => {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
};

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        updateScore(currentPlayer);
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusText.textContent = `Game ended in a draw!`;
        gameActive = false;
        return;
    }

    handlePlayerChange();
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;

    if (gameMode === 'pve' && currentPlayer === 'O' && gameActive) {
        setTimeout(makeComputerMove, 500); // Small delay for realism
    }
};

const makeComputerMove = () => {
    const availableIndices = gameState
        .map((val, index) => val === "" ? index : null)
        .filter(val => val !== null);

    if (availableIndices.length > 0) {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const cellToPlay = document.querySelector(`.cell[data-index="${randomIndex}"]`);
        handleCellPlayed(cellToPlay, randomIndex);
        handleResultValidation();
    }
};

const updateScore = (winner) => {
    if (winner === 'X') {
        scores.x++;
        scoreXElement.textContent = scores.x;
    } else {
        scores.o++;
        scoreOElement.textContent = scores.o;
    }
};

const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('x', 'o');
    });
};

const handleResetScore = () => {
    scores.x = 0;
    scores.o = 0;
    scoreXElement.textContent = 0;
    scoreOElement.textContent = 0;
    handleRestartGame();
};

const setGameMode = (mode) => {
    gameMode = mode;
    if (mode === 'pvp') {
        pvpBtn.classList.add('active');
        pveBtn.classList.remove('active');
    } else {
        pveBtn.classList.add('active');
        pvpBtn.classList.remove('active');
    }
    handleRestartGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', handleRestartGame);
resetScoreBtn.addEventListener('click', handleResetScore);
pvpBtn.addEventListener('click', () => setGameMode('pvp'));
pveBtn.addEventListener('click', () => setGameMode('pve'));
