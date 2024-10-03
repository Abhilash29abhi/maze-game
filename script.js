const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const maze = [];
const player = { x: 1, y: 1 };
let cellSize = 30;
let rows = 15;
let cols = 15;
let timer;
let seconds = 0;
let moves = 0;

// Create maze
function createMaze() {
    for (let row = 0; row < rows; row++) {
        maze[row] = [];
        for (let col = 0; col < cols; col++) {
            maze[row][col] = (row % 2 === 1 && col % 2 === 1) ? 0 : 1; // 0 is path, 1 is wall
        }
    }
    for (let row = 1; row < rows - 1; row += 2) {
        for (let col = 1; col < cols - 1; col += 2) {
            let rand = Math.random();
            if (rand > 0.5) {
                maze[row][col + 1] = 0; // horizontal passage
            } else {
                maze[row + 1][col] = 0; // vertical passage
            }
        }
    }
    maze[1][0] = 0; // entrance
    maze[rows - 2][cols - 1] = 0; // exit
}

// Draw maze
function drawMaze() {
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.fillStyle = maze[row][col] === 1 ? '#555' : '#222';
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
    drawPlayer();
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = 'lime';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
}

// Move player
function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (maze[newY] && maze[newY][newX] === 0) {
        player.x = newX;
        player.y = newY;
        moves++;
        updateScoreboard();

        // Check win condition
        if (player.x === cols - 1 && player.y === rows - 2) {
            clearInterval(timer);
            alert(`You win! Moves: ${moves} Time: ${seconds}s`);
        }

        drawPlayer();
    }
}

// Update scoreboard
function updateScoreboard() {
    document.getElementById('timer').textContent = `Time: ${seconds}s`;
    document.getElementById('moves').textContent = `Moves: ${moves}`;
}

// Start timer
function startTimer() {
    timer = setInterval(() => {
        seconds++;
        updateScoreboard();
    }, 1000);
}

// Restart game
function restartGame() {
    player.x = 1;
    player.y = 1;
    moves = 0;
    seconds = 0;
    maze.length = 0;
    createMaze();
    drawMaze();
    startTimer();
}

// Keyboard controls
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
    }
});

// Button event
document.getElementById('restartBtn').addEventListener('click', restartGame);

// Initialize game
restartGame();
