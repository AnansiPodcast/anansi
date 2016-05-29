import Model from './NewModel.js'
const StaticDB = new Model('podcast')

class Podcast extends Model {

  constructor() {
    super('podcast')
  }

  set(key, value) {
    this[key] = value
  }

  save() {
    const id = (typeof this.id === 'undefined') ? new Buffer(this.url).toString('base64') : this.id
    this.id = id
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

  static get(key) {
    return StaticDB.get(key)
  }

}

module.exports = Podcast
