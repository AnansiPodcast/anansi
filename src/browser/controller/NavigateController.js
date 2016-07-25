import Messenger from '../messenger.js'

class NavigateController {

  static to(location) {
    Messenger.send('ui.navigate', `#${location}`)
  }

}

module.exports = NavigateController
