const Podcast = remote.require('./browser/model/Podcast.js');
const Episode = remote.require('./browser/model/Episode.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('PodcastDetailController', ['$scope', '$rootScope', '$routeParams', '$location', ($scope, $rootScope, $routeParams, $location) => {

  $scope.podcast = {}
  $scope.episodes = []
  Podcast.get($routeParams.id).then((pod) => {
    $scope.podcast = pod
    $scope.$apply()
  }).catch((err) => {
    console.log('err' + err);
  })

  Episode.byPodcast($routeParams.id).then((data) => {
    console.log('data');
    $scope.episodes = data.sort((a, b) => {
    return b.published_time - a.published_time
    })
    $scope.$apply()
  }).catch((err) => {
    console.log('err' + err);
  })

  $scope.unsubscribe = () => {
    PodcastController.remove($scope.podcast.id)
    $location.path('/recent')
  }

  $scope.play = (episode) => {
    $rootScope.$broadcast('episode.play', episode);
  }

}]);
