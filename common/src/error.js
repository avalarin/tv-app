const ERROR_DISPLAY_NOT_FOUND = 'display_not_found'
const ERROR_ALREADY_REGISTERED = 'already_registered'
const ERROR_INVALID_RECONNECT_ID = 'invalid_reconnect_id'
const ERROR_CLIENT_STILL_CONNECTED = 'client_still_connected'
const ERROR_APP_NOT_FOUND = 'app_not_found'
const ERROR_INVALID_STARTUP_PARAMETERS = 'invalid_startup_parameters'

const ERROR_DEVICE_NOT_REGISTERED = 'device_not_registered'
const ERROR_DEVICE_NOT_ACTIVE = 'device_not_active'

const messages = {
  [ERROR_DISPLAY_NOT_FOUND]: p => `Display ${p.displayId} not found`,
  [ERROR_ALREADY_REGISTERED]: p => `Connection already has a registered client`,
  [ERROR_INVALID_RECONNECT_ID]: p => `Invalid reconnectId`,
  [ERROR_CLIENT_STILL_CONNECTED]: p => `Client still connected`,
  [ERROR_APP_NOT_FOUND]: p => `Application ${p.appName} doesn't exists`,
  [ERROR_INVALID_STARTUP_PARAMETERS]: p => `Invalid startup parameters`,

  [ERROR_DEVICE_NOT_REGISTERED]: p => `Device not registered`,
  [ERROR_DEVICE_NOT_ACTIVE]: p => `Device not active, it should send 'start' first`
}

function getMessage(code, params) {
  const f = messages[code]
  if (!f) {
    throw new Error(`Unknown error code ${code}`)
  }

  return f(params)
}

class AppError extends Error {
  constructor(code, params) {
    const message = getMessage(code, params)
    super(message)

    this.params = params
    this.code = code
  }
}

module.exports = {
  AppError,
  ERROR_DISPLAY_NOT_FOUND,
  ERROR_ALREADY_REGISTERED,
  ERROR_INVALID_RECONNECT_ID,
  ERROR_CLIENT_STILL_CONNECTED,
  ERROR_APP_NOT_FOUND,
  ERROR_INVALID_STARTUP_PARAMETERS,
  ERROR_DEVICE_NOT_REGISTERED,
  ERROR_DEVICE_NOT_ACTIVE
}