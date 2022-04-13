import React from "react"
import Login from "../forms/Login"

/**
 * The LoginModal class contains the modal for the login form
 * The LoginModal gets the users username and password then makes
 * an API call in an attempt to log the user in
 *
 * @author - Alex Thompson, W19007452
 */

class LoginModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: "",
      password: ""
    }
  }

  /**
   * Keeps track of what the user has typed in the
   * username input field
   *
   * @param event String - what the user has typed in
   *                       the username input field
   */
  handleUsername = (event) => {
    this.setState({
      username: event.target.value
    })
  }

  /**
   * Keeps track of what the user has typed in the
   * password input field
   *
   * @param event String - what the user has typed in
   *                       the password input field
   */
  handlePassword = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  /**
   * Checks the input fields contain valid information
   * if not display a relevant error to the user
   *
   * @returns {boolean} - true is there are errors
   */
  checkUserDetails = () => {
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
      return true
    }

    return false
  }

  /**
   * Send the users details to the authentication API endpoint,
   * if the details are valid log the user in, otherwise display
   * an error to the user
   */
  handleLogin = () => {
    // check the input fields contain valid information
    if (this.checkUserDetails()) return

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
    }).catch(() => {
      let errorNotification = document.getElementById("error-notification")
      errorNotification.innerText = "Could Not Log In"
      errorNotification.classList.remove("is-hidden")
    })
  }

  /**
   * if the authentication is successful, run the accept method.
   * displays a success message to the user, closes the modal and
   * saves the users information in localstorage
   *
   * @param results object - the returned object from the
   *                         authentication API endpoint
   */
  accept = (results) => {
    // logs the user in, saves the user details, closes the modal
    this.props.handleLogin(results.token, results.id, results.type)

    let successMessage = document.getElementById("success-message")
    let notification = document.getElementById("notification")

    successMessage.innerText = `Welcome ${this.state.username}!`
    notification.classList.add("is-success")
    notification.classList.remove("is-hidden")

    setTimeout(() => {
      successMessage.innerText = ""
      notification.classList.add("is-hidden")
      notification.classList.remove("is-success")
    }, 3000)
  }

  /**
   * if the authentication is not successful, run the reject method.
   * displays an error message to the user
   */
  reject = () => {
    let notification = document.getElementById("error-notification")

    notification.innerText = "Could Not Log In"
    notification.classList.remove("is-hidden")
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
            <button
              className="button is-success"
              onClick={this.handleLogin}
            >
              Log In
            </button>
            <button className="button cancel">Cancel</button>
          </footer>
        </div>
      </div>
    )
  }
}

export default LoginModal