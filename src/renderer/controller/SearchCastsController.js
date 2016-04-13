const PodcastController = remote.require('./browser/controller/PodcastController.js');

app.controller('SearchCastsController', ['$scope', '$rootScope', ($scope, $rootScope) => {

  console.log("- SearchCastsController");

  $scope.casts = undefined;

  $scope.search = (term) => {
    PodcastController.searchOnItunes(term).then((data) => {
      $scope.casts = PodcastController.itunesParse(data).results;
      $scope.$apply();
    });
  }

}]);
