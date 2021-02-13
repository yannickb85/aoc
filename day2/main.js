if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const { count } = require('console');
const fs = require('fs')
const filename = process.argv[2]

try {

    const data = fs.readFileSync(filename, 'utf8');

    const lines = data.split(/\r?\n/)

    // 6-8 s: svsssszslpsp
    const regex = /(\d+)-(\d+) ([a-z]): (.+)/

    const match = lines[0].match(regex)
    console.log(`min: ${match[1]} max: ${match[2]} letter: ${match[3]} password: ${match[4]}`)

    let validPasswordCount = 0, invalidPasswordCount = 0

    lines.forEach((line) => {

        const policy = line.match(regex)

        let min = policy[1]
        let max = policy[2]
        let letter = policy[3]
        let password = policy[4]

        let pattern = new RegExp(letter, "g")
        const countLetter = (password.match(pattern) || []).length

        if (countLetter >= min && countLetter <= max) {
            validPasswordCount++
        } else {
            invalidPasswordCount++
        }

    })

    console.log(`Valid password count: ${validPasswordCount}`)
    console.log(`Invalid password count: ${invalidPasswordCount}`)

} catch (err) {
    console.error(err)
}
