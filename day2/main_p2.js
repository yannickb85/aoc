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
    const regex = /(\d+)-(\d+) ([a-z]): (\w+)/

    const match = lines[0].match(regex)
    //console.log(`pos1: ${match[1]} pos2: ${match[2]} letter: ${match[3]} password: ${match[4]}`)

    let validPasswordCount = 0, invalidPasswordCount = 0

    lines.forEach((line) => {

        const policy = line.match(regex)

        let pos1 = policy[1]
        let pos2 = policy[2]
        let letter = policy[3]
        let password = policy[4]
        
        const res1 = password.charAt(pos1-1) == letter
        const res2 = password.charAt(pos2-1) == letter

        if (res1 + res2 == 1) {
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
