if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]

try {

    const data = fs.readFileSync(filename, 'utf8');

    const lines = data.split(/\r?\n/)

    let forest = []
    let y = 0

    lines.forEach(line => {
        let myRow = [...line]
        for (var i=1; i<=120; i++) {
            myRow = myRow.concat([...line])
        }
        forest[y] = myRow
        y++
    })

    const slopes = [
        [1, 1],
        [3, 1],
        [5, 1],
        [7, 1],
        [1, 2]
    ]

    let result = 1

    slopes.forEach(slope=> {
        result = result * slide(forest, slope[0], slope[1])
    })

    console.log(`result ${result}`)

} catch (err) {
    console.error(err)
}

function slide(forest, slopeX, slopeY) {

    //console.table(forest[0])

    let currentX = 0
    let currentY = 0

    let treesEncountered = 0
    console.log(`forest length: ${forest.length}`)

    while(currentY < forest.length) {

        currentY = currentY + slopeY
        currentX = currentX + slopeX

        //console.log(`currentY ${currentY}`)

        if (currentY < forest.length && forest[currentY][currentX] == '#') {
            treesEncountered++
        }

    }

    console.log(`last currentY: ${currentY}`)
    console.log(`Trees encountered: ${treesEncountered}`)

    return treesEncountered

}
