const Podcast = remote.require('./browser/model/Podcast.js')
const Episode = remote.require('./browser/model/Episode.js')
const PodcastController = remote.require('./browser/controller/PodcastController.js')

app.controller('PodcastDetailController', ['$scope', '$rootScope', '$routeParams', '$location', ($scope, $rootScope, $routeParams, $location) => {

  let paginate = 20
  $scope.podcast = Podcast.find({id: $routeParams.id})
  $scope.episodes = Episode
      .chain()
      .filter({podcastId: $routeParams.id})
      .sortBy('publishedTime')
      .reverse()
      .take(20)
      .value()

  const moreEpisodes = function() {
    let newEps = Episode
        .chain()
        .filter({podcastId: $routeParams.id})
        .sortBy('publishedTime')
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
    $rootScope.$broadcast('episode.play', episode)
  }

  $('.podcast-detail-list').parents('.pane.content').scroll((e) => {
    if($(e.target).scrollTop() >= $('.podcast-detail-list').height() - 400)
      moreEpisodes()
  })

}])
