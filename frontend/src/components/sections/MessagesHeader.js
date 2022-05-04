import React from 'react'
import RobotBlack from '../../assets/robot_black.svg'
import RobotWhite from '../../assets/robot_white.svg'

/**
 * The MessagesHeader displays the top of the messages
 * panel, this indicates if the chat agent is currently
 * online or offline
 *
 * @author - Alex Thompson, W19007452
 */

class MessagesHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      chatbotAgent: 'Getting Status...',
      status: ''
    }
  }

  /**
   * Send a message to the chat agent, if a response is received
   * then set the agent to be online, otherwise set the agent to
   * be offline
   */
  componentDidMount() {
    fetch('http://localhost:5005/webhooks/rest/webhook', {
    // fetch('https://alex-rasa-testing.eu.ngrok.io/webhooks/rest/webhook')
      method: 'POST',
      body: JSON.stringify({
        sender: 'temp',
        message: 'hey'
      })
    })
      .then(() => {
        this.setState({
          chatbotAgent: 'Online',
          status: 'online'
        })
      })
      .catch(() => {
        this.setState({
          chatbotAgent: 'Offline',
          status: 'offline'
        })
      })
  }

  render() {
    let hidden = false
    try {
      hidden = document.getElementById('messages-header')
        .className.includes('is-hidden')
    } catch (e) {}

    return (
      <div
        id='messages-header'
        className={
          (hidden) ?
            `is-hidden ${this.props.colourTheme}` :
            `${this.props.colourTheme}`
        }
      >
        <div className='messages-header-div'>
          <div className='messages-header-banner'>
          <img
            src={(localStorage.getItem('theme') === 'dark') ?
                RobotWhite : RobotBlack}
            alt='Account Circle'
            className={`${localStorage.getItem('theme')}`}
            height='50px'
            width='50px'
          />
          <p id='messages-header-para'>
            NU Virtual Assistant
            <br/>
            <span className={this.state.status}>
              <em className='message-header-em'>
                {this.state.chatbotAgent}
              </em>
            </span>
          </p>
          </div>
          <div
            id='listening'
            className='is-hidden'
          >
            <p><em>* Listening</em></p>
          </div>
        </div>
        <hr />
      </div>
    )
  }
}

export default MessagesHeader