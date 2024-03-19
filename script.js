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
let winner;

/*----- cached elements  -----*/
let bombEl = document.getElementById("bomb-Count")
let boardEl = document.getElementById("board")
let restartBtn = document.querySelector(".restart")
let flagButton = document.querySelector(".Flag")
let messageEl = document.getElementById("message")

/*----- event listeners -----*/
boardEl.addEventListener('click', handleClick)
boardEl.addEventListener('contextmenu', handleRightClick)
restartButton.addEventListener("click", () => init());



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
    ];
    bombCount = 10;
    flagCount = 0;
    render();

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
                tile.style.backgroundColor = "lightgrey"
                document.getElementById("flag-in-place").innerText = flagCount
            }

        })

    });

}
function renderMessage(){
    if (winner === "L") {
        messageEl.innerText = "Game Over 💣💥"  
    } else if (winner === "W") { 
        messageEl.innerText = "You win !"
    }

}
function renderControls(){
    restartBtn.style.visability = winner ? "visible" : "hidden" ; 
}