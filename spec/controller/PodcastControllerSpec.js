import expect from 'expect.js'
import PodcastController from '../../src/browser/controller/PodcastController.js'
import ConfigController from '../../src/browser/controller/ConfigController.js'
import Podcast from '../../src/browser/model/Podcast.js'
import Episode from '../../src/browser/model/Episode.js'
import Messenger from '../../src/browser/messenger.js'

let feed_iradex = 'http://iradex.com.br/podcast/setereinos/feed.xml'
let feed_podcasteros = 'http://feeds.feedburner.com/soundcloud/TWhV'

describe('PodcastController', () => {

  describe('Add a Podcast', () => {

    it('should add a Podcast by Feed URL', (done) => {
      expect(Podcast.chain().value()).to.have.length(0)
      PodcastController.add(feed_iradex).then(() => {
        expect(Podcast.chain().value()).to.have.length(1)
        done()
      }).catch(done)
    })

    it('should not add the same Podcast twice', (done) => {
      PodcastController.add(feed_iradex).then(() => {
        expect(Podcast.chain().value()).to.have.length(1)
        done()
      }).catch(done)
    })

    it('should add a Podcast with the required properties', () => {
      let pods = Podcast.chain().value()
      expect(pods).to.have.length(1)
      expect(pods[0]).to.be.an('object')
      expect(pods[0]).to.have.property('id')
      expect(pods[0]).to.have.property('url')
      expect(pods[0]).to.have.property('description')
      expect(pods[0]).to.have.property('image')
    })

    it('should add Episodes with the Podcast', () => {
      let pod = Podcast.chain().value()[0]
      let episodes = Episode.chain().filter({podcast_id: pod.id}).value()
      expect(episodes).to.be.an('array')
    })

    it('should trigger the `podcast.model.changed` event', (done) => {
      Messenger.listen('podcast.model.changed', (result) => {
        expect(result).to.be.ok();
        done()
      })
      PodcastController.add(feed_podcasteros).then(() => {
        expect(Podcast.chain().value()).to.have.length(2)
      }).catch(done)
    })

    it('should not trigger the `podcast.model.changed` event for the same podcast', (done) => {
      Messenger.listen('podcast.model.changed', (result) => {
        throw new Error('Event triggered twice!')
      })
      PodcastController.add(feed_podcasteros).then(() => {
        expect(Podcast.chain().value()).to.have.length(2)
        done()
      }).catch(done)
    })

  })

  describe('Fetch new episodes', () => {

    it('should trigger the `notify.fetch.started` and `notify.fetch.ended` events', (done) => {
      Messenger.listen('notify.fetch.started', (result) => {
        expect(result).to.be.ok();
      })
      Messenger.listen('notify.fetch.ended', (result) => {
        expect(result).to.be.ok();
        Messenger.clearCallbacks(['notify.fetch.started', 'notify.fetch.ended'])
        done()
      })
      PodcastController.fetch()
    }).timeout(20000)

    it('should fetch for new episodes after 5 seconds', (done) => {
      const started_time = new Date().getTime()
      PodcastController.scheduleFetch()
      Messenger.listen('notify.fetch.started', (result) => {
        const finished_time = new Date().getTime()
        expect(finished_time - started_time).to.be.greaterThan(5000)
        expect(finished_time - started_time).to.be.lessThan(5050)
      })
      Messenger.listen('notify.fetch.ended', () => {
        Messenger.clearCallbacks(['notify.fetch.started', 'notify.fetch.ended'])
        done()
      })
    }).timeout(20000)

    it('should trigger fetch for new episodes every 10 seconds', (done) => {
      ConfigController.set('first_fetch_timeout', false)
      ConfigController.set('fetch_episode_interval', 1000)
      let counter = 0
      let started_time = new Date().getTime()
      Messenger.listen('notify.fetch.started', (result) => {
        let finished_time = new Date().getTime()
        expect(finished_time - started_time).to.be.greaterThan(1000)
        expect(finished_time - started_time).to.be.lessThan(1050)
        counter++
        started_time = finished_time
        if(counter == 3) {
          Messenger.clearCallbacks(['notify.fetch.started', 'notify.fetch.ended'])
          done()
        }
      })
      PodcastController.scheduleFetch()
    }).timeout(60000)

  })

  describe('Search on iTunes', () => {

    it('should search in iTunes for "Podcasteros"', (done) => {
      PodcastController.searchOnItunes('Podcasteros').then((data) => {
        expect(data.results).to.be.an('array')
        expect(data.results[0]).to.be.an('object')
        expect(data.results[0]).to.have.property('feedUrl')
        expect(data.results[0]).to.have.property('collectionName')
        expect(data.results[0]).to.have.property('artworkUrl100')
        done()
      }).catch(done)
    })

  })

  describe('Getting Feed from URL', () => {

    it('should retrieve the Feed content by URL', (done) => {
      PodcastController.getFeed(feed_iradex).then((feed) => {
        expect(feed).to.be.an('string')
        PodcastController.processFeed(feed).then((processed) => {
          expect(processed).to.be.an('object')
          expect(processed).to.have.property('title')
          expect(processed).to.have.property('description')
          expect(processed).to.have.property('image')
          expect(processed).to.have.property('categories')
          expect(processed.episodes).to.be.an('array')
          done();
        }).catch(done)
      }).catch(done)
    })

  })

})
