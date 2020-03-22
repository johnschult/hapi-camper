const Hapi = require('@hapi/hapi')
const Lab = require('@hapi/lab')
const { expect, fail } = require('@hapi/code')
const rewire = require('rewire')
const pkg = require('../package.json')

const { beforeEach, experiment, test } = (exports.lab = Lab.script())
const { ErrorConnector, NoErrorConnector } = require('./helpers')

experiment('Default Options', () => {
  let server, plugin
  const options = {}

  beforeEach(async () => {
    plugin = rewire('../')
    plugin.__set__('MongooseConnector', NoErrorConnector)
    server = new Hapi.Server({ debug: false })
    await server.register({ plugin, options })
  })

  test('Sets up the Mongoose connection', () =>
    expect(server.plugins[pkg.name].connection).to.equal('connection'))

  test('Sets up a reference to the originally imported Mongoose library', () =>
    expect(server.plugins[pkg.name].lib).to.equal('original lib import'))

  test('Handles failures properly', async () => {
    plugin.__set__('MongooseConnector', ErrorConnector)

    try {
      await new Hapi.Server({ debug: false }).register({ plugin, options })
      fail('This should not occur')
    } catch (err) {
      expect(err).to.be.error(Error, 'fail for testing')
    }
  })
})
