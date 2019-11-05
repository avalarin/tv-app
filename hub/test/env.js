const { Connection } = require('tv-app-common')
const App = require('../src/app')
const log = require('../src/logging')

module.exports = class TestEnvironment {
  constructor() {
    this.port = Math.floor(Math.random() * 5000) + 35000
    this._app = new App({
      listenHost: 'localhost',
      listenPort: this.port
    })
    this._connections = []
  }

  start() {
    this._app.start()
  }

  async stop() {
    this._connections.forEach(conn => conn.close())

    await this._app.stop()
  }

  async connect(label) {
    const logger = log.createLogger({ label: label || 'CLIENT' })
    const connection = await Connection.connect(`ws://localhost:${this.port}/ws`, {
      logger: {
        info: (...args) => logger.info(...args),
        error: (...args) => logger.error(...args)
      }
    })

    this._connections.push(connection)

    return connection
  }

  static create() {
    const app = new TestEnvironment()
    app.start()
    return app
  }
}