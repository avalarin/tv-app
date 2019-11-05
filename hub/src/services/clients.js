const uuidv4 = require('uuid/v4')
const { clone } = require('../utils')

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

  findDisplayById(id) {
    return this.findById(id, 'display')
  }

  findDeviceById(id) {
    return this.findById(id, 'device')
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
    if (client.id) return Promise.reject("Field 'id' should not be set")

    const cloned = clone(client)
    cloned.id = uuidv4()

    this._clients[cloned.id] = cloned
    this._reconnects[cloned.reconnectId] = cloned

    return this.findById(cloned.id)
  }

  update(client) {
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