import Model from './NewModel.js'
const StaticDB = new Model('episode')

class Episode extends Model {

  constructor() {
    super('episode')
  }

  set(key, value) {
    this[key] = value
  }

  static batch(items, podcast_id) {
    let processed = []
    items.forEach((item) => {
      item.published_time = new Date(item.published).getTime()
      item.id = new Buffer(item.guid).toString('base64') + '~' + podcast_id
      processed.push({
        type: 'put',
        key: item.id,
        value: JSON.stringify(item)
      })
    })
    return StaticDB.batch(processed)
  }

  save() {
    const id = (typeof this.id === 'undefined') ? super.generateID() : this.id
    return super.save(id, {
      id: id,
      url: this.url,
      name: this.name,
      description: this.description,
      image: this.image,
      categories: this.categories
    })
  }

  static all() {
    return StaticDB.all()
  }

  static byPodcast(id) {
    return StaticDB.allWithKey(id)
  }

}

module.exports = Episode
