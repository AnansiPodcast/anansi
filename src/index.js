import app from 'app'
import Menu from 'menu'
import MenuItem from 'menu-item'
import Iinitializer from './browser/initializer.js'
import Windows from './browser/windows.js'

require('crash-reporter').start();

let mainWindow = null

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  Windows.openMain()
  const ini = new Iinitializer()
});
