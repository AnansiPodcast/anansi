const Episode = remote.require('./browser/model/Episode.js');
const Podcast = remote.require('./browser/model/Podcast.js');

app.controller('RecentController', ['$scope', '$rootScope', ($scope, $rootScope) => {

  var podcasts = [];

  function getEpisodes() {
    Episode.all().then((data) => {
      $scope.episodes = data.sort((a, b) => {
        return b.published_time - a.published_time
      })
      $scope.$apply()
    })
  }

  $scope.episodes = []
  getEpisodes()

  ipcRenderer.on('model.changed.Episode', (event, arg) => {
    getEpisodes()
  })

  ipcRenderer.on('podcast.model.changed', () => {
    getEpisodes()
  })

  $scope.play = (episode) => {
    $rootScope.$broadcast('episode.play', episode);
  }

}]);
