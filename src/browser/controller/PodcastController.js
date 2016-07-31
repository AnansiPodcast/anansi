import Q from 'q'
import HTTP from 'q-io/http'
import Validator from 'validator'
import uuid from 'uuid'
import validator from 'validator'
import Podcast from '../model/Podcast.js'
import Episode from '../model/Episode.js'
import EpisodesController from './EpisodesController.js'
import DialogController from './DialogController.js'
import ConfigController from './ConfigController.js'
import PodcastHelper from '../helper/PodcastHelper.js'
import Messenger from '../messenger.js'
import Queue from '../queue.js'
import FetchEpisodes from '../tasks/FetchEpisodes.js'
const Logger = ConfigController.logger()

class PodcastController {

  static addByURL() {
    DialogController.input('Add a new Podcast by URL', 'Subscribe').then((data) => {
      PodcastController.add(data)
    })
  }

  static add(url) {
    if(!validator.isURL(url)) {
      DialogController.error('Invalid Podcast URL', 'You need to provide a valid Podcast Feed URL')
      return
    }
    Logger.info(`Adding a new Podcast with URL ${url}`)
    return PodcastHelper.getFeed(url)
    .then(PodcastHelper.processFeed)
    .then((podcast) => {
      return this.insert(podcast, url)
    })
  }

  static remove(podcastId) {
    Podcast.remove({ id: podcastId })
    Episode.remove({ podcastId: podcastId })
    Messenger.send('podcast.model.changed', true)
  }

  static searchOnItunes(term) {
    return HTTP.read({
      url: `https://itunes.apple.com/search?media=podcast&term=${term}`,
      method: 'GET'
    }).then((data) => {
      return JSON.parse(data.toString())
    })
  }

  static insert(pod, url) {

    const id = uuid()
    const existent = Podcast.find({url: url})
    if(existent) return

    Podcast.push({
      id: id,
      url: url,
      name: pod.title,
      description: pod.description,
      image: pod.image,
      categories: pod.categories
    })

    Logger.info(`${pod.title} added. Adding episodes...`)
    EpisodesController.batch(pod.episodes, id)
    Messenger.send('podcast.model.changed', true)

    return true
  }

  static scheduleFetch() {
    if(ConfigController.get('firstFetchTimeout') !== false)
      setTimeout(() => {
        this.fetch()
      }, ConfigController.get('firstFetchTimeout'))
    setInterval(() => {
      this.fetch()
    }, ConfigController.get('fetchEpisodeInterval'))
  }

  static fetch() {
    if(Podcast.chain().size().value() === 0) return
    Logger.info('Fetch for new episodes has ben started')
    Messenger.send('notify.fetch.started', true)
    Podcast.chain().value().forEach((i) => Queue.push(new FetchEpisodes(i)) )
  }

}

module.exports = PodcastController
