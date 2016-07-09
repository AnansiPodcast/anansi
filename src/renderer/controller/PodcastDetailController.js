const Podcast = remote.require('./browser/model/Podcast.js');
const Episode = remote.require('./browser/model/Episode.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('PodcastDetailController', ['$scope', '$rootScope', '$routeParams', '$location', ($scope, $rootScope, $routeParams, $location) => {

  let paginate = 20
  $scope.podcast = Podcast.find({id: $routeParams.id})
  $scope.episodes = Episode
      .chain()
      .filter({podcast_id: $routeParams.id})
      .sortBy('published_time')
      .reverse()
      .take(20)
      .value();

  const moreEpisodes = function() {
    let newEps = Episode
        .chain()
        .filter({podcast_id: $routeParams.id})
        .sortBy('published_time')
        .reverse()
        .take($scope.episodes.length + paginate)
        .slice($scope.episodes.length)
        .value()
    newEps.forEach(i => $scope.episodes.push(i))
    $scope.$apply()
  }

  $scope.unsubscribe = () => {
    PodcastController.remove($scope.podcast.id)
    $location.path('/recent')
  }

  $scope.play = (episode) => {
    $rootScope.$broadcast('episode.play', episode);
  }

  $('.podcast-detail-list').parents('.pane.content').scroll(() => {
    if($('.podcast-detail-list').height() - 300 <= $(this).scrollTop()) {
      moreEpisodes()
    }
  })

}]);
