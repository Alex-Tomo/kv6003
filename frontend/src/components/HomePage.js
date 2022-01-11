import React from "react"
import Input from "./Input"
import Button from "./Button"
import Login from "./Login"
import axios from "axios"

class HomePage extends React.Component {
    USER = 0
    BOT = 1

    constructor(props) {
        super(props);

        this.state = {
            userInput: "",
            responses: [],
            loggedin: false
        }

        this.handleInput = this.handleInput.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    handleInput = (e) => {
        this.setState({userInput:e.target.value})
    }

    handleKeyPress = (e) => {
        if(e.key === 'Enter') {
            this.handleClick()
        }
    }

    handleClick = () => {
        if(this.state.userInput.trim() === "") {
            return
        }
        let tempArray = this.state.responses
        tempArray.push({
            sender: this.USER,
            message: this.state.userInput
        })

        fetch("http://localhost:5005/webhooks/rest/webhook", {
            method: 'POST',
            body: JSON.stringify({
                sender: "alex",
                message: this.state.userInput
            })
        })
            .then(r => {
                return r.json()
            })
            .then(d => {
                if (d.length > 0) {
                    let tempArray = this.state.responses
                    tempArray.push({
                        sender: this.BOT,
                        message: d[0].text
                    })
                }
                if(d[0].text === "Sorry, i do not understand...") {
                    console.log(this.state.userInput)
                    axios.post("http://localhost:8080", {data: this.state.userInput})
                }
                this.setState({
                    responses: tempArray
                })
            })
            .then(() => {
                this.setState({userInput: ""})
            })
            .catch(e => {
                console.log("Error: " + e)
            })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(document.getElementById('messages').lastElementChild != null) {
            document.getElementById('messages').lastElementChild.scrollIntoView()
        }
    }

    render() {
        let responses = ""
        if(this.state.responses.length > 0) {
            responses = this.state.responses.map((response, i) => {
                if (response.sender === this.USER) {
                    return (<div key={i} className="user-message">
                        <p><em>You:</em> {response.message}</p>
                    </div>)
                } else {
                    return (<div key={i} className="bot-message">
                        <p><em>Bot:</em> {response.message}</p>
                    </div>)
                }
            })
        }

        let page = ""
        if(!this.state.loggedin) {
            page =
                <div id="root">
                    <Login />
                </div>
        } else {
            page =
                <div id="root">
                    <div id="messages">{responses}</div>
                    <div id="message-functionality">
                        <Input value={this.state.userInput} handleInput={this.handleInput} handleKeyPress={this.handleKeyPress} />
                        <Button handleClick={this.handleClick} />
                    </div>
                </div>
        }

        return (
            <div>
               {page}
            </div>
        )
    }
}

export default HomePage
