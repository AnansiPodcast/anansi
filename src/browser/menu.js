import {Menu} from 'electron'
import defaultMenu from 'electron-default-menu'
import Dialogs from 'dialogs'
import Windows from './windows.js'
import Messenger from './messenger.js'
import PopulateController from './controller/PopulateController.js'
import PodcastController from './controller/PodcastController.js'
import NavigateController from './controller/NavigateController.js'

class AppMenu {

  constructor() {
    this.paneOpened = false
    this.draw()
  }

  draw() {
    this.setupTemplate()
    this.build()
  }

  setupTemplate() {
    this.template = defaultMenu()

    // Adding the Preferences menu item
    this.template[0].submenu.splice(2, 0, {
      label: 'Preferences',
      accelerator: 'Cmd+,',
      click: (menuItem, focusedWindow) => {
        NavigateController.to('/preferences')
      }
    }, {type: 'separator'})

    this.addMenu(1, 'File', [
      {
        label: 'Add Podcast by URL',
        click: (item, focusedWindow) => {
          PodcastController.addByURL()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Import OPML',
        click: (item, focusedWindow) => {
          PopulateController.importOPML()
        }
      },
      {
        label: 'Export Subscriptions to OPML',
        click: (item, focusedWindow) => {
          PopulateController.exportOPML()
        }
      }
    ])

    this.pushToMenu(3, {
      label: this.paneOpened ? 'Hide Episode Details' : 'Show Episode Details',
      click: (item, focusedWindow) => {
        this.paneOpened = this.paneOpened ? false : true
        Messenger.send('toogleEpisodeDetail', this.paneOpened)
        this.draw()
      }
    })

  }

  pushToMenu(position, item) {
    this.template[position].submenu.push(item)
  }

  addMenu(position, name, items) {
    this.template.splice(position, 0, {
      label: name,
      submenu: items
    })
  }

  build() {
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.template))
  }

}

module.exports = AppMenu
