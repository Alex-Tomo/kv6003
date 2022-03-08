import React from "react"
import Button from "react-bootstrap/Button"

class MyButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isSending: false
    }
  }

  render() {
    return (
      <Button
        variant="primary"
        disabled={this.props.isSending}
        onClick={!this.props.isSending ? this.props.handleClick : null}
      >
        {!this.props.isSending ? this.props.buttonText : 'Sending'}
      </Button>
    )
  }
}

export default MyButton
