if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]


const data = fs.readFileSync(filename, 'utf8');
const lines = data.split(/\r?\n/)

const PREAMBLE_SIZE = 25

const PREAMBLE_DATA = preamble(lines)
const PREAMBLE = PREAMBLE_DATA.preamble
const DATA_WITHOUT_PREAMBLE = PREAMBLE_DATA.data

let p1 = 1, p2 = PREAMBLE_SIZE+1

{
    for (let i = PREAMBLE_SIZE+1; i < lines.length; i++) {

        let isTheSum = isTheSumOfInRange(p1, p2, lines[i], lines)
        if (!isTheSum) {
            console.log(`Not the sum p1=${p1} p2=${p2} i=${i} lines[i]=${lines[i]}`)
            break
        }
        p1++
        p2++

    }
}

function preamble(lines) {
    let preamble = lines.slice(0, PREAMBLE_SIZE)
    let data = lines.slice(PREAMBLE_SIZE, lines.length-1)
    return { preamble: preamble, data: data }
}

function isTheSumOfInRange(p1, p2, n, data) {
    const subData = data.slice(p1, p2)
    subData.splice(p2, 1)
    subData.push(data[n])
    for(let i=0; i<subData.length-1; i++) 
        for (let j = i+1; j<subData.length; j++) 
            if (+subData[i] + +subData[j] == +n && +subData[i] != +subData[j]) 
                return true
            
    return false
}