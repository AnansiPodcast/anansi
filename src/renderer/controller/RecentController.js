const Episode = remote.require('./browser/model/Episode.js')
const Podcast = remote.require('./browser/model/Podcast.js')

app.controller('RecentController', ['$scope', '$rootScope', ($scope, $rootScope) => {

  let podcasts = []
  , getEpisodes

  getEpisodes = function() {
    let handleEps = []
      , eps = Episode
      .chain()
      .sortBy('publishedTime')
      .reverse()
      .take(100)
      .value()
    eps.forEach((item) => {
      if(typeof podcasts[item.podcastId] === 'undefined')
        podcasts[item.podcastId] = Podcast.find({ id: item.podcastId })
      item.podcast = podcasts[item.podcastId]
      handleEps.push(item)
    })
    return handleEps
  }

  $scope.episodes = getEpisodes()

  ipcRenderer.on('model.changed.Episode', (event, arg) => {
    $scope.episodes = getEpisodes()
    $scope.$apply()
  })

  ipcRenderer.on('podcast.model.changed', () => {
    $scope.episodes = getEpisodes()
    $scope.$apply()
  })

  $scope.play = (episode) => {
    $rootScope.$broadcast('episode.play', episode)
  }

}])
