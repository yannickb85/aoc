if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]

try {

    const data = fs.readFileSync(filename, 'utf8');

    const lines = data.split(/\r?\n/)

    const RESULT = 2020

    let currentIndex = 0

    lines.forEach((line) => {

        for (let i = currentIndex+1; i < lines.length; i++) {
            if (+line + +lines[i] === RESULT) {
                console.log(+line + '+' + +lines[i] + ' = ' + RESULT)
                console.log(+line + '*' + +lines[i] + ' = ' + +line * +lines[i])
                // 864864
            }
        }

        currentIndex++;

    })



} catch (err) {
    console.error(err)
}
