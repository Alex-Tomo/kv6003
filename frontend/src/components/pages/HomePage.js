import React from "react"

import NavBar from "../sections/NavBar"
import Messages from "../sections/Messages"
import MessagesFunctions from "../sections/MessagesFunctions"
import SignupModal from "../Modals/SignupModal"
import LoginModal from "../Modals/LoginModal"
import MessagesHeader from "../sections/MessagesHeader";
import SettingsModal from "../Modals/SettingsModal";
import AccountCircleBlack from "../../assets/account_circle_black.svg"
import AccountCircleWhite from "../../assets/account_circle_white.svg"

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
      initialMessageSend: false
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
        let botText = ""
        let tempArray = this.state.responses
        let buttons = []

        if (d.length > 0) {
          for (let i = 0; i < d.length; i++) {
            botText += d[i].text + " "

            try {
              if (d[i].buttons.length > 0) {
                for (let j = 0; j < d[i].buttons.length; j++) {
                  buttons.push(d[i].buttons[j].title)
                }
              }
            } catch (error) {}

          }
          tempArray.push({
            sender: this.BOT,
            message: botText,
            buttons: buttons
          })
        }
        this.setState({
          responses: tempArray
        })

      })
      .then(() => {
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
      console.log(r)
      let arr = []
      for (let i = 0; i < r.length; i++) {
        arr.push({
          sender: (r[i].type === 'sent') ? this.USER : this.BOT,
          message: r[i].message,
          buttons: []
        })
      }

      this.setState({responses: arr})
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (document.getElementById('messages').lastElementChild != null) {
      document.getElementById('messages').lastElementChild.scrollIntoView()
    }
  }

  speak = () => {
    let msg = new SpeechSynthesisUtterance()
    msg.text = this.state.responses[this.state.responses.length - 1].message
    window.speechSynthesis.speak(msg)
  }

  handleVoice = (voice) => {
    this.sendMessageToBot(voice.toString())
  }

  sendMessageToBot = (msg) => {
    if (this.state.isSending) return

    this.setState({
      isSending: true
    })

    if (this.state.loggedIn) {
      this.addMessageToDatabase(localStorage.getItem("id"), 'sent', msg)
    }

    let tempArray = this.state.responses
    tempArray.push({
      sender: this.USER,
      message: msg,
      buttons: [],
      date: new Date().toString()
    })

    fetch("http://localhost:5005/webhooks/rest/webhook", {
    // fetch("https://alex-rasa-testing.eu.ngrok.io/webhooks/rest/webhook", {
      method: 'POST',
      body: JSON.stringify({
        sender: "alex",
        message: msg
      })
    })
      .then(r => {
        return r.json()
      })
      .then(d => {
        let botText = ""
        let tempArray = this.state.responses
        let buttons = []

        if (d.length > 0) {
          for (let i = 0; i < d.length; i++) {
            botText += d[i].text + " "

            try {
              if (d[i].buttons.length > 0) {
                for (let j = 0; j < d[i].buttons.length; j++) {
                  buttons.push(d[i].buttons[j].title)
                }
              }
            } catch (error) {}

          }
          tempArray.push({
            sender: this.BOT,
            message: botText,
            buttons: buttons,
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
        console.log("Error: " + error)
        this.setState({isSending: false})
      })
  }

  // id => users id
  // type => 'sent' or 'received'
  // msg => the message => do not include buttons
  addMessageToDatabase = (id, type, msg) => {
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
      console.log("Message added")
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
      modal: <SettingsModal
        closeModal={this.closeModal}
      />
    })
  }

  closeModal = () => {
    this.setState({modal: <></>})
  }

  accountCreated = () => {
    document.getElementById("success-message").innerText = "Account Successfully Created!"
    document.getElementById("success-notification").classList.remove("is-hidden")

    setTimeout(() => {
      document.getElementById("success-message").innerText = ""
      document.getElementById("success-notification").classList.add("is-hidden")
    }, 3000)
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

  render() {
    console.log(this.state.responses)

    let responses = ""

    if (this.state.responses.length > 0) {
      responses = this.state.responses.map((response, i) => {
        let buttons = ""
        {
          if ((response.buttons !== null) && (response.buttons.length > 0)) {
            buttons = response.buttons.map((button, i) => {
              return (
                <div key={i}>
                  <button
                    className="button"
                    id="buttons"
                    onClick={() => {this.handleOptionClick(button)}}
                    style={{margin: "2.5px", width: "60%", whiteSpace: "normal", wordWrap: "break-word"}}
                  >
                    <span>{button}</span>
                  </button>
                  <br />
                </div>
              )
            })
          }
        }

        if (response.sender === this.USER) {
          return (
            <div className="user-message-container" key={i}>
              <div key={i} className="user-message">
                <p><em>You:</em> {response.message}</p>
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
                <img
                  src={(localStorage.getItem("theme") === "dark") ?
                    AccountCircleWhite : AccountCircleBlack}
                  alt="Account Circle"
                  className={`chat-circle  ${localStorage.getItem("theme")}`}
                />
                <div className="bot-message">
                  <p><em>Bot:</em> {response.message}</p>
                </div>
              </div>
              <div id="message-buttons-container">
                {buttons}
              </div>
            </div>
          )
        }
      })
    }

    return (
      <div id="main-root" className={localStorage.getItem("theme")}>
        <NavBar
          colourTheme={localStorage.getItem("theme")}
          displaySignupModal={this.displaySignupModal}
          displayLoginModal={this.displayLoginModal}
          closeModal={this.closeModal}
          loggedIn={this.state.loggedIn}
          handleLogout={this.handleLogout}
          displaySettingsModal={this.displaySettingsModal}
          userType={localStorage.getItem("user_type")}
        />

        <div
          id="success-notification"
          className="notification is-success is-hidden"
          style={{
            position: "absolute",
            top: "75px",
            left: "10%",
            height: "fit-content",
            width: "80%",
            margin: "auto"
        }}>
          <p id="success-message" />
        </div>

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
        />

        {this.state.modal}

      </div>
    )
  }
}

export default HomePage

