import {BrowserWindow, app} from 'electron'
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
      minWidth: 940,
      minHeight: 600,
      acceptFirstMouse: true,
      frame: false
    });

    this.mainWindow.loadURL('file://' + __dirname + '/../index.html');
    this.mainWindow.on('closed', () => {
      app.quit();
    });

  }

}

module.exports = new Windows()
