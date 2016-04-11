app.controller('PlayerController', ['$scope', '$rootScope', '$sce', ($scope, $rootScope, $sce) => {

  $scope.episode = {
    song: '',
    song_type: 'audio/mpeg',
    label: ''
  };

  $scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
  
  $rootScope.$on('episode.play', (ev, episode) => {
    $scope.episode = episode;
    updateSong(episode);
  })

}]);
