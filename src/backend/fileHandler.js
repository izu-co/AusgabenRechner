const fs = require("fs")
const path = require("path")
const languageList = require("language-list")()
const cache = readCache()

function resolveLanguageCode (className, languageCode) {
    return cache["language"][className]?cache["language"][className][languageCode]?cache["language"][className][languageCode]:cache["language"][className]["en"]:"ClassName not found"
}
    
function resolveCategory (category, languageCode) {
    return cache["categorys"][category]?cache["categorys"][category][languageCode]?cache["categorys"][category][languageCode]:cache["categorys"][category][languageCode]["en"]:null
}

function getCategorys (languageCode) {
    let ret = []
    let categorys = Object.keys(cache.categorys)
    for (let a = 0; a < categorys.length; a++) {
        const categoryObject = cache.categorys[categorys[a]];
        ret.push({
            "value": categorys[a],
            "text": categoryObject[languageCode]?categoryObject[languageCode]:categoryObject["en"]?categoryObject["en"]:null
        })
    }
    return ret;            
}

function addSpending(data) {
    let object = cache.spendings;
    console.log(cache.spendings, data)
    if (!object.hasOwnProperty(data["date"]["year"])) 
        object[data["date"]["year"]] = {}
    if (!object[data["date"]["year"]].hasOwnProperty([data["date"]["month"]])) 
        object[data["date"]["year"]][data["date"]["month"]] = {}
    if (! object[data["date"]["year"]][data["date"]["month"]].hasOwnProperty(data["date"]["day"])) 
        object[data["date"]["year"]][data["date"]["month"]][data["date"]["day"]] = []

    let day = object[data["date"]["year"]][data["date"]["month"]][data["date"]["day"]]
    day.push({
        "title": data["title"],
        "description": data["description"],
        "category": data["category"],
        "spend": parseFloat(data["spend"])
    })
    object[data["date"]["year"]][data["date"]["month"]][data["date"]["day"]] = day;
    console.log(cache.spendings)
}

function calculateDifferenz() {

}

function getTotalSpending() {

    let answer = {}

    let YearKeys = Object.keys(cache.spendings)
    for (let i = 0; i < YearKeys.length; i++) {
        let MonthKeys = Object.keys(cache.spendings[YearKeys[i]])
        for (let a = 0; a < MonthKeys.length; a++) {
            let DayKeys = Object.keys(cache.spendings[YearKeys[i]][MonthKeys[a]])
            for (let o = 0; o < DayKeys.length; o++) {
                cache.spendings[YearKeys[i]][MonthKeys[a]][DayKeys[o]].forEach(spending => {
                    if (answer[spending["category"]]) {
                        answer[spending["category"]] += spending["spend"]
                    } else {
                        answer[spending["category"]] = spending["spend"]
                    }
                })
            }
        } 
    }
    return {"type": "total", "data": answer}
}

/**
 * @param {Date} date 
 */
function getYearSpending(date) {

    let answer = {}

    let year = date.getFullYear();

    if (!checkObject(year))
        return {"type": "year", "data": answer}

    let MonthKeys = Object.keys(cache.spendings[year])
    for (let a = 0; a < MonthKeys.length; a++) {
        let DayKeys = Object.keys(cache.spendings[year][MonthKeys[a]])
        for (let o = 0; o < DayKeys.length; o++) {
            cache.spendings[year][MonthKeys[a]][DayKeys[o]].forEach(spending => {
                if (answer[spending["category"]]) {
                    answer[spending["category"]] =+ spending["spend"]
                } else
                    answer[spending["category"]] = spending["spend"]
            })
        }
    } 
    return {"type": "year", "data": answer}
}


/**
 * @param {Date} date 
 */
function getMonthSpending(date) {
    
    let answer = {}
    
    let year = date.getFullYear()
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    
    if (!checkObject(year, month))
        return {"type": "month", "data": answer}

    let DayKeys = Object.keys(cache.spendings[year][month])
    for (let o = 0; o < DayKeys.length; o++) {
        cache.spendings[year][month][DayKeys[o]].forEach(spending => {
            if (answer[spending["category"]]) {
                answer[spending["category"]] =+ spending["spend"]
            } else
            answer[spending["category"]] = spending["spend"]
        })
    }
    return {"type": "month", "data": answer}
}

/**
 * @param {Date} date 
 */
function getDaySpending(date) {
    let answer = {}

    let year = date.getFullYear()
    let month = ("0" + date.getDate()).slice(-2)
    let day = ("0" + (date.getMonth() + 1)).slice(-2)

    if (!checkObject(year, month, day))
    return {"type": "day", "data": answer}
    cache.spendings[year][month][day].forEach(spending => {
        if (answer[spending["category"]]) {
            answer[spending["category"]] =+ spending["spend"]
        } else
            answer[spending["category"]] = spending["spend"]
    })
    return {"type": "day", "data": answer}
}

/**
 * @param {string} title 
 * @param {Array} translations 
 */
function addCategory(title, translations) {
    let data = {}
    translations.forEach(translation => {
        data[languageList.getLanguageCode(translation[0])] = translation[1]
    })
    cache.categorys[title] = data;
}

function readCache() {
    if (!fs.existsSync(path.join(__dirname, "../", "data", "spendings.json")))
        fs.writeFileSync(path.join(__dirname, "../", "data", "spendings.json"), "{}")
    return {
        "language": JSON.parse(fs.readFileSync(path.join(__dirname, "../", "data", "language.json"))),
        "categorys": JSON.parse(fs.readFileSync(path.join(__dirname, "../", "data", "categorys.json"))),
        "spendings": JSON.parse(fs.readFileSync(path.join(__dirname, "../", "data", "spendings.json")))
    }
}

function saveCache() {
    fs.writeFileSync(path.join(__dirname, "../", "data", "language.json"), JSON.stringify(cache.language, null, 4));
    fs.writeFileSync(path.join(__dirname, "../", "data", "categorys.json"), JSON.stringify(cache.categorys, null, 4));
    fs.writeFileSync(path.join(__dirname, "../", "data", "spendings.json"), JSON.stringify(cache.spendings, null, 4));
}

function checkObject(...args) {
    let ob = cache.spendings;
    let ok = true;
    for (arg of args) {
        if (ob.hasOwnProperty(arg)) {
            ob = ob[arg]
        } else {
            ok = false;
            break;
        }
    }
    return ok;
}

exports.resolveCategory = resolveCategory
exports.readCache = readCache
exports.saveCache = saveCache
exports.getCategorys = getCategorys
exports.resolveLanguageCode = resolveLanguageCode
exports.addSpending = addSpending;
exports.getTotalSpending = getTotalSpending
exports.getYearSpending = getYearSpending
exports.getMonthSpending = getMonthSpending
exports.getDaySpending = getDaySpending,
exports.addCategory = addCategory