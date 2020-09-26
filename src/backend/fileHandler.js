const fs = require("fs")
const path = require("path")

const cache = this.readCache()

module.exports = {

    /**
     * @param {string} className 
     * @param {string} languageCode 
     * @returns {string}
     */
    resolveLanguageCode: function (className, languageCode) {
        return cache["language"][className]?cache["language"][className][languageCode]?cache["language"][className][languageCode]:cache["language"][className]["en"]:"ClassName not found"
    },
    
    resolveCategory: function(category, languageCode) {
        return cache["categorys"][category]?cache["categorys"][category][languageCode]?cache["categorys"][category][languageCode]:cache["categorys"][category]["en"]:null
    },

    getCategorys: function(languageCode) {
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
    },
    readCache: function() {
        return {
            "language": JSON.parse(fs.readFileSync(path.join(__dirname, "../../", "data", "language.json"))),
            "categorys": JSON.parse(fs.readFileSync(path.join(__dirname, "../../", "data", "categorys.json")))
        }
    },
    saveCache: function() {
        fs.writeFileSync(path.join(__dirname, "../../", "data", "language.json"), JSON.stringify(cache.language, null, 4));
        fs.writeFileSync(path.join(__dirname, "../../", "data", "categorys.json"), JSON.stringify(cache.categorys, null, 4));
    }
}
