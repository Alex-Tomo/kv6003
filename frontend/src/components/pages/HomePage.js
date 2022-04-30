import React from "react"

import NavBar from "../sections/NavBar"
import Messages from "../sections/Messages"
import MessagesFunctions from "../sections/MessagesFunctions"
import SignupModal from "../modals/SignupModal"
import LoginModal from "../modals/LoginModal"
import MessagesHeader from "../sections/MessagesHeader"
import SettingsModal from "../modals/SettingsModal"
import AccountCircleBlack from "../../assets/account_circle_black.svg"
import AccountCircleWhite from "../../assets/account_circle_white.svg"
import RobotBlack from "../../assets/robot_black.svg"
import RobotWhite from "../../assets/robot_white.svg"
import MoreBlack from "../../assets/more_black.svg"
import Admin from "../sections/Admin"
import VoiceModal from "../modals/VoiceModal"
import Map from "../ui_elements/Map"
import MessageButton from "../ui_elements/MessageButton"

/**
 * The Home page will be displayed is the main page
 * this is where the user can converse with the chat agent,
 * log in, sign up and admins will be able to access admin
 * features.
 *
 * @author - Alex Thompson, W19007452
 */

class HomePage extends React.Component {
  USER = 0
  BOT = 1

  constructor(props) {
    super(props)

    this.state = {
      userInput: "",
      responses: [],
      isSending: false,
      modal: <></>,
      loggedIn: false,
      accessToken: "",
      user_id: null,
      user_type: (localStorage.getItem("user_type") === null) ?
        "" : localStorage.getItem("user_type"),
      initialMessageSend: false,
      displayAdmin: false,
      voiceText: "",
      saveMessages: false
    }

    if (localStorage.getItem("theme") === null) {
      localStorage.setItem("theme", "dark")
    }

    this.handleUserInputMessage = this.handleUserInputMessage.bind(this)
    this.handleClickSendButton = this.handleClickSendButton.bind(this)
    this.handleVoice = this.handleVoice.bind(this)
  }

  /**
   * Check if the user is logged in, if so load the users
   * messages. Otherwise, send an initial message to the bot
   * to start the conversation.
   */
  componentDidMount() {
    if (
      localStorage.getItem("token") &&
      localStorage.getItem("id") &&
      localStorage.getItem("user_type")
    ) {
      this.handleLogin(
        localStorage.getItem("token"),
        localStorage.getItem("id"),
        localStorage.getItem("user_type")
      )
      .then(() => {
        this.getMessages()
      }).catch(e => {
        console.log(e)
      })
    } else {
      // if the user is not logged in and not messages have been
      // sent then send an initial message
      if (this.state.responses.length === 0) {
        this.sendInitialMessage()
      }
    }
  }

  /**
   * when a new message is sent, scroll down to the latest message
   *
   * @param prevProps
   * @param prevState
   * @param snapshot
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const messages = document.getElementById('messages')

    try {
      if (messages.lastElementChild != null)
        messages.lastElementChild.scrollIntoView()
    } catch (error) {}
  }

  /**
   * Update the userinput state when the user types in the
   * message input box
   *
   * @param event
   */
  handleUserInputMessage = (event) => {
    this.setState({userInput: event.target.value})
  }

  /**
   * Send the message to the bot when the user hits the enter
   * key as long as a message is not currently being processed
   *
   * @param event
   */
  handleEnterKeyPressed = (event) => {
    if ((event.key === 'Enter') && (!this.state.isSending)) {
      this.handleClickSendButton()
    }
  }

  /**
   * Send the message the bot as long as the userinput is not
   * a blank message
   */
  handleClickSendButton = () => {
    if (this.state.userInput.trim() === "") {
      return
    }
    this.setState({isSending: true})
    this.sendMessageToBot(this.state.userInput)
  }

  /**
   * Send an initial message to the bot to start the conversation
   */
  sendInitialMessage = () => {
    // set issending to true so the user cannot send another message
    // while the current sent message is being processed
    this.setState({isSending: true})

    fetch("http://localhost:5005/webhooks/rest/webhook", {
      // fetch("https://alex-rasa-testing.eu.ngrok.io/webhooks/rest/webhook", {
      method: 'POST',
      body: JSON.stringify({
        sender: "",
        message: "hey"
      })
    })
      .then(r => {
        return r.json()
      })
      .then(d => {
        this.getMessageFromBot(d)
      })
      .then(() => {
        this.setState({
          isSending: false,
          saveMessages: true
        })

        if (localStorage.getItem("sound") === 'true') {
          this.speak()
        }
      })
      .catch(error => {
        console.log("Error: " + error)
      })
  }

