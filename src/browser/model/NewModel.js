import levelup from 'levelup'
import leveldown from 'leveldown'
import Q from 'q'
import uuid from 'uuid'

const loadElectron = (typeof process.versions['electron'] !== 'undefined')
if(loadElectron) var app = require('electron').app
const dbPath = (loadElectron) ? app.getPath('appData') + '/podcast-desktop/' : ''
let dbs = []

class Model {

  constructor(key) {
    this.db = Model.DB(key)
  }

  static DB(key) {
    if(typeof dbs[key] === 'undefined') {
      console.log('criando db');
      dbs[key] = levelup(dbPath + key, {
        db: leveldown,
        keyEncoding: 'json'
      })
    }
    return dbs[key]
  }

  all(cond) {
    const deferred = Q.defer();
    let dbData = []
    this.db.createReadStream({
      keyEncoding: 'json'
    })
    .on('data', (data) => {
      let pushTo = (typeof cond  === 'string') ? (data.key.indexOf(cond) > -1) : true
      if(pushTo)
        dbData.push(JSON.parse(data.value))
    })
    .on('error', (err) => {
      deferred.reject(new Error(err))
    })
    .on('end', () => {
      deferred.resolve(dbData)
    })
    return deferred.promise
  }

  allWithKey(cond) {
    return this.all(cond)
  }

  save(key, value) {
    const deferred = Q.defer();
    this.db.put(key, JSON.stringify(value), (err) => {
      if (err) deferred.reject(new Error(err))
      deferred.resolve()
    })
    return deferred.promise
  }

  batch(opts) {
    const deferred = Q.defer();
    this.db.batch(opts, function (err) {
      if (err) deferred.reject(new Error(err))
      deferred.resolve()
    })
    return deferred.promise
  }

  get(key) {

    const deferred = Q.defer();
    this.db.get(key, function (err, value) {
      if (err) deferred.reject(new Error(err))
      deferred.resolve(JSON.parse(value))
    })
    return deferred.promise
  }

  generateID() {
    return uuid()
  }

}

module.exports = Model
