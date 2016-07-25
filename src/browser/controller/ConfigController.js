import Config from '../model/Config.js'
import winston from 'winston'

class ConfigController {

  constructor() {
    this.document = this._getDefaultDocument()
    this._logger = false
  }

  _getDefaultValues() {
    return {
      updateChannel: 'stable',
      updateInterval: 60 * 60 * 1000,
      firstFetchTimeout: 5000,
      fetchEpisodeInterval: 60 * 60 * 1000
    }
  }

  _getDefaultDocument() {
    if(Config.size() === 0) Config.push(this._getDefaultValues())
    return Config.chain().first().value()
  }

  get(key) {
    if(typeof this.document[key] === 'undefined') throw new Error(`Invalid Config key ${key}!`)
    return this.document[key]
  }

  set(key, value) {
    let objKey = {}
    objKey[key] = value
    this.document = Config.chain().first().assign(objKey).value()
  }

  logger() {
    let transports = []
      , app
    if(process.env.NODE_ENV === 'development')
      transports.push(new winston.transports.Console())
    else if(process.env.NODE_ENV !== 'test') {
      app = require('electron').app
      transports.push(new winston.transports.File({filename: app.getPath('appData') + '/' + app.getName() + '/log'}))
    }
    if(!this._logger)
      this._logger = new winston.Logger({
        transports: transports
      })
    return this._logger
  }

}

module.exports = new ConfigController()
