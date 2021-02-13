if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]

try {

    const data = fs.readFileSync(filename, 'utf8');

    const lines = data.split(/\r?\n/)
    const instructionRegex = /(.*)\s([\+|\-])(\d+)/

    let accumulator = 0
    const visistedIndex = new Set()

    for (let i = 0; i < lines.length; ) {
        let matching = lines[i].match(instructionRegex)

        let instruction = matching[1]
        let sign = matching[2]
        let value = matching[3]

        if (visistedIndex.has(i)) 
            break
        else
            visistedIndex.add(i)

        let jump = false
        switch (instruction) {
            case 'acc': {
                if (sign == '+') 
                    accumulator += +value
                else
                    accumulator -= +value
                break
            }
            case 'jmp': {
                if (sign == '+') 
                    i += +value
                else
                    i -= +value
                jump = true
                break
            }
            default:
                break
        }
        if (!jump)
            i++
    }

    console.log(accumulator)

} catch (err) {
    console.error(err)
}