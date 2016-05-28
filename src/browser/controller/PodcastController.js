import Q from 'q'
import HTTP from 'q-io/http'
import Parser from 'node-podcast-parser'
import Validator from 'validator'
import uuid from 'uuid'
import Podcast from '../model/Podcast.js'
import Episode from '../model/Episode.js'
import EpisodesController from './EpisodesController.js'
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

    pod.episodes.forEach((item) => {
      EpisodesController.insert(item, id)
    })

    Messenger.send('podcast.model.changed', true)

    return true
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
      res.episodes.map(item => {
        EpisodesController.insert(item, pod.id)
      })
      Messenger.send('model.changed.Episode', true);
      counter++
      setTimeout(() => {
        this.fetchIndividual(podcasts, counter, window)
      }, 5000)
    })
  }

  static fetch() {
    Messenger.send('notify.fetch.started', true);
    this.fetchIndividual(Podcast.chain().value(), 0)
  }

}

module.exports = PodcastController
