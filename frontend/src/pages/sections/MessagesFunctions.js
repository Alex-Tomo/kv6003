import React from "react"
import VoiceButton from "../../components/Buttons/VoiceButton";
import SendButton from "../../components/Buttons/SendButton";

class MessagesFunctions extends React.Component {
  render() {
    return (
      <div id="message-functionality" className={this.props.colourTheme}>
        <VoiceButton handleVoice={this.props.handleVoice}/>
        <input
          style={{width: "100%"}}
          placeholder="Type your message here..."
          value={this.props.userInput}
          onChange={this.props.handleInput}
          onKeyDown={this.props.handleKeyPress}
        />
        <SendButton isSending={this.props.isSending} buttonText="Send" handleClick={this.props.handleClick}/>
      </div>
    )
  }
}

export default MessagesFunctions