import React from 'react';
import { connect } from 'react-redux'

import { selectStartupInfo } from '../modules/startup'
import { beginConnecting } from '../modules/connect'

import Error from '../components/error'
import Loading from '../components/loading'

class Connector extends React.Component {
  render() {
    const {isFailed, error, isConnecting, isConnected, children} = this.props

    if (isFailed) {
      return <Error error={error} />
    } else if (isConnecting) {
      return <Loading />
    } else if (isConnected) {
      return children
    } else {
      return <Loading />
    }
  }

  componentDidMount() {
    const {connect, config, role, display, reconnect, appName} = this.props
    connect(config, { role, display, reconnect, appName})
  }
}

export default connect(
  (state, props) => {
    const startup = selectStartupInfo(state)
    return {
      isConnecting: state.connect.isConnecting,
      isConnected: state.connect.isConnected,
      isFailed: state.connect.isFailed,
      error: state.connect.error,
      role: startup.role,
      display: startup.display,
      appName: startup.app,
      reconnect: startup.reconnect,
      config: props.config,
      children: props.children
    }
  },
  (dispatch) => ({
    connect: (config, options) => dispatch(beginConnecting(config, options))
  })
)(Connector)