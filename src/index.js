import {crashReporter, app} from 'electron'
import Iinitializer from './browser/initializer.js'
import Windows from './browser/windows.js'

// crashReporter.start();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('ready', () => {
  Windows.openMain()
  const ini = new Iinitializer()
});
