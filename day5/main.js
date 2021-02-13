if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}


const fs = require('fs')
const filename = process.argv[2]


try {

    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split(/\r?\n/)

    let highestSeatId = 0
    //let boardingPass = lines[0]

    lines.forEach(boardingPass=>{

        const ROWS = 128
        const SEATS = 8
        
        // initiate
        let rowRange = [], columnRange = []
        for (let i = 0; i < ROWS; i++) rowRange.push(i)
        for (let i = 0; i < SEATS; i++) columnRange.push(i)

        console.log(boardingPass)

        const boardingPassStruct = /^([BF]{7})([LR]{3})$/
        const matching = boardingPass.match(boardingPassStruct)

        const region = matching[1]
        const seating = matching[2]
        //console.log(`region: ${region}`)
        //console.log(`seating: ${seating}`)  

        region.split('').forEach(r=>{
            rowRange = getRange(rowRange, r)
        })

        seating.split('').forEach(s=>{
            columnRange = getRange(columnRange, s)
        })

        let seatId = +rowRange * 8 + +columnRange

        console.log(`row: ${rowRange} column: ${columnRange} seat ID: ${seatId}`)

        if (seatId > highestSeatId)
            highestSeatId = seatId
    })

    console.log(`Highest Seat ID: ${highestSeatId}`)

} catch (err) {
    console.error(err)
}

function getRange(range, bound) {
    // F/L = lower half
    if (bound == 'F' || bound == 'L')
        return range.slice(0, range.length/2)
    // B/R = upper half
    else if (bound == 'B' || bound == 'R')
        return range.slice(range.length/2, range.length)
}