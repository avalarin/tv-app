import React from 'react'
import { connect } from 'react-redux'

import QrCode from '../../components/qrcode'
import ChatDisplay from './display'
import ChatDevice from './device'


class Chat extends React.Component {
  render() {
    const { role, connection, connectUrl } = this.props
    if (role === 'display') {
      return <div>
        <QrCode url={connectUrl}/>
        <ChatDisplay connection={connection}/>
      </div>
    } else if (role === 'device') {
      return <ChatDevice connection={connection}/>
    }
  }
}

export default connect(
  (state) => ({
    role: state.connect.role,
    connection: state.connect.connection,
    connectUrl: state.connect.connectUrl
  }), 
  null
)(Chat)