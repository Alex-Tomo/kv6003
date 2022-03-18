import React from "react"
import Button from "react-bootstrap/Button"

// Icons
import SendBlack from "../../assets/send_black.svg"
import SendWhite from "../../assets/send_white.svg"
import MicrophoneBlack from "../../assets/mic_black.svg";

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
        id="send-button"
        disabled={this.props.isSending}
        onClick={!this.props.isSending ? this.props.handleClick : null}
        style={{borderBottomLeftRadius: "0", borderTopLeftRadius: "0"}}
      >
        <img src={SendWhite} alt="Send Icon" />
      </Button>
    )
  }
}

export default SendButton
