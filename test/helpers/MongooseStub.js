const MongooseEmitter = require('./MongooseEmitter')

class MongooseStub {
  constructor (eventToEmit, eventArgs) {
    this.eventToEmit = eventToEmit
    this.eventArgs = eventArgs
    this.promise = null
  }

  createConnection (_uri, _opts, cb) {
    // Provide this non-error callback so Lab can see that we are testing all of the
    // code in the error callback on createConnection
    cb(null, '')
    return new MongooseEmitter(this.eventToEmit, this.eventArgs)
  }
}

module.exports = MongooseStub
