/**
* obtém custo heurístico
* 
* @param {[Number]} current position of numbers
* @param {[Number]} goal position of numbers
* @returns {Number}
*/
function getHeuristic(current, goal) {
    let count = 0

    for (let i = 0; i < current.length; i++) {
        if (current[i] !== 0 && current[i] !== goal[i]) {
            count++
        }
    }

    return count
}

/**
 * obtém a posição com menor fScore
 * 
 * @param {[[Number]]} openSet array of open positions 
 * @param {[Number]} fScores array of fscores
 * @returns {[Number]}
 */
function getLowestFscore(openSet, fScores) {
    let minFscore = openSet[0]
    let minScore = fScores[minFscore]

    openSet.forEach(item => {
        if (fScores[item] < minScore) {
            minScore = fScores[item]
            minFscore = item
        }
    })

    return JSON.parse("[" + minFscore + "]")
}

/**
 * obtém o caminho completo percorrido
 * 
 * @param {Object} cameFrom full path covered
 * @param {[Number]} current goal position
 * @returns {[[Number]]}
 */
function reconstructPath(cameFrom, current) {
    const totalPath = [current]

    while (Object.keys(cameFrom).includes(current.toString())) {
        current = cameFrom[current]

        totalPath.push(current)
    }

    return _.reverse(totalPath)
}

/**
 * obtém as posições vizinhas da posição atual
 * 
 * @param {[Number]} current position of numbers
 * @returns {[[Number]]} 
 */
function getNeighbors(current) {
    const positions = []
    const ind = current.findIndex(item => item === 0)

    if (ind >= 3) {
        const topNeighbour = [...current]

        topNeighbour[ind - 3] = current[ind]
        topNeighbour[ind] = current[ind - 3]

        positions.push(topNeighbour)
    }

    if (ind <= 5) {
        const bottomNeighbour = [...current]

        bottomNeighbour[ind + 3] = current[ind]
        bottomNeighbour[ind] = current[ind + 3]

        positions.push(bottomNeighbour)
    }

    if (![0, 3, 6].includes(ind)) {
        const leftNeighbour = [...current]

        leftNeighbour[ind - 1] = current[ind]
        leftNeighbour[ind] = current[ind - 1]

        positions.push(leftNeighbour)
    }

    if (![2, 5, 8].includes(ind)) {
        const rightNeighbour = [...current]

        rightNeighbour[ind + 1] = current[ind]
        rightNeighbour[ind] = current[ind + 1]

        positions.push(rightNeighbour)
    }

    return positions
}

/**
 * compara se duas posições são iguais
 * 
 * @param {[Number]} current position of numbers
 * @param {[Number]} goal position of numbers
 * @returns {Boolean}
 */
function isEqual(current, goal) {
    return current.toString() === goal.toString()
}

/**
 * Check if position is in set(open or closed) already
 * 
 * @param {[[Number]]} set array of numbers position
 * @param {[Number]} neighbor position of numbers
 * @returns {Boolean}
 */
function isInSet(set, neighbor) {
    return !!set.find(position => isEqual(position, neighbor))
}


