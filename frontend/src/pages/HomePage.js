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
      isChecked: (localStorage.getItem("sound") === 'true') ? true : false,
      modal: <></>,
      loggedIn: false
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
        console.log(d)
        if (d.length > 0) {
          for (let i = 0; i < d.length; i++) {
            let tempArray = this.state.responses
            let buttons = []

            try {
              if (d[i].buttons.length > 0) {
                for (let j = 0; j < d[i].buttons.length; j++) {
                  buttons.push(d[i].buttons[j].title)
                }
              }
            } catch (error) {}

            tempArray.push({
              sender: this.BOT,
              message: d[i].text,
              buttons: buttons
            })
          }
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
      modal: <SignupModal handleLogin={this.handleLogin} />
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

  handleLogout = () => {
    this.setState({loggedIn: false})
  }

  handleLogin = () => {
    this.setState({loggedIn: true})
    this.closeModal()
  }

  render() {
    let responses = ""
    if (this.state.responses.length > 0) {
      responses = this.state.responses.map((response, i) => {
        console.log(response)
        let buttons = ""
        {
          if ((response.buttons !== null) && (response.buttons.length > 0)) {
            buttons = response.buttons.map((button, i) => {
              return (
                <div key={i}>
                  <button onClick={() => {this.handleOptionClick(button)}}>{button}</button>
                  <br />
                </div>
              )
            })
          }
        }

        if (response.sender === this.USER) {
          return (<div key={i} className="user-message">
            <p><em>You:</em> {response.message}</p>
          </div>)
        } else {
          return (
          <div key={i}>
            <div className="bot-message">
              <p><em>Bot:</em> {response.message}</p>
            </div>
            {buttons}
          </div>)
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

