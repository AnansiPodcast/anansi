import AppMenu from './menu.js'
import PodcastController from './controller/PodcastController.js'
import db from './model/db.js'

class Initializer {

  constructor() {
    this.setup()
  }

  setup() {
    this.menu = new AppMenu()
    PodcastController.scheduleFetch()
  }

}

module.exports = Initializer
