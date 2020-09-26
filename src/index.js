const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const fileHandler = require("./backend/fileHandler")
const languageCode = require("os-locale").sync().split("-")[0]

if (require('electron-squirrel-startup')) { 
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    title: ""
  });

  const menu = Menu.buildFromTemplate([
    {
      label: fileHandler.resolveLanguageCode("add", languageCode),
      submenu: [
          {
            label:fileHandler.resolveLanguageCode("addSpending", languageCode),
            click: function (_, window, __) {
              window.loadFile(path.join(__dirname, 'frontend', 'addSpending', 'index.html'))
            }
          }
      ]
    },
    {
      label: fileHandler.resolveLanguageCode("analysis", languageCode),
      submenu: [
        {
          label:fileHandler.resolveLanguageCode("year", languageCode),
          click: function(_, window, __) {
            dialog.showMessageBoxSync(window, {
              message: "Diese Funktion exestiert noch nicht!",
              title: "Not found",
              type: "info"
            })
          }
        },
        {
          label:fileHandler.resolveLanguageCode("month", languageCode),
          click:function(_, window, __) {
            window.loadFile(path.join(__dirname, 'frontend', 'index', 'index.html'))
          }
        },
        {
          label:fileHandler.resolveLanguageCode("day", languageCode),
          click:function(_, window, __) {
            dialog.showMessageBoxSync(window, {
              message: "Diese Funktion exestiert noch nicht!",
              title: "Not found",
              type: "info"
            })
          }
        }
      ]
    }
  ])

  mainWindow.setMenu(menu)

  mainWindow.loadFile(path.join(__dirname, 'frontend', 'index', 'index.html'));

  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("quit", function() {
  fileHandler.saveCache()
})

ipcMain.on('onceEntrie', (event, arg) => {
  console.log(arg) 
})
