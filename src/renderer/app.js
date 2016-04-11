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
      // when('/add', {
      //   templateUrl: 'renderer/view/add.html',
      //   controller: 'AddSerieController'
      // }).
      // when('/subtitles/:serieId', {
      //   templateUrl: 'renderer/view/subtitles.html',
      //   controller: 'SubtitleListController'
      // }).
      otherwise({
        redirectTo: '/'
      });
  }]);
