import React from 'react'

/**
 * option buttons displayed by the bot
 *
 * @author Alex Thompson, W19007452
 */

class MessageButton extends React.Component {
  render() {
    return (
      <div>
        <button
          className='button message-buttons'
          id='buttons'
          onClick={this.props.sendMessage}
        >
          <span>
            {this.props.title}
          </span>
        </button>
        <br/>
      </div>
    )
  }
}

export default MessageButton


