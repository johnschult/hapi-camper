const EventEmitter = require('events').EventEmitter

class ErrorConnector extends EventEmitter {
  constructor (options, plugin) {
    super()

    this.connection = 'connection'
    this.mongoose = 'original lib import'

    setTimeout(() => {
      this.emit('error', new Error('fail for testing'))
    }, 1)
  }
}

module.exports = ErrorConnector
