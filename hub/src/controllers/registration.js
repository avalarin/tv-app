const { AppError, ERROR_ALREADY_REGISTERED, ERROR_CLIENT_STILL_CONNECTED } = require('tv-app-common')

module.exports = class RegistrationController {
  constructor(registrationService, connectionsManager, clientsStore, logger) {
    this._logger = logger
    this._registrationService = registrationService
    this._connectionsManager = connectionsManager
    this._clientsStore = clientsStore
  }

  async onRegister(data, connection) {
    try {
      if (await this._connectionsManager.findClientIdByConnectionId(connection.id)) {
        throw new AppError(ERROR_ALREADY_REGISTERED, {})
      }

      const client = await this._register(data, connection)

      this._connectionsManager.bindClientToConnection(client.id, connection.id)

      const registerResult = {
        id: client.id,
        role: client.role,
        appName: client.appName,
        reconnectId: client.reconnectId
      }

      if (client.role == 'display' && client.devices.length > 0) {
        registerResult.devices = client.devices.map(id => ({ id }))
      }

      connection.send('register', registerResult)
    } catch (err) {
      connection.logger.error('Cannot register new client', err)
      connection.sendErr('register', err)
    }
  }

  async _register({role, appName, displayId, reconnectId}, connection) {
    if (reconnectId) {
      const client = await this._clientsStore.findClientByReconnectId(reconnectId)
      if (client && await this._connectionsManager.findConnectionByClientId(client.id)) {
        throw new AppError(ERROR_CLIENT_STILL_CONNECTED, {})
      }

      if (client.role == 'device') {
        await this._notifyDisplay(client, connection)
      } else if (client.role == 'display') {
        await this._notifyDevices(client, connection)
      }

      return await this._registrationService.reconnectClient(reconnectId)
    }

    switch (role) {
      case 'display':
        const display = await this._registrationService.registerDisplay(appName)
        await this._notifyDevices(display, connection)
        return display
      
      case 'device':
        const device = await this._registrationService.registerDevice(displayId)
        await this._notifyDisplay(device, connection)
        return device
     
      default:
        connection.logger.error('Unknown role:', role)
        throw new Error(`Unknown role ${role}`)
    }
  }

  async _notifyDevices(display, connection) {
    // TODO move to events
    // TODO check if device not connected
    display.devices.forEach(async id => {
      const deviceConnection = await this._connectionsManager.findConnectionByClientId(id)
      deviceConnection.send('display_connected', { from: display.id })
    })

    connection.onClose(async () => {
      const actualDisplay = await this._clientsStore.findDisplayById(display.id)
      if (!actualDisplay) {
        this._logger.info(`Display ${display.id} has been disconnected, notifying his devices...`)
        this._logger.error(`Display ${display.id} not found, can't notify his devices about disconnection`)
        return
      }
      this._logger.info(`Display ${display.id} has been disconnected, notifying his devices: ${JSON.stringify(actualDisplay.devices)}`)
      actualDisplay.devices.forEach(async id => {
        const deviceConnection = await this._connectionsManager.findConnectionByClientId(id)
        deviceConnection.send('display_disconnected', { from: display.id })
      })
    })
  }

  async _notifyDisplay(device, connection) {
    // TODO move to events
    // TODO check if display not connected
    const displayConnection = await this._connectionsManager.findConnectionByClientId(device.display.id)
    displayConnection.send('device_connected', { from: device.id })

    connection.onClose(() => {
      this._logger.info(`Device ${device.id} has been disconnected, notifying his display...`)
      displayConnection.send('device_disconnected', { from: device.id })
    })
  }
}
