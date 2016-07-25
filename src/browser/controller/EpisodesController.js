import Q from 'q'
import Merge from 'merge'
import Episode from '../model/Episode.js'
import ConfigController from './ConfigController.js'
const Logger = ConfigController.logger()

class EpisodesController {

  static batch(items, podcastId) {
    let selected = []
    const existents = Episode.chain().filter({podcastId: podcastId}).value().map(ep => ep.guid)

    items.filter(i => existents.indexOf(i.guid) === -1).forEach((item) => {
      selected.push(Merge(item, {
        podcastId: podcastId,
        publishedTime: new Date(item.published).getTime()
      }))
    })

    if(selected.length === 0) return
    Logger.info(`Adding ${selected.length} new episodes to ${podcastId}`)
    Episode.push(...selected)
  }

  static saveEpisodeState(state, episodeId) {
    let episode = Episode.find({guid: episodeId})

    episode.state = state
    Episode.remove({ guid: episodeId})
    Episode.push(episode)
  }

}

module.exports = EpisodesController
