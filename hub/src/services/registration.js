const uuidv4 = require('uuid/v4')
const {AppError, ERROR_DISPLAY_NOT_FOUND, ERROR_INVALID_RECONNECT_ID} = require('tv-app-common')

module.exports = class RegistrationService {
  constructor(store, logger) {
    this._store = store
    this._logger = logger
  }

  async reconnectClient(reconnectId) {
    const client = await this._store.findClientByReconnectId(reconnectId)
    
    if (!client) {
      throw new AppError(ERROR_INVALID_RECONNECT_ID, {})
    }

    return await this._store.update({
      ...client,
      reconnectId: uuidv4() // generate new reconnect id
    })
  }

  async registerDisplay(appName) {
    return await this._store.save({
      role: 'display',
      reconnectId: uuidv4(),
      devices: [],
      appName
    })
  }

  async registerDevice(displayId) {
    const display = await this._store.findDisplayById(displayId)
    if (!display) {
      this._logger.error('Display not found:', displayId)
      throw new AppError(ERROR_DISPLAY_NOT_FOUND, {displayId})
    }

    const device = await this._store.save({
      role: 'device',
      reconnectId: uuidv4(),
      display,
      appName: display.appName
    })

    display.devices.push(device.id)
    await this._store.update(display)

    return device
  }
}