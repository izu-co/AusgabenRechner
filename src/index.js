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
    title: "Ausgabenrechner",
    icon: path.join(__dirname, "ico.ico")
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
      click: function(_, window, __) {
        mainWindow.loadFile(path.join(__dirname, 'frontend', 'index', 'index.html'));
      }
    },
    {
      label: fileHandler.resolveLanguageCode("categorys", languageCode),
      submenu: [
        {
          label: fileHandler.resolveLanguageCode("manage", languageCode),
          click: function(_, window, __) {

          }
        },
        {
          label: fileHandler.resolveLanguageCode("add", languageCode),
          click: function(_, window, __) {
            window.loadFile(path.join(__dirname, 'frontend', 'categorys', 'add', 'index.html'))
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

process.on("exit", function() {
  fileHandler.saveCache()
})

ipcMain.on('onceEntrie', (event, arg) => {
  fileHandler.addSpending(arg);
})
