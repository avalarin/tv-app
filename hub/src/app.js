const express = require('express')
const WebSocket = require('ws')
const { createServer } = require('http')

const log = require('./logging')

const ClientsStore = require('./services/clients')
const ConnectionsManager = require('./services/connections')
const Router = require('./services/router')
const RegistrationService = require('./services/registration')
const RegistrationController = require('./controllers/registration')
const ExchangeController = require('./controllers/exchange')

module.exports = class App {
  constructor(config) {
    this._logger = log.createLogger({ label: 'HUB' })
      
    const clientsStore = new ClientsStore()
    const registrationService = new RegistrationService(clientsStore, this._logger)
    
    const connectionsManager = new ConnectionsManager(this._logger)

    const registrationController = new RegistrationController(registrationService, connectionsManager, clientsStore, this._logger)
    const exchangeController = new ExchangeController(connectionsManager, this._logger)
    
    const router = new Router({
      'register': registrationController.onRegister.bind(registrationController),
      'exchange': exchangeController.onExchange.bind(exchangeController)
    }, connectionsManager, clientsStore)

    this._router = router

    const app = express()
    app.use('/', express.static('public'))
    app.get('/config.js', (req, res) => this._handleConfigJs(req, res))
  
    this._config = config
    this._server = createServer(app)
    this._wss = new WebSocket.Server({ server: this._server, path: "/ws" })

    this._wss.on('connection', async (socket) => {
      this._router.manage(socket)
    })
  }

  start() { 
    this._server.listen(this._config.listenPort, this._config.listenHost, () => {
      this._logger.info(`Listening on http://${this._config.listenHost}:${this._config.listenPort}`)
    })
  }

  async stop() {
    return new Promise((resolve, _) => {
      this._logger.info("Stopping server...")
      this._wss.close(() => {
        this._server.close(() => {
          resolve()
        })
      })
    })
  }

  _handleConfigJs(req, res) {
    const config = JSON.stringify(this._config.web)
    const content = `window.__config__ = ${config};`
    res.setHeader('Content-Type', 'application/javascript');
    res.end(content);
  }
}
