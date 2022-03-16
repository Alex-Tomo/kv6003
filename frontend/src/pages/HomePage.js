import React from "react"

import NavBar from "./sections/NavBar"
import Messages from "./sections/Messages"
import MessagesFunctions from "./sections/MessagesFunctions"
import SignupModal from "../components/Modals/SignupModal"
import LoginModal from "../components/Modals/LoginModal"

class HomePage extends React.Component {
  USER = 0
  BOT = 1

  constructor(props) {
    super(props)

    this.state = {
      userInput: "",
      responses: [],
      isSending: false,
      colourTheme: "dark",
      isChecked: (localStorage.getItem("sound") === 'true'),
      modal: <></>,
      loggedIn: false,
      accessToken: "",
      user_id: null
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
    if (localStorage.getItem("token") && localStorage.getItem("id")) {
      this.handleLogin(localStorage.getItem("token"), localStorage.getItem("id"))
        .then(() => {
          this.getMessages()
        }).catch(e => {
          console.log(e)
        })
    }
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
      buttons: []
    })

    fetch("http://localhost:5005/webhooks/rest/webhook", {
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
            buttons: buttons
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
        if (this.state.isChecked) {
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
    }).then(r => {
      console.log("Message added")
    }).catch(e => {
      console.log("Could not add message")
    })
  }

  handleOptionClick = (option) => {
    this.sendMessageToBot(option)
  }

  changeColourTheme = () => {
    // Change to light theme
    if (this.state.colourTheme === "dark") {
      this.setState({colourTheme: "light"})
    // Change to dark theme
    } else {
      this.setState({colourTheme: "dark"})
    }
  }

  handleChange = () => {
    if (this.state.isChecked) {
      localStorage.setItem("sound", false)
    } else {
      localStorage.setItem("sound", true)
    }
    this.setState({ isChecked: !this.state.isChecked })
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

  handleLogout = () => {
    this.setState({
      accessToken: "",
      user_id: null,
      loggedIn: false,
      responses: []
    })
    localStorage.removeItem("token")
    localStorage.removeItem("id")
  }

  handleLogin = async (token, id) => {
    await this.setState({
      accessToken: token,
      user_id: parseInt(id),
      loggedIn: true,
      responses: []
    })
    localStorage.setItem("token", token)
    localStorage.setItem("id", id)
    this.closeModal()
    this.getMessages()
  }

  render() {
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
                    style={{margin: "2.5px", width: "60%"}}
                  >{button}</button>
                  <br />
                </div>
              )
            })
          }
        }

        if (response.sender === this.USER) {
          return (
            <div key={i} className="user-message">
              <p><em>You:</em> {response.message}</p>
            </div>
          )
        } else {
          return (
            <div key={i}>
              <div className="bot-message">
                <p><em>Bot:</em> {response.message}</p>
              </div>
              <div id="buttons-container">
                {buttons}
              </div>
            </div>
          )
        }
      })
    }

    return (
      <div id="root" className={this.state.colourTheme}>
        <NavBar
          colourTheme={this.state.colourTheme}
          changeColourTheme={this.changeColourTheme}
          handleChange={this.handleChange}
          isChecked={this.state.isChecked}
          displaySignupModal={this.displaySignupModal}
          displayLoginModal={this.displayLoginModal}
          closeModal={this.closeModal}
          loggedIn={this.state.loggedIn}
          handleLogout={this.handleLogout}
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

        <Messages
          colourTheme={this.state.colourTheme}
          responses={responses}
        />

        <MessagesFunctions
          colourTheme={this.state.colourTheme}
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

