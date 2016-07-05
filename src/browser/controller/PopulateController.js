import Q from 'q'
import {dialog} from 'electron'
import parseOpml from 'node-opml-parser'
import fs from 'fs'
import PodcastController from './PodcastController.js'

class PopulateController {

  static openOPML(window) {
    const deferred = Q.defer();
    dialog.showOpenDialog(window, {
      title: 'Import OPML file',
      buttonLabel: 'Import',
      properties: ['openFile'],
      filters: [
        {name: 'OPML', extensions: ['opml']},
      ],
    }, function(files) {
      if(typeof files !== 'undefined') {
        deferred.resolve(files[0])
      } else {
        deferred.reject('No file selected')
      }
    })
    return deferred.promise
  }

  static parseOPML(content) {
    const deferred = Q.defer();
    parseOpml(content, (err, items) => {
      (err) ? deferred.reject(err) : deferred.resolve(items)
    })
    return deferred.promise
  }

  static importOPML(window) {
    PopulateController.openOPML(window)
    .then(file => fs.readFileSync(file, 'utf-8'))
    .then(PopulateController.parseOPML)
    .then(items => {
      return Q.all(items.map(item => {
        return PodcastController.add(item.feedUrl)
      }))
    })
  }

}

module.exports = PopulateController
