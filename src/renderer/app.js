import Electron from 'electron'

const remote = Electron.remote
const ipcRenderer = Electron.ipcRenderer
const uuid = remote.require('uuid');
const app = angular.module('podcast-desktop', ['ngRoute']);

alertify.logPosition("top right");

remote.getCurrentWindow().toggleDevTools()

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
      });
  }]);
