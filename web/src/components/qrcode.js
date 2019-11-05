/** @jsx jsx */

import React from 'react'
import { css, jsx } from '@emotion/core'
import qrcode from 'qrcode'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

const styles = {
  box: css`
    float: right;
    text-align: center;
  `,
  canvas: css`
    display: block;
  `
}

class QrCode extends React.Component {
  render() {
    const url = this.props.url
    return <Card css={styles.box}>
      <CardContent>
        <Typography variant="h4">Scan to join</Typography>
        <canvas css={styles.canvas} ref="canvas" />
        <a css={styles.reference} href={url} target="_blank" rel="noopener noreferrer">
          <Typography color="textSecondary" gutterBottom>Click to connect manually</Typography>
        </a>
      </CardContent>
    </Card>
  }

  componentDidMount() {
    this._renderCanvas()
  }

  _renderCanvas() {
    const url = this.props.url
    qrcode.toCanvas(this.refs.canvas, url, {
      scale: 6,
      margin: 1,
      color: {
        light: '#fff',
        dark: '#000'
      }
    }, function (error) {
      console.error(error)
    })
  }
}


export default QrCode