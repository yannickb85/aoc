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
    const lines2 = lines.slice(0, 2)

    const MY_BAG_COLOR = 'shiny gold bag'

    const rules = initRules(lines)
    const MY_RULE = rules.get(MY_BAG_COLOR)
    
    console.log(countBags(rules, MY_RULE))


} catch (err) {
    console.error(err)
}

function countBags(rules, rule) {
    if (!rule[0])
        return 0
    
    return rule.reduce((acc, currBag) => acc += currBag.qty * countBags(rules, rules.get(currBag.bag)), 0) + rule.reduce((acc, currBag) => acc += currBag.qty, 0)
}

function initRules(lines) {
    let rules = new Map()
    let fullBagContainsRegex = /\b\scontain\s\b/
    let singleBagContainsRegex = /(\d+)\s(.+)/

    lines.forEach(line => {
        line = line.replace('.', '')
        let bagDescription = line.split(fullBagContainsRegex)
        bagDescription.splice(1, 1, bagDescription[1].split(', '))

        let content = bagDescription[1].map(i=>{
            const bagContent = i.match(singleBagContainsRegex)

            if (!bagContent)
                return null

            return { bag: bagContent[2].replace('bags', 'bag'), qty: +bagContent[1] }
        })

        rules.set(bagDescription[0].replace('bags', 'bag'), content)

    });

    return rules
}