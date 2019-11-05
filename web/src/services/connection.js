import { Connection, AppError } from 'tv-app-common'

export default class ConnectionService {
  constructor(wsConfig) {
    this.wsConfig = wsConfig
  }

  connectDevice(displayId) {
    return this._connect({ role: 'device', displayId })
  }

  connectDisplay(appName) {
    return this._connect({ role: 'display', appName })
  }

  reconnect(reconnectId) {
    return this._connect({ reconnectId })
  }

  async _connect(registerData) {
    const connection = await Connection.connect(this.wsConfig.url)
    
    setTimeout(() => connection.send('register', registerData), 100)

    try {
      const message = await connection.receive({ filter: 'register' })

      if (!message.ok) {
        console.info('Application registration failed, server respond', message.error)
        throw new AppError(message.error, message.params)
      }

      console.info(`Application registered with id ${message.id} and role ${message.role}`)
      
      return { 
        connection, 
        id: message.id, 
        reconnectId: message.reconnectId, 
        role: message.role,
        appName: message.appName,
        devices: message.devices
      }
    } catch (err) {
      console.info('Application registration failed', err)
      throw err
    }
  }
}
