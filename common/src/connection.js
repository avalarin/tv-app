const WS = typeof WebSocket !== 'undefined' ? WebSocket : require('ws')
const uuidv4 = require('uuid/v4')

module.exports = class Connection {
  constructor(id, socket, options = {}) {
    this.id = id
    this._socket = socket
    this._incoming = new Channel()
    this._isClient = options.isClient
    this._isAlive = true
  
    this.remote = options.remote || { ip: 'unknown' }

    this._listen()

    this.logger = options.logger || {
      info: (...args) => console.log(...args),
      error: (...args) => console.error(...args)
    }
  }

  static connect(url, options = {}) {
    const id = uuidv4()
    const socket = new WS(url)
    const connection = new Connection(id, socket, { isClient: true, ...options })

    return connection._waitOpen() 
  }
  
  send(type, data) {
    const message = { ...data, ok: true, type }

    this.logger.info(`Sending: ${JSON.stringify(message)}`)
    
    return new Promise((resolve, _) => {
      this._socket.send(JSON.stringify(message), {}, () => resolve())
    })
  }

  sendErr(type, error) {
    const errorData = error.constructor.name === 'AppError' ?
      {error: error.code, params: error.params} : {error: 'internal_error', params: {}}

    const message = { ...errorData, ok: false, type }

    this.logger.info(`Sending: ${JSON.stringify(message)}`)

    return new Promise((resolve, _) => {
      this._socket.send(JSON.stringify(message), {}, () => resolve())
    })
  }

  onMessage(handler) {
    return this._incoming.subscribe('message', handler)
  }

  onExchangeMessage(exchangeType, handler) {
    return this.onMessage((msg) => {
      if (msg.type !== 'exchange' || msg.body.type !== exchangeType) return
      handler(msg)
    })
  }

  onClose(handler) {
    return this._incoming.subscribe('close', handler)
  }

  receive(options = {}) {
    const mappedOptions = { timeout: options.timeout }
    if (options.filter) {
      mappedOptions.filter = (item) => item.type == options.filter
    }

    return this._incoming.receiveOne('message', mappedOptions)
  }

  close() {
    this._socket.close()
  }

  _heartbeat() {
    this._isAlive = true
  }

  _listen() {
    this._socket.addEventListener('close', event => {
      this.logger.info(`Connection closed: ${event.code} ${event.reason}`)
      this._incoming.publish('close', { id: this._id })
    })

    this._socket.addEventListener('message', event => {
      const strMessage = event.data
      this.logger.info(`Received: ${strMessage}`)

      const message = JSON.parse(strMessage)
      if (!message.type) {
        this.logger.error('Invalid message:', strMessage)
        return
      }

      this._incoming.publish('message', message)
    })

    if (!this._isClient) {
      setInterval(() => {
        this._socket.ping(() => {})
      }, 2000)
    }
  }

  _waitOpen() {
    return new Promise((resolve, _) => {
      this._socket.addEventListener('open', event => {
        resolve(this)
      })
    })
  }
}

class Channel {
  constructor() {
    this._handlers = {}
  }

  publish(key, item) {
    if (!this._handlers[key]) return
    
    this._handlers[key].forEach(func => {
      func(item || {})
    })
  }

  subscribe(key, handler) {
    if (!this._handlers[key]) {
      this._handlers[key] = []
    }

    const index = this._handlers[key].push(handler) - 1

    return {
      remove: () => {
        delete this._handlers[key][index]
      }
    }
  }

  receiveOne(key, options = {}) {
    return promiseWithTimeout(options.timeout, (resolve, _) => {
      const subscription = this.subscribe(key, item => {
        if (options.filter && !options.filter(item)) {
          return
        }

        subscription.remove()
        resolve(item)
      })
    })
  }
}

function promiseWithTimeout(timeout = 1000, func) {
  return new Promise((resolve, reject) => {
    if (timeout) {
      setTimeout(() => {
        reject('Timeout')
      }, timeout)
    }

    func(resolve, reject)
  })
}