if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}

const fs = require('fs')
const filename = process.argv[2]

try {

    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split(/\r?\n/)
    const lines2 = lines.slice(26, 27)

    const MY_BAG_COLOR = 'shiny gold bag'

    let rules = initRules(lines)
    //console.table(rules)

    const bagsContainingMyBag = new Set()
    rules.forEach((bag, key, map) => {
        bag.forEach((rule, i, arr) => {
            if (rule.bag == MY_BAG_COLOR) {
                bagsContainingMyBag.add(key)
            }
        })
    })
    console.log(bagsContainingMyBag)

    // union
    for (let bagName of bagsContainingMyBag) {
        let newBags = bagContainsKind(rules, bagName)
        if (newBags.size > 0) {
            for (let elem of newBags) {
                bagsContainingMyBag.add(elem)
            }
        }
    }
    
    console.log(bagsContainingMyBag.size)

} catch (err) {
    console.error(err)
}

function bagContainsKind(rules, kind) {
    const bags = new Set()
    rules.forEach((bag, key, map) => {
        bag.forEach((rule, i, arr) => {
            if (rule.bag == kind) {
                bags.add(key)
            }
        })
    })
    return bags
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
                return {}

            return { bag: bagContent[2].replace('bags', 'bag'), qty: +bagContent[1] }
        })

        rules.set(bagDescription[0].replace('bags', 'bag'), content)

    });

    return rules
}