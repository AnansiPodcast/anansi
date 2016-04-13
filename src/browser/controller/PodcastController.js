import Q from 'q'
import HTTP from 'q-io/http'
import Parser from 'node-podcast-parser'
import Validator from 'validator'
import Merge from 'merge'
import uuid from 'uuid'
import Podcast from '../model/Podcast.js'
import Episode from '../model/Episode.js'

class PodcastController {

  static get itunesSearchUrl() { return 'https://itunes.apple.com/search?media=podcast' }

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

  static itunesParse(data) {
    return JSON.parse(data.toString());
  }

  static searchOnItunes(term) {
    return HTTP.read({
      url: `${this.itunesSearchUrl}&term=${term}`,
      method: 'GET'
    });
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
      var published_time = new Date(item.published).getTime();
      Episode.push(Merge(item, {
        podcast_id: id,
        published_time: published_time
      }))
    })
    return true
  }

}

module.exports = PodcastController
