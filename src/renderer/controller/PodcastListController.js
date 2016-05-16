const Episode = remote.require('./browser/model/Episode.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('PodcastListController', ['$scope', '$rootScope', '$location', ($scope, $rootScope, $location) => {

  $scope.podcasts = Podcast.chain().value();
  $scope.selected = 'recent';
  $scope.total = Episode.chain().value().length;

  $scope.load = (id) => {
    $scope.selected = id;
    $location.path( "/podcast/"+id );
  }

  $scope.loadRecent = () => {
    $scope.selected = 'recent';
    $location.path("/recent");
  }

  ipcRenderer.on('podcast.model.changed', () => {
    $scope.podcasts = Podcast.chain().value();
    $scope.total = Episode.chain().value().length;
    $scope.$apply();
  });

}]);
