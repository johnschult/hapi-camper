const MongooseEmitter = require('./MongooseEmitter')
const MongooseStub = require('./MongooseStub')

class FailingMongooseStub extends MongooseStub {
  createConnection (_uri, _opts, cb) {
    setTimeout(() => cb(new Error('I can only fail')), 2)
    return new MongooseEmitter(this.eventToEmit, this.eventArgs)
  }
}

module.exports = FailingMongooseStub
