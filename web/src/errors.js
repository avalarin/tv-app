const errors = [ ]
const handlers = [ ]

export default {
  init: () => {
    window.onerror = (msg, url, line, pos, error) => {
      console.error('Unhandled error occurred', error, handlers)
      errors.push(error)
      handlers.forEach(handler => handler(error))
      return true
    }
  },
  onError: (handler) => {
    errors.forEach(err => handler(err))
    handler.push(handler)
  }
}