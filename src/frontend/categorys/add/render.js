const path = require("path")
const { ipcRenderer, remote } = require('electron');
const { dialog } = require('electron').remote
const fileHandler = remote.require(path.join(remote.app.getAppPath(), "src", "backend", "fileHandler.js"));
const languageList = require("language-list")()

document.getElementsByTagName("h1").item(0).innerHTML = fileHandler.resolveLanguageCode("addCategory", navigator.language)

let labelSelection = document.getElementsByTagName("label")
for (let i = 0; i < labelSelection.length; i++) {
    const label = labelSelection[i];
    if (label.className) {
        label.innerHTML = fileHandler.resolveLanguageCode(label.className, navigator.language)
    }
}

const languages = languageList.getData();

const languageSelect = document.getElementById("languageSelect");
const table = document.getElementById("table")

languages.forEach(language => {
    addOption(languageSelect, language)
})

languageSelect.addEventListener("change", function() {
    let option = languageSelect.options[languageSelect.selectedIndex]
    let insertIndex = table.rows.length - 1
    languageSelect.remove(languageSelect.selectedIndex)
    let newRow = table.insertRow(insertIndex)
    let name = document.createElement("td")
    let value = document.createElement("td")
    value.setAttribute("contenteditable", "true")
    name.innerHTML = option.innerHTML
    newRow.appendChild(name)
    newRow.appendChild(value)
})


function addOption(Elem, item) {
    let option = document.createElement("option")
    option.value = item.code
    option.innerHTML = item.language
    Elem.appendChild(option)
    sortSelect(Elem)
}

function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}

document.getElementById("form").addEventListener("submit", function(ev) {
    ev.preventDefault()
    let data = [...table.rows].map(t => [...t.children].map(u => u.innerText))
    data = data.slice(1, data.length - 1)
    if (data.length === 0) 
        return dialog.showErrorBox(fileHandler.resolveLanguageCode("error", navigator.language), fileHandler.resolveLanguageCode("min1TranslationRequired", navigator.language))

    if (!data.some(a => languageList.getLanguageCode(a[0]) === navigator.language) || !data.some(a => languageList.getLanguageCode(a[0]) === "en"))
        return dialog.showErrorBox(fileHandler.resolveLanguageCode("error", navigator.language), fileHandler.resolveLanguageCode("englishAndYourLanguage", navigator.language))
    data = data.filter(a => a[1])
    console.log(data)
    fileHandler.addCategory(data)
    location.reload()
})