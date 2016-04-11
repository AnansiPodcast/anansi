const Podcast = remote.require('./browser/model/Podcast.js');
const Episode = remote.require('./browser/model/Episode.js');

app.controller('PodcastDetailController', ['$scope', '$rootScope', '$routeParams', ($scope, $rootScope, $routeParams) => {

  $scope.podcast = Podcast.find({id: $routeParams.id})
  $scope.episodes = Episode
      .chain()
      .filter({podcast_id: $routeParams.id})
      .value();

  $scope.play = (episode) => {
    $rootScope.$broadcast('episode.play', episode);
  }

}]);
