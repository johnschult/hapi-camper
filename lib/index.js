const { applyToDefaults } = require('@hapi/hoek')
const MongooseConnector = require('./MongooseConnector')
const pkg = require('../package.json')

const _defaultOptions = {
  uri: 'mongodb://127.0.0.1:27017',
  promises: 'es6',
  mongooseOptions: {}
}

const register = async (server, options) => {
  const connector = new MongooseConnector(
    applyToDefaults(_defaultOptions, options),
    server
  )

  await new Promise((resolve, reject) => {
    connector
      .on('ready', () => {
        server.expose('lib', connector.mongoose)
        server.expose('connection', connector.connection)
        resolve()
      })
      .on('error', err => reject(err))
  })
}

exports.plugin = {
  register,
  pkg
}
