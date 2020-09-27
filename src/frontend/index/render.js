const Chart = require("chart.js")
const path = require("path")
const { ipcRenderer, remote } = require('electron')
const fileHandler = remote.require(path.join(remote.app.getAppPath(), "src", "backend", "fileHandler.js"));
const totalSpending = ipcRenderer.sendSync("getTotalData")

const max = 10


var ctx = document.getElementById('chart').getContext('2d');

let objects = []

totalSpending.forEach((value, key) => {
    objects.push({
        "value": value,
        "label": fileHandler.resolveCategory(key, navigator.language)
    })
})

objects.sort((a, b) => a["value"] - b["value"])

let data = [
    [],
    []
]

objects.forEach((a, index) => {
    if (index > max)
        return
    data[0].push(a["value"])
    data[1].push(a["label"])
})

console.log(data, objects, totalSpending)

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data[1],
        datasets: [{
            label: fileHandler.resolveLanguageCode("spendInCurrency", navigator.language),
            data: data[0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            borderWidth: 1
        }]
    },
    "options": {
        responsive: true,
        responsiveAnimationDuration: 1000,
        legend: {
            onClick: function () {}
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0
                }
            }]
        }        
    }
});