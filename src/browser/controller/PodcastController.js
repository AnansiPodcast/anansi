import Q from 'q'
import HTTP from 'q-io/http'
import Parser from 'node-podcast-parser'
import Validator from 'validator'
import uuid from 'uuid'
import Podcast from '../model/Podcast.js'
import Episode from '../model/Episode.js'
import EpisodesController from './EpisodesController.js'
import ConfigController from './ConfigController.js'
import Messenger from '../messenger.js'

class PodcastController {

  static add(url) {
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
    const deferred = Q.defer();
    Parser(response, (err, data) => {
      if (err) {
        deferred.reject(new Error(err));
      } else {
        deferred.resolve(data);
      }
    });
    return deferred.promise;
  }

  static insert(pod, url) {

    let p = new Podcast()
    p.url = url
    p.name = pod.title
    p.description = pod.description,
    p.image = pod.image,
    p.categories = pod.categories

    return p.save()
    .then(() => {
      Messenger.send('podcast.model.changed', true)
    })
    .then(() => {
      return Episode.batch(pod.episodes, p.id)
    })
    .then(() => {
      Messenger.send('model.changed.Episode')
    })
    .catch((err) => {
      console.log(err);
    })

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
      Messenger.send('notify.fetch.ended', true)
      return
    }
    const pod = podcasts[counter]
    return this.getFeed(pod.url)
    .then(this.processFeed)
    .then((res) => {
      return Episode.batch(res.episodes, pod.id)
    }).then(() => {
      Messenger.send('model.changed.Episode', true);
      counter++
      setTimeout(() => {
        this.fetchIndividual(podcasts, counter, window)
      }, 5000)
    })
  }

  static fetch() {
    Messenger.send('notify.fetch.started', true);
    Podcast.all().then((podcasts) => {
      this.fetchIndividual(podcasts, 0)
    })
  }

}

module.exports = PodcastController
