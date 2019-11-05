import{ useState, useEffect } from 'react'
import { AppError, ERROR_DEVICE_NOT_REGISTERED, ERROR_DEVICE_NOT_ACTIVE } from 'tv-app-common'

const emptyState = {
  messages: [],
  devices: {}
}

function useConnection(connection, initialState = emptyState) {
  const [ state, setState ] = useState(initialState)

  useEffect(() => {
    connection.onMessage(msg => {
      setState(s => dispatchMessage(connection, msg, s))
    })
  }, [connection])

  return [ state, {
    findDeviceById: id => state.devices[id] || { name: 'Unknown' }
  } ]
}

function dispatchMessage(connection, msg, state) {
  switch (msg.type) {
    case 'device_connected':
      const connectedDevice = state.devices[msg.from] || {}
      if (connectedDevice.isActive) {
        connection.send('exchange', { body: { type: 'activate', name: connectedDevice.name } })
      }
      return { ...state, devices: { ...state.devices, [msg.from]: { ...connectedDevice, isOnline: true } } }
    
    case 'device_disconnected':
        const disconnectedDevice = state.devices[msg.from]
        if (!disconnectedDevice) {
          // device not found
          return state
        }
        return { ...state, devices: { ...state.devices, [msg.from]: { ...disconnectedDevice, isOnline: false } } }
    
    case 'exchange':
      switch (msg.body.type) {
        case 'activate':
          const startingDevice = state.devices[msg.from]
          if (!startingDevice) throw new AppError(ERROR_DEVICE_NOT_REGISTERED, {})
          connection.send('exchange', { body: { type: 'activate', name: msg.body.name } })
          return { ...state, devices: {  ...state.devices, [msg.from]: { ...startingDevice, isActive: true, name: msg.body.name } } }
        
        case 'message':
          const sourceDevice = state.devices[msg.from]
          if (!sourceDevice) throw new AppError(ERROR_DEVICE_NOT_REGISTERED, {})
          if (!sourceDevice.isActive) throw new AppError(ERROR_DEVICE_NOT_ACTIVE, {})
          const newMessage = { 
            text: msg.body.text,
            from: msg.from, 
            timestamp: Date.now()
          }
          return { ...state, messages: [ newMessage, ...state.messages ] }
        
        default:
          return state
      }
    default:
      return state
  }
}

export default useConnection