import React from "react"
import MyButton from "../components/form/MyButton"
import axios from "axios"
import VoiceButton from "../components/form/VoiceButton";
import {Container, FormControl, InputGroup, Navbar} from "react-bootstrap";

class HomePage extends React.Component {
  USER = 0
  BOT = 1

  constructor(props) {
    super(props);

    this.state = {
      userInput: "",
      responses: [],
      loggedin: false,
      isSending: false,
      colourTheme: "dark"
    }

    this.handleInput = this.handleInput.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleVoice = this.handleVoice.bind(this)
  }

  handleInput = (e) => {
    this.setState({userInput: e.target.value})
  }

  handleKeyPress = (e) => {
    if ((e.key === 'Enter') && (!this.state.isSending)) {
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
            } catch (e) {}

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
        this.speak()
        this.setState({userInput: ""})
        this.setState({isSending: false})
      })
      .catch(e => {
        console.log("Error: " + e)
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
      <div id="root">

        <div id="nav" className={this.state.colourTheme}>
          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand>
                React Bootstrap
              </Navbar.Brand>
              <button onClick={this.changeColourTheme}>{this.state.colourTheme === "dark" ? "Light" : "Dark"}</button>
            </Container>
          </Navbar>
        </div>

        <div id="messages" className={this.state.colourTheme}>{responses}</div>

        <div id="message-functionality" className={this.state.colourTheme}>
          <InputGroup className={"mb-3 "+this.state.colourTheme}>
            <VoiceButton handleVoice={this.handleVoice}/>
            <FormControl
              aria-label="Example text with button addon"
              aria-describedby="basic-addon1"
              value={this.state.userInput}
              onChange={this.handleInput}
              onKeyDown={this.handleKeyPress}
            />
            <MyButton isSending={this.state.isSending} buttonText="Send" handleClick={this.handleClick}/>
          </InputGroup>
        </div>

      </div>
    )
  }
}

export default HomePage

