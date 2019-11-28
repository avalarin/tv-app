const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Type

const Client = mongoose.model('client', { 
  id: ObjectId,
  role: String,
  reconnectId: String,
  appName: String,
  display: String,
  devices: [String]
})

module.exports = Client