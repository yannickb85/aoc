if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const { groupCollapsed } = require('console');
const fs = require('fs')
const filename = process.argv[2]

try {

    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split(/\r?\n/)
    //const lines2 = lines.slice(0, 14)

    let groups = []
    let group = {}

    let currentDeclaration = ''
    let peopleCount = 0

    lines.forEach(line=>{
        if (line) {
            currentDeclaration = currentDeclaration + line
            peopleCount++
        } else {
            let uniqueQuestions = [...new Set(currentDeclaration.split(''))]
            //console.log(uniqueQuestions)

            group.nbQuestions = uniqueQuestions.length
            group.nbPeople = peopleCount

            groups.push(group)  

            group = {}
            peopleCount = 0
            currentDeclaration = ''
        }
    })

    //console.log(groups)

    let sumOfNbQuestions = groups.reduce((acc, curr) => acc += curr.nbQuestions,  0)

    console.log(`Sum of nb questions: ${sumOfNbQuestions}`)

} catch (err) {
    console.error(err)
}
