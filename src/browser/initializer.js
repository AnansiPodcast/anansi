import AppMenu from './menu.js'
import PodcastController from './controller/PodcastController.js'
import fs from 'fs'

class Initializer {

  constructor() {
    this.setup()
    this.emptyFileLog()
  }

  emptyFileLog() {
    if(process.env.NODE_ENV != 'development') {
      var app = require('electron').app
      const logPath = app.getPath('appData') + '/'+app.getName()+'/log'
      try {
        fs.accessSync(logPath)
        fs.unlinkSync(logPath)
      } catch(e){
        // Does nothing
      }
    }
  }

  setup() {
    this.menu = new AppMenu()
    PodcastController.scheduleFetch()
  }

}

module.exports = Initializer
