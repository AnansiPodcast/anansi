const loadElectron = (typeof process.versions['electron'] !== 'undefined')
let instance = null

if(loadElectron) Windows = require('./windows.js')

class Messenger {

  constructor() {
    if(!instance)
      instance = this
    return instance;
  }

  send(key, value) {
    if(Windows)
      Windows.mainWindow.webContents.send(key, value)
  }

}

module.exports = new Messenger()
