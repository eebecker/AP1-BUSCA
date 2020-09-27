const board = document.querySelector('.board');
board.innerHTML = '';

var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 0];
// objetivo 
const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0]

// exemplos de entrada: 
let entries = [
    [1, 2, 3, 0, 6, 4, 7, 8, 5],
    [5, 7, 2, 0, 4, 8, 1, 6, 3],
    [4, 1, 3, 7, 0, 8, 6, 2, 5],
    [7, 4, 2, 8, 1, 5, 6, 3, 0],
    [1, 0, 3, 5, 2, 4, 7, 6, 8],
    [1, 6, 2, 8, 3, 0, 4, 5, 7],
    [7, 2, 6, 5, 0, 4, 1, 3, 8],
    [7, 1, 2, 4, 8, 0, 5, 6, 3],
    [6, 1, 5, 2, 0, 3, 4, 7, 8],
    [4, 0, 6, 5, 1, 2, 7, 8, 3],
    [2, 5, 0, 1, 6, 7, 4, 8, 3],
    [0, 3, 5, 1, 8, 7, 4, 6, 2],
    [2, 5, 0, 4, 6, 3, 7, 1, 8],
    [1, 0, 7, 4, 3, 2, 8, 5, 6],
    [1, 4, 5, 7, 6, 2, 0, 8, 3],
    [1, 4, 2, 7, 5, 0, 8, 3, 6],
    [3, 4, 6, 7, 1, 0, 2, 5, 8],
    [2, 0, 6, 7, 4, 1, 5, 3, 8],
    [1, 5, 3, 4, 2, 8, 0, 7, 6],
    [2, 0, 3, 7, 4, 6, 8, 5, 1],
    [0, 7, 5, 2, 3, 1, 8, 4, 6],
    [7, 3, 5, 8, 0, 1, 4, 2, 6],
    [4, 2, 6, 3, 7, 1, 5, 0, 8],
    [5, 2, 3, 8, 1, 0, 4, 6, 7],
    [7, 1, 5, 3, 2, 6, 8, 0, 4],
    [0, 8, 5, 3, 1, 2, 4, 7, 6],
    [5, 3, 8, 4, 1, 0, 6, 2, 7],
    [0, 1, 6, 8, 3, 5, 4, 7, 2],
    [5, 8, 2, 1, 7, 3, 4, 6, 0],
    [3, 5, 6, 0, 7, 4, 2, 1, 8]
]
// passar aqui entrada 
const start = (entries[5]);

numbers = start;
// estado inicial 
paintBoard(board, numbers);

// executando algoritmo 
const fullPath = aStar(start, goal);

const btnIniciar = document.querySelector('.btn-iniciar');
btnIniciar.addEventListener("click", (e) => {
    draw(fullPath)
})

// caminho 
console.log('caminho', fullPath)
// O total de nodos visitados 
const pathSize = fullPath.length;
const patSize = document.querySelector('.path-size');
patSize.innerHTML = `tamanho do caminho: ${pathSize}`;



/**
 * Draw iteration from start to goal position
 * wait 700 ms at each step and then draw next position
 * 
 * @param {[[Number]]} fullPath array of numbers
 * @param {Number} i iteration count
 */
function draw(fullPath, i = 0) {
    if (i >= fullPath.length) {
        return
    }
    board.innerHTML = '';

    numbers = fullPath[i];
    paintBoard(board, numbers);

    setTimeout(() => {
        draw(fullPath, ++i)
    }, 700)
}


