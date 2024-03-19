/*----- constants -----*/
const textColor = {
    1: "blue",
    2: "green",
    3: "red",
    4: "orange",
    5: "yellow",
    6: "purple",
    7: "blueviolet",
    8: "yellowgreen",
}
const rows = 8;
const cols = 8;


/*----- state variables -----*/
let bombCount;
let bombsLeft = 10
let flagCount = 0;
let winner;
let board;

/*----- cached elements  -----*/
let bombEl = document.getElementById("bomb-Count")
let boardEl = document.getElementById("board")
let restartButton = document.querySelector(".restart")
let flagButton = document.querySelector(".Flag")


/*----- event listeners -----*/
boardEl.addEventListener('click', handleClick)
boardEl.addEventListener('contextmenu', handleRightClick)
restartButton.addEventListener("click", () => init());
flagButton.addEventListener("click", toggleFlagMode);


/*----- functions -----*/
init();

function Tile(row, col) {
    this.isMine = false;
    this.isRevealed = false;
    this.isFlagged = false;
    this.floodNumber = 0;
    this.row = row;
    this.col = col;
}


function init() {
    bombCount = 10;
    flagCount = 0;
    board = [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ];

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            board[r][c] = new Tile(r, c)
            board[r][c].isFlagged = false
            document.getElementById(`${r}-${c}`).style.backgroundColor = "rgb(183, 183, 232)"
            document.getElementById(`${r}-${c}`).innerText = ""
            winner = null
            flagCount = 0
            bombsLeft = 15
            document.getElementById("flag-placed").innerText = flagCount
            document.getElementById("message").innerHTML = "Good Luck"
        }
    }

    generateBombs();
    generateFlood();
    render();
}

function generateBombs() {
    while (bombCount > 0) {
        let randomRow = Math.floor(Math.random() * rows)
        let randomCol = Math.floor(Math.random() * cols)
        if (board[randomRow][randomCol].isMine === false) {
            board[randomRow][randomCol].isMine = true
            bombCount--;
        };
    }
}

function generateFlood() {
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (tile, colIdx) {
            tile.floodNumber += checkAdjTile(rowIdx - 1, colIdx - 1);
            tile.floodNumber += checkAdjTile(rowIdx - 1, colIdx);
            tile.floodNumber += checkAdjTile(rowIdx - 1, colIdx + 1);
            tile.floodNumber += checkAdjTile(rowIdx, colIdx - 1);
            tile.floodNumber += checkAdjTile(rowIdx, colIdx + 1);
            tile.floodNumber += checkAdjTile(rowIdx + 1, colIdx - 1);
            tile.floodNumber += checkAdjTile(rowIdx + 1, colIdx);
            tile.floodNumber += checkAdjTile(rowIdx + 1, colIdx + 1);
        })
    });
}

function checkAdjTile(rowIdx, colIdx) {
    if (rowIdx < 0 || colIdx < 0 || rowIdx > board.length - 1 || colIdx > board.length - 1) return 0
    if (board[rowIdx][colIdx].isMine) return 1
    return 0;
}


function render() {
    renderBoard();
    renderMessage();
}

function renderBoard() {
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (tile, colIdx) {
            const tileId = `${rowIdx}-${colIdx}`
            const tileEl = document.getElementById(tileId)
            if (tile.isFlagged) {
                tileEl.innerText = "📍"
            }
            if (tile.isRevealed && tile.floodNumber === 0) {
                tileEl.style.backgroundColor = "lightgrey"
            }
            if (tile.isRevealed && tile.floodNumber > 0) {
                let floodNumberTile = tile.floodNumber
                textColor[floodNumberTile]
                tileEl.innerText = tile.floodNumber;
                tileEl.style.color = textColor[floodNumberTile]
                tileEl.style.backgroundColor = "lightgrey"
                document.getElementById("flag-placed").innerText = flagCount
            }
            if (tile.isRevealed && tile.isMine) {
                tileEl.innerHTML = "💣";
            }
        })
    });
}

function handleClick(event) {
    let currTile = board[event.target.id[0]][event.target.id[2]]

    if (winner === "L" || winner === "W") return
    if (currTile.isFlagged) {
        return
    }
    if (!currTile.isMine && currTile.floodNumber === 0) floodFeature(currTile.row, currTile.col);

    if (!currTile.isMine && currTile.floodNumber > 0) currTile.isRevealed = true;

    if (!currTile.isFlagged && currTile.isMine) {
        winner = checkWinner(currTile)
        board.forEach(function (rowArr, rowIdx) {
            rowArr.forEach(function (tile, colIdx) {
                const tileId = `${rowIdx}-${colIdx}`
                const tileEl = document.getElementById(tileId)
                if (tile.isMine) {
                    tileEl.innerHTML = "💣"
                }
            })
        });
    }

    document.getElementById("flag-placed").innerText = flagCount
    render()
}

function handleRightClick(event) {
    event.preventDefault();
    let currTile = board[event.target.id[0]][event.target.id[2]]
    let currTileEl = document.getElementById(`${event.target.id[0]}-${event.target.id[2]}`)

    if (winner === "L" || winner === "W") return
    if (currTile.isFlagged) {
        currTile.isFlagged = false;
        flagCount--;
        currTileEl.innerText = ""
        if (currTile.isMine) {
            bombsLeft++;
        }
    } else if (!currTile.isFlagged && !currTile.isRevealed) {
        currTile.isFlagged = true;
        flagCount++;
        if (currTile.isMine) {
            bombsLeft--;
        }
    }
    if (flagCount === 15 && bombsLeft === 0) {
        winner = checkWinner(currTile)
    }
    document.getElementById("flag-placed").innerText = flagCount
    render()
}

function renderMessage() {
    if (winner === "L") {
        document.getElementById("message").innerHTML = "You Lose 🤕"
    }
    if (winner === "W") document.getElementById("message").innerHTML = "You Win!!!!!"
}

function floodFeature(row, col) {
    if (row < 0 || row > board.length - 1 || col < 0 || col > board.length - 1) return

    if (board[row][col].floodNumber > 0) {
        board[row][col].isRevealed = true
        return
    }

    if (board[row][col].floodNumber === 0 && !board[row][col].isRevealed) {
        board[row][col].isRevealed = true;
        floodFeature(row - 1, col - 1)
        floodFeature(row - 1, col)
        floodFeature(row - 1, col + 1)
        floodFeature(row, col - 1)
        floodFeature(row, col + 1)
        floodFeature(row + 1, col - 1)
        floodFeature(row + 1, col)
        floodFeature(row + 1, col + 1)
    }
    return;
};

function toggleFlagMode() {
    if (winner === "L" || winner === "W") return;
    if (flagButton.innerText === "🚩") {
        flagButton.innerText = "🚩";
    } else {
        flagButton.innerText = "🚩";
    }
}