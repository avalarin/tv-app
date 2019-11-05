import React from 'react'
import Error from './error'
import errors from '../errors'

export default class GlobalErrorHandler extends React.Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  render() {
    const { error } = this.state
    if (error) {
      return <Error error={error} />
    } else {
      return this.props.children
    }
  }

  componentDidCatch(error) {
    this.setState(error)
  }

  componentDidMount() {
    errors.onError = (error) => {
      this.setState({ error })
    }
  }
}