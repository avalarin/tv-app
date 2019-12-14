const App = require('./app')

const app = new App({
  listenPort: process.env.PORT || 8200,
  listenHost: '0.0.0.0',
  web: {

  },
  mongodb: {
    enable: true,
    url: 'mongodb://localhost/tv-app'
  }
})

app.start().catch(e => {
  console.error('Cannot start application', e)
  process.exit(-1)
})

process.on('SIGINT', function() {
  app.stop().then(() => process.exit())
  setTimeout(() => process.exit(), 2000)
})