import Task from './task.js'
import Messenger from '../messenger.js'
import Podcast from '../model/Podcast.js'
import DownloadCoverHelper from '../helper/DownloadCoverHelper'
import ConfigController from '../controller/ConfigController.js'
const Logger = ConfigController.logger()

class DownloadPodcastCover extends Task {

  constructor(podcast) {
    super()
    this.podcast = podcast
    DownloadCoverHelper.createDirectory()
  }

  done() {
    Messenger.send('podcast.model.changed', true)
  }

  run() {
    Logger.info(`Downloading cover for ${this.podcast.name}`)
    return DownloadCoverHelper.download(this.podcast.image)
    .then((path) => {
      Logger.info(`Downloaded cover for ${this.podcast.name}`)
      Podcast
      .chain()
      .find({id: this.podcast.id})
      .assign({image: path, downloadedCover: true})
      .value()
      return true
    })
  }

}

module.exports = DownloadPodcastCover
