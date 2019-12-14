const uuidv4 = require('uuid/v4')

module.exports = class ClientsService {
  constructor(store) {
    this._store = store
  }

  findClientByReconnectId(reconnectId) {
    return this._store.findClientByReconnectId(reconnectId)
  }

  findDisplayById(id) {
    return this._store.findById(id, 'display')
  }

  findDeviceById(id) {
    return this._store.findById(id, 'device')
  }

  findById(id, role) {
    return this._store.findById(id, role)
  }

  async createDisplay(appName, remote) {
    const display = {
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
    }

    await this._store.save(display)

    return display
  }
  
  async createDevice(displayId, appName, remote) {
    const device = {
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
    }

    await this._store.save(display)

    return device
  }

  async useReconnectIdAndUpdate(reconnectId) {
    const newReconnectId = uuidv4()
    return await this._store.useReconnectIdAndUpdate(reconnectId, newReconnectId)
  }

  async pushNewDevice(displayId, deviceId) {
    return await this._store.pushNewDevice(displayId, deviceId)
  }

  async deleteById(id) {
    await this._store.deleteById(id)
  }
}