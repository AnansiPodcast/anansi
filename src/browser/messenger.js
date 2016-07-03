const loadElectron = (typeof process.versions['electron'] !== 'undefined')
let instance = null

if(loadElectron) var Windows = require('./windows.js')

class Messenger {

  constructor() {
    if(!instance) {
      this.callbacks = []
      instance = this
    }
    return instance;
  }

  listen(key, callback) {
    if(typeof this.callbacks[key] == 'undefined') this.callbacks[key] = []
    this.callbacks[key].push(callback)
  }

  _triggerListeners(key, value) {
    if(typeof this.callbacks[key] == 'undefined') return
    this.callbacks[key].forEach((cb) => { cb(value) })
  }

  clearCallbacks(keys) {
    keys.forEach((key) => {
      this.callbacks[key] = []
    })
  }

  send(key, value) {
    if(typeof Windows !== 'undefined')
      Windows.mainWindow.webContents.send(key, value)
    this._triggerListeners(key, value)
  }

}

module.exports = new Messenger()
