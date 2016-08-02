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
    this.pendingCounter = {}
    this.ranCounter = {}
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

  incrementQueue(queue) {
    if(!this.pendingCounter[queue]) {
      this.pendingCounter[queue] = 0
      this.ranCounter[queue] = 0
    }
    this.pendingCounter[queue] = this.pendingCounter[queue] + 1
  }

  incrementRuns(queue) {
    if(this.ranCounter[queue] === 0)
      Messenger.send(`queue.${queue}.started`, true)
    this.ranCounter[queue] = this.ranCounter[queue] + 1
  }

  decrementQueue(queue) {
    this.pendingCounter[queue] = this.pendingCounter[queue] - 1
    if(this.pendingCounter[queue] === 0){
      this.ranCounter[queue] = 0
      Messenger.send(`queue.${queue}.ended`, true)
    }
  }

  start() {
    if(this.tasks.length > 0)
      this.runNext()
  }

  pushTo(queue, task) {
    this.push(task, queue)
  }

  push(task, queue = 'generic') {
    if(!this.valid(task)) return
    this.tasks.push({
      task: task,
      queue: queue
    })
    this.incrementQueue(queue)
    if(!this.running) this.start()
  }

  removeFirst() {
    this.decrementQueue(this.getCurrent().queue)
    this.tasks.splice(0, 1)
  }

  getCurrent() {
    return this.tasks[0]
  }

  runNext() {
    this.running = true
    this.incrementRuns(this.getCurrent().queue)
    this.getCurrent().task.run().then(() => {
      this.getCurrent().task.done()
      this.removeFirst()
      this.setupNext()
    }).catch((e) => {
      this.getCurrent().task.error(e)
    })
  }

  setupNext() {
    if(this.tasks.length === 0)
      this.running = false
    else
      this.runNext()
  }

}

module.exports = new Queue()
