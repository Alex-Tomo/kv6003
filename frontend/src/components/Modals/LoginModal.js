import React from "react"
import Login from "../forms/Login";

class LoginModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      password: ""
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

  handleLogin = () => {
    let errorMessage = document.getElementById("error-message")
    errorMessage.innerHTML = ""
    document.getElementById("error-notification").classList.add("is-hidden")

    let usernameError = false
    let passwordError = false

    if (this.state.username.trim() === "") {
      usernameError = true
      errorMessage.innerHTML += "Invalid Username<br />"
    }

    if (this.state.password.trim() === "") {
      passwordError = true
      errorMessage.innerHTML += "Invalid Password<br />"
    }

    this.setState({
      usernameClass: (usernameError) ? "is-danger" : "",
      passwordClass: (passwordError) ? "is-danger" : ""
    })

    if (usernameError || passwordError) {
      document.getElementById("error-notification").classList.remove("is-hidden")
      return
    }

    let formData = new FormData()
    formData.append('username', this.state.username)
    formData.append('password', this.state.password)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/authenticate', {
      method: 'POST',
      body: formData
    }).then((response) => {
      if (response.status === 200) {
        return response.json()
      } else {
        this.reject()
      }
    }).then(r => {
      this.accept(r)
    }).catch((error) => {
      document.getElementById("error-notification").innerText = "Could Not Log In"
      document.getElementById("error-notification").classList.remove("is-hidden")
    })
  }

  accept = (results) => {
    this.props.handleLogin(results.token, results.id, results.type)

    document.getElementById("success-message").innerText = `Welcome ${this.state.username}!`
    document.getElementById("notification").classList.add("is-success")
    document.getElementById("notification").classList.remove("is-hidden")

    setTimeout(() => {
      document.getElementById("success-message").innerText = ""
      document.getElementById("notification").classList.add("is-hidden")
      document.getElementById("notification").classList.remove("is-success")
    }, 3000)
  }

  reject = () => {
    document.getElementById("error-notification").innerText = "Could Not Log In"
    document.getElementById("error-notification").classList.remove("is-hidden")
  }

  render() {
    return (
      <div className="modal is-active">
        <div className="modal-background"/>
        <div className="modal-card modal-card-width">
          <header className="modal-card-head">
            <p className="modal-card-title">Log In</p>
            <button className="delete" aria-label="close"/>
          </header>
          <section className="modal-card-body">
            <div id="error-notification" className="notification is-danger is-hidden">
              <p id="error-message"/>
            </div>
            <Login
              handleUsername={this.handleUsername}
              handlePassword={this.handlePassword}
            />
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={this.handleLogin}>Log In</button>
            <button className="button cancel">Cancel</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default LoginModal