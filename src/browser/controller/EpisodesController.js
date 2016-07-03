import Q from 'q'
import Merge from 'merge'
import Episode from '../model/Episode.js'
import ConfigController from './ConfigController.js'
const Logger = ConfigController.logger()

class EpisodesController {

  static batch(items, podcast_id) {
    let selected = []
    const existents = Episode.chain().filter({podcast_id: podcast_id}).value().map(ep => ep.guid)
    items.filter(i => existents.indexOf(i.guid) == -1).forEach((item) => {
      selected.push(Merge(item, {
        podcast_id: podcast_id,
        published_time: new Date(item.published).getTime()
      }))
    })

    if(selected.length == 0) return
    Logger.info(`Adding ${selected.length} new episodes to ${podcast_id}`)
    Episode.push(...selected)
  }

  static saveEpisodeState(state, episode_id) {
    let episode = Episode.find({guid: episode_id})
    episode.state = state
    Episode.remove({ guid: episode_id})
    Episode.push(episode)
  }

}

module.exports = EpisodesController
