const Podcast = remote.require('./browser/model/Podcast.js');

app.controller('PodcastDetailController', ['$scope', '$rootScope', '$routeParams', ($scope, $rootScope, $routeParams) => {

  $scope.podcast = Podcast.find({id: $routeParams.id})

}]);
