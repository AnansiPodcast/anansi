const Episode = remote.require('./browser/model/Episode.js');
const Podcast = remote.require('./browser/model/Podcast.js');

app.controller('RecentController', ['$scope', '$rootScope', ($scope, $rootScope) => {

  var podcasts = [];

  function getEpisodes() {
    var eps = Episode
      .chain()
      .sortBy('published_time')
      .value()
      .reverse();
    var _eps = [];    
    eps.forEach((item) => {
      if(typeof podcasts[item.podcast_id] == 'undefined')
        podcasts[item.podcast_id] = Podcast.find({ id: item.podcast_id });
      item.podcast = podcasts[item.podcast_id]
      _eps.push(item);
    })
    return _eps;
  }

  $scope.episodes = getEpisodes();

  $scope.play = (episode) => {
    $rootScope.$broadcast('episode.play', episode);
  }

  $rootScope.$on('podcast-added', () => {
    $scope.episodes = getEpisodes();
  })

}]);
