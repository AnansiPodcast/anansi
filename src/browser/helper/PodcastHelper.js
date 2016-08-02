import Q from 'q'
import HTTP from 'q-io/http'
import Parser from 'node-podcast-parser'
import ConfigController from '../controller/ConfigController.js'
import DialogController from '../controller/DialogController.js'
const Logger = ConfigController.logger()

class PodcastHelper {

  static getFeed(url) {
    Logger.info(`Getting feed for ${url}`)
    return HTTP.read({
      url: url,
      method: 'GET'
    }).then((response) => {
      return response.toString()
    })
  }

  static processFeed(response) {
    Logger.info('Processing feed')
    const deferred = Q.defer()
    Parser(response, (err, data) => {
      if (err) {
        DialogController.error('Invalid Podcast Feed', "We can't parse this feed as an Podcast feed")
        deferred.reject(new Error(err))
      } else
        deferred.resolve(data)
    })
    return deferred.promise
  }

}

module.exports = PodcastHelper
