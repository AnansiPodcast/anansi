import Electron from 'electron'

const remote = Electron.remote
const ipcRenderer = Electron.ipcRenderer
const uuid = remote.require('uuid')
const app = angular.module('podcast-desktop', ['ngRoute'])
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.filter('no_html', function() {
  return function(input) {
    input = input || '';
    return $('<div>'+input+'</div>').text()
  };
})

alertify.logPosition("top right")

Amplitude.init({
  'dynamic_mode': true,
  'default_album_art': "assets/images/no-cover.png"
})

window.onbeforeunload = (e) => {
  saveState()
}

app.config(['$routeProvider', $routeProvider => {
  $routeProvider.
    when('/search', {
      templateUrl: 'renderer/view/itunes-search.html',
      controller: 'ItunesSearchController'
    }).
    when('/recent', {
      templateUrl: 'renderer/view/recent.html',
      controller: 'RecentController'
    }).
    when('/podcast/:id', {
      templateUrl: 'renderer/view/podcast.html',
      controller: 'PodcastDetailController'
    }).
    when('/welcome', {
      templateUrl: 'renderer/view/welcome.html',
      controller: 'PodcastListController'
    }).
    otherwise({
      redirectTo: '/recent'
    })
}])

// Window actions
$('.titlebar-close').on('click', () => {
  remote.getCurrentWindow().close()
})

$('.titlebar-minimize').on('click', () => {
  remote.getCurrentWindow().minimize()
})

$('.titlebar-fullscreen').on('click', () => {
  remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen())
})

// Events
document.querySelector('#add-subscription').addEventListener('click', () => {
  resetSidebar()
  location.href = '#/search'
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
