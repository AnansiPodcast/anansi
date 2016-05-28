import expect from 'expect.js'
import ConfigController from '../../src/browser/controller/ConfigController.js'
import Config from '../../src/browser/model/Config.js'

describe('ConfigController', () => {

  describe('Default values', () => {

    it('should have only one record', () => {
      expect(Config.size()).to.be(1)
    })

    it('should return default values', () => {
      expect(ConfigController.get('fetch_episode_interval')).to.be(3600000)
    })

  })

  describe('Get and set values', () => {

    it('Set a new config key', () => {
      ConfigController.set('foo', 'baar')
    })

    it('Get a new config key', () => {
      expect(ConfigController.get('foo')).to.be('baar')
    })

  })

})
