const uuidv4 = require('uuid/v4')

const { Connection } = require('tv-app-common')

module.exports = class ConnectionsManager {
  constructor(logger) {
    this._connections = {}
    this._clients2Connections = {}
    this._connections2Clients = {}
    this._logger = logger
  }

  async create(socket, remote) {
    const connectionId = uuidv4()

    const connLogger = this._logger.child({ connection: connectionId });

    const connection = new Connection(connectionId, socket, { logger: connLogger, isClient: false, remote })

    this._connections[connectionId] = connection

    connection.onClose(() => this._onDisconnect(connection.id))

    return connection
  }

  async bindClientToConnection(clientId, connectionId) {
    if (this._clients2Connections[clientId]) {
      throw new Error(`Client ${clientId} already bound`)
    }
    if (this._connections2Clients[connectionId]) {
      throw new Error(`Connection ${connectionId} already bound`)
    }

    const connection = this._connections[connectionId]
    if (!connection) {
      throw new Error(`Connection ${connectionId} not found`)
    }

    this._clients2Connections[clientId] = connection
    this._connections2Clients[connectionId] = clientId
  }

  async findConnectionByClientId(clientId) {
    return await this._clients2Connections[clientId]
  }

  async findClientIdByConnectionId(connectionId) {
    return await this._connections2Clients[connectionId]
  }

  async findConnectionById(id) {
    return this._connections[id]
  }

  _onDisconnect(connectionId) {
    const connection = this._connections[connectionId]

    const clientId = this._connections2Clients[connectionId]

    connection.logger.info(`Client ${clientId} disconnected, because connection ${connectionId} closed`)

    delete this._connections[connectionId]
    if (clientId) {
      delete this._connections2Clients[connectionId]
      delete this._clients2Connections[clientId]
    }
  }
}
