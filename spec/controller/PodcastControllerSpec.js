import expect from 'expect.js'
import PodcastController from '../../src/browser/controller/PodcastController.js'

describe('PodcastController', () => {

  describe('Search on iTunes', () => {
    it('should search in iTunes for "Podcasteros"', (done) => {
      PodcastController.searchOnItunes('Podcasteros').then((data) => {
        expect(data.results).to.be.an('array')
        expect(data.results[0]).to.be.an('object')
        expect(data.results[0]).to.have.property('feedUrl')
        expect(data.results[0]).to.have.property('collectionName')
        expect(data.results[0]).to.have.property('artworkUrl100')
        done()
      })
    })
  })

})