  /**
   * Recieve the message from the bot and structure the data
   * to be displayed correctly
   *
   * @param d - the incoming message
   */
  getMessageFromBot = (d) => {
    let botText = []
    let tempArray = this.state.responses
    let newMap = false

    let buttons = []

    if (d.length > 0) {
      for (let i = 0; i < d.length; i++) {
        if (d[i].text !== undefined) {
          botText.push({
            "text": d[i].text,
            "image": undefined,
            "buttons": [],
            "link": undefined
          })
        }

        try {
          if (d[i].custom.link !== undefined) {
            botText[botText.length-1].link = d[i].custom.link
          }
        } catch (e) {}

        try {
          if (d[i].custom.my_location !== undefined) {
            botText[botText.length-1].my_location = true
            botText[botText.length-1].coordinates = d[i].custom.map
            newMap = true
          }
        } catch (e) {}

        try {
          if (d[i].custom.map !== undefined) {
            botText[botText.length-1].coordinates = d[i].custom.map
            newMap = true
          }
        } catch (e) {}

        try {
          if (d[i].image !== undefined) {
            botText.push({
              "text": undefined,
              "image": d[i].image,
              "buttons": [],
              "link": undefined
            })
          }
        } catch (error) {}

        try {
          if (d[i].buttons.length > 0) {
            for (let j = 0; j < d[i].buttons.length; j++) {
              buttons.push(d[i].buttons[j].title)
            }
            botText.push({
              "text": undefined,
              "image": d[i].image,
              "buttons": buttons,
              "link": undefined
            })
          }
        } catch (error) {}

      }

      // only display 1 google map at a time
      if (newMap) {
        for (let i = 0; i < tempArray.length; i++) {
          if (tempArray[i].message[0].coordinates !== undefined) {
            tempArray[i].message[0].coordinates = undefined
            tempArray[i].message[0].my_location = undefined
          }
        }
      }

      tempArray.push({
        sender: this.BOT,
        message: botText,
        date: new Date().toString()
      })
    }

    if (this.state.loggedIn && this.state.saveMessages) {
      this.addMessageToDatabase(localStorage.getItem("id"), 'received', botText)
    }

    this.setState({
      responses: tempArray
    })
  }

