const winston = require('winston')

function consoleFormat() {
  return winston.format.printf(({ level, message, label, ...rest }) => {
    return `${level.toUpperCase()} [${label}] ${message} ${JSON.stringify(rest)}`
  })
}

function createLogger(options = { label: '' }) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'tv-app-hub' },
    transports: [
      new winston.transports.Console({ format: winston.format.combine(
        winston.format.label({ label: options.label }),
        consoleFormat()
      ) }),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  })
}

module.exports = { createLogger }