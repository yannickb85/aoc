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
    const keyValue = /([\w-]+):([^\s]+)/g

    var keyMap = {}
    while ((m=keyValue.exec(passports[4]))!=null) {
        keyMap[m[1]]=m[2]
    }

    let fieldsTests = []
    let strictTests = []

    const hgtParse = /^(\d{2,3})(in|cm)$/
    const hclParse = /^#[0-9a-f]{6}$/
    const eclParse = /^(amb|blu|brn|gry|grn|hzl|oth)$/
    const pidParse = /^\d{9}$/

    fields.forEach(field=>{
        fieldsTests[field] = new RegExp("\\w*" + field + "\\w*")

        switch (field) {
            case 'byr:': {
                strictTests['byr'] = ((birthYear) =>  { 
                    return birthYear >= 1920 && birthYear <= 2002
                })
                break
            }
            case 'iyr:': {
                strictTests['iyr'] = ((issueYear) => { 
                    return issueYear >= 2010 && issueYear <= 2020
                })
                break
            }
            case 'eyr:': {
                strictTests['eyr'] = ((expirationYear) => { 
                    return expirationYear >= 2020 && expirationYear <= 2030
                })
                break
            }
            case 'hgt:': {
                strictTests['hgt'] = ((height) => { 

                    let h = height.match(hgtParse)

                    if (h == null)
                        return false

                    let val = h[1]
                    let unit = h[2]

                   // console.log(`val: ${val} unit: ${unit}`)

                    switch (unit) {
                        case 'in': return val >= 59 && val <= 76
                        case 'cm': return val >= 150 && val <= 193
                        default: 
                            return false
                    }
                    
                })
                break
            }
            case 'hcl:': {
                strictTests['hcl'] = ((hairColor) => {
                    return hclParse.test(hairColor)
                })
                break
           }
           case 'ecl:': {
                strictTests['ecl'] = ((eyeColor) => {
                    return eclParse.test(eyeColor)
                })
                break
            }
            case 'pid:': {
                strictTests['pid'] = ((passportId) => {
                    return pidParse.test(passportId)
                })
                break
            }
            case 'cid:': {
                strictTests['cid'] = ((countryId) => {
                    return true
                })
                break
            }
       }
    })
    
    let validPassportCount = 0

   // let passes = [passports[4], passports[9]]

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

            //validate strict
            let keyMap = {}
            while ((m=keyValue.exec(passport))!=null) {
                keyMap[m[1]]=m[2]
            }

            let valid = true
            Object.keys(keyMap).forEach(key => {

               // console.log(`key: ${key} value: ${keyMap[key]} test: ${strictTests[key](keyMap[key])}`)

                if (!strictTests[key](keyMap[key])) {
                    valid = false
                }

                

            })

            if (valid) {
                validPassportCount++
            }

            
        }
        

    })

    console.log(`Valid passport count: ${validPassportCount}`)


} catch (err) {
    console.error(err)
}
