const Episode = remote.require('./browser/model/Episode.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('PodcastListController', ['$scope', '$rootScope', '$location', ($scope, $rootScope, $location) => {

  $scope.podcasts = Podcast.chain().value();
  $scope.selected = 'recent';
  $scope.total = Episode.chain().value().length;

  if (!$scope.total) {
    $scope.selected = 'welcome';
    $location.path("/welcome");
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
    $scope.podcasts = Podcast.chain().value();
    $scope.total = Episode.chain().value().length;
    $scope.$apply();
  });

}]);
