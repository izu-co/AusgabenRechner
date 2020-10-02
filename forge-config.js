const path = require("path")

module.exports= {
    "packagerConfig": {
      "icon": path.join(__dirname, "src", "ico.ico"),
      "overwrite": true,
      "ignore": "spendings.json"
    },
    "makers": [
      {
        "name": "@electron-forge/maker-squirrel",
        "config": {
          "name": "rechner",
          "setupIcon": path.join(__dirname, "src", "ico.ico"),
          "iconUrl": path.join(__dirname, "src", "ico.ico"),
          "overwrite": true
        }
      },
      {
        "name": "@electron-forge/maker-zip",
        "platforms": [
          "darwin"
        ]
      },
      {
        "name": "@electron-forge/maker-deb",
        "config": {}
      },
      {
        "name": "@electron-forge/maker-rpm",
        "config": {}
      }
    ]
  }