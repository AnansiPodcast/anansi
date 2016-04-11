const Podcast = remote.require('./browser/model/Podcast.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('PodcastListController', ['$scope', '$rootScope', '$location', ($scope, $rootScope, $location) => {

  $scope.podcasts = Podcast.chain().value();
  $scope.selected = '';

  $scope.load = (id) => {
    $scope.selected = id;
    $location.path( "/podcast/"+id );
  }

  ipcRenderer.on('ui.helper.addPodcast', (event, arg) => {    
    alertify.prompt("Insert Podcast URL", (val, ev) => {
        ev.preventDefault();
        PodcastController.add(val).then(() => {
          alertify.success("Sucessfully added Podcast");
          $rootScope.$broadcast('podcast-added');
          $scope.podcasts = Podcast.chain().value();
          $scope.$apply();
        })
    })      
  });

}]);
