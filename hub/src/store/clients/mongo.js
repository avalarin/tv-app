const Client = require('./model')

module.exports = class ClientsStore {
  constructor() {
  }

  findClientByReconnectId(reconnectId) {
    return Client.findOne({ reconnectId }).exec()
  }

  findById(id, role) {
    return Client.findOne({ id, role }).exec()
  }

  async save(client) {
    const device = new Client(client)

    await device.save()

    return device
  }

  async useReconnectIdAndUpdate(reconnectId, newReconnectId) {
    return await Client.findOneAndUpdate(
      { reconnectId },
      { reconnectId: newReconnectId },
      { useFindAndModify: true, new: true }
    )
  }

  async pushNewDevice(displayId, deviceId) {
    return await Client.findOneAndUpdate(
      { id: displayId, role: 'display' },
      { $push: { devices: deviceId } },
      { useFindAndModify: true, new: true }
    )
  }

  async deleteById(id) {
    await Client.deleteOne({ id })
  }
}