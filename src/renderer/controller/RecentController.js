const Episode = remote.require('./browser/model/Episode.js');
const Podcast = remote.require('./browser/model/Podcast.js');

app.controller('RecentController', ['$scope', '$rootScope', ($scope, $rootScope) => {

  var podcasts = [];

  function getEpisodes() {
    var eps = Episode
      .chain()
      .sortBy('published_time')
      .reverse()
      .take(100)
      .value()
    var _eps = []
    eps.forEach((item) => {
      if(typeof podcasts[item.podcast_id] == 'undefined')
        podcasts[item.podcast_id] = Podcast.find({ id: item.podcast_id })
      item.podcast = podcasts[item.podcast_id]
      _eps.push(item)
    })
    return _eps;
  }

  $scope.episodes = getEpisodes();

  ipcRenderer.on('model.changed.Episode', (event, arg) => {
    $scope.episodes = getEpisodes()
    $scope.$apply()
  })

  ipcRenderer.on('podcast.model.changed', () => {
    $scope.episodes = getEpisodes()
    $scope.$apply()
  })

  $scope.play = (episode) => {
    $rootScope.$broadcast('episode.play', episode);
  }

}]);
