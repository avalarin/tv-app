import{ useState, useEffect, useCallback } from 'react'

const emptyState = {
  name: undefined,
  isActive: false,
  displayIsOnline: true
}

function useConnection(connection, initialState = emptyState) {
  const [ state, setState ] = useState(initialState)

  useEffect(() => {
    connection.onMessage(msg => {
      setState(s => dispatchMessage(msg, s))
    })
  }, [connection])

  const updateName = useCallback((name) => {
    const body = { type: 'activate', name: name }
    connection.send('exchange', { body })
  }, [connection])

  const sendMesssage = useCallback((message) => {
    const body = { type: 'message', text: message }
    connection.send('exchange', { body })
  }, [connection])

  const deactivate = useCallback(() => {
    setState(s => ({ ...s, isActive: false }))
  }, [])

  return [ state, {
    updateName, sendMesssage, deactivate
  } ]
}

function dispatchMessage(msg, state) {
  switch (msg.type) {
    case 'exchange':
      switch (msg.body.type) {
        case 'activate':
          return { ...state, isActive: true, name: msg.body.name }
        default:
          return state
      }
    default:
      return state
  }
}

export default useConnection