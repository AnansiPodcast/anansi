import {crashReporter, app} from 'electron'
import Iinitializer from './browser/initializer.js'
import Updater from './browser/updater.js'
import Windows from './browser/windows.js'

// crashReporter.start();

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('ready', () => {
  Windows.openMain()
  let updater
  const ini = new Iinitializer()
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') updater = new Updater()
})
