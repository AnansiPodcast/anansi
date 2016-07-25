import Q from 'q'
import {dialog} from 'electron'
import parseOpml from 'node-opml-parser'
import opmlGenerator from 'opml-generator'
import fs from 'fs'
import merge from 'merge'
import PodcastController from './PodcastController.js'
import Podcast from '../model/Podcast.js'
import Windows from '../windows.js'

class PopulateController {

  static dialogHandler(options, parameters) {
    const deferred = Q.defer()
    dialog[parameters.method](Windows.mainWindow, merge(options, parameters.defaults), function(files) {
      if(typeof files !== 'undefined') deferred.resolve(files)
    })
    return deferred.promise
  }

  static openFile(options) {
    return PopulateController.dialogHandler(options, {
      method: 'showOpenDialog',
      defaults: { properties: ['openFile'] }
    }).then(i => i[0])
  }

  static saveFile(options) {
    return PopulateController.dialogHandler(options, {
      method: 'showSaveDialog',
      defaults: { buttonLabel: 'Save', }
    })
  }

  static parseOPML(content) {
    const deferred = Q.defer()
    parseOpml(content, (err, items) => {
      err ? deferred.reject(err) : deferred.resolve(items)
    })
    return deferred.promise
  }

  static buildOPML() {
    let outline = []
    Podcast.chain().value().forEach(pod => {
      outline.push({
        title: pod.name,
        text: pod.description.short,
        type: 'rss',
        xmlUrl: pod.url
      })
    })
    return opmlGenerator({
      title: 'Anansi Podcast Subscriptions',
      dateCreated: new Date()
    }, outline)
  }

  static importOPML() {
    PopulateController.openFile({
      title: 'Import OPML file',
      buttonLabel: 'Import',
      filters: [
        {name: 'OPML', extensions: ['opml']},
      ]
    })
    .then(file => fs.readFileSync(file, 'utf-8'))
    .then(PopulateController.parseOPML)
    .then(items => {
      return Q.all(items.map(item => {
        return PodcastController.add(item.feedUrl)
      }))
    })
  }

  static exportOPML() {
    PopulateController.saveFile({
      filters: [
        {name: 'OPML', extensions: ['opml']},
      ]
    })
    .then(file => {
      const content = PopulateController.buildOPML()
      return fs.writeFileSync(file, content, 'utf-8')
    })
  }

}

module.exports = PopulateController
