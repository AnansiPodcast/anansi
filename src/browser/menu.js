import Menu from 'menu'
import defaultMenu from 'electron-default-menu'
import Dialogs from 'dialogs'
import Windows from './windows.js'

class AppMenu {

  constructor() {
    this.mainWindow = Windows.mainWindow
    this.setupTemplate()
    this.build()
  }

  setupTemplate() {
    this.template = defaultMenu()
    this.addMenu(1, 'File', [
      {
        label: 'Add Podcast',
        click: (item, focusedWindow) => {
          this.mainWindow.webContents.send('ui.helper.addPodcast', true);
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
