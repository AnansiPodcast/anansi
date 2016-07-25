import {Menu} from 'electron'
import defaultMenu from 'electron-default-menu'
import Dialogs from 'dialogs'
import Windows from './windows.js'
import PopulateController from './controller/PopulateController.js'
import PodcastController from './controller/PodcastController.js'

class AppMenu {

  constructor() {
    this.mainWindow = Windows.mainWindow
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
        this.mainWindow.webContents.send('ui.menu.preferences', true)
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
          PopulateController.importOPML(this.mainWindow)
        }
      },
      {
        label: 'Export Subscriptions to OPML',
        click: (item, focusedWindow) => {
          PopulateController.exportOPML(this.mainWindow)
        }
      }
    ])
  }

  addMenu(position, name, items) {
    this.template.splice(position, 0, {
      label: 'File',
      submenu: items
    })
  }

  build() {
    Menu.setApplicationMenu(Menu.buildFromTemplate(this.template))
  }

}

module.exports = AppMenu
