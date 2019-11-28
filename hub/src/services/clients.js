const uuidv4 = require('uuid/v4')
const Client = require('../models/client')

module.exports = class ClientsStore {
  constructor() {
  }

  findClientByReconnectId(reconnectId) {
    return Client.findOne({ reconnectId }).exec()
  }

  findDisplayById(id) {
    return Client.findOne({ id, role: 'display' }).exec()
  }

  findDeviceById(id) {
    return Client.findOne({ id, role: 'device' }).exec()
  }

  findById(id, role) {
    return Client.findOne({ id, role }).exec()
  }

  async createDisplay(appName, remote) {
    const display = new Client({
      id: uuidv4(),
      role: 'display',
      reconnectId: uuidv4(),
      devices: [],
      appName,
      status: {
        createdAt: Date.now(),
        lastHeartbeatAt: Date.now()
      },
      remote
    })

    await display.save()

    return display
  }
  
  async createDevice(displayId, appName, remote) {
    const device = new Client({
      id: uuidv4(),
      role: 'device',
      reconnectId: uuidv4(),
      display: displayId,
      appName,
      status: {
        createdAt: Date.now(),
        lastHeartbeatAt: Date.now()
      },
      remote
    })

    await device.save()

    return device
  }

  async useReconnectIdAndUpdate(reconnectId) {
    const newReconnectId = uuidv4()
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