const { clone } = require('../../utils')

module.exports = class ClientsStore {
  constructor() {
    this._clients = { }
    this._reconnects = { }
  }

  findClientByReconnectId(reconnectId) {
    const client = this._reconnects[reconnectId]
    const cloned = client && clone(client) || null
    return Promise.resolve(cloned)
  }

  findById(id, role) {
    var client = this._clients[id]
    if (client && role && client.role != role) {
      client = null
    }

    const cloned = client && clone(client) || null
    return Promise.resolve(cloned)
  }

  save(client) {
    this._clients[client.id] = client
    this._reconnects[client.reconnectId] = client
    return this.findById(client.id)
  }

  async useReconnectIdAndUpdate(reconnectId, newReconnectId) {
    const client = await this.findClientByReconnectId(reconnectId)
    client.reconnectId = newReconnectId
    return await this._update(client)
  }

  async pushNewDevice(displayId, deviceId) {
    const client = await this.findById(displayId)
    client.devices.push(deviceId)
    return await this._update(client)
  }

  _update(client) {
    if (!client.id) return Promise.reject("Field 'id' is required")

    if (!this._clients[client.id]) return Promise.reject("Cliend not found")

    const cloned = clone(client)
    this._clients[client.id] = cloned
    this._reconnects[client.reconnectId] = cloned

    return this.findById(client.id)
  }

  async deleteById(id) {
    if (!this._clients[id]) return Promise.reject("Cliend not found")

    const client = await this.findById(cloned.id)

    delete this._clients[id]
    delete this._reconnects[client.reconnectId]

    return cloned
  }
}