if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]

const data = fs.readFileSync(filename, 'utf8');
const lines = data.split(/\r?\n/).map(x=>+x)

const LOWER_OUTPUT_JOLTAGE_TOLERANCE = 3
const HIGH_DEVICE_JOLTAGE_TOLERANCE = 3
const DEVICE_JOLTAGE_ADAPTER_RATING = Math.max(...(lines.map(x=>+x))) + HIGH_DEVICE_JOLTAGE_TOLERANCE

console.log(`DEVICE_JOLTAGE_ADAPTER_RATING: ${DEVICE_JOLTAGE_ADAPTER_RATING}`)

let effectiveVoltage = 0
let oneJoltDiff = 0, threeJoltDiff = 1 // Device always counts as 3 jolt diff
let usedIndex = []
for (let i=0; i<lines.length; i++) {
    if (effectiveVoltage >= DEVICE_JOLTAGE_ADAPTER_RATING) {
        return
    }

    let filteredLines = lines.filter((n, i1) => {
        if (usedIndex.includes(i1))
            return false
        return n > effectiveVoltage && n <= (effectiveVoltage + LOWER_OUTPUT_JOLTAGE_TOLERANCE)
    })

    let minAdapter = Math.min(...filteredLines)
    usedIndex.push(lines.indexOf(minAdapter))

    if (minAdapter > effectiveVoltage && minAdapter <= (effectiveVoltage + LOWER_OUTPUT_JOLTAGE_TOLERANCE)) {
        if (minAdapter - effectiveVoltage == 1)
            oneJoltDiff++
        if (minAdapter - effectiveVoltage == 3)
            threeJoltDiff++
        effectiveVoltage = minAdapter
        i = 0
    }
}

console.log(`oneJoltDiff=${oneJoltDiff} threeJoltDiff=${threeJoltDiff}`)
console.log(`Answer: ${oneJoltDiff * threeJoltDiff}`)