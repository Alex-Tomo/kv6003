import React from 'react'
import Signup from '../forms/Signup'

/**
 * The SignupModal class contains the modal for the signup form
 * The SignupModal gets the users username and password, checks
 * the details. Then sends the details to the API to be validated
 * and to create the account
 *
 * @author - Alex Thompson, W19007452
 */

class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      usernameClass: '',
      password: '',
      passwordClass: '',
      repeatPassword: '',
      repeatPasswordClass: ''
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
   * Keeps track of what the user has typed in the
   * repeated password input field
   *
   * @param event String - what the user has typed in
   *                       the repeated password input field
   */
  handleRepeatPassword = (event) => {
    this.setState({
      repeatPassword: event.target.value
    })
  }

  /**
   * Checks the input fields contain valid information
   * if not display a relevant error to the user
   *
   * @returns {boolean} - true is there are errors
   */
  checkUserDetails = () => {
    const errorMessage = document.getElementById('error-message')
    errorMessage.innerHTML = ''
    document.getElementById('error-notification')
      .classList.add('is-hidden')

    let usernameError = false
    let passwordError = false
    let repeatPasswordError = false

    if (this.state.username.trim() === '') {
      usernameError = true
      errorMessage.innerHTML += 'Invalid Username<br />'
    }

    if (this.state.password.trim() !== this.state.repeatPassword.trim()) {
      passwordError = true
      repeatPasswordError = true
      errorMessage.innerHTML += 'Passwords do not match<br />'
    }

    if (this.state.password.trim() === '') {
      passwordError = true
      errorMessage.innerHTML += 'Invalid Password<br />'
    }

    this.setState({
      usernameClass: (usernameError) ? 'is-danger' : '',
      passwordClass: (passwordError) ? 'is-danger' : '',
      repeatPasswordClass: (repeatPasswordError) ? 'is-danger' : ''
    })

    if (usernameError || passwordError || repeatPasswordError) {
      document.getElementById('error-notification')
        .classList.remove('is-hidden')
      return true
    }
    return false
  }

  /**
   * Send the users details to the signup API endpoint,
   * if the details are valid create a new user account,
   * otherwise display an error to the user
   */
  handleSignup = () => {
    // checks if the user has entered valid details
    if (this.checkUserDetails()) return

    let formData = new FormData()
    formData.append('username', this.state.username)
    formData.append('password', this.state.password)

    fetch('http://unn-w19007452.newnumyspace.co.uk/kv6003/api/signup', {
      method: 'POST',
      body: formData
    }).then(() => {
      this.props.accountCreated()
      this.props.closeModal()

      const message = document.getElementById('success-message')
      const notification = document.getElementById('notification')

      message.innerText = 'Account Successfully Created'
      notification.classList.add('is-success')
      notification.classList.remove('is-hidden')

      setTimeout(() => {
        message.innerText = ''
        notification.classList.add('is-hidden')
        notification.classList.remove('is-success')
      }, 3000)
    }).catch(() => {
      let message = document.getElementById('error-message')
      let notification = document.getElementById('error-notification')

      message.innerHTML = 'Could not create account'
      notification.classList.remove('is-hidden')
    })
  }

  render() {
    return (
      <div>
        <div className='modal is-active'>
          <div className='modal-background' />
          <div className='modal-card modal-card-width'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>
                Sign Up
              </p>
              <button
                className='delete'
                aria-label='close'
              />
            </header>
            <section className='modal-card-body'>
              <div
                id='error-notification'
                className='notification is-danger is-hidden'
              >
                <p id='error-message'/>
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
            <footer className='modal-card-foot'>
              <button
                className='button is-success'
                onClick={this.handleSignup}
              >
                Create Account
              </button>
              <button className='button cancel'>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>
    )
  }
}

export default SignupModal