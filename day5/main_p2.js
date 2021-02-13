if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]

try {

    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split(/\r?\n/)

    //let boardingPass = lines[0]

    let allSeats = []

    lines.forEach(boardingPass=>{

        const ROWS = 128
        const SEATS = 8
        
        // initiate
        let rowRange = [], columnRange = []
        for (let i = 0; i < ROWS; i++) rowRange.push(i)
        for (let i = 0; i < SEATS; i++) columnRange.push(i)

        //console.log(boardingPass)

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

        allSeats.push({
            row: rowRange[0],
            column: columnRange[0],
            seatId: seatId
        })

        //console.log(`row: ${rowRange} column: ${columnRange} seat ID: ${seatId}`)

    })

    let allIds = allSeats.map(s=>s.seatId).sort((a, b) => a - b)
    //console.log(allIds)
    
    for (let i=allIds[0], j=allIds[0]; i<allIds[allIds.length-1]; i++) {
        if (allIds[i]+1 != allIds[i+1]) {
            console.log(`Previous Seat ID: ${allIds[i]}`)
            console.log(`My Seat ID: ${allIds[i]+1}`)
            console.log(`Next Seat ID: ${allIds[i+1]}`)
            break
        }
    }
        

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