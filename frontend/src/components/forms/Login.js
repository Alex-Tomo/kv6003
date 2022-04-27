import React from "react"

/**
 * The Login class contains the login form information
 * The Login class component should be used in the login model
 *
 * @author - Alex Thompson, W19007452
 */

class Login extends React.Component {
  render() {
    return (
      <div id="login">
        <input
          className="input form-input"
          type="text"
          placeholder="Username..."
          onChange={event => this.props.handleUsername(event)}
        />
        <input
          className="input form-input"
          type="password"
          placeholder="Password..."
          onChange={event => this.props.handlePassword(event)}
        />
      </div>
    )
  }
}

export default Login
