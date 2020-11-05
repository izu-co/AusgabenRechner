const path = require("path")

const { remote, ipcRenderer } = require('electron');
const { dialog } = require('electron').remote
const { windowObj } = require('electron').remote.getCurrentWindow()
const fileHandler = remote.require(path.join(remote.app.getAppPath(), "src", "backend", "fileHandler.js"));

document.getElementById("when").max = new Date().toISOString().split("T")[0]

const head = document.getElementsByTagName("h1").item(0)
if (head.className)
    head.innerHTML = fileHandler.resolveLanguageCode(head.className, navigator.language)

let categorysSelections = document.getElementsByClassName("categorySel");
for (let i = 0; i < categorysSelections.length; i++) {
    let select = categorysSelections.item(i)
    let categorys = fileHandler.getCategorys(navigator.language)
    for (let a = 0; a < categorys.length; a++) {
        let option = document.createElement("option")
        option.value = categorys[a]["value"]
        option.text = categorys[a]["text"]
        select.appendChild(option)
    }
}

document.getElementById("noneOption").innerHTML = fileHandler.resolveLanguageCode("noneOption", navigator.language)
document.getElementById("numberLabel").innerHTML = fileHandler.resolveLanguageCode("numberSelection", navigator.language)

let labelSelection = document.getElementsByTagName("label")
for (let i = 0; i < labelSelection.length; i++) {
    const label = labelSelection[i];
    if (label.className) {
        label.innerHTML = fileHandler.resolveLanguageCode(label.className, navigator.language)
    }
}

const form = document.getElementById("form")
form.addEventListener("submit", function(event) {
    event.preventDefault()
    let category = document.getElementById("category").value
    let spend = document.getElementById("spend").value
    let date = document.getElementById("when").value
    let title = document.getElementById("title").value
    let description = document.getElementById("descrption").value

    if (category === "none") {
        dialog.showMessageBox(windowObj, {
            "message": fileHandler.resolveLanguageCode("chooseCategory", navigator.language),
            "type": "error",
        })
        return;
    }

    if (spend < 0) {
        dialog.showMessageBox(windowObj, {
            "message": fileHandler.resolveLanguageCode("chooseSpend",  navigator.language),
            "type": "error",
        })
        return;
    }

    let dateObject = {
        "year": date.split("-")[0],
        "month": date.split("-")[1],
        "day": date.split("-")[2]
    }

    ipcRenderer.send("onceEntrie", {
        "title": title,
        "description": description,
        "category": category,
        "spend": spend,
        "date": dateObject
    })
    
    form.reset()
})