import AppMenu from './menu.js'

class Initializer {

  constructor(mainWindow) {
    this.mainWindow = mainWindow
    this.setup()
  }

  setup() {
    this.menu = new AppMenu(this.mainWindow)
  }

}

module.exports = Initializer
