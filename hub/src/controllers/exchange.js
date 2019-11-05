module.exports = class ExchangeController {
  constructor(connectionsManager, logger) {
    this._connectionsManager = connectionsManager
    this._logger = logger
  }

  async onExchange({ body }, _, { client }) {
    if (client.role == 'device') {
      const displayId = client.display.id
      const displayConnection = await this._connectionsManager.findConnectionByClientId(displayId)
      if (!displayConnection) {
        throw new Error(`Cannot find connection for display ${displayId}`)
      }

      displayConnection.send('exchange', { from: client.id, direction: 'device2display', body })
    } else if (client.role == 'display') {
      client.devices.forEach(async deviceId => {
        const deviceConnection = await this._connectionsManager.findConnectionByClientId(deviceId)
        if (!deviceConnection) {
          this._logger.error(`Cannot find connection for device ${deviceId}`)
        }

        deviceConnection.send('exchange', { from: client.id, direction: 'display2device', body })
      })
    } else {
      throw new Error(`Unknown role ${client.role}`)
    }
  }
}