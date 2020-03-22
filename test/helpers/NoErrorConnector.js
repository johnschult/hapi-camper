const EventEmitter = require('events').EventEmitter

class NoErrorConnector extends EventEmitter {
  constructor (options, plugin) {
    super()

    this.connection = 'connection'
    this.mongoose = 'original lib import'

    setTimeout(() => {
      this.emit('ready')
    }, 1)
  }
}

module.exports = NoErrorConnector
