import React from 'react'
import Button from 'react-bootstrap/Button'

import SendWhite from '../../assets/send_white.svg'

/**
 * The SendButton class is used to send the users message
 * to the chat agent for processing. When the user has clicked
 * the send button, it is disabled until a response is received
 * in order to minimize spam or overloading.
 *
 * @author - Alex Thompson, W19007452
 */

class SendButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSending: false
    }
  }

  render() {
    return (
      <Button
        id='send-button'
        disabled={this.props.isSending}
        onClick={(!this.props.isSending) ?
          this.props.handleClick : null}
      >
        <img
          src={SendWhite}
          alt='Send Icon'
        />
      </Button>
    )
  }
}

export default SendButton
