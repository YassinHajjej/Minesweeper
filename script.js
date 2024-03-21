
/*----- constants -----*/
const Tile = {
    create(row, col){
        return {
            Mine: false,
            Revealed: false,
            Flagged: false,
            floodNumber: 0,
            row: row,
            col: col
        };
    }
}


const Colors = {
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

const gameOverSound = document.getElementById("gameOverSound");

/*----- state variables -----*/
let board; // array of 8 col array
let bombCount = 10;
let bombsLeft = 10;
let flagCount = 0;
let winner = null;

/*----- cached elements  -----*/
let bombEl = document.getElementById("bomb-Count")
let boardEl = document.getElementById("board")
let restartBtn = document.getElementById("restartBtn")
let messageEl = document.getElementById("message");


/*----- event listeners -----*/

boardEl.addEventListener('click', handleClick);
boardEl.addEventListener('contextmenu', handleRightClick)
restartBtn.addEventListener("click", init);



/*----- functions -----*/
init();


//initialize all state, the call render()
function init() {
    bombCount = 10;
    flagCount = 0;
    board = [
        [null, null, null, null, null, null, null, null], // coll 0 
        [null, null, null, null, null, null, null, null], // coll 1 
        [null, null, null, null, null, null, null, null], // coll 2 
        [null, null, null, null, null, null, null, null], // coll 3
        [null, null, null, null, null, null, null, null], // coll 4 
        [null, null, null, null, null, null, null, null], // coll 5 
        [null, null, null, null, null, null, null, null], // coll 6
        [null, null, null, null, null, null, null, null], // coll 7
    ]
    for (let r = 0; r < board.length; r++) {
        // Iterate over each row of the board
        for (let c = 0; c < board[r].length; c++) {
            // Iterate over each column of the current row
    
            // Create a new Tile object at the current position (r, c)
            board[r][c] = Tile.create(r, c);
    
            // Set initial properties for the tile
            board[r][c].Flagged = false;
    
            // Set background color and clear any existing text in the tile element
            document.getElementById(`${r}-${c}`).style.backgroundColor = "#CBC3E3";
            document.getElementById(`${r}-${c}`).innerText = "";
    
            // Reset game state variables
            winner = null;
            flagCount = 0;
            bombsLeft = 10;
    
            // Update flag count and message displayed on the page
            document.getElementById("flag-placed").innerText = flagCount;
            document.getElementById("message").innerHTML = "Good Luck";

            // Add event listeners back after resetting the game
            boardEl.addEventListener('click', handleClick);
            boardEl.addEventListener('contextmenu', handleRightClick);
        }
    }
    generateBombs();
    generateFlood();
    render();
}

function generateBombs() {
    // Iterate until the desired number of bombs is placed on the board
    while (bombCount > 0) {
        // Generate random row and column indices within the board dimensions
        let randomRow = Math.floor(Math.random() * rows);
        let randomCol = Math.floor(Math.random() * cols);
        // Check if the selected cell does not already contain a bomb
        if (board[randomRow][randomCol].Mine === false) {
            // Place a bomb in the selected cell and decrement bombCount
            board[randomRow][randomCol].Mine = true;
            bombCount--;
        }
    }
}
function generateFlood() {
    board.forEach(function (rowArr, rowIdx) {
        rowArr.forEach(function (tile, colIdx){
            //reset flood number for each tile
            tile.floodNumber = 0;
            //calculate flood number by checking adjecent tiles for mines
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
    if (board[rowIdx][colIdx].Mine) return 1
    return 0;
}
// Visualize all state in the DOM 
function render() {
    renderBoard();
    renderMessage();
    renderControls();
}
        
    
function renderBoard() {
    // Render each tile on the game board
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function (tile, colIdx) {
            const tileId = `${rowIdx}-${colIdx}`
            const tileEl = document.getElementById(tileId)
            if (tile.Flagged) {
                tileEl.innerText = " 🚩"
            }
            if (tile.Revealed && tile.floodNumber === 0) {
                tileEl.style.backgroundColor = "lightgray"
            }
            if (tile.Revealed && tile.floodNumber > 0) {
                let innerNumberTile = tile.floodNumber
                tileEl.innerText = tile.floodNumber;
                tileEl.style.color = Colors[innerNumberTile]
                tileEl.style.backgroundColor = "lightgrey"
                document.getElementById("flag-placed").innerText = flagCount
            }
        })
    });
}

function handleClick(evt) {
    // Handle click events on the game board
    let currentTile = board[evt.target.id[0]][evt.target.id[2]];
    if (winner === "L" || winner === "W") return; 
    if (currentTile.Flagged) {
        return;
    }
    if (!currentTile.Mine && currentTile.floodNumber === 0) {
        floodFeature(currentTile.row, currentTile.col);
    }
    if (!currentTile.Mine && currentTile.floodNumber > 0) {
        currentTile.Revealed = true;
    }
    if (currentTile.Mine) {
        winner = checkWinner(currentTile);
        // Reveal all mines on the board
        board.forEach(function (rowArr, rowIdx) {
            rowArr.forEach(function (tile,colIdx) {
                const tileId = `${rowIdx}-${colIdx}`;
                const tileEl = document.getElementById(tileId);
                if (tile.Mine) {
                    tileEl.innerHTML = "💣"
                }
            });
        });
        //remove event listeners after a bomb is clicked
        boardEl.removeEventListener("click", handleClick);
        boardEl.removeEventListener("contextmenu", handleRightClick);
    }
    // Update flag count displayed on the page 
    document.getElementById("flag-placed").innerText = flagCount;
    // Render the updated game board 
    render();
}

function handleRightClick(evt) {
    evt.preventDefault(); // Prevent default right-click behavior (e.g., showing context menu)

    // Retrieve the current tile and its corresponding DOM element
    let currTile = board[evt.target.id[0]][evt.target.id[2]];

    // Check if the tile is already revealed
    if (currTile.Revealed) {
        return; // Ignore right-clicks on revealed tiles
    }

    // Toggle flag status of the current tile
    currTile.Flagged = !currTile.Flagged;

    // Adjust flag count and bombs left count based on flag status
    flagCount += currTile.Flagged ? 1 : -1;
    bombsLeft -= currTile.Flagged ? 1 : -1;

    // Check for win condition
    if (flagCount === bombCount && bombsLeft === 0) {
        winner = checkWinner(currTile);
    }

    // Update flag count displayed on the page
    document.getElementById("flag-placed").innerText = flagCount;

    // Render the updated game board
    render();
}
function renderControls() {
    restartBtn.style.visibility =  "visible"; 
}

function renderMessage() {
    // render message based on gamer outcome
    if (winner === "L") {
        messageEl.innerText = "Game Over 💣💥"  
        gameOverSound.play();
    } else if (winner === "W") { 
        messageEl.innerText = "You win !"
    }

}

function floodFeature(row, col) {
    // Base case: return if the current position is out of bounds
    if (row < 0 || row >= board.length || col < 0 || col >= board[row].length) {
        return;
    }
    // Check if the current tile has a non-zero flood number
    if (board[row][col].floodNumber > 0) {
        // If so, reveal the tile and return
        board[row][col].Revealed = true;
        return;
    }
    // Check if the current tile has a flood number of 0 and is not already revealed
    if (board[row][col].floodNumber === 0 && !board[row][col].Revealed) {
        // If so, reveal the tile
        board[row][col].Revealed = true;

        // Recursively call floodFeature on adjacent tiles
        floodFeature(row - 1, col - 1);
        floodFeature(row - 1, col);
        floodFeature(row - 1, col + 1);
        floodFeature(row, col - 1);
        floodFeature(row, col + 1);
        floodFeature(row + 1, col - 1);
        floodFeature(row + 1, col);
        floodFeature(row + 1, col + 1);
    }
}

function checkWinner() {
    // Check for loss conditions
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[r].length; c++) {
            const currentTile = board[r][c];
            if (!currentTile.Flagged && currentTile.Mine) {
                return "L"; // Player loses if an unflagged mine is revealed
            }
            if (currentTile.Mine && flagCount !== bombCount && bombCount !== 0) {
                return "L"; // Player loses if a mine is revealed before all flags are placed
            }
        }
    }

    // Check for win condition
    if (flagCount === bombCount && bombsLeft === 0) {
        return "W"; // Player wins if all mines are correctly flagged
    }

    return null; // Game continues
}


      