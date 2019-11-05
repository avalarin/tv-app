import React from 'react'

import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import { CardContent } from '@material-ui/core'

import useConnection from './hook'
import useStyles from './style'

const ChatDisplay = ({ connection }) => {
  const [ state, funcs ] = useConnection(connection)
  const classes = useStyles()

  return <Container>
    <div>
      { state.messages.map(m => <Card key={m.timestamp} className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {funcs.findDeviceById(m.from).name}
          </Typography>
          <Typography component="p">
            {m.text}
          </Typography>
        </CardContent>
      </Card>) }
    </div>
  </Container>
}

export default ChatDisplay