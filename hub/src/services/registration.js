const uuidv4 = require('uuid/v4')
const {AppError, ERROR_DISPLAY_NOT_FOUND, ERROR_INVALID_RECONNECT_ID} = require('tv-app-common')

module.exports = class RegistrationService {
  constructor(store, logger) {
    this._store = store
    this._logger = logger
  }

  async reconnectClient(reconnectId) {
    const client = await this._store.useReconnectIdAndUpdate(reconnectId)
    
    if (!client) {
      throw new AppError(ERROR_INVALID_RECONNECT_ID, {})
    }

    return client
  }

  async registerDisplay(appName, remote) {
    return await await this._store.createDisplay(appName, remote)
  }

  async registerDevice(displayId, remote) {
    const display = await this._store.findDisplayById(displayId)
    if (!display) {
      this._logger.error('Display not found:', displayId)
      throw new AppError(ERROR_DISPLAY_NOT_FOUND, {displayId})
    }

    const device = await this._store.createDevice(display.id, display.appName, remote)

    display.devices.push(device.id)
    await this._store.pushNewDevice(displayId, device.id)

    return device
  }
}