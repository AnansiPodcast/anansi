import Electron from 'electron'
import alertify from 'alertify.js'
window.alertify = alertify

const remote = Electron.remote
const ipcRenderer = Electron.ipcRenderer
const uuid = remote.require('uuid');
const app = angular.module('podcast-desktop', ['ngRoute']);

alertify.logPosition("top right");

remote.getCurrentWindow().toggleDevTools()

app.config(['$routeProvider', $routeProvider => {
    $routeProvider.
      when('/podcast/:id', {
        templateUrl: 'renderer/view/podcast.html',
        controller: 'PodcastDetailController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
