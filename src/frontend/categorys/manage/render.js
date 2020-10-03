const path = require("path")
const { ipcRenderer, remote } = require('electron');
const { create } = require("domain");
const { dialog } = require('electron').remote
const fileHandler = remote.require(path.join(remote.app.getAppPath(), "src", "backend", "fileHandler.js"));
const languageList = require("language-list")()

let titels = document.getElementsByTagName("th")
for (let i = 0; i < titels.length; i++) {
    let titel = titels.item(i)
    if(!titel.className) continue
    titel.innerHTML = fileHandler.resolveLanguageCode(titel.className, navigator.language)
}


const table = document.getElementById("table")
fileHandler.getCategorys(navigator.language).forEach(category => {
    console.log(category)
    let index = table.rows.length
    let newRow = table.insertRow(index)
    let id = document.createElement("td")
    let value = document.createElement("td")
    value.setAttribute("contenteditable", "true")
    value.innerHTML = category["text"]
    id.innerHTML = category["value"]

    newRow.appendChild(id)
    newRow.appendChild(value)
    newRow.appendChild(createRemove(category["value"]))
    newRow.appendChild(createApprove(value, category["value"]))
});


/**
 * 
 * @param {string} id 
 */
function createRemove(id) {
    let td = document.createElement("td")
    td.className = "button"

    let button = document.createElement("button")
    button.classList = "btn remove"

    button.addEventListener("click", () => {
        dialog.showMessageBox(remote.getCurrentWindow(), {
            type: "question",
            buttons: [fileHandler.resolveLanguageCode("approve", navigator.language),
                    fileHandler.resolveLanguageCode("cancel", navigator.language)],
            message: fileHandler.resolveLanguageCode("approveDelete", navigator.language),
            cancelId: 1,
            defaultId: 1,
            noLink: true
        }).then(response => {
            if (response.response === 0) {
                fileHandler.removeCategory(id);
                location.reload()
            }
        })
    })

    let i = document.createElement("i")
    i.classList = "fa fa-trash"

    button.appendChild(i)

    td.appendChild(button)
    return td
}

/**
 * 
 * @param {HTMLTableDataCellElement} value 
 * @param {string} id 
 */
function createApprove(value, id) {
    let td = document.createElement("td")
    td.className = "button"

    let button = document.createElement("button")
    button.classList = "btn approve"
    button.setAttribute("disabled", true)

    let i = document.createElement("i")
    i.classList = "fa fa-check"

    value.addEventListener("keyup", () => {
        button.removeAttribute("disabled")
    })

    button.addEventListener("click", () => {
        fileHandler.updateCategory(id, navigator.language, value.innerText)
        button.setAttribute("disabled", true)
    })

    button.appendChild(i)

    td.appendChild(button)
    return td
}