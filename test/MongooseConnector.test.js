const { expect } = require('@hapi/code')
const Lab = require('@hapi/lab')
const rewire = require('rewire')
const sinon = require('sinon')
const EventEmitter = require('events').EventEmitter
const MongooseConnector = rewire('../lib/MongooseConnector')
const { FailingMongooseStub, MongooseStub } = require('./helpers')

const { beforeEach, describe, experiment, test } = (exports.lab = Lab.script())

experiment('MongooseConnector', () => {
  let logSpy, pluginStub

  beforeEach(() => {
    pluginStub = {
      log: log => log
    }
    logSpy = sinon.spy(pluginStub, 'log')
  })

  describe('With default options', () => {
    let args, mongooseConnector, mongooseStub

    beforeEach(async () => {
      mongooseStub = new MongooseStub('connected')
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector(
        { promises: 'mpromise' },
        pluginStub
      )
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 2))
      args = logSpy.getCall(0).args
    })

    test('The connector is an instance of EventEmitter', () =>
      expect(mongooseConnector instanceof EventEmitter).to.equal(true))

    test('The connector connection property is an instance of EventEmitter', () =>
      expect(mongooseConnector.connection instanceof EventEmitter).to.equal(
        true
      ))

    test('Logs an info event', () => expect(args[0][0]).to.equal('info'))

    test('Logs the correct message', () =>
      expect(args[1]).to.equal('Connected'))
  })

  describe('With default options and an initial connect error', () => {
    let args, mongooseConnector, mongooseStub

    beforeEach(async () => {
      mongooseStub = new FailingMongooseStub('connected')
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector(
        { promises: 'mpromise' },
        pluginStub
      )
      mongooseConnector.on('error', err => {
        expect(err.message).to.equal('I can only fail')
      })
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 5))

      args = logSpy.getCall(0).args
    })
    test('Logs an error event', () => expect(args[0][0]).to.equal('error'))

    test('Has the correct error log message', () =>
      expect(args[1]).to.contain('I can only fail'))
  })

  describe('With the promises option set to bluebird', () => {
    let mongooseConnector, mongooseStub //eslint-disable-line

    beforeEach(() => {
      mongooseStub = new MongooseStub('connected')
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector(
        { promises: 'bluebird' },
        pluginStub
      )
    })

    test('Mongoose uses bluebird for promises', () =>
      expect(mongooseStub.Promise).to.equal(require('bluebird')))
  })

  describe('With the promises option set to es6', () => {
    let mongooseConnector, mongooseStub //eslint-disable-line

    beforeEach(() => {
      mongooseStub = new MongooseStub('connected')
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector({ promises: 'es6' }, pluginStub)
    })

    test('Mongoose uses global.Promise for promises', () =>
      expect(mongooseStub.Promise).to.equal(global.Promise))
  })

  describe('With promises option set to native', () => {
    let mongooseConnector, mongooseStub //eslint-disable-line

    beforeEach(() => {
      mongooseStub = new MongooseStub('connected')
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector(
        { promises: 'native' },
        pluginStub
      )
    })

    test('Mongoose uses global.Promise for promises', () =>
      expect(mongooseStub.Promise).to.equal(global.Promise))
  })

  describe('With default options and a failed connection', () => {
    let args, mongooseConnector, mongooseStub
    const message = 'test'

    beforeEach(async () => {
      mongooseStub = new MongooseStub('error', { message })
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector(
        { promises: 'mpromise' },
        pluginStub
      )
      mongooseConnector.on('error', err => err)
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 10))

      args = logSpy.getCall(0).args
    })

    test('The connector emits the correct error message', () =>
      mongooseConnector.on('error', err => {
        expect(err.message).to.equal(message)
      }))

    test('Logs an error event', () => expect(args[0][0]).to.equal('error'))

    test('Logs the correct message', () =>
      expect(args[1]).to.equal('Unable to connect to database: test'))
  })

  describe('With default options and a closed connection', () => {
    let args, mongooseConnector, mongooseStub

    beforeEach(async () => {
      mongooseStub = new MongooseStub('close')
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector(
        { promises: 'mpromise' },
        pluginStub
      )
      mongooseConnector.on('error', err => err)
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 10))
      args = logSpy.getCall(0).args
    })

    test('Logs an info event', () => expect(args[0][0]).to.equal('info'))

    test('Logs the correct message', () =>
      expect(args[1]).to.equal('Connection to database closed'))
  })

  describe('With default options and a disconnected connection', () => {
    let args, mongooseConnector, mongooseStub

    beforeEach(async () => {
      mongooseStub = new MongooseStub('disconnected')
      MongooseConnector.__set__('mongoose', mongooseStub)
      mongooseConnector = new MongooseConnector(
        { promises: 'mpromise' },
        pluginStub
      )
      mongooseConnector.on('error', err => err)
      await new Promise((resolve, reject) => setTimeout(() => resolve(), 10))
      args = logSpy.getCall(0).args
    })

    test('Logs a warn event', () => expect(args[0][0]).to.equal('warn'))

    test('Logs the correct message', () =>
      expect(args[1]).to.equal('Connection to database disconnected'))
  })
})
