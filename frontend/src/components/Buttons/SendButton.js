import React from "react"
import Button from "react-bootstrap/Button"

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
        disabled={this.props.isSending}
        onClick={!this.props.isSending ? this.props.handleClick : null}
        style={{borderBottomLeftRadius: "0", borderTopLeftRadius: "0"}}
      >
        {!this.props.isSending ? this.props.buttonText : 'Sending'}
      </Button>
    )
  }
}

export default SendButton
