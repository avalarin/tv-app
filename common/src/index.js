const Connection = require('./connection')
const error = require('./error')

module.exports = { 
  Connection,
  ...error
}