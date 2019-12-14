const InMemory = require('./inmemory')
const Mongo = require('./mongo') 

module.exports = {
  create: (config) => {
    if (config.mongodb && config.mongodb.enable) {
      return new Mongo()
    } else {
      return new InMemory()
    }
  }
}