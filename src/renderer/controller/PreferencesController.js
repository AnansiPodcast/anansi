const ConfigController = remote.require('./browser/controller/ConfigController.js')

app.controller('PreferencesController', ['$scope', ($scope) => {
  $scope.config = ConfigController._getDefaultDocument()

  $scope.updateChannel = $scope.config.updateChannel === 'beta'
  $scope.$watch('updateChannel', () => ConfigController.set('updateChannel', $scope.updateChannel ? 'beta' : 'stable'))

}])
