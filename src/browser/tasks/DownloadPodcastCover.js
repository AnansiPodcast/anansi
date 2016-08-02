import Q from 'q'
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
    Messenger.send('podcast.covers.updated', true)
  }

  run() {
    if(typeof this.podcast.image === 'undefined' || this.podcast.downloadedCover === true){
      const deferred = Q.defer()
      setTimeout(() => deferred.resolve(), 10)
      return deferred.promise
    }
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
