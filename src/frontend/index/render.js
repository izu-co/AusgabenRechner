const Chart = require("chart.js")
const path = require("path")
const { ipcRenderer, remote } = require('electron')
const fileHandler = remote.require(path.join(remote.app.getAppPath(), "src", "backend", "fileHandler.js"));
const totalSpending = ipcRenderer.sendSync("getTotalData")
const chartDataLabels = require("chartjs-plugin-datalabels")

Chart.plugins.register(chartDataLabels)

const max = 10

document.getElementById("title").innerHTML = fileHandler.resolveLanguageCode("totalSpending", navigator.language)


let labelSelection = document.getElementsByTagName("label")
for (let i = 0; i < labelSelection.length; i++) {
    const label = labelSelection[i];
    if (label.className) {
        label.innerHTML = fileHandler.resolveLanguageCode(label.className, navigator.language)
    }
}


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

console.log(data, objects, totalSpending, getRandomColor(data[0].length))

var myChart = new Chart(ctx, {
    plugins: [chartDataLabels],
    type: 'line',
    data: {
        labels: data[1],
        datasets: [{
            data: data[0],
            backgroundColor: getRandomColor(),
            borderColor: [
                'rgba(255, 99, 132, 0.2)'
            ],
            pointBackgroundColor: "black",
            borderWidth: 1,
            barPercentage: 1
        }]
    },
    options: {
        plugins: {
            datalabels: {
                anchor: "center",
                align: "start",
                offset: 10,
                font: {
                    weight: 600,
                    size: getFontSize(),
                },
                color: "black"
            }
        },
        responsive: true,
        responsiveAnimationDuration: 1000,
        legend: {
            onClick: function () {},
            display: false
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

function getRandomColor() {
    let colors = ["FF2D00", "FEFF00", "67FF00", "00FFB1", "0078FF", "0078FF",
                "D400FF", "FF00A6"]
    if (myChart)
        if (myChart.config.type === "line") 
            return "#" + colors.splice(Math.floor(Math.random() * colors.length), 1)[0]
        else {
            console.log(colors, myChart.config.data.labels.length, getRandom(colors, 
                myChart.config.data.labels.length))
            return getRandom(colors, 
                myChart.config.data.labels.length).map(a => "#" + a)
        }
    else    
        return "#" + colors.splice(Math.floor(Math.random() * colors.length), 1)[0]
    
}

window.addEventListener("resize", fontSize)

var radios = document.querySelectorAll("input[type=radio]")
for(let i = 0; i < radios.length; i++) {
    if (radios[i].name === "chartType")
        radios[i].onclick = function(event) {
            if (radios[i].checked) {
                myChart.config.type = radios[i].value
                if (radios[i].value === "pie") {
                    myChart.config.options.scales.xAxes[0].display = false;
                    myChart.config.options.scales.yAxes[0].display = false;
                } else {
                    myChart.config.options.scales.xAxes[0].display = true;
                    myChart.config.options.scales.yAxes[0].display = true;
                }

                if (radios[i].value === "bar") {
                    myChart.config.options.plugins.datalabels.display = false;
                } else {
                    myChart.config.options.plugins.datalabels.display = true;
                }

                myChart.config.data.datasets[0].backgroundColor = getRandomColor()
                myChart.update()
            }
        }
}


function fontSize () {
    let fontSize = parseInt(window.innerWidth * 0.03)
    fontSize = fontSize>25?25:fontSize<12?12:fontSize
    myChart.options["legend"]["labels"]["fontSize"] = fontSize
    myChart.options["scales"]["xAxes"][0]["ticks"]["fontSize"] = fontSize
    myChart["options"].plugins.datalabels.font.size = fontSize * .8
}

function getFontSize() {
    let fontSize = parseInt(window.innerWidth * 0.03)
    fontSize = fontSize>25?25:fontSize<12?12:fontSize
    return fontSize
}

/**
 * 
 * @param {Array} arr 
 * @param {Number} n
 * @returns {Array} 
 */
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}