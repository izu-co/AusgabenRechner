let cache = {
    "spendings": {
        "2018": {
            "02": {
                "16": [
                    {
                        "title": "Haus",
                        "description": "",
                        "category": "c9fddf5f-948e-465e-bdfc-6158996dd524",
                        "spend": 4950
                    }
                ]
            }
        },
        "2020": {
            "10": {
                "03": [
                    {
                        "title": "Auto",
                        "description": "",
                        "category": "a0fc140a-cfb2-4f2f-8bc0-94886eba8701",
                        "spend": 0
                    }
                ]
            }
        }
    }
}

let ret = []
let YearKeys = Object.keys(cache.spendings)
for (let i = 0; i < YearKeys.length; i++) {
    let MonthKeys = Object.keys(cache.spendings[YearKeys[i]])
    for (let a = 0; a < MonthKeys.length; a++) {
        let DayKeys = Object.keys(cache.spendings[YearKeys[i]][MonthKeys[a]])
        for (let o = 0; o < DayKeys.length; o++) {
            ret.push(cache.spendings[YearKeys[i]][MonthKeys[a]][DayKeys[o]])
        }
    } 
}
ret.forEach((a,i) => {
    a.forEach((b, n) => {
        if (b["category"] === "a0fc140a-cfb2-4f2f-8bc0-94886eba8701") {
            ret[i].splice(n, 1)
        }
    })
})

console.log(JSON.stringify(cache, null, 0))