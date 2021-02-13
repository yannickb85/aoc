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

            for (let j = i+1; j < lines.length; j++) {

                if (+line + +lines[i] + +lines[j] === RESULT) {
                    console.log(+line + '+' + +lines[i] + '+' + +lines[j] + ' = ' + RESULT)
                    console.log(+line + '*' + +lines[i] + '*' + +lines[j] + ' = ' + +line * +lines[i] * +lines[j])
                }
            }

        }

        currentIndex++;

    })



} catch (err) {
    console.error(err)
}