  /**
   * only run if the user is logged in. Gets the users messages
   * from the database. Checks if the message was sent or received,
   * and assigns the messages to the correct user
   */
  getMessages = () => {
    let formData = new FormData()
    formData.append('id', this.state.user_id)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/messages', {
      method: 'POST',
      body: formData
    }).then(r => {
      return r.json()
    }).then(d => {
      let botText = []
      let tempArray = []
      let type = undefined

      if (d.length > 0) {
        for (let i = 0; i < d.length; i++) {
          console.log(d[i])

          if (d[i].type === 'received') {
            if (type === undefined) {
              type = 'received'
            }
            if (type === 'sent') {
              tempArray.push({
                sender: this.USER,
                message: botText
              })
              botText = []
              type = 'received'
            }

            if (d[i].message !== undefined) {
              if (d[i].link !== 'null') {
                botText.push({
                  "text": d[i].message,
                  "image": undefined,
                  "buttons": [],
                  "link": d[i].link
                })
              } else {
                botText.push({
                  "text": d[i].message,
                  "image": undefined,
                  "buttons": [],
                  "link": undefined
                })
              }
            }
          } else {
            if (type === undefined) {
              type = 'sent'
            }
            if (type === 'received') {
              tempArray.push({
                sender: this.BOT,
                message: botText
              })
              botText = []
              type = 'sent'
            }
            if (d[i].message !== undefined) {
              botText.push({
                "text": d[i].message,
                "image": undefined,
                "buttons": [],
                "link": undefined
              })
            }
          }
        }
      }
      this.setState({
        responses: tempArray
      })
    })
  }

  /**
   * Get the latest messages and pass to SpeechSynthesisUtterance
   * which will speak the message aloud to the user
   */
  speak = () => {
    const msg = new SpeechSynthesisUtterance()
    const responses = this.state.responses

    for (let i = 0; i < responses[responses.length - 1].message.length; i++) {
      if (responses[responses.length - 1].message[i].text !== undefined) {
        msg.text = responses[responses.length - 1].message[i].text

        window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg.text))
      }
    }
  }

  /**
   * When the user sends a voice message, it is converted to a string
   * and passed to the bot for processing
   *
   * @param voice - the users speech
   */
  handleVoice = (voice) => {
    this.sendMessageToBot(voice.toString())
  }

  /**
   * The user can click the response is incorrect, this will
   * save the responses to be used by the admin user
   *
   * @param botMsg
   * @param userMsg
   */
  addIncorrectMessage = (botMsg, userMsg = "") => {
    if (!window.confirm("Do you give permission for your message to be saved?")) return

    let formData = new FormData()
    formData.append('incorrect', "true")
    formData.append('add', "true")
    formData.append('user_message', userMsg[0].text)
    formData.append('bot_message', botMsg[0].text)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).catch(() => {
      console.log("could not add message")
    })
  }

  /**
   * Sends the message to the bot, checks if the user is logged in
   * and updates the database. If the message cannot be sent show
   * an error notification.
   *
   * @param msg - the message being send to the bot
   */
  sendMessageToBot = (msg) => {
    if (this.state.isSending) return

    // To close the voice modal
    this.closeModal()

    this.setState({
      isSending: true
    })

    if (this.state.loggedIn && this.state.saveMessages) {
      this.addMessageToDatabase(localStorage.getItem("id"), 'sent', msg)
    }

    let tempArray = this.state.responses
    tempArray.push({
      sender: this.USER,
      message: [{"text": msg, "image": undefined, "buttons": [], "link": undefined}],
      buttons: [],
      date: new Date().toString()
    })

    fetch("http://localhost:5005/webhooks/rest/webhook", {
    // fetch("https://alex-rasa-testing.eu.ngrok.io/webhooks/rest/webhook", {
      method: 'POST',
      body: JSON.stringify({
        sender: "alex",
        message: msg.toLowerCase()
      })
    })
      .then(r => {
        return r.json()
      })
      .then(d => {
        this.getMessageFromBot(d)
      })
      .then(() => {
        if (localStorage.getItem("sound") === 'true') {
          this.speak()
        }
        this.setState({
          userInput: "",
          isSending: false
        })
      })
      .catch(() => {
        const message = document.getElementById("success-message")
        const notification = document.getElementById("success-notification")

        message.innerText = "Could Not Send Message"
        notification.classList.add("is-danger")
        notification.classList.remove("is-hidden")

        setTimeout(() => {
          message.innerText = ""
          notification.classList.add("is-hidden")
          notification.classList.remove("is-danger")
        }, 3000)
        this.setState({isSending: false})
      })
  }

  /**
   * If the user is logged in, this saves their messages
   * to be loaded later
   *
   * @param id => users id
   * @param type => 'sent' or 'received'
   * @param msg => the message => do not include buttons
   */
  addMessageToDatabase = (id, type, msg, link) => {

    if (typeof msg == "object") {
      for (let i = 0; i < msg.length; i++) {
        let msgLink = msg[i].link
        if (msgLink === undefined) {
          msgLink = null
        }
        if (msg[i].text !== undefined) {
          this.addMessageToDatabase(id, type, msg[i].text, msgLink)
        }
      }
      return
    }

    let formData = new FormData()
    formData.append('add', true)
    formData.append('id', id)
    formData.append('type', type)
    formData.append('message', msg)
    formData.append('link', link)
    formData.append('date', new Date().toString())

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/messages', {
      method: 'POST',
      body: formData
    }).catch(() => {
      console.log("Could not add message")
    })
  }

  /**
   * Display the signup modal
   */
  displaySignupModal = async () => {
    await this.setState({
      modal: <SignupModal
        closeModal={this.closeModal}
        accountCreated={this.accountCreated}
      />
    })

  }

  /**
   * Display the login modal
   */
  displayLoginModal = async () => {
    await this.setState({
      modal: <LoginModal
        handleLogin={this.handleLogin}
      />
    })
  }

  /**
   * Display the settings modal
   */
  displaySettingsModal = async () => {
    await this.setState({
      modal: <SettingsModal
        closeModal={this.closeModal}
      />
    })
  }

  /**
   * Display the voice modal
   */
  displayVoiceModal = async () => {
    await this.setState({
      modal: <VoiceModal
        closeModal={this.closeModal}
        voiceText={this.state.voiceText}
      />
    })
  }

  /**
   * closes the currently open modal
   */
  closeModal = () => {
    this.setState({modal: <></>})
  }

  /**
   * Log the user out and removes all relevant details.
   * When the user has logged out redirect them, refresh the
   * page.
   */
  handleLogout = async () => {
    await this.setState({
      accessToken: "",
      user_id: null,
      loggedIn: false,
      responses: []
    })

    localStorage.removeItem("token")
    localStorage.removeItem("id")
    localStorage.removeItem("user_type")

    window.location.href = "http://localhost:3000"
  }

  /**
   * When the user logs in, load their messages
   * from the database.
   *
   * @param token - JWT token
   * @param id - the user id
   * @param type - the user type (admin or not)
   */
  handleLogin = async (token, id, type) => {
    await this.setState({
      accessToken: token,
      user_id: parseInt(id),
      user_type: type,
      loggedIn: true,
      responses: []
    })

    await localStorage.setItem("token", token)
    await localStorage.setItem("id", id)
    await localStorage.setItem("user_type", type)

    this.closeModal()
    await this.getMessages()
    await this.sendInitialMessage()
  }

  /**
   * If the user is logged in and is an admin user
   * set the state to true, this gives the user an
   * additional admin button option. And displays
   * the admin page.
   *
   * @param value - boolean true or false
   */
  updateAdmin = async (value) => {
    this.setState({displayAdmin: value})
  }

  render() {
    let responses = ""
    let key = 0

    if (this.state.responses.length > 0) {
      responses = this.state.responses.map((response, i) => {
        key = i
        let buttons = ""

        // displays a list of buttons to the user
        if (response.message.length > 0) {
          response.message.forEach(message => {
            if ((message.buttons !== null) && (message.buttons.length > 0)) {
              buttons = message.buttons.map((button, i) => {
                if (button !== "None") {
                  return (
                    <MessageButton
                      key={i}
                      title={button}
                      sendMessage={() => this.sendMessageToBot(button)}
                    />
                  )
                }
              })
            }
          })
        }

        let message = response.message.map((message, i) => {
          if (message.text !== undefined) {
            message.text = message.text.replaceAll("&#13;", "")
            message.text = message.text.replaceAll("&#10;", "\n")

            if (message.link !== undefined) {
              let text = message.text.split("{?}")
              return (
                <div className="bot-message" key={i}>
                  <p>{text[0]}<a href={message.link}>this link</a>{text[1]}</p>
                </div>
              )
            }

            if (message.my_location !== undefined) {
              return (
                <div key={i}>
                  <div className="bot-message">
                    <p>{message.text}</p>
                  </div>
                  <Map my_location={true} coordinates={message.coordinates} />
                </div>
              )
            }

            if (message.coordinates !== undefined) {
              return (
                <div key={i}>
                  <div className="bot-message">
                    <p>{message.text}</p>
                  </div>
                  <Map my_location={undefined} coordinates={message.coordinates} />
                </div>
              )
            }

            return (
              <div className="bot-message" key={i}>
                <p>{message.text}</p>
              </div>
            )
          } else if (message.image !== undefined) {
            return (
            <img
              className="image"
              src={message.image}
              alt="map"
              style={{
                width: "80%",
                border: "1px solid grey",
                borderRadius: "2.5px",
                marginBottom: "5px"
              }}
            />
            )
          } else if (message.buttons.length > 0) {
            return (
              <div key={i} id="message-buttons-container">
                {buttons}
              </div>
            )
          }
        })

        if (response.sender === this.USER) {
          return (
            <div className="user-message-container" key={i}>
              <div key={i} className="user-message">
                <p>{response.message[0].text}</p>
              </div>
              <img
                src={(localStorage.getItem("theme") === "dark") ?
                  AccountCircleWhite : AccountCircleBlack}
                alt="Account Circle"
                className={`chat-circle  ${localStorage.getItem("theme")}`}
              />
            </div>
          )
        } else {
          return (
            <div key={i}>
              <div className="bot-message-container">

                <div style={{ display:"flex", flexDirection: "column", alignItems: "center" }}>
                  <img
                    src={(localStorage.getItem("theme") === "dark") ?
                        RobotWhite : RobotBlack}
                    alt="Account Circle"
                    className={`chat-circle  ${localStorage.getItem("theme")}`}
                    height="24px"
                    width="24px"
                  />
                  <div id={`menu${i}`} className="dropdown">
                    <div className="dropdown-trigger">
                      <button className="button" aria-haspopup="true" aria-controls="dropdown-menu"
                        style={{padding: "10px"}}
                        onClick={() => {
                          if (document.getElementById(`menu${i}`).classList.contains("is-active")) {
                            document.getElementById(`menu${i}`).classList.remove("is-active")
                          } else {
                            document.getElementById(`menu${i}`).classList.add("is-active")
                          }
                        }}
                        onBlur={() => {
                          document.getElementById(`menu${i}`).classList.remove("is-active")
                        }}
                      >
                        <span className="icon is-small">
                          <img
                            src={MoreBlack}
                            alt="More Icon"
                            height="24px"
                            width="24px"
                          />
                        </span>
                      </button>
                    </div>
                    <div className="dropdown-menu" id="dropdown-menu" role="menu" style={{padding: "2px"}}>
                        <button
                          className="button is-danger"
                          onMouseDown={() => {
                            document.getElementById(`menu${i}`).classList.remove("is-active")
                            if (i > 1) {
                              this.addIncorrectMessage(this.state.responses[i].message, this.state.responses[i - 1].message)
                            } else {
                              alert("Cannot report this message")
                            }
                          }}
                        >This Response is Wrong</button>
                    </div>
                  </div>
                </div>
                <div style={{display: "flex", flexDirection: "column", width: "100%"}}>
                  {message}
                </div>
              </div>
            </div>
          )
        }
      })

      // while the bots message is loading display an is typing message
      if (this.state.responses[this.state.responses.length-1].sender === this.USER) {
        responses.push(
          <div className="bot-message-container" key={key+1}>
            <img
              src={(localStorage.getItem("theme") === "dark") ?
                RobotWhite : RobotBlack}
              alt="Account Circle"
              className={`chat-circle  ${localStorage.getItem("theme")}`}
            />
            <div className="bot-message" style={{minHeight: "30px"}}>
              <p><em>is typing...</em></p>
            </div>
          </div>
        )
      }
    }

    let displayAdmin = (this.state.displayAdmin) ? "admin" : ""

    return (
      <div id="main-root" className={localStorage.getItem("theme") + " " + displayAdmin}>
        <NavBar
          colourTheme={localStorage.getItem("theme")}
          displaySignupModal={this.displaySignupModal}
          displayLoginModal={this.displayLoginModal}
          closeModal={this.closeModal}
          loggedIn={this.state.loggedIn}
          handleLogout={this.handleLogout}
          displaySettingsModal={this.displaySettingsModal}
          userType={localStorage.getItem("user_type")}
          displayAdmin={this.state.displayAdmin}
          updateAdmin={this.updateAdmin}
        />

        <div id="notification" className="notification is-hidden">
          <p id="success-message" />
        </div>

        {(this.state.displayAdmin) ?
          <><Admin closeModal={this.closeModal} /></> :
          <>
            <MessagesHeader
              colourTheme={localStorage.getItem("theme")}
            />

            <Messages
              colourTheme={localStorage.getItem("theme")}
              responses={responses}
            />

            <MessagesFunctions
              colourTheme={localStorage.getItem("theme")}
              handleVoice={this.handleVoice}
              userInput={this.state.userInput}
              handleInput={this.handleUserInputMessage}
              handleKeyPress={this.handleEnterKeyPressed}
              isSending={this.state.isSending}
              handleClick={this.handleClickSendButton}
              displayVoiceModal={this.displayVoiceModal}
              closeModal={this.closeModal}
            />
          </>
        }

        {this.state.modal}

      </div>
    )
  }
}

export default HomePage

