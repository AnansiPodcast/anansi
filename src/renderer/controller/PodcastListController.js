const Episode = remote.require('./browser/model/Episode.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('PodcastListController', ['$scope', '$rootScope', '$location', ($scope, $rootScope, $location) => {

  $scope.podcasts = []
  $scope.selected = 'recent';

  function getPodcasts() {
    Podcast.all().then((data) => {
      $scope.podcasts = data
      $scope.$apply()
    })
  }

  $scope.browsePodcasts = () => {
    $scope.selected = 'browse';
    $location.path("/browse-podcasts");
  }

  $scope.load = (id) => {
    $scope.selected = id;
    $location.path( "/podcast/"+id );
  }

  $scope.loadRecent = () => {
    $scope.selected = 'recent';
    $location.path("/recent");
  }

  window.resetSidebar = () => {
    $scope.selected = '';
    $scope.$apply();
  }

  ipcRenderer.on('podcast.model.changed', () => {
    getPodcasts()
  });

  getPodcasts()

}]);
