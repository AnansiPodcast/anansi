const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('SearchCastsController', ['$scope', '$rootScope', ($scope, $rootScope) => {

  $scope.casts = [];

  $scope.search = (term) => {
    PodcastController.searchOnItunes(term).then((data) => {
      $scope.casts = data;
      $scope.$apply();
    });
  }

}]);
