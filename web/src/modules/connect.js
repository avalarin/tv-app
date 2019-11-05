import { push } from 'connected-react-router'
import queryString from 'query-string'

import ConnectionService from '../services/connection'
import { buildUrl } from '../utils/url'

export const CONNECT_REQUESTED = 'connect/CONNECT_REQUESTED'
export const CONNECTED = 'connect/CONNECTED'
export const FAILED = 'connect/FAILED'

const initialState = {
  isConnecting: false,
  isConnected: false,
  isFailed: false,
  id: null,
  appName: null,
  role: null,
  connectUrl: null,
  connection: null,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONNECT_REQUESTED:
      return {
        ...state,
        isConnecting: true,
        isConnected: false,
        isFailed: false,
        id: null,
        appName: null,
        role: null,
        connectUrl: null,
        connection: null,
        error: null
      }
    case CONNECTED:
      return {
        ...state,
        isConnecting: false,
        isConnected: true,
        id: action.id,
        appName: action.appName,
        connection: action.connection,
        role: action.role,
        connectUrl: action.connectUrl,
      }
    case FAILED:
      return {
        ...state,
        isConnecting: false,
        isConnected: false,
        isFailed: true,
        error: action.error
      }
    default:
      return state
  }
}

export function beginConnecting(config, options) {
  return async dispatch => {
    
    dispatch({
      type: CONNECT_REQUESTED
    })

    const service = new ConnectionService(config.ws)
    
    try {
      const result = await connectAny(service, options)

      const connectUrl = result.role === 'display' ?
        buildUrl(config.site.baseUrl, { role: 'device', display: result.id }) :
        null

      dispatch({ 
        type: CONNECTED, 
        id: result.id, 
        role: result.role, 
        connection: result.connection, 
        connectUrl, 
        appName: result.appName
      })
      dispatch(push({
        search: queryString.stringify({ reconnect: result.reconnectId })
      }))
    } catch(error) {
      dispatch({ type: FAILED, error })
    }
  }
}

function connectAny(service, { role, display, reconnect, appName }) {
  if (reconnect) {
    return service.reconnect(reconnect)
  } else if (role === 'display') {
    return service.connectDisplay(appName)
  } else if (role === 'device') {
    return service.connectDevice(display)
  } else {
    throw new Error('Unknown state')
  }
}
