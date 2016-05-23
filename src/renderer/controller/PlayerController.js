const Podcast = remote.require('./browser/model/Podcast.js');

app.controller('PlayerController', ['$scope', '$rootScope', '$sce', ($scope, $rootScope, $sce) => {

  $scope.show = false

  $rootScope.$on('episode.play', (ev, episode) => {
    const pod = Podcast.find({id: episode.podcast_id})
    const image = episode.image || pod.image
    $scope.show = true
    Amplitude.playNow({
        "name": episode.title,
        "artist": pod.name,
        "album": "",
        "url": episode.enclosure.url,
        "cover_art_url": image
    })
  })

}]);
