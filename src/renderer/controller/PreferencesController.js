const ConfigController = remote.require('./browser/controller/ConfigController.js')

app.controller('PreferencesController', ['$scope', ($scope) => {
  $scope.config = ConfigController._getDefaultDocument()

  $scope.updateChannel = $scope.config.updateChannel === 'beta'
  $scope.fetchEpisodeInterval = $scope.config.fetchEpisodeInterval / 60 / 1000

  $scope.$watch('updateChannel', () => ConfigController.set('updateChannel', $scope.updateChannel ? 'beta' : 'stable'))
  $scope.$watch('fetchEpisodeInterval', () => {
    ConfigController.set('fetchEpisodeInterval', $scope.fetchEpisodeInterval * 60 * 1000)
  })

}])
