import React from "react"

import NavBar from "../sections/NavBar"
import Messages from "../sections/Messages"
import MessagesFunctions from "../sections/MessagesFunctions"
import SignupModal from "../Modals/SignupModal"
import LoginModal from "../Modals/LoginModal"
import MessagesHeader from "../sections/MessagesHeader"
import SettingsModal from "../Modals/SettingsModal"
import AccountCircleBlack from "../../assets/account_circle_black.svg"
import AccountCircleWhite from "../../assets/account_circle_white.svg"
import RobotBlack from "../../assets/robot_black.svg"
import RobotWhite from "../../assets/robot_white.svg"
import MoreBlack from "../../assets/more_black.svg"
import Admin from "../sections/Admin"
import VoiceModal from "../Modals/VoiceModal"
import Map from "../Widgets/Map"

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
      user_type: (localStorage.getItem("user_type") === null) ? "" : localStorage.getItem("user_type"),
      initialMessageSend: false,
      displayAdmin: false,
      voiceText: ""
    }

    if (localStorage.getItem("theme") === null) {
      localStorage.setItem("theme", "dark")
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleVoice = this.handleVoice.bind(this)
  }

  handleInput = (event) => {
    this.setState({userInput: event.target.value})
  }

  handleKeyPress = (event) => {
    if ((event.key === 'Enter') && (!this.state.isSending)) {
      this.handleClick()
    }
  }

  handleClick = () => {
    if (this.state.userInput.trim() === "") {
      return
    }
    this.setState({isSending: true})
    this.sendMessageToBot(this.state.userInput)
  }

  componentDidMount() {
    if (localStorage.getItem("token") && localStorage.getItem("id") && localStorage.getItem("user_type")) {
      this.handleLogin(localStorage.getItem("token"), localStorage.getItem("id"), localStorage.getItem("user_type"))
        .then(() => {
          this.getMessages()
        }).catch(e => {
          console.log(e)
        })
    } else {
      if (this.state.responses.length === 0) {
        this.sendInitialMessage()
      }
    }
  }

  sendInitialMessage = () => {
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
        let botText = []
        let tempArray = this.state.responses
        let buttons = []

        if (d.length > 0) {
          for (let i = 0; i < d.length; i++) {
            if (d[i].text !== undefined) {
              botText.push({"text": d[i].text, "image": undefined, "buttons": [], "link": undefined})
            }

            try {
              if (d[i].image !== undefined) {
                botText.push({"image": d[i].image, "text": undefined, "buttons": [], "link": undefined})
              }
            } catch (error) {}

            try {
              if (d[i].buttons.length > 0) {
                for (let j = 0; j < d[i].buttons.length; j++) {
                  buttons.push(d[i].buttons[j].title)
                }
                botText.push({"image": d[i].image, "text": undefined, "buttons": buttons, "link": undefined})
              }
            } catch (error) {}

          }
          tempArray.push({
            sender: this.BOT,
            message: botText
          })
        }
        this.setState({
          responses: tempArray
        })

      })
      .then(() => {
        this.setState({isSending: false})

        if (localStorage.getItem("sound") === 'true') {
          this.speak()
        }
      })
      .catch(error => {
        console.log("Error: " + error)
      })
  }

  getMessages = () => {
    let formData = new FormData()
    formData.append('id', this.state.user_id)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/messages', {
      method: 'POST',
      body: formData
    }).then(r => {
      return r.json()
    }).then(r => {
      let arr = []
      for (let i = 0; i < r.length; i++) {
        arr.push({
          sender: (r[i].type === 'sent') ? this.USER : this.BOT,
          message: [{"text": r[i].message, "image": undefined, "buttons": []}],
        })
      }

      this.setState({responses: arr})
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    try {
      if (document.getElementById('messages').lastElementChild != null) {
        document.getElementById('messages').lastElementChild.scrollIntoView()
      }
    } catch (e) {}
  }

  speak = () => {
    let msg = new SpeechSynthesisUtterance()

    for (let i = 0; i < this.state.responses[this.state.responses.length - 1].message.length; i++) {
      if (this.state.responses[this.state.responses.length - 1].message[i].text !== undefined) {
        msg.text = this.state.responses[this.state.responses.length - 1].message[i].text

        window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg.text))
      }
    }
  }

  handleVoice = (voice) => {
    this.sendMessageToBot(voice.toString())
  }

  addIncorrectMessage = (botMsg, userMsg) => {
    let formData = new FormData()
    formData.append('incorrect', "true")
    formData.append('add', "true")
    formData.append('user_message', userMsg)
    formData.append('bot_message', botMsg)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      // console.log("added message")
    }).catch(err => {
      console.log("could not add message")
    })
  }

  addUnknownMessage = (unknownMessage) => {
    let formData = new FormData()
    formData.append('add', "true")
    formData.append('message', unknownMessage)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/admin', {
      method: 'POST',
      body: formData
    }).then(r => {
      // console.log("added message")
    }).catch(err => {
      console.log("could not add message")
    })
  }

  sendMessageToBot = (msg) => {
    if (this.state.isSending) return

    this.closeModal()

    this.setState({
      isSending: true
    })

    if (this.state.loggedIn) {
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
        if (d[0].text === "Sorry, i do not understand...") {
          this.addUnknownMessage(msg)
        }

        let botText = []
        let tempArray = this.state.responses
        let newMap = false

        let buttons = []

        if (d.length > 0) {
          for (let i = 0; i < d.length; i++) {
            if (d[i].text !== undefined) {
              botText.push({"text": d[i].text, "image": undefined, "buttons": [], "link": undefined})
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
                botText.push({"image": d[i].image, "text": undefined, "buttons": [], "link": undefined})
              }
            } catch (error) {}

            try {
              if (d[i].buttons.length > 0) {
                for (let j = 0; j < d[i].buttons.length; j++) {
                  buttons.push(d[i].buttons[j].title)
                }
              botText.push({"image": d[i].image, "text": undefined, "buttons": buttons, "link": undefined})
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

        if (this.state.loggedIn) {
          this.addMessageToDatabase(localStorage.getItem("id"), 'received', botText)
        }

        this.setState({
          responses: tempArray
        })

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
      .catch(error => {
        document.getElementById("success-message").innerText = "Could Not Send Message"
        document.getElementById("notification").classList.add("is-danger")
        document.getElementById("notification").classList.remove("is-hidden")

        setTimeout(() => {
          document.getElementById("success-message").innerText = ""
          document.getElementById("notification").classList.add("is-hidden")
          document.getElementById("notification").classList.remove("is-danger")
        }, 3000)
        this.setState({isSending: false})
      })
  }

  // id => users id
  // type => 'sent' or 'received'
  // msg => the message => do not include buttons
  addMessageToDatabase = (id, type, msg) => {
    if (typeof msg == "object") {
      for (let i = 0; i < msg.length; i++) {
        if (msg[i].text !== undefined) {
          this.addMessageToDatabase(id, type, msg[i].text)
        }
      }
      return
    }

    let formData = new FormData()
    formData.append('add', true)
    formData.append('id', id)
    formData.append('type', type)
    formData.append('message', msg)
    formData.append('date', new Date().toString())

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/messages', {
      method: 'POST',
      body: formData
    }).then(() => {
      // console.log("Message added")
    }).catch(() => {
      console.log("Could not add message")
    })
  }

  handleOptionClick = (option) => {
    this.sendMessageToBot(option)
  }

  displaySignupModal = async () => {
    await this.setState({
      modal: <SignupModal closeModal={this.closeModal} accountCreated={this.accountCreated} />
    })
  }

  displayLoginModal = async () => {
    await this.setState({
      modal: <LoginModal handleLogin={this.handleLogin} />
    })
  }

  displaySettingsModal = async () => {
    await this.setState({
      modal: <SettingsModal closeModal={this.closeModal}
      />
    })
  }

  displayVoiceModal = async () => {
    await this.setState({
      modal: <VoiceModal closeModal={this.closeModal} voiceText={this.state.voiceText}
      />
    })
  }

  updateVoiceModal = async (voiceText) => {
    // console.log(voiceText.toString())
    document.getElementById("voice-modal-text").innerText = voiceText.toString()
  }

  closeModal = () => {
    this.setState({modal: <></>})
  }

  accountCreated = () => {

  }

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

    let msg = document.getElementById("success-message")
    let notification = document.getElementById("notification")

    msg.innerText = "Logged Out"
    notification.classList.add("is-success")
    notification.classList.remove("is-hidden")

    setTimeout(() => {
      msg.innerText = ""
      notification.classList.add("is-hidden")
      notification.classList.remove("is-success")
    }, 3000)

    if (this.state.responses.length === 0) {
      this.sendInitialMessage()
    }
  }

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
    this.getMessages()
  }

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

        if (response.message.length > 0) {
          response.message.forEach(message => {
            if ((message.buttons !== null) && (message.buttons.length > 0)) {
              buttons = message.buttons.map((button, i) => {
                return (
                  <div key={i}>
                    <button
                      className="button"
                      id="buttons"
                      onClick={() => {
                        this.handleOptionClick(button)
                      }}
                      style={{
                        margin: "2.5px",
                        width: "fit-content",
                        whiteSpace: "normal",
                        wordWrap: "break-word"
                      }}
                    >
                      <span>{button}</span>
                    </button>
                    <br/>
                  </div>
                )
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
                            this.addIncorrectMessage(this.state.responses[i].message, this.state.responses[i-1].message)
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
          <><Admin /></> :
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
              handleInput={this.handleInput}
              handleKeyPress={this.handleKeyPress}
              isSending={this.state.isSending}
              handleClick={this.handleClick}
              displayVoiceModal={this.displayVoiceModal}
              closeModal={this.closeModal}
              updateVoiceModal={this.updateVoiceModal}
            />
          </>
        }

        {this.state.modal}

      </div>
    )
  }
}

export default HomePage

