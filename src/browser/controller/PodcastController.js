import Q from 'q'
import HTTP from 'q-io/http'
import Parser from 'node-podcast-parser'
import Validator from 'validator'
import Merge from 'merge'
import uuid from 'uuid'
import Podcast from '../model/Podcast.js'
import Episode from '../model/Episode.js'

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
      Episode.push(Merge(item, {podcast_id: id}))
    })
    return true
  }

}

module.exports = PodcastController
