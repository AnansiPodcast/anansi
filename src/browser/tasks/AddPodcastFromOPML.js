import Task from './task.js'
import PodcastController from '../controller/PodcastController'

class AddPodcastFromOPML extends Task {

  constructor(url) {
    super()
    this.url = url
  }

  run() {
    return PodcastController.add(this.url)
  }

}

module.exports = AddPodcastFromOPML
