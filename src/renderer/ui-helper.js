const Podcasts = remote.require('./browser/model/Podcast.js');
const PodcastController = remote.require('./browser/controller/PodcastController.js');

alertify.logPosition("top right");

ipcRenderer.on('ui.helper.addPodcast', (event, arg) => {
  
  alertify
  .defaultValue("http://iradex.com.br/iradexpodcast/feed.xml")
  .prompt("Insert Podcast URL", (val, ev) => {
      ev.preventDefault();
      PodcastController.add(val).then(() => {
        alertify.success("Sucessfully added Podcast");
      })
  })
    
});
