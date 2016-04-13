const Episode = remote.require('./browser/model/Episode.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('PodcastListController', ['$scope', '$rootScope', '$location', ($scope, $rootScope, $location) => {

  $scope.podcasts = Podcast.chain().value();
  $scope.selected = 'recent';
  $scope.total = Episode.chain().value().length;

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

  ipcRenderer.on('ui.helper.addPodcast', (event, arg) => {
    alertify.prompt("Insert Podcast URL", (val, ev) => {
        ev.preventDefault();
        PodcastController.add(val).then(() => {
          alertify.success("Sucessfully added Podcast");
          $rootScope.$broadcast('podcast-added');
          $scope.podcasts = Podcast.chain().value();
          $scope.total = Episode.chain().value().length;
          $scope.$apply();
        })
    })
  });

}]);
