import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import CssBaseline from '@material-ui/core/CssBaseline'
import store, { history } from './store'
import loadConfig from './config'
import App from './containers/app'
import errors from './errors'

import './index.css'

const target = document.querySelector('#root')

errors.init()

render(
  <React.Fragment>
    <CssBaseline />
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App config={loadConfig()}/>
      </ConnectedRouter>
    </Provider>
  </React.Fragment>,
  target
)