const PodcastController = remote.require('./browser/controller/PodcastController.js');
const Podcast = remote.require('./browser/model/Podcast.js');

app.controller('ItunesSearchController', ['$scope', '$rootScope', '$timeout', ($scope, $rootScope, $timeout) => {

  var _timeout;
  $scope.podcasts = [];

  $scope.search = (term) => {
    if(_timeout)
      $timeout.cancel(_timeout);
      _timeout = $timeout(() => {
        PodcastController.searchOnItunes(term).then((data) => {
          $scope.podcasts = data.results
          $scope.$apply()
        })
        _timeout = null;
      }, 800);
  }

  $scope.byFeed = () => {
    askForFeed()
  }

  $scope.subscribe = (url) => {
    PodcastController.add(url).then(() => {
      alertify.success("Sucessfully added Podcast");
    })
  }

  $scope.subscribed = (name) => {
    // const existent = Podcast.find({name: name})
    // return (existent) ? true : false
    return false
  }

}]);
