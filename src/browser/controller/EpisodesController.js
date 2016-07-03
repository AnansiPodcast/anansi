import Q from 'q'
import Merge from 'merge'
import Episode from '../model/Episode.js'

class EpisodesController {

  static insert(item, podcast_id) {

    const existent = Episode.find({guid: item.guid})
    if(existent) return false

    let published_time = new Date(item.published).getTime()
    Episode.push(Merge(item, {
      podcast_id: podcast_id,
      published_time: published_time,
      state: 0
    }))

    return true

  }

  static saveEpisodeState(state, episode_id) {
    let episode = Episode.find({guid: episode_id})
    episode.state = state
    Episode.remove({ guid: episode_id})
    Episode.push(episode)
  }

}

module.exports = EpisodesController
