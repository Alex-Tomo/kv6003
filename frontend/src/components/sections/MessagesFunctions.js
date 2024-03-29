import React from 'react'
import VoiceButton from '../ui_elements/VoiceButton'
import SendButton from '../ui_elements/SendButton'

/**
 * The MessagesFunctions displays the bottom of the messages
 * panel. This displays an input field so the user can type and
 * send a message, this also includes a voice button so the user
 * can speak a message instead.
 *
 * @author - Alex Thompson, W19007452
 */

class MessagesFunctions extends React.Component {
  render() {
    return (
      <div id='message-functionality-container'>
        <div
          id='message-functionality'
          className={this.props.colourTheme}
        >
          <VoiceButton
            isSending={this.props.isSending}
            props={this.props}
            handleVoice={this.props.handleVoice}
            displayVoiceModal={this.props.displayVoiceModal}
            closeModal={this.props.closeModal}
          />
          <input
            id='input-message'
            placeholder='Type your message here...'
            value={this.props.userInput}
            onChange={this.props.handleInput}
            onKeyDown={this.props.handleKeyPress}
            autoComplete='off'
          />
          <SendButton
            isSending={this.props.isSending}
            buttonText='Send'
            handleClick={this.props.handleClick}
          />
        </div>
      </div>
    )
  }
}

export default MessagesFunctions