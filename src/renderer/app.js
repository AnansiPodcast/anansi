import Electron from 'electron'

const remote = Electron.remote
const ipcRenderer = Electron.ipcRenderer
const uuid = remote.require('uuid')
const app = angular.module('podcast-desktop', ['ngRoute'])
const PodcastController = remote.require('./browser/controller/PodcastController.js');

alertify.logPosition("top right")

app.config(['$routeProvider', $routeProvider => {
  $routeProvider.
   when('/recent', {
      templateUrl: 'renderer/view/recent.html',
      controller: 'RecentController'
    }).
    when('/podcast/:id', {
      templateUrl: 'renderer/view/podcast.html',
      controller: 'PodcastDetailController'
    }).
    otherwise({
      redirectTo: '/recent'
    })
}])

// Add a new podcast
ipcRenderer.on('ui.helper.addPodcast', (event, arg) => {
  alertify.prompt("Insert Podcast URL", (val, ev) => {
    ev.preventDefault();
    PodcastController.add(val).then(() => {
      alertify.success("Sucessfully added Podcast");
    })
  })
});

// Events
document.querySelector('#add-subscription').addEventListener('click', () => {
  remote.getCurrentWindow().webContents.send('ui.helper.addPodcast', true)
})

document.querySelector('#refresh').addEventListener('click', () => {
  PodcastController.fetch()
})

// Notifications
ipcRenderer.on('notify.fetch.started', () => {
  alertify.success("Searching for new episodes");
})

ipcRenderer.on('notify.fetch.ended', () => {
  alertify.success("Episodes up to date");
})

