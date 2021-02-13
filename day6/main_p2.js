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
    const lines2 = lines.slice(137, 141)

    let groups = []
    let group = {}

    let currentDeclaration = []
    let peopleCount = 0
    let empty = false
    lines.forEach(line=>{
        if (line) {
            //console.log(`currentDeclaration.length:  ${currentDeclaration.length}`)
            if (currentDeclaration.length == 0 && !empty) {
                currentDeclaration = [...new Set(line.split(''))]
                //console.log(`1 ${currentDeclaration}`)
            }
            else  {
                let currentLine = [...new Set(line.split(''))]
                //console.log(`2 ${currentLine}`)

                for (let i=currentDeclaration.length-1; i>=0; i--) 
                    if (currentLine.indexOf(currentDeclaration[i]) == -1) {
                        currentDeclaration.splice(i, 1)
                        if (currentDeclaration.length == 0) {
                            empty = true
                        }
                    }

            }

            peopleCount++
        } else {
            //console.log(`3 ${currentDeclaration}`)

            group.nbQuestions = currentDeclaration.length
            group.nbPeople = peopleCount

            //console.log(group)
            groups.push(group)  

            group = {}
            peopleCount = 0
            currentDeclaration = []
            empty = false
        }
    })

    //console.log(groups)

    let sumOfNbQuestions = groups.reduce((acc, curr) => acc += curr.nbQuestions,  0)

    console.log(`Sum of nb questions: ${sumOfNbQuestions}`)

} catch (err) {
    console.error(err)
}