/**
 * Algoritmo A* 
 * usando o score h e g (h: quantos blocos estão no lugar errado; g: número de nós percorridos do nó inicial ao nó atual)
 * 
 * @param {[Number]} start position of numbers
 * @param {[Number]} goal position of numbers
 * @returns {[[Number]]} array of numbers array
*/
function aStar(start, goal) {
    // nodos visitados 
    const closedSet = []

    // lista que contém todos os nós que ainda precisam ser explorados 
    const openSet = [start]

    const fScores = {}

    const gScores = {}

    gScores[start] = 0
    fScores[start] = getHeuristic(start, goal)

    const cameFrom = {}

    while (openSet.length > 0) {
        // escolhe o nodo com menor custo da lista 
        const current = getLowestFscore(openSet, fScores)

        if (isEqual(current, goal)) {
            const fullPath = reconstructPath(cameFrom, current)
            return { fullPath, closedSet, openSet }
        }

        // remove posição atual do open set
        _.remove(openSet, (position) => isEqual(position, current))

        // adiciona posição atual ao closed set 
        closedSet.push(current)

        const neighbors = getNeighbors(current)

        for (let neighbor of neighbors) {
            if (isInSet(closedSet, neighbor)) {
                continue
            }

            const tentativeGscore = gScores[current] + 1 // distância entre a posição atual e a posição vizinha é igual a 1

            if (!isInSet(openSet, neighbor)) {
                openSet.push(neighbor)
            } else if (tentativeGscore >= gScores[neighbor]) {
                continue
            }

            cameFrom[neighbor] = current
            gScores[neighbor] = tentativeGscore
            // formula: f = g + h
            fScores[neighbor] = gScores[neighbor] + getHeuristic(neighbor, goal)

        }
    }
}

/**
 * Algoritmo A* simples
 * usando apenas o h score (quantas peças estão no lugar errado)
 * 
 * @param {[Number]} start position of numbers
 * @param {[Number]} goal position of numbers
 * @returns {[[Number]]} array of numbers array
*/
// 
function simpleAStar(start, goal) {
    // nodos visitados 
    const closedSet = []

    // lista que contém todos os nós que ainda precisam ser explorados 
    const openSet = [start]

    const fScores = {}

    fScores[start] = getHeuristic(start, goal)

    const cameFrom = {}

    while (openSet.length > 0) {
        // escolhe o nodo com menor custo da lista 
        const current = getLowestFscore(openSet, fScores)

        if (isEqual(current, goal)) {
            const fullPath = reconstructPath(cameFrom, current)
            return { fullPath, closedSet, openSet }
        }

        // remove posição atual do open set
        _.remove(openSet, (position) => isEqual(position, current))

        // adiciona posição atual ao closed set 
        closedSet.push(current)

        const neighbors = getNeighbors(current)

        for (let neighbor of neighbors) {
            if (isInSet(closedSet, neighbor)) {
                continue
            }

            if (!isInSet(openSet, neighbor)) {
                openSet.push(neighbor)
            } else {
                continue
            }

            cameFrom[neighbor] = current
            fScores[neighbor] = getHeuristic(neighbor, goal)
        }
    }
}

/**
 * Algoritmo custo uniforme
 * Simplesmente adicionando +1 nos custos dos nodos filhos
 * 
 * @param {[Number]} start position of numbers
 * @param {[Number]} goal position of numbers
 * @returns {[[Number]]} array of numbers array
*/
function uniformCost(start, goal) {
    // Nodos visitados 
    const closedSet = []

    // lista que contém todos os nós que ainda precisam ser explorados 
    const openSet = [start]

    const fScores = {}

    fScores[start] = 0

    const cameFrom = {}

    while (openSet.length > 0) {
        // Escolhe o nodo com menor custo da lista 
        const current = getLowestFscore(openSet, fScores)

        if (isEqual(current, goal)) {
            const fullPath = reconstructPath(cameFrom, current)
            return { fullPath, closedSet, openSet }
        }

        // Remove posição atual do open set
        _.remove(openSet, (position) => isEqual(position, current))

        // adiciona posição atual ao closed set 
        closedSet.push(current)

        const neighbors = getNeighbors(current)

        for (let neighbor of neighbors) {
            if (isInSet(closedSet, neighbor)) {
                continue
            }

            if (!isInSet(openSet, neighbor)) {
                openSet.push(neighbor)
            } else {
                continue
            }

            cameFrom[neighbor] = current
            fScores[neighbor] = fScores[neighbor] + 1

        }
    }
}

function paintBoard(board, numbers) {
    numbers.forEach(number => {
        let div = document.createElement("div");
        if (number === 0) {
            div.className = 'tile tile--empty';
        } else {
            div.className = 'tile';
            div.innerHTML = number
        }
        board.appendChild(div)
    })
}

