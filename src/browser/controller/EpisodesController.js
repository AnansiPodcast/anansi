import Q from 'q'
import Merge from 'merge'
import Episode from '../model/Episode.js'

class EpisodesController {

  static batch(items, podcast_id) {
    Episode.batch(items, podcast_id)
  }

  static insert(item, podcast_id) {

    const existent = Episode.find({guid: item.guid})
    if(existent) return false

    var published_time = new Date(item.published).getTime()
    Episode.push(Merge(item, {
      podcast_id: podcast_id,
      published_time: published_time
    }))

    return true

  }

}

module.exports = EpisodesController
