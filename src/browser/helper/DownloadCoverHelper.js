const loadElectron = typeof process.versions.electron !== 'undefined'

import Q from 'q'
import fs from 'fs'
import path from 'path'
import request from 'request'
import Puid from 'puid'

let app
  , puid = new Puid()

if(loadElectron) app = require('electron').app
const imagesPath = loadElectron ? `${app.getPath('appData')}/${app.getName()}/images` : 'images'

class DownloadCoverHelper {

  static createDirectory() {
    try {
      fs.mkdirSync(imagesPath, '0777')
    } catch(e) {
      // does nothing
    }
  }

  static download(url) {
    const deferred = Q.defer()
    let id = puid.generate()
      , dest = path.join(imagesPath, `${id}${path.extname(url)}`)
      , readStream = request.get(url)
      , writeStream = fs.createWriteStream(dest)

    writeStream.on('finish', () => {
      deferred.resolve(dest)
    })

    writeStream.on('error', (err) => {
      fs.unlink(dest, deferred.reject)
    })

    readStream.on('error', (err) => {
      fs.unlink(dest, deferred.reject)
    })

    readStream.pipe(writeStream)
    return deferred.promise
  }

}

module.exports = DownloadCoverHelper
