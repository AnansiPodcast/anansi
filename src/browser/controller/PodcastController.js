import Q from 'q'
import HTTP from 'q-io/http'
import Parser from 'node-podcast-parser'
import Validator from 'validator'
import uuid from 'uuid'
import validator from 'validator'
import Podcast from '../model/Podcast.js'
import Episode from '../model/Episode.js'
import EpisodesController from './EpisodesController.js'
import DialogController from './DialogController.js'
import ConfigController from './ConfigController.js'
import Messenger from '../messenger.js'
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
    return this.getFeed(url)
    .then(this.processFeed)
    .then((podcast) => {
      return this.insert(podcast, url)
    })
  }

  static remove(podcast_id) {
    Podcast.remove({ id: podcast_id })
    Episode.remove({ podcast_id: podcast_id })
    Messenger.send('podcast.model.changed', true)
  }

  static getFeed(url) {
    Logger.info(`Getting feed for ${url}`)
    return HTTP.read({
      url: url,
      method: 'GET'
    }).then((response) => {
      return response.toString()
    })
  }

  static searchOnItunes(term) {
    return HTTP.read({
      url: 'https://itunes.apple.com/search?media=podcast&term='+term,
      method: 'GET'
    }).then((data) => {
      return JSON.parse(data.toString())
    })
  }

  static processFeed(response) {
    Logger.info(`Processing feed`)
    const deferred = Q.defer();
    Parser(response, (err, data) => {
      if (err) {
        DialogController.error('Invalid Podcast Feed', "We can't parse this feed as an Podcast feed")
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(data);
      }
    });
    return deferred.promise;
  }

  static insert(pod, url) {

    const id = uuid()
    const existent = Podcast.find({url: url});
    if(existent) return;

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
    if(ConfigController.get('first_fetch_timeout') !== false)
      setTimeout(() => {
        this.fetch()
      }, ConfigController.get('first_fetch_timeout'))
    setInterval(() => {
      this.fetch()
    }, ConfigController.get('fetch_episode_interval'))
  }

  static fetchIndividual(podcasts, counter, window) {
    if(typeof podcasts[counter] === 'undefined') {
      Logger.info('Fetch for new episodes has ben ended')
      Messenger.send('notify.fetch.ended', true)
      return
    }
    const pod = podcasts[counter]
    Logger.info(`Fetching new episodes for ${pod.name}`)
    return this.getFeed(pod.url)
    .then(this.processFeed)
    .then((res) => {
      EpisodesController.batch(res.episodes, pod.id)
      Messenger.send('model.changed.Episode', true);
      counter++
      this.fetchIndividual(podcasts, counter, window)
    })
  }

  static fetch() {
    if(Podcast.chain().size().value() == 0) return
    Logger.info('Fetch for new episodes has ben started')
    Messenger.send('notify.fetch.started', true);
    this.fetchIndividual(Podcast.chain().value(), 0)
  }

}

module.exports = PodcastController
