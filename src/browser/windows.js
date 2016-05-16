import {BrowserWindow} from 'electron'
let instance = null

class Windows {

  constructor() {
    if(!instance)
      instance = this
    return instance;
  }

  openMain() {

    this.mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      minWidth: 500,
      minHeight: 200,
      acceptFirstMouse: true,
      titleBarStyle: 'hidden'
    });

    this.mainWindow.loadURL('file://' + __dirname + '/../index.html');
    this.mainWindow.on('closed', () => {
      this.mainWindow = null
    });

  }

}

module.exports = new Windows()
