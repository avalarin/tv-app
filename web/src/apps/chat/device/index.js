import React, { useRef } from 'react'

import useConnection from './hook'

const ChatDevice = ({connection}) => {
  const [ state, funcs ] = useConnection(connection)
  const nameInput = useRef(null)
  const messageInput = useRef(null)

  if (!state.isActive) {
    return <div>
      <h1>Chat</h1>
      <div>Enter your name:</div>
      <input ref={nameInput} />
      <button onClick={() => funcs.updateName(nameInput.current.value)}>Save</button>
    </div>
  }

  return <div>
    <h1>Chat</h1>
    <div>{state.name}</div>
    <button onClick={() => funcs.deactivate()}>Change nickname</button>
    <br/>
    <textarea ref={messageInput}></textarea>
    <button onClick={() => funcs.sendMesssage(messageInput.current.value)}>Send</button>
  </div>
}

export default ChatDevice
