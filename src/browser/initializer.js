import AppMenu from './menu.js'
import PodcastController from './controller/PodcastController.js'

class Initializer {

  constructor() {
    this.fetchInterval = 30 // In minutes
    this.setup()
  }

  setup() {
    this.menu = new AppMenu()
    this.setupIntervals()
  }

  setupIntervals() {
    setTimeout(() => {
      PodcastController.fetch()
    }, 5 * 1000)
    setInterval(() => {
      PodcastController.fetch()
    }, this.fetchInterval * 60 * 1000)
  }

}

module.exports = Initializer
