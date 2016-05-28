import Config from '../model/Config.js'

class ConfigController {

  constructor() {
    this.document = this._getDefaultDocument()
  }

  _getDefaultValues() {
    return {
      default_value: true,
      first_fetch_timeout: 5000,
      fetch_episode_interval: 60 * 60 * 1000
    }
  }

  _getDefaultDocument() {
    if(Config.size() == 0) Config.push(this._getDefaultValues())
    return Config.chain().first().value()
  }

  get(key) {
    if(typeof this.document[key] === 'undefined') throw new Error('Invalid Config key!')
    return this.document[key]
  }

  set(key, value) {
    let objKey = {}
    objKey[key] = value
    this.document = Config.chain().first().assign(objKey).value()
  }

}

module.exports = new ConfigController()
