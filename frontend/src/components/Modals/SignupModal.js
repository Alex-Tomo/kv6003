import React from "react"
import Signup from "../forms/Signup"

class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      usernameClass: "",
      password: "",
      passwordClass: "",
      repeatPassword: "",
      repeatPasswordClass: ""
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
    let errorMessage = document.getElementById("error-message")
    errorMessage.innerHTML = ""
    document.getElementById("error-notification").classList.add("is-hidden")

    let usernameError = false
    let passwordError = false
    let repeatPasswordError = false

    if (this.state.username.trim() === "") {
      usernameError = true
      errorMessage.innerHTML += "Invalid Username<br />"
    }

    if (this.state.password.trim() !== this.state.repeatPassword.trim()) {
      passwordError = true
      repeatPasswordError = true
      errorMessage.innerHTML += "Passwords do not match<br />"
    }

    if (this.state.password.trim() === "") {
      passwordError = true
      errorMessage.innerHTML += "Invalid Password<br />"
    }

    this.setState({
      usernameClass: (usernameError) ? "is-danger" : "",
      passwordClass: (passwordError) ? "is-danger" : "",
      repeatPasswordClass: (repeatPasswordError) ? "is-danger" : ""
    })

    if (usernameError || passwordError || repeatPasswordError) {
      document.getElementById("error-notification").classList.remove("is-hidden")
      return
    }

    let formData = new FormData()
    formData.append('username', this.state.username)
    formData.append('password', this.state.password)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/signup', {
      method: 'POST',
      body: formData
    }).then(() => {
      this.props.accountCreated()
      this.props.closeModal()

      document.getElementById("success-message").innerText = "Account Successfully Created"
      document.getElementById("notification").classList.add("is-success")
      document.getElementById("notification").classList.remove("is-hidden")

      setTimeout(() => {
        document.getElementById("success-message").innerText = ""
        document.getElementById("notification").classList.add("is-hidden")
        document.getElementById("notification").classList.remove("is-success")
      }, 3000)
    }).catch(() => {
      errorMessage.innerHTML = "Could not create account"
      document.getElementById("error-notification").classList.remove("is-hidden")
    })
  }

  render() {
    return (
      <div>
        <div className="modal is-active">
          <div className="modal-background" />
          <div className="modal-card modal-card-width">
            <header className="modal-card-head">
              <p className="modal-card-title">Sign Up</p>
              <button className="delete" aria-label="close" />
            </header>
            <section className="modal-card-body">
              <div id="error-notification" className="notification is-danger is-hidden">
                <p id="error-message"/>
              </div>
              <Signup
                handleUsername={this.handleUsername}
                usernameClass={this.state.usernameClass}
                handlePassword={this.handlePassword}
                passwordClass={this.state.passwordClass}
                handleRepeatPassword={this.handleRepeatPassword}
                repeatPasswordClass={this.state.repeatPasswordClass}
              />
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={this.handleSignup}>Create Account</button>
              <button className="button cancel">Cancel</button>
            </footer>
          </div>
        </div>
      </div>
    )
  }
}

export default SignupModal