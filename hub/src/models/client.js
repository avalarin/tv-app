const mongoose = require('mongoose')

var ClientSchema = new mongoose.Schema({
  id: String,
  role: String,
  reconnectId: String,
  appName: String,
  display: String,
  devices: [String],
  status: {
    createdAt: Date,
    lastHeartbeatAt: Date
  },
  remote: {
    ip: String
  }
})

const Client = mongoose.model('client', ClientSchema)

module.exports = Client