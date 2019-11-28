module.exports = class Router {
  constructor(handlers, connectionsManager, clientsStore) {
    this._handlers = handlers
    this._connectionsManager = connectionsManager
    this._clientsStore = clientsStore
  }

  async manage(socket, remote) {
    const connection = await this._connectionsManager.create(socket, remote)
    this._manage(connection)
  }

  _manage(connection) {
    connection.onMessage(message => {
      this._route(message, connection)
    })
  }

  async _route(message, connection) {
    const handler = this._handlers[message.type]
    if (!handler) {
      connection.logger.error('Unknown message:', message)
      return
    }

    const clientId = await this._connectionsManager.findClientIdByConnectionId(connection.id)
    const client = await this._clientsStore.findById(clientId)

    handler(message, connection, { client })
  }
}