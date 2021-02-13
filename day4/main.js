if (process.argv.length < 3) {
    console.log('Usage: node ' + process.argv[1] + ' FILENAME')
    process.exit(1)
}


const fs = require('fs')
const filename = process.argv[2]


try {

    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split(/\r?\n/)

    let passports = []
    let currentPassport = 0

    lines.forEach(line => {
        if (!passports[currentPassport]) {
            passports[currentPassport] = ''
        }
        passports[currentPassport] = passports[currentPassport].concat(' ').concat(line).trim()
        if (!line) {
            currentPassport++
        }

    })

    const fields = ['byr:', 'iyr:', 'eyr:', 'hgt:', 'hcl:', 'ecl:', 'pid:', 'cid:']
    let fieldsTests = []

    fields.forEach(field=>{
        fieldsTests[field] = new RegExp("\\w*" + field + "\\w*")
    })

    
    let validPassportCount = 0

    let passses = [passports[4], passports[9]]

    

    passports.forEach(passport=>{
        let passportValidationMap = []

        fields.forEach(field=>{
            passportValidationMap[field] = fieldsTests[field].test(passport)
        })

        //override cid
        passportValidationMap['cid:'] = true

        let fieldPresent = []
        fields.forEach(field=>{
            fieldPresent.push(passportValidationMap[field])
        })

        const allValid = (acc, curr) => acc && curr
        if (fieldPresent.reduce(allValid, true)) {
            validPassportCount++
        }
        

    })

    console.log(`Valid passport count: ${validPassportCount}`)


} catch (err) {
    console.error(err)
}
