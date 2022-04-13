import React from "react"

/**
 * The Signup class contains the signup form information
 * The Signup class component should be used in the signup model
 *
 * @author - Alex Thompson, W19007452
 */

class Signup extends React.Component {
  render() {
    return (
        <div id="signup">
          <input
              className={`input ${this.props.usernameClass}`}
              type="text"
              placeholder="Username..."
              onChange={event => this.props.handleUsername(event)}
          />
          <br />
          <br />

          <input
              className={`input ${this.props.passwordClass}`}
              type="password"
              placeholder="Password..."
              onChange={event => this.props.handlePassword(event)}
          />
          <br />
          <br />

          <input
              className={`input ${this.props.repeatPasswordClass}`}
              type="password"
              placeholder="Repeat Password..."
              onChange={event => this.props.handleRepeatPassword(event)}
          />
        </div>
    )
  }
}

export default Signup
