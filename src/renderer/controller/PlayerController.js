const Podcast = remote.require('./browser/model/Podcast.js');
const EpisodesController = remote.require('./browser/controller/EpisodesController.js');

app.controller('PlayerController', ['$scope', '$rootScope', '$sce', ($scope, $rootScope, $sce) => {

  $scope.show = false
  let episodeObj = false

  window.saveState = () => {
    if(!episodeObj) return
    let duration
    if(typeof episodeObj.duration !== 'undefined') {
      duration = episodeObj.duration
    } else {
      duration = parseInt($('#song-duration-minutes').text()) * 60 + parseInt($('#song-duration-seconds').text())
    }
    let state = (duration / 100) * parseInt($('#song-time-slider').val())
    EpisodesController.saveEpisodeState(state, episodeObj.guid)
  }

  $rootScope.$on('episode.play', (ev, episode) => {
    saveState()
    const pod = Podcast.find({id: episode.podcast_id})
    const image = episode.image || pod.image
    episodeObj = episode
    $scope.show = true
    Amplitude.playNow({
        "name": episode.title,
        "artist": pod.name,
        "album": "",
        "url": episode.enclosure.url,
        "cover_art_url": image,
        start_at: episode.state
    })
  })

}]);
