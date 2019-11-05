import React from 'react';
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import Connector from '../connector'
import Chat from '../../apps/chat'

const useStyles = makeStyles({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    margin: '16px'
  }
})

const App = ({config}) => {
  const classes = useStyles()

  return <div className={classes.root}>
    <main className={classes.content}>
      <Connector config={config}>
        <Chat />
      </Connector>
    </main>
  </div>
}

export default connect(
  (state, ownProps) => ({
    config: ownProps.config,
    appName: state.connect.appName
  }),
  () => ({})
)(App)