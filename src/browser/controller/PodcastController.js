import Q from 'q'
import HTTP from 'q-io/http'
import Parser from 'node-podcast-parser'
import Validator from 'validator'
import uuid from 'uuid'
import Podcast from '../model/Podcast.js'
import EpisodesController from './EpisodesController.js'
import Windows from '../windows.js'

class PodcastController {

  static add(url) {
    return this.getFeed(url)
    .then((response) => {
      return response.toString()
    })
    .then(this.processFeed)
    .then((podcast) => {
      return this.insert(podcast, url)
    })
  }

  static getFeed(url) {
    return HTTP.read({
      url: url,
      method: 'GET'
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
    return true
  }

  static fetchIndividual(podcasts, counter, window) {
    if(typeof podcasts[counter] === 'undefined') return
    const pod = podcasts[counter]
    return this.getFeed(pod.url)
    .then((response) => {
      return response.toString()
    })
    .then(this.processFeed)
    .then((res) => {
      res.episodes.map(item => {
        EpisodesController.insert(item, pod.id)
      })
      Windows.mainWindow.webContents.send('model.changed.Episode', true);
      counter++
      setTimeout(() => {
        this.fetchIndividual(podcasts, counter, window)
      }, 5000)
    })
  }

  static fetch() {
    this.fetchIndividual(Podcast.chain().value(), 0)
  }

}

module.exports = PodcastController
