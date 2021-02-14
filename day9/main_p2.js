if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]


const data = fs.readFileSync(filename, 'utf8');
const lines = data.split(/\r?\n/)

const MY_INVALID_NUMBER = 1124361034

for (let i=0; i<lines.length; i++) {

    let total = +lines[i]
    let j = i
    while (total < MY_INVALID_NUMBER) {
        j++
        total += +lines[j]
    }

    if (total == MY_INVALID_NUMBER && i!=j) {
        let contiguousSet = lines.slice(i, j+1).map(x=>+x)
        console.log(`Encryption Weakness: ${Math.min(...contiguousSet) + Math.max(...contiguousSet)}`)
        return
    }

}