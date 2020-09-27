const fs = require("fs")
const path = require("path")

const cache = readCache()

function resolveLanguageCode (className, languageCode) {
    return cache["language"][className]?cache["language"][className][languageCode]?cache["language"][className][languageCode]:cache["language"][className]["en"]:"ClassName not found"
}
    
function resolveCategory (category, languageCode) {
    return cache["categorys"][category]?cache["categorys"][category][languageCode]["text"]?cache["categorys"][category][languageCode]["text"]:cache["categorys"][category]["en"]["text"]:null
}

function getCategorys (languageCode) {
    let ret = []
    let categorys = Object.keys(cache.categorys)
    for (let a = 0; a < categorys.length; a++) {
        const categoryObject = cache.categorys[categorys[a]];
        ret.push({
            "value": categorys[a],
            "text": categoryObject[languageCode]?categoryObject[languageCode]["text"]:categoryObject["en"]["text"]
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

    let answer = new Map();

    let YearKeys = Object.keys(cache.spendings)
    for (let i = 0; i < YearKeys.length; i++) {
        let MonthKeys = Object.keys(cache.spendings[YearKeys[i]])
        for (let a = 0; a < MonthKeys.length; a++) {
            let DayKeys = Object.keys(cache.spendings[YearKeys[i]][MonthKeys[a]])
            for (let o = 0; o < DayKeys.length; o++) {
                cache.spendings[YearKeys[i]][MonthKeys[a]][DayKeys[o]].forEach(spending => {
                    if (answer.get(spending["category"])) {
                        answer.set(spending["category"], answer.get(spending["category"]) + spending["spend"])
                    } else
                        answer.set(spending["category"], spending["spend"])
                })
            }
        } 
    }
    return answer
}

function readCache() {
    return {
        "language": JSON.parse(fs.readFileSync(path.join(__dirname, "../../", "data", "language.json"))),
        "categorys": JSON.parse(fs.readFileSync(path.join(__dirname, "../../", "data", "categorys.json"))),
        "spendings": JSON.parse(fs.readFileSync(path.join(__dirname, "../../", "data", "spendings.json")))
    }
}

function saveCache() {
    fs.writeFileSync(path.join(__dirname, "../../", "data", "language.json"), JSON.stringify(cache.language, null, 4));
    fs.writeFileSync(path.join(__dirname, "../../", "data", "categorys.json"), JSON.stringify(cache.categorys, null, 4));
    fs.writeFileSync(path.join(__dirname, "../../", "data", "spendings.json"), JSON.stringify(cache.spendings, null, 4));
}


exports.resolveCategory = resolveCategory
exports.readCache = readCache
exports.saveCache = saveCache
exports.getCategorys = getCategorys
exports.resolveLanguageCode = resolveLanguageCode
exports.addSpending = addSpending;
exports.getTotalSpending = getTotalSpending