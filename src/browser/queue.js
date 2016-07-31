import Messenger from './messenger.js'
let instance = null

class Queue {

  constructor() {
    if(!instance){
      instance = this // eslint-disable-line consistent-this
      this.setup()
    }
    return instance
  }

  setup() {
    this.tasks = []
    this.running = false
  }

  valid(task) {
    if(
      typeof task.run !== 'function' ||
      typeof task.error !== 'function' ||
      typeof task.done !== 'function'
    ) throw new Error('Task has an invalid object signature, methods required')
    return true
  }

  start() {
    if(this.tasks.length > 0) {
      Messenger.send('queue.started', true)
      this.runNext()
    }
  }

  push(task) {
    if(this.valid(task)) this.tasks.push(task)
    if(this.valid(task) && !this.running) this.start()
  }

  removeFirst() {
    this.tasks.splice(0, 1)
  }

  getCurrent() {
    return this.tasks[0]
  }

  runNext() {
    this.running = true
    this.getCurrent().run().then((a) => {
      this.getCurrent().done()
      this.removeFirst()
      this.setupNext()
    }).catch((e) => {
      this.getCurrent().error(e)
    })
  }

  setupNext() {
    if(this.tasks.length === 0) {
      this.running = false
      Messenger.send('queue.ended', true)
    } else
      this.runNext()
  }

}

module.exports = new Queue()
