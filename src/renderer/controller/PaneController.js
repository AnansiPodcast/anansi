app.controller('PaneController', ['$scope', '$rootScope', ($scope, $rootScope) => {

  $scope.episodeOpen = false

  ipcRenderer.on('toogleEpisodeDetail', (e, result) => {
    $scope.episodeOpen = result
    $scope.$apply()
  })

}])
