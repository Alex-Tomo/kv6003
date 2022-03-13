import React from "react"
import Signup from "../forms/Signup"

class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      password: "",
      repeatPassword: ""
    }
  }

  handleUsername = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  handlePassword = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  handleRepeatPassword = (event) => {
    this.setState({
      repeatPassword: event.target.value
    })
  }

  handleSignup = () => {
    console.log(this.state.username)
    console.log(this.state.password)
    this.props.handleLogin()
  }

  render() {
    return (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Sign Up</p>
              <button className="delete" aria-label="close"></button>
            </header>
            <section className="modal-card-body">
              <Signup
                  handleUsername={this.handleUsername}
                  handlePassword={this.handlePassword}
                  handleRepeatPassword={this.handleRepeatPassword}
              />
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={this.handleSignup}>Create Account</button>
              <button className="button cancel">Cancel</button>
            </footer>
          </div>
        </div>
    )
  }
}

export default SignupModal