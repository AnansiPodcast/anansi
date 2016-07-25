const PodcastController = remote.require('./browser/controller/PodcastController.js')
const Podcast = remote.require('./browser/model/Podcast.js')

app.controller('ItunesSearchController', ['$scope', '$rootScope', '$timeout', ($scope, $rootScope, $timeout) => {

  let keyTimeout
  $scope.podcasts = []

  $scope.search = (term) => {
    if(keyTimeout)
      $timeout.cancel(keyTimeout)
    keyTimeout = $timeout(() => {
      PodcastController.searchOnItunes(term).then((data) => {
        $scope.podcasts = data.results
        $scope.$apply()
      })
      keyTimeout = null
    }, 800)
  }

  $scope.byFeed = () => {
    PodcastController.addByURL()
  }

  $scope.subscribe = (url) => {
    PodcastController.add(url).then(() => {
      alertify.success('Sucessfully added Podcast')
    })
  }

  $scope.subscribed = (name) => {
    const existent = Podcast.find({name: name})
    return existent ? true : false
  }

}])
