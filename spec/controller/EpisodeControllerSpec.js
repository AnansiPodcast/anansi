import expect from 'expect.js'
import EpisodesController from '../../src/browser/controller/EpisodesController.js'
import Episode from '../../src/browser/model/Episode.js'

const sampleEpisode = {
  "title": "Sete Reinos 27: Game of Thrones - Temporada 6 Episódio 5",
  "published": "2016-05-26T02:17:24.000Z",
  "categories": [
    "Sete Reinos"
  ],
  "guid": "http://ripa.podbean.com/e/sete-reinos-27-game-of-thrones-temporada-6-episodio-5/",
  "enclosure": {
    "filesize": 114185207,
    "type": "audio/mpeg",
    "url": "http://ripa.podbean.com/mf/feed/brhivj/sete-reinos-27.mp3"
  },
  "description": "Povo Westerosi! Chegamos na metade da temporada com um dos episódios mais impactantes já lançados na série. Aqui você saberá o que temos a dizer sobre o reencontro da Sansa com Mindinho, a despedida entre Jorah e Daenerys, a Assembléia dos Homens de Ferro, a revelação sobre a origem dos White Walkers e... e o final que destruiu a todos nós. Sua opinião é fundamental, então comenta aqui no post e também compartilha com os amigos que ainda não conhecem o Sete Reinos!\nNo final rola a nossa conversa com spoilers sobre coisas que esperamos ver no decorrer dos episódios de GOT.\nSpoilers até o 5º episódio da 6ª Temporada da série.",
  "duration": 9463,
  "image": "http://ripa.podbean.com/mf/web/3uzav6/sete-reinos-27-itunes.jpg"
}

describe('EpisodesController', () => {

  describe('Add an Episode', () => {

    it('should add an episode', () => {
      EpisodesController.batch([sampleEpisode], '6224270c-fb10-4249-93f9-77c3a404b9f6')
      expect(Episode.chain().value()).to.have.length(1)
    })

    it('should not add the same episode twice', () => {
      EpisodesController.batch([sampleEpisode], '6224270c-fb10-4249-93f9-77c3a404b9f6')
      expect(Episode.chain().value()).to.have.length(1)
    })

  })

})
