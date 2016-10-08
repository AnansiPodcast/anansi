const Podcast = remote.require('./browser/model/Podcast.js')
const {shell} = require('electron').remote

app.controller('EpisodeDetailController', ['$scope', '$rootScope', '$sce', ($scope, $rootScope, $sce) => {

  $scope.episode = false;
  $scope.podcast = false
  $scope.content = '';

  $scope.browser = () => {
    shell.openExternal($scope.episode.guid)
  }

  $rootScope.$on('episode.play', (ev, episode) => {
    $scope.episode = episode;
    $scope.podcast = Podcast.find({id: episode.podcastId})
    var content = episode.description
    $scope.content = $sce.trustAsHtml(content)
  })

  $('#episode-detail-pane .content').delegate('a', 'click', (e) => {
    e.preventDefault()
    shell.openExternal(e.target.href)
    return false
  })

}])
