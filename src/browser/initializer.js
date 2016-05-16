import AppMenu from './menu.js'
import PodcastController from './controller/PodcastController.js'

class Initializer {

  constructor() {
    this.fetchInterval = 30 // In minutes
    this.setup()
  }

  setup() {
    this.menu = new AppMenu()
    PodcastController.fetch() // Calls when the app opens
    setInterval(PodcastController.fetch, this.fetchInterval * 60 * 1000)
  }

}

module.exports = Initializer
