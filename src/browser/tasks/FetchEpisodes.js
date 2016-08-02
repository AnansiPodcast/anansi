import Q from 'q'
import Task from './task.js'
import ConfigController from '../controller/ConfigController.js'
import EpisodesController from '../controller/EpisodesController.js'
import PodcastHelper from '../helper/PodcastHelper.js'
import Messenger from '../messenger.js'
const Logger = ConfigController.logger()

class FetchEpisodes extends Task {

  constructor(podcast) {
    super()
    this.podcast = podcast
  }

  run() {
    Logger.info(`Fetching new episodes for ${this.podcast.name}`)
    return PodcastHelper.getFeed(this.podcast.url)
    .then(PodcastHelper.processFeed)
    .then((res) => {
      EpisodesController.batch(res.episodes, this.podcast.id)
      Messenger.send('model.changed.Episode', true)
    })
  }

}

module.exports = FetchEpisodes
