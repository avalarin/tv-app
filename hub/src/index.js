const App = require('./app')

const app = new App({
  listenPort: process.env.PORT || 8200,
  listenHost: '0.0.0.0',
  web: {

  }
})
app.start()

process.on('SIGINT', function() {
  app.stop().then(() => process.exit())
  setTimeout(() => process.exit(), 2000)
})