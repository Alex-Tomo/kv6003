import React from "react"
import VoiceButton from "../Widgets/VoiceButton"
import SendButton from "../Widgets/SendButton"

class MessagesFunctions extends React.Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <div id="message-functionality-container">
        <hr />
        <div id="message-functionality" className={this.props.colourTheme}>
          <VoiceButton props={this.props} handleVoice={this.props.handleVoice}/>
          <input
            id="input-message"
            style={{width: "100%"}}
            placeholder="Type your message here..."
            value={this.props.userInput}
            onChange={this.props.handleInput}
            onKeyDown={this.props.handleKeyPress}
          />
          <SendButton
            isSending={this.props.isSending}
            buttonText="Send"
            handleClick={this.props.handleClick}
          />
        </div>
      </div>
    )
  }
}

export default MessagesFunctions