import Task from './task.js'
import Q from 'q'
import Messenger from '../messenger.js'
import Episode from '../model/Episode.js'
import DownloadCoverHelper from '../helper/DownloadCoverHelper'
import ConfigController from '../controller/ConfigController.js'
const Logger = ConfigController.logger()

class DownloadEpisodeCover extends Task {

  constructor(episode) {
    super()
    this.episode = episode
    DownloadCoverHelper.createDirectory()
  }

  done() {
    Messenger.send('episode.covers.updated', true)
  }

  run() {
    if(typeof this.episode.image === 'undefined' || this.episode.downloadedCover === true){
      const deferred = Q.defer()
      setTimeout(() => deferred.resolve(), 10)
      return deferred.promise
    }
    Logger.info(`Downloading cover for ${this.episode.title}`)
    return DownloadCoverHelper.download(this.episode.image)
    .then((path) => {
      Episode
      .chain()
      .find({guid: this.episode.guid})
      .assign({image: path, downloadedCover: true})
      .value()
      Logger.info(`Downloaded cover for ${this.episode.title}`)
      return true
    })
  }

}

module.exports = DownloadEpisodeCover
