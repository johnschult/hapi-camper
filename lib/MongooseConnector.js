const mongoose = require('mongoose')
const EventEmitter = require('events').EventEmitter

class MongooseConnector extends EventEmitter {
  constructor (options, plugin) {
    super()

    this.mongoose = mongoose

    switch (options.promises) {
      case 'bluebird':
        this.mongoose.Promise = require('bluebird')
        break
      case 'native':
      case 'es6':
        this.mongoose.Promise = global.Promise
    }

    const { uri, mongooseOptions } = options
    this.connection = mongoose.createConnection(uri, mongooseOptions, err => {
      if (err) {
        plugin.log(
          ['error', 'database', 'mongoose', 'mongodb'],
          `error during initial connect ${err}`
        )
        this.emit('error', err)
      }
    })

    this.connection
      .on('connected', () => {
        plugin.log(['info', 'database', 'mongoose', 'mongodb'], 'Connected')
        this.emit('ready')
      })
      .on('error', err => {
        plugin.log(
          ['error', 'database', 'mongoose', 'mongodb'],
          `Unable to connect to database: ${err.message}`
        )
        this.emit('error', err)
      })
      .on('close', () => {
        plugin.log(
          ['info', 'database', 'mongoose', 'mongodb'],
          'Connection to database closed'
        )
      })
      .on('disconnected', () => {
        plugin.log(
          ['warn', 'database', 'mongoose', 'mongodb'],
          'Connection to database disconnected'
        )
        this.emit('disconnected')
      })
  }
}

module.exports = MongooseConnector
