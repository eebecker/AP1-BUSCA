/**
* Get heuristic cost
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
 * Get position with lowest fScore
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
 * Get successfull path from full path covered
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
 * Get neighbor positions of current position
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
 * Compare if two positions are equal
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
 * A* algorithm implementation, returns full path
 * from starting position to goal position
 * 
 * @param {[Number]} start position of numbers
 * @param {[Number]} goal position of numbers
 * @returns {[[Number]]} array of numbers array
 */
function aStar(start, goal) {
    // nodos fechados ? 
    const closedSet = []
    // nodos abertos ? 
    const openSet = [start]
    // comentario: talvez seja ao contrario;

    const fScores = {}
    const gScores = {}

    gScores[start] = 0
    fScores[start] = getHeuristic(start, goal)

    const cameFrom = {}

    while (openSet.length > 0) {
        const current = getLowestFscore(openSet, fScores)

        if (isEqual(current, goal)) {
            const fullPath = reconstructPath(cameFrom, current)

            return fullPath
        }

        // remove current position from open set
        _.remove(openSet, (position) => isEqual(position, current))

        // add current position to closed set
        closedSet.push(current)

        const neighbors = getNeighbors(current)

        for (let neighbor of neighbors) {
            if (isInSet(closedSet, neighbor)) {
                continue
            }

            const tentativeGscore = gScores[current] + 1 // distance between current and neighbor position is equal to 1

            if (!isInSet(openSet, neighbor)) {
                openSet.push(neighbor)
            } else if (tentativeGscore >= gScores[neighbor]) {
                continue
            }

            cameFrom[neighbor] = current
            gScores[neighbor] = tentativeGscore
            fScores[neighbor] = gScores[neighbor] + getHeuristic(neighbor, goal)
        }
    }
}

