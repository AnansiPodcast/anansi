import {autoUpdater, app} from 'electron'
import ConfigController from './controller/ConfigController.js'
const Logger = ConfigController.logger()

class Updater {

  constructor() {
    this.listen()
    this.check()
    this.scheduleCheck()
  }

  listen() {

    autoUpdater.on('checking-for-update', () => {
      Logger.info('Checking for update')
    })

    autoUpdater.on('update-available', () => {
      Logger.info('Updade available')
    })

    autoUpdater.on('update-downloaded', () => {
      const message = 'A new version of Anansi is available, click "Ok" to close the app and install'
      DialogController.abstractMessage('installer', 'Update available', message, false)
      .then((res) => {
        if(res === '1')
          autoUpdater.quitAndInstall()
      })
    })

  }

  check() {
    const channel = ConfigController.get('updateChannel')
    const version = app.getVersion()
    autoUpdater.setFeedURL(`https://anansi-podcast.herokuapp.com/update/${channel}/${version}`)
    autoUpdater.checkForUpdates()
  }

  scheduleCheck() {
    setTimeout(() => {
      Updater.check()
    }, ConfigController.get('updateInterval'))
  }

}

module.exports = Updater
