/*----- constants -----*/
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


/*----- state variables -----*/
let board; // array of 8 col array
let bombCount = 10
let flagCount = 0;
let winner = null;

/*----- cached elements  -----*/
let bombEl = document.getElementById("bomb-Count")
let boardEl = document.getElementById("board")
let restartBtn = document.querySelector(".restart")
let flagButton = document.querySelector(".FlagPlaced")
let messageEl = document.getElementById("message")

/*----- event listeners -----*/
boardEl.addEventListener('click', handleClick);
boardEl.addEventListener('click',  init);
flagButton.addEventListener('click', toggleFlagPlacementMode);




/*----- functions -----*/
init();


//initialize all state, the call render()
function init() {
    

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
            board[r][c] = new Tile(r, c);
    
            // Set initial properties for the tile
            board[r][c].isFlagged = false;
    
            // Set background color and clear any existing text in the tile element
            document.getElementById(`${r}-${c}`).style.backgroundColor = "lightSteelBlue";
            document.getElementById(`${r}-${c}`).innerText = "";
    
            // Reset game state variables
            winner = null;
            flagCount = 0;
            bombsLeft = 10;
    
            // Update flag count and message displayed on the page
            document.getElementById("flag-placed").innerText = flagCount;
            document.getElementById("message").innerHTML = "Good Luck";
        }
    }
}
// Visualize all state in the DOM 
function render() {
    renderBoard();
    renderMessage();
    renderControls();
}


function renderBoard() {
    board.forEach(function(rowArr, rowIdx) {
        rowArr.forEach(function (tile, colIdx) {
            const tileId = `${rowIdx}-${colIdx}`
            const tileEl = document.getElementById(tileId)
            if (tile.isFlagged) {
                tileEl.innerText = " 🚩"
            }
            if (tile.isRevealed && tile.innerNumber === 0) {
                tileEl.style.backgroundColor = "lightgray"
            }
            if (tile.isRevealed && tile.innerNumber > 0) {
                let innerNumberTile = tile.innerNumber
                textColor[innerNumberTile]
                tileEl.innerText = tile.innerNumber;
                tileEl.style.color = Colors[innerNumberTile]
                tileEl.style.backgroundColor = "lightgrey"
                document.getElementById("flag-placed").innerText = flagCount
            }

        })

    });

}
function renderMessage() {
    if (winner === "L") {
        messageEl.innerText = "Game Over 💣💥"  
    } else if (winner === "W") { 
        messageEl.innerText = "You win !"
    }

}
function renderControls() {
    restartBtn.style.visibility = winner ? "visible" : "hidden"; 
}

function handleClick(evt) {
    // Get the current tile based on the clicked event
    let currentTile = board[evt.target.id[0]][evt.target.id[2]];
    // Exit if the game is already won or lost 
    if (winner === "L" || winner === "W") return; 
    //Exit if the tile is flagged
    if (currentTile.isFlagged) {
        return;
    }
    //if the tile is not a mine has not adjacent mines,
    //reveal connected tiles
    if (!currentTile.isMine && currentTile.innerNumber === 0) {
        calculateFloodNumbers(currentTile.row, currentTile.col);
    }
    //if the tile is not a mine and has adjacent mines,
    //reveal the tile 
    if (!currentTile.isMine > 0) {
        currentTile.isRevealed = true;
    }
    //if the tile is a mine and not flagged, 
    //the player loses 
    if (currentTile.isMine) {
        winner = checkWinner(currentTile);
        //Reveal all mines on the board
        board.forEach(function (rowArr, rowIdx) {
            rowArr.foorEach(function (tile,colIdx) {
                const tileId = `${rowIdx}-${colIdx}`;
                const tileEl = document.getElementById(tileId);
                if (tile.isMine) {
                    tileEl.innerHTML = "💣"
                }

            });
        });
    }
    //update the flag count displayed on the page 
    document.getElementById("flag-placed").innerText = flagCount;
    //render the updted game board 
    render();
}
function toggleFlagPlacementMode() {
    if (winner !== "L" && winner !== "W") { //Toggle flag placeement mode only if is not already won or lost
        flagButton.classList.toggle("active"); //toggle the active state of the flag button.

    }
}
function generateBombs() {
    // Iterate until the desired number of bombs is placed on the board
    while (bombCount > 0) {
        // Generate random row and column indices within the board dimensions
        let randomRow = Math.floor(Math.random() * rows);
        let randomCol = Math.floor(Math.random() * cols);
        // Check if the selected cell does not already contain a bomb
        if (board[randomRow][randomCol].isMine === false) {
            // Place a bomb in the selected cell and decrement bombCount
            board[randomRow][randomCol].isMine = true;
            bombCount--;
        }
    }
}




    
        
function checkAdjTile(rowIdx, colIdx) {
    if (rowIdx < 0 || colIdx < 0 || rowIdx > board.length - 1 || colIdx > board.length - 1) return 0
    if (board[rowIdx][colIdx].isMine) return 1
    return 0;
}
