import app from 'app'
import Menu from 'menu'
import MenuItem from 'menu-item'
import BrowserWindow from 'browser-window'
import Iinitializer from './browser/initializer.js'

require('crash-reporter').start();

let mainWindow = null

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {  

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 500,
    minHeight: 200,
    'accept-first-mouse': true,
    'title-bar-style': 'hidden'
  });

  const ini = new Iinitializer(mainWindow)

  mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null
  });

});
